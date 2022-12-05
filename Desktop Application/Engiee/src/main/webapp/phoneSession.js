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

const SAMPLES = 1024;
const SAMPLING = 0.005;
const MIN_CIRCLE = 256;
const MAX_CIRCLE = 512;
const AVG_CIRCLE = (MIN_CIRCLE + MAX_CIRCLE)/2

var fft;
var particles = []

async function displayLocalPhone() {
    //const phoneVideo = document.getElementById("video");
    const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
    });
    //phoneVideo.srcObject = stream;
    logVideoAudioTrackInfo(stream);
	const audioCtx = getAudioContext()
	const source = audioCtx.createMediaStreamSource(stream);
	fft.setInput(source);
}

function setup() {
  createCanvas(1024, 1024);

  fft = new p5.FFT(0.8, SAMPLES);
  displayLocalPhone()
}

function draw() {
  background(0);
  stroke(255);
  strokeWeight(3)
  noFill();
  
  translate(width / 2, height / 2);
  
  fft.analyze()
  amp = fft.getEnergy(20, 200);
  
  var wave = fft.waveform();

  
  let shape = [];
  for (i = 0; i <= PI; i += SAMPLING) {
	  let index = floor(map(i, 0, PI, 0, wave.length - 1))
	  
	  let r = map(wave[index], -1, 1, MIN_CIRCLE, MAX_CIRCLE)
	  
	  let x = r * sin(i)
	  let y = r * cos(i)
	  append(shape, [x, y])
  }
  beginShape();
  for (i = 0; i < shape.length; i++)
	  vertex(shape[i][0], shape[i][1]);
  endShape();
  beginShape();
  for (i = 0; i < shape.length; i++)
	  vertex(-shape[i][0], shape[i][1]);
  endShape();
  
  particles.push(new Particle())
  
  for(var i = particles.length - 1 ; i >=0 ; i--){
	  if(!particles[i].edges()){
		particles[i].update(amp > 100);
		particles[i].show();
	  }else
		  particles.splice(i, 1)
	  
  }
}

function mousePressed(){
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
  }else
	  getAudioContext().suspend();
}

class Particle{
	constructor(){
		this.pos = p5.Vector.random2D().mult(AVG_CIRCLE);
		this.vel = createVector(0, 0);
		this.acc = this.pos.copy().mult(random(0.0001, 0.00001));
		
		this.w = random(3, 5)
		
		this.color = [random(200, 255), random(200, 255), random(200, 255)]
	}
	
	update(cond){
		this.vel.add(this.acc);
		this.pos.add(this.vel);
		if(cond){
			this.pos.add(this.vel);
			this.pos.add(this.vel);
			this.pos.add(this.vel);
		}
	}
	
	edges(){
		if(this.pos.x < -width / 2 || this.pos.x > width / 2 ||
		this.pos.y < -height /2 || this.pos.y > height / 2) {
			return true;
		}else
			return false;
	}
	
	show(){
		noStroke();
		fill(this.color);
		ellipse(this.pos.x, this.pos.y, this.w);
	}
}
