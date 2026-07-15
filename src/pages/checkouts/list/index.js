import React, { useEffect, useCallback, useState } from 'react'
import qs from 'qs'
import moment from 'moment'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import Table from 'components/app/table'
import getColumns from 'components/app/CommonTableFormatter/checkoutDataTableFormatter'
import Filter from 'pages/checkouts/filter'
import { useHistory } from 'react-router-dom'

const mapStateToProps = ({ checkouts, dispatch, router }) => ({
  checkouts,
  dispatch,
  router,
})

const Index = ({ dispatch, checkouts: { checkouts }, router: { location } }) => {
  /* eslint-disable */
  const [current, setCurrent] = useState(1)
  const [keyword, setKeyword] = useState(null)
  const [pageSize, setPageSize] = useState(100)
  const [total, setTotal] = useState(100)
  const [checkoutsData, setCheckoutsData] = useState([])
  const [startDate, setStartDate] = useState(null)
  const [status, setStatus] = useState('Online')
  const [endDate, setEndDate] = useState(null)
  const [resetFilter, setResetFilter] = useState(false)
  const history = useHistory()
  const params = new URLSearchParams(location.search)

  const initFetch = useCallback(
    qryString => {
      dispatch({
        type: 'checkouts/FETCH_ALL_CHECKOUTS',
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
    const queryStatus = params.get('status') || status
    setKeyword(queryKeyword)
    setStartDate(queryStartDate)
    setEndDate(queryEndDate)
    setStatus(queryStatus)
    initFetch(
      qs.stringify({
        pageNo: location.query.pageNo || current,
        pageSize: location.query.pageSize || pageSize,
        keyword: queryKeyword,
        startDate: queryStartDate,
        endDate: queryEndDate,
        status: queryStatus,
      }),
    )
  }, [initFetch, location.search])

  useEffect(() => {
    if (checkouts?.data?.meta) {
      const { meta } = checkouts.data
      setCurrent(meta.pageNo)
      setPageSize(meta.pageSize)
      setTotal(meta.total)
      setCheckoutsData(checkouts.data.checkouts)
    }
  }, [checkouts])

  const handleCheckoutURL = (type, value) => {
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
      handleCheckoutURL('keywords', value)
    } else if (type === 'status') {
      setStatus(value)
      handleCheckoutURL('status', value)
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
    params.delete('keywords')
    params.delete('startDate')
    params.delete('endDate')
    params.delete('pageNo')
    params.delete('pageSize')
    history.push({ search: params.toString() })
    setKeyword(null)
    setEndDate(null)
    setStartDate(null)
    setStatus('Online')
    setResetFilter(!resetFilter)
  }

  const onPaginationChange = async (currentPage, pagesize) => {
    params.set('pageNo', currentPage)
    params.set('pageSize', pagesize)
    history.push({ search: params.toString() })
    setCurrent(currentPage)
    setPageSize(pagesize)
  }

  const columns = getColumns()

  return (
    <div>
      <Helmet title="Checkout Data: List" />
      <div className="cui__utils__heading">
        <strong>Checkout Data</strong>
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
                status,
              })}
              keyword={keyword}
              startDate={startDate}
              endDate={endDate}
              status={status}
            />
          </div>
        </div>
        <div className="card-body">
          <div className="text-nowrap">
            <Table
              columns={columns}
              dataSource={checkoutsData}
              loading={checkouts.loading}
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
