import React, { useEffect, useCallback, useState } from 'react'
import qs from 'qs'
import { connect } from 'react-redux'
import Table from 'components/app/table'
import Card from 'components/app/card'
import Title from 'components/app/detailsComponents/title'
import getColumns from 'components/app/CommonTableFormatter/subscriptionsPaymentTableFormatter'

const mapStateToProps = ({ subscriptions, dispatch }) => ({
  subscriptions,
  dispatch,
})

const Index = ({ dispatch, subscriptions: { payments }, subscriptionId }) => {
  const [data, setData] = useState(null)
  const [pageSize, setPageSize] = useState(100)
  const [total, setTotal] = useState(100)
  const [current, setCurrent] = useState(1)

  const initFetch = useCallback(
    qryString => {
      dispatch({
        type: 'subscriptions/FETCH_SUBSCRIPTION_PAYMENTS',
        payload: {
          qryString,
        },
      })
    },
    [dispatch],
  )

  useEffect(() => {
    initFetch(qs.stringify({ pageNo: current, pageSize, subscriptionId }))
  }, [current, initFetch, pageSize, subscriptionId])

  useEffect(() => {
    if (payments?.data?.meta) {
      const { meta } = payments.data
      setCurrent(meta.pageNo)
      setPageSize(meta.pageSize)
      setTotal(meta.total)
      setData(payments.data.payments)
    }
  }, [payments])

  const onPaginationChange = async (currentPage, pagesize) => {
    await setCurrent(currentPage)
    await setPageSize(pagesize)
  }

  const columns = getColumns()
  return (
    <>
      <Title>Payments</Title>
      {payments && (
        <Card>
          <div className="text-nowrap">
            <Table
              columns={columns}
              dataSource={data}
              loading={payments.loading}
              pageSize={pageSize}
              total={total}
              current={current}
              onPaginationChange={(currentPage, size) => onPaginationChange(currentPage, size)}
            />
          </div>
        </Card>
      )}
    </>
  )
}

export default connect(mapStateToProps)(Index)
