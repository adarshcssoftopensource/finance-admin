/* eslint-disable */
import React, { useState } from 'react'
import { Button, InputNumber, Modal, notification, AutoComplete } from 'antd'
import { performTransferReversal } from 'services/business'
import Card from 'components/app/card'

const TransferReversal = ({ stripeAccountId: initialStripeAccountId }) => {
  const [stripeAccountId, setStripeAccountId] = useState(initialStripeAccountId || '')
  const [amount, setAmount] = useState(0)
  const [loading, setLoading] = useState(false)

  const stripeIds = initialStripeAccountId
    ? String(initialStripeAccountId)
        .split(',')
        .map(id => id.trim())
        .filter(Boolean)
    : []

  const handleReversal = () => {
    if (!stripeAccountId) {
      notification.error({ message: 'Stripe Account ID is required' })
      return
    }
    if (amount <= 0) {
      notification.error({ message: 'Amount must be greater than 0' })
      return
    }

    Modal.confirm({
      title: 'Confirm Transfer Reversal',
      content: `Are you sure you want to reverse up to $${amount} from Stripe account ${stripeAccountId}? This will move funds from the connected account back to the platform account.`,
      okText: 'Confirm',
      cancelText: 'Cancel',
      onOk: async () => {
        setLoading(true)
        try {
          const res = await performTransferReversal(stripeAccountId, amount)
          if (res && res.statusCode === 200) {
            notification.success({
              message: 'Transfer Reversal Successful',
              description: res.message || `Successfully reversed funds.`,
            })
          } else {
            notification.error({
              message: 'Transfer Reversal Failed',
              description: res?.message || 'Something went wrong',
            })
          }
        } catch (err) {
          notification.error({
            message: 'Transfer Reversal Error',
            description: err.message || 'Something went wrong',
          })
        } finally {
          setLoading(false)
        }
      },
    })
  }

  return (
    <Card>
      <div className="text-dark font-weight-bold font-size-24 border-bottom mb-4">
        Transfer Reversal (Account Closure)
      </div>
      <div className="row">
        <div className="col-lg-6">
          <div className="mb-3">
            <label className="form-label">Stripe Account ID</label>
            <AutoComplete
              style={{ width: '100%' }}
              placeholder="Select or enter Stripe Account ID"
              value={stripeAccountId}
              onChange={value => setStripeAccountId(value)}
              options={stripeIds.map(id => ({ value: id }))}
              filterOption={(inputValue, option) =>
                option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
              }
              allowClear
            />
          </div>
          <div className="mb-3">
            <label className="form-label d-block">Amount to Reverse ($)</label>
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              precision={2}
              value={amount}
              onChange={value => setAmount(value)}
            />
          </div>
          <Button type="primary" danger onClick={handleReversal} loading={loading}>
            Perform Reversal
          </Button>
          <div className="mt-4 text-muted">
            <p>
              <strong>Note:</strong> This tool will fetch transfers for the specified Account ID,
              starting from the earliest, and attempt to reverse them until the target amount is
              reached. Partial reversals are included.
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default TransferReversal
