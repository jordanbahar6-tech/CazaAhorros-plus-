export type UserRole = 'owner' | 'admin' | 'merchant' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  permissions: {
    canViewFinancials: boolean;
    canWithdraw: boolean;
    canManageUsers: boolean;
    canModerateContent: boolean;
    canPublishOffers: boolean;
  };
  phone?: string;
  city?: string;
  country: string;
  premiumStatus: 'free' | 'premium_monthly' | 'premium_annual';
  createdAt: string;
}

export type Currency = 'DOP' | 'USD' | 'EUR';

export type RevenueSource = 'ads' | 'subscriptions' | 'in_app_purchases' | 'commissions' | 'merchant_listings';

export interface FinancialTransaction {
  id: string;
  date: string;
  concept: string;
  grossAmount: number;
  feeAmount: number;
  netAmount: number;
  currency: Currency;
  source: RevenueSource;
  status: 'confirmed' | 'pending_settlement' | 'refunded' | 'failed';
  reference: string;
  gateway: 'CardNet RD' | 'Azul (Banco Popular)' | 'Stripe' | 'PayPal' | 'Google AdMob' | 'Direct Transfer';
  notes?: string;
}

export type WithdrawalStatus = 
  | 'solicitado' 
  | 'en_revision' 
  | 'aprobado' 
  | 'procesando' 
  | 'completado' 
  | 'rechazado' 
  | 'cancelado';

export type DominicanPayoutProvider = 
  | 'ACH_BANRESERVAS'
  | 'ACH_BANCO_POPULAR'
  | 'ACH_BANCO_BHD'
  | 'ACH_SCOTIABANK_RD'
  | 'CARDNET_MERCHANT'
  | 'AZUL_COMMERCE'
  | 'PAYPAL_RD';

export interface PayoutAccountDetails {
  bankName: string;
  accountType: 'ahorros' | 'corriente';
  accountNumberMasked: string;
  accountHolderName: string;
  cedulaOrRnc: string;
  email?: string;
}

export interface WithdrawalRequest {
  id: string;
  idempotencyKey: string;
  requestedBy: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
  amount: number;
  currency: Currency;
  fee: number;
  netAmount: number;
  provider: DominicanPayoutProvider;
  accountDetails: PayoutAccountDetails;
  status: WithdrawalStatus;
  requestedAt: string;
  updatedAt: string;
  rejectionReason?: string;
  rejectionFixInstructions?: string;
  providerReference?: string;
  estimatedDeliveryHours: number;
  auditTrail: {
    timestamp: string;
    actor: string;
    action: string;
    notes?: string;
  }[];
}

export interface SegregatedFunds {
  ownerPlatformFunds: number; // Plataforma (ganancias netas retirables)
  pendingSettlement: number; // Por liquidar por pasarelas (ej. CardNet/Azul en 48h)
  merchantEscrowFunds: number; // Fondos de vendedores y comercios (protegidos, no retirables por el dueño)
  userWalletDeposits: number; // Fondos de usuarios (custodia restringida)
  currency: Currency;
}

export interface FinancialSummary {
  totalRevenue: number;
  monthRevenue: number;
  availableBalance: number;
  pendingBalance: number;
  totalWithdrawn: number;
  inProcessWithdrawn: number;
  currency: Currency;
  bySource: {
    ads: number;
    subscriptions: number;
    in_app_purchases: number;
    commissions: number;
    merchant_listings: number;
  };
  segregated: SegregatedFunds;
  statsChart: {
    period: 'daily' | 'weekly' | 'monthly' | 'yearly';
    labels: string[];
    data: number[];
  };
  notifications: WithdrawalNotification[];
}

export interface WithdrawalNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'withdrawal_requested' | 'withdrawal_approved' | 'withdrawal_processed' | 'withdrawal_rejected';
  read: boolean;
  withdrawalId: string;
}

export interface PayoutProviderConfig {
  id: DominicanPayoutProvider;
  name: string;
  supportedCurrencies: Currency[];
  minWithdrawal: number;
  maxWithdrawal: number;
  fixedFee: number;
  percentageFee: number;
  processingTimeText: string;
  isActive: boolean;
  requiresCedula: boolean;
  statusMessage?: string;
}

// Module 1: CazaAhorros
export interface StoreProduct {
  id: string;
  name: string;
  category: string;
  barcode: string;
  prices: {
    storeName: string;
    storeType: 'supermercado' | 'farmacia' | 'colmado';
    price: number;
    unit: string;
    verified: boolean;
    updatedAt: string;
  }[];
  priceHistory: {
    date: string;
    store: string;
    price: number;
  }[];
  cheaperAlternative?: {
    name: string;
    price: number;
    store: string;
    savingsPercent: number;
  };
}

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  selectedStore?: string;
  estimatedPrice: number;
}

// Module 2: CercaRD
export interface LocalBusiness {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviewsCount: number;
  city: string;
  sector: string;
  phone: string;
  whatsapp: string;
  verified: boolean;
  isOpen: boolean;
  hours: string;
  description: string;
  priceRange: '$' | '$$' | '$$$';
}

export interface QuoteRequest {
  id: string;
  businessId: string;
  businessName: string;
  clientName: string;
  serviceNeeded: string;
  date: string;
  status: 'pendiente' | 'respondida' | 'aceptada';
}

// Module 3: DineroClaro
export interface FinancialRecord {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  currency: Currency;
  category: string;
  concept: string;
  date: string;
  isRecurrent: boolean;
}

export interface InvisibleLeak {
  id: string;
  title: string;
  monthlyCost: number;
  annualCost: number;
  recommendation: string;
}

// Module 4: ProfeIA
export interface StudyQuiz {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

// Module 5: TodoKit
export interface CurrencyExchange {
  from: string;
  to: string;
  rate: number;
  date: string;
  source: string;
}

// Module 6: EmpleoYa
export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  modality: 'Presencial' | 'Híbrido' | 'Remoto';
  salaryRangeDOP: string;
  experience: string;
  verified: boolean;
  postedAt: string;
  description: string;
  requirements: string[];
}

// Module 7: ViralLab
export interface ViralTemplate {
  platform: 'TikTok' | 'Instagram Reels' | 'YouTube Shorts';
  hook: string;
  script: string;
  hashtags: string[];
  cta: string;
}

// Module 8: ÚltimaOferta
export interface ClearanceDeal {
  id: string;
  title: string;
  store: string;
  location: string;
  originalPrice: number;
  discountPrice: number;
  discountPercentage: number;
  stockRemaining: number;
  pickupWindow: string;
  expiresInHours: number;
  verified: boolean;
  reserved?: boolean;
}

// Module 9: DocuFácil
export interface DocumentTemplate {
  id: string;
  title: string;
  category: 'Legal RD' | 'Comercial' | 'Finanzas';
  description: string;
  fields: { name: string; label: string; placeholder: string }[];
}

// Module 10: MiBarrio
export interface NeighborhoodPost {
  id: string;
  author: string;
  sector: string;
  category: 'alerta' | 'objetos_perdidos' | 'recomendacion' | 'compraventa';
  title: string;
  content: string;
  timestamp: string;
  likes: number;
  verifiedCommunityUser: boolean;
}
