/* eslint-disable */
import React from 'react'
import classNames from 'classnames'
import style from './style.module.scss'

const Loader = ({ spinning = true, children, fullScreen = false, tip = '' }) => {
  if (!spinning && !children) {
    return null
  }

  return (
    <div className={classNames(style.loaderWrapper, { [style.fullScreen]: fullScreen })}>
      {children}
      {spinning && (
        <div className={style.loaderOverlay}>
          <div className={style.loaderContainer}>
            <div className={style.spinner}>
              <div className={style.doubleBounce1} />
              <div className={style.doubleBounce2} />
            </div>
            {tip && <div className={style.tip}>{tip}</div>}
          </div>
        </div>
      )}
    </div>
  )
}

export default Loader
