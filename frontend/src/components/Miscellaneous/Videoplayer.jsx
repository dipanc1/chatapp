import React from 'react'

const Videoplayer = ({ peerstream, width, admin }) => {
  const videoRef = React.useRef(null);

  React.useEffect(() => {

    if (videoRef.current && peerstream) videoRef.current.srcObject = peerstream;

  }, [peerstream])


  return (
    <video width={width} height={'62vh'} ref={videoRef} autoPlay playsInline muted={admin} />
  )
}

export default Videoplayer