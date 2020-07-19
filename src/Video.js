import React, { useEffect, useRef } from 'react';

export default function Video({ srcObject, ...props }) {
    const refVideo = useRef(null)

    useEffect(() => {
        if (!refVideo.current) return
        if (srcObject) {
            console.log(srcObject.getTracks())
        }

        refVideo.current.srcObject = srcObject
    }, [srcObject])

    return <video ref={refVideo} {...props} />
}