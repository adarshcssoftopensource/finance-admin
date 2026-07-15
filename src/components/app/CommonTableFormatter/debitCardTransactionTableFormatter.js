import React from 'react'
import { Tooltip } from 'antd'
import { Link } from 'react-router-dom'
import { getAmountToDisplayWithColor, formateDate } from 'components/app/helper'
import { providerIcons } from './businessTableFormatter'
/* eslint-disable */
const getColumns = showStripeRowModal => {
  return [
    {
      title: <span className="text-ele">Status</span>,
      dataIndex: '',
      key: 'status',
      render: row => (
        <span className="d-flex align-items-center">
          <span className="pl-1 text-ele">{renderStatus(row.status)}</span>
        </span>
      ),
      width: '20%',
    },
    {
      title: <span className="text-ele">Provider</span>,
      width: '10%',
      dataIndex: '',
      key: 'provider',
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
      title: <span className="text-ele">Card</span>,
      dataIndex: '',
      key: 'cardNumber',
      render: row => <span className="font-weight-bold font-size-14">{showHyperlink(row)}</span>,
      width: '20%',
    },
    {
      title: <span className="text-ele">Date</span>,
      dataIndex: '',
      key: 'date',
      render: row => (
        <span className="text-ele">
          <span>{formateDate(row.date, 'MMM D, YYYY')}</span>
        </span>
      ),
      width: '20%',
    },
    {
      title: <span className="text-ele">Description</span>,
      dataIndex: '',
      key: 'description',
      render: row => (
        <span className="text-ele">
          <span>{row.description}</span>
        </span>
      ),
      width: '20%',
    },
    {
      title: <span className="text-ele">Amount</span>,
      dataIndex: '',
      key: 'amount',
      render: row => (
        <span className="text-ele">
          <span>{getAmountToDisplayWithColor(row.amount, row.currency)}</span>
        </span>
      ),
      width: '10%',
    },
    {
      title: <span className="text-ele">Action</span>,
      key: 'action',
      render: row =>
        row.amount < 0 ? (
          <span>
            <Tooltip placement="bottom" title={'Show Row'}>
              <a
                href="javascript:void(0);"
                onClick={() => showStripeRowModal(row)}
                className="btn btn-sm btn-light mr-2 py-0"
              >
                <i className="fe fe-eye align-middle" />
              </a>
            </Tooltip>
          </span>
        ) : (
          ''
        ),
      width: '10%',
    },
  ]
}

const renderStatus = status => {
  switch (status) {
    case 'success':
      return <span className={`font-size-12 badge badge-success`}>{status}</span>
      break
    case 'pending':
      return <span className={`font-size-12 badge badge-warning`}>{status}</span>
      break

    default:
      return <span className={`font-size-12 badge badge-danger`}>{status}</span>
  }
}

const showHyperlink = row => {
  if (row.cardNumber == '0000' || row.cardId == null) {
    return 'NA'
  }
  return row.walletId ? (
    <>
      <Link
        className="ml-0"
        style={{ marginLeft: '-20px' }}
        to={`/debit-card-wallets/${row.walletId}?tab=${row.cardType}`}
      >
        {row.cardNumber}
      </Link>
      <Tooltip className="ml-2" placement="bottom" title={row.cardHolderName}>
        <img src="resources/images/info.png" alt="Info" width={20} />
      </Tooltip>
    </>
  ) : (
    row.cardNumber
  )
}

export default getColumns
