import React, { useState, useEffect, useRef } from 'react';
import logo from './logo.svg';
import { RoomBuilder } from 'qcall'
import './App.css';
import Video from './Video'
const action = 'unregister'
function App() {
  const [videoStream, setVideoStream] = useState(null)
  const [localMetadata, setLocalMetadata] = useState({ name: "Augusto Alonso" })
  const [clients, setClients] = useState([])
  const roomBuilded = new RoomBuilder("1", "deploy", "apikey")
    .setMetadata({ name: "Augusto Alonso" })
    .setOnStreamDennied(() => {
      alert("Por favor otorgue los permisos necesarios")
    })
    .setOnLocalStream((localStream) => {
      let holder = localStream.clone()
      if (holder.getAudioTracks().length > 0) {
        holder.getAudioTracks().forEach(track => holder.removeTrack(track))
      }
      setVideoStream(holder)
    })
    .setOnStreamAdded((callerId, remoteStream) => {
      let clientHolder = room.clients.map(client => {
        if (client.id == callerId) {
          client.stream = remoteStream
          console.log(client)
        }
        return client
      })
      setClients(clientHolder)
    })
    .build()
  const [room, setRoom] = useState(roomBuilded)
  // This function is set if the room crowds because hot reload and  the disconnect trigger is not fired
  const cleanRoom = () => {
    room.clients.map((client) => client.id)
      .forEach(id => {
        fetch(room.api.getBaseUrl(), {
          method: "POST",
          headers: {
            'X-API-Key': room.api.XAPIKEY,
            "Content-Type": "application/json;"
          },
          body: JSON.stringify({
            action: action,
            room_id: this.room.id,
            peer_id: id,
            metadata: this.room.metadata
          }),
          keepalive: true,
        })
      })
  }
  useEffect(() => {
    //First parameter of room connect is on successfull connection callback
    room.connect((id) => {
      // This function is set if the room crowds because hot reload and  the disconnect trigger is not fired
      // cleanRoom()

      //Handles the automatic unregister of a client in the room this is necessary beacuse react uses
      // sets the before unload only in the component will mount and component will unmount

      let onUnload = () => { room.close() }
      window.addEventListener("beforeunload", onUnload);
      return () => window.removeEventListener("beforeunload", onUnload);
      // room.close()
    })
  }, [])
  return (
    <div className="row p-4">
      <div className="col-3">
        <div className="card w-100 text-center">
          <h2 className="card-header card-title">{localMetadata.name}</h2>
          <Video
            className="w-100 video"
            height={250}
            autoPlay
            controls
            srcObject={videoStream}
          >
          </Video>
        </div>
      </div>
      {
        clients.map(client => (<div key={client.id} className="col-3">
          <div className="card w-100 text-center">
            <h2 className="card-header card-title">{client.metadata.name}</h2>
            <Video
              className="w-100 video"
              height={250}
              autoPlay
              controls
              srcObject={client.stream}
            >
            </Video>
          </div>
        </div>))
      }

    </div >
  );
}

export default App;
