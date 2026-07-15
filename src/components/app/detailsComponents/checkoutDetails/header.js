import React from 'react'
import Card from 'components/app/card'
import Title from '../title'
import style from '../style.module.scss'
/* eslint-disable */

const header = ({ data }) => {
  const renderStatus = status => {
    let statusObj = {
      class: 'default',
    }
    if (status === 'Online') {
      statusObj = {
        class: 'success',
      }
    } else if (status === 'Offline') {
      statusObj = {
        class: 'default',
      }
    }
    if (status === 'Draft') {
      statusObj = {
        class: 'light',
      }
    }
    if (status === 'Archived') {
      statusObj = {
        class: 'warning',
      }
    } else if (status === 'Deleted') {
      statusObj = {
        class: 'danger',
      }
    }
    return <span className={`font-size-12 badge badge-${statusObj.class}`}>{status}</span>
  }

  return (
    <Card>
      <Title>
        {data?.itemName}
        <span
          className="font-weight-bold text-dark font-size-14 ml-2"
          style={{ verticalAlign: 'middle' }}
        >
          {renderStatus(data?.status)}
        </span>
      </Title>
      <ul className={`list-unstyled ${style.list}  pt-3`}>
        <li className={`${style.item} text-muted`}>
          <div className="text-uppercase mb-1">View Count</div>
          <div className="text-nowrap d-inline-block">
            <span className="font-weight-bold text-dark">{data?.report?.viewCount || 0}</span>
          </div>
        </li>
        <li className={`${style.item} text-muted`}>
          <div className="text-uppercase mb-1">Payment Count</div>
          <div className="text-nowrap d-inline-block">
            <span className="font-weight-bold text-dark">{data?.report?.paymentCount || 0}</span>
          </div>
        </li>
      </ul>
    </Card>
  )
}

export default header
