import React from 'react'
import Card from 'components/app/card'
import { renderPaymentMethod, cardExpireDate } from 'components/app/helper'
import Title from './title'

function PaymentMethods({ data }) {
  return (
    <Card>
      <Title>Payment methods</Title>
      {data && (
        <div className="col-12 pl-0">
          <div className="table-responsive">
            <table className="table table-borderless">
              {data.method === 'card' && data.card && (
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
                </tbody>
              )}
              {data.method === 'bank' && data.bank && (
                <tbody>
                  <tr>
                    <td className="text-gray-6 pl-0 pb-0">Bank name</td>
                    <td className="pr-0 text-dark pb-0 text-right">{data.bank.name}</td>
                  </tr>
                  <tr>
                    <td className="text-gray-6 pl-0 pb-0">Number</td>
                    <td className="pr-0 text-dark pb-0 text-right">{renderPaymentMethod(data)}</td>
                  </tr>
                  <tr>
                    <td className="text-gray-6 pl-0 pb-0">Type</td>
                    <td className="pr-0 text-dark pb-0 text-capitalize text-right">
                      {data.bank.type}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-gray-6 pl-0 pb-0">Account Id</td>
                    <td className="pr-0 text-dark pb-0 text-capitalize text-right">
                      {data.bank.accountId}
                    </td>
                  </tr>
                </tbody>
              )}
              {data.method === 'manual' && (
                <tbody>
                  <tr>
                    <td className="text-gray-6 pl-0 pb-0">Type</td>
                    <td className="pr-0 text-dark pb-0 text-capitalize text-right">Manual</td>
                  </tr>
                </tbody>
              )}
            </table>
          </div>
        </div>
      )}
    </Card>
  )
}

export default PaymentMethods
