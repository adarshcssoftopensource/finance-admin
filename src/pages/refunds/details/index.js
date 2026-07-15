import React, { useEffect, useCallback, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Spin } from 'antd'
import { connect } from 'react-redux'
import PaymentDetails from 'components/app/detailsComponents/paymentDetails'
import PaymentMethods from 'components/app/detailsComponents/paymentMethods'
import PaymentCustomer from 'components/app/detailsComponents/paymentCustomer'
import StripeRaw from 'components/app/detailsComponents/stripeRaw'
// import RelativeRefunds from 'components/app/detailsComponents/relativeRefunds'
import PayoutDetails from 'components/app/detailsComponents/payoutDetails'
import Header from 'components/app/detailsComponents/header'

/* eslint-disable */
const mapStateToProps = ({ refunds, dispatch, router }) => ({
  dispatch,
  router,
  refunds,
})
const Index = ({ refunds: { refund }, dispatch, router: { location } }) => {
  const [data, setData] = useState(null)
  // const [refundData, setRefundData] = useState(null)

  const initFetch = useCallback(
    refundId => {
      dispatch({
        type: 'refunds/FETCH_REFUND_DETAIL',
        payload: {
          refundId,
        },
      })
      // dispatch({
      //   type: 'refunds/FETCH_ALL_REFUNDS',
      //   payload: {
      //     qryString: `paymentId=${paymentId}&pageSize=500&pageNo=1`,
      //   },
      // })
    },
    [dispatch],
  )

  useEffect(() => {
    const refundId = splitId()
    initFetch(refundId)
  }, [initFetch])
  const splitId = () => location.pathname.split('/refunds/')[1]

  useEffect(() => {
    if (refund && refund.data) {
      setData(refund.data.refunds[0])
    }
  }, [refund])

  // useEffect(() => {
  //   setRefundData(refunds)
  // }, [refunds])

  return (
    <>
      <Helmet title="Refund: Details" />
      <div className="cui__utils__heading">
        <strong>Refund</strong>
      </div>
      {refund.loading ? (
        <div className="d-flex flex-wrap justify-content-center mt-5">
          <Spin />
        </div>
      ) : (
        <>
          {!data ? (
            <div className="d-flex flex-wrap justify-content-center mt-5">
              <Spin />
            </div>
          ) : (
            <>
              <Header data={data} type="refunds" />
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
              <StripeRaw data={data.rawRefundResponse} />
            </>
          )}
        </>
      )}
    </>
  )
}

export default connect(mapStateToProps)(Index)
