import React from 'react'
import Card from 'components/app/card'
import Timeline from './timeline'
import Header from './header'

const Index = ({ data, handleConcedeDispute, handleChallengeDispute }) => {
  return (
    <>
      <Header
        data={data}
        handleConcedeDispute={handleConcedeDispute}
        handleChallengeDispute={handleChallengeDispute}
      />
      <div className="row">
        <div className="col-12 col-sm-12">
          <Card>
            <div className="text-nowrap text-dark font-size-30 font-weight-bold border-bottom">
              Timeline
            </div>
            <div className="col-12 pl-0">
              <Timeline histories={data?.history} />
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}

export default Index
