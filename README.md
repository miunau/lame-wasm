

```ts
for (const buf of lame.encode(pcmLeft, pcmRight)) {
    const started = Date.now();
    await outputFile.write(buf);
    writeElapsed += Date.now() - started;
}
```