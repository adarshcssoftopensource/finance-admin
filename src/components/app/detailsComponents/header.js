import React, { useEffect, useState } from 'react'
import Card from 'components/app/card'
import { getAmountToDisplay, renderPaymentMethod, formateDate } from 'components/app/helper'
import RefundModal from 'pages/common/helper/RefundModal'
import { useDispatch } from 'react-redux'
import Title from './title'
import style from './style.module.scss'
/* eslint-disable */
const Header = ({ data, type }) => {
  const [currentRefundData, setCurrentRefundData] = useState(null)
  const [isRefunded, setIsRefunded] = useState(false)
  const [blockCustomerLoading, setBlockCustomerLoading] = useState(false)
  const [isBlocked, setIsBlocked] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    setIsBlocked(data.customer?.isBlockedGlobally || data.customer?.isBlocked || false)
  }, [data.customer?.isBlockedGlobally, data.customer?.isBlocked])

  const renderStatus = status => {
    let statusObj = {
      class: 'default',
    }
    if (status === 'SUCCESS') {
      statusObj = {
        class: 'success',
      }
    } else if (status === 'DECLINED' || status === 'CANCELLED' || status === 'FAILED') {
      statusObj = {
        class: 'danger',
      }
    }
    return (
      <sup className={`text-capitalize badge badge-${statusObj.class} font-size-14`}>{status}</sup>
    )
  }
  const handleRefundModalOpen = data => {
    setCurrentRefundData(data)
  }

  const handleBlockToggle = async customerId => {
    if (!customerId) return
    setBlockCustomerLoading(true)

    const actionType = isBlocked ? 'customers/UNBLOCK_CUSTOMER' : 'customers/BLOCK_CUSTOMER'

    dispatch({
      type: actionType,
      payload: { customerId },
      onSuccess: () => {
        setBlockCustomerLoading(false)
        setIsBlocked(!isBlocked)
      },
      onError: err => {
        setBlockCustomerLoading(false)
        console.error(err)
      },
    })
  }

  const isFullyRefunded = data => {
    return (
      (data.refund?.totalAmount ?? 0) >= (data.amountBreakup?.net ?? data.amountBreakup?.total ?? 0)
    )
  }

  return (
    <Card>
      <Title>
        {getAmountToDisplay(data.currency, data.amount)} {renderStatus(data.status)}
        {data.reason && (
          <div className="font-italic font-size-14 font-weight-normal pb-1">
            <strong>Reason:- &nbsp;</strong>
            {data.reason}
          </div>
        )}
      </Title>
      {data && (
        <ul className={`list-unstyled ${style.list}  pt-3`}>
          <li className={`${style.item} text-muted`}>
            <div className="text-uppercase mb-1">Date</div>
            <div className="text-nowrap d-inline-block">
              <span className="font-weight-bold text-dark">
                {formateDate(data.paymentDate || data.refundDate)}
              </span>
            </div>
          </li>
          <li className={`${style.item} text-muted`}>
            <div className="text-uppercase mb-1">Customer</div>
            <div className="text-nowrap d-inline-block">
              <span className="font-weight-bold text-dark">
                {data && data.customer
                  ? `${data.customer.firstName} ${data.customer.lastName}`
                  : ''}
              </span>
            </div>
          </li>
          <li className={`${style.item} text-muted`}>
            <div className="text-uppercase mb-1">Payment Method</div>
            <div className="text-nowrap d-inline-block">
              <span className="font-weight-bold text-dark">{renderPaymentMethod(data)}</span>
            </div>
          </li>
          {data?.is3DSecure && (
            <li className={`${style.item} text-muted`}>
              <div className="text-uppercase mb-1">3DS</div>
              <div className="text-nowrap d-inline-block">
                <span className="badge badge-success font-size-18">
                  <i className="fa fa-shield" aria-hidden="true"></i>
                </span>
              </div>
            </li>
          )}
          <li className={`${style.item} text-muted pr-2`}>
            <div className="text-uppercase mb-1">Business</div>
            <div className="text-truncate d-inline-block w-100">
              {data.businessDetails && (
                <a
                  href={`${process.env.REACT_APP_HOME_URL}/#/business/view/${data.businessDetails._id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-weight-bold kit__utils__link text-dark"
                >
                  {data && data.businessDetails ? data.businessDetails.organizationName : ''}
                </a>
              )}
            </div>
          </li>
          {type === 'refunds' ? (
            <li className={`${style.item} text-muted`}>
              <div className="text-uppercase mb-1">Refunded For</div>
              <div className="text-nowrap d-inline-block">
                {data.payment && (
                  <a
                    href={`${process.env.REACT_APP_HOME_URL}/#/payments/${data.payment.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-weight-bold kit__utils__link text-dark"
                  >
                    View payment
                  </a>
                )}
              </div>
            </li>
          ) : (
            <li className={`${style.item} text-muted`}>
              <div className="text-uppercase mb-1">Payment For</div>
              <div className="text-nowrap d-inline-block">
                {data.checkoutDetails && data.checkoutDetails.length > 0 && (
                  <a
                    href={`${process.env.REACT_APP_PUBLIC_URL}/checkout/${data.checkoutDetails[0].uuid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-weight-bold kit__utils__link text-dark"
                  >
                    Checkout
                  </a>
                )}
                {data.invoiceDetails && (
                  <a
                    href={`${process.env.REACT_APP_PUBLIC_URL}/invoice/${data.invoiceDetails.uuid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-weight-bold kit__utils__link text-dark"
                  >
                    Invoice
                  </a>
                )}
                {data.peymeDetails && (
                  <a
                    href={`${process.env.REACT_APP_PUBLIC_URL}/for/${data.peymeDetails.peymeName}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-weight-bold kit__utils__link text-dark"
                  >
                    Finance.Me Lynk
                  </a>
                )}
                {data.fundingDetails && data.fundingDetails.fundingName && (
                  <a
                    href={`${process.env.REACT_APP_PUBLIC_URL}/give/${data.fundingDetails.fundingName}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-weight-bold kit__utils__link text-dark"
                  >
                    Funding
                  </a>
                )}
              </div>
            </li>
          )}
          <li className={`${style.item} text-muted`}>
            <div className="text-uppercase mb-1">Customer Status</div>
            <div className="text-nowrap d-inline-block">
              {data.customer?.customerId ? (
                <button
                  className={`btn btn-sm ${
                    isBlocked ? 'btn-outline-success' : 'btn-outline-danger'
                  }`}
                  onClick={() => handleBlockToggle(data.customer.customerId)}
                  disabled={blockCustomerLoading}
                >
                  {blockCustomerLoading
                    ? isBlocked
                      ? 'Unblocking...'
                      : 'Blocking...'
                    : isBlocked
                    ? 'Unblock Customer'
                    : 'Block Customer'}
                </button>
              ) : (
                <span className="text-muted">Not applicable</span>
              )}
            </div>
          </li>
          {type === 'refunds' && (
            <>
              {currentRefundData && (
                <RefundModal
                  open={true}
                  data={currentRefundData}
                  handleRefundModalClose={() => setCurrentRefundData(null)}
                  postRefund={payload =>
                    new Promise((resolve, reject) => {
                      dispatch({
                        type: 'refunds/CREATE_REFUND',
                        payload,
                        onSuccess: resolve,
                        onError: reject,
                      })
                    })
                  }
                />
              )}
              {isFullyRefunded(data) ? (
                <li className={`${style.item} text-muted`}>
                  <div className="text-uppercase mb-1">Refund</div>
                  <div className="text-nowrap d-inline-block">
                    <span className="badge badge-success font-size-14">Refunded</span>
                  </div>
                </li>
              ) : (
                <li className={`${style.item} text-muted`}>
                  <div className="text-uppercase mb-1">Refund</div>
                  <div className="text-nowrap d-inline-block">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handleRefundModalOpen(data)}
                    >
                      Issue Refund
                    </button>
                  </div>
                </li>
              )}
            </>
          )}
        </ul>
      )}
    </Card>
  )
}

export default Header
