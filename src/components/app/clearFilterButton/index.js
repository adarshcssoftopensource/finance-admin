import React from 'react'
import { UndoOutlined } from '@ant-design/icons'
import { Button, Tooltip } from 'antd'

function Index({ clearFilter }) {
  return (
    <Tooltip placement="bottom" title="Reset Filter">
      <Button
        type="primary"
        icon={<UndoOutlined />}
        onClick={clearFilter}
        className="mr-2"
        size="large"
      />
    </Tooltip>
  )
}

export default Index
