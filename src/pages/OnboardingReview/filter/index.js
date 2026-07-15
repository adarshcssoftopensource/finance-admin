import React, { useEffect, useState } from 'react'
import { Select, Input, Button } from 'antd'
import ExportButton from 'components/app/exportButton'
import ClearFilterButton from 'components/app/clearFilterButton'
import CountryFilter from 'components/app/countryFilter'
import ProviderFilter from 'components/app/providerFilter'
/* eslint-disable */
const { Option } = Select
const { Search } = Input
const ORGANIZATION_TYPE = [
  {
    label: 'Individuals',
    value: 'individual',
  },
  {
    label: 'Corporation',
    value: 'company',
  },
  {
    label: 'Non-Profits',
    value: 'non_profit',
  },
  {
    label: 'Government',
    value: 'Government',
  },
]

const Index = ({
  handleFilterChange,
  clearFilter,
  qryString,
  countryId,
  businessType,
  keyword,
  selectedBusiness,
  blockLoading,
  handleBlock,
  providerName,
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
          <label className="filter-label">Country</label>
          <CountryFilter value={countryId} SortName={true} handleChange={handleChange} />
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
        <div className="filter-field field-sm">
          <label className="filter-label">Provider</label>
          <ProviderFilter value={providerName} handleChange={handleChange} />
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
          {selectedBusiness.length ? (
            <Button
              loading={blockLoading}
              type="primary"
              onClick={handleBlock}
              size="large"
              className="ml-2"
            >
              Bulk Block
            </Button>
          ) : (
            ''
          )}
        </div>
      </div>
    </>
  )
}

export default Index
