/**
 * Shared static API response builder for finance-admin (no backend).
 */
import * as staticData from './fakeApi/staticData'

const { findById, meta } = staticData

function fullListData(overrides = {}) {
  return {
    businesses: staticData.businesses,
    users: staticData.users,
    payments: staticData.payments,
    disputes: staticData.disputes,
    invoices: staticData.invoices,
    checkouts: staticData.checkouts,
    refunds: staticData.refunds,
    payouts: staticData.payouts,
    payoutChangeRequests: staticData.payoutChangeRequests,
    subscriptions: staticData.subscriptions,
    plans: staticData.plans,
    agents: staticData.agents,
    wallets: staticData.wallets,
    transactions: staticData.transactions,
    requests: staticData.requests,
    banners: staticData.banners,
    bannerTargets: staticData.banners,
    countries: staticData.countries,
    downloads: staticData.downloads,
    notifications: staticData.notifications,
    devices: staticData.devices,
    templates: staticData.rewardTemplates,
    rewardTemplate: staticData.rewardTemplates[0],
    fundingLinks: staticData.fundingLinks,
    peymeLinks: staticData.peymeLinks,
    peyme: staticData.peymeLinks[0],
    debitCards: staticData.debitCards,
    debitCard: {
      ...staticData.debitCards[0],
      business: staticData.businesses[0],
    },
    schedulers: staticData.schedulers,
    documents: staticData.documents,
    assets: staticData.assets,
    ledgerData: staticData.ledgerData,
    featureFlags: staticData.featureFlags,
    currencies: staticData.currencies,
    items: staticData.businesses,
    list: staticData.businesses,
    usersStats: staticData.usersStats,
    businessesStats: staticData.businessesStats,
    ...staticData.walletStats,
    ...overrides,
    meta: overrides.meta || { ...meta, total: (overrides.meta && overrides.meta.total) || 3 },
  }
}

export function apiEnvelope(nestedOverrides = {}) {
  const data = fullListData(nestedOverrides)
  return {
    statusCode: 200,
    status: 200,
    success: true,
    message: 'Success',
    data,
    ...data,
  }
}

function normalizePath(url = '', baseURL = '') {
  let full = String(url || '')
  if (baseURL && !/^https?:\/\//i.test(full)) {
    full = `${String(baseURL).replace(/\/$/, '')}/${full.replace(/^\//, '')}`
  }
  try {
    if (/^https?:\/\//i.test(full)) {
      full = new URL(full).pathname
    }
  } catch (e) {
    // ignore
  }
  const pathOnly = full.split('?')[0].split('#')[0]
  const lower = pathOnly.toLowerCase()
  return lower.startsWith('/') ? lower : `/${lower}`
}

