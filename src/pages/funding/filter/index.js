import React, { useEffect, useState } from 'react'
import { DatePicker, Input, Select } from 'antd'
import ExportButton from 'components/app/exportButton'
import ClearFilterButton from 'components/app/clearFilterButton'
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
  isVerified,
  businessId,
}) => {
  const [businessIds, setBusinessId] = useState('')
  useEffect(() => {
    setBusinessId(businessId)
  }, [businessId])

  const handleChange = (value, type) => {
    handleFilterChange(value, type)
  }

  const handleSearchInput = e => {
    setBusinessId(e.target.value)
    if (e.target.value === '') {
      handleFilterChange(e.target.value, 'businessIds')
    }
  }

  return (
    <div className="filter-options">
      <div className="filter-field">
        <label className="filter-label">Finance.Me Lynk Date Range</label>
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
          value={isVerified}
          onChange={handleChange}
        >
          <Option value="true">Verified</Option>
          <Option value="false">Not Verified</Option>
          <Option value="">All</Option>
        </Select>
      </div>
      <div className="filter-field">
        <label className="filter-label">Search</label>
        <Search
          allowClear
          placeholder="Search by id"
          size="large"
          onChange={handleSearchInput}
          value={businessIds}
          onSearch={value => handleChange(value, 'businessIds')}
        />
      </div>
      <div className="filter-field">
        <ClearFilterButton clearFilter={clearFilter} />
        <ExportButton type="payments" varient="large" qryString={qryString} />
      </div>
    </div>
  )
}

export default Index
