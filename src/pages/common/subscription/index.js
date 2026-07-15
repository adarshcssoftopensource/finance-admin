import React from 'react'
import { Modal } from 'antd'
import { useDispatch } from 'react-redux'
import getColumns from 'components/app/CommonTableFormatter/subscriptionTableFormatter'
import Table from 'components/app/table'
/* eslint-disable */

const { confirm } = Modal

function index({ data, loading, pageSize, total, current, onPaginationChange, getSubscription }) {
  const dispatch = useDispatch()

  const showCancelConfirm = row => {
    confirm({
      title: 'Are you sure you want to cancel this subscription?',
      content: 'The subscription will be canceled at the end of the current billing cycle.',
      okText: 'Yes, Cancel',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        dispatch({
          type: 'subscriptions/CANCEL_SUBSCRIPTION',
          payload: {
            subscriptionId: row._id,
          },
          data: {
            getSubscription,
          },
        })
      },
    })
  }

  let columns = getColumns(showCancelConfirm)
  return (
    <div className="card-body p-0">
      <div className="text-nowrap">
        <div className="change-request">
          <div className="title">
            <p>Subscriptions</p>
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          pageSize={pageSize}
          total={total}
          current={current}
          onPaginationChange={(currentPage, size) => onPaginationChange(currentPage, size)}
        />
      </div>
    </div>
  )
}

export default index
