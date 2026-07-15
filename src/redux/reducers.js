import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import user from './user/reducers'
import menu from './menu/reducers'
import settings from './settings/reducers'
import dashboard from './dashboard/reducers'
import business from './business/reducers'
import banner from './banner/reducers'
import allUsers from './allUsers/reducers'
import subscriptions from './subscriptions/reducers'
import customer from './customer/reducers'
import walletLedger from './walletledger/reducer'
import payments from './payments/reducers'
import peyme from './peyme/reducers'
import refunds from './refunds/reducers'
import utility from './utility/reducers'
import plans from './plans/reducers'
import payouts from './payouts/reducers'
import debitCards from './debitCards/reducers'
import invoices from './invoices/reducers'
import checkouts from './checkouts/reducers'
import country from './country/reducers'
import payoutChangeRequest from './payoutChangeRequest/reducers'
import allRequests from './requests/reducers'
import allAssets from './assetsManagement/reducers'
import documents from './documents/reducers'
import disputes from './disputes/reducers'
import userDevices from './userDevices/reducers'
import pushNotifications from './pushNotification/reducers'
import systemSettingsReducer from './systemSettings/reducers'
import rewardTemplates from './rewardTemplates/reducers'
import rewards from './rewards/reducers'
import downloadsReducer from './downloads/reducers'
import schedulersReducer from './scheduler/reducers'
import fundingReducer from './funding/reducers'
import allLogsReducer from './logsPage/reducers'
import crmReducer from './crm/reducers'
import saleAgent from './salesAgent/reducers'
import financeWallet from './financeWallet/reducer'

export default history =>
  combineReducers({
    router: connectRouter(history),
    user,
    menu,
    settings,
    dashboard,
    business,
    banner,
    allUsers,
    subscriptions,
    walletLedger,
    payments,
    peyme,
    refunds,
    utility,
    plans,
    payouts,
    debitCards,
    invoices,
    checkouts,
    customer,
    country,
    payoutChangeRequest,
    allRequests,
    allAssets,
    documents,
    disputes,
    saleAgent,
    userDevices,
    pushNotifications,
    systemSettingsReducer,
    rewardTemplates,
    rewards,
    downloadsReducer,
    schedulersReducer,
    fundingReducer,
    crmReducer,
    allLogsReducer,
    financeWallet,
  })
