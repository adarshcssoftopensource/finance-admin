import StatusDetailsCard from 'components/app/detailsComponents/WalletLedgerDetails/StatusDetailsCard'
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import WalletLedgerList from './list/index'
import style from './style.module.scss'

const mapStateToProps = ({ walletLedger, dispatch, router }) => ({
  walletLedger,
  dispatch,
  router,
})

const Index = ({
  dispatch,
  router: { location },
  walletLedger: { walletSummary, walletLedger },
}) => {
  const [walletSummaryData, setWalletSummaryData] = useState({})
  useEffect(() => {
    dispatch({
      type: 'wallet/FETCH_LEDGER_SUMMARY',
      payload: {},
    })
  }, [dispatch])

  useEffect(() => {
    if (walletSummary && walletSummary.data) {
      setWalletSummaryData(walletSummary.data)
    }
  }, [walletSummary])

  const handleRefreshPayment = () => {
    dispatch({
      type: 'wallet/FETCH_LEDGER_SUMMARY',
      payload: {},
    })
    dispatch({
      type: 'wallet/FETCH_WALLET_LEDGER',
      payload: {
        pageNo: location.query.pageNo || 1,
        pageSize: location.query.pageSize || 100,
      },
    })
  }

  return (
    <div>
      <Helmet title="Wallet Ledger" />
      <StatusDetailsCard walletSummaryData={walletSummaryData} />
      <div className="card">
        <div className="card-header card-header-flex align-items-center">
          <h2 className="mt-3 mr-4">Wallet Ledger</h2>
          <svg
            onClick={handleRefreshPayment}
            className={`${
              walletLedger.loading || walletSummary.loading ? 'Icon fa-spin' : 'Icon'
            } ${style.refreshIcon} mt-2`}
            viewBox="0 0 20 20"
            id="refresh"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M5.346 7H7.5a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1V3.5a1 1 0 1 1 2 0v1.989c.157-.191.389-.473.48-.581C6.137 2.933 7.741 2 10.5 2c3.03 0 5.507 1.524 7.348 4.47a1 1 0 1 1-1.696 1.06C14.66 5.142 12.803 4 10.5 4c-2.09 0-3.178.633-4.49 2.194-.12.143-.538.655-.62.752L5.347 7zm9.308 6H12.5a1 1 0 0 1 0-2H17a1 1 0 0 1 1 1v4.5a1 1 0 0 1-2 0v-1.989c-.157.192-.389.474-.48.581C13.863 17.068 12.259 18 9.5 18c-3.03 0-5.507-1.524-7.348-4.47a1 1 0 1 1 1.696-1.06C5.34 14.858 7.197 16 9.5 16c2.09 0 3.178-.633 4.49-2.194.12-.143.539-.655.62-.752l.044-.054z" />
          </svg>
        </div>
        <div className="card-body">
          <WalletLedgerList />
        </div>
      </div>
    </div>
  )
}

export default connect(mapStateToProps)(Index)
