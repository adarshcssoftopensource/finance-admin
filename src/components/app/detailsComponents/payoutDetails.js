import React from 'react'
import Card from 'components/app/card'
import Title from './title'

function payoutDetails({ data }) {
  return (
    <Card>
      <Title>Payout Bank details</Title>
      {data && (
        <div className="col-12 pl-0">
          <div className="table-responsive">
            {data.ownAccount ? (
              <table className="table table-borderless">
                <tbody>
                  <tr>
                    <td className="text-gray-6 pl-0 pb-0">Bank Name</td>
                    <td className="pr-0 text-dark pb-0 text-right">{data.ownAccount.bankName}</td>
                  </tr>
                  <tr>
                    <td className="text-gray-6 pl-0 pb-0">Number</td>
                    <td className="pr-0 text-dark pb-0 text-right">{data.ownAccount.mask}</td>
                  </tr>
                  {data.ownAccount.method && (
                    <tr>
                      <td className="text-gray-6 pl-0 pb-0">Type</td>
                      <td className="pr-0 text-dark pb-0 text-right">{data.ownAccount.method}</td>
                    </tr>
                  )}
                  <tr>
                    <td className="text-gray-6 pl-0 pb-0">&nbsp;</td>
                    <td className="pr-0 text-dark pb-0 text-right">&nbsp;</td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <div className="d-flex flex-wrap justify-content-center my-5">Not Connected Yet</div>
            )}
          </div>
        </div>
      )}
    </Card>
  )
}

export default payoutDetails
