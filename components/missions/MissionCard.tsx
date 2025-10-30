import React from 'react';
import { Mission, MissionStatus } from '../../types';
import { TrophyIcon } from '../../assets/icons';

interface MissionCardProps {
    mission: Mission;
    onClaim: (mission: Mission) => void;
}

const MissionCard: React.FC<MissionCardProps> = ({ mission, onClaim }) => {
    const isCompleted = mission.status === MissionStatus.Completed;
    const progress = (mission.progress / mission.goal) * 100;

    return (
        <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col ${isCompleted ? 'opacity-60' : ''}`}>
            <div className="flex items-start gap-4">
                <div className={`p-2 rounded-full ${isCompleted ? 'bg-green-100 dark:bg-green-900' : 'bg-brand-100 dark:bg-brand-900'}`}>
                    <TrophyIcon className={`w-6 h-6 ${isCompleted ? 'text-green-500' : 'text-brand-500'}`} />
                </div>
                <div>
                    <h3 className="font-semibold">{mission.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{mission.description}</p>
                </div>
            </div>
            
            <div className="mt-4 flex-grow">
                 <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                        className={`h-2.5 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-brand-600'}`}
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
                    <span>Progress: {mission.progress}/{mission.goal}</span>
                    <span className="font-bold text-green-500">+{mission.points} pts</span>
                </div>
            </div>

            {isCompleted && (
                 <button 
                    onClick={() => onClaim(mission)} 
                    // Let's assume claim is only possible once, so we disable it.
                    // A real app would track if points were claimed already.
                    disabled 
                    className="mt-auto pt-4 w-full bg-green-500 text-white font-semibold py-2 rounded-md cursor-not-allowed"
                >
                    Claimed
                </button>
            )}
        </div>
    );
};

export default MissionCard;