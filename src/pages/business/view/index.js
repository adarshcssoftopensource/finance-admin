/* eslint-disable */
import React, { useCallback, useEffect, useState } from 'react'
import { get as _get } from 'lodash'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import { Modal as ReactModal, ModalBody, ModalHeader } from 'reactstrap'
import qs from 'qs'
import { activeDeactiveUsers } from 'services/business'
import { Button, Input, Modal as RootModal, Spin, Tabs } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import Card from 'components/app/card'
import { formateDate } from 'components/app/helper'
import CopyToClipboard from 'components/app/copyToClipboard'
import PromotionalModal from 'components/app/promotionalEmailModal'
import GeneratePasswordModal from 'components/app/generatePasswordModal'
import ExportButton from 'components/app/exportButton'
import Payments from 'pages/common/Payments'
import Subscription from 'pages/common/subscription'
import { providerIcons } from 'components/app/CommonTableFormatter/businessTableFormatter'
import ProviderFilter from 'components/app/providerFilter'
import DelegatedUser from './DelegatedUser'
import Modal from '../helper/modal'
import TopHeader from './TopHeader'
import GeneralDetails from './GeneralDetails'
import ProcessingFee from './ProcessingFee/ProcessingFee'
import style from '../style.module.scss'
import ChangeRequests from './ChangeRequests/ChangeRequests'
import ChangeSubscription from './ChangeSubscription/ChangeSubscription'
import PaymentOnboarding from './PaymentOnboarding'
import AccountCapabilities from './AccountCapabilities'
import AdjustmentRewardPoints from './AdjustRewardPoints'
import RewardEarnHistory from './RewardEarnHistory'
import MigrateDataFromPeymynt from './MigrateDataFromPeymynt'
import { activeDeactiveUser } from '../../../services/allUsers'
import WebhookLogs from './LogsHistory/WebhookLogs'
import ErrorLogs from './LogsHistory/ErrorLogs'
import VerifcationDocuments from '../../documents/list'
import PayByBankProvider from './PayByBankProvider'
import BuyNowPayLater from './BuyNowPayLater'
import UpdateBusinessName from './updateBusinessName'
import UpdateBusinessType from './updateBusinessType'
import DeleteMerchant from './deleteMerchant'
import ToggleStripeAccount from './ToggleStripeAccount'
import AddCredits from './AddCredits'
import SalesAgent from './SalesAgent/SalesAgent'
import UpdatePaymentLimits from './paymentLimit'
import TransferReversal from './TransferReversal'

const { confirm } = RootModal
const { TabPane } = Tabs
const mapStateToProps = ({
  business,
  allUsers,
  dispatch,
  router,
  payments,
  subscriptions,
  rewards,
}) => ({
  allUsers,
  payments,
  subscriptions,
  rewards,
  business,
  dispatch,
  router,
})

const toProviderArray = value => {
  if (Array.isArray(value)) {
    return value.filter(p => typeof p === 'string' && p.trim())
  }
  if (typeof value === 'string' && value.trim()) {
    return [value.trim()]
  }
  return []
}

const PROVIDER_MAPPING = {
  merchantId: {
    name: 'MerchantIds',
    isCopyEnabled: true,
  },
  merchantIds: {
    name: 'Merchant Code',
    isCopyEnabled: true,
  },
  identityId: {
    name: 'Lead ID',
    isCopyEnabled: true,
  },
  adobeSignId: {
    name: 'Adobe Sign ID',
    isCopyEnabled: false,
  },
  adobeSignStatus: {
    name: 'Adobe Sign Status',
    isCopyEnabled: false,
  },
  clientId: {
    name: 'Merchant Client ID for iframe',
    isCopyEnabled: true,
  },
  payarcAccountID: {
    name: 'Merchant ID',
    isCopyEnabled: true,
  },
  providerStatus: {
    name: 'Provider Status',
    isCopyEnabled: false,
  },
}

