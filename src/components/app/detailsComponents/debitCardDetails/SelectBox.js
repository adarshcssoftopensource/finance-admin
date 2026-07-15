import React from 'react'

import Select from 'react-select'

const SelectBox = props => {
  return <Select {...props} inputProps={{ autoComplete: 'autoOff' }} />
}

export default SelectBox
