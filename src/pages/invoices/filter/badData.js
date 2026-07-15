import React, { useState, useEffect } from 'react'
import { Input, DatePicker } from 'antd'
import ClearFilterButton from 'components/app/clearFilterButton'
import moment from 'moment'
/* eslint-disable */
const { Search } = Input
const { RangePicker } = DatePicker

const Index = ({ handleFilterChange, clearFilter, startDate, endDate, keyword, invoiceNumber }) => {
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
        <label className="filter-label">Invoice Date Range</label>
        <RangePicker
          onChange={value => handleChange(value, 'date')}
          size={'large'}
          className="w-100"
          value={startDate && [moment(startDate, 'YYYY-MM-DD'), moment(endDate, 'YYYY-MM-DD')]}
        />
      </div>
      <div className="filter-field">
        <label className="filter-label">Invoice Number</label>
        <Input.Group compact>
          <Input
            allowClear
            placeholder="Invoice Number"
            value={invoiceNumber}
            onChange={e => handleChange(e.target.value, 'invoiceNumber')}
            size={'large'}
          />
        </Input.Group>
      </div>
      <div className="filter-field field-xl">
        <label className="filter-label">Search</label>
        <Search
          allowClear
          placeholder="Search by invoice id, uuid and business ID"
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
