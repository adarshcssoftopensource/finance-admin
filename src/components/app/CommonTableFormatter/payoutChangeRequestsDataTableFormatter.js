import React from 'react'
import { Link } from 'react-router-dom'
import { Tooltip } from 'antd'
import CopyToClipboard from 'components/app/copyToClipboard'
import { formateDate } from '../helper'
/* eslint-disable */
const getColumns = (onRequestApprove, onRequestReject) => {
  return [
    {
      title: <span className="text-ele">Payout Request Number</span>,
      width: '20%',
      key: 'payoutRequestNumber',
      ellipsis: {
        showTitle: false,
      },
      render: row => (
        <>
          <span className="d-flex align-items-center">
            <CopyToClipboard
              value={row._id}
              textMessage="Payout change request ID copied to clipboard"
            />
            <span className="pl-1 text-ele">{row.uuid}</span>
          </span>
        </>
      ),
    },
    {
      title: <span className="text-ele">Business name</span>,
      width: '13%',
      dataIndex: '',
      key: 'businessName',
      render: row => (
        <span className="text-ele">
          {row.business && (
            <Link to={`/business/view/${row.business.id}`}>{row.business.organizationName}</Link>
          )}
        </span>
      ),
    },
    {
      title: <span className="text-ele">Status</span>,
      width: '12%',
      dataIndex: '',
      key: 'status',
      render: row => <span className="text-ele">{renderStatus(row.status)}</span>,
    },
    {
      title: <span className="text-ele">Request For</span>,
      width: '12%',
      dataIndex: '',
      key: 'subTotal',
      render: row => (
        <span className="text-ele">
          {row?.payoutRequest?.bankAccountId
            ? 'Plaid Bank Account'
            : row?.payoutRequest?.manualBankAccount
            ? 'Manual Bank Account'
            : ''}
        </span>
      ),
    },
    {
      title: <span className="text-ele">Created At</span>,
      width: '13%',
      dataIndex: '',
      key: 'createdAt',
      render: row => (
        <span className="text-ele">{formateDate(row.createdAt, 'YYYY-MM-DD @ h:mm A')}</span>
      ),
    },
    {
      title: <span className="text-ele">Reject Reason</span>,
      width: '15%',
      dataIndex: '',
      key: 'reason',
      render: row => <span className="text-ele">{row.reason}</span>,
    },
    {
      title: <span className="text-ele">Action</span>,
      key: '_id',
      render: row => (
        <span>
          {row.status === 'pending' && (
            <>
              <Tooltip placement="bottom" title={'Approve payout change request'}>
                <a
                  href="javascript:void(0)"
                  className="btn btn-sm btn-light mr-2 py-0"
                  onClick={() => onRequestApprove(row)}
                >
                  <i className="fe fe-check-circle align-middle" />
                </a>
              </Tooltip>
              <Tooltip placement="bottom" title={'Reject payout change request'}>
                <a
                  href="javascript:void(0)"
                  className="btn btn-sm btn-light mr-2 py-0"
                  onClick={() => onRequestReject(row)}
                >
                  <i className="fe fe-x-circle align-middle" />
                </a>
              </Tooltip>
            </>
          )}
        </span>
      ),
      width: '15%',
    },
  ]
}

const renderStatus = status => {
  let statusObj = {
    class: 'default',
  }
  if (status === 'rejected') {
    statusObj = {
      class: 'danger',
    }
  } else if (status === 'approved') {
    statusObj = {
      class: 'success',
    }
  } else if (status === 'pending') {
    statusObj = {
      class: 'warning',
    }
  }
  return <span className={`font-size-12 badge badge-${statusObj.class}`}>{status}</span>
}

export default getColumns
