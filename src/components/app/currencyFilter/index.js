import React, { useEffect, useCallback, useState } from 'react'
import { connect } from 'react-redux'
import { Select } from 'antd'
/* eslint-disable */
const { Option } = Select

const mapStateToProps = ({ utility, dispatch }) => ({
  utility,
  dispatch,
})

const Index = ({ handleChange, dispatch, utility: { currency }, value }) => {
  const [currencies, setCurrencies] = useState([])
  const initFetch = useCallback(() => {
    dispatch({
      type: 'utility/FETCH_ALL_CURRENCY',
      payload: {},
    })
  }, [dispatch])
  useEffect(() => {
    if (!currency.data || currency.data.length == 0) {
      initFetch()
    } else {
      setUniqueCurrency(currency.data)
    }
  }, [initFetch])

  useEffect(() => {
    if (currency.data) {
      setUniqueCurrency(currency.data)
    }
  }, [currency])

  const setUniqueCurrency = currencyData => {
    const list = Array.isArray(currencyData)
      ? currencyData
      : Array.isArray(currencyData?.currencies)
      ? currencyData.currencies
      : Array.isArray(currencyData?.data)
      ? currencyData.data
      : []

    const getCurrencies = list
      .map(arr => {
        if (arr?.currencies?.[0]) return arr.currencies[0]
        if (arr?.code) return arr
        return null
      })
      .filter(Boolean)
      .map(item => ({
        code: item.code,
        displayName: item.displayName || item.name || item.code,
        symbol: item.symbol || '',
      }))

    const setUniqCurrencies = [...new Map(getCurrencies.map(item => [item.code, item])).values()]
    setCurrencies(setUniqCurrencies)
  }

  return (
    <>
      <Select
        showSearch
        className="w-100"
        placeholder="Currency"
        size="large"
        defaultValue=""
        value={value}
        onChange={value => handleChange(value, 'currency')}
      >
        <Option value="">All</Option>
        {currencies &&
          currencies.length > 0 &&
          currencies.map(curr => (
            <Option key={curr.code} value={curr.code}>
              {curr.displayName}
            </Option>
          ))}
      </Select>
    </>
  )
}

export default connect(mapStateToProps)(Index)
