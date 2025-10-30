import { User, UserTier, Drink, Outlet, Order, OrderStatus, Promotion, Mission, MissionStatus, Reward, PointTransaction, WalletTransaction, Voucher, Review } from '../types';

export const users: User[] = [
    { id: 'user-1', name: 'Alex Doe', email: 'alex@example.com', tier: UserTier.Gold, points: 2150, walletBalance: 75.50 },
    { id: 'user-2', name: 'Jane Smith', email: 'jane@example.com', tier: UserTier.Silver, points: 800, walletBalance: 25.00 },
];

export const drinks: Drink[] = [
    {
        id: 'd-1', name: 'Caramel Macchiato', description: 'Rich espresso with steamed milk and a sweet caramel drizzle.', price: 4.75, category: 'Hot Coffees',
        imageUrls: ['https://picsum.photos/seed/caramel-macchiato/400/300', 'https://picsum.photos/seed/caramel-macchiato-2/400/300'],
        customizations: [
            { id: 'c-1', name: 'Milk', options: [{ id: 'o-1', name: 'Whole Milk' }, { id: 'o-2', name: 'Skim Milk' }, { id: 'o-3', name: 'Oat Milk', priceModifier: 0.75 }] },
            { id: 'c-2', name: 'Espresso Shots', options: [{ id: 'o-4', name: '1 Shot' }, { id: 'o-5', name: '2 Shots', priceModifier: 0.50 }, { id: 'o-6', name: '3 Shots', priceModifier: 1.00 }] }
        ],
        rating: 4.8, reviewCount: 125
    },
    {
        id: 'd-2', name: 'Iced Vanilla Latte', description: 'Cool and creamy, a perfect blend of espresso, vanilla, and milk over ice.', price: 5.25, category: 'Iced Coffees',
        imageUrls: ['https://picsum.photos/seed/iced-latte/400/300', 'https://picsum.photos/seed/iced-latte-2/400/300'],
        customizations: [
            { id: 'c-1', name: 'Milk', options: [{ id: 'o-1', name: 'Whole Milk' }, { id: 'o-2', name: 'Skim Milk' }, { id: 'o-3', name: 'Almond Milk', priceModifier: 0.75 }] },
            { id: 'c-3', name: 'Sweetness', options: [{ id: 'o-7', name: 'Regular' }, { id: 'o-8', name: 'Half Sweet' }, { id: 'o-9', name: 'Unsweetened' }] }
        ],
        rating: 4.9, reviewCount: 210
    },
    {
        id: 'd-3', name: 'Classic Drip Coffee', description: 'A smooth, well-balanced cup of our signature house blend.', price: 2.50, category: 'Hot Coffees',
        imageUrls: ['https://picsum.photos/seed/drip-coffee/400/300', 'https://picsum.photos/seed/drip-coffee-2/400/300'],
        customizations: [
            { id: 'c-4', name: 'Size', options: [{ id: 'o-10', name: 'Small' }, { id: 'o-11', name: 'Medium', priceModifier: 0.50 }, { id: 'o-12', name: 'Large', priceModifier: 1.00 }] }
        ],
        rating: 4.5, reviewCount: 88
    },
    {
        id: 'd-4', name: 'Matcha Green Tea Latte', description: 'Finely ground green tea with steamed milk for a vibrant, smooth taste.', price: 4.95, category: 'Teas & More',
        imageUrls: ['https://picsum.photos/seed/matcha-latte/400/300', 'https://picsum.photos/seed/matcha-latte-2/400/300'],
        customizations: [
            { id: 'c-1', name: 'Milk', options: [{ id: 'o-1', name: 'Whole Milk' }, { id: 'o-3', name: 'Oat Milk', priceModifier: 0.75 }, { id: 'o-13', name: 'Soy Milk', priceModifier: 0.75 }] }
        ],
        rating: 4.7, reviewCount: 95
    },
    {
        id: 'd-5', name: 'Cold Brew', description: 'Slow-steeped for a super-smooth, less acidic, and highly caffeinated coffee experience.', price: 4.25, category: 'Iced Coffees',
        imageUrls: ['https://picsum.photos/seed/cold-brew/400/300', 'https://picsum.photos/seed/cold-brew-2/400/300'],
        rating: 4.8, reviewCount: 150
    },
    {
        id: 'd-6', name: 'Chai Tea Latte', description: 'Black tea infused with cinnamon, clove, and other warming spices, combined with steamed milk.', price: 4.50, category: 'Teas & More',
        imageUrls: ['https://picsum.photos/seed/chai-latte/400/300', 'https://picsum.photos/seed/chai-latte-2/400/300'],
        rating: 4.6, reviewCount: 72
    }
];

