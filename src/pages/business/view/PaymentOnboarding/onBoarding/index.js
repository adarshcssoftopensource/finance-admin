/* eslint-disable */
import { parse } from 'query-string'
import React, { Component, Fragment, useEffect, useState } from 'react'
import Form from '@rjsf/core'
import { Spinner } from 'reactstrap'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { get as _get, cloneDeep as _cloneDeep } from 'lodash'
import { Helmet } from 'react-helmet'
import 'react-phone-input-2/lib/style.css'
import { uiSchema, uiSchema1 } from './common/ui-schema'
import {
  fetchPaymentOnboardingSteps,
  onboardingDataSubmit,
  updateOnboardingDataStatus,
} from 'services/business'
import { notification } from 'antd'
import OnboardingSuccessPage from './Pages/OnboardinfSuccessPage'

const SavebtnShow = ['started', 'finished', 'awaiting_approval', 'rejected', 'need_verification']
const disableform = ['submitted', 'verified', 'blocked']
let halfCount = 0
export function CustomFieldTemplate(props) {
  const {
    id,
    classNames,
    label,
    rawDescription,
    help,
    required,
    description,
    errors,
    children,
    schema,
  } = props
  halfCount = schema.data === 'half' && halfCount++
  return (
    <div
      className={`${classNames} ${schema.data} ${id.toLowerCase()} ${label
        .replace(/\s/g, '')
        .toLowerCase()}`}
    >
      {!_get(schema, 'isLabelHide', false) ? (
        <label
          className={`${_get(schema, 'isLabelAsTitle', false) ? 'label-title' : 'label'}`}
          htmlFor={id}
        >
          {label}
          {schema.isAsterhide ? ' ' : required ? '*' : null}
        </label>
      ) : (
        ''
      )}

      {!_get(schema, 'isDescriptionHide', false)
        ? rawDescription && <div className="field-description">{rawDescription}</div>
        : ''}

      {halfCount <= 1 ? (
        <div className="row">
          <div className={'col-lg-12 col-md-12 col-sm-12 col-xs-12'} key={id}>
            {children}
          </div>
          {errors && errors.props && errors.props.errors ? (
            <div style={{ color: 'red', marginLeft: '15px' }}>{errors.props.errors[0]}</div>
          ) : (
            ''
          )}
        </div>
      ) : (
        <div className="row">
          <div className={'col-lg-6 col-md-6 col-sm-6 col-xs-6'} key={id}>
            {children}
          </div>
        </div>
      )}
    </div>
  )
}

function transformErrors(errors) {
  return errors.map(error => {
    if (error.name === 'pattern') {
      error.message = `${error?.property?.replace('.', '')} is not valid`
    }
    if (error.name === 'oneOf' || error.name === 'enum') error.message = ''
    return error
  })
}

const validate = (formData, errors) => {
  if (formData && formData.merchantAgreementAccepted === false) {
    errors.merchantAgreementAccepted.addError('Accept Terms and Conditions')
  }
  if (formData && formData.annualCardVolume < formData.maxTransactionAmount) {
    errors.maxTransactionAmount.addError(
      'The projected maximum transactional amount cannot exceed projected annual transactional volume.',
    )
  }
  if (formData && formData.idNumber && formData.idNumber.includes('_')) {
    errors.idNumber.addError('should not be shorter than 9 characters')
  }
  if (formData && formData.taxNumber && formData.taxNumber.includes('_')) {
    errors.taxNumber.addError('should not be shorter than 9 characters')
  }
  if (formData && formData.telephone && formData.telephone.length < 9) {
    errors.telephone.addError('Phone number is not valid')
  }
  if (formData && formData.personalPhone && formData.personalPhone.length < 9) {
    errors.personalPhone.addError('Phone number is not valid')
  }
  return errors
}

