import React from 'react';
import { Mission } from '../../types';
import { TrophyIcon } from '../../assets/icons';

interface MissionCardProps {
    mission: Mission;
    completed: boolean;
    onClaim: (mission: Mission) => void;
}

const MissionCard: React.FC<MissionCardProps> = ({ mission, completed, onClaim }) => {
    
    return (
        <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col transition-opacity ${
            completed ? 'opacity-60' : ''
        }`}>
            <div className="flex items-start gap-4">
                <div className={`p-2 rounded-full ${completed ? 'bg-green-100 dark:bg-green-900/50' : 'bg-brand-100 dark:bg-brand-900/20'}`}>
                    <TrophyIcon className={`w-6 h-6 ${completed ? 'text-green-500' : 'text-brand-500'}`} />
                </div>
                <div>
                    <h3 className="font-semibold">{mission.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{mission.description}</p>
                </div>
            </div>
            
            <div className="mt-4 flex-grow flex items-end justify-between">
                 <p className="text-xs text-gray-400">
                    Ends: {new Date(mission.endDate).toLocaleDateString()}
                 </p>
                 <span className="font-bold text-green-500">+{mission.rewardPoints} pts</span>
            </div>

            <div className="mt-auto pt-4">
                {completed ? (
                    <button disabled className="w-full bg-gray-200 dark:bg-gray-700 text-gray-500 font-semibold py-2 rounded-md cursor-not-allowed">
                        Completed
                    </button>
                ) : (
                    <button 
                        onClick={() => onClaim(mission)} 
                        className="w-full bg-green-500 text-white font-semibold py-2 rounded-md hover:bg-green-600 transition-colors"
                    >
                        Claim Reward
                    </button>
                )}
            </div>
        </div>
    );
};

export default MissionCard;
