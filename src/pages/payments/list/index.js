import React, { useEffect, useCallback, useState } from 'react'
import qs from 'qs'
import moment from 'moment'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import Filter from 'pages/payments/filter'
import Payments from 'pages/common/Payments'
import { useHistory } from 'react-router-dom'

const mapStateToProps = ({ payments, dispatch, router }) => ({
  payments,
  dispatch,
  router,
})

const Index = ({ dispatch, payments: { payments }, router: { location } }) => {
  /* eslint-disable */
  const [current, setCurrent] = useState(1)
  const [status, setStatus] = useState('')
  const [keyword, setKeyword] = useState(null)
  const [pageSize, setPageSize] = useState(100)
  const [total, setTotal] = useState(100)
  const [data, setData] = useState([])
  const [dateRange, setDateRange] = useState(null)
  const [startDate, setStartDate] = useState(null)
  const [paymentType, setPaymentType] = useState('')
  const [amountTo, setAmountTo] = useState(null)
  const [amountFrom, setAmountFrom] = useState(null)
  const [method, setMethod] = useState('')
  const [endDate, setEndDate] = useState(null)
  const [currency, setCurrency] = useState('')
  const [providerName, setProviderName] = useState('')
  const [resetFilter, setResetFilter] = useState(false)
  const history = useHistory()
  const params = new URLSearchParams(location.search)

  const initFetch = useCallback(
    qryString => {
      dispatch({
        type: 'payments/FETCH_ALL_PAYMENTS',
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
    const queryAmountTo = params.get('amountTo') || amountTo
    const queryAmountFrom = params.get('amountFrom') || amountFrom
    const queryStatus = params.get('status') || status
    const queryPaymentType = params.get('paymentType') || paymentType
    const queryMethod = params.get('method') || method
    const queryCurrency = params.get('currency') || currency
    const queryProviderName = params.get('providerName') || providerName
    setKeyword(queryKeyword)
    setStartDate(queryStartDate)
    setEndDate(queryEndDate)
    setAmountTo(queryAmountTo)
    setAmountFrom(queryAmountFrom)
    setStatus(queryStatus)
    setPaymentType(queryPaymentType)
    setMethod(queryMethod)
    setCurrency(queryCurrency)
    setProviderName(queryProviderName)
    initFetch(
      qs.stringify({
        pageNo: location.query.pageNo || current,
        pageSize: location.query.pageSize || pageSize,
        keyword: queryKeyword,
        startDate: queryStartDate,
        endDate: queryEndDate,
        amountTo: queryAmountTo,
        amountFrom: queryAmountFrom,
        status: queryStatus,
        paymentType: queryPaymentType,
        method: queryMethod,
        currency: queryCurrency,
        providerName: queryProviderName,
      }),
    )
  }, [initFetch, location.search])

  useEffect(() => {
    if (payments && payments.data) {
      const { meta } = payments.data
      setCurrent(meta.pageNo)
      setPageSize(meta.pageSize)
      setTotal(meta.total)
      setData(payments.data.payments)
    }
  }, [payments])

  const handlePaymentURL = (type, value) => {
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
      handlePaymentURL('keywords', value)
    } else if (type === 'status') {
      setStatus(value)
      handlePaymentURL('status', value)
    } else if (type === 'amountFrom') {
      setAmountFrom(value)
      handlePaymentURL('amountFrom', value)
    } else if (type === 'currency') {
      setCurrency(value)
      handlePaymentURL('currency', value)
    } else if (type === 'amountTo') {
      setAmountTo(value)
      handlePaymentURL('amountTo', value)
    } else if (type === 'paymentType') {
      setPaymentType(value)
      handlePaymentURL('paymentType', value)
    } else if (type === 'method') {
      setMethod(value)
      handlePaymentURL('method', value)
    } else if (type === 'providerName') {
      setProviderName(value)
      handlePaymentURL('providerName', value)
    } else if (type === 'date') {
      if (value) {
        setEndDate(moment(value[1]).format('YYYY-MM-DD'))
        setStartDate(moment(value[0]).format('YYYY-MM-DD'))
        setDateRange(value)
        handleDateRangeURL(
          moment(value[0]).format('YYYY-MM-DD'),
          moment(value[1]).format('YYYY-MM-DD'),
        )
      } else {
        setEndDate(null)
        setStartDate(null)
        setDateRange(null)
      }
    }
  }

  const clearFilter = () => {
    params.delete('status')
    params.delete('amountFrom')
    params.delete('amountTo')
    params.delete('keywords')
    params.delete('currency')
    params.delete('paymentType')
    params.delete('method')
    params.delete('startDate')
    params.delete('endDate')
    params.delete('pageNo')
    params.delete('pageSize')
    params.delete('providerName')
    history.push({ search: params.toString() })
    setKeyword(null)
    setEndDate(null)
    setStartDate(null)
    setDateRange(null)
    setMethod('')
    setPaymentType('')
    setAmountTo(null)
    setAmountFrom(null)
    setStatus('')
    setCurrency('')
    setProviderName('')
    setResetFilter(!resetFilter)
  }

  const onPaginationChange = async (currentPage, pagesize) => {
    params.set('pageNo', currentPage)
    params.set('pageSize', pagesize)
    history.push({ search: params.toString() })
    await setCurrent(currentPage)
    await setPageSize(pagesize)
  }
  return (
    <div>
      <Helmet title="Payments: List" />
      <div className="cui__utils__heading">
        <strong>All Payments</strong>
      </div>
      <div className="card">
        <div className="card-header card-header-flex">
          <div className="d-flex flex-column justify-content-center mr-auto w-100 w-100">
            <Filter
              handleFilterChange={handleFilterChange}
              clearFilter={clearFilter}
              key={resetFilter}
              qryString={qs.stringify({
                pageNo: current,
                pageSize,
                keyword,
                startDate,
                endDate,
                amountTo,
                amountFrom,
                status,
                paymentType,
                method,
                currency,
                providerName,
              })}
              status={status}
              keyword={keyword}
              startDate={startDate}
              endDate={endDate}
              amountFrom={amountFrom}
              amountTo={amountTo}
              currency={currency}
              paymentType={paymentType}
              paymentMethod={method}
              providerName={providerName}
            />
          </div>
        </div>
        <div className="card-body">
          <div className="text-nowrap">
            <Payments
              data={data}
              loading={payments.loading}
              pageSize={pageSize}
              total={total}
              current={current}
              onPaginationChange={onPaginationChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default connect(mapStateToProps)(Index)
