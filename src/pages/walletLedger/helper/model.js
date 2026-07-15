import React, { useState } from 'react'
import { Input, Modal } from 'antd'

/* eslint-disable */
function modal({ title, visible, closeModal, onOkModel }) {
  const [totalAmount, setTotalAmount] = useState(0)

  const handleAmount = e => {
    setTotalAmount(e.target.value)
  }

  return (
    <div>
      <Modal
        title={title}
        visible={visible}
        onOk={() => onOkModel(totalAmount)}
        onCancel={closeModal}
      >
        <Input addonBefore="$" type="number" min={0} onChange={handleAmount} />
      </Modal>
    </div>
  )
}

export default modal
