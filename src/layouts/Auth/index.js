import React from 'react'
import { connect } from 'react-redux'
import { Layout } from 'antd'
import { withRouter } from 'react-router-dom'
import classNames from 'classnames'
// import Sidebar from 'components/cleanui/layout/Sidebar'
// import SupportChat from 'components/cleanui/layout/SupportChat'
import style from './style.module.scss'

const mapStateToProps = ({ settings }) => ({
  isGrayTopbar: settings.isGrayTopbar,
  isCardShadow: settings.isCardShadow,
  isSquaredBorders: settings.isSquaredBorders,
  isBorderless: settings.isBorderless,
  authPagesColor: settings.authPagesColor,
})

const AuthLayout = ({ children, isCardShadow, isSquaredBorders, isBorderless, authPagesColor }) => {
  return (
    <Layout>
      <Layout.Content>
        {/* <Sidebar /> */}
        {/* <SupportChat /> */}
        <div
          className={classNames(`${style.container}`, {
            cui__layout__squaredBorders: isSquaredBorders,
            cui__layout__cardsShadow: isCardShadow,
            cui__layout__borderless: isBorderless,
            [style.white]: authPagesColor === 'white',
            [style.gray]: authPagesColor === 'gray',
          })}
          style={{
            marginTop: '30px',
            backgroundImage:
              authPagesColor === 'image' ? 'url(resources/images/content/photos/7.jpg)' : '',
          }}
        >
          <div className={style.containerInner}>{children}</div>
        </div>
      </Layout.Content>
    </Layout>
  )
}

export default withRouter(connect(mapStateToProps)(AuthLayout))
