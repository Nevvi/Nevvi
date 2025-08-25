import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import {Box} from "@mui/material";
import "./Loading.css"; // We'll create this CSS file

export default class Loading extends React.Component {
    render() {
        if (!this.props.loading && this.props.component) return this.props.component

        return (
            <Box 
                display="flex" 
                justifyContent="center" 
                alignItems="center" 
                position="fixed"
                top="0"
                left="0"
                width="100vw"
                height="100vh"
                zIndex="9999"
                sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Optional: semi-transparent overlay
                }}
            >
                <div className="logo-loading-container">
                    {/* Your logo in the center */}
                    <div className="logo-center">
                        <img
                            alt={"icon"}
                            src={"https://nevvi-user-images.s3.us-east-1.amazonaws.com/icon%403x.png"}
                            style = {{
                                width: '48px',
                                height: '48px',
                                background: '#667eea',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '24px'
                            }}
                        />
                    </div>
                    
                    {/* Orbital rings and dots */}
                    <div className="orbit-ring orbit-ring-1">
                        <div className="orbit-dot orbit-dot-1"></div>
                    </div>
                    <div className="orbit-ring orbit-ring-2">
                        <div className="orbit-dot orbit-dot-2"></div>
                        <div className="orbit-dot orbit-dot-3"></div>
                    </div>
                    <div className="orbit-ring orbit-ring-3">
                        <div className="orbit-dot orbit-dot-4"></div>
                        <div className="orbit-dot orbit-dot-5"></div>
                        <div className="orbit-dot orbit-dot-6"></div>
                    </div>
                </div>
            </Box>
        );
    }
}