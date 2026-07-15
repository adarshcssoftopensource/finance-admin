const now = () => new Date().toISOString()

const fullBusinessLegal = (providerName = 'stripe') => ({
  isOnboardingAllowed: true,
  providerName,
  isPaymentEnabled: true,
  isPayoutEnabled: true,
  isMerchantOfRecord: false,
  onboardingStatus: 'approved',
  providerData: {
    merchantId: providerName === 'payarc' ? ['payarc_acct_001'] : ['acct_static_001'],
    providerStatus: 'active',
    activeProviders: [providerName],
    subscribedProduct: [{ name: 'STANDARD' }],
    privyWallet: null,
    ...(providerName === 'payarc'
      ? {
          payarcAccountID: 'payarc_acct_001',
          merchantIds: 'payarc_merch_001',
        }
      : {}),
  },
  bankProviderData: {
    onboardingStatus: 'approved',
    updatedAt: now(),
    createdAt: now(),
    accountId: 'ba_static_001',
    provider: 'plaid',
    merchantIds: 'merch_static_001',
    merchantRefId: 'ref_static_001',
    merchantStatus: 'verified',
    bankAccounts: [
      {
        id: 'bank_1',
        status: 'verified',
        accountHolderName: 'Acme Corp',
        accountNumber: '****1234',
        routingNumber: '110000000',
        accountType: 'checking',
      },
    ],
  },
  bnplProviderData: {
    onboardingStatus: 'pending',
    updatedAt: now(),
    isActive: false,
    consentProvidedAt: now(),
    lastUpdatedAt: now(),
  },
})

const fullPaymentSetting = () => ({
  isConnected: true,
  platformPaymentStatus: 'active',
  platformPayoutStatus: 'active',
  isDebitCardCreationPaused: false,
  isWalletLoadPaused: false,
  isVerified: {
    payment: true,
    payout: true,
  },
  statementDescriptor: 'ACME CORP',
})

export const meta = { pageNo: 1, pageSize: 100, total: 3 }

export const usersStats = {
  total: 8430,
  yesterday: 50,
  thisWeek: 120,
  lastWeek: 90,
  thisMonth: 400,
  lastMonth: 350,
}

export const businessesStats = {
  total: 450,
  yesterday: 5,
  thisWeek: 12,
  lastWeek: 9,
  thisMonth: 40,
  lastMonth: 35,
}

export const walletStats = {
  walletCount: 2541,
  virtualDebitCards: 1205,
  physicalDebitCards: 840,
  walletBalance: 145000.5,
  stripeIssuingBalance: 42500.0,
}

export const users = [
  {
    _id: 'usr-1',
    id: 'usr-1',
    uuid: 'uuid-usr-1',
    firstName: 'John',
    lastName: 'Doe',
    name: 'John Doe',
    email: 'john.doe@finance.com',
    primaryEmail: 'john.doe@finance.com',
    phone: '+1234567890',
    mobileNumber: '+1234567890',
    isActive: true,
    isEmailVerified: true,
    isPhoneVerified: true,
    dateOfBirth: '1990-01-15',
    address: {
      addressLine1: '123 Main St',
      addressLine2: '',
      city: 'New York',
      postal: '10001',
      state: { name: 'New York' },
      country: { name: 'United States', code: 'US' },
    },
    identityVerification: { status: 'not_required' },
    twoFAuth: { TOTP: { enabled: false }, SMS: { enabled: false } },
    notes: [],
    primaryBusinessDetails: { _id: 'biz-1', organizationName: 'Acme Corp' },
    businesses: [{ _id: 'biz-1', organizationName: 'Acme Corp' }],
    createdAt: now(),
    updatedAt: now(),
  },
  {
    _id: 'usr-2',
    id: 'usr-2',
    uuid: 'uuid-usr-2',
    firstName: 'Jane',
    lastName: 'Smith',
    name: 'Jane Smith',
    email: 'jane.smith@finance.com',
    primaryEmail: 'jane.smith@finance.com',
    phone: '+1987654321',
    mobileNumber: '+1987654321',
    isActive: true,
    isEmailVerified: true,
    isPhoneVerified: false,
    dateOfBirth: '1988-06-20',
    address: {
      addressLine1: '456 Oak Ave',
      city: 'Los Angeles',
      postal: '90001',
      state: { name: 'California' },
      country: { name: 'United States', code: 'US' },
    },
    identityVerification: { status: 'not_required' },
    twoFAuth: { TOTP: { enabled: false }, SMS: { enabled: false } },
    notes: [],
    primaryBusinessDetails: { _id: 'biz-2', organizationName: 'Globex Inc' },
    businesses: [{ _id: 'biz-2', organizationName: 'Globex Inc' }],
    createdAt: now(),
    updatedAt: now(),
  },
  {
    _id: 'usr-3',
    id: 'usr-3',
    uuid: 'uuid-usr-3',
    firstName: 'Bob',
    lastName: 'Johnson',
    name: 'Bob Johnson',
    email: 'bob.johnson@finance.com',
    primaryEmail: 'bob.johnson@finance.com',
    phone: '+1555123456',
    mobileNumber: '+1555123456',
    isActive: false,
    isEmailVerified: false,
    isPhoneVerified: true,
    identityVerification: { status: 'not_required' },
    twoFAuth: { TOTP: { enabled: false }, SMS: { enabled: false } },
    notes: [],
    businesses: [],
    createdAt: now(),
    updatedAt: now(),
  },
]

