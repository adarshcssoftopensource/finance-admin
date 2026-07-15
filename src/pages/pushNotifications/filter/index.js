import React, { useEffect, useState } from 'react'
import { Input, Select } from 'antd'
import ClearFilterButton from 'components/app/clearFilterButton'

const { Search } = Input

/* eslint-disable */

export const PLATFORMS = [
  {
    label: 'Android',
    value: 'android',
  },
  {
    label: 'iOS',
    value: 'ios',
  },
]

const Index = ({ handleFilterChange, clearFilter, userId, platform }) => {
  const [selectedUserId, setUserId] = useState(userId ? userId : '')
  useEffect(() => {
    setUserId(userId)
  }, [userId])

  const handleChange = (value, type) => {
    handleFilterChange(value, type)
  }

  const handleSearchInput = e => {
    setUserId(e.target.value)
    handleFilterChange(e.target.value, 'userId')
  }

  return (
    <div className="row py-3">
      <div className="col-md-3 py-2">
        <label className="filter-label">Search</label>
        <Search
          allowClear
          placeholder="Search by User Id"
          size="large"
          value={selectedUserId}
          onChange={handleSearchInput}
          onSearch={value => handleChange(value, 'userId')}
        />
      </div>

      <div className="col-md-2 py-2">
        <label className="filter-label">Platform</label>
        <Select
          className="w-100"
          placeholder="Status"
          size="large"
          defaultValue=""
          value={platform}
          onChange={value => handleChange(value, 'platform')}
        >
          <Option value="">All</Option>
          {PLATFORMS.map(platform => (
            <Option value={platform.value}>{platform.label}</Option>
          ))}
        </Select>
      </div>

      <div className="col-md-2 py-2">
        <label className="filter-label">&nbsp;</label>
        <ClearFilterButton clearFilter={clearFilter} />
      </div>
    </div>
  )
}

export default Index
