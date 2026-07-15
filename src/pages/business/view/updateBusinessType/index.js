/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { Button, Spinner, Input } from 'reactstrap'
import { EditOutlined } from '@ant-design/icons'
import { notification } from 'antd'
import Card from 'components/app/card'
import Title from '../../../../components/app/detailsComponents/title'
import { fetchBusinessDetails, updateBusinessDetail } from 'services/business'

const organizationOptions = ['Individuals', 'Corporation', 'Non-Profits', 'Government']

const UpdateBusinessType = ({ businessId }) => {
  const [businessType, setBusinessType] = useState('')
  const [businessName, setbusinessName] = useState('')
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
          setBusinessType(res.data.business.organizationType)
          setbusinessName(res.data.business.organizationName)
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

  const handleUpdateType = async () => {
    if (!businessType) {
      notification.error({ message: 'Business type cannot be empty' })
      return
    }

    setSaving(true)
    try {
      const payload = {
        organizationName: businessName,
        organizationType: businessType,
      }
      const res = await updateBusinessDetail(businessId, payload)
      if (res && res.statusCode === 200) {
        notification.success({ message: res.message || 'Business type updated successfully' })
        setEditable(false)
      } else {
        notification.error({ message: res?.message || 'Failed to update business type' })
      }
    } catch (err) {
      notification.error({ message: 'Something went wrong while updating type' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="col-6">
      <Card>
        <Title>Business Type</Title>
        <div className="table-responsive">
          <table className="table table-borderless mb-0">
            <tbody>
              <tr>
                <td className="px-0 pb-0 text-left">
                  {!editable ? (
                    <div className="d-flex align-items-center justify-content-start gap-2">
                      <span>{businessType}</span>
                      <EditOutlined className="cursor-pointer" onClick={() => setEditable(true)} />
                    </div>
                  ) : (
                    <div className="d-flex gap-2">
                      <select
                        className="form-control"
                        value={businessType}
                        onChange={e => setBusinessType(e.target.value)}
                      >
                        <option value="" disabled>
                          Select type
                        </option>
                        {organizationOptions.map(option => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <Button
                        color="primary"
                        onClick={handleUpdateType}
                        disabled={saving}
                        className="me-2"
                      >
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

export default UpdateBusinessType
