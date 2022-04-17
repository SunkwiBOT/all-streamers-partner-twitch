import fileSystem from 'fs';

export const awaitTimeout = (delay) => new Promise(resolve => setTimeout(resolve, delay));

export function writeInFile (data) {
  console.log(data);
  fileSystem.appendFileSync('./Data/streamer.txt', data + '\r\n');
}
