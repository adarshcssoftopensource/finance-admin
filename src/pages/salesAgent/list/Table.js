/* eslint-disable */
import React from 'react'
import { Table, Button, Space, Tooltip, Popconfirm, Tag } from 'antd'
import { DollarCircleOutlined, HistoryOutlined, UserOutlined } from '@ant-design/icons'

const SalesAgentTable = ({
  agents = [],
  loading,
  onEdit,
  onDelete,
  onLogPayout,
  onViewPayoutHistory,
  onShowMerchants,
  onAssume,
}) => {
  const columns = [
    {
      title: 'Agent Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Type',
      key: 'type',
      render: (_, record) =>
        record.parentAgentId ? (
          <Tag color="orange">Sub-agent</Tag>
        ) : (
          <Tag color="green">Primary</Tag>
        ),
    },
    {
      title: 'Parent',
      dataIndex: 'parentAgentId',
      key: 'parent',
      render: parent => (parent ? parent.name || 'Yes' : '-'),
    },
    {
      title: 'Email',
      dataIndex: 'emails',
      key: 'emails',
      render: emails => (Array.isArray(emails) ? emails[0] : emails),
    },
    {
      title: 'Split Rate (%)',
      dataIndex: 'splitRate',
      key: 'splitRate',
      render: value => `${value}%`,
    },
    {
      title: 'Merchants',
      key: 'merchants',
      render: (_, record) => (
        <a
          href="javascript:void(0);"
          className="kit__utils__link"
          onClick={() => onShowMerchants(record)}
        >
          {record.merchants?.length || 0}
        </a>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Assume Agent">
            <Button size="small" icon={<UserOutlined />} onClick={() => onAssume(record)} />
          </Tooltip>
          <Tooltip title="Log Payout">
            <Button
              size="small"
              icon={<DollarCircleOutlined />}
              onClick={() => onLogPayout(record)}
            />
          </Tooltip>
          <Tooltip title="View Payout History">
            <Button
              size="small"
              icon={<HistoryOutlined />}
              onClick={() => onViewPayoutHistory(record)}
            />
          </Tooltip>
          <Button size="small" type="primary" onClick={() => onEdit(record)}>
            Edit
          </Button>
          <Popconfirm title="Delete agent?" onConfirm={() => onDelete(record)}>
            <Button size="small" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <Table
      dataSource={agents}
      columns={columns}
      rowKey="_id"
      loading={loading}
      pagination={{ pageSize: 10 }}
    />
  )
}

export default SalesAgentTable
