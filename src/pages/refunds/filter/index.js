import React, { useState, useEffect } from 'react'
import { Select, Input, DatePicker } from 'antd'
import ExportButton from 'components/app/exportButton'
import ClearFilterButton from 'components/app/clearFilterButton'
import CurrencyFilter from 'components/app/currencyFilter'
import ProviderFilter from 'components/app/providerFilter'
import moment from 'moment'
/* eslint-disable */
const { Option } = Select
const { Search } = Input
const { RangePicker } = DatePicker

const Index = ({
  handleFilterChange,
  clearFilter,
  qryString,
  keyword,
  status,
  currency,
  startDate,
  endDate,
  amountFrom,
  amountTo,
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
        <label className="filter-label">Payment Date Range</label>
        <RangePicker
          value={startDate && [moment(startDate, 'YYYY-MM-DD'), moment(endDate, 'YYYY-MM-DD')]}
          onChange={value => handleChange(value, 'date')}
          size={'large'}
          className="w-100"
        />
      </div>
      <div className="filter-field field-lg">
        <label className="filter-label">Amount Range</label>
        <Input.Group compact>
          <Input
            allowClear
            placeholder="From"
            style={{ width: '50%' }}
            value={amountFrom}
            onChange={e => handleChange(e.target.value, 'amountFrom')}
            size={'large'}
          />
          <Input
            allowClear
            placeholder="To"
            style={{ width: '50%' }}
            value={amountTo}
            onChange={e => handleChange(e.target.value, 'amountTo')}
            size={'large'}
          />
        </Input.Group>
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
          <Option value="REFUNDED">Refunded </Option>
          <Option value="INITIATED">Initiated</Option>
          <Option value="">All</Option>
        </Select>
      </div>
      <div className="filter-field field-sm">
        <label className="filter-label">Currency</label>
        <CurrencyFilter value={currency} handleChange={handleChange} />
      </div>
      <div className="filter-field field-sm">
        <label className="filter-label">Provider</label>
        <ProviderFilter value={providerName} handleChange={handleChange} />
      </div>
      <div className="filter-field field-lg">
        <label className="filter-label">Search</label>
        <Search
          allowClear
          placeholder="Search by id, uuid, refund id, email,customer"
          size="large"
          value={keywords}
          onChange={handleSearchInput}
          onSearch={value => handleChange(value, 'keywords')}
        />
      </div>
      <div className="filter-field">
        <ClearFilterButton clearFilter={clearFilter} />
        <ExportButton type="refunds" varient="large" qryString={qryString} />
      </div>
    </div>
  )
}

export default Index
