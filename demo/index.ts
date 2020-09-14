import { Lame } from "../src/lame";
import { Buffer } from "buffer/";

const downloadBlob = async (blob: Blob) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "my-sound.mp3";
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Revoke the url to free up memory
  URL.revokeObjectURL(url);
};

(async () => {
  const sampleRate = 44100;
  const secs = 10;
  const samples = new Float32Array(sampleRate * secs);
  for (let i = 0; i < samples.length; i++) {
    samples[i] = Math.random() * 2 - 1;
  }
  const encoder = await Lame.load();
  const buffers: Buffer[] = [];
  for (const chunk of encoder.encode(samples, samples)) {
    buffers.push(Buffer.from(chunk));
  }
  const fullBuffer = Buffer.concat(buffers);
  downloadBlob(new Blob([fullBuffer.buffer], { type: "audio/mp3" }));
})();
