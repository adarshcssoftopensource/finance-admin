/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useCallback, useState } from 'react'
import qs from 'qs'
import moment from 'moment'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { useHistory, withRouter } from 'react-router-dom'
import { Modal as ReactModal, ModalBody, ModalHeader } from 'reactstrap'
import Table from 'components/app/table'
import getColumns from 'components/app/CommonTableFormatter/restrictBusinessTableFormatter'
import Filter from '../filter'
import ActionFilter from '../filter/actionFilter'

const mapStateToProps = ({ business, dispatch, router }) => ({
  business,
  dispatch,
  router,
})

const Index = ({ dispatch, router: { location }, business: { businesses } }) => {
  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(100)
  const [total, setTotal] = useState(100)
  const [keyword, setKeyword] = useState(null)
  const [bizData, setBizData] = useState([])
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [payoutStatus, setPayoutStatus] = useState('')
  const [debitCardCreationStatus, setDebitCardCreationStatus] = useState('')
  const [walletLoadStatus, setWalletLoadStatus] = useState('')
  const [isBusinessSelected, setIsBusinessSelected] = useState(false)
  const [selectedBusinesses, setSelectedBusinesses] = useState([])
  const [resetFilter, setResetFilter] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const history = useHistory()
  const params = new URLSearchParams(location.search)

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
    setStartDate(params.get('startDate') || null)
    setEndDate(params.get('endDate') || null)
    setKeyword(params.get('keywords') || null)
    initFetch(prepareString())
  }, [initFetch, location.search])

  useEffect(() => {
    if (businesses && businesses.data) {
      const { meta } = businesses.data
      setCurrent(meta.pageNo)
      setPageSize(meta.pageSize)
      setTotal(meta.total)
      setBizData(businesses.data.businesses)
      setSelectedBusinesses([])
      setIsBusinessSelected(false)
      setPayoutStatus('')
      setDebitCardCreationStatus('')
      setWalletLoadStatus('')
      setSubmitLoading(false)
      closeModal()
    }
  }, [businesses])

  const onPaginationChange = async (currentPage, pagesize) => {
    params.set('pageNo', currentPage)
    params.set('pageSize', pagesize)
    history.push({ search: params.toString() })
    setCurrent(currentPage)
    setPageSize(pagesize)
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

  const handleBusinessURL = (type, value) => {
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
    if (!location.query && !location.query.userId && !location.query.userName) {
      history.push({ pageNo: 1 })
    }
    setCurrent(1)
    if (type === 'keywords') {
      setKeyword(value)
      handleBusinessURL('keywords', value)
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

  const handleActionFilterChange = (value, type) => {
    if (type === 'payoutStatus') {
      setPayoutStatus(value)
    } else if (type === 'debitCardCreationStatus') {
      setDebitCardCreationStatus(value)
    } else if (type === 'walletLoadStatus') {
      setWalletLoadStatus(value)
    }
  }

  const onSubmitStatusFilter = () => {
    setSubmitLoading(true)
    dispatch({
      type: 'business/RESTRICT_BUSINESS',
      payload: {
        payoutStatus,
        debitCardCreationStatus,
        walletLoadStatus,
        selectedBusinesses,
        qryString: prepareString(),
      },
    })
  }

  const clearFilter = () => {
    params.delete('startDate')
    params.delete('endDate')
    params.delete('keywords')
    params.delete('pageNo')
    params.delete('pageSize')
    history.push({ search: params.toString() })
    setEndDate(null)
    setStartDate(null)
    setKeyword(null)
    setResetFilter(!resetFilter)
  }

  const prepareString = () => {
    return qs.stringify({
      pageNo: location.query.pageNo || current,
      pageSize: location.query.pageSize || pageSize,
      startDate: params.get('startDate') || startDate,
      endDate: params.get('endDate') || endDate,
      keyword: params.get('keywords') || keyword,
    })
  }

  const rowSelection = {
    selectedRowKeys: selectedBusinesses,
    onChange: selectedRows => {
      setSelectedBusinesses(selectedRows)
      if (selectedRows.length > 0) {
        setIsBusinessSelected(true)
      } else {
        setIsBusinessSelected(false)
      }
    },
  }

  const onBulkUpdateClick = async () => {
    setIsModalVisible(true)
  }

  const closeModal = () => {
    setIsModalVisible(false)
  }

  const columns = getColumns()
  return (
    <div>
      <Helmet title="Business: List" />
      <div className="cui__utils__heading mb-0">
        <strong>All Businesses</strong>
      </div>
      <div className="card">
        <div className="card-header card-header-flex">
          <div className="d-flex flex-column justify-content-center mr-auto w-100 w-100">
            <Filter
              handleFilterChange={handleFilterChange}
              clearFilter={clearFilter}
              key={resetFilter}
              qryString={prepareString()}
              startDate={startDate}
              endDate={endDate}
              keyword={keyword}
              onBulkUpdateClick={onBulkUpdateClick}
              isBusinessSelected={isBusinessSelected}
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
              dataSource={bizData}
              loading={businesses.loading}
              pageSize={pageSize}
              total={total}
              current={current}
              onPaginationChange={(currentPage, size) => onPaginationChange(currentPage, size)}
            />
          </div>
        </div>
      </div>
      <ReactModal isOpen={isModalVisible} toggle={closeModal} size="md">
        <ModalHeader className="pt-3 pb-1" toggle={() => closeModal()}>
          Bulk Update Business Restriction
        </ModalHeader>
        <ModalBody>
          <div className="d-flex flex-wrap justify-content-center">
            <ActionFilter
              handleActionFilterChange={handleActionFilterChange}
              onSubmitStatusFilter={onSubmitStatusFilter}
              payoutStatus={payoutStatus}
              debitCardCreationStatus={debitCardCreationStatus}
              walletLoadStatus={walletLoadStatus}
              isBusinessSelected={isBusinessSelected}
              submitLoading={submitLoading}
            />
          </div>
        </ModalBody>
      </ReactModal>
    </div>
  )
}

export default withRouter(connect(mapStateToProps)(Index))
