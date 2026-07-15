import React from 'react'
import { Tooltip } from 'antd'
import { Link } from 'react-router-dom'
import { getAmountToDisplay, renderPaymentMethod, formateDate } from 'components/app/helper'
import { providerIcons } from './businessTableFormatter'
/* eslint-disable */
const getColumns = () => {
  return [
    {
      title: <span className="text-ele">Status</span>,
      width: '10%',
      dataIndex: '',
      key: 'uuid',
      render: row => <span className="text-ele">{renderStatus(row.status)}</span>,
    },
    {
      title: <span className="text-ele">Provider</span>,
      width: '10%',
      dataIndex: '',
      key: 'uuid',
      render: row => (
        <span className="text-ele">
          {row?.providerName ? (
            <Tooltip placement="bottom" title={row?.providerName}>
              &nbsp;{providerIcons(row?.providerName)}
            </Tooltip>
          ) : null}
        </span>
      ),
    },
    {
      title: <span className="text-ele">Refunded to</span>,
      width: '15%',
      dataIndex: '',
      key: 'method',
      render: row => <span className="text-ele">{renderPaymentMethod(row)}</span>,
    },
    {
      title: <span className="text-ele">Date</span>,
      width: '15%',
      dataIndex: '',
      key: 'paymentDate',
      render: row => (
        <span className="text-ele">
          {row.method === 'manual' ? (
            <span>{formateDate(row.refundDate, 'MMM D, YYYY')}</span>
          ) : (
            <span>{formateDate(row.refundDate, 'MMM D, YYYY @ h:mm A')}</span>
          )}
        </span>
      ),
    },
    {
      title: <span className="text-ele">Customer</span>,
      width: '20%',
      dataIndex: 'customer',
      key: 'customer.firstName',
      render: customer => (
        <span className="text-ele">
          {customer.firstName} {customer.lastName}
        </span>
      ),
    },
    {
      title: <span className="text-ele">Type</span>,
      width: '10%',
      dataIndex: '',
      key: 'paymentType',
      render: row =>
        row.paymentType === 'Peyme' ? (
          <span className="text-ele">Finance.Me Lynk</span>
        ) : (
          <span className="text-ele">{row.paymentType}</span>
        ),
    },
    {
      title: <span className="text-ele">Amount</span>,
      width: '10%',
      key: 'amount',
      dataIndex: '',
      render: row => (
        <span className="text-success font-weight-bold font-size-14">
          {getAmountToDisplay(row.currency, row.amount)}
        </span>
      ),
    },
    {
      title: <span className="text-ele">Action</span>,
      width: '10%',
      key: 'x',
      render: row => (
        <span>
          <Tooltip placement="bottom" title={'View Details'}>
            <Link to={`/refunds/${row.id || row._id}`} className="btn btn-sm btn-light mr-2 py-0">
              <i className="fe fe-eye align-middle" />
            </Link>
          </Tooltip>
        </span>
      ),
    },
  ]
}

const renderStatus = status => {
  let statusObj = {
    class: 'default',
  }
  if (status === 'SUCCESS') {
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
