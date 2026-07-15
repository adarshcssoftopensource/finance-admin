import React, { useEffect, useCallback, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Spin } from 'antd'
import { connect } from 'react-redux'
import PayoutDetails from 'components/app/detailsComponents/payoutDetails'
import RelativePayments from 'components/app/detailsComponents/relativePayments'
import PayoutGeneralDetails from 'components/app/detailsComponents/payoutDetails/payoutGeneralDetails'

const mapStateToProps = ({ payouts, dispatch, router }) => ({
  dispatch,
  router,
  payouts,
})
const Index = ({ payouts: { payout }, dispatch, router: { location } }) => {
  const [data, setData] = useState([])

  const initFetch = useCallback(
    payoutId => {
      dispatch({
        type: 'payouts/FETCH_PAYOUT_DETAIL',
        payload: {
          payoutId,
        },
      })
    },
    [dispatch],
  )

  useEffect(() => {
    const payoutId = splitId()
    initFetch(payoutId)
  }, [initFetch])
  const splitId = () => location.pathname.split('/payouts/')[1]

  useEffect(() => {
    if (payout && payout.data) {
      setData(payout.data.payouts[0])
    }
  }, [payout])

  return (
    <>
      <Helmet title="Refund: Details" />
      <div className="cui__utils__heading">
        <strong>Payout</strong>
      </div>
      {payout.loading ? (
        <div className="d-flex flex-wrap justify-content-center mt-5">
          <Spin />
        </div>
      ) : (
        <>
          <div className="row">
            <div className="col-12 col-md-6">
              <PayoutGeneralDetails data={data} />
            </div>
            <div className="col-12 col-md-6">
              <PayoutDetails data={data} />
            </div>
          </div>
          {data?.payments && data?.payments?.length ? (
            <RelativePayments payments={data.payments} />
          ) : null}
        </>
      )}
    </>
  )
}

export default connect(mapStateToProps)(Index)
