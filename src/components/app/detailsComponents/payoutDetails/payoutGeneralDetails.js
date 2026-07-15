import React from 'react'
import Card from 'components/app/card'
import { getAmountToDisplay, formateDate } from 'components/app/helper'
import Title from '../title'

/* eslint-disable */

function payoutGeneralDetails({ data }) {
  const renderStatus = dataStatus => {
    if (dataStatus.status === 'paid' || dataStatus.status === 'success') {
      return <sup className={`text-capitalize badge badge-success font-size-14`}>Success</sup>
    }
    return <sup className={`text-capitalize badge badge-danger font-size-14`}>Pending</sup>
  }

  return (
    <Card>
      <Title>Payout details</Title>
      {data && (
        <div className="col-12 pl-0">
          <div className="table-responsive">
            {data.ownAccount ? (
              <table className="table table-borderless">
                <tbody>
                  <tr>
                    <td className="text-gray-6 pl-0 pb-0">Amount</td>
                    <td className="pr-0 text-dark pb-0 text-right">
                      {getAmountToDisplay(data?.currency, data.amount)}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-gray-6 pl-0 pb-0">Start Date</td>
                    <td className="pr-0 text-dark pb-0 text-right">
                      {data.timeline && data.timeline.startDate
                        ? formateDate(data.timeline.startDate)
                        : formateDate(data.createdAt)}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-gray-6 pl-0 pb-0">Arrival Date</td>
                    <td className="pr-0 text-dark pb-0 text-right">
                      {data.timeline && data.timeline.arrivalDate
                        ? formateDate(data.timeline.arrivalDate || null)
                        : formateDate(data.updatedAt)}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-gray-6 pl-0 pb-0">Status</td>
                    <td className="pr-0 text-dark pb-0 text-right">{renderStatus(data)}</td>
                  </tr>
                  <tr>
                    <td className="text-gray-6 pl-0 pb-0">Business</td>
                    <td className="pr-0 text-primary pb-0 text-right">
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
                    </td>
                  </tr>
                  <tr>
                    <td className="text-gray-6 pl-0 pb-0">Payout ID</td>
                    <td className="pr-0 text-dark pb-0 text-right">{data?._id}</td>
                  </tr>
                  <tr>
                    <td className="text-gray-6 pl-0 pb-0">Provider Payout ID</td>
                    <td className="pr-0 text-dark pb-0 text-right">{data.payoutId}</td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <div className="d-flex flex-wrap justify-content-center my-5">
                No Payout Details Available
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  )
}

export default payoutGeneralDetails
