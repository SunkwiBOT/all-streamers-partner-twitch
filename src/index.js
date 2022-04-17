import fileSystem from 'fs';
import axios from 'axios';
import { awaitTimeout, writeInFile } from './utils/utils.js';

const listStreamer = async (page) => {
  // All streamer Partner.
  const url = `https://streamerbans.com/_next/data/myggjAYSG9zXDPknsBJ_N/streamers.json?page=${page}&banStatus=all`;

  // All streamers that are not currently banned.
  // const url = `https://streamerbans.com/_next/data/myggjAYSG9zXDPknsBJ_N/streamers.json?page=${page}&banStatus=unbanned`;

  // All streamers that are currently banned.
  // const url = `https://streamerbans.com/_next/data/myggjAYSG9zXDPknsBJ_N/streamers.json?page=${page}&banStatus=banned`;

  try {
    const result = await axios(url, {
      headers: {
        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36'
      }
    });

    return result.data;
  } catch (error) {
    console.log(error);
  }
};

async function start () {
  let c = 1;

  if (!fileSystem.existsSync('./Data')) { fileSystem.mkdirSync('./Data', { recursive: true }); }
  writeInFile(`\n\n${new Date().toISOString()}\nID || USERNAME || FOLLOWERS || BANNED\n`);

  const streamerBansData = (await listStreamer('1')).pageProps;
  const totalPage = streamerBansData.totalPages;

  for (let i = 1; i < totalPage + 1; i++) {
    const listOfStreamer = (await listStreamer(i)).pageProps.users;
    listOfStreamer.forEach((tw) => {
      writeInFile(`Page: ${i}/${totalPage} | Streamer: ${c++}/${streamerBansData.totalUsers} || ${tw.channel_id} ${tw.login_name} ${tw.followers} ${tw.is_banned}`);
    });
  }

  // Timer add to avoid missing the last page.
  await awaitTimeout(10000).then();
  console.log(`Done. Streamers: ${streamerBansData.totalUsers}`);
};

start();
