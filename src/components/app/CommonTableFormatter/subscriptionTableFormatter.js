import React from 'react'
import { Tooltip } from 'antd'
import { Link } from 'react-router-dom'
import CopyToClipboard from 'components/app/copyToClipboard'
import { formateDate } from 'components/app/helper'
import { capitalize } from 'lodash'
/* eslint-disable */
const getColumns = showCancelConfirm => {
  return [
    {
      title: <span className="text-ele">Subscription id</span>,
      width: '20%',
      dataIndex: '_id',
      key: '_id',
      ellipsis: {
        showTitle: false,
      },
      render: _id => (
        <span className="d-flex align-items-center">
          <CopyToClipboard value={_id} />
          <span className="pl-1 text-ele"> {_id} </span>
        </span>
      ),
    },
    {
      title: <span className="text-ele">Business Name</span>,
      width: '15%',
      key: 'businessName',
      dataIndex: '',
      ellipsis: {
        showTitle: false,
      },
      render: row => (
        <span className="text-ele">
          {row.businessId && (
            <Link to={`business/view/${row.businessId._id}`}>
              {row.businessId.organizationName}
            </Link>
          )}
        </span>
      ),
    },
    {
      title: <span className="text-ele">Plan Name</span>,
      key: 'subscriptionName',
      dataIndex: '',
      render: row => (
        <span className="text-ele">
          {row?.subscriptionName} ({capitalize(row?.recurring)})
        </span>
      ),
      width: '11%',
    },
    {
      title: <span className="text-ele">Start Date</span>,
      dataIndex: '',
      key: 'startDate',
      render: row => <span className="text-ele">{`${renderDate(row, 1)}`}</span>,
      width: '10%',
    },
    {
      title: <span className="text-ele">End Date</span>,
      dataIndex: '',
      key: 'endDate',
      render: row => <span className="text-ele">{`${renderDate(row, 2)}`}</span>,
      width: '10%',
    },
    {
      title: <span className="text-ele">Next Invoice Date</span>,
      dataIndex: '',
      key: 'nextInvoiceDate',
      ellipsis: {
        showTitle: false,
      },
      render: row => <span className="text-ele">{`${renderDate(row, 3)}`}</span>,
      width: '15%',
    },
    {
      title: <span className="text-ele">Status</span>,
      dataIndex: '',
      key: 'status',
      ellipsis: {
        showTitle: false,
      },
      render: row => <span className="text-ele">{row.status}</span>,
      width: '15%',
    },
    {
      title: <span className="text-ele">Trial</span>,
      dataIndex: 'trial',
      key: 'trail',
      render: trial => (
        <span className={`font-size-12 badge badge-${trial.isTrial ? 'success' : ''}`}>
          {trial.isTrial ? 'Trial' : '-'}
        </span>
      ),
      width: '10%',
    },
    {
      title: <span className="text-ele">Action</span>,
      key: '_id',
      dataIndex: '',
      render: row => (
        <span>
          <Tooltip placement="bottom" title={'View Details'}>
            <Link to={`/subscriptions/${row._id}`} className="btn btn-sm btn-light mr-2 py-0">
              <i className="fe fe-eye align-middle" />
            </Link>
          </Tooltip>
          {row.status === 'Active' && row.isActive && (
            <Tooltip placement="bottom" title={'Cancel Subscription'}>
              <button
                type="button"
                onClick={() => showCancelConfirm(row)}
                className="btn btn-sm btn-danger py-0"
              >
                <i className="fe fe-x align-middle" />
              </button>
            </Tooltip>
          )}
        </span>
      ),
      width: '10%',
    },
  ]
}

const renderDate = (row, type) => {
  if (type === 3 && (row.status === 'Active' || row.status === 'Upcoming') && row.nextInvoiceDate) {
    return formateDate(row.nextInvoiceDate)
  } else if (type === 2 && row.endDate) {
    return formateDate(row.endDate)
  } else if (type === 1) {
    return formateDate(row.startDate || row.createAt)
  } else {
    return '--'
  }
}

export default getColumns
