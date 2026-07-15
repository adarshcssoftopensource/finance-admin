import React from 'react'
import Card from 'components/app/card'
import { formateDate } from 'components/app/helper'
import Title from '../title'

function TrialDetail({ data }) {
  return (
    <Card>
      <Title>Trial Details</Title>
      {data && data.trial && (
        <div className="col-12 pl-0 pb-5">
          <div className="table-responsive pb-5">
            <table className="table table-borderless mb-4">
              <tbody>
                <tr>
                  <td className="text-gray-6 pl-0 pb-0">Active</td>
                  <td className="pr-0 text-dark pb-0 text-right">
                    {data.trial.isTrial ? 'Yes' : 'No'}
                  </td>
                </tr>
                <tr>
                  <td className="text-gray-6 pl-0 pb-0">Start Date</td>
                  <td className="pr-0 text-dark pb-0 text-right">
                    {data.trial.startDate ? formateDate(data.trial.startDate) : '--'}
                  </td>
                </tr>
                <tr>
                  <td className="text-gray-6 pl-0 pb-0">End Date</td>
                  <td className="pr-0 text-dark pb-0 text-right">
                    {data.trial.endDate ? formateDate(data.trial.endDate) : '--'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Card>
  )
}

export default TrialDetail
