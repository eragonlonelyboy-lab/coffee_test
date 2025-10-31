import React, { useState, useEffect } from 'react';
import { Mission, UserMissionCompletion } from '../types';
import MissionCard from '../components/missions/MissionCard';
import Confetti from '../components/missions/Confetti';
import { useNotification } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';
import { TrophyIcon } from '../assets/icons';

const MissionsPage: React.FC = () => {
    const [activeMissions, setActiveMissions] = useState<Mission[]>([]);
    const [completedMissions, setCompletedMissions] = useState<UserMissionCompletion[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showConfetti, setShowConfetti] = useState(false);

    const { addNotification } = useNotification();
    const { token, claimMissionReward } = useAuth();

    useEffect(() => {
        const fetchMissionsData = async () => {
            if (!token) return;
            setIsLoading(true);
            try {
                const [activeRes, completedRes] = await Promise.all([
                    fetch('/api/missions', { headers: { 'Authorization': `Bearer ${token}` } }),
                    fetch('/api/missions/me', { headers: { 'Authorization': `Bearer ${token}` } })
                ]);

                if (!activeRes.ok || !completedRes.ok) {
                    throw new Error('Failed to fetch missions data.');
                }
                
                const activeData = await activeRes.json();
                const completedData = await completedRes.json();

                setActiveMissions(activeData.missions || []);
                setCompletedMissions(completedData.missions || []);

            } catch (err) {
                setError('Could not load your missions at this time.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMissionsData();
    }, [token]);

    const handleClaim = async (missionToClaim: Mission) => {
        try {
            // Note: The context's `claimMissionReward` still works with the new API
            const result = await claimMissionReward(missionToClaim.id);
            if (result.success) {
                addNotification(`You completed "${missionToClaim.title}" and earned ${result.pointsAwarded} points!`, 'success');
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 5000);

                // Manually refetch or update state to move mission to completed
                // For simplicity, we'll just refetch everything
                 const completedRes = await fetch('/api/missions/me', { headers: { 'Authorization': `Bearer ${token}` } });
                 const completedData = await completedRes.json();
                 setCompletedMissions(completedData.missions || []);
            }
        } catch (err: any) {
            addNotification(err.message || 'Failed to complete mission.', 'error');
        }
    };

    const completedMissionIds = new Set(completedMissions.map(c => c.missionId));
    const availableMissions = activeMissions.filter(m => !completedMissionIds.has(m.id));

    if (isLoading) {
        return (
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold">Missions</h1>
                    <p className="text-gray-500 dark:text-gray-400">Complete challenges to earn bonus points.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                            <div className="mt-4 h-10 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    
    if (error) {
         return <div className="text-center text-red-500 bg-red-50 dark:bg-red-900/20 p-6 rounded-lg">{error}</div>;
    }

    return (
        <div className="space-y-8">
            {showConfetti && <Confetti />}
            <div>
                <h1 className="text-3xl font-bold">Missions</h1>
                <p className="text-gray-500 dark:text-gray-400">Complete challenges to earn bonus points.</p>
            </div>
            
            <div>
                <h2 className="text-2xl font-semibold mb-4">Available to Complete</h2>
                {availableMissions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {availableMissions.map(mission => (
                            <MissionCard key={mission.id} mission={mission} completed={false} onClaim={handleClaim} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg">
                        <TrophyIcon className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600" />
                        <p className="mt-2 text-gray-500 dark:text-gray-400">No new missions available. Check back later!</p>
                    </div>
                )}
            </div>

             <div>
                <h2 className="text-2xl font-semibold mb-4">Completed</h2>
                {completedMissions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {completedMissions.map(comp => (
                            <MissionCard key={comp.id} mission={comp.mission} completed={true} onClaim={() => {}} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg">
                         <TrophyIcon className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600" />
                        <p className="mt-2 text-gray-500 dark:text-gray-400">You haven't completed any missions yet.</p>
                    </div>
                )}
            </div>

        </div>
    );
};

export default MissionsPage;
