import path from "path";
import { promises as fs } from "fs";
import { Lame } from "../src/lame";

const TEST_DATA_DIR = path.join(__dirname, "../test/fixtures");
const LEFT_FNAME = path.join(TEST_DATA_DIR, "input-mono.pcm");
const RIGHT_FNAME = path.join(TEST_DATA_DIR, "input-mono.pcm");
const OUT_FILE = path.join(TEST_DATA_DIR, "sample-out-js.mp3");

async function main() {
  console.time("main");
  console.time("Lame.load()");

  const lame = await Lame.load({
    vbrQuality: 3,
    debug: true
  });
  console.timeEnd("Lame.load()");

  console.time("read data");
  const pcmLeftBuf = await fs.readFile(LEFT_FNAME);
  const pcmRightBuf = await fs.readFile(RIGHT_FNAME);
  console.timeEnd("read data");
  console.time("create input array");
  const pcmLeft = new Float32Array(pcmLeftBuf.buffer);
  const pcmRight = new Float32Array(pcmRightBuf.buffer);
  console.timeEnd("create input array");
  try {
    await fs.unlink(OUT_FILE);
  } catch (err) {
    if (err.code !== "ENOENT") {
      throw err;
    }
  }
  const outputFile = await fs.open(OUT_FILE, "w");

  let writeElapsed = 0;
  for (const buf of lame.encode(pcmLeft, pcmRight)) {
    const started = Date.now();
    await outputFile.write(buf);
    writeElapsed += Date.now() - started;
  }

  console.log("write file", { writeElapsed });

  await outputFile.close();

  console.timeEnd("main");
}

main()
  .then(() => {
    console.log("done, bye");
    process.exit(0);
  })
  .catch(err => {
    console.error("fatal error", err);
    process.exit(1);
  });
