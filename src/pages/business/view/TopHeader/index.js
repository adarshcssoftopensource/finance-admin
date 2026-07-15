import React from 'react'
import { Button, Switch } from 'antd'
import { Link } from 'react-router-dom'
import { riskLevelIcons } from '../../../../components/app/CommonTableFormatter/businessTableFormatter'

/* eslint-disable */

const renderStatus = status => {
  let statusObj = {
    class: 'default',
  }
  if (status) {
    statusObj = {
      class: 'success',
    }
  } else {
    statusObj = {
      class: 'danger',
    }
  }
  return (
    <span className={`font-size-12 badge badge-${statusObj.class}`}>
      {status ? 'Enabled' : 'Disabled'}
    </span>
  )
}

function index({
  bizDetail,
  forceUpdatePassword,
  promotionalEmail,
  selectedTab,
  isOnboardingAllowed,
  toggleOnboarding,
  isPaymentEnabled,
  isPayoutEnabled,
  togglePayment,
  togglePayout,
  isMerchantOfRecord,
  toggleMerchantOfRecord,
  handleAdjustRewardPoints,
  handleMigrateFromPeymynt,
  handleAddCredits,
}) {
  const handleToggleMerchantOfRecord = () => {
    toggleMerchantOfRecord({
      isMerchantOfRecord: !isMerchantOfRecord,
    })
  }
  const handleToggleOnboarding = () => {
    toggleOnboarding({
      isOnboardingAllowed: !isOnboardingAllowed,
    })
  }
  const handleTogglePayment = () => {
    togglePayment({
      isPaymentEnabled: !isPaymentEnabled,
    })
  }
  const handleTogglePayout = () => {
    togglePayout({
      isPayoutEnabled: !isPayoutEnabled,
    })
  }
  return (
    <div className="d-flex flex-wrap align-items-end mb-4">
      <div className="mr-auto">
        <div className="text-dark font-weight-bold font-size-24">
          <span className="mr-3">{bizDetail.organizationName}</span>
          <span className="align-middle text-primary text-uppercase font-size-12 badge badge-light mr-3">
            {bizDetail.isActive ? 'Active' : 'Deactive'}
          </span>
          <span className="mr-3">{riskLevelIcons(bizDetail?.riskLevel)}</span>
        </div>
        <div className="d-flex justify-content-between">
          {bizDetail.organizationType}
          <p className="ml-3 mr-2">Allow Onboarding</p>
          <Switch
            checkedChildren={<span>On</span>}
            unCheckedChildren={<span>Off</span>}
            checked={isOnboardingAllowed}
            onClick={handleToggleOnboarding}
          />
          <p className="ml-3 mr-2">Allow Payments</p>
          <Switch
            checkedChildren={<span>Enable</span>}
            unCheckedChildren={<span>Disable</span>}
            checked={isPaymentEnabled}
            onClick={handleTogglePayment}
          />
          <p className="ml-3 mr-2">Allow Payouts</p>
          <Switch
            checkedChildren={<span>Enable</span>}
            unCheckedChildren={<span>Disable</span>}
            checked={isPayoutEnabled}
            onClick={handleTogglePayout}
          />
          <p className="ml-3 mr-2">Merchant of Record</p>
          <Switch
            checkedChildren={<span>On</span>}
            unCheckedChildren={<span>Off</span>}
            checked={isMerchantOfRecord}
            onClick={handleToggleMerchantOfRecord}
          />
        </div>
      </div>
      <div className="d-flex flex-wrap ">
        {/* <Button type="primary" onClick={() => forceUpdatePassword()} size="medium" className="mx-2">
          Reset Password
        </Button> */}
        <Button
          type="default"
          onClick={() => handleAddCredits()}
          size="medium"
          className="mr-2 mb-3"
        >
          Adjust Credits
        </Button>
        <Link
          to={`/business/view/${bizDetail._id}/clone`}
          className="btn btn-md btn-light mr-2 mb-3"
        >
          Clone Business
        </Link>
        <Button
          type="primary"
          onClick={() => promotionalEmail()}
          size="medium"
          className="mr-2 mb-3"
        >
          Send Email
        </Button>
        <Button
          type="default"
          onClick={() => handleAdjustRewardPoints()}
          size="medium"
          className="mr-2 mb-3"
        >
          Adjust Reward Points
        </Button>
        <Button
          type="default"
          onClick={() => handleMigrateFromPeymynt()}
          size="medium"
          className="mr-2 mb-3"
        >
          Migrate from Peymynt
        </Button>
      </div>
    </div>
  )
}

export default index
