import React from 'react'
import { Modal } from 'antd'
import EmailList from 'components/app/emailList'

/* eslint-disable */
function ModalWrapper({ renderModalContent, visible, closeModal }) {
  if (!renderModalContent) return null

  return (
    <Modal title={renderModalContent.title} open={visible} onOk={closeModal} onCancel={closeModal}>
      {renderModalContent.type === 'stripe' && <pre>{renderModalContent.data}</pre>}
      {renderModalContent.type === 'custom' && renderModalContent.data}
      {renderModalContent.type === 'email' && (
        <EmailList data={Array.isArray(renderModalContent.data) ? renderModalContent.data : []} />
      )}
    </Modal>
  )
}

export default ModalWrapper
