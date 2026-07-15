/* eslint-disable*/
import React, { useEffect, useState } from 'react'
import { Button, Spinner, Input, CustomInput } from 'reactstrap'
import { EditOutlined } from '@ant-design/icons'
import { notification } from 'antd'
import Card from 'components/app/card'
import Title from 'components/app/detailsComponents/title'
import { updateBusinessLegals } from 'services/business'

const UpdatePaymentLimits = ({ business, dispatch }) => {
  const [monthlyLimit, setMonthlyLimit] = useState('')
  const [transactionLimit, setTransactionLimit] = useState('')
  const [onlinePayments, setOnlinePayments] = useState({
    card: true,
    bank: true,
    bnpl: true,
    crypto: true,
  })
  const [editable, setEditable] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!business) return
    setMonthlyLimit(business?.legal?.monthly_processing_limit || '')
    setTransactionLimit(business?.legal?.maxTransactionAmount || '')
    if (business?.legal?.onlinePayments) {
      setOnlinePayments(business.legal.onlinePayments)
    }
  }, [business])

  const handleUpdateLimits = async () => {
    setSaving(true)
    try {
      const payload = {
        monthly_processing_limit: Number(monthlyLimit),
        maxTransactionAmount: Number(transactionLimit),
        onlinePayments: onlinePayments,
        statement: {
          displayName:
            business?.legal?.statement?.displayName ||
            business?.organizationName?.substring(0, 22) ||
            'FINANCE',
        },
      }

      const response = await updateBusinessLegals(business._id, payload)
      if (response && response.statusCode === 200) {
        notification.success({ message: 'Payment settings updated successfully' })
        setEditable(false)
        // Refresh business details
        dispatch({
          type: 'business/FETCH_BUSINESS_DETAILS',
          payload: { businessId: business._id },
        })
      } else {
        notification.error({
          message: response?.message || 'Something went wrong while updating settings',
        })
      }
    } catch (err) {
      notification.error({ message: 'Something went wrong while updating settings' })
    } finally {
      setSaving(false)
    }
  }

  const handleToggle = key => {
    setOnlinePayments(prev => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  return (
    <div className="col-12">
      <Card>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Title>Payment Settings & Limits</Title>
          {!editable && (
            <EditOutlined
              className="cursor-pointer text-primary"
              onClick={() => setEditable(true)}
            />
          )}
        </div>
        <div className="row">
          <div className="col-md-6">
            <h6 className="mb-3 font-weight-bold">Transaction Limits</h6>
            <div className="form-group mb-3">
              <label className="text-muted small text-uppercase font-weight-bold">
                Monthly Volume Limit
              </label>
              <Input
                type="number"
                disabled={!editable}
                value={monthlyLimit}
                onChange={e => setMonthlyLimit(e.target.value)}
                placeholder="0 (Unlimited)"
              />
            </div>
            <div className="form-group mb-4">
              <label className="text-muted small text-uppercase font-weight-bold">
                Max Transaction Size
              </label>
              <Input
                type="number"
                disabled={!editable}
                value={transactionLimit}
                onChange={e => setTransactionLimit(e.target.value)}
                placeholder="0 (Unlimited)"
              />
            </div>
          </div>
          <div className="col-md-6">
            <h6 className="mb-3 font-weight-bold">Enabled Payment Methods</h6>
            <div className="d-flex flex-column gap-3">
              {Object.keys(onlinePayments || {})
                .filter(key => key !== 'paypal')
                .map(method => (
                  <div key={method} className="d-flex justify-content-between align-items-center">
                    <span className="text-capitalize">
                      {method === 'bnpl' ? 'Digital Payments' : method}
                    </span>
                    <CustomInput
                      type="switch"
                      id={`switch-${method}`}
                      checked={onlinePayments[method]}
                      onChange={() => handleToggle(method)}
                      disabled={!editable}
                      label=""
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
        {editable && (
          <div className="d-flex gap-2 mt-4 pt-3 border-top">
            <Button color="primary" onClick={handleUpdateLimits} disabled={saving} className="px-4">
              {saving ? <Spinner size="sm" color="light" /> : 'Save Changes'}
            </Button>
            <Button color="link" className="text-muted" onClick={() => setEditable(false)}>
              Cancel
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}

export default UpdatePaymentLimits
