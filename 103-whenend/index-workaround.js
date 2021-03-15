const { StringStream, DataStream } = require('scramjet');
const { createReadStream, createWriteStream } = require('fs');

const inputStream = createReadStream(`${__dirname}/in.txt`, { encoding: 'utf-8' });
const outputStream = createWriteStream(`${__dirname}/out.txt`, { encoding: 'utf-8' });

inputStream.on('close', () => console.log('inputStream close'));
outputStream.on('close', () => console.log('outputStream close'));

let ended = false;
const stream = StringStream.from(inputStream)
  .setOptions({ maxParallel: 1 })
  .lines()
  .filter(() => !ended)
  .map((line) => {
    console.log(`map -> ${line}`);

    if (line === '5') throw new Error("Test");

    return `${line} - ok\n`;
  })
  .catch(err => {
    ended = true;
    inputStream.pause();
    stream.unpipe(outputStream);
    outputStream.end();
    console.log(`Error: ${err}`);
  });

stream
  .pipe(outputStream)
  .on("finish", () => {
    console.log('Done!');
  });