import React, { useEffect, useCallback, useState } from 'react'
import qs from 'qs'
import moment from 'moment'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import Table from 'components/app/table'
import getColumns from 'components/app/CommonTableFormatter/invoiceBadDataTableFormatter'
import Filter from 'pages/invoices/filter'
import { useHistory } from 'react-router-dom'

const mapStateToProps = ({ invoices, dispatch, router }) => ({
  invoices,
  dispatch,
  router,
})

const Index = ({ dispatch, invoices: { invoices }, router: { location } }) => {
  const [current, setCurrent] = useState(1)
  const [keyword, setKeyword] = useState(null)
  const [pageSize, setPageSize] = useState(100)
  const [total, setTotal] = useState(100)
  const [invoicesData, setInvoicesData] = useState([])
  const [startDate, setStartDate] = useState(null)
  const [invoiceNumber, setInvoiceNumber] = useState(null)
  const [status, setStatus] = useState('')
  const [endDate, setEndDate] = useState(null)
  const [resetFilter, setResetFilter] = useState(false)
  const history = useHistory()
  const params = new URLSearchParams(location.search)

  const initFetch = useCallback(
    qryString => {
      dispatch({
        type: 'invoices/FETCH_ALL_INVOICES',
        payload: {
          qryString,
        },
      })
    },
    [dispatch],
  )

  useEffect(() => {
    const queryKeyword = params.get('keywords') || keyword
    const queryStartDate = params.get('startDate') || startDate
    const queryEndDate = params.get('endDate') || endDate
    const queryInvoiceNumber = params.get('invoiceNumber') || invoiceNumber
    const queryStatus = params.get('status') || status
    setKeyword(queryKeyword)
    setStartDate(queryStartDate)
    setEndDate(queryEndDate)
    setInvoiceNumber(queryInvoiceNumber)
    setStatus(queryStatus)
    initFetch(
      qs.stringify({
        pageNo: location.query.pageNo || current,
        pageSize: location.query.pageSize || pageSize,
        keyword: queryKeyword,
        startDate: queryStartDate,
        endDate: queryEndDate,
        invoiceNumber: queryInvoiceNumber,
        status: queryStatus,
      }),
    )
  }, [initFetch, location.search])

  useEffect(() => {
    if (invoices?.data?.meta) {
      const { meta } = invoices.data
      setCurrent(meta.pageNo)
      setPageSize(meta.pageSize)
      setTotal(meta.total)
      setInvoicesData(invoices.data.invoices)
    }
  }, [invoices])

  const handleInvoiceURL = (type, value) => {
    params.set('pageNo', 1)
    params.set('pageSize', location.query.pageSize || pageSize)
    if (value) {
      params.set(type, value)
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
      handleInvoiceURL('keywords', value)
    } else if (type === 'invoiceNumber') {
      setInvoiceNumber(value)
      handleInvoiceURL('invoiceNumber', value)
    } else if (type === 'status') {
      setStatus(value)
      handleInvoiceURL('status', value)
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

  const clearFilter = () => {
    params.delete('status')
    params.delete('invoiceNumber')
    params.delete('keywords')
    params.delete('startDate')
    params.delete('endDate')
    params.delete('pageNo')
    params.delete('pageSize')
    history.push({ search: params.toString() })
    setKeyword(null)
    setEndDate(null)
    setStartDate(null)
    setInvoiceNumber(null)
    setStatus('')
    setResetFilter(!resetFilter)
  }

  const onPaginationChange = async (currentPage, pagesize) => {
    params.set('pageNo', currentPage)
    params.set('pageSize', pagesize)
    history.push({ search: params.toString() })
    setCurrent(currentPage)
    setPageSize(pagesize)
  }

  const columns = getColumns()

  return (
    <div>
      <Helmet title="Invoice bad data: List" />
      <div className="cui__utils__heading">
        <strong>Invoices Data</strong>
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
                invoiceNumber,
                status,
              })}
              keyword={keyword}
              startDate={startDate}
              endDate={endDate}
              invoiceNumber={invoiceNumber}
              status={status}
            />
          </div>
        </div>
        <div className="card-body">
          <div className="text-nowrap">
            <Table
              columns={columns}
              dataSource={invoicesData}
              loading={invoices.loading}
              pageSize={pageSize}
              total={total}
              current={current}
              onPaginationChange={(currentPage, size) => onPaginationChange(currentPage, size)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default connect(mapStateToProps)(Index)
