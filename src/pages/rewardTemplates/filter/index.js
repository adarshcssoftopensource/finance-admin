import React, { useState, useEffect } from 'react'
import { Select, Input } from 'antd'
import ClearFilterButton from 'components/app/clearFilterButton'
/* eslint-disable */
const { Option } = Select
const { Search } = Input

const TEMPLATE_STATUS_LIST = [
  { label: 'Active', value: 'true' },
  { label: 'InActive', value: 'false' },
]

const RewardTemplatesFilter = ({ handleFilterChange, clearFilter, status, keyword }) => {
  const [keywords, setKeyword] = useState(keyword ? keyword : '')
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
    <>
      <div className="filter-options">
        <div className="filter-field field-sm">
          <label className="filter-label">Status</label>
          <Select
            className="w-100"
            placeholder="Status"
            size="large"
            defaultValue="true"
            value={status}
            onChange={value => handleChange(value, 'status')}
          >
            <Option value="">All</Option>
            {TEMPLATE_STATUS_LIST.map(type => (
              <Option value={type.value}>{type.label}</Option>
            ))}
          </Select>
        </div>
        <div className="filter-field">
          <label className="filter-label">Search</label>
          <Search
            allowClear
            placeholder="Search by reward name, uuid, id"
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
    </>
  )
}

export default RewardTemplatesFilter
