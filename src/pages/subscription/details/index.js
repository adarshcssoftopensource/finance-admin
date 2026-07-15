import React, { useEffect, useCallback, useState } from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { Spin } from 'antd'
import SubscriptionDetails from 'components/app/detailsComponents/subscriptionDetails'
import SubscriptionPayments from 'pages/common/subscriptionPayments'

const mapStateToProps = ({ subscriptions, dispatch, router }) => ({
  subscriptions,
  dispatch,
  router,
})
const Index = ({ dispatch, router: { location }, subscriptions: { subscription } }) => {
  const [data, setData] = useState()

  const initFetch = useCallback(
    subscriptionId => {
      dispatch({
        type: 'subscriptions/FETCH_SUBSCRIPTION_DETAILS',
        payload: {
          subscriptionId,
        },
      })
    },
    [dispatch],
  )

  useEffect(() => {
    const subscriptionId = splitId()
    initFetch(subscriptionId)
  }, [initFetch])

  const splitId = () => location.pathname.split('/subscriptions/')[1]

  useEffect(() => {
    if (subscription && subscription.data) {
      setData(subscription.data.subscription)
    }
  }, [subscription])
  /* eslint-disable */
  return (
    <>
      <Helmet title="Subscription: Details" />
      <div className="cui__utils__heading">
        <strong>Subscription Detail</strong>
      </div>
      {!data ? (
        <div className="d-flex flex-wrap justify-content-center mt-5">
          <Spin />
        </div>
      ) : (
        <>
          <SubscriptionDetails data={data} />
          <SubscriptionPayments subscriptionId={data._id} />
        </>
      )}
    </>
  )
}

export default connect(mapStateToProps)(Index)
