/* eslint-disable */
import React, { useCallback, useEffect, useState } from 'react'
import { connect, useDispatch } from 'react-redux'
import Table from 'components/app/table'
import { Modal } from 'antd'
import { getWebhooksLogsColumn } from '../../../../components/app/CommonTableFormatter/businessTableFormatter'
import qs from 'qs'

const mapStateToProps = ({ business }) => {
  return {
    business,
  }
}

function WebhookLogs({
  business: {
    details: {
      data: { business: { _id: businessId, legal: { providerName } = {} } = {} } = {},
    } = {},
    businessWebhookLog: {
      data: { data: webhookData = [], meta: { total: webhookTotal } = {} },
      isLoading = false,
    } = {},
  } = {},
}) {
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrent] = useState(1)
  const dispatch = useDispatch()
  const initFetch = useCallback((pageSize, currentPage) => {
    if (businessId)
      dispatch({
        type: 'business/FETCH_BUSINESS_PROVIDER_LOGS',
        payload: {
          query: qs.stringify({
            businessId: businessId,
            providerName,
            pageNo: currentPage,
            pageSize: pageSize,
          }),
        },
      })
  }, [])
  useEffect(() => {
    initFetch(pageSize, currentPage)
  }, [])

  const info = webhookData => {
    Modal.info({
      title: 'Webhook Raw data',
      width: 1000,
      content: <pre>{JSON.stringify(webhookData, undefined, 2)}</pre>,
      onOk() {},
    })
  }

  const onPaginationChange = async (currentPage, pagesize) => {
    initFetch(pagesize, currentPage)
    setCurrent(currentPage)
    setPageSize(pagesize)
  }

  const columns = getWebhooksLogsColumn(info)
  return (
    <div>
      <Table
        columns={columns}
        scroll={{ y: 500 }}
        dataSource={webhookData}
        loading={isLoading}
        pageSize={pageSize}
        current={currentPage}
        total={webhookTotal}
        onPaginationChange={(currentPage, size) => onPaginationChange(currentPage, size)}
      />
    </div>
  )
}

export default connect(mapStateToProps)(WebhookLogs)
