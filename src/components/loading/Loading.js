import React from "react";
import FadeIn from "react-fade-in";
import Lottie from "lottie-react";
import "bootstrap/dist/css/bootstrap.css";

import animation from "./animation.json";
import done from "./done.json";

const loadingOptions = {
    loop: true,
    autoplay: true,
    animationData: animation,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
    }
}

const doneOptions = {
    loop: false,
    autoplay: true,
    animationData: done,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
    }
};

export default class Loading extends React.Component {
    render() {
        if (!this.props.loading && !this.props.done && this.props.component) return this.props.component

        return (
            <div>
                <FadeIn>
                    <div className="d-flex justify-content-center align-items-center">
                        {this.props.done ?
                            <Lottie {...doneOptions}/> :
                            <Lottie {...loadingOptions}/>
                        }
                    </div>
                </FadeIn>
            </div>
        );
    }
}