export const businesses = [
  {
    _id: 'biz-1',
    id: 'biz-1',
    organizationName: 'Acme Corp',
    name: 'Acme Corp',
    businessType: 'LLC',
    companyType: 'LLC',
    industry: 'Technology',
    providerName: 'payarc',
    riskLevel: 'low',
    isActive: true,
    isMerchantOfRecord: false,
    country: { _id: 'us', name: 'United States', code: 'US' },
    currency: { code: 'USD', symbol: '$' },
    subscriptionPlanTitle: 'Premium',
    legal: fullBusinessLegal('payarc'),
    paymentSetting: fullPaymentSetting(),
    users: [],
    notes: [],
    createdAt: now(),
    updatedAt: now(),
  },
  {
    _id: 'biz-2',
    id: 'biz-2',
    organizationName: 'Globex Inc',
    name: 'Globex Inc',
    businessType: 'Corporation',
    companyType: 'Corporation',
    industry: 'Retail',
    providerName: 'payarc',
    riskLevel: 'medium',
    isActive: true,
    isMerchantOfRecord: true,
    country: { _id: 'us', name: 'United States', code: 'US' },
    currency: { code: 'USD', symbol: '$' },
    subscriptionPlanTitle: 'Starter',
    legal: {
      ...fullBusinessLegal('payarc'),
      isMerchantOfRecord: true,
    },
    paymentSetting: fullPaymentSetting(),
    notes: [],
    createdAt: now(),
    updatedAt: now(),
  },
  {
    _id: 'biz-3',
    id: 'biz-3',
    organizationName: 'Initech',
    name: 'Initech',
    businessType: 'Sole Properietoryship/Individual',
    companyType: 'Sole Proprietorship',
    industry: 'Software',
    providerName: 'stripe',
    riskLevel: 'high',
    isActive: false,
    isMerchantOfRecord: false,
    country: { _id: 'ca', name: 'Canada', code: 'CA' },
    currency: { code: 'CAD', symbol: 'C$' },
    subscriptionPlanTitle: 'Enterprise',
    legal: {
      ...fullBusinessLegal('stripe'),
      isOnboardingAllowed: false,
      isPaymentEnabled: false,
      isPayoutEnabled: false,
      onboardingStatus: 'rejected',
    },
    paymentSetting: {
      ...fullPaymentSetting(),
      isConnected: false,
      platformPaymentStatus: 'inactive',
      platformPayoutStatus: 'inactive',
      isVerified: { payment: false, payout: false },
    },
    notes: [],
    createdAt: now(),
    updatedAt: now(),
  },
]

