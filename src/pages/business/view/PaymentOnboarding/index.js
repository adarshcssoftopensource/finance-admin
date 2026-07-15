/* eslint-disable */
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { notification, Modal } from 'antd'
import { Input, Spinner } from 'reactstrap'
import { Input as AntdInput } from 'antd' // Renamed Antd Input to avoid conflict
import Stepper from './onBoarding/Stepper'
import OnBoarding from './onBoarding/index'
import StripeRaw from '../../../../components/app/detailsComponents/stripeRaw'
import {
  fetchPaymentOnboardingSteps,
  onboardingDataSubmit,
  updateOnboardingDataStatus,
  addStripeAccount,
} from 'services/business'
import StripeLegalData from '.././StripeLegalData/index'
import './PaymentOnboarding.scss'
import { withRouter } from 'react-router-dom'

const PROVIDER_DETAILS = {
  stripe: {
    title: 'Stripe',
    category: 'Credit Cards, Wallets & BNPL',
    features: [
      'Accept Visa, Mastercard, Amex & Discover',
      'Apple Pay & Google Pay',
      'Buy Now Pay Later (Klarna & Affirm)',
    ],
  },
  finix: {
    title: 'Finix',
    category: 'Card Processing',
    features: [
      'Accept Visa, Mastercard, Amex & Discover',
      'Direct merchant payouts & optimized transaction routing',
    ],
  },
  justifi: {
    title: 'JustiFi',
    category: 'Card Processing',
    features: [
      'Accept Visa, Mastercard, Amex & Discover',
      'Intelligent payment analytics & simplified gateway routing',
    ],
  },
  checkout: {
    title: 'Checkout.com',
    category: 'Global Card Processing',
    features: [
      'International credit & debit cards',
      'Multi-currency processing & localized settlement',
    ],
  },
  modern_treasury: {
    title: 'Modern Treasury',
    category: 'Bank Payments (ACH)',
    features: [
      'Direct bank transfers (ACH payments)',
      'Automatic daily batch payouts at 9:00 AM EST',
    ],
  },
  sezzle: {
    title: 'Sezzle',
    category: 'Buy Now Pay Later (BNPL)',
    features: [
      'Interest-free pay-in-4 installations',
      'Increases customer purchase power & average order size',
    ],
  },
  privy: {
    title: 'Privy',
    category: 'Web3 & Digital Assets',
    features: [
      'USDC wallet creation & settlements on Base network',
      'Instant cryptographic payments with ultra-low fees',
    ],
  },
  adyen: {
    title: 'Adyen',
    category: 'Global Card Processing',
    features: [
      'Accept Visa, Mastercard, Amex & Discover worldwide',
      'Built-in fraud protection & 3D Secure authentication',
    ],
  },
}

const HIDDEN_APPROVAL_PROVIDERS = ['checkout']

const ORDERED_PROVIDERS = [
  'finix',
  'stripe',
  'justifi',
  'checkout',
  'modern_treasury',
  'sezzle',
  'privy',
  'adyen',
]

/** activeProviders / availableProviders must be arrays before .filter, spread, or for..of */
const toProviderArray = value => {
  if (Array.isArray(value)) {
    return value.filter(p => typeof p === 'string' && p.trim())
  }
  if (typeof value === 'string' && value.trim()) {
    return [value.trim()]
  }
  return []
}

const visibleApprovalProviders = providers =>
  toProviderArray(providers).filter(p => p !== 'column' && !HIDDEN_APPROVAL_PROVIDERS.includes(p))

const ApprovebtnShow = [
  'finished',
  'awaiting_approval',
  'rejected',
  'need_verification',
  'verified',
]
const ReSubmitShow = []
const RejctbtnShow = ['started', 'finished', 'awaiting_approval', 'need_verification', 'approved']
const BlockbtnShow = [
  'started',
  'finished',
  'awaiting_approval',
  'rejected',
  'approved',
  'submitted',
  'verified',
  'need_verification',
]
const SubmittoProvShow = ['approved', 'started', 'awaiting_approval']
const SyncProvShow = ['submitted']
const UnsendShow = ['submitted', 'need_verification', 'verified']

const mapStateToProps = ({ business, dispatch }) => ({
  business,
  dispatch,
})

