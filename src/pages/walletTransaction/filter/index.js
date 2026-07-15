import React, { useState, useEffect } from 'react'
import { Input, DatePicker } from 'antd'
// import ExportButton from 'components/app/exportButton'
import ClearFilterButton from 'components/app/clearFilterButton'
import ProviderFilter from 'components/app/providerFilter'
import moment from 'moment'
/* eslint-disable */
const { Search } = Input
const { RangePicker } = DatePicker

const Index = ({
  handleFilterChange,
  clearFilter,
  qryString,
  startDate,
  endDate,
  keyword,
  amount,
  providerName,
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
    <div className="filter-options">
      <div className="filter-field field-lg">
        <label className="filter-label">Wallet Date Range</label>
        <RangePicker
          onChange={value => handleChange(value, 'date')}
          size={'large'}
          className="w-100"
          value={startDate && [moment(startDate, 'YYYY-MM-DD'), moment(endDate, 'YYYY-MM-DD')]}
        />
      </div>

      <div className="filter-field field-lg">
        <label className="filter-label">Amount</label>
        <Input
          allowClear
          placeholder="Amount"
          onChange={e => handleChange(e.target.value, 'amount')}
          size={'large'}
          value={amount}
        />
      </div>

      <div className="filter-field field-sm">
        <label className="filter-label">Provider</label>
        <ProviderFilter value={providerName} handleChange={handleChange} />
      </div>

      <div className="filter-field field-lg">
        <label className="filter-label">Search</label>
        <Search
          allowClear
          placeholder="Search by keyword"
          size="large"
          onSearch={value => handleChange(value, 'keywords')}
          value={keywords}
          onChange={handleSearchInput}
        />
      </div>
      <div className="filter-field">
        <label className="filter-label">&nbsp;</label>
        <ClearFilterButton clearFilter={clearFilter} />
        {/* <ExportButton type="debitCards" varient="large" qryString={qryString} /> */}
      </div>
    </div>
  )
}

export default Index
