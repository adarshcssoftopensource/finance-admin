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
            {row?.business && (
              <Link to={`/business/view/${row?.business?._id}`}>
                {row?.business?.organizationName}
              </Link>
            )}
          </span>
        </span>
      ),
    },
    {
      title: <span className="text-ele">Status</span>,
      width: '10%',
      dataIndex: '',
      key: 'status',
      render: row => <span className="text-ele">{renderStatus(row.status)}</span>,
    },
    {
      title: <span className="text-ele">Title</span>,
      width: '15%',
      dataIndex: '',
      key: 'customerName',
      render: row => <span className="text-ele">{row?.itemName}</span>,
    },
    {
      title: <span className="text-ele">Checkout Uuid</span>,
      width: '20%',
      dataIndex: '',
      key: 'publicUrl',
      render: row => <span className="text-ele">{row.uuid}</span>,
    },
    {
      title: <span className="text-ele">Amount</span>,
      width: '10%',
      dataIndex: '',
      key: 'subTotal',
      render: row => (
        <span className="text-ele">{getAmountToDisplay(row.currency, row?.price)}</span>
      ),
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
          <Tooltip placement="bottom" title={'View Public Checkout'}>
            <a
              href={`${process.env.REACT_APP_PUBLIC_URL}/checkout/${row.uuid}`}
              className="btn btn-sm btn-light mr-2 py-0"
              target="_balnk"
            >
              <i className="fe fe-arrow-up-right align-middle" />
            </a>
          </Tooltip>
          <Tooltip placement="bottom" title={'View Checkout Details'}>
            <Link
              to={`/checkouts/${row._id}/${row?.business?._id}`}
              className="btn btn-sm btn-light mr-2 py-0"
            >
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
  if (status === 'Online') {
    statusObj = {
      class: 'success',
    }
  } else if (status === 'Offline') {
    statusObj = {
      class: 'default',
    }
  }
  if (status === 'Draft') {
    statusObj = {
      class: 'light',
    }
  }
  if (status === 'Archived') {
    statusObj = {
      class: 'warning',
    }
  } else if (status === 'Deleted') {
    statusObj = {
      class: 'danger',
    }
  }
  return <span className={`font-size-12 badge badge-${statusObj.class}`}>{status}</span>
}

export default getColumns
