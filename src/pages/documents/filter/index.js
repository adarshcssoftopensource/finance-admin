import React, { useEffect, useState } from 'react'
import { Input, Select } from 'antd'
import ClearFilterButton from 'components/app/clearFilterButton'

const { Search } = Input

/* eslint-disable */

export const DOCUMENTS_FILTER = [
  {
    label: 'Pending',
    value: 'pending',
  },
  {
    label: 'Submitted',
    value: 'submitted',
  },
  {
    label: 'Under Review',
    value: 'in_review',
  },
  {
    label: 'Verified',
    value: 'verified',
  },
  {
    label: 'Not Verified',
    value: 'unverified',
  },
]

const Index = ({ handleFilterChange, clearFilter, businessId, status }) => {
  const [selectedBusinessId, setBusinessId] = useState(businessId ? businessId : '')
  useEffect(() => {
    setBusinessId(businessId)
  }, [businessId])

  const handleChange = (value, type) => {
    handleFilterChange(value, type)
  }

  const handleSearchInput = e => {
    setBusinessId(e.target.value)
    handleFilterChange(e.target.value, 'businessId')
  }

  return (
    <div className="row py-3">
      <div className="col-md-3 py-2">
        <label className="filter-label">Search</label>
        <Search
          allowClear
          placeholder="Search by Business Id"
          size="large"
          value={selectedBusinessId}
          onChange={handleSearchInput}
          onSearch={value => handleChange(value, 'businessId')}
        />
      </div>

      <div className="col-md-2 py-2">
        <label className="filter-label">Status</label>
        <Select
          className="w-100"
          placeholder="Status"
          size="large"
          defaultValue=""
          value={status}
          onChange={value => handleChange(value, 'status')}
        >
          <Option value="">All</Option>
          {DOCUMENTS_FILTER.map(status => (
            <Option value={status.value}>{status.label}</Option>
          ))}
        </Select>
      </div>

      <div className="col-md-2 py-2">
        <label className="filter-label">&nbsp;</label>
        <ClearFilterButton clearFilter={clearFilter} />
      </div>
    </div>
  )
}

export default Index
