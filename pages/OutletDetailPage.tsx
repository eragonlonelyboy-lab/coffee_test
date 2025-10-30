import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { outlets, reviews } from '../data/mockData';
import OutletReviewList from '../components/reviews/OutletReviewList';
import { ChevronLeftIcon } from '../assets/icons';

const OutletDetailPage: React.FC = () => {
    const { outletId } = useParams<{ outletId: string }>();
    const outlet = outlets.find(o => o.id === outletId);

    if (!outlet) {
        return <div className="text-center">Outlet not found.</div>;
    }

    // Since reviews aren't tied to outlets in the mock data,
    // we'll show all reviews as a placeholder.
    const outletReviews = reviews;

    return (
        <div className="space-y-8">
             <Link to="/locations" className="flex items-center gap-1 text-sm font-semibold text-brand-600 hover:underline">
                <ChevronLeftIcon className="w-4 h-4" />
                Back to all locations
            </Link>
            <div>
                <img src={outlet.imageUrl} alt={outlet.name} className="w-full h-64 object-cover rounded-lg mb-4" />
                <h1 className="text-4xl font-bold">{outlet.name}</h1>
                <p className="text-lg text-gray-500 dark:text-gray-400">{outlet.address}</p>
                <p className="text-md text-gray-500 dark:text-gray-400">Open: {outlet.hours}</p>
            </div>

            <div>
                <h2 className="text-2xl font-semibold mb-4">Recent Reviews</h2>
                <OutletReviewList reviews={outletReviews} />
            </div>
        </div>
    );
};

export default OutletDetailPage;