const DETAIL_RULES = [
  {
    test: /\/users\/[^/]+$/,
    build: id => ({ user: findById(staticData.users, id) }),
  },
  {
    test: /\/businesses\/[^/]+$/,
    build: id => {
      const base = findById(staticData.businesses, id)
      return {
        business: {
          ...base,
          users: staticData.users,
          subscription: staticData.subscriptions[0],
          paymentSetting: base.paymentSetting || {
            isConnected: true,
            platformPaymentStatus: 'active',
            platformPayoutStatus: 'active',
            isVerified: { payment: true, payout: true },
          },
          legal: {
            onboardingStatus: 'approved',
            isOnboardingAllowed: true,
            providerName: base.providerName || 'stripe',
            isPaymentEnabled: true,
            isPayoutEnabled: true,
            ...(base.legal || {}),
            providerData: {
              merchantId:
                (base.providerName || 'stripe') === 'payarc'
                  ? ['payarc_acct_001']
                  : ['acct_static_001'],
              providerStatus: 'active',
              activeProviders: [base.providerName || 'stripe'],
              subscribedProduct: [{ name: 'STANDARD' }],
              ...((base.providerName || '') === 'payarc'
                ? { payarcAccountID: 'payarc_acct_001', merchantIds: 'payarc_merch_001' }
                : {}),
              ...((base.legal && base.legal.providerData) || {}),
            },
            bankProviderData: {
              onboardingStatus: 'approved',
              updatedAt: new Date().toISOString(),
              createdAt: new Date().toISOString(),
              provider: 'plaid',
              merchantIds: 'merch_static_001',
              merchantRefId: 'ref_static_001',
              merchantStatus: 'verified',
              ...((base.legal && base.legal.bankProviderData) || {}),
              bankAccounts: (base.legal &&
                base.legal.bankProviderData &&
                Array.isArray(base.legal.bankProviderData.bankAccounts) &&
                base.legal.bankProviderData.bankAccounts) || [
                {
                  id: 'bank_1',
                  status: 'verified',
                  accountHolderName: 'Static Business',
                  accountNumber: '****1234',
                  routingNumber: '110000000',
                  accountType: 'checking',
                },
              ],
            },
            bnplProviderData: {
              onboardingStatus: 'pending',
              updatedAt: new Date().toISOString(),
              isActive: false,
              consentProvidedAt: new Date().toISOString(),
              lastUpdatedAt: new Date().toISOString(),
              ...((base.legal && base.legal.bnplProviderData) || {}),
            },
          },
        },
      }
    },
  },
  {
    test: /\/payments\/[^/]+$/,
    build: id => {
      const payment = findById(staticData.payments, id)
      return { payment, payments: [payment] }
    },
  },
  {
    test: /\/disputes\/[^/]+$/,
    build: id => ({ dispute: findById(staticData.disputes, id) }),
  },
  {
    test: /\/invoices\/[^/]+/,
    build: id => ({ invoice: findById(staticData.invoices, id) }),
  },
  {
    test: /\/checkouts\/[^/]+/,
    build: id => ({ checkout: findById(staticData.checkouts, id) }),
  },
  {
    test: /\/refunds\/[^/]+$/,
    build: id => {
      const refund = findById(staticData.refunds, id)
      return { refund, refunds: [refund] }
    },
  },
  {
    test: /\/payouts\/requests\/[^/]+$/,
    build: id => ({
      payoutChangeRequest: findById(staticData.payoutChangeRequests, id),
    }),
  },
  {
    test: /\/payouts\/[^/]+$/,
    build: id => {
      const payout = findById(staticData.payouts, id)
      return { payout, payouts: [payout] }
    },
  },
  {
    test: /\/subscriptions\/[^/]+$/,
    build: id => ({ subscription: findById(staticData.subscriptions, id) }),
  },
  {
    test: /\/plans\/[^/]+/,
    build: id => ({ plan: findById(staticData.plans, id), plans: staticData.plans }),
  },
  {
    test: /\/banner\/[^/]+$/,
    build: id => ({ banner: findById(staticData.banners, id), banners: staticData.banners }),
  },
  {
    test: /\/countries\/[^/]+$/,
    build: id => ({
      country: findById(staticData.countries, id),
      countries: [findById(staticData.countries, id)],
    }),
  },
  {
    test: /\/peyme\/[^/]+$/,
    build: id => {
      const peyme = findById(staticData.peymeLinks, id)
      return { peyme, payments: [staticData.payments[0]], peymeLinks: [peyme] }
    },
  },
  {
    test: /\/rewards\/templates\/[^/]+$/,
    build: id => ({
      template: findById(staticData.rewardTemplates, id),
      rewardTemplate: findById(staticData.rewardTemplates, id),
    }),
  },
  {
    test: /\/debit-cards\/[^/]+/,
    build: id => ({
      debitCard: {
        ...findById(staticData.debitCards, id),
        business: staticData.businesses[0],
      },
    }),
  },
  {
    test: /\/notifications\/[^/]+$/,
    build: id => ({ notification: findById(staticData.notifications, id) }),
  },
  {
    test: /\/requests\/[^/]+$/,
    build: id => ({ request: findById(staticData.requests, id) }),
  },
  {
    test: /\/funding\/links\/[^/]+$/,
    build: id => ({
      fundingLink: findById(staticData.fundingLinks, id),
      payments: [staticData.payments[0]],
    }),
  },
  {
    test: /\/scheduler\/[^/]+$/,
    build: id => ({ scheduler: findById(staticData.schedulers, id) }),
  },
]

function extractTrailingId(path) {
  const parts = path.split('/').filter(Boolean)
  return parts[parts.length - 1] || '1'
}

function handleCount(path) {
  if (!path.includes('count')) return null
  const counts = {
    users: 150,
    business: 45,
    agents: 12,
    Invoices: 32,
    payments: 28,
    disputes: 4,
    Checkouts: 19,
    checkouts: 19,
  }
  return {
    statusCode: 200,
    status: 200,
    success: true,
    message: 'Success',
    data: counts,
    ...counts,
  }
}

