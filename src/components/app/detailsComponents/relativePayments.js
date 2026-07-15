import React from 'react'
import Card from 'components/app/card'
import Payments from 'pages/common/Payments'
import Title from './title'

const relativePayments = ({ payments }) => {
  return (
    <Card>
      <Title>Payments</Title>
      {payments && (
        <Payments
          data={payments || []}
          loading={payments.loading}
          pageSize={500}
          total={payments.length || 0}
          current={1}
        />
      )}
    </Card>
  )
}
export default relativePayments
