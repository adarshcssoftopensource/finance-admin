/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { Input, Button, Spinner } from 'reactstrap'
import { EditOutlined } from '@ant-design/icons'
import { notification } from 'antd'
import Card from 'components/app/card'
import Title from '../../../../components/app/detailsComponents/title'
import { fetchBusinessDetails, updateBusinessDetail } from 'services/business'

const UpdateBusinessName = ({ businessId }) => {
  const [businessName, setBusinessName] = useState('')
  const [editable, setEditable] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!businessId) return
    const getBusiness = async () => {
      setLoading(true)
      try {
        const res = await fetchBusinessDetails({ businessId })
        if (res && res.statusCode === 200) {
          setBusinessName(res.data.business.organizationName)
        } else {
          notification.error({
            message: res?.message || 'Failed to fetch business details',
          })
        }
      } catch (err) {
        notification.error({ message: 'Something went wrong while fetching details' })
      } finally {
        setLoading(false)
      }
    }

    getBusiness()
  }, [businessId])

  const handleUpdateName = async () => {
    if (!businessName.trim()) {
      notification.error({ message: 'Business name cannot be empty' })
      return
    }

    setSaving(true)
    try {
      const res = await updateBusinessDetail(businessId, { organizationName: businessName.trim() })
      if (res && res.statusCode === 200) {
        notification.success({ message: res.message || 'Business name updated successfully' })
        setEditable(false)
      } else {
        notification.error({ message: res?.message || 'Failed to update business name' })
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
        <Title>Business Name</Title>
        <div className="table-responsive">
          <table className="table table-borderless mb-0">
            <tbody>
              <tr>
                <td className="px-0 pb-0 text-left">
                  {!editable ? (
                    <div className="d-flex align-items-center justify-content-start gap-2">
                      <span>{businessName}</span>
                      <EditOutlined className="cursor-pointer" onClick={() => setEditable(true)} />
                    </div>
                  ) : (
                    <div className="d-flex gap-2">
                      <Input value={businessName} onChange={e => setBusinessName(e.target.value)} />
                      <Button color="primary" onClick={handleUpdateName} disabled={saving}>
                        {saving ? <Spinner size="sm" color="light" /> : 'Save'}
                      </Button>
                      <Button color="secondary" onClick={() => setEditable(false)}>
                        Cancel
                      </Button>
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

export default UpdateBusinessName
