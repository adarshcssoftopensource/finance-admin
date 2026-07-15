import React from 'react'
import { BusinessName, formateDate } from 'components/app/helper'
import { Switch } from 'antd'
import CopyToClipboard from 'components/app/copyToClipboard'

/* eslint-disable */
const getColumns = (changeStatus, type) => {
  return [
    {
      title: <span className="text-ele">Business Name</span>,
      width: '25%',
      dataIndex: '',
      key: 'business',
      render: row => (
        <span className="text-ele">
          <CopyToClipboard value={row?.business?.id || ''} />
          <BusinessName id={row?.business?.id} name={row?.business?.organizationName} />
        </span>
      ),
    },
    {
      title: (
        <span className="text-ele">
          {type == 'funding' ? 'Funding URL' : 'Finance.Me Lynk URL'}
        </span>
      ),
      width: '35%',
      dataIndex: '',
      key: 'publicView.shareableLinkUrl',
      render: row => (
        <a href={row?.publicView?.shareableLinkUrl || '/'} target="_blank" className="text-ele">
          {row?.publicView?.shareableLinkUrl || '-'}
        </a>
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
      title: <span className="text-ele justify-content-center">Status</span>,
      dataIndex: 'isVerified',
      key: 'isVerified',
      ellipsis: {
        showTitle: false,
      },
      render: row => <span className="text-ele justify-content-center">{renderStatus(row)}</span>,
      width: '20%',
    },
    {
      title: <span className="text-ele">Verification Badge</span>,
      key: 'action',
      render: row => {
        return (
          <span>
            <Switch
              checkedChildren={<span>On</span>}
              unCheckedChildren={<span>Off</span>}
              checked={row.isVerified}
              onClick={() => changeStatus(row)}
            />
          </span>
        )
      },
      width: '10%',
    },
  ]
}

const renderStatus = isVerified => {
  let statusObj = {
    class: 'default',
  }
  if (isVerified === true) {
    statusObj = {
      status: 'Verified',
      class: 'success',
    }
  } else if (isVerified === false) {
    statusObj = {
      status: 'not Verified',
      class: 'danger',
    }
  }
  return <span className={`font-size-12 badge badge-${statusObj.class}`}>{statusObj.status}</span>
}

export default getColumns
