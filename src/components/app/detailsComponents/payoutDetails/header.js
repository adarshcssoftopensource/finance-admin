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
    if (data.status === 'paid') {
      return <sup className={`text-capitalize badge badge-success font-size-14`}>Paid</sup>
    } else {
      return <sup className={`text-capitalize badge badge-danger font-size-14`}>Pending</sup>
    }
  }

  return (
    <Card>
      <Title>
        {getAmountToDisplay(currency, data.amount)} {renderStatus(data)}
      </Title>
      {data && (
        <ul className={`list-unstyled ${style.list}  pt-3`}>
          <li className={`${style.item} text-muted`}>
            <div className="text-uppercase mb-1">Start Date</div>
            <div className="text-nowrap d-inline-block">
              <span className="font-weight-bold text-dark">
                {data.timeline && data.timeline.startDate
                  ? formateDate(data.timeline.startDate)
                  : '--'}
              </span>
            </div>
          </li>
          <li className={`${style.item} text-muted`}>
            <div className="text-uppercase mb-1">Arrival Date</div>
            <div className="text-nowrap d-inline-block">
              <span className="font-weight-bold text-dark">
                {data.timeline && data.timeline.arrivalDate
                  ? formateDate(data.timeline.arrivalDate || null)
                  : '--'}
              </span>
            </div>
          </li>
          <li className={`${style.item} text-muted`}>
            <div className="text-uppercase mb-1">Status</div>
            <div className="text-nowrap d-inline-block">
              <span className="font-weight-bold text-dark text-capitalize">{data.status}</span>
            </div>
          </li>
          <li className={`${style.item} text-muted`}>
            <div className="text-uppercase mb-1">Business</div>
            <div className="text-truncate d-inline-block w-100">
              {data.business && (
                <a
                  href={`${process.env.REACT_APP_HOME_URL}/#/business/view/${data.business._id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-weight-bold kit__utils__link text-dark"
                >
                  {data.business.organizationName ? data.business.organizationName : ''}
                </a>
              )}
            </div>
          </li>
          <li className={`${style.item} text-muted`}>
            <div className="text-uppercase mb-1">Payout Id</div>
            <div className="text-truncate d-inline-block w-100">
              <span className="font-weight-bold text-dark">
                {data.stripePayoutId ? (
                  <>
                    <CopyToClipboard value={data.stripePayoutId} />
                    {data.stripePayoutId}
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
