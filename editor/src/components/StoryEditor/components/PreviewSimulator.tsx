import React, { useState, useEffect } from 'react';

interface PreviewSimulatorProps {
    open: boolean;
    onClose: () => void;
    initialPos?: { x: number; y: number };
}

const WIDTH = 375;
const HEIGHT = 667;
const BORDER = 12;

const PreviewSimulator: React.FC<PreviewSimulatorProps> = ({ open, onClose, initialPos }) => {
    const [pos, setPos] = useState(initialPos || { x: window.innerWidth / 2 - 200, y: window.innerHeight / 2 - 350 });
    const [dragging, setDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (initialPos) setPos(initialPos);
    }, [initialPos]);

    const handleDragBtnMouseDown = (e: React.MouseEvent) => {
        setDragging(true);
        setDragOffset({
            x: e.clientX - pos.x,
            y: e.clientY - pos.y
        });
        e.preventDefault();
    };

    useEffect(() => {
        if (!dragging) return;
        const handleMouseMove = (e: MouseEvent) => {
            setPos({
                x: e.clientX - dragOffset.x,
                y: e.clientY - dragOffset.y
            });
        };
        const handleMouseUp = () => setDragging(false);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [dragging, dragOffset]);

    if (!open) return null;

    return (
        <>
            {/* 悬浮窗本体 */}
            <div
                style={{
                    position: 'fixed',
                    left: pos.x,
                    top: pos.y,
                    zIndex: 9999,
                    userSelect: 'none',
                }}
            >
                <div
                    style={{
                        width: WIDTH,
                        height: HEIGHT,
                        border: `${BORDER}px solid #222`,
                        borderRadius: 32,
                        boxShadow: '0 8px 32px #0005',
                        background: '#111',
                        overflow: 'hidden',
                        position: 'relative',
                    }}
                >
                    <iframe
                        src={window.location.origin + '/preview/index.html'}
                        style={{ width: '100%', height: '100%', border: 'none', background: 'transparent' }}
                        title="手机预览"
                    />
                </div>
            </div>
            {/* 关闭按钮，放在模拟器右上角外侧 */}
            <button
                onClick={onClose}
                style={{
                    position: 'fixed',
                    left: pos.x + WIDTH + 5,
                    top: pos.y + 5,
                    zIndex: 10000,
                    background: 'rgba(60,60,60,0.9)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '10%',
                    width: 32,
                    height: 32,
                    fontSize: 20,
                    cursor: 'pointer',
                    lineHeight: '32px',
                    textAlign: 'center',
                    boxShadow: '0 2px 8px #0003',
                    padding: 0
                }}
                title="关闭"
            >×</button>
            {/* 拖动按钮，放在关闭按钮下方 */}
            <div
                onMouseDown={handleDragBtnMouseDown}
                style={{
                    position: 'fixed',
                    left: pos.x + WIDTH + 5,
                    top: pos.y + 45,
                    zIndex: 10000,
                    width: 32,
                    height: 32,
                    background: 'rgba(60,60,60,0.7)',
                    borderRadius: '10%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: dragging ? 'grabbing' : 'grab',
                    boxShadow: '0 2px 8px #0002',
                }}
                title="拖动"
            >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="3" y="8" width="12" height="2" rx="1" fill="#fff" /></svg>
            </div>
        </>
    );
};

export default PreviewSimulator; 