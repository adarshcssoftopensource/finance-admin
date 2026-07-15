import { notification } from 'antd'

export const showError = msg => {
  return notification.error({
    message: 'Try again',
    description: msg,
  })
}

export const showSuccess = msg => {
  return notification.success({
    message: 'Success',
    description: msg,
  })
}
