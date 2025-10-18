import React from 'react';
import { PhoneIcon, MapPinIcon, ShareIcon, InstagramIcon, ShoppingCartIcon } from './Icons';

interface ActionFooterProps {
    cartItemCount: number;
    onShowCart: () => void;
}

const ActionFooter: React.FC<ActionFooterProps> = ({ cartItemCount, onShowCart }) => {
    const actions = [
        { name: 'Call', icon: <PhoneIcon className="w-6 h-6" />, href: 'tel:+911234567890', onClick: () => {} },
        { name: 'Location', icon: <MapPinIcon className="w-6 h-6" />, href: 'https://maps.google.com', onClick: () => {} },
        { name: 'Cart', icon: <ShoppingCartIcon className="w-6 h-6" />, href: '#', onClick: onShowCart },
        { name: 'Share', icon: <ShareIcon className="w-6 h-6" />, href: '#', onClick: () => {} },
    ];

    return (
        <footer className="fixed bottom-0 left-0 right-0 z-30 bg-white/80 backdrop-blur-md border-t border-slate-200">
            <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
                {actions.map((action) => (
                    <a
                        key={action.name}
                        href={action.href}
                        onClick={(e) => {
                            if (action.onClick) {
                                e.preventDefault();
                                action.onClick();
                            }
                        }}
                        target={action.name !== 'Cart' ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className="relative flex flex-col items-center justify-center text-slate-600 hover:text-red-500 transition-colors w-1/4"
                    >
                        {action.icon}
                        <span className="text-xs mt-1 font-medium">{action.name}</span>
                        {action.name === 'Cart' && cartItemCount > 0 && (
                             <span className="absolute top-0 right-4 w-5 h-5 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                {cartItemCount}
                            </span>
                        )}
                    </a>
                ))}
            </div>
        </footer>
    );
};

export default ActionFooter;