import React, { useState } from 'react'
import { Switch, notification } from 'antd'
import { formateDate } from 'components/app/helper'
import { onboardingDataSubmit } from 'services/business'

const BuyNowPayLater = ({ bnplData, businessId, onRefresh }) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleToggle = async checked => {
    setIsLoading(true)
    try {
      const updatedLegalData = {
        ...bnplData,
        isActive: checked,
        lastUpdatedAt: new Date().toISOString(),
      }

      const response = await onboardingDataSubmit(
        { legalData: { bnplProviderData: updatedLegalData } },
        businessId,
      )

      if (response.statusCode === 200) {
        notification.success({
          message: response.message,
        })
        // Use parent's initFetch to refresh data
        onRefresh()
      } else {
        notification.error({
          message: response.message,
        })
      }
    } catch (err) {
      notification.error({
        message: err?.message || 'Something went wrong',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="text-dark font-weight-bold font-size-24 border-bottom">
        <span className="mr-3">Buy Now Pay Later</span>
      </div>
      <div className="d-flex">
        <div className="col-6 pl-0">
          <div className="table-responsive">
            <table className="table table-borderless">
              <tbody>
                <tr>
                  <td className="text-gray-6 pl-0 pb-0">Pay by Financing with Sezzle</td>
                  <td className="pr-0 text-dark pb-0 text-right">
                    <Switch
                      checked={bnplData?.isActive}
                      onChange={handleToggle}
                      loading={isLoading}
                      disabled={isLoading}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="text-gray-6 pl-0 pb-0">Consent Provided on</td>
                  <td className="pr-0 text-dark pb-0 text-right">
                    {bnplData?.consentProvidedAt ? formateDate(bnplData.consentProvidedAt) : 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className="text-gray-6 pl-0 pb-0">Updated Date</td>
                  <td className="pr-0 text-dark pb-0 text-right">
                    {bnplData?.lastUpdatedAt ? formateDate(bnplData.lastUpdatedAt) : 'N/A'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

export default BuyNowPayLater
