import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mission, UserMissionCompletion } from '../../types';
import { ArrowRightIcon, TrophyIcon } from '../../assets/icons';
import { useAuth } from '../../contexts/AuthContext';

const MissionsWidget: React.FC = () => {
    const [availableMissions, setAvailableMissions] = useState<Mission[]>([]);
    const { token } = useAuth();
    
    useEffect(() => {
        const fetchWidgetMissions = async () => {
            if (!token) return;

            try {
                const [activeRes, completedRes] = await Promise.all([
                    fetch('/api/missions', { headers: { 'Authorization': `Bearer ${token}` } }),
                    fetch('/api/missions/me', { headers: { 'Authorization': `Bearer ${token}` } })
                ]);
                if (!activeRes.ok || !completedRes.ok) return;

                const activeData = await activeRes.json();
                const completedData = await completedRes.json();

                const completedMissionIds = new Set((completedData.missions || []).map((c: UserMissionCompletion) => c.missionId));
                const available = (activeData.missions || []).filter((m: Mission) => !completedMissionIds.has(m.id));
                
                setAvailableMissions(available.slice(0, 3));
            } catch (err) {
                console.error("Failed to fetch missions for widget", err);
            }
        };
        fetchWidgetMissions();
    }, [token]);


    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Available Missions</h2>
                <Link to="/missions" className="text-sm font-semibold text-brand-600 hover:underline">
                    View All
                </Link>
            </div>
            {availableMissions.length > 0 ? (
                <ul className="space-y-4">
                    {availableMissions.map(mission => (
                        <li key={mission.id} className="flex items-center gap-3">
                            <div className="p-2 bg-brand-100 dark:bg-brand-900/20 rounded-full">
                               <TrophyIcon className="w-5 h-5 text-brand-500" />
                            </div>
                            <div>
                                <p className="font-medium text-sm">{mission.title}</p>
                                <p className="text-xs text-green-500 font-semibold">+{mission.rewardPoints} pts</p>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="text-center py-4">
                     <TrophyIcon className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-600" />
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">No active missions right now. Great job!</p>
                </div>
            )}
        </div>
    );
};

export default MissionsWidget;
