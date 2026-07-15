import React, { useCallback, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import {
  Card,
  Row,
  Col,
  Form,
  Input,
  InputNumber,
  Button,
  Table,
  Switch,
  DatePicker,
  Select,
  Tag,
  Popconfirm,
  message,
  Divider,
} from 'antd'
import { PercentageOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons'
import moment from 'moment'
import * as cashbackApi from 'services/walletCashback'

const { RangePicker } = DatePicker

const CashbackSettings = () => {
  const [loading, setLoading] = useState(false)
  const [platform, setPlatform] = useState(null)
  const [merchants, setMerchants] = useState([])
  const [promotions, setPromotions] = useState([])
  const [platformForm] = Form.useForm()
  const [merchantForm] = Form.useForm()
  const [promoForm] = Form.useForm()

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await cashbackApi.fetchCashbackOverview()
      const data = res?.data?.data ?? res?.data ?? res
      setPlatform(data.platform || null)
      setMerchants(data.merchants || [])
      setPromotions(data.promotions || [])
      platformForm.setFieldsValue({
        defaultRatePercent: data.platform?.defaultRatePercent ?? 1,
        maxRatePercent: data.platform?.maxRatePercent ?? 3,
        enabled: data.platform?.enabled !== false,
      })
    } catch (e) {
      message.error('Failed to load cashback settings')
    } finally {
      setLoading(false)
    }
  }, [platformForm])

  useEffect(() => {
    load()
  }, [load])

  const savePlatform = async values => {
    try {
      await cashbackApi.updatePlatformCashback(values)
      message.success('Platform cashback updated')
      load()
    } catch (e) {
      message.error('Failed to update platform settings')
    }
  }

  const saveMerchant = async values => {
    try {
      await cashbackApi.upsertMerchantCashback(values)
      message.success('Merchant cashback saved')
      merchantForm.resetFields()
      load()
    } catch (e) {
      message.error('Failed to save merchant override')
    }
  }

  const savePromotion = async values => {
    try {
      const [start, end] = values.dateRange || []
      await cashbackApi.createCashbackPromotion({
        name: values.name,
        promotionRatePercent: values.promotionRatePercent,
        startAt: start?.toISOString(),
        endAt: end?.toISOString(),
        applyToAllMerchants: values.applyToAllMerchants,
        businessIds: values.businessIds || [],
        randomSalesPercent: values.randomSalesPercent ?? 100,
        isActive: values.isActive !== false,
        notes: values.notes,
      })
      message.success('Promotion created')
      promoForm.resetFields()
      load()
    } catch (e) {
      message.error('Failed to create promotion')
    }
  }

  const merchantColumns = [
    {
      title: 'Business ID',
      dataIndex: 'businessId',
      render: id => String(id),
    },
    {
      title: 'Rate %',
      dataIndex: 'ratePercent',
      render: v => <Tag color="green">{v}%</Tag>,
    },
    {
      title: 'Enabled',
      dataIndex: 'enabled',
      render: v => (v === false ? 'No' : 'Yes'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, row) => (
        <Popconfirm
          title="Remove merchant override?"
          onConfirm={async () => {
            await cashbackApi.deleteMerchantCashback(row.businessId)
            message.success('Removed')
            load()
          }}
        >
          <Button type="link" danger size="small">
            Remove
          </Button>
        </Popconfirm>
      ),
    },
  ]

  const promoColumns = [
    { title: 'Name', dataIndex: 'name' },
    {
      title: 'Rate',
      dataIndex: 'promotionRatePercent',
      render: v => `${v}%`,
    },
    {
      title: 'Period',
      key: 'period',
      render: (_, r) =>
        `${moment(r.startAt).format('MMM D, YYYY')} – ${moment(r.endAt).format('MMM D, YYYY')}`,
    },
    {
      title: 'Random sales %',
      dataIndex: 'randomSalesPercent',
      render: v => `${v ?? 100}%`,
    },
    {
      title: 'Scope',
      key: 'scope',
      render: (_, r) =>
        r.applyToAllMerchants ? (
          <Tag>All merchants</Tag>
        ) : (
          <Tag>{(r.businessIds || []).length} merchant(s)</Tag>
        ),
    },
    {
      title: 'Active',
      dataIndex: 'isActive',
      render: v => (v ? <Tag color="green">Yes</Tag> : <Tag>No</Tag>),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, row) => (
        <Popconfirm
          title="Delete promotion?"
          onConfirm={async () => {
            await cashbackApi.deleteCashbackPromotion(row.id)
            message.success('Deleted')
            load()
          }}
        >
          <Button type="link" danger size="small">
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ]

  return (
    <div>
      <Helmet title="Wallet Cashback - Admin" />
      <div className="cui__utils__heading">
        <strong>
          <PercentageOutlined /> Wallet Cashback
        </strong>
        <Button
          icon={<ReloadOutlined />}
          style={{ float: 'right' }}
          onClick={load}
          loading={loading}
        >
          Refresh
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card title="Platform default (1% – 3% max)">
            <Form form={platformForm} layout="vertical" onFinish={savePlatform}>
              <Form.Item name="enabled" label="Cashback enabled" valuePropName="checked">
                <Switch />
              </Form.Item>
              <Form.Item
                name="defaultRatePercent"
                label="Default rate %"
                rules={[{ required: true }]}
              >
                <InputNumber min={1} max={3} step={0.1} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="maxRatePercent" label="Maximum rate %" rules={[{ required: true }]}>
                <InputNumber min={1} max={3} step={0.1} style={{ width: '100%' }} />
              </Form.Item>
              <Button type="primary" htmlType="submit">
                Save platform settings
              </Button>
            </Form>
            {platform && (
              <p style={{ marginTop: 12, color: '#888', fontSize: 12 }}>
                Shoppers see: &quot;Earn {platform.defaultRatePercent}% cash-back on this purchase
                with Finance Wallet&quot; unless a merchant or promotion applies a higher rate.
              </p>
            )}
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Per-merchant override">
            <Form form={merchantForm} layout="vertical" onFinish={saveMerchant}>
              <Form.Item
                name="businessId"
                label="Business ID (Mongo _id)"
                rules={[{ required: true }]}
              >
                <Input placeholder="507f1f77bcf86cd799439011" />
              </Form.Item>
              <Form.Item name="ratePercent" label="Cashback rate %" rules={[{ required: true }]}>
                <InputNumber min={1} max={3} step={0.1} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="enabled" label="Enabled" valuePropName="checked" initialValue>
                <Switch defaultChecked />
              </Form.Item>
              <Form.Item name="notes" label="Notes">
                <Input.TextArea rows={2} />
              </Form.Item>
              <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
                Save merchant override
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>

      <Card title="Promotional periods (random sales)" style={{ marginTop: 16 }}>
        <Form form={promoForm} layout="vertical" onFinish={savePromotion}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="name" label="Promotion name" rules={[{ required: true }]}>
                <Input placeholder="Holiday 2% cashback" />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="promotionRatePercent" label="Rate %" rules={[{ required: true }]}>
                <InputNumber min={1} max={3} step={0.1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                name="randomSalesPercent"
                label="% of sales eligible"
                initialValue={100}
                tooltip="e.g. 30 = only ~30% of checkouts get this promo rate (deterministic per sale)"
              >
                <InputNumber min={0} max={100} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="dateRange" label="Active period" rules={[{ required: true }]}>
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="applyToAllMerchants" valuePropName="checked">
                <Switch /> Apply to all merchants
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item name="businessIds" label="Or specific business IDs (comma-separated)">
                <Select mode="tags" placeholder="Leave empty if all merchants" />
              </Form.Item>
            </Col>
          </Row>
          <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
            Create promotion
          </Button>
        </Form>
        <Divider />
        <Table
          rowKey={r => String(r.id)}
          loading={loading}
          columns={promoColumns}
          dataSource={promotions}
          pagination={false}
          size="small"
        />
      </Card>

      <Card title="Merchant overrides" style={{ marginTop: 16 }}>
        <Table
          rowKey={r => String(r.id)}
          loading={loading}
          columns={merchantColumns}
          dataSource={merchants}
          pagination={false}
          size="small"
        />
      </Card>
    </div>
  )
}

export default CashbackSettings
