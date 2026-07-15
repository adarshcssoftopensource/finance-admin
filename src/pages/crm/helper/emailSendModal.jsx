/*eslint-disable*/
import { Button, Input, Modal } from 'antd'
import React, { useState } from 'react'
import 'react-quill/dist/quill.snow.css'
import '../../banner/bannerStyle.scss'

const { TextArea } = Input

function EmailSendModal({ isOpen = false, isInProgress, closeModel, onSubmit }) {
  const [message, setMessage] = useState('')

  return (
    <div>
      <Modal
        title={`Send Message`}
        visible={isOpen}
        onOk={() => {
          onSubmit(message)
          setMessage('')
        }}
        onCancel={() => {
          closeModel(false)
        }}
        okButtonProps={{ disabled: isInProgress || !message?.trim() }}
        cancelButtonProps={{ disabled: isInProgress }}
        width={700}
        okText="Send"
        cancelText="Cancel"
      >
        <div className="py-2">
          <p>Placeholder</p>
          <Button
            type="primary"
            style={{ marginLeft: 'auto', marginBottom: '10px' }}
            className={'mr-4'}
            onClick={() => {
              setMessage(message + '{{name}}')
            }}
          >
            First Name
          </Button>
          <Button
            type="primary"
            style={{ marginLeft: 'auto', marginBottom: '10px' }}
            className={'mr-4'}
            onClick={() => {
              setMessage(message + '{{email}}')
            }}
          >
            Email
          </Button>
          <Button
            type="primary"
            style={{ marginLeft: 'auto', marginBottom: '10px' }}
            className={'mr-4'}
            onClick={() => {
              setMessage(message + '{{phone}}')
            }}
          >
            Phone
          </Button>

          <p>Message Body</p>
          <TextArea
            value={message}
            type={'text'}
            rows={4}
            onChange={e => {
              setMessage(e?.target?.value ?? '')
            }}
          />
        </div>
      </Modal>
    </div>
  )
}

export default EmailSendModal
