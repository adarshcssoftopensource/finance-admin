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

  const handleSubscriptionURL = useCallback(
    (type, value) => {
      const p = new URLSearchParams(location.search)
      p.set('pageNo', 1)
      p.set('pageSize', location.query.pageSize || pageSize)
      if (value) {
        p.set(type, value)
      } else {
        p.delete(type)
      }
      history.push({ search: p.toString() })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location.search, pageSize, history],
  )

  const convertQrtString = useCallback(() => {
    const p = new URLSearchParams(location.search)
    const planIdStr = planId ? planId.toString() : null
    return qs.stringify({
      pageNo: location.query.pageNo || current,
      pageSize: location.query.pageSize || pageSize,
      isActive,
      keyword: p.get('keywords') || keyword,
      startDate: p.get('startDate') || startDate,
      endDate: p.get('endDate') || endDate,
      nextInvoiceStartDate: p.get('nextInvoiceStartDate') || nextInvoiceStartDate,
      nextInvoiceEndDate: p.get('nextInvoiceEndDate') || nextInvoiceEndDate,
      upcomingActivationStartDate:
        p.get('upcomingActivationStartDate') || upcomingActivationStartDate,
      upcomingActivationEndDate: p.get('upcomingActivationEndDate') || upcomingActivationEndDate,
      status: p.get('status') || status,
      planId: p.get('planId') || planIdStr,
      isTrial: p.get('isTrial') || isTrial,
    })
  }, [
    location.search,
    location.query,
    current,
    pageSize,
    isActive,
    keyword,
    startDate,
    endDate,
    nextInvoiceStartDate,
    nextInvoiceEndDate,
    upcomingActivationStartDate,
    upcomingActivationEndDate,
    status,
    planId,
    isTrial,
  ])

  useEffect(() => {
    handleSubscriptionURL('status', 'Active')
  }, [handleSubscriptionURL])

  useEffect(() => {
    const p = new URLSearchParams(location.search)
    setKeyword(p.get('keywords') || null)
    setIsTrial(p.get('isTrial') || '')
    setNextInvoiceEndDate(p.get('nextInvoiceEndDate') || null)
    setNextInvoiceStartDate(p.get('nextInvoiceStartDate') || null)
    setUpcomingActivationEndDate(p.get('upcomingActivationEndDate') || null)
    setUpcomingActivationStartDate(p.get('upcomingActivationStartDate') || null)
    setEndDate(p.get('endDate') || null)
    setStartDate(p.get('startDate') || null)
    setStatus(p.get('status') || '')
    initFetch(convertQrtString())
  }, [initFetch, location.search, convertQrtString])

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
    const p = new URLSearchParams(location.search)
    p.set('pageNo', currentPage)
    p.set('pageSize', pagesize)
    history.push({ search: p.toString() })
    await setCurrent(currentPage)
    await setPageSize(pagesize)
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
