@amilajack/lame-wasm
====================

Works in node and in the browser

## Setup

```bash
npm install @amilajack/lame-wasm
```

## Usage

```ts
import lame from '@amilajack/lame-wasm';
import Buffer from 'buffer';

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
```
