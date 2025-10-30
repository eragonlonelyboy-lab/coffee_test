import React, { useState } from 'react';
import { missions as allMissions } from '../data/mockData';
import { Mission, MissionStatus } from '../types';
import MissionCard from '../components/missions/MissionCard';
import Confetti from '../components/missions/Confetti';
import { useNotification } from '../contexts/NotificationContext';

const MissionsPage: React.FC = () => {
    const [showConfetti, setShowConfetti] = useState(false);
    const { addNotification } = useNotification();

    const handleClaim = (mission: Mission) => {
        // In a real app, this would update the backend. Here we just show a notification.
        addNotification(`You claimed ${mission.points} points from "${mission.title}"!`, 'success');
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000); // Confetti lasts 5 seconds
    };

    const inProgressMissions = allMissions.filter(m => m.status === MissionStatus.InProgress);
    const completedMissions = allMissions.filter(m => m.status === MissionStatus.Completed);

    return (
        <div className="space-y-8">
            {showConfetti && <Confetti />}
            <div>
                <h1 className="text-3xl font-bold">Missions</h1>
                <p className="text-gray-500 dark:text-gray-400">Complete challenges to earn bonus points.</p>
            </div>
            
            <div>
                <h2 className="text-2xl font-semibold mb-4">In Progress</h2>
                {inProgressMissions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {inProgressMissions.map(mission => (
                            <MissionCard key={mission.id} mission={mission} onClaim={handleClaim} />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 p-6 rounded-lg">No active missions right now. Check back later!</p>
                )}
            </div>

             <div>
                <h2 className="text-2xl font-semibold mb-4">Completed</h2>
                {completedMissions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {completedMissions.map(mission => (
                            <MissionCard key={mission.id} mission={mission} onClaim={handleClaim} />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 p-6 rounded-lg">You haven't completed any missions yet.</p>
                )}
            </div>

        </div>
    );
};

export default MissionsPage;