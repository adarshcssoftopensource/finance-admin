import React from 'react'
import { Select, Button } from 'antd'
/* eslint-disable */

const { Option } = Select

const VIRTUAL_CARD_STATUS = [
  {
    label: 'Block',
    value: 'blocked',
  },
  {
    label: 'UnBlock',
    value: 'active',
  },
]

const PHYSICAL_CARD_STATUS = [
  {
    label: 'Block',
    value: 'blocked',
  },
  {
    label: 'UnBlock',
    value: 'active',
  },
]

const Index = ({
  handleActionFilterChange,
  virtualCardStatus,
  physicalCardStatus,
  isWalletSelected,
  onSubmitStatusFilter,
  submitLoading,
  isBulkUpdateError,
}) => {
  const handleChange = (value, type) => {
    handleActionFilterChange(value, type)
  }

  return (
    <>
      <div className="row col-md-12 py-3">
        <div className="col-md-12 py-2">
          <label className="filter-label">Virtual Card Status</label>
          <Select
            value={virtualCardStatus}
            className="w-100"
            placeholder="Virtual Card Status"
            size="large"
            onChange={value => handleChange(value, 'virtualCardStatus')}
          >
            <Option value="">Select</Option>
            {VIRTUAL_CARD_STATUS.map(type => (
              <Option value={type.value}>{type.label}</Option>
            ))}
          </Select>
        </div>
      </div>
      <div className="row col-md-12 py-3">
        <div className="col-md-12 py-2">
          <label className="filter-label">Physical Card Status</label>
          <Select
            value={physicalCardStatus}
            className="w-100"
            placeholder="Physical Card Status"
            size="large"
            onChange={value => handleChange(value, 'physicalCardStatus')}
          >
            <Option value="">Select</Option>
            {PHYSICAL_CARD_STATUS.map(type => (
              <Option value={type.value}>{type.label}</Option>
            ))}
          </Select>
        </div>
      </div>
      {isBulkUpdateError ? (
        <div className="row col-md-12">
          <div className="col-md-12 py-2">
            <label className="filter-label text-danger">
              Select virtual or physical card status
            </label>
          </div>
        </div>
      ) : null}
      <div className="row col-md-12">
        <div className="col-md-12" style={{ flex: '0 0 14.6667%' }}>
          <label className="filter-label">&nbsp;</label>
          <Button
            type="primary"
            onClick={onSubmitStatusFilter}
            disabled={!isWalletSelected || submitLoading}
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
