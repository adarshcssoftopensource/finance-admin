/* eslint-disable */
import React, { useEffect, useCallback, useState } from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { Spin, Modal } from 'antd'
import DisputeDetails from 'components/app/detailsComponents/disputeDetails'
import CopyToClipboard from 'components/app/copyToClipboard'

const mapStateToProps = ({ disputes, dispatch, router }) => ({
  disputes,
  dispatch,
  router,
})
const Index = ({ dispatch, router: { location }, disputes: { dispute } }) => {
  const [data, setData] = useState({})
  const [openConcedeDispute, setOpenConcedeDispute] = useState(false)

  const initFetch = useCallback(
    disputeId => {
      dispatch({
        type: 'disputes/FETCH_DISPUTE',
        disputeId,
      })
    },
    [dispatch],
  )

  useEffect(() => {
    const disputeId = splitId()
    initFetch(disputeId)
  }, [initFetch])
  const splitId = () => location.pathname.split('/disputes/')[1]

  useEffect(() => {
    if (dispute && dispute.data) {
      setData(dispute.data.dispute)
    }
  }, [dispute, dispute.data])

  const handleConcedeDispute = async () => {
    setOpenConcedeDispute(true)
  }

  const handleCloseConcedeDispute = async () => {
    setOpenConcedeDispute(false)
  }

  const handleConcedeDisputeSubmit = async () => {
    dispatch({
      type: 'disputes/MANAGE_DISPUTE',
      data: {
        disputeAction: 'concede',
        disputeId: data?.providerData?.disputeId,
        businessId: data?.businessId,
        internalDisputeId: data?._id,
      },
    })
  }

  const handleChallengeDispute = async () => {
    console.log('Challenge')
    // ON HOLD FOR NOW
  }

  return (
    <>
      <Helmet title="Dispute: Details" />
      <div className="cui__utils__heading">
        <strong>Dispute Detail</strong>&nbsp;
        <span className="font-size-12">
          (
          {
            <CopyToClipboard
              value={data?.providerData?.disputeId}
              textMessage="Dispute ID copied to clipboard"
            />
          }
          &nbsp;{data?.providerData?.disputeId || data?._id})
        </span>
      </div>
      {!data ? (
        <div className="d-flex flex-wrap justify-content-center mt-5">
          <Spin />
        </div>
      ) : (
        <>
          <DisputeDetails
            data={data}
            handleConcedeDispute={handleConcedeDispute}
            handleChallengeDispute={handleChallengeDispute}
          />
        </>
      )}
      <Modal
        title="Concede Dispute"
        visible={openConcedeDispute}
        onOk={() => handleConcedeDisputeSubmit()}
        okText="Confirm"
        onCancel={handleCloseConcedeDispute}
      >
        <p>
          Are you sure you want to Concede Dispute? Once a dispute has been conceded, it cannot be
          challenged.
        </p>
      </Modal>
    </>
  )
}

export default connect(mapStateToProps)(Index)
