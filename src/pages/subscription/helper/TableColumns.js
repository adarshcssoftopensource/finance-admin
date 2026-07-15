import React from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { Tooltip } from 'antd'
import CopyToClipboard from 'components/app/copyToClipboard'
// import { Link } from 'react-router-dom'
/* eslint-disable */
const getColumns = () => {
  return [
    {
      title: <span className="text-ele">Id</span>,
      dataIndex: '_id',
      key: '_id',
      ellipsis: {
        showTitle: false,
      },
      render: _id => (
        <span>
          <CopyToClipboard value={_id}>
            <a href="javascript:void(0);" className="kit__utils__link">
              {_id}
            </a>
          </CopyToClipboard>
        </span>
      ),
      width: 200,
    },
    {
      title: <span className="text-ele">Business Name</span>,
      key: 'businessName',
      dataIndex: 'businessName',
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: <span className="text-ele">Plan Name</span>,
      key: 'subscriptionName',
      dataIndex: 'subscriptionName',
      width: 100,
    },
    {
      title: <span className="text-ele">Start Date</span>,
      dataIndex: 'startDate',
      key: 'startDate',
      render: startDate => (
        <span className="text-ele">{`${moment(startDate).format('MM/DD/YYYY')}`}</span>
      ),
      width: 90,
    },
    {
      title: <span className="text-ele">End Date</span>,
      dataIndex: 'endDate',
      key: 'endDate',
      render: endDate => (
        <span className="text-ele">{`${moment(endDate).format('MM/DD/YYYY')}`}</span>
      ),
      width: 90,
    },
    {
      title: <span className="text-ele">Next Invoice Date</span>,
      dataIndex: 'nextInvoiceDate',
      key: 'nextInvoiceDate',
      ellipsis: {
        showTitle: false,
      },
      render: nextInvoiceDate => (
        <span className="text-ele">{`${moment(nextInvoiceDate).format('MM/DD/YYYY')}`}</span>
      ),
      width: 120,
    },
    {
      title: <span className="text-ele">Tria</span>,
      dataIndex: 'trial',
      key: 'trail',
      render: trial => (
        <span className={`font-size-12 badge badge-${trial.isTrial ? 'success' : ''}`}>
          {trial.isTrial ? 'Trial' : '-'}
        </span>
      ),
      width: 80,
    },
    {
      title: <span className="text-ele">Action</span>,
      key: '_id',
      render: row => (
        <span>
          <Tooltip placement="bottom" title={'View Details'}>
            <Link to={`subscriptions`} className="btn btn-sm btn-light mr-2 py-0">
              <i className="fe fe-eye align-middle" />
            </Link>
          </Tooltip>
        </span>
      ),
      width: 80,
    },
  ]
}

export default getColumns
