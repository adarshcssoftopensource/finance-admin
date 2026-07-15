import React from 'react'
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
      title: <span className="text-ele">Transaction Type</span>,
      width: '15%',
      dataIndex: '',
      key: 'transactionType',
      render: row => <span className="text-ele">{renderStatus(row.transactionType)}</span>,
    },
    {
      title: <span className="text-ele">Amount</span>,
      width: '15%',
      dataIndex: '',
      key: 'amount',
      render: row => <span className="text-ele">{getAmountToDisplay(currency, row.amount)}</span>,
    },
    {
      title: <span className="text-ele">Closing Balance</span>,
      width: '15%',
      dataIndex: '',
      key: 'closingBalance',
      render: row => (
        <span className="text-ele">{getAmountToDisplay(currency, row.closingBalance)}</span>
      ),
    },
    {
      title: <span className="text-ele">All TimeLoad</span>,
      width: '15%',
      dataIndex: '',
      key: 'allTimeLoad',
      render: row => (
        <span className="text-ele">{getAmountToDisplay(currency, row.allTimeLoad)}</span>
      ),
    },
    {
      title: <span className="text-ele">Created At</span>,
      width: '15%',
      dataIndex: '',
      key: 'createdAt',
      render: row => (
        <span className="text-ele">{formateDate(row.createdAt, 'YYYY-MM-DD @ h:mm A')}</span>
      ),
    },
  ]
}

const renderStatus = status => {
  let statusObj = {
    class: 'default',
  }
  if (status === 'ISSUING') {
    statusObj = {
      class: 'success',
    }
  } else if (status === 'DECLINED' || status === 'CANCELLED' || status === 'FAILED') {
    statusObj = {
      class: 'danger',
    }
  }
  return <span className={`font-size-12 badge badge-${statusObj.class}`}>{status}</span>
}

export default getColumns