class PaymentOnboarding extends PureComponent {
  state = {
    activeStep: 0,
    isReadOnly: false,
    isOnload: true,
    onBoardingData: {},
    stepperData: [],
    newOwnerflag: false,
    formData: {},
    additionaFieldData: [],
    visitedStep: [],
    currentStep: '',
    businessId: '',
    businessStatus: '',
    legalData: null,
    approveloading: false,
    rejectloading: false,
    blockloading: false,
    syncLoading: false,
    bizDetail: '',
    statement: '',
    editable: false,
    remarks: '',
    errorMessage: [],
    isPaymentOnboardingStepsVisible: true,
    showResubmitModal: false,
    isEditableOverride: false,
    showAddStripeModal: false,
    newStripeId: '',
    addStripeLoading: false,
    selectedProviders: [],
    availableProviders: [],
    showProviderModal: false,
    showProgressModal: false,
    approvalProgress: {}, // { provider: { status: 'pending'|'processing'|'success'|'error', message: '' } }
  }

  fetchOnboarding = async businessId => {
    const onBoardingStepData = await fetchPaymentOnboardingSteps(1, businessId)
    console.log('stepSchema:', onBoardingStepData?.data?.stepSchema)
    console.log('legalStatus:', onBoardingStepData?.data?.legalData?.onboardingStatus)
    const legalStatus = onBoardingStepData?.data?.legalData?.onboardingStatus
    const availableProvidersRaw = onBoardingStepData?.data?.legalData?.availableProviders || []
    const availableProviders = Array.from(new Set(toProviderArray(availableProvidersRaw)))

    let defaultSelected = toProviderArray(
      onBoardingStepData?.data?.legalData?.providerData?.activeProviders,
    )
    if (
      defaultSelected.length === 0 &&
      onBoardingStepData?.data?.legalData?.providerName &&
      onBoardingStepData?.data?.legalData?.providerName !== 'unified'
    ) {
      defaultSelected = [onBoardingStepData.data.legalData.providerName]
    }
    defaultSelected = defaultSelected.filter(p => p !== 'column')

    if (!onBoardingStepData?.data?.stepSchema || legalStatus === 'not_started') {
      this.setState({
        isPaymentOnboardingStepsVisible: false,
        legalData: onBoardingStepData?.data?.legalData,
        businessStatus: legalStatus || 'not_started',
        availableProviders,
        selectedProviders: defaultSelected,
      })
    } else {
      this.setState({
        onBoardingData: onBoardingStepData.data.stepSchema,
        businessStatus: legalStatus || 'need_verification',
        legalData: onBoardingStepData?.data?.legalData,
        availableProviders,
        selectedProviders: defaultSelected,
        formData: onBoardingStepData.data.formData || {},
        visitedStep: [1],
        stepperData:
          onBoardingStepData.data.metaData?.titleNew || onBoardingStepData.data.metaData?.title,
      })
    }
  }

  async componentDidMount() {
    const url = window.location.href.split('/').pop() || window.location.href.split('/').pop()
    const businessId = url.split('?')[0]

    this.setState({
      currentStep: 1,
      businessId,
      bizDetail: this.props?.business?.details?.data?.business,
      statement: this.props?.business?.details?.data?.business?.legal?.statement?.displayName,
    })

    await this.fetchOnboarding(businessId)
  }

  handleSteps = async activeStep => {
    this.setState({
      currentStep: activeStep + 1,
    })
    const onBoardingStepData = await fetchPaymentOnboardingSteps(
      activeStep + 1,
      this.state.businessId,
    )

    if (onBoardingStepData && onBoardingStepData.data) {
      this.setState(prevState => ({
        activeStep,
        isOnload: false,
        formData: onBoardingStepData.data.formData || {},
        onBoardingData: onBoardingStepData.data.stepSchema,
        businessStatus:
          onBoardingStepData?.data?.legalData?.onboardingStatus || prevState.businessStatus,
        visitedStep: prevState.visitedStep.includes(activeStep + 1)
          ? prevState.visitedStep
          : [...prevState.visitedStep, activeStep + 1],
      }))
    } else {
      this.setState({ activeStep, isOnload: false })
    }
  }

  handlelegalJSON = async event => {
    const updatedLegalData = { ...event?.updated_src }
    delete updatedLegalData._id
    delete updatedLegalData.__v
    await onboardingDataSubmit({ legalData: updatedLegalData }, this.state.businessId)
      .then(res => {
        if (res.statusCode == 200) {
          notification.success({ message: res.message })
        } else {
          notification.error({ message: res.message })
        }
      })
      .catch(err => {
        notification.error({ message: err?.message })
      })
  }

