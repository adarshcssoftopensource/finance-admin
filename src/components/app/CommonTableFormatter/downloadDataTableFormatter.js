import React from 'react'
import CopyToClipboard from 'components/app/copyToClipboard'
import { Tooltip } from 'antd'
/* eslint-disable */
const getColumns = deleteDownloadData => {
  return [
    {
      title: <span className="text-ele">id</span>,
      width: '5%',
      dataIndex: '',
      key: '_id',
      render: row => (
        <span className="d-flex align-items-center">
          <CopyToClipboard value={row?._id} textMessage="Checkout id copied to clipboard" />
        </span>
      ),
    },
    {
      title: <span className="text-ele">Remarks</span>,
      width: '15%',
      dataIndex: '',
      key: 'remarks',
      render: row => <span className="text-ele">{row?.remarks}</span>,
    },
    {
      title: <span className="text-ele">Status</span>,
      width: '15%',
      dataIndex: '',
      key: 'status',
      render: row => <span className="text-ele">{renderStatus(row.status)}</span>,
    },
    {
      title: <span className="text-ele">Business</span>,
      width: '15%',
      dataIndex: '',
      key: 'businessId',
      render: row => <span className="text-ele">{row.businessId}</span>,
    },
    {
      title: <span className="text-ele">Export</span>,
      width: '10%',
      dataIndex: '',
      key: 'export',
      render: row => <span className="text-ele">{row?.export}</span>,
    },
    {
      title: <span className="text-ele">Requested By</span>,
      width: '15%',
      dataIndex: '',
      key: 'requestedBy',
      render: row => <span className="text-ele">{row?.requestedBy}</span>,
    },
    {
      title: <span className="text-ele">Expiry Year</span>,
      key: 'expiryYear',
      render: row => <span className="text-ele">{row?.expiryYear}</span>,
      width: '10%',
    },
    {
      title: <span className="text-ele">s3Url</span>,
      key: 's3Url',
      render: row => (
        <span className="text-ele">
          <a href={row?.s3Url} target={'_blank'}>
            {row?.s3Url}
          </a>
        </span>
      ),
      width: '25%',
    },
    {
      title: <span className="text-ele">Action</span>,
      key: 'action',
      render: row => (
        <span>
          <Tooltip placement="bottom" title={'Delete download data'}>
            <a
              href="javascript:void(0);"
              onClick={() => deleteDownloadData(row)}
              className="btn btn-sm btn-light mr-2 py-0"
            >
              <i className="fe fe-trash align-middle" />
            </a>
          </Tooltip>
        </span>
      ),
      width: '10%',
    },
  ]
}

const renderStatus = status => {
  let statusObj = {
    class: 'default',
  }
  if (status === 'completed') {
    statusObj = {
      class: 'success',
    }
  } else if (status === 'Offline') {
    statusObj = {
      class: 'default',
    }
  }
  if (status === 'progress') {
    statusObj = {
      class: 'light',
    }
  }
  if (status === 'Archived') {
    statusObj = {
      class: 'warning',
    }
  } else if (status === 'error') {
    statusObj = {
      class: 'danger',
    }
  }
  return <span className={`font-size-12 badge badge-${statusObj.class}`}>{status}</span>
}

export default getColumns
