import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Modal, Select, Input, Form, message, Tooltip } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import Card from 'components/app/card'
import { formateDate } from 'components/app/helper'
import { updateUserDetails } from 'services/allUsers'
import Title from '../title'
import style from '../style.module.scss'
/* eslint-disable */
const header = ({ data, dispatch }) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  const renderStatus = status => {
    if (status) {
      return <sup className={`text-capitalize badge badge-success font-size-14`}>Active</sup>
    } else {
      return <sup className={`text-capitalize badge badge-danger font-size-14`}>De-active</sup>
    }
  }

  const handleEdit = () => {
    form.setFieldsValue({
      status: data?.identityVerification?.status || 'not_required',
      sessionUrl: data?.identityVerification?.sessionUrl || '',
    })
    setIsModalVisible(true)
  }

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)
      const response = await updateUserDetails(data._id, {
        identityVerification: {
          ...data.identityVerification,
          status: values.status,
          sessionUrl: values.sessionUrl,
        },
      })
      if (!response.error) {
        message.success('User updated successfully')
        setIsModalVisible(false)
        // Refresh data
        dispatch({
          type: 'users/FETCH_USER_USER',
          payload: {
            userId: data._id,
          },
        })
      } else {
        message.error(response.message || 'Failed to update user')
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {data && (
        <Card>
          <Title>
            {data.firstName} {data.lastName} {renderStatus(data.isActive)}
          </Title>
          <ul className={`list-unstyled ${style.list}  pt-3`}>
            <li className={`${style.item} text-muted`}>
              <div className="text-uppercase mb-1">Created Date</div>
              <div className="text-nowrap d-inline-block">
                <span className="font-weight-bold text-dark">{formateDate(data.createdAt)}</span>
              </div>
            </li>
            <li className={`${style.item} text-muted`}>
              <div className="text-uppercase mb-1">Last LogIn</div>
              <div className="text-nowrap d-inline-block">
                <span className="font-weight-bold text-dark">
                  {formateDate(data.lastLoggedInAt, 'YYYY-MM-DD @ h:mm A')}
                </span>
              </div>
            </li>
            <li className={`${style.item} text-muted`}>
              <div className="text-uppercase mb-1">Password Updated</div>
              <div className="text-nowrap d-inline-block">
                <span className="font-weight-bold text-dark">
                  {formateDate(data.passwordUpdatedAt, 'YYYY-MM-DD @ h:mm A')}
                </span>
              </div>
            </li>
            <li className={`${style.item} text-muted pr-2`}>
              <div className="text-uppercase mb-1">
                Identity Verification
                <Tooltip title="Edit Verification">
                  <EditOutlined className="ml-2 cursor-pointer" onClick={handleEdit} />
                </Tooltip>
              </div>

              <div className="text-truncate d-inline-block w-100">
                {(() => {
                  const iv = data?.identityVerification
                  if (!iv) return '-'

                  const { status, sessionId, sessionUrl } = iv

                  if (status === 'not_required') return '-'

                  let icon = ''
                  let badgeClass = ''

                  switch (status) {
                    case 'pending':
                    case 'submitted':
                      icon = 'fa fa-clock-o'
                      badgeClass = 'badge badge-warning'
                      break

                    case 'resubmission_requested':
                      icon = 'fa fa-refresh'
                      badgeClass = 'badge badge-info'
                      break

                    case 'rejected':
                      icon = 'fa fa-times'
                      badgeClass = 'badge badge-danger'
                      break

                    case 'approved':
                      icon = 'fa fa-id-card'
                      badgeClass = 'badge badge-success'
                      break

                    default:
                      return '-'
                  }

                  const content = (
                    <span className={badgeClass}>
                      <i className={`${icon} font-size-16`} aria-hidden="true"></i>
                      <span className="ml-1">{status}</span>
                    </span>
                  )

                  if (!sessionUrl && !sessionId) return content

                  const url = sessionUrl || `https://station.veriff.com/verifications/${sessionId}`

                  return (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="kit__utils__link text-dark"
                    >
                      {content}
                    </a>
                  )
                })()}
              </div>
            </li>
            <li className={`${style.item} text-muted pr-2`}>
              <div className="text-uppercase mb-1">Primary Business</div>
              <div className="text-truncate d-inline-block w-100">
                {data.primaryBusinessDetails && (
                  <a
                    href={`${process.env.REACT_APP_HOME_URL}/#/business/view/${data.primaryBusinessDetails._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-weight-bold kit__utils__link text-dark"
                  >
                    {data && data.primaryBusinessDetails
                      ? data.primaryBusinessDetails.organizationName
                      : ''}
                  </a>
                )}
              </div>
            </li>
            <li className={`${style.item} text-muted pr-2`}>
              <div className="text-uppercase mb-1">Connected Business</div>
              <div className="text-truncate d-inline-block w-100">
                {data.connectedBusiness && (
                  <a
                    href={`${process.env.REACT_APP_HOME_URL}/#/business?userId=${data._id}&userName=${data.firstName}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-weight-bold kit__utils__link text-dark"
                  >
                    {data && data.connectedBusiness ? data.connectedBusiness : ''}
                  </a>
                )}
              </div>
            </li>
          </ul>
        </Card>
      )}
      <Modal
        title="Update Identity Verification"
        visible={isModalVisible}
        onOk={handleUpdate}
        onCancel={() => setIsModalVisible(false)}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="status"
            label="Verification Status"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select>
              <Select.Option value="not_required">Not Required</Select.Option>
              <Select.Option value="required">Required</Select.Option>
              <Select.Option value="pending">Pending</Select.Option>
              <Select.Option value="submitted">Submitted</Select.Option>
              <Select.Option value="resubmission_requested">Resubmission Requested</Select.Option>
              <Select.Option value="rejected">Rejected</Select.Option>
              <Select.Option value="approved">Approved</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="sessionUrl" label="Connected Link (Session URL)">
            <Input placeholder="https://..." />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default connect()(header)
