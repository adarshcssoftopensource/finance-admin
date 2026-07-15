import React from 'react'
import Card from 'components/app/card'
/* eslint-disable */

const header = ({ data }) => {
  const renderStatus = status => {
    let statusObj = {
      class: 'default',
    }
    if (status === 'overdue') {
      statusObj = {
        class: 'danger',
      }
    } else if (status === 'saved') {
      statusObj = {
        class: 'default',
      }
    } else if (status === 'draft') {
      statusObj = {
        class: 'light',
      }
    } else if (status === 'paid') {
      statusObj = {
        class: 'success',
      }
    } else if (status === 'partial') {
      statusObj = {
        class: 'alert',
      }
    } else if (status === 'sent') {
      statusObj = {
        class: 'info',
      }
    } else if (status === 'viewed') {
      statusObj = {
        class: 'warning',
      }
    }
    return <span className={`font-size-12 badge badge-${statusObj.class}`}>{status}</span>
  }

  return (
    <Card>
      <div className="text-nowrap text-dark font-size-30 font-weight-bold">
        {data?.name} #{data?.invoiceNumber}
        <span
          className="font-weight-bold text-dark font-size-14 ml-2"
          style={{ verticalAlign: 'middle' }}
        >
          {renderStatus(data?.status)}
        </span>
      </div>
    </Card>
  )
}

export default header
