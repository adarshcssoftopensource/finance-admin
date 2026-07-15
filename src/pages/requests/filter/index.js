import React, { useEffect, useState } from 'react'
import { Select, Input, Button } from 'antd'
import ClearFilterButton from 'components/app/clearFilterButton'
/* eslint-disable */
const { Option } = Select
const { Search } = Input

export const REQUEST_TYPE_FILTER = [
  {
    label: 'Payout',
    value: 'payout',
  },
  {
    label: 'Refund',
    value: 'refund',
  },
]

const Index = ({
  handleFilterChange,
  clearFilter,
  requestType,
  keyword,
  isBulkUpdateDisabled,
  onBulkUpdateClick,
  allowBulkUpdate = false,
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
    <div className="row py-3">
      <div className="col-md-2 py-2">
        <label className="filter-label">Request Type</label>
        <Select
          className="w-100"
          placeholder="Status"
          size="large"
          defaultValue=""
          value={requestType}
          onChange={value => handleChange(value, 'requestType')}
        >
          <Option value="">All</Option>
          {REQUEST_TYPE_FILTER.map(requestType => (
            <Option value={requestType.value}>{requestType.label}</Option>
          ))}
        </Select>
      </div>
      <div className="col-md-3 py-2">
        <label className="filter-label">Search</label>
        <Search
          allowClear
          placeholder="Search by Business Id"
          size="large"
          onChange={handleSearchInput}
          value={keywords}
          onSearch={value => handleChange(value, 'keywords')}
        />
      </div>

      <div className="col-md-2 py-2">
        <label className="filter-label">&nbsp;</label>
        <div className={'filter-field d-flex align-items-center'}>
          <ClearFilterButton clearFilter={clearFilter} />
          {allowBulkUpdate ? (
            <Button
              type="primary"
              onClick={onBulkUpdateClick}
              disabled={isBulkUpdateDisabled}
              size="large"
            >
              Bulk Update
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default Index
