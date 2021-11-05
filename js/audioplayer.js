const audio = document.createElement("AUDIO");
const knob = document.getElementById("knob1");
const knob2 = document.getElementById("knob2");
const progressbar = document.getElementById("progressbar");
const volumebar = document.getElementById("volume-bar");
const knobRect = knob.getBoundingClientRect();
const knob2Rect = knob2.getBoundingClientRect();
const conRect = progressbar.getBoundingClientRect();
const volRect = volumebar.getBoundingClientRect();
const range = document.getElementById("range");
const rangeRect = range.getBoundingClientRect();
const range2 = document.getElementById("range2");
const rangeRect2 = range2.getBoundingClientRect();

audio.setAttribute("id", "audio");
audio.src = "http://www.hscripts.com/tutorials/html/music.wav";
audio.controls = true;
audio.onloadedmetadata = function () {
  document.getElementById("duration").style.color = "#bdbdbd";
  document.getElementById("start-time").style.color = "white";

  // Convert duration into HH:MM:SS
  duration(audio.duration);
};

// New Timeline
tl = new TimelineLite({ paused: true });

// create object to tween
tl.to(".red", 1, { x: 739 }, "time").to(".blue", 11.29, { x: 739 }, "time");

// assign functions to these properties
audio.onplay = function () {
  TweenLite.ticker.addEventListener("tick", Update);
};
audio.onpause = function () {
  TweenLite.ticker.removeEventListener("tick", Update);
};

// Play pause button
$("#pButton").click(function () {
  // Toggle audio play
  audio[audio.paused ? "play" : "pause"]();

  // we need to define the icon - font awesome 5 is all about svgs!
  let icon = $("button svg.playbutton");
  let icon_fa_icon = icon.attr("data-icon");

  // if already paused on click change icon to 'play' otherwise use 'pause' icon
  if (icon_fa_icon === "pause") {
    icon.attr("data-icon", "play");
  } else {
    icon.attr("data-icon", "pause");
  }
});

// Mute sound
$("#mButton").click(function () {
  // we need to define the icon - font awesome 5 is all about svgs!
  let icon = $("button svg.soundbutton");
  let icon_fa_icon = icon.attr("data-icon");

  // Toggle icon's and audio
  if (icon_fa_icon == "volume-up") {
    icon.attr("data-icon", "volume-off");
    audio.volume = 0;
  }

  if (icon_fa_icon == "volume-down") {
    icon.attr("data-icon", "volume-off");
    audio.volume = 0;
  }

  if (icon_fa_icon == "volume-off") {
    icon.attr("data-icon", "volume-up");
    audio.volume = 1;
  }
});

// Create Audio scrub with draggable

Draggable.create(".knob", {
  type: "x",
  trigger: "#progressbar",
  bounds: "#progressbar",
  edgeResistance: 1,
  lockAxis: true,
  cursor: "pointer",
  onDrag: updateRange,
  onPress: updatePosition,
  onClick: updateRange,
});

// function converts audio.duration to SS:mm format
function duration(time) {
  var minutes = parseInt(time / 60, 10);
  var seconds = parseInt(time % 60);
  var millisecondsCal = time % 60;
  var milliseconds = ("0" + millisecondsCal).substr(4, 2);

  // append value to dom
  document.getElementById("duration").innerHTML = seconds + ":" + milliseconds;
}

// convert audio.currentTime to SS:mm format
function format() {
  var secsCal = Math.floor(audio.currentTime % 60);
  var minsCal = Math.floor(audio.currentTime / 60);
  var millsCal = audio.currentTime % 60;

  var secs = ("0" + secsCal).substr(-2);
  var mins = ("0" + minsCal).substr(-2);
  var mills = ("0" + millsCal).substr(4, 2);

  document.getElementById("start-time").innerHTML = secs + ":" + mills;
}

// set the knob + range to full volume - must be a better way of doing this??
TweenLite.set(".knob2", { x: 85 });
TweenLite.set(".range2", { width: 100 });

// create volume controller with draggable
Draggable.create(".knob2", {
  type: "x",
  trigger: "#volume-bar",
  bounds: "#volume-bar",
  edgeResistance: 1,
  lockAxis: true,
  cursor: "pointer",
  onDrag: updateSound,
});

// To syncronise both audio and timeline
function Update() {
  tl.progress(audio.currentTime / audio.duration);
  TweenMax.set(knob, { x: (conRect.width - knobRect.width) * tl.progress() });
  TweenMax.set(range, { width: conRect.width * tl.progress() });
  format();
}

// called on press to align both knob and range in accordance with timeline
function updatePosition(e) {
  TweenMax.set(knob, { x: this.pointerX - conRect.left - knobRect.width / 2 });
  TweenMax.set(range, { width: conRect.width * tl.progress() });
  // does not seem to be case sensitive!!
  this.update();
}

