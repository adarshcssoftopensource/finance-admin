import React, { useState } from 'react'
import { DownloadOutlined } from '@ant-design/icons'
import { Button, Tooltip, Modal } from 'antd'
import { exportPdf } from 'services/exportPdf'

const { confirm } = Modal

function Index({ type, varient, qryString }) {
  const [loading, setLoading] = useState(false)
  const exportInExcel = async () => {
    let link
    setLoading(true)
    const response = await exportPdf(type, qryString)
    setLoading(false)
    if (response?.status === 200 || response?.data) {
      if (response?.data && type !== 'businesses') {
        const blob = new Blob([response?.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        })
        link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = `${type}.xlsx`
        link.click()
      } else {
        confirm({
          title: `Businesses export request in progress, please visit download section to download file`,
          content: '',
          okText: 'Go to download',
          cancelText: 'Close',
          onOk() {
            window.open('#/downloads')
          },
          onCancel() {},
        })
      }
    }
  }
  return (
    <Tooltip placement="bottom" title={`Export ${type}`}>
      <Button
        loading={loading}
        type="primary"
        icon={<DownloadOutlined />}
        onClick={exportInExcel}
        size={varient}
      />
    </Tooltip>
  )
}

export default Index
