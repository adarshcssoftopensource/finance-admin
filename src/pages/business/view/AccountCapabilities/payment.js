/* eslint-disable */
import React from 'react'
import { isEmpty } from 'lodash'
import Card from 'components/app/card'
import Title from '../../../../components/app/detailsComponents/title'

function PaymentCapabilities({ data, enabled }) {
  const renderStatus = dataStatus => {
    if (dataStatus) {
      return <sup className={`text-capitalize badge badge-success font-size-14`}>Enabled</sup>
    }
    return <sup className={`text-capitalize badge badge-danger font-size-14`}>Disabled</sup>
  }

  return (
    <Card>
      <Title>Payment Capabilities {renderStatus(enabled || false)}</Title>
      <div className="col-12 pl-0">
        <div className="table-responsive">
          {data && !isEmpty(data) ? (
            <table className="table table-borderless">
              <tbody>
                {data?.current_issues.map(issue => {
                  return Object.keys(issue)
                    .filter(i => i !== 'target')
                    .map(item => {
                      return (
                        <>
                          {item !== 'errant_fields' ? (
                            <tr>
                              <td className="text-gray-6 pl-0 pb-0">
                                {item === 'issue_type' ? 'Issue Type' : item}
                              </td>
                              <td className="pr-0 text-dark pb-0 text-right">
                                {Array.isArray(issue[item]) ? (
                                  <ul>
                                    {issue[item].map(i => (
                                      <li>{i}</li>
                                    ))}
                                  </ul>
                                ) : item === 'errant_fields' ? (
                                  ''
                                ) : (
                                  issue[item]
                                )}
                              </td>
                            </tr>
                          ) : null}
                          {item === 'errant_fields'
                            ? Object.keys(issue[item]).map(i => (
                                <tr>
                                  <td className="text-gray-6 pl-0 pb-0">{i}</td>
                                  <td className="pr-0 text-dark pb-0 text-right">
                                    {Array.isArray(issue[item][i]) ? (
                                      <ul>
                                        {issue[item][i].map(listItem => (
                                          <li>{listItem}</li>
                                        ))}
                                      </ul>
                                    ) : (
                                      issue[item][i]
                                    )}
                                  </td>
                                </tr>
                              ))
                            : null}
                        </>
                      )
                    })
                })}
              </tbody>
            </table>
          ) : (
            <div className="d-flex flex-wrap justify-content-center my-5">No Details Available</div>
          )}
        </div>
      </div>
    </Card>
  )
}

export default PaymentCapabilities
