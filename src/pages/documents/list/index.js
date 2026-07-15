import React, { useEffect, useCallback, useState } from 'react'
import qs from 'qs'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import Filter from 'pages/documents/filter'
import { useHistory } from 'react-router-dom'
import Table from 'components/app/table'
import getColumns from 'components/app/CommonTableFormatter/documentsTableFormatter'
import { Button, notification } from 'antd'
import { proceedWithSubmittedDocument } from 'services/documents'
import confirm from 'antd/lib/modal/confirm'
import RequestDocument from '../create'

const mapStateToProps = ({ documents, dispatch, router }) => ({
  documents,
  dispatch,
  router,
})

/* eslint-disable */

const Index = ({
  dispatch,
  documents: { documents },
  router: { location },
  legalId,
  isRefreshVerificationDocuments,
}) => {
  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(1000)
  const [total, setTotal] = useState(1000)
  const [businessId, setBusinessId] = useState(null)
  const [status, setStatus] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [documentsData, setDocumentsData] = useState([])
  const [resetFilter, setResetFilter] = useState(false)
  const history = useHistory()
  const params = new URLSearchParams(location.search)

  const initFetch = useCallback(
    qryString => {
      dispatch({
        type: 'document/FETCH_DOCUMENTS',
        payload: {
          qryString,
        },
      })
    },
    [dispatch],
  )

  const fetchDocuments = useCallback(() => {
    const queryStatus = params.get('status') || status
    const queryBusinessId = params.get('keyword') || businessId || legalId
    setStatus(queryStatus)
    setBusinessId(queryBusinessId)
    initFetch(
      qs.stringify({
        pageNo: location.query.pageNo || current,
        pageSize: location.query.pageSize || pageSize,
        status: queryStatus,
        keyword: queryBusinessId,
      }),
    )
  }, [initFetch, location.search, isRefreshVerificationDocuments])

  useEffect(() => {
    fetchDocuments()
  }, [fetchDocuments])

  useEffect(() => {
    if (documents?.data?.meta) {
      const { meta } = documents.data
      setCurrent(meta.pageNo)
      setPageSize(meta.pageSize)
      setTotal(meta.total)
      setDocumentsData(documents.data.documents)
    }
  }, [documents])

  const handleDocumentURL = (type, value) => {
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
      handleDocumentURL('status', value)
    }
    if (type === 'businessId') {
      setBusinessId(value)
      handleDocumentURL('keyword', value)
    }
  }

  const clearFilter = () => {
    params.delete('businessId')
    params.delete('pageNo')
    params.delete('pageSize')
    params.delete('status')
    history.push({ search: params.toString() })
    setBusinessId('')
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

  const closeModal = () => {
    setIsModalVisible(false)
  }

  const openModal = () => {
    setIsModalVisible(true)
  }

  const handleSubmittedDocument = async (documentId, finalStatus) => {
    await proceedWithSubmittedDocument(documentId, finalStatus)
      .then(res => {
        if (res.statusCode === 200) {
          notification.success({
            message: `Document ${
              finalStatus === 'verified'
                ? 'approved'
                : finalStatus === 'deleted'
                ? 'deleted'
                : 'rejected'
            } successfully.`,
          })
          fetchDocuments()
        } else {
          notification.error({
            message: res.message,
          })
        }
      })
      .catch(err => {
        notification.error({
          message: err && err?.message,
        })
      })
      .finally(() => {
        closeModal()
      })
  }

  const confirmSubmittedDocument = (documentId, finalStatus) => {
    confirm({
      title: `Are you sure you want to ${
        finalStatus === 'verified' ? 'approve' : finalStatus === 'deleted' ? 'delete' : 'reject'
      } this document?`,
      content: '',
      okText: 'Yes',
      okType: finalStatus === 'verified' || finalStatus === 'deleted' ? 'success' : 'danger',
      cancelText: 'No',
      onOk() {
        handleSubmittedDocument(documentId, finalStatus)
      },
      onCancel() {},
    })
  }

  const columns = getColumns(confirmSubmittedDocument)

  return (
    <div>
      {!legalId ? (
        <>
          <Helmet title="documents: List" />
          <div className="cui__utils__heading d-flex justify-content-between">
            <strong>Verification Center</strong>
            <Button type="primary" onClick={() => openModal()}>
              Request Document
            </Button>
          </div>
        </>
      ) : null}
      <div className="card">
        <div className={`card-header card-header-flex ${legalId ? 'd-none' : ''}`}>
          <div className="d-flex flex-column justify-content-center mr-auto w-100 w-100">
            <Filter
              handleFilterChange={handleFilterChange}
              clearFilter={clearFilter}
              key={resetFilter}
              qryString={qs.stringify({
                pageNo: current,
                pageSize,
                businessId,
                status,
              })}
              businessId={businessId}
              status={status}
            />
          </div>
        </div>

        <div className="card-body">
          <div className="text-nowrap">
            <Table
              columns={columns}
              dataSource={documentsData}
              loading={documents.loading}
              pageSize={pageSize}
              total={total}
              current={current}
              onPaginationChange={(currentPage, size) => onPaginationChange(currentPage, size)}
            />
          </div>
        </div>
      </div>
      <RequestDocument
        isModalVisible={isModalVisible}
        closeModal={closeModal}
        fetchDocuments={fetchDocuments}
      />
    </div>
  )
}

export default connect(mapStateToProps)(Index)
