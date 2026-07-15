/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { Input, InputGroup, InputGroupText } from 'reactstrap'
import InputMask from 'react-input-mask'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Checkbox, Select } from 'antd'
import moment from 'moment'

import NumberFormat from 'react-number-format'
import CardStatement from './cardStatement'

const disableform = ['submitted', 'verified', 'blocked']

export const Numbermask = props => {
  return (
    <div className="dateSelect">
      <InputMask
        mask={props.schema.mask}
        value={props.value}
        disabled={disableform.includes(props.formContext.businessStatus)}
        placeholder={props.schema.placeholder}
        className="form-control"
        onChange={e => {
          props.onChange(e.target.value)
        }}
      />
    </div>
  )
}

export const phoneNumberMask = props => {
  return (
    <InputMask
      mask={props.schema.mask}
      value={props.value || ''}
      type="text"
      placeholder={props.schema.placeholder}
      id="root_filter_phone"
      label="Phone"
      className="form-control"
      maxLength="12"
      onChange={e => {
        props.onChange(e.target.value)
      }}
    />
  )
}

export const BusinessTypeInputMask = props => {
  const [label, setLabel] = useState(props.schema.enum)
  return (
    <div id="onboarding_stepone">
      {label.map((ele, i) => {
        return (
          <div
            key={i}
            className="payment__onboard__business__type__list"
            style={{ textAlign: 'left' }}
          >
            <div
              className={`${props.value == ele ? 'selectedOptions' : 'selectOptions'}`}
              onClick={() => {
                {
                  props.schema.disabled ? '' : props.onChange(ele)
                }
              }}
            >
              {props.schema.enumNames[i]}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export const BusinessPhoneMask = props => {
  return (
    <PhoneInput
      disableSearchIcon
      countryCodeEditable={false}
      value={props.value ? props.value : ''}
      country={'us'}
      enableSearch
      disabled={disableform.includes(props.formContext.businessStatus)}
      onChange={e => {
        props.onChange(e)
      }}
      inputClass="w-100"
    />
  )
}

const parseInputDate = val => {
  if (!val) return null

  let date = moment(val, 'YYYY-MM-DD', true)
  if (!date.isValid()) {
    date = moment(val, 'MM/DD/YYYY', true)
  }
  return date.isValid() ? date.toDate() : null
}

export const DobMask = props => {
  const [startDate, setStartDate] = useState(parseInputDate(props.value))

  const handleChange = date => {
    setStartDate(date)

    if (!date) {
      props.onChange(null)
      return
    }

    props.onChange(moment(date).format('YYYY-MM-DD'))
  }

  return (
    <div className="dateSelect">
      <DatePicker
        isClearable
        className="form-control"
        selected={startDate}
        onChange={handleChange}
        placeholderText="MM/DD/YYYY"
        dateFormat="MM/dd/yyyy"
        maxDate={new Date()}
        peekNextMonth
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        disabled={disableform.includes(props.formContext.businessStatus)}
        onKeyDown={e => e.preventDefault()}
      />
    </div>
  )
}

export const displayMask = props => {
  const [displayname, setDisplayname] = useState(props.formContext.legalName)
  useEffect(() => {
    props.onChange(props.formContext.legalName)
    if (props.formContext.legalName === '') {
      setDisplayname(props.value)
    } else if (props.formContext.legalName !== '') {
      props.onChange(props.value || props.formContext.legalName)
      setDisplayname(props.value)
    }
  }, [])
  return (
    <div>
      <Input
        type="text"
        name={props.label}
        value={displayname}
        disabled={disableform.includes(props.formContext.businessStatus)}
        onChange={e => {
          props.onChange(e.target.value), setDisplayname(e.target.value)
        }}
      />
      <div style={{ marginLeft: '90px' }}>
        <CardStatement displayName={displayname ? displayname.toUpperCase().slice(0, 19) : ''} />
      </div>
    </div>
  )
}

export const Numberformatmask = props => {
  const [val, setVal] = useState()
  return (
    <div className="dateSelect">
      <NumberFormat
        thousandSeparator={true}
        value={props.value}
        disabled={disableform.includes(props.formContext.businessStatus)}
        className="form-control"
        onValueChange={values => {
          props.onChange(values.floatValue)
        }}
      />
    </div>
  )
}

export const TermsAndConditionMask = props => {
  return (
    <div>
      <Checkbox
        value={props.value || false}
        required={props.required}
        disabled={disableform.includes(props.formContext.businessStatus)}
        onChange={event => {
          props.onChange(event.target.checked)
        }}
        checked={props.value || false}
      >
        <span dangerouslySetInnerHTML={{ __html: props.schema.title }} />
      </Checkbox>
    </div>
  )
}

export const getWebsiteURL = url => {
  try {
    if (url?.includes('https://') || url?.includes('http://')) {
      return url
    }
    return `https://${url}`
  } catch (e) {
    console.error(`getWebsiteURL : Failed to prepare website url ${url}`)
    console.error(e)
    return url
  }
}

export const WebsiteMask = props => {
  const [website, setWebsite] = useState(props.value)
  return (
    <div className="row">
      <div className="col-lg-11 col-md-11 col-sm-11 col-xs-11" style={{ paddingRight: '0px' }}>
        <InputGroup>
          <InputGroupText>https://</InputGroupText>
          <Input
            type="text"
            name={props.label}
            value={website}
            disabled={disableform.includes(props.formContext.businessStatus)}
            onChange={e => {
              props.onChange(e.target.value), setWebsite(e.target.value)
            }}
          />
        </InputGroup>
      </div>
      <div
        className="col-lg-1 col-md-1 col-sm-1 col-xs-1 cursor-pointer"
        style={{ margin: '0px', marginTop: '8px' }}
      >
        <i
          className="fe fe-external-link"
          onClick={() => {
            window.open(`${getWebsiteURL(website)}`, '_blank')
          }}
        ></i>
      </div>
    </div>
  )
}

const { Option } = Select
export const SelectDropDown = ({
  schema: { enum: options },
  options: { enumOptions },
  onChange,
  label,
  ...props
}) => {
  return (
    <Select
      style={{ width: '100%' }}
      showSearch
      optionFilterProp="children"
      allowClear
      placeholder="Select..."
      onChange={(value, option) => {
        onChange(value)
      }}
      value={props?.value || ''}
    >
      <Option value={''}>Select {label} </Option>
      {enumOptions?.map(({ value, label }) => {
        return (
          <Option
            {...value}
            key={value?._id ?? value}
            value={value?.sortname ?? value?._id ?? value}
          >
            {label}
          </Option>
        )
      })}
    </Select>
  )
}

export const BusinessSelectDropDown = ({
  schema: { enum: options },
  options: { enumOptions },
  onChange,
  label,
  ...props
}) => {
  return (
    <Select
      style={{ width: '100%' }}
      showSearch
      optionFilterProp="children"
      allowClear
      placeholder="Select..."
      onChange={(value, option) => {
        onChange(value)
      }}
      value={props?.value || ''}
    >
      <Option value={''}>Select {label} </Option>
      {enumOptions?.map(({ value, label }) => {
        return (
          <Option {...value} key={value._id} value={value?.name ?? value?.sortname}>
            {label}
          </Option>
        )
      })}
    </Select>
  )
}
