import React, { useState, useCallback, useEffect } from 'react'
import qs from 'qs'
import { connect } from 'react-redux'
import { Modal } from 'antd'
import { useHistory } from 'react-router-dom'
import { get as _get } from 'lodash'
import Table from 'components/app/table'
import getColumns from 'components/app/CommonTableFormatter/debitCardTransactionTableFormatter'
import StripeRaw from '../stripeRaw'
import TransactionFilter from './filter'
/* eslint-disable */

const mapStateToProps = ({ debitCards, dispatch, router }) => ({
  debitCards,
  dispatch,
  router,
})

const Transactions = ({ data, debitCards, dispatch, router: { location } }) => {
  const [transactionData, setTransactionData] = useState([])
  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(100)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [modalContent, setModalContent] = useState(null)
  const [selectedCardId, setSelectedCardId] = useState('')
  const [resetFilter, setResetFilter] = useState(false)
  const history = useHistory()
  const params = new URLSearchParams(location.search)

  const initFetch = useCallback(
    qryString => {
      dispatch({
        type: 'debitCards/FETCH_ALL_WALLET_TRANSACTION',
        payload: {
          qryString,
        },
      })
    },
    [dispatch],
  )

  useEffect(() => {
    if (data.businessId) {
      const businessId = data.businessId
      const queryCardId = params.get('cardId') || selectedCardId
      setSelectedCardId(queryCardId)
      if (businessId) {
        initFetch(
          qs.stringify({
            pageNo: current,
            pageSize: pageSize,
            cardId: queryCardId,
            businessId,
          }),
        )
      }
    }
  }, [initFetch, current, data])
  const splitId = () => location.pathname.split('/debit-card-wallets/')[1]

  useEffect(() => {
    if (debitCards && debitCards.walletTransactions && debitCards.walletTransactions.data) {
      const { meta, transactions } = debitCards.walletTransactions.data
      setCurrent(meta.pageNo)
      setPageSize(meta.pageSize)
      setTotal(meta.total)
      setTransactionData(transactions)
    }
  }, [debitCards.walletTransactions])

  const onPaginationChange = async (currentPage, pagesize) => {
    params.set('pageNo', currentPage)
    params.set('pageSize', pagesize)
    setCurrent(currentPage)
    setPageSize(pagesize)
  }

  const showStripeRowModal = rowData => {
    setIsModalVisible(true)
    setModalContent(rowData.stripeRawResponse)
  }

  const closeModal = () => {
    setIsModalVisible(false)
    setModalContent(null)
  }

  const handleTransactionURL = (type, value) => {
    params.set('pageNo', 1)
    params.set('pageSize', location.query.pageSize || pageSize)
    if (value) {
      params.set(type, value)
    } else {
      params.delete(type)
    }
    history.push({ search: params.toString() })
  }

  const handleFilterChange = (value, type) => {
    setCurrent(1)
    history.push({ pageNo: 1 })
    if (type === 'card') {
      setSelectedCardId(value)
      handleTransactionURL('cardId', value)
    }
  }

  const clearFilter = () => {
    params.delete('cardId')
    params.delete('pageNo')
    params.delete('pageSize')
    history.push({ search: params.toString() })
    setSelectedCardId('')
    setResetFilter(!resetFilter)
  }

  const columns = getColumns(showStripeRowModal)
  return (
    <div className="row">
      <div className="col-12">
        <TransactionFilter
          selectedCardId={selectedCardId}
          handleFilterChange={handleFilterChange}
          clearFilter={clearFilter}
          key={resetFilter}
          cards={_get(data, 'cards', [])}
        />
      </div>
      <div className="col-12">
        <Table
          columns={columns}
          dataSource={transactionData}
          loading={debitCards.walletTransactions.loading}
          pageSize={pageSize}
          total={total}
          current={current}
          onPaginationChange={(currentPage, size) => onPaginationChange(currentPage, size)}
        />
      </div>
      <Modal
        visible={isModalVisible}
        onCancel={closeModal}
        okButtonProps={{ style: { display: 'none' } }}
      >
        <div className="mt-4">{modalContent ? <StripeRaw data={modalContent} /> : null}</div>
      </Modal>
    </div>
  )
}

export default connect(mapStateToProps)(Transactions)
