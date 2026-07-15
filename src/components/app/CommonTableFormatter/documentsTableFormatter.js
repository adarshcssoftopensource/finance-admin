import React from 'react'
import { Tooltip } from 'antd'
import moment from 'moment'
import { BusinessName } from 'components/app/helper'
import CopyToClipboard from 'components/app/copyToClipboard'

/* eslint-disable */
const getColumns = confirmSubmittedDocument => {
  return [
    {
      title: <span className="text-ele">Business Name</span>,
      width: '10%',
      dataIndex: '',
      key: 'business',
      render: row => (
        <span className="text-ele">
          <CopyToClipboard value={row?.business?.id || ''} />
          <BusinessName id={row?.business?.id} name={row?.business?.organizationName} />
        </span>
      ),
    },
    {
      title: <span className="text-ele">Document Name</span>,
      width: '15%',
      dataIndex: '',
      key: 'documentName',
      render: row => (
        <span className="text-ele text-capitalize">
          {(row?.documentName || '').replaceAll('_', ' ') || '—'}
        </span>
      ),
    },
    {
      title: <span className="text-ele">Requested Date</span>,
      width: '5%',
      dataIndex: '',
      key: 'createdAt',
      render: row => (
        <span className="text-ele">{moment(row.createdAt).format('MMM DD, YYYY')}</span>
      ),
    },
    {
      title: <span className="text-ele">Submitted Date</span>,
      width: '5%',
      dataIndex: '',
      key: 'sortname',
      render: row => (
        <span className="text-ele">{moment(row.submittedAt).format('MMM DD, YYYY')}</span>
      ),
    },
    {
      title: <span className="text-ele">Message</span>,
      width: '10%',
      dataIndex: '',
      key: 'message',
      render: row => <span className="text-ele text-capitalize">{row.message || ''}</span>,
    },
    {
      title: <span className="text-ele">Provider Name</span>,
      width: '10%',
      dataIndex: '',
      key: 'status',
      render: row => (
        <span className="text-ele text-capitalize">{renderStatus(row.providerName)}</span>
      ),
    },
    {
      title: <span className="text-ele">Status</span>,
      width: '10%',
      dataIndex: '',
      key: 'status',
      render: row => <span className="text-ele text-capitalize">{renderStatus(row.status)}</span>,
    },
    {
      title: 'View',
      key: 'view',
      render: row => (
        <>
          {(row?.documentIds || [])?.map((document, index) => {
            return (
              <span>
                <Tooltip placement="bottom" title={'View Document'}>
                  <a href={document?.fileUrl} className="mr-2 py-0 text-capitalize" target="_blank">
                    <i className="fe fe-eye align-middle" />
                  </a>
                </Tooltip>
              </span>
            )
          })}
        </>
      ),
      width: '5%',
    },
    {
      title: <span className="text-ele">Action</span>,
      key: '_id',
      width: '10%',
      render: row => (
        <span>
          {row.status === 'pending' && row?.providerName === 'Finance' && (
            <>
              <Tooltip placement="bottom" title={'Approve'}>
                <a
                  href="javascript:void(0)"
                  className="btn btn-sm btn-light mr-2 py-0"
                  onClick={() => confirmSubmittedDocument(row?._id, 'verified')}
                >
                  <i className="fe fe-check-circle align-middle" />
                </a>
              </Tooltip>
              <Tooltip placement="bottom" title={'Reject'}>
                <a
                  href="javascript:void(0)"
                  className="btn btn-sm btn-light mr-2 py-0"
                  onClick={() => confirmSubmittedDocument(row?._id, 'rejected')}
                >
                  <i className="fe fe-x-circle align-middle" />
                </a>
              </Tooltip>
            </>
          )}
          {row.status === 'submitted' ? (
            <Tooltip placement="bottom" title={'Delete Document'}>
              <a
                href="javascript:void(0)"
                className="btn btn-sm btn-light mr-2 py-0"
                onClick={() => confirmSubmittedDocument(row?._id, 'deleted')}
              >
                <i className="fe fe-trash align-middle" />
              </a>
            </Tooltip>
          ) : null}
        </span>
      ),
    },
  ]
}

const renderStatus = status => {
  let statusObj = {
    class: 'default',
  }
  if (status === 'verified') {
    statusObj = {
      class: 'success',
    }
  } else if (status === 'pending') {
    statusObj = {
      class: 'warning',
    }
  } else if (status === 'review') {
    statusObj = {
      class: 'info',
    }
  } else if (status === 'rejected') {
    statusObj = {
      class: 'danger',
    }
  }
  return <span className={`font-size-12 badge badge-${statusObj.class}`}>{status}</span>
}

export default getColumns
