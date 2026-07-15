import React, { useEffect, useCallback, useState } from 'react'
import qs from 'qs'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { Spinner } from 'reactstrap'
import { Spin, Select, Button, Input, Tooltip } from 'antd'
import { get as _get, isEmpty, isUndefined } from 'lodash'
import StripeRaw from '../../../components/app/detailsComponents/stripeRaw'

/* eslint-disable */

const mapStateToProps = ({ business, dispatch, router }) => ({
  business,
  dispatch,
  router,
})

function Index({ dispatch, business: { details, businesses }, router: { location } }) {
  const [loading, setLoding] = useState(false)
  const [bizDetail, setBizDetail] = useState(null)
  const [isFirstTime, setIsFirstTime] = useState(false)
  const [cloneBusinessLoading, setCloneBusinessLoading] = useState(false)
  const [selectedBusinessId, setSelectedBusinessId] = useState('')
  const [businessList, setBusinessList] = useState([])
  const [legalName, setLegalName] = useState('')
  const [statementDescriptor, setStatementDescriptor] = useState('')
  const [previousBusinessName, setPreviousBusinessName] = useState('')
  const [searctText, setSearchText] = useState('')
  const [openSearchOption, setOpenSearchOption] = useState(false)
  const [loadingSearch, setLoadingSearch] = useState(false)

  const initFetch = useCallback(
    businessId => {
      dispatch({
        type: 'business/FETCH_BUSINESS_DETAIL',
        payload: {
          businessId,
        },
      })
    },
    [dispatch],
  )

  useEffect(() => {
    setIsFirstTime(true)
    const businessId = location.pathname.split('/business/view/')[1]
    initFetch(businessId.split('/')[0])
  }, [])

  useEffect(() => {
    if (details.data) {
      if (!isFirstTime) {
        setLoding(details.loading)
        setLegalName(previousBusinessName)
        setStatementDescriptor(previousBusinessName)
        setBizDetail(details.data.business)
      } else {
        setLoding(details.loading)
        setPreviousBusinessName(
          details.data.business?.organizationName || details.data.business?.name,
        )
        setIsFirstTime(false)
      }
    } else {
      setBizDetail(null)
    }
  }, [details.data])

  useEffect(() => {
    setLoadingSearch(false)
    if (businesses.data) {
      setBusinessList(businesses.data.businesses)
      setOpenSearchOption(true)
    }
  }, [businesses.data])

  useEffect(() => {
    if (!isUndefined(businesses.cloneLoading)) {
      setCloneBusinessLoading(businesses.cloneLoading)
    }
    if (_get(businesses, 'clonedResponse.statusCode', '') === 200) {
      setLegalName('')
      setStatementDescriptor('')
    }
  }, [businesses.cloneLoading])

  const handleBusinessSearch = value => {
    if (value && value.length > 3) {
      setSearchText(value)
    }
  }

  const handleBusinessChange = value => {
    setBizDetail(null)
    setStatementDescriptor('')
    setLegalName('')
    setSearchText('')
    setSelectedBusinessId(value)
    setOpenSearchOption(false)

    if (value) {
      setLoding(true)
      initFetch(value)
    }
  }

  const handleInputChange = event => {
    setLegalName(event.target.value)
  }

  const handleSubmit = () => {
    dispatch({
      type: 'business/CLONE_BUSINESS',
      payload: {
        businessId: location.pathname.split('/')[3],
        cloneBusinessId: bizDetail._id,
        legalName: legalName,
        statementDescriptor: statementDescriptor,
      },
    })
  }

  const handleSearchSubmit = () => {
    if (searctText && searctText.length > 3) {
      setLoadingSearch(true)
      dispatch({
        type: 'business/FETCH_ALL_BUSINESS',
        payload: {
          qryString: qs.stringify({ keyword: searctText, POBStatus: 'completed' }),
        },
      })
    }
  }

  return (
    <>
      <Helmet title="Business Clone" />
      <div>
        <div className="d-flex flex-wrap align-items-center">
          <div className="mr-auto mb-3">
            <div className="text-dark font-weight-bold font-size-24">
              {!isEmpty(previousBusinessName) ? (
                <span className="mr-3">{previousBusinessName || ''} :- Clone Business</span>
              ) : null}
            </div>
          </div>
        </div>
        <div className="mb-4 row">
          <div className="col-md-10 mb-4">
            <label className="filter-label">
              Select Business to clone
              <Tooltip placement="top" title="Search business by entring more than 3 characters">
                <i className="fe fe-info ml-2" />
              </Tooltip>
            </label>
            <Select
              showSearch
              className="w-100"
              placeholder="Select Business to clone"
              size="middle"
              defaultValue=""
              open={openSearchOption}
              value={selectedBusinessId}
              allowClear={true}
              filterOption={(input, option) => {
                return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }}
              onSearch={value => handleBusinessSearch(value)}
              onChange={value => handleBusinessChange(value)}
            >
              {businessList.length &&
                businessList.map(business => (
                  <Option value={business.organizationId} key={business._id}>
                    {business?.organizationName || business?.name}
                  </Option>
                ))}
            </Select>
          </div>
          <div className="col-md-2" style={{ marginTop: '1.3rem' }}>
            <Button
              color="primary"
              type="primary"
              onClick={() => handleSearchSubmit()}
              disabled={searctText.length < 3}
            >
              {loadingSearch ? <Spinner size="sm" color="default" /> : 'Search'}
            </Button>
          </div>
        </div>
        {loading ? (
          <div className="d-flex flex-wrap justify-content-center mt-5">
            <Spin />
          </div>
        ) : null}
        {!loading && !isEmpty(bizDetail) ? (
          <Spin spinning={cloneBusinessLoading} delay={500}>
            <div className="row">
              <div className="col-6">
                <StripeRaw title="Legal Data" data={JSON.stringify(bizDetail.legal)} />
              </div>
              <div className="col-6">
                <div className="card">
                  <div className="d-flex my-2 p-4">
                    <label className="filter-label">Doing Business As</label>
                    <Input
                      className="mb-2"
                      value={legalName}
                      onChange={e => handleInputChange(e)}
                      placeholder={'Doing Business As'}
                    />
                  </div>
                  <div className="d-flex my-2 p-4">
                    <label className="filter-label">Statement Descriptor</label>
                    <Input
                      className="mb-2"
                      defaultValue={legalName}
                      value={statementDescriptor}
                      onChange={event => setStatementDescriptor(event.target.value)}
                      placeholder={'Statement Descriptor'}
                    />
                  </div>
                  <div className="d-flex my-2 p-4">
                    <div className="d-flex ml-2">
                      <Button
                        type="primary"
                        onClick={handleSubmit}
                        disabled={!legalName || !statementDescriptor}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Spin>
        ) : null}
      </div>
    </>
  )
}

export default connect(mapStateToProps)(Index)
