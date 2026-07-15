import React from 'react'
import { get as _get } from 'lodash'
import { Link } from 'react-router-dom'
import { formateDate } from 'components/app/helper'
import { Tooltip } from 'antd'
import CopyToClipboard from 'components/app/copyToClipboard'
import { PROVIDER_KYC_STATUS } from './businessTableFormatter'

/* eslint-disable */
const getColumns = () => {
  return [
    {
      title: <span className="text-ele">Business Name</span>,
      key: 'organizationName',
      width: '20%',
      ellipsis: {
        showTitle: false,
      },
      render: row => (
        <span className="d-flex align-items-center">
          <CopyToClipboard value={row._id} />
          <span className="text-ele">
            <Link className="pl-1" to={`/business/view/${row._id}`}>
              {row?.organizationName || row?.name}
            </Link>
          </span>
        </span>
      ),
    },
    {
      title: <span className="text-ele">Country</span>,
      dataIndex: 'country',
      key: 'country',
      render: country => <span className="text-ele">{`${country?.name || ''}`}</span>,
      width: '15%',
    },
    {
      title: <span className="text-ele">Currency</span>,
      dataIndex: 'currency',
      key: 'currency',
      render: currency => <span className="text-ele">{`${currency?.code || ''}`}</span>,
      width: '10%',
    },
    {
      title: <span className="text-ele">Payout Status</span>,
      dataIndex: 'paymentSetting',
      key: 'paymentSetting',
      width: '10%',
      ellipsis: {
        showTitle: false,
      },
      render: row => (
        <span className="d-flex align-items-center">
          <span className="text-ele">{renderStatus(_get(row, 'payoutStatus', ''))}</span>
        </span>
      ),
    },
    {
      title: <span className="text-ele">Debit Card Creation Status</span>,
      dataIndex: 'paymentSetting',
      key: 'paymentSetting',
      width: '10%',
      ellipsis: {
        showTitle: false,
      },
      render: row => (
        <span className="d-flex align-items-center">
          <span className="text-ele">{renderStatus(_get(row, 'debitCardCreationStatus', ''))}</span>
        </span>
      ),
    },
    {
      title: <span className="text-ele">Wallet Load Status</span>,
      dataIndex: 'paymentSetting',
      key: 'paymentSetting',
      width: '10%',
      ellipsis: {
        showTitle: false,
      },
      render: row => (
        <span className="d-flex align-items-center">
          <span className="text-ele">{renderStatus(_get(row, 'walletLoadStatus', ''))}</span>
        </span>
      ),
    },
    {
      title: <span className="text-ele">Created At</span>,
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: createdAt => <span className="text-ele">{`${formateDate(createdAt)}`}</span>,
      width: '10%',
    },
    {
      title: () => (
        <Tooltip placement="bottom" title={'Payment onboarding status'}>
          <span className="text-ele">POB Status</span>
        </Tooltip>
      ),
      key: 'isActive',
      render: row => pobStatus(row),
      width: '15%',
    },
  ]
}

const renderStatus = status => {
  let statusObj = {
    status: 'Blocked',
    class: 'danger',
  }
  if (status === 'active') {
    statusObj = {
      status: 'Active',
      class: 'success',
    }
  } else if (status === 'inactive') {
    statusObj = {
      status: 'InActive',
      class: 'warning',
    }
  }
  return <span className={`font-size-12 badge badge-${statusObj.class}`}>{statusObj.status}</span>
}

//Payment Onboarding Status
const pobStatus = row => {
  const { pobStatus } = row
  let statusObj = !!pobStatus?.trim()
    ? PROVIDER_KYC_STATUS[pobStatus]
    : PROVIDER_KYC_STATUS['not_started']
  statusObj = statusObj ?? PROVIDER_KYC_STATUS['not_started']
  return <span className={`font-size-12 badge badge-${statusObj.class}`}>{statusObj.status}</span>
}

export default getColumns
