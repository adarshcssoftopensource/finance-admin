import React from 'react'
import style from './style.module.scss'

const index = ({ data, type }) => {
  return (
    <div>
      <div className="mb-3">
        {/* <div className="bg-success text-white text-uppercase px-3 py-1 mb-2">
          Today - 7 may 2019
        </div> */}
        <div className="table-responsive">
          <table className="table table-borderless text-gray-6 mb-0">
            <tbody>
              <tr>
                <td className="bg-success text-white text-uppercase px-3 py-1 mb-2">
                  {type} Registration
                </td>
                <td className="text-right bg-success text-white text-uppercase px-3 py-1 mb-2">
                  <strong>{data.total}</strong>
                </td>
              </tr>
              <tr>
                <td className="text-nowrap">
                  <div className={`${style.donut} ${style.danger} mr-3`} />
                  Yesterday
                </td>
                <td className="text-right">
                  <strong>{data.yesterday}</strong>
                </td>
              </tr>
              <tr>
                <td className="text-nowrap">
                  <div className={`${style.donut} ${style.primary} mr-3`} />
                  This Week
                </td>
                <td className="text-right">
                  <strong>{data.thisWeek}</strong>
                </td>
              </tr>
              <tr>
                <td className="text-nowrap">
                  <div className={`${style.donut} ${style.success} mr-3`} />
                  Last Week
                </td>
                <td className="text-right">
                  <strong>{data.lastWeek}</strong>
                </td>
              </tr>
              <tr>
                <td className="text-nowrap">
                  <div className={`${style.donut} ${style.info} mr-3`} />
                  This Month
                </td>
                <td className="text-right">
                  <strong>{data.thisMonth}</strong>
                </td>
              </tr>
              <tr>
                <td className="text-nowrap">
                  <div className={`${style.donut} ${style.orange} mr-3`} />
                  Last Month
                </td>
                <td className="text-right">
                  <strong>{data.lastMonth}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default index
