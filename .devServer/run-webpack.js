/* eslint-disable no-console */
const { spawn } = require('child_process');
const path = require('path');
const readline = require('readline');

const webpack = spawn('npx', ['webpack', '--mode=development', '--watch']);
let errorCount = 0; // Counter for stderr occurrences
const maxErrors = 6; // Limit errors to 6 times

webpack.on('error', (webpackError) => {
  if (webpackError) {
    console.log('\033[31m############## WebpackError ###############\n', webpackError + '\033[0m');
    listenForKeyPress();
    process.exit(1);
  }
});

webpack.stdout.on('data', function(chunk) {
  let stdout = chunk.toString();

  // // Highlight "ERROR" in red
  stdout = stdout.replace(/ERROR/g, '\033[31mERROR');

  // Highlight "compiled successfully in *** ms" in green
  stdout = stdout.replace(/(webpack.*?)compiled successfully in (\d+ ms)/g, '\n✅ \033[32m$1compiled successfully in $2\033[0m');
  
  // Highlight "compiled with X error(s) in *** ms" in yellow
  stdout = stdout.replace(/(webpack.*?)compiled with (\d+ error.*?) in (\d+ ms)/g, '\n❌ \033[33m$1compiled with $2 in $3\033[0m');

  let inMagentaBlock = false; // Flag to track magenta color block

  // Process each line separately
  let lines = stdout.split('\n').map(function(line) {
    if (inMagentaBlock) {
      // If inside magenta block, check if the line starts with "NUM |"
      let match = line.match(/^\s*(\d+)\s*\|/);
      if (match) {
        inMagentaBlock = false; // Stop magenta
        return '\033[34m' + line +'\033[31m'; // Color "NUM | ..." in blue & red
      }
      return '\033[35m' + line; // Keep magenta
    }

    // Highlight "> NUM | ..." in magenta and activate flag
    if (/^\>\s*\d+\s*\|/.test(line)) {
      inMagentaBlock = true;
      return '\033[35m' + line + '\033[0m';
    }
    
    let match = line.match(/^\s*(\d+)\s*\|/);
      if (match) {
        inMagentaBlock = false; // Stop magenta
        return '\033[34m' + line +'\033[31m'; // Color "NUM | ..." in blue & red
  }

    // Highlight lines with "[built] [code generated]"
    if (line.indexOf('./') !== -1 && line.indexOf('[built]') !== -1 && line.indexOf('[code generated]') !== -1) {
      return '\033[32m' + line.replace(/\[built\] \[code generated\]/, '\033[33m[built] [code generated]\033[32m') + '\033[0m'; 
    }

    return line; // Keep other lines unchanged
  });
  

  // Join the modified lines and print
  console.log('\n' + lines.join('\n'));

  process.send(chunk.toString()); // Send original stdout (without color)
});


webpack.stdout.on('error', (error) => {
  console.log('\033[31m############## Error ###############\n', error + '\033[0m');
  listenForKeyPress();
});

webpack.stderr.on('data', (chunk) => {
  if (errorCount > maxErrors) {
    const stderr = chunk.toString();
    console.log('\033[31m############## StdError ###############\n', stderr + '\033[0m');
    errorCount++;
  }
  listenForKeyPress();
});

function listenForKeyPress() {
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);

  process.stdin.on('keypress', (str, key) => {
    if (key.name === 'x') {
      clearConsole();
    } else if (key.sequence === '\u0003') {
      // Detect Ctrl + C (SIGINT) and exit properly
      console.log('\n\033[31mDeadlocked! Press Ctrl+C again to exit.\033[0m\n');
      process.exit();
    }
  });
}

// Function to clear only the logs (not the terminal prompt)
function clearConsole() {
  process.stdout.write('\x1B[2J\x1B[3J\x1B[H'); // Clears the screen but keeps the prompt
  console.log("\033[36m⊗ Acode dev server running ⊗\033[0m\n");
  console.log(" \033[34mPress 'x' :\033[0m clear logs\n");
  console.log(" \033[34mPress 'Ctrl + C' :\033[0m quit serving\n");
}
