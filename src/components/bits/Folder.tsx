import React, { useState } from 'react';

interface FolderProps {
    color?: string;
    size?: number;
    className?: string;
    images?: Array<{ path: string; caption?: string }>; // Changed from thumbnail to images
}

const darkenColor = (hex: string, percent: number): string => {
    let color = hex.startsWith('#') ? hex.slice(1) : hex;
    if (color.length === 3) {
        color = color
            .split('')
            .map((c) => c + c)
            .join('');
    }
    const num = parseInt(color, 16);
    let r = (num >> 16) & 0xff;
    let g = (num >> 8) & 0xff;
    let b = num & 0xff;
    r = Math.max(0, Math.min(255, Math.floor(r * (1 - percent))));
    g = Math.max(0, Math.min(255, Math.floor(g * (1 - percent))));
    b = Math.max(0, Math.min(255, Math.floor(b * (1 - percent))));
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
};

const Folder: React.FC<FolderProps> = ({ color = '#5227FF', size = 1, className = '', images = [] }) => {
    const maxItems = 3;
    const [open, setOpen] = useState(false);
    const [paperOffsets] = useState<{ x: number; y: number }[]>(Array.from({ length: maxItems }, () => ({ x: 0, y: 0 })));

    const folderBackColor = darkenColor(color, 0.08);
    const paperColors = [darkenColor('#ffffff', 0.1), darkenColor('#ffffff', 0.05), '#ffffff'];

    const handleMouseEnter = () => setOpen(true);
    const handleMouseLeave = () => setOpen(false);

    const getOpenTransform = (index: number) => {
        const transforms = ['translate(-120%, -70%) rotate(-15deg)', 'translate(10%, -70%) rotate(15deg)', 'translate(-50%, -100%) rotate(5deg)'];
        return transforms[index] || '';
    };

    const getPaperStyle = (index: number) => {
        const imageUrl = images[index]?.path;
        const sizeClasses = ['w-[70%] h-[80%]', 'w-[80%] h-[80%]', 'w-[90%] h-[80%]'];

        return {
            transform: open
                ? `${getOpenTransform(index)} translate(${paperOffsets[index].x}px, ${paperOffsets[index].y}px)`
                : `translate(-50%, ${index * 5}%)`,
            backgroundColor: !imageUrl ? paperColors[index] : 'transparent',
            backgroundImage: imageUrl ? `url('/storage/documentation/${imageUrl}')` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '10px',
            border: imageUrl ? '1px solid rgba(0,0,0,0.1)' : 'none',
        };
    };

    return (
        <div
            className={`relative inline-block ${className}`}
            style={{
                width: `${100 * size}px`,
                height: `${80 * size}px`,
            }}
        >
            <div
                className="group relative cursor-pointer transition-all duration-200 ease-in"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{
                    width: '100px',
                    height: '80px',
                    transform: open ? 'translateY(-8px)' : undefined,
                }}
            >
                {/* Folder back */}
                <div
                    className="rounded-tl-0 absolute inset-0 rounded-tr-[10px] rounded-br-[10px] rounded-bl-[10px]"
                    style={{ backgroundColor: folderBackColor }}
                >
                    <span
                        className="absolute bottom-[98%] left-0 z-0 h-[10px] w-[30px] rounded-tl-[5px] rounded-tr-[5px]"
                        style={{ backgroundColor: folderBackColor }}
                    ></span>

                    {/* Papers */}
                    {Array.from({ length: maxItems }).map((_, i) => (
                        <div
                            key={i}
                            className={`absolute bottom-[10%] left-1/2 z-20 transition-all duration-300 ease-in-out ${
                                ['h-[80%] w-[70%]', 'h-[80%] w-[80%]', 'h-[80%] w-[90%]'][i]
                            }`}
                            style={getPaperStyle(i)}
                        />
                    ))}

                    {/* Folder front */}
                    <div
                        className="absolute inset-0 z-30 origin-bottom transition-all duration-300 ease-in-out"
                        style={{
                            backgroundColor: color,
                            borderRadius: '5px 10px 10px 10px',
                            transform: open ? 'skew(15deg) scaleY(0.6)' : undefined,
                        }}
                    />
                    <div
                        className="absolute inset-0 z-30 origin-bottom transition-all duration-300 ease-in-out"
                        style={{
                            backgroundColor: color,
                            borderRadius: '5px 10px 10px 10px',
                            transform: open ? 'skew(-15deg) scaleY(0.6)' : undefined,
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Folder;
