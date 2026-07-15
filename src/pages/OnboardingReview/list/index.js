/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useCallback, useState } from 'react'
import qs from 'qs'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { useHistory, withRouter } from 'react-router-dom'
import Table from 'components/app/table'
import { bulkBlockOnboardingBusiness } from 'services/business'
import { notification } from 'antd'
import getColumns from './getColumns'
import Filter from '../filter'

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
  const [resetFilter, setResetFilter] = useState(false)
  const [selectedBusiness, setSelectedBusiness] = useState([])
  const [blockLoading, setBlockLoading] = useState(false)
  const history = useHistory()
  const params = new URLSearchParams(location.search)

  const initFetch = useCallback(
    qryString => {
      dispatch({
        type: 'business/FETCH_ALL_ONBOARDING_REVIEW_BUSINESS',
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
          userId: location.query.userId,
          providerName,
        }),
      )
    } else {
      setUserId(null)
      setUserName(null)
      setIsActive(params.get('isActive') || isActive)
      setKeyword(params.get('keywords') || null)
      setBusinessType(params.get('businessType') || '')
      setCountryId(params.get('countryId') || '')
      setProviderName(params.get('providerName') || '')
      initFetch(prepareString())
    }
  }, [initFetch, userId, location.search])

  useEffect(() => {
    if (businesses && businesses.data) {
      const { meta } = businesses.data
      setCurrent(meta.pageNo)
      setPageSize(meta.pageSize)
      setTotal(meta.total)
      setBizData(businesses.data.businesses)
    }
  }, [businesses])

  const setUrl = (currentPage, size) => {
    params.append('pageNo', currentPage)
    params.append('pageSize', size)
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
    } else {
      setIsActive(value)
      handleBusinessURL('isActive', value)
    }
  }

  const clearFilter = () => {
    params.delete('countryId')
    params.delete('businessType')
    params.delete('keywords')
    params.delete('isActive')
    params.delete('pageNo')
    params.delete('pageSize')
    params.delete('providerName')
    history.push({ search: params.toString() })
    setIsActive('true')
    setKeyword(null)
    setCountryId('')
    setBusinessType('')
    setProviderName('')
    setResetFilter(!resetFilter)
  }

  const prepareString = () => {
    return qs.stringify({
      pageNo: location.query.pageNo || current,
      pageSize: location.query.pageSize || pageSize,
      isActive: params.get('isActive') || isActive,
      keyword: params.get('keywords') || keyword,
      businessType: params.get('businessType') || businessType,
      countryId: params.get('countryId') || countryId,
      userId: null,
      businessStatus: 'awaiting_approval',
      providerName: params.get('providerName') || providerName,
    })
  }

  const handleBlock = async () => {
    setBlockLoading(true)
    await bulkBlockOnboardingBusiness('blocked', selectedBusiness).then(res => {
      if (res && res.statusCode === 200) {
        notification.success({
          message: res.message,
        })
      } else {
        notification.error({
          message: res.message,
        })
      }
      setBlockLoading(false)
    })
  }

  const rowSelection = {
    onChange: selectedRowKeys => {
      setSelectedBusiness(selectedRowKeys)
    },
  }

  const columns = getColumns()
  return (
    <div>
      <Helmet title="Business: List" />
      <div className="cui__utils__heading mb-0">
        <strong>Businesses Onboarding Review</strong>
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
              businessType={businessType}
              selectedBusiness={selectedBusiness}
              blockLoading={blockLoading}
              handleBlock={handleBlock}
              providerName={providerName}
            />
          </div>
        </div>
        <div className="card-body">
          <div className="text-nowrap">
            <Table
              rowSelection={{ type: 'checkbox', ...rowSelection }}
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
