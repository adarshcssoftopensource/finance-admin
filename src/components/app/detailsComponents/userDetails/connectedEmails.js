import React from 'react'
/*eslint-disable*/
import { EditOutlined } from '@ant-design/icons'
import { Button, Input } from 'antd'
import Card from 'components/app/card'
import Title from '../title'

const connectedEmails = ({
  data,
  changeHandle,
  handleSubmitStatement,
  onEditClick,
  onCancelClick,
  editable,
  emailAddress,
}) => {
  return (
    <div className={'col-6'}>
      <Card>
        <Title>Connected Emails</Title>
        <div className="table-responsive">
          <table className="table table-borderless mb-0">
            <tbody>
              {data &&
                data.emails &&
                data.emails.map(email =>
                  editable === email ? (
                    <React.Fragment>
                      <tr key={email}>
                        <td className="px-0 pb-0">
                          {email === data.primaryEmail && (
                            <div className="text-success">Primary</div>
                          )}
                          <Input.Group compact className="d-flex">
                            <Input
                              className="mb-2"
                              value={emailAddress}
                              onChange={e => changeHandle(e)}
                              style={{ width: 'calc(100% - 100px)' }}
                            />
                            <Button
                              type="primary"
                              disabled={emailAddress === email}
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
                    !editable && (
                      <React.Fragment>
                        <tr key={email}>
                          <td className="px-0 pb-0">
                            <span>{email}</span>
                            <EditOutlined
                              className="cursor-pointer"
                              onClick={() => onEditClick(email)}
                            />
                          </td>
                        </tr>
                      </React.Fragment>
                    )
                  ),
                )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

export default connectedEmails
