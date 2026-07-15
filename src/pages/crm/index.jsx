/* eslint-disable */
import React, { useEffect, useMemo, useRef, useState } from 'react'
import Form from '@rjsf/core'
import { Helmet } from 'react-helmet'
import { getCustomFilter, sendText } from '../../services/crm'
import { filterSchema } from '../business/view/PaymentOnboarding/onBoarding/common/ui-schema'
import { useDispatch, useSelector } from 'react-redux'
import actions from '../../redux/crm/actions'
import Table from '../../components/app/table'
import qs from 'qs'
import { getCRMColumns } from '../../components/app/CommonTableFormatter/userTableFormatter'
import EmailSendModal from './helper/emailSendModal'
import { Button } from 'antd'
import * as Notification from '../../services/showNotifications'

function Crm() {
  const [filterData, setFilterData] = useState()
  const [pageNo, setCurrentPageNo] = useState(1)
  const [pageSize, setPageSize] = useState(100)
  const [selectedFilter, setSelectedFilter] = useState({})
  const [modelState, setModalState] = useState(false)
  const [sendIsInProgress, setSendIsInProgress] = useState(false)
  const [selectedValues, setSelectedValues] = useState({ row: [], type: '' })
  const formRef = useRef()
  const dispatch = useDispatch()
  const {
    crmReducer: { userData: { loading, data: { meta = {}, users = [] } = {} } = {} } = {},
  } = useSelector(({ crmReducer }) => ({
    crmReducer,
  }))

  useEffect(() => {
    const fetchData = async () => {
      const filterResponse = await getCustomFilter()
      // debugger
      setFilterData(filterResponse?.data ?? {})

      dispatch({
        type: actions.FETCH_DATA_BY_FILTER,
        payload: {
          filter: {}, // Empty filter to fetch all data
          queryString: qs.stringify({
            pageNo: 1,
            pageSize,
          }),
        },
      })
    }
    fetchData()
  }, [dispatch, pageSize])

  const onSubmit = data => {
    setSelectedValues({ row: [], type: '' })
    setSelectedFilter(data.formData)
    setCurrentPageNo(1)
    dispatch({
      type: actions.FETCH_DATA_BY_FILTER,
      payload: {
        filter: data.formData,
        queryString: qs.stringify({
          pageNo: 1,
          pageSize,
        }),
      },
    })
  }

  const onPaginationChange = async (currentPage, pageSize) => {
    setCurrentPageNo(currentPage)
    setPageSize(pageSize)
    dispatch({
      type: actions.FETCH_DATA_BY_FILTER,
      payload: {
        filter: selectedFilter,
        queryString: qs.stringify({
          pageNo: currentPage,
          pageSize,
        }),
      },
    })
  }

  let columns = useMemo(() => {
    return getCRMColumns()
  }, [])

  const onSendText = message => {
    const payload = {
      ...selectedFilter,
      text: message,
      selectionType: selectedValues.type,
      userIds: selectedValues?.row,
      excludedIds: Object.keys(selectedValues?.excludedIds),
    }
    setSendIsInProgress(true)
    sendText(payload)
      .then(res => {
        if (res.statusCode !== 200) {
          Notification.showError(res.message)
        } else if (res.statusCode === 200) {
          Notification.showSuccess('Your request to sent a bulk messages has been queued')
        }
        setSendIsInProgress(false)
        setModalState(false)
      })
      .catch(err => {
        Notification.showError(err.message)
        setSendIsInProgress(false)
        setModalState(false)
      })
  }

  useEffect(() => {
    if (!loading && selectedValues?.type === 'all') {
      let allRow = [
        ...new Set([...(selectedValues?.row ?? []), ...(users?.map(value => value._id) ?? [])]),
      ]
      const excludedIds = selectedValues?.excludedIds ?? {}
      allRow = allRow.filter(value => {
        return !excludedIds[value]
      })
      setSelectedValues({
        ...selectedValues,
        row: allRow,
        excludedIds: selectedValues?.excludedIds,
      })
    }
  }, [loading])

  const rowSelection = {
    type: 'checkbox',
    selectedRowKeys: selectedValues.row,
    preserveSelectedRowKeys: true,
    onChange: (selectedRowKeys, selectedRows, { type } = {}) => {
      let updatedType = type
      let excludedIds = {}
      if (selectedValues.type === 'all' && type === 'single' && meta.total > pageSize) {
        updatedType = 'all'
        let existedKeyObj = {}
        selectedRowKeys.forEach(value => {
          existedKeyObj[value] = true
        })

        selectedValues.row.forEach(value => {
          if (!existedKeyObj[value]) {
            excludedIds[value] = true
          }
        })
      }
      setSelectedValues({ row: selectedRowKeys, type: updatedType, excludedIds })
    },
  }

  function customValidate(formData, errors) {
    if (formData?.filter) {
      if (formData.filter.createdAtStart && formData.filter.createdAtEnd) {
        const startDate = new Date(formData.filter.createdAtStart)
        const endDate = new Date(formData.filter.createdAtEnd)

        if (isNaN(startDate.getTime())) {
          console.log('Invalid start date')
          errors.filter.createdAtStart.addError('Invalid start date')
        }
        if (isNaN(endDate.getTime())) {
          errors.filter.createdAtEnd.addError('Invalid end date')
        }
        if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime()) && startDate > endDate) {
          errors.filter.createdAtStart.addError('Start date cannot be after end date')
          errors.filter.createdAtEnd.addError('End date cannot be before start date')
        }
      }
    }

    // Validate business filter dates
    if (formData?.business) {
      if (formData.business.createdAtStart && formData.business.createdAtEnd) {
        const startDate = new Date(formData.business.createdAtStart)
        const endDate = new Date(formData.business.createdAtEnd)

        if (isNaN(startDate.getTime())) {
          errors.business.createdAtStart.addError('Invalid start date')
        }
        if (isNaN(endDate.getTime())) {
          errors.business.createdAtEnd.addError('Invalid end date')
        }
        if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime()) && startDate > endDate) {
          errors.business.createdAtStart.addError('Start date cannot be after end date')
          errors.business.createdAtEnd.addError('End date cannot be before start date')
        }
      }
    }

    // Validate session filter dates
    if (formData?.session) {
      if (formData.session.createdAtStart && formData.session.createdAtEnd) {
        const startDate = new Date(formData.session.createdAtStart)
        const endDate = new Date(formData.session.createdAtEnd)

        if (isNaN(startDate.getTime())) {
          errors.session.createdAtStart.addError('Invalid start date')
        }
        if (isNaN(endDate.getTime())) {
          errors.session.createdAtEnd.addError('Invalid end date')
        }
        if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime()) && startDate > endDate) {
          errors.session.createdAtStart.addError('Start date cannot be after end date')
          errors.session.createdAtEnd.addError('End date cannot be before start date')
        }
      }
    }

    return errors
  }

  return (
    <div>
      <Helmet title="CRM" />
      <div className="cui__utils__heading"></div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ width: '20%' }} ref={me => (formRef.current = me)}>
          {filterData ? (
            <Form
              schema={filterData}
              uiSchema={filterSchema}
              noValidate={false}
              showErrorList={false}
              formData={selectedFilter}
              onSubmit={onSubmit}
              validate={customValidate}
              liveValidate={true}
            >
              <button type="submit" className="btn btn-info">
                Submit
              </button>
              &nbsp;&nbsp;
              <button
                type="submit"
                className="btn btn-default"
                onClick={() => {
                  setSelectedFilter({})
                }}
              >
                Reset
              </button>
            </Form>
          ) : null}
        </div>
        <div
          style={{
            flexGrow: 1,
            padding: '0 30px',
            width: '80%',
          }}
        >
          <div>
            <Button
              type="primary"
              style={{ marginLeft: 'auto', marginBottom: '10px' }}
              onClick={() => {
                setModalState(true)
              }}
              disabled={(selectedValues?.row?.length ?? 0) <= 0}
            >
              Send message
            </Button>
          </div>
          <Table
            columns={columns}
            rowSelection={rowSelection}
            dataSource={users}
            loading={loading}
            pageSize={pageSize}
            total={meta.total}
            current={pageNo}
            scroll={{ y: formRef.current?.clientHeight }}
            onPaginationChange={(currentPage, size) => onPaginationChange(currentPage, size)}
          />
        </div>
        <EmailSendModal
          isOpen={modelState}
          closeModel={setModalState}
          onSubmit={onSendText}
          isInProgress={sendIsInProgress}
        />
      </div>
    </div>
  )
}

export default Crm
