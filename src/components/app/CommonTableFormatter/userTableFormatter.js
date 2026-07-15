/* eslint-disable */
import React from 'react'
import { Link } from 'react-router-dom'
import { Menu, Dropdown, Switch, Tooltip } from 'antd'
import CopyToClipboard from 'components/app/copyToClipboard'
import { formateDate } from 'components/app/helper'
const DISABLE_VERIFICATION_SWITCH_STATUSES = ['approved', 'submitted', 'rejected']

const getColumns = (
  statusModal,
  openModal,
  openPasswordModal,
  resetPasswordModal,
  isDelegate,
  handleRequestVerification,
  permanentlyRemoveAccess,
) => {
  return [
    {
      title: <span className="text-ele">Name</span>,
      width: '20%',
      key: 'firstName',
      ellipsis: {
        showTitle: false,
      },
      render: row => (
        <>
          <span className="d-flex align-items-center">
            <CopyToClipboard value={row._id} />
            <span className="pl-1 text-ele">
              {row.firstName} {row.lastName}
            </span>
            {isDelegate && renderRole(row.role)}
          </span>
        </>
      ),
    },
    {
      title: <span className="text-ele">Primary Email</span>,
      width: '17%',
      key: 'primaryEmail',
      dataIndex: 'primaryEmail',
      ellipsis: {
        showTitle: false,
      },
      render: email => <span className="text-ele">{email}</span>,
    },
    {
      title: <span className="text-ele">Mobile Number</span>,
      width: '10%',
      key: 'mobileNumber',
      dataIndex: 'mobileNumber',
      ellipsis: {
        showTitle: false,
      },
      render: mobileNumber => <span className="text-ele">{mobileNumber}</span>,
    },
    {
      title: <span className="text-ele">Connected Business</span>,
      width: '7%',
      ellipsis: {
        showTitle: false,
      },
      render: row => (
        <Link
          to={`/business?userId=${row._id}&userName=${row.firstName}`}
          className="kit__utils__link"
        >
          <span className="text-ele">{(row.businesses || []).length}</span>
        </Link>
      ),
    },
    {
      title: <span className="text-ele">Identity Verification</span>,
      width: '7%',
      ellipsis: { showTitle: false },
      render: row => {
        const verification = row?.identityVerification
        if (!verification) return <span>-</span>

        const { status, sessionId } = verification

        if (status === 'not_required') return <span>-</span>

        let icon = ''
        let badgeClass = ''

        switch (status) {
          case 'pending':
          case 'submitted':
            icon = 'fa fa-clock-o'
            badgeClass = 'badge badge-warning'
            break

          case 'resubmission_requested':
            icon = 'fa fa-refresh'
            badgeClass = 'badge badge-info'
            break

          case 'rejected':
            icon = 'fa fa-times'
            badgeClass = 'badge badge-danger'
            break

          case 'approved':
            icon = 'fa fa-id-card'
            badgeClass = 'badge badge-success'
            break

          default:
            return <span>-</span>
        }

        if (!sessionId) {
          return (
            <span className={badgeClass}>
              <i className={`${icon} font-size-16`} />
            </span>
          )
        }

        const veriffLink = `https://station.veriff.com/verifications/${sessionId}`

        return (
          <a
            href={veriffLink}
            target="_blank"
            rel="noopener noreferrer"
            className="kit__utils__link"
          >
            <span className={badgeClass}>
              <i className={`${icon} font-size-16`} />
            </span>
          </a>
        )
      },
    },
    {
      title: <span className="text-ele">Last Login</span>,
      width: '12%',
      dataIndex: 'lastLoggedInAt',
      key: 'lastLoggedInAt',
      ellipsis: {
        showTitle: false,
      },
      render: lastLoggedInAt => (
        <span className="text-ele">{`${formateDate(lastLoggedInAt)}`}</span>
      ),
    },
    {
      title: <span className="text-ele">Password Updated</span>,
      width: '12%',
      dataIndex: 'passwordUpdatedAt',
      key: 'passwordUpdatedAt',
      ellipsis: {
        showTitle: false,
      },
      render: passwordUpdatedAt => (
        <span className="text-ele">{`${formateDate(passwordUpdatedAt)}`}</span>
      ),
    },
    {
      title: <span className="text-ele">Created At</span>,
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: createdAt => <span className="text-ele">{`${formateDate(createdAt)}`}</span>,
      width: '12%',
    },
    {
      title: <span className="text-ele">Action</span>,
      key: '_id',
      render: row => (
        <span>
          <Tooltip placement="bottom" title={'View Details'}>
            <Link to={`/users/${row._id}`} className="btn btn-sm btn-light mr-2 py-0">
              <i className="fe fe-eye align-middle" />
            </Link>
          </Tooltip>
          <Switch
            checkedChildren={<span>On</span>}
            unCheckedChildren={<span>Off</span>}
            checked={isDelegate ? row.isActiveInBusiness : row.isActive}
            onClick={() => statusModal(row)}
          />
          {renderActions(
            row,
            openModal,
            resetPasswordModal,
            openPasswordModal,
            handleRequestVerification,
            isDelegate,
            permanentlyRemoveAccess,
          )}
        </span>
      ),
      width: '15%',
    },
  ]
}

