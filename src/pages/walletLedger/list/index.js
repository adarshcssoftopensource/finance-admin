/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useCallback, useState } from 'react'
import qs from 'qs'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import Table from 'components/app/table'
import getColumns from 'components/app/CommonTableFormatter/walletLedgerTableFormatter'
import { useHistory } from 'react-router-dom'

const mapStateToProps = ({ walletLedger, dispatch, router }) => ({
  walletLedger,
  dispatch,
  router,
})

const Index = ({ dispatch, router: { location }, walletLedger: { walletLedger } }) => {
  const [current, setCurrent] = useState(1)
  const [bizData, setBizData] = useState([])
  const [total, setTotal] = useState(100)
  const [pageSize, setPageSize] = useState(100)
  const history = useHistory()

  const initFetch = useCallback(
    qryString => {
      dispatch({
        type: 'wallet/FETCH_WALLET_LEDGER',
        payload: {
          qryString,
        },
      })
    },
    [dispatch],
  )

  useEffect(() => {
    initFetch(prepareString())
  }, [initFetch, current])

  useEffect(() => {
    if (
      walletLedger &&
      walletLedger.data &&
      walletLedger.data.ledgerData &&
      walletLedger.data.meta
    ) {
      const { meta } = walletLedger.data
      setCurrent(meta.pageNo)
      setPageSize(meta.pageSize)
      setTotal(meta.total)
      setBizData(walletLedger.data.ledgerData)
    }
  }, [walletLedger])

  const onPaginationChange = async (currentPage, pagesize) => {
    const params = new URLSearchParams()
    params.append('pageNo', currentPage)
    params.append('pageSize', pagesize)
    history.push({ search: params.toString() })
    await setCurrent(currentPage)
    await setPageSize(pagesize)
  }

  const prepareString = () => {
    return qs.stringify({
      pageNo: location.query.pageNo || current,
      pageSize: location.query.pageSize || pageSize,
    })
  }

  return (
    <div>
      <Helmet title="Wallet Ledger: List" />
      <div className="text-nowrap">
        <Table
          columns={getColumns()}
          dataSource={bizData}
          loading={walletLedger.loading}
          pageSize={pageSize}
          total={total}
          current={current}
          onPaginationChange={onPaginationChange}
        />
      </div>
    </div>
  )
}

export default connect(mapStateToProps)(Index)
