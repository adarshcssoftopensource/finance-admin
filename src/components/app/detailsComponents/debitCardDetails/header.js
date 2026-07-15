import React from 'react'
import { isEmpty } from 'lodash'
import Card from 'components/app/card'
import { getAmountToDisplay } from 'components/app/helper'
/* eslint-disable */

const header = ({ data }) => {
  return (
    <div className="row">
      <div className="col-12 col-sm-6">
        <Card>
          <div className="text-nowrap text-dark font-size-24 font-weight-bold">
            Wallet Balance
            <span className="font-weight-bold text-dark float-right">
              {getAmountToDisplay(!isEmpty(data.currency) ? data.currency : null, data.balance)}
            </span>
          </div>
        </Card>
      </div>
      <div className="col-12 col-sm-6">
        <Card>
          <div className="text-nowrap text-dark font-size-24 font-weight-bold">
            Payout Balance
            <span className="font-weight-bold text-dark float-right">
              {getAmountToDisplay(
                !isEmpty(data.currency) ? data.currency : null,
                data.payoutBalance,
              )}
            </span>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default header
