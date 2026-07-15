import React, { useEffect, useState } from 'react'
import { Select, Input } from 'antd'
import ClearFilterButton from 'components/app/clearFilterButton'
/* eslint-disable */
const { Option } = Select
const { Search } = Input

export const PAYOUT_CHANGE_REQUEST_STATUS_FILTER = [
  {
    label: 'Pending',
    value: 'pending',
  },
  {
    label: 'Approved',
    value: 'approved',
  },
  {
    label: 'Rejected',
    value: 'rejected',
  },
]

const Index = ({ handleFilterChange, clearFilter, status, keyword }) => {
  const [keywords, setKeyword] = useState(keyword)
  useEffect(() => {
    setKeyword(keyword)
  }, [keyword])

  const handleChange = (value, type) => {
    handleFilterChange(value, type)
  }

  const handleSearchInput = e => {
    setKeyword(e.target.value)
    if (e.target.value === '') {
      handleFilterChange(e.target.value, 'keywords')
    }
  }

  return (
    <div className="filter-options">
      <div className="filter-field field-lg">
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
          {PAYOUT_CHANGE_REQUEST_STATUS_FILTER.map(status => (
            <Option value={status.value}>{status.label}</Option>
          ))}
        </Select>
      </div>
      <div className="col-md-3 py-2">
        <label className="filter-label">Search</label>
        <Search
          allowClear
          placeholder="Search by Business Id"
          size="large"
          onChange={handleSearchInput}
          value={keywords}
          onSearch={value => handleChange(value, 'keywords')}
        />
      </div>

      <div className="filter-field">
        <label className="filter-label">&nbsp;</label>
        <ClearFilterButton clearFilter={clearFilter} />
      </div>
    </div>
  )
}

export default Index
