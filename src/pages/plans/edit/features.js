import React from 'react'
import ReactDragListView from 'react-drag-listview/lib'
import { Modal } from 'antd'

const { confirm } = Modal

const Index = ({ data, dragProps, handleFeatureDelete, onEditFeature }) => {
  const showDeleteConfirm = idx => {
    confirm({
      title: `Are you sure you want to delete this feature?`,
      content: '',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleFeatureDelete(idx)
      },
      onCancel() {},
    })
  }
  return (
    <>
      <span className="filter-label">Features</span>
      <div>
        <ReactDragListView {...dragProps}>
          <ul className="list-group">
            {data &&
              data.features.map((feature, idx) => (
                <li
                  key={feature.title}
                  className="list-group-item list-group-item-action flex-column align-items-start font-size-16 px-3"
                  style={{ color: '#595c97' }}
                >
                  <div className="d-flex w-100 justify-content-between">
                    <p className="mb-0">{feature.title}</p>
                    <div>
                      <a style={{ cursor: 'move' }}>
                        <i className="fe fe-move" />
                      </a>
                      <a
                        role="button"
                        tabIndex={0}
                        onKeyDown={() => onEditFeature(feature, idx)}
                        onClick={() => onEditFeature(feature, idx)}
                        className="cursor-pointer pl-2"
                      >
                        <i className="fe fe-edit" />
                      </a>
                      <a
                        role="button"
                        tabIndex={0}
                        onKeyDown={() => showDeleteConfirm(idx)}
                        className="cursor-pointer pl-2"
                        onClick={() => showDeleteConfirm(idx)}
                      >
                        <i className="fe fe-trash-2" />
                      </a>
                    </div>
                  </div>
                  <small>{feature.info}</small>
                </li>
              ))}
          </ul>
        </ReactDragListView>
      </div>
    </>
  )
}

export default Index
