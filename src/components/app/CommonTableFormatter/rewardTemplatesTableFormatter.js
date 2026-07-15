import React from 'react'
import { Link } from 'react-router-dom'
import { Tooltip } from 'antd'
import CopyToClipboard from 'components/app/copyToClipboard'
import { formateDate } from '../helper'
/* eslint-disable */
const getColumns = openRewardTemplateModal => {
  return [
    {
      title: <span className="text-ele">Reward name</span>,
      width: '15%',
      dataIndex: '',
      key: 'rewardName',
      render: row => (
        <span className="d-flex align-items-center">
          <CopyToClipboard value={row?.id} textMessage="Reward template id copied to clipboard" />
          <span className="text-ele">
            {row.rewardName && <Link to={`/reward-templates/${row?.id}`}>{row?.rewardName}</Link>}
          </span>
        </span>
      ),
    },
    {
      title: <span className="text-ele">Reward Template Uuid</span>,
      width: '15%',
      dataIndex: '',
      key: 'uuid',
      render: row => <span className="text-ele">{row?.uuid}</span>,
    },
    {
      title: <span className="text-ele">Reward Type</span>,
      width: '10%',
      dataIndex: '',
      key: 'rewardType',
      render: row => <span className="text-ele">{row?.rewardType}</span>,
    },
    {
      title: <span className="text-ele">Frequency</span>,
      width: '10%',
      dataIndex: '',
      key: 'frequency',
      render: row => <span className="text-ele">{row?.frequency}</span>,
    },
    {
      title: <span className="text-ele">Status</span>,
      width: '10%',
      dataIndex: '',
      key: 'isActive',
      render: row => <span className="text-ele">{renderStatus(row?.isActive)}</span>,
    },
    {
      title: <span className="text-ele">Created At</span>,
      width: '20%',
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
          <Tooltip placement="bottom" title={'Edit Reward Template'}>
            <a
              onClick={() => openRewardTemplateModal(row?.id)}
              className="btn btn-sm btn-light mr-2 py-0"
            >
              <i className="fe fe-edit align-middle" />
            </a>
          </Tooltip>
          <Tooltip placement="bottom" title={'View Reward Template'}>
            <Link to={`/reward-templates/${row?.id}`} className="btn btn-sm btn-light mr-2 py-0">
              <i className="fe fe-eye align-middle" />
            </Link>
          </Tooltip>
        </span>
      ),
      width: '10%',
    },
  ]
}

const renderStatus = status => {
  let statusObj = {
    class: 'default',
  }
  if (status) {
    statusObj = {
      class: 'success',
    }
  } else {
    statusObj = {
      class: 'danger',
    }
  }
  return (
    <span className={`font-size-12 badge badge-${statusObj.class}`}>
      {status ? 'Active' : 'InActive'}
    </span>
  )
}

export default getColumns
