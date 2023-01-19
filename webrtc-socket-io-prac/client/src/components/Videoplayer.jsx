import React from 'react'

const Videoplayer = ({ width, stream }) => {

  const videoRef = React.useRef(null);

  React.useEffect(() => {

    if (videoRef.current && stream) videoRef.current.srcObject = stream;

  }, [stream])


  return (
    <video width={width} ref={videoRef} autoPlay playsInline muted={true} />
  )
}

export default Videoplayer