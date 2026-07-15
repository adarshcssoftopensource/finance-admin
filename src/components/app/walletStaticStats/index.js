import React from 'react'
import style from '../dashboardStaticStats/style.module.scss'

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
                  {type} Wallets
                </td>
                <td className="text-right bg-success text-white text-uppercase px-3 py-1 mb-2">
                  <strong>{data?.walletCount.toLocaleString()}</strong>
                </td>
              </tr>
              <tr>
                <td className="text-nowrap">
                  <div className={`${style.donut} ${style.danger} mr-3`} />
                  Total Virtual cards
                </td>
                <td className="text-right">
                  <strong>{data?.virtualDebitCards?.toLocaleString()}</strong>
                </td>
              </tr>
              <tr>
                <td className="text-nowrap">
                  <div className={`${style.donut} ${style.primary} mr-3`} />
                  Total Physical cards
                </td>
                <td className="text-right">
                  <strong>{data?.physicalDebitCards?.toLocaleString()}</strong>
                </td>
              </tr>
              <tr>
                <td className="text-nowrap">
                  <div className={`${style.donut} ${style.success} mr-3`} />
                  Total Wallet balance
                </td>
                <td className="text-right">
                  <strong>${Number(data?.walletBalance)?.toLocaleString()}</strong>
                </td>
              </tr>
              <tr>
                <td className="text-nowrap">
                  <div className={`${style.donut} ${style.info} mr-3`} />
                  Total platform issuing balance
                </td>
                <td className="text-right">
                  <strong>${data?.stripeIssuingBalance.toLocaleString()}</strong>
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
