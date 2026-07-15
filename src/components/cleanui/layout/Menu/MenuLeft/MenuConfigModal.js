/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { Modal, Button } from 'antd'
import { ReactSortable } from 'react-sortablejs'
import store from 'store'
import style from './style.module.scss'

const MenuConfigModal = ({ visible, onCancel, onSave, menuData }) => {
  const [items, setItems] = useState([])

  useEffect(() => {
    if (visible && menuData.length > 0) {
      // Get saved order
      const savedOrder = store.get('app.menu.order') || []

      // Map menuData to sortable items
      // If we have a saved order, we need to respect it
      let sortedItems = [...menuData]

      if (savedOrder.length > 0) {
        const orderedItems = []
        const unorderedItems = []

        // Create a map for quick lookup
        const menuMap = new Map(menuData.map(item => [item.key, item]))

        // Add items in the saved order
        savedOrder.forEach(key => {
          if (menuMap.has(key)) {
            orderedItems.push(menuMap.get(key))
            menuMap.delete(key)
          }
        })

        // Add any remaining items (new items not in saved order)
        menuMap.forEach(item => {
          unorderedItems.push(item)
        })

        sortedItems = [...orderedItems, ...unorderedItems]
      }

      setItems(sortedItems)
    }
  }, [visible, menuData])

  const handleSave = () => {
    const keys = items.map(item => item.key)
    onSave(keys)
  }

  const resetOrder = () => {
    setItems([...menuData])
  }

  return (
    <Modal
      title="Configure Menu Order"
      visible={visible}
      onOk={handleSave}
      onCancel={onCancel}
      footer={[
        <Button key="reset" onClick={resetOrder}>
          Reset Default
        </Button>,
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSave}>
          Save Order
        </Button>,
      ]}
    >
      <div className={style.sortableContainer}>
        <p className="mb-3 text-muted">Drag and drop items to reorder the sidebar menu.</p>
        <ReactSortable
          list={items}
          setList={setItems}
          animation={150}
          className={style.sortableList}
        >
          {items.map(item => (
            <div
              key={item.key}
              className={`${style.sortableItem} mb-2 p-2 border rounded bg-light cursor-move d-flex align-items-center`}
            >
              <i className="fe fe-menu mr-3 text-muted" />
              <div className="d-flex align-items-center">
                {item.icon && <i className={`${item.icon} mr-2`} />}
                <span>{item.title}</span>
              </div>
            </div>
          ))}
        </ReactSortable>
      </div>
    </Modal>
  )
}

export default MenuConfigModal
