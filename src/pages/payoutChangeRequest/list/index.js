import React, { useEffect, useCallback, useState } from 'react'
import qs from 'qs'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { Modal, Spin, Button, Input } from 'antd'
import { Modal as ReactModal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap'
import Table from 'components/app/table'
import getColumns from 'components/app/CommonTableFormatter/payoutChangeRequestsDataTableFormatter'
import Filter from 'pages/payoutChangeRequest/filter'
import { useHistory } from 'react-router-dom'
import StripeRaw from '../../../components/app/detailsComponents/stripeRaw'

/* eslint-disable */

const mapStateToProps = ({ payoutChangeRequest, dispatch, router }) => ({
  payoutChangeRequest,
  dispatch,
  router,
})

const Index = ({
  dispatch,
  payoutChangeRequest: { payoutChangeRequests, payoutChangeRequest, loading },
  router: { location },
  isBusinessView,
  businessId,
}) => {
  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(100)
  const [total, setTotal] = useState(100)
  const [payoutChangeRequestsData, setPayoutChangeRequestsData] = useState([])
  const [status, setStatus] = useState('')
  const [resetFilter, setResetFilter] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [keyword, setKeyword] = useState(businessId || null)
  const [modalContent, setModalContent] = useState(null)
  const [selectedRowData, setSelectedRowData] = useState(null)
  const [rejectPayoutRequestReason, setRejectPayoutRequestReason] = useState('')
  const [rejectPayoutRequestModalVisible, setRejectPayoutRequestModalVisible] = useState(false)
  const history = useHistory()
  const params = new URLSearchParams(location.search)

  const initFetch = useCallback(
    qryString => {
      dispatch({
        type: 'payoutChangeRequest/FETCH_PAYOUT_CHANGE_REQUESTS',
        payload: {
          qryString,
        },
      })
    },
    [dispatch],
  )

  useEffect(() => {
    const queryStatus = params.get('status') || status
    const queryKeyword = params.get('keywords') || keyword
    setStatus(queryStatus)
    setKeyword(queryKeyword)
    initFetch(
      qs.stringify({
        pageNo: location.query.pageNo || current,
        pageSize: location.query.pageSize || pageSize,
        status: queryStatus,
        keywords: queryKeyword,
      }),
    )
  }, [initFetch, location.search])

  useEffect(() => {
    if (payoutChangeRequests && payoutChangeRequests.data) {
      const { meta } = payoutChangeRequests.data
      setCurrent(meta.pageNo)
      setPageSize(meta.pageSize)
      setTotal(meta.total)
      setPayoutChangeRequestsData(payoutChangeRequests.data.payoutChangeRequests)
      closeModal()
    }
  }, [payoutChangeRequests])

  useEffect(() => {
    if (payoutChangeRequest && payoutChangeRequest.data) {
      setModalContent(payoutChangeRequest.data.payoutChangeRequest)
    }
  }, [payoutChangeRequest])

  const handlePayoutChangeRequestURL = (type, value) => {
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
      handlePayoutChangeRequestURL('status', value)
    }
    if (type === 'keywords') {
      setKeyword(value)
      handlePayoutChangeRequestURL('keywords', value)
    }
  }

  const clearFilter = () => {
    params.delete('status')
    params.delete('pageNo')
    params.delete('pageSize')
    params.delete('keywords')
    history.push({ search: params.toString() })
    setStatus('')
    setKeyword('')
    setResetFilter(!resetFilter)
  }

  const onPaginationChange = async (currentPage, pagesize) => {
    params.set('pageNo', currentPage)
    params.set('pageSize', pagesize)
    history.push({ search: params.toString() })
    setCurrent(currentPage)
    setPageSize(pagesize)
  }

  const handlePayoutRequestStatusChange = async (requestId, requestData) => {
    dispatch({
      type: 'payoutChangeRequest/UPDATE_PAYOUT_CHANGE_REQUEST',
      payload: {
        requestId,
        requestData,
        keywords: keyword,
      },
    })
  }

  const getPayoutRequest = async requestId => {
    dispatch({
      type: 'payoutChangeRequest/FETCH_PAYOUT_CHANGE_REQUEST',
      payload: {
        requestId,
      },
    })
  }

  const onRequestApprove = async row => {
    setSelectedRowData(row)
    await getPayoutRequest(row._id)
    setIsModalVisible(true)
  }

  const showRequestRejectConfirmModal = row => {
    setRejectPayoutRequestModalVisible(true)
    setSelectedRowData(row)
  }

  const onRequestReject = async row => {
    handleRejectPayoutRequestModalCancel()
    handlePayoutRequestStatusChange(row._id, {
      status: 'rejected',
      businessId: row.business.id,
      reason: rejectPayoutRequestReason,
    })
  }

  const handleDeleteReasonChange = event => {
    setRejectPayoutRequestReason(event.target.value)
  }

  const handleRejectPayoutRequestModalCancel = () => {
    setRejectPayoutRequestModalVisible(false)
    setSelectedRowData(null)
    setRejectPayoutRequestReason('')
  }

  const closeModal = () => {
    setIsModalVisible(false)
    setModalContent(null)
    setSelectedRowData(null)
  }

  const columns = getColumns(onRequestApprove, showRequestRejectConfirmModal)

  return (
    <div>
      {!isBusinessView && (
        <>
          <Helmet title="Payout Change Requests: List" />
          <div className="cui__utils__heading">
            <strong>Payout change requests</strong>
          </div>
        </>
      )}
      <div className="card">
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
                  keywords: keyword,
                })}
                status={status}
              />
            </div>
          </div>
        )}
        <div className={!isBusinessView ? 'card-body' : ''}>
          <div className="text-nowrap">
            <Table
              columns={columns}
              dataSource={payoutChangeRequestsData}
              loading={payoutChangeRequests.loading}
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
          Approve payout request
        </ModalHeader>
        <ModalBody>
          <div className="d-flex flex-wrap justify-content-center">
            <Spin
              spinning={payoutChangeRequest?.loading || payoutChangeRequests.loading || loading}
              delay={500}
            >
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
            </Spin>
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
                  disabled={payoutChangeRequest?.loading || payoutChangeRequests.loading || loading}
                  onClick={() =>
                    handlePayoutRequestStatusChange(selectedRowData._id, {
                      status: 'approved',
                      businessId: selectedRowData.business.id,
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
        title="Reject Payout Request"
        visible={rejectPayoutRequestModalVisible}
        onOk={() => onRequestReject(selectedRowData)}
        okText="Confirm"
        onCancel={handleRejectPayoutRequestModalCancel}
      >
        <p>Are you sure you want to Reject this payout request?</p>
        <div>
          <span className="filter-label">Payout Request Reject Reason</span>
          <Input
            className="mb-2"
            value={rejectPayoutRequestReason}
            onChange={e => handleDeleteReasonChange(e)}
          />
        </div>
      </Modal>
    </div>
  )
}

export default connect(mapStateToProps)(Index)
