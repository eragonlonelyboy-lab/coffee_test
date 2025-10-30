import React from 'react';

const Confetti: React.FC = () => {
    const confettiPieces = Array.from({ length: 150 }).map((_, i) => {
        const style: React.CSSProperties = {
            left: `${Math.random() * 100}%`,
            top: `${-20 + Math.random() * -80}%`, // Start above the screen
            backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
            animation: `fall ${2 + Math.random() * 3}s ${Math.random() * 2}s linear forwards`,
            transform: `rotate(${Math.random() * 360}deg)`,
            position: 'absolute',
            width: '8px',
            height: '16px',
            opacity: 1,
        };
        return <div key={i} style={style} />;
    });

    // Inject keyframes animation using a style tag since we cannot add CSS files.
    const css = `
        @keyframes fall {
            to {
                transform: translateY(100vh) rotate(720deg);
                opacity: 0;
            }
        }
    `;

    const containerStyle: React.CSSProperties = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 9999,
    };

    return (
        <>
            <style>{css}</style>
            <div style={containerStyle}>
                {confettiPieces}
            </div>
        </>
    );
};

export default Confetti;
