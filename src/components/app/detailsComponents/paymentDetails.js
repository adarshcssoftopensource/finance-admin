import React from 'react'
import Card from 'components/app/card'
import { getAmountToDisplay } from 'components/app/helper'
import Title from './title'

function paymentDetails({ data }) {
  return (
    <Card>
      <Title>Payment details</Title>
      {data && (
        <div className="col-12 pl-0">
          <div className="table-responsive">
            <table className="table table-borderless">
              <tbody>
                <tr>
                  <td className="text-gray-6 pl-0 pb-0">Amount</td>
                  {data.amountBreakup && (
                    <td className="pr-0 text-dark pb-0 text-right">
                      {getAmountToDisplay(data.currency, data.amountBreakup.total)}
                    </td>
                  )}
                </tr>
                <tr>
                  <td className="text-gray-6 pl-0 pb-0">Fee</td>
                  {data.amountBreakup && (
                    <td className="pr-0 text-dark pb-0 text-right">
                      -{getAmountToDisplay(data.currency, data.amountBreakup.fee)}
                    </td>
                  )}
                </tr>
                <tr>
                  <td className="text-gray-6 pl-0 pb-0">Net</td>
                  {data.amountBreakup && (
                    <td className="pr-0 text-dark pb-0 text-right">
                      {getAmountToDisplay(data.currency, data.amountBreakup.net)}
                    </td>
                  )}
                </tr>
                <tr>
                  <td className="text-gray-6 pl-0 pb-0">Status</td>
                  <td className="pr-0 text-dark pb-0 text-right">{data.status}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Card>
  )
}

export default paymentDetails
