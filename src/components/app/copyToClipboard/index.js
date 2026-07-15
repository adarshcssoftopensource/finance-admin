import React from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { message } from 'antd'
import { CopyOutlined } from '@ant-design/icons'

const Index = ({ value, textMessage = 'Copy to clipboard' }) => {
  return (
    <CopyToClipboard text={value} onCopy={() => message.success(textMessage)}>
      <CopyOutlined />
    </CopyToClipboard>
  )
}

export default Index
