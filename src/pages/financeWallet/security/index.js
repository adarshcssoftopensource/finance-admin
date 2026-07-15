import React, { useCallback, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import {
  Card,
  Table,
  Tag,
  Button,
  Input,
  Tabs,
  message,
  Popconfirm,
  Modal,
  Form,
  Tooltip,
} from 'antd'
import { LockOutlined, ReloadOutlined, SearchOutlined, MobileOutlined } from '@ant-design/icons'
import moment from 'moment'
import * as securityApi from 'services/financeWalletSecurity'

const { Search } = Input
const { TabPane } = Tabs

function extractRows(result) {
  if (result?.error) return { rows: [], pagination: { page: 1, limit: 20, total: 0 } }
  if (result?.rows) return result
  const envelope = result?.data ?? result
  const rows = Array.isArray(envelope?.data) ? envelope.data : []
  return { rows, pagination: envelope?.pagination || { page: 1, limit: 20, total: rows.length } }
}

function DeviceStatusTag({ row }) {
  if (row.isDeviceBlocked) return <Tag color="red">Device blocked</Tag>
  if (row.isUserBlocked) return <Tag color="orange">User blocked</Tag>
  return <Tag color="green">Active</Tag>
}

const WalletSecurity = () => {
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState([])
  const [devices, setDevices] = useState([])
  const [blockedDevices, setBlockedDevices] = useState([])
  const [userPage, setUserPage] = useState(1)
  const [userLimit, setUserLimit] = useState(20)
  const [userTotal, setUserTotal] = useState(0)
  const [devicePage, setDevicePage] = useState(1)
  const [deviceLimit, setDeviceLimit] = useState(20)
  const [deviceTotal, setDeviceTotal] = useState(0)
  const [userSearch, setUserSearch] = useState('')
  const [deviceSearch, setDeviceSearch] = useState('')
  const [blockModal, setBlockModal] = useState({ open: false, type: null, id: null })
  const [blockForm] = Form.useForm()

  const loadUsers = useCallback(async () => {
    setLoading(true)
    try {
      const res = await securityApi.fetchWalletSecurityUsers({
        page: userPage,
        limit: userLimit,
        search: userSearch,
      })
      const { rows, pagination } = extractRows(res)
      setUsers(rows)
      setUserTotal(pagination.total)
    } catch (e) {
      message.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }, [userPage, userLimit, userSearch])

  const loadDevices = useCallback(async () => {
    setLoading(true)
    try {
      const [devicesRes, blockedRes] = await Promise.all([
        securityApi.fetchWalletDevices({
          page: devicePage,
          limit: deviceLimit,
          search: deviceSearch,
        }),
        securityApi.fetchBlockedWalletDevices({ page: 1, limit: 100, search: deviceSearch }),
      ])
      const devicesPayload = extractRows(devicesRes)
      const blockedPayload = extractRows(blockedRes)
      setDevices(devicesPayload.rows)
      setDeviceTotal(devicesPayload.pagination.total)
      setBlockedDevices(blockedPayload.rows)
    } catch (e) {
      message.error('Failed to load devices')
    } finally {
      setLoading(false)
    }
  }, [devicePage, deviceLimit, deviceSearch])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  useEffect(() => {
    loadDevices()
  }, [loadDevices])

  const toggleUserBlock = async (userId, blocked, reason) => {
    try {
      await securityApi.setWalletUserBlock(userId, blocked, reason)
      message.success(blocked ? 'User blocked' : 'User unblocked')
      loadUsers()
    } catch (e) {
      message.error('Failed to update user')
    }
  }

  const openBlockModal = (type, id) => {
    setBlockModal({ open: true, type, id })
    blockForm.resetFields()
  }

  const submitBlock = async values => {
    const { type, id } = blockModal
    try {
      if (type === 'device') {
        await securityApi.blockWalletDevice(id, values.reason)
        message.success('Device blocked')
        loadDevices()
      } else if (type === 'user') {
        await securityApi.setWalletUserBlock(id, true, values.reason)
        message.success('User blocked')
        loadUsers()
      }
      setBlockModal({ open: false, type: null, id: null })
      blockForm.resetFields()
    } catch (e) {
      message.error('Failed to apply block')
    }
  }

  const unblockDevice = async deviceId => {
    try {
      await securityApi.unblockWalletDevice(deviceId)
      message.success('Device unblocked')
      loadDevices()
    } catch (e) {
      message.error('Failed to unblock device')
    }
  }

  const userColumns = [
    {
      title: 'User',
      key: 'user',
      render: (_, row) => (
        <div>
          <strong>
            {row.firstName} {row.lastName}
          </strong>
          <div style={{ fontSize: 12, color: '#888' }}>{row.email}</div>
          <div style={{ fontSize: 11, color: '#aaa' }}>{row.phone}</div>
        </div>
      ),
    },
    {
      title: 'Account',
      dataIndex: 'accountType',
      render: v => <Tag>{v || 'personal'}</Tag>,
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, row) =>
        row.isBlocked ? <Tag color="red">Blocked</Tag> : <Tag color="green">Active</Tag>,
    },
    {
      title: 'Blocked at',
      dataIndex: 'blockedAt',
      render: v => (v ? moment(v).format('MMM D, YYYY HH:mm') : '—'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, row) =>
        row.isBlocked ? (
          <Popconfirm
            title="Unblock this user?"
            onConfirm={() => toggleUserBlock(row.userId, false)}
          >
            <Button size="small">Unblock</Button>
          </Popconfirm>
        ) : (
          <Button size="small" danger onClick={() => openBlockModal('user', row.userId)}>
            Block
          </Button>
        ),
    },
  ]

  const deviceColumns = [
    {
      title: 'Device ID',
      dataIndex: 'deviceId',
      render: v => (
        <Tooltip title={v}>
          <span style={{ fontFamily: 'monospace', fontSize: 11 }}>{v}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Name / Platform',
      key: 'name',
      render: (_, row) => (
        <div>
          <div>{row.deviceName || '—'}</div>
          <Tag>{row.platform}</Tag>
        </div>
      ),
    },
    {
      title: 'Last user',
      key: 'lastUser',
      render: (_, row) => (
        <div>
          <div>{row.lastUserName || '—'}</div>
          <div style={{ fontSize: 11, color: '#888' }}>{row.lastUserEmail}</div>
        </div>
      ),
    },
    {
      title: 'Last active',
      dataIndex: 'lastActiveAt',
      render: v => (v ? moment(v).format('MMM D, YYYY HH:mm') : '—'),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, row) => <DeviceStatusTag row={row} />,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, row) =>
        row.isDeviceBlocked ? (
          <Popconfirm title="Unblock device?" onConfirm={() => unblockDevice(row.deviceId)}>
            <Button size="small">Unblock</Button>
          </Popconfirm>
        ) : (
          <Button size="small" danger onClick={() => openBlockModal('device', row.deviceId)}>
            Block device
          </Button>
        ),
    },
  ]

  const blockedDeviceColumns = [
    { title: 'Device ID', dataIndex: 'deviceId' },
    { title: 'Reason', dataIndex: 'reason', render: v => v || '—' },
    {
      title: 'Blocked at',
      dataIndex: 'blockedAt',
      render: v => (v ? moment(v).format('MMM D, YYYY HH:mm') : '—'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, row) => (
        <Popconfirm title="Unblock device?" onConfirm={() => unblockDevice(row.deviceId)}>
          <Button size="small">Unblock</Button>
        </Popconfirm>
      ),
    },
  ]

  return (
    <div>
      <Helmet title="Wallet Security - Admin" />
      <div className="cui__utils__heading">
        <strong>
          <LockOutlined /> Wallet Security
        </strong>
        <Button
          icon={<ReloadOutlined />}
          style={{ float: 'right' }}
          onClick={() => {
            loadUsers()
            loadDevices()
          }}
          loading={loading}
        >
          Refresh
        </Button>
      </div>

      <Tabs defaultActiveKey="users">
        <TabPane tab="Users" key="users">
          <Card>
            <Search
              placeholder="Search name, email, phone…"
              allowClear
              enterButton={<SearchOutlined />}
              style={{ maxWidth: 400, marginBottom: 16 }}
              onSearch={v => {
                setUserPage(1)
                setUserSearch(v.trim())
              }}
            />
            <Table
              rowKey={r => r.userId}
              loading={loading}
              columns={userColumns}
              dataSource={users}
              pagination={{
                current: userPage,
                pageSize: userLimit,
                total: userTotal,
                showSizeChanger: true,
                onChange: (p, l) => {
                  setUserPage(p)
                  setUserLimit(l)
                },
              }}
              size="small"
            />
          </Card>
        </TabPane>

        <TabPane
          tab={
            <span>
              <MobileOutlined /> Devices
            </span>
          }
          key="devices"
        >
          <Card title="Known mobile devices" style={{ marginBottom: 16 }}>
            <Search
              placeholder="Search device ID, name, user…"
              allowClear
              enterButton={<SearchOutlined />}
              style={{ maxWidth: 400, marginBottom: 16 }}
              onSearch={v => {
                setDevicePage(1)
                setDeviceSearch(v.trim())
              }}
            />
            <Table
              rowKey={r => r.deviceId}
              loading={loading}
              columns={deviceColumns}
              dataSource={devices}
              pagination={{
                current: devicePage,
                pageSize: deviceLimit,
                total: deviceTotal,
                showSizeChanger: true,
                onChange: (p, l) => {
                  setDevicePage(p)
                  setDeviceLimit(l)
                },
              }}
              size="small"
            />
          </Card>

          <Card title="Blocked devices">
            <Table
              rowKey={r => r.deviceId}
              loading={loading}
              columns={blockedDeviceColumns}
              dataSource={blockedDevices}
              pagination={false}
              size="small"
            />
          </Card>
        </TabPane>
      </Tabs>

      <Modal
        title={blockModal.type === 'user' ? 'Block user' : 'Block device'}
        open={blockModal.open}
        onCancel={() => {
          setBlockModal({ open: false, type: null, id: null })
          blockForm.resetFields()
        }}
        onOk={() => blockForm.submit()}
      >
        <p style={{ marginBottom: 12 }}>
          {blockModal.type === 'user'
            ? 'User will be logged out from mobile and browser and cannot log in again.'
            : 'This device will be logged out immediately. No user can sign up or log in on this device.'}
        </p>
        <Form form={blockForm} layout="vertical" onFinish={submitBlock}>
          <Form.Item name="reason" label="Reason (optional)">
            <Input.TextArea rows={2} placeholder="Reason for blocking this device" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default WalletSecurity
