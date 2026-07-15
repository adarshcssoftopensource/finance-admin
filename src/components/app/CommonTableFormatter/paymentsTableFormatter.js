import React from 'react'
import { Tooltip } from 'antd'
import { Link } from 'react-router-dom'
import { getAmountToDisplay, renderPaymentMethod, formateDate } from 'components/app/helper'
import { providerIcons } from './businessTableFormatter'
/* eslint-disable */
const getColumns = () => [
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
    title: <span className="text-ele">Method</span>,
    width: '15%',
    dataIndex: '',
    key: 'method',
    render: row => (
      <>
        <span
          className="text-ele"
          style={{ alignItems: 'center', justifyContent: 'space-between', maxWidth: '210px' }}
        >
          {renderPaymentMethod(row)}
          <span className="text-ele">{riskScore(row.riskScore)}</span>
        </span>
      </>
    ),
  },
  {
    title: <span className="text-ele">3DS</span>,
    width: '7%',
    key: 'is3DSecure',
    dataIndex: 'is3DSecure',
    render: row =>
      row ? (
        <span className="badge badge-success">
          <i className="fa fa-shield font-size-16" aria-hidden="true"></i>
        </span>
      ) : (
        <span className="text-muted">-</span>
      ),
  },
  {
    title: <span className="text-ele">Date</span>,
    width: '15%',
    dataIndex: '',
    key: 'paymentDate',
    render: row => (
      <span className="text-ele">
        {row.method === 'manual' ? (
          <span>{formateDate(row.paymentDate, 'MMM D, YYYY')}</span>
        ) : (
          <span>{formateDate(row.paymentDate, 'MMM D, YYYY @ h:mm A')}</span>
        )}
      </span>
    ),
  },
  {
    title: <span className="text-ele">Customer</span>,
    width: '15%',
    dataIndex: 'customer',
    key: 'customer.firstName',
    render: customer => (
      <span className="text-ele">
        {customer?.customerName
          ? customer.customerName
          : (customer?.firstName || '').includes(customer?.lastName)
          ? customer.firstName
          : `${customer?.firstName || ''} ${customer?.lastName || ''}`}
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
    width: '7%',
    key: 'amount',
    dataIndex: '',
    render: row => (
      <span className="text-success font-weight-bold font-size-14">
        {getAmountToDisplay(row.currency, row.amount)}
      </span>
    ),
  },
  {
    title: <span className="text-ele">Ip Address</span>,
    width: '10%',
    key: 'ipAddress',
    dataIndex: '',
    render: row => <span className="font-weight-bold font-size-14">{row?.ipAddress || ''}</span>,
  },
  {
    title: <span className="text-ele">Points</span>,
    width: '15%',
    key: 'amount',
    dataIndex: '',
    render: row => <span className="font-weight-bold font-size-14">{row?.rewardPoints || ''}</span>,
  },
  {
    title: <span className="text-ele">Action</span>,
    width: '10%',
    key: 'x',
    dataIndex: '',
    render: row => (
      <span>
        <Tooltip placement="bottom" title={'View Details'}>
          <Link to={`/payments/${row._id}`} className="btn btn-sm btn-light mr-2 py-0">
            <i className="fe fe-eye align-middle" />
          </Link>
        </Tooltip>
      </span>
    ),
  },
]

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

const riskScore = riskScore => {
  let scoreObj = {
    class: 'default',
  }
  if (riskScore >= 0 && riskScore <= 25) {
    scoreObj = {
      class: 'success',
    }
  } else if (riskScore >= 26 && riskScore <= 50) {
    scoreObj = {
      class: 'warning',
    }
  } else if (riskScore >= 51 && riskScore <= 100) {
    scoreObj = {
      class: 'danger',
    }
  } else if (riskScore === 'NA') {
    scoreObj = {
      class: 'default',
    }
    return <span className={`badge badge-${scoreObj.class}`}>{riskScore}</span>
  }
  return <span className={`badge badge-${scoreObj.class}`}>{riskScore}%</span>
}

export default getColumns
