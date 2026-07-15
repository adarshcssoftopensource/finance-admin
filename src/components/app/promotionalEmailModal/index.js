import React, { useState, useEffect } from 'react'
import { Modal, Form, Input, notification, Select } from 'antd'
import { EditorState, convertToRaw } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import { sendPromotionalEmails } from 'services/business'

const { Option } = Select
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
}

const Index = ({ visible, userDetails, onCancel }) => {
  const [loading, setLoading] = useState(false)
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty())
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({ email: [userDetails.primaryEmail] })
  }, [])
  const onSubmit = () => {
    form
      .validateFields()
      .then(values => {
        setLoading(true)
        sendPromotionalEmails({
          ...values,
          emailBody: draftToHtml(convertToRaw(editorState.getCurrentContent())),
        })
          .then(res => {
            notification.success({
              message: 'Success',
              description: res.data,
            })
            setLoading(false)
            form.resetFields()
            onCancel()
          })
          .catch(error => {
            notification.error({
              message: 'Try again',
              description: error.message,
            })
            setLoading(false)
          })
      })
      .catch(info => {
        setLoading(false)
        console.log('Validate Failed:', info)
      })
  }
  const onEditorStateChange = data => {
    setEditorState(data)
  }

  return (
    <Modal
      {...layout}
      visible={visible}
      title="Send Promotional Email"
      okText="Send"
      cancelText="Cancel"
      onCancel={onCancel}
      confirmLoading={loading}
      onOk={() => onSubmit()}
    >
      <Form form={form} name="control-hooks" layout="vertical">
        <Form.Item
          name="email"
          label="To"
          rules={[
            {
              required: true,
              message: 'This field is required',
            },
          ]}
        >
          <Select mode="tags" placeholder="Select Email" showSearch allowClear>
            {userDetails?.emails &&
              userDetails?.emails?.length > 0 &&
              userDetails.emails.map(email => <Option value={email}>{email}</Option>)}
          </Select>
        </Form.Item>
        <Form.Item
          name="emailTitle"
          label="Subject"
          rules={[
            {
              required: true,
              message: 'This field is required',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="emailBody" label="Description">
          <Editor
            editorState={editorState}
            onEditorStateChange={onEditorStateChange}
            editorClassName="px-3 border border-gray-1"
            editorStyle={{
              height: 200,
              overflow: 'auto',
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default Index