export const outlets: Outlet[] = [
    { id: 'o-1', name: 'Downtown Roastery', address: '123 Main St, Metroville', hours: '6am - 8pm', imageUrl: 'https://picsum.photos/seed/downtown-cafe/400/300' },
    { id: 'o-2', name: 'Uptown Express', address: '456 Oak Ave, Uptown', hours: '7am - 6pm', imageUrl: 'https://picsum.photos/seed/uptown-cafe/400/300' },
    { id: 'o-3', name: 'Riverfront Perk', address: '789 River Rd, Riverside', hours: '8am - 9pm', imageUrl: 'https://picsum.photos/seed/river-cafe/400/300' },
];

export const orders: Order[] = [
    {
        id: 'ord-12345', userId: 'user-1', outletId: 'o-1', date: new Date(Date.now() - 86400000 * 2).toISOString(),
        items: [{ id: 'oi-1', drink: drinks[0], quantity: 1, unitPrice: 5.25, customizations: { 'c-1': 'o-3', 'c-2': 'o-5' } }],
        total: 5.25, status: OrderStatus.Completed, preparationTime: 8
    },
    {
        id: 'ord-12346', userId: 'user-1', outletId: 'o-2', date: new Date(Date.now() - 86400000).toISOString(),
        items: [
            { id: 'oi-2', drink: drinks[1], quantity: 1, unitPrice: 5.25, customizations: {} },
            { id: 'oi-3', drink: drinks[2], quantity: 1, unitPrice: 3.00, customizations: { 'c-4': 'o-11' } }
        ],
        total: 8.25, status: OrderStatus.Completed, preparationTime: 10
    },
     {
        id: 'ord-12347', userId: 'user-1', outletId: 'o-1', date: new Date().toISOString(),
        items: [{ id: 'oi-4', drink: drinks[4], quantity: 1, unitPrice: 4.25, customizations: {} }],
        total: 4.25, status: OrderStatus.InProgress, preparationTime: 5
    }
];

export const promotions: Promotion[] = [
    { id: 'p-1', title: 'Double Points Tuesday', description: 'Earn 2x points on all purchases every Tuesday!', imageUrl: 'https://picsum.photos/seed/promo-double/600/400' },
    { id: 'p-2', title: 'Happy Hour 2-4pm', description: 'Get 50% off all iced drinks from 2pm to 4pm on weekdays.', imageUrl: 'https://picsum.photos/seed/promo-happy/600/400' },
];

export const missions: Mission[] = [
    { id: 'm-1', title: 'Morning Rush', description: 'Order 5 drinks before 9am in one week.', points: 100, goal: 5, progress: 3, status: MissionStatus.InProgress },
    { id: 'm-2', title: 'Taste Explorer', description: 'Try 3 different drinks from the "Teas & More" category.', points: 75, goal: 3, progress: 1, status: MissionStatus.InProgress },
    { id: 'm-3', title: 'Weekly Regular', description: 'Visit us 3 times in one week.', points: 50, goal: 3, progress: 3, status: MissionStatus.Completed },
];

