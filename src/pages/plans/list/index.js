import React, { useEffect, useCallback, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Spin } from 'antd'
import { connect } from 'react-redux'
import PriceCard from 'components/app/priceCard'

const mapStateToProps = ({ plans, dispatch }) => ({
  dispatch,
  plans,
})
const Index = ({ plans: { plans }, dispatch }) => {
  const [data, setData] = useState([])

  const initFetch = useCallback(() => {
    dispatch({
      type: 'plans/FETCH_ALL_PLANS',
      payload: {},
    })
  }, [dispatch])

  useEffect(() => {
    initFetch()
  }, [initFetch])

  useEffect(() => {
    if (plans && plans.data) {
      const plansData = plans.data.plans
      const finalPlansData = plansData.filter(plan => plan.isActive)
      setData(finalPlansData)
    }
  }, [plans])

  return (
    <>
      <Helmet title="Plans: List" />
      <div className="cui__utils__heading">
        <strong>Subscription Plans</strong>
      </div>
      {data.length > 0 ? (
        <div className="row">
          {data.map(plan => (
            <PriceCard plan={plan} key={plan.title} />
          ))}
        </div>
      ) : (
        <div className="d-flex flex-wrap justify-content-center mt-5">
          <Spin />
        </div>
      )}
    </>
  )
}

export default connect(mapStateToProps)(Index)
