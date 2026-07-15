import apiClientWithBlob from 'services/axios/apiClientWithBlob'
/* eslint-disable */
export const exportPdf = async (type, qryString) => {
  return apiClientWithBlob
    .get(`export/${type}?${qryString}`)
    .then(response => {
      return response
    })
    .catch(err => console.log(err))
}
