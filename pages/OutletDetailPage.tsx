import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Outlet, Review } from '../types';
import OutletReviewList from '../components/reviews/OutletReviewList';
import { StarIcon } from '../assets/icons';

const OutletDetailPage: React.FC = () => {
    const { outletId } = useParams<{ outletId: string }>();
    const [outlet, setOutlet] = useState<Outlet | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!outletId) return;

        const fetchOutletDetails = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Fetch outlet details
                const outletRes = await fetch(`/api/menu/stores/${outletId}`);
                if (!outletRes.ok) throw new Error('Could not find this location.');
                const outletData = await outletRes.json();
                
                 const outletWithImage: Outlet = {
                    ...outletData.store,
                    imageUrl: `https://picsum.photos/seed/${outletData.store.name.split(' ').join('-')}/800/400`,
                };
                setOutlet(outletWithImage);

                // Fetch reviews for the outlet
                const reviewsRes = await fetch(`/api/reviews/store/${outletId}`);
                if (reviewsRes.ok) {
                    const reviewsData = await reviewsRes.json();
                    setReviews(reviewsData.reviews || []);
                }

            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOutletDetails();
    }, [outletId]);

    const averageRating = useMemo(() => {
        if (reviews.length === 0) return 0;
        const total = reviews.reduce((sum, review) => sum + review.rating, 0);
        return (total / reviews.length).toFixed(1);
    }, [reviews]);


    if (isLoading) {
        return <p className="text-center">Loading location details...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500">{error}</p>;
    }

    if (!outlet) {
        return <p className="text-center">Location not found.</p>;
    }

    return (
        <div className="space-y-8">
            <div>
                <img src={outlet.imageUrl} alt={outlet.name} className="w-full h-64 object-cover rounded-lg" />
                <div className="mt-4">
                    <h1 className="text-4xl font-bold">{outlet.name}</h1>
                    <p className="text-lg text-gray-500 dark:text-gray-400">{outlet.address}, {outlet.city}</p>
                     <div className="mt-2 flex items-center gap-2">
                        <StarIcon className="w-6 h-6 text-yellow-400" solid/>
                        <span className="font-bold text-xl">{averageRating}</span>
                        <span className="text-gray-500 dark:text-gray-400">({reviews.length} reviews)</span>
                    </div>
                </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                 <h2 className="text-2xl font-semibold mb-4">Reviews for {outlet.name}</h2>
                 <OutletReviewList reviews={reviews} />
            </div>
        </div>
    );
};

export default OutletDetailPage;
