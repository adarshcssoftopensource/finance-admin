import React from 'react'
import Card from 'components/app/card'
import Refunds from 'pages/common/refunds'
import Title from './title'

const relativeRefunds = ({ refunds }) => {
  return (
    <Card>
      <Title>Refunds</Title>
      {refunds && (
        <Refunds
          data={refunds.data ? refunds.data.refunds : []}
          loading={refunds.loading}
          pageSize={500}
          total={refunds.data ? refunds.data.refunds.length : 0}
          current={1}
        />
      )}
    </Card>
  )
}
export default relativeRefunds
