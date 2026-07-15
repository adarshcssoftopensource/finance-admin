import React from 'react'
import { Select, Button } from 'antd'
/* eslint-disable */

const { Option } = Select

const PAYOUT_STATUS = [
  {
    label: 'Manual',
    value: 'manual',
  },
  {
    label: 'Pause',
    value: 'pause',
  },
  {
    label: 'Blocked',
    value: 'blocked',
  },
]

const DEBIT_CARD_CREATION_STATUS = [
  {
    label: 'Active',
    value: 'active',
  },
  {
    label: 'Pause',
    value: 'pause',
  },
]

const WALLET_LOAD_STATUS = [
  {
    label: 'Active',
    value: 'active',
  },
  {
    label: 'Pause',
    value: 'pause',
  },
]

const Index = ({
  handleActionFilterChange,
  payoutStatus,
  debitCardCreationStatus,
  walletLoadStatus,
  onSubmitStatusFilter,
  submitLoading,
}) => {
  const handleChange = (value, type) => {
    handleActionFilterChange(value, type)
  }

  return (
    <>
      <div className="row col-md-12 py-3">
        <div className="col-md-3 py-2">
          <label className="filter-label">Payout Status</label>
          <Select
            value={payoutStatus}
            className="w-100"
            placeholder="Payout Status"
            size="large"
            onChange={value => handleChange(value, 'payoutStatus')}
          >
            <Option value="">All</Option>
            {PAYOUT_STATUS.map(type => (
              <Option value={type.value}>{type.label}</Option>
            ))}
          </Select>
        </div>
        <div className="col-md-3 py-2">
          <label className="filter-label">Debit Card Creation Status</label>
          <Select
            value={debitCardCreationStatus}
            className="w-100"
            placeholder="Debit Card Creation Status"
            size="large"
            onChange={value => handleChange(value, 'debitCardCreationStatus')}
          >
            <Option value="">All</Option>
            {DEBIT_CARD_CREATION_STATUS.map(type => (
              <Option value={type.value}>{type.label}</Option>
            ))}
          </Select>
        </div>

        <div className="col-md-3 py-2">
          <label className="filter-label">Wallet Load Status</label>
          <Select
            value={walletLoadStatus}
            className="w-100"
            placeholder="Wallet Load Status"
            size="large"
            onChange={value => handleChange(value, 'walletLoadStatus')}
          >
            <Option value="">All</Option>
            {WALLET_LOAD_STATUS.map(type => (
              <Option value={type.value}>{type.label}</Option>
            ))}
          </Select>
        </div>
        <div className="col-md-3 py-2">
          <label className="filter-label">&nbsp;</label>
          <Button
            type="primary"
            onClick={onSubmitStatusFilter}
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

export default Index
