import React, { useEffect, useCallback, useState } from 'react'
import qs from 'qs'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import Filter from 'pages/pushNotifications/filter'
import { Link, useHistory } from 'react-router-dom'

import Table from 'components/app/table'
import getColumns from 'components/app/CommonTableFormatter/userDevicesTableFormatter'
import { deleteUserDevice, updateUserDevice } from 'services/userDevices'
import { notification } from 'antd'
import confirm from 'antd/lib/modal/confirm'

const mapStateToProps = ({ userDevices, dispatch, router }) => ({
  userDevices,
  dispatch,
  router,
})

/* eslint-disable */

const Index = ({ dispatch, userDevices: { userDevices }, router: { location } }) => {
  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(1000)
  const [total, setTotal] = useState(1000)
  const [userId, setUserId] = useState(null)
  const [platform, setPlatform] = useState('')
  const [userDevicesData, setUserDevices] = useState([])
  const [isUserDeviceSelected, setIsUserDevicSelected] = useState(false)
  const [selectedUserDevices, setSelectedUserDevices] = useState([])
  const [resetFilter, setResetFilter] = useState(false)
  const history = useHistory()
  const params = new URLSearchParams(location.search)

  const initFetch = useCallback(
    qryString => {
      dispatch({
        type: 'userDevice/FETCH_USER_DEVICES',
        payload: {
          qryString,
        },
      })
    },
    [dispatch],
  )

  useEffect(() => {
    const queryStatus = params.get('platform') || platform
    const queryUserId = params.get('userId') || userId
    setPlatform(queryStatus)
    setUserId(queryUserId)
    initFetch(
      qs.stringify({
        pageNo: location.query.pageNo || current,
        pageSize: location.query.pageSize || pageSize,
        platform: queryStatus,
        userId: queryUserId,
      }),
    )
  }, [initFetch, location.search])

  useEffect(() => {
    if (userDevices && userDevices.data) {
      const { meta } = userDevices.data
      setCurrent(meta.pageNo)
      setPageSize(meta.pageSize)
      setTotal(meta.total)
      setUserDevices(userDevices.data.devices)
    }
  }, [userDevices])

  const handleDocumentURL = (type, value) => {
    params.set('pageNo', 1)
    params.set('pageSize', location.query.pageSize || pageSize)
    if (value) {
      params.set(type, value)
    } else {
      params.delete(type)
    }
    history.push({ search: params.toString() })
  }

  const handleFilterChange = (value, type) => {
    setCurrent(1)
    history.push({ pageNo: 1 })
    if (type === 'platform') {
      setPlatform(value)
      handleDocumentURL('platform', value)
    }
    if (type === 'userId') {
      setUserId(value)
      handleDocumentURL('userId', value)
    }
  }

  const rowSelection = {
    selectedRowKeys: selectedUserDevices,
    onChange: selectedRows => {
      setSelectedUserDevices(selectedRows)
      if (selectedRows.length > 0) {
        setIsUserDevicSelected(true)
      } else {
        setIsUserDevicSelected(false)
      }
    },
  }

  const clearFilter = () => {
    params.delete('userId')
    params.delete('pageNo')
    params.delete('pageSize')
    params.delete('platform')
    history.push({ search: params.toString() })
    setUserId('')
    setPlatform('')
    setResetFilter(!resetFilter)
  }

  const onPaginationChange = async (currentPage, pagesize) => {
    params.set('pageNo', currentPage)
    params.set('pageSize', pagesize)
    history.push({ search: params.toString() })
    setCurrent(currentPage)
    setPageSize(pagesize)
  }

  const handleUpdateDevice = async (deviceId, status) => {
    const res = await updateUserDevice(deviceId, status)
    if (res.statusCode === 200) {
      notification.success({
        message: 'Device updated successfully.',
      })

      initFetch(
        qs.stringify({
          pageNo: current,
          pageSize,
          platform,
          userId,
        }),
      )
    }
  }

  const handleDeleteConfirmModal = deviceId => {
    confirm({
      title: `Are you sure you want to delete device?`,
      content: '',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleDeleteDevice(deviceId)
      },
      onCancel() {},
    })
  }

  const handleDeleteDevice = async deviceId => {
    const res = await deleteUserDevice(deviceId)
    if (res.statusCode === 200) {
      notification.success({
        message: 'Device deleted successfully.',
      })

      initFetch(
        qs.stringify({
          pageNo: current,
          pageSize,
          platform,
          userId,
        }),
      )
    }
  }

  const columns = getColumns(handleUpdateDevice, handleDeleteConfirmModal)
  return (
    <div>
      <Helmet title="userDevices: List" />
      <div className="cui__utils__heading">
        <strong>Push Notifications</strong>
        {isUserDeviceSelected && (
          <Link
            to={{
              pathname: '/push-notifications/add',
              state: {
                deviceIds: selectedUserDevices,
              },
            }}
            className="float-right btn btn-md btn-primary"
          >
            Send Push Notification
          </Link>
        )}
        {isUserDeviceSelected && (
          <span className="float-right mr-3"> Total Selected: {selectedUserDevices?.length}</span>
        )}
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
                userId,
                platform,
              })}
              userId={userId}
              platform={platform}
            />
          </div>
        </div>

        <div className="card-body">
          <div className="text-nowrap">
            <Table
              rowKey="deviceId"
              rowSelection={rowSelection}
              columns={columns}
              dataSource={userDevicesData}
              loading={userDevices.loading}
              pageSize={pageSize}
              total={total}
              current={current}
              onPaginationChange={(currentPage, size) => onPaginationChange(currentPage, size)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default connect(mapStateToProps)(Index)
