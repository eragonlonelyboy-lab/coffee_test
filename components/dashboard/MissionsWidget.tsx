import React from 'react';
import { Link } from 'react-router-dom';
import { missions } from '../../data/mockData';
import { MissionStatus } from '../../types';
import { ArrowRightIcon, TrophyIcon } from '../../assets/icons';

const MissionsWidget: React.FC = () => {
    const activeMissions = missions.filter(m => m.status === MissionStatus.InProgress).slice(0, 3);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Active Missions</h2>
                <Link to="/missions" className="text-sm font-semibold text-brand-600 hover:underline">
                    View All
                </Link>
            </div>
            {activeMissions.length > 0 ? (
                <ul className="space-y-4">
                    {activeMissions.map(mission => {
                        const progress = (mission.progress / mission.goal) * 100;
                        return (
                            <li key={mission.id}>
                                <p className="font-medium text-sm mb-1">{mission.title}</p>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{mission.progress} of {mission.goal} completed</p>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <div className="text-center py-4">
                     <TrophyIcon className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-600" />
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">No active missions right now. Check back soon!</p>
                </div>
            )}
        </div>
    );
};

export default MissionsWidget;