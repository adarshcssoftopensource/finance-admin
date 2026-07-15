/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { Spinner } from 'reactstrap'
import { notification, Switch, Tooltip } from 'antd'
import Card from 'components/app/card'
import { providerIcons } from 'components/app/CommonTableFormatter/businessTableFormatter'
import { capitalize } from 'lodash'
import Title from '../../../../components/app/detailsComponents/title'
import { fetchBusinessDetails, toggleStripeAccount } from 'services/business'

const ToggleStripeAccount = ({ businessId }) => {
  const [merchants, setMerchants] = useState([])
  const [disabledIds, setDisabledIds] = useState([])
  const [loading, setLoading] = useState(false)
  const [toggling, setToggling] = useState('')

  const getProviderFromId = id => {
    if (!id) return ''
    if (id.startsWith('acct_')) return 'stripe'
    if (id.startsWith('acc_')) return 'justifi'
    if (id.startsWith('mcht_')) return 'checkout'
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id))
      return 'astra'
    return ''
  }

  const getMerchants = async () => {
    setLoading(true)
    try {
      const res = await fetchBusinessDetails({ businessId })
      if (res && res.statusCode === 200) {
        const merchantIds = res?.data?.business?.legal?.providerData?.merchantId || []
        const disabledMerchantIds =
          res?.data?.business?.legal?.providerData?.disabledMerchantIds || []
        setMerchants(merchantIds)
        setDisabledIds(disabledMerchantIds)
      }
    } catch (err) {
      notification.error({ message: 'Something went wrong while fetching merchant details' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!businessId) return
    getMerchants()
  }, [businessId])

  const handleToggle = async (id, checked) => {
    setToggling(id)
    try {
      const res = await toggleStripeAccount(businessId, id, checked)
      if (res && res.statusCode === 200) {
        notification.success({
          message: res.message || `Merchant ${checked ? 'enabled' : 'disabled'} successfully`,
        })
        // Update local state to reflect change immediately
        if (checked) {
          setDisabledIds(prev => prev.filter(m => m !== id))
        } else {
          setDisabledIds(prev => [...prev, id])
        }
      } else {
        notification.error({ message: res?.message || 'Failed to toggle merchant status' })
      }
    } catch (err) {
      notification.error({ message: 'Something went wrong while toggling merchant status' })
    } finally {
      setToggling('')
    }
  }

  return (
    <div className="col-6">
      <Card>
        <Title>Manage Accounts</Title>
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
                merchants.map(id => {
                  const isDisabled = disabledIds.includes(id)
                  const isProcessing = toggling === id
                  return (
                    <tr key={id}>
                      <td className="align-middle">
                        <div className="d-flex align-items-center gap-2">
                          <span
                            style={{
                              textDecoration: isDisabled ? 'line-through' : 'none',
                              color: isDisabled ? '#999' : 'inherit',
                            }}
                          >
                            {id}
                          </span>
                          {getProviderFromId(id) && (
                            <Tooltip
                              placement="top"
                              className="ml-2"
                              title={
                                getProviderFromId(id) === 'payarc'
                                  ? 'PayArc'
                                  : capitalize(getProviderFromId(id))
                              }
                            >
                              {providerIcons(getProviderFromId(id))}
                            </Tooltip>
                          )}
                        </div>
                      </td>

                      <td className="text-right align-middle">
                        <div className="d-flex align-items-center justify-content-end gap-2">
                          {isProcessing && <Spinner size="sm" className="mr-2" color="primary" />}
                          <Switch
                            size="small"
                            checked={!isDisabled}
                            disabled={isProcessing}
                            onChange={checked => handleToggle(id, checked)}
                          />
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

export default ToggleStripeAccount
