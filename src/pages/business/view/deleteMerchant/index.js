/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { Button, Spinner } from 'reactstrap'
import { MinusCircleOutlined } from '@ant-design/icons'
import { notification, Modal } from 'antd'
import Card from 'components/app/card'
import Title from '../../../../components/app/detailsComponents/title'
import { fetchBusinessDetails, removeMerchantFromBusiness } from 'services/business'

const DeleteMerchant = ({ businessId }) => {
  const [merchants, setMerchants] = useState([])
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState('')

  useEffect(() => {
    if (!businessId) return
    const getMerchants = async () => {
      setLoading(true)
      try {
        const res = await fetchBusinessDetails({ businessId })
        const merchantIds = res?.data?.business?.legal?.providerData?.merchantId || []
        setMerchants(merchantIds)
      } catch (err) {
        notification.error({ message: 'Something went wrong while fetching merchant details' })
      } finally {
        setLoading(false)
      }
    }

    getMerchants()
  }, [businessId])

  const handleDelete = id => {
    Modal.confirm({
      title: 'Are you sure?',
      content: `This will permanently delete: ${id}`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        setDeleting(id)
        try {
          const res = await removeMerchantFromBusiness(businessId, id)
          if (res && res.statusCode === 200) {
            notification.success({ message: res.message || 'Merchant deleted successfully' })
            setMerchants(prev => prev.filter(m => m !== id))
          } else {
            notification.error({ message: res?.message || 'Failed to delete merchant' })
          }
        } catch (err) {
          notification.error({ message: 'Something went wrong while deleting merchant' })
        } finally {
          setDeleting('')
        }
      },
    })
  }

  return (
    <div className="col-6">
      <Card>
        <Title>Delete Merchants</Title>
        <div className="table-responsive">
          <table className="table table-borderless mb-0">
            <tbody>
              {loading ? (
                <tr>
                  <td>Loading...</td>
                </tr>
              ) : merchants.length === 0 ? (
                <tr>
                  <td>No merchants found</td>
                </tr>
              ) : (
                merchants.map(id => (
                  <tr key={id}>
                    <td className="align-middle">{id}</td>

                    <td className="text-right">
                      <Button
                        color="danger"
                        size="sm"
                        disabled={!!deleting}
                        onClick={() => handleDelete(id)}
                        style={{ minWidth: '36px', padding: '0.25rem 0.5rem' }}
                      >
                        {deleting === id ? (
                          <Spinner size="sm" color="light" />
                        ) : (
                          <MinusCircleOutlined style={{ fontSize: '14px' }} />
                        )}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

export default DeleteMerchant
