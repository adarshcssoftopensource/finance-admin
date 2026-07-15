import React from 'react'
import Card from 'components/app/card'
import { walletStatus } from 'components/app/CommonTableFormatter/debitCardTableFormatter'
import { ArrowRightOutlined } from '@ant-design/icons'
import Title from './title'
import { formateDate } from '../helper'

const CardHistory = ({ data }) => {
  return (
    <Card>
      <Title>Card History</Title>
      {data.length ? (
        <div>
          {data.map(val => (
            <div className="mt-3">
              <div className="d-flex justify-content-between mt-2 mb-3">
                <div>
                  <span className="mr-3">{walletStatus(val)}</span>
                  <ArrowRightOutlined />
                  <span className="ml-3">{walletStatus(val, 'newStatus')}</span>
                </div>
                <span>{formateDate(val.updatedAt, 'MMM D, YYYY @ h:mm A')}</span>
              </div>
              <span className="bold">{val.remarks}</span>
              <div className="dropdown-divider" />
            </div>
          ))}
        </div>
      ) : (
        <div className="d-flex flex-wrap justify-content-center my-5">No Card History</div>
      )}
    </Card>
  )
}

export default CardHistory
