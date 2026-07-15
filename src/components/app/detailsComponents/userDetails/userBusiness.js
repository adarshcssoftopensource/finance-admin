import React, { useEffect, useCallback, useState } from 'react'
import qs from 'qs'
import { Modal } from 'antd'
import { connect } from 'react-redux'
import Table from 'components/app/table'
import getColumns from 'components/app/CommonTableFormatter/businessTableFormatter'
import Card from 'components/app/card'
import Title from '../title'
/* eslint-disable */
const { confirm } = Modal

const mapStateToProps = ({ business, dispatch }) => ({
  business,
  dispatch,
})

const UserBusinesses = ({ dispatch, data, business: { businesses } }) => {
  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(100)
  const [total, setTotal] = useState(100)
  const [bizData, setBizData] = useState([])

  const initFetch = useCallback(
    qryString => {
      dispatch({
        type: 'business/FETCH_ALL_BUSINESS',
        payload: {
          qryString,
        },
      })
    },
    [dispatch],
  )

  useEffect(() => {
    if (data._id !== undefined) {
      initFetch(qs.stringify({ pageNo: current, pageSize, userId: data._id }))
    }
  }, [initFetch, current, pageSize])

  useEffect(() => {
    if (businesses && businesses.data) {
      const { meta } = businesses.data
      setCurrent(meta.pageNo)
      setPageSize(meta.pageSize)
      setTotal(meta.total)
      setBizData(businesses.data.businesses)
    }
  }, [businesses.data])

  const onPaginationChange = async (currentPage, pagesize) => {
    await setCurrent(currentPage)
    await setPageSize(pagesize)
  }

  const changeStatus = row => {
    /* eslint-disable */
    dispatch({
      type: 'business/ACTIVE_DEACTIVE_BUSINESS',
      payload: {
        businessId: row._id,
        isActive: !row.isActive,
      },
    })
  }

  const showDeleteConfirm = row => {
    confirm({
      title: `Are you sure you want to ${row.isActive ? 'deactivate' : 'activate'} this business?`,
      content: '',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        changeStatus(row)
      },
      onCancel() {},
    })
  }

  const deleteStripeAccount = businessId => {
    /* eslint-disable */
    dispatch({
      type: 'business/DELETE_STRIPE_ACCOUNT',
      payload: {
        businessId: businessId,
        qryString: 'pageNo=1&pageSize=100',
      },
    })
  }

  const showDeleteStripeConfirm = row => {
    confirm({
      title: `Are you sure you want to delete account of this business?`,
      content: '',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteStripeAccount(row._id)
      },
      onCancel() {},
    })
  }

  const syncBusinessStripeData = row => {
    dispatch({
      type: 'business/SYNC_BUSINESS_STRIPE_DATA',
      payload: {
        businessId: row._id,
        isUser: true,
        userId: data._id,
      },
    })
  }

  const columns = getColumns(showDeleteConfirm, showDeleteStripeConfirm, syncBusinessStripeData)
  return (
    <>
      <Card>
        <Title>Connected Businesses</Title>
        <div className="text-nowrap">
          <Table
            columns={columns}
            dataSource={bizData}
            loading={businesses.loading}
            pageSize={pageSize}
            total={total}
            current={current}
            onPaginationChange={(currentPage, size) => onPaginationChange(currentPage, size)}
          />
        </div>
      </Card>
    </>
  )
}

export default connect(mapStateToProps)(UserBusinesses)
