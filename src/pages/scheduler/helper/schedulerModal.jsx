import { Form, Modal } from 'antd'
import React from 'react'
import InputField from '../../common/Components/InputField'

const FrequencyOption = [
  {
    label: 'Monthly',
    value: 'monthly',
  },
  {
    label: 'Daily',
    value: 'daily',
  },
  {
    label: 'Yearly',
    value: 'yearly',
  },
  {
    label: 'Weekly',
    value: 'weekly',
  },
]

const SchedulerSubType = [
  {
    label: 'Payment activation reminder',
    value: 'payment_activation_reminder',
  },
  {
    label: 'Funding order payment reminder',
    value: 'funding_order_payment_reminder',
  },
]

const SchedulerType = [
  {
    label: 'Email',
    value: 'email',
  },
  {
    label: 'SMS',
    value: 'sms',
  },
  {
    label: 'Both',
    value: 'both',
  },
]

// eslint-disable-next-line prefer-spread
const beforeAfterOption = Array.apply(null, Array(3)).map((value, index) => {
  return {
    // eslint-disable-next-line no-plusplus
    label: `${++index}`,
    value: index,
  }
})
function SchedulerModal({
  type = '',
  selectedRecord = {},
  isOpen = false,
  handleSchedulerModal,
  handleAddScheduler,
  handleEditScheduler,
}) {
  const [form] = Form.useForm()

  return (
    <div>
      <Modal
        title={`${type === 'add' ? 'Add' : 'Edit'} scheduler`}
        visible={isOpen}
        onOk={() => {
          form.submit()
        }}
        onCancel={() => {
          handleSchedulerModal('', {}, false)
        }}
        okButtonProps={{ disabled: false }}
        okText="Submit"
        cancelText="Cancel"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={value => {
            if (type === 'add') {
              handleAddScheduler(value)
            } else if (type === 'edit') {
              handleEditScheduler(value)
            }
          }}
          onFinishFailed={error => {
            console.error('Failed', error)
          }}
          initialValues={selectedRecord}
        >
          <div className="py-2">
            <InputField
              name="type"
              label="Scheduler Type"
              rules={[{ required: true, message: `Please Select scheduler type` }]}
              type="select"
              showSearch
              optionArray={SchedulerType}
            />
          </div>
          <div className="py-2">
            <InputField
              name="before"
              label="Before"
              type="select"
              showSearch
              optionArray={beforeAfterOption}
              mode="multiple"
            />
          </div>
          <div className="py-2">
            <InputField
              name="after"
              label="After"
              type="select"
              showSearch
              optionArray={beforeAfterOption}
              mode="multiple"
            />
          </div>
          <div className="py-2">
            <InputField
              name="subType"
              label="Scheduler Sub Type"
              rules={[{ required: true, message: `Please select scheduler sub type` }]}
              type="select"
              showSearch
              optionArray={SchedulerSubType}
            />
          </div>
          <div className="py-2">
            <InputField
              name="frequency"
              label="Frequency"
              rules={[{ required: true, message: `Please select frequency` }]}
              type="select"
              showSearch
              optionArray={FrequencyOption}
            />
          </div>
          <div className="py-2">
            <InputField
              name="status"
              label="Status"
              rules={[{ required: true, message: `Please select status` }]}
              type="select"
              showSearch
              optionArray={[
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' },
              ]}
            />
          </div>
        </Form>
      </Modal>
    </div>
  )
}

export default SchedulerModal
