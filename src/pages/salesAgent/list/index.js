/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { Button, Modal, Form, Input, InputNumber, Spin, message, Table } from 'antd'
import { connect } from 'react-redux'
import SalesAgentTable from './Table'
import actions from 'redux/salesAgent/actions'

const mapStateToProps = ({ dispatch, saleAgent }) => ({
  dispatch,
  saleAgent,
})

const SalesAgentList = ({ dispatch, saleAgent }) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [editingAgent, setEditingAgent] = useState(null)

  // Payout states
  const [payoutModalVisible, setPayoutModalVisible] = useState(false)
  const [payoutHistoryVisible, setPayoutHistoryVisible] = useState(false)
  const [merchantModalVisible, setMerchantModalVisible] = useState(false)
  const [payoutForm] = Form.useForm()

  const allAgents = saleAgent?.allAgents?.data || []
  const loading = saleAgent?.allAgents?.loading

  useEffect(() => {
    dispatch({ type: actions.GET_ALL_SALES_AGENTS })
  }, [dispatch])

  const handleShowMerchants = agent => {
    setEditingAgent(agent)
    setMerchantModalVisible(true)
  }

  const handleSubmitAgent = async values => {
    const payload = {
      name: values.name,
      emails: [values.emails],
      splitRate: values.splitRate,
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
    setEditingAgent(agent)
    setModalVisible(true)

    form.setFieldsValue({
      name: agent.name,
      emails: agent.emails?.[0],
      splitRate: agent.splitRate ?? 0,
    })
  }

  const handleDeleteAgent = agent => {
    if (!agent._id) return

    dispatch({
      type: actions.DELETE_SALES_AGENT,
      payload: { agentId: agent._id },
    })
    // Refresh list after a short delay or handle via saga success
    setTimeout(() => {
      dispatch({ type: actions.GET_ALL_SALES_AGENTS })
    }, 1000)
  }

  const handleLogPayout = agent => {
    setEditingAgent(agent)
    setPayoutModalVisible(true)
  }

  const handleAssumeAgent = agent => {
    dispatch({
      type: actions.ASSUME_AGENT,
      payload: { agentId: agent._id },
    })
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
          message.success('Payout logged successfully')
        },
      },
    })
  }

  return (
    <div>
      <div className="utils__title">
        <strong className="text-uppercase font-size-24">Sales Agents</strong>
      </div>
      <div className="row">
        <div className="col-lg-12">
          {/* <div className="d-flex align-items-center mb-3">
             <Button type="primary" onClick={() => setModalVisible(true)}>
               Create Sales Agent
             </Button>
          </div> */}

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
            <Form form={form} layout="vertical" onFinish={handleSubmitAgent}>
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

              <div className="d-flex justify-content-end">
                <Button type="primary" htmlType="submit">
                  {editingAgent ? 'Update' : 'Save'}
                </Button>
              </div>
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
              loading={saleAgent.payoutHistory?.loading}
            />
          </Modal>

          <Modal
            visible={merchantModalVisible}
            title={
              <div className="d-flex align-items-center">
                <i className="fe fe-users mr-2 font-size-18 text-primary" />
                <span>
                  Merchants for <strong>{editingAgent?.name}</strong>
                </span>
              </div>
            }
            onCancel={() => setMerchantModalVisible(false)}
            footer={[
              <Button key="close" onClick={() => setMerchantModalVisible(false)}>
                Close
              </Button>,
            ]}
            width={700}
            centered
          >
            <div className="table-responsive">
              <Table
                dataSource={editingAgent?.merchants || []}
                columns={[
                  {
                    title: 'Merchant Name',
                    dataIndex: 'businessId',
                    render: b => (
                      <div className="d-flex align-items-center">
                        <div className="kit__utils__avatar kit__utils__avatar--size27 mr-3">
                          <img src="/resources/images/avatars/avatar-2.png" alt="User" />
                        </div>
                        <div className="font-weight-bold">{b?.organizationName || 'N/A'}</div>
                      </div>
                    ),
                  },
                  {
                    title: 'Business ID',
                    dataIndex: 'businessId',
                    render: b => <span className="text-muted font-size-12">{b?._id || 'N/A'}</span>,
                  },
                ]}
                pagination={{ pageSize: 5, hideOnSinglePage: true }}
                rowKey={record => record._id || record.businessId?._id}
                size="small"
                className="kit__utils__table kit__utils__table--no-border"
              />
            </div>
          </Modal>

          <div className="card">
            <div className="card-body">
              <SalesAgentTable
                agents={allAgents}
                loading={loading}
                onEdit={handleEditAgent}
                onDelete={handleDeleteAgent}
                onLogPayout={handleLogPayout}
                onViewPayoutHistory={handleViewPayoutHistory}
                onShowMerchants={handleShowMerchants}
                onAssume={handleAssumeAgent}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default connect(mapStateToProps)(SalesAgentList)