const Index = ({
  dispatch,
  payments: { payments },
  business: { details, businessNote },
  allUsers: { allUsers },
  router: { location },
  subscriptions: { subscriptions },
  rewards: { rewardEarnHistory },
}) => {
  const [pageSize, setPageSize] = useState(100)
  const [total, setTotal] = useState(100)
  const [current, setCurrent] = useState(1)
  const [bizDetail, setBizDetail] = useState(null)
  const [usersData, setUsersData] = useState(null)
  const [subscriptionData, setSubscriptionData] = useState(null)
  const [noteDescription, setNoteDescription] = useState(null)
  const [loading, setLoding] = useState(true)
  const [uloading, setUloding] = useState(true)
  const [visible, setVisible] = useState(false)
  const [renderModalContent, setRenderModalContent] = useState(null)
  const [paymentData, setPaymentData] = useState(null)
  const [ploading, setPloading] = useState(true)
  const [showPromotional, setShowPromotional] = useState(false)
  const [selectedTab, setSelectedTab] = useState('users')
  const [passwordModalVisible, setPasswordModalVisible] = useState(false)
  const [userId, setUserId] = useState(null)
  const [isOnboardingAllowed, setIsOnboardingAllowed] = useState(false)
  const [isPaymentEnabled, setIsPaymentEnabled] = useState(false)
  const [isPayoutEnabled, setIsPayoutEnabled] = useState(false)
  const [isMerchantOfRecord, setIsMerchantOfRecord] = useState(false)
  const [isOpenAdjustRewardPointModal, setIsOpenAdjustRewardPointModal] = useState(false)
  const [isOpenMigrateDataFromPeymyntModal, setIsOpenMigrateDataFromPeymyntModal] = useState(false)
  const [rewardEarnHistoryData, setRewardEarnHistoryData] = useState(null)
  const [linkProvider, setLinkProvider] = useState('')
  const [isProviderLinked, setIsProviderLinked] = useState(false)
  const [isProviderLinkedLoading, setIsProviderLinkedLoading] = useState(false)
  const [disableMigrateSubmit, setDisableMigrateSubmit] = useState(false)
  const [isRefreshVerificationDocuments, setIsRefreshVerificationDocuments] = useState(false)
  const [isOpenAddCreditModal, SetIsOpenAddCreditModal] = useState(false)

  const history = useHistory()
  const { search, pathname } = useLocation()

  const initFetch = useCallback(
    businessId => {
      dispatch({
        type: 'business/FETCH_BUSINESS_DETAIL',
        payload: {
          businessId,
        },
      })
      getUsers()
    },
    [dispatch],
  )

  useEffect(() => {
    initFetch(location.pathname.split('/business/view/')[1])
  }, [initFetch])

  useEffect(() => {
    if (details.data) {
      setLoding(details.loading)
      setBizDetail(details.data.business)
      setIsOnboardingAllowed(details.data?.business?.legal?.isOnboardingAllowed)
      setIsPaymentEnabled(
        details?.data?.business?.paymentSetting?.platformPaymentStatus === 'active',
      )
      setIsPayoutEnabled(details?.data?.business?.paymentSetting?.platformPayoutStatus === 'active')
      setIsMerchantOfRecord(details?.data?.business?.isMerchantOfRecord)
      closeAdjustRewardPointsModal()
      closeMigrateFromPeymynt()
      fetchBusinessRewardEarnHistory()
      setIsProviderLinked(false)
      setDisableMigrateSubmit(false)
      setLinkProvider(_get(details, 'data.business.legal.providerName', ''))
      if (isProviderLinkedLoading) {
        setIsProviderLinkedLoading(false)
      }
    }
  }, [details.data])

  useEffect(() => {
    if (payments.data) {
      const { meta } = payments.data
      setCurrent(meta.pageNo)
      setPageSize(meta.pageSize)
      setTotal(meta.total)
      setPaymentData(payments.data.payments)
    }
    setPloading(payments.loading)
  }, [payments])

  useEffect(() => {
    if (allUsers && allUsers.data && allUsers.data.meta) {
      const { meta } = allUsers.data
      setCurrent(meta.pageNo)
      setPageSize(meta.pageSize)
      setTotal(meta.total)
      setUsersData(allUsers.data.users)
    }
    setUloding(allUsers.loading)
  }, [allUsers.data, allUsers.loading])

  useEffect(() => {
    if (subscriptions && subscriptions.data && subscriptions.data.meta) {
      const { meta } = subscriptions.data
      setCurrent(meta.pageNo)
      setPageSize(meta.pageSize)
      setTotal(meta.total)
      setSubscriptionData(subscriptions.data.Subscriptions)
    }
    setUloding(allUsers.loading)
  }, [subscriptions])

  useEffect(() => {
    if (rewardEarnHistory && rewardEarnHistory.data && rewardEarnHistory.data.meta) {
      const { meta } = rewardEarnHistory.data
      setCurrent(meta.pageNo)
      setPageSize(meta.pageSize)
      setTotal(meta.total)
      setRewardEarnHistoryData(rewardEarnHistory.data.rewards)
    }
  }, [rewardEarnHistory])

  const changeUserStatus = async row => {
    /* eslint-disable */
    if (row.role === 'Owner') {
      await activeDeactiveUser(row._id, !row.isActiveInBusiness)
        .then(res => {
          return res
        })
        .catch(err => {
          return err
        })
    }
    await activeDeactiveUsers(!row.isActiveInBusiness, bizDetail._id, row._id)
      .then(res => {
        return res
      })
      .catch(err => {
        return err
      })
  }

  const toggleOnboarding = reqBody => {
    /* eslint-disable */
    return new Promise(resolve => {
      dispatch({
        type: 'business/TOGGLE_ONBOARDING',
        payload: {
          businessId: bizDetail._id,
          reqBody,
        },
      })
      resolve()
    }).then(() => {
      setIsOnboardingAllowed(!isOnboardingAllowed)
    })
  }

  const togglePayment = reqBody => {
    return new Promise(resolve => {
      dispatch({
        type: 'business/TOGGLE_CAPABILITIES',
        payload: {
          businessId: bizDetail._id,
          status: reqBody.isPaymentEnabled,
          capabilityType: 'payment',
        },
      })
      resolve()
    })
      .then(() => {
        setIsPaymentEnabled(!isPaymentEnabled)
      })
      .catch(() => {
        setIsPayoutEnabled(isPaymentEnabled)
      })
  }

  const togglePayout = reqBody => {
    return new Promise(resolve => {
      dispatch({
        type: 'business/TOGGLE_CAPABILITIES',
        payload: {
          businessId: bizDetail._id,
          status: reqBody.isPayoutEnabled,
          capabilityType: 'payout',
        },
      })
      resolve()
    })
      .then(() => {
        setIsPayoutEnabled(!isPayoutEnabled)
      })
      .catch(() => {
        setIsPayoutEnabled(isPayoutEnabled)
      })
  }

  const toggleMerchantOfRecord = reqBody => {
    return new Promise(resolve => {
      dispatch({
        type: 'business/UPDATE_BUSINESS',
        payload: {
          businessId: bizDetail._id,
          data: {
            isMerchantOfRecord: reqBody.isMerchantOfRecord,
          },
        },
      })
      resolve()
    }).then(() => {
      setIsMerchantOfRecord(!isMerchantOfRecord)
    })
  }

  const changeStatus = async row => {
    setUloding(true)
    await changeUserStatus(row)
    await getUsers()
  }

  useEffect(() => {
    tabChange('payments-received')
  }, [pageSize, current])

  useEffect(() => {
    const tabNo = new URLSearchParams(search).get('tab') || 'users'
    tabChange(tabNo)
  }, [])

  const tabChange = e => {
    goToTab(e)
    setSelectedTab(e)
    if (e == 'reward-earn-history') {
      fetchBusinessRewardEarnHistory()
    }
    if (e == 'payments-received') {
      getPayments()
    }
    if (e == 'subscription') {
      getSubscription()
    } else {
      getUsers()
    }
  }

  const goToTab = tab => {
    history.push(`${pathname}?tab=${tab}`)
  }

  const getUsers = () => {
    dispatch({
      type: 'users/FETCH_ALL_USERS',
      payload: {
        qryString: getQrystring(),
      },
    })
  }
  const getPayments = () => {
    dispatch({
      type: 'payments/FETCH_ALL_PAYMENTS',
      payload: {
        qryString: getQrystring(),
      },
    })
  }
  const getSubscription = () => {
    dispatch({
      type: 'subscriptions/FETCH_ALL_SUBSCRIPTIONS',
      payload: {
        qryString: getQrystring(),
      },
    })
  }

  const fetchBusinessRewardEarnHistory = () => {
    dispatch({
      type: 'rewards/FETCH_BUSINESS_EARN_REWARD_HISTORY',
      businessId: splitId(),
      data: {
        qryString: qs.stringify({ pageNo: current, pageSize }),
      },
    })
  }

  const getQrystring = () => {
    return qs.stringify({ pageNo: current, pageSize, businessId: splitId() })
  }
  const splitId = () => location.pathname.split('/business/view/')[1]

  const resetPassword = row => {
    setUloding(true)
    dispatch({
      type: 'users/RESET_PASSWORD_USERS',
      payload: {
        userId: row._id,
      },
    })
  }

  const handleSaveNotes = () => {
    dispatch({
      type: 'business/ADD_BUSINESS_NOTES',
      payload: {
        businessId: bizDetail._id,
        notes: {
          notes: {
            description: noteDescription,
          },
        },
      },
    })
    setNoteDescription(null)
  }
  const closeModal = () => {
    setVisible(false)
  }

  const openModal = (row = null, status) => {
    let modalData
    if (status === 'emails') {
      modalData = {
        type: status,
        title: 'Connected Emails',
        data: row.emails,
      }
    }
    setRenderModalContent(modalData)
    setVisible(true)
  }

  const openPasswordModal = row => {
    setUserId(row._id)
    setPasswordModalVisible(true)
  }

  const onPaginationChange = async (currentpage, pagesize) => {
    await setCurrent(currentpage)
    await setPageSize(pagesize)
  }

  const closeAdjustRewardPointsModal = () => {
    setIsOpenAdjustRewardPointModal(false)
  }

  const handleAdjustRewardPoints = () => {
    setIsOpenAdjustRewardPointModal(true)
  }

  const closehandleAddCreditsModel = () => {
    SetIsOpenAddCreditModal(false)
  }

  const handleAddCredits = () => {
    SetIsOpenAddCreditModal(true)
  }

  const closeMigrateFromPeymynt = () => {
    setIsOpenMigrateDataFromPeymyntModal(false)
  }

  const handleMigrateFromPeymynt = () => {
    setIsOpenMigrateDataFromPeymyntModal(true)
  }

  const onSubmitAdjustRewardPoints = submittedData => {
    dispatch({
      type: 'business/ADJUST_BUSINESS_REWARD_POINTS',
      businessId: bizDetail._id,
      data: {
        rewardName: 'adjustments',
        points: submittedData?.points,
        reason: submittedData?.reason,
      },
    })
  }

  const onSubmitAddCredits = submittedData => {
    dispatch({
      type: 'business/ADD_BUSINESS_CREDITS',
      businessId: bizDetail._id,
      data: {
        credits: submittedData?.credits,
      },
    })
  }

  const onSubmitMigrateDataFromPeymynt = submittedData => {
    setDisableMigrateSubmit(true)
    dispatch({
      type: 'business/MIGRATE_DATA_FROM_PEYMYNT',
      businessId: bizDetail._id,
      data: {
        businessId: submittedData?.businessId,
        currentBusinessId: bizDetail._id,
      },
    })
  }

  const handleProviderLink = () => {
    confirm({
      title: `Are you sure you want to change provider? This will delete all connection to existing provider`,
      content: '',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        setIsProviderLinkedLoading(true)
        dispatch({
          type: 'business/MANAGE_BUSINESS_PROVIDER',
          payload: {
            businessId: bizDetail._id,
            providerName: linkProvider || '',
          },
        })
      },
      onCancel() {},
    })
  }

  const renderStatus = status => {
    let statusObj = {
      class: 'default',
    }
    if (status) {
      statusObj = {
        class: 'success',
      }
    } else {
      statusObj = {
        class: 'danger',
      }
    }
    return (
      <span className={`font-size-12 badge badge-${statusObj.class}`}>
        {status ? 'Enabled' : 'Disabled'}
      </span>
    )
  }

  const handleRefreshVerificationDocuments = flag => {
    setIsRefreshVerificationDocuments(flag)
  }

  const isPpcpStandard =
    bizDetail?.legal?.providerData?.['subscribedProduct']?.some(
      ({ name }) => name === 'PPCP_STANDARD',
    ) &&
    !bizDetail?.legal?.providerData?.['subscribedProduct']?.some(
      ({ name }) => name === 'PPCP_CUSTOM',
    )

  return (
    <>
      <Helmet title="Business Detail" />
      {loading ? (
        <div className="d-flex flex-wrap justify-content-center mt-5">
          <Spin />
        </div>
      ) : (
        <div>
          {/* Top Header */}
          <TopHeader
            bizDetail={bizDetail}
            selectedTab={selectedTab}
            promotionalEmail={() => setShowPromotional(true)}
            isOnboardingAllowed={isOnboardingAllowed}
            toggleOnboarding={toggleOnboarding}
            isPaymentEnabled={isPaymentEnabled}
            isPayoutEnabled={isPayoutEnabled}
            togglePayment={togglePayment}
            togglePayout={togglePayout}
            isMerchantOfRecord={isMerchantOfRecord}
            toggleMerchantOfRecord={toggleMerchantOfRecord}
            handleAdjustRewardPoints={handleAdjustRewardPoints}
            handleAddCredits={handleAddCredits}
            handleMigrateFromPeymynt={handleMigrateFromPeymynt}
          />
          {/* Manage Provider */}
          <div className="row gap-4">
            <UpdateBusinessName businessId={bizDetail?._id} />
            <UpdateBusinessType businessId={bizDetail?._id} />
            <DeleteMerchant businessId={bizDetail?._id} />
            <ToggleStripeAccount businessId={bizDetail?._id} />
          </div>
          <Card>
            {/* <UpdatePaymentLimits business={bizDetail?._id} /> */}
            <PayByBankProvider
              payAsBank={bizDetail?.legal?.bankProviderData}
              businessId={bizDetail?._id}
              payByBankStatus={bizDetail?.legal?.bankProviderData?.onboardingStatus}
            />
            <BuyNowPayLater
              bnplData={bizDetail?.legal?.bnplProviderData}
              businessId={bizDetail?._id}
              onRefresh={() => initFetch(bizDetail._id)}
            />
            {(!!bizDetail?.legal?.providerData?.privyWallet ||
              toProviderArray(bizDetail?.legal?.providerData?.activeProviders).includes(
                'privy',
              )) && (
              <>
                <div className="text-dark font-weight-bold font-size-24 border-bottom mt-4">
                  <span className="mr-3">Pay By Wallet Provider</span>
                </div>
                <div className="d-flex">
                  <div className="col-6 pl-0">
                    <div className="table-responsive">
                      <table className="table table-borderless">
                        <tbody>
                          <tr>
                            <td className="text-gray-6 pl-0 pb-0">Provider Name</td>
                            <td className="pr-0 text-dark pb-0 text-right text-uppercase">Privy</td>
                          </tr>
                          <tr>
                            <td className="text-gray-6 pl-0 pb-0">Wallet ID</td>
                            <td className="pr-0 text-dark pb-0 text-right">
                              {bizDetail?.legal?.providerData?.privyWallet?.id || 'N/A'}
                            </td>
                          </tr>
                          <tr>
                            <td className="text-gray-6 pl-0 pb-0">Wallet Address</td>
                            <td className="pr-0 text-dark pb-0 text-right">
                              {bizDetail?.legal?.providerData?.privyWallet?.address || 'N/A'}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </>
            )}
            <div className="text-dark font-weight-bold font-size-24 border-bottom mt-4">
              <span className="mr-3">Pay by Card Provider</span>
            </div>
            <div className="d-flex">
              <div className="col-6 pl-0">
                <div className="table-responsive">
                  <table className="table table-borderless">
                    <tbody>
                      <tr>
                        <td className="text-gray-6 pl-0 pb-0">Provider Name</td>
                        <td className="pr-0 text-dark pb-0">
                          <div className="d-flex align-items-center justify-content-end">
                            {isProviderLinked ? (
                              <Input.Group compact style={{ maxWidth: '300px' }}>
                                <ProviderFilter
                                  placeholder="Link Provider"
                                  value={linkProvider}
                                  handleChange={value => setLinkProvider(value)}
                                  isDisabled={!isProviderLinked}
                                  style={{ width: 'calc(100% - 63px)' }}
                                  defaultOptionLabel="No Provider"
                                />
                                <Button
                                  type="primary"
                                  className="ant-btn-lg"
                                  disabled={isProviderLinkedLoading || !isProviderLinked}
                                  onClick={handleProviderLink}
                                >
                                  Save
                                </Button>
                              </Input.Group>
                            ) : (
                              <div className="d-flex align-items-end">
                                <a
                                  className="kit__utils__link mr-2 mb-0"
                                  onClick={() => setIsProviderLinked(true)}
                                >
                                  <EditOutlined />
                                </a>
                                <span
                                  className="text-uppercase"
                                  style={{ fontSize: '13px', fontWeight: 'bold' }}
                                >
                                  {_get(bizDetail, 'legal.providerName', '') === 'unified'
                                    ? `Unified (${toProviderArray(
                                        _get(bizDetail, 'legal.providerData.activeProviders', []),
                                      ).join(', ')})`
                                    : providerIcons(_get(bizDetail, 'legal.providerName', ''))}{' '}
                                  {isPpcpStandard ? '| PPCP_STANDARD' : ''}
                                </span>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="text-gray-6 pl-0 pb-0">Onboarding Status</td>
                        <td className="pr-0 text-dark pb-0 text-right text-uppercase">
                          {bizDetail?.legal?.onboardingStatus}
                        </td>
                      </tr>
                      <tr>
                        <td className="text-gray-6 pl-0 pb-0">Payments from Provider</td>
                        <td className="pr-0 text-dark pb-0 text-right">
                          {renderStatus(bizDetail?.paymentSetting?.isVerified?.payment)}
                        </td>
                      </tr>
                      <tr>
                        <td className="text-gray-6 pl-0 pb-0">Payouts from Provider</td>
                        <td className="pr-0 text-dark pb-0 text-right">
                          {renderStatus(bizDetail?.paymentSetting?.isVerified?.payout)}
                        </td>
                      </tr>
                      <tr>
                        <td className="text-gray-6 pl-0 pb-0">Review Date</td>
                        <td className="pr-0 text-dark pb-0 text-right">
                          {bizDetail?.legal?.bankProviderData.updatedAt
                            ? formateDate(bizDetail?.legal?.bankProviderData.updatedAt)
                            : 'N/A'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              {!!bizDetail?.legal?.providerData ? (
                <div className="col-6 pl-0">
                  <div className="table-responsive">
                    <table className="table table-borderless">
                      <tbody>
                        {(Object.keys(bizDetail?.legal?.providerData) || [])
                          .filter(
                            key =>
                              key !== 'reviewDate' &&
                              key !== 'subscribedProduct' &&
                              key !== 'privyWallet',
                          )
                          .filter(
                            key =>
                              !(
                                key === 'merchantId' &&
                                typeof bizDetail?.legal?.providerData?.[key] === 'string' &&
                                bizDetail?.legal?.providerData?.[key].startsWith('0x')
                              ),
                          )
                          .map(key => {
                            let value = bizDetail?.legal?.providerData?.[key]
                            return (
                              <tr key={key}>
                                <td className="text-gray-6 pl-0 pb-0">
                                  {PROVIDER_MAPPING?.[key]?.name || key}
                                </td>
                                <td className="pr-0 text-dark pb-0 text-right">
                                  {Array.isArray(value) ? (
                                    <div className="d-flex flex-wrap gap-1 justify-content-end">
                                      {value.map((v, i) => (
                                        <div
                                          key={i}
                                          className="d-flex align-items-center gap-1"
                                          style={{
                                            backgroundColor: '#f1f3f5',
                                            padding: '4px 8px',
                                            borderRadius: '12px',
                                            fontSize: '0.875rem',
                                          }}
                                        >
                                          <span
                                            className="text-truncate"
                                            style={{ maxWidth: '120px' }}
                                          >
                                            {v}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="d-flex align-items-center gap-1 justify-content-end">
                                      <span>{value}</span>
                                      {PROVIDER_MAPPING?.[key]?.isCopyEnabled && (
                                        <CopyToClipboard value={value} />
                                      )}
                                    </div>
                                  )}
                                </td>
                              </tr>
                            )
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                ''
              )}
            </div>
            <div className="text-dark font-weight-bold font-size-24 border-bottom">
              <span className="mr-3">Business Risk</span>
            </div>
            <div className="d-flex">
              <div className="col-12 pl-0">
                <ProcessingFee
                  isHideCreateTemplate={true}
                  isFullWidth={true}
                  isRiskLevel={true}
                  businessRiskLevel={bizDetail?.riskLevel}
                  refreshVerificationDocuments={handleRefreshVerificationDocuments}
                  isRefreshVerificationDocuments={isRefreshVerificationDocuments}
                />
              </div>
            </div>
            <div className="text-dark font-weight-bold font-size-24 border-bottom mb-3">
              <span className="mr-3">Verification Documents</span>
            </div>
            <div className="d-flex">
              <div className="col-12 pl-0">
                <VerifcationDocuments
                  key={bizDetail?.legal?._id}
                  legalId={bizDetail?.legal?._id}
                  isRefreshVerificationDocuments={isRefreshVerificationDocuments}
                />
              </div>
            </div>
          </Card>
          {/* Tab Details */}
          <div className="row">
            <div className="col-12 ">
              <div className="card">
                <Tabs
                  onChange={tabChange}
                  activeKey={selectedTab.toString()}
                  className={`${style.tabs} kit-tabs-bordered`}
                  defaultActiveKey="1"
                >
                  <TabPane tab="Users" key="users">
                    <DelegatedUser
                      data={usersData}
                      loading={uloading}
                      resetPassword={resetPassword}
                      changeStatus={changeStatus}
                      openModal={openModal}
                      openPasswordModal={openPasswordModal}
                      businessId={bizDetail._id}
                    />
                  </TabPane>
                  <TabPane tab="Payments Received" key="payments-received">
                    <div className="mb-2 d-flex justify-content-end">
                      <ExportButton
                        qryString={qs.stringify({ businessId: bizDetail._id })}
                        type="payments"
                        varient="medium"
                      />
                    </div>
                    <Payments
                      data={paymentData}
                      loading={ploading}
                      pageSize={pageSize}
                      total={total}
                      current={current}
                      onPaginationChange={onPaginationChange}
                    />
                  </TabPane>
                  <TabPane tab="Subscription" key="subscription">
                    <ChangeSubscription
                      subscriptionData={subscriptionData}
                      getSubscription={getSubscription}
                    />
                    <Subscription
                      data={subscriptionData}
                      loading={ploading}
                      pageSize={pageSize}
                      total={total}
                      current={current}
                      onPaginationChange={onPaginationChange}
                      getSubscription={getSubscription}
                    />
                  </TabPane>
                  <TabPane tab="General Details" key="general-details">
                    <GeneralDetails
                      bizDetail={bizDetail}
                      noteDescription={noteDescription}
                      setNoteDescription={val => setNoteDescription(val)}
                      onSaveNotes={handleSaveNotes}
                      onCancelNotes={() => setNoteDescription(null)}
                      businessNote={businessNote}
                    />
                  </TabPane>
                  <TabPane tab="Processing fee" key="processing-fee">
                    <ProcessingFee />
                  </TabPane>
                  <TabPane tab="Change Requests" key="change-requests">
                    <ChangeRequests
                      paymentSetting={bizDetail?.paymentSetting}
                      legalDetails={bizDetail?.legal}
                    />
                  </TabPane>
                  <TabPane tab="Payment Onboarding" key="payment-onboarding">
                    <PaymentOnboarding bizDetail={bizDetail} />
                  </TabPane>
                  <TabPane tab="Account Capabilities" key="account-capabilities">
                    <AccountCapabilities />
                  </TabPane>
                  <TabPane tab="Sales Agent" key="sales-agent">
                    <SalesAgent />
                  </TabPane>
                  <TabPane tab="Reward Earn History" key="reward-earn-history">
                    <RewardEarnHistory
                      data={rewardEarnHistoryData}
                      loading={ploading}
                      pageSize={pageSize}
                      total={total}
                      current={current}
                      onPaginationChange={onPaginationChange}
                    />
                  </TabPane>
                  <TabPane tab="Transfer Reversal" key="transfer-reversal">
                    <TransferReversal
                      stripeAccountId={bizDetail?.legal?.providerData?.merchantId}
                    />
                  </TabPane>
                  <TabPane tab="Webhook Logs" key="webhook-logs">
                    <WebhookLogs />
                  </TabPane>
                  <TabPane tab="Error Logs" key="error-logs">
                    <ErrorLogs />
                  </TabPane>
                  <TabPane tab="Payment Settings" key="payment-settings">
                    <UpdatePaymentLimits business={bizDetail} dispatch={dispatch} />
                  </TabPane>
                </Tabs>
              </div>
            </div>
          </div>
          {/* Common Modal for Connected Emails or dump data */}
          <Modal
            renderModalContent={renderModalContent}
            visible={visible}
            closeModal={closeModal}
          />
          <PromotionalModal
            visible={showPromotional}
            userDetails={bizDetail?.users?.[0] ?? {}}
            onCancel={() => {
              setShowPromotional(false)
            }}
          />
          {userId && (
            <GeneratePasswordModal
              userId={userId}
              visible={passwordModalVisible}
              onCancel={() => {
                setPasswordModalVisible(false)
              }}
            />
          )}
          {/* Adjust Reward Points */}
          <ReactModal
            isOpen={isOpenAdjustRewardPointModal}
            toggle={closeAdjustRewardPointsModal}
            size="md"
          >
            <ModalHeader className="pt-3 pb-1" toggle={() => closeAdjustRewardPointsModal()}>
              Adjust Reward Points
            </ModalHeader>
            <ModalBody>
              <div className="d-flex flex-wrap justify-content-center">
                <AdjustmentRewardPoints onSubmitAdjustRewardPoints={onSubmitAdjustRewardPoints} />
              </div>
            </ModalBody>
          </ReactModal>
          {/* Add Credits */}
          <ReactModal isOpen={isOpenAddCreditModal} toggle={closehandleAddCreditsModel} size="md">
            <ModalHeader className="pt-3 pb-1" toggle={closehandleAddCreditsModel}>
              Add Credits
            </ModalHeader>

            <ModalBody>
              <div className="d-flex flex-wrap justify-content-center">
                <AddCredits
                  onSubmitAddCredits={data => {
                    onSubmitAddCredits(data)
                    closehandleAddCreditsModel()
                  }}
                  businessId={bizDetail._id}
                />
              </div>
            </ModalBody>
          </ReactModal>
          {/* Migrate data from Peymynt */}
          <ReactModal
            isOpen={isOpenMigrateDataFromPeymyntModal}
            toggle={closeMigrateFromPeymynt}
            size="md"
          >
            <ModalHeader className="pt-3 pb-1" toggle={() => closeMigrateFromPeymynt()}>
              Migrate business data from Peymynt
            </ModalHeader>
            <ModalBody>
              <div className="d-flex flex-wrap justify-content-center">
                <MigrateDataFromPeymynt
                  onSubmitMigrateDataFromPeymynt={onSubmitMigrateDataFromPeymynt}
                  disableSubmit={disableMigrateSubmit}
                />
              </div>
            </ModalBody>
          </ReactModal>
        </div>
      )}
    </>
  )
}

export default connect(mapStateToProps)(Index)
