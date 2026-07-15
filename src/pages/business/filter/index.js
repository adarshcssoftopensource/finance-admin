import React, { useEffect, useState } from 'react'
import { Select, Input } from 'antd'
import ExportButton from 'components/app/exportButton'
import ClearFilterButton from 'components/app/clearFilterButton'
import CountryFilter from 'components/app/countryFilter'
import ProviderFilter from 'components/app/providerFilter'
import SubscriptionPlanDropDown from '../../../components/app/subscriptionPlanDropDown'
/* eslint-disable */
const { Option } = Select
const { Search } = Input
const ORGANIZATION_TYPE = [
  {
    label: 'Individuals',
    value: 'Individuals',
  },
  {
    label: 'Corporation',
    value: 'Corporation',
  },
  {
    label: 'Non-Profits',
    value: 'Non-Profits',
  },
  {
    label: 'Government',
    value: 'Government',
  },
]

const POB_STATUS_List = [
  { label: 'Not started', value: 'not_started' },
  { label: 'Started', value: 'started' },
  { label: 'Submitted', value: 'submitted' },
  { label: 'Awaiting approval', value: 'awaiting_approval' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Approved', value: 'approved' },
  { label: 'Active', value: 'verified' },
  { label: 'Need verification', value: 'need_verification' },
  { label: 'Blocked', value: 'blocked' },
]
const Index = ({
  handleFilterChange,
  clearFilter,
  qryString,
  isActive,
  countryId,
  pobStatus,
  businessType,
  providerName,
  keyword,
  subscriptionId,
}) => {
  const [keywords, setKeyword] = useState(keyword)
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
            value={isActive}
            className="w-100"
            placeholder="Status"
            size="large"
            onChange={handleChange}
          >
            <Option value="true">Active</Option>
            <Option value="false">Deactive</Option>
            <Option value="">All</Option>
          </Select>
        </div>
        <div className="filter-field field-sm">
          <label className="filter-label">Country</label>
          <CountryFilter value={countryId} handleChange={handleChange} />
        </div>
        <div className="filter-field field-sm">
          <label className="filter-label">Provider</label>
          <ProviderFilter value={providerName} handleChange={handleChange} />
        </div>
        <div className="filter-field field-sm">
          <label className="filter-label">Business Type</label>
          <Select
            value={businessType}
            className="w-100"
            placeholder="Business Type"
            size="large"
            onChange={value => handleChange(value, 'businessType')}
          >
            {ORGANIZATION_TYPE.map(type => (
              <Option value={type.value}>{type.label}</Option>
            ))}
            <Option value="">All</Option>
          </Select>
        </div>
        <div className="filter-field">
          <label className="filter-label">POB Status</label>
          <Select
            value={pobStatus}
            defaultValue=""
            className="w-100"
            placeholder="POB Status"
            size="large"
            onChange={value => handleChange(value, 'pobStatus')}
          >
            {POB_STATUS_List.map(type => (
              <Option value={type.value}>{type.label}</Option>
            ))}
            <Option value="">All</Option>
          </Select>
        </div>
        <div className="filter-field field-sm">
          <SubscriptionPlanDropDown
            value={subscriptionId}
            handleChange={value => handleChange(value, 'subscriptionId')}
          />
        </div>
        <div className="filter-field">
          <label className="filter-label">Search</label>
          <Search
            allowClear
            placeholder="Search by business name"
            size="large"
            onChange={handleSearchInput}
            value={keywords}
            onSearch={value => handleChange(value, 'keywords')}
          />
        </div>
        <div className="filter-field">
          <ClearFilterButton clearFilter={clearFilter} />
          <ExportButton type="businesses" varient="large" qryString={qryString} />
        </div>
      </div>
    </>
  )
}

export default Index
