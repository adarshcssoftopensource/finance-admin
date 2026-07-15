import React, { useState, useEffect } from 'react'
import { Button, Input } from 'antd'
import { fetchBusinessCredits } from 'services/business'

const AddCredits = ({ businessId, onSubmitAddCredits }) => {
  const [credits, setCredits] = useState('')
  const [availableCredits, setAvailableCredits] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!businessId) return
    setLoading(true)
    fetchBusinessCredits(businessId)
      .then(res => {
        console.log(res, 'res')
        setAvailableCredits(res?.result?.data?.credits?.availableCredits || 0)
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [businessId])

  const onSubmit = () => {
    const parsedCredits = Number(credits)
    if (!parsedCredits || parsedCredits <= 0) return

    onSubmitAddCredits({
      credits: parsedCredits,
    })
    setCredits('')
  }

  return (
    <div className="w-100">
      <div className="row mb-3">
        <div className="col-md-12">
          <span className="filter-label">Available Credits</span>
          <Input
            size="large"
            value={loading ? 'Loading...' : availableCredits}
            disabled
            style={{
              fontSize: '32px',
              lineHeight: '32px',
              marginBottom: '16px',
            }}
          />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-12">
          <span className="filter-label">Credits</span>
          <Input
            size="large"
            type="number"
            min={1}
            placeholder="Enter credits"
            value={credits}
            onChange={e => setCredits(e.target.value)}
            style={{
              fontSize: '32px',
              lineHeight: '32px',
            }}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <Button
            type="primary"
            size="large"
            onClick={onSubmit}
            disabled={!credits || Number(credits) <= 0}
            block
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AddCredits
