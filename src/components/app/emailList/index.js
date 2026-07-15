import React from 'react'
import { List } from 'antd'
/* eslint-disable */

function Index({ data }) {
  return (
    <List
      itemLayout="horizontal"
      dataSource={data}
      renderItem={item => (
        <List.Item>
          <List.Item.Meta title={item} />
        </List.Item>
      )}
    />
  )
}

export default Index
