import { all, put, call } from 'redux-saga/effects'
import getMenuData, { getMenuItemCount } from 'services/menu'
import store from 'store'

export function* GET_DATA() {
  const countData = (yield call(getMenuItemCount)) || {}
  let menuData = yield call(getMenuData)

  // Reorder menu based on local storage
  const savedOrder = store.get('app.menu.order') || []
  if (savedOrder.length > 0) {
    const menuMap = new Map(menuData.map(item => [item.key, item]))
    const orderedItems = []
    const unorderedItems = []

    savedOrder.forEach(key => {
      if (menuMap.has(key)) {
        orderedItems.push(menuMap.get(key))
        menuMap.delete(key)
      }
    })

    menuMap.forEach(item => {
      unorderedItems.push(item)
    })

    menuData = [...orderedItems, ...unorderedItems]
  }

  menuData = menuData.map(value => {
    const rawCount = countData && countData[value.key]
    if (rawCount != null && (typeof rawCount === 'number' || typeof rawCount === 'string')) {
      return {
        ...value,
        count: rawCount,
      }
    }
    return value
  })
  yield put({
    type: 'menu/SET_STATE',
    payload: {
      menuData,
    },
  })
}

export default function* rootSaga() {
  yield all([
    GET_DATA(), // run once on app load to fetch menu data
  ])
}
