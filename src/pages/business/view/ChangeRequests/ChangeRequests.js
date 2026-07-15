import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'
import PayoutChangeRequests from 'pages/payoutChangeRequest/list'
import ActionFilter from '../../filter/actionFilter'
import './changeRequests.scss'
import PayoutFrequency from '../PayoutFrequency'

const ChangeRequests = ({ dispatch, paymentSetting, legalDetails }) => {
  const { id: businessId } = useParams()
  const [payoutStatus, setPayoutStatus] = useState('')
  const [debitCardCreationStatus, setDebitCardCreationStatus] = useState('')
  const [walletLoadStatus, setWalletLoadStatus] = useState('')
  const [submitLoading, setSubmitLoading] = useState(false)
  const [payByBankFrequency, setPayByBankFrequency] = useState({})
  const [payByFinanceFrequency, setPayByFinanceFrequency] = useState({})

  useEffect(() => {
    if (paymentSetting) {
      setDebitCardCreationStatus(paymentSetting?.isDebitCardCreationPaused ? 'pause' : 'active')
      setPayoutStatus(paymentSetting?.platformPayoutStatus ?? 'manual')
      setWalletLoadStatus(paymentSetting?.isWalletLoadPaused ? 'pause' : 'active')
    }
    if (legalDetails?.payoutFrequency?.payBybank) {
      const frequency = legalDetails?.payoutFrequency?.payBybank?.frequency || null
      const day = legalDetails?.payoutFrequency?.payBybank?.day || null
      setPayByBankFrequency({
        frequency,
        day,
      })
    }
    if (legalDetails?.payoutFrequency?.payByfinance) {
      const frequency = legalDetails?.payoutFrequency?.payByfinance?.frequency || null
      const day = legalDetails?.payoutFrequency?.payByfinance?.day || null
      setPayByFinanceFrequency({
        frequency,
        day,
      })
    }
  }, [paymentSetting, legalDetails])

  const handleActionFilterChange = (value, type) => {
    if (type === 'payoutStatus') {
      setPayoutStatus(value)
    } else if (type === 'debitCardCreationStatus') {
      setDebitCardCreationStatus(value)
    } else if (type === 'walletLoadStatus') {
      setWalletLoadStatus(value)
    }
  }

  const onSubmitStatusFilter = () => {
    setSubmitLoading(true)
    dispatch({
      type: 'business/RESTRICT_BUSINESS',
      payload: {
        payoutStatus,
        debitCardCreationStatus,
        walletLoadStatus,
        selectedBusinesses: [businessId],
      },
      setSubmitLoading,
    })
  }

  const onSubmitPayoutFrequency = frequencyType => {
    const requestPayload = {
      businessId,
      frequencyType,
    }
    if (frequencyType === 'payByBank') {
      requestPayload.payBybank = payByBankFrequency
    } else if (frequencyType === 'payByFinance') {
      requestPayload.payByfinance = payByFinanceFrequency
    }

    setSubmitLoading(true)
    dispatch({
      type: 'business/BUSINESS_PAYOUT_FREQUENCY',
      payload: requestPayload,
      setSubmitLoading,
    })
  }

  const handleChangePayoutFrequency = (value, name, frequencyType) => {
    if (frequencyType === 'payByBank') {
      setPayByBankFrequency({ ...payByBankFrequency, [name]: value })
    } else if (frequencyType === 'payByFinance') {
      setPayByFinanceFrequency({ ...payByFinanceFrequency, [name]: value })
    }
  }

  return (
    <div className="p-2">
      <div className="change-request">
        <div className="title">
          <p>Change Requests</p>
        </div>
        <PayoutChangeRequests businessId={businessId} isBusinessView />
      </div>
      <div className="restrict">
        <div className="title">
          <p>Restrict Business</p>
        </div>
        <ActionFilter
          handleActionFilterChange={handleActionFilterChange}
          onSubmitStatusFilter={onSubmitStatusFilter}
          payoutStatus={payoutStatus}
          debitCardCreationStatus={debitCardCreationStatus}
          walletLoadStatus={walletLoadStatus}
          submitLoading={submitLoading}
        />
      </div>
      <div className="restrict">
        <div className="title">
          <p>Pay By Bank Payout Frequency</p>
        </div>
        <PayoutFrequency
          handleChangePayoutFrequency={handleChangePayoutFrequency}
          onSubmitPayoutFrequency={onSubmitPayoutFrequency}
          payoutFrequency={payByBankFrequency}
          submitLoading={submitLoading}
          frequencyType="payByBank"
        />
      </div>
      <div className="restrict">
        <div className="title">
          <p>Pay By Finance Payout Frequency</p>
        </div>
        <PayoutFrequency
          handleChangePayoutFrequency={handleChangePayoutFrequency}
          onSubmitPayoutFrequency={onSubmitPayoutFrequency}
          payoutFrequency={payByFinanceFrequency}
          submitLoading={submitLoading}
          frequencyType="payByFinance"
        />
      </div>
    </div>
  )
}

const mapStateToProps = ({ dispatch }) => ({
  dispatch,
})

export default connect(mapStateToProps)(ChangeRequests)
