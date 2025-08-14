// Device detection utilities
const isIOSDevice = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
};

export const AppStoreButton = ({
                                   url,
                                   theme = 'light',
                                   width = 200,
                                   height = 60,
                                   style = {}
                               }) => {
    // Only render on iOS mobile devices
    if (!isIOSDevice() && window.location.hostname !== "localhost") {
        return null;
    }

    const isDark = theme === 'dark';

    const buttonStyle = {
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: isDark ? '#000' : '#000',
        borderRadius: '8px',
        textDecoration: 'none',
        color: '#fff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSize: '14px',
        fontWeight: '500',
        display: 'inline-block',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8px 16px',
        border: 'none',
        cursor: 'pointer',
        transition: 'opacity 0.2s ease',
        ...style
    };

    const handleClick = () => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="hide-on-desktop">
            <button
                style={buttonStyle}
                onClick={handleClick}
                onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                onMouseLeave={(e) => e.target.style.opacity = '1'}
            >
                <div style={{display: 'inline-flex', alignItems: 'center', gap: '8px'}}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                        <path
                            d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    <div style={{display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start'}}>
                        <div style={{fontSize: '10px', lineHeight: '1.2'}}>Download on the</div>
                        <div style={{fontSize: '16px', fontWeight: 'bold', lineHeight: '1.2'}}>App Store</div>
                    </div>
                </div>
            </button>
        </div>
    );
};