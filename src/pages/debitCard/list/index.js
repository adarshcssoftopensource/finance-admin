import React, { useCallback, useState, useEffect } from 'react'
import qs from 'qs'
import { isEmpty, get as _get } from 'lodash'
import { Modal, Input } from 'antd'
import moment from 'moment'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import { useHistory } from 'react-router-dom'
import { Modal as ReactModal, ModalBody, ModalHeader } from 'reactstrap'
import getColumns from 'components/app/CommonTableFormatter/debitCardTableFormatter'
import Filter from 'pages/debitCard/filter'
import Table from 'components/app/table'
import ActionFilter from '../filter/actionFilter'

const mapStateToProps = ({ debitCards, dispatch, router }) => ({
  debitCards,
  dispatch,
  router,
})

const Index = ({ dispatch, debitCards, router: { location } }) => {
  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(100)
  const [total, setTotal] = useState(100)
  const [data, setData] = useState([])
  const [keyword, setKeyword] = useState(null)
  const [amountTo, setAmountTo] = useState(null)
  const [amountFrom, setAmountFrom] = useState(null)
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortType, setSortType] = useState('desc')
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [resetFilter, setResetFilter] = useState(false)
  const [deleteReason, setDeleteReason] = useState('')
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [deleteRequestData, setDeleteRequestData] = useState({})
  const [isDeleteReasonError, setIsDeleteReasonError] = useState(false)
  const [isWalletSelected, setIsWalletSelected] = useState(false)
  const [selectedWallets, setSelectedWallets] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [virtualCardStatus, setVirtualCardStatus] = useState('')
  const [physicalCardStatus, setPhysicalCardStatus] = useState('')
  const [providerName, setProviderName] = useState('')
  const [isBulkUpdateError, setIsBulkUpdateError] = useState(false)
  const history = useHistory()
  const params = new URLSearchParams(location.search)

  const initFetch = useCallback(
    qryString => {
      dispatch({
        type: 'debitCards/FETCH_ALL_DEBIT_CARDS',
        payload: {
          qryString,
        },
      })
    },
    [dispatch],
  )

  useEffect(() => {
    initFetch(getQueryString())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initFetch, location.search])

  const getQueryString = () => {
    const queryKeyword = params.get('keywords') || keyword
    const queryStartDate = params.get('startDate') || startDate
    const queryEndDate = params.get('endDate') || endDate
    const queryAmountTo = params.get('amountTo') || amountTo
    const queryAmountFrom = params.get('amountFrom') || amountFrom
    const querySortBy = params.get('sortBy') || sortBy
    const querySortType = params.get('sortType') || sortType
    const queryProviderName = params.get('providerName') || providerName

    setKeyword(queryKeyword)
    setStartDate(queryStartDate)
    setEndDate(queryEndDate)
    setAmountTo(queryAmountTo)
    setAmountFrom(queryAmountFrom)
    setSortBy(querySortBy)
    setSortType(querySortType)
    setProviderName(queryProviderName)

    return qs.stringify({
      pageNo: location.query.pageNo || current,
      pageSize: location.query.pageSize || pageSize,
      keyword: queryKeyword,
      startDate: queryStartDate,
      endDate: queryEndDate,
      amountTo: queryAmountTo,
      amountFrom: queryAmountFrom,
      sortBy: querySortBy,
      sortType: querySortType,
      providerName: queryProviderName,
    })
  }

  useEffect(() => {
    if (debitCards && debitCards.debitCards && debitCards.debitCards.data) {
      const { meta } = debitCards.debitCards.data
      const debitCardData = debitCards.debitCards.data.debitCards
      setCurrent(meta.pageNo)
      setPageSize(meta.pageSize)
      setTotal(meta.total)
      setData(debitCardData)
      setSelectedWallets([])
      setIsWalletSelected(false)
      setSubmitLoading(false)
      closeModal()
    }
  }, [debitCards])

  const handleDebitCardURL = (type, value, type2, value2) => {
    params.set('pageNo', 1)
    params.set('pageSize', location.query.pageSize || pageSize)
    if (value) {
      params.set(type, value)
      if (type2 && value2) {
        params.set(type2, value2)
      }
    } else {
      params.delete(type)
    }
    history.push({ search: params.toString() })
  }

  const handleDateRangeURL = (fromDate, toDate) => {
    params.set('pageNo', 1)
    params.set('pageSize', location.query.pageSize || pageSize)
    if (fromDate) {
      params.set('startDate', fromDate)
    } else {
      params.delete('startDate')
    }
    if (toDate) {
      params.set('endDate', toDate)
    } else {
      params.delete('endDate')
    }
    history.push({ search: params.toString() })
  }

  const handleFilterChange = (value, type) => {
    setCurrent(1)
    history.push({ pageNo: 1 })
    if (type === 'keywords') {
      setKeyword(value)
      handleDebitCardURL('keywords', value)
    } else if (type === 'amountFrom') {
      setAmountFrom(value)
      handleDebitCardURL('amountFrom', value)
    } else if (type === 'amountTo') {
      setAmountTo(value)
      handleDebitCardURL('amountTo', value)
    } else if (type === 'providerName') {
      setProviderName(value)
      handleDebitCardURL('providerName', value)
    } else if (type === 'date') {
      if (value) {
        setEndDate(moment(value[1]).format('YYYY-MM-DD'))
        setStartDate(moment(value[0]).format('YYYY-MM-DD'))
        handleDateRangeURL(
          moment(value[0]).format('YYYY-MM-DD'),
          moment(value[1]).format('YYYY-MM-DD'),
        )
      } else {
        setEndDate(null)
        setStartDate(null)
      }
    }
  }

  const handleSort = (pagination, filters, sorter) => {
    if (!isEmpty(sorter)) {
      handleDebitCardURL(
        'sortBy',
        sorter.columnKey,
        'sortType',
        sorter.order === 'ascend' ? 'asc' : 'desc',
      )
    }
  }

  const clearFilter = () => {
    params.delete('startDate')
    params.delete('endDate')
    params.delete('amountFrom')
    params.delete('amountTo')
    params.delete('keywords')
    params.delete('pageNo')
    params.delete('pageSize')
    params.delete('sortType')
    params.delete('sortBy')
    params.delete('providerName')
    history.push({ search: params.toString() })
    setKeyword(null)
    setEndDate(null)
    setStartDate(null)
    setAmountTo(null)
    setAmountFrom(null)
    setProviderName('')
    setSortBy('createdAt')
    setSortType('desc')
    setResetFilter(!resetFilter)
  }

  const onPaginationChange = async (currentPage, pagesize) => {
    params.set('pageNo', currentPage)
    params.set('pageSize', pagesize)
    history.push({ search: params.toString() })
    setCurrent(currentPage)
    setPageSize(pagesize)
  }

  const showDeleteWalletConfirm = row => {
    setDeleteModalVisible(true)
    setDeleteRequestData(row)
  }

  const onDeleteWallet = row => {
    if (isDeleteReasonError || !deleteReason) {
      setIsDeleteReasonError(true)
      return false
    }
    handleDeleteModalCancel()
    return dispatch({
      type: 'debitCards/DELETE_DEBIT_CARD_WALLET',
      payload: {
        walletId: row.id,
        remarks: deleteReason,
        qryString: getQueryString(),
      },
    })
  }

  const handleDeleteModalCancel = () => {
    setDeleteModalVisible(false)
    setIsDeleteReasonError(false)
    setDeleteReason('')
  }

  const handleDeleteReasonChange = event => {
    if (!event.target.value) {
      setIsDeleteReasonError(true)
    }
    if (event.target.value && isDeleteReasonError) {
      setIsDeleteReasonError(false)
    }
    setDeleteReason(event.target.value)
  }

  const handleActionFilterChange = (value, type) => {
    setIsBulkUpdateError(false)
    if (type === 'virtualCardStatus') {
      setVirtualCardStatus(value)
    } else if (type === 'physicalCardStatus') {
      setPhysicalCardStatus(value)
    }
  }

  const rowSelection = {
    selectedRowKeys: selectedWallets,
    onChange: selectedRows => {
      setSelectedWallets(selectedRows)
      if (selectedRows.length > 0) {
        setIsWalletSelected(true)
      } else {
        setIsWalletSelected(false)
      }
    },
    getCheckboxProps: record => ({
      disabled: record.status === 'deleted',
    }),
  }

  const onBulkUpdateClick = async () => {
    setIsModalVisible(true)
  }

  const closeModal = () => {
    setIsModalVisible(false)
    setIsBulkUpdateError(false)
    setVirtualCardStatus('')
    setPhysicalCardStatus('')
  }

  const onSubmitStatusFilter = () => {
    if (!virtualCardStatus && !physicalCardStatus) {
      setIsBulkUpdateError(true)
      return false
    }
    const requestData = {}

    const wallets = data.filter(item => selectedWallets.includes(item.id))
    if (virtualCardStatus) {
      requestData.virtualCardStatus = virtualCardStatus
      const cards = wallets.map(wallet => {
        /* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
        const cardIds = _get(wallet, 'cards', [])
          .filter(card => card.cardType === 'virtual')
          .map(card => card._id)
        return cardIds
      })
      requestData.virtualCardIds = [].concat(...cards)
    }

    if (physicalCardStatus) {
      requestData.physicalCardStatus = physicalCardStatus
      const cards = wallets.map(wallet => {
        /* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
        const cardIds = _get(wallet, 'cards', [])
          .filter(card => card.cardType === 'physical')
          .map(card => card._id)
        return cardIds
      })
      requestData.physicalCardIds = [].concat(...cards)
    }

    setSubmitLoading(true)
    dispatch({
      type: 'debitCards/CHANGE_BULK_DEBIT_CARD_STATUS',
      payload: {
        requestData,
        qryString: getQueryString(),
      },
    })
    return true
  }

  const columns = getColumns(showDeleteWalletConfirm)

  return (
    <div>
      <Helmet title="Wallet: List" />
      <div className="cui__utils__heading">
        <strong>Wallets</strong>
      </div>
      <div className="card">
        <div className="card-header card-header-flex">
          <div className="d-flex flex-column justify-content-center mr-auto w-100 w-100">
            <Filter
              handleFilterChange={handleFilterChange}
              clearFilter={clearFilter}
              key={resetFilter}
              qryString={qs.stringify({
                pageNo: current,
                pageSize,
                keyword,
                startDate,
                endDate,
                amountTo,
                amountFrom,
                providerName,
              })}
              keyword={keyword}
              startDate={startDate}
              endDate={endDate}
              amountFrom={amountFrom}
              amountTo={amountTo}
              onBulkUpdateClick={onBulkUpdateClick}
              isWalletSelected={isWalletSelected}
              providerName={providerName}
            />
          </div>
        </div>
        <div className="card-body">
          <div className="text-nowrap">
            <Table
              rowSelection={{
                type: 'checkbox',
                ...rowSelection,
              }}
              columns={columns}
              dataSource={data}
              loading={debitCards.debitCards.loading}
              pageSize={pageSize}
              total={total}
              current={current}
              onPaginationChange={(currentPage, size) => onPaginationChange(currentPage, size)}
              onChange={handleSort}
            />
          </div>
        </div>
      </div>
      <Modal
        title="Delete Wallet"
        visible={deleteModalVisible}
        onOk={() => onDeleteWallet(deleteRequestData)}
        okText="Submit"
        onCancel={handleDeleteModalCancel}
      >
        <p>Are you sure you want to delete this business wallet?</p>
        <div>
          <span className="filter-label">
            Delete Wallet Reason <span className="text-red">*</span>
          </span>
          <Input
            className="mb-2"
            value={deleteReason}
            onChange={e => handleDeleteReasonChange(e)}
          />
          {isDeleteReasonError ? (
            <span>
              <small className="form-text text-danger">Delete wallet reason is required!</small>
            </span>
          ) : null}
        </div>
      </Modal>
      <ReactModal isOpen={isModalVisible} toggle={closeModal} size="md">
        <ModalHeader className="pt-3 pb-1" toggle={() => closeModal()}>
          Bulk Update Card Status
        </ModalHeader>
        <ModalBody>
          <div className="d-flex flex-wrap justify-content-center">
            <ActionFilter
              handleActionFilterChange={handleActionFilterChange}
              onSubmitStatusFilter={onSubmitStatusFilter}
              virtualCardStatus={virtualCardStatus}
              physicalCardStatus={physicalCardStatus}
              isWalletSelected={isWalletSelected}
              submitLoading={submitLoading}
              isBulkUpdateError={isBulkUpdateError}
            />
          </div>
        </ModalBody>
      </ReactModal>
    </div>
  )
}

export default connect(mapStateToProps)(Index)
