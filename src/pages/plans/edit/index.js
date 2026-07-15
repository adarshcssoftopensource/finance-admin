import React, { useEffect, useCallback, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Input, Spin, Button } from 'antd'
import { connect } from 'react-redux'
import { updatePlans } from 'services/plans'
import * as Notification from 'services/showNotifications'
import Features from './features'
import FeatureFormModal from './featureFormModal'

const { Search } = Input
const mapStateToProps = ({ plans, dispatch, router }) => ({
  dispatch,
  plans,
  router,
})

const Index = ({ router: { location }, plans: { plans }, dispatch }) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [editFeature, setEditFeature] = useState(null)
  const [visible, setVisible] = useState(false)

  const initFetch = useCallback(() => {
    dispatch({
      type: 'plans/FETCH_ALL_PLANS',
      payload: {},
    })
  }, [dispatch])

  useEffect(() => {
    if (plans && plans.data) {
      /* eslint-disable */
      setData(plans.data.plans.filter(plan => plan._id === splitId())[0])
    } else {
      initFetch()
    }
  }, [initFetch])
  useEffect(() => {
    if (plans && plans.data) {
      /* eslint-disable */
      setData(plans.data.plans.filter(plan => plan._id === splitId())[0])
    }
  }, [plans])

  const splitId = () => location.pathname.split('/plans/')[1].split('/edit')[0]

  const dragProps = {
    onDragEnd(fromIndex, toIndex) {
      const features = [...data.features]
      const item = features.splice(fromIndex, 1)[0]
      features.splice(toIndex, 0, item)
      setData({ ...data, features: [...features] })
      updatePlanDataFun({ ...data, features: [...features] })
    },
    nodeSelector: 'li',
    handleSelector: 'a',
  }

  const handleFeatureDelete = idx => {
    const features = [...data.features]
    features.splice(idx, 1)
    setData({ ...data, features: [...features] })
    updatePlanDataFun({ ...data, features: [...features] })
  }

  const onEditFeature = (data, idx) => {
    setEditFeature({ data, idx })
    setVisible(true)
  }

  const onCreate = values => {
    let updatePlanData = {}
    if (editFeature) {
      const features = [...data.features]
      features[editFeature.idx] = { title: values.title, info: values.info }
      updatePlanData = { ...data, features: [...features] }
    } else {
      updatePlanData = {
        ...data,
        features: [...data.features, { title: values.title, info: values.info }],
      }
    }
    setData(updatePlanData)
    updatePlanDataFun(updatePlanData)
  }

  const updatePlanDataFun = async planData => {
    setLoading(true)
    setVisible(false)
    const { _id, title, features, price } = planData
    await updatePlans(_id, { title, features, price })
      .then(res => {
        setLoading(false)
        Notification.showSuccess(res.message)
      })
      .catch(error => {
        setLoading(false)
        Notification.showError(error.message)
      })
  }

  const regex = new RegExp('^0+(?!$)', 'g')

  const handlePlanValue = e => {
    if (e.target.value > 0) {
      setData({ ...data, price: parseFloat(e.target.value) })
    } else {
      setData({ ...data, price: 0 })
    }
  }
  return (
    <>
      <Helmet title="Plan: Edit" />
      <div className="cui__utils__heading d-flex justify-content-between">
        <strong>{data ? data.title : 'Edit'} Plan</strong>
        <Button
          type="primary"
          onClick={() => {
            setEditFeature(null)
            setVisible(true)
          }}
        >
          Add Feature
        </Button>
      </div>
      {data && !loading ? (
        <div className="row">
          <div className="card w-100">
            <div className="card-body">
              <div className="col-12 p-0">
                <div className="row pb-4 justify-content-between pl-3">
                  <div className="col-6 p-0">
                    <span className="filter-label">Title</span>
                    <Search
                      enterButton="Update"
                      size="large"
                      defaultValue={data.title}
                      onSearch={value => {
                        updatePlanDataFun({ ...data, title: value })
                        setData({ ...data, title: value })
                      }}
                      placeholder="Plan title"
                    />
                  </div>
                  <div className="col-5 mr-3 p-0">
                    <span className="filter-label">Plan Price</span>
                    <div className="d-flex">
                      <Input
                        type="number"
                        min="0"
                        size="large"
                        placeholder="Update Price"
                        value={data.price.toString().replaceAll(regex, '')}
                        onChange={handlePlanValue}
                      />
                      <Button
                        type="primary"
                        size="large"
                        onClick={() => updatePlanDataFun({ ...data })}
                      >
                        Update
                      </Button>
                    </div>
                  </div>
                </div>
                <Features
                  data={data}
                  dragProps={dragProps}
                  handleFeatureDelete={handleFeatureDelete}
                  onEditFeature={onEditFeature}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="d-flex flex-wrap justify-content-center mt-5">
          <Spin />
        </div>
      )}
      <FeatureFormModal
        visible={visible}
        onCreate={onCreate}
        data={editFeature}
        onCancel={() => {
          setVisible(false)
        }}
      />
    </>
  )
}

export default connect(mapStateToProps)(Index)
