import React, { useRef } from 'react';
import type { Offer } from '../types';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

interface OfferHighlightProps {
    offers: Offer[];
}

const OfferCard: React.FC<{ offer: Offer; delay: number }> = ({ offer, delay }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const isVisible = useIntersectionObserver(cardRef, { threshold: 0.2 });

    return (
        <div
            ref={cardRef}
            className={`reveal flex-shrink-0 w-80 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg shadow-slate-900/10 overflow-hidden group border border-slate-200/80 ${isVisible ? 'is-visible' : ''}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            <div className="relative">
                <img src={offer.imageUrl} alt={offer.title} className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-110"/>
                <div className="absolute top-0 right-0 m-3 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                    Sale
                </div>
            </div>
            <div className="p-4 flex flex-col h-44">
                 <h3 className="text-lg font-bold text-slate-800 truncate">{offer.title}</h3>
                 <p className="text-sm text-slate-600 font-medium h-10 mt-1">
                    {offer.items.join(' + ')}
                </p>
                <div className="mt-auto flex justify-between items-center pt-2 border-t border-slate-200">
                    <div className="flex flex-col items-start">
                         <span className="text-2xl font-extrabold text-red-500">
                            ₹{offer.discountedPrice}
                        </span>
                        <del className="text-slate-400 text-md font-semibold -mt-1">
                            ₹{offer.originalPrice}
                        </del>
                    </div>
                    <button className="bg-red-600 text-white font-bold text-sm py-2 px-4 rounded-lg transition-transform transform hover:scale-105 hover:bg-red-700">
                        Grab Deal
                    </button>
                </div>
            </div>
        </div>
    );
};


const OfferHighlight: React.FC<OfferHighlightProps> = ({ offers }) => {
    const sectionRef = useRef<HTMLElement>(null);
    const isVisible = useIntersectionObserver(sectionRef, { threshold: 0.1 });

    if (!offers || offers.length === 0) {
        return null;
    }

    return (
        <section ref={sectionRef} className="py-8 overflow-hidden">
            <div className={`px-4 mb-4 reveal ${isVisible ? 'is-visible' : ''}`}>
                 <h2 className="text-2xl font-bold text-slate-900">Today's Hottest Deals</h2>
                 <p className="text-slate-600">Don't miss out on these amazing combos!</p>
            </div>
            <div className="flex gap-6 overflow-x-auto no-scrollbar px-4 pb-4">
                {offers.map((offer, index) => (
                    <OfferCard key={offer.id} offer={offer} delay={index * 100} />
                ))}
            </div>
        </section>
    );
};

export default OfferHighlight;