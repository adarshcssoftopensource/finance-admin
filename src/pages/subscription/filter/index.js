import React, { useState, useEffect } from 'react'
import { Select, Input, DatePicker } from 'antd'
import ExportButton from 'components/app/exportButton'
import ClearFilterButton from 'components/app/clearFilterButton'
import PlanLevelFilter from 'components/app/planLevelFilter'
import moment from 'moment'

/* eslint-disable */
const { Option } = Select
const { Search } = Input
const { RangePicker } = DatePicker

const Index = ({
  handleFilterChange,
  clearFilter,
  qryString,
  planId,
  updatePlanId,
  status,
  startDate,
  endDate,
  activationEndDate,
  activationStartDate,
  nextInvoiceStartDate,
  nextInvoiceEndDate,
  keyword,
  trial,
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
        <label className="filter-label">Created Date</label>
        <RangePicker
          onChange={value => handleChange(value, 'date')}
          value={startDate && [moment(startDate, 'YYYY-MM-DD'), moment(endDate, 'YYYY-MM-DD')]}
          size={'large'}
          className="w-100"
        />
      </div>
      <div className="filter-field">
        <label className="filter-label">Upcoming Invoice Date</label>
        <RangePicker
          onChange={value => handleChange(value, 'upcomingActivation')}
          size={'large'}
          className="w-100"
          value={
            activationEndDate && [
              moment(activationStartDate, 'YYYY-MM-DD'),
              moment(activationEndDate, 'YYYY-MM-DD'),
            ]
          }
        />
      </div>
      <div className="filter-field">
        <label className="filter-label">Next Invoice Date</label>
        <RangePicker
          onChange={value => handleChange(value, 'nextInvoiceDate')}
          size={'large'}
          className="w-100"
          value={
            nextInvoiceStartDate && [
              moment(nextInvoiceStartDate, 'YYYY-MM-DD'),
              moment(nextInvoiceEndDate, 'YYYY-MM-DD'),
            ]
          }
        />
      </div>
      <div className="filter-field field-sm">
        <label className="filter-label">Status</label>
        <Select
          className="w-100"
          placeholder="Status"
          size="large"
          defaultValue="Active"
          value={status}
          onChange={value => handleChange(value, 'status')}
        >
          <Option value="Active">Active</Option>
          <Option value="Completed">Completed</Option>
          <Option value="Upcoming">Upcoming</Option>
          <Option value="Canceled">Canceled</Option>
          <Option value="Incomplete">Incomplete</Option>
          <Option value="">All</Option>
        </Select>
      </div>

      <div className="filter-field">
        <label className="filter-label">Search</label>
        <Search
          allowClear
          placeholder="Search by Subscription id"
          size="large"
          onChange={handleSearchInput}
          value={keywords}
          onSearch={value => handleChange(value, 'keywords')}
        />
      </div>
      <div className="filter-field field-lg">
        <label className="filter-label">Plan Type</label>
        <PlanLevelFilter updatePlanId={updatePlanId} planId={planId} handleChange={handleChange} />
      </div>
      <div className="filter-field field-sm">
        <label className="filter-label">Trial</label>
        <Select
          className="w-100"
          placeholder="Trial"
          size="large"
          defaultValue=""
          value={trial ? trial : ''}
          onChange={value => handleChange(value, 'isTrial')}
        >
          <Option value="true">Trial</Option>
          <Option value="false">Not Trial</Option>
          <Option value="">All</Option>
        </Select>
      </div>
      <div className="filter-field">
        <label className="filter-label">&nbsp;</label>
        <ClearFilterButton clearFilter={clearFilter} />
        <ExportButton type="subscriptions" varient="large" qryString={qryString} />
      </div>
    </div>
  )
}

export default Index
