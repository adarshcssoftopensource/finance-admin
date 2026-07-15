import React, { useEffect, useCallback, useState } from 'react'
import qs from 'qs'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { Modal as ReactModal, ModalBody, ModalHeader } from 'reactstrap'
import Table from 'components/app/table'
import getColumns from 'components/app/CommonTableFormatter/rewardTemplatesTableFormatter'
import Filter from 'pages/rewardTemplates/filter'
import ActionFilter from 'pages/rewardTemplates/filter/actionFilter'
import { useHistory } from 'react-router-dom'

const mapStateToProps = ({ rewardTemplates, dispatch, router }) => ({
  rewardTemplates,
  dispatch,
  router,
})

const RewardTemplates = ({
  dispatch,
  rewardTemplates: { rewardTemplates, rewardTemplate },
  router: { location },
}) => {
  const [current, setCurrent] = useState(1)
  const [status, setStatus] = useState('')
  const [keyword, setKeyword] = useState(null)
  const [pageSize, setPageSize] = useState(100)
  const [total, setTotal] = useState(100)
  const [rewardTemplateData, setRewardTemplateData] = useState([])
  const [resetFilter, setResetFilter] = useState(false)
  const [isEditRewardTemplateModalVisible, setIsEditRewardTemplateModalVisible] = useState(false)
  const [selectedRewardTemplate, setSelectedRewardTemplate] = useState({})
  const [selectedTemplatedId, setSelectedTemplatedId] = useState('')
  const history = useHistory()
  const params = new URLSearchParams(location.search)

  const initFetch = useCallback(
    qryString => {
      dispatch({
        type: 'rewardTemplates/FETCH_ALL_REWARD_TEMPLATES',
        payload: {
          qryString,
        },
      })
    },
    [dispatch],
  )

  const prepareString = () => {
    return qs.stringify({
      pageNo: location.query.pageNo || current,
      pageSize: location.query.pageSize || pageSize,
      status: params.get('status') || status,
      keyword: params.get('keywords') || keyword,
    })
  }

  useEffect(() => {
    if (location.query && location.query.userId) {
      initFetch(
        qs.stringify({
          pageNo: location.query.pageNo || current,
          pageSize: location.query.pageSize || pageSize,
          status,
          keyword,
        }),
      )
    } else {
      setStatus(params.get('status') || status)
      setKeyword(params.get('keywords') || null)
      initFetch(prepareString())
    }
  }, [initFetch, location.search])

  useEffect(() => {
    if (rewardTemplates && rewardTemplates.data && rewardTemplates.data.meta) {
      const { meta } = rewardTemplates.data
      setCurrent(meta.pageNo)
      setPageSize(meta.pageSize)
      setTotal(meta.total)
      setRewardTemplateData(rewardTemplates.data.rewardTemplates)
      closeRewardTemplateModal()
    }
  }, [rewardTemplates])

  useEffect(() => {
    if (rewardTemplate && rewardTemplate.data) {
      setSelectedRewardTemplate(rewardTemplate.data.rewardTemplate)
      setIsEditRewardTemplateModalVisible(true)
    }
  }, [rewardTemplate, rewardTemplate.data])

  const onPaginationChange = async (currentPage, pagesize) => {
    params.set('pageNo', currentPage)
    params.set('pageSize', pagesize)
    history.push({ search: params.toString() })
    await setCurrent(currentPage)
    await setPageSize(pagesize)
  }

  const handleUsersURL = (type, value) => {
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
    if (type === 'keywords') {
      setKeyword(value)
      handleUsersURL('keywords', value)
    } else {
      setStatus(value)
      handleUsersURL('status', value)
    }
  }

  const clearFilter = () => {
    params.delete('status')
    params.delete('keywords')
    params.delete('pageNo')
    params.delete('pageSize')
    history.push({ search: params.toString() })
    setStatus('')
    setKeyword(null)
    setResetFilter(!resetFilter)
  }

  const fetchRewardTemplateDetail = useCallback(
    templateId => {
      dispatch({
        type: 'rewardTemplates/FETCH_REWARD_TEMPLATE',
        templateId,
      })
    },
    [dispatch],
  )

  const closeRewardTemplateModal = () => {
    setIsEditRewardTemplateModalVisible(false)
  }

  const openRewardTemplateModal = templateId => {
    setSelectedTemplatedId(templateId)
    fetchRewardTemplateDetail(templateId)
  }

  const onEditRewardTemplate = requestData => {
    dispatch({
      type: 'rewardTemplates/EDIT_REWARD_TEMPLATE',
      templateId: selectedTemplatedId,
      data: {
        rewardType: requestData?.rewardType,
        frequency: requestData?.frequency,
        isActive: requestData?.isActive === 'true' ? 'true' : 'false',
        rewardPoints: requestData?.rewardPoints,
        holdingDays: requestData?.holdingDays,
        expireDays: requestData?.expireDays,
        subscriptionMultiplier: requestData?.subscriptionMultiplier,
        description: requestData?.description,
      },
    })
  }

  const columns = getColumns(openRewardTemplateModal)
  return (
    <div>
      <Helmet title="Reward Template: List" />
      <div className="cui__utils__heading">
        <strong>All Reward Templates</strong>
      </div>
      <div className="card">
        <div className="card-header card-header-flex">
          <div className="d-flex flex-column justify-content-center mr-auto w-100 w-100">
            <Filter
              handleFilterChange={handleFilterChange}
              clearFilter={clearFilter}
              key={resetFilter}
              keyword={keyword}
              status={status}
            />
          </div>
        </div>
        <div className="card-body">
          <div className="text-nowrap">
            <Table
              columns={columns}
              dataSource={rewardTemplateData}
              loading={rewardTemplates.loading}
              pageSize={pageSize}
              total={total}
              current={current}
              onPaginationChange={(currentPage, size) => onPaginationChange(currentPage, size)}
            />
          </div>
        </div>
      </div>
      <ReactModal
        isOpen={isEditRewardTemplateModalVisible}
        toggle={closeRewardTemplateModal}
        size="md"
      >
        <ModalHeader className="pt-3 pb-1" toggle={() => closeRewardTemplateModal()}>
          Edit Reward Template: {selectedRewardTemplate?.rewardName ?? ''}
        </ModalHeader>
        <ModalBody>
          <div className="d-flex flex-wrap justify-content-center">
            <ActionFilter
              onEditRewardTemplate={onEditRewardTemplate}
              editFormData={selectedRewardTemplate}
              disableSubmit={rewardTemplate.loading}
            />
          </div>
        </ModalBody>
      </ReactModal>
    </div>
  )
}

export default connect(mapStateToProps)(RewardTemplates)
