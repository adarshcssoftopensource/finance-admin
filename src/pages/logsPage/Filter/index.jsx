/* eslint-disable */
import React, { useImperativeHandle, useState } from 'react'
import ProviderFilter from '../../../components/app/providerFilter'
import { DatePicker, Input } from 'antd'

const { RangePicker } = DatePicker

const LogsFilter = React.forwardRef(({ selectedTab }, ref) => {
  const [filter, setFilter] = useState({})

  useImperativeHandle(
    ref,
    () => {
      return {
        filter,
      }
    },
    [filter.providerName, filter.businessId, filter.date],
  )

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          margin: '10px 0',
          gap: '15px',
        }}
      >
        {/* <div className="filter-field">
          <label className="filter-label">Business Id</label>
          <Input
            size="large"
            value={filter.businessId ?? ''}
            onChange={e => setFilter({ ...filter, businessId: e?.target?.value ?? '' })}
          />
        </div> */}
        <div className="filter-field" style={{ width: '200px' }}>
          <label className="filter-label">
            {selectedTab === 'error-logs' ? 'Source' : 'Provider'}
          </label>
          <ProviderFilter
            value={filter?.providerName}
            size={'large'}
            extraOptions={
              selectedTab === 'error-logs'
                ? [
                    {
                      label: 'Finance',
                      value: 'finance',
                    },
                  ]
                : []
            }
            handleChange={value => setFilter({ ...filter, providerName: value })}
          />
        </div>
        <div className="filter-field">
          <label className="filter-label">Date Range</label>
          <RangePicker
            onChange={value => setFilter({ ...filter, date: value })}
            size={'large'}
            className="w-100"
          />
        </div>
      </div>
    </div>
  )
})

export default LogsFilter
