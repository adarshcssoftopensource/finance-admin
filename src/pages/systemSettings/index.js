/* eslint-disable  */
import { Button, Modal } from 'antd'
import { isEmpty as _isEmpty, isEqual as _isEqual } from 'lodash'
import React, { useEffect, useState } from 'react'
import { connect, useDispatch } from 'react-redux'
import action from '../../redux/systemSettings/actions'
import StripeRaw from '../../components/app/detailsComponents/stripeRaw'

const { confirm } = Modal

const BlockedDomain = ({ systemSettingsReducer: { systemSettings, isLoading } }) => {
  const [config, setConfig] = useState({})
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch({
      type: action.FETCH_ALL_SYSTEM_SETTINGS,
    })
  }, [])

  useEffect(() => {
    if (!_isEmpty(systemSettings)) {
      setConfig(systemSettings)
    }
  }, [isLoading])

  const handleUpdateConfig = ({ updated_src }) => {
    setConfig(updated_src)
  }

  const handleDeleteConfig = ({ namespace, name, existing_src }) => {
    const pathParts = [...namespace.filter(part => part !== 'data'), name].filter(Boolean)
    const deleteUrl = pathParts.join('/')
    confirm({
      title: `Are you sure you want to delete this flag?`,
      content: '',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        dispatch({
          type: action.DELETE_SYSTEM_SETTINGS,
          payload: deleteUrl,
        })
      },
      onCancel() {
        setConfig(existing_src)
      },
    })
  }

  const handleSaveConfig = () => {
    const payload = Object.keys(config).map(key => {
      const value = config[key]
      return {
        key,
        value,
      }
    })
    dispatch({
      type: action.UPDATE_ALL_SYSTEM_SETTINGS,
      payload: payload,
    })
  }

  return (
    <div>
      <div>
        <StripeRaw
          title={'Feature flags'}
          collapsed={10}
          data={JSON.stringify(config)}
          onAdd={true}
          onDelete={true}
          onEdit={true}
          handleAdd={handleUpdateConfig}
          handleDelete={handleDeleteConfig}
          handleEdit={handleUpdateConfig}
        />
      </div>
      <Button type="primary" disabled={_isEqual(systemSettings, config)} onClick={handleSaveConfig}>
        save
      </Button>
    </div>
  )
}

const mapStateToProps = state => {
  const { systemSettingsReducer } = state
  return {
    systemSettingsReducer,
  }
}

export default connect(mapStateToProps)(BlockedDomain)
