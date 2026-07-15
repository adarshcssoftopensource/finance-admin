import React from 'react'
import CopyToClipboard from 'components/app/copyToClipboard'
import { formateDate, getPointToDisplay } from 'components/app/helper'
/* eslint-disable */
const getColumns = () => {
  return [
    {
      title: <span className="text-ele">Reward Earn ID</span>,
      width: '20%',
      dataIndex: 'id',
      key: 'id',
      ellipsis: {
        showTitle: false,
      },
      render: id => (
        <span className="d-flex align-items-center">
          <CopyToClipboard value={id} />
          <span className="pl-1 text-ele"> {id} </span>
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
      render: row => <span className="text-ele">{row?.business?.organizationName}</span>,
    },
    {
      title: <span className="text-ele">Reward Name</span>,
      key: 'rewardName',
      dataIndex: '',
      render: row => <span className="text-ele">{row?.rewardTemplate?.rewardName}</span>,
      width: '10%',
    },
    {
      title: <span className="text-ele">Points</span>,
      dataIndex: '',
      key: 'points',
      render: row => <span className="text-ele">{getPointToDisplay(row?.points)}</span>,
      width: '10%',
    },
    {
      title: <span className="text-ele">Description</span>,
      dataIndex: '',
      key: 'description',
      ellipsis: {
        showTitle: false,
      },
      render: row => <span className="text-ele">{row?.description || ''}</span>,
      width: '10%',
    },
    {
      title: <span className="text-ele">Reason</span>,
      dataIndex: '',
      key: 'reason',
      ellipsis: {
        showTitle: false,
      },
      render: row => <span className="text-ele">{row?.reason || ''}</span>,
      width: '10%',
    },
    {
      title: <span className="text-ele">Status</span>,
      dataIndex: '',
      key: 'status',
      ellipsis: {
        showTitle: false,
      },
      render: row => <span className="text-ele">{renderStatus(row?.status)}</span>,
      width: '10%',
    },
    {
      title: <span className="text-ele">Eligible At</span>,
      dataIndex: '',
      key: 'eligibleAt',
      ellipsis: {
        showTitle: false,
      },
      render: row => <span className="text-ele">{`${formateDate(row?.eligibleAt)}`}</span>,
      width: '15%',
    },
    {
      title: <span className="text-ele">Created At</span>,
      dataIndex: '',
      key: 'createdAt',
      ellipsis: {
        showTitle: false,
      },
      render: row => <span className="text-ele">{`${formateDate(row?.createdAt)}`}</span>,
      width: '15%',
    },
  ]
}

const renderStatus = status => {
  let statusObj = {
    class: 'default',
  }
  if (status === 'processed') {
    statusObj = {
      status: 'Processed',
      class: 'success',
    }
  } else if (status === 'pending') {
    statusObj = {
      status: 'Pending',
      class: 'warning',
    }
  } else if (status === 'canceled') {
    statusObj = {
      status: 'Canceled',
      class: 'danger',
    }
  } else if (status === 'redeemed') {
    statusObj = {
      status: 'Canceled',
      class: 'primary',
    }
  } else if (status === 'expired') {
    statusObj = {
      status: 'Expired',
      class: 'danger',
    }
  }
  return <span className={`font-size-12 badge badge-${statusObj.class}`}>{statusObj.status}</span>
}

export default getColumns
