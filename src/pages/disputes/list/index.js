import React, { useEffect, useCallback, useState } from 'react'
import qs from 'qs'
import moment from 'moment'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import Table from 'components/app/table'
import getColumns from 'components/app/CommonTableFormatter/disputeTableFormatter'
import Filter from 'pages/disputes/filter'
import { useHistory } from 'react-router-dom'

const mapStateToProps = ({ disputes, dispatch, router }) => ({
  disputes,
  dispatch,
  router,
})

const Index = ({ dispatch, disputes: { disputes }, router: { location } }) => {
  const [current, setCurrent] = useState(1)
  const [status, setStatus] = useState('')
  const [keyword, setKeyword] = useState(null)
  const [pageSize, setPageSize] = useState(100)
  const [total, setTotal] = useState(100)
  const [bizData, setBizData] = useState([])
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [resetFilter, setResetFilter] = useState(false)
  const history = useHistory()
  const params = new URLSearchParams(location.search)

  const initFetch = useCallback(
    qryString => {
      dispatch({
        type: 'disputes/FETCH_ALL_DISPUTES',
        payload: {
          qryString,
        },
      })
    },
    [dispatch],
  )

  const prepareString = () => {
    return qs.stringify({
      pageNo: location.query.pageNo || current,
      pageSize: location.query.pageSize || pageSize,
      status: params.get('status') || status,
      keyword: params.get('keywords') || keyword,
      startDate: params.get('startDate') || startDate,
      endDate: params.get('endDate') || endDate,
    })
  }

  useEffect(() => {
    if (location.query && location.query.userId) {
      initFetch(
        qs.stringify({
          pageNo: location.query.pageNo || current,
          pageSize: location.query.pageSize || pageSize,
          status,
          keyword,
          startDate,
          endDate,
        }),
      )
    } else {
      setStatus(params.get('status') || status)
      setKeyword(params.get('keywords') || null)
      setStartDate(params.get('startDate') || null)
      setEndDate(params.get('endDate') || null)
      initFetch(prepareString())
    }
  }, [initFetch, location.search])

  useEffect(() => {
    if (disputes && disputes.data && disputes.data.meta) {
      const { meta } = disputes.data
      setCurrent(meta.pageNo)
      setPageSize(meta.pageSize)
      setTotal(meta.total)
      setBizData(disputes.data.disputes)
    }
  }, [disputes])

  const onPaginationChange = async (currentPage, pagesize) => {
    params.set('pageNo', currentPage)
    params.set('pageSize', pagesize)
    history.push({ search: params.toString() })
    await setCurrent(currentPage)
    await setPageSize(pagesize)
  }

  const handleUsersURL = (type, value) => {
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
    if (type === 'keywords') {
      setKeyword(value)
      handleUsersURL('keywords', value)
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
    } else {
      setStatus(value)
      handleUsersURL('status', value)
    }
  }

  const clearFilter = () => {
    params.delete('startDate')
    params.delete('endDate')
    params.delete('status')
    params.delete('keywords')
    params.delete('pageNo')
    params.delete('pageSize')
    history.push({ search: params.toString() })
    setStatus('')
    setKeyword(null)
    setEndDate(null)
    setStartDate(null)
    setResetFilter(!resetFilter)
  }

  const columns = getColumns()
  return (
    <div>
      <Helmet title="Disputes: List" />
      <div className="cui__utils__heading">
        <strong>All Disputes</strong>
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
              })}
              startDate={startDate}
              endDate={endDate}
              keyword={keyword}
              status={status}
            />
          </div>
        </div>
        <div className="card-body">
          <div className="text-nowrap">
            <Table
              columns={columns}
              dataSource={bizData}
              loading={disputes.loading}
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
