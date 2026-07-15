import React from 'react'
import moment from 'moment'
import { capitalize, isEmpty } from 'lodash'
import { Link } from 'react-router-dom'
import { Tooltip } from 'antd'
/* eslint-disable */
export const getAmountToDisplay = (currency = { sumbol: '$' }, amount) => {
  const symbol = currency ? currency.symbol : ''
  amount = amount < 0 ? `(${symbol}${toMoney(amount * -1)})` : `${symbol}${toMoney(amount)}`
  return `${amount}`
}

export const getPointToDisplay = point => {
  return point < 0 ? `(${point * -1})` : point
}

export const formateDate = (date, formate) => {
  return moment(date).format(formate || 'YYYY-MM-DD')
}

Number.prototype.toMoney1 = function(decimals, decimal_sep, thousands_sep) {
  var n = this

  var c = isNaN(decimals) ? 2 : Math.abs(decimals)
  // if decimal is zero we must take it, it means user does not want to show any decimal

  var d = decimal_sep || '.'
  // if no decimal separator is passed we use the dot as default decimal separator (we MUST use a decimal separator)
  /*
    according to [https://stackoverflow.com/questions/411352/how-best-to-determine-if-an-argument-is-not-sent-to-the-javascript-function]
    the fastest way to check for not defined parameter is to use typeof value === 'undefined'
    rather than doing value === undefined.
    */

  var t = typeof thousands_sep === 'undefined' ? ',' : thousands_sep
  // if you don't want to use a thousands separator you can pass empty string as thousands_sep value

  var sign = n < 0 ? '-' : ''

  // extracting the absolute value of the integer part of the number and converting to string

  var i = parseInt((n = Math.abs(n).toFixed(c))) + ''

  var j = (j = i.length) > 3 ? j % 3 : 0
  return (
    sign +
    (j ? i.substr(0, j) + t : '') +
    i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + t) +
    (c
      ? d +
        Math.abs(n - i)
          .toFixed(c)
          .slice(2)
      : '')
  )
}
export function toMoney(price, addComma = true) {
  if (typeof price === 'string') {
    price = parseFloat(price)
  }
  price = !!price ? price : 0
  if (addComma) {
    return price.toMoney1(2, '.', ',')
  } else return price.toMoney1(2, '.', '')
}

const prefix = '/icons'
const Providerprefix = '/icons'
const Providerprefixs = `${process.env.REACT_APP_CDN_URL}/static/web-assets`

export const paymentsIcons = (type, objectFit = 'cover') => {
  const Icons = {
    amex: `${prefix}/amex.png`,
    bank: `${prefix}/bank.svg`,
    mastercard: `${prefix}/mastercard.png`,
    visa: `${prefix}/visa.svg`,
    discover: `${prefix}/discover.png`,
    jcb: `${prefix}/jcb.jpeg`,
    master: () => this.mastercard,
    mc: `${prefix}/mastercard.png`,
    alipay: `${prefix}/alipay.png`,
    paypal: `${prefix}/paypal.png`,
    cashapp: `${prefix}/cc-cashapp.svg`,
    unknown: `${prefix}/unknown.png`,
    orum: `${prefix}/bank-orum.svg`,
    sezzle: `${prefix}/bnpl-sezzle.svg`,
    cash: `${prefix}/cc-cashapp.svg`,
    diners: `${prefix}/diners.png`,
    maestro: `${prefix}/maestro.png`,
    wallet: `${Providerprefix}/wallets.png`,
    amazon_pay: `${prefix}/amazonpay.svg`,
    afterpay_clearpay: `${prefix}/afterpay.svg`,
    affirm: `${prefix}/affirm.svg`,
    klarna: `${prefix}/klarna.svg`,
  }

  const src = Icons[type] || Icons.unknown
  return <img height="25" width="40" style={{ objectFit }} src={src} alt={type} />
}

export const getProviderIcons = (name, type) => {
  const Icons = {
    wepay: `${Providerprefixs}/wepay.png`,
    paypal: `${Providerprefixs}/paypal.png`,
    tilled: `${Providerprefixs}/paysafe.png`,
    checkout: `${Providerprefixs}/checkout.png`,
    stripe: `${Providerprefixs}/stripe.png`,
    bluesnap: `${Providerprefixs}/bluesnap.png`,
    adyen: `${Providerprefixs}/adyen.png`,
    payarc: `${Providerprefixs}/payarc.png`,
    rapyd: `${Providerprefixs}/rapyd.png`,
    justifi: `${Providerprefixs}/justifi-logo.png`,
    ecrypt: `${Providerprefixs}/ecrypt-logo.svg`,
    orum: `${Providerprefixs}/bank-orum.svg`,
    unknown: `${Providerprefixs}/cc-unknown.png`,
    bnpl: `${Providerprefixs}/bnpl-sezzle.svg`,
    nmi: `${Providerprefixs}/nmi-logo.png`,
  }

  if (name in Icons) {
    return <img height="30" width="40" src={Icons[name]} alt={name} />
  }

  if (type === 'card') {
    return <img height="15" src={Icons.unknown} alt="Unknown Card" />
  }

  if (type === 'bank') {
    return <img height="15" src={Icons.orum} alt="Bank" />
  }

  if (type === 'bnpl') {
    return <img height="15" src={Icons.bnpl} alt="Bank" />
  }

  return null
}