const renderActions = (
  row,
  openModal,
  resetPasswordModal,
  openPasswordModal,
  handleRequestVerification,
  isDelegate,
  permanentlyRemoveAccess,
) => {
  return (
    <Dropdown
      className="ml-2"
      overlay={dropdownMenu(
        row,
        openModal,
        resetPasswordModal,
        openPasswordModal,
        handleRequestVerification,
        isDelegate,
        permanentlyRemoveAccess,
      )}
      placement="bottomRight"
    >
      <button type="button" className="btn btn-light  dropdown-toggle-noarrow py-0">
        <i className="fe fe-more-horizontal align-middle" />
      </button>
    </Dropdown>
  )
}

const dropdownMenu = (
  row,
  openModal,
  resetPasswordModal,
  openPasswordModal,
  handleRequestVerification,
  isDelegate,
  permanentlyRemoveAccess,
) => {
  return (
    <Menu>
      <Menu.Item>
        <a onClick={() => openModal(row, 'emails')}>Connected Emails</a>
      </Menu.Item>
      <Menu.Item>
        <a onClick={() => openPasswordModal(row)}>Temporary Password</a>
      </Menu.Item>
      <Menu.Item>
        <a onClick={() => resetPasswordModal(row)}>Reset Password</a>
      </Menu.Item>
      <Menu.Item
        disabled={DISABLE_VERIFICATION_SWITCH_STATUSES.includes(row?.identityVerification?.status)}
        onClick={() =>
          handleRequestVerification(
            row,
            row?.identityVerification?.status === 'not_required' ? 'required' : 'not_required',
          )
        }
      >
        {row?.identityVerification?.status === 'required' ? 'Stop' : 'Request'} Identity
        Verification
      </Menu.Item>
      {isDelegate && (
        <Menu.Item className="bg-danger">
          <a onClick={() => permanentlyRemoveAccess(row)} className="text-white">
            Permanently Remove Access
          </a>
        </Menu.Item>
      )}
    </Menu>
  )
}

const renderRole = role => {
  let statusObj = {
    class: 'warning',
  }
  if (role === 'Owner') {
    statusObj = {
      class: 'success',
    }
  } else if (role === 'Admin') {
    statusObj = {
      class: 'default bg-gray-6',
    }
  } else if (role === 'Viewer') {
    statusObj = {
      class: 'warning',
    }
  } else if (role === 'Editor') {
    statusObj = {
      class: 'primary',
    }
  }
  return <span className={`ml-2 font-size-12 badge badge-${statusObj.class}`}>{role}</span>
}

export const getCRMColumns = () => {
  return [
    {
      title: <span className="text-ele">Name</span>,
      key: 'firstName',
      ellipsis: {
        showTitle: false,
      },
      render: row => (
        <>
          <span className="d-flex align-items-center">
            <CopyToClipboard value={row._id} />
            <span className="pl-1 text-ele">
              {row.firstName} {row.lastName}
            </span>
            {renderRole(row.role)}
          </span>
        </>
      ),
    },
    {
      title: <span className="text-ele">Primary Email</span>,
      key: 'primaryEmail',
      dataIndex: 'primaryEmail',
      ellipsis: {
        showTitle: false,
      },
      render: email => <span className="text-ele">{email}</span>,
    },
    {
      title: <span className="text-ele">Mobile Number</span>,
      key: 'mobileNumber',
      dataIndex: 'mobileNumber',
      ellipsis: {
        showTitle: false,
      },
      render: mobileNumber => <span className="text-ele">{mobileNumber}</span>,
    },
    {
      title: <span className="text-ele">Connected Business</span>,
      ellipsis: {
        showTitle: false,
      },
      render: row => (
        <Link
          to={`/business?userId=${row._id}&userName=${row.firstName}`}
          className="kit__utils__link"
        >
          <span className="text-ele">{row.businesses.length}</span>
        </Link>
      ),
    },
    {
      title: <span className="text-ele">Country</span>,
      key: 'country',
      dataIndex: 'country',
      //show country name
      render: country => <span className="text-ele">{country || '-'}</span>,
    },
    {
      title: <span className="text-ele">Created At</span>,
      key: 'createdAt',
      dataIndex: 'createdAt',
      render: createdAt => <span className="text-ele">{createdAt}</span>,
    },
  ]
}
export default getColumns
