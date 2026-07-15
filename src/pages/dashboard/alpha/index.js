import React, { useEffect, useCallback } from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { Spin } from 'antd'
import DashboardStaticStats from 'components/app/dashboardStaticStats'
import WalletStaticStats from 'components/app/walletStaticStats'

const mapStateToProps = ({ dashboard, dispatch }) => ({
  dashboard,
  dispatch,
})
const DashboardAlpha = ({ dispatch, dashboard }) => {
  const initFetch = useCallback(() => {
    dispatch({
      type: 'dashboard/GET_USER_STATS',
      payload: {},
    })
    dispatch({
      type: 'dashboard/GET_BUSINESS_STATS',
      payload: {},
    })
    dispatch({
      type: 'dashboard/GET_WALLET_STATISTICS',
      payload: {},
    })
  }, [dispatch])

  useEffect(() => {
    initFetch()
  }, [initFetch])
  return (
    <div>
      <Helmet title="Dashboard: Analytics" />
      <div className="row">
        {/* Business static Statistics */}
        <div className="col-md-6">
          <div className="cui__utils__heading">
            <strong>Business Statistics</strong>
          </div>
          <div className="card">
            <div className="card-body">
              {dashboard.bizStats ? (
                <DashboardStaticStats data={dashboard.bizStats} type="Business" />
              ) : (
                <div className="d-flex flex-wrap justify-content-center mt-5">
                  <Spin />
                </div>
              )}
            </div>
          </div>
        </div>
        {/* User static Statistics */}
        <div className="col-md-6">
          <div className="cui__utils__heading">
            <strong>User Statistics</strong>
          </div>
          <div className="card">
            <div className="card-body">
              {dashboard.userStats ? (
                <DashboardStaticStats data={dashboard.userStats} type="User" />
              ) : (
                <div className="d-flex flex-wrap justify-content-center mt-5">
                  <Spin />
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Wallet Statistics */}
        <div className="col-md-6">
          <div className="cui__utils__heading">
            <strong>Wallet Statistics</strong>
          </div>
          <div className="card">
            <div className="card-body">
              {!dashboard.WalletLoading ? (
                <WalletStaticStats data={dashboard.WalletStats} type="Total" />
              ) : (
                <div className="d-flex flex-wrap justify-content-center mt-5">
                  <Spin />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default connect(mapStateToProps)(DashboardAlpha)
