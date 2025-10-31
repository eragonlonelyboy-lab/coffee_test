import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface QRCodeProps {
    value: string;
    size?: number;
}

const QRCodeComponent: React.FC<QRCodeProps> = ({ value, size = 200 }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvasRef.current && value) {
            QRCode.toCanvas(canvasRef.current, value, { width: size, margin: 1 }, (error) => {
                if (error) console.error('QR Code generation error:', error);
            });
        }
    }, [value, size]);

    return (
        <div 
            style={{ width: size, height: size }} 
            className="p-2 bg-white rounded-lg shadow-inner flex items-center justify-center"
            title={`QR Code for: ${value}`}
        >
           <canvas ref={canvasRef} />
        </div>
    );
};

export default QRCodeComponent;