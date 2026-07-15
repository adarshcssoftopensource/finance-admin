import React, { useState } from 'react'
import { Button, Input } from 'antd'
import { Spinner } from 'reactstrap'

/* eslint-disable */

const Index = ({ onSubmitMigrateDataFromPeymynt, disableSubmit = false }) => {
  const [state, setState] = useState({
    businessId: '',
  })

  const handleChange = (name, value) => {
    setState({ ...state, [name]: value })
  }

  const onSubmit = () => {
    onSubmitMigrateDataFromPeymynt(state)
  }

  const isSubmitDisabled = () => {
    const { businessId } = state
    return !businessId?.trim()
  }

  return (
    <div className="w-100">
      <div className="row mb-3">
        <div className="col-md-12">
          <div>
            <span className="filter-label">Peymynt Business ID</span>
            <Input
              size="large"
              value={state.businessId ?? ''}
              onChange={e => handleChange('businessId', e?.target?.value ?? '')}
            />
          </div>
        </div>
        <div className="col-md-12">
          <span>
            <b>Note:</b> This will merge the data from peymynt database and it is not reversible.
          </span>
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
            Submit&nbsp;
            {disableSubmit && <Spinner size="sm" color="default" />}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Index
