/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useCallback, useState } from 'react'
import qs from 'qs'
import { Modal } from 'antd'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { useHistory, withRouter } from 'react-router-dom'
import Table from 'components/app/table'
import getColumns from 'components/app/CommonTableFormatter/businessTableFormatter'
import Filter from '../filter'

const { confirm } = Modal

const mapStateToProps = ({ business, dispatch, router }) => ({
  business,
  dispatch,
  router,
})

const Index = ({ dispatch, router: { location }, business: { businesses } }) => {
  const [current, setCurrent] = useState(1)
  const [isActive, setIsActive] = useState(location.query && location.query.userId ? '' : 'true')
  const [keyword, setKeyword] = useState(null)
  const [pageSize, setPageSize] = useState(100)
  const [total, setTotal] = useState(100)
  const [bizData, setBizData] = useState([])
  const [userId, setUserId] = useState(null)
  const [countryId, setCountryId] = useState('')
  const [userName, setUserName] = useState(null)
  const [businessType, setBusinessType] = useState('')
  const [providerName, setProviderName] = useState('')
  const [POBStatus, setPobStatus] = useState('')
  const [subscriptionId, setSubscriptionId] = useState('')
  const [resetFilter, setResetFilter] = useState(false)
  const history = useHistory()
  const params = new URLSearchParams(location.search)

  const initFetch = useCallback(
    qryString => {
      dispatch({
        type: 'business/FETCH_ALL_BUSINESS',
        payload: {
          qryString,
        },
      })
    },
    [dispatch],
  )

  useEffect(() => {
    if (location.query && location.query.userId && location.query.userName) {
      setUserId(location.query.userId)
      setUserName(location.query.userName)
      initFetch(
        qs.stringify({
          pageNo: location.query.pageNo || current,
          pageSize: location.query.pageSize || pageSize,
          isActive,
          countryId,
          keyword,
          businessType,
          providerName,
          POBStatus,
          userId: location.query.userId,
          subscriptionId,
        }),
      )
    } else {
      setUserId(null)
      setUserName(null)
      setIsActive(params.get('isActive') || isActive)
      setKeyword(params.get('keywords') || null)
      setBusinessType(params.get('businessType') || '')
      setProviderName(params.get('providerName') || '')
      setPobStatus(params.get('pobStatus') || '')
      setCountryId(params.get('countryId') || '')
      setSubscriptionId(params.get('subscriptionId') || '')
      initFetch(prepareString())
    }
  }, [initFetch, userId, location.search])

  useEffect(() => {
    if (businesses?.data?.meta) {
      const { meta } = businesses.data
      setCurrent(meta.pageNo)
      setPageSize(meta.pageSize)
      setTotal(meta.total)
      setBizData(businesses.data.businesses)
    }
  }, [businesses])

  const setUrl = (currentPage, size) => {
    params.set('pageNo', currentPage)
    params.set('pageSize', size)
    history.push({ search: params.toString() })
  }

  const onPaginationChange = async (currentPage, pagesize) => {
    await setCurrent(currentPage)
    await setPageSize(pagesize)
  }

  const handleBusinessURL = (type, value) => {
    params.set('pageNo', 1)
    params.set('pageSize', location.query.pageSize || pageSize)
    if (value) {
      params.set(type, value)
    } else {
      params.delete(type)
    }
    history.push({ search: params.toString() })
  }

  const handleFilterChange = (value, type) => {
    if (!location.query && !location.query.userId && !location.query.userName) {
      history.push({ pageNo: 1 })
    }
    setCurrent(1)
    if (type === 'keywords') {
      setKeyword(value)
      handleBusinessURL('keywords', value)
    } else if (type === 'countryId') {
      setCountryId(value)
      handleBusinessURL('countryId', value)
    } else if (type === 'businessType') {
      setBusinessType(value)
      handleBusinessURL('businessType', value)
    } else if (type === 'providerName') {
      setProviderName(value)
      handleBusinessURL('providerName', value)
    } else if (type === 'pobStatus') {
      setPobStatus(value)
      handleBusinessURL('pobStatus', value)
    } else if (type === 'subscriptionId') {
      setSubscriptionId(value)
      handleBusinessURL('subscriptionId', value)
    } else {
      setIsActive(value)
      handleBusinessURL('isActive', value)
    }
  }

  const changeStatus = row => {
    /* eslint-disable */
    dispatch({
      type: 'business/ACTIVE_DEACTIVE_BUSINESS',
      payload: {
        businessId: row._id,
        isActive: !row.isActive,
        queryString: qs.stringify({
          pageNo: location.query.pageNo || current,
          pageSize,
          isActive,
          keyword,
          userId: location.query.userId,
          businessType,
          POBStatus,
          providerName,
          countryId,
          subscriptionId,
        }),
      },
    })
  }

  const showDeleteConfirm = row => {
    confirm({
      title: `Are you sure you want to ${row.isActive ? 'deactivate' : 'activate'} this business?`,
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

  const deleteStripeAccount = businessId => {
    /* eslint-disable */
    dispatch({
      type: 'business/DELETE_STRIPE_ACCOUNT',
      payload: {
        businessId: businessId,
        qryString: prepareString(),
      },
    })
  }

  const showDeleteStripeConfirm = row => {
    confirm({
      title: `Are you sure you want to clear the payments onboarding application?`,
      content: '',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteStripeAccount(row._id)
      },
      onCancel() {},
    })
  }

  const clearFilter = () => {
    params.delete('countryId')
    params.delete('businessType')
    params.delete('providerName')
    params.delete('pobStatus')
    params.delete('keywords')
    params.delete('isActive')
    params.delete('pageNo')
    params.delete('pageSize')
    params.delete('subscriptionId')
    history.push({ search: params.toString() })
    setIsActive('true')
    setKeyword(null)
    setCountryId('')
    setBusinessType('')
    setProviderName('')
    setPobStatus('')
    setSubscriptionId('')
    setResetFilter(!resetFilter)
  }

  const prepareString = () => {
    return qs.stringify({
      pageNo: location.query.pageNo || current,
      pageSize: location.query.pageSize || pageSize,
      isActive: params.get('isActive') || isActive,
      keyword: params.get('keywords') || keyword,
      businessType: params.get('businessType') || businessType,
      providerName: params.get('providerName') || providerName,
      POBStatus: params.get('pobStatus') || POBStatus,
      countryId: params.get('countryId') || countryId,
      subscriptionId: params.get('subscriptionId') || subscriptionId,
      userId: null,
      isBackground: true,
    })
  }

  const syncBusinessStripeData = row => {
    dispatch({
      type: 'business/SYNC_BUSINESS_STRIPE_DATA',
      payload: {
        businessId: row._id,
      },
    })
  }

  const columns = getColumns(showDeleteConfirm, showDeleteStripeConfirm, syncBusinessStripeData)
  return (
    <div>
      <Helmet title="Business: List" />
      <div className="cui__utils__heading mb-0">
        <strong>All Businesses</strong>
      </div>
      {userName && <p className="text-muted mb-3">You're viewing {userName} businesses.</p>}
      <div className="card">
        <div className="card-header card-header-flex">
          <div className="d-flex flex-column justify-content-center mr-auto w-100 w-100">
            <Filter
              handleFilterChange={handleFilterChange}
              clearFilter={clearFilter}
              key={resetFilter}
              isActive={isActive}
              qryString={prepareString()}
              keyword={keyword}
              countryId={countryId}
              pobStatus={POBStatus}
              businessType={businessType}
              providerName={providerName}
              subscriptionId={subscriptionId}
            />
          </div>
        </div>
        <div className="card-body">
          <div className="text-nowrap">
            <Table
              columns={columns}
              dataSource={bizData}
              loading={businesses.loading}
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

export default withRouter(connect(mapStateToProps)(Index))
