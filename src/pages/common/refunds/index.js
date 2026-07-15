import React from 'react'
import getColumns from 'components/app/CommonTableFormatter/refundsTableFormatter'
import Table from 'components/app/table'
/* eslint-disable */

function index({ data, loading, pageSize, total, current, onPaginationChange }) {
  let columns = getColumns()
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
      </div>
    </div>
  )
}

export default index
