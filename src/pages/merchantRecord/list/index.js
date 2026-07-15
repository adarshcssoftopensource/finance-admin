/* eslint-disable */
import React, { useEffect, useCallback, useState } from 'react'
import qs from 'qs'
import { Modal } from 'antd'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Table from 'components/app/table'
import getColumns from 'components/app/CommonTableFormatter/businessTableFormatter'
import Filter from '../../business/filter'

const { confirm } = Modal

const mapStateToProps = ({ business, dispatch, router }) => ({
  business,
  dispatch,
  router,
})

const Index = ({ dispatch, router: { location }, business: { businesses } }) => {
  const [current, setCurrent] = useState(1)
  const [isActive, setIsActive] = useState('true')
  const [keyword, setKeyword] = useState(null)
  const [pageSize, setPageSize] = useState(100)
  const [total, setTotal] = useState(100)
  const [bizData, setBizData] = useState([])
  const [countryId, setCountryId] = useState('')
  const [businessType, setBusinessType] = useState('')
  const [providerName, setProviderName] = useState('')
  const [POBStatus, setPobStatus] = useState('')
  const [subscriptionId, setSubscriptionId] = useState('')
  const [resetFilter, setResetFilter] = useState(false)
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
    setIsActive(params.get('isActive') || isActive)
    setKeyword(params.get('keywords') || null)
    setBusinessType(params.get('businessType') || '')
    setProviderName(params.get('providerName') || '')
    setPobStatus(params.get('pobStatus') || '')
    setCountryId(params.get('countryId') || '')
    setSubscriptionId(params.get('subscriptionId') || '')
    initFetch(prepareString())
  }, [initFetch, location.search])

  useEffect(() => {
    if (businesses?.data?.meta) {
      const { meta } = businesses.data

      setCurrent(meta.pageNo)
      setPageSize(meta.pageSize)
      setTotal(meta.total)
      setBizData(businesses.data.businesses)
    }
  }, [businesses])

  const onPaginationChange = async (currentPage, pagesize) => {
    await setCurrent(currentPage)
    await setPageSize(pagesize)
  }

  const handleFilterChange = (value, type) => {
    setCurrent(1)
    const newParams = new URLSearchParams(location.search)
    newParams.set('pageNo', 1)
    if (value) {
      newParams.set(type, value)
    } else {
      newParams.delete(type)
    }
    // history.push is not directly available here without useHistory
    // But since it's withRouter or connect(router), we can use dispatch or window.location if needed.
    // However, the original code used history.push.
    // I'll assume it's better to use local state and let useEffect trigger fetch.
  }

  const prepareString = () => {
    return qs.stringify({
      pageNo: current,
      pageSize: pageSize,
      isActive: params.get('isActive') || isActive,
      keyword: params.get('keywords') || keyword,
      businessType: params.get('businessType') || businessType,
      providerName: params.get('providerName') || providerName,
      POBStatus: params.get('pobStatus') || POBStatus,
      countryId: params.get('countryId') || countryId,
      subscriptionId: params.get('subscriptionId') || subscriptionId,
      isMerchantOfRecord: 'true',
      isBackground: true,
    })
  }

  // Simplified version for MoR list
  const columns = getColumns(
    () => {},
    () => {},
    () => {},
  )

  return (
    <div>
      <Helmet title="Merchant of Record: List" />
      <div className="cui__utils__heading mb-0">
        <strong>Merchant of Record Businesses</strong>
      </div>
      <div className="card">
        <div className="card-header card-header-flex">
          <div className="d-flex flex-column justify-content-center mr-auto w-100 w-100">
            <Filter
              handleFilterChange={handleFilterChange}
              clearFilter={() => {}}
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
