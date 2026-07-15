/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useCallback, useState } from 'react'
import qs from 'qs'
import { Button, Tabs, Form, Modal, notification, Input } from 'antd'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import Table from 'components/app/table'
import getBannerTargetColumns, {
  getBannerColumns,
} from 'components/app/CommonTableFormatter/bannerTableFormatter'
// import Filter from 'pages/users/filter'
import CustomModal from 'pages/banner/helper/modal'
import { useHistory, Link } from 'react-router-dom'
import { addBannerTarget, editBanner, editBannerTarget } from 'services/banner'
import style from '../style.module.scss'
import DisplayBanner from '../../../components/app/banner'

const { Search } = Input
const { confirm } = Modal
const { TabPane } = Tabs

const mapStateToProps = ({ banner, dispatch, router, utility }) => ({
  utility,
  banner,
  dispatch,
  router,
})

const Index = ({
  dispatch,
  banner: { allBanner, allBannerTargets },
  router: { location },
  utility: { country },
}) => {
  const [current, setCurrent] = useState(1)
  const [isActive, setIsActive] = useState('true')
  const [keyword, setKeyword] = useState(null)
  const [pageSize, setPageSize] = useState(100)
  const [total, setTotal] = useState(100)
  const [bizData, setBizData] = useState([])
  const [bannerData, setBannerData] = useState([])
  const [renderModalContent, setRenderModalContent] = useState(null)
  const [visible, setVisible] = useState(false)
  const [countries, setCountries] = useState()
  const [selectedTab, setSelectedTab] = useState('banner-target')
  const history = useHistory()
  const params = new URLSearchParams(location.search)
  const [form] = Form.useForm()

  const initFetch = useCallback(
    qryString => {
      dispatch({
        type: 'banner/FETCH_ALL_BANNER_TARGET',
        payload: {
          qryString,
        },
      })
    },
    [dispatch],
  )

  const initCountryFetch = useCallback(() => {
    dispatch({
      type: 'utility/FETCH_ALL_COUNTRY',
      payload: {},
    })
  }, [dispatch])

  useEffect(() => {
    if (!country.data || !country.data.countries) {
      initCountryFetch()
    } else {
      setCountries(country.data.countries)
    }
  }, [initFetch])

  useEffect(() => {
    if (country.data && country.data.countries) {
      setCountries(country.data.countries)
    }
  }, [country])

  const prepareString = () => {
    return qs.stringify({
      pageNo: location.query.pageNo || current,
      pageSize: location.query.pageSize || pageSize,
      keyword: params.get('keywords') || keyword,
    })
  }

  useEffect(() => {
    if (location.query && location.query.userId) {
      getBannerTarget()
    } else {
      // setUserId(null)
      setIsActive(params.get('isActive') || isActive)
      setKeyword(params.get('keywords') || null)
      initFetch(prepareString())
    }
  }, [initFetch, location.search])

  useEffect(() => {
    if (location && location.state && location.state.type === 'banner') {
      setSelectedTab('banner')
      getBanner()
    }
  }, [location.state])

  useEffect(() => {
    if (allBannerTargets && allBannerTargets.data && allBannerTargets.data.meta) {
      const { meta } = allBannerTargets.data
      setCurrent(meta.pageNo)
      setPageSize(meta.pageSize)
      setTotal(meta.total)
      setBizData(allBannerTargets.data.bannersTarget)
    }
  }, [allBannerTargets])

  useEffect(() => {
    if (allBanner && allBanner.data && allBanner.data.meta) {
      const { meta } = allBanner.data
      setCurrent(meta.pageNo)
      setPageSize(meta.pageSize)
      setTotal(meta.total)
      setBannerData(allBanner.data.banners)
    }
  }, [allBanner])

  const onPaginationChange = async (currentPage, pagesize) => {
    params.set('pageNo', currentPage)
    params.set('pageSize', pagesize)
    params.set('keyword', keyword)
    history.push({ search: params.toString() })
    await setCurrent(currentPage)
    await setPageSize(pagesize)
    setKeyword(keyword)
  }

  const getBannerTarget = search => {
    initFetch(
      qs.stringify({
        pageNo: location.query.pageNo || current,
        pageSize: location.query.pageSize || pageSize,
        keyword: search ?? keyword,
      }),
    )
  }
  const getBanner = search => {
    dispatch({
      type: 'banner/FETCH_ALL_BANNER',
      payload: {
        qryString: qs.stringify({
          pageNo: location.query.pageNo || current,
          pageSize: location.query.pageSize || pageSize,
          keyword: search ?? keyword,
        }),
      },
    })
  }

  const statusModal = row => {
    confirm({
      title: `Are you sure you want to ${row.status === 'active' ? 'inactive' : 'active'} banner ?`,
      content: '',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleChangeBannerStatus(row)
      },
      onCancel() {},
    })
  }

  const showDeleteBannerConfirm = row => {
    confirm({
      title: `Are you sure you want to delete this banner ?`,
      content: '',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleChangeBannerStatus(row, 'delete')
      },
      onCancel() {},
    })
  }

  const handleChangeBannerStatus = async (data, type) => {
    const res = await editBanner(data._id, {
      status: type ? 'deleted' : data.status === 'active' ? 'inactive' : 'active',
    })
    if (res && res.statusCode === 200) {
      getBanner()
      notification.success({
        message: 'Success',
      })
    } else {
      notification.error({
        message: res.error.message,
      })
    }
  }

  const closeModal = () => {
    setVisible(false)
    form.resetFields()
  }

  const changeStatus = async (row = null, status) => {
    const objData = {
      status,
    }
    const res = await editBannerTarget(row.uuid, objData)
    if (res && res.statusCode === 200) {
      initFetch(
        qs.stringify({
          pageNo: location.query.pageNo || current,
          pageSize: location.query.pageSize || pageSize,
          keyword,
        }),
      )
    } else if (res && res.statusCode === 400) {
      notification.error({
        message: res.message,
      })
    }
  }

  const openEditBannerTarget = row => {
    setVisible(true)
    setRenderModalContent({ title: 'Edit banner target', type: 'edit', data: row })
    form.setFieldsValue({
      bannerScope: row.bannerScope,
      bannerName: row.bannerName,
      entityId: row.entityId,
    })
  }

  const handleTableRender = (columns, tableData, loading, expandable = false) => {
    return (
      <Table
        columns={columns}
        dataSource={tableData}
        loading={loading}
        pageSize={pageSize}
        total={total}
        current={current}
        expandable={
          expandable
            ? {
                expandedRowRender: record => (
                  <DisplayBanner isSticky={record.isSticky} data={record} />
                ),
                rowExpandable: () => true,
              }
            : null
        }
        onPaginationChange={(currentPage, size) => onPaginationChange(currentPage, size)}
      />
    )
  }

  const tabChange = e => {
    // goToTab(e)
    setSelectedTab(e)
    setKeyword('')
    if (e === 'banner-target') {
      getBannerTarget('')
    }
    if (e === 'banner') {
      getBanner('')
    } else {
      getBannerTarget('')
    }
  }

  const handleSubmitBannerTarget = async values => {
    values.status = 'active'
    const res = await addBannerTarget(values)
    if (res && res.statusCode === 200) {
      form.resetFields()
      setVisible(false)
      initFetch(
        qs.stringify({
          pageNo: location.query.pageNo || current,
          pageSize: location.query.pageSize || pageSize,
          keyword,
        }),
      )
      notification.success({
        message: 'Banner Added successfully',
      })
    } else if (res && res.statusCode === 400) {
      notification.error({
        message: res.message,
      })
    } else {
      notification.error({
        message: res.error.message,
      })
    }
  }

  const handleEditBannerTarget = async values => {
    if (renderModalContent && renderModalContent.data) {
      const res = await editBannerTarget(renderModalContent.data.uuid, values)
      if (res && res.statusCode === 200) {
        form.resetFields()
        setVisible(false)
        initFetch(
          qs.stringify({
            pageNo: location.query.pageNo || current,
            pageSize: location.query.pageSize || pageSize,
            keyword,
          }),
        )
        notification.success({
          message: 'Banner Updated successfully',
        })
      } else if (res && res.statusCode === 400) {
        notification.error({
          message: res.message,
        })
      } else {
        notification.error({
          message: res.error.message,
        })
      }
    }
  }

  const handleChangeSearch = ({ target: { value } }) => {
    setKeyword(value)
  }
  const operations =
    selectedTab === 'banner' ? (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div className="filter-field">
          <Search
            allowClear
            placeholder="Search by banner name"
            size="large"
            onChange={handleChangeSearch}
            value={keyword}
            onSearch={value => getBanner(value)}
          />
        </div>
        <Link to="/banners/add" className="float-right btn btn-md btn-primary mr-4">
          Add Banner
        </Link>
      </div>
    ) : (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div className="filter-field">
          <Search
            allowClear
            placeholder="Search by banner name"
            size="large"
            onChange={handleChangeSearch}
            value={keyword}
            onSearch={value => getBannerTarget(value)}
          />
        </div>
        <Button
          type="primary"
          className="mr-4"
          onClick={() => {
            setVisible(true)
            setRenderModalContent({ title: 'Add banner target', type: 'add' })
          }}
        >
          Add Banner Targets
        </Button>
      </div>
    )

  const bannerTargetColumns = getBannerTargetColumns(changeStatus, openEditBannerTarget, countries)

  const bannerColumns = getBannerColumns(statusModal, showDeleteBannerConfirm)
  return (
    <div>
      <Helmet title="Users: List" />
      <div className="cui__utils__heading">
        <strong>All {selectedTab === 'banner-target' ? 'Banner Target' : 'Banner'}</strong>
      </div>
      <div className="card">
        <Tabs
          onChange={tabChange}
          activeKey={selectedTab.toString()}
          className={`${style.tabs} kit-tabs-bordered`}
          defaultActiveKey="1"
          tabBarExtraContent={operations}
        >
          <TabPane tab="Banner Targets" key="banner-target">
            <div className="card-body p-0">
              <div className="text-nowrap">
                {handleTableRender(bannerTargetColumns, bizData, allBannerTargets.loading)}
              </div>
            </div>
          </TabPane>
          <TabPane tab="Banners" key="banner">
            <div className="card-body p-0">
              <div className="text-nowrap">
                {handleTableRender(bannerColumns, bannerData, allBanner.loading, true)}
              </div>
            </div>
          </TabPane>
        </Tabs>
      </div>
      <CustomModal
        renderModalContent={renderModalContent}
        visible={visible}
        selectedTab={selectedTab}
        closeModal={closeModal}
        handleSubmitBannerTarget={handleSubmitBannerTarget}
        handleEditBannerTarget={handleEditBannerTarget}
        Form={Form}
        form={form}
      />
    </div>
  )
}

export default connect(mapStateToProps)(Index)
