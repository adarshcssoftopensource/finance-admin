import apiClient from '../axios'

export default async function getMenuData() {
  return [
    {
      title: 'Dashboard',
      key: 'dashboard',
      icon: 'fe fe-briefcase',
      url: '/dashboard',
    },
    {
      title: 'Businesses',
      key: 'business',
      icon: 'fe fe-briefcase',
      url: '/business',
    },
    {
      title: 'Merchant of Record',
      key: 'merchantRecord',
      icon: 'fe fe-briefcase',
      url: '/merchant-record',
    },
    {
      title: 'Users',
      key: 'users',
      icon: 'fe fe-users',
      url: '/users',
    },
    {
      title: 'Agents',
      key: 'agents',
      icon: 'fe fe-users',
      url: '/agents',
    },
    {
      title: 'Restricted Businesses',
      key: 'restrictBusiness',
      icon: 'fe fe-briefcase',
      url: '/restrict-business',
    },
    {
      title: 'Verification Center',
      key: 'verification-center',
      icon: 'fe fe-briefcase',
      url: '/verification-center',
    },
    {
      title: 'CRM',
      key: 'crm',
      icon: 'fe fe-briefcase',
      url: '/crm',
    },
    {
      title: 'Logs',
      key: 'logs',
      icon: 'fe fe-briefcase',
      url: '/logs',
    },
    {
      title: 'Push Notifications',
      key: 'push-notifications',
      icon: 'fe fe-briefcase',
      url: '/push-notifications',
    },
    {
      title: 'Onboarding Review ',
      key: 'onboardingReview',
      icon: 'fe fe-dollar-sign',
      url: '/onboardingreview',
    },
    {
      title: 'Disputes',
      key: 'disputes',
      icon: 'fe fe-shield-off',
      url: '/disputes',
    },
    {
      title: 'Scheduler',
      key: 'scheduler',
      icon: 'fe fe-clock',
      url: '/scheduler',
    },
    {
      title: 'Reward Templates',
      key: 'rewardTemplates',
      icon: 'fe fe-gift',
      url: '/reward-templates',
    },
    {
      title: 'Subscriptions',
      key: 'subscriptions',
      icon: 'fe fe-package',
      url: '/subscriptions',
    },
    {
      title: 'Give Links',
      key: 'fundingLinks',
      icon: 'fe fe-link',
      url: '/fundinglinks',
    },
    {
      title: 'Finance.Me Lynks',
      key: 'Finance.Me Lynk',
      icon: 'fe fe-airplay',
      url: '/peyme',
    },
    {
      title: 'Invoices',
      key: 'Invoices',
      icon: 'fe fe-layout',
      url: '/invoices',
    },
    {
      title: 'Checkouts',
      key: 'Checkouts',
      icon: 'fe fe-shopping-cart',
      url: '/checkouts',
    },
    {
      title: 'Payments',
      key: 'payments',
      icon: 'fe fe-dollar-sign',
      url: '/payments',
    },
    {
      title: 'Refunds',
      key: 'refunds',
      icon: 'fe fe-dollar-sign',
      url: '/refunds',
    },
    {
      title: 'Payouts',
      key: 'payouts',
      icon: 'fe fe-dollar-sign',
      url: '/payouts',
    },
    {
      title: 'Requests',
      key: 'requests',
      icon: 'fe fe-edit-3',
      url: '/requests',
    },
    {
      title: 'Finance Wallet',
      key: 'financeWallet',
      icon: 'fe fe-pocket',
      children: [
        {
          title: 'All Wallets',
          key: 'finance-wallets-list',
          icon: 'fe fe-pocket',
          url: '/wallets',
        },
        {
          title: 'Wallet signups',
          key: 'finance-wallets-signups',
          icon: 'fe fe-user-plus',
          url: '/finance-wallets/signups',
        },
        {
          title: 'Wallet Transactions',
          key: 'finance-wallets-transactions',
          icon: 'fe fe-activity',
          url: '/finance-wallets/transactions',
        },
        {
          title: 'Cashback',
          key: 'finance-wallets-cashback',
          icon: 'fe fe-percent',
          url: '/finance-wallets/cashback',
        },
        {
          title: 'Business Fees',
          key: 'finance-wallets-merchant-fees',
          icon: 'fe fe-briefcase',
          url: '/finance-wallets/merchant-fees',
        },
        {
          title: 'Security',
          key: 'finance-wallets-security',
          icon: 'fe fe-shield',
          url: '/finance-wallets/security',
        },
      ],
    },
    {
      title: 'Debit Cards',
      key: 'debit_cards',
      icon: 'fe fe-credit-card',
      url: '/debit-card-wallets',
    },
    // {
    //   title: 'Wallet Transaction',
    //   key: 'wallet_transactions',
    //   icon: 'fe fe-list',
    //   url: '/wallet_transactions',
    // },
    // {
    //   title: 'Wallet Ledger',
    //   key: 'wallet_ledger',
    //   icon: 'fe fe-credit-card',
    //   url: '/wallet_ledger',
    // },
    {
      title: 'Plans',
      key: 'plans',
      icon: 'fe fe-package',
      url: '/plans',
    },
    {
      title: 'Banners',
      key: 'banners',
      icon: 'fe fe-film',
      url: '/banners',
    },
    // {
    //   title: 'Staff',
    //   key: 'staff',
    //   icon: 'fe fe-users',
    //   url: '/staff',
    // },
    {
      title: 'Countries',
      key: 'country',
      icon: 'fe fe-zap',
      url: '/countries',
    },
    // {
    //   title: 'Invoice Bad Data',
    //   key: 'invoices',
    //   icon: 'fe fe-alert-triangle',
    //   url: '/invoices/bad-data',
    // },
    // {
    //   title: 'System Management',
    //   key: 'system_management',
    //   icon: 'fe fe-shield-off',
    //   url: '/system_management',
    // },
    // {
    //   title: 'Reports',
    //   key: 'reports',
    //   icon: 'fe fe-book',
    //   url: '/reports',
    // },
    {
      title: 'Downloads',
      key: 'downloads',
      icon: 'fe fe-download',
      url: '/downloads',
    },
    {
      title: 'Assets Management',
      key: 'assets_management',
      icon: 'fe fe-image',
      url: '/assets_management',
    },
    {
      title: 'Systemwide Settings',
      key: 'system_settings',
      icon: 'fe fe-settings',
      url: '/system_settings',
    },
  ]
}

export async function getMenuItemCount() {
  return apiClient
    .get(`/businesses/count`)
    .then(response => {
      return response?.data?.data ?? {}
    })
    .catch(err => console.log(err))
}
