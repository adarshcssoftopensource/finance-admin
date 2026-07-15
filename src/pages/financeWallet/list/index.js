import React, { useEffect, useState, useCallback } from 'react'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import { Table, Tag, Input, Select, Button, Row, Col, Card, Statistic, Tooltip } from 'antd'
import {
  SearchOutlined,
  ReloadOutlined,
  WalletOutlined,
  DollarOutlined,
  UserOutlined,
} from '@ant-design/icons'
import moment from 'moment'

const { Search } = Input
const { Option } = Select

const mapStateToProps = ({ financeWallet, dispatch }) => ({ financeWallet, dispatch })

const statusColorMap = {
  Active: 'green',
  Frozen: 'blue',
  Restricted: 'red',
}

const FinanceWalletList = ({ financeWallet, dispatch }) => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')

  const fetchWallets = useCallback(() => {
    dispatch({ type: 'financeWallet/FETCH_WALLET_STATS' })
    dispatch({
      type: 'financeWallet/FETCH_ALL_WALLETS',
      payload: { page, limit, search, status },
    })
  }, [dispatch, page, limit, search, status])

  useEffect(() => {
    fetchWallets()
  }, [fetchWallets])

  const { allWallets, stats } = financeWallet
  const walletsPayload = allWallets?.data?.data
  let wallets = []
  if (Array.isArray(walletsPayload?.data)) {
    wallets = walletsPayload.data
  } else if (Array.isArray(walletsPayload)) {
    wallets = walletsPayload
  }
  const total = walletsPayload?.total || 0
  const loading = allWallets?.loading
  const walletStats = stats?.data?.data || stats?.data || {}

  const totalBalance =
    walletStats.totalBalance ?? wallets.reduce((sum, w) => sum + (w.balance || 0), 0)
  const activeCount = wallets.filter(w => w.status === 'Active').length

  const columns = [
    {
      title: 'User',
      key: 'user',
      render: (_, record) =>
        record.user ? (
          <div>
            <div style={{ fontWeight: 600 }}>
              {record.user.firstName} {record.user.lastName}
            </div>
            <div style={{ color: '#888', fontSize: 12 }}>{record.user.email}</div>
            <div style={{ color: '#aaa', fontSize: 11 }}>{record.user.phone}</div>
          </div>
        ) : (
          <div style={{ color: '#999', fontSize: 12 }}>
            User missing
            {record.userId ? (
              <div style={{ fontFamily: 'monospace', fontSize: 11 }}>
                {String(record.userId).slice(-8)}
              </div>
            ) : null}
          </div>
        ),
    },
    {
      title: 'Wallet ID',
      dataIndex: '_id',
      key: '_id',
      render: id => (
        <Tooltip title={id}>
          <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{id?.slice(-8)}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Privy live (USDC)',
      dataIndex: 'privyLiveBalance',
      key: 'privyLiveBalance',
      render: val =>
        val != null ? (
          <span style={{ fontWeight: 600, color: '#52c41a' }}>${Number(val).toFixed(2)}</span>
        ) : (
          <span style={{ color: '#ccc' }}>—</span>
        ),
    },
    {
      title: 'Available',
      dataIndex: 'availableBalance',
      key: 'availableBalance',
      render: val => `$${(val || 0).toFixed(2)}`,
    },
    {
      title: 'Pending',
      dataIndex: 'pendingBalance',
      key: 'pendingBalance',
      render: val => `$${(val || 0).toFixed(2)}`,
    },
    {
      title: 'Privy address',
      key: 'privy',
      render: (_, record) =>
        record.user?.privyWalletAddress ? (
          <Tooltip title={record.user.privyWalletAddress}>
            <span style={{ fontSize: 11, fontFamily: 'monospace' }}>
              {record.user.privyWalletAddress.slice(0, 8)}…
              {record.user.privyWalletAddress.slice(-6)}
            </span>
          </Tooltip>
        ) : (
          <span style={{ color: '#ccc' }}>—</span>
        ),
    },
    {
      title: 'Account',
      key: 'accountType',
      render: (_, record) => record.user?.accountType || '—',
    },
    {
      title: 'KYC',
      key: 'kyc',
      render: (_, record) =>
        record.user?.isKycVerified ? (
          <Tag color="green">Verified</Tag>
        ) : (
          <Tag color="orange">Pending</Tag>
        ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: val => <Tag color={statusColorMap[val] || 'default'}>{val || 'Active'}</Tag>,
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: val => moment(val).format('DD MMM YYYY, HH:mm'),
    },
  ]

  return (
    <div>
      <Helmet title="Finance Wallets - Admin" />
      <div className="cui__utils__heading">
        <strong>Finance Wallets</strong>
      </div>

      {/* Summary Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={4}>
          <Card>
            <Statistic
              title="Total wallets"
              value={walletStats.totalWallets ?? total}
              prefix={<WalletOutlined />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Privy signups"
              value={walletStats.privySignups ?? '—'}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Signups (7 days)"
              value={walletStats.signupsLast7Days ?? '—'}
              valueStyle={{ color: '#13c2c2' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Total balance"
              value={Number(totalBalance).toFixed(2)}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Available"
              value={Number(walletStats.totalAvailableBalance ?? 0).toFixed(2)}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic title="Active (page)" value={activeCount} />
          </Card>
        </Col>
      </Row>

      <Card>
        {/* Filters */}
        <Row gutter={12} style={{ marginBottom: 16 }}>
          <Col span={10}>
            <Search
              placeholder="Search by name, email, phone…"
              allowClear
              enterButton={<SearchOutlined />}
              onSearch={val => {
                setSearch(val)
                setPage(1)
              }}
            />
          </Col>
          <Col span={6}>
            <Select
              style={{ width: '100%' }}
              placeholder="Filter by status"
              allowClear
              onChange={val => {
                setStatus(val || '')
                setPage(1)
              }}
            >
              <Option value="Active">Active</Option>
              <Option value="Frozen">Frozen</Option>
              <Option value="Restricted">Restricted</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Button icon={<ReloadOutlined />} onClick={fetchWallets}>
              Refresh
            </Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={wallets}
          loading={loading}
          rowKey="_id"
          pagination={{
            current: page,
            pageSize: limit,
            total,
            showSizeChanger: true,
            showTotal: (t, range) => `${range[0]}-${range[1]} of ${t} wallets`,
            onChange: (p, l) => {
              setPage(p)
              setLimit(l)
            },
          }}
          scroll={{ x: true }}
        />
      </Card>
    </div>
  )
}

export default connect(mapStateToProps)(FinanceWalletList)
