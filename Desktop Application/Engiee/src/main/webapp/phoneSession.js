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

async function displayLocalPhone() {
    const phoneVideo = document.getElementById("video");
    const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
    });
    phoneVideo.srcObject = stream;
    logVideoAudioTrackInfo(stream);
}

displayLocalPhone();

