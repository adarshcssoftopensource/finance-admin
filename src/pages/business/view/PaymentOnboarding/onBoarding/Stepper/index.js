/* eslint-disable */
import 'rc-steps/assets/index.css'
// import 'rc-steps/assets/iconfont.css'
import React, { useEffect, useState } from 'react'
import Steps, { Step } from 'rc-steps'
import { get as _get } from 'lodash'

const _documentTitle = (businessInfo, title) => {
  const parts = ['Peymynt']
  if (businessInfo && businessInfo.organizationName) {
    parts.push(businessInfo.organizationName)
  }
  if (title) {
    parts.push(title)
  }
  document.title = parts.join(' - ')
}

const index = props => {
  const [stepflag, setstepflag] = useState()
  useEffect(() => {
    setstepflag(props.currentStep)
    _documentTitle(
      {},
      _get(props.stepperData[props.activeStep], 'name', props.stepperData[props.activeStep]),
    )
  })

  return (
    <Steps direction="vertical" current={props.activeStep}>
      {(props.stepperData || []).map((step, idx) => (
        <Step
          key={idx}
          title={_get(step, 'name', step)}
          onClick={() => {
            props.handleSteps(idx)
          }}
        />
      ))}
    </Steps>
  )
}

export default index
