import React from 'react'
import NoteList from 'components/app/Notes/NoteList'
import GeneralDetails from './GeneralDetails'
import './generalDetail.scss'

const Index = ({
  bizDetail,
  noteDescription,
  setNoteDescription,
  onSaveNotes,
  onCancelNotes,
  businessNote,
}) => {
  const sortedUserNote =
    businessNote && businessNote.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
  return (
    <div className="d-flex general-detail-wrapper">
      <div className="left-side-section-wrapper">
        <GeneralDetails bizDetail={bizDetail} />
      </div>
      <div className="right-side-section-wrapper pl-xl-3">
        <NoteList
          notesList={bizDetail.notes}
          noteDescription={noteDescription}
          setNoteDescription={setNoteDescription}
          onSaveNotes={onSaveNotes}
          onCancelNotes={onCancelNotes}
          businessNote={sortedUserNote}
        />
      </div>
    </div>
  )
}

export default Index
