import React, { useState } from 'react'
import ReactJson from 'react-json-view'
import Card from 'components/app/card'
import Title from './title'
import style from './style.module.scss'

const StripeRaw = ({
  data,
  title,
  onEdit = false,
  onAdd = false,
  onDelete = false,
  handleEdit,
  handleAdd,
  handleDelete,
  collapsed = 1,
}) => {
  const [codeOpen, setCodeOpen] = useState(true)
  const codeToggle = () => {
    setCodeOpen(!codeOpen)
  }
  return (
    <Card>
      <Title>{title || 'Raw'}</Title>
      {data ? (
        <div className={`${style.custom_code_collapse} ${codeOpen && style.hide_code}`}>
          <div className={`${style.code_part} d-flex my-2`}>
            <ReactJson
              style={{ width: '100%' }}
              theme="rjv-default"
              name="data"
              collapsed={collapsed}
              iconStyle="circle"
              src={JSON.parse(data)}
              onEdit={
                onEdit
                  ? e => {
                      handleEdit(e)
                    }
                  : false
              }
              onAdd={
                onAdd
                  ? e => {
                      handleAdd(e)
                    }
                  : false
              }
              onDelete={
                onDelete
                  ? e => {
                      handleDelete(e)
                    }
                  : false
              }
            />
          </div>
          {codeOpen && (
            <div className={style.collap_button}>
              <button onClick={codeToggle} className={style.ac_button} type="button">
                Show All Lines
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="d-flex flex-wrap justify-content-center my-5">No Provider Content</div>
      )}
    </Card>
  )
}

export default StripeRaw
