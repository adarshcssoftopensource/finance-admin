/* eslint-disable no-underscore-dangle */

import React, { useCallback, useEffect, useState } from 'react'
import qs from 'qs'
import { Button, Col, Form, notification, Row } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { Modal as ReactModal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap'
import InputField from 'pages/common/Components/InputField'
import { requestDocument } from 'services/documents'
import { documentFor, documentNames, documentTypes } from '../constants'

const RequestDocument = ({ isModalVisible, closeModal, fetchDocuments }) => {
  const dispatch = useDispatch()
  const [form] = Form.useForm()
  const isLoading = useSelector(state => state?.business?.businesses?.loading)
  const allBusinesses = useSelector(state => state?.business?.businesses?.data?.businesses)
  const [loading, setLoading] = useState(false)
  const [selectedBusinessId, setSelectedBusinessId] = useState('')

  const initFetch = useCallback(
    queryValue => {
      dispatch({
        type: 'business/FETCH_ALL_BUSINESS',
        payload: {
          qryString: qs.stringify({
            pageNo: 1,
            pageSize: 500,
            keyword: queryValue || '',
          }),
        },
      })
    },
    [dispatch],
  )

  useEffect(() => {
    initFetch()
  }, [initFetch])

  const handleSearch = newValue => {
    if (newValue) {
      initFetch(newValue)
    }
  }

  const handleChange = newValue => {
    setSelectedBusinessId(newValue)
  }

  const submitDocumentRequest = async values => {
    setLoading(true)
    await requestDocument(selectedBusinessId, values)
      .then(res => {
        if (res.statusCode === 200) {
          notification.success({
            message: res.message,
          })
          form.resetFields()
          setSelectedBusinessId('')
          fetchDocuments()
        } else {
          notification.error({
            message: res.message,
          })
        }
      })
      .catch(err => {
        notification.error({
          message: err && err?.message,
        })
      })
      .finally(() => {
        closeModal()
        setLoading(false)
      })
  }

  return (
    <ReactModal isOpen={isModalVisible} toggle={closeModal} size="lg">
      <Form
        form={form}
        onFinish={submitDocumentRequest}
        name="control-hooks"
        layout="vertical"
        initialValues={{
          documentName: '',
          message: '',
          type: '',
          documentFor: '',
          rejectionReason: '',
          businessId: '',
        }}
      >
        <ModalHeader className="pt-3 pb-1" toggle={() => closeModal()}>
          Request Document
        </ModalHeader>
        <ModalBody>
          <Row gutter={16}>
            <Col span={12}>
              <InputField
                showSearch
                name="documentName"
                label="Document Name"
                type="select"
                optionArray={documentNames}
                rules={[{ required: true, message: 'Please select any document.' }]}
              />
            </Col>
            <Col span={12}>
              <InputField
                name="message"
                label="Message"
                type="input"
                rules={[{ required: true, message: 'Please enter message.' }]}
              />
            </Col>
            <Col span={12}>
              <InputField
                showSearch
                name="documentFor"
                label="Document For"
                type="select"
                optionArray={documentFor}
                rules={[{ required: true, message: 'Please select any option.' }]}
              />
            </Col>
            <Col span={12}>
              <InputField
                showSearch
                name="type"
                label="Document Type"
                type="select"
                optionArray={documentTypes}
                rules={[{ required: true, message: 'Please select any document type.' }]}
              />
            </Col>
            <Col span={12}>
              <InputField
                type="select"
                showSearch
                allowClear
                clearIcon
                className="w-100"
                label="Business"
                placeholder="Select Business"
                size="middle"
                value={selectedBusinessId}
                notFoundContent={null}
                optionArray={(allBusinesses || [])?.map(business => ({
                  value: business.organizationId,
                  label: business.organizationName,
                }))}
                loading={isLoading}
                onSearch={handleSearch}
                onChange={handleChange}
                rules={[{ required: true, message: 'Please select any document type.' }]}
              />
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter className="d-block">
          <div className="text-right mt-3 mb-3">
            <>
              <Button type="default" onClick={() => closeModal()}>
                Cancel
              </Button>
              &nbsp;&nbsp;
              <Button type="primary" htmlType="submit" disabled={loading} loading={loading}>
                Submit
              </Button>
            </>
          </div>
        </ModalFooter>
      </Form>
    </ReactModal>
  )
}

export default RequestDocument
