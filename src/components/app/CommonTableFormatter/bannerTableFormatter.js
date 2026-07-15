import React from 'react'
import { Dropdown, Menu, Switch, Tooltip } from 'antd'
import { Link } from 'react-router-dom'
import { BusinessName } from '../helper'
/* eslint-disable */
const getBannerTargetColumns = (changeStatus, openEditBannerTarget, countryList) => {
  return [
    {
      title: <span className="text-ele">Internal Name</span>,
      width: '20%',
      key: 'bannerName',
      dataIndex: 'bannerName',
    },
    {
      title: <span className="text-ele">Banner Scope</span>,
      width: '20%',
      key: 'bannerScope',
      dataIndex: 'bannerScope',
    },
    {
      title: <span className="text-ele">Entity</span>,
      width: '20%',
      key: 'entityId',
      render: row => renderEntityDetail(row, countryList),
    },
    {
      title: <span className="text-ele">Status</span>,
      width: '20%',
      key: 'status',
      dataIndex: 'status',
      render: row => alertType(row),
    },
    {
      title: <span className="text-ele">Action</span>,
      key: '_id',
      render: row => (
        <span>
          <Tooltip placement="bottom" title={'Edit banner target'}>
            <a
              href="javascript:void(0);"
              onClick={() => openEditBannerTarget(row)}
              className="btn btn-sm btn-light mr-2 py-0"
            >
              <i className="fe fe-edit align-middle" />
            </a>
          </Tooltip>
          {renderActions(row, changeStatus)}
        </span>
      ),
      width: '20%',
    },
  ]
}

const renderEntityDetail = (row, countryList) => {
  switch (row.bannerScope) {
    case 'user':
      return <span className="text-ele">{`${row.firstName || ''} ${row.lastName || ''}`}</span>
    case 'business':
      return <BusinessName id={row?.entityId} name={row?.organizationName} />
    case 'country':
      let countryName =
        (countryList && countryList.find(country => country._id.toString() === row.entityId)) || ''
      return <span className="text-ele">{countryName.name || '-'}</span>
    default:
      return <span className="text-ele">-</span>
  }
  return <p>{row.entityId}</p>
}

const renderActions = (row, changeStatus) => {
  return (
    <Dropdown className="ml-2" overlay={dropdownMenu(row, changeStatus)} placement="bottomRight">
      <button type="button" className="btn btn-light  dropdown-toggle-noarrow py-0">
        <i className="fe fe-more-horizontal align-middle" />
      </button>
    </Dropdown>
  )
}

const dropdownMenu = (row, changeStatus) => {
  return (
    <Menu>
      <Menu.Item>
        <a onClick={() => changeStatus(row, 'active')}>Active</a>
      </Menu.Item>
      <Menu.Item>
        <a onClick={() => changeStatus(row, 'dismissed')}>Dismissed</a>
      </Menu.Item>
      <Menu.Item>
        <a onClick={() => changeStatus(row, 'inactive')}>Inactive</a>
      </Menu.Item>
    </Menu>
  )
}

export const getBannerColumns = (statusModal, showDeleteBannerConfirm) => {
  return [
    {
      title: <span className="text-ele">Internal Name</span>,
      width: '15%',
      key: 'bannerName',
      dataIndex: 'bannerName',
      ellipsis: true,
      render: row => <span className="text-ele">{row}</span>,
    },
    {
      title: <span className="text-ele">Banner Type</span>,
      width: '10%',
      key: 'bannerType',
      dataIndex: 'bannerType',
      ellipsis: true,
    },
    {
      title: <span className="text-ele">Banner Title</span>,
      width: '15%',
      key: 'bannerTitle',
      dataIndex: 'bannerTitle',
      ellipsis: true,
      render: row => <span className="text-ele">{row}</span>,
    },
    {
      title: <span className="text-ele">Banner Description</span>,
      width: '35%',
      key: 'description',
      dataIndex: 'description',
      ellipsis: true,
      render: row => <div className="text-ele" dangerouslySetInnerHTML={{ __html: row }} />,
    },
    {
      title: <span className="text-ele">Status</span>,
      width: '10%',
      key: 'status',
      dataIndex: 'status',
      render: row => alertType(row),
    },
    {
      title: <span className="text-ele">Action</span>,
      key: '_id',
      render: row => (
        <span>
          <Tooltip placement="bottom" title={'Edit Banner'}>
            <Link to={`/banners/${row._id}`} className="btn btn-sm btn-light mr-2 py-0">
              <i className="fe fe-edit align-middle" />
            </Link>
          </Tooltip>
          <Switch
            className="mr-2"
            checkedChildren={<span>On</span>}
            unCheckedChildren={<span>Off</span>}
            checked={row.status === 'active'}
            onClick={() => statusModal(row)}
          />
          <Tooltip placement="bottom" title={'Delete Banner'}>
            <a
              href="javascript:void(0);"
              onClick={() => showDeleteBannerConfirm(row)}
              className="btn btn-sm btn-light mr-2 py-0"
            >
              <i className="fe fe-trash align-middle" />
            </a>
          </Tooltip>
        </span>
      ),
      width: '15%',
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

export default getBannerTargetColumns
