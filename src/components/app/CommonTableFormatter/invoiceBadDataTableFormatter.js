import React from 'react'
import { Link } from 'react-router-dom'
import { Tooltip } from 'antd'
import CopyToClipboard from 'components/app/copyToClipboard'
import { formateDate, getAmountToDisplay } from '../helper'
/* eslint-disable */
const getColumns = () => {
  const currency = {
    code: 'USD',
    displayName: 'USD ($) U.S. dollar',
    name: 'U.S. dollar',
    symbol: '$',
  }
  return [
    {
      title: <span className="text-ele">Invoice Number</span>,
      width: '9%',
      key: 'invoiceNumber',
      ellipsis: {
        showTitle: false,
      },
      render: row => (
        <>
          <span className="d-flex align-items-center">
            <CopyToClipboard value={row._id} textMessage="Invoice Id copied to clipboard" />
            <span className="pl-1 text-ele">{row.invoiceNumber}</span>
          </span>
        </>
      ),
    },
    {
      title: <span className="text-ele">Business name</span>,
      width: '9%',
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
      width: '9%',
      dataIndex: '',
      key: 'status',
      render: row => <span className="text-ele">{renderStatus(row.status)}</span>,
    },
    {
      title: <span className="text-ele">Customer name</span>,
      width: '9%',
      dataIndex: '',
      key: 'customerName',
      render: row => <span className="text-ele">{row?.customer?.customerName}</span>,
    },
    {
      title: <span className="text-ele">Sub Total Amount</span>,
      width: '9%',
      dataIndex: '',
      key: 'subTotal',
      render: row => (
        <span className="text-ele">
          {getAmountToDisplay(row.currency, row?.amountBreakup?.subTotal)}
        </span>
      ),
    },
    {
      title: <span className="text-ele">Total Amount</span>,
      width: '9%',
      dataIndex: '',
      key: 'totalAmount',
      render: row => (
        <span className="text-ele">{getAmountToDisplay(row.currency, row.totalAmount)}</span>
      ),
    },
    {
      title: <span className="text-ele">Paid Amount</span>,
      width: '9%',
      dataIndex: '',
      key: 'paidAmount',
      render: row => (
        <span className="text-ele">{getAmountToDisplay(row.currency, row.paidAmount)}</span>
      ),
    },
    {
      title: <span className="text-ele">Due Amount</span>,
      width: '9%',
      dataIndex: '',
      key: 'dueAmount',
      render: row => (
        <span className="text-ele">{getAmountToDisplay(row.currency, row.dueAmount)}</span>
      ),
    },
    {
      title: <span className="text-ele">Invoice Date</span>,
      width: '9%',
      dataIndex: '',
      key: 'invoiceDate',
      render: row => <span className="text-ele">{formateDate(row.invoiceDate, 'YYYY-MM-DD')}</span>,
    },
    {
      title: <span className="text-ele">Created At</span>,
      width: '9%',
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
          <Tooltip placement="bottom" title={'View Public Invoice'}>
            <a
              href={`${process.env.REACT_APP_PUBLIC_URL}/invoice/${row.uuid}?isAdmin=${true}`}
              className="btn btn-sm btn-light mr-2 py-0"
              target="_balnk"
            >
              <i className="fe fe-arrow-up-right align-middle" />
            </a>
          </Tooltip>
          <Tooltip placement="bottom" title={'View Invoice Details'}>
            <Link
              to={`/invoices/${row._id}/${row?.business?.id}`}
              className="btn btn-sm btn-light mr-2 py-0"
            >
              <i className="fe fe-eye align-middle" />
            </Link>
          </Tooltip>
        </span>
      ),
      width: '9%',
    },
  ]
}

const renderStatus = status => {
  let statusObj = {
    class: 'default',
  }
  if (status === 'overdue') {
    statusObj = {
      class: 'danger',
    }
  } else if (status === 'saved') {
    statusObj = {
      class: 'default',
    }
  } else if (status === 'draft') {
    statusObj = {
      class: 'light',
    }
  } else if (status === 'paid') {
    statusObj = {
      class: 'success',
    }
  } else if (status === 'partial') {
    statusObj = {
      class: 'alert',
    }
  } else if (status === 'sent') {
    statusObj = {
      class: 'info',
    }
  } else if (status === 'viewed') {
    statusObj = {
      class: 'warning',
    }
  }
  return <span className={`font-size-12 badge badge-${statusObj.class}`}>{status}</span>
}

export default getColumns
