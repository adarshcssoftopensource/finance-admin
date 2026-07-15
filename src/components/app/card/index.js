import React from 'react'

const index = ({ children, className, style = {} }) => {
  return (
    <div className={`card ${className || ''}`} style={style}>
      <div className="card-body">{children}</div>
    </div>
  )
}

export default index
