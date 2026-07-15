/* eslint-disable */
import React, { useCallback, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { Spin } from 'antd'
import PaymentCapabilities from './payment'
import PayoutCapabilities from './payout'
import StripeRaw from '../../../../components/app/detailsComponents/stripeRaw'

const mapStateToProps = ({ business, dispatch, router }) => ({
  business,
  dispatch,
  router,
})

const Index = ({
  business: { capabilities, details, paymentSettings = {} },
  dispatch,
  router: { location },
}) => {
  const [loading, setLoding] = useState(true)
  const [paymentCapability, setPaymentCapability] = useState({})
  const [payoutCapability, setPayoutCapability] = useState({})
  const [providerCapabilities, setProviderCapabilities] = useState({})
  const [payoutEnabled, setPayoutEnabled] = useState(false)
  const [paymentEnabled, setPaymentEnabled] = useState(false)
  const [paymentSettingsState, setPaymentSettings] = useState({})

  const initFetch = useCallback(
    businessId => {
      dispatch({
        type: 'business/FETCH_BUSINESS_CAPABILITIES',
        payload: {
          businessId,
        },
      })
      dispatch({
        type: 'business/FETCH_BUSINESS_PAYMENT_SETTINGS',
        payload: {
          businessId,
        },
      })
    },
    [dispatch],
  )

  useEffect(() => {
    initFetch(location.pathname.split('/business/view/')[1])
  }, [initFetch])

  useEffect(() => {
    if (capabilities.capabilities) {
      setPaymentCapability(capabilities.capabilities.payments)
      setPayoutCapability(capabilities.capabilities.payouts)
      setProviderCapabilities(capabilities.capabilities?.providerCapabilities)
      setPaymentEnabled(capabilities.capabilities?.isVerified?.payment || false)
      setPayoutEnabled(capabilities.capabilities?.isVerified?.payout || false)
    }
  }, [capabilities.capabilities])

  useEffect(() => {
    if (!paymentSettings.loading) {
      setPaymentSettings(paymentSettings.paymentSettings)
    }
  }, [paymentSettings.loading])

  useEffect(() => {
    if (loading !== capabilities.loading) {
      setLoding(capabilities.loading)
    }
  }, [capabilities.loading])

  const handlePaymentSettingsJSON = event => {
    dispatch({
      type: 'business/UPDATE_BUSINESS_PAYMENT_SETTINGS',
      payload: {
        businessId: location.pathname.split('/business/view/')[1],
        data: { ...event?.updated_src },
      },
    })
  }

  if (loading) {
    return (
      <div className="d-flex flex-wrap justify-content-center mt-5">
        <Spin />
      </div>
    )
  }

  return (
    <>
      <Helmet title="Account Capabilities: Details" />
      <>
        <div className="row">
          <div className="col-12 col-md-6">
            <PaymentCapabilities data={paymentCapability} enabled={paymentEnabled} />
          </div>
          <div className="col-12 col-md-6">
            <PayoutCapabilities data={payoutCapability} enabled={payoutEnabled} />
          </div>
        </div>
        <div className="row">
          <div className={'w-100'}>
            <StripeRaw
              data={JSON.stringify(paymentSettingsState)}
              onEdit={true}
              title="Payment settings"
              handleEdit={handlePaymentSettingsJSON}
            />
          </div>
        </div>
        {details?.data?.business?.legal?.providerName === 'paypal' ? (
          <div className="row">
            <div className={'w-100'}>
              <StripeRaw
                data={JSON.stringify(providerCapabilities)}
                title="Provider capabilities"
              />
            </div>
          </div>
        ) : null}
      </>
    </>
  )
}

export default connect(mapStateToProps)(Index)
