import React, { useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import qs from 'qs'
import Card from '../../card'
import Title from '../title'
import Table from '../../table'
import getColumns from '../../CommonTableFormatter/userSessionTableFormatter'

const mapStateToProps = ({ allUsers, dispatch }) => {
  return {
    allUsers,
    dispatch,
  }
}

const UserSessions = ({
  dispatch,
  data,
  allUsers: { userSession: { loading = false, allUserSession = [], meta = {} } = {} } = {},
}) => {
  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [total, setTotal] = useState(100)
  const [sessionData, setSessionData] = useState([])

  const initFetch = useCallback(
    (qryString, userId) => {
      dispatch({
        type: 'user/FETCH_USER_SESSION',
        payload: {
          userId,
          qryString,
        },
      })
    },
    [dispatch],
  )

  const onPaginationChange = async (currentPage, pagesize) => {
    await setCurrent(currentPage)
    await setPageSize(pagesize)
  }

  useEffect(() => {
    if (allUserSession && meta.pageNo && meta.pageSize && meta.total) {
      setCurrent(meta.pageNo)
      setPageSize(meta.pageSize)
      setTotal(meta.total)
      setSessionData(allUserSession)
    }
  }, [allUserSession.length, meta.pageNo, meta.pageSize, meta.total])

  useEffect(() => {
    // eslint-disable-next-line no-underscore-dangle
    if (data._id !== undefined) {
      // eslint-disable-next-line no-underscore-dangle
      initFetch(qs.stringify({ pageNo: current, pageSize }), data._id)
    }
  }, [initFetch, current, pageSize])

  const signeOutUser = sessionId => {
    dispatch({
      type: 'user/SIGN_OUT_SESSION',
      payload: {
        sessionId,
        // eslint-disable-next-line no-underscore-dangle
        userId: data._id,
        sessionPayload: {
          type: 'single',
          payload: {
            status: 'expired',
            isDeleted: true,
          },
        },
        qryString: qs.stringify({ pageNo: current, pageSize }),
      },
    })
  }

  const columns = getColumns(signeOutUser)
  return (
    <div>
      <Card>
        <Title>User sessions</Title>
        <div className="text-nowrap">
          <Table
            columns={columns}
            dataSource={sessionData}
            pageSize={pageSize}
            loading={loading}
            total={total}
            current={current}
            onPaginationChange={(currentPage, size) => onPaginationChange(currentPage, size)}
          />
        </div>
      </Card>
    </div>
  )
}

export default connect(mapStateToProps)(UserSessions)
