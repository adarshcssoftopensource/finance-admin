import React from 'react'
import Header from './header'
import DebitCardTabs from './tabs'

const Index = ({ data, location }) => {
  return (
    <>
      <Header data={data} />
      <DebitCardTabs data={data} location={location} />
    </>
  )
}

export default Index
