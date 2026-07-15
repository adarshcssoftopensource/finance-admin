import React, { useEffect, useState, useCallback } from 'react'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import { Table, Tag, Input, Button, Row, Col, Card, Tooltip, Alert } from 'antd'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons'
import moment from 'moment'

const { Search } = Input

const mapStateToProps = ({ financeWallet, dispatch }) => ({ financeWallet, dispatch })

const WalletSignups = ({ financeWallet, dispatch }) => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [search, setSearch] = useState('')

  const fetchSignups = useCallback(() => {
    dispatch({
      type: 'financeWallet/FETCH_WALLET_SIGNUPS',
      payload: { page, limit, search },
    })
  }, [dispatch, page, limit, search])

  useEffect(() => {
    fetchSignups()
  }, [fetchSignups])

  const { signups } = financeWallet
  const payload = signups?.data?.data
  let rows = []
  if (Array.isArray(payload?.data)) {
    rows = payload.data
  } else if (Array.isArray(payload)) {
    rows = payload
  }
  const total = payload?.total || 0
  const loading = signups?.loading
  const errorMessage = signups?.error || null

  const columns = [
    {
      title: 'User',
      key: 'user',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600 }}>
            {record.firstName} {record.lastName}
          </div>
          <div style={{ color: '#888', fontSize: 12 }}>{record.email}</div>
          <div style={{ color: '#aaa', fontSize: 11 }}>{record.phone}</div>
        </div>
      ),
    },
    {
      title: 'Signed up',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: val => (val ? moment(val).format('DD MMM YYYY, HH:mm') : '—'),
    },
    {
      title: 'Privy wallet',
      key: 'privy',
      render: (_, record) =>
        record.hasPrivyWallet || record.privyWalletId ? (
          <div>
            <Tag color="green">Created</Tag>
            <Tooltip title={record.privyWalletAddress || ''}>
              <div style={{ fontFamily: 'monospace', fontSize: 11, marginTop: 4 }}>
                {record.privyWalletAddress
                  ? `${record.privyWalletAddress.slice(0, 10)}…${record.privyWalletAddress.slice(
                      -6,
                    )}`
                  : record.privyWalletId?.slice(0, 12)}
              </div>
            </Tooltip>
          </div>
        ) : (
          <Tag color="orange">Missing</Tag>
        ),
    },
    {
      title: 'Privy live (USDC)',
      dataIndex: 'privyLiveBalance',
      key: 'privyLiveBalance',
      render: val =>
        val != null ? (
          <span style={{ fontWeight: 600, color: '#1890ff' }}>${Number(val).toFixed(2)}</span>
        ) : (
          '—'
        ),
    },
    {
      title: 'KYC',
      key: 'kyc',
      render: (_, record) =>
        record.isKycVerified ? (
          <Tag color="green">Verified</Tag>
        ) : (
          <Tag color="orange">Pending</Tag>
        ),
    },
    {
      title: 'Wallet status',
      key: 'walletStatus',
      render: (_, record) => record.wallet?.status || '—',
    },
  ]

  return (
    <div>
      <Helmet title="Finance Wallet Signups - Admin" />
      <div className="cui__utils__heading">
        <strong>Finance Wallet Signups</strong>
      </div>

      {errorMessage && (
        <Alert
          type="error"
          message={errorMessage}
          description="Not Found"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <Card>
        <Row gutter={12} style={{ marginBottom: 16 }}>
          <Col span={12}>
            <Search
              placeholder="Search name, email, phone, wallet address…"
              allowClear
              enterButton={<SearchOutlined />}
              onSearch={val => {
                setSearch(val)
                setPage(1)
              }}
            />
          </Col>
          <Col span={4}>
            <Button icon={<ReloadOutlined />} onClick={fetchSignups}>
              Refresh
            </Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={rows}
          loading={loading}
          rowKey="email"
          pagination={{
            current: page,
            pageSize: limit,
            total,
            showSizeChanger: true,
            showTotal: (t, range) => `${range[0]}-${range[1]} of ${t} signups`,
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

export default connect(mapStateToProps)(WalletSignups)
