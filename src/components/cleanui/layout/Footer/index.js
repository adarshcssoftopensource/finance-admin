import React from 'react'
import style from './style.module.scss'

const Footer = () => {
  return (
    <div className={style.footer}>
      <div className={style.footerInner}>
        <p className="mb-0">
          Copyright © 2020 Peymynt Financial Inc. All Rights Reserved. |{' '}
          <a
            href="https://peymynt.com/privacy-policy.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  )
}

export default Footer
