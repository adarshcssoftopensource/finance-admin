import React from 'react'
import moment from 'moment'
import { Dropdown, Menu } from 'antd'

/* eslint-disable */
const getColumns = (handleUpdateDevice, handleDeleteDevice) => {
  return [
    {
      title: <span className="text-ele">User Id</span>,
      width: '30%',
      key: 'userId',
      render: row => <span className="text-ele">{row?.user?.id}</span>,
    },
    {
      title: <span className="text-ele">Username</span>,
      width: '20%',
      key: 'username',
      render: row => <span className="text-ele text-capitalize">{row?.user?.username}</span>,
    },
    {
      title: <span className="text-ele">Platform</span>,
      width: '10%',
      key: 'platform',
      render: row => <span className="badge badge-success font-size-12">{row.platform}</span>,
    },
    {
      title: <span className="text-ele">Subscribed At</span>,
      width: '20%',
      key: 'createdAt',
      render: row => (
        <span className="text-ele">{moment(row.createdAt).format('MMM DD, YYYY')}</span>
      ),
    },
    {
      title: <span className="text-ele">Status</span>,
      width: '10%',
      key: 'status',
      dataIndex: 'status',
      render: row => alertType(row),
    },
    {
      title: <span className="text-ele">Last LoggedIn At</span>,
      width: '20%',
      key: 'lastLoggedInAt',
      render: row => (
        <span className="text-ele">{moment(row?.user?.lastLoggedInAt).format('MMM DD, YYYY')}</span>
      ),
    },
    {
      title: <span className="text-ele">Action</span>,
      key: '_id',
      render: row => renderActions(row, handleUpdateDevice, handleDeleteDevice),
      width: '20%',
    },
  ]
}

const alertType = row => {
  let statusObj = {
    status: row,
    class: 'warning',
  }
  if (row === 'inactive') {
    statusObj = {
      status: row,
      class: 'danger',
    }
  } else if (row === 'active') {
    statusObj = {
      status: row,
      class: 'primary',
    }
  }
  return <span className={`font-size-12 badge badge-${statusObj.class}`}>{statusObj.status}</span>
}

const renderActions = (row, handleUpdateDevice, handleDeleteDevice) => {
  return (
    <Dropdown
      className="ml-2"
      overlay={dropdownMenu(row, handleUpdateDevice, handleDeleteDevice)}
      placement="bottomRight"
    >
      <button type="button" className="btn btn-light  dropdown-toggle-noarrow py-0">
        <i className="fe fe-more-horizontal align-middle" />
      </button>
    </Dropdown>
  )
}

const dropdownMenu = (row, handleUpdateDevice, handleDeleteDevice) => {
  return (
    <Menu>
      <Menu.Item>
        <a onClick={() => handleUpdateDevice(row._id, 'active')}>Active</a>
      </Menu.Item>
      <Menu.Item>
        <a onClick={() => handleUpdateDevice(row._id, 'blocked')}>Block</a>
      </Menu.Item>
      <Menu.Item>
        <a onClick={() => handleUpdateDevice(row._id, 'inactive')}>Inactive</a>
      </Menu.Item>
      <Menu.Item>
        <a onClick={() => handleDeleteDevice(row._id)}>Delete</a>
      </Menu.Item>
    </Menu>
  )
}

export default getColumns
