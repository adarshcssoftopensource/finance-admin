import React, { useEffect, useCallback, useState } from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { Spin } from 'antd'
import InvoiceDetails from 'components/app/detailsComponents/invoiceDetails'

const mapStateToProps = ({ invoices, user, dispatch, router }) => ({
  invoices,
  user,
  dispatch,
  router,
})
const Index = ({
  dispatch,
  user,
  router: { location },
  invoices: { invoice, invoiceTimeline },
}) => {
  const [data, setData] = useState()
  const [timelineData, setTimelineData] = useState()

  const initFetch = useCallback(
    (invoiceId, businessId) => {
      dispatch({
        type: 'invoices/FETCH_INVOICE_DETAILS',
        payload: {
          invoiceId,
          businessId,
        },
      })
    },
    [dispatch],
  )

  const fetchInvoiceTimeline = useCallback(
    (invoiceId, businessId) => {
      dispatch({
        type: 'invoices/FETCH_INVOICE_TIMELINE',
        payload: {
          invoiceId,
          businessId,
          userId: user.id,
        },
      })
    },
    [dispatch],
  )

  useEffect(() => {
    const invoiceId = splitInvoiceId()
    const businessId = splitBusinessId()
    initFetch(invoiceId, businessId)
    fetchInvoiceTimeline(invoiceId, businessId)
  }, [initFetch])

  const splitInvoiceId = () => location.pathname.split('/invoices/')[1].split('/')[0]
  const splitBusinessId = () => location.pathname.split('/invoices/')[1].split('/')[1]

  useEffect(() => {
    if (invoice && invoice.data) {
      setData(invoice.data.invoice)
    }
  }, [invoice])

  useEffect(() => {
    if (invoiceTimeline && invoiceTimeline.data) {
      setTimelineData(invoiceTimeline.data)
    }
  }, [invoiceTimeline])
  /* eslint-disable */
  return (
    <>
      <Helmet title="Invoice: Details" />
      <div className="cui__utils__heading">
        <strong>Invoice Detail</strong>
      </div>
      {!data ? (
        <div className="d-flex flex-wrap justify-content-center mt-5">
          <Spin />
        </div>
      ) : (
        <>
          <InvoiceDetails data={data} invoiceTimeline={timelineData} />
        </>
      )}
    </>
  )
}

export default connect(mapStateToProps)(Index)