  showResubmitConfirm = () => this.setState({ showResubmitModal: true })
  hideResubmitConfirm = () => this.setState({ showResubmitModal: false })

  confirmResubmit = async () => {
    this.hideResubmitConfirm()
    await this.updateOnboardingStatus('approved', this.state.businessId)
  }

  updateOnboardingStatus = async (status, businessId, isPayByBank = false) => {
    if (status === 'rejected') this.setState({ rejectloading: true })
    if (status === 'blocked') this.setState({ blockloading: true })
    if (status === 'sync') this.setState({ syncLoading: true })

    if (status === 'approved') {
      const selectedProviders = toProviderArray(this.state.selectedProviders)
      const availableProviders = toProviderArray(this.state.availableProviders)
      const providersToProcess = (selectedProviders.includes('all')
        ? availableProviders
        : selectedProviders
      ).filter(p => p !== 'column' && !HIDDEN_APPROVAL_PROVIDERS.includes(p))

      if (providersToProcess.length > 0) {
        this.setState({
          showProgressModal: true,
          approveloading: true,
          approvalProgress: providersToProcess.reduce((acc, p) => {
            acc[p] = { status: 'pending', message: 'Waiting...' }
            return acc
          }, {}),
        })

        let hasError = false
        const overallProgress = { ...this.state.approvalProgress }

        for (const provider of providersToProcess) {
          overallProgress[provider] = { status: 'processing', message: 'Submitting...' }
          this.setState({ approvalProgress: { ...overallProgress } })

          try {
            const res = await updateOnboardingDataStatus(
              status,
              businessId,
              this.state.remarks,
              isPayByBank,
              [provider], // Pass only this provider
            )

            if (res && res.statusCode === 200) {
              overallProgress[provider] = { status: 'success', message: 'Submitted Successfully' }
            } else {
              overallProgress[provider] = {
                status: 'error',
                message: res?.message || 'Submission Failed',
              }
              hasError = true
            }
          } catch (err) {
            overallProgress[provider] = { status: 'error', message: err?.message || 'API Error' }
            hasError = true
          }
          this.setState({ approvalProgress: { ...overallProgress } })
        }

        this.setState({ approveloading: false })

        if (!hasError) {
          notification.success({ message: 'All providers approved successfully' })
          setTimeout(() => {
            window.location.reload()
          }, 2000)
        } else {
          notification.error({ message: 'Some provider approvals failed' })
        }
        return
      }
      this.setState({ approveloading: true })
    }

    try {
      const res = await updateOnboardingDataStatus(
        status,
        businessId,
        this.state.remarks,
        isPayByBank,
        this.state.selectedProviders,
      )

      if (res && res.statusCode === 200) {
        // Immediately update the frontend state to reflect the correct status
        const newStatus = res?.data?.onboardingStatus || status === 'approved' ? 'verified' : status
        this.setState({ businessStatus: newStatus })

        await this.fetchOnboarding(this.state.businessId)

        notification.success({ message: res.message })
        window.location.reload()

        this.setState({
          remarks: '',
          errorMessage: [],
          approveloading: false,
          rejectloading: false,
          blockloading: false,
          syncLoading: false,
        })
      } else {
        this.setState({
          errorMessage: res?.error?.details?.length
            ? res?.error?.details
            : res?.error?.message?.length
            ? res?.error?.message
            : res?.message
            ? [{ message: res?.message }]
            : [],
          approveloading: false,
          rejectloading: false,
          blockloading: false,
          syncLoading: false,
        })
        notification.error({ message: res?.error?.error_message || res.message })
      }
    } catch (err) {
      this.setState({
        approveloading: false,
        rejectloading: false,
        blockloading: false,
        syncLoading: false,
      })
      notification.error({ message: err?.message || 'Something went wrong' })
    }
  }

  handleSubmitStatement = () => {
    this.props.dispatch({
      type: 'business/CHANGE_STATEMENT_DESCRIPTOR',
      payload: {
        businessId: this.state.bizDetail._id,
        displayName: { statement: { displayName: this.state.statement } },
      },
    })
    this.setState({ editable: false })
  }

