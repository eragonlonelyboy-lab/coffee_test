import React from 'react';

interface QRCodeProps {
    value: string;
    size?: number;
}

// This is a placeholder/mock QR code component.
// A real application would use a library like 'qrcode.react' to generate a real QR code.
const QRCode: React.FC<QRCodeProps> = ({ value, size = 200 }) => {
    return (
        <div 
            style={{ width: size, height: size }} 
            className="p-4 bg-white rounded-lg shadow-inner"
            title={`QR Code for: ${value}`}
        >
            <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="100" height="100" fill="white"/>
                <rect x="10" y="10" width="30" height="30" fill="black"/>
                <rect x="15" y="15" width="20" height="20" fill="white"/>
                <rect x="20" y="20" width="10" height="10" fill="black"/>

                <rect x="60" y="10" width="30" height="30" fill="black"/>
                <rect x="65" y="15" width="20" height="20" fill="white"/>
                <rect x="70" y="20" width="10" height="10" fill="black"/>

                <rect x="10" y="60" width="30" height="30" fill="black"/>
                <rect x="15" y="65" width="20" height="20" fill="white"/>
                <rect x="20" y="70" width="10" height="10" fill="black"/>
                
                <rect x="50" y="50" width="5" height="5" fill="black" />
                <rect x="60" y="45" width="5" height="5" fill="black" />
                <rect x="70" y="55" width="5" height="5" fill="black" />
                <rect x="80" y="65" width="5" height="5" fill="black" />
                <rect x="55" y="75" width="5" height="5" fill="black" />
                <rect x="45" y="60" width="5" height="5" fill="black" />
                <rect x="65" y="85" width="5" height="5" fill="black" />
                <rect x="85" y="50" width="5" height="5" fill="black" />
                <rect x="45" y="85" width="5" height="5" fill="black" />
            </svg>
        </div>
    );
};

export default QRCode;