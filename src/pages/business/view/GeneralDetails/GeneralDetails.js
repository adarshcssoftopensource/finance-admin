import React from 'react'

const GeneralDetails = ({ bizDetail }) => {
  const { address, communication } = bizDetail
  return (
    <div>
      <div
        className="d-flex flex-wrap align-items-center mb-2"
        style={{ justifyContent: 'space-between' }}
      >
        <div className="mb-2">
          <div className="text-dark font-size-18 font-weight-bold text-nowrap">
            {bizDetail.organizationName}
          </div>
          <div className="text-capitalize">{bizDetail.organizationType}</div>
        </div>
        {/* <div className="flex-shrink-0 m-0">
          <i className={`align-text-bottom fe ${bizDetail.isActive ? 'fe-check-square text-success' : 'fe-x-square text-danger'} ml-0 font-size-24`} />
        </div> */}
      </div>
      <div className="table-responsive">
        <table className="table">
          <tbody>
            {address && address.addressLine1 && (
              <tr>
                <td className="text-gray-6 pl-0 w-20">
                  <b>Address Line:</b> <br />
                  {address.addressLine1}
                </td>
              </tr>
            )}
            {address && address.addressLine2 && (
              <tr>
                <td className="text-gray-6 pl-0 w-20">
                  <b>Address Line2:</b> <br />
                  {address.addressLine2}
                </td>
              </tr>
            )}
            {address && address.city && (
              <tr>
                <td className="text-gray-6 pl-0 w-20">
                  <b>City:</b> <br />
                  {address.city}
                </td>
              </tr>
            )}
            {address && address.state && address.state.name && (
              <tr>
                <td className="text-gray-6 pl-0 w-20">
                  <b>State:</b> <br />
                  {address.state.name}
                </td>
              </tr>
            )}
            {address && address.country && address.country.name && (
              <tr>
                <td className="text-gray-6 pl-0 w-20">
                  <b>Country:</b> <br />
                  {address.country.name}
                </td>
              </tr>
            )}
            {address && address.postal && (
              <tr>
                <td className="text-gray-6 pl-0 w-20">
                  <b>Postal:</b> <br />
                  {address.postal}
                </td>
              </tr>
            )}
            {communication && communication.postal && (
              <tr>
                <td className="text-gray-6 pl-0 w-20">
                  <b>Fax:</b> <br />
                  {communication.fax}
                </td>
              </tr>
            )}
            {communication && communication.mobile && (
              <tr>
                <td className="text-gray-6 pl-0 w-20">
                  <b>Mobile:</b>
                  <br />
                  {communication.mobile}
                </td>
              </tr>
            )}
            {communication && communication.phone && (
              <tr>
                <td className="text-gray-6 pl-0 w-20">
                  <b>Phone:</b>
                  <br />
                  {communication.phone}
                </td>
              </tr>
            )}
            {communication && communication.tollFree && (
              <tr>
                <td className="text-gray-6 pl-0 w-20">
                  <b>Toll Free:</b>
                  <br />
                  {communication.tollFree}
                </td>
              </tr>
            )}
            {communication && communication.website && (
              <tr>
                <td className="text-gray-6 pl-0 w-20">
                  <b>Website:</b>
                  <br />
                  {communication.website}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default GeneralDetails
