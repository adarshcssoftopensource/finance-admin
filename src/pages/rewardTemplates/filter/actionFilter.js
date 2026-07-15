import React, { useState, useEffect } from 'react'
import { Select, Button, Input, InputNumber } from 'antd'
/* eslint-disable */

const { Option } = Select

const REWARD_TEMPLATE_STATUS = [
  {
    label: 'Active',
    value: 'true',
  },
  {
    label: 'InActive',
    value: 'false',
  },
]

const REWARD_TEMPLATE_TYPE = [
  {
    label: 'Dynamic',
    value: 'dynamic',
  },
  {
    label: 'Fixed',
    value: 'fixed',
  },
]

const REWARD_TEMPLATE_FREQUENCY = [
  {
    label: 'Instant',
    value: 'instant',
  },
  {
    label: 'Daily',
    value: 'daily',
  },
  {
    label: 'Weekly',
    value: 'weekly',
  },
  {
    label: 'Monthly',
    value: 'monthly',
  },
  {
    label: 'Annual',
    value: 'annual',
  },
]

const Index = ({ onEditRewardTemplate, editFormData, disableSubmit = false }) => {
  const [state, setState] = useState({
    rewardType: '',
    frequency: '',
    isActive: '',
    rewardPoints: 1,
    holdingDays: 0,
    expireDays: 0,
    subscriptionMultiplier: [],
    description: '',
  })

  useEffect(() => {
    setState({
      rewardType: editFormData?.rewardType || '',
      frequency: editFormData?.frequency || '',
      isActive: editFormData?.isActive ? 'true' : 'false',
      rewardPoints: editFormData?.rewardPoints || 1,
      holdingDays: editFormData?.holdingDays || 0,
      expireDays: editFormData?.expireDays || 0,
      subscriptionMultiplier: editFormData?.subscriptionMultiplier,
      description: editFormData?.description || '',
    })
  }, [editFormData])

  const handleChange = (name, value) => {
    setState({ ...state, [name]: value })
  }

  const handleSubscriptionMultiplierChange = (item, value) => {
    const updatedMultiplier = [...state.subscriptionMultiplier]
    updatedMultiplier.forEach(multiplier => {
      if (multiplier.planLevel === item.planLevel) {
        multiplier.multiplier = value
      }
    })
    setState({ ...state, subscriptionMultiplier: updatedMultiplier })
  }

  const onSubmit = () => {
    onEditRewardTemplate(state)
  }

  const isSubmitDisabled = () => {
    const {
      rewardType,
      frequency,
      isActive,
      rewardPoints,
      holdingDays,
      expireDays,
      subscriptionMultiplier,
      description,
    } = state
    let isError = false
    if (subscriptionMultiplier?.length) {
      for (let index = 0; index < subscriptionMultiplier?.length; index++) {
        const multiplierObj = subscriptionMultiplier[index]
        if (!multiplierObj.multiplier) {
          isError = true
        }
      }
    }
    return (
      !rewardType?.trim() ||
      !frequency?.trim() ||
      !isActive?.trim() ||
      !rewardPoints?.toString()?.trim() ||
      !holdingDays.toString()?.trim() ||
      !expireDays.toString()?.trim() ||
      !description.toString()?.trim() ||
      isError
    )
  }

  return (
    <>
      <div className="row col-md-12 py-3">
        <div className="col-md-12 py-2">
          <div>
            <span className="filter-label">Reward Type</span>
            <Select
              value={state.rewardType}
              className="w-100"
              placeholder="Reward Type"
              size="large"
              onChange={value => handleChange('rewardType', value)}
            >
              <Option value="">Select</Option>
              {REWARD_TEMPLATE_TYPE.map(type => (
                <Option value={type.value}>{type.label}</Option>
              ))}
            </Select>
          </div>
        </div>
      </div>
      <div className="row col-md-12 py-3">
        <div className="col-md-12 py-2">
          <label className="filter-label">Frequency</label>
          <Select
            value={state.frequency}
            className="w-100"
            placeholder="Frequency"
            size="large"
            onChange={value => handleChange('frequency', value)}
          >
            <Option value="">Select</Option>
            {REWARD_TEMPLATE_FREQUENCY.map(type => (
              <Option value={type.value}>{type.label}</Option>
            ))}
          </Select>
        </div>
      </div>
      <div className="row col-md-12 py-3">
        <div className="col-md-12 py-2">
          <div>
            <span className="filter-label">Reward Points</span>
            <Input
              type="number"
              className="mb-2"
              value={state.rewardPoints ?? ''}
              onChange={e => handleChange('rewardPoints', e?.target?.value ?? '')}
            />
          </div>
        </div>
      </div>
      <div className="row col-md-12 py-3">
        <div className="col-md-12 py-2">
          <div>
            <span className="filter-label">Holding Days</span>
            <Input
              type="number"
              className="mb-2"
              value={state.holdingDays ?? ''}
              onChange={e => handleChange('holdingDays', e?.target?.value ?? '')}
            />
          </div>
        </div>
      </div>
      <div className="row col-md-12 py-3">
        <div className="col-md-12 py-2">
          <div>
            <span className="filter-label">Expire Days</span>
            <Input
              type="number"
              className="mb-2"
              value={state.expireDays ?? ''}
              onChange={e => handleChange('expireDays', e?.target?.value ?? '')}
            />
          </div>
        </div>
      </div>
      <div className="row col-md-12 py-3">
        <div className="col-md-12 py-2">
          <label className="filter-label">Reward Template Status</label>
          <Select
            value={state.isActive}
            className="w-100"
            placeholder="Reward Template Status"
            size="large"
            onChange={value => handleChange('isActive', value)}
          >
            <Option value="">Select</Option>
            {REWARD_TEMPLATE_STATUS.map(type => (
              <Option value={type.value}>{type.label}</Option>
            ))}
          </Select>
        </div>
      </div>
      <div className="row col-md-12 py-3">
        <div className="col-md-12 py-2">
          <label className="filter-label">Description</label>
          <Input.TextArea
            type="textarea"
            className="mb-2"
            rows={3}
            value={state.description ?? ''}
            onChange={e => handleChange('description', e?.target?.value ?? '')}
          />
        </div>
      </div>
      {state?.subscriptionMultiplier?.length ? (
        <>
          <label className="filter-label">
            <b>Subscription Multiplier</b>
          </label>
          {state?.subscriptionMultiplier.map(item => {
            return (
              <div className="row col-md-12 py-3">
                <div className="col-md-12 py-2">
                  <label className="filter-label">{item?.title}</label>
                  <InputNumber
                    min={1}
                    type="number"
                    className="mb-2 w-100"
                    defaultValue={item.multiplier ?? ''}
                    onChange={e => handleSubscriptionMultiplierChange(item, e ?? '')}
                  />
                </div>
              </div>
            )
          })}
        </>
      ) : null}
      <div className="row col-md-12 py-3">
        <div className="col-md-12 py-2" style={{ flex: '0 0 14.6667%' }}>
          <label className="filter-label">&nbsp;</label>
          <Button
            type="primary"
            onClick={onSubmit}
            disabled={disableSubmit || isSubmitDisabled()}
            size="large"
          >
            Submit
          </Button>
        </div>
      </div>
    </>
  )
}

export default Index
