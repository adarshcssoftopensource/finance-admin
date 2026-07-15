import React, { useState } from 'react'
/* eslint-disable */
import { EditOutlined } from '@ant-design/icons'
import { Button, Input, DatePicker, message } from 'antd'
import moment from 'moment'
import Card from 'components/app/card'
import { formateDate } from 'components/app/helper'
import { updateUserAddress } from 'services/allUsers'
import Title from '../title'
import style from '../style.module.scss'

const ProfileDetails = ({ data }) => {
  const { address } = data

  const [editingField, setEditingField] = useState(null)
  const [fieldValues, setFieldValues] = useState({
    dateOfBirth: data.dateOfBirth ? moment(data.dateOfBirth) : null,
    country: address?.country?.name || '',
    state: address?.state?.name || '',
    city: address?.city || '',
    postal: address?.postal || '',
    addressLine1: address?.addressLine1 || '',
    addressLine2: address?.addressLine2 || '',
  })
  const [loading, setLoading] = useState(false)

  const handleSave = async field => {
    try {
      setLoading(true)

      const payload = {
        countryName: fieldValues.country,
        stateName: fieldValues.state,
        city: fieldValues.city,
        postal: fieldValues.postal,
        addressLine1: fieldValues.addressLine1,
        addressLine2: fieldValues.addressLine2,
        dateOfBirth: fieldValues.dateOfBirth ? fieldValues.dateOfBirth.format('YYYY-MM-DD') : null,
      }

      // eslint-disable-next-line no-underscore-dangle
      await updateUserAddress(data._id, payload)
      message.success('Updated successfully')
      setEditingField(null)
    } catch (err) {
      console.error(err)
      message.error('Failed to update')
    } finally {
      setLoading(false)
    }
  }

  const renderField = (label, fieldKey) => (
    <li className={`${style.item} text-muted`} key={fieldKey}>
      <div className="text-uppercase mb-1">{label}</div>
      <div className="d-flex align-items-center" style={{ gap: '10px' }}>
        {editingField === fieldKey ? (
          <>
            {fieldKey === 'dateOfBirth' ? (
              <DatePicker
                value={fieldValues.dateOfBirth}
                onChange={date => setFieldValues({ ...fieldValues, dateOfBirth: date })}
                format="YYYY-MM-DD"
              />
            ) : (
              <Input
                value={fieldValues[fieldKey]}
                onChange={e => setFieldValues({ ...fieldValues, [fieldKey]: e.target.value })}
              />
            )}
            <Button
              type="primary"
              size="small"
              loading={loading}
              onClick={() => handleSave(fieldKey)}
            >
              Save
            </Button>
            <Button size="small" onClick={() => setEditingField(null)}>
              Cancel
            </Button>
          </>
        ) : (
          <>
            <span className="font-weight-bold text-dark">
              {fieldKey === 'dateOfBirth'
                ? fieldValues.dateOfBirth
                  ? formateDate(fieldValues.dateOfBirth)
                  : '--'
                : fieldValues[fieldKey] || '--'}
            </span>
            <EditOutlined
              className="cursor-pointer"
              onClick={() => setEditingField(fieldKey)}
              style={{ marginLeft: 10 }}
            />
          </>
        )}
      </div>
    </li>
  )

  return (
    <>
      {data && (
        <Card>
          <Title>Personal Details</Title>
          <ul className={`list-unstyled ${style.list} pt-3`}>
            {renderField('DOB', 'dateOfBirth')}
            {renderField('Country', 'country')}
            {renderField('State', 'state')}
            {renderField('City', 'city')}
            {renderField('Postal', 'postal')}
            {renderField('Address Line 1', 'addressLine1')}
            {renderField('Address Line 2', 'addressLine2')}
          </ul>
        </Card>
      )}
    </>
  )
}

export default ProfileDetails
