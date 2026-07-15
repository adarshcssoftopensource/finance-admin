import React from 'react'
import moment from 'moment'
import { getAmountToDisplay } from 'components/app/helper'
/* eslint-disable */
function index({ data }) {
  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="mb-0">
          <div
            style={{
              width: '100%',
              background: '#eceff4',
              color: '#514d6a',
              borderRadius: '5px',
            }}
          >
            <div style={{ maxWidth: '100%', margin: '0px auto', fontSize: '14px' }}>
              <div style={{ padding: '40px 40px 20px 40px', background: '#fff' }}>
                <table cellPadding="0" cellSpacing="0" style={{ width: '100%', border: '0px' }}>
                  <tbody>
                    <tr>
                      <td>
                        <h2
                          style={{
                            marginBottom: '20px',
                            color: '#24222f',
                            fontWeight: '600',
                          }}
                        >
                          Payment for {data.paymentType}
                        </h2>
                        <p>
                          <span style={{ color: '#a09bb9' }}>
                            {moment(data.paymentDate).format('MMM D, YYYY @ h:mm A')}
                          </span>
                        </p>
                        <br />
                        <div className="row">
                          <div className="col-12 col-md-6">
                            <h5
                              style={{
                                marginBottom: '20px',
                                color: '#24222f',
                                fontWeight: '600',
                              }}
                            >
                              Payment Details
                            </h5>
                            <table
                              cellPadding="0"
                              cellSpacing="0"
                              style={{ width: '100%', border: '0px' }}
                            >
                              <tbody>
                                <tr>
                                  <td
                                    style={{
                                      textAlign: 'left',
                                      padding: '10px 10px 10px 0px',
                                      borderTop: '1px solid #d9d7e0',
                                    }}
                                  >
                                    Amount
                                  </td>
                                  <td
                                    style={{
                                      width: '10%',
                                      textAlign: 'center',
                                      padding: '10px 10px',
                                      borderTop: '1px solid #d9d7e0',
                                    }}
                                  />
                                  <td
                                    style={{
                                      width: '30%',
                                      textAlign: 'right',
                                      padding: '10px 0px 10px 10px',
                                      whiteSpace: 'nowrap',
                                      borderTop: '1px solid #d9d7e0',
                                    }}
                                  >
                                    {getAmountToDisplay(
                                      data.currency,
                                      !!data.amountBreakup ? data.amountBreakup.total : data.amount,
                                    )}
                                  </td>
                                </tr>
                                <tr style={{ color: '#a09bb9' }}>
                                  <td
                                    style={{
                                      textAlign: 'left',
                                      padding: '10px 10px 10px 0px',
                                      borderTop: '1px solid #d9d7e0',
                                    }}
                                  >
                                    Fee
                                  </td>
                                  <td
                                    style={{
                                      width: '10%',
                                      textAlign: 'center',
                                      padding: '10px 10px',
                                      borderTop: '1px solid #d9d7e0',
                                    }}
                                  />
                                  <td
                                    style={{
                                      width: '20%',
                                      textAlign: 'right',
                                      padding: '10px 0px 10px 10px',
                                      whiteSpace: 'nowrap',
                                      borderTop: '1px solid #d9d7e0',
                                    }}
                                  >
                                    {getAmountToDisplay(data.currency, data.amountBreakup.fee)}
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    style={{
                                      textAlign: 'left',
                                      padding: '10px 10px 10px 0px',
                                      borderTop: '3px solid #514d6a',
                                    }}
                                  >
                                    <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
                                      Total
                                    </span>
                                  </td>
                                  <td
                                    style={{
                                      width: '10%',
                                      textAlign: 'center',
                                      padding: '10px 10px',
                                      borderTop: '3px solid #514d6a',
                                    }}
                                  />
                                  <td
                                    style={{
                                      width: '20%',
                                      textAlign: 'right',
                                      padding: '10px 0px 10px 10px',
                                      whiteSpace: 'nowrap',
                                      borderTop: '3px solid #514d6a',
                                    }}
                                  >
                                    <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
                                      {data.status != 'REFUNDED' ? (
                                        <>
                                          {getAmountToDisplay(
                                            data.currency,
                                            !!data.amountBreakup
                                              ? data.amountBreakup.total - data.amountBreakup.fee
                                              : data.amount,
                                          )}
                                        </>
                                      ) : (
                                        <span>
                                          <strong>
                                            {' '}
                                            (Refunded){' '}
                                            <strike>
                                              {getAmountToDisplay(
                                                data.currency,
                                                data.amountBreakup.total - data.amountBreakup.fee,
                                              )}
                                            </strike>
                                          </strong>
                                        </span>
                                      )}
                                    </span>
                                  </td>
                                </tr>
                                {data.status == 'REFUNDED' && (
                                  <tr>
                                    <td
                                      style={{
                                        textAlign: 'left',
                                        padding: '10px 10px 10px 0px',
                                        borderTop: '3px solid #514d6a',
                                      }}
                                    >
                                      <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
                                        Refund
                                      </span>
                                    </td>
                                    <td
                                      style={{
                                        width: '10%',
                                        textAlign: 'center',
                                        padding: '10px 10px',
                                        borderTop: '3px solid #514d6a',
                                      }}
                                    />
                                    <td
                                      style={{
                                        width: '20%',
                                        textAlign: 'right',
                                        padding: '10px 0px 10px 10px',
                                        whiteSpace: 'nowrap',
                                        borderTop: '3px solid #514d6a',
                                      }}
                                    >
                                      <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
                                        {getAmountToDisplay(
                                          data.currency,
                                          data.amountBreakup.total,
                                        )}
                                      </span>
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                          <div className="col-12 col-md-6">
                            <h5
                              style={{
                                marginBottom: '20px',
                                color: '#24222f',
                                fontWeight: '600',
                              }}
                            >
                              Payout Details
                            </h5>
                            <table
                              cellPadding="0"
                              cellSpacing="0"
                              style={{ width: '100%', border: '0px' }}
                            >
                              <tbody>
                                <tr>
                                  <td
                                    style={{
                                      textAlign: 'left',
                                      padding: '10px 10px 10px 0px',
                                      borderTop: '1px solid #d9d7e0',
                                      whiteSpace: 'nowrap',
                                      verticalAlign: 'top',
                                    }}
                                  >
                                    Customer
                                  </td>
                                  <td
                                    style={{
                                      width: '50%',
                                      padding: '10px 0px 10px 10px',
                                      borderTop: '1px solid #d9d7e0',
                                    }}
                                  >
                                    {data.card && data.card.type ? (
                                      <>
                                        {data.card.cardHolderName}
                                        <br />
                                        {data.card.type}
                                        <br />
                                        Ending in *{data.card.number}
                                        <br />
                                        Expiring {data.card.expiryMonth}/{data.card.expiryYear}
                                      </>
                                    ) : data.bank && data.bank.name ? (
                                      <>
                                        {data.bank.name}
                                        <br />
                                        {data.bank.type}
                                        <br />
                                        Ending in *{data.bank.number}
                                      </>
                                    ) : (
                                      <>Not Connected</>
                                    )}
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    style={{
                                      textAlign: 'left',
                                      padding: '10px 10px 10px 0px',
                                      borderTop: '1px solid #d9d7e0',
                                      whiteSpace: 'nowrap',
                                      verticalAlign: 'top',
                                    }}
                                  >
                                    Business
                                  </td>
                                  <td
                                    style={{
                                      width: '50%',
                                      padding: '10px 0px 10px 10px',
                                      borderTop: '1px solid #d9d7e0',
                                    }}
                                  >
                                    Visa
                                    <br />
                                    Ending in *7643
                                    <br />
                                    Expiring 08/2020
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default index
