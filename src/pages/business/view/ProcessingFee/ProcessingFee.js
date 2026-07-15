import React, { Fragment, useEffect, useState } from 'react'
import { Menu, Dropdown, Button, Table, Input, Form, notification, Spin, Select } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import {
  getProcessingFeeDetails,
  businessUpdate,
  getFeeTemplatesList,
  addTemplatesDetails,
  resetProcessingFee,
} from 'services/processingFee'
import { updateCountryFees } from 'services/country'
import { useParams } from 'react-router-dom'
import { Modal, ModalBody, ModalHeader, Label } from 'reactstrap'

/* eslint-disable */
const { Option } = Select
const FormFieldWrapper = ({ type, row, children, className, name }) => {
  if (type) {
    return (
      <Form.Item name={name} className={className}>
        {children}
      </Form.Item>
    )
  } else {
    return <div className={className}>{children}</div>
  }
}

const RiskLevels = [
  {
    label: 'Low Risk',
    value: 'low',
  },
  {
    label: 'Mid Risk',
    value: 'mid',
  },
  {
    label: 'High Risk',
    value: 'high',
  },
]

const ProcessingFee = ({
  countryId,
  countryFees = [],
  isCountryProcessingFees = false,
  type,
  form,
  isHideCreateTemplate = false,
  isFullWidth = false,
  isRiskLevel = false,
  businessRiskLevel,
  refreshVerificationDocuments,
  isRefreshVerificationDocuments,
}) => {
  const [ProcessingFeeList, setProcessingFeeList] = useState([])
  const [TemplatesList, setTemplatesList] = useState([])
  const [templateName, setTemplateName] = useState('')
  const [modal, setModal] = useState(false)
  const [selectedTemplete, setSelectedTemplete] = useState('List of templates')
  const [isRequiredName, setIsRequiredName] = useState(false)
  const [isSaveLoading, setSaveLoading] = useState(false)
  const [riskLevel, setRiskLevel] = useState('low')
  const [riskLevelLabel, setRiskLevelLabel] = useState('Low Risk')
  const [Value, setValue] = useState([
    {
      type: 'card',
      fee: {
        dynamic: 0,
        fixed: 0,
      },
      international_fee: {
        dynamic: 0,
        fixed: 0,
      },
      passFee: {
        dynamic: 0,
        fixed: 0,
      },
      international_passFee: {
        dynamic: 0,
        fixed: 0,
      },
    },
    {
      type: 'bank',
      fee: {
        dynamic: 0,
        fixed: 0,
      },
      international_fee: {
        dynamic: 0,
        fixed: 0,
      },
      passFee: {
        dynamic: 0,
        fixed: 0,
      },
      international_passFee: {
        dynamic: 0,
        fixed: 0,
      },
    },
    {
      type: 'crypto',
      fee: {
        dynamic: 0,
        fixed: 0,
      },
      international_fee: {
        dynamic: 0,
        fixed: 0,
      },
      passFee: {
        dynamic: 0,
        fixed: 0,
      },
      international_passFee: {
        dynamic: 0,
        fixed: 0,
      },
    },
  ])

  const { id } = useParams()

  useEffect(() => {
    ;(async () => {
      await getProcessingFee()
    })()
  }, [])

  useEffect(() => {
    const riskObject = RiskLevels.find(risk => risk.value === businessRiskLevel)
    setRiskLevel(businessRiskLevel)
    setRiskLevelLabel(riskObject?.label)
  }, [businessRiskLevel])

  const handleProcessFeeList = async fees => {
    fees.forEach(ar => {
      if (ar.fee === undefined || Object.keys(ar.fee).length === 0) {
        ar.fee = { dynamic: 0, fixed: 0 }
      }
      if (ar.fee !== undefined && ar.fee.dynamic === undefined) {
        ar.fee.dynamic = 0
      }
      if (ar.fee !== undefined && ar.fee.fixed === undefined) {
        ar.fee.fixed = 0
      }
      if (ar.international_fee === undefined || Object.keys(ar.international_fee).length === 0) {
        ar.international_fee = { dynamic: 0, fixed: 0 }
      }
      if (ar.international_fee !== undefined && ar.international_fee.dynamic === undefined) {
        ar.international_fee.dynamic = 0
      }
      if (ar.international_fee !== undefined && ar.international_fee.fixed === undefined) {
        ar.international_fee.fixed = 0
      }
      if (ar.passFee === undefined || Object.keys(ar.passFee).length === 0) {
        ar.passFee = { dynamic: 0, fixed: 0 }
      }
      if (ar.passFee !== undefined && ar.passFee.dynamic === undefined) {
        ar.passFee.dynamic = 0
      }
      if (ar.passFee !== undefined && ar.passFee.fixed === undefined) {
        ar.passFee.fixed = 0
      }
      if (
        ar.international_passFee === undefined ||
        Object.keys(ar.international_passFee).length === 0
      ) {
        ar.international_passFee = { dynamic: 0, fixed: 0 }
      }
      if (
        ar.international_passFee !== undefined &&
        ar.international_passFee.dynamic === undefined
      ) {
        ar.international_passFee.dynamic = 0
      }
      if (ar.international_passFee !== undefined && ar.international_passFee.fixed === undefined) {
        ar.international_passFee.fixed = 0
      }
    })
    setProcessingFeeList(fees)
  }

  useEffect(() => {
    ;(async () => {
      if (isCountryProcessingFees && countryFees.length) {
        const filteredCountryFees = countryFees.filter(fee => fee.type !== 'manual')
        await handleProcessFeeList(filteredCountryFees)
      }
    })()
  }, [countryFees])

  const getProcessingFee = async () => {
    if (id && !isCountryProcessingFees) {
      const res = await getProcessingFeeDetails(id)
      if (res && res?.statusCode === 200) {
        const fees = res?.data?.processingFee
        await handleProcessFeeList(fees)
      }
    }
  }

  const handleResetProcessingFee = async () => {
    const res = await resetProcessingFee(id)
    if (res && res?.statusCode === 200) {
      await getProcessingFee()
      notification.success({
        message: 'Processing Fee reset successfully',
      })
    } else {
      notification.error({
        message: res.error.message,
      })
    }
  }

  const HandleModal = () => {
    setModal(true)
  }

  function handleMenuClick(e, tmpName) {
    setProcessingFeeList(e.fee)
    setSelectedTemplete(tmpName)
  }

  useEffect(() => {
    ;(async () => {
      const res = await getFeeTemplatesList()
      if (res && res?.statusCode === 200) {
        setTemplatesList(res?.data?.feeTemplate)
      }
    })()
  }, [modal])

  const menu = (
    <Menu>
      {TemplatesList &&
        TemplatesList.length > 0 &&
        TemplatesList.map(item => {
          return (
            <Menu.Item onClick={() => handleMenuClick(item, item?.templateName)}>
              {item?.templateName}
            </Menu.Item>
          )
        })}
    </Menu>
  )

  const menuRiskLevel = (
    <Menu>
      {RiskLevels.map(item => {
        return (
          <Menu.Item
            onClick={() => {
              setRiskLevel(item.value)
              setRiskLevelLabel(item.label)
            }}
          >
            {item?.label}
          </Menu.Item>
        )
      })}
    </Menu>
  )

  const columns = [
    {
      title: 'Payment method',
      dataIndex: 'type',
      width: 200,
      key: 'method',
      render: text => <a>{text}</a>,
    },
    {
      title: 'Domestic',
      dataIndex: 'fee',
      width: 300,
      key: 'fee',
      render: (text, row, index) => {
        const formObjData = {}
        formObjData[`${row.type}domesticDynamic`] = row.fee.dynamic
        formObjData[`${row.type}domesticFixed`] = row.fee.fixed
        if (type) {
          form.setFieldsValue(formObjData)
        }
        return (
          <>
            <FormFieldWrapper
              type={type}
              row={row}
              className="mb-3"
              name={`${row.type}domesticDynamic`}
            >
              <Input
                placeholder="0"
                value={text?.dynamic}
                onChange={e => handleOnChange(e.target.value, 'fee', 'dynamic', index)}
                addonBefore="Percentage (%)"
              />
            </FormFieldWrapper>
            <FormFieldWrapper
              type={type}
              className="mb-0"
              row={row}
              name={`${row.type}domesticFixed`}
            >
              <Input
                placeholder="0.00"
                value={text?.fixed}
                onChange={e => handleOnChange(e.target.value, 'fee', 'fixed', index)}
                addonBefore="Flat Fee ($)"
              />
            </FormFieldWrapper>
          </>
        )
      },
    },
    {
      title: 'International',
      dataIndex: 'international_fee',
      width: 300,
      key: 'international',
      render: (text, row, index) => {
        const formObjData = {}
        formObjData[`${row.type}internationalDynamic`] = row.international_fee.dynamic
        formObjData[`${row.type}internationalFixed`] = row.international_fee.fixed
        if (type) {
          form.setFieldsValue(formObjData)
        }
        return (
          <>
            <FormFieldWrapper
              type={type}
              className="mb-3"
              row={row}
              name={`${row.type}internationalDynamic`}
            >
              <Input
                placeholder="0%"
                value={text?.dynamic}
                onChange={e =>
                  handleOnChange(e.target.value, 'international_fee', 'dynamic', index)
                }
                addonBefore="Percentage (%)"
              />
            </FormFieldWrapper>
            <FormFieldWrapper
              type={type}
              className="mb-0"
              row={row}
              name={`${row.type}internationalFixed`}
            >
              <Input
                placeholder="0.00"
                value={text?.fixed}
                onChange={e => handleOnChange(e.target.value, 'international_fee', 'fixed', index)}
                addonBefore="Flat Fee ($)"
              />
            </FormFieldWrapper>
          </>
        )
      },
    },
    {
      title: 'Domestic Pass Fee',
      dataIndex: 'passFee',
      width: 300,
      key: 'passFee',
      render: (text, row, index) => {
        return (
          <>
            <FormFieldWrapper
              type={type}
              className="mb-3"
              row={row}
              name={`${row.type}passFeeDynamic`}
            >
              <Input
                placeholder="0"
                value={text?.dynamic}
                onChange={e => handleOnChange(e.target.value, 'passFee', 'dynamic', index)}
                addonBefore="Percentage (%)"
              />
            </FormFieldWrapper>
            <FormFieldWrapper
              type={type}
              className="mb-0"
              row={row}
              name={`${row.type}passFeeFixed`}
            >
              <Input
                placeholder="0.00"
                value={text?.fixed}
                onChange={e => handleOnChange(e.target.value, 'passFee', 'fixed', index)}
                addonBefore="Flat Fee ($)"
              />
            </FormFieldWrapper>
          </>
        )
      },
    },
    {
      title: 'International Pass Fee',
      dataIndex: 'international_passFee',
      width: 300,
      key: 'international_passFee',
      render: (text, row, index) => {
        return (
          <>
            <FormFieldWrapper
              type={type}
              className="mb-3"
              row={row}
              name={`${row.type}international_passFeeDynamic`}
            >
              <Input
                placeholder="0"
                value={text?.dynamic}
                onChange={e =>
                  handleOnChange(e.target.value, 'international_passFee', 'dynamic', index)
                }
                addonBefore="Percentage (%)"
              />
            </FormFieldWrapper>
            <FormFieldWrapper
              type={type}
              className="mb-0"
              row={row}
              name={`${row.type}international_passFeeFixed`}
            >
              <Input
                placeholder="0.00"
                value={text?.fixed}
                onChange={e =>
                  handleOnChange(e.target.value, 'international_passFee', 'fixed', index)
                }
                addonBefore="Flat Fee ($)"
              />
            </FormFieldWrapper>
          </>
        )
      },
    },
  ]

  const returnFeeType = index => {
    let type = ''
    if (index === 0) {
      type = 'card'
    }
    if (index === 1) {
      type = 'bank'
    }
    if (index === 2) {
      type = 'crypto'
    }
    if (index === 3) {
      type = 'manual'
    }
    return type
  }

  const column = [
    {
      title: 'Payment method',
      dataIndex: 'type',
      width: 200,
      key: 'method',
      render: text => <a>{text}</a>,
    },
    {
      title: 'Domestic',
      dataIndex: 'fee',
      width: 300,
      key: 'fee',
      render: (text, row, index) => {
        const formObjData = {}
        formObjData[`${row.type}domesticDynamic`] = row.fee.dynamic
        formObjData[`${row.type}domesticFixed`] = row.fee.fixed
        if (type) {
          form.setFieldsValue(formObjData)
        }
        return (
          <>
            <FormFieldWrapper
              type={type}
              className="mb-3"
              row={row}
              name={`${row.type}domesticDynamic`}
            >
              <Input
                placeholder="0"
                value={text?.dynamic}
                onChange={e => feeDetails(e.target.value, 'fee', 'dynamic', index)}
                addonBefore="Percentage (%)"
              />
            </FormFieldWrapper>
            <FormFieldWrapper
              type={type}
              className="mb-0"
              row={row}
              name={`${row.type}domesticFixed`}
            >
              <Input
                placeholder="0.00"
                value={text?.fixed}
                onChange={e => feeDetails(e.target.value, 'fee', 'fixed', index)}
                addonBefore="Flat Fee ($)"
              />
            </FormFieldWrapper>
          </>
        )
      },
    },
    {
      title: 'International',
      dataIndex: 'international_fee',
      width: 300,
      key: 'international',
      render: (text, row, index) => {
        const formObjData = {}
        formObjData[`${row.type}internationalDynamic`] = row.international_fee.dynamic
        formObjData[`${row.type}internationalFixed`] = row.international_fee.fixed
        if (type) {
          form.setFieldsValue(formObjData)
        }
        return (
          <>
            <FormFieldWrapper
              type={type}
              className="mb-3"
              row={row}
              name={`${row.type}internationalDynamic`}
            >
              <Input
                placeholder="0"
                value={text?.dynamic}
                onChange={e => feeDetails(e.target.value, 'international_fee', 'dynamic', index)}
                addonBefore="Percentage (%)"
              />
            </FormFieldWrapper>
            <FormFieldWrapper
              className="mb-0"
              type={type}
              row={row}
              name={`${row.type}internationalFixed`}
            >
              <Input
                placeholder="0.00"
                value={text?.fixed}
                onChange={e => feeDetails(e.target.value, 'international_fee', 'fixed', index)}
                addonBefore="Flat Fee ($)"
              />
            </FormFieldWrapper>
          </>
        )
      },
    },
    {
      title: 'Domestic Pass Fee',
      dataIndex: 'passFee',
      width: 300,
      key: 'passFee',
      render: (text, row, index) => {
        return (
          <>
            <FormFieldWrapper
              type={type}
              className="mb-3"
              row={row}
              name={`${row.type}passFeeDynamic`}
            >
              <Input
                placeholder="0"
                value={text?.dynamic}
                onChange={e => feeDetails(e.target.value, 'passFee', 'dynamic', index)}
                addonBefore="Percentage (%)"
              />
            </FormFieldWrapper>
            <FormFieldWrapper
              type={type}
              className="mb-0"
              row={row}
              name={`${row.type}passFeeFixed`}
            >
              <Input
                placeholder="0.00"
                value={text?.fixed}
                onChange={e => feeDetails(e.target.value, 'passFee', 'fixed', index)}
                addonBefore="Flat Fee ($)"
              />
            </FormFieldWrapper>
          </>
        )
      },
    },
    {
      title: 'International Pass Fee',
      dataIndex: 'international_passFee',
      width: 300,
      key: 'international_passFee',
      render: (text, row, index) => {
        return (
          <>
            <FormFieldWrapper
              type={type}
              className="mb-3"
              row={row}
              name={`${row.type}international_passFeeDynamic`}
            >
              <Input
                placeholder="0"
                value={text?.dynamic}
                onChange={e =>
                  feeDetails(e.target.value, 'international_passFee', 'dynamic', index)
                }
                addonBefore="Percentage (%)"
              />
            </FormFieldWrapper>
            <FormFieldWrapper
              type={type}
              className="mb-0"
              row={row}
              name={`${row.type}international_passFeeFixed`}
            >
              <Input
                placeholder="0.00"
                value={text?.fixed}
                onChange={e => feeDetails(e.target.value, 'international_passFee', 'fixed', index)}
                addonBefore="Flat Fee ($)"
              />
            </FormFieldWrapper>
          </>
        )
      },
    },
  ]

  const createTemplate = async () => {
    if (!templateName) {
      setIsRequiredName(true)
      return
    }
    const payload = {
      templateName,
      fee: [
        ...Value,
        {
          type: 'manual',
          fee: {
            dynamic: 0,
            fixed: 0,
          },
          international_fee: {
            dynamic: 0,
            fixed: 0,
          },
          passFee: {
            dynamic: 0,
            fixed: 0,
          },
          international_passFee: {
            dynamic: 0,
            fixed: 0,
          },
        },
      ],
    }
    const res = await addTemplatesDetails(payload)
    if (res && res.statusCode === 200) {
      setModal(false)
      setTemplateName('')
      setValue([
        {
          type: 'card',
          fee: {
            dynamic: 0,
            fixed: 0,
          },
          international_fee: {
            dynamic: 0,
            fixed: 0,
          },
          passFee: {
            dynamic: 0,
            fixed: 0,
          },
          international_passFee: {
            dynamic: 0,
            fixed: 0,
          },
        },
        {
          type: 'bank',
          fee: {
            dynamic: 0,
            fixed: 0,
          },
          international_fee: {
            dynamic: 0,
            fixed: 0,
          },
          passFee: {
            dynamic: 0,
            fixed: 0,
          },
          international_passFee: {
            dynamic: 0,
            fixed: 0,
          },
        },
        {
          type: 'crypto',
          fee: {
            dynamic: 0,
            fixed: 0,
          },
          international_fee: {
            dynamic: 0,
            fixed: 0,
          },
          passFee: {
            dynamic: 0,
            fixed: 0,
          },
          international_passFee: {
            dynamic: 0,
            fixed: 0,
          },
        },
        {
          type: 'manual',
          fee: {
            dynamic: 0,
            fixed: 0,
          },
          international_fee: {
            dynamic: 0,
            fixed: 0,
          },
          passFee: {
            dynamic: 0,
            fixed: 0,
          },
          international_passFee: {
            dynamic: 0,
            fixed: 0,
          },
        },
      ])

      notification.success({
        message: 'Template created successfully',
      })
    }
  }

  const feeDetails = (val, vkey, key, ind) => {
    Value.forEach((item, index) => {
      if (index === ind) {
        Value[ind] = {
          ...Value[ind],
          type: returnFeeType(ind),
          [vkey]: { ...Value[ind][vkey], [key]: val },
        }
      }
    })
    setValue([...Value])
  }

  const updatebusiness = async () => {
    ProcessingFeeList.forEach(item => {
      if (Object.keys(item.fee).length === 0) {
        item.fee = { dynamic: 0, fixed: 0 }
      }
      if (Object.keys(item.international_fee).length === 0) {
        item.international_fee = { dynamic: 0, fixed: 0 }
      }
      if (Object.keys(item.fee).length === 1 || Object.keys(item.fee).length === 2) {
        item.fee = {
          dynamic: item.fee.dynamic === '' ? 0 : item.fee.dynamic,
          fixed: item.fee.fixed === '' ? 0 : item.fee.fixed,
        }
      }
      if (
        Object.keys(item.international_fee).length === 1 ||
        Object.keys(item.international_fee).length === 2
      ) {
        item.international_fee = {
          dynamic: item.international_fee.dynamic === '' ? 0 : item.international_fee.dynamic,
          fixed: item.international_fee.fixed === '' ? 0 : item.international_fee.fixed,
        }
      }
    })

    const payload = {
      fee: [...ProcessingFeeList],
    }

    if (isRiskLevel && riskLevel) {
      payload.riskLevel = riskLevel
    }

    if (countryId && isCountryProcessingFees) {
      setSaveLoading(true)
      const manualFee = countryFees.find(fee => fee.type === 'manual')
      if (manualFee) {
        payload.fee.push(manualFee)
      }
      const res = await updateCountryFees(countryId, payload)
      if (res && res.statusCode === 200) {
        setSaveLoading(false)
        notification.success({
          message: 'Country Processing fee updated successfully',
        })
      } else {
        notification.error({
          message: res.error.message,
        })
      }
    } else {
      const res = await businessUpdate(id, payload)
      if (res && res.statusCode === 200) {
        if (refreshVerificationDocuments) {
          refreshVerificationDocuments(!isRefreshVerificationDocuments)
        }
        notification.success({
          message: 'Processing fee updated successfully',
        })
      } else {
        notification.error({
          message: res.error.message,
        })
      }
    }
  }
  const handleOnChange = (val, vkey, key, ind) => {
    ProcessingFeeList.forEach((item, index) => {
      if (index === ind && Object.keys(ProcessingFeeList[index]).includes(vkey)) {
        ProcessingFeeList[index][vkey][key] = val
      }
    })
    setProcessingFeeList([...ProcessingFeeList])
  }

  return (
    <div className="row justify-content-center">
      <div className={`${type || isFullWidth ? 'col-lg-12' : 'col-lg-8'} `}>
        {!isCountryProcessingFees ? (
          <div className="ant-table-title">
            <div className="d-flex align-items-center">
              <div className="mr-2">Select fee-template</div>
              <Dropdown overlay={menu}>
                <Button>
                  {selectedTemplete} <DownOutlined />
                </Button>
              </Dropdown>
              {!isHideCreateTemplate ? (
                <div className="ml-auto">
                  <Button type="primary" onClick={() => HandleModal()}>
                    Create new template
                  </Button>
                </div>
              ) : null}
              {isRiskLevel ? (
                <>
                  &nbsp;&nbsp;<div className="mr-2">Risk Level</div>
                  <Dropdown overlay={menuRiskLevel}>
                    <Button>
                      {riskLevelLabel} <DownOutlined />
                    </Button>
                  </Dropdown>
                </>
              ) : null}
            </div>
          </div>
        ) : null}
        <Table
          className="mb-3"
          columns={type === 'add' ? column : columns}
          pagination={false}
          dataSource={type === 'add' ? Value : ProcessingFeeList}
          bordered
          footer={
            !type
              ? () => [
                  !isCountryProcessingFees ? (
                    <Button className="mr-2" onClick={handleResetProcessingFee}>
                      Reset
                    </Button>
                  ) : null,
                  <Button
                    type="primary"
                    onClick={updatebusiness}
                    disabled={isSaveLoading && isCountryProcessingFees}
                  >
                    {isSaveLoading ? <Spin size="small" className="ml-2" /> : 'Save'}
                  </Button>,
                ]
              : undefined
          }
        />
      </div>
      <Modal isOpen={modal} toggle={HandleModal} size="lg">
        <ModalHeader
          className="pt-3 pb-1"
          toggle={() => {
            setModal(false)
          }}
        >
          {' '}
          &nbsp; Create Template
        </ModalHeader>
        <ModalBody>
          <Fragment>
            <div>
              <Label className="py-form-field__label is-required col-lg-12">
                Template Name <span className="text-red">*</span>
              </Label>
              <div className="py-form-field__element col-lg-12">
                <Input
                  autocomplete="nope"
                  type="text"
                  className="py-form__element__medium mb-2"
                  name="templateName"
                  id="templateName"
                  value={templateName}
                  onChange={e => {
                    if (e.target.value.length > 0) {
                      setIsRequiredName(false)
                    } else {
                      setIsRequiredName(true)
                    }
                    setTemplateName(e.target.value)
                  }}
                />
                {isRequiredName && <p className="text-red">Template name is required</p>}
              </div>
              <Table
                columns={column}
                pagination={false}
                dataSource={Value}
                bordered
                footer={() => (
                  <Button type="primary" onClick={createTemplate}>
                    Save
                  </Button>
                )}
              />
            </div>
          </Fragment>
        </ModalBody>
      </Modal>
    </div>
  )
}

export default ProcessingFee
