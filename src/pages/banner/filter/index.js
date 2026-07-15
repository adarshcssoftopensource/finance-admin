import React, { useState, useEffect } from 'react'
import { Select, Input, DatePicker } from 'antd'
import moment from 'moment'
import ExportButton from 'components/app/exportButton'
import ClearFilterButton from 'components/app/clearFilterButton'
/* eslint-disable */
const { Option } = Select
const { Search } = Input
const { RangePicker } = DatePicker

const Index = ({
  handleFilterChange,
  clearFilter,
  qryString,
  startDate,
  endDate,
  isActive,
  keyword,
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
      <div className="row py-3">
        <div className="col-md-2 py-2">
          <label className="filter-label">Status</label>
          <Select
            className="w-100"
            placeholder="Status"
            size="large"
            defaultValue="true"
            value={isActive}
            onChange={value => handleChange(value, 'status')}
          >
            <Option value="true">Active</Option>
            <Option value="false">Deactive</Option>
            <Option value="">All</Option>
          </Select>
        </div>
        <div className="col-md-4 py-2">
          <label className="filter-label">Created Date Range</label>
          <RangePicker
            value={startDate && [moment(startDate, 'YYYY-MM-DD'), moment(endDate, 'YYYY-MM-DD')]}
            onChange={value => handleChange(value, 'date')}
            size={'large'}
            className="w-100"
          />
        </div>
        <div className="col-md-5 py-2">
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
        <div className="col-md-2 py-2">
          <label className="filter-label">&nbsp;</label>
          <ClearFilterButton clearFilter={clearFilter} />
          <ExportButton type="users" varient="large" qryString={qryString} />
        </div>
      </div>
    </>
  )
}

export default Index
