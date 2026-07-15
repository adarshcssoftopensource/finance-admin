import React from 'react'

function title({ children }) {
  return (
    <div className="text-nowrap text-dark font-size-30 font-weight-bold border-bottom">
      {children}
    </div>
  )
}

export default title
