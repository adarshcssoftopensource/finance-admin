import React from 'react'
import { formateDate } from '../helper'

const NoteItems = ({ createdBy, description, date }) => {
  return (
    <div className="single-notes">
      <div className="note-status">
        <p className="font-weight-bold mb-0">{createdBy}</p>
        <span className="ml-2">{formateDate(date, 'YYYY/MM/DD HH:mm:ss')}</span>
      </div>

      <p>{description || ''}</p>
    </div>
  )
}
export default NoteItems
