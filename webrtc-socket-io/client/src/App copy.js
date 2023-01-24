import "./App.css";
import { useEffect, useRef, useState } from "react";
import { Peer } from "peerjs";

function App() {
  const [myId, setMyId] = useState("");
  const [remoteId, setRemoteId] = useState("");

  const peerRef = useRef(null);
  const ourVideoRef = useRef(null);
  const theirVideoRef = useRef(null);

  useEffect(() => {
    const peer = new Peer();

    peer.on("open", (id) => {
      // console.warn("My peer ID is: " + id);
      setMyId(id);
    });

    peer.on('call', function (call) {
      var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

      getUserMedia({ video: true, audio: true }, function (stream) {
        // ourVideoRef.current.srcObject = stream;
        // ourVideoRef.current.play();

        call.answer(stream); // Answer the call with an A/V stream.
        call.on('stream', function (remoteStream) {
          // Show stream in some video/canvas element.
          theirVideoRef.current.srcObject = remoteStream;
          theirVideoRef.current.play();
        });
      }, function (err) {
        console.log('Failed to get local stream', err);
      });
    });

    peerRef.current = peer;
  }, []);

  var call = () => {

    var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    getUserMedia({ video: true, audio: true }, function (stream) {

      ourVideoRef.current.srcObject = stream;
      ourVideoRef.current.play();

      var call = peerRef.current.call(remoteId, stream);

      call.on('stream', function (remoteStream) {
        // Show stream in some video/canvas element.
        // theirVideoRef.current.srcObject = remoteStream;
        // theirVideoRef.current.play();
      });
    }, function (err) {
      console.log('Failed to get local stream', err);
    });
  };


  return (
    <div className="App">
      <h1>My ID: {myId}</h1>
      <input placeholder="enter remote id to call" type="text" onChange={(e) => setRemoteId(e.target.value)} />
      <button style={{ height: "20px" }} onClick={() => call()}>call</button>
      <div>
        <h1>Our Video</h1>
        <video width={'200px'} ref={ourVideoRef} />
      </div>
      <div>
        <h1>Their Video</h1>
        <video ref={theirVideoRef} />
      </div>
    </div>
  );
}

export default App;
