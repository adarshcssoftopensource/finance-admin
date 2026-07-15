import React, { useEffect } from 'react'
import { Modal, Form, Input } from 'antd'

const Index = ({ visible, onCreate, onCancel, data }) => {
  const [form] = Form.useForm()

  useEffect(() => {
    if (data) {
      form.setFieldsValue({ title: data.data.title, info: data.data.info })
    } else {
      form.setFieldsValue({ title: null, info: null })
    }
  }, [data])
  return (
    <Modal
      visible={visible}
      title={`${data ? 'Edit' : 'Add'} Feature`}
      okText="Submit"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then(values => {
            form.resetFields()
            onCreate(values)
          })
          .catch(info => {
            console.log('Validate Failed:', info)
          })
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{
          modifier: 'public',
        }}
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[
            {
              required: true,
              message: 'This field is required',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="info" label="Info">
          <Input.TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default Index
