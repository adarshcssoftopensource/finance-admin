import React, { useEffect, useCallback, useState } from 'react'
import qs from 'qs'
import moment from 'moment'
import { Modal } from 'antd'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import Table from 'components/app/table'
import GeneratePasswordModal from 'components/app/generatePasswordModal'
import getColumns from 'components/app/CommonTableFormatter/userTableFormatter'
import Filter from 'pages/users/filter'
import CustomModal from 'pages/users/helper/modal'
import { useHistory } from 'react-router-dom'

const { confirm } = Modal

const mapStateToProps = ({ allUsers, dispatch, router }) => ({
  allUsers,
  dispatch,
  router,
})

const Index = ({ dispatch, allUsers: { allUsers }, router: { location } }) => {
  const [current, setCurrent] = useState(1)
  const [isActive, setIsActive] = useState('true')
  const [keyword, setKeyword] = useState(null)
  const [pageSize, setPageSize] = useState(100)
  const [total, setTotal] = useState(100)
  const [bizData, setBizData] = useState([])
  const [renderModalContent, setRenderModalContent] = useState(null)
  const [visible, setVisible] = useState(false)
  const [passwordModalVisible, setPasswordModalVisible] = useState(false)
  const [userId, setUserId] = useState(null)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [resetFilter, setResetFilter] = useState(false)
  const history = useHistory()
  const params = new URLSearchParams(location.search)

  const initFetch = useCallback(
    qryString => {
      dispatch({
        type: 'users/FETCH_ALL_USERS',
        payload: {
          qryString,
        },
      })
    },
    [dispatch],
  )

  const prepareString = useCallback(() => {
    const p = new URLSearchParams(location.search)
    return qs.stringify({
      pageNo: location.query.pageNo || current,
      pageSize: location.query.pageSize || pageSize,
      isActive: p.get('isActive') || isActive,
      keyword: p.get('keywords') || keyword,
      startDate: p.get('startDate') || startDate,
      endDate: p.get('endDate') || endDate,
      isBackground: true,
    })
  }, [location.search, location.query, current, pageSize, isActive, keyword, startDate, endDate])

  // useEffect(() => {
  //   initFetch(
  //     qs.stringify({
  //       pageNo: location.query.pageNo || current,
  //       pageSize: location.query.pageSize || pageSize,
  //       isActive,
  //       keyword,
  //       startDate,
  //       endDate,
  //     }),
  //   )
  // }, [current, initFetch, isActive, pageSize, keyword, dateRange])

  useEffect(() => {
    if (location.query && location.query.userId) {
      setUserId(location.query.userId)
      initFetch(
        qs.stringify({
          pageNo: location.query.pageNo || current,
          pageSize: location.query.pageSize || pageSize,
          isActive,
          keyword,
          startDate,
          endDate,
        }),
      )
    } else {
      // setUserId(null)
      setIsActive(params.get('isActive') || isActive)
      setKeyword(params.get('keywords') || null)
      setStartDate(params.get('startDate') || null)
      setEndDate(params.get('endDate') || null)
      initFetch(prepareString())
    }
  }, [
    initFetch,
    location.search,
    prepareString,
    current,
    pageSize,
    isActive,
    keyword,
    startDate,
    endDate,
  ])

  useEffect(() => {
    if (allUsers?.data?.meta) {
      const { meta } = allUsers.data
      setCurrent(meta.pageNo)
      setPageSize(meta.pageSize)
      setTotal(meta.total)
      setBizData(allUsers.data.users)
    }
  }, [allUsers])

  const onPaginationChange = async (currentPage, pagesize) => {
    params.set('pageNo', currentPage)
    params.set('pageSize', pagesize)
    history.push({ search: params.toString() })
    await setCurrent(currentPage)
    await setPageSize(pagesize)
  }

  const handleUsersURL = (type, value) => {
    params.set('pageNo', 1)
    params.set('pageSize', location.query.pageSize || pageSize)
    if (value) {
      params.set(type, value)
    } else {
      params.delete(type)
    }
    history.push({ search: params.toString() })
  }

  const handleDateRangeURL = (fromDate, toDate) => {
    params.set('pageNo', 1)
    params.set('pageSize', location.query.pageSize || pageSize)
    if (fromDate) {
      params.set('startDate', fromDate)
    } else {
      params.delete('startDate')
    }
    if (toDate) {
      params.set('endDate', toDate)
    } else {
      params.delete('endDate')
    }
    history.push({ search: params.toString() })
  }

  const handleFilterChange = (value, type) => {
    setCurrent(1)
    if (type === 'keywords') {
      setKeyword(value)
      handleUsersURL('keywords', value)
    } else if (type === 'date') {
      if (value) {
        setEndDate(moment(value[1]).format('YYYY-MM-DD'))
        setStartDate(moment(value[0]).format('YYYY-MM-DD'))
        handleDateRangeURL(
          moment(value[0]).format('YYYY-MM-DD'),
          moment(value[1]).format('YYYY-MM-DD'),
        )
      } else {
        setEndDate(null)
        setStartDate(null)
        handleDateRangeURL(null, null)
      }
    } else {
      setIsActive(value)
      handleUsersURL('isActive', value)
    }
  }

  const changeStatus = row => {
    /* eslint-disable */
    dispatch({
      type: 'users/ACTIVE_DEACTIVE_USERS',
      payload: {
        userId: row._id,
        isActive: !row.isActive,
        queryString: qs.stringify({
          pageNo: location.query.pageNo || current,
          pageSize: location.query.pageSize || pageSize,
          isActive,
          keyword,
          startDate,
          endDate,
        }),
      },
    })
    // clearFilter()
  }

  const closeModal = () => {
    setVisible(false)
  }

  const statusModal = row => {
    confirm({
      title: `Are you sure you want to ${row.isActive ? 'deactivate' : 'activate'} this user?`,
      content: '',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        changeStatus(row)
      },
      onCancel() {},
    })
  }

  const resetPasswordModal = row => {
    confirm({
      title: `Are you sure you want to reset password of this user?`,
      content: '',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        dispatch({
          type: 'users/RESET_PASSWORD_USERS',
          payload: {
            userId: row._id,
          },
        })
      },
      onCancel() {},
    })
  }

  const openModal = (row = null, status) => {
    let modalData
    if (status === 'emails') {
      modalData = {
        type: status,
        title: 'Connected Emails',
        data: row.emails,
      }
    }
    setRenderModalContent(modalData)
    setVisible(true)
  }

  const openPasswordModal = row => {
    setUserId(row._id)
    setPasswordModalVisible(true)
  }
  const clearFilter = () => {
    params.delete('startDate')
    params.delete('endDate')
    params.delete('isActive')
    params.delete('keywords')
    params.delete('pageNo')
    params.delete('pageSize')
    history.push({ search: params.toString() })
    setIsActive('true')
    setKeyword(null)
    setEndDate(null)
    setStartDate(null)
    setResetFilter(!resetFilter)
  }

  const handleRequestVerification = (row, requestedStatus) => {
    dispatch({
      type: 'users/REQUEST_VERIFICATION',
      payload: {
        userId: row._id,
        requestedStatus,
        qryString: prepareString(),
      },
    })
  }

  const columns = getColumns(
    statusModal,
    openModal,
    openPasswordModal,
    resetPasswordModal,
    false,
    handleRequestVerification,
  )
  return (
    <div>
      <Helmet title="Users: List" />
      <div className="cui__utils__heading">
        <strong>All Users</strong>
      </div>
      <div className="card">
        <div className="card-header card-header-flex">
          <div className="d-flex flex-column justify-content-center mr-auto w-100 w-100">
            <Filter
              handleFilterChange={handleFilterChange}
              clearFilter={clearFilter}
              key={resetFilter}
              qryString={qs.stringify({
                pageNo: current,
                pageSize,
                isActive,
                keyword,
                startDate,
                endDate,
              })}
              startDate={startDate}
              endDate={endDate}
              keyword={keyword}
              isActive={isActive}
            />
          </div>
        </div>
        <div className="card-body">
          <div className="text-nowrap">
            <Table
              columns={columns}
              dataSource={bizData}
              loading={allUsers.loading}
              pageSize={pageSize}
              total={total}
              current={current}
              onPaginationChange={(currentPage, size) => onPaginationChange(currentPage, size)}
            />
          </div>
        </div>
      </div>
      {/* Common Modal for Connected Emails or dump data */}
      <CustomModal
        renderModalContent={renderModalContent}
        visible={visible}
        closeModal={closeModal}
      />
      {userId && (
        <GeneratePasswordModal
          userId={userId}
          visible={passwordModalVisible}
          onCancel={() => {
            setPasswordModalVisible(false)
          }}
        />
      )}
    </div>
  )
}

export default connect(mapStateToProps)(Index)
