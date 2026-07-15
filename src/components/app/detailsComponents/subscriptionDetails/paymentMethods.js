import React from 'react'
import Card from 'components/app/card'
import { renderPaymentMethod, cardExpireDate } from 'components/app/helper'
import CopyToClipboard from 'components/app/copyToClipboard'
import Title from '../title'

function PaymentMethods({ data }) {
  return (
    <Card>
      <Title>Payment method</Title>
      {data && data.card && (
        <div className="col-12 pl-0">
          <div className="table-responsive">
            <table className="table table-borderless">
              <tbody>
                <tr>
                  <td className="text-gray-6 pl-0 pb-0">Cardholder`s name</td>
                  <td className="pr-0 text-dark pb-0 text-right">{data.card.cardHolderName}</td>
                </tr>
                <tr>
                  <td className="text-gray-6 pl-0 pb-0">Number</td>
                  <td className="pr-0 text-dark pb-0 text-right">{renderPaymentMethod(data)}</td>
                </tr>
                <tr>
                  <td className="text-gray-6 pl-0 pb-0">Expires</td>
                  <td className="pr-0 text-dark pb-0 text-right">{cardExpireDate(data.card)}</td>
                </tr>
                <tr>
                  <td className="text-gray-6 pl-0 pb-0">Type</td>
                  <td className="pr-0 text-dark pb-0 text-capitalize text-right">
                    {data.card.type} card
                  </td>
                </tr>
                <tr>
                  <td className="text-gray-6 pl-0 pb-0">Postal</td>
                  <td className="pr-0 text-dark pb-0 text-capitalize text-right">
                    {data.card.postal}
                  </td>
                </tr>
                <tr>
                  <td className="text-gray-6 pl-0 pb-0">Payment Method Id</td>
                  <td className="pr-0 text-dark pb-0 text-capitalize text-right">
                    <CopyToClipboard value={data.card.paymentMethodId} />
                    {data.card.paymentMethodId}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
      {data && !data.card && (
        <div className="col-12 pl-0 py-4 mt-2">
          <div className="d-flex flex-wrap justify-content-center my-5 pb-5">No Payment Method</div>
        </div>
      )}
    </Card>
  )
}

export default PaymentMethods
