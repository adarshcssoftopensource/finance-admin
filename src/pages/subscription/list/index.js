import React, { useEffect, useCallback, useState } from 'react'
import qs from 'qs'
import moment from 'moment'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import Filter from 'pages/subscription/filter'
import Subscription from 'pages/common/subscription'
import { useHistory } from 'react-router-dom'

const mapStateToProps = ({ subscriptions, dispatch, router }) => ({
  subscriptions,
  dispatch,
  router,
})

const Index = ({ dispatch, subscriptions: { subscriptions }, router: { location } }) => {
  const [current, setCurrent] = useState(1)
  const [isActive, setIsActive] = useState(null)
  const [keyword, setKeyword] = useState(null)
  const [pageSize, setPageSize] = useState(100)
  const [total, setTotal] = useState(100)
  const [data, setData] = useState([])
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [nextInvoiceStartDate, setNextInvoiceStartDate] = useState(null)
  const [nextInvoiceEndDate, setNextInvoiceEndDate] = useState(null)
  const [upcomingActivationStartDate, setUpcomingActivationStartDate] = useState(null)
  const [upcomingActivationEndDate, setUpcomingActivationEndDate] = useState(null)
  const [status, setStatus] = useState('')
  const [planId, setPlanId] = useState([''])
  const [isTrial, setIsTrial] = useState('')
  const [resetFilter, setResetFilter] = useState(false)
  const history = useHistory()
  const params = new URLSearchParams(location.search)

  const initFetch = useCallback(
    qryString => {
      dispatch({
        type: 'subscriptions/FETCH_ALL_SUBSCRIPTIONS',
        payload: {
          qryString,
        },
      })
    },
    [dispatch],
  )

  useEffect(() => {
    handleSubscriptionURL('status', 'Active')
  }, [])

  useEffect(() => {
    setKeyword(params.get('keywords') || null)
    setIsTrial(params.get('isTrial') || '')
    setNextInvoiceEndDate(params.get('nextInvoiceEndDate') || null)
    setNextInvoiceStartDate(params.get('nextInvoiceStartDate') || null)
    setUpcomingActivationEndDate(params.get('upcomingActivationEndDate') || null)
    setUpcomingActivationStartDate(params.get('upcomingActivationStartDate') || null)
    setEndDate(params.get('endDate') || null)
    setStartDate(params.get('startDate') || null)
    setStatus(params.get('status') || '')
    initFetch(convertQrtString())
  }, [
    // current,
    initFetch,
    location.search,
  ])

  const convertQrtString = () => {
    const planIdStr = planId ? planId.toString() : null
    return qs.stringify({
      pageNo: location.query.pageNo || current,
      pageSize: location.query.pageSize || pageSize,
      isActive,
      keyword: params.get('keywords') || keyword,
      startDate: params.get('startDate') || startDate,
      endDate: params.get('endDate') || endDate,
      nextInvoiceStartDate: params.get('nextInvoiceStartDate') || nextInvoiceStartDate,
      nextInvoiceEndDate: params.get('nextInvoiceEndDate') || nextInvoiceEndDate,
      upcomingActivationStartDate:
        params.get('upcomingActivationStartDate') || upcomingActivationStartDate,
      upcomingActivationEndDate:
        params.get('upcomingActivationEndDate') || upcomingActivationEndDate,
      status: params.get('status') || status,
      planId: params.get('planId') || planIdStr,
      isTrial: params.get('isTrial') || isTrial,
    })
  }

  useEffect(() => {
    if (subscriptions && subscriptions.data) {
      const { meta } = subscriptions.data
      setCurrent(meta.pageNo)
      setPageSize(meta.pageSize)
      setTotal(meta.total)
      setData(subscriptions.data.Subscriptions)
    }
  }, [subscriptions])

  const onPaginationChange = async (currentPage, pagesize) => {
    params.set('pageNo', currentPage)
    params.set('pageSize', pagesize)
    history.push({ search: params.toString() })
    await setCurrent(currentPage)
    await setPageSize(pagesize)
  }

  const handleSubscriptionURL = (type, value) => {
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
    if (type === 'keywords') {
      setKeyword(value)
      handleSubscriptionURL('keywords', value)
    } else if (type === 'status') {
      setStatus(value)
      handleSubscriptionURL('status', value)
    } else if (type === 'planId') {
      setPlanId(value.length ? value.filter(Boolean) : [''])
      handleSubscriptionURL('planId', value.length ? value.filter(Boolean) : [''])
    } else if (type === 'isTrial') {
      setIsTrial(value)
      handleSubscriptionURL('isTrial', value)
    } else if (type === 'date') {
      if (value) {
        setEndDate(moment(value[1]).format('YYYY-MM-DD'))
        setStartDate(moment(value[0]).format('YYYY-MM-DD'))
        handleDateRangeURL(
          'startDate',
          moment(value[0]).format('YYYY-MM-DD'),
          'endDate',
          moment(value[1]).format('YYYY-MM-DD'),
        )
      } else {
        setEndDate(null)
        setStartDate(null)
      }
    } else if (type === 'upcomingActivation') {
      if (value) {
        setUpcomingActivationEndDate(moment(value[1]).format('YYYY-MM-DD'))
        setUpcomingActivationStartDate(moment(value[0]).format('YYYY-MM-DD'))
        handleDateRangeURL(
          'upcomingActivationStartDate',
          moment(value[0]).format('YYYY-MM-DD'),
          'upcomingActivationEndDate',
          moment(value[1]).format('YYYY-MM-DD'),
        )
      } else {
        setUpcomingActivationEndDate(null)
        setUpcomingActivationStartDate(null)
      }
    } else if (type === 'nextInvoiceDate') {
      if (value) {
        setNextInvoiceEndDate(moment(value[1]).format('YYYY-MM-DD'))
        setNextInvoiceStartDate(moment(value[0]).format('YYYY-MM-DD'))
        handleDateRangeURL(
          'nextInvoiceStartDate',
          moment(value[0]).format('YYYY-MM-DD'),
          'nextInvoiceEndDate',
          moment(value[1]).format('YYYY-MM-DD'),
        )
      } else {
        setNextInvoiceEndDate(null)
        setNextInvoiceStartDate(null)
      }
    }
  }
  const clearFilter = () => {
    params.delete('startDate')
    params.delete('endDate')
    params.delete('keywords')
    params.delete('isTrial')
    params.delete('upcomingActivationStartDate')
    params.delete('upcomingActivationEndDate')
    params.delete('nextInvoiceStartDate')
    params.delete('nextInvoiceEndDate')
    params.delete('status')
    params.delete('planId')
    params.delete('pageNo')
    params.delete('pageSize')
    history.push({ search: params.toString() })
    setIsActive(null)
    setKeyword(null)
    setIsTrial('')
    setNextInvoiceEndDate(null)
    setNextInvoiceStartDate(null)
    setUpcomingActivationEndDate(null)
    setUpcomingActivationStartDate(null)
    setEndDate(null)
    setStartDate(null)
    setStatus('')
    setPlanId([])
    setResetFilter(!resetFilter)
  }

  const updatePlanId = plansData => {
    const getPaidPlan = plansData.map(plan => {
      if (plan.planLevel > 1) {
        /* eslint-disable */
        return plan._id
      }
      return null
    })
    let planIdString = ''
    if (params.get('planId')) {
      planIdString = params.get('planId')
      const planIds = params.get('planId').split(',')
      setPlanId(plansData.map(plan => plan._id).filter(e => planIds.includes(e)))
    } else {
      const filteredPlan = getPaidPlan.filter(e => e)
      planIdString = filteredPlan.join(',')
      setPlanId(filteredPlan)
    }
    handleSubscriptionURL('planId', planIdString)
  }

  return (
    <div>
      <Helmet title="Subscriptions: List" />
      <div className="cui__utils__heading">
        <strong>Subscription List</strong>
      </div>
      <div className="card">
        <div className="card-header card-header-flex">
          <div className="d-flex flex-column justify-content-center mr-auto w-100">
            <Filter
              handleFilterChange={handleFilterChange}
              clearFilter={clearFilter}
              key={resetFilter}
              planId={planId}
              updatePlanId={updatePlanId}
              qryString={convertQrtString()}
              status={status}
              startDate={startDate}
              endDate={endDate}
              activationEndDate={upcomingActivationEndDate}
              activationStartDate={upcomingActivationStartDate}
              nextInvoiceStartDate={nextInvoiceStartDate}
              nextInvoiceEndDate={nextInvoiceEndDate}
              keyword={keyword}
              trial={isTrial}
            />
          </div>
        </div>
        <div className="card-body">
          <div className="text-nowrap">
            <Subscription
              data={data}
              loading={subscriptions.loading}
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
