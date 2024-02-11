import React from 'react';
import { AppContext } from '../../context/AppContext';

const Videoplayer = ({ peerstream, width, admin }) => {
    const videoRef = React.useRef(null);
    const { fullScreen, dispatch } = React.useContext(AppContext);

    React.useEffect(() => {
        if (videoRef.current && peerstream)
            videoRef.current.srcObject = peerstream;
    }, [peerstream]);

    React.useEffect(() => {
        const enterFullscreen = () => {
            if (fullScreen) {
                dispatch({ type: 'SET_FULLSCREEN' });
                videoRef.current.requestFullscreen();
            }
        };
        enterFullscreen();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fullScreen]);

    return (
        <video
            width={width}
            ref={videoRef}
            autoPlay
            playsInline
            muted={admin}
        />
    );
};

export default Videoplayer;
