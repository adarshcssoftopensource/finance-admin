/* eslint-disable  */
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import qs from 'qs'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { get as _get } from 'lodash'
import { Button, Col, Divider, Form, Modal, notification, Row } from 'antd'
import InputField from 'pages/common/Components/InputField'
import ProcessingFee from 'pages/business/view/ProcessingFee/ProcessingFee'
import { addCountries, updateCountry } from 'services/country'
import { useHistory } from 'react-router-dom'
import countryInputFields from '../helper'
import StripeRaw from '../../../components/app/detailsComponents/stripeRaw'
import style from '../style.module.scss'

const { confirm } = Modal

const mapStateToProps = ({ country, dispatch, router }) => ({ country, dispatch, router })

const isReadOnly = {
  providerName: ({ location, form }) => {
    return (
      !!form.getFieldValue('providerName') &&
      location?.pathname?.split('/countries/')?.[1] !== 'add'
    )
  },
}

const Index = ({
  country: { countries, onBoardingSchema: { data: onBoardingSchemaData = [] } = {} },
  dispatch,
  router: { location },
}) => {
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
  const [countriesData, setCountriesData] = useState([])
  const [onboardingSchema, setOnboardingSchema] = useState({})
  const [providerOnboardingSchema, setProviderOnboardingSchema] = useState({})
  const splitId = useCallback(() => location.pathname.split('/countries/')[1])
  const [form] = Form.useForm()
  const history = useHistory()

  useEffect(() => {
    if (onBoardingSchemaData?.length <= 0) {
      dispatch({
        type: 'country/FETCH_ONBOARDING_SCHEMA',
      })
    }
  }, [])

  useEffect(() => {
    if (splitId) {
      initFetchCountries(qs.stringify({ keyword: splitId() }))
    }
  }, [initFetchCountries])

  useEffect(() => {
    if (countries && countries.data && splitId() !== 'add') {
      const data = countries.data.countries[0]
      setCountriesData(data)
      setOnboardingSchema(data?.onboardingSchema ? data?.onboardingSchema : onboardingSchema)
      form.setFieldsValue({
        ...data,
        currencyCode: _get(data, 'currencies[0].code', ''),
        currencyDisplayName: _get(data, 'currencies[0].displayName', ''),
        currencyName: _get(data, 'currencies[0].name', ''),
        currencySymbol: _get(data, 'currencies[0].symbol', ''),
        messageBody: _get(data, 'messages[0].body', ''),
        messageHeading: _get(data, 'messages[0].heading', ''),
        messageBody1: _get(data, 'messages[1].body', ''),
        messageHeading1: _get(data, 'messages[1].heading', ''),
        domesticFee: _get(data, 'public.domestic[0].fee', ''),
        domesticTitle: _get(data, 'public.domestic[0].title', ''),
        domesticFee1: _get(data, 'public.domestic[1].fee', ''),
        domesticTitle1: _get(data, 'public.domestic[1].title', ''),
        internationalFee: _get(data, 'public.international[0].fee', ''),
        internationalTitle: _get(data, 'public.international[0].title', ''),
        internationalFee1: _get(data, 'public.international[1].fee', ''),
        internationalTitle1: _get(data, 'public.international[1].title', ''),
      })
    }
  }, [countries])

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  const onFinish = async values => {
    const data = {
      alpha2Code: _get(values, 'alpha2Code', ''),
      alpha3Code: _get(values, 'alpha3Code', ''),
      bankChargeMessage: _get(values, 'bankChargeMessage', ''),
      bankSupported: _get(values, 'bankSupported', false),
      cardChargeMessage: _get(values, 'cardChargeMessage', ''),
      internationalCardChargeMessage: _get(values, 'internationalCardChargeMessage', ''),
      internationalBankChargeMessage: _get(values, 'internationalBankChargeMessage', ''),
      countryId: parseInt(values.countryId, 10) || 0,
      expressEnabled: _get(values, 'expressEnabled', false),
      expressSupported: _get(values, 'expressSupported', false),
      isAliPaySupported: _get(values, 'isAliPaySupported', false),
      isDeleted: _get(values, 'isDeleted', false),
      isOnboardingApplicable: _get(values, 'isOnboardingApplicable', false),
      isStripeSupported: _get(values, 'isStripeSupported', false),
      isWeChatPaySupported: _get(values, 'isWeChatPaySupported', false),
      name: _get(values, 'name', ''),
      phoneCode: parseInt(values.phoneCode, 10) || 0,
      sortname: _get(values, 'sortname', ''),
      // providerName: _get(values, 'providerName'),
      currencies: [
        {
          code: _get(values, 'currencyCode', ''),
          displayName: _get(values, 'currencyDisplayName', ''),
          name: _get(values, 'currencyName', ''),
          symbol: _get(values, 'currencySymbol', ''),
        },
      ],
      fee: [
        {
          currencies: [_get(values, 'currencyCode', '')],
          fee: {
            dynamic: _get(values, 'carddomesticDynamic', 0),
            fixed: _get(values, 'carddomesticFixed', 0.0),
          },
          international_fee: {
            dynamic: _get(values, 'cardinternationalDynamic', 0),
            fixed: _get(values, 'cardinternationalFixed', 0.0),
          },
          type: 'card',
        },
        {
          currencies: [_get(values, 'currencyCode', '')],
          fee: {
            dynamic: _get(values, 'bankdomesticDynamic', 0),
            fixed: _get(values, 'bankdomesticFixed', 0.0),
          },
          international_fee: {
            dynamic: _get(values, 'bankinternationalDynamic', 0),
            fixed: _get(values, 'bankinternationalFixed', 0.0),
          },
          type: 'bank',
        },
      ],
      messages: [
        {
          body: _get(values, 'messageBody', ''),
          heading: _get(values, 'messageHeading', ''),
        },
      ],
      public: {
        country: _get(values, 'sortname', ''),
        domestic: [
          {
            fee: _get(values, 'domesticFee', ''),
            title: _get(values, 'domesticTitle', ''),
          },
        ],
        international: [
          {
            fee: _get(values, 'internationalFee', ''),
            title: _get(values, 'internationalTitle', ''),
          },
        ],
      },
    }

    data.onboardingSchema = JSON.parse(JSON.stringify(onboardingSchema))

    if (values.domesticFee1 !== '' || values.domesticTitle1 !== '') {
      data.public.domestic.push({
        fee: _get(values, 'domesticFee1', ''),
        title: _get(values, 'domesticTitle1', ''),
      })
    }

    if (values.internationalFee1 !== '' || values.internationalTitle1 !== '') {
      data.public.international.push({
        fee: _get(values, 'internationalFee1', ''),
        title: _get(values, 'internationalTitle1', ''),
      })
    }

    if (values.messageBody1 !== '' || values.messageHeading1 !== '') {
      data.messages.push({
        body: _get(values, 'messageBody1', ''),
        heading: _get(values, 'messageHeading1', ''),
      })
    }
    if (splitId() === 'add') {
      const res = await addCountries(data)
      if (res && res.statusCode === 200) {
        form.resetFields()
        history.push({ pathname: '/countries' })
        notification.success({
          message: 'Country Added successfully',
        })
      } else {
        notification.error({
          message: res.message,
        })
      }
    } else {
      const res = await updateCountry(splitId(), data)
      if (res && res.statusCode === 200) {
        form.resetFields()
        history.push({ pathname: '/countries' })
        notification.success({
          message: 'Country Updated successfully',
        })
      } else {
        notification.error({
          message: res.message,
        })
      }
    }
  }

  const handleOnboardingSchemaJSON = async event => {
    const updatedLegalData = [...event?.updated_src]
    setOnboardingSchema(updatedLegalData)
  }

  const onBoardingSchemaOptions = useMemo(() => {
    return (
      onBoardingSchemaData?.map(value => {
        return {
          label: value.providerName,
          value: value.providerName,
        }
      }) ?? []
    )
  }, [onBoardingSchemaData?.length])

  const setSelectedProvider = selectedProvider => {
    const selectedSchema = onBoardingSchemaData.find(
      value => value.providerName === selectedProvider,
    )
    setProviderOnboardingSchema(selectedSchema || {})
  }

  const handleProviderSchemaJSON = async event => {
    const updatedLegalData = { ...event?.updated_src }
    setProviderOnboardingSchema(updatedLegalData)
  }

  const onAddProviderClick = () => {
    const providerIndex = onboardingSchema?.findIndex(
      value => value.providerName === providerOnboardingSchema.providerName,
    )
    if (providerIndex !== -1) {
      confirm({
        title: `It seems provider with name ${providerOnboardingSchema.providerName} already exists in on boarding schema? Do you want to override it?`,
        content: '',
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        onOk() {
          const newOnboardingSchema = [
            ...(onboardingSchema || []).slice(0, providerIndex),
            providerOnboardingSchema,
            ...(onboardingSchema || []).slice(providerIndex + 1, onboardingSchema?.data?.length),
          ]
          setOnboardingSchema(newOnboardingSchema)
          notification.success({
            message: 'Please review schema and update it.',
          })
        },
        onCancel() {},
      })
    } else {
      const newOnboardingSchema = [...(onboardingSchema || []), providerOnboardingSchema]
      setOnboardingSchema(newOnboardingSchema)
      notification.success({
        message: 'Please review schema and update it.',
      })
    }
  }

  /* eslint-disable */
  return (
    <>
      <Helmet title="Country: Details" />
      <div className="cui__utils__heading">
        <strong>{splitId() !== 'add' ? 'Edit Country' : 'Add new country'}</strong>
      </div>
      <div>
        <Form
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          name="control-hooks"
          layout="vertical"
          initialValues={{
            isOnboardingApplicable: false,
            expressSupported: false,
            expressEnabled: false,
            bankSupported: false,
            isStripeSupported: false,
            isAliPaySupported: false,
            isWeChatPaySupported: false,
          }}
        >
          <Row gutter={16}>
            {Object.keys(countryInputFields).map(data => {
              const fieldVal = countryInputFields[data]
              return (
                <>
                  <Divider className="align-items-start" orientation="left">
                    <h4>{fieldVal[0].title}</h4>
                  </Divider>
                  {fieldVal.map(val =>
                    val.main ? (
                      <Col span={24} className="border rounded mb-3">
                        <Col span={24} className="mt-3">
                          <h5>{val.main}</h5>
                        </Col>
                        <Row gutter={16}>
                          {val.subFields.map(subField => (
                            <Col span={subField.span}>
                              <InputField
                                name={subField.name}
                                label={subField.label}
                                rules={[
                                  {
                                    required: val.isRequired,
                                    message: `Please add ${subField.label}`,
                                  },
                                ]}
                                type={subField.type}
                                inputType={subField.inputType ? subField.inputType : 'text'}
                              />
                            </Col>
                          ))}
                        </Row>
                      </Col>
                    ) : (
                      <Col span={val.span}>
                        <InputField
                          name={val.name}
                          label={val.label}
                          rules={[{ required: val.isRequired, message: `Please add ${val.label}` }]}
                          type={val.type}
                          optionArray={val.options}
                          disabled={isReadOnly[val.name]?.({ location, form })}
                          inputType={val.inputType ? val.inputType : 'text'}
                        />
                      </Col>
                    ),
                  )}
                </>
              )
            })}
            <Divider className="align-items-start" orientation="left">
              <h4>Fee Structure</h4>
            </Divider>
            <Col span={24}>
              <div className={`card-body ${style.tabs}`}>
                <ProcessingFee
                  isCountryProcessingFees={true}
                  countryFees={countriesData?.fee || []}
                  type={splitId() !== 'add' ? 'edit' : 'add'}
                  form={form}
                />
              </div>
            </Col>
          </Row>
          <Row gutter={16}>
            <Divider className="align-items-start" orientation="left">
              <h4>Add provider</h4>
            </Divider>
            <Col span={12}>
              <InputField
                name={'selectedProvider'}
                label={'Provider'}
                type={'select'}
                value={providerOnboardingSchema.providerName}
                defaultValue={providerOnboardingSchema.providerName}
                optionArray={onBoardingSchemaOptions}
                onSelectChange={setSelectedProvider}
              />
              <Button type="primary" onClick={onAddProviderClick}>
                Add Provider
              </Button>
            </Col>
            <Col span={12}>
              <StripeRaw
                title="Provider Schema"
                data={JSON.stringify(providerOnboardingSchema)}
                onEdit={true}
                onAdd={true}
                onDelete={true}
                handleAdd={handleProviderSchemaJSON}
                handleEdit={handleProviderSchemaJSON}
                handleDelete={handleProviderSchemaJSON}
              />
            </Col>
          </Row>
          <Row gutter={16}>
            <Divider className="align-items-start" orientation="left" />
            <Col span={24}>
              <StripeRaw
                title="Review Schema (Change display order if needed)"
                data={JSON.stringify(onboardingSchema)}
                onEdit={true}
                onAdd={true}
                onDelete={true}
                handleAdd={handleOnboardingSchemaJSON}
                handleEdit={handleOnboardingSchemaJSON}
                handleDelete={handleOnboardingSchemaJSON}
              />
            </Col>
          </Row>
          <Button type="primary" htmlType="submit">
            {splitId() !== 'add' ? 'Update' : 'Submit'}
          </Button>
        </Form>
      </div>
    </>
  )
}

export default connect(mapStateToProps)(Index)
