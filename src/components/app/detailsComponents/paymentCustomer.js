import React, { useState } from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import Card from 'components/app/card'
import Title from './title'

function PaymentCustomer({ data, sendingSMS, onSendSMS }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [message, setMessage] = useState('')

  const toggleModal = () => setModalOpen(!modalOpen)

  return (
    <Card>
      <Title>Customer</Title>

      {data && data.customer && (
        <div className="col-12 pl-0">
          <div className="table-responsive">
            <table className="table table-borderless">
              <tbody>
                <tr>
                  <td className="text-gray-6 pl-0 pb-0">Email</td>
                  <td className="pr-0 text-dark pb-0 text-right">{data.customer.email}</td>
                </tr>
                <tr>
                  <td className="text-gray-6 pl-0 pb-0">First Name</td>
                  <td className="pr-0 text-dark pb-0 text-right">{data.customer.firstName}</td>
                </tr>
                <tr>
                  <td className="text-gray-6 pl-0 pb-0">Last Name</td>
                  <td className="pr-0 text-dark pb-0 text-right">{data.customer.lastName}</td>
                </tr>
                <tr>
                  <td className="text-gray-6 pl-0 pb-0">Phone Number</td>
                  <td className="pr-0 text-dark pb-0 text-right">
                    {data.customer.phone ?? '-'}
                    {data.customer.phone && (
                      <div className="mt-1">
                        <Button size="sm" color="primary" onClick={toggleModal}>
                          Send a Message
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <Modal isOpen={modalOpen} toggle={toggleModal}>
            <ModalHeader toggle={toggleModal}>
              Send Message to {data.customer.firstName}
            </ModalHeader>
            <ModalBody>
              <textarea
                className="w-100 border rounded p-2"
                placeholder="Type your message here..."
                rows={4}
                value={message}
                onChange={e => setMessage(e.target.value)}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={toggleModal}>
                Cancel
              </Button>
              <Button
                color="primary"
                disabled={!message.trim() || sendingSMS}
                onClick={() => {
                  if (message.trim()) {
                    onSendSMS(message)
                    setMessage('')
                    toggleModal()
                  }
                }}
              >
                {sendingSMS ? 'Sending...' : 'Send'}
              </Button>
            </ModalFooter>
          </Modal>
        </div>
      )}
    </Card>
  )
}

export default PaymentCustomer
