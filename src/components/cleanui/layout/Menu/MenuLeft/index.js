/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import { Menu, Layout } from 'antd'
import classNames from 'classnames'
import store from 'store'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { find } from 'lodash'
import style from './style.module.scss'
import MenuConfigModal from './MenuConfigModal'
import { Button } from 'antd'

const mapStateToProps = ({ menu, settings, user }) => ({
  menuData: menu.menuData,
  isMenuCollapsed: settings.isMenuCollapsed,
  isMobileView: settings.isMobileView,
  isMenuUnfixed: settings.isMenuUnfixed,
  isMenuShadow: settings.isMenuShadow,
  leftMenuWidth: settings.leftMenuWidth,
  menuColor: settings.menuColor,
  logoShort: settings.logoShort,
  logo: settings.logo,
  role: user.role,
})

const MenuLeft = ({
  dispatch,
  menuData = [],
  location: { pathname },

  isMobileView,
  isMenuUnfixed,
  isMenuShadow,
  leftMenuWidth,
  menuColor,
  logoShort,
  logo,
  role,
}) => {
  const [selectedKeys, setSelectedKeys] = useState(store.get('app.menu.selectedKeys') || [])
  const [openedKeys, setOpenedKeys] = useState(store.get('app.menu.openedKeys') || [])
  const [isMenuCollapsedOnClick, setMenuCollapsedOnClick] = useState(false)
  const [isConfigModalVisible, setIsConfigModalVisible] = useState(false)

  const handleSaveOrder = newOrder => {
    store.set('app.menu.order', newOrder)
    setIsConfigModalVisible(false)
    window.location.reload() // Reload to apply changes through saga
  }

  useEffect(() => {
    applySelectedKeys()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, menuData])

  const applySelectedKeys = () => {
    const flattenItems = (items, key) =>
      items.reduce((flattenedItems, item) => {
        flattenedItems.push(item)
        if (Array.isArray(item[key])) {
          return flattenedItems.concat(flattenItems(item[key], key))
        }
        return flattenedItems
      }, [])

    const items = flattenItems(menuData, 'children')
    let selectedItem = find(items, ['url', pathname])

    if (!selectedItem) {
      // If no exact match, try prefix matching, prioritizing longer matches
      const matches = items
        .filter(item => item.url && pathname.startsWith(item.url))
        .sort((a, b) => b.url.length - a.url.length)

      if (matches.length > 0) {
        selectedItem = matches[0]
      }
    }

    setSelectedKeys(selectedItem ? [selectedItem.key] : [])
  }

  const onCollapse = (value, type) => {
    if (type === 'responsive' && isMenuCollapsedOnClick) {
      return
    }
    if (type === 'clickTrigger') {
      setMenuCollapsedOnClick(!isMenuCollapsedOnClick)
      dispatch({
        type: 'settings/CHANGE_SETTING',
        payload: {
          setting: 'isMenuCollapsed',
          value: !isMenuCollapsedOnClick,
        },
      })
      setOpenedKeys([])
    }
  }

  const onOpenChange = keys => {
    store.set('app.menu.openedKeys', keys)
    setOpenedKeys(keys)
  }

  const handleClick = e => {
    store.set('app.menu.selectedKeys', [e.key])
    setSelectedKeys([e.key])
  }

  const generateMenuItems = () => {
    const generateItem = item => {
      const { key, title, url, icon, disabled, count } = item
      if (item.category) {
        return <Menu.ItemGroup key={Math.random()} title={item.title} />
      }
      if (item.url) {
        return (
          <Menu.Item key={key} disabled={disabled}>
            {item.target && (
              <a href={url} target={item.target} rel="noopener noreferrer">
                <span className={style.title}>{title}</span>
                {count && <span className="badge badge-success ml-2">{count}</span>}
                {icon && <span className={`${icon} ${style.icon} icon-collapsed-hidden`} />}
              </a>
            )}
            {!item.target && (
              <Link to={url}>
                <span className={style.title}>{title}</span>
                {count && <span className="badge badge-success ml-2">{count}</span>}
                {icon && <span className={`${icon} ${style.icon} icon-collapsed-hidden`} />}
              </Link>
            )}
          </Menu.Item>
        )
      }
      return (
        <Menu.Item key={key} disabled={disabled}>
          <span className={style.title}>{title}</span>
          {count && <span className="badge badge-success ml-2">{count}</span>}
          {icon && <span className={`${icon} ${style.icon} icon-collapsed-hidden`} />}
        </Menu.Item>
      )
    }

    const generateSubmenu = items =>
      items.map(menuItem => {
        if (menuItem.children) {
          const subMenuTitle = (
            <span key={menuItem.key}>
              <span className={style.title}>{menuItem.title}</span>
              {menuItem.count && <span className="badge badge-success ml-2">{menuItem.count}</span>}
              {menuItem.icon && <span className={`${menuItem.icon} ${style.icon}`} />}
            </span>
          )
          return (
            <Menu.SubMenu title={subMenuTitle} key={menuItem.key}>
              {generateSubmenu(menuItem.children)}
            </Menu.SubMenu>
          )
        }
        return generateItem(menuItem)
      })

    return menuData.map(menuItem => {
      if (menuItem.roles && !menuItem.roles.includes(role)) {
        return null
      }
      if (menuItem.children) {
        const subMenuTitle = (
          <span key={menuItem.key}>
            <span className={style.title}>{menuItem.title}</span>
            {menuItem.count && <span className="badge badge-success ml-2">{menuItem.count}</span>}
            {menuItem.icon && <span className={`${menuItem.icon} ${style.icon}`} />}
          </span>
        )
        return (
          <Menu.SubMenu title={subMenuTitle} key={menuItem.key}>
            {generateSubmenu(menuItem.children)}
          </Menu.SubMenu>
        )
      }
      return generateItem(menuItem)
    })
  }

  const menuSettings = isMobileView
    ? {
        width: leftMenuWidth,
        collapsible: false,
        collapsed: false,
        onCollapse,
      }
    : {
        width: leftMenuWidth,
        collapsible: true,
        collapsed: isMenuCollapsedOnClick,
        onCollapse,
        breakpoint: 'lg',
      }

  return (
    <Layout.Sider
      {...menuSettings}
      className={classNames(`${style.menu}`, {
        [style.white]: menuColor === 'white',
        [style.gray]: menuColor === 'gray',
        [style.dark]: menuColor === 'dark',
        [style.unfixed]: isMenuUnfixed,
        [style.shadow]: isMenuShadow,
      })}
    >
      <div
        className={style.menuOuter}
        style={{
          width: isMenuCollapsedOnClick && !isMobileView ? 80 : leftMenuWidth,
          height: isMobileView || isMenuUnfixed ? 'calc(100% - 64px)' : 'calc(100% - 50px)',
        }}
      >
        <div className={style.logoContainer}>
          <Link to="/dashboard">
            <div className={style.logo}>
              <img
                src={isMenuCollapsedOnClick && !isMobileView ? logoShort : logo}
                className={
                  isMenuCollapsedOnClick && !isMobileView ? style.logoIcon : style.logoWordmark
                }
                alt="Finance Business"
              />
            </div>
          </Link>
        </div>
        <div style={{ height: 'calc(100% - 110px)', position: 'relative' }}>
          <PerfectScrollbar>
            <Menu
              onClick={handleClick}
              selectedKeys={selectedKeys}
              openKeys={openedKeys}
              onOpenChange={onOpenChange}
              mode="inline"
              className={style.navigation}
              inlineIndent="15"
            >
              {generateMenuItems()}
            </Menu>
          </PerfectScrollbar>
        </div>
        {!isMobileView && !isMenuCollapsedOnClick && (
          <div className={style.menuSettings}>
            <Button
              type="dashed"
              block
              onClick={() => setIsConfigModalVisible(true)}
              style={{
                borderRadius: '0',
                fontSize: '14px',
                height: '50px',
                borderRight: 'none',
                borderLeft: 'none',
              }}
            >
              <i className="fe fe-settings mr-2" />
              Configure Menu
            </Button>
          </div>
        )}
        <MenuConfigModal
          visible={isConfigModalVisible}
          onCancel={() => setIsConfigModalVisible(false)}
          onSave={handleSaveOrder}
          menuData={menuData}
        />
      </div>
    </Layout.Sider>
  )
}

export default withRouter(connect(mapStateToProps)(MenuLeft))
