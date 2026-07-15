import React from 'react'
import { Select, Button } from 'antd'
/* eslint-disable */

const { Option } = Select

const PAYOUT_FREQUENCY = [
  {
    label: 'Daily',
    value: 1,
  },
  {
    label: 'Every 2 business days',
    value: 2,
  },
  {
    label: 'Weekly',
    value: 7,
  },
]

const PAYOUT_DAY = [
  {
    label: 'Monday',
    value: 1,
  },
  {
    label: 'Tuesday',
    value: 2,
  },
  {
    label: 'Wednesday',
    value: 3,
  },
  {
    label: 'Thrusday',
    value: 4,
  },
  {
    label: 'Friday',
    value: 5,
  },
]

const PayoutFrequency = ({
  handleChangePayoutFrequency,
  payoutFrequency,
  onSubmitPayoutFrequency,
  submitLoading,
  frequencyType,
}) => {
  const handleChange = (value, name, type) => {
    handleChangePayoutFrequency(value, name, type)
  }

  return (
    <>
      <div className="row col-md-12 py-3">
        <div className="col-md-4 py-2">
          <label className="filter-label">Payout frequency</label>
          <Select
            value={payoutFrequency?.frequency}
            className="w-100"
            placeholder="Payout Frequency"
            size="large"
            onChange={value => handleChange(value, 'frequency', frequencyType)}
          >
            <Option value={null}>Select</Option>
            {PAYOUT_FREQUENCY.map(type => (
              <Option value={type.value}>{type.label}</Option>
            ))}
          </Select>
        </div>
        <div className="col-md-3 py-2">
          <label className="filter-label">Payout day</label>
          <Select
            value={payoutFrequency?.day}
            className="w-100"
            placeholder="Payout Day"
            size="large"
            onChange={value => handleChange(value, 'day', frequencyType)}
          >
            <Option value={null}>Select</Option>
            {PAYOUT_DAY.map(type => (
              <Option value={type.value}>{type.label}</Option>
            ))}
          </Select>
        </div>
        <div className="col-md-3 py-2">
          <label className="filter-label">&nbsp;</label>
          <Button
            type="primary"
            onClick={() => onSubmitPayoutFrequency(frequencyType)}
            disabled={submitLoading}
            size="large"
          >
            Submit
          </Button>
        </div>
      </div>
    </>
  )
}

export default PayoutFrequency