export const rewards: Reward[] = [
    { id: 'r-1', title: 'Free Drip Coffee', description: 'Any size of our classic house blend.', pointsRequired: 250, tierRequired: UserTier.Bronze, imageUrl: 'https://picsum.photos/seed/reward-drip/400/300', discountType: 'FIXED_AMOUNT', discountValue: 3.50 },
    { id: 'r-2', title: '$5 Off Your Order', description: 'Enjoy $5 off your total purchase.', pointsRequired: 400, tierRequired: UserTier.Bronze, imageUrl: 'https://picsum.photos/seed/reward-pastry/400/300', discountType: 'FIXED_AMOUNT', discountValue: 5.00 },
    { id: 'r-3', title: 'Any Handcrafted Drink', description: 'Your choice of any specialty drink, any size.', pointsRequired: 750, tierRequired: UserTier.Silver, imageUrl: 'https://picsum.photos/seed/reward-specialty/400/300', discountType: 'FIXED_AMOUNT', discountValue: 7.00 },
    { id: 'r-4', title: '25% Off Merchandise', description: 'A stylish, reusable tumbler for your daily brew.', pointsRequired: 1500, tierRequired: UserTier.Gold, imageUrl: 'https://picsum.photos/seed/reward-tumbler/400/300', discountType: 'PERCENTAGE', discountValue: 25 },
];

export const pointTransactions: PointTransaction[] = [
    { id: 'pt-1', userId: 'user-1', date: new Date().toISOString(), description: 'Order #ord-12347', points: 42 },
    { id: 'pt-2', userId: 'user-1', date: new Date(Date.now() - 86400000).toISOString(), description: 'Order #ord-12346', points: 82 },
    { id: 'pt-3', userId: 'user-1', date: new Date(Date.now() - 86400000 * 3).toISOString(), description: 'Redeemed: Free Drip Coffee', points: -250 },
];

export const walletTransactions: WalletTransaction[] = [
    { id: 'wt-1', userId: 'user-1', date: new Date(Date.now() - 86400000 * 5).toISOString(), description: 'Wallet Top-Up', amount: 50.00 },
    { id: 'wt-2', userId: 'user-1', date: new Date(Date.now() - 86400000 * 2).toISOString(), description: 'Payment for Order #ord-12345', amount: -5.25 },
    { id: 'wt-3', userId: 'user-1', date: new Date(Date.now() - 86400000).toISOString(), description: 'Payment for Order #ord-12346', amount: -8.25 },
];

export const vouchers: Voucher[] = [
    { id: 'v-1', userId: 'user-1', title: '50% Off Your Next Drink', description: 'Valid on any handcrafted beverage.', expiryDate: new Date(Date.now() + 86400000 * 7).toISOString(), used: false, discountType: 'PERCENTAGE', discountValue: 50 },
    { id: 'v-2', userId: 'user-1', title: '$1 Off Any Food Item', description: 'Enjoy a discount on our tasty treats.', expiryDate: new Date(Date.now() + 86400000 * 14).toISOString(), used: false, discountType: 'FIXED_AMOUNT', discountValue: 1 },
    { id: 'v-3', userId: 'user-1', title: 'Free Birthday Drink', description: 'Happy Birthday from LoyalBrew!', expiryDate: new Date(Date.now() - 86400000 * 2).toISOString(), used: true, discountType: 'FIXED_AMOUNT', discountValue: 7.00 },
];

export const reviews: Review[] = [
    { id: 'rev-1', userId: 'user-1', drinkId: 'd-1', drinkName: 'Caramel Macchiato', userName: 'Alex Doe', rating: 5, comment: 'Absolutely perfect, my favorite morning treat!', date: new Date(Date.now() - 86400000 * 4).toISOString(), tags: ['Good taste', 'Fast service'] },
    { id: 'rev-2', userId: 'user-2', drinkId: 'd-2', drinkName: 'Iced Vanilla Latte', userName: 'Jane Smith', rating: 5, comment: 'So refreshing and the vanilla is not too sweet. Delicious!', date: new Date(Date.now() - 86400000 * 3).toISOString(), tags: ['Good taste'] },
];