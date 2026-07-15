/* eslint-disable */
/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Col, Divider, Form, notification, Row, Spin, Tooltip } from 'antd'
import InputField from 'pages/common/Components/InputField'
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { get as _get } from 'lodash'
import { addBanner, editBanner, fetchBannerById } from 'services/banner'
import { useHistory } from 'react-router-dom'
import { ArrowLeftOutlined, InfoCircleOutlined } from '@ant-design/icons'
import '../bannerStyle.scss'

const mapStateToProps = ({ allUsers, dispatch, router }) => ({
  allUsers,
  dispatch,
  router,
})

const NameTooltips = () => (
  <div>
    {' '}
    Internal Name{' '}
    <Tooltip
      placement="right"
      title="Internal name should be lowercase and separated by underscore"
    >
      <InfoCircleOutlined />
    </Tooltip>
  </div>
)

const Index = ({ router: { location } }) => {
  const [description, setDescription] = useState('')
  const [color, setColor] = useState('#136ACD')
  const [disabled, setDisabled] = useState(false)
  const splitId = location.pathname.split('/banners/')[1]
  const [form] = Form.useForm()
  const history = useHistory()

  useEffect(() => {
    fillFormData()
  }, [])

  const fillFormData = async () => {
    if (splitId !== 'add') {
      const bannerData = await fetchBannerById(splitId)
      if (bannerData.statusCode === 200) {
        const { data } = bannerData
        const { banner } = data
        form.setFieldsValue({
          title: _get(banner, 'bannerTitle', ''),
          accentColor: _get(banner, 'accentColor', ''),
          isSticky: _get(banner, 'isSticky', false),
          text: _get(banner, 'actionButton.text', ''),
          redirectTo: _get(banner, 'actionButton.redirectTo', ''),
          targetToExternal: _get(banner, 'actionButton.targetToExternal', false),
          bannerName: _get(banner, 'bannerName', ''),
        })
        setDescription(_get(banner, 'description', ''))
        setColor(_get(banner, 'accentColor', color))
      }
    }
  }

  const onFinish = async values => {
    if (description === '') {
      return notification.error({ message: 'Please add description for banner' })
    }
    setDisabled(true)
    const data = {
      accentColor: color || '#136ACD',
      isSticky: _get(values, 'isSticky', false),
      status: 'active',
      bannerType: 'admin',
      bannerTitle: _get(values, 'title', ''),
      description: description || '',
      bannerName: _get(values, 'bannerName', ''),
    }

    data.actionButton = {
      text: _get(values, 'text', ''),
      redirectTo: _get(values, 'redirectTo', ''),
      targetToExternal: _get(values, 'targetToExternal', false),
    }

    if (splitId === 'add') {
      const res = await addBanner(data)
      if (res && res.statusCode === 200) {
        form.resetFields()
        setDisabled(false)
        history.push({ pathname: '/banners', state: { type: 'banner' } })
        notification.success({
          message: 'Banner Added successfully',
        })
      } else {
        setDisabled(false)
        notification.error({
          message: res.message,
        })
      }
    } else {
      const res = await editBanner(splitId, data)
      if (res && res.statusCode === 200) {
        form.resetFields()
        setDisabled(false)
        history.push({ pathname: '/banners', state: { type: 'banner' } })
        notification.success({
          message: 'Banner Updated successfully',
        })
      } else {
        setDisabled(false)
        notification.error({
          message: res.error.message,
        })
      }
    }
    return data
  }

  const handleNavigateBack = () => {
    history.push({ pathname: '/banners', state: { type: 'banner' } })
  }

  const handleColorChange = colorObj => {
    setColor(colorObj.hex)
  }

  return (
    <>
      <Helmet title="Banner: Details" />
      <div className="cui__utils__heading ">
        <ArrowLeftOutlined onClick={handleNavigateBack} />
        <strong className="ml-4">{splitId === 'add' ? 'Add' : 'Edit'} Banner </strong>
      </div>
      <div className="banner_form_wrapper">
        <Form
          form={form}
          onFinish={onFinish}
          name="control-hooks"
          layout="vertical"
          initialValues={{
            isSticky: false,
            targetToExternal: false,
          }}
        >
          <Row gutter={16}>
            <Col span={8}>
              <InputField
                name="bannerName"
                label={<NameTooltips />}
                type="input"
                disabled={splitId !== 'add'}
                rules={[{ required: true, message: `Please add Internal name` }]}
              />
            </Col>
            <Col span={8}>
              <InputField
                name="title"
                label="Banner Title"
                rules={[{ required: true, message: `Please add banner title` }]}
                type="input"
              />
            </Col>
            <Col span={4}>
              <InputField
                name="accentColor"
                label="Accent Color"
                type="color"
                colorPickerProps={{
                  popup: true,
                  presetColors: [
                    { title: 'Success', color: '#ADF0CC' },
                    { title: 'Warning', color: '#F9DCB3' },
                    { title: 'Info', color: '#B3E4F5' },
                    { title: 'Alert', color: '#F3D1D1' },
                  ],
                  onChange: handleColorChange,
                }}
              />
            </Col>
            <Col span={4} className="formSwitchStyle">
              <InputField name="isSticky" label="isSticky" type="switch" />
            </Col>
            <Col span={24}>
              <ReactQuill
                value={description}
                className="reactQuillWrapper"
                onChange={value => setDescription(value)}
              />
            </Col>
            <Divider className="mt-0" />
            <Col span={10}>
              <InputField name="text" label="Action button title" type="input" />
            </Col>
            <Col span={10}>
              <InputField name="redirectTo" label="Redirect Url" type="input" />
            </Col>
            <Col span={4} className="formSwitchStyle">
              <InputField name="targetToExternal" label="Target to external" type="switch" />
            </Col>
          </Row>
          <Button type="primary" htmlType="submit" disabled={disabled}>
            <Spin spinning={disabled} />
            {!disabled ? (splitId === 'add' ? 'Save Banner' : 'Update Banner') : ''}
          </Button>
        </Form>
      </div>
    </>
  )
}

export default connect(mapStateToProps)(Index)
