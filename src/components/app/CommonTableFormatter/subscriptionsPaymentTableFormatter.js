import React from 'react'
import CopyToClipboard from 'components/app/copyToClipboard'
import { formateDate, renderPaymentMethod } from 'components/app/helper'
/* eslint-disable */
const getColumns = () => {
  return [
    {
      title: <span className="text-ele">Status</span>,
      dataIndex: '',
      key: '_id',
      ellipsis: {
        showTitle: false,
      },
      render: row => renderStatus(row.status),
      width: 80,
    },
    {
      title: <span className="text-ele">Billing Id</span>,
      key: 'paymentId',
      dataIndex: 'paymentId',
      ellipsis: {
        showTitle: false,
      },
      render: paymentId => (
        <span className="d-flex align-items-center">
          <CopyToClipboard value={paymentId} />
          <span className="pl-1 text-ele"> {paymentId} </span>
        </span>
      ),
      width: 120,
    },
    {
      title: <span className="text-ele">Plan Name</span>,
      key: 'planTitle',
      dataIndex: 'planTitle',
      width: 100,
    },
    {
      title: <span className="text-ele">Charge Date</span>,
      dataIndex: 'paymentDate',
      key: 'paymentDate',
      render: paymentDate => (
        <span className="text-ele">{`${formateDate(paymentDate, 'DD MMM YYYY')}`}</span>
      ),
      width: 100,
    },
    {
      title: <span className="text-ele">Duration</span>,
      dataIndex: '',
      key: 'endDate',
      render: row => (
        <span className="text-ele">{`${formateDate(row.startDate, 'DD MMM YYYY')} - ${formateDate(
          row.endDate,
          'DD MMM YYYY',
        )}`}</span>
      ),
      width: 200,
    },
    {
      title: <span className="text-ele">Card</span>,
      dataIndex: '',
      key: 'card',
      ellipsis: {
        showTitle: false,
      },
      render: row => <span className="text-ele">{renderPaymentMethod(row)}</span>,
      width: 120,
    },
    // {
    //   title: <span className="text-ele">Action</span>,
    //   key: '_id',
    //   dataIndex: '_id',
    //   render: _id => (
    //     <span>
    //       <Tooltip placement="bottom" title={'View Details'}>
    //         <Link to={`/subscriptions/${_id}`} className="btn btn-sm btn-light mr-2 py-0">
    //           <i className="fe fe-eye align-middle" />
    //         </Link>
    //       </Tooltip>
    //     </span>
    //   ),
    //   width: 80,
    // },
  ]
}

const renderStatus = status => {
  let statusObj = {
    class: 'danger',
  }
  if (status === 'Success') {
    statusObj = {
      class: 'success',
    }
  }
  return <span className={`font-size-12 badge badge-${statusObj.class}`}>{status}</span>
}

export default getColumns
