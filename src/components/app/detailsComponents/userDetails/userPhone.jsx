import React from 'react'
/*eslint-disable*/
import { EditOutlined } from '@ant-design/icons'
import { Button, Input } from 'antd'
import Card from 'components/app/card'
import Title from '../title'

const userPhone = ({
  data,
  changeHandle,
  handleSubmitStatement,
  onEditClick,
  onCancelClick,
  editable,
  mobileNumber,
}) => {
  return (
    <div className={'col-6'}>
      <Card>
        <Title>Mobile Phone</Title>
        <div className="table-responsive">
          <table className="table table-borderless mb-0">
            <tbody>
              {data && data.mobileNumber ? (
                editable ? (
                  <React.Fragment>
                    <tr key={data.mobileNumber}>
                      <td className="px-0 pb-0">
                        <Input.Group compact className="d-flex">
                          <Input
                            className="mb-2"
                            value={mobileNumber}
                            onChange={e => changeHandle(e)}
                          />
                          <Button
                            type="primary"
                            disabled={data?.mobileNumber === mobileNumber}
                            onClick={handleSubmitStatement}
                          >
                            Save
                          </Button>
                          <Button onClick={onCancelClick}>Cancel</Button>
                        </Input.Group>
                      </td>
                    </tr>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <tr key={data.mobileNumber}>
                      <td className="px-0 pb-0">
                        <span>{data.mobileNumber}</span>
                        <EditOutlined className="cursor-pointer" onClick={onEditClick} />
                      </td>
                    </tr>
                  </React.Fragment>
                )
              ) : (
                ''
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

export default userPhone
