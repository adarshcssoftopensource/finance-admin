/* eslint-disable  */
import { Button, Col, Row } from 'antd'
import qs from 'qs'
import InputField from 'pages/common/Components/InputField'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import '../style.module.scss'
import { fetchAllBanner } from 'services/banner'
import CountryFilter from 'components/app/countryFilter'

const mapStateToProps = ({ allUsers, dispatch, router, banner }) => ({
  allUsers,
  dispatch,
  router,
  banner,
})
const EditBannerTarget = ({
  handleSubmitBannerTarget,
  Form,
  form,
  renderModalContent,
  handleEditBannerTarget,
  banner: { allBanner },
  selectedTab,
}) => {
  const [bannerData, setBannerData] = useState([])
  const [countryId, setCountryId] = useState('')
  const onFinish = async values => {
    let banner =
      bannerData &&
      bannerData.find(banner => {
        return banner.label.toString() === values.bannerName || ''
      })
    if (banner && banner.id) {
      values.bannerId = banner.id
    }
    if (countryId !== '' && values.bannerScope === 'country') {
      values.entityId = countryId.toString()
    }
    if (renderModalContent.type === 'add') {
      handleSubmitBannerTarget(values)
    } else {
      handleEditBannerTarget(values)
    }
  }

  useEffect(() => {
    const func = async () => {
      if (allBanner && selectedTab === 'banner-target') {
        if (allBanner.data && allBanner.data.banners) {
          const filterBannerData = allBanner.data.banners.map(val => {
            return { value: val.bannerName, label: val.bannerName }
          })
          setBannerData(filterBannerData)
        } else {
          const bannerDataResponse = await fetchAllBanner({
            qryString: qs.stringify({
              pageNo: 1,
              pageSize: 100,
            }),
          })
          const filterBannerData = bannerDataResponse.data.banners.map(val => {
            return { value: val.bannerName, label: val.bannerName, id: val._id }
          })
          setBannerData(filterBannerData)
        }
      }
      return true
    }
    func()
  }, [])

  const handleChange = value => {
    setCountryId(value)
  }

  return (
    <>
      <div>
        <Form form={form} onFinish={onFinish} name="control-hooks" layout="vertical">
          <Row gutter={16}>
            <Col span={24}>
              <InputField
                name="bannerScope"
                label="Banner Scope"
                rules={[{ required: true, message: `Please select banner scope` }]}
                type="select"
                optionArray={[
                  { value: 'user', label: 'User' },
                  { value: 'business', label: 'Business' },
                  { value: 'country', label: 'Country' },
                  { value: 'global', label: 'Global' },
                ]}
              />
            </Col>
            <Col span={24}>
              <InputField
                name="bannerName"
                label="Internal Name"
                rules={[{ required: true, message: `Please select Internal name` }]}
                type="select"
                showSearch
                optionArray={bannerData}
              />
            </Col>
            <Col span={24}>
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) =>
                  prevValues.bannerScope !== currentValues.bannerScope
                }
              >
                {({ getFieldValue }) =>
                  getFieldValue('bannerScope') !== 'global' &&
                  getFieldValue('bannerScope') !== 'country' ? (
                    <InputField
                      name="entityId"
                      label="Entity Id"
                      rules={[{ required: true, message: `Please add Entity Id` }]}
                      type="input"
                    />
                  ) : null
                }
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) =>
                  prevValues.bannerScope !== currentValues.bannerScope
                }
              >
                {({ getFieldValue }) =>
                  getFieldValue('bannerScope') === 'country' ? (
                    <div>
                      <span>Country:</span>
                      <CountryFilter
                        isBanner
                        handleChange={handleChange}
                        value={getFieldValue('entityId')}
                      />
                    </div>
                  ) : null
                }
              </Form.Item>
            </Col>

            <Button type="primary" htmlType="submit">
              {renderModalContent.type === 'add' ? 'Add' : 'Edit'} Banner target
            </Button>
          </Row>
        </Form>
      </div>
    </>
  )
}

export default connect(mapStateToProps)(EditBannerTarget)
