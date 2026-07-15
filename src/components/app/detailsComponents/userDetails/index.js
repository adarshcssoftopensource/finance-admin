import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Button, Switch } from 'antd'
import Card from 'components/app/card'
import NoteList from '../../Notes/NoteList'
import Title from '../title'
import ConnectedEmails from './connectedEmails'
import ProfileDetails from './profileDetails'
import UserBusinesses from './userBusiness'
import Header from './header'
import UserPhone from './userPhone'
import UserSessions from './userSessions'
import UpdateUserName from './updateUserName'

const mapStateToProps = ({ users, dispatch, router }) => ({
  users,
  dispatch,
  router,
})

const UserDetails = ({
  dispatch,
  data,
  noteDescription,
  setNoteDescription,
  userNote,
  onSaveNotes,
}) => {
  const sortedUserNote =
    userNote && userNote.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
  const [editable, setEditable] = useState({ email: false, mobileNumber: false })
  const [email, setEmail] = useState('')
  const [mobileNumber, setMobileNumber] = useState(0)
  const [twoFASetting, setTwoFASetting] = useState({})

  useEffect(() => {
    if (data) {
      setEmail(data.primaryEmail)
      setMobileNumber(data.mobileNumber)
      setTwoFASetting({
        TOTP: !!data?.twoFAuth?.TOTP?.enabled,
        SMS: !!data?.twoFAuth?.SMS?.enabled,
      })
    }
  }, [data])

  const refreshUserData = () => {
    dispatch({
      type: 'users/FETCH_USER_DETAILS',
      payload: {
        userId: data._id,
      },
    })
  }

  const handleSubmitStatement = () => {
    /* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
    dispatch({
      type: 'users/CHANGE_CONNECTED_EMAIL',
      payload: {
        userId: data._id,
        emailAddress: email,
      },
    })
    setEditable(false)
  }

  const save2FA = () => {
    dispatch({
      type: 'users/CHANGE_2FA_STATUS',
      payload: { userId: data._id, ...twoFASetting },
    })
  }

  const handleSubmitMobileNumber = () => {
    dispatch({
      type: 'users/CHANGE_MOBILE_NUMBER',
      payload: { userId: data._id, mobileNumber },
    })
  }

  const isSaveDisabled =
    data?.twoFAuth?.TOTP?.enabled === twoFASetting.TOTP &&
    data?.twoFAuth?.SMS?.enabled === twoFASetting.SMS

  return (
    <>
      <Header data={data} />
      <div className="row">
        <UpdateUserName
          userId={data?._id}
          firstName={data?.firstName}
          lastName={data?.lastName}
          onUpdateSuccess={refreshUserData}
        />
      </div>
      <ProfileDetails dispatch={dispatch} data={data} />
      <div className="row">
        <ConnectedEmails
          data={data}
          changeHandle={e => setEmail(e.target.value)}
          handleSubmitStatement={handleSubmitStatement}
          onCancelClick={() => {
            setEditable({ ...editable, email: false })
          }}
          onEditClick={editedEmail => {
            setEditable({ ...editable, email: editedEmail })
            setEmail(editedEmail)
          }}
          editable={editable?.email}
          emailAddress={email}
        />
        <UserPhone
          data={data}
          handleSubmitStatement={handleSubmitMobileNumber}
          changeHandle={e => setMobileNumber(e.target.value)}
          onCancelClick={() => {
            setEditable({ ...editable, mobileNumber: false })
          }}
          onEditClick={() => setEditable({ ...editable, mobileNumber: true })}
          editable={editable?.mobileNumber}
          mobileNumber={mobileNumber}
        />
      </div>
      <Card>
        <Title>Two factor authentication</Title>
        <div className="col-12 pl-0">
          <div
            className="text-nowrap d-flex"
            style={{ gap: '15px', padding: '10px 0', alignItems: 'center' }}
          >
            <span>
              TOTP &nbsp;
              <Switch
                className="mr-2"
                checkedChildren={<span>On</span>}
                unCheckedChildren={<span>Off</span>}
                disabled={!data?.twoFAuth?.TOTP?.factorId}
                checked={twoFASetting?.TOTP}
                onClick={value => setTwoFASetting({ ...twoFASetting, TOTP: value })}
              />
            </span>
            <span>
              SMS &nbsp;
              <Switch
                className="mr-2"
                checkedChildren={<span>On</span>}
                unCheckedChildren={<span>Off</span>}
                disabled={!data?.twoFAuth?.SMS?.mobileNumber}
                checked={twoFASetting?.SMS}
                onClick={value => setTwoFASetting({ ...twoFASetting, SMS: value })}
              />
            </span>
            <Button type="primary" disabled={isSaveDisabled} onClick={() => save2FA()}>
              Save
            </Button>
          </div>
        </div>
      </Card>
      <UserSessions data={data} />
      <UserBusinesses data={data} />
      <Card>
        <Title>Notes</Title>
        <NoteList
          noteDescription={noteDescription}
          setNoteDescription={setNoteDescription}
          businessNote={sortedUserNote}
          onSaveNotes={onSaveNotes}
          className="user-notes-wrapper"
        />
      </Card>
    </>
  )
}

export default connect(mapStateToProps)(UserDetails)
