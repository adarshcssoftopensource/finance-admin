import React, { useEffect, useCallback, useState } from 'react'
import qs from 'qs'
import moment from 'moment'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import Filter from 'pages/peyme/filter'
import Table from 'components/app/table'
import getColumns from 'components/app/CommonTableFormatter/peymeTableFormatter'
import { useHistory } from 'react-router-dom'
import { Modal } from 'antd'

const { confirm } = Modal

const mapStateToProps = ({ peyme, dispatch, router }) => ({
  peyme,
  dispatch,
  router,
})

const Index = ({ dispatch, peyme: { peyme }, router: { location } }) => {
  /* eslint-disable */
  const [current, setCurrent] = useState(1)
  const [isVerified, setIsVerified] = useState('')
  const [businessId, setBusinessId] = useState(null)
  const [pageSize, setPageSize] = useState(100)
  const [total, setTotal] = useState(100)
  const [bizData, setBizData] = useState([])
  const [userId, setUserId] = useState(null)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [resetFilter, setResetFilter] = useState(false)
  const history = useHistory()
  const params = new URLSearchParams(location.search)

  const initFetch = useCallback(
    qryString => {
      dispatch({
        type: 'peyme/FETCH_ALL_PEYME',
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
      isVerified: params.get('isVerified') || isVerified,
      businessId: params.get('businessIds') || businessId,
      startDate: params.get('startDate') || startDate,
      endDate: params.get('endDate') || endDate,
    })
  }

  useEffect(() => {
    if (location.query && location.query.Id) {
      setUserId(location.query.Id)
      initFetch(
        qs.stringify({
          pageNo: location.query.pageNo || current,
          pageSize: location.query.pageSize || pageSize,
          isVerified,
          businessId,
          startDate,
          endDate,
        }),
      )
    } else {
      setIsVerified(params.get('isVerified') || isVerified)
      setBusinessId(params.get('businessIds') || null)
      setStartDate(params.get('startDate') || null)
      setEndDate(params.get('endDate') || null)
      initFetch(prepareString())
    }
  }, [initFetch, location.search])

  useEffect(() => {
    if (peyme?.data?.meta) {
      const { meta } = peyme.data
      setCurrent(meta.pageNo)
      setPageSize(meta.pageSize)
      setTotal(meta.total)
      setBizData(peyme.data.peymeList)
    }
  }, [peyme])

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
    if (type === 'businessIds') {
      setBusinessId(value)
      handlePaymentURL('businessIds', value)
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
      setIsVerified(value)
      handlePaymentURL('isVerified', value)
    }
  }

  const setUrl = () => {
    params.delete('pageNo')
    params.delete('pageSize')
    history.push({ search: params.toString() })
    setResetFilter(!resetFilter)
  }

  const clearFilter = () => {
    params.delete('startDate')
    params.delete('endDate')
    params.delete('businessIds')
    params.delete('isVerified')
    params.delete('pageNo')
    params.delete('pageSize')
    history.push({ search: params.toString() })
    setEndDate(null)
    setStartDate(null)
    setIsVerified('')
    setBusinessId(null)
    setResetFilter(!resetFilter)
  }

  const onPaginationChange = async (currentPage, pagesize) => {
    params.set('pageNo', currentPage)
    params.set('pageSize', pagesize)
    history.push({ search: params.toString() })
    await setCurrent(currentPage)
    await setPageSize(pagesize)
  }

  const changeStatus = row => {
    /* eslint-disable */
    dispatch({
      type: 'peyme/VERIFIED_UNVERIFIED_BUSINESS',
      payload: {
        id: row.id,
        isVerified: !row.isVerified,
        queryString: qs.stringify({
          pageNo: location.query.pageNo || current,
          pageSize,
          isVerified,
          userId: location.query.id,
          businessId: params.get('businessIds'),
        }),
      },
    })
  }

  const statusModal = row => {
    confirm({
      title: `Are you sure you want to ${
        row.isVerified ? 'Unverified' : 'Verified'
      } this business?`,
      content: '',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        changeStatus(row)
      },
      onCancel() {},
    })
  }

  const columns = getColumns(statusModal)
  return (
    <div>
      <Helmet title="Finance.Me Lynk: List" />
      <div className="cui__utils__heading">
        <strong>All Finance.Me Lynk</strong>
      </div>
      <div className="card">
        <div className="card-header card-header-flex">
          <div className="d-flex flex-column justify-content-center mr-auto w-100 w-100">
            <Filter
              handleFilterChange={handleFilterChange}
              clearFilter={clearFilter}
              key={resetFilter}
              qryString={prepareString()}
              isVerified={isVerified}
              businessId={businessId}
              startDate={startDate}
              endDate={endDate}
            />
          </div>
        </div>
        <div className="card-body">
          <div className="text-nowrap">
            <Table
              columns={columns}
              dataSource={bizData}
              loading={peyme.loading}
              pageSize={pageSize}
              total={total}
              current={current}
              onPaginationChange={(currentPage, size) => {
                setUrl(currentPage, size)
                onPaginationChange(currentPage, size)
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default connect(mapStateToProps)(Index)
