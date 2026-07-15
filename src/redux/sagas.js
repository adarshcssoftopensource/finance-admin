import { all } from 'redux-saga/effects'
import user from './user/sagas'
import menu from './menu/sagas'
import settings from './settings/sagas'
import dashboard from './dashboard/sagas'
import business from './business/sagas'
import banner from './banner/sagas'
import allUsers from './allUsers/sagas'
import subscriptions from './subscriptions/sagas'
import walletLedgear from './walletledger/sagas'
import payments from './payments/sagas'
import peyme from './peyme/sagas'
import refunds from './refunds/sagas'
import customer from './customer/sagas'
import utility from './utility/sagas'
import plans from './plans/sagas'
import payouts from './payouts/sagas'
import debitCards from './debitCards/sagas'
import invoices from './invoices/sagas'
import checkouts from './checkouts/sagas'
import country from './country/sagas'
import payoutChangeRequest from './payoutChangeRequest/sagas'
import allRequests from './requests/sagas'
import assetsManagement from './assetsManagement/sagas'
import documents from './documents/sagas'
import disputes from './disputes/sagas'
import userDevices from './userDevices/sagas'
import pushNotifications from './pushNotification/sagas'
import systemSettings from './systemSettings/sagas'
import rewardTemplates from './rewardTemplates/sagas'
import rewards from './rewards/sagas'
import downloads from './downloads/sagas'
import scheduler from './scheduler/sagas'
import funding from './funding/sagas'
import logsAction from './logsPage/sagas'
import crm from './crm/sagas'
import saleAgent from './salesAgent/sagas'
import financeWallet from './financeWallet/sagas'

export default function* rootSaga() {
  yield all([
    user(),
    menu(),
    settings(),
    dashboard(),
    business(),
    banner(),
    allUsers(),
    subscriptions(),
    walletLedgear(),
    payments(),
    peyme(),
    refunds(),
    utility(),
    plans(),
    saleAgent(),
    payouts(),
    debitCards(),
    invoices(),
    customer(),
    checkouts(),
    country(),
    payoutChangeRequest(),
    allRequests(),
    assetsManagement(),
    documents(),
    disputes(),
    userDevices(),
    pushNotifications(),
    systemSettings(),
    rewardTemplates(),
    rewards(),
    downloads(),
    scheduler(),
    funding(),
    logsAction(),
    crm(),
    financeWallet(),
  ])
}
