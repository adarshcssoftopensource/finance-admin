/* eslint-disable */
import CopyToClipboard from '../copyToClipboard'
import { Link } from 'react-router-dom'
import { formateDate } from '../helper'
import { Tag, Tooltip } from 'antd'
import React from 'react'

export const getColumns = handleSchedulerModal => {
  return [
    {
      title: <span className="text-ele">Scheduler Id</span>,
      width: '10%',
      dataIndex: '',
      key: 'rewardName',
      render: row => (
        <span className="d-flex align-items-center">
          <CopyToClipboard value={row?._id} textMessage="Reward template id copied to clipboard" />
        </span>
      ),
    },
    {
      title: <span className="text-ele">Scheduler Status</span>,
      width: '15%',
      dataIndex: '',
      key: 'status',
      render: row => <span className="text-ele">{renderStatus(row?.status)}</span>,
    },
    {
      title: <span className="text-ele">Scheduler Type</span>,
      width: '10%',
      dataIndex: '',
      key: 'type',
      render: row => <span className="text-ele">{row?.type}</span>,
    },
    {
      title: <span className="text-ele">Scheduler Sub Type</span>,
      width: '10%',
      dataIndex: '',
      key: 'subType',
      render: row => (
        <span className="text-ele">{renderTagData({ id: row?._id, value: row?.subType })}</span>
      ),
    },
    {
      title: <span className="text-ele">Before</span>,
      width: '10%',
      dataIndex: '',
      key: 'before',
      render: row => <span className="text-ele">{row?.before?.join(',')}</span>,
    },
    {
      title: <span className="text-ele">after</span>,
      width: '10%',
      dataIndex: '',
      key: 'after',
      render: row => <span className="text-ele">{row?.after?.join(',')}</span>,
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
              className="btn btn-sm btn-light mr-2 py-0"
              onClick={e => {
                handleSchedulerModal('edit', row, true)
              }}
            >
              <i className="fe fe-edit align-middle" />
            </a>
          </Tooltip>
        </span>
      ),
      width: '10%',
    },
  ]
}

const renderStatus = status => {
  let requestTypeObj = {
    class: 'success',
  }
  if (status !== 'active') {
    requestTypeObj = {
      class: 'warning',
    }
  }
  return <span className={`font-size-12 badge badge-${requestTypeObj.class}`}>{status}</span>
}

const renderTagData = ({ id, value }) => {
  return (
    <Tag color="blue" key={id + '_tags_'}>
      <strong style={{ fontSize: '14px' }}>{value}</strong>
    </Tag>
  )
}
