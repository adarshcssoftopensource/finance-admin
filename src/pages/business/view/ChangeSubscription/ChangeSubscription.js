/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import { Button, DatePicker, Select } from 'antd'
import moment from 'moment'

const { Option } = Select
const { RangePicker } = DatePicker

const ChangeSubscription = ({ dispatch, plans: { plans }, subscriptionData, getSubscription }) => {
  const activeSubscription = subscriptionData?.find(
    item => item.isActive && item.status === 'Active',
  )
  const plansData = plans?.data?.plans

  const [activePlan, setActivePlan] = useState('')
  const [defaultRange, setDefaultRange] = useState([moment(moment.now()), moment().add(1, 'month')])
  const [startDate, setStartDate] = useState(moment(moment.now())?._d)
  const [endDate, setEndDate] = useState(moment().add(1, 'year')?._d)

  const initFetch = useCallback(() => {
    dispatch({
      type: 'plans/FETCH_ALL_PLANS',
      payload: {},
    })
  }, [dispatch])

  const handleChange = value => {
    const planPeriod = plansData?.find(plan => plan._id === value)?.recurring
    const defaultPeriod = planPeriod === 'monthly' ? 'month' : 'year'
    const defaultStartDate = moment(moment.now())
    const defaultEndDate = moment().add(1, defaultPeriod)
    setActivePlan(value)
    setDefaultRange([defaultStartDate, defaultEndDate])
    setStartDate(defaultStartDate)
    setEndDate(defaultEndDate)
  }

  const handleDateChange = dates => {
    setStartDate(dates?.[0]._d)
    setEndDate(dates?.[1]._d)
  }

  const handleUpdateSubscription = async () => {
    dispatch({
      type: 'subscriptions/UPDATE_SUBSCRIPTION',
      payload: {
        nextInvoiceDate: endDate,
        startDate,
        endDate,
        planId: activePlan,
      },
      data: {
        subscriptionId: activeSubscription?._id,
        getSubscription,
      },
    })
  }

  useEffect(() => {
    initFetch()
  }, [initFetch])

  useEffect(() => {
    setActivePlan(plansData?.[0]?._id)
  }, [plansData])

  return (
    <div className="p-2">
      <div className="change-request">
        <div className="title">
          <p>Change Subscription</p>
        </div>
      </div>
      <h6 className="text-capitalize mb-3">
        <strong>Active Plan:</strong> <span>{activeSubscription?.subscriptionName}</span>
      </h6>
      <div>
        <Select
          className="w-25 text-capitalize"
          placeholder="Plan Level"
          size="large"
          defaultValue="starter"
          value={activePlan}
          onChange={handleChange}
        >
          {plansData &&
            plansData.length > 0 &&
            plansData.map(plan => (
              <Option className="text-capitalize" value={plan._id}>
                {plan.title} ({plan?.recurring})
              </Option>
            ))}
        </Select>

        <RangePicker
          size="large"
          className="w-50 ml-2"
          defaultValue={[moment(moment.now()), moment().add(1, 'month')]}
          value={defaultRange}
          format="Do MMM YYYY"
          onChange={handleDateChange}
          disabledDate={current => {
            return moment().add(-1, 'days') >= current
          }}
        />

        <Button size="large" className="ml-2" color="primary" onClick={handleUpdateSubscription}>
          Submit
        </Button>
      </div>
    </div>
  )
}

const mapStateToProps = ({ plans, dispatch }) => ({
  plans,
  dispatch,
})

export default connect(mapStateToProps)(ChangeSubscription)