export const renderPaymentMethod = row => {
  if (row && row.bank && row.methodToDisplay === 'bank') {
    return <span>{paymentsIcons('bank')}</span>
  } else if (row.methodToDisplay === 'card') {
    return (
      <span>
        {paymentsIcons(row.card ? row.card.type : 'unknown')}{' '}
        {`(${row.card && row.card.number ? row.card.number : 'NA'})`}
      </span>
    )
  } else if (row?.methodToDisplay === 'alipay' || row?.methodToDisplay === 'paypal') {
    return <span>{paymentsIcons(row.methodToDisplay)}</span>
  } else if (row?.methodToDisplay === 'cashapp') {
    return <span>{paymentsIcons(row.methodToDisplay)}</span>
  } else if (row?.methodToDisplay === 'cash') {
    return <span>{paymentsIcons(row.methodToDisplay)}</span>
  } else if (row?.methodToDisplay === 'amazon_pay') {
    return <span>{paymentsIcons(row.methodToDisplay)}</span>
  } else if (row?.methodToDisplay === 'afterpay_clearpay') {
    return <span>{paymentsIcons(row.methodToDisplay)}</span>
  } else if (row?.methodToDisplay === 'affirm') {
    return <span>{paymentsIcons(row.methodToDisplay)}</span>
  } else if (row?.methodToDisplay === 'klarna') {
    return <span>{paymentsIcons(row.methodToDisplay)}</span>
  } else if (row.providerName === 'orum') {
    return (
      <span>
        {paymentsIcons(row.providerName, 'contain')} {`(${row.bank?.number || 'NA'})`}
      </span>
    )
  } else if (row?.methodToDisplay === 'wallet' || row?.method === 'wallet') {
    return <span>{paymentsIcons('wallet')}</span>
  } else {
    if (row && row.card && row.card.cardNumber) {
      return (
        <span>
          {paymentsIcons(row.card.brand)} {`(${row.card.cardNumber || ''})`}
        </span>
      )
    } else {
      return paymentsIcons(row.providerName) ? (
        <span>{paymentsIcons(row.providerName, 'contain')}</span>
      ) : (
        <span className="badge badge-default">Manual</span>
      )
    }
  }
}

export const renderProviderMethod = providers => (
  <span className="d-flex align-items-center">
    {providers?.map((provider, index) => (
      <span key={index} className="mr-2 ml-2">
        <Tooltip placement="bottom" title={capitalize(provider?.name)} key={index}>
          {getProviderIcons(provider?.name, provider?.type) || (
            <span className="badge badge-default">Manual</span>
          )}
        </Tooltip>
      </span>
    ))}
  </span>
)

export const cardExpireDate = card => {
  return (
    card &&
    `${
      card.expiryMonth
        ? card.expiryMonth.length == 1
          ? '0' + card.expiryMonth
          : card.expiryMonth
        : ''
    }${card.expiryYear ? '/' + card.expiryYear : ''}`
  )
}

export const getAmountToDisplayWithColor = (amount, currency) => {
  const symbol = !isEmpty(currency) ? currency.symbol : ''
  if (amount < 0) {
    return <span>{`${symbol}${toMoney(amount * -1)}`}</span>
  }
  return <span className="text-success">{`+ ${symbol}${toMoney(amount)}`}</span>
}

export const getStripeUrl = urlType => {
  const baseUrl =
    process.env.REACT_APP_NODE_ENV == 'development'
      ? 'https://dashboard.stripe.com/test'
      : 'https://dashboard.stripe.com'
  switch (urlType) {
    case 'authorization':
      return `${baseUrl}/issuing/authorizations`
    case 'transaction':
      return `${baseUrl}/issuing/transactions`
    default:
      return baseUrl
  }
}

export const BusinessName = ({ id, name }) => {
  return (
    <span className="text-ele">
      {id ? (
        <Link className="pl-1" to={`/business/view/${id}`}>
          {name || '-'}
        </Link>
      ) : (
        name
      )}
    </span>
  )
}
