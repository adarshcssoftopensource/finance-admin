import React, { useEffect, useCallback, useState } from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { Spin } from 'antd'
import CheckoutDetails from 'components/app/detailsComponents/checkoutDetails'

const mapStateToProps = ({ checkouts, user, dispatch, router }) => ({
  checkouts,
  user,
  dispatch,
  router,
})
const Index = ({
  dispatch,
  router: { location },
  user,
  checkouts: { checkout, checkoutTimeline },
}) => {
  const [data, setData] = useState()
  const [timelineData, setTimelineData] = useState()

  const initFetch = useCallback(
    (checkoutId, businessId) => {
      dispatch({
        type: 'checkouts/FETCH_CHECKOUT_DETAILS',
        payload: {
          checkoutId,
          businessId,
        },
      })
    },
    [dispatch],
  )

  const fetchCheckoutTimeline = useCallback(
    (checkoutId, businessId) => {
      dispatch({
        type: 'checkouts/FETCH_CHECKOUT_TIMELINE',
        payload: {
          checkoutId,
          businessId,
          userId: user.id,
        },
      })
    },
    [dispatch],
  )

  useEffect(() => {
    const checkoutId = splitCheckoutId()
    const businessId = splitBusinessId()
    initFetch(checkoutId, businessId)
    fetchCheckoutTimeline(checkoutId, businessId)
  }, [initFetch])

  const splitCheckoutId = () => location.pathname.split('/checkouts/')[1].split('/')[0]
  const splitBusinessId = () => location.pathname.split('/checkouts/')[1].split('/')[1]

  useEffect(() => {
    if (checkout && checkout.data) {
      setData(checkout.data.checkout)
    }
  }, [checkout])

  useEffect(() => {
    if (checkoutTimeline && checkoutTimeline.data) {
      setTimelineData(checkoutTimeline.data)
    }
  }, [checkoutTimeline])
  /* eslint-disable */
  return (
    <>
      <Helmet title="Checkout: Details" />
      <div className="cui__utils__heading">
        <strong>Checkout Detail</strong>
      </div>
      {!data ? (
        <div className="d-flex flex-wrap justify-content-center mt-5">
          <Spin />
        </div>
      ) : (
        <>
          <CheckoutDetails data={data} checkoutTimeline={timelineData} />
        </>
      )}
    </>
  )
}

export default connect(mapStateToProps)(Index)
