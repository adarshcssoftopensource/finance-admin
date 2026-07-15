import React from 'react'
import { Table } from 'antd'
/* eslint-disable */
const index = ({
  columns,
  dataSource,
  loading,
  pageSize = 100,
  total = 100,
  current,
  onPaginationChange,
  onChange,
  rowKey,
  rowSelection,
  expandable = {},
  defaultPagination,
  scroll = {},
}) => {
  return (
    <>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        size="small"
        rowKey={rowKey || '_id'}
        onChange={onChange}
        expandable={expandable}
        scroll={scroll}
        pagination={
          defaultPagination
            ? true
            : {
                pageSizeOptions: ['100', '200', '500'],
                pageSize,
                total,
                current,
                showTotal: (total, range) => `${range[0]} - ${range[1]} of ${total} items`,
                onShowSizeChange: (currentPage, size) => onPaginationChange(currentPage, size),
                onChange: (page, cuPageSize) => onPaginationChange(page, cuPageSize),
              }
        }
      />
    </>
  )
}

export default index
