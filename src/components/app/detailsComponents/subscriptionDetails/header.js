import React from 'react'
import Card from 'components/app/card'
import { getAmountToDisplay, formateDate } from 'components/app/helper'
import CopyToClipboard from 'components/app/copyToClipboard'
import Title from '../title'
import style from '../style.module.scss'
/* eslint-disable */
const currency = {
  code: 'USD',
  displayName: 'USD ($) U.S. dollar',
  name: 'U.S. dollar',
  symbol: '$',
}
const header = ({ data }) => {
  const renderStatus = data => {
    if (data.status === 'Upcoming') {
      return <sup className={`text-capitalize badge badge-default font-size-14`}>Upcoming</sup>
    } else if (data.isActive) {
      return <sup className={`text-capitalize badge badge-success font-size-14`}>Active</sup>
    } else {
      return <sup className={`text-capitalize badge badge-danger font-size-14`}>De-active</sup>
    }
  }

  return (
    <Card>
      <Title>
        {getAmountToDisplay(currency, data.amount)} ({data.subscriptionName}){renderStatus(data)}
        <span className="font-weight-bold text-dark float-right font-size-14  pt-2">
          {data.stripeSubscriptionId ? (
            <>
              <CopyToClipboard value={data.stripeSubscriptionId} />
              {data.stripeSubscriptionId}
            </>
          ) : (
            ''
          )}
        </span>
      </Title>
      {data && (
        <ul className={`list-unstyled ${style.list}  pt-3`}>
          {data.upcomingActivationDate ? (
            <li className={`${style.item} text-muted`}>
              <div className="text-uppercase mb-1">Upcoming Date</div>
              <div className="text-nowrap d-inline-block">
                <span className="font-weight-bold text-dark">
                  {data.upcomingActivationDate
                    ? formateDate(data.upcomingActivationDate || null)
                    : '--'}
                </span>
              </div>
            </li>
          ) : (
            <li className={`${style.item} text-muted`}>
              <div className="text-uppercase mb-1">Start Date</div>
              <div className="text-nowrap d-inline-block">
                <span className="font-weight-bold text-dark">
                  {data.startDate ? formateDate(data.startDate || null) : '--'}
                </span>
              </div>
            </li>
          )}
          {data.endDate ? (
            <li className={`${style.item} text-muted`}>
              <div className="text-uppercase mb-1">End Date</div>
              <div className="text-nowrap d-inline-block">
                <span className="font-weight-bold text-dark">
                  {data.endDate ? formateDate(data.endDate || null) : '--'}
                </span>
              </div>
            </li>
          ) : (
            <li className={`${style.item} text-muted`}>
              <div className="text-uppercase mb-1">Next Invoice Date</div>
              <div className="text-nowrap d-inline-block">
                <span className="font-weight-bold text-dark">
                  {data.nextInvoiceDate ? formateDate(data.nextInvoiceDate || null) : '--'}
                </span>
              </div>
            </li>
          )}
          <li className={`${style.item} text-muted`}>
            <div className="text-uppercase mb-1">Status</div>
            <div className="text-nowrap d-inline-block">
              <span className="font-weight-bold text-dark">{data.status}</span>
            </div>
          </li>
          <li className={`${style.item} text-muted`}>
            <div className="text-uppercase mb-1">Business</div>
            <div className="text-truncate d-inline-block w-100">
              {data.businessId && (
                <a
                  href={`${process.env.REACT_APP_HOME_URL}/#/business/view/${data.businessId._id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-weight-bold kit__utils__link text-dark"
                >
                  {data.businessId.organizationName ? data.businessId.organizationName : ''}
                </a>
              )}
            </div>
          </li>
          <li className={`${style.item} text-muted`}>
            <div className="text-uppercase mb-1">Product Id</div>
            <div className="text-nowrap d-inline-block">
              <span className="font-weight-bold text-dark">
                {data.stripeProduceItemId ? (
                  <>
                    <CopyToClipboard value={data.stripeProduceItemId} />
                    {data.stripeProduceItemId}
                  </>
                ) : (
                  '--'
                )}
              </span>
            </div>
          </li>
        </ul>
      )}
    </Card>
  )
}

export default header
