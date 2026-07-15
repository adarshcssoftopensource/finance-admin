import React from 'react'
import { Modal } from 'antd'
import EditBannerTarget from '../details/EditBannerTarget'

/* eslint-disable */
function modal({
  renderModalContent,
  visible,
  closeModal,
  handleEditBannerTarget,
  handleSubmitBannerTarget,
  Form,
  form,
  selectedTab,
}) {
  return (
    <div>
      {renderModalContent && (
        <Modal
          title={renderModalContent.title}
          visible={visible}
          onCancel={closeModal}
          footer={false}
        >
          {renderModalContent.type === 'message' ? (
            <Button type="primary" onClick={renderModalContent.onOkClick}>
              Submit
            </Button>
          ) : (
            <EditBannerTarget
              handleSubmitBannerTarget={handleSubmitBannerTarget}
              Form={Form}
              form={form}
              selectedTab={selectedTab}
              renderModalContent={renderModalContent}
              handleEditBannerTarget={handleEditBannerTarget}
            />
          )}
        </Modal>
      )}
    </div>
  )
}

export default modal
