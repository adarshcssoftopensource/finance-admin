/* eslint-disable */
import React, { useEffect } from 'react'
import { Modal, Form, Input, Select, Button } from 'antd'

const { Option } = Select

const AddUserModal = ({ visible, onCancel, onAdd, loading, roles = [] }) => {
  const [form] = Form.useForm()

  useEffect(() => {
    if (!visible) {
      form.resetFields()
    }
  }, [visible, form])

  const onFinish = values => {
    onAdd(values)
  }

  return (
    <Modal
      title="Add User to Business"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="add" type="primary" loading={loading} onClick={() => form.submit()}>
          Add User
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter email' },
            { type: 'email', message: 'Please enter a valid email' },
          ]}
        >
          <Input placeholder="Enter user email" />
        </Form.Item>
        <Form.Item
          name="firstName"
          label="First Name"
          rules={[{ required: true, message: 'Please enter first name' }]}
        >
          <Input placeholder="Enter first name" />
        </Form.Item>
        <Form.Item
          name="lastName"
          label="Last Name"
          rules={[{ required: true, message: 'Please enter last name' }]}
        >
          <Input placeholder="Enter last name" />
        </Form.Item>
        <Form.Item
          name="roleId"
          label="Role"
          rules={[{ required: true, message: 'Please select a role' }]}
        >
          <Select placeholder="Select role">
            {roles.map(role => (
              <Option key={role._id} value={role._id}>
                {role.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: 'Please enter password' },
            { min: 6, message: 'Password must be at least 6 characters' },
          ]}
        >
          <Input.Password placeholder="Enter password" />
        </Form.Item>
        <Form.Item name="position" label="Position">
          <Input placeholder="Enter position (optional)" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddUserModal
