import React, { useEffect, useCallback, useState } from 'react'
import qs from 'qs'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import Filter from 'pages/countries/filter'
import { useHistory, Link } from 'react-router-dom'

import Table from 'components/app/table'
import getColumns from 'components/app/CommonTableFormatter/countriesTableFormatter'

const mapStateToProps = ({ country, dispatch, router }) => ({
  country,
  dispatch,
  router,
})

/* eslint-disable */

const Index = ({ dispatch, country: { countryFees, countries }, router: { location } }) => {
  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(1000)
  const [total, setTotal] = useState(1000)
  const [keyword, setKeyword] = useState(null)
  const [countryFeesData, setCountryFeesData] = useState(null)
  const [countriesData, setCountriesData] = useState([])
  const [tempCountriesData, setTempCountriesData] = useState([])
  const [countryId, setCountryId] = useState('')
  const [resetFilter, setResetFilter] = useState(false)
  const history = useHistory()
  const params = new URLSearchParams(location.search)

  const initFetch = useCallback(
    qryString => {
      dispatch({
        type: 'country/FETCH_COUNTRY_FEES_BY_COUNTRY_ID',
        payload: {
          countryId: qryString,
        },
      })
    },
    [dispatch],
  )

  const initFetchCountries = useCallback(
    qryString => {
      dispatch({
        type: 'country/FETCH_COUNTRIES',
        payload: {
          qryString,
        },
      })
    },
    [dispatch],
  )

  useEffect(() => {
    const queryCountryId = params.get('countryId') || countryId
    if (queryCountryId) {
      setCountryId(queryCountryId)
      initFetch(queryCountryId)
    }
  }, [initFetch, location.search])

  useEffect(() => {
    const queryKeyword = params.get('keywords') || keyword
    const queryCountryId = params.get('countryId') || countryId
    setCountryId(queryCountryId)
    initFetchCountries(
      qs.stringify({
        pageNo: location.query.pageNo || current,
        pageSize: location.query.pageSize || pageSize,
        keyword: queryKeyword,
      }),
    )
  }, [initFetchCountries, location.search])

  useEffect(() => {
    if (countryFees && countryFees.data) {
      setCountryFeesData(countryFees.data.countryFees)
    }
  }, [countryFees])

  useEffect(() => {
    if (countries?.data?.meta) {
      const { meta } = countries.data
      setCurrent(meta.pageNo)
      setPageSize(meta.pageSize)
      setTotal(meta.total)
      setCountriesData(countries.data.countries)
      setTempCountriesData(countries.data.countries)
    }
  }, [countries])

  const handleCountryCurrencyFeesURL = (type, value) => {
    if (value) {
      params.set(type, value)
    } else {
      params.delete(type)
    }
    history.push({ search: params.toString() })
  }

  const filterCountries = value => {
    setCurrent(1)
    if (value) {
      const clonedCountryData = [...tempCountriesData]
      const filterCountries = clonedCountryData.filter(
        country =>
          country.name.toLowerCase().includes(value.toLowerCase()) ||
          country.sortname.toLowerCase() === value.toLowerCase() ||
          country.alpha3Code.toLowerCase() === value.toLowerCase(),
      )
      setCountriesData(filterCountries)
      setTotal(filterCountries.length)
    } else if (countries?.data?.meta) {
      const { meta } = countries.data
      setCurrent(meta.pageNo)
      setPageSize(meta.pageSize)
      setTotal(meta.total)
      setCountriesData(countries.data.countries)
      setTempCountriesData(countries.data.countries)
    }
  }

  const handleFilterChange = (value, type) => {
    history.push({ pageNo: 1 })
    if (type === 'countryId') {
      setCountryId(value)
      handleCountryCurrencyFeesURL('countryId', value)
    } else if (type === 'keywords') {
      setKeyword(value)
      filterCountries(value)
    }
  }

  const clearFilter = () => {
    params.delete('countryId')
    params.delete('pageNo')
    params.delete('pageSize')
    params.delete('keywords')
    history.push({ search: params.toString() })
    setCountryId('')
    setKeyword(null)
    setCountryFeesData(null)
    filterCountries()
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
      <Helmet title="Countries: List" />
      <div className="cui__utils__heading">
        <strong>Countries</strong>
        <Link to={`/countries/add`} className="float-right btn btn-md btn-primary">
          Add Country
        </Link>
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
                countryId,
                keyword,
              })}
              countryId={countryId}
              keyword={keyword}
            />
          </div>
        </div>

        <div className="card-body">
          <div className="text-nowrap">
            <Table
              columns={columns}
              dataSource={countriesData}
              loading={countries.loading}
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
