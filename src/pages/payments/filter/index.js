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
  startDate,
  endDate,
  status,
  keyword,
  amountFrom,
  amountTo,
  currency,
  paymentType,
  paymentMethod,
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
      <div className="filter-field">
        <label className="filter-label">Payment Date Range</label>
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
          <Option value="INITIATED">Initiated</Option>
          <Option value="PENDING">Pending</Option>
          <Option value="SUCCESS">Success</Option>
          <Option value="DECLINED">Declined</Option>
          <Option value="CANCELLED">Cancelled</Option>
          <Option value="FAILED">Failed</Option>
          <Option value="REFUNDED">Refunded</Option>
          <Option value="">All</Option>
        </Select>
      </div>

      <div className="filter-field field-sm">
        <label className="filter-label">Currency</label>
        <CurrencyFilter handleChange={handleChange} value={currency} />
      </div>

      <div className="filter-field field-sm">
        <label className="filter-label">Provider</label>
        <ProviderFilter value={providerName} handleChange={handleChange} />
      </div>

      <div className="filter-field field-sm">
        <label className="filter-label">Payment Type</label>
        <Select
          className="w-100"
          placeholder="Status"
          size="large"
          defaultValue=""
          value={paymentType}
          onChange={value => handleChange(value, 'paymentType')}
        >
          <Option value="Checkout">Checkout</Option>
          <Option value="Invoice">Invoice</Option>
          <Option value="Peyme">Finance.Me Lynk</Option>
          <Option value="">All</Option>
        </Select>
      </div>

      <div className="filter-field field-sm">
        <label className="filter-label">Payment Method</label>
        <Select
          className="w-100"
          placeholder="Status"
          size="large"
          defaultValue=""
          value={paymentMethod}
          onChange={value => handleChange(value, 'method')}
        >
          <Option value="card">Card</Option>
          <Option value="bank">Bank</Option>
          <Option value="manual">Manual</Option>
          <Option value="">All</Option>
        </Select>
      </div>

      <div className="filter-field field-md">
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

      <div className="filter-field field-lg">
        <label className="filter-label">Search {keywords}</label>
        <Search
          allowClear
          placeholder="Search by customer, email, id, uuid"
          size="large"
          value={keywords}
          onChange={handleSearchInput}
          onSearch={value => handleChange(value, 'keywords')}
        />
      </div>
      <div className="filter-field">
        <label className="filter-label">&nbsp;</label>
        <ClearFilterButton clearFilter={clearFilter} />
        <ExportButton type="payments" varient="large" qryString={qryString} />
      </div>
    </div>
  )
}

export default Index
