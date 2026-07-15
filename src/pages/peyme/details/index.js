import React, { useEffect, useCallback, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Spin } from 'antd'
import { connect } from 'react-redux'
import Header from 'components/app/detailsComponents/header'
import PaymentDetails from 'components/app/detailsComponents/paymentDetails'
import PaymentMethods from 'components/app/detailsComponents/paymentMethods'
import PaymentCustomer from 'components/app/detailsComponents/paymentCustomer'
import StripeRaw from 'components/app/detailsComponents/stripeRaw'
import RelativeRefunds from 'components/app/detailsComponents/relativeRefunds'
import PayoutDetails from 'components/app/detailsComponents/payoutDetails'

const mapStateToProps = ({ refunds, payments, dispatch, router }) => ({
  payments,
  dispatch,
  router,
  refunds,
})
const Index = ({ refunds: { refunds }, dispatch, router: { location }, payments: { payment } }) => {
  const [data, setData] = useState([])
  const [refundData, setRefundData] = useState(null)

  const initFetch = useCallback(
    paymentId => {
      dispatch({
        type: 'payments/FETCH_PAYMENTS_DETAILS',
        payload: {
          paymentId,
        },
      })
      dispatch({
        type: 'refunds/FETCH_ALL_REFUNDS',
        payload: {
          qryString: `paymentId=${paymentId}&pageSize=500&pageNo=1`,
        },
      })
    },
    [dispatch],
  )

  useEffect(() => {
    const paymentId = splitId()
    initFetch(paymentId)
  }, [initFetch, splitId])
  const splitId = () => location.pathname.split('/payments/')[1]

  useEffect(() => {
    if (payment && payment.data) {
      setData(payment.data.payments[0])
    }
  }, [payment])

  useEffect(() => {
    setRefundData(refunds)
  }, [refunds])

  return (
    <>
      <Helmet title="Payments: Details" />
      <div className="cui__utils__heading">
        <strong>Payment</strong>
      </div>
      {payment.loading ? (
        <div className="d-flex flex-wrap justify-content-center mt-5">
          <Spin />
        </div>
      ) : (
        <>
          <Header data={data} />
          <div className="row">
            <div className="col-12 col-md-6">
              <PaymentDetails data={data} />
            </div>
            <div className="col-12 col-md-6">
              <PaymentMethods data={data} />
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-md-6">
              <PaymentCustomer data={data} />
            </div>
            <div className="col-12 col-md-6">
              <PayoutDetails data={data} />
            </div>
          </div>
          <RelativeRefunds refunds={refundData} />
          <StripeRaw data={data.rawChargeResponse} />
          {/* <RelativePayments payments={} /> */}
        </>
      )}
    </>
  )
}

export default connect(mapStateToProps)(Index)
