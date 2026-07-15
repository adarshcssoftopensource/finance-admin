import React from 'react'
import { Tooltip } from 'antd'
import { Button } from 'reactstrap'
import { Link } from 'react-router-dom'

/* eslint-disable */
const getColumns = (sendPushNotification, deletePushNotification, locationState) => {
  return [
    {
      title: <span className="text-ele">Title</span>,
      width: '20%',
      key: 'title',
      render: row => <span className="text-ele">{row.title}</span>,
    },
    {
      title: <span className="text-ele">Description</span>,
      width: '20%',
      key: 'description',
      render: row => <span className="text-ele text-capitalize">{row.description}</span>,
    },
    {
      title: <span className="text-ele">Notification Type</span>,
      width: '10%',
      key: 'notificationType',
      render: row => <span className="badge badge-info font-size-12">{row.notificationType}</span>,
    },
    {
      title: <span className="text-ele">Action</span>,
      key: 'action',
      render: row => (
        <span>
          <Tooltip placement="bottom" title="Send Push Notification">
            <Button
              outline
              color="primary"
              className="btn btn-sm"
              onClick={() => sendPushNotification(row)}
            >
              Send Push Notification
            </Button>
          </Tooltip>
          <Tooltip placement="bottom" title={'Edit Push Notification'}>
            <Link
              to={{
                pathname: `/push-notifications/${row._id}`,
                state: {
                  deviceIds: locationState,
                },
              }}
              className="btn btn-sm btn-light ml-2 mr-2 py-0"
            >
              <i className="fe fe-edit align-middle" />
            </Link>
          </Tooltip>
          <Tooltip placement="bottom" title={'Delete Push Notification'}>
            <a
              href="javascript:void(0);"
              onClick={() => deletePushNotification(row._id)}
              className="btn btn-sm btn-light mr-2 py-0"
            >
              <i className="fe fe-trash align-middle" />
            </a>
          </Tooltip>
        </span>
      ),
      width: '10%',
    },
  ]
}

export default getColumns
