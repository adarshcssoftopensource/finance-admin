import React, { useState } from 'react'
import { Select, Button, Input } from 'antd'
/* eslint-disable */

const { Option } = Select

const REQUEST_STATUS = [
  {
    label: 'Approved',
    value: 'approved',
  },
  {
    label: 'Rejected',
    value: 'rejected',
  },
]

const Index = ({ onBulkUpdateStatus, disableSubmit = false }) => {
  const [state, setState] = useState({ requestStatus: '', rejectRequestReason: '' })

  const handleChange = (name, value) => {
    if (name === 'requestStatus' && (value === 'approved' || value === 'rejected')) {
      setState({ ...state, requestStatus: value, securityCode: '' })
    } else {
      setState({ ...state, [name]: value })
    }
  }

  const onSubmit = () => {
    onBulkUpdateStatus(state)
  }

  const isSubmitDisabled = () => {
    const { requestStatus } = state
    return !requestStatus?.trim()
  }

  return (
    <>
      <div className="row col-md-12 py-3">
        <div className="col-md-12 py-2">
          <label className="filter-label">Request Status</label>
          <Select
            value={state.requestStatus}
            className="w-100"
            placeholder="Payout Status"
            size="large"
            onChange={value => handleChange('requestStatus', value)}
          >
            <Option value="">Select</Option>
            {REQUEST_STATUS.map(type => (
              <Option value={type.value}>{type.label}</Option>
            ))}
          </Select>
        </div>
      </div>
      {state.requestStatus === 'rejected' ? (
        <div className="row col-md-12 py-3">
          <div className="col-md-12 py-2">
            <div>
              <span className="filter-label">Request Reject Reason</span>
              <Input
                className="mb-2"
                value={state.rejectRequestReason ?? ''}
                onChange={e => handleChange('rejectRequestReason', e?.target?.value ?? '')}
              />
            </div>
          </div>
        </div>
      ) : null}
      {state.requestStatus === 'approved' ? (
        <div className="row col-md-12 py-3">
          <div className="col-md-12 py-2">
            <div>
              <span className="filter-label">Security Code</span>
              <Input
                className="mb-2"
                placeholder="Required for Mass Communication"
                value={state.securityCode ?? ''}
                onChange={e => handleChange('securityCode', e?.target?.value ?? '')}
              />
            </div>
          </div>
        </div>
      ) : null}
      <div className="row col-md-12 py-3">
        <div className="col-md-12 py-2" style={{ flex: '0 0 14.6667%' }}>
          <label className="filter-label">&nbsp;</label>
          <Button
            type="primary"
            onClick={onSubmit}
            disabled={disableSubmit || isSubmitDisabled()}
            size="large"
          >
            Submit
          </Button>
        </div>
      </div>
    </>
  )
}

export default Index