export const payments = [
  {
    _id: 'pay-1',
    id: 'pay-1',
    amount: 1500.0,
    currency: { code: 'USD', symbol: '$' },
    status: 'SUCCESS',
    providerName: 'stripe',
    paymentType: 'Invoice',
    method: 'card',
    methodToDisplay: 'card',
    paymentDate: now(),
    is3DSecure: true,
    riskScore: 12,
    ipAddress: '203.0.113.10',
    rewardPoints: 150,
    transactionId: 'TXN-1001',
    businessName: 'Acme Corp',
    customerName: 'John Doe',
    customer: { firstName: 'John', lastName: 'Doe', email: 'john.doe@finance.com' },
    business: { _id: 'biz-1', organizationName: 'Acme Corp' },
    card: { type: 'visa', brand: 'visa', number: '4242', cardNumber: '4242' },
    createdAt: now(),
  },
  {
    _id: 'pay-2',
    id: 'pay-2',
    amount: 250.5,
    currency: { code: 'USD', symbol: '$' },
    status: 'PENDING',
    providerName: 'payarc',
    paymentType: 'Checkout',
    method: 'card',
    methodToDisplay: 'card',
    paymentDate: now(),
    is3DSecure: false,
    riskScore: 40,
    ipAddress: '198.51.100.22',
    rewardPoints: 25,
    transactionId: 'TXN-1002',
    businessName: 'Globex Inc',
    customerName: 'Jane Smith',
    customer: { firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@finance.com' },
    business: { _id: 'biz-2', organizationName: 'Globex Inc' },
    card: { type: 'mastercard', brand: 'mastercard', number: '5555', cardNumber: '5555' },
    createdAt: now(),
  },
]

export const disputes = [
  {
    _id: 'disp-1',
    id: 'disp-1',
    amount: 150.0,
    currency: { code: 'USD', symbol: '$' },
    status: 'needs_response',
    reason: 'fraudulent',
    businessName: 'Acme Corp',
    business: { _id: 'biz-1', organizationName: 'Acme Corp' },
    createdAt: now(),
  },
]

export const invoices = [
  {
    _id: 'inv-1',
    id: 'inv-1',
    uuid: 'inv-uuid-1',
    invoiceNumber: 'INV-1001',
    amount: 500.0,
    currency: { code: 'USD', symbol: '$' },
    status: 'paid',
    businessName: 'Acme Corp',
    business: { _id: 'biz-1', organizationName: 'Acme Corp' },
    createdAt: now(),
  },
]

export const checkouts = [
  {
    _id: 'chk-1',
    id: 'chk-1',
    uuid: 'chk-uuid-1',
    name: 'Premium Checkout',
    amount: 99.99,
    status: 'active',
    businessName: 'Acme Corp',
    business: { _id: 'biz-1', organizationName: 'Acme Corp' },
    createdAt: now(),
  },
]

export const refunds = [
  {
    _id: 'ref-1',
    id: 'ref-1',
    amount: 50.0,
    currency: { code: 'USD', symbol: '$' },
    status: 'SUCCESS',
    providerName: 'stripe',
    paymentType: 'Invoice',
    method: 'card',
    methodToDisplay: 'card',
    refundDate: now(),
    paymentId: 'pay-1',
    customer: { firstName: 'John', lastName: 'Doe', email: 'john.doe@finance.com' },
    business: { _id: 'biz-1', organizationName: 'Acme Corp' },
    card: { type: 'visa', brand: 'visa', number: '4242', cardNumber: '4242' },
    createdAt: now(),
  },
  {
    _id: 'ref-2',
    id: 'ref-2',
    amount: 25.0,
    currency: { code: 'USD', symbol: '$' },
    status: 'PENDING',
    providerName: 'payarc',
    paymentType: 'Checkout',
    method: 'card',
    methodToDisplay: 'card',
    refundDate: now(),
    paymentId: 'pay-2',
    customer: { firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@finance.com' },
    business: { _id: 'biz-2', organizationName: 'Globex Inc' },
    card: { type: 'mastercard', brand: 'mastercard', number: '5555', cardNumber: '5555' },
    createdAt: now(),
  },
]

export const payouts = [
  {
    _id: 'po-1',
    id: 'po-1',
    amount: 5000.0,
    currency: { code: 'USD', symbol: '$' },
    status: 'paid',
    businessName: 'Acme Corp',
    business: { _id: 'biz-1', id: 'biz-1', organizationName: 'Acme Corp' },
    timeline: {
      startDate: now(),
      arrivalDate: now(),
      initiatedAt: now(),
      completedAt: now(),
    },
    createdAt: now(),
  },
  {
    _id: 'po-2',
    id: 'po-2',
    amount: 1200.0,
    currency: { code: 'USD', symbol: '$' },
    status: 'pending',
    businessName: 'Globex Inc',
    business: { _id: 'biz-2', id: 'biz-2', organizationName: 'Globex Inc' },
    timeline: {
      startDate: now(),
      arrivalDate: now(),
      initiatedAt: now(),
      completedAt: null,
    },
    createdAt: now(),
  },
]

export const subscriptions = [
  {
    _id: 'sub-1',
    id: 'sub-1',
    planName: 'Premium',
    interval: 'month',
    price: 99.99,
    status: 'active',
    businessName: 'Acme Corp',
    businessId: { _id: 'biz-1', organizationName: 'Acme Corp' },
    business: { _id: 'biz-1', organizationName: 'Acme Corp' },
    createdAt: now(),
  },
]

export const plans = [
  {
    _id: 'plan-1',
    id: 'plan-1',
    title: 'Starter',
    name: 'Starter',
    planName: 'Starter',
    price: 29.99,
    interval: 'month',
    recurring: 'monthly',
    isActive: true,
    isRecomended: false,
    trialDays: 14,
    status: 'active',
    features: [
      { title: 'Up to 100 invoices / month' },
      { title: 'Basic payments' },
      { title: 'Email support' },
    ],
  },
  {
    _id: 'plan-2',
    id: 'plan-2',
    title: 'Premium',
    name: 'Premium',
    planName: 'Premium',
    price: 99.99,
    interval: 'month',
    recurring: 'monthly',
    isActive: true,
    isRecomended: true,
    trialDays: 30,
    status: 'active',
    features: [
      { title: 'Unlimited invoices' },
      { title: 'Advanced payments & payouts' },
      { title: 'Priority support' },
      { title: 'Team members' },
    ],
  },
  {
    _id: 'plan-3',
    id: 'plan-3',
    title: 'Enterprise',
    name: 'Enterprise',
    planName: 'Enterprise',
    price: 299.99,
    interval: 'month',
    recurring: 'yearly',
    isActive: true,
    isRecomended: false,
    trialDays: 0,
    status: 'active',
    features: [
      { title: 'Everything in Premium' },
      { title: 'Custom rates' },
      { title: 'Dedicated account manager' },
      { title: 'SLA & audit logs' },
    ],
  },
]

export const agents = [
  {
    _id: 'agent-1',
    id: 'agent-1',
    name: 'Sales Agent One',
    email: 'agent1@finance.com',
    status: 'active',
    createdAt: now(),
  },
]

export const wallets = [
  {
    _id: 'wal-1',
    id: 'wal-1',
    userId: 'usr-1',
    balance: 1250.0,
    currency: { code: 'USD', symbol: '$' },
    status: 'active',
    createdAt: now(),
  },
]

export const transactions = [
  {
    _id: 'txn-1',
    id: 'txn-1',
    amount: 100.0,
    type: 'credit',
    status: 'completed',
    createdAt: now(),
  },
]

export const requests = [
  {
    _id: 'req-1',
    id: 'req-1',
    subject: 'Support Request',
    status: 'open',
    data: 'note1||note2',
    business: { _id: 'biz-1', organizationName: 'Acme Corp' },
    requestData: { failedCount: 0 },
    createdAt: now(),
  },
]

export const banners = [
  {
    _id: 'ban-1',
    id: 'ban-1',
    title: 'Welcome Banner',
    status: 'active',
    createdAt: now(),
  },
]

export const countries = [
  {
    _id: 'us',
    id: 'us',
    name: 'United States',
    code: 'US',
    sortname: 'US',
    alpha3Code: 'USA',
    isActive: true,
  },
  {
    _id: 'ca',
    id: 'ca',
    name: 'Canada',
    code: 'CA',
    sortname: 'CA',
    alpha3Code: 'CAN',
    isActive: true,
  },
]

export const downloads = [
  {
    _id: 'dl-1',
    id: 'dl-1',
    fileName: 'report.csv',
    status: 'ready',
    createdAt: now(),
  },
]

export const notifications = [
  {
    _id: 'notif-1',
    id: 'notif-1',
    title: 'System Update',
    body: 'Scheduled maintenance tonight',
    status: 'draft',
    createdAt: now(),
  },
]

export const devices = [
  {
    _id: 'dev-1',
    id: 'dev-1',
    deviceName: 'iPhone 15',
    platform: 'ios',
    status: 'active',
    createdAt: now(),
  },
]

export const rewardTemplates = [
  {
    _id: 'rt-1',
    id: 'rt-1',
    name: 'Cashback Template',
    status: 'active',
    createdAt: now(),
  },
]

export const fundingLinks = [
  {
    _id: 'fl-1',
    id: 'fl-1',
    name: 'Give Link 1',
    fundingName: 'acme-give',
    amount: 100.0,
    status: 'active',
    business: { _id: 'biz-1', organizationName: 'Acme Corp' },
    createdAt: now(),
  },
]

export const peymeLinks = [
  {
    _id: 'peyme-1',
    id: 'peyme-1',
    name: 'Finance.Me Link',
    peymeName: 'acme-pay',
    status: 'active',
    publicView: { shareableLinkUrl: 'https://example.com/for/acme-pay' },
    business: { _id: 'biz-1', organizationName: 'Acme Corp' },
    createdAt: now(),
  },
]

export const debitCards = [
  {
    _id: 'dc-1',
    id: 'dc-1',
    last4: '4242',
    status: 'active',
    type: 'virtual',
    providerName: 'stripe',
    balance: 1250.5,
    currency: { code: 'USD', symbol: '$' },
    business: {
      id: 'biz-1',
      _id: 'biz-1',
      organizationName: 'Acme Corp',
    },
    cards: [
      {
        _id: 'card-v-1',
        cardType: 'virtual',
        cardNumber: '**** **** **** 4242',
        status: 'active',
      },
      {
        _id: 'card-p-1',
        cardType: 'physical',
        cardNumber: '**** **** **** 5555',
        status: 'active',
      },
    ],
    createdAt: now(),
  },
  {
    _id: 'dc-2',
    id: 'dc-2',
    last4: '8888',
    status: 'active',
    type: 'physical',
    providerName: 'payarc',
    balance: 430.0,
    currency: { code: 'USD', symbol: '$' },
    business: {
      id: 'biz-2',
      _id: 'biz-2',
      organizationName: 'Globex Inc',
    },
    cards: [
      {
        _id: 'card-v-2',
        cardType: 'virtual',
        cardNumber: '**** **** **** 8888',
        status: 'blocked',
      },
    ],
    createdAt: now(),
  },
]

export const schedulers = [
  {
    _id: 'sch-1',
    id: 'sch-1',
    name: 'Daily Sync',
    cron: '0 0 * * *',
    status: 'active',
  },
]

export const documents = [
  {
    _id: 'doc-1',
    id: 'doc-1',
    documentName: 'business_license',
    message: 'Please upload business license',
    status: 'pending',
    providerName: 'Finance',
    business: {
      id: 'biz-1',
      _id: 'biz-1',
      organizationName: 'Acme Corp',
    },
    businessName: 'Acme Corp',
    documentIds: [
      {
        fileUrl: 'https://via.placeholder.com/400x300.png?text=Document',
        fileName: 'license.pdf',
      },
    ],
    submittedAt: now(),
    createdAt: now(),
  },
  {
    _id: 'doc-2',
    id: 'doc-2',
    documentName: 'identity_proof',
    message: 'Government ID required',
    status: 'submitted',
    providerName: 'stripe',
    business: {
      id: 'biz-1',
      _id: 'biz-1',
      organizationName: 'Acme Corp',
    },
    businessName: 'Acme Corp',
    documentIds: [
      {
        fileUrl: 'https://via.placeholder.com/400x300.png?text=ID',
        fileName: 'id.pdf',
      },
    ],
    submittedAt: now(),
    createdAt: now(),
  },
]

export const payoutChangeRequests = [
  {
    _id: 'pcr-1',
    id: 'pcr-1',
    status: 'pending',
    businessName: 'Acme Corp',
    business: { _id: 'biz-1', organizationName: 'Acme Corp' },
    createdAt: now(),
  },
]

export const assets = [
  {
    _id: 'asset-1',
    id: 'asset-1',
    fileName: 'logo.png',
    type: 'image',
    createdAt: now(),
  },
]

export const featureFlags = [
  {
    _id: 'ff-1',
    id: 'ff-1',
    key: 'wallet_enabled',
    enabled: true,
  },
]

export const ledgerData = [
  {
    _id: 'led-1',
    id: 'led-1',
    amount: 500.0,
    type: 'credit',
    createdAt: now(),
  },
]

export const crmUsers = [
  {
    _id: 'crm-1',
    id: 'crm-1',
    name: 'CRM Contact',
    email: 'contact@finance.com',
    phone: '+1234567890',
  },
]

export const currencies = [
  {
    countryCode: 'US',
    currencies: [{ code: 'USD', symbol: '$', name: 'US Dollar', displayName: 'USD - US Dollar' }],
  },
  {
    countryCode: 'CA',
    currencies: [
      { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', displayName: 'CAD - Canadian Dollar' },
    ],
  },
  {
    countryCode: 'GB',
    currencies: [
      { code: 'GBP', symbol: '£', name: 'British Pound', displayName: 'GBP - British Pound' },
    ],
  },
]

export const adminUser = {
  _id: 'static-admin',
  name: 'Static Admin',
  email: 'admin@finance.com',
  role: 'admin',
}

export const webhookLogs = [
  {
    _id: 'wh_log_1',
    entityId: 'evt_pi_1',
    businessId: 'biz-1',
    eventType: 'payment_intent.succeeded',
    providerName: 'stripe',
    createdAt: now(),
    payload: {
      id: 'evt_pi_1',
      type: 'payment_intent.succeeded',
      data: { object: { id: 'pi_static_001', amount: 2500, currency: 'usd', status: 'succeeded' } },
    },
  },
  {
    _id: 'wh_log_2',
    entityId: 'evt_ch_2',
    businessId: 'biz-2',
    eventType: 'charge.succeeded',
    providerName: 'payarc',
    createdAt: now(),
    payload: {
      id: 'evt_ch_2',
      type: 'charge.succeeded',
      data: { object: { id: 'ch_static_002', amount: 9900, currency: 'usd', status: 'succeeded' } },
    },
  },
  {
    _id: 'wh_log_3',
    entityId: 'evt_py_3',
    businessId: 'biz-1',
    eventType: 'payout.paid',
    providerName: 'stripe',
    createdAt: now(),
    payload: {
      id: 'evt_py_3',
      type: 'payout.paid',
      data: { object: { id: 'po_static_001', amount: 50000, currency: 'usd', status: 'paid' } },
    },
  },
]

export const errorLogs = [
  {
    _id: 'err_log_1',
    operation: 'create_payment',
    message: 'Card declined by issuer',
    source: 'stripe',
    businessId: 'biz-1',
    createdAt: now(),
    stack: 'Error: Card declined\n    at PaymentService.create',
    payload: { code: 'card_declined', decline_code: 'generic_decline' },
  },
  {
    _id: 'err_log_2',
    operation: 'webhook_handler',
    message: 'Signature verification failed',
    source: 'payarc',
    businessId: 'biz-2',
    createdAt: now(),
    stack: 'Error: Invalid signature\n    at verifyWebhook',
    payload: { reason: 'invalid_signature' },
  },
  {
    _id: 'err_log_3',
    operation: 'payout_transfer',
    message: 'Insufficient funds in platform balance',
    source: 'stripe',
    businessId: 'biz-3',
    createdAt: now(),
    stack: 'Error: balance_insufficient\n    at PayoutService.transfer',
    payload: { code: 'balance_insufficient' },
  },
]

export function findById(list, id) {
  // eslint-disable-next-line no-underscore-dangle
  return list.find(item => item._id === id || item.id === id) || list[0]
}

export function buildListPayload(items, key) {
  return {
    [key]: items,
    meta,
    items,
    list: items,
  }
}
