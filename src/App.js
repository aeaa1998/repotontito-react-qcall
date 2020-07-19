import React, { useState, useEffect } from 'react';

import './App.css';
import connectToRoom from 'qcall-react'
const action = 'unregister'

const App = ({ roomEnhancer, clients, localStream, localVideoStream, ...props }) => {
  // This function is set if the room crowds because hot reload and  the disconnect trigger is not fired

  const [room, setRoom] = useState(
    roomEnhancer((roomBuilder) =>
      (
        roomBuilder.setMetadata({ name: "Augusto Alonso" })
          .setOnStreamDennied(() => {
            alert("Por favor otorgue los permisos necesarios")
          })
        // .setWithAudio(false)
      )
    ).build()
  )
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
            room_id: room.id,
            peer_id: id,
            metadata: room.metadata
          }),
          keepalive: true,
        })
      })
  }
  let connect = () => {

    // First parameter of room connect is on successfull connection callback
    room.connect((id) => {
      // This function is set if the room crowds because hot reload and  the disconnect trigger is not fired
      // cleanRoom()

      //Handles the automatic unregister of a client in the room this is necessary beacuse react uses
      // sets the before unload only in the component will mount and component will unmount

      // let onUnload = () => { room.close() }
      // window.addEventListener("beforeunload", onUnload);
      // return () => window.removeEventListener("beforeunload", onUnload);
      // room.close()
    })
  }
  return (
    <div className="row p-4">
      <div className="col-md-3 col-12">
        <div className="card w-100 text-center">
          {props.pepe}
          <h2 className="card-header card-title">{room.metadata.name}</h2>
          <button onClick={() => {
            connect()
          }}>Conectar</button>
          <button onClick={() => {
            room.toggleMute()
          }}>mic toggle</button>
          <button onClick={() => {
            room.toggleCamera()
          }}>camera toggle</button>
          {/* <Video
            className="w-100 video"
            height={250}
            autoPlay
            controls
            srcObject={localVideoStream}
          >
          </Video> */}
        </div>
      </div>
      {
        clients.map(client => (<div key={client.id} className="col-md-3 col-12">
          <div className="card w-100 text-center">
            <h2 className="card-header card-title">{client.metadata.name}</h2>
            {/* <Video
              className="w-100 video"
              height={250}
              autoPlay
              controls
              srcObject={client.stream}
            >
            </Video> */}
          </div>
        </div>))
      }

    </div >
  );
}

export default App;
