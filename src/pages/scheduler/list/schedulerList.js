import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { Button } from 'antd'
import Table from '../../../components/app/table'
import { getColumns } from '../../../components/app/CommonTableFormatter/schedulerTableFormatter'
import actions from '../../../redux/scheduler/actions'

import SchedulerModal from '../helper/schedulerModal'

const SchedulerList = ({ dispatch, loading, schedulers }) => {
  const [modalState, setModalState] = useState({
    type: '',
    selectedRecord: {},
    isOpen: false,
  })

  useEffect(() => {
    dispatch({ type: actions.FETCH_ALL_SCHEDULERS })
  }, [dispatch])

  const handleSchedulerModal = (type = '', selectedRecord = {}, isOpen = false) => {
    setModalState({ type, selectedRecord, isOpen })
  }

  const handleAddScheduler = formData => {
    dispatch({ type: actions.ADD_SCHEDULER, payload: { data: formData } })
    handleSchedulerModal()
  }

  const handleEditScheduler = formData => {
    const { selectedRecord } = modalState
    dispatch({
      type: actions.EDIT_SCHEDULER,
      payload: {
        // eslint-disable-next-line no-underscore-dangle
        id: selectedRecord._id,
        data: formData,
      },
    })
    handleSchedulerModal()
  }

  const columns = getColumns(handleSchedulerModal)
  return (
    <div>
      <Helmet title="Reward Template: List" />
      <div className="cui__utils__heading">
        <strong>All Scheduler</strong>
      </div>
      <div className="card">
        <div className="card-header card-header-flex">
          <div className="d-flex flex-column justify-content-center mr-auto w-100 w-100">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto' }}>
              <Button
                type="primary"
                className="mr-4"
                onClick={() => {
                  handleSchedulerModal('add', {}, true)
                }}
              >
                Add Scheduler
              </Button>
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="text-nowrap">
            <Table
              columns={columns}
              dataSource={schedulers}
              loading={loading}
              total={schedulers?.length}
              defaultPagination
            />
          </div>
          {modalState.isOpen && (
            <SchedulerModal
              handleSchedulerModal={handleSchedulerModal}
              handleAddScheduler={handleAddScheduler}
              handleEditScheduler={handleEditScheduler}
              {...modalState}
            />
          )}
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = ({ schedulersReducer, dispatch }) => {
  const { loading, schedulers } = schedulersReducer
  return {
    dispatch,
    loading,
    schedulers,
  }
}

export default connect(mapStateToProps)(SchedulerList)
