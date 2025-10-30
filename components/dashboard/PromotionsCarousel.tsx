import React, { useState, useEffect } from 'react';
import { promotions } from '../../data/mockData';
import { ChevronLeftIcon, ChevronRightIcon } from '../../assets/icons';

const PromotionsCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % promotions.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + promotions.length) % promotions.length);
  };

  useEffect(() => {
    const slideInterval = setInterval(nextSlide, 5000);
    return () => clearInterval(slideInterval);
  }, []);

  if (promotions.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4">Current Promotions</h2>
      <div className="relative w-full overflow-hidden rounded-lg">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {promotions.map((promo) => (
            <div key={promo.id} className="w-full flex-shrink-0 relative">
              <img src={promo.imageUrl} alt={promo.title} className="w-full h-48 object-cover" />
              <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-4">
                <h3 className="text-white text-lg font-bold">{promo.title}</h3>
                <p className="text-gray-200 text-sm">{promo.description}</p>
              </div>
            </div>
          ))}
        </div>

        <button onClick={prevSlide} className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/50 hover:bg-white/80 dark:bg-black/50 dark:hover:bg-black/80 text-gray-800 dark:text-white p-1 rounded-full">
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <button onClick={nextSlide} className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/50 hover:bg-white/80 dark:bg-black/50 dark:hover:bg-black/80 text-gray-800 dark:text-white p-1 rounded-full">
          <ChevronRightIcon className="w-6 h-6" />
        </button>
        
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
            {promotions.map((_, index) => (
                 <button 
                    key={index} 
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full ${currentIndex === index ? 'bg-white' : 'bg-white/50'}`} 
                    aria-label={`Go to slide ${index + 1}`}
                />
            ))}
        </div>

      </div>
    </div>
  );
};

export default PromotionsCarousel;