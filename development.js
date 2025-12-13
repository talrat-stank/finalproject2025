const ctx = new AudioContext();
const gain = new GainNode(ctx);
let audiobuffer = null;
gain.connect(ctx.destination);

let barDisp = document.querySelector("#bar");
let beatDisp = document.querySelector("#beat");
let sixteenthDisp = document.querySelector("#sixteenth");
let countDisp = document.querySelector("#count");

let counter = 0;
let bar = 1;
let beat = 1;
let sixteenth = 1;

var bpm = 92;

const bpm2ms = function () {
  return 60000 / bpm;
};

// const updateTransport = function () {
//   // saying if you /16, what is the remainder, creates 16th note
//   sixteenth = (counter % 16) + 1;
//   beat = Math.floor((counter % 16) / 4) + 1;
//   bar = Math.floor(counter / 16) + 1;

//   barDisp.innerText = bar.toString();
//   beatDisp.innerText = beat.toString();
//   sixteenthDisp.innerText = sixteenth.toString();
//   countDisp.innerText = counter.toString();

//   counter++;
// };

let buttons = document.querySelectorAll("button");
// let onOff = buttons[0];
// let audioOn = false;

// Check if the context is already running and set the button text accordingly.
if (ctx.state === "running") {
  audioOn = true;
  onOff.innerText = "Off";
}
//-----------------------------------------first channel=====================================//
// load and decode audio
const loadAndDecode = async function (event) {
  let file = event.target.files[0];
  let arraybuf = await file.arrayBuffer();
  audiobuffer = await ctx.decodeAudioData(arraybuf);
  console.log(audiobuffer);
};

const printHello = function () {};

//-----------------------------------------PLAY, REVERSE, & STOP BUTTONS----------------------------//
// play back audio
const playBuffer = function () {
  if (audiobuffer) {
    console.log("nope");
    let sourceNode = new AudioBufferSourceNode(ctx, { buffer: audiobuffer });
    sourceNode.onended = () => {
      sourceNode.disconnect();
      sourceNode = null;
    };
    sourceNode.connect(gain);
    sourceNode.start();
  } else {
    alert("please please upload da file");
  }
};

// reverse audio
const revAudioBuffer = function () {
  for (let ch = 0; ch < audiobuffer.numberOfChannels; ch++) {
    let revData = audiobuffer.getChannelData(ch);
    revData = revData.reverse();
    audiobuffer.copyToChannel(revData, ch);
    sourceNode.stop();
  }
};

//stop audio
const stopAudio = function () {
  const now = this.ctx.currentTime;

  // === Amplitude R ===
  // Likely intent: ramp to 0 over 'release' seconds, then stop the osc.
  this.gain.linearRampToValueAtTime(0.0, now + this.release);

  // Stop oscillator right when the envelope hits 0.
  this.osc.stop(now + this.release);
};

//----------------------------------------file upload------------------------------------
let looper = null;

//file upload
document.querySelector("#fileUpload").addEventListener("change", loadAndDecode);

//-----------------------------------------adds toggle boxes---------------------------------
let toggleRow = document.querySelector("#toggleRow");

for (let i = 0; i < 16; i++) {
  toggleRow.innerHTML += '<input class="rowOne" type="checkBox" />';
}

let togs = document.querySelectorAll(".rowOne");
console.log(togs);

let setIntervalHolder;

let toggleCounter = 0;

//-----------------------------------------First toggle box input----------------------------
const toggleLoop = function () {
  if (togs[toggleCounter].checked) {
    if (looper) {
      ctx = true();
    }
    playBuffer();
  }
};

//-----------------------------------------EVENT LISTENERS----------------------------------
//play
document.querySelector("#play").addEventListener("click", () => {
  ctx.resume();
  setIntervalHolder = setInterval(() => {
    toggleCounter = toggleCounter % 16;
    if (togs[toggleCounter].checked) {
      playBuffer();
    }
    toggleCounter++;
  }, setInterval(toggleCounter, bpm));
  //(toggleCounter, bpm2ms() / 4));
});

//reverse
document.querySelector("#reverse").addEventListener("click", revAudioBuffer);

//stop
document.querySelector("#stop").addEventListener("click", () => {
  // ctx.stop();
  clearInterval(setIntervalHolder); // stop the loop
});
