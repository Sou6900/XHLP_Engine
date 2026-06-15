/* eslint-disable no-console */
const { fork } = require('child_process');
const path = require('path');

main();

async function main() {
  let serverStarted = false;
  console.log('\033[34m⊗ Starting Acode Development Server ⊗\033[34m  \033[0m');
  
  const webpack = fork(path.resolve(__dirname, './run-webpack.js'));

  webpack.on('message', (chunk) => {
    if (!serverStarted && chunk.search(/compiled\ssuccessfully/)) {
      startServer();
      serverStarted = true;
    }
  });

  webpack.on('error', (err) => {
    console.log('\033[31mWEBPACK ERROR', err+'\033[31m');
    webpack.kill(1);
    process.exit(1);
  });
}

async function startServer() {
  let progress = 0;
  const total = 20; // Number of blocks
  const interval = setInterval(() => {
    progress++;

    const bar = '█'.repeat(progress) + '-'.repeat(total - progress);
    
    process.stdout.write('\r\033[36m[' + bar + '] ' + Math.round((progress / total) * 100) + '%\033[0m ');

    if (progress >= total) {
      clearInterval(interval);
      console.log("\n\n \033[34mPress 'x' :\033[34m \033[0mclear logs\033[0m\n");
      console.log(" \033[34mPress 'ctrl + c' :\033[34m \033[0mquit serving\033[0m\n");

      const server = fork(path.resolve(__dirname, './start-server.js'));

      server.on('error', (err) => {
        console.log('SERVER ERROR', err);
        server.kill(1);
        process.exit(1);
      });
    }
  }, 200);
}