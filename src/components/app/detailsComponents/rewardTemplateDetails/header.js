/* eslint-disable */
import React from 'react'
import { Link } from 'react-router-dom'
import Card from 'components/app/card'
import Title from '../title'
import style from '../style.module.scss'
import { formateDate } from '../../../app/helper'

const header = ({ data }) => {
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

  return (
    <Card>
      <Title>
        <Link to={`/reward-templates/${data?.id}`}>{data?.rewardName}</Link>
        <span
          className="font-weight-bold text-dark font-size-14 ml-2"
          style={{ verticalAlign: 'middle' }}
        >
          {renderStatus(data?.isActive)}
        </span>
        <h6>{data?.description || ''}</h6>
      </Title>
      <ul className={`list-unstyled ${style.list}  pt-3`}>
        <li className={`${style.item} text-muted`}>
          <div className="text-uppercase mb-1">Reward Points</div>
          <div className="text-nowrap d-inline-block">
            <span className="font-weight-bold text-dark">{data?.rewardPoints}</span>
          </div>
        </li>
        <li className={`${style.item} text-muted`}>
          <div className="text-uppercase mb-1">Frequency</div>
          <div className="text-nowrap d-inline-block">
            <span className="font-weight-bold text-dark">{data?.frequency}</span>
          </div>
        </li>
        <li className={`${style.item} text-muted`}>
          <div className="text-uppercase mb-1">Reward Type</div>
          <div className="text-nowrap d-inline-block">
            <span className="font-weight-bold text-dark">{data?.rewardType}</span>
          </div>
        </li>
        <li className={`${style.item} text-muted`}>
          <div className="text-uppercase mb-1">Reward Template Uuid</div>
          <div className="text-nowrap d-inline-block">
            <span className="font-weight-bold text-dark">{data?.uuid}</span>
          </div>
        </li>
      </ul>
      <ul className={`list-unstyled ${style.list} pt-3`}>
        <li className={`${style.item} text-muted`}>
          <div className="text-uppercase mb-1">Holding Days</div>
          <div className="text-nowrap d-inline-block">
            <span className="font-weight-bold text-dark">{data?.holdingDays}</span>
          </div>
        </li>
        <li className={`${style.item} text-muted`}>
          <div className="text-uppercase mb-1">Expire Days</div>
          <div className="text-nowrap d-inline-block">
            <span className="font-weight-bold text-dark">{data?.expireDays}</span>
          </div>
        </li>
        <li className={`${style.item} text-muted`}>
          <div className="text-uppercase mb-1">Created At</div>
          <div className="text-nowrap d-inline-block">
            <span className="font-weight-bold text-dark">
              {formateDate(data?.createdAt, 'MMM D, YYYY @ h:mm A')}
            </span>
          </div>
        </li>
      </ul>
    </Card>
  )
}

export default header
