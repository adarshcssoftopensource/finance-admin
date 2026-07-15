import React from 'react'
import { Tooltip } from 'antd'
import { Link } from 'react-router-dom'
import { isEmpty } from 'lodash'
import { getAmountToDisplay, formateDate } from 'components/app/helper'
import CopyToClipboard from 'components/app/copyToClipboard'
import { providerIcons } from './businessTableFormatter'
/* eslint-disable */
const getColumns = onDeleteWallet => {
  return [
    {
      title: <span className="text-ele">Business Name</span>,
      dataIndex: 'business',
      key: 'business.organizationName',
      ellipsis: {
        showTitle: false,
      },
      render: business => (
        <span className="d-flex align-items-center">
          <CopyToClipboard value={business?.id || business?._id || ''} />
          <span className="text-ele">
            <Link className="pl-1" to={`/business/view/${business?.id || business?._id || ''}`}>
              {business?.organizationName || '—'}
            </Link>
          </span>
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
      title: <span className="text-ele">Status</span>,
      dataIndex: '',
      key: 'status',
      render: row => walletStatus(row),
      width: '10%',
    },
    {
      title: <span className="text-ele">Wallet Balance</span>,
      dataIndex: '',
      key: 'balance',
      render: row => (
        <span className="text-success font-weight-bold font-size-14">
          {getAmountToDisplay(!isEmpty(row.currency) ? row.currency : null, row.balance)}
        </span>
      ),
      sorter: true,
      width: '15%',
    },
    {
      title: <span className="text-ele">Virtual Card</span>,
      key: 'cardNumbers',
      render: row => {
        return (
          <span className="text-ele">
            {row.cards &&
              row.cards
                .filter(card => card.cardType === 'virtual')
                .map((card, index) => {
                  return (
                    index > 0 && ', ',
                    (
                      <Tooltip
                        placement="bottom"
                        title={card.status}
                        key={`${card._id}_${card.status}`}
                      >
                        <Link
                          to={`/debit-card-wallets/${row.id || row._id}?tab=${card.cardType}`}
                          key={card._id}
                          className={`${card.status === 'blocked' ? 'text-del text-red' : ''}`}
                        >
                          {card.cardNumber}
                        </Link>
                      </Tooltip>
                    )
                  )
                })}
          </span>
        )
      },
      width: '10%',
    },
    {
      title: <span className="text-ele">Physical Card</span>,
      key: 'cardNumbers',
      render: row => {
        return (
          <span className="text-ele">
            {row.cards &&
              row.cards
                .filter(card => card.cardType === 'physical')
                .map((card, index) => {
                  return (
                    index > 0 && ', ',
                    (
                      <Tooltip
                        placement="bottom"
                        title={card.status}
                        key={`${card._id}_${card.status}`}
                      >
                        <Link
                          to={`/debit-card-wallets/${row.id || row._id}?tab=${card.cardType}`}
                          key={card._id}
                          className={`${card.status === 'blocked' ? 'text-del text-red' : ''}`}
                        >
                          {card.cardNumber}
                        </Link>
                      </Tooltip>
                    )
                  )
                })}
          </span>
        )
      },
      width: '10%',
    },
    {
      title: <span className="text-ele">Created Date</span>,
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: createdAt => (
        <span className="text-ele">
          <span>{formateDate(createdAt, 'MMM D, YYYY @ h:mm A')}</span>
        </span>
      ),
      width: '15%',
    },
    {
      title: <span className="text-ele">Action</span>,
      width: '15%',
      key: 'x',
      render: row => (
        <span>
          <Tooltip placement="bottom" title={'View Details'}>
            <Link to={`/debit-card-wallets/${row.id}`} className="btn btn-sm btn-light mr-2 py-0">
              <i className="fe fe-eye align-middle" />
            </Link>
          </Tooltip>
          {row.status !== 'deleted' ? (
            <Tooltip placement="bottom" title={'Delete Wallet'}>
              <a
                onClick={() => onDeleteWallet(row)}
                className="btn btn-sm btn-light mr-2 py-0"
                disabled={row.status === 'deleted'}
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

export const walletStatus = (row, type) => {
  const { status, newStatus } = row
  const key = type ? newStatus : status
  let statusObj = {
    status: 'Inactive',
    class: 'secondary',
  }
  switch (key) {
    case 'active':
      statusObj = {
        status: 'Active',
        class: 'success',
      }
      break
    case 'inactive':
      statusObj = {
        status: 'Inactive',
        class: 'secondary',
      }
      break
    case 'blocked':
      statusObj = {
        status: 'Blocked',
        class: 'warning',
      }
      break
    case 'deleted':
      statusObj = {
        status: 'Deleted',
        class: 'danger',
      }
      break

    default:
      break
  }

  return <span className={`font-size-12 badge badge-${statusObj.class}`}>{statusObj.status}</span>
}

export default getColumns
