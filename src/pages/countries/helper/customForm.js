import React from 'react'
import { Input, Button, Col } from 'antd'
import { Label } from 'reactstrap'

const CustomForm = ({ filedType, style, type, handleOnchange, handleRemoveFields }) => {
  const fieldsArray = Object.keys(filedType[0])

  return (
    <div>
      {filedType.map((val, id) => (
        <div className={style['custom-field-wrapper']}>
          {fieldsArray.map((data, index) => (
            <Col span={8} className="gutter-row">
              <Label for={index}>{data}</Label>
              <Input
                name={data}
                id={index}
                value={val[data]}
                onChange={event => handleOnchange(index, event, type)}
              />
            </Col>
          ))}
          {filedType.length > 1 ? (
            <Button type="warning" onClick={() => handleRemoveFields(type, id)}>
              Remove
            </Button>
          ) : (
            ''
          )}
        </div>
      ))}
    </div>
  )
}

export default CustomForm
