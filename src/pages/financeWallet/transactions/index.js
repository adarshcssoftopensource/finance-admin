import React, { useEffect, useState, useCallback } from 'react'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import {
  Table,
  Tag,
  Input,
  Select,
  Button,
  Row,
  Col,
  Card,
  Statistic,
  Tooltip,
  DatePicker,
} from 'antd'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons'
import moment from 'moment'

const { Search } = Input
const { Option } = Select
const { RangePicker } = DatePicker

const mapStateToProps = ({ financeWallet, dispatch }) => ({ financeWallet, dispatch })

const statusColorMap = {
  pending: 'orange',
  completed: 'green',
  success: 'green',
  approved: 'green',
  settled: 'cyan',
  failed: 'red',
  submitted: 'blue',
}

const resolveTxStatus = record => {
  const val = record?.status
  if (record?.transaction_type === 'Payment' && (!val || val === 'pending')) {
    return 'completed'
  }
  return val
}

const formatTxStatus = val => {
  if (!val) return '—'
  if (val === 'completed' || val === 'success' || val === 'settled' || val === 'approved') {
    return 'Approved'
  }
  return val
}

const methodLabelMap = {
  increase_ach: 'Increase ACH',
  column_ach: 'Column ACH',
  privy_crypto: 'Privy Crypto',
  bridge: 'Bridge',
}

const AllWalletTransactions = ({ financeWallet, dispatch }) => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [method, setMethod] = useState('')
  const [dateRange, setDateRange] = useState([null, null])

  const fetchData = useCallback(() => {
    dispatch({
      type: 'financeWallet/FETCH_ALL_TRANSACTIONS',
      payload: {
        page,
        limit,
        search,
        status,
        method,
        startDate: dateRange[0] ? dateRange[0].format('YYYY-MM-DD') : '',
        endDate: dateRange[1] ? dateRange[1].format('YYYY-MM-DD') : '',
      },
    })
  }, [dispatch, page, limit, search, status, method, dateRange])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const { allTransactions } = financeWallet
  const txPayload = allTransactions?.data?.data
  let transactions = []
  if (Array.isArray(txPayload?.data)) {
    transactions = txPayload.data
  } else if (Array.isArray(txPayload)) {
    transactions = txPayload
  }
  const total = txPayload?.total || 0
  const loading = allTransactions?.loading

  const columns = [
    {
      title: 'User',
      key: 'user',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600 }}>
            {record.user?.firstName} {record.user?.lastName}
          </div>
          <div style={{ color: '#888', fontSize: 12 }}>{record.user?.email}</div>
          <div style={{ color: '#aaa', fontSize: 11 }}>{record.user?.phone}</div>
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'transaction_type',
      key: 'transaction_type',
      render: val => <Tag color="geekblue">{val || '—'}</Tag>,
    },
    {
      title: 'Ref ID',
      dataIndex: 'transaction_ref_id',
      key: 'transaction_ref_id',
      render: val => (
        <Tooltip title={val}>
          <span style={{ fontFamily: 'monospace', fontSize: 12 }}>
            {val ? `${val.slice(0, 14)}…` : '—'}
          </span>
        </Tooltip>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      sorter: (a, b) => a.amount - b.amount,
      render: (val, record) => (
        <span
          style={{
            fontWeight: 600,
            color: record.direction === 'inbound' ? '#52c41a' : '#f5222d',
          }}
        >
          {record.direction === 'inbound' ? '+' : '-'}${((val || 0) / 100).toFixed(2)}
        </span>
      ),
    },
    {
      title: 'Method',
      dataIndex: 'method',
      key: 'method',
      render: val => <Tag color="purple">{methodLabelMap[val] || val || '—'}</Tag>,
    },
    {
      title: 'Direction',
      dataIndex: 'direction',
      key: 'direction',
      render: val => <Tag color={val === 'inbound' ? 'green' : 'volcano'}>{val || '—'}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (_, record) => {
        const resolved = resolveTxStatus(record)
        return <Tag color={statusColorMap[resolved] || 'default'}>{formatTxStatus(resolved)}</Tag>
      },
    },
    {
      title: 'Merchant',
      dataIndex: 'merchantName',
      key: 'merchantName',
      render: val => val || <span style={{ color: '#ccc' }}>—</span>,
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      defaultSortOrder: 'descend',
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: val => moment(val).format('DD MMM YYYY, HH:mm'),
    },
  ]

  return (
    <div>
      <Helmet title="All Wallet Transactions - Admin" />
      <div className="cui__utils__heading">
        <strong>Wallet Transactions</strong>
      </div>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic title="Total Records" value={total} />
          </Card>
        </Col>
      </Row>

      <Card>
        <Row gutter={12} style={{ marginBottom: 16 }} align="middle">
          <Col span={7}>
            <Search
              placeholder="Search ref ID, method, status…"
              allowClear
              enterButton={<SearchOutlined />}
              onSearch={val => {
                setSearch(val)
                setPage(1)
              }}
            />
          </Col>
          <Col span={4}>
            <Select
              style={{ width: '100%' }}
              placeholder="Status"
              allowClear
              onChange={val => {
                setStatus(val || '')
                setPage(1)
              }}
            >
              <Option value="pending">Pending</Option>
              <Option value="submitted">Submitted</Option>
              <Option value="success">Success</Option>
              <Option value="settled">Settled</Option>
              <Option value="failed">Failed</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              style={{ width: '100%' }}
              placeholder="Method"
              allowClear
              onChange={val => {
                setMethod(val || '')
                setPage(1)
              }}
            >
              <Option value="increase_ach">Increase ACH</Option>
              <Option value="column_ach">Column ACH</Option>
              <Option value="privy_crypto">Privy Crypto</Option>
              <Option value="bridge">Bridge</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Button icon={<ReloadOutlined />} onClick={fetchData}>
              Refresh
            </Button>
          </Col>
        </Row>
        <Row gutter={12} style={{ marginBottom: 16 }}>
          <Col span={10}>
            <RangePicker
              style={{ width: '100%' }}
              onChange={dates => {
                setDateRange(dates || [null, null])
                setPage(1)
              }}
            />
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={transactions}
          loading={loading}
          rowKey="_id"
          pagination={{
            current: page,
            pageSize: limit,
            total,
            showSizeChanger: true,
            showTotal: (t, range) => `${range[0]}-${range[1]} of ${t} transactions`,
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

export default connect(mapStateToProps)(AllWalletTransactions)
