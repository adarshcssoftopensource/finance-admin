/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { Input, Button, Spinner } from 'reactstrap'
import { EditOutlined } from '@ant-design/icons'
import { notification } from 'antd'
import Card from 'components/app/card'
import Title from '../../../../components/app/detailsComponents/title'
import { updateUserDetails } from 'services/allUsers'

const UpdateUserName = ({
  userId,
  firstName: initialFirstName,
  lastName: initialLastName,
  onUpdateSuccess,
}) => {
  const [firstName, setFirstName] = useState(initialFirstName || '')
  const [lastName, setLastName] = useState(initialLastName || '')
  const [editable, setEditable] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setFirstName(initialFirstName || '')
    setLastName(initialLastName || '')
  }, [initialFirstName, initialLastName])

  const handleUpdateName = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      notification.error({ message: 'First name and last name cannot be empty' })
      return
    }

    setSaving(true)
    try {
      const res = await updateUserDetails(userId, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      })
      if (res && res.statusCode === 200) {
        notification.success({ message: res.message || 'User name updated successfully' })
        setEditable(false)
        if (onUpdateSuccess) onUpdateSuccess()
      } else {
        notification.error({ message: res?.message || 'Failed to update user name' })
      }
    } catch (err) {
      notification.error({ message: 'Something went wrong while updating name' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="col-6">
      <Card>
        <Title>User Name</Title>
        <div className="table-responsive">
          <table className="table table-borderless mb-0">
            <tbody>
              <tr>
                <td className="px-0 pb-0 text-left">
                  {!editable ? (
                    <div className="d-flex align-items-center justify-content-start gap-2">
                      <span>
                        {firstName} {lastName}
                      </span>
                      <EditOutlined className="cursor-pointer" onClick={() => setEditable(true)} />
                    </div>
                  ) : (
                    <div className="d-flex flex-column gap-2">
                      <div className="d-flex gap-2 mb-2">
                        <Input
                          placeholder="First Name"
                          value={firstName}
                          onChange={e => setFirstName(e.target.value)}
                        />
                        <Input
                          placeholder="Last Name"
                          value={lastName}
                          onChange={e => setLastName(e.target.value)}
                        />
                      </div>
                      <div className="d-flex gap-2">
                        <Button color="primary" onClick={handleUpdateName} disabled={saving}>
                          {saving ? <Spinner size="sm" color="light" /> : 'Save'}
                        </Button>
                        <Button color="secondary" onClick={() => setEditable(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

export default UpdateUserName
