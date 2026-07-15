import React from 'react'
import { Link } from 'react-router-dom'
import { Tooltip } from 'antd'
import CopyToClipboard from 'components/app/copyToClipboard'

/* eslint-disable */
const getColumns = () => {
  return [
    {
      title: <span className="text-ele">Country ID</span>,
      width: '20%',
      key: 'id',
      ellipsis: {
        showTitle: false,
      },
      render: row => (
        <>
          <span className="d-flex align-items-center">
            <CopyToClipboard value={row._id} textMessage="Country Id copied to clipboard" />
            <span className="pl-1 text-ele">{row.countryId}</span>
          </span>
        </>
      ),
    },
    {
      title: <span className="text-ele">Country Name</span>,
      width: '15%',
      dataIndex: '',
      key: 'CountryName',
      render: row => <span className="text-ele">{row.name}</span>,
    },
    {
      title: <span className="text-ele">Phone Code</span>,
      width: '10%',
      dataIndex: '',
      key: 'phoneCode',
      render: row => <span className="text-ele">{row.phoneCode}</span>,
    },
    {
      title: <span className="text-ele">Sort Name</span>,
      width: '10%',
      dataIndex: '',
      key: 'sortname',
      render: row => <span className="text-ele">{row.sortname}</span>,
    },
    {
      title: <span className="text-ele">Is Onboarding Applicable</span>,
      width: '10%',
      dataIndex: '',
      key: 'isOnboardingApplicable',
      render: row => <span className="text-ele">{row.isOnboardingApplicable ? 'Yes' : 'No'}</span>,
    },
    {
      title: <span className="text-ele">Providers Supported</span>,
      width: '10%',
      dataIndex: '',
      key: 'providerName',
      render: row => <span className="text-ele text-capitalize">{row.providerName || ''}</span>,
    },
    {
      title: <span className="text-ele">Bank Supported</span>,
      width: '10%',
      dataIndex: '',
      key: 'bankSupported',
      render: row => <span className="text-ele">{row.bankSupported ? 'Yes' : 'No'}</span>,
    },
    {
      title: <span className="text-ele">Is AliPay Supported</span>,
      width: '10%',
      dataIndex: '',
      key: 'isAliPaySupported',
      render: row => <span className="text-ele">{row.isAliPaySupported ? 'Yes' : 'No'}</span>,
    },
    {
      title: <span className="text-ele">Is WeChatPay Supported</span>,
      width: '10%',
      dataIndex: '',
      key: 'isWeChatPaySupported',
      render: row => <span className="text-ele">{row.isWeChatPaySupported ? 'Yes' : 'No'}</span>,
    },
    {
      title: <span className="text-ele">Action</span>,
      key: '_id',
      render: row => (
        <span>
          <Tooltip placement="bottom" title={'Edit Country'}>
            <Link to={`/countries/${row._id}`} className="btn btn-sm btn-light mr-2 py-0">
              <i className="fe fe-edit align-middle" />
            </Link>
          </Tooltip>
        </span>
      ),
      width: '15%',
    },
  ]
}

export default getColumns
