import React from 'react'
import { connect } from 'react-redux'
import { Select } from 'antd'
/* eslint-disable */
const { Option } = Select

const mapStateToProps = ({ dispatch }) => ({
  dispatch,
})

export const PROVIDERS_LIST = [
  {
    label: 'Stripe',
    value: 'stripe',
  },
  {
    label: 'Paysafe',
    value: 'tilled',
  },
  {
    label: 'Paypal',
    value: 'paypal',
  },
  {
    label: 'Rapyd',
    value: 'rapyd',
  },
  {
    label: 'BlueSnap',
    value: 'blueSnap',
  },
  {
    label: 'Checkout',
    value: 'checkout',
  },
  {
    label: 'Wepay',
    value: 'wepay',
  },
  {
    label: 'PayArc',
    value: 'payarc',
  },
  {
    label: 'Adyen',
    value: 'adyen',
  },
  {
    label: 'Finix',
    value: 'finix',
  },
  {
    label: 'Justifi',
    value: 'justifi',
  },
  {
    label: 'Ecrypt',
    value: 'ecrypt',
  },
  {
    label: 'NMI',
    value: 'nmi',
  },
]

const ProviderFilter = ({
  handleChange,
  value,
  placeholder,
  size,
  className,
  style,
  showSearch,
  isDisabled,
  defaultOptionLabel,
  extraOptions = [],
}) => {
  return (
    <>
      <Select
        style={style}
        showSearch={showSearch}
        className={className || 'w-100'}
        placeholder={placeholder || 'Select Provider'}
        size={size || 'large'}
        defaultValue=""
        value={value}
        onChange={value => handleChange(value, 'providerName')}
        disabled={isDisabled || false}
      >
        <Option value="">{defaultOptionLabel || 'All'}</Option>
        {[...PROVIDERS_LIST, ...extraOptions].map(provider => (
          <Option key={provider?.value} value={provider.value}>
            {provider.label}
          </Option>
        ))}
      </Select>
    </>
  )
}

export default connect(mapStateToProps)(ProviderFilter)
