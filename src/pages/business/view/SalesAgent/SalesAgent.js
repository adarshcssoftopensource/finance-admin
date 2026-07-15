/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { Button, Modal, Form, Input, InputNumber, Spin, message, Tooltip, Table } from 'antd'
import { useLocation } from 'react-router-dom'
import { connect } from 'react-redux'
import SalesAgentTable from '.'
import { getProcessingFeeDetails } from 'services/processingFee'
import actions from 'redux/salesAgent/actions'

const mapStateToProps = ({ dispatch, business, saleAgent }) => ({
  dispatch,
  business,
  details: business.details,
  saleAgent,
})

const SalesAgent = ({ business, details, dispatch, saleAgent }) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const [merchant, setMerchant] = useState(null)
  const [editingAgent, setEditingAgent] = useState(null)
  const [assignModalVisible, setAssignModalVisible] = useState(false)
  const [selectedAgentId, setSelectedAgentId] = useState(null)
  const allSalesAgents = saleAgent?.allAgents?.data || []
  const businessId = location.pathname.split('/business/view/')[1]?.split('/')[0]
  const agents = saleAgent?.saleAgent?.data || []
  const [processingFeeList, setProcessingFeeList] = useState([])

  const mappedAgents = agents
    .map(agent => {
      if (!agent) return null
      const merchant = agent.merchants?.find(
        m => String(m.businessId?._id || m.businessId) === String(businessId),
      )

      if (!merchant) return null

      return {
        ...agent,
        splitRate: Number(agent.splitRate ?? 0),
        costs: merchant?.costs || { card: 0, bank: 0, financing: 0, crypto: 0 },
        rates: merchant?.rates || { card: 0, bank: 0, financing: 0, crypto: 0 },
        email: agent.emails?.[0] ?? '-',
      }
    })
    .filter(Boolean)

  useEffect(() => {
    dispatch({
      type: 'business/FETCH_BUSINESS_DETAIL',
      payload: { businessId },
    })
  }, [dispatch, businessId])

  useEffect(() => {
    if (businessId) {
      dispatch({
        type: actions.GET_AGENTS_BY_BUSINESS,
        payload: { businessId },
      })
    }
  }, [dispatch, businessId])

  useEffect(() => {
    if (details?.data?.business?.organizationName) {
      setMerchant({
        name: details.data.business.organizationName,
      })
    }
  }, [details])

  useEffect(() => {
    if (merchant?.name) {
      form.setFieldsValue({ merchant: merchant.name })
    }
  }, [merchant, form])

  useEffect(() => {
    if (assignModalVisible) {
      dispatch({ type: 'salesAgent/GET_ALL_SALES_AGENTS' })
    }
  }, [assignModalVisible, dispatch])

  useEffect(() => {
    const fetchFees = async () => {
      if (!businessId) return
      try {
        const res = await getProcessingFeeDetails(businessId)
        const fees = res?.data?.processingFee ?? []

        const feesMap = {}
        fees.forEach(f => {
          feesMap[f.type] = Math.round(f.fee.dynamic * 100 * 100) / 100
        })

        setProcessingFeeList(feesMap)
      } catch (err) {
        console.error('Failed to fetch processing fees', err)
      }
    }

    fetchFees()
  }, [businessId])

  const handleSubmitAgent = async values => {
    const payload = {
      name: values.name,
      emails: [values.emails],
      splitRate: values.splitRate,
      costs: {
        card: values.cardCost,
        bank: values.bankCost,
        financing: values.financingCost,
        crypto: values.cryptoCost,
      },
      rates: {
        card: values.cardRate,
        bank: values.bankRate,
        financing: values.financingRate,
        crypto: values.cryptoRate,
      },

      businessId,
    }

    if (!editingAgent) {
      payload.password = values.password
    }

    try {
      dispatch({
        type: editingAgent ? actions.UPDATE_SALES_AGENT : actions.CREATE_SALES_AGENT,
        payload: {
          ...(editingAgent ? { agentId: editingAgent._id, data: payload } : payload),
          callback: () => {
            setModalVisible(false)
            setEditingAgent(null)
            form.resetFields()
          },
        },
      })
    } catch (err) {
      message.error(err?.message || 'Failed to save sales agent')
    }
  }

  const handleEditAgent = agent => {
    const merchant = agent.merchants?.find(
      m => String(m.businessId?._id || m.businessId) === String(businessId),
    )

    setEditingAgent(agent)
    setModalVisible(true)

    form.setFieldsValue({
      merchant: merchant?.businessName ?? merchant?.businessId ?? '',
      name: agent.name,
      emails: agent.emails?.[0],
      splitRate: agent.splitRate ?? 0,

      cardCost: merchant?.costs?.card ?? 0,
      bankCost: merchant?.costs?.bank ?? 0,
      financingCost: merchant?.costs?.financing ?? 0,
      cryptoCost: merchant?.costs?.crypto ?? 0,

      cardRate: merchant?.rates?.card ?? 0,
      bankRate: merchant?.rates?.bank ?? 0,
      financingRate: merchant?.rates?.financing ?? 0,
      cryptoRate: merchant?.rates?.crypto ?? 0,
    })
  }

  const handleDeleteAgent = agent => {
    if (!agent._id) {
      console.error('Agent ID missing for delete', agent)
      return
    }

    Modal.confirm({
      title: 'Delete Sales Agent',
      content: 'This action cannot be undone',
      okText: 'Delete',
      okType: 'danger',
      onOk: () => {
        dispatch({
          type: actions.DELETE_SALES_AGENT,
          payload: { agentId: agent._id },
        })
      },
    })
  }

  const handleRemoveMerchant = agent => {
    if (!agent?._id || !businessId) return

    Modal.confirm({
      title: 'Remove Merchant from Agent',
      content: `Are you sure you want to remove this sales agent for this merchant?`,
      okText: 'Remove',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        dispatch({
          type: actions.REMOVE_MERCHANT_FROM_AGENT,
          payload: {
            agentId: agent._id,
            businessId,
          },
        })
      },
    })
  }

  const assignedAgents = agents.filter(agent =>
    agent.merchants?.some(m => m.businessId === businessId || m.businessId?._id === businessId),
  )

  const [payoutModalVisible, setPayoutModalVisible] = useState(false)
  const [payoutHistoryVisible, setPayoutHistoryVisible] = useState(false)
  const [payoutForm] = Form.useForm()

  const handleLogPayout = agent => {
    setEditingAgent(agent)
    setPayoutModalVisible(true)
  }

  const handleViewPayoutHistory = agent => {
    setEditingAgent(agent)
    dispatch({ type: actions.GET_AGENT_PAYOUTS, payload: { agentId: agent._id } })
    setPayoutHistoryVisible(true)
  }

  const handleSubmitPayout = values => {
    dispatch({
      type: actions.LOG_AGENT_PAYOUT,
      payload: {
        agentId: editingAgent._id,
        data: values,
        callback: () => {
          setPayoutModalVisible(false)
          payoutForm.resetFields()
        },
      },
    })
  }

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="d-flex align-items-center mb-3">
          <h3 className="mr-3">Sales Agents</h3>

          {assignedAgents.length === 0 && (
            <>
              <Button type="primary" className="mr-2" onClick={() => setModalVisible(true)}>
                Create Sales Agent
              </Button>

              <Button onClick={() => setAssignModalVisible(true)}>Assign Sales Agent</Button>
            </>
          )}

          {assignedAgents.length >= 1 && (
            <Tooltip title="Only one sales agent is allowed">
              <Button type="primary" disabled>
                Create Sales Agent
              </Button>
            </Tooltip>
          )}
        </div>

        <Modal
          visible={modalVisible}
          title={editingAgent ? 'Edit Sales Agent' : 'Create Sales Agent'}
          onCancel={() => {
            setModalVisible(false)
            setEditingAgent(null)
            form.resetFields()
          }}
          footer={null}
          width={600}
          centered
        >
          {loading ? (
            <div className="text-center">
              <Spin />
            </div>
          ) : (
            <Form form={form} layout="vertical" onFinish={handleSubmitAgent}>
              <Form.Item name="merchant" label="Assign Merchant">
                <Input disabled />
              </Form.Item>

              <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: 'Please enter agent name' }]}
              >
                <Input placeholder="Person or Business" />
              </Form.Item>

              <Form.Item
                name="emails"
                label="Email(s)"
                rules={[
                  { required: true, message: 'Please enter at least one email' },
                  { type: 'email', message: 'Please enter a valid email' },
                ]}
              >
                <Input placeholder="agent@example.com" />
              </Form.Item>

              {!editingAgent && (
                <Form.Item
                  name="password"
                  label="Password"
                  rules={[{ required: true, message: 'Please enter a password' }]}
                >
                  <Input.Password placeholder="Password" />
                </Form.Item>
              )}

              <Form.Item
                name="splitRate"
                label="Split Rate (%)"
                rules={[
                  { required: true, message: 'Please enter split rate' },
                  { type: 'number', min: 0, max: 100, message: 'Must be between 0 and 100' },
                ]}
              >
                <InputNumber placeholder="25%" style={{ width: '100%' }} />
              </Form.Item>

              <div style={{ display: 'flex', gap: '16px' }}>
                <Form.Item
                  name="cardCost"
                  label="Card Cost (%)"
                  initialValue={3}
                  rules={[{ required: true }]}
                  style={{ flex: 1 }}
                >
                  <InputNumber style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                  name="cardRate"
                  label="Card Rate (%)"
                  // initialValue={processingFeeList?.card ?? 0}
                  rules={[{ required: true, message: 'Please enter card rate' }]}
                  style={{ flex: 1 }}
                >
                  <InputNumber min={0} max={100} style={{ width: '100%' }} />
                </Form.Item>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <Form.Item
                  name="bankCost"
                  label="Bank Cost (%)"
                  initialValue={1}
                  rules={[{ required: true }]}
                  style={{ flex: 1 }}
                >
                  <InputNumber style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                  name="bankRate"
                  label="Bank Rate (%)"
                  // initialValue={processingFeeList?.bank ?? 0}
                  rules={[{ required: true, message: 'Please enter bank rate' }]}
                  style={{ flex: 1 }}
                >
                  <InputNumber min={0} max={100} style={{ width: '100%' }} />
                </Form.Item>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <Form.Item
                  name="financingCost"
                  label="Financing Cost (%)"
                  initialValue={6}
                  rules={[{ required: true }]}
                  style={{ flex: 1 }}
                >
                  <InputNumber style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                  name="financingRate"
                  label="Financing Rate (%)"
                  // initialValue={processingFeeList?.bnpl ?? 0}
                  rules={[{ required: true, message: 'Please enter financing rate' }]}
                  style={{ flex: 1 }}
                >
                  <InputNumber min={0} max={100} style={{ width: '100%' }} />
                </Form.Item>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <Form.Item
                  name="cryptoCost"
                  label="Crypto Cost (%)"
                  initialValue={0}
                  rules={[{ required: true }]}
                  style={{ flex: 1 }}
                >
                  <InputNumber style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                  name="cryptoRate"
                  label="Crypto Rate (%)"
                  rules={[{ required: true, message: 'Please enter crypto rate' }]}
                  style={{ flex: 1 }}
                >
                  <InputNumber min={0} max={100} style={{ width: '100%' }} />
                </Form.Item>
              </div>

              <div className="d-flex justify-content-end">
                <Button type="primary" htmlType="submit" loading={loading}>
                  {editingAgent ? 'Update' : 'Save'}
                </Button>
              </div>
            </Form>
          )}
        </Modal>

        <Modal
          visible={assignModalVisible}
          title="Assign Sales Agent"
          onCancel={() => {
            setAssignModalVisible(false)
            setSelectedAgentId(null)
          }}
          onOk={() => {
            if (!selectedAgentId) {
              message.error('Please select a sales agent')
              return
            }

            dispatch({
              type: actions.ASSIGN_SALES_AGENT,
              payload: {
                agentId: selectedAgentId,
                businessId,
              },
            })

            setAssignModalVisible(false)
            setSelectedAgentId(null)
          }}
          okText="Assign"
          centered
        >
          <Form layout="vertical">
            <Form.Item label="Select Sales Agent">
              <select
                className="ant-input"
                value={selectedAgentId || ''}
                onChange={e => setSelectedAgentId(e.target.value)}
              >
                <option value="" disabled>
                  Select agent
                </option>

                {allSalesAgents.map(agent => (
                  <option key={agent._id} value={agent._id}>
                    {agent.name} ({agent.emails?.[0]})
                  </option>
                ))}
              </select>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          visible={payoutModalVisible}
          title={`Log Payout for ${editingAgent?.name}`}
          onCancel={() => setPayoutModalVisible(false)}
          footer={null}
        >
          <Form form={payoutForm} layout="vertical" onFinish={handleSubmitPayout}>
            <Form.Item name="amount" label="Amount" rules={[{ required: true }]}>
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="reference" label="Reference (Receipt #, etc.)">
              <Input />
            </Form.Item>
            <Form.Item name="notes" label="Notes">
              <Input.TextArea />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                Log Payout
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          visible={payoutHistoryVisible}
          title={`Payout History for ${editingAgent?.name}`}
          onCancel={() => setPayoutHistoryVisible(false)}
          width={800}
          footer={null}
        >
          <Table
            dataSource={saleAgent.payoutHistory?.data || []}
            columns={[
              {
                title: 'Date',
                dataIndex: 'payoutDate',
                render: d => new Date(d).toLocaleDateString(),
              },
              { title: 'Amount', dataIndex: 'amount' },
              { title: 'Reference', dataIndex: 'reference' },
              { title: 'Notes', dataIndex: 'notes' },
            ]}
            rowKey="_id"
          />
        </Modal>

        <div>
          <SalesAgentTable
            agent={mappedAgents}
            details={details}
            loading={loading}
            processingFeeList={processingFeeList}
            onEdit={handleEditAgent}
            onDelete={handleDeleteAgent}
            onRemoveMerchant={handleRemoveMerchant}
            onLogPayout={handleLogPayout}
            onViewPayoutHistory={handleViewPayoutHistory}
          />
        </div>
      </div>
    </div>
  )
}

export default connect(mapStateToProps)(SalesAgent)