  handleUnsend = async businessId => {
    Modal.confirm({
      title: 'Confirm Unsend',
      content:
        'This will delete the most recent Stripe submission for this merchant. Do you want to continue?',
      okText: 'Yes, Unsend',
      cancelText: 'Cancel',
      onOk: async () => {
        this.setState({ blockloading: true })
        try {
          const res = await updateOnboardingDataStatus('unsend', businessId)
          if (res && res.statusCode === 200) {
            this.setState({ businessStatus: 'not_started' })
            await this.fetchOnboarding(businessId)
            notification.success({ message: res.message })
            window.location.reload()
          } else {
            notification.error({ message: res?.error?.error_message || res.message })
          }
        } catch (err) {
          notification.error({ message: err?.message || 'Something went wrong' })
        } finally {
          this.setState({ blockloading: false })
        }
      },
    })
  }

  handleAddStripeAccountSubmit = async () => {
    if (!this.state.newStripeId) return
    this.setState({ addStripeLoading: true })
    const res = await addStripeAccount(this.state.businessId, this.state.newStripeId)
    this.setState({ addStripeLoading: false })
    if (res && res.statusCode === 200) {
      notification.success({ message: 'Stripe ID successfully added.' })
      this.setState({ showAddStripeModal: false, newStripeId: '' })
      this.fetchOnboarding(this.state.businessId) // Refresh
    } else {
      notification.error({ message: res?.message || 'Error occurred while adding Stripe ID' })
    }
  }

  toggleProviderModal = () =>
    this.setState(prevState => ({ showProviderModal: !prevState.showProviderModal }))

