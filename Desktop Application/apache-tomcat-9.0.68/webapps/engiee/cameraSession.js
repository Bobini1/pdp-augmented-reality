function logVideoAudioTrackInfo(localStream) {
    const videoTracks = localStream.getVideoTracks();
    const audioTracks = localStream.getAudioTracks();
    if (videoTracks.length > 0) {
        console.log(`Using video device: ${videoTracks[0].label}`);
    }
    if (audioTracks.length > 0) {
        console.log(`Using audio device: ${audioTracks[0].label}`);
    }
}

async function displayLocalCamera() {
    const cameraVideo = document.getElementById("video");
    const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: true
            });
    cameraVideo.srcObject = stream;
    logVideoAudioTrackInfo(stream);
}

displayLocalCamera();