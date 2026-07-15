/* eslint-disable */
import {
  BusinessPhoneMask,
  BusinessSelectDropDown,
  BusinessTypeInputMask,
  displayMask,
  DobMask,
  Numberformatmask,
  Numbermask,
  SelectDropDown,
  phoneNumberMask,
  TermsAndConditionMask,
  WebsiteMask,
} from './components'

const uiSchema = {
  businessType: {
    'ui:widget': BusinessTypeInputMask,
  },
  telephone: {
    'ui:widget': BusinessPhoneMask,
  },
  personalPhone: {
    'ui:widget': BusinessPhoneMask,
  },
  statement: {
    displayName: {
      'ui:widget': displayMask,
    },
  },
  merchantAgreementAccepted: {
    'ui:widget': TermsAndConditionMask,
  },
  dob: {
    'ui:widget': DobMask,
  },
  businessIncorporationDate: {
    'ui:widget': DobMask,
  },
  idNumber: {
    'ui:widget': Numbermask,
  },
  taxNumber: {
    'ui:widget': Numbermask,
  },
  annualCardVolume: {
    'ui:widget': Numberformatmask,
  },
  maxTransactionAmount: {
    'ui:widget': Numberformatmask,
  },
  website: {
    'ui:widget': WebsiteMask,
  },
}

const uiSchema1 = {
  items: {
    personalPhone: {
      'ui:widget': BusinessPhoneMask,
    },
    dob: {
      'ui:widget': DobMask,
    },
    idNumber: {
      'ui:widget': Numbermask,
    },
  },
}

const filterSchema = {
  filter: {
    createdAtStart: {
      'ui:widget': DobMask,
    },
    createdAtEnd: {
      'ui:widget': DobMask,
    },
    country: {
      'ui:widget': SelectDropDown,
    },
    phone: {
      'ui:widget': phoneNumberMask,
    },
  },
  business: {
    createdAtStart: {
      'ui:widget': DobMask,
    },
    createdAtEnd: {
      'ui:widget': DobMask,
    },
    country: {
      'ui:widget': BusinessSelectDropDown,
    },
    providerName: {
      'ui:widget': SelectDropDown,
    },
    pobStatus: {
      'ui:widget': SelectDropDown,
    },
    subscription: {
      'ui:widget': SelectDropDown,
      'ui:hideError': true,
    },
  },
  session: {
    createdAtStart: {
      'ui:widget': DobMask,
    },
    createdAtEnd: {
      'ui:widget': DobMask,
    },
  },
}

export { uiSchema, uiSchema1, filterSchema }
