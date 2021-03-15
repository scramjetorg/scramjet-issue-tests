const { StringStream, DataStream } = require('scramjet');
const { createReadStream, createWriteStream } = require('fs');

const inputStream = createReadStream(`${__dirname}/in.txt`, { encoding: 'utf-8' });
const outputStream = createWriteStream(`${__dirname}/out.txt`, { encoding: 'utf-8' });

inputStream.on('close', () => console.log('inputStream close'));
outputStream.on('close', () => console.log('outputStream close'));

StringStream.from(inputStream)
  .setOptions({ maxParallel: 1 })
  .lines()
  .map((line) => {
    console.log(`map -> ${line}`);

    if (line === '5') throw new Error("Test");

    return `${line} - ok\n`;
  })
  .tee(outputStream)
  .whenEnd()
  .then(() => {
    console.log('Done!');
  })
  .catch((err) => {
    console.log(`Error: ${err}`);
  });