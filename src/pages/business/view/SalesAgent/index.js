/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { Table, InputNumber, Button, Space, Tooltip, Popconfirm } from 'antd'
import { DollarCircleOutlined, HistoryOutlined } from '@ant-design/icons'

const SalesAgentTable = ({
  agent = [],
  onEdit,
  onDelete,
  details,
  onRemoveMerchant,
  onLogPayout,
  onViewPayoutHistory,
}) => {
  const [data, setData] = useState([])
  const businessId = details?.data?.business?._id

  useEffect(() => {
    if (!agent || agent.length === 0) {
      setData([])
      return
    }

    const agentArray = Array.isArray(agent) ? agent : [agent]

    setData(
      agentArray
        .map(item => {
          if (!item) return null
          const merchant = item.merchants?.find(
            m => m.businessId === businessId || m.businessId?._id === businessId,
          )

          return {
            ...item,
            _id: item._id?.$oid ?? item._id,
            splitRate: Number(item.splitRate ?? 0),
            costs: merchant?.costs || { card: 0, bank: 0, financing: 0, crypto: 0 },
            rates: merchant?.rates || { card: 0, bank: 0, financing: 0, crypto: 0 },
            email: item.emails?.[0] ?? '-',
          }
        })
        .filter(Boolean),
    )
  }, [agent, businessId])

  const columns = [
    {
      title: 'Agent Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Split Rate (%)',
      dataIndex: 'splitRate',
      key: 'splitRate',
      render: value => `${value}%`,
    },
    {
      title: 'Processing Rates (Rate / Cost)',
      key: 'rates',
      render: (_, record) => (
        <div style={{ fontSize: '12px' }}>
          <div>
            Card: {record.rates?.card ?? 0}% / {record.costs?.card ?? 0}%
          </div>
          <div>
            Bank: {record.rates?.bank ?? 0}% / {record.costs?.bank ?? 0}%
          </div>
          <div>
            Fin: {record.rates?.financing ?? 0}% / {record.costs?.financing ?? 0}%
          </div>
          <div>
            Crypto: {record.rates?.crypto ?? 0}% / {record.costs?.crypto ?? 0}%
          </div>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
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
          <Popconfirm title="Remove from merchant?" onConfirm={() => onRemoveMerchant(record)}>
            <Button size="small">Remove</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return <Table dataSource={data} columns={columns} rowKey="_id" pagination={false} size="small" />
}

export default SalesAgentTable
