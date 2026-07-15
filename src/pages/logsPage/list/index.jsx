/* eslint-disable */
import React, { useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Button, Modal, Tabs } from 'antd'
import style from '../../banner/style.module.scss'
import Table from '../../../components/app/table'
import {
  getErrorLogsColumn,
  getWebhooksLogsColumn,
} from '../../../components/app/CommonTableFormatter/businessTableFormatter'
import { useDispatch, useSelector } from 'react-redux'
import { Spinner, TabPane } from 'reactstrap'
import qs from 'qs'
import LogsFilter from '../Filter'

function AllLogs() {
  const [selectedTab, setSelectedTab] = useState('webhook-logs')
  const [pageSize, setPageSize] = useState(100)
  const [currentPage, setCurrent] = useState(1)
  const logsFilterRef = useRef({})
  const dispatch = useDispatch()
  const {
    errorLogs: {
      data: { data: errorData, meta: { total: errorTotal } = {} } = {},
      isLoading: isErrorLoading,
    } = {},
    webhookLogs: {
      data: { data: webhookData, meta: { total: webhookTotal } = {} } = {},
      isLoading: isWebhookLoading,
    } = {},
  } = useSelector(state => {
    return state?.allLogsReducer ?? {}
  })

  const tabChange = e => {
    setSelectedTab(e)
  }

  const FetchLogs = () => {
    const queryPayload = {
      pageNo: currentPage,
      pageSize: pageSize,
    }
    const { filter } = logsFilterRef.current ?? {}
    if (filter?.businessId) {
      queryPayload['businessId'] = filter.businessId
    }

    if (filter?.providerName) {
      queryPayload[selectedTab === 'webhook-logs' ? 'providerName' : 'source'] = filter.providerName
    }
    if (filter?.date?.length === 2) {
      queryPayload['startedDate'] = filter?.date[0].format('YYYY-MM-DD')
      queryPayload['endDate'] = filter?.date[0].format('YYYY-MM-DD')
    }
    dispatch({
      type:
        selectedTab === 'webhook-logs'
          ? 'logs/FETCH_ALL_WEBHOOK_LOGS'
          : 'logs/FETCH_ALL_ERROR_LOGS',
      payload: {
        query: qs.stringify({
          ...queryPayload,
        }),
      },
    })
  }

  useEffect(() => {
    FetchLogs()
  }, [selectedTab, currentPage, pageSize])

  const info = (webhookData, stack = '') => {
    Modal.info({
      title: `${selectedTab === 'webhook-logs' ? 'Webhook' : 'Error'} Raw data`,
      width: 1000,
      content: (
        <pre>
          {stack}
          <br />
          {JSON.stringify(webhookData, undefined, 2)}
        </pre>
      ),
      onOk() {},
    })
  }

  const onPaginationChange = async (currentPage, pageSize) => {
    setCurrent(currentPage)
    setPageSize(pageSize)
  }

  const handleTableRender = (columns, tableData, loading, total = 0) => {
    return (
      <Table
        columns={columns}
        dataSource={tableData}
        loading={loading}
        pageSize={pageSize}
        total={total}
        current={currentPage}
        onPaginationChange={(currentPage, size) => onPaginationChange(currentPage, size)}
      />
    )
  }

  const webhooksLogsColumn = getWebhooksLogsColumn(info)
  const errorLogsColumn = getErrorLogsColumn(info)

  return (
    <div>
      <Helmet title="Logs: List" />
      <div className="cui__utils__heading mb-0">
        <strong>All Logs</strong>
      </div>
      <div key={selectedTab} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <LogsFilter selectedTab={selectedTab} ref={me => (logsFilterRef.current = me)} />
        <Button
          style={{ bottom: -10 }}
          color="primary"
          type="primary"
          onClick={() => FetchLogs()}
          disabled={isErrorLoading || isWebhookLoading}
        >
          {isErrorLoading || isWebhookLoading ? <Spinner size="sm" color="default" /> : 'Search'}
        </Button>
      </div>
      <div className="card">
        <Tabs
          onChange={tabChange}
          activeKey={selectedTab.toString()}
          className={`${style.tabs} kit-tabs-bordered`}
          defaultActiveKey="1"
          // tabBarExtraContent={operations}
        >
          <TabPane tab="Webhook logs" key="webhook-logs">
            <div className="card-body p-0">
              <div className="text-nowrap">
                {handleTableRender(webhooksLogsColumn, webhookData, isWebhookLoading, webhookTotal)}
              </div>
            </div>
          </TabPane>
          <TabPane tab="Error logs" key="error-logs">
            <div className="card-body p-0">
              <div className="text-nowrap">
                {handleTableRender(errorLogsColumn, errorData, isErrorLoading, errorTotal)}
              </div>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </div>
  )
}

export default AllLogs
