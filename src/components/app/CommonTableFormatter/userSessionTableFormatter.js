import React from 'react'
import { Button } from 'antd'
import { capitalize } from 'lodash'

const getColumns = signeOutUser => {
  return [
    {
      title: <span className="text-ele">Location</span>,
      width: '30%',
      key: 'location',
      render: row => <span className="text-ele">{row.location}</span>,
    },
    {
      title: <span className="text-ele">OS Name</span>,
      width: '20%',
      key: 'osName',
      render: row => (
        <span className="text-ele">{row.osName === 'ios' ? 'iOS' : capitalize(row.osName)}</span>
      ),
    },
    {
      title: <span className="text-ele">Device</span>,
      width: '10%',
      key: 'browserName',
      render: row => <span className="badge badge-success font-size-12">{row.browserName}</span>,
    },
    {
      title: <span className="text-ele">IP ADDRESS</span>,
      width: '20%',
      key: 'ipAddress',
      render: row => <span className="text-ele">{row.ipAddress}</span>,
    },
    {
      title: <span className="text-ele">Action</span>,
      key: '_id',
      // eslint-disable-next-line no-underscore-dangle
      render: row => <Button onClick={() => signeOutUser(row._id)}>SIGN OUT</Button>,
      width: '20%',
    },
  ]
}

export default getColumns
