export default class ReactRoomListener {
    constructor(setState) {
        this.setState = setState
    }

    onLocalStream(stream) {
        let holder = stream.clone()
        if (holder.getAudioTracks().length > 0) {
            holder.getAudioTracks().forEach(track => holder.removeTrack(track))
        }
        let holderAudio = stream.clone()
        if (holderAudio.getVideoTracks().length > 0) {
            holderAudio.getVideoTracks().forEach(track => holderAudio.removeTrack(track))
        }

        this.setState((state, props) => ({
            ...state,
            localVideoStream: holder,
            localAudioStream: holderAudio,
            localStream: stream
        }))
    }

    onStreamAdded(client, remoteStream) {
        this.setState((state, props) => ({
            ...state,
            clients: [...state.clients, client]
        }))
    }
    onStreamRemoved(clientId) {
        this.setState((state, props) => ({
            ...state,
            clients: state.clients.filter(currentClient => {
                return currentClient !== clientId
            })
        }))
    }
}