class PaymentOnBoarding extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {},
      step: 1,
      loading: false,
      savedData: {
        businessType: '',
        legalName: '',
        flagforsuccess: false,
        Ownership: '',
        savebuttonflag: false,
        businessStatus: '',
      },
      flagAdditionalOwner: false,
      additionalFieldSchema: {},
      ownermainData: {},
      openSummary: false,
      setShowFunc: null,
      isSavedClicked: false,
      additionalOwners: [],
    }
  }

  componentWillReceiveProps(props) {
    let limit = this.parseLimit(props)
    const onBoarding = _cloneDeep(props.onBoardingData)
    this.setState(prevState => ({
      savedData: {
        ...this.state.savedData,
        businessStatus: this.props.businessStatus,
      },
    }))

    if (onBoarding) {
      if (props.onBoardingData.properties && props.onBoardingData.properties.additionalOwners) {
        this.setState({
          additionalFieldSchema: onBoarding.properties.additionalOwners,
          additionalOwners: _get(props.formData, 'additionalOwners', []),
        })
        delete props.onBoardingData.properties.additionalOwners
        this.setState({
          data: props.onBoardingData,
        })
      }
      if (
        props.onBoardingData.properties &&
        props.onBoardingData.properties.hasAcceptedCreditCardInPast
      ) {
        {
          props.formData.hasAcceptedCreditCardInPast
            ? (props.formData.hasAcceptedCreditCardInPast = 'true')
            : (props.formData.hasAcceptedCreditCardInPast = 'false')
        }
      }
      if (this.state.savedData.businessType === 'INDIVIDUAL_SOLE_PROPRIETORSHIP') {
        delete props.onBoardingData.properties.taxNumber
        props.formData && props.formData.taxNumber == ''
      }
      this.setState({
        data: props.onBoardingData,
        step: props.activeStep + 1,
        flagAdditionalOwner: props.newOwnerflag,
      })
    }

    if (this.state.limit !== limit) {
      this.setState({ limit })
    }

    if (this.state.openSummary) {
      this.setState({ openSummary: false })
    }
  }

  ArrayFieldTemplate1 = props => {
    const [show, setShow] = useState(true)

    if (!this.state.setShowFunc) {
      this.setState({ setShowFunc: setShow, isSavedClicked: true })
    }
    return (
      <div>
        <div className="py-header--title">
          <div className="mb-3 h5"> {props.schema.title}</div>
          <hr />
          <div className="py-text">{props.schema.description}</div>
          {show ? (
            <div>
              <div className="row">
                <div className="col text-left stepthreelisthead">You</div>
              </div>
              <div className="row">
                <div className="col text-left stepthreelist">{props.formContext.firstName}</div>
                <div className="col text-left stepthreelist">
                  {props.formContext.ownership}% Ownership
                </div>
              </div>
              {props.formContext.ownership !== 100 ? (
                <div>
                  <div className="row">
                    <div className="col text-left stepthreelisthead">Additional Owners</div>
                  </div>
                  {_get(props.formContext, 'additionalOwners', props.formData).map((val, i) => {
                    return (
                      <div className="row" key={i}>
                        <div className="col text-left stepthreelist">{val.firstName}</div>
                        <div className="col text-left stepthreelist">
                          {val.ownership}% Ownership
                        </div>
                      </div>
                    )
                  })}
                  <div className="text-center">
                    <button
                      type="button"
                      className="additionalOwnerButton"
                      onClick={() => {
                        setShow(false)
                        setTimeout(() => {
                          this.setState({ openSummary: false })
                        }, 1000)
                      }}
                    >
                      {this.state.additionalOwners.length === 0 ? 'Add' : 'Edit'} aditional owner
                    </button>
                  </div>
                </div>
              ) : (
                ''
              )}
            </div>
          ) : (
            <div>
              {props.items.map((element, index) => (
                <div>
                  <div className="additional_field">
                    <div key={index}>{element.children}</div>
                  </div>
                  {/* <hr /> */}

                  {props.items.length != 0 ? (
                    <div>
                      {props.items[index].hasRemove && (
                        <button
                          type="danger"
                          aria-label="Remove"
                          className="array-item-remove btn btn-danger"
                          tabIndex="-1"
                          style={{ float: 'right', margin: '15px' }}
                          disabled={props.disabled || props.readonly}
                          onClick={props.items[index].onDropIndexClick(index)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              ))}
              {props.canAdd && (
                <div className="text-left">
                  <button
                    type="button"
                    className="additionalOwnerButton"
                    onClick={props.onAddClick}
                  >
                    + Add aditional owner
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <br />
      </div>
    )
  }

  parseLimit(props) {
    const {
      location: { search },
    } = props
    const params = parse(search.substring(1))
    let limit = parseInt(params.limit || 'a')

    if (isNaN(limit)) {
      limit = undefined
    }

    return limit
  }

  toggleDropdown = () => {
    this.setState({ dropdownOpen: !this.state.dropdownOpen })
  }

  onSubmit = async ({ formData }) => {
    if (this.state.isSavedClicked) {
      this.state.setShowFunc(true)
    }

    if (this.state.setShowFunc) {
      this.setState({ setShowFunc: null })
    }

    if (formData && formData.legalName) {
      this.setState({
        savedData: {
          ...this.state.savedData,
          legalName: formData.legalName,
        },
      })
    }

    if (formData.ownership && formData.ownership !== 100) {
      this.setState({
        flagAdditionalOwner: true,
        ownermainData: formData,
        openSummary: true,
      })
      return
    }
    if (
      Object.keys(this.state.additionalFieldSchema).length !== 0 &&
      this.state.savedData.businessType != 'INDIVIDUAL_SOLE_PROPRIETORSHIP' &&
      formData.ownership < 100 &&
      !this.state.flagAdditionalOwner
    ) {
      this.setState({
        flagAdditionalOwner: true,
        ownermainData: formData,
      })
      return
    }
    if (
      Object.keys(this.state.additionalFieldSchema).length !== 0 &&
      this.state.flagAdditionalOwner &&
      this.state.ownermainData.ownership < 100
    ) {
      let a = formData
      formData = this.state.ownermainData
      formData.additionalOwners = a
    }
    if (
      this.state.isSavedClicked &&
      formData.additionalFieldSchema &&
      formData.additionalOwners.length &&
      formData.additionalOwners[0].ownership
    ) {
      this.setState({
        isSavedClicked: false,
        openSummary: true,
        additionalOwners: formData.additionalOwners,
      })
      return
    }
    if (
      this.state.step &&
      1 <= this.state.step &&
      this.state.step <= this.props.stepperData.length
    ) {
      this.setState({
        loading: true,
      })

      formData.step = this.state.step

      const url = window.location.href.split('/').pop() || window.location.href.split('/').pop()
      const businessId = url.split('?')[0]
      await onboardingDataSubmit(formData, businessId)
        .then(res => {
          this.setState({
            loading: false,
            isSavedClicked: false,
            setShowFunc: null,
          })
          if (res.statusCode == 200) {
            if (this.state.step != this.props.stepperData.length) {
              this.props.handleSteps(this.state.step)
            }
            if (this.state.step == this.props.stepperData.length) {
              notification.success({
                message: res.message,
              })
              this.props.checkStage()
              this.props.disablestep()
              this.setState({
                savedData: {
                  ...this.state.savedData,
                  flagforsuccess: true,
                },
              })
              this.setState({
                data: this.props.onBoardingData,
              })
            } else {
              this.setState({
                data: this.props.onBoardingData,
                step: this.state.step + 1,
              })
            }
          } else {
            notification.error({
              message: res.message,
            })
          }
        })
        .catch(err => {
          this.setState({
            loading: false,
          })
        })
    }
  }

  onCancel = async () => {
    if (
      this.state.step &&
      1 < this.state.step &&
      this.state.step <= this.props.stepperData.length
    ) {
      const onBoardingStepData = await fetchPaymentOnboardingSteps(this.state.step - 1)
      if (onBoardingStepData && onBoardingStepData.data) {
        this.setState({
          data: onBoardingStepData?.data?.stepSchema,
          step: this.state.step - 1,
        })
      }
    }
  }

  handleOpenSummary = val => {
    this.setState({ openSummary: val })
  }

  render() {
    const queryParams = new URLSearchParams(window.location.search)
    const step = queryParams.get('step')
    const displayAdditional =
      Object.keys(this.state.additionalFieldSchema).length !== 0 &&
      this.state.flagAdditionalOwner &&
      this.state.ownermainData.ownership < 100
    let isPersonalInformation =
      this.props.stepperData[this.state.step - 1] &&
      this.props.stepperData[this.state.step - 1].name === 'Personal Information'
    return (
      <Fragment>
        <Helmet>
          <meta name="viewport" content="" />
        </Helmet>
        <div className="content-wrapper__main dashboard-wrapper">
          {this.state.savedData &&
          this.state.savedData.flagforsuccess == true &&
          this.state.step == this.props.stepperData.length ? (
            <OnboardingSuccessPage />
          ) : (
            <div>
              <div>
                {Object.keys(this.state.data).length !== 0 ? (
                  <>
                    <Form
                      key={`onboarding-step-${this.props.activeStep}`}
                      schema={
                        displayAdditional ? this.state.additionalFieldSchema : this.state.data
                      }
                      uiSchema={displayAdditional ? uiSchema1 : uiSchema}
                      showErrorList={false}
                      className="onboarding-form-wrapper"
                      FieldTemplate={CustomFieldTemplate}
                      onSubmit={this.onSubmit}
                      validate={validate}
                      disabled={
                        disableform.includes(this.props.businessStatus) &&
                        !this.props.isEditableOverride
                      }
                      noHtml5Validate={true}
                      formContext={
                        displayAdditional ? this.state.ownermainData : this.state.savedData
                      }
                      ArrayFieldTemplate={this.ArrayFieldTemplate1}
                      transformErrors={transformErrors}
                      formData={
                        displayAdditional ? this.state.additionalOwners : this.props.formData
                      }
                    >
                      <div className="text-center mt-4">
                        {isPersonalInformation && !this.state.openSummary ? (
                          <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={this.state.loading}
                          >
                            &nbsp; Save and continue &nbsp;
                            {this.state.loading && <Spinner size="sm" color="default" />}
                          </button>
                        ) : (
                          <>
                            {!(this.state.step == this.props.stepperData.length) && (
                              <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={this.state.loading}
                                onClick={() => {
                                  if (isPersonalInformation) {
                                    this.setState({ isSavedClicked: false })
                                  }
                                }}
                              >
                                &nbsp; Save and continue &nbsp;
                                {this.state.loading && <Spinner size="sm" color="default" />}
                              </button>
                            )}
                          </>
                        )}
                      </div>
                      {this.state.step == this.props.stepperData.length ? (
                        <div className="mx-md-n5 text-center" style={{ marginTop: '20px' }}>
                          {SavebtnShow.includes(this.props.businessStatus) && (
                            <button type="submit" className="btn btn-primary col w-25 px-md-5">
                              &nbsp; Save &nbsp;
                              {this.state.loading && <Spinner size="sm" color="default" />}{' '}
                            </button>
                          )}
                        </div>
                      ) : (
                        ''
                      )}
                    </Form>
                  </>
                ) : (
                  // <CenterSpinner />
                  ''
                )}
              </div>
            </div>
          )}
        </div>
      </Fragment>
    )
  }
}

export default withRouter(PaymentOnBoarding)
