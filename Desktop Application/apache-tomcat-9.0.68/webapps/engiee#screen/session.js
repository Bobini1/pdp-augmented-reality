var peerConnection;

/*
 * Prepare websocket for signaling server endpoint.
 */
var signalingWebsocket = new WebSocket("wss://" + window.location.host +
    "/engiee/screen/server");

var clicksWebsocket = new WebSocket("wss://" + window.location.host +
    "/engiee/screen/clicks");

signalingWebsocket.onmessage = function(msg) {
    var signal = JSON.parse(msg.data);
    switch (signal.type) {
        case "offer":
            handleOffer(signal);
            break;
        case "answer":
            handleAnswer(signal);
            break;
        // In local network, ICE candidates might not be generated.
        case "candidate":
            handleCandidate(signal);
            break;
        default:
            break;
    }
};

signalingWebsocket.onopen = init()

function init() {
    console.log("Connected to server endpoint. Now initializing...");
    preparePeerConnection();
    displayLocalStreamAndSignal(true);
}

function sendSignal(signal) {
    if (signalingWebsocket.readyState === 1) {
        signalingWebsocket.send(JSON.stringify(signal));
    }
}

/*
 * Prepare RTCPeerConnection & setup event handlers.
 */
function preparePeerConnection() {
    // Using free public google STUN server.
    const configuration = {
        iceServers: [{
            urls: 'stun:stun.l.google.com:19302'
        }]
    };

    // Prepare peer connection object
    peerConnection = new RTCPeerConnection(configuration);
    peerConnection.onnegotiationneeded = async () => {
        sendOfferSignal();
    };
    peerConnection.onicecandidate = function(event) {
        if (event.candidate) {
            sendSignal(event);
        }
    };

    /*
	 * Track other participant's remote stream & display in UI when available.
	 *
	 * This is how other participant's video & audio will start showing up on my
	 * browser as soon as his local stream added to track of peer connection in
	 * his UI.
	 */
    peerConnection.addEventListener('track', displayRemoteStream);
}

/*
 * Display my local webcam & audio on UI.
 */
async function displayLocalStreamAndSignal(firstTime) {
    let localStream;
    try {
        // Capture local video & audio stream & set to local <video> DOM
        // element
        const stream = await navigator.mediaDevices.getDisplayMedia({
            audio: true,
            video: true
        });
        localStream = stream;
        logVideoAudioTrackInfo(localStream);

        // For first time, add local stream to peer connection.
        if (firstTime) {
            setTimeout(
                function() {
                    addLocalStreamToPeerConnection(localStream);
                }, 2000);
        }

        // Send offer signal to signaling server endpoint.
        sendOfferSignal();

    } catch (e) {
        console.warn(`getUserMedia() error: ${e.name}`);
        throw e;
    }
    console.log('Start completed.');
}

/*
 * Add local webcam & audio stream to peer connection so that other
 * participant's UI will be notified using 'track' event.
 *
 * This is how my video & audio is sent to other participant's UI.
 */
async function addLocalStreamToPeerConnection(localStream) {
    localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));
}

/*
 * Display remote webcam & audio in UI.
 */
function displayRemoteStream(e) {
    const video = document.getElementById('video');
    if (video.srcObject !== e.streams[0]) {
        video.srcObject = e.streams[0];
    }
}

/*
 * Send offer to signaling server. This is kind of telling server that my webcam &
 * audio is ready, so notify other participant of my information so that he can
 * view & hear me using 'track' event.
 */
function sendOfferSignal() {
    peerConnection.createOffer(function(offer) {
        sendSignal(offer);
        peerConnection.setLocalDescription(offer);
    }, function(error) {
        console.warn("Error creating an offer");
    });
}

/*
 * Handle the offer sent by other participant & send back answer to complete the
 * handshake.
 */
function handleOffer(offer) {
    peerConnection
        .setRemoteDescription(new RTCSessionDescription(offer));

    // create and send an answer to an offer
    peerConnection.createAnswer(function(answer) {
        peerConnection.setLocalDescription(answer);
        sendSignal(answer);
    }, function(error) {
        console.warn("Error creating an answer");
    });
}

/*
 * Finish the handshake by receiving the answer. Now Peer-to-peer connection is
 * established between my browser & other participant's browser. Since both
 * participants are tracking each other stream, they both will be able to view &
 * hear each other.
 */
function handleAnswer(answer) {
    peerConnection.setRemoteDescription(new RTCSessionDescription(
        answer));
    console.log("Connection established successfully!");
}

/*
 * Add received ICE candidate to connection. ICE candidate has information about
 * how to connect to remote participant's browser. In local LAN connection, ICE
 * candidate might not be generated.
 */
function handleCandidate(candidate) {
    alert("handleCandidate");
    peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
}

/*
 * Logs names of your webcam & microphone to console just for FYI.
 */
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

