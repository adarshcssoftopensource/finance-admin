import React, { useState, useEffect } from 'react'
import { Input } from 'antd'
import ClearFilterButton from 'components/app/clearFilterButton'

const { Search } = Input

/* eslint-disable */

const Index = ({ handleFilterChange, clearFilter, countryId, keyword }) => {
  const [keywords, setKeyword] = useState(keyword ? keyword : '')
  useEffect(() => {
    setKeyword(keyword)
  }, [keyword])

  const handleChange = (value, type) => {
    handleFilterChange(value, type)
  }

  const handleSearchInput = e => {
    setKeyword(e.target.value)
    handleFilterChange(e.target.value, 'keywords')
  }

  return (
    <div className="row py-3">
      <div className="col-md-3 py-2">
        <label className="filter-label">Search</label>
        <Search
          allowClear
          placeholder="Search by country name"
          size="large"
          value={keywords}
          onChange={handleSearchInput}
          onSearch={value => handleChange(value, 'keywords')}
        />
      </div>

      <div className="col-md-2 py-2">
        <label className="filter-label">&nbsp;</label>
        <ClearFilterButton clearFilter={clearFilter} />
      </div>
    </div>
  )
}

export default Index
