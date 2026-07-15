import React, { useState, useEffect } from 'react'
import { Select, Input, DatePicker } from 'antd'
import ClearFilterButton from 'components/app/clearFilterButton'
import moment from 'moment'
/* eslint-disable */
const { Option } = Select
const { Search } = Input
const { RangePicker } = DatePicker

const CHECKOUT_STATUS = [
  {
    label: 'Draft',
    value: 'Draft',
  },
  {
    label: 'Online',
    value: 'Online',
  },
  {
    label: 'Offline',
    value: 'Offline',
  },
  {
    label: 'Archived',
    value: 'Archived',
  },
  {
    label: 'Deleted',
    value: 'Deleted',
  },
]

const Index = ({ handleFilterChange, clearFilter, startDate, endDate, keyword, status }) => {
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
    <div className="filter-options">
      <div className="filter-field">
        <label className="filter-label">Checkout Date Range</label>
        <RangePicker
          onChange={value => handleChange(value, 'date')}
          size={'large'}
          className="w-100"
          value={startDate && [moment(startDate, 'YYYY-MM-DD'), moment(endDate, 'YYYY-MM-DD')]}
        />
      </div>

      <div className="filter-field field-sm">
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
          {CHECKOUT_STATUS.map(status => (
            <Option value={status.value}>{status.label}</Option>
          ))}
        </Select>
      </div>

      <div className="filter-field field-xl">
        <label className="filter-label">Search</label>
        <Search
          allowClear
          placeholder="Search by checkout title, uuid and business ID"
          size="large"
          value={keywords}
          onChange={handleSearchInput}
          onSearch={value => handleChange(value, 'keywords')}
        />
      </div>
      <div className="filter-field">
        <ClearFilterButton clearFilter={clearFilter} />
      </div>
    </div>
  )
}

export default Index
