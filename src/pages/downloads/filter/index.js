import React, { useState, useEffect } from 'react'
import { Select, Input, DatePicker } from 'antd'
import ClearFilterButton from 'components/app/clearFilterButton'
/* eslint-disable */
const { Option } = Select
const { Search } = Input
const { RangePicker } = DatePicker

const DOWNLOADS_STATUS = [
  {
    label: 'Progress',
    value: 'progress',
  },
  {
    label: 'Error',
    value: 'error',
  },
  {
    label: 'Completed',
    value: 'completed',
  },
]

const DOWNLOADS_EXPORT_STATUS = [
  {
    label: 'Users',
    value: 'users',
  },
  {
    label: 'Business',
    value: 'business',
  },
  {
    label: 'Payments',
    value: 'payments',
  },
]

const Index = ({ handleFilterChange, clearFilter, keyword, exportType, status }) => {
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
          {DOWNLOADS_STATUS.map(status => (
            <Option value={status.value}>{status.label}</Option>
          ))}
        </Select>
      </div>

      <div className="filter-field field-sm">
        <label className="filter-label">Export type</label>
        <Select
          className="w-100"
          placeholder="Status"
          size="large"
          defaultValue=""
          value={exportType}
          onChange={value => handleChange(value, 'export')}
        >
          <Option value="">All</Option>
          {DOWNLOADS_EXPORT_STATUS.map(status => (
            <Option value={status.value}>{status.label}</Option>
          ))}
        </Select>
      </div>
      <div className="filter-field">
        <ClearFilterButton clearFilter={clearFilter} />
      </div>
    </div>
  )
}

export default Index
