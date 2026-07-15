import { getAmountToDisplay } from 'components/app/helper'
import React, { useState } from 'react'
import TooltipButton from 'components/app/tooltipButton'
import IssueAmountModel from 'pages/walletLedger/helper/model'
import { connect } from 'react-redux'
import { PlusOutlined } from '@ant-design/icons'
import { addAmount } from 'services/walletLedgear'
import * as Notification from 'services/showNotifications'

const mapStateToProps = ({ business, dispatch, router }) => ({
  business,
  dispatch,
  router,
})

const StatusDetailsCard = ({ walletSummaryData, router: { location }, dispatch }) => {
  const [issueAmountModal, setIssueAmountModal] = useState(false)
  const currency = {
    code: 'USD',
    displayName: 'USD ($) U.S. dollar',
    name: 'U.S. dollar',
    symbol: '$',
  }

  const handleOpenIssueModel = () => {
    setIssueAmountModal(true)
  }

  const handleCloseModel = () => {
    setIssueAmountModal(false)
  }

  const handleIssueAmount = async amount => {
    await addAmount({ amount })
      .then(res => {
        dispatch({
          type: 'wallet/FETCH_WALLET_LEDGER',
          payload: {
            pageNo: location.query.pageNo || 1,
            pageSize: location.query.pageSize || 100,
          },
        })
        dispatch({
          type: 'wallet/FETCH_LEDGER_SUMMARY',
          payload: {},
        })
        Notification.showSuccess(res.message)
      })
      .catch(error => {
        Notification.showError(error.message)
      })
    setIssueAmountModal(false)
  }

  return (
    <>
      <div className="d-flex justify-content-around">
        <div className="card w-25 p-3 text-center">
          <h2>All Time</h2>
          <h3>{getAmountToDisplay(currency, walletSummaryData.allTimeLoad)}</h3>
        </div>
        <div className="card w-25 p-3 text-center position-relative">
          <div className="position-absolute" style={{ right: '0', bottom: '15%' }}>
            <TooltipButton
              onButtonClick={handleOpenIssueModel}
              buttonText={<PlusOutlined />}
              tooltipTitle="adjust closing balance"
            />
          </div>
          <h2>Closing</h2>
          <h3>{getAmountToDisplay(currency, walletSummaryData.closingBalance)}</h3>
        </div>
        <div className="card w-25 p-3 text-center">
          <h2>Issuing</h2>
          <h3>{getAmountToDisplay(currency, walletSummaryData.issuingBalance)}</h3>
        </div>
        <IssueAmountModel
          title="Add closing balance"
          visible={issueAmountModal}
          closeModal={handleCloseModel}
          onOkModel={handleIssueAmount}
        />
      </div>
    </>
  )
}

export default connect(mapStateToProps)(StatusDetailsCard)