// repositions tl + elements when user clicks on audio scrub
function updateRange() {
  tl.progress(this.x / (conRect.width - knobRect.width));
  TweenMax.set(range, { width: conRect.width * tl.progress() });
  audio.currentTime = tl.progress() * audio.duration;
  format();
}

// controle the sound
function updateSound() {
  // need to add back the loss in which the knob takes off - beter way of doing this
  audio.volume = (this.x * 1.11111111) / 100;

  // needs re-calculating not working
  TweenMax.set(range2, { width: this.x });

  let icon = $("button svg.soundbutton");
  let icon_fa_icon = icon.attr("data-icon");

  if (this.x <= 42) {
    console.log("below");
    icon.attr("data-icon", "volume-down");
  }
  if (this.x >= 43) {
    console.log("above");
    icon.attr("data-icon", "volume-up");
  }
  if (this.x <= 3) {
    console.log("off");
    icon.attr("data-icon", "volume-off");
  }
}

// TODO
// 1. fix volume calculation to make it relevant and propotinal to element and knob parameters
// 2. fix duration timer to work with minutes and respond accordingly
// 3. have mute button revert back to icon state before pressed e.g if we mute when the volume is low, then upon un-muting we want to see the low volume icon again
// 4. Make ranges appear in sync with the knobs when dragged.

// function player() {
//   if (audioTrack.paused) {
//     setText(this, "Pause");
//     audioTrack.play();
//   } else {
//     setText(this, "Play");
//     audioTrack.pause();
//   }
// }

// function setText(el, text) {
//   el.innerHTML = text;
// }

// function finish() {
//   audioTrack.currentTime = 0;
//   setText(playButton, "Play");
// }

// function updatePlayhead() {
//   playhead.value = audioTrack.currentTime;
//   var s = parseInt(audioTrack.currentTime % 60);
//   var m = parseInt((audioTrack.currentTime / 60) % 60);
//   s = s >= 10 ? s : "0" + s;
//   m = m >= 10 ? m : "0" + m;
//   playbacktime.innerHTML = m + ":" + s;
// }

// function volumizer() {
//   if (audioTrack.volume == 0) {
//     setText(muteButton, "volume");
//   } else {
//     setText(muteButton, "volumehigh");
//   }
// }

// function muter() {
//   if (audioTrack.volume == 0) {
//     audioTrack.volume = restoreValue;
//     volumeSlider.value = restoreValue;
//   } else {
//     audioTrack.volume = 0;
//     restoreValue = volumeSlider.value;
//     volumeSlider.value = 0;
//   }
// }

// function setAttributes(el, attrs) {
//   for (var key in attrs) {
//     el.setAttribute(key, attrs[key]);
//   }
// }

// var audioPlayer = document.getElementById("audioplayer"),
//   fader = document.getElementById("fader"),
//   playback = document.getElementById("playback"),
//   audioTrack = document.getElementById("audiotrack"),
//   playbackTime = document.getElementById("playbacktime"),
//   playButton = document.createElement("button"),
//   muteButton = document.createElement("button"),
//   playhead = document.createElement("progress");
// volumeSlider = document.createElement("input");
// setText(playButton, "Play");
// setText(muteButton, "volumehigh");
// setAttributes(playButton, { type: "button", class: "ss-icon" });
// setAttributes(muteButton, { type: "button", class: "ss-icon" });
// muteButton.style.display = "block";
// muteButton.style.margin = "0 auto";
// setAttributes(volumeSlider, {
//   type: "range",
//   min: "0",
//   max: "1",
//   step: "any",
//   value: "1",
//   orient: "vertical",
//   id: "volumeSlider",
// });
// var duration = audioTrack.duration;
// setAttributes(playhead, { min: "0", max: "100", value: "0", id: "playhead" });
// // fader.appendChild(volumeSlider);
// // fader.appendChild(muteButton);
// playback.appendChild(playhead);
// playback.appendChild(playButton);
// audioTrack.removeAttribute("controls");
// playButton.addEventListener("click", player, false);
// muteButton.addEventListener("click", muter, false);
// volumeSlider.addEventListener(
//   "input",
//   function () {
//     audioTrack.volume = volumeSlider.value;
//   },
//   false
// );
// audioTrack.addEventListener("volumechange", volumizer, false);
// audioTrack.addEventListener(
//   "playing",
//   function () {
//     playhead.max = audioTrack.duration;
//   },
//   false
// );
// audioTrack.addEventListener("timeupdate", updatePlayhead, false);
// audioTrack.addEventListener("ended", finish, false);
