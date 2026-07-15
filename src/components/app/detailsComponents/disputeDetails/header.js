/* eslint-disable */
import React from 'react'
import { Link } from 'react-router-dom'
import Card from 'components/app/card'
import Title from '../title'
import style from '../style.module.scss'
import { formateDate, getAmountToDisplay } from '../../../app/helper'

const header = ({ data, handleConcedeDispute, handleChallengeDispute }) => {
  const renderStatus = status => {
    let statusObj = {
      class: 'default',
    }
    if (status === 'resolved') {
      statusObj = {
        class: 'success',
      }
    } else if (status === 'pending') {
      statusObj = {
        class: 'default',
      }
    } else if (status === 'review') {
      statusObj = {
        class: 'warning',
      }
    }
    return <span className={`font-size-12 badge badge-${statusObj.class}`}>{status}</span>
  }

  const renderResolution = resolution => {
    let statusObj = {
      class: 'success',
    }
    if (resolution?.type === 'lost') {
      statusObj = {
        class: 'danger',
      }
    }
    return <span className={`font-size-12 badge badge-${statusObj.class}`}>{resolution?.type}</span>
  }

  return (
    <Card>
      <Title>
        <Link to={`/business/view/${data?.business?.id}`}>{data?.business?.organizationName}</Link>
        <span
          className="font-weight-bold text-dark font-size-14 ml-2"
          style={{ verticalAlign: 'middle' }}
        >
          {renderStatus(data?.status)}
        </span>
        <span className="font-weight-bold text-dark float-right font-size-14  pt-2 d-none">
          <button
            type="button"
            class="ant-btn mr-2 ant-btn-primary"
            onClick={handleChallengeDispute}
          >
            Challenge
          </button>
          <button type="button" class="ant-btn ant-btn-danger" onClick={handleConcedeDispute}>
            Concede
          </button>
        </span>
      </Title>
      <ul className={`list-unstyled ${style.list}  pt-3`}>
        <li className={`${style.item} text-muted`}>
          <div className="text-uppercase mb-1">Disputed Amount</div>
          <div className="text-nowrap d-inline-block">
            <span className="font-weight-bold text-dark">
              {getAmountToDisplay(data?.business?.currency, data?.disputedAmount)}
            </span>
          </div>
        </li>
        <li className={`${style.item} text-muted`}>
          <div className="text-uppercase mb-1">Transaction Amount</div>
          <div className="text-nowrap d-inline-block">
            <span className="font-weight-bold text-dark">
              {getAmountToDisplay(data?.business?.currency, data?.transactionAmount)}
            </span>
          </div>
        </li>
        <li className={`${style.item} text-muted`}>
          <div className="text-uppercase mb-1">Resolution</div>
          <div className="text-nowrap d-inline-block">
            {data?.resolution ? (
              <span className="font-weight-bold text-dark">
                {renderResolution(data?.resolution)}
              </span>
            ) : (
              <span className={`font-size-12 badge badge-pending`}>In Progress</span>
            )}
          </div>
        </li>
        <li className={`${style.item} text-muted`}>
          <div className="text-uppercase mb-1">Reason</div>
          <div className="text-nowrap d-inline-block">
            <span className="font-weight-bold text-dark">{data?.reason?.reason_message || ''}</span>
          </div>
        </li>
      </ul>
      <ul className={`list-unstyled ${style.list} pt-3`}>
        <li className={`${style.item} text-muted`}>
          <div className="text-uppercase mb-1">Payment For</div>
          <div className="text-nowrap d-inline-block">
            <a href={`${data?.url || ''}`} target="_balnk">
              <span className="font-weight-bold text-primary">{data?.paymentFor || ''}</span>
            </a>
          </div>
        </li>
        <li className={`${style.item} text-muted`}>
          <div className="text-uppercase mb-1">Payment ID</div>
          <div className="text-nowrap d-inline-block">
            <Link to={`/payments/${data?.paymentId}`}>
              <span className="font-weight-bold text-primary">{data?.paymentId || ''}</span>
            </Link>
          </div>
        </li>
        <li className={`${style.item} text-muted`}>
          <div className="text-uppercase mb-1">Provider Payment Transaction ID</div>
          <div className="text-nowrap d-inline-block">
            <span className="font-weight-bold text-dark">{data?.paymentTransactionId || ''}</span>
          </div>
        </li>
      </ul>
    </Card>
  )
}

export default header
