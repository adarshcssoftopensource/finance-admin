import React from 'react'
import { Colorpicker } from 'antd-colorpicker'
import { Form, Input, Select, Switch } from 'antd'

const { Option } = Select

const InputField = props => {
  const {
    name,
    label,
    rules,
    type,
    inputType,
    value,
    disabled,
    onSelectChange,
    optionArray,
    min,
    max,
    showMaxMessage,
    colorPickerProps,
  } = props
  const handleRenderComponent = component => {
    switch (component) {
      case 'input':
        return (
          <>
            <Form.Item name={name} label={label} initialValue={value} rules={rules}>
              <Input
                minLength={min || ''}
                maxLength={max || ''}
                type={inputType || 'text'}
                disabled={disabled}
              />
            </Form.Item>
            {showMaxMessage && <small>Max Characters: {max}</small>}
          </>
        )
      case 'switch':
        return (
          <Form.Item name={name} label={label} rules={rules} valuePropName="checked">
            <Switch />
          </Form.Item>
        )
      case 'select':
        return (
          <Form.Item name={name} label={label} rules={rules}>
            <Select placeholder="" onChange={onSelectChange} allowClear {...props}>
              {optionArray.map(val => (
                <Option value={val.value}>{val.label || val.value}</Option>
              ))}
            </Select>
          </Form.Item>
        )
      case 'color':
        return (
          <Form.Item name={name} label={label} rules={rules}>
            <Colorpicker picker={colorPickerProps.picker || 'SketchPicker'} {...colorPickerProps} />
          </Form.Item>
        )
      default:
        return (
          <Form.Item name={name} label={label} rules={rules}>
            <Input />
          </Form.Item>
        )
    }
  }
  return <>{handleRenderComponent(type)}</>
}

export default InputField
