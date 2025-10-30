import { UserTier } from '../types';

export const tierPointMultipliers: Record<UserTier, number> = {
    [UserTier.Bronze]: 1,
    [UserTier.Silver]: 1.1,
    [UserTier.Gold]: 1.2,
    [UserTier.Platinum]: 1.5,
    [UserTier.Elite]: 2,
};

// Based on mock data: order total $4.25 -> 42 points. Base is approx 10 points per dollar.
export const BASE_POINTS_PER_DOLLAR = 10;

export const calculatePoints = (spendAmount: number, tier: UserTier): number => {
    const multiplier = tierPointMultipliers[tier];
    const points = spendAmount * BASE_POINTS_PER_DOLLAR * multiplier;
    return Math.floor(points);
};
