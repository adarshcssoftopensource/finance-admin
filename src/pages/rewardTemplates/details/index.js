/* eslint-disable */
import React, { useEffect, useCallback, useState } from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { Spin } from 'antd'
import RewardTemplateDetails from 'components/app/detailsComponents/rewardTemplateDetails'

const mapStateToProps = ({ rewardTemplates, dispatch, router }) => ({
  rewardTemplates,
  dispatch,
  router,
})
const Index = ({ dispatch, router: { location }, rewardTemplates: { rewardTemplate } }) => {
  const [data, setData] = useState({})

  const initFetch = useCallback(
    templateId => {
      dispatch({
        type: 'rewardTemplates/FETCH_REWARD_TEMPLATE',
        templateId,
      })
    },
    [dispatch],
  )

  useEffect(() => {
    const templateId = splitId()
    initFetch(templateId)
  }, [initFetch])
  const splitId = () => location.pathname.split('/reward-templates/')[1]

  useEffect(() => {
    if (rewardTemplate && rewardTemplate.data) {
      setData(rewardTemplate.data.rewardTemplate)
    }
  }, [rewardTemplate, rewardTemplate.data])

  return (
    <>
      <Helmet title="Reward Template: Details" />
      <div className="cui__utils__heading">
        <strong>Reward Template Detail</strong>
      </div>
      {!data ? (
        <div className="d-flex flex-wrap justify-content-center mt-5">
          <Spin />
        </div>
      ) : (
        <>
          <RewardTemplateDetails data={data} />
        </>
      )}
    </>
  )
}

export default connect(mapStateToProps)(Index)
