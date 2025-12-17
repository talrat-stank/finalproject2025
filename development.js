const ctx = new AudioContext();
const gain = new GainNode(ctx);

// const gainOne = new GainNode(ctx);
// const gainTwo = new GainNode(ctx);
// const gainThree = new GainNode(ctx);

let audiobuffer = null;
let audiobufferTwo = null;
let audiobufferThree = null;

// gainOne.connect(ctx.destination);
// gainTwo.connect(ctx.destination);
// gainThree.connect(ctx.destination);

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
let onOff = buttons[0];
let audioOn = false;

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

//-----------------------------------------second channel=====================================//
// load and decode audio
// const loadAndDecodeTwo = async function (event) {
//   let fileTwo = event.target.files[0];
//   let arraybufTwo = await fileTwo.arrayBufferTwo();
//   audiobufferTwo = await ctx.decodeAudioData(arraybufTwo);
//   console.log(audiobufferTwo);
// };

// //-----------------------------------------third channel=====================================//
// // load and decode audio
// const loadAndDecodeThree = async function (event) {
//   let fileThree = event.target.files[0];
//   let arraybufThree = await fileThree.arrayBufferThree();
//   audiobufferThree = await ctx.decodeAudioData(arraybufThree);
//   console.log(audiobufferThree);
// };

//-----------------------------------------PLAY, REVERSE, & STOP BUTTONS----------------------------//
// play back audio
const playBuffer = function () {
  if (audiobuffer) {
    console.log("nope");
    let sourceNode = new AudioBufferSourceNode(
      ctx,
      { buffer: audiobuffer }
      // { bufferTwo: audiobufferTwo },
      // { bufferThree: audiobufferThree }
    );
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
  }
};

//stop audio
const stopAudio = function () {
  const now = this.ctx.currentTime;

  // === Amplitude R ===
  // Likely intent: ramp to 0 over 'release' seconds, then stop the osc.
  this.gain.linearRampToValueAtTime(0.0, now + this.release);

  // Stop oscillator right when the envelope hits 0.
  // audiobuffer.stop(now + this.release);
};

//----------------------------------------file upload------------------------------------
let looper = null;

//file upload
document.querySelector("#fileUpload").addEventListener("change", loadAndDecode);
// document
//   .querySelector("#fileUploadTwo")
//   .addEventListener("changeTwo", loadAndDecodeTwo);
// // document
//   .querySelector("#fileUploadThree")
//   .addEventListener("changeThree", loadAndDecodeThree);
//-----------------------------------------adds toggle boxes---------------------------------
let toggleRow = document.querySelector("#toggleRow");
// let toggleRowTwo = document.querySelector("#toggleRowTwo");
// let toggleRowThree = document.querySelector("#toggleRowThree");

for (let i = 0; i < 16; i++) {
  toggleRow.innerHTML += '<input class="rowOne" type="checkBox" />';
  //toggleRowTwo.innerHTML += '<input class="rowTwo" type="checkBox" />';
  //toggleRowThree.innerHTML += '<input class="rowThree" type="checkBox" />';
}

// for (let o = 0; o < 16; o++) {
//   toggleRowTwo.innerHTML += '<input class="rowTwo" type="checkBox" />';
// }

// for (let u = 0; u < 16; u++) {
//   toggleRowThree.innerHTML += '<input class="rowThree" type="checkBox" />';
// }

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
  }, bpm2ms(bpm / 4));
});

//reverse
document.querySelector("#reverse").addEventListener("click", revAudioBuffer);

//stop
document.querySelector("#stop").addEventListener("click", () => {
  ctx = false();
  clearInterval(setIntervalHolder); // stop the loop
  // this.sourceNode.stopAudio();
});

document.querySelector("#reset").addEventListener("click", () => {});
