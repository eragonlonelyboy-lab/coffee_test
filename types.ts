
export enum UserTier {
    Bronze = 'Bronze',
    Silver = 'Silver',
    Gold = 'Gold',
    Platinum = 'Platinum',
    Elite = 'Elite',
}

export interface User {
    id: string;
    name: string;
    email: string;
    tier: UserTier;
    points: number;
    walletBalance: number;
}

export interface DrinkCustomizationOption {
    id: string;
    name: string;
    priceModifier?: number;
}

export interface DrinkCustomization {
    id: string;
    name: string;
    options: DrinkCustomizationOption[];
}

export interface Drink {
    id: string;
    name: string;
    description: string;
    price: number;
    category: 'Hot Coffees' | 'Iced Coffees' | 'Teas & More';
    imageUrls: string[];
    customizations?: DrinkCustomization[];
    rating: number;
    reviewCount: number;
}

export interface CartItem {
    id: string; // Unique ID for the cart item instance
    drink: Drink;
    quantity: number;
    customizations: Record<string, string>; // { customizationId: optionId }
    unitPrice: number;
}

export interface Outlet {
    id: string;
    name: string;
    address: string;
    hours: string;
    imageUrl: string;
    // Rating is now on Drink
}

export enum OrderStatus {
    InProgress = 'In Progress',
    ReadyForPickup = 'Ready for Pickup',
    Completed = 'Completed',
    Cancelled = 'Cancelled',
}

export interface OrderItem {
    id: string; // Unique ID for this specific item in the order
    drink: Drink;
    quantity: number;
    unitPrice: number;
    customizations: Record<string, string>;
}

export interface Order {
    id: string;
    userId: string;
    outletId: string;
    date: string; // ISO string
    items: OrderItem[];
    total: number;
    status: OrderStatus;
    preparationTime: number; // in minutes
}

export interface Promotion {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
}

export enum MissionStatus {
    InProgress = 'In Progress',
    Completed = 'Completed',
}

export interface Mission {
    id: string;
    title: string;
    description: string;
    points: number;
    goal: number;
    progress: number;
    status: MissionStatus;
}

export interface Reward {
    id: string;
    title: string;
    description: string;
    pointsRequired: number;
    tierRequired: UserTier;
    imageUrl: string;
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
}

export interface Review {
    id: string;
    userId: string;
    drinkId: string;
    drinkName: string;
    userName: string;
    rating: number; // 1-5
    comment: string;
    tags?: string[];
    date: string; // ISO string
}

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  duration?: number;
}
