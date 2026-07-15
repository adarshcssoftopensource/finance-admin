import React, { useEffect, useCallback, useState } from 'react'
import { connect } from 'react-redux'
import { Select } from 'antd'
/* eslint-disable */
const { Option } = Select

const mapStateToProps = ({ utility, dispatch }) => ({
  utility,
  dispatch,
})

const Index = ({ handleChange, dispatch, utility: { country }, value, SortName, isBanner }) => {
  const [countries, setCountries] = useState()
  const [selectedCountries, setSelectedCountries] = useState()

  useEffect(() => {
    let countryId = ''
    if (SortName) {
      countryId =
        (countries && countries.find(country => country.sortname.toString() === value)) || ''
    } else if (isBanner) {
      countryId = (countries && countries.find(country => country._id.toString() === value)) || ''
    } else {
      countryId = (countries && countries.find(country => country.id.toString() === value)) || ''
    }
    setSelectedCountries(countryId.name)
  }, [countries, value])

  const initFetch = useCallback(() => {
    dispatch({
      type: 'utility/FETCH_ALL_COUNTRY',
      payload: {},
    })
  }, [dispatch])
  useEffect(() => {
    if (!country.data || !country.data.countries) {
      initFetch()
    } else {
      setCountries(country.data.countries)
    }
  }, [initFetch])

  useEffect(() => {
    if (country.data && country.data.countries) {
      setCountries(country.data.countries)
    }
  }, [country])

  const handleCountryChange = value => {
    const countryId = countries && countries.find(country => country.name === value)
    if (SortName) {
      handleChange(countryId ? countryId.sortname : '', 'countryId')
    } else if (isBanner) {
      handleChange(countryId ? countryId._id : '', 'countryId')
    } else {
      handleChange(countryId ? countryId.id : '', 'countryId')
    }
  }

  return (
    <>
      <Select
        showSearch
        className="w-100"
        placeholder="Country"
        size="large"
        defaultValue=""
        value={selectedCountries}
        onChange={value => handleCountryChange(value, 'countryId')}
      >
        <Option value="">All</Option>
        {countries &&
          countries.map(country => <Option value={country.name}>{country.name}</Option>)}
      </Select>
    </>
  )
}

export default connect(mapStateToProps)(Index)
