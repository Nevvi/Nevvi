import React from "react";
import "bootstrap/dist/css/bootstrap.css";

export default class Logo extends React.Component {
    render() {
        return (
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
                    margin: '0 auto 16px',
                    color: 'white',
                    fontSize: '24px'
                }}
            />
        );
    }
}