/* eslint-disable */
import React, { useState, useEffect, useCallback } from 'react'
import { Modal, Input, notification, Spin } from 'antd'
import { userChangePassword } from 'services/allUsers'
import { CopyOutlined } from '@ant-design/icons'
import CopyToClipboard from 'components/app/copyToClipboard'

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
}

const Index = ({ visible, userId, onCancel }) => {
  const [loading, setLoading] = useState(true)
  const [newPassword, setNewPassword] = useState(null)

  useEffect(() => {
    handlePassword()
  }, [userId])

  const handlePassword = useCallback(() => {
    setLoading(true)
    userChangePassword(userId)
      .then(res => {
        setNewPassword(res.data.password)
        setLoading(false)
      })
      .catch(error => {
        notification.error({
          message: 'Try again',
          description: error.message,
        })
        setLoading(false)
      })
  }, [userId])

  const copyPassword = () => {
    return (
      <CopyToClipboard value={newPassword}>
        <CopyOutlined />
      </CopyToClipboard>
    )
  }
  return (
    <Modal
      {...layout}
      visible={visible}
      onCancel={onCancel}
      title="Generate Password"
      footer={null}
    >
      {loading ? (
        <div className="d-flex flex-wrap justify-content-center mt-5">
          <Spin />
        </div>
      ) : (
        <div style={{ marginBottom: 16 }}>
          <Input addonAfter={copyPassword()} value={newPassword} readOnly />
        </div>
      )}
    </Modal>
  )
}

export default Index
