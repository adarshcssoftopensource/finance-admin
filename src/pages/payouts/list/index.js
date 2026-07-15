import React, { useEffect, useCallback, useState } from 'react'
import qs from 'qs'
import moment from 'moment'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import getColumns from 'components/app/CommonTableFormatter/payoutsTableFormatter'
import Table from 'components/app/table'
import Filter from 'pages/payouts/filter'
import { useHistory } from 'react-router-dom'

const mapStateToProps = ({ payouts, dispatch, router }) => ({
  payouts,
  dispatch,
  router,
})

const Index = ({ dispatch, payouts: { payouts }, router: { location } }) => {
  /* eslint-disable */
  const [current, setCurrent] = useState(1)
  const [status, setStatus] = useState('')
  const [pageSize, setPageSize] = useState(100)
  const [total, setTotal] = useState(100)
  const [data, setData] = useState([])
  const [timelineStartDate, setTimelineStartDate] = useState(null)
  const [timelineEndDate, setTimelineEndDate] = useState(null)
  const [timelineArrivalStartDate, setTimelineArrivalStartDate] = useState(null)
  const [timelineArrivalEndDate, setTimelineArrivalEndDate] = useState(null)
  const [amountTo, setAmountTo] = useState(null)
  const [amountFrom, setAmountFrom] = useState(null)
  const [currencyCode, setCurrencyCode] = useState('')
  const [keywords, setKeywords] = useState(null)
  const [resetFilter, setResetFilter] = useState(false)
  const history = useHistory()
  const params = new URLSearchParams(location.search)

  const initFetch = useCallback(
    qryString => {
      dispatch({
        type: 'payouts/FETCH_ALL_PAYOUTS',
        payload: {
          qryString,
        },
      })
    },
    [dispatch],
  )

  useEffect(() => {
    setKeywords(params.get('keywords') || null)
    setCurrencyCode(params.get('currency') || '')
    setAmountTo(params.get('amountTo') || null)
    setAmountFrom(params.get('amountFrom') || null)
    setTimelineArrivalEndDate(params.get('timelineArrivalEndDate') || null)
    setTimelineArrivalStartDate(params.get('timelineArrivalStartDate') || null)
    setTimelineEndDate(params.get('timelineEndDate') || null)
    setTimelineStartDate(params.get('timelineStartDate') || null)
    setStatus(params.get('status') || '')
    initFetch(createQryString())
  }, [initFetch, location.search])

  useEffect(() => {
    if (payouts && payouts.data) {
      const { meta } = payouts.data
      setCurrent(meta.pageNo)
      setPageSize(meta.pageSize)
      setTotal(meta.total)
      setData(payouts.data.payouts)
    }
  }, [payouts])

  const createQryString = () => {
    return qs.stringify({
      pageNo: location.query.pageNo || current,
      pageSize: location.query.pageSize || pageSize,
      status: params.get('status') || status,
      timelineStartDate: params.get('timelineStartDate') || timelineStartDate,
      timelineEndDate: params.get('timelineEndDate') || timelineEndDate,
      timelineArrivalStartDate: params.get('timelineArrivalStartDate') || timelineArrivalStartDate,
      timelineArrivalEndDate: params.get('timelineArrivalEndDate') || timelineArrivalEndDate,
      amountFrom: params.get('amountFrom') || amountFrom,
      amountTo: params.get('amountTo') || amountTo,
      currencyCode: params.get('currency') || currencyCode,
      keywords: params.get('keywords') || keywords,
    })
  }

  const handlePayoutURL = (type, value) => {
    params.set('pageNo', 1)
    params.set('pageSize', location.query.pageSize || pageSize)
    if (value) {
      params.set(type, value)
    } else {
      params.delete(type)
    }
    history.push({ search: params.toString() })
  }

  const handleDateRangeURL = (fromDateKey, fromDate, toDateKey, toDate) => {
    params.set('pageNo', 1)
    params.set('pageSize', location.query.pageSize || pageSize)
    if (fromDate) {
      params.set(fromDateKey, fromDate)
    } else {
      params.delete(fromDateKey)
    }
    if (toDate) {
      params.set(toDateKey, toDate)
    } else {
      params.delete(toDateKey)
    }
    history.push({ search: params.toString() })
  }

  const handleFilterChange = (value, type) => {
    setCurrent(1)
    history.push({ pageNo: 1 })
    if (type === 'status') {
      setStatus(value)
      handlePayoutURL('status', value)
    } else if (type === 'keywords') {
      setKeywords(value)
      handlePayoutURL('keywords', value)
    } else if (type === 'currencyCode') {
      setCurrencyCode(value)
      handlePayoutURL('currencyCode', value)
    } else if (type === 'amountFrom') {
      setAmountFrom(value)
      handlePayoutURL('amountFrom', value)
    } else if (type === 'amountTo') {
      setAmountTo(value)
      handlePayoutURL('amountTo', value)
    } else if (type === 'currency') {
      setCurrencyCode(value)
      handlePayoutURL('currency', value)
    } else if (type === 'start') {
      if (value) {
        setTimelineEndDate(moment(value[1]).format('YYYY-MM-DD'))
        setTimelineStartDate(moment(value[0]).format('YYYY-MM-DD'))
        handleDateRangeURL(
          'timelineStartDate',
          moment(value[0]).format('YYYY-MM-DD'),
          'timelineEndDate',
          moment(value[1]).format('YYYY-MM-DD'),
        )
      } else {
        setTimelineEndDate(null)
        setTimelineStartDate(null)
      }
    } else if (type === 'arrival') {
      if (value) {
        setTimelineArrivalEndDate(moment(value[1]).format('YYYY-MM-DD'))
        setTimelineArrivalStartDate(moment(value[0]).format('YYYY-MM-DD'))
        handleDateRangeURL(
          'timelineArrivalStartDate',
          moment(value[0]).format('YYYY-MM-DD'),
          'timelineArrivalEndDate',
          moment(value[1]).format('YYYY-MM-DD'),
        )
      } else {
        setTimelineArrivalEndDate(null)
        setTimelineArrivalStartDate(null)
      }
    }
  }

  const clearFilter = () => {
    params.delete('status')
    params.delete('amountFrom')
    params.delete('amountTo')
    params.delete('keywords')
    params.delete('currency')
    params.delete('timelineArrivalStartDate')
    params.delete('timelineArrivalEndDate')
    params.delete('timelineStartDate')
    params.delete('timelineEndDate')
    params.delete('pageNo')
    params.delete('pageSize')
    history.push({ search: params.toString() })
    setStatus('')
    setKeywords(null)
    setTimelineEndDate(null)
    setTimelineStartDate(null)
    setTimelineArrivalEndDate(null)
    setTimelineArrivalStartDate(null)
    setAmountTo(null)
    setAmountFrom(null)
    setCurrencyCode('')
    setResetFilter(!resetFilter)
  }

  const onPaginationChange = async (currentPage, pagesize) => {
    params.set('pageNo', currentPage)
    params.set('pageSize', pagesize)
    history.push({ search: params.toString() })
    await setCurrent(currentPage)
    await setPageSize(pagesize)
  }

  let columns = getColumns()

  return (
    <div>
      <Helmet title="Payouts: List" />
      <div className="cui__utils__heading">
        <strong>All Payouts</strong>
      </div>
      <div className="card">
        <div className="card-header card-header-flex">
          <div className="d-flex flex-column justify-content-center mr-auto w-100 w-100">
            <Filter
              handleFilterChange={handleFilterChange}
              clearFilter={clearFilter}
              key={resetFilter}
              qryString={createQryString()}
              keyword={keywords}
              status={status}
              amountFrom={amountFrom}
              amountTo={amountTo}
              currency={currencyCode}
              timelineStartDate={timelineStartDate}
              timelineEndDate={timelineEndDate}
              timelineArrivalStartDate={timelineArrivalStartDate}
              timelineArrivalEndDate={timelineArrivalEndDate}
            />
          </div>
        </div>
        <div className="card-body">
          <div className="text-nowrap">
            <Table
              columns={columns}
              dataSource={data}
              loading={payouts.loading}
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
