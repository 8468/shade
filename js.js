/*
function Source() {
   var ac = new AudioContext();
   return {
      ac: ac,
      getBuffer: function(seconds) {
	 this.ac.createBuffer(1, this.ac.sampleRate * seconds, this.ac.sampleRate);
	 return buff.getChannelData(0);
      },
      sendBuffer: function(buff) {
	 source = ac.createBufferSource();
	 source.loop = false;
	 source.buffer = buff;
	 source.start();
      }
   }
}

function Sink() {
   
}
*/

function run() {
   ac = new AudioContext();
   //ac = new webkitAudioContext();

   // sampleRate is prob 44100Hz (very common, most normal sound cards run at this rate,
   // per https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/createBuffer)
   frameCount = ac.sampleRate * 1.0;

   // create a 1 second buffer with one channel   
   buff = ac.createBuffer(1, frameCount, ac.sampleRate);
   nowBuffering = buff.getChannelData(0);
   console.log("Buff size: " + nowBuffering.length + ", frame count: " + frameCount);

   incr = 2.0 / 255.0
   for(var i=0; i<frameCount; i++) {
      nowBuffering[i] = -1 + ((i % 255) * incr)
   }
   
   source = ac.createBufferSource();
   source.loop = false;
   source.buffer = buff;
   
   a = ac.createAnalyser();
   // The fftSize property of the AnalyserNode interface is an unsigned long value representing
   // the size of the FFT (Fast Fourier Transform) to be used to determine the frequency domain.
   // The fftSize property's value must be a non-zero power of 2 in a range from 32 to 2048;
   // its default value is 2048.
   a.fftSize = 2048;
   source.connect(a);
   a.connect(ac.destination);

   // Is an unsigned long value half that of the FFT size. This generally equates to the number
   // of data values you will have to play with for the visualization.
   var bufferLength = a.frequencyBinCount;
   var dataArray = new Uint8Array(bufferLength);
   
   // run this 60 times / second, roughly the rate of a requestAnimationFrame call
   i = setInterval(function() {
		      a.getByteTimeDomainData(dataArray);
		      console.log(dataArray);
		      s = "";
		      for(var i=0; i<dataArray.length; i++) {
			 s += dataArray[i] + ", ";
		      }
		      addText(s);
		   }, 17);
   setTimeout(function() { clearInterval(i); }, 1000);
   source.start();
}

function addText(txt){
   document.getElementById("txt").value += txt + "\n";
}