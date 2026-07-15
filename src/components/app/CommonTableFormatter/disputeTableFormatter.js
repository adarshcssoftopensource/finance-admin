import React from 'react'
import { Link } from 'react-router-dom'
import { Tooltip } from 'antd'
import CopyToClipboard from 'components/app/copyToClipboard'
import { formateDate, getAmountToDisplay } from '../helper'
/* eslint-disable */
const getColumns = () => {
  return [
    {
      title: <span className="text-ele">Business name</span>,
      width: '15%',
      dataIndex: '',
      key: 'businessName',
      render: row => (
        <span className="d-flex align-items-center">
          <CopyToClipboard value={row?._id} textMessage="Checkout id copied to clipboard" />
          <span className="text-ele">
            {row.business && (
              <Link to={`/business/view/${row?.business?.id}`}>
                {row?.business?.organizationName}
              </Link>
            )}
          </span>
        </span>
      ),
    },
    {
      title: <span className="text-ele">Amount</span>,
      width: '10%',
      dataIndex: '',
      key: 'subTotal',
      render: row => (
        <span className="text-ele">
          {getAmountToDisplay(row?.business?.currency, row?.disputedAmount)}
        </span>
      ),
    },
    {
      title: <span className="text-ele">Status</span>,
      width: '10%',
      dataIndex: '',
      key: 'status',
      render: row => <span className="text-ele">{renderStatus(row?.status)}</span>,
    },
    {
      title: <span className="text-ele">Created At</span>,
      width: '20%',
      dataIndex: '',
      key: 'createdAt',
      render: row => (
        <span className="text-ele">{formateDate(row.createdAt, 'YYYY-MM-DD @ h:mm A')}</span>
      ),
    },
    {
      title: <span className="text-ele">Action</span>,
      key: '_id',
      render: row => (
        <span>
          <Tooltip placement="bottom" title={'View Dispute'}>
            <Link to={`/disputes/${row?._id}`} className="btn btn-sm btn-light mr-2 py-0">
              <i className="fe fe-eye align-middle" />
            </Link>
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
  if (status === 'resolved') {
    statusObj = {
      class: 'success',
    }
  } else if (status === 'pending') {
    statusObj = {
      class: 'default',
    }
  } else if (status === 'review') {
    statusObj = {
      class: 'warning',
    }
  }
  return <span className={`font-size-12 badge badge-${statusObj.class}`}>{status}</span>
}

export default getColumns
