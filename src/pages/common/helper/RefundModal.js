import React, { useState, useEffect } from 'react'
import ModalWrapper from 'pages/common/helper/modal'

/* eslint-disable */
function RefundModal({ open, data, handleRefundModalClose, postRefund }) {
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const [refundType, setRefundType] = useState('full')
  const [amount, setAmount] = useState(0)
  const [includeProcessingFee, setIncludeProcessingFee] = useState(false)
  const [refundAmount, setRefundAmount] = useState(0)

  const currency = data?.currency
  const transactionId = data?._id

  useEffect(() => {
    const basePending =
      (data.amountBreakup?.net ?? data.amountBreakup.total) - (data.refund?.totalAmount ?? 0)
    setAmount(basePending)
    setRefundAmount(basePending)
    setIncludeProcessingFee(false)
  }, [data])

  const calculateFinal = (type, includeFee, amt) => {
    const { amountBreakup, refund } = data
    let final = 0

    const totalPending = (amountBreakup?.net ?? amountBreakup.total) - (refund?.totalAmount ?? 0)
    const tipPending = amountBreakup.tip - refund.tipAmount

    amt = parseFloat(amt || 0)

    if (type === 'full') {
      final = totalPending
    } else if (type === 'custom') {
      final = amt
      if (includeFee) {
        final += amountBreakup.total - amountBreakup.net || 0
      }
    } else if (type === 'tip') {
      final = tipPending
    }

    setRefundAmount(Number(final).toFixed(2))
  }

  const handleAmountChange = val => {
    setAmount(val)
    calculateFinal(refundType, includeProcessingFee, val)
  }

  const handleFeeToggle = checked => {
    setIncludeProcessingFee(checked)
    calculateFinal(refundType, checked, amount)
  }

  const handleTypeChange = type => {
    setRefundType(type)

    if (type === 'full') {
      const basePending =
        (data.amountBreakup?.net ?? data.amountBreakup.total) - (data.refund?.totalAmount ?? 0)

      setAmount(basePending)
      setIncludeProcessingFee(false)
      setRefundAmount(basePending)
    }

    if (type === 'custom') {
      calculateFinal('custom', includeProcessingFee, amount)
    }

    if (type === 'tip') {
      const tipPending = data.amountBreakup.tip - data.refund.tipAmount

      setAmount(tipPending)
      calculateFinal('tip', includeProcessingFee, tipPending)
    }
  }

  const handleSubmit = async () => {
    if (!reason.trim()) {
      setErrorMsg('Reason is required')
      return
    }

    setErrorMsg('')
    setLoading(true)

    const payload = {
      refundInput: {
        paymentId: transactionId,
        amount: parseFloat(amount),
        refundAmount: parseFloat(refundAmount),
        includeProcessingFee: refundType === 'full' ? false : includeProcessingFee,
        type: refundType,
        reason,
        notes: '',
      },
    }

    try {
      await postRefund(payload)
      handleRefundModalClose()
    } catch (err) {
      console.error(err)
      setErrorMsg(err?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ModalWrapper
      visible={open}
      closeModal={handleRefundModalClose}
      renderModalContent={{
        title: 'Refund Payment',
        type: 'custom',
        data: (
          <div>
            <div className="mb-3">
              <label className="font-weight-bold">Refund Amount</label>
              <input
                type="number"
                value={amount}
                disabled={refundType === 'full'}
                onChange={e => handleAmountChange(e.target.value)}
                className="form-control"
              />
            </div>

            <div className="mb-3">
              <label className="d-block font-weight-bold">Refund Type</label>

              <label className="d-block">
                <input
                  type="radio"
                  name="refundType"
                  checked={refundType === 'full'}
                  onChange={() => handleTypeChange('full')}
                />
                Refund full amount
              </label>

              <label className="d-block">
                <input
                  type="radio"
                  name="refundType"
                  checked={refundType === 'custom'}
                  onChange={() => handleTypeChange('custom')}
                />
                Refund custom amount
              </label>

              {data.amountBreakup.tip > 0 && (
                <label className="d-block">
                  <input
                    type="radio"
                    name="refundType"
                    checked={refundType === 'tip'}
                    onChange={() => handleTypeChange('tip')}
                  />
                  Refund tip amount
                </label>
              )}
            </div>

            <div className="mb-3">
              <label className="font-weight-bold">Include Processing Fee</label>
              <input
                type="checkbox"
                disabled={refundType === 'full'}
                checked={refundType === 'full' ? false : includeProcessingFee}
                onChange={e => handleFeeToggle(e.target.checked)}
                className="ms-2"
              />
            </div>

            <div className="mb-3">
              <strong>Final Refund:</strong> {refundAmount} {currency?.symbol || currency?.code}
            </div>

            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Enter refund reason"
              className="form-control mb-2"
            />

            {errorMsg && (
              <div className="text-danger mb-2" style={{ fontSize: '14px' }}>
                {errorMsg}
              </div>
            )}

            <button
              className="btn btn-primary w-100"
              type="button"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Submit Refund'}
            </button>
          </div>
        ),
      }}
    />
  )
}

export default RefundModal
