import React from 'react'
import { Tooltip } from 'antd'
import { Link } from 'react-router-dom'
import { getAmountToDisplay, formateDate, BusinessName } from 'components/app/helper'
import CopyToClipboard from 'components/app/copyToClipboard'
/* eslint-disable */
const getColumns = () => {
  return [
    {
      title: <span className="text-ele">Status</span>,
      dataIndex: '',
      key: 'uuid',
      render: row => <span className="text-ele">{renderStatus(row.status)}</span>,
      width: '20px',
    },
    {
      title: <span className="text-ele">Payout id</span>,
      dataIndex: '_id',
      key: '_id',
      ellipsis: {
        showTitle: false,
      },
      render: _id => (
        <span className="d-flex align-items-center">
          <CopyToClipboard value={_id} />
          <span className="pl-1 text-ele"> {_id}</span>
        </span>
      ),
      width: '50px',
    },
    {
      title: <span className="text-ele">Start Date</span>,
      dataIndex: '',
      key: 'timeline.startDate',
      render: row => (
        <span className="text-ele">
          <span>{formateDate(row?.timeline?.startDate)}</span>
        </span>
      ),
      width: '20px',
    },
    {
      title: <span className="text-ele">Arrival Date</span>,
      dataIndex: '',
      key: 'timeline.arrivalDate',
      render: row => (
        <span className="text-ele">
          <span>{formateDate(row?.timeline?.arrivalDate)}</span>
        </span>
      ),
      width: '20px',
    },
    {
      title: <span className="text-ele">Business</span>,
      width: '20px',
      dataIndex: '',
      key: 'business.organizationName',
      render: row => (
        <span className="text-ele">
          <CopyToClipboard value={row?.business?._id || ''} />
          <BusinessName id={row?.business?._id} name={row?.business?.organizationName || ''} />
        </span>
      ),
    },
    {
      title: <span className="text-ele">Amount</span>,
      width: '15px',
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
      width: '15px',
      key: 'x',
      render: row => (
        <span>
          <Tooltip placement="bottom" title={'View Details'}>
            <Link to={`/payouts/${row.id || row._id}`} className="btn btn-sm btn-light mr-2 py-0">
              <i className="fe fe-eye align-middle" />
            </Link>
          </Tooltip>
        </span>
      ),
    },
  ]
}

const renderStatus = status => {
  if (status === 'paid' || status === 'success') {
    return <span className={`font-size-12 badge badge-success`}>{status}</span>
  } else {
    return <span className={`font-size-12 badge badge-danger`}>{status}</span>
  }
}

export default getColumns
