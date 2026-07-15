import React from 'react'
import Header from './header'
import PaymentMethods from './paymentMethods'
import TrialDetails from './trial'
import StripeRaw from '../stripeRaw'

const Index = ({ data }) => {
  return (
    <>
      <Header data={data} />
      <div className="row">
        <div className="col-12 col-sm-6">
          <PaymentMethods data={data} />
        </div>
        <div className="col-12 col-sm-6">
          <TrialDetails data={data} />
        </div>
      </div>
      <StripeRaw data={data.stripeRaw} />
    </>
  )
}

export default Index
