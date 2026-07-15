import React from 'react'
import { connect } from 'react-redux'
import { Modal, Switch, Tooltip, Spin, Button } from 'antd'
import { get as _get } from 'lodash'
import Card from 'components/app/card'
import { formateDate, renderPaymentMethod } from 'components/app/helper'
import CardHistory from '../walletHistory'

const { confirm } = Modal
/* eslint-disable */

const mapStateToProps = ({ dispatch, router, debitCards }) => ({
  debitCards,
  dispatch,
  router,
})

const DebitCard = ({ cards, cardType, dispatch, debitCards, router: { location } }) => {
  const renderStatus = status => {
    let statusObj = {
      class: 'default',
    }
    if (status === 'active') {
      statusObj = {
        class: 'success',
      }
    } else if (status === 'inactive' || status === 'blocked' || status === 'canceled') {
      statusObj = {
        class: 'danger',
      }
    }
    return (
      <sup className={`text-capitalize badge badge-${statusObj.class} font-size-14`}>
        {status === 'active'
          ? 'Active'
          : status === 'canceled'
          ? 'Canceled'
          : status === 'blocked'
          ? 'Blocked'
          : 'InActive'}
      </sup>
    )
  }

  const splitId = () => location.pathname.split('/debit-card-wallets/')[1]

  const handleCardsStatusChange = async (debitCardId, cardStatus) => {
    dispatch({
      type: 'debitCards/CHANGE_DEBIT_CARD_STATUS',
      payload: {
        debitCardId,
        status: cardStatus,
        walletId: splitId(),
      },
    })
  }

  const changeCardStatus = card => {
    const cardStatus =
      card.status === 'blocked'
        ? 'active'
        : card.status === 'active' || card.status === 'inactive'
        ? 'blocked'
        : ''
    confirm({
      title: `Are you sure you want to ${cardStatus} this business debit card?`,
      content: '',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleCardsStatusChange(card.id, cardStatus)
      },
      onCancel() {},
    })
  }

  const handleReplaceDebitCard = (debitCardId, status, businessId) => {
    dispatch({
      type: 'debitCards/REPLACE_DEBIT_CARD',
      payload: {
        debitCardId,
        walletId: splitId(),
        businessId,
        status,
      },
    })
  }

  const replaceDebitCard = card => {
    confirm({
      title: `Are you sure you want to Replace this business debit card?`,
      content: '',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleReplaceDebitCard(card.id, 'replace', card.businessId)
      },
      onCancel() {},
    })
  }

  const cancelDebitCard = card => {
    confirm({
      title: `Are you sure you want to Cancel this business debit card?`,
      content: '',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleReplaceDebitCard(card.id, 'cancel', card.businessId)
      },
      onCancel() {},
    })
  }

  return (
    <Spin spinning={_get(debitCards, 'loading', false)} delay={500}>
      <div className="row">
        {cards.length ? (
          cards.map(card => (
            <div className="col-12 col-sm-6" key={card.id}>
              <Card>
                <div className="table-responsive">
                  <table className="table table-borderless">
                    <tbody>
                      <tr>
                        <td className="text-gray-6 pl-0 pb-0">Number</td>
                        <td className="pr-0 text-dark pb-0 text-right">
                          {renderPaymentMethod({
                            card: { type: card.brand.toLowerCase(), number: card.cardNumber },
                            method: 'card',
                          })}
                        </td>
                      </tr>
                      <tr>
                        <td className="text-gray-6 pl-0 pb-0">Status</td>
                        <td className="pr-0 text-dark pb-0 text-right">
                          {renderStatus(card.status)}
                        </td>
                      </tr>
                      <tr>
                        <td className="text-gray-6 pl-0 pb-0">Created Date</td>
                        <td className="pr-0 text-dark pb-0 text-right">
                          {formateDate(card.createdAt, 'MMM D, YYYY @ h:mm A')}
                        </td>
                      </tr>
                      <tr>
                        <td className="text-gray-6 pl-0 pb-0">Card Type</td>
                        <td className="pr-0 text-dark pb-0 text-right">{card.cardType}</td>
                      </tr>
                      <tr>
                        <td className="text-gray-6 pl-0 pb-0">Card Id</td>
                        <td className="pr-0 text-dark pb-0 text-right">{card.id}</td>
                      </tr>
                      <tr>
                        <td className="text-gray-6 pl-0 pb-0">Card Id</td>
                        <td className="pr-0 text-dark pb-0 text-right">
                          {_get(card, 'stripe.cardId', '')}
                        </td>
                      </tr>
                      <tr>
                        <td className="text-gray-6 pl-0 pb-0">Block/UnBlock Card</td>
                        <td className="pr-0 text-dark pb-0 text-right">
                          <Tooltip placement="bottom" title={'Block/UnBlock Cards'}>
                            <Switch
                              checkedChildren={<span>On</span>}
                              unCheckedChildren={<span>Off</span>}
                              checked={
                                card.status === 'blocked' || card.status === 'inactive'
                                  ? false
                                  : true
                              }
                              onClick={() => changeCardStatus(card)}
                              disabled={card.status === 'canceled'}
                            />
                          </Tooltip>
                        </td>
                      </tr>
                      <tr>
                        <td className="text-gray-6 pl-0 pb-0"></td>
                        <td className="pr-0 text-dark pb-0 text-right">
                          <Tooltip placement="bottom" title={'Replace Debit Card'}>
                            <Button
                              type="default"
                              onClick={() => replaceDebitCard(card)}
                              className="mr-2"
                              size="middle"
                              disabled={card.status === 'canceled'}
                            >
                              Replace Debit Card
                            </Button>
                          </Tooltip>
                        </td>
                      </tr>
                      <tr>
                        <td className="text-gray-6 pl-0 pb-0"></td>
                        <td className="pr-0 text-dark pb-0 text-right">
                          <Tooltip placement="bottom" title={'Cancel Debit Card'}>
                            <Button
                              type="default"
                              onClick={() => cancelDebitCard(card)}
                              className="mr-2"
                              size="middle"
                              disabled={card.status === 'canceled'}
                            >
                              Cancel Debit Card
                            </Button>
                          </Tooltip>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <CardHistory data={card.history || []} />
                </div>
              </Card>
            </div>
          ))
        ) : (
          <div className="col-12 pl-0 py-4 mt-2">
            <div className="d-flex flex-wrap justify-content-center my-5 pb-5">
              No {cardType} Card
            </div>
          </div>
        )}
      </div>
    </Spin>
  )
}

export default connect(mapStateToProps)(DebitCard)
