/* eslint-disable*/
import React, { useState } from 'react'
import { Collapse, notification } from 'antd'
import { Input, Spinner } from 'reactstrap'
import { formateDate } from 'components/app/helper'
import CopyToClipboard from 'components/app/copyToClipboard'
import { riskLevelIcons } from '../../../../components/app/CommonTableFormatter/businessTableFormatter'
import { updateOnboardingDataStatus } from 'services/business'

const BANK_PROVIDER_MAPPING = {
  provider: {
    name: 'Provider',
    isCopyEnabled: false,
  },
  merchantIds: {
    name: 'Merchant ID',
    isCopyEnabled: true,
  },
  merchantRefId: {
    name: 'Merchant Ref ID',
    isCopyEnabled: true,
  },
  bankAccountId: {
    name: 'Bank Account ID',
    isCopyEnabled: true,
  },
  merchantStatus: {
    name: 'Merchant Status',
    isCopyEnabled: false,
  },
  bankAccountStatus: {
    name: 'Bank Account Status',
    isCopyEnabled: false,
  },
  onboardingStatus: {
    name: 'Onboarding Status',
    isCopyEnabled: false,
  },
  createdAt: {
    name: 'Created At',
    isCopyEnabled: false,
  },
  updatedAt: {
    name: 'Updated At',
    isCopyEnabled: false,
  },
}

const RejctbtnShow = ['awaiting_approval', 'rejected', 'approved', 'submitted']
const BlockbtnShow = ['awaiting_approval', 'rejected', 'approved', 'submitted']

const SubmittoProvShow = ['started', 'awaiting_approval']

const PayByBankProvider = ({ payAsBank, businessId, payByBankStatus }) => {
  const [remarks, setRemarks] = useState('')
  const [errorMessage, setErrorMessage] = useState([])
  const [approveloading, setApproveloading] = useState(false)
  const [rejectloading, setRejectloading] = useState(false)
  const [blockloading, setBlockloading] = useState(false)

  const latestBankAccount = payAsBank?.bankAccounts?.[payAsBank?.bankAccounts?.length - 1]
  const isPayByBankEnabled =
    payAsBank?.merchantStatus === 'verified' && latestBankAccount?.status === 'verified'
  const payAsBankData = {
    ...payAsBank,
    bankAccountId: latestBankAccount?.id,
    bankAccountStatus: latestBankAccount?.status,
    onboardingStatus: payAsBank?.onboardingStatus,
  }

  const updateOnboardingStatus = async (status, businessId, isPayByBank = true) => {
    if (status === 'approved') {
      setApproveloading(true)
    }
    if (status === 'rejected') {
      setRejectloading(true)
    }
    if (status === 'blocked') {
      setBlockloading(true)
    }
    await updateOnboardingDataStatus(status, businessId, remarks, isPayByBank).then(async res => {
      if (res && res.statusCode === 200) {
        notification.success({
          message: res.message,
        })
        setRemarks('')
        setErrorMessage([])
        window.location.reload()
      } else {
        setErrorMessage(
          res?.error?.details && res?.error?.details.length
            ? res?.error?.details
            : res?.error?.message && res?.error?.message.length
            ? res?.error?.message
            : res?.message
            ? [{ message: res?.message }]
            : [],
        )
        notification.error({
          message: res?.error?.error_message || res.message,
        })
      }
      if (status === 'approved') {
        setApproveloading(false)
      }
      if (status === 'rejected') {
        setRejectloading(false)
      }
      if (status === 'blocked') {
        setBlockloading(false)
      }
    })
  }
  return (
    <>
      <div className="text-dark font-weight-bold font-size-24 border-bottom">
        <span className="mr-3">Pay By Bank Provider</span>
        {isPayByBankEnabled ? <span className="mr-3">{riskLevelIcons('low')}</span> : null}
      </div>
      <div className="d-flex">
        <div className="col-6 pl-0">
          <div className="table-responsive">
            <table className="table table-borderless">
              <tbody>
                {Object.keys(BANK_PROVIDER_MAPPING).map(key => {
                  const value = payAsBankData?.[key]
                  return (
                    <tr key={key}>
                      <td className="text-gray-6 pl-0 pb-0">{BANK_PROVIDER_MAPPING[key].name}</td>
                      <td className="pr-0 text-dark pb-0 text-right">
                        {(key === 'createdAt' || key === 'updatedAt') && value
                          ? formateDate(value)
                          : value}
                        {BANK_PROVIDER_MAPPING[key].isCopyEnabled && value && (
                          <CopyToClipboard value={value} />
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {(payAsBank?.bankAccounts || []).length ? (
          <div className="col-6 pl-0">
            <div className="table-responsive">
              <Collapse className="mt-2 gap-5" defaultActiveKey={['1']}>
                {(payAsBank?.bankAccounts || []).map((account, index) => (
                  <Collapse.Panel header={`Bank Account ${index + 1}`} key={index + 1} ope>
                    <table className="table table-borderless">
                      <tbody>
                        <tr>
                          <td className="text-gray-6 pl-0">Account Holder Name</td>
                          <td className="text-right">{account.accountHolderName}</td>
                        </tr>
                        <tr>
                          <td className="text-gray-6 pl-0">Account Number</td>
                          <td className="text-right">
                            {account.accountNumber}
                            {account.accountNumber && (
                              <CopyToClipboard value={account.accountNumber} />
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-gray-6 pl-0">Routing Number</td>
                          <td className="text-right">
                            {account.routingNumber}
                            {account.routingNumber && (
                              <CopyToClipboard value={account.routingNumber} />
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-gray-6 pl-0">Account Type</td>
                          <td className="text-right">{account.accountType}</td>
                        </tr>
                        <tr>
                          <td className="text-gray-6 pl-0">Status</td>
                          <td className="text-right">{account.status}</td>
                        </tr>
                      </tbody>
                    </table>
                  </Collapse.Panel>
                ))}
              </Collapse>
            </div>
          </div>
        ) : null}
      </div>
      {payByBankStatus && payByBankStatus !== 'not_started' ? (
        <div>
          <div className="col-12 px-2">
            <b>Remarks :</b>
            <Input
              className="mb-2 text-area-custom"
              type="textarea"
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
            />
          </div>
          <div className="col-md-12 px-2 mb-4">
            <div className="row">
              {SubmittoProvShow.includes(payByBankStatus) && (
                <button
                  className="btn btn-outline-primary col px-md-5 ml-2"
                  disabled={approveloading}
                  onClick={() => updateOnboardingStatus('approved', businessId)}
                >
                  &nbsp; Submit to provider &nbsp;
                  {approveloading && <Spinner size="sm" color="default" />}
                </button>
              )}

              {RejctbtnShow.includes(payByBankStatus) && (
                <button
                  className="btn btn-outline-warning col px-md-5 ml-2"
                  disabled={rejectloading}
                  onClick={() => updateOnboardingStatus('rejected', businessId)}
                >
                  &nbsp; Reject &nbsp;
                  {rejectloading && <Spinner size="sm" color="default" />}
                </button>
              )}

              {BlockbtnShow.includes(payByBankStatus) && (
                <button
                  className="btn btn-outline-danger col px-md-5 ml-2"
                  disabled={blockloading}
                  onClick={() => updateOnboardingStatus('blocked', businessId)}
                >
                  &nbsp; Block &nbsp;
                  {blockloading && <Spinner size="sm" color="default" />}
                </button>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default PayByBankProvider
