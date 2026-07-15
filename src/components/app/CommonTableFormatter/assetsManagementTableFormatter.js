import React from 'react'
import { Tooltip } from 'antd'

const getAssetsColumn = (onAssetDelete, viewImage) => {
  return [
    {
      title: <span className="text-ele">File Name</span>,
      width: '50%',
      key: 'fileName',
      render: row => (
        <div
          style={{ cursor: 'pointer' }}
          onClick={() => viewImage(true, row.s3Key)}
          role="presentation"
        >
          <img
            alt="error"
            style={{ width: 50, height: 50 }}
            src={`${process.env.REACT_APP_CDN_URL}/${row.s3Key}`}
          />
          <span className="ml-2">{row.fileName}</span>
        </div>
      ),
    },
    {
      title: <span className="text-ele">File Size</span>,
      width: '30%',
      key: 'size',
      dataIndex: 'size',
      render: row => <div>{formatBytes(row)}</div>,
    },
    {
      title: <span className="text-ele">Action</span>,
      key: 's3Key',
      render: row => (
        <span>
          <Tooltip placement="bottom" title="Delete asset">
            <a
              href="javascript:void(0)"
              className="btn btn-sm btn-light mr-2 py-0"
              onClick={() => onAssetDelete(row)}
            >
              <i className="fe fe-x-circle align-middle" />
            </a>
          </Tooltip>
        </span>
      ),
      width: '20%',
    },
  ]
}

/* eslint-disable */
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / k ** i).toFixed(dm)) + ' ' + sizes[i]
}

export default getAssetsColumn
