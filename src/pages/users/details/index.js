/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useCallback, useState } from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { Button, Spin, Switch } from 'antd'
import UserDetails from 'components/app/detailsComponents/userDetails'

const DISABLE_VERIFICATION_SWITCH_STATUSES = ['approved', 'submitted', 'rejected']

const mapStateToProps = ({ allUsers, dispatch, router }) => ({
  allUsers,
  dispatch,
  router,
})
const UserDetailContainer = ({ dispatch, router: { location }, allUsers: { user, userNote } }) => {
  const [data, setData] = useState({})
  const [isVerificationRequested, setIsVerificationRequested] = useState(false)
  const [noteDescription, setNoteDescription] = useState(null)

  const initFetch = useCallback(
    userId => {
      dispatch({
        type: 'users/FETCH_USER_USER',
        payload: {
          userId,
        },
      })
    },
    [dispatch],
  )

  const handleAssumeUser = () => {
    dispatch({
      type: 'user/Assume_USER',
      payload: splitId(),
    })
  }

  useEffect(() => {
    const userId = splitId()
    initFetch(userId)
  }, [initFetch])
  const splitId = () => location.pathname.split('/users/')[1]

  useEffect(() => {
    if (user && user.data) {
      setData(user.data.user)
      if (user?.data?.user?.identityVerification?.status === 'required') {
        setIsVerificationRequested(true)
      }
    }
  }, [user, user.data])

  const handleSaveNotes = () => {
    dispatch({
      type: 'users/ADD_USERS_NOTES',
      payload: {
        userId: splitId(),
        notes: {
          notes: {
            description: noteDescription,
          },
        },
      },
    })
    setNoteDescription(null)
  }

  const handleRequestVerification = verificationRequested => {
    setIsVerificationRequested(verificationRequested)
    dispatch({
      type: 'users/REQUEST_VERIFICATION',
      payload: {
        userId: splitId(),
        requestedStatus: verificationRequested ? 'required' : 'not_required',
      },
    })
  }

  return (
    <>
      <Helmet title="User: Details" />
      <div className="mb-3">
        <strong className="cui__utils__heading">User Detail</strong>
        <span className="ml-5 mr-2">Identity Verification Required</span>
        <Switch
          checkedChildren={<span>On</span>}
          unCheckedChildren={<span>Off</span>}
          checked={isVerificationRequested}
          disabled={DISABLE_VERIFICATION_SWITCH_STATUSES.includes(
            data?.identityVerification?.status,
          )}
          onClick={handleRequestVerification}
        />
        <Button className="float-right" onClick={handleAssumeUser} type="primary">
          Assume User
        </Button>
      </div>
      {!data ? (
        <div className="d-flex flex-wrap justify-content-center mt-5">
          <Spin />
        </div>
      ) : (
        <UserDetails
          data={data}
          noteDescription={noteDescription}
          setNoteDescription={e => setNoteDescription(e)}
          userNote={userNote}
          onSaveNotes={handleSaveNotes}
        />
      )}
    </>
  )
}

export default connect(mapStateToProps)(UserDetailContainer)
