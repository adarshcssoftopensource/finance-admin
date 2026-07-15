import React, { lazy, Suspense } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import { connect } from 'react-redux'

import Layout from 'layouts'

const routes = [
  // Dashboards
  {
    path: '/dashboard',
    Component: lazy(() => import('pages/dashboard/alpha')),
    exact: true,
  },
  // Dashboards
  {
    path: '/business',
    Component: lazy(() => import('pages/business/list')),
    exact: true,
  },
  {
    path: '/business/view/:id',
    Component: lazy(() => import('pages/business/view')),
    exact: true,
  },
  {
    path: '/merchant-record',
    Component: lazy(() => import('pages/merchantRecord/list')),
    exact: true,
  },
  {
    path: '/business/view/:id/clone',
    Component: lazy(() => import('pages/business/clone')),
    exact: true,
  },
  {
    path: '/restrict-business',
    Component: lazy(() => import('pages/restrictBusiness/list')),
    exact: true,
  },
  // Users
  {
    path: '/users',
    Component: lazy(() => import('pages/users/list')),
    exact: true,
  },
  {
    path: '/users/:userId',
    Component: lazy(() => import('pages/users/details')),
    exact: true,
  },
  // Agents
  {
    path: '/agents',
    Component: lazy(() => import('pages/salesAgent/list')),
    exact: true,
  },

  // Payments
  {
    path: '/payments',
    Component: lazy(() => import('pages/payments/list')),
    exact: true,
  },
  {
    path: '/payments/:paymentId',
    Component: lazy(() => import('pages/payments/details')),
    exact: true,
  },
  {
    path: '/onboardingreview',
    Component: lazy(() => import('pages/OnboardingReview/list')),
    exact: true,
  },
  {
    path: '/disputes',
    Component: lazy(() => import('pages/disputes/list')),
    exact: true,
  },
  {
    path: '/scheduler',
    Component: lazy(() => import('pages/scheduler/list/schedulerList')),
    exact: true,
  },
  {
    path: '/disputes/:disputeId',
    Component: lazy(() => import('pages/disputes/details')),
    exact: true,
  },
  {
    path: '/reward-templates',
    Component: lazy(() => import('pages/rewardTemplates/list')),
    exact: true,
  },
  {
    path: '/reward-templates/:templateId',
    Component: lazy(() => import('pages/rewardTemplates/details')),
    exact: true,
  },

  {
    path: '/verification-center',
    Component: lazy(() => import('pages/documents/list')),
    exact: true,
  },
  {
    path: '/push-notifications',
    Component: lazy(() => import('pages/pushNotifications/list')),
    exact: true,
  },
  {
    path: '/push-notifications/:id',
    Component: lazy(() => import('pages/pushNotifications/add/CreatePushNotification')),
    exact: true,
  },
  // Peyme
  {
    path: '/peyme',
    Component: lazy(() => import('pages/peyme/list')),
    exact: true,
  },
  {
    path: '/peyme/:peymeId',
    Component: lazy(() => import('pages/peyme/details')),
    exact: true,
  },

  // Refunds
  {
    path: '/refunds',
    Component: lazy(() => import('pages/refunds/list')),
    exact: true,
  },
  {
    path: '/refunds/:paymentId',
    Component: lazy(() => import('pages/refunds/details')),
    exact: true,
  },

  // Finance Wallet (consumer Privy wallets — payyit-wallet-be)
  {
    path: '/wallets',
    Component: lazy(() => import('pages/financeWallet/list')),
    exact: true,
  },
  {
    path: '/finance-wallets',
    Component: lazy(() => import('pages/financeWallet/list')),
    exact: true,
  },
  {
    path: '/finance-wallets/signups',
    Component: lazy(() => import('pages/financeWallet/signups')),
    exact: true,
  },
  {
    path: '/finance-wallets/transactions',
    Component: lazy(() => import('pages/financeWallet/transactions')),
    exact: true,
  },
  {
    path: '/finance-wallets/cashback',
    Component: lazy(() => import('pages/financeWallet/cashback')),
    exact: true,
  },
  {
    path: '/finance-wallets/merchant-fees',
    Component: lazy(() => import('pages/financeWallet/merchantFees')),
    exact: true,
  },
  {
    path: '/finance-wallets/security',
    Component: lazy(() => import('pages/financeWallet/security')),
    exact: true,
  },

  // Debit Card issuing wallets (Stripe issuing — separate from Finance Wallet)
  {
    path: '/debit-card-wallets',
    Component: lazy(() => import('pages/debitCard/list')),
    exact: true,
  },
  {
    path: '/debit-card-wallets/:cardId',
    Component: lazy(() => import('pages/debitCard/details')),
    exact: true,
  },

  // Plans
  {
    path: '/payouts',
    Component: lazy(() => import('pages/payouts/list')),
    exact: true,
  },
  {
    path: '/payouts/:payoutId',
    Component: lazy(() => import('pages/payouts/details')),
    exact: true,
  },
  {
    path: '/requests',
    Component: lazy(() => import('pages/requests/list')),
    exact: true,
  },

  // Subscription
  {
    path: '/subscriptions',
    Component: lazy(() => import('pages/subscription/list')),
    exact: true,
  },
  {
    path: '/subscriptions/:subscriptionId',
    Component: lazy(() => import('pages/subscription/details')),
    exact: true,
  },

  // Wallet Ledger
  {
    path: '/wallet_ledger',
    Component: lazy(() => import('pages/walletLedger/index')),
    exact: true,
  },

  // Debit card Transaction
  {
    path: '/wallet_transactions',
    Component: lazy(() => import('pages/walletTransaction/list/index.js')),
    exact: true,
  },
  // Plans
  {
    path: '/plans',
    Component: lazy(() => import('pages/plans/list')),
    exact: true,
  },
  {
    path: '/plans/:planId/edit',
    Component: lazy(() => import('pages/plans/edit')),
    exact: true,
  },

  // Banner
  {
    path: '/banners',
    Component: lazy(() => import('pages/banner/list')),
    exact: true,
  },
  {
    path: '/banners/:type',
    Component: lazy(() => import('pages/banner/details')),
    exact: true,
  },
  {
    path: '/invoices',
    Component: lazy(() => import('pages/invoices/list')),
    exact: true,
  },
  {
    path: '/invoices/:invoiceId/:businessId',
    Component: lazy(() => import('pages/invoices/details')),
    exact: true,
  },
  {
    path: '/invoices/bad-data',
    Component: lazy(() => import('pages/invoices/badData')),
    exact: true,
  },
  {
    path: '/checkouts',
    Component: lazy(() => import('pages/checkouts/list')),
    exact: true,
  },
  {
    path: '/checkouts/:checkoutId/:businessId',
    Component: lazy(() => import('pages/checkouts/details')),
    exact: true,
  },
  {
    path: '/countries',
    Component: lazy(() => import('pages/countries/list')),
    exact: true,
  },
  {
    path: '/countries/add',
    Component: lazy(() => import('pages/countries/details')),
    exact: true,
  },
  {
    path: '/countries/:countryId',
    Component: lazy(() => import('pages/countries/details')),
    exact: true,
  },
  // Auth Pages
  {
    path: '/auth/login',
    Component: lazy(() => import('pages/auth/login')),
    exact: true,
  },
  {
    path: '/auth/forgot-password',
    Component: lazy(() => import('pages/auth/forgot-password')),
    exact: true,
  },
  {
    path: '/auth/register',
    Component: lazy(() => import('pages/auth/register')),
    exact: true,
  },
  {
    path: '/auth/lockscreen',
    Component: lazy(() => import('pages/auth/lockscreen')),
    exact: true,
  },
  {
    path: '/auth/404',
    Component: lazy(() => import('pages/auth/404')),
    exact: true,
  },
  {
    path: '/auth/500',
    Component: lazy(() => import('pages/auth/500')),
    exact: true,
  },
  {
    path: '/assets_management',
    Component: lazy(() => import('pages/assetsManagement/list')),
    exact: true,
  },
  {
    path: '/system_settings',
    Component: lazy(() => import('pages/systemSettings/index')),
    exact: true,
  },
  {
    path: '/downloads',
    Component: lazy(() => import(`pages/downloads/list`)),
    exact: true,
  },
  {
    path: '/fundinglinks',
    Component: lazy(() => import(`pages/funding/list`)),
    exact: true,
  },
  {
    path: '/logs',
    Component: lazy(() => import(`pages/logsPage/list`)),
    exact: true,
  },
  {
    path: '/crm',
    Component: lazy(() => import(`pages/crm`)),
    exact: true,
  },
]

const mapStateToProps = ({ settings }) => ({
  routerAnimation: settings.routerAnimation,
})

const Router = ({ history, routerAnimation }) => {
  return (
    <ConnectedRouter history={history}>
      <Layout>
        <Route
          render={state => {
            const { location } = state
            return (
              <SwitchTransition>
                <CSSTransition
                  key={location.pathname}
                  appear
                  classNames={routerAnimation}
                  timeout={routerAnimation === 'none' ? 0 : 300}
                >
                  <Switch location={location}>
                    <Route exact path="/" render={() => <Redirect to="/dashboard" />} />
                    {routes.map(({ path, Component, exact }) => (
                      <Route
                        path={path}
                        key={path}
                        exact={exact}
                        render={() => {
                          return (
                            <div className={routerAnimation}>
                              <Suspense fallback={null}>
                                <Component />
                              </Suspense>
                            </div>
                          )
                        }}
                      />
                    ))}
                    <Redirect to="/auth/404" />
                  </Switch>
                </CSSTransition>
              </SwitchTransition>
            )
          }}
        />
      </Layout>
    </ConnectedRouter>
  )
}

export default connect(mapStateToProps)(Router)
