import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { drinks as allDrinks } from '../../data/mockData';
import { Drink, Order } from '../../types';
import { Link } from 'react-router-dom';
import { SparklesIcon } from '../../assets/icons';
import { useAuth } from '../../contexts/AuthContext';

const DrinkOfTheDay: React.FC = () => {
    const [drink, setDrink] = useState<Drink | null>(null);
    const [reason, setReason] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { token } = useAuth();

    useEffect(() => {
        const fetchRecommendation = async () => {
            if (!token) {
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError(null);
            try {
                // 1. Fetch user's order history
                let orderHistorySummary = "This is a new user with no past orders.";
                try {
                    const orderRes = await fetch('/api/orders', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (orderRes.ok) {
                        const orders: Order[] = await orderRes.json();
                        const completedOrders = orders.filter(o => o.status === 'COMPLETED');
                        if (completedOrders.length > 0) {
                            // FIX: The 'name' property is nested inside 'menuItem'.
                            const itemNames = completedOrders.flatMap(o => o.items.map(i => i.menuItem.name)).slice(0, 10); // Limit to last 10 items for prompt efficiency
                            orderHistorySummary = `Here is a list of the user's recently ordered items: ${itemNames.join(', ')}.`;
                        }
                    }
                } catch (e) {
                    console.warn("Could not fetch user order history for recommendation.", e);
                    // Gracefully continue without history
                }

                // 2. Call Gemini API for recommendation
                // FIX: Per guidelines, API key must be obtained from process.env.API_KEY and used directly.
                // Assuming this is pre-configured and valid.
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                const drinkOptions = allDrinks.map(d => ({ id: d.id, name: d.name, description: d.description, category: d.category }));

                const prompt = `
                    You are a friendly and expert barista at a coffee shop called LoyalBrew.
                    Your task is to act as a personal recommender and select a "Drink of the Day" for a specific user from our menu.
                    
                    ${orderHistorySummary}
                    
                    Based on their history (or lack thereof), choose one drink from the list below that you think they would enjoy.
                    If they have a history, try to recommend something new but related to their tastes. If they have no history, pick something popular and welcoming.
                    Also, provide a short, friendly, and encouraging one-sentence reason for your recommendation.
                    
                    Available drinks:
                    ${JSON.stringify(drinkOptions, null, 2)}
                    
                    Please respond with ONLY a valid JSON object with two keys: "drinkId" for the ID of your chosen drink, and "reason" for your personalized message.
                    Example:
                    { "drinkId": "d-4", "reason": "Since you seem to enjoy lattes, I thought you might like to try our vibrant Matcha Green Tea Latte for something new!" }
                `;

                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                    config: { responseMimeType: 'application/json' }
                });
                
                const jsonText = response.text.trim();
                const result = JSON.parse(jsonText);
                const { drinkId, reason: recommendationReason } = result;

                const foundDrink = allDrinks.find(d => d.id === drinkId);
                
                if (foundDrink) {
                    setDrink(foundDrink);
                    setReason(recommendationReason || "We thought you might enjoy this special treat today!");
                } else {
                    throw new Error("AI returned an invalid drink recommendation.");
                }

            } catch (err) {
                console.error("Error fetching Drink of the Day:", err);
                setError("Couldn't decide on a special drink today. Please check back later!");
                // Fallback to a random drink on error
                setDrink(allDrinks[Math.floor(Math.random() * allDrinks.length)]);
                setReason("Our system is brewing some ideas, but in the meantime, how about this classic favorite?");
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecommendation();
    }, [token]);

    const LoadingSkeleton = () => (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
            <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3 h-48 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                <div className="md:w-2/3 space-y-3">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                    <div className="pt-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                    </div>
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mt-2"></div>
                </div>
            </div>
        </div>
    );


    if (isLoading) {
        return <LoadingSkeleton />;
    }

    if (error && !drink) {
        return (
             <div className="bg-red-50 dark:bg-red-900/20 rounded-lg shadow-md p-6 text-center">
                <h2 className="text-xl font-semibold text-red-700 dark:text-red-300">Something went wrong!</h2>
                <p className="text-red-600 dark:text-red-400 mt-2">{error}</p>
            </div>
        );
    }
    
    if (!drink) {
        return null;
    }

    return (
        <div className="bg-gradient-to-br from-brand-50 to-yellow-50 dark:from-brand-950 dark:to-yellow-900/30 rounded-lg shadow-lg p-6 overflow-hidden relative">
             <SparklesIcon className="absolute -right-8 -top-8 w-32 h-32 text-brand-200 dark:text-brand-900 opacity-50" />
            <h2 className="text-2xl font-bold text-coffee-darker dark:text-white mb-4 relative z-10">
                Your Daily Brew Recommendation
            </h2>
            <div className="flex flex-col md:flex-row gap-6 relative z-10">
                <div className="md:w-1/3">
                    <img src={drink.imageUrls[0]} alt={drink.name} className="w-full h-full object-cover rounded-lg shadow-md min-h-48" />
                </div>
                <div className="md:w-2/3 flex flex-col justify-center">
                    <h3 className="text-3xl font-bold text-brand-700 dark:text-brand-300">{drink.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300 my-2">{drink.description}</p>
                    
                    {reason && (
                        <blockquote className="mt-4 p-3 bg-white/50 dark:bg-black/20 border-l-4 border-brand-300 dark:border-brand-700 rounded-r-lg">
                            <p className="text-sm italic text-gray-700 dark:text-gray-300">"{reason}"</p>
                            <cite className="block text-right text-xs text-gray-500 dark:text-gray-400 mt-1">- Your Personal Barista</cite>
                        </blockquote>
                    )}

                    <div className="mt-4">
                        <Link to="/menu" className="bg-brand-500 text-white font-semibold px-6 py-2.5 rounded-md hover:bg-brand-600 transition-transform hover:scale-105 inline-block">
                           Order Now
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DrinkOfTheDay;