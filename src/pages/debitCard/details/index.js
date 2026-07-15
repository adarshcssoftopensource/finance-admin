/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
import React, { useEffect, useCallback, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Select, Spin } from 'antd'
import { connect } from 'react-redux'
import Card from 'components/app/card'
import DebitCardDetails from 'components/app/detailsComponents/debitCardDetails'
import { walletStatus } from 'components/app/CommonTableFormatter/debitCardTableFormatter'

const mapStateToProps = ({ debitCards, business, dispatch, router }) => ({
  debitCards,
  dispatch,
  router,
  business,
})
const Index = ({ debitCards, dispatch, router: { location } }) => {
  const [data, setData] = useState({})
  const [businessData, setBusinessData] = useState({})
  const [changeStatus, setChangeStatus] = useState('inactive')
  const { Option } = Select

  const initFetch = useCallback(
    walletId => {
      dispatch({
        type: 'debitCards/FETCH_ALL_DEBIT_CARDS_DETAILS',
        payload: {
          walletId,
        },
      })
    },
    [dispatch],
  )

  useEffect(() => {
    const walletId = splitId()
    initFetch(walletId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initFetch])
  const splitId = () => location.pathname.split('/debit-card-wallets/')[1]

  useEffect(() => {
    if (debitCards && debitCards.debitCard.data) {
      setData(debitCards.debitCard.data.debitCard)
      setBusinessData(debitCards.debitCard.data.debitCard.business)
    }
  }, [debitCards])

  useEffect(() => {
    if (data.status) {
      setChangeStatus(data.status)
    }
  }, [data])

  const handleStatusChange = val => {
    setChangeStatus(val)
    dispatch({
      type: 'debitCards/CHANGE_DEBIT_CARD_WALLET_STATUS',
      payload: {
        status: val,
        walletId: splitId(),
      },
    })
  }

  return (
    <>
      <Helmet title="Payments: Details" />
      <div className="cui__utils__heading">
        <strong>Wallet Details</strong>
      </div>
      {businessData && !debitCards.debitCard.loading ? (
        <Card className="card">
          <div className="d-flex justify-content-between ">
            <div className="text-nowrap text-dark font-size-24 font-weight-bold">
              <span className="mr-3">{businessData.organizationName}</span>
              {walletStatus(data)}
            </div>
            <div className="d-flex align-items-center" style={{ width: '27%' }}>
              <label className="filter-label w-100">Change Wallet Status</label>
              <Select
                className="w-100"
                placeholder="Select Card"
                size="large"
                defaultValue=""
                id="changeStatus"
                value={changeStatus}
                onChange={value => handleStatusChange(value)}
              >
                <Option key="active" value="active">
                  Active
                </Option>
                <Option key="inactive" value="inactive">
                  InActive
                </Option>
                <Option key="blocked" value="blocked">
                  Blocked
                </Option>
                <Option key="deleted" value="deleted">
                  Deleted
                </Option>
              </Select>
              {/* </div> */}
            </div>
            {/* </span> */}
          </div>
          <div>{businessData.organizationType}</div>
        </Card>
      ) : null}
      {debitCards.debitCard.loading ? (
        <div className="d-flex flex-wrap justify-content-center mt-5">
          <Spin />
        </div>
      ) : (
        <DebitCardDetails data={data} location={location} />
      )}
    </>
  )
}

export default connect(mapStateToProps)(Index)
