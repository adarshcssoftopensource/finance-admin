import React, { useCallback, useEffect, useState } from 'react'
import { Link, useHistory, useLocation, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import qs from 'qs'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Col, Form, notification, Row } from 'antd'
import InputField from 'pages/common/Components/InputField'
import TextArea from 'antd/lib/input/TextArea'
import {
  addPushNotification,
  deletePushNotification,
  updatePushNotification,
} from 'services/pushNotifications'
import Table from 'components/app/table'
import getColumns from 'components/app/CommonTableFormatter/pushNotificationsTableFormatter'
import confirm from 'antd/lib/modal/confirm'
import * as Notification from 'services/showNotifications'

const CreatePushNotification = () => {
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const { id } = useParams()
  const history = useHistory()
  const { pushNotifications, loading } = useSelector(state => state.pushNotifications)
  const { singleNotification } = useSelector(state => state.pushNotifications)
  const notificationData = singleNotification?.data?.pushNotification

  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(100)
  const [total, setTotal] = useState(100)
  const [description, setDescription] = useState('')
  const [allPushNotifications, setAllPushNotifications] = useState([])
  const location = useLocation()
  const params = new URLSearchParams(location.search)

  const initFetch = useCallback(
    qryString => {
      dispatch({
        type: 'pushNotification/FETCH_PUSH_NOTIFICATIONS',
        payload: {
          qryString,
        },
      })
    },
    [dispatch],
  )

  const getSinglePushNotification = useCallback(() => {
    dispatch({
      type: 'pushNotification/FETCH_SINGLE_PUSH_NOTIFICATION',
      payload: {
        id,
      },
    })
  }, [dispatch, id])

  useEffect(() => {
    initFetch(
      qs.stringify({
        pageNo: location?.query?.pageNo || current,
        pageSize: location?.query?.pageSize || pageSize,
      }),
    )
  }, [initFetch, current, pageSize, location])

  useEffect(() => {
    if (id && id !== 'add') {
      getSinglePushNotification()
    }
  }, [getSinglePushNotification, id])

  useEffect(() => {
    if (notificationData) {
      setDescription(notificationData?.description)
      form.setFieldsValue({
        title: notificationData?.title,
        notificationType: notificationData?.notificationType,
      })
    } else {
      setDescription('')
      form.setFieldsValue({
        title: '',
        notificationType: '',
      })
    }
  }, [notificationData, form])

  useEffect(() => {
    if (pushNotifications?.data?.meta) {
      const { meta } = pushNotifications.data
      setCurrent(meta.pageNo)
      setPageSize(meta.pageSize)
      setTotal(meta.total)
      setAllPushNotifications(pushNotifications.data.notifications)
    }
  }, [pushNotifications])

  const handleSendPushNotification = async row => {
    dispatch({
      type: 'pushNotification/SEND_PUSH_NOTIFICATION',
      payload: {
        deviceIds: location?.state?.deviceIds,
        notification: {
          title: row.title,
          body: row.description,
        },
      },
    })
  }

  const handleDeletePushNotification = async notificationId => {
    const response = await deletePushNotification(notificationId)
    if (response.statusCode === 200) {
      Notification.showSuccess(response.message)
      initFetch()
    }
  }

  const handleUpdatePushNotification = async (notificationId, data) => {
    const response = await updatePushNotification(notificationId, data)
    if (response.statusCode === 200) {
      Notification.showSuccess(response.message)
      initFetch()
    }
  }

  const deleteNotification = notificationId => {
    confirm({
      title: `Are you sure you want to remove this notification?`,
      content: '',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleDeletePushNotification(notificationId)
      },
      onCancel() {},
    })
  }

  const onFinish = async values => {
    const body = {
      ...values,
      description,
    }

    if (id !== 'add') {
      handleUpdatePushNotification(id, body)
    } else {
      const res = await addPushNotification(body)
      if (res && res.statusCode === 200) {
        form.resetFields()
        setDescription('')
        initFetch()
        notification.success({
          message: res.message,
        })
      }
    }
  }

  const onPaginationChange = async (currentPage, pagesize) => {
    params.set('pageNo', currentPage)
    params.set('pageSize', pagesize)
    history.push({ search: params.toString() })
    setCurrent(currentPage)
    setPageSize(pagesize)
  }

  const columns = getColumns(
    handleSendPushNotification,
    deleteNotification,
    location?.state?.deviceIds,
  )
  return (
    <div>
      <Helmet title="userDevices: List" />
      <div className="cui__utils__heading">
        <strong>Create Push Notification</strong>
        {id !== 'add' && (
          <Link
            to={{
              pathname: '/push-notifications/add',
              state: {
                deviceIds: location?.state?.deviceIds,
              },
            }}
            className="float-right btn btn-md btn-primary"
          >
            New Push Notification
          </Link>
        )}
      </div>
      <Form
        form={form}
        onFinish={onFinish}
        initialValues={{
          title: '',
          notificationType: '',
          description: '',
        }}
        layout="vertical"
      >
        <Row gutter={16}>
          <Col span={8}>
            <InputField
              type="input"
              name="title"
              label="Title"
              rules={[{ required: true, message: 'Please enter title.' }]}
              max={20}
              showMaxMessage
            />
          </Col>
          <Col span={4}>
            <InputField
              type="select"
              name="notificationType"
              label="Notification Type"
              placeholder="Select a Type"
              optionArray={[
                { label: 'System', value: 'system' },
                { label: 'General', value: 'general' },
                { label: 'Promotion', value: 'promotion' },
                { label: 'Updates', value: 'updates' },
                { label: 'Other', value: 'other' },
              ]}
              rules={[{ required: true, message: 'Please select notification type.' }]}
            />
          </Col>
          <Col span={12}>
            <Form.Item label="Description">
              <TextArea
                rows={2}
                rules={[{ required: true, message: 'Please enter description.' }]}
                value={description}
                onChange={e => setDescription(e.target.value)}
                maxLength={1000}
                showCount
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Button type="primary" htmlType="submit">
              {id !== 'add' ? 'Update' : 'Add'} Push Notification
            </Button>
          </Col>
        </Row>
      </Form>
      <div className="cui__utils__heading mt-4">
        <strong>Notification History</strong>
      </div>
      <div className="card mt-4">
        <div className="card-body">
          <div className="text-nowrap">
            <Table
              columns={columns}
              dataSource={allPushNotifications}
              loading={loading}
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

export default CreatePushNotification
