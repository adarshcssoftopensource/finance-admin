import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Select } from 'antd'

const { Option } = Select

const SubscriptionPlanDropDown = ({ plans: { plans }, dispatch, selectedValue, handleChange }) => {
  const [data, setData] = useState([])
  useEffect(() => {
    dispatch({
      type: 'plans/FETCH_ALL_PLANS',
      payload: {},
    })
  }, [dispatch])

  useEffect(() => {
    if (plans && plans.data) {
      const plansData = plans.data.plans
      const finalPlansData = plansData
        .filter(plan => plan.isActive)
        .map(eachPlan => {
          return {
            label: `${eachPlan?.title} ${eachPlan?.recurring}`,
            // eslint-disable-next-line no-underscore-dangle
            value: eachPlan?._id ?? '',
          }
        })
      setData(finalPlansData)
    }
  }, [plans])
  return (
    <div>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for */}
      <label className="filter-label">Subscription Plan</label>
      <Select
        className="w-100"
        placeholder="Status"
        size="large"
        defaultValue=""
        value={selectedValue}
        onChange={value => handleChange(value, 'subscriptionId')}
      >
        <Option value="">All</Option>
        {data.map(status => (
          <Option value={status.value}>{status.label}</Option>
        ))}
      </Select>
    </div>
  )
}

const mapStateToProps = ({ plans, dispatch }) => ({
  dispatch,
  plans,
})

export default connect(mapStateToProps)(SubscriptionPlanDropDown)
