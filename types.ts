// types.ts

export enum UserTier {
    Bronze = 'BRONZE',
    Silver = 'SILVER',
    Gold = 'GOLD',
    Platinum = 'PLATINUM',
    Elite = 'ELITE',
}

export interface User {
    id: string;
    name: string;
    email: string;
    tier: UserTier;
    points: number;
    walletBalance: number;
    phone?: string | null;
}

export interface CustomizationOption {
    id: string;
    name: string;
    priceModifier?: number;
}

export interface Customization {
    id: string;
    name: string;
    options: CustomizationOption[];
}

export interface Drink {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrls: string[];
    customizations?: Customization[];
    rating: number;
    reviewCount: number;
}

export interface Outlet {
    id: string;
    name: string;
    address: string;
    city: string;
    latitude: number;
    longitude: number;
    imageUrl: string;
}

export enum OrderStatus {
    New = 'NEW',
    Pending = 'PENDING',
    Confirmed = 'CONFIRMED',
    Preparing = 'PREPARING',
    Ready = 'READY',
    Completed = 'COMPLETED',
    Cancelled = 'CANCELLED',
    Refunded = 'REFUNDED'
}

export interface OrderItem {
    id: string;
    quantity: number;
    linePrice: number;
    menuItem: {
        name: string;
    };
}

export interface Order {
    id: string;
    userId: string;
    storeId: string;
    createdAt: string;
    status: OrderStatus;
    items: OrderItem[];
    totalAmount: number;
    store?: { name: string };
}

export interface CartItem {
    id: string;
    quantity: number;
    options: Record<string, string>;
    menuItemId: string;
    menuItem: Drink;
}

export interface Promotion {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    code: string | null;
    discountPct: number | null;
    minSpend: number | null;
    startAt: string | null;
    endAt: string | null;
    active: boolean;
}

// Represents the Mission model from the database
export interface Mission {
    id: string;
    title: string;
    description: string;
    rewardPoints: number;
    type: string;
    startDate: string;
    endDate: string;
}

// Represents the data structure returned by `/api/missions/me`
export interface UserMissionCompletion {
    id: string;
    userId: string;
    missionId: string;
    completedAt: string;
    mission: Mission;
}


export interface Reward {
    id: string;
    title: string;
    description: string;
    pointsRequired: number;
    tierRequired: UserTier;
    imageUrl: string;
    discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
    discountValue: number;
}

export interface PointTransaction {
    id: string;
    userId: string;
    date: string;
    description: string;
    points: number;
}

export interface WalletTransaction {
    id: string;
    userId: string;
    date: string;
    description: string;
    amount: number;
}

export interface Voucher {
    id: string;
    userId: string;
    title: string;
    description: string;
    expiryDate: string;
    used: boolean;
    discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
    discountValue: number;
}

export interface Review {
    id: string;
    userId: string;
    orderId: string;
    storeId: string;
    userName: string;
    rating: number;
    comment: string;
    date: string;
    store?: { name: string };
    user?: { name: string };
}

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  duration?: number;
}

export interface BackendNotification {
    id: string;
    userId: string | null;
    type: string;
    channel: string;
    payload: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface SalesReportRow {
    storeId: string;
    storeName: string; // Enriched on frontend
    _count: {
        id: number;
    };
    _sum: {
        totalAmount: number | null;
    };
}

export interface PopularItemReportRow {
    menuItemId: string;
    itemName: string; // Enriched on frontend
    itemImage: string; // Enriched on frontend
    _sum: {
        quantity: number | null;
    };
}


export interface AIPairingSuggestion {
    itemName: string;
    reason: string;
}
