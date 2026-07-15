import React from 'react'
import { Modal } from 'antd'
import EmailList from 'components/app/emailList'

/* eslint-disable */
function modal({ renderModalContent, visible, closeModal }) {
  return (
    <div>
      {renderModalContent && (
        <Modal
          title={renderModalContent.title}
          visible={visible}
          onOk={closeModal}
          onCancel={closeModal}
        >
          {renderModalContent.type === 'stripe' ? (
            <pre>{renderModalContent.data}</pre>
          ) : (
            <EmailList data={renderModalContent.data} />
          )}
        </Modal>
      )}
    </div>
  )
}

export default modal
