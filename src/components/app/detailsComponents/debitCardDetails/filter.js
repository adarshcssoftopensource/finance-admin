import React from 'react'
import { Select } from 'antd'
import ClearFilterButton from 'components/app/clearFilterButton'
/* eslint-disable */

const Index = ({ handleFilterChange, clearFilter, selectedCardId, cards }) => {
  const handleChange = (value, type) => {
    handleFilterChange(value, type)
  }

  return (
    <div className="row py-3">
      <div className="col-md-3 py-2">
        <label className="filter-label">Cards</label>
        <Select
          className="w-100"
          placeholder="Select Card"
          size="large"
          defaultValue=""
          value={selectedCardId}
          onChange={value => handleChange(value, 'card')}
        >
          <Option value="">All</Option>
          {cards &&
            cards.length > 0 &&
            cards.map(card => (
              <Option key={card.id} value={card.id}>
                {card.cardNumber} - {card.cardType}
              </Option>
            ))}
        </Select>
      </div>
      <div className="col-md-2 py-2">
        <label className="filter-label">&nbsp;</label>
        <ClearFilterButton clearFilter={clearFilter} />
      </div>
    </div>
  )
}

export default Index
