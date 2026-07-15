import React, { useEffect, useCallback, useState } from 'react'
import { connect } from 'react-redux'
import { Select } from 'antd'
import { capitalize } from 'lodash'
/* eslint-disable */
const { Option } = Select
const mapStateToProps = ({ plans, dispatch }) => ({
  plans,
  dispatch,
})

const Index = ({ handleChange, dispatch, plans: { plans }, planId, updatePlanId }) => {
  const [plansData, setPlansData] = useState([])

  const initFetch = useCallback(() => {
    dispatch({
      type: 'plans/FETCH_ALL_PLANS',
      payload: {},
    })
  }, [dispatch])
  useEffect(() => {
    if (!plans.data || plans.data.length == 0) {
      initFetch()
    } else {
      const plansData = plans.data.plans
      const defaultPlans = plansData.filter(
        plan =>
          plan.title === 'Premium' ||
          plan.title === 'Premium Pro' ||
          plan.title === 'Premium Elite',
      )
      updatePlanId(defaultPlans)
      setPlansData(plans.data.plans)
    }
  }, [initFetch])

  useEffect(() => {
    if (plans.data) {
      const plansData = plans.data.plans
      const finalPlansData = plansData.filter(plan => plan.isActive)
      const defaultPlans = finalPlansData.filter(
        plan =>
          plan.title === 'Premium' ||
          plan.title === 'Premium Pro' ||
          plan.title === 'Premium Elite',
      )
      updatePlanId(defaultPlans)
      setPlansData(finalPlansData)
    }
  }, [plans])

  return (
    <>
      <Select
        key={planId}
        showSearch
        mode="multiple"
        allowClear
        className="w-100"
        placeholder="Plan Level"
        size="large"
        defaultValue={planId}
        onChange={value => handleChange(value, 'planId')}
      >
        <Option disabled={planId.length && planId?.[0] !== ''} value="">
          All
        </Option>
        {plansData?.map(plan => {
          return (
            <Option value={plan._id}>
              {plan.title} ({capitalize(plan?.recurring)})
            </Option>
          )
        })}
      </Select>
    </>
  )
}

export default connect(mapStateToProps)(Index)
