import React from 'react'
import CopyToClipboard from 'components/app/copyToClipboard'
/* eslint-disable */
const getColumns = () => {
  return [
    {
      title: <span className="text-ele">Plan ID</span>,
      width: '15%',
      dataIndex: '',
      key: 'planId',
      render: row => (
        <span className="d-flex align-items-center">
          <CopyToClipboard
            value={row?.planId}
            textMessage="Subscription Plan ID copied to clipboard"
          />
          <span className="text-ele">{row.planId}</span>
        </span>
      ),
    },
    {
      title: <span className="text-ele">Name</span>,
      width: '15%',
      dataIndex: '',
      key: 'title',
      render: row => <span className="text-ele">{row?.title}</span>,
    },
    {
      title: <span className="text-ele">Multiplier</span>,
      width: '15%',
      dataIndex: '',
      key: 'multiplier',
      render: row => <span className="text-ele">{row?.multiplier}</span>,
    },
  ]
}

export default getColumns
