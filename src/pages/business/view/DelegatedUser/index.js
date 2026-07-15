/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { Modal, Button } from 'antd'
import Table from 'components/app/table'
import getColumns from 'components/app/CommonTableFormatter/userTableFormatter'
import { connect } from 'react-redux'
import AddUserModal from './AddUserModal'
import { fetchRoles } from 'services/business'
import actions from 'redux/business/actions'
import ExportButton from 'components/app/exportButton'
import qs from 'qs'

const mapStateToProps = ({ allUsers, dispatch }) => ({
  allUsers,
  dispatch,
})

const { confirm } = Modal
function index({
  data,
  loading,
  changeStatus,
  openPasswordModal,
  openModal,
  resetPassword,
  allUsers: { user },
  dispatch,
  businessId,
}) {
  const [addUserModalVisible, setAddUserModalVisible] = useState(false)
  const [roles, setRoles] = useState([])
  const [addingUser, setAddingUser] = useState(false)

  useEffect(() => {
    fetchRoles().then(res => {
      if (res && res.roles) {
        setRoles(res.roles)
      }
    })
  }, [])

  const showDeleteConfirm = row => {
    confirm({
      title: `Are you sure you want to ${
        row.isActiveInBusiness ? 'deactivate' : 'activate'
      } this user in this business?`,
      content: 'This will toggle their access to this specific business.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        changeStatus(row)
      },
      onCancel() {},
    })
  }

  const permanentlyRemoveAccess = row => {
    confirm({
      title: `Are you sure you want to PERMANENTLY remove access for ${row.firstName} ${row.lastName}?`,
      content: 'This will completely sever the association between this user and the business.',
      okText: 'Permanently Remove',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        dispatch({
          type: actions.REMOVE_USER_FROM_BUSINESS,
          payload: {
            businessId,
            userBusinessId: row.userBusinessId,
          },
        })
      },
      onCancel() {},
    })
  }

  const handleAddUser = values => {
    setAddingUser(true)
    dispatch({
      type: actions.ADD_USER_TO_BUSINESS,
      payload: {
        businessId,
        data: values,
        onSuccess: () => {
          setAddingUser(false)
          setAddUserModalVisible(false)
        },
      },
    })
  }

  const resetPasswordModal = row => {
    confirm({
      title: `Are you sure you want to reset password of this user?`,
      content: '',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        resetPassword(row)
      },
      onCancel() {},
    })
  }
  const onPaginationChange = (currentPage, size) => {
    console.log(currentPage, size)
  }

  const handleRequestVerification = (row, requestedStatus) => {
    dispatch({
      type: 'users/REQUEST_VERIFICATION',
      payload: {
        userId: row._id,
        requestedStatus,
      },
    })
  }

  let columns = getColumns(
    showDeleteConfirm,
    openModal,
    openPasswordModal,
    resetPasswordModal,
    true,
    handleRequestVerification,
    permanentlyRemoveAccess,
  )
  return (
    <div className="card-body p-0">
      <div className="mb-3 d-flex justify-content-end">
        <ExportButton qryString={qs.stringify({ businessId })} type="users" varient="medium" />
        <Button type="primary" className="ml-2" onClick={() => setAddUserModalVisible(true)}>
          Add User
        </Button>
      </div>
      <div className="text-nowrap">
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={data}
          loading={loading}
          onPaginationChange={(currentPage, size) => onPaginationChange(currentPage, size)}
        />
      </div>
      <AddUserModal
        visible={addUserModalVisible}
        onCancel={() => setAddUserModalVisible(false)}
        onAdd={handleAddUser}
        loading={addingUser}
        roles={roles}
      />
    </div>
  )
}

export default connect(mapStateToProps)(index)
