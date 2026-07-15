import React, { useEffect, useCallback, useState } from 'react'
import qs from 'qs'
import { Helmet } from 'react-helmet'
import { Modal } from 'antd'
import { connect } from 'react-redux'
import Table from 'components/app/table'
import getColumns from 'components/app/CommonTableFormatter/downloadDataTableFormatter'
import Filter from 'pages/downloads/filter'
import { useHistory } from 'react-router-dom'

const { confirm } = Modal

const mapStateToProps = ({ downloadsReducer, dispatch, router }) => ({
  downloadsReducer,
  dispatch,
  router,
})

const Index = ({ dispatch, downloadsReducer: { downloads, loading }, router: { location } }) => {
  /* eslint-disable */
  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(100)
  const [total, setTotal] = useState(100)
  const [checkoutsData, setCheckoutsData] = useState([])
  const [status, setStatus] = useState('')
  const [exportType, setExportType] = useState('')
  const [resetFilter, setResetFilter] = useState(false)
  const history = useHistory()
  const params = new URLSearchParams(location.search)

  const initFetch = useCallback(
    qryString => {
      dispatch({
        type: 'downloads/FETCH_ALL_DOWNLOADS',
        payload: {
          qryString,
        },
      })
    },
    [dispatch],
  )

  useEffect(() => {
    const queryStatus = params.get('status') || status
    const queryExportType = params.get('export') || exportType
    setStatus(queryStatus)
    setExportType(queryExportType)
    initFetch(
      qs.stringify({
        pageNo: location.query.pageNo || current,
        pageSize: location.query.pageSize || pageSize,
        status: queryStatus,
        export: queryExportType,
      }),
    )
  }, [initFetch, location.search])

  useEffect(() => {
    if (downloads && downloads.meta) {
      const { meta } = downloads
      setCurrent(meta.pageNo)
      setPageSize(meta.pageSize)
      setTotal(meta.total)
      setCheckoutsData(downloads.downloads)
    }
  }, [downloads])

  const handleDownloadsURL = (type, value) => {
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
    if (type === 'status') {
      setStatus(value)
      handleDownloadsURL('status', value)
    } else if (type === 'export') {
      setExportType(value)
      handleDownloadsURL('export', value)
    }
  }

  const clearFilter = () => {
    params.delete('status')
    params.delete('pageNo')
    params.delete('pageSize')
    history.push({ search: params.toString() })
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

  const handleReplaceDebitCard = id => {
    dispatch({
      type: 'downloads/DELETE_SINGLE_DOWNLOAD',
      payload: {
        id,
        qryString: qs.stringify({
          pageNo: current,
          pageSize: pageSize,
          status: status,
          export: exportType,
        }),
      },
    })
  }

  const deleteDownloadData = download => {
    confirm({
      title: `Are you sure you want to delete this download?`,
      content: '',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleReplaceDebitCard(download.id)
      },
      onCancel() {},
    })
  }

  const columns = getColumns(deleteDownloadData)

  return (
    <div>
      <Helmet title="Checkout Data: List" />
      <div className="cui__utils__heading">
        <strong>Downloads</strong>
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
                status,
                export: exportType,
              })}
              exportType={exportType}
              status={status}
            />
          </div>
        </div>
        <div className="card-body">
          <div className="text-nowrap">
            <Table
              columns={columns}
              dataSource={checkoutsData}
              loading={loading}
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
