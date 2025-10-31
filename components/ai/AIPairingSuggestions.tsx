import React, { useState, useEffect, useMemo } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { Drink, AIPairingSuggestion } from '../../types';
import { SparklesIcon } from '../../assets/icons';

interface AIPairingSuggestionsProps {
    menu: Drink[];
}

const AIPairingSuggestions: React.FC<AIPairingSuggestionsProps> = ({ menu }) => {
    const [selectedDrinkId, setSelectedDrinkId] = useState<string>('');
    const [suggestions, setSuggestions] = useState<AIPairingSuggestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { drinks, foodItems } = useMemo(() => {
        const drinks = menu.filter(item => item.category.toLowerCase().includes('coffee') || item.category.toLowerCase().includes('tea'));
        const foodItems = menu.filter(item => !item.category.toLowerCase().includes('coffee') && !item.category.toLowerCase().includes('tea'));
        return { drinks, foodItems };
    }, [menu]);

    useEffect(() => {
        const getSuggestions = async () => {
            if (!selectedDrinkId || foodItems.length === 0) {
                setSuggestions([]);
                return;
            }

            setIsLoading(true);
            setError(null);
            setSuggestions([]);

            try {
                // FIX: Per guidelines, API key must be obtained from process.env.API_KEY and used directly.
                // Assuming this is pre-configured and valid.
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                
                const selectedDrink = drinks.find(d => d.id === selectedDrinkId);
                if (!selectedDrink) return;

                const prompt = `
                    You are a knowledgeable food and coffee pairing expert for a cafe called LoyalBrew.
                    A customer has selected the following drink:
                    - Name: ${selectedDrink.name}
                    - Description: ${selectedDrink.description}

                    From the list of available food items below, please suggest the top 2 best pairings.
                    For each suggestion, provide a brief, enticing, one-sentence reason why it's a great match.

                    Available food items:
                    - ${foodItems.map(f => f.name).join('\n- ')}

                    Your response must be a valid JSON array of objects. Each object should have two keys: "itemName" and "reason".
                    Do not include any other text or explanations outside of the JSON array.
                `;

                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                    config: { 
                        responseMimeType: 'application/json',
                        responseSchema: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    itemName: { type: Type.STRING },
                                    reason: { type: Type.STRING },
                                },
                                required: ['itemName', 'reason']
                            }
                        }
                    }
                });

                const jsonText = response.text.trim();
                const result = JSON.parse(jsonText);
                setSuggestions(result);

            } catch (err) {
                console.error("AI Pairing Suggestion Error:", err);
                setError("Our AI barista is taking a quick break. Please try again later!");
            } finally {
                setIsLoading(false);
            }
        };

        getSuggestions();

    }, [selectedDrinkId, drinks, foodItems]);
    
    const SkeletonCard = () => (
        <div className="bg-white/50 dark:bg-black/20 p-4 rounded-lg flex-grow animate-pulse">
            <div className="h-5 w-1/2 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
            <div className="h-4 w-full bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
    );

    return (
        <div className="bg-gradient-to-tr from-brand-50 to-blue-50 dark:from-brand-950 dark:to-blue-900/40 rounded-lg p-6 shadow-md">
            <div className="flex items-center gap-3 mb-4">
                <SparklesIcon className="w-8 h-8 text-brand-500" />
                <h2 className="text-2xl font-bold">AI-Powered Pairings</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Select a drink to see what our AI barista recommends with it!</p>
            
            <select
                value={selectedDrinkId}
                onChange={(e) => setSelectedDrinkId(e.target.value)}
                className="w-full max-w-md p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 focus:ring-brand-500 focus:border-brand-500"
            >
                <option value="">-- Choose a beverage --</option>
                {drinks.map(drink => (
                    <option key={drink.id} value={drink.id}>{drink.name}</option>
                ))}
            </select>

            <div className="mt-6">
                {isLoading && (
                    <div className="flex flex-col md:flex-row gap-4">
                        <SkeletonCard />
                        <SkeletonCard />
                    </div>
                )}
                {error && <p className="text-center text-red-500">{error}</p>}
                {!isLoading && !error && suggestions.length > 0 && (
                    <div className="flex flex-col md:flex-row gap-4">
                        {suggestions.map((suggestion, index) => (
                             <div key={index} className="bg-white/50 dark:bg-black/20 p-4 rounded-lg flex-grow backdrop-blur-sm border border-white/50 dark:border-black/20">
                                <h3 className="font-bold text-lg text-brand-700 dark:text-brand-300">{suggestion.itemName}</h3>
                                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{suggestion.reason}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AIPairingSuggestions;