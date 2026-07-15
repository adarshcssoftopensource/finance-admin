import React, { useCallback, useState, useEffect } from 'react'
import qs from 'qs'
import moment from 'moment'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import { useHistory } from 'react-router-dom'
import getColumns from 'components/app/CommonTableFormatter/debitCardTransactionTableFormatter'
import Filter from 'pages/walletTransaction/filter'
import Table from 'components/app/table'
import { getStripeUrl } from 'components/app/helper'

const mapStateToProps = ({ debitCards, dispatch, router }) => ({
  debitCards,
  dispatch,
  router,
})

const Index = ({ dispatch, debitCards, router: { location } }) => {
  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(100)
  const [total, setTotal] = useState(100)
  const [data, setData] = useState([])
  const [keyword, setKeyword] = useState(null)
  const [amount, setAmount] = useState(null)
  const [cardNo, setCardNo] = useState(null)
  const [stripeCardId, setStripeCardId] = useState(null)
  const [businessId, setBusinessId] = useState(null)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [resetFilter, setResetFilter] = useState(false)
  const [providerName, setProviderName] = useState('')
  const history = useHistory()
  const params = new URLSearchParams(location.search)

  const initFetch = useCallback(
    qryString => {
      dispatch({
        type: 'debitCards/FETCH_ALL_WALLET_TRANSACTION',
        payload: {
          qryString,
        },
      })
    },
    [dispatch],
  )

  useEffect(() => {
    const queryKeyword = params.get('keywords') || keyword
    const queryStartDate = params.get('startDate') || startDate
    const queryEndDate = params.get('endDate') || endDate
    const queryAmount = params.get('amount') || amount
    const queryCardNo = params.get('cardNo') || cardNo
    const queryStripeCardId = params.get('stripeCardId') || stripeCardId
    const queryBusinessId = params.get('businessId') || businessId
    const queryProviderName = params.get('providerName') || providerName

    setKeyword(queryKeyword)
    setStartDate(queryStartDate)
    setEndDate(queryEndDate)
    setAmount(queryAmount)
    setCardNo(queryCardNo)
    setStripeCardId(queryStripeCardId)
    setBusinessId(queryBusinessId)
    setProviderName(queryProviderName)

    initFetch(
      qs.stringify({
        pageNo: location.query.pageNo || current,
        pageSize: location.query.pageSize || pageSize,
        keyword: queryKeyword,
        startDate: queryStartDate,
        endDate: queryEndDate,
        transactionAmount: queryAmount,
        providerName: queryProviderName,
      }),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    startDate,
    keyword,
    current,
    amount,
    resetFilter,
    cardNo,
    stripeCardId,
    businessId,
    pageSize,
    endDate,
    providerName,
  ])

  useEffect(() => {
    if (debitCards && debitCards.walletTransactions && debitCards.walletTransactions.data) {
      const { meta, transactions } = debitCards.walletTransactions.data
      setCurrent(meta.pageNo)
      setPageSize(meta.pageSize)
      setTotal(meta.total)
      setData(transactions)
    }
  }, [debitCards, debitCards.walletTransactions])

  const handleDebitCardURL = (type, value) => {
    params.set('pageNo', 1)
    params.set('pageSize', location.query.pageSize || pageSize)
    if (value) {
      params.set(type, value)
    } else {
      params.delete(type)
    }
    history.push({ search: params.toString() })
  }

  const handleDateRangeURL = (fromDate, toDate) => {
    params.set('pageNo', 1)
    params.set('pageSize', location.query.pageSize || pageSize)
    if (fromDate) {
      params.set('startDate', fromDate)
    } else {
      params.delete('startDate')
    }
    if (toDate) {
      params.set('endDate', toDate)
    } else {
      params.delete('endDate')
    }
    history.push({ search: params.toString() })
  }

  const handleFilterChange = (value, type) => {
    setCurrent(1)
    history.push({ pageNo: 1 })
    if (type === 'keywords') {
      setKeyword(value)
      handleDebitCardURL('keywords', value)
    } else if (type === 'cardNo') {
      setCardNo(value)
      handleDebitCardURL('cardNo', value)
    } else if (type === 'stripeCardId') {
      setStripeCardId(value)
      handleDebitCardURL('stripeCardId', value)
    } else if (type === 'businessId') {
      setBusinessId(value)
      handleDebitCardURL('businessId', value)
    } else if (type === 'amount') {
      setAmount(value)
      handleDebitCardURL('amount', value)
    } else if (type === 'providerName') {
      setProviderName(value)
      handleDebitCardURL('providerName', value)
    } else if (type === 'date') {
      if (value) {
        setEndDate(moment(value[1]).format('YYYY-MM-DD'))
        setStartDate(moment(value[0]).format('YYYY-MM-DD'))
        handleDateRangeURL(
          moment(value[0]).format('YYYY-MM-DD'),
          moment(value[1]).format('YYYY-MM-DD'),
        )
      } else {
        setEndDate(null)
        setStartDate(null)
      }
    }
  }

  const clearFilter = () => {
    params.delete('startDate')
    params.delete('endDate')
    params.delete('amount')
    params.delete('keywords')
    params.delete('pageNo')
    params.delete('pageSize')
    params.delete('cardNo')
    params.delete('stripeCardId')
    params.delete('businessId')
    params.delete('providerName')
    history.push({ search: params.toString() })
    setKeyword(null)
    setEndDate(null)
    setStartDate(null)
    setAmount(null)
    setCardNo(null)
    setStripeCardId(null)
    setBusinessId(null)
    setProviderName('')
    setResetFilter(!resetFilter)
  }

  const onPaginationChange = async (currentPage, pagesize) => {
    params.set('pageNo', currentPage)
    params.set('pageSize', pagesize)
    history.push({ search: params.toString() })
    setCurrent(currentPage)
    setPageSize(pagesize)
  }

  const showChangeWalletStatusConfirm = row => {
    const stripRawData = JSON.parse(row.stripeRawResponse)
    window.open(`${getStripeUrl('authorization')}/${stripRawData.authoizationId}`, '_blank')
  }

  const columns = getColumns(showChangeWalletStatusConfirm)

  return (
    <div>
      <Helmet title="Wallet: List" />
      <div className="cui__utils__heading">
        <strong>Wallets Transaction</strong>
      </div>
      <div className="card">
        <div className="card-header card-header-flex">
          <div className="d-flex flex-column justify-content-center mr-auto w-100 w-100">
            <Filter
              handleFilterChange={handleFilterChange}
              clearFilter={clearFilter}
              key={resetFilter}
              type="walletTransaction"
              qryString={qs.stringify({
                pageNo: current,
                pageSize,
                keyword,
                startDate,
                endDate,
                transactionAmount: amount,
                providerName,
              })}
              keyword={keyword}
              startDate={startDate}
              endDate={endDate}
              amount={amount}
              cardNo={cardNo}
              stripeCardId={stripeCardId}
              businessId={businessId}
              providerName={providerName}
            />
          </div>
        </div>
        <div className="card-body">
          <div className="text-nowrap">
            <Table
              columns={columns}
              dataSource={data}
              loading={debitCards.walletTransactions.loading}
              pageSize={pageSize}
              total={total}
              current={current}
              onPaginationChange={(currentPage, size) => onPaginationChange(currentPage, size)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default connect(mapStateToProps)(Index)
