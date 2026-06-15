const path = require('path');
const fs = require('fs');
const jszip = require('jszip');

const iconFile = path.join(__dirname, '../icon.png');
const pluginJSON = path.join(__dirname, '../plugin.json');
const distFolder = path.join(__dirname, '../dist');
let readmeDotMd = path.join(__dirname, '../readme.md');

if (!fs.existsSync(readmeDotMd)) {
  readmeDotMd = path.join(__dirname, '../README.md');
}

// Create zip file of dist folder
const zip = new jszip();
let writeCounter = 0; // Counter to control log message

zip.file('icon.png', fs.readFileSync(iconFile));
zip.file('plugin.json', fs.readFileSync(pluginJSON));
zip.file('readme.md', fs.readFileSync(readmeDotMd));

loadFile('', distFolder);

zip
  .generateNodeStream({ type: 'nodebuffer', streamFiles: true })
  .pipe(fs.createWriteStream(path.join(__dirname, '../dist.zip')))
  .on('finish', () => {
    writeCounter++;
    if (writeCounter % 3 === 0) { // Only log after every 3rd completion
      console.log('\n\033[32m✅  dist.zip written\033[0m');
    }
  });

function loadFile(root, folder) {
  const distFiles = fs.readdirSync(folder);
  distFiles.forEach((file) => {
    const stat = fs.statSync(path.join(folder, file));

    if (stat.isDirectory()) {
      zip.folder(file);
      loadFile(path.join(root, file), path.join(folder, file));
      return;
    }

    if (!/LICENSE.txt/.test(file)) {
      zip.file(path.join(root, file), fs.readFileSync(path.join(folder, file)));
    }
  });
}
