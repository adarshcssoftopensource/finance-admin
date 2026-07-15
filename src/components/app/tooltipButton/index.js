import React from 'react'
import { Button, Tooltip } from 'antd'

function Index({ onButtonClick, icon, buttonText, tooltipTitle }) {
  return (
    <Tooltip placement="bottom" title={tooltipTitle}>
      <Button
        type="primary"
        icon={icon}
        onClick={onButtonClick}
        className="mr-2 p-2 pl-3 pr-3"
        size="large"
      >
        {buttonText}
      </Button>
    </Tooltip>
  )
}

export default Index
