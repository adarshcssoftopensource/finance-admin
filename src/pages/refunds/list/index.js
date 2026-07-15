import React, { useEffect, useCallback, useState } from 'react'
import qs from 'qs'
import moment from 'moment'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import Filter from 'pages/refunds/filter'
import Refunds from 'pages/common/refunds'

const mapStateToProps = ({ refunds, router, dispatch }) => ({
  refunds,
  router,
  dispatch,
})

const Index = ({ dispatch, refunds: { refunds }, router: { location } }) => {
  /* eslint-disable */
  const [current, setCurrent] = useState(1)
  const [status, setStatus] = useState('')
  const [keyword, setKeyword] = useState(null)
  const [pageSize, setPageSize] = useState(100)
  const [total, setTotal] = useState(100)
  const [data, setData] = useState([])
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [amountTo, setAmountTo] = useState(null)
  const [amountFrom, setAmountFrom] = useState(null)
  const [currency, setCurrency] = useState('')
  const [providerName, setProviderName] = useState('')
  const [resetFilter, setResetFilter] = useState(false)
  const history = useHistory()
  const params = new URLSearchParams(location.search)

  const initFetch = useCallback(
    qryString => {
      dispatch({
        type: 'refunds/FETCH_ALL_REFUNDS',
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
    const queryCurrency = params.get('currency') || currency
    const queryProviderName = params.get('providerName') || providerName
    setKeyword(queryKeyword)
    setStartDate(queryStartDate)
    setEndDate(queryEndDate)
    setAmountTo(queryAmountTo)
    setAmountFrom(queryAmountFrom)
    setStatus(queryStatus)
    setCurrency(queryCurrency)
    setProviderName(queryProviderName)
    initFetch(
      qs.stringify({
        pageNo: location.query.pageNo || current,
        pageSize: location.query.pageSize || pageSize,
        status: queryStatus,
        keyword: queryKeyword,
        startDate: queryStartDate,
        endDate: queryEndDate,
        amountFrom: queryAmountFrom,
        amountTo: queryAmountTo,
        currency: queryCurrency,
        providerName: queryProviderName,
      }),
    )
  }, [initFetch, location.search])

  useEffect(() => {
    if (refunds?.data?.meta) {
      const { meta } = refunds.data
      setCurrent(meta.pageNo)
      setPageSize(meta.pageSize)
      setTotal(meta.total)
      setData(refunds.data.refunds)
    }
  }, [refunds])

  const handleRefundURL = (type, value) => {
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
      handleRefundURL('keywords', value)
    } else if (type === 'status') {
      setStatus(value)
      handleRefundURL('status', value)
    } else if (type === 'currency') {
      setCurrency(value)
      handleRefundURL('currency', value)
    } else if (type === 'amountFrom') {
      setAmountFrom(value)
      handleRefundURL('amountFrom', value)
    } else if (type === 'amountTo') {
      setAmountTo(value)
      handleRefundURL('amountTo', value)
    } else if (type === 'providerName') {
      setProviderName(value)
      handleRefundURL('providerName', value)
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
    params.delete('status')
    params.delete('amountFrom')
    params.delete('amountTo')
    params.delete('keywords')
    params.delete('currency')
    params.delete('startDate')
    params.delete('endDate')
    params.delete('pageNo')
    params.delete('pageSize')
    params.delete('providerName')
    history.push({ search: params.toString() })
    setStatus('')
    setKeyword(null)
    setEndDate(null)
    setStartDate(null)
    setAmountTo(null)
    setAmountFrom(null)
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
      <Helmet title="Refunds: List" />
      <div className="cui__utils__heading">
        <strong>All Refunds</strong>
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
                status,
                keyword,
                startDate,
                endDate,
                amountFrom,
                amountTo,
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
              providerName={providerName}
            />
          </div>
        </div>
        <div className="card-body">
          <div className="text-nowrap">
            <Refunds
              data={data}
              loading={refunds.loading}
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