function handleStats(path) {
  if (path.includes('/stats/users')) return apiEnvelope({ usersStats: staticData.usersStats })
  if (path.includes('/stats/businesses')) {
    return apiEnvelope({ businessesStats: staticData.businessesStats })
  }
  if (path.includes('/stats/wallets') || path.includes('/wallet/admin/stats')) {
    return apiEnvelope({ ...staticData.walletStats })
  }
  return null
}

function handleDetail(path) {
  if (path.includes('/count')) return null

  // Business fee endpoint: /businesses/:id/fee
  if (/\/businesses\/[^/]+\/fee/.test(path)) {
    return apiEnvelope({
      processingFee: [
        {
          _id: 'fee-1',
          type: 'card',
          name: 'Card Rate',
          fee: { dynamic: 2.9, fixed: 0.3 },
          currency: 'USD',
        },
        {
          _id: 'fee-2',
          type: 'ach',
          name: 'ACH Rate',
          fee: { dynamic: 0.8, fixed: 0 },
          currency: 'USD',
        },
      ],
    })
  }

  // Fee templates list
  if (path.includes('/fee-templates')) {
    return apiEnvelope({
      feeTemplate: [
        {
          _id: 'tmpl-1',
          templateName: 'Standard',
          fee: [
            {
              _id: 'fee-1',
              type: 'card',
              name: 'Card Rate',
              fee: { dynamic: 2.9, fixed: 0.3 },
            },
          ],
        },
        {
          _id: 'tmpl-2',
          templateName: 'Premium',
          fee: [
            {
              _id: 'fee-2',
              type: 'card',
              name: 'Card Rate',
              fee: { dynamic: 2.5, fixed: 0.25 },
            },
          ],
        },
      ],
    })
  }

  // Legal onboarding step
  if (/\/businesses\/[^/]+\/legal/.test(path)) {
    const match = path.match(/\/businesses\/([^/]+)\/legal/)
    const id = (match && match[1]) || 'biz-1'
    const business = findById(staticData.businesses, id)
    return apiEnvelope({
      legalData: business.legal,
      business,
    })
  }

  for (let i = 0; i < DETAIL_RULES.length; i += 1) {
    const rule = DETAIL_RULES[i]
    if (rule.test.test(path)) {
      return apiEnvelope(rule.build(extractTrailingId(path)))
    }
  }
  return null
}

export function buildStaticResponse(config) {
  const path = normalizePath(config.url, config.baseURL)
  const count = handleCount(path)
  if (count) return count

  const method = (config.method || 'get').toLowerCase()
  if (method === 'get') {
    // Gateway webhook / error logs (absolute API_GATEWAY_URL paths)
    if (path.includes('webhook-error-logs') || path.includes('error-logs')) {
      return {
        statusCode: 200,
        status: 200,
        success: true,
        message: 'Success',
        logs: staticData.errorLogs,
        total: staticData.errorLogs.length,
        data: staticData.errorLogs,
      }
    }
    if (path.includes('webhook-logs') || path.includes('/webhooks/')) {
      return {
        statusCode: 200,
        status: 200,
        success: true,
        message: 'Success',
        logs: staticData.webhookLogs,
        total: staticData.webhookLogs.length,
        data: staticData.webhookLogs,
      }
    }

    // Public utility currencies — CurrencyFilter expects array of { currencies: [...] }
    if (path.includes('utility/public/currencies') || path.endsWith('/currencies')) {
      return {
        statusCode: 200,
        status: 200,
        success: true,
        message: 'Success',
        data: staticData.currencies,
      }
    }
    if (path.includes('utility/public/countries')) {
      return {
        statusCode: 200,
        status: 200,
        success: true,
        message: 'Success',
        data: staticData.countries,
      }
    }

    const stats = handleStats(path)
    if (stats) return stats
    const detail = handleDetail(path)
    if (detail) return detail
  }
  return apiEnvelope()
}

export function applyStaticAdapter(client, options = {}) {
  const { isBlob = false } = options
  client.interceptors.request.use(config => {
    // eslint-disable-next-line no-param-reassign
    config.adapter = async cfg => {
      if (isBlob) {
        const mockPdfBuffer = new TextEncoder().encode('%PDF-1.4 static mock export')
        return {
          data: mockPdfBuffer.buffer,
          status: 200,
          statusText: 'OK',
          headers: { 'content-type': 'application/pdf' },
          config: cfg,
          request: {},
        }
      }
      return {
        data: buildStaticResponse(cfg),
        status: 200,
        statusText: 'OK',
        headers: {},
        config: cfg,
        request: {},
      }
    }
    return config
  })
  return client
}
