import React, { useState, useEffect, Fragment } from 'react'
import { Tabs } from 'antd'
import { get as _get } from 'lodash'
import { useHistory } from 'react-router-dom'
import {
  generateDebitCard,
  getAllCountry,
  getShippingAddressData,
  getStateByCountryId,
} from 'services/debitCards'
import { ModalHeader, ModalBody, Modal, ModalFooter, Button, Label, Input } from 'reactstrap'
import DebitCard from './debitCard'
import Transactions from './transactions'
import style from './style.module.scss'
import SelectBox from './SelectBox'
// import Card from 'components/app/card'
// import { getAmountToDisplay } from 'components/app/helper'
/* eslint-disable */

const { TabPane } = Tabs

const DebitCardTabs = ({ data, location }) => {
  const [selectedTab, setSelectedTab] = useState('transaction')
  const [modal, setModal] = useState(false)
  const [Address, setAddress] = useState([])
  const [country, setCountry] = useState()
  const [businessId, setbusinessId] = useState()
  const [State, setState] = useState()
  const [SelectedCountry, setSelectedCountry] = useState()
  const [SelectedState, setSelectedState] = useState()
  const [getCardlist, setgetCardlist] = useState(false)
  const params = new URLSearchParams(location.search)
  const history = useHistory()

  useEffect(() => {
    const tab = params.get('tab') || selectedTab
    setSelectedTab(tab)
  }, [location.search])

  const tabChange = e => {
    setSelectedTab(e)
    params.set('tab', e)
    params.delete('cardId')
    params.delete('pageNo')
    params.delete('pageSize')
    history.push({ search: params.toString() })
  }

  const createDebitCard = async cardTypes => {
    if (data?.businessId && cardTypes) {
      var address = {
        addressLine1: Address.addressLine1,
        addressLine2: Address.addressLine2,
        city: Address.city,
        country: SelectedCountry,
        state: SelectedState?.value,
        postal: Address.postal,
      }
      const payload = {
        businessId: data?.businessId,
        cardType: cardTypes,
        shippingAddress: cardTypes === 'virtual' ? null : address,
      }
      const res = await generateDebitCard(payload)
      setModal(false)
      setgetCardlist(true)
      window.location.reload()
    }
  }
  useEffect(() => {
    ;(async () => {
      await getShippingAddress()
    })()
  }, [data?.businessId])

  const getShippingAddress = async () => {
    var id = data?.businessId
    if (id) {
      var res = await getShippingAddressData(id)
      if (res) {
        let address = res?.data?.data?.address
        address.country.sortname = res?.data?.data?.country
        setAddress(address)
      }
    }
  }

  useEffect(() => {
    ;(async () => {
      var tempArr = []
      const data = await getAllCountry()
      let countryData = data?.data?.countries
      countryData?.map((el, i) => {
        var obj = { value: el.name, label: el.name, id: el.id, sortname: el.sortname }
        tempArr.push(obj)
      })
      if (tempArr && Address?.country?.name) {
        setSelectedCountry(tempArr?.find(c => c.value == Address?.country?.name))
      }
      setCountry(tempArr)
    })()
  }, [Address])

  useEffect(() => {
    ;(async () => {
      if (Address?.country?.id) {
        var tempArr = []
        const data = await getStateByCountryId(Address?.country?.id)
        data?.data?.states?.map((el, i) => {
          var obj = { value: el.name, label: el.name, id: el.id }
          tempArr.push(obj)
        })
        if (tempArr && Address?.state?.name) {
          setSelectedState(tempArr?.find(c => c.value == Address?.state?.name))
          setState(tempArr)
        }
      }
    })()
  }, [Address])

  useEffect(() => {
    ;(async () => {
      if (SelectedCountry && SelectedCountry?.id) {
        var tempArr = []
        const data = await getStateByCountryId(SelectedCountry?.id)
        data?.data?.states?.map((el, i) => {
          var obj = { value: el.name, label: el.name, id: el.id }
          tempArr.push(obj)
        })
        if (tempArr && Address?.state?.name) {
          setSelectedState(tempArr?.find(c => c.value == Address?.state?.name))
          setState(tempArr)
        }
      }
    })()
  }, [SelectedCountry])

  const HandleModal = () => {
    setModal(true)
  }

  const handleText = async event => {
    const { name, value } = event.target
    setAddress({ ...Address, [name]: value })
  }
  return (
    <div className="row">
      <div className="col-12 ">
        <div className="card">
          <Tabs
            onChange={tabChange}
            className={`${style.tabs} kit-tabs-bordered`}
            activeKey={selectedTab}
            defaultActiveKey="transaction"
          >
            <TabPane tab="Transactions" key="transaction">
              <Transactions data={data} />
            </TabPane>
            <TabPane tab="Virtual Card" key="virtual">
              <button
                type="button"
                class="ant-btn mr-2 mb-3 p-2 pl-3 pr-3 ant-btn-primary ant-btn-lg"
                onClick={() => createDebitCard('virtual')}
              >
                Create Virtual Card
              </button>
              <DebitCard
                cards={_get(data, 'cards', []).filter(card => card.cardType === 'virtual')}
                cardType="Virtual"
              />
            </TabPane>
            <TabPane tab="Physical Card" key="physical">
              <button
                type="button"
                class="ant-btn mr-2 mb-3 p-2 pl-3 pr-3 ant-btn-primary ant-btn-lg"
                onClick={() => HandleModal()}
              >
                Create Physical Card
              </button>
              <DebitCard
                cards={_get(data, 'cards', []).filter(card => card.cardType === 'physical')}
                cardType="Physical"
                getCardlist={getCardlist}
              />
            </TabPane>
          </Tabs>
        </div>
        <Modal isOpen={modal} toggle={HandleModal}>
          <ModalHeader
            className="pt-3 pb-1"
            toggle={() => {
              setModal(false)
            }}
          >
            &nbsp; Shipping Address
          </ModalHeader>
          <ModalBody>
            <Fragment>
              <div className="py-form-field py-form-field--inline v-center">
                <Label htmlFor="addressLine1" className="py-form-field__label is-required">
                  Address line 1
                </Label>
                <div className="py-form-field__element">
                  <Input
                    autocomplete="nope"
                    type="text"
                    className="py-form__element__medium"
                    name="addressLine1"
                    id="addressLine1"
                    value={Address?.addressLine1}
                    onChange={handleText}
                  />
                </div>
              </div>
              <div className="py-form-field py-form-field--inline v-center">
                <Label htmlFor="addressLine2" className="py-form-field__label">
                  Address line 2
                </Label>
                <div className="py-form-field__element">
                  <Input
                    autocomplete="nope"
                    type="text"
                    className="py-form__element__medium"
                    name="addressLine2"
                    id="addressLine2"
                    value={Address?.addressLine2}
                    onChange={handleText}
                  />
                </div>
              </div>
              <div className="py-form-field py-form-field--inline v-center">
                <Label htmlFor="city" className="py-form-field__label is-required">
                  City
                </Label>
                <div className="py-form-field__element">
                  <Input
                    autocomplete="nope"
                    type="text"
                    name="city"
                    id="city"
                    className="py-form__element__medium"
                    value={Address?.city}
                    onChange={handleText}
                  />
                </div>
              </div>
              <div className="py-form-field py-form-field--inline">
                <Label htmlFor="province" className="py-form-field__label is-required">
                  Province/State
                </Label>
                <div className="py-form-field__element">
                  <div className="py-select--native">
                    <SelectBox
                      id="country"
                      className="select-empty"
                      value={SelectedState}
                      onChange={val => setSelectedState(val)}
                      placeholder="Select a country"
                      options={State}
                      clearable={false}
                    />
                  </div>
                </div>
              </div>
              <div className="py-form-field py-form-field--inline v-center">
                <Label htmlFor="postal" className="py-form-field__label is-required">
                  Postal/Zip code
                </Label>
                <div className="py-form-field__element">
                  <Input
                    autocomplete="nope"
                    type="zip"
                    name="postal"
                    id="postal"
                    minLength={2}
                    maxLength={10}
                    className="py-form__element__medium"
                    value={Address?.postal}
                    onChange={handleText}
                  />
                </div>
              </div>
              <div className="py-form-field py-form-field--inline">
                <Label htmlFor="country" className="py-form-field__label is-required">
                  Country
                </Label>
                <div className="py-form-field__element">
                  <div className="py-select--native">
                    <SelectBox
                      id="country"
                      className="select-empty"
                      value={SelectedCountry}
                      onChange={e => setSelectedCountry(e)}
                      placeholder="Select a country"
                      options={country ? country : []}
                      clearable={false}
                    />
                  </div>
                </div>
              </div>
            </Fragment>
          </ModalBody>
          <ModalFooter className="d-block">
            <div className="text-center mt-3 mb-3">
              {
                <>
                  <Button
                    color="primary"
                    type="submit"
                    className="w-25"
                    onClick={() => createDebitCard('physical')}
                  >
                    Confirm
                  </Button>
                </>
              }
            </div>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  )
}

export default DebitCardTabs