function logslider(position) {
    // position will be between 0 and 100
    var minp = 0;
    var maxp = 100;

    // The result should be between 100 an 10000000
    var minv = Math.log(1);
    var maxv = Math.log(1000);

    // calculate adjustment factor
    var scale = (maxv-minv) / (maxp-minp);

    return Math.exp(minv + scale*(position-minp));
}

function selectedShapeIdToString(){
    switch (selectedHologramNo){
        case 1:
            return "sphere";
        case 2:
            return "cross"
        case 3:
            return "exclMark";
        case 4:
            return "leftArrow";
        case 5:
            return "rightArrow";
        default:
            return "error";
    }
}

function clickHandler(event) {
    let x = event.clientX;
    let y = event.clientY;
    // normalize x and y to 0-1 of offsetWidth and offsetHeight
    x = x / event.target.offsetWidth;
    y = y / event.target.offsetHeight;
    let shapeString = selectedShapeIdToString();

    let colorInputVal = document.getElementById('colorInput').value;
	let shapeColor = Number(colorInputVal.replace('#', '0x'));

    let shapeSize = logslider(document.getElementById('sizeInput').value);
    let shapeTransparency = document.getElementById('transInput').value;

    let message = {x: x, y: y, shape: shapeString, color: shapeColor, size: shapeSize, transparency: shapeTransparency};
    console.log(`XY coordinates of user click: ${x} ${y}`)
    console.log(message);
    clicksWebsocket.send(JSON.stringify(message))
}

function removeLast(){
    let message = {x: 0, y: 0, shape: "removeLast", color: 0, size: 0, transparency: 0};
    clicksWebsocket.send(JSON.stringify(message))
}

function removeAll(){
    let message = {x: 0, y: 0, shape: "removeAll", color: 0, size: 0, transparency: 0};
    clicksWebsocket.send(JSON.stringify(message))
}



var xmlns = "http://www.w3.org/2000/svg",
    select = function(s) {
        return document.querySelector(s);
    },
    selectAll = function(s) {
        return document.querySelectorAll(s);
    },
    container = select('.container'),
    dragger = select('#dragger'),
    dragVal,
    maxDrag = 300


TweenMax.set('svg', {
    visibility: 'visible'
})

TweenMax.set('#upText', {
    alpha: 0,
    transformOrigin: '50% 50%'
})

TweenLite.defaultEase = Elastic.easeOut.config(0.4, 0.1);

var tl = new TimelineMax({
    paused: true
});
tl.addLabel("blobUp")
    .to('#display', 1, {
        attr: {
            cy: '-=40',
            r: 30
        }
    })
    .to('#dragger', 1, {
        attr: {
            //cy:'-=2',
            r: 8
        }
    }, '-=1')
    .set('#dragger', {
        strokeWidth: 4
    }, '-=1')
    .to('.downText', 1, {
        //alpha:0,
        alpha: 0,
        transformOrigin: '50% 50%'
    }, '-=1')
    .to('.upText', 1, {
        //alpha:1,
        alpha: 1,
        transformOrigin: '50% 50%'
    }, '-=1')
    .addPause()
    .addLabel("blobDown")
    .to('#display', 1, {
        attr: {
            cy: 299.5,
            r: 0
        },
        ease: Expo.easeOut
    })
    .to('#dragger', 1, {
        attr: {
            //cy:'-=35',
            r: 15
        }
    }, '-=1')
    .set('#dragger', {
        strokeWidth: 0
    }, '-=1')
    .to('.downText', 1, {
        alpha: 1,
        ease: Power4.easeOut
    }, '-=1')
    .to('.upText', 0.2, {
        alpha: 0,
        ease: Power4.easeOut,
        attr: {
            y: '+=45'
        }
    }, '-=1')

Draggable.create(dragger, {
    type: 'x',
    cursor: 'pointer',
    throwProps: true,
    bounds: {
        minX: 0,
        maxX: maxDrag
    },
    onPress: function() {

        tl.play('blobUp')
    },
    onRelease: function() {
        tl.play('blobDown')
    },
    onDrag: dragUpdate,
    onThrowUpdate: dragUpdate
})

function dragUpdate() {
    dragVal = Math.round((this.target._gsTransform.x / maxDrag) * 100);
    select('.downText').textContent = select('.upText').textContent = dragVal;
    TweenMax.to('#display', 1.3, {
        x: this.target._gsTransform.x

    })

    TweenMax.staggerTo(['.upText', '.downText'], 1, {
        // x:this.target._gsTransform.x,
        cycle: {
            attr: [{
                x: this.target._gsTransform.x + 146
            }]
        },
        ease: Elastic.easeOut.config(1, 0.4)
    }, '0.02')
}

TweenMax.to(dragger, 1, {
    x: 150,
    onUpdate: dragUpdate,
    ease: Power1.easeInOut
})

