import React, { useState } from 'react'
import getColumns from 'components/app/CommonTableFormatter/paymentsTableFormatter'
import Modal from 'pages/common/helper/modal'
import Table from 'components/app/table'
/* eslint-disable */

function PaymentsTable({ data, loading, pageSize, total, current, onPaginationChange }) {
  const [visible, setVisible] = useState(false)
  const [renderModalContent, setRenderModalContent] = useState(null)

  const openModal = row => {
    if (row.rawChargeResponse) {
      let modalData
      modalData = {
        type: 'stripe',
        title: 'Details',
        data: JSON.stringify(JSON.parse(row.rawChargeResponse), undefined, 4),
      }
      setRenderModalContent(modalData)
    } else {
      let modalData
      modalData = {
        type: 'stripe',
        title: 'Details',
        data: JSON.stringify({ message: 'No raw data' }, undefined, 4),
      }
      setRenderModalContent(modalData)
    }
    setVisible(true)
  }
  const closeModal = () => {
    setVisible(false)
  }
  let columns = getColumns(openModal)
  return (
    <div className="card-body p-0">
      <div className="text-nowrap">
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          pageSize={pageSize}
          total={total}
          current={current}
          onPaginationChange={(currentPage, size) => onPaginationChange(currentPage, size)}
        />
        {/* Modal for Raw data */}
        <Modal renderModalContent={renderModalContent} visible={visible} closeModal={closeModal} />
      </div>
    </div>
  )
}

export default PaymentsTable
