import React, { useCallback, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Card, Table, Tag, Select, Button, Input, Row, Col, message, Tooltip } from 'antd'
import { PercentageOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons'
import moment from 'moment'
import * as merchantFeesApi from 'services/financeWalletMerchantFees'

const { Search } = Input
const { Option } = Select

const riskColor = {
  low: 'green',
  mid: 'orange',
  high: 'red',
}

function extractAccountRows(envelope) {
  if (Array.isArray(envelope?.data)) return envelope.data
  if (Array.isArray(envelope)) return envelope
  return []
}

const MerchantFees = () => {
  const [loading, setLoading] = useState(false)
  const [tiers, setTiers] = useState([])
  const [accounts, setAccounts] = useState([])
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [riskFilter, setRiskFilter] = useState('')
  const [updatingId, setUpdatingId] = useState(null)

  const loadTiers = useCallback(async () => {
    try {
      const res = await merchantFeesApi.fetchMerchantFeeTiers()
      const data = res?.data?.data ?? res?.data ?? res
      setTiers(data?.tiers || [])
    } catch (e) {
      message.error('Failed to load fee tiers')
    }
  }, [])

  const loadAccounts = useCallback(async () => {
    setLoading(true)
    try {
      const res = await merchantFeesApi.fetchBusinessAccounts({
        page,
        limit,
        search,
        riskTier: riskFilter,
      })
      const envelope = res?.data ?? res
      const rows = extractAccountRows(envelope)
      setAccounts(rows)
      setTotal(envelope?.pagination?.total ?? rows.length)
    } catch (e) {
      message.error('Failed to load business accounts')
    } finally {
      setLoading(false)
    }
  }, [page, limit, search, riskFilter])

  useEffect(() => {
    loadTiers()
  }, [loadTiers])

  useEffect(() => {
    loadAccounts()
  }, [loadAccounts])

  const handleRiskChange = async (userId, riskTier) => {
    setUpdatingId(userId)
    try {
      await merchantFeesApi.updateBusinessRiskTier(userId, riskTier)
      message.success('Risk tier updated')
      loadAccounts()
    } catch (e) {
      message.error('Failed to update risk tier')
    } finally {
      setUpdatingId(null)
    }
  }

  const columns = [
    {
      title: 'Business',
      key: 'business',
      render: (_, row) => (
        <div>
          <strong>{row.businessName || `${row.firstName} ${row.lastName}`}</strong>
          {row.username && <div style={{ fontSize: 12, color: '#888' }}>@{row.username}</div>}
        </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      render: v => v || '—',
    },
    {
      title: 'Merchant ID',
      dataIndex: 'merchantId',
      render: v => v || '—',
    },
    {
      title: 'Finance Business ID',
      dataIndex: 'financeBusinessId',
      render: v =>
        v ? (
          <Tooltip title={v}>
            <span style={{ fontFamily: 'monospace', fontSize: 11 }}>{v.slice(0, 12)}…</span>
          </Tooltip>
        ) : (
          '—'
        ),
    },
    {
      title: 'Risk tier',
      dataIndex: 'riskTier',
      render: (tier, row) => (
        <Select
          value={tier}
          size="small"
          style={{ width: 130 }}
          loading={updatingId === row.userId}
          onChange={value => handleRiskChange(row.userId, value)}
        >
          <Option value="low">Low risk</Option>
          <Option value="mid">Mid risk</Option>
          <Option value="high">High risk</Option>
        </Select>
      ),
    },
    {
      title: 'Fee',
      dataIndex: 'feePercent',
      render: (v, row) => <Tag color={riskColor[row.riskTier] || 'default'}>{v}%</Tag>,
    },
    {
      title: 'Signed up',
      dataIndex: 'createdAt',
      render: v => (v ? moment(v).format('MMM D, YYYY') : '—'),
    },
  ]

  return (
    <div>
      <Helmet title="Business Merchant Fees - Admin" />
      <div className="cui__utils__heading">
        <strong>
          <PercentageOutlined /> Business Merchant Fees
        </strong>
        <Button
          icon={<ReloadOutlined />}
          style={{ float: 'right' }}
          onClick={() => {
            loadTiers()
            loadAccounts()
          }}
          loading={loading}
        >
          Refresh
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        {tiers.map(tier => (
          <Col span={8} key={tier.riskTier}>
            <Card size="small">
              <div style={{ fontSize: 13, color: '#888' }}>{tier.label}</div>
              <div style={{ fontSize: 24, fontWeight: 600 }}>
                <Tag color={riskColor[tier.riskTier]}>{tier.feePercent}%</Tag>
              </div>
              <div style={{ fontSize: 12, color: '#aaa', marginTop: 4 }}>
                Per transaction on wallet payments
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Card
        title="Business wallet accounts"
        style={{ marginTop: 16 }}
        extra={
          <span style={{ fontSize: 12, color: '#888' }}>
            Users who signed up as Business via Finance Wallet
          </span>
        }
      >
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={12}>
            <Search
              placeholder="Search business name, email, username, merchant ID…"
              allowClear
              enterButton={<SearchOutlined />}
              onSearch={value => {
                setPage(1)
                setSearch(value.trim())
              }}
            />
          </Col>
          <Col span={6}>
            <Select
              allowClear
              placeholder="Filter by risk tier"
              style={{ width: '100%' }}
              value={riskFilter || undefined}
              onChange={v => {
                setPage(1)
                setRiskFilter(v || '')
              }}
            >
              <Option value="low">Low risk (1.5%)</Option>
              <Option value="mid">Mid risk (3%)</Option>
              <Option value="high">High risk (4.5%)</Option>
            </Select>
          </Col>
        </Row>

        <Table
          rowKey={r => r.userId}
          loading={loading}
          columns={columns}
          dataSource={accounts}
          pagination={{
            current: page,
            pageSize: limit,
            total,
            showSizeChanger: true,
            onChange: (nextPage, nextLimit) => {
              setPage(nextPage)
              setLimit(nextLimit)
            },
          }}
          size="small"
        />
      </Card>
    </div>
  )
}

export default MerchantFees
