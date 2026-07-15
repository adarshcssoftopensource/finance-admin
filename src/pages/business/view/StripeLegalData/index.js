import { EditOutlined } from '@ant-design/icons'
import { Button, Input } from 'antd'
import React from 'react'

const index = ({
  bizDetail,
  inputChange,
  handleSubmitStatement,
  onCancelClick,
  onEditClick,
  statement,
  editable,
}) => {
  return (
    <div>
      <hr />
      <div style={{ width: 'webkit-fill-available' }} className="text-gray-6 pl-0 w-120">
        <b>Statement descriptor:</b>
        <br />
        {editable ? (
          <div>
            <Input className="mb-2" value={statement} onChange={e => inputChange(e)} />
            <div className="d-flex justify-content-lg-around align-items-center">
              <Button type="primary" onClick={handleSubmitStatement}>
                Save
              </Button>
              <Button onClick={onCancelClick}>Cancel</Button>
            </div>
          </div>
        ) : (
          statement
        )}
        {!editable && bizDetail.paymentSetting.isConnected && (
          <EditOutlined className="cursor-pointer" onClick={onEditClick} />
        )}
      </div>
      <hr />
    </div>
  )
}

export default index
