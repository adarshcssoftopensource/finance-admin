import { Button } from 'antd'
import TextArea from 'antd/lib/input/TextArea'

import React from 'react'
import NoteItems from './noteItems'
import './notes.scss'

const NoteList = ({
  noteDescription,
  setNoteDescription,
  businessNote,
  onSaveNotes,
  className,
  // notesList,
}) => {
  return (
    <div className={className}>
      <div>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <p className="text-dark font-size-18 mb-0 font-weight-bold text-nowrap">Add Note</p>
          <Button type="primary" onClick={onSaveNotes}>
            Save
          </Button>
        </div>

        <TextArea
          value={noteDescription}
          onChange={e => setNoteDescription(e.target.value)}
          autoSize={{ minRows: 2, maxRows: 2 }}
        />
      </div>
      <div>
        <p className="text-dark font-size-18 mt-3 mb-0 font-weight-bold text-nowrap">All Notes</p>
        {businessNote && businessNote.length ? (
          <div className="listing-notes">
            {businessNote.map(val => (
              <NoteItems createdBy="Admin" description={val.description} date={val.dateAdded} />
            ))}
          </div>
        ) : (
          <p>No notes for this business</p>
        )}
      </div>
    </div>
  )
}

export default NoteList