  render() {
    const {
      activeStep,
      isReadOnly,
      isPaymentOnboardingStepsVisible,
      showResubmitModal,
    } = this.state

    return (
      <div id="Onboarding" className="content-wrapper__main">
        <div className="container">
          {/* <div className="text-dark font-weight-bold font-size-24 border-bottom">
            <span className="mr-3">Business Risk</span>
          </div>
          <div className="d-flex">
            <div className="col-12 pl-0">
              <ProcessingFee
                isHideCreateTemplate
                isFullWidth
                isRiskLevel
                businessRiskLevel={this.state.bizDetail?.riskLevel}
              />
            </div>
          </div> */}

          {this.state.businessStatus === 'not_started' ? (
            <div>Merchant has not started onboarding</div>
          ) : isPaymentOnboardingStepsVisible ? (
            <div className="row mx-n2">
              <div className="col-md-3 px-2">
                <Stepper
                  activeStep={activeStep}
                  handleSteps={this.handleSteps}
                  stepperData={this.state.stepperData}
                  visitedStep={this.state.visitedStep}
                  currentStep={this.state.currentStep}
                />
              </div>
              <div className="col-md-9 px-2">
                <div className="content">
                  <div className="payment__onboarding__container">
                    <div className="payment__onboarding__content text-center">
                      <OnBoarding
                        handleSteps={this.handleSteps}
                        activeStep={activeStep}
                        formData={this.state.formData}
                        isReadOnly={isReadOnly}
                        stepperData={this.state.stepperData}
                        onBoardingData={this.state.onBoardingData}
                        checkStage={this.props.getPaymentSettings}
                        newOwnerflag={this.state.newOwnerflag}
                        businessId={this.state.businessId}
                        businessStatus={this.state.businessStatus}
                        isEditableOverride={this.state.isEditableOverride}
                        {...this.props}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-12 px-2">
                <ul>
                  {Array.isArray(this.state.errorMessage)
                    ? this.state.errorMessage.map(item => (
                        <li className="text-red" key={item?.message || item}>
                          {item?.message || item} {item?.target ? item?.target.join(' -> ') : ''}
                        </li>
                      ))
                    : null}
                </ul>
              </div>

              <div className="col-md-12 px-2">
                <b>Remarks :</b>
                <Input
                  className="mb-2 text-area-custom"
                  type="textarea"
                  value={this.state.remarks}
                  onChange={e => this.setState({ remarks: e.target.value })}
                />
              </div>

              <div className="col-md-12 px-2 mb-4">
                <div className="row">
                  {ApprovebtnShow.includes(this.state.businessStatus) && (
                    <div className="d-flex w-100 flex-column flex-md-row mb-3">
                      {this.state.availableProviders && this.state.availableProviders.length > 0 && (
                        <button
                          className="btn btn-outline-info col px-md-5 mr-md-2 mb-2 mb-md-0"
                          onClick={this.toggleProviderModal}
                        >
                          Select Provider
                          {this.state.selectedProviders.length > 0 && (
                            <span className="badge badge-pill badge-info ml-1">
                              {this.state.selectedProviders.includes('all')
                                ? 'All'
                                : this.state.selectedProviders.length}
                            </span>
                          )}
                        </button>
                      )}

                      <button
                        className="btn btn-outline-primary col px-md-5"
                        disabled={
                          this.state.approveloading ||
                          (this.state.availableProviders.length > 0 &&
                            this.state.selectedProviders.length === 0)
                        }
                        onClick={() =>
                          this.updateOnboardingStatus('approved', this.state.businessId)
                        }
                      >
                        {this.state.businessStatus === 'verified'
                          ? 'Add / Re-submit Provider'
                          : this.state.availableProviders.length > 0
                          ? 'Approve'
                          : 'Submit to provider'}
                        {this.state.approveloading && <Spinner size="sm" color="default" />}
                      </button>
                    </div>
                  )}

                  {ReSubmitShow.includes(this.state.businessStatus) && (
                    <button
                      className="btn btn-outline-primary col px-md-5"
                      disabled={this.state.approveloading}
                      onClick={this.showResubmitConfirm}
                    >
                      &nbsp; Resubmit &nbsp;
                      {this.state.approveloading && <Spinner size="sm" color="default" />}
                    </button>
                  )}

                  {UnsendShow.includes(this.state.businessStatus) &&
                    this.state.legalData?.providerName !== 'unified' && (
                      <button
                        className="btn btn-outline-danger col px-md-5 ml-2"
                        disabled={this.state.blockloading}
                        onClick={() => this.handleUnsend(this.state.businessId)}
                      >
                        &nbsp; Unsend &nbsp;
                        {this.state.blockloading && <Spinner size="sm" color="default" />}
                      </button>
                    )}

                  {RejctbtnShow.includes(this.state.businessStatus) && (
                    <button
                      className="btn btn-outline-warning col px-md-5 ml-2"
                      disabled={this.state.rejectloading}
                      onClick={() => this.updateOnboardingStatus('rejected', this.state.businessId)}
                    >
                      &nbsp; Reject &nbsp;
                      {this.state.rejectloading && <Spinner size="sm" color="default" />}
                    </button>
                  )}

                  {BlockbtnShow.includes(this.state.businessStatus) && (
                    <button
                      className="btn btn-outline-danger col px-md-5 ml-2"
                      disabled={this.state.blockloading}
                      onClick={() => this.updateOnboardingStatus('blocked', this.state.businessId)}
                    >
                      &nbsp; Block &nbsp;
                      {this.state.blockloading && <Spinner size="sm" color="default" />}
                    </button>
                  )}

                  {SubmittoProvShow.includes(this.state.businessStatus) &&
                    (!this.state.availableProviders ||
                      this.state.availableProviders.length === 0) && (
                      <button
                        className="btn btn-outline-primary col px-md-5 ml-2"
                        disabled={this.state.approveloading}
                        onClick={() =>
                          this.updateOnboardingStatus('approved', this.state.businessId)
                        }
                      >
                        &nbsp; Submit to provider &nbsp;
                        {this.state.approveloading && <Spinner size="sm" color="default" />}
                      </button>
                    )}

                  {SyncProvShow.includes(this.state.businessStatus) && (
                    <button
                      className="btn btn-outline-primary col px-md-5 ml-2"
                      disabled={this.state.syncLoading}
                      onClick={() => this.updateOnboardingStatus('sync', this.state.businessId)}
                    >
                      &nbsp; Resubmit POB to Provider &nbsp;
                      {this.state.syncLoading && <Spinner size="sm" color="default" />}
                    </button>
                  )}

                  {['submitted', 'verified', 'blocked'].includes(this.state.businessStatus) &&
                    !this.state.isEditableOverride && (
                      <button
                        className="btn btn-outline-secondary col px-md-5 ml-2"
                        onClick={() => this.setState({ isEditableOverride: true })}
                      >
                        &nbsp; Edit Details &nbsp;
                      </button>
                    )}

                  {!this.state.legalData?.merchantId &&
                    this.state.legalData?.providerName !== 'unified' && (
                      <button
                        className="btn btn-outline-success col px-md-5 ml-2"
                        onClick={() => this.setState({ showAddStripeModal: true })}
                      >
                        &nbsp; Link Account ID &nbsp;
                      </button>
                    )}
                </div>
              </div>

              {this.state.legalData && this.state.legalData.providerData && (
                <StripeLegalData
                  bizDetail={this.state.bizDetail}
                  handleSubmitStatement={this.handleSubmitStatement}
                  inputChange={e => this.setState({ statement: e.target.value })}
                  onCancelClick={() =>
                    this.setState({
                      statement: this.state.bizDetail.legal.statement.displayName,
                      editable: false,
                    })
                  }
                  onEditClick={() => this.setState({ editable: true })}
                  statement={this.state.statement}
                  editable={this.state.editable}
                />
              )}
            </div>
          ) : null}

          <div className="row mx-n2">
            <div className="col-md-12 px-2">
              <StripeRaw
                title="Provider Data"
                data={
                  this.state.legalData
                    ? JSON.stringify(this.state.legalData)
                    : this.props?.bizDetail?.legal
                    ? JSON.stringify(this.props?.bizDetail?.legal)
                    : null
                }
                onEdit
                handleEdit={this.handlelegalJSON}
                onDelete
                handleDelete={this.handlelegalJSON}
              />
            </div>
          </div>

          <Modal
            title="Confirm Re-submission"
            open={showResubmitModal}
            onOk={this.confirmResubmit}
            onCancel={this.hideResubmitConfirm}
            okText="Yes, Create Account"
            cancelText="Cancel"
            confirmLoading={this.state.approveloading}
          >
            <p>
              <strong>
                Are you sure you want to create another Stripe account for this merchant?
              </strong>
            </p>
            <p>This action will generate a new Stripe account</p>
          </Modal>

          <Modal
            title="Add Missing Stripe ID"
            open={this.state.showAddStripeModal}
            onOk={this.handleAddStripeAccountSubmit}
            onCancel={() => this.setState({ showAddStripeModal: false, newStripeId: '' })}
            confirmLoading={this.state.addStripeLoading}
          >
            <div className="mb-3">
              <label className="form-label">Stripe Account ID</label>
              <AntdInput
                placeholder="e.g. acct_12345"
                value={this.state.newStripeId}
                onChange={e => this.setState({ newStripeId: e.target.value })}
              />
              <small className="text-muted d-block mt-2">
                Manually link a disconnected Stripe account to this profile. Make sure the account
                ID is correct.
              </small>
            </div>
          </Modal>
          <Modal
            title="Select Payment Providers"
            open={this.state.showProviderModal}
            onOk={this.toggleProviderModal}
            onCancel={this.toggleProviderModal}
            okText="Confirm Selection"
            width={600}
          >
            <div className="provider-modal-content">
              <p className="mb-3 text-muted">
                Choose which providers to activate for this merchant upon approval.
              </p>
              <div className="list-group">
                <label
                  className="list-group-item list-group-item-action d-flex align-items-center mb-3 py-3"
                  style={{
                    cursor: 'pointer',
                    borderRadius: '8px',
                    border: '1px solid #e9ecef',
                    backgroundColor: '#f8f9fa',
                  }}
                >
                  <input
                    type="checkbox"
                    className="mr-3"
                    style={{ width: '22px', height: '22px', cursor: 'pointer' }}
                    checked={
                      this.state.selectedProviders.includes('all') ||
                      (visibleApprovalProviders(this.state.availableProviders).length > 0 &&
                        this.state.selectedProviders.length ===
                          visibleApprovalProviders(this.state.availableProviders).length)
                    }
                    onChange={e => {
                      if (e.target.checked) {
                        this.setState({ selectedProviders: ['all'] })
                      } else {
                        this.setState({ selectedProviders: [] })
                      }
                    }}
                  />
                  <div>
                    <h6
                      className="mb-0 font-weight-bold"
                      style={{ fontSize: '15px', color: '#343a40' }}
                    >
                      All Available Providers
                    </h6>
                    <small className="text-muted">
                      Activate all supported payment networks, bank processors, and digital assets
                    </small>
                  </div>
                </label>

                {visibleApprovalProviders(this.state.availableProviders)
                  .sort((a, b) => {
                    const idxA = ORDERED_PROVIDERS.indexOf(a)
                    const idxB = ORDERED_PROVIDERS.indexOf(b)
                    if (idxA === -1) return 1
                    if (idxB === -1) return -1
                    return idxA - idxB
                  })
                  .map(provider => (
                    <label
                      key={provider}
                      className="list-group-item list-group-item-action d-flex align-items-start py-3 mb-2"
                      style={{
                        cursor: 'pointer',
                        borderRadius: '8px',
                        border: '1px solid #e9ecef',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <input
                        type="checkbox"
                        className="mr-3 mt-1"
                        style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                        checked={
                          this.state.selectedProviders.includes('all') ||
                          this.state.selectedProviders.includes(provider)
                        }
                        onChange={e => {
                          let newSelected = [...toProviderArray(this.state.selectedProviders)]
                          const filteredAvailable = visibleApprovalProviders(
                            this.state.availableProviders,
                          )
                          if (newSelected.includes('all')) {
                            newSelected = [...filteredAvailable]
                          }

                          if (e.target.checked) {
                            if (!newSelected.includes(provider)) newSelected.push(provider)
                          } else {
                            newSelected = newSelected.filter(p => p !== provider)
                          }

                          if (newSelected.length === filteredAvailable.length) {
                            newSelected = ['all']
                          }
                          this.setState({ selectedProviders: newSelected })
                        }}
                      />
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center mb-2">
                          <h6
                            className="mb-0 font-weight-bold"
                            style={{ fontSize: '15px', color: '#212529', textTransform: 'none' }}
                          >
                            {PROVIDER_DETAILS[provider]?.title || provider.toUpperCase()}
                          </h6>
                          {(toProviderArray(
                            this.state.legalData?.providerData?.activeProviders,
                          ).includes(provider) ||
                            this.state.legalData?.providerName === provider) && (
                            <span
                              className="badge badge-success ml-2 px-2 py-1"
                              style={{
                                fontSize: '10px',
                                textTransform: 'uppercase',
                                borderRadius: '4px',
                                fontWeight: '600',
                                backgroundColor: '#28a745',
                                color: '#fff',
                              }}
                            >
                              Active
                            </span>
                          )}
                          <span
                            className="badge badge-secondary ml-2 px-2 py-1"
                            style={{
                              fontSize: '10px',
                              textTransform: 'uppercase',
                              backgroundColor: '#e9ecef',
                              color: '#495057',
                              borderRadius: '4px',
                              fontWeight: '600',
                            }}
                          >
                            {PROVIDER_DETAILS[provider]?.category || 'Card Processing'}
                          </span>
                        </div>
                        <div className="pl-0 mt-1">
                          <ul
                            className="mb-0 text-muted list-unstyled"
                            style={{ fontSize: '12px', paddingLeft: '0' }}
                          >
                            {(PROVIDER_DETAILS[provider]?.features || []).map((feature, idx) => (
                              <li
                                key={idx}
                                className="d-flex align-items-start mb-1"
                                style={{ lineHeight: '1.5' }}
                              >
                                <span className="text-success mr-2" style={{ fontWeight: 'bold' }}>
                                  ✓
                                </span>
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </label>
                  ))}
              </div>
            </div>
          </Modal>
          <Modal
            title="Approval Progress"
            open={this.state.showProgressModal}
            footer={
              !this.state.approveloading ? (
                <button
                  className="btn btn-primary"
                  onClick={() => this.setState({ showProgressModal: false })}
                >
                  Close
                </button>
              ) : null
            }
            closable={!this.state.approveloading}
            maskClosable={false}
          >
            <div className="approval-progress-content">
              {Object.entries(this.state.approvalProgress).map(([provider, progress]) => (
                <div key={provider} className="d-flex align-items-center mb-3">
                  <div className="mr-3" style={{ width: '24px' }}>
                    {progress.status === 'pending' && <i className="fe fe-clock text-muted" />}
                    {progress.status === 'processing' && <Spinner size="sm" color="primary" />}
                    {progress.status === 'success' && (
                      <i className="fe fe-check-circle text-success" style={{ fontSize: '20px' }} />
                    )}
                    {progress.status === 'error' && (
                      <i className="fe fe-x-circle text-danger" style={{ fontSize: '20px' }} />
                    )}
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="mb-0">
                      {PROVIDER_DETAILS[provider]?.title ||
                        provider
                          .split('_')
                          .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                          .join(' ')}{' '}
                      Submission
                    </h6>
                    <small className={progress.status === 'error' ? 'text-danger' : 'text-muted'}>
                      {progress.message}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          </Modal>
        </div>
      </div>
    )
  }
}

export default withRouter(connect(mapStateToProps, null)(PaymentOnboarding))
