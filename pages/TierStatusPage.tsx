import React from 'react';
import { useCurrentUser } from '../hooks/useCurrentUser';
import CurrentTierCard from '../components/tiers/CurrentTierCard';
import TierComparisonTable from '../components/tiers/TierComparisonTable';
import PointsCalculator from '../components/tiers/PointsCalculator';

const TierStatusPage: React.FC = () => {
    const currentUser = useCurrentUser();
    
    if (!currentUser) {
        return <p>Loading...</p>;
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Loyalty Tiers</h1>
                <p className="text-gray-500 dark:text-gray-400">Discover the benefits of climbing the LoyalBrew ladder.</p>
            </div>

            <CurrentTierCard user={currentUser} />

            <PointsCalculator user={currentUser} />

            <TierComparisonTable />
        </div>
    );
};

export default TierStatusPage;
