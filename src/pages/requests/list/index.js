/* eslint-disable */
import React, { useEffect, useCallback, useState } from 'react'
import qs from 'qs'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Modal, Spin, Button, Input, Tabs } from 'antd'
import { Modal as ReactModal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap'
import Table from 'components/app/table'
import getColumns from 'components/app/CommonTableFormatter/requestsDataTableFormatter'
import Filter from 'pages/requests/filter'
import ActionFilter from 'pages/requests/filter/actionFilter'
import StripeRaw from '../../../components/app/detailsComponents/stripeRaw'
import Loader from 'components/app/Loader'
import style from '../style.module.scss'

const { TabPane } = Tabs

const mapStateToProps = ({ allRequests, dispatch, router }) => ({
  allRequests,
  dispatch,
  router,
})

const Index = ({
  dispatch,
  allRequests: { allRequests, request, loading },
  router: { location },
  isBusinessView,
  businessId,
}) => {
  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(100)
  const [total, setTotal] = useState(100)
  const [requestsData, setRequestsData] = useState([])
  const [status, setStatus] = useState('pending')
  const [requestType, setRequestType] = useState('')
  const [resetFilter, setResetFilter] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [keyword, setKeyword] = useState(businessId || null)
  const [modalContent, setModalContent] = useState(null)
  const [selectedRowData, setSelectedRowData] = useState(null)
  const [rejectRequestReason, setRejectRequestReason] = useState('')
  const [rejectPayoutRequestModalVisible, setRejectRequestModalVisible] = useState(false)
  const [selectedRequests, setSelectedRequests] = useState({
    selectedRowsKeys: [],
    selectedRows: [],
  })
  const [isBulkUpdateModalVisible, setIsBulkUpdateModalVisible] = useState(false)
  const history = useHistory()
  const params = new URLSearchParams(location.search)
  const [editMessageModalVisible, setEditMessageModalVisible] = useState(false)
  const [editMessageValue, setEditMessageValue] = useState('')
  const [securityCode, setSecurityCode] = useState('')

  const initFetch = useCallback(
    qryString => {
      dispatch({
        type: 'request/FETCH_ALL_REQUESTS',
        payload: {
          qryString,
        },
      })
    },
    [dispatch],
  )

  useEffect(() => {
    const queryStatus = params.get('status') || status
    const queryRequestType = params.get('requestType') || requestType
    const queryKeyword = params.get('keywords') || keyword
    setStatus(queryStatus)
    setRequestType(queryRequestType)
    setKeyword(queryKeyword)
    initFetch(
      qs.stringify({
        pageNo: location.query.pageNo || current,
        pageSize: location.query.pageSize || pageSize,
        status: queryStatus,
        requestType: queryRequestType,
        keywords: queryKeyword,
      }),
    )
  }, [initFetch, location.search])

  useEffect(() => {
    if (allRequests && allRequests.data) {
      const { meta } = allRequests.data
      setCurrent(meta.pageNo)
      setPageSize(meta.pageSize)
      setTotal(meta.total)
      setRequestsData(allRequests.data.allRequests)
      closeModal()
      closeBulkUpdateModal()
      setSelectedRequests({ selectedRowsKeys: [], selectedRows: [] })
    }
  }, [allRequests])

  useEffect(() => {
    if (request && request.data) {
      setModalContent(request.data.request)
    }
  }, [request])

  const handleRequestURL = (type, value) => {
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
      handleRequestURL('status', value)
    }
    if (type === 'requestType') {
      setRequestType(value)
      handleRequestURL('requestType', value)
    }
    if (type === 'keywords') {
      setKeyword(value)
      handleRequestURL('keywords', value)
    }
  }

  const clearFilter = () => {
    params.delete('pageNo')
    params.delete('pageSize')
    params.delete('keywords')
    params.delete('requestType')
    history.push({ search: params.toString() })
    setKeyword('')
    setRequestType('')
    setResetFilter(!resetFilter)
  }

  const onPaginationChange = async (currentPage, pagesize) => {
    params.set('pageNo', currentPage)
    params.set('pageSize', pagesize)
    history.push({ search: params.toString() })
    setCurrent(currentPage)
    setPageSize(pagesize)
  }

  const handleRequestStatusChange = async (requestId, requestData) => {
    dispatch({
      type: 'request/UPDATE_SINGLE_REQUEST',
      payload: {
        requestId,
        requestData,
        keywords: keyword,
      },
    })
  }

  const getSingleRequest = async requestId => {
    dispatch({
      type: 'request/FETCH_SINGLE_REQUEST',
      payload: {
        requestId,
      },
    })
  }

  const onEditMessageClick = row => {
    setSelectedRowData(row)
    setEditMessageValue(row.requestData?.message || '')
    setEditMessageModalVisible(true)
  }

  const handleSaveEditedMessage = async () => {
    if (!editMessageValue?.trim()) return

    dispatch({
      type: 'request/UPDATE_MESSAGE_REQUEST',
      payload: {
        requestId: selectedRowData._id,
        requestData: { message: editMessageValue },
        keywords: keyword,
      },
    })

    setEditMessageModalVisible(false)
    setSelectedRowData(null)
    setEditMessageValue('')
  }

  const handleCancelEditMessage = () => {
    setEditMessageModalVisible(false)
    setSelectedRowData(null)
    setEditMessageValue('')
  }

  const onRequestApprove = async row => {
    setSelectedRowData(row)
    await getSingleRequest(row._id)
    setIsModalVisible(true)
  }

  const showRequestRejectConfirmModal = row => {
    setRejectRequestModalVisible(true)
    setSelectedRowData(row)
  }

  const onRequestReject = async row => {
    handleRejectRequestModalCancel()
    handleRequestStatusChange(row._id, {
      status: 'rejected',
      businessId: row.business.id,
      reason: rejectRequestReason,
    })
  }

  const handleDeleteReasonChange = event => {
    setRejectRequestReason(event.target.value)
  }

  const handleRejectRequestModalCancel = () => {
    setRejectRequestModalVisible(false)
    setSelectedRowData(null)
    setRejectRequestReason('')
  }

  const closeModal = () => {
    setIsModalVisible(false)
    setModalContent(null)
    setSelectedRowData(null)
    setSecurityCode('')
  }

  const tabChange = tab => {
    setStatus(tab)
    params.set('status', tab)
    history.push({ search: params.toString() })
    setSelectedRequests({ selectedRowsKeys: [], selectedRows: [] })
  }

  const onBulkUpdateClick = () => {
    setIsBulkUpdateModalVisible(true)
  }

  const closeBulkUpdateModal = () => {
    setIsBulkUpdateModalVisible(false)
  }

  const onBulkUpdateStatus = async ({ requestStatus, rejectRequestReason, securityCode }) => {
    const requests = selectedRequests?.selectedRows?.map(row => {
      return {
        id: row?._id,
        businessId: row?.business?.id,
      }
    })

    const payload = {
      requestData: {
        status: requestStatus,
        allRequests: requests,
        reason: rejectRequestReason,
        securityCode: securityCode,
      },
      keywords: keyword,
    }
    await dispatch({
      type: 'request/UPDATE_BULK_REQUEST',
      payload: payload,
    })
  }

  const columns = getColumns(onRequestApprove, showRequestRejectConfirmModal, onEditMessageClick)

  const rowSelection = {
    selectedRowKeys: selectedRequests?.selectedRowsKeys ?? [],
    onChange: (selectedRowsKeys, selectedRows) => {
      setSelectedRequests({ selectedRowsKeys, selectedRows })
    },
    renderCell: (checked, record, index, originNode) => {
      if (record.status !== 'pending') return null
      return originNode
    },
    getCheckboxProps: record => ({
      disabled: record.status !== 'pending',
    }),
  }

  return (
    <div>
      {!isBusinessView && (
        <>
          <Helmet title="Requests: List" />
          <div className="cui__utils__heading">
            <strong>All Requests</strong>
          </div>
        </>
      )}
      <div className="card">
        <Tabs
          onChange={tabChange}
          activeKey={status.toString() || 'pending'}
          className={`${style.tabs} kit-tabs-bordered`}
          defaultActiveKey="1"
        >
          <TabPane tab="Pending" key="pending"></TabPane>
          <TabPane tab="Approved" key="approved"></TabPane>
          <TabPane tab="Rejected" key="rejected"></TabPane>
        </Tabs>
        {!isBusinessView && (
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
                  requestType,
                  keywords: keyword,
                })}
                requestType={requestType}
                onBulkUpdateClick={onBulkUpdateClick}
                isBulkUpdateDisabled={
                  (selectedRequests?.selectedRowsKeys?.length ?? 0) <= 0 || loading
                }
                allowBulkUpdate={!status.toString() || status.toString() === 'pending'}
              />
            </div>
          </div>
        )}
        <div className={!isBusinessView ? 'card-body' : ''}>
          <div className="text-nowrap">
            <Table
              rowSelection={
                !status.toString() || status.toString() === 'pending'
                  ? {
                      type: 'checkbox',
                      ...rowSelection,
                    }
                  : null
              }
              columns={columns}
              dataSource={requestsData}
              loading={allRequests.loading}
              pageSize={pageSize}
              total={total}
              current={current}
              onPaginationChange={(currentPage, size) => onPaginationChange(currentPage, size)}
            />
          </div>
        </div>
      </div>
      <ReactModal isOpen={isBulkUpdateModalVisible} toggle={closeBulkUpdateModal} size="md">
        <ModalHeader className="pt-3 pb-1" toggle={() => closeBulkUpdateModal()}>
          Bulk Update Request Status
        </ModalHeader>
        <ModalBody>
          <div className="d-flex flex-wrap justify-content-center">
            <ActionFilter onBulkUpdateStatus={onBulkUpdateStatus} disableSubmit={loading} />
          </div>
        </ModalBody>
      </ReactModal>
      <ReactModal isOpen={isModalVisible} toggle={closeModal} size="md">
        <ModalHeader className="pt-3 pb-1" toggle={() => closeModal()}>
          <div className="d-flex justify-content-between align-items-center w-100">
            <span>
              {selectedRowData?.requestType === 'message'
                ? 'Message Blast Request'
                : 'Approve Request'}
            </span>
          </div>
        </ModalHeader>
        <ModalBody>
          <div
            className={`d-flex flex-wrap ${
              modalContent?.previousAccount ? 'justify-content-center' : ''
            }`}
          >
            <Loader spinning={request?.loading || allRequests.loading || loading}>
              <div className="w-100">
                {(modalContent?.requestData?.refundAmount || modalContent?.refundAmount) && (
                  <div className="ml-2">
                    <p>
                      <strong>Refund Amount:</strong>{' '}
                      {modalContent?.requestData?.refundAmount || modalContent?.refundAmount}
                    </p>
                    <p>
                      <strong>Include Processing Fee:</strong>{' '}
                      {modalContent?.requestData?.includeProcessingFee ??
                      modalContent?.includeProcessingFee
                        ? 'Yes'
                        : 'No'}
                    </p>
                    {(modalContent?.requestData?.reason || modalContent?.reason) && (
                      <p>
                        <strong>Reason:</strong>{' '}
                        {modalContent?.requestData?.reason || modalContent?.reason}
                      </p>
                    )}
                    {(modalContent?.requestData?.notes || modalContent?.notes) && (
                      <p>
                        <strong>Notes:</strong>{' '}
                        {modalContent?.requestData?.notes || modalContent?.notes}
                      </p>
                    )}
                  </div>
                )}
                {(modalContent?.previousAccount || modalContent?.currentAccount) && (
                  <>
                    <div className="mt-4">
                      {modalContent && modalContent?.previousAccount ? (
                        <StripeRaw
                          data={JSON.stringify(modalContent?.previousAccount)}
                          title="Previous Account"
                        />
                      ) : null}
                    </div>
                    <div className="mt-4">
                      {modalContent && modalContent?.currentAccount ? (
                        <StripeRaw
                          data={JSON.stringify(modalContent?.currentAccount)}
                          title="Current Account"
                        />
                      ) : null}
                    </div>
                  </>
                )}
                {(modalContent?.requestData?.message || modalContent?.message) && (
                  <div className="ml-2">
                    {selectedRowData?.requestType === 'message' && (
                      <div className="mb-3 p-3 bg-light rounded shadow-sm border">
                        <h6 className="text-primary mb-2">
                          {selectedRowData.requestData?.title || 'No Title'}
                        </h6>
                        <p className="mb-2" style={{ whiteSpace: 'pre-wrap', fontSize: '1.1em' }}>
                          {modalContent?.requestData?.message || modalContent.message}
                        </p>
                        <hr className="my-2" />
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <span className="text-muted">
                            Recipients:{' '}
                            <strong>{modalContent?.requestData?.recipientsCount || 0}</strong>
                          </span>
                          {modalContent?.requestData?.processed && (
                            <span className="text-success font-weight-bold">
                              Sent: {modalContent?.requestData?.processedCount || 0}
                              {modalContent?.requestData?.failedCount > 0 && (
                                <span className="text-danger ml-2">
                                  (Failed: {modalContent?.requestData.failedCount})
                                </span>
                              )}
                            </span>
                          )}
                          {modalContent?.requestData?.isProcessing && (
                            <div className="text-primary d-flex align-items-center">
                              <Spin size="small" className="mr-2" />
                              <span className="italic">
                                Processing... ({modalContent?.requestData?.processedCount || 0}{' '}
                                sent)
                              </span>
                            </div>
                          )}
                        </div>

                        {modalContent?.adminName && (
                          <div className="mb-3 p-2 bg-light rounded border">
                            <span className="text-muted">Processed By:</span>{' '}
                            <strong>{modalContent.adminName}</strong>
                          </div>
                        )}

                        {modalContent?.requestData?.deliveryLogs?.length > 0 && (
                          <div className="mt-3">
                            <h6 className="text-muted mb-2">Delivery Report</h6>
                            <div
                              className="border rounded p-2 bg-white"
                              style={{ maxHeight: '200px', overflowY: 'auto', fontSize: '0.85rem' }}
                            >
                              <table className="table table-sm mb-0">
                                <thead>
                                  <tr>
                                    <th>Recipient</th>
                                    <th>Status</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {modalContent.requestData.deliveryLogs.map((log, idx) => (
                                    <tr key={idx}>
                                      <td>
                                        <div>{log.customerName}</div>
                                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                                          {log.phone}
                                        </div>
                                      </td>
                                      <td>
                                        {log.status === 'sent' ? (
                                          <span className="text-success">Sent</span>
                                        ) : (
                                          <Tooltip title={log.error}>
                                            <span className="text-danger">Failed</span>
                                          </Tooltip>
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    {selectedRowData?.requestType !== 'message' && (
                      <>
                        <p>
                          <strong>Message:</strong>
                        </p>
                        <p>{modalContent?.requestData?.message || modalContent.message}</p>
                      </>
                    )}
                  </div>
                )}
                {(modalContent?.requestData?.paymentId || modalContent?.paymentId) && (
                  <div className="ml-2 border-top pt-2 mt-2">
                    <h5 className="mb-3 text-danger">Oversized Transaction Review</h5>
                    <p>
                      <strong>Amount:</strong>{' '}
                      {modalContent?.requestData?.amount || modalContent?.amount}
                    </p>
                    <p>
                      <strong>Payment ID:</strong>{' '}
                      {modalContent?.requestData?.paymentId || modalContent?.paymentId}
                    </p>
                    {modalContent?.payment && (
                      <div className="mt-2 p-2 bg-light border rounded">
                        <p className="mb-1">
                          <strong>Payment Method:</strong> {modalContent.payment.method}
                        </p>
                        {modalContent.payment.card && (
                          <p className="mb-1">
                            <strong>Card:</strong> {modalContent.payment.card.type} (****{' '}
                            {modalContent.payment.card.number})
                          </p>
                        )}
                        <p className="mb-0">
                          <strong>Customer:</strong>{' '}
                          {modalContent.payment.customer?.customerName ||
                            modalContent.payment.customer?.email}
                        </p>
                      </div>
                    )}
                  </div>
                )}
                {selectedRowData?.requestType === 'message' && (
                  <div className="mt-3 ml-2 border-top pt-3">
                    <label className="font-weight-bold mb-2">Security Code</label>
                    <Input
                      placeholder="Enter security code to approve message blast"
                      value={securityCode}
                      onChange={e => setSecurityCode(e.target.value)}
                      size="large"
                      style={{ border: '1px solid #d9d9d9' }}
                    />
                    <small className="text-muted d-block mt-1">
                      Required for mass communication approval.
                    </small>
                  </div>
                )}
              </div>
            </Loader>
          </div>
        </ModalBody>
        <ModalFooter className="d-block">
          <div className="text-right mt-3 mb-3">
            {
              <>
                <Button type="default" onClick={() => closeModal()}>
                  Cancel
                </Button>
                &nbsp;&nbsp;
                <Button
                  type="primary"
                  disabled={
                    request?.loading ||
                    allRequests.loading ||
                    loading ||
                    (selectedRowData?.requestType === 'message' && !securityCode)
                  }
                  onClick={() =>
                    handleRequestStatusChange(selectedRowData._id, {
                      status: 'approved',
                      businessId: selectedRowData.business.id,
                      securityCode: securityCode,
                    })
                  }
                >
                  Confirm
                </Button>
              </>
            }
          </div>
        </ModalFooter>
      </ReactModal>
      <Modal
        title="Edit Request Message"
        visible={editMessageModalVisible}
        onOk={handleSaveEditedMessage}
        okText="Save"
        onCancel={handleCancelEditMessage}
      >
        <div>
          <span className="filter-label">Message</span>
          <Input.TextArea
            rows={4}
            value={editMessageValue}
            onChange={e => setEditMessageValue(e.target.value)}
          />
        </div>
      </Modal>
      <Modal
        title="Reject Payout Request"
        visible={rejectPayoutRequestModalVisible}
        onOk={() => onRequestReject(selectedRowData)}
        okText="Confirm"
        onCancel={handleRejectRequestModalCancel}
      >
        <Loader spinning={request?.loading || allRequests.loading || loading} tip="Processing...">
          <p>Are you sure you want to Reject this request?</p>
          <div>
            <span className="filter-label">Request Reject Reason</span>
            <Input
              className="mb-2"
              value={rejectRequestReason}
              onChange={e => handleDeleteReasonChange(e)}
            />
          </div>
        </Loader>
      </Modal>
    </div>
  )
}

export default connect(mapStateToProps)(Index)
