import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { DatePicker, Input, Button } from 'antd'
import ClearFilterButton from 'components/app/clearFilterButton'
/* eslint-disable */

const { RangePicker } = DatePicker
const { Search } = Input

const Index = ({
  handleFilterChange,
  clearFilter,
  startDate,
  endDate,
  keyword,
  onBulkUpdateClick,
  isBusinessSelected,
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
        <div className="filter-field">
          <label className="filter-label">Business Date Range</label>
          <RangePicker
            onChange={value => handleChange(value, 'date')}
            size={'large'}
            className="w-100"
            value={startDate && [moment(startDate, 'YYYY-MM-DD'), moment(endDate, 'YYYY-MM-DD')]}
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
        <div className="filter-field d-flex align-items-center">
          <ClearFilterButton clearFilter={clearFilter} />
          <Button
            type="primary"
            onClick={onBulkUpdateClick}
            disabled={!isBusinessSelected}
            size="large"
          >
            Bulk Update
          </Button>
        </div>
      </div>
    </>
  )
}

export default Index
