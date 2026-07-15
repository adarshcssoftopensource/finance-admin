import moment from 'moment'
import React, { useState, useEffect } from 'react'
import { Select, Input, DatePicker } from 'antd'
import ExportButton from 'components/app/exportButton'
import ClearFilterButton from 'components/app/clearFilterButton'
/* eslint-disable */
const { Option } = Select
const { Search } = Input
const { RangePicker } = DatePicker

const DISPUTE_STATUS_LIST = [
  { label: 'Pending', value: 'pending' },
  { label: 'Review', value: 'review' },
  { label: 'Resolved', value: 'resolved' },
]

const Index = ({
  handleFilterChange,
  clearFilter,
  qryString,
  status,
  keyword,
  startDate,
  endDate,
}) => {
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
            {DISPUTE_STATUS_LIST.map(type => (
              <Option value={type.value}>{type.label}</Option>
            ))}
          </Select>
        </div>
        <div className="filter-field">
          <label className="filter-label">Created Date Range</label>
          <RangePicker
            value={startDate && [moment(startDate, 'YYYY-MM-DD'), moment(endDate, 'YYYY-MM-DD')]}
            onChange={value => handleChange(value, 'date')}
            size={'large'}
            className="w-100"
          />
        </div>
        <div className="filter-field field-lg">
          <label className="filter-label">Search</label>
          <Search
            allowClear
            placeholder="Search by name, email, id, uuid"
            size="large"
            onChange={handleSearchInput}
            value={keywords}
            onSearch={value => handleChange(value, 'keywords')}
          />
        </div>
        <div className="filter-field">
          <label className="filter-label">&nbsp;</label>
          <ClearFilterButton clearFilter={clearFilter} />
          <ExportButton type="users" varient="large" qryString={qryString} />
        </div>
      </div>
    </>
  )
}

export default Index
