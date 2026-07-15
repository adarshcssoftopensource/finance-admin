import React from 'react'
import Card from 'components/app/card'
import Table from 'components/app/table'
import getColumns from 'components/app/CommonTableFormatter/rewardDetailMultiplier'
import Header from './header'

const Index = ({ data }) => {
  const columns = getColumns()
  return (
    <>
      <Header data={data} />
      <div className="row">
        <div className="col-12 col-sm-12">
          <Card>
            <div className="text-nowrap text-dark font-size-30 font-weight-bold border-bottom">
              Subscription Multiplier
            </div>
            <div className="col-12 pl-0">
              <Table
                columns={columns}
                dataSource={data?.subscriptionMultiplier}
                defaultPagination
              />
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}

export default Index
