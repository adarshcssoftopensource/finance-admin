import React, { useState } from 'react'
import { Button, Input } from 'antd'

const { TextArea } = Input
/* eslint-disable */

const Index = ({ onSubmitAdjustRewardPoints, disableSubmit = false }) => {
  const [state, setState] = useState({
    reason: '',
    points: 0,
  })

  const handleChange = (name, value) => {
    setState({ ...state, [name]: value })
  }

  const onSubmit = () => {
    onSubmitAdjustRewardPoints(state)
  }

  const isSubmitDisabled = () => {
    const { reason, points } = state
    return !reason?.trim() || !points.toString()?.trim()
  }

  return (
    <div className="w-100">
      <div className="row mb-3">
        <div className="col-md-12">
          <div>
            <span className="filter-label">Adjustment Points</span>
            <Input
              size="large"
              type="number"
              style={{
                fontSize: '32px',
                lineHeight: '32px',
                paddingTop: '0',
                paddingBottom: '0',
              }}
              value={state.points ?? ''}
              onChange={e => handleChange('points', e?.target?.value ?? '')}
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div>
            <span className="filter-label">Reason</span>
            <TextArea
              rows={5}
              value={state.reason ?? ''}
              onChange={e => handleChange('reason', e?.target?.value ?? '')}
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
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
    </div>
  )
}

export default Index
