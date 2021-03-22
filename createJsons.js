
const { access, stat, ensureDirSync, existsSync, removeSync, writeFile } = require('fs-extra');
const {execSync} = require('child_process');
// const emptyDir = require('empty-dir');
const { sep, dirname } = require('path');
const recursive = require('recursive-readdir');

const NonDeliverables = [
  '.git',
  '.github',
  'tests',
  '.appveyor.yml',
  '.drone.jsonnet',
  '.drone.yml',
  '.editorconfig',
  '.gitignore',
  '.php_cs',
  'appveyor-phpunit.xml',
  'CODE_OF_CONDUCT.md',
  'codeception.yml',

  'crowdin.yml',
  'jenkins-phpunit.xml',
  'Jenkinsfile',
  'karma.conf.js',
  'phpunit.xml.dist',
  'README.md',
  'RoboFile.dist.ini',
  'RoboFile.php',
  '.php_cs.dist',
  'build.xml',

  'phpunit-pgsql.xml.dist',

  'build',
  'composer.json',
  'composer.lock',
  'package-lock.json',
  'package.json',
];

function checkFile(file, currentVersionFiles, redundantFiles, redundantFolders) {
  if (!currentVersionFiles.includes(file)) {
    redundantFiles.push(file);

    if (!existsSync(dirname(`${process.cwd()}/joomla_400/${file}`)) && !redundantFolders.includes(dirname(file))) {
      redundantFolders.push(dirname(file))
    } else if (emptyDir.sync(dirname(`${process.cwd()}/joomla_400/${file}`)) && !redundantFolders.includes(dirname(file))) {
      redundantFolders.push(dirname(file))
    }
  }
};

async function createJson(folder) {
  NonDeliverables.map(file => removeSync(`${process.cwd()}/${folder}/${file}`));

  const files = await recursive(folder);
  files.sort().map(file => file.replace(`${folder}${sep}`, ''));

  await writeFile(`${folder}.json`, JSON.stringify(files, '', 2), {encoding: 'utf8'});
}

const processes = []
for (let i = 0; i < 7; i++) {
  processes.push(createJson(`${process.cwd()}/joomla_beta${i+1}`))
}

Promise.all(processes);

// let J3Files;
// let J4Files;

// recursive(`joomla_310`, function (err, files) {
// //   console.log(files);
//   J3Files = files.sort().map(file => file.replace(`joomla_310${sep}`, ''))

//   recursive(`joomla_400`, function (err, files) {
//     // `files` is an array of file paths
//     const redundantFiles = [];
//     const redundantFolders = [];
//     J4Files = files.sort().map(file => file.replace(`joomla_400${sep}`, ''))
//     J3Files.forEach(file => checkFile(file, j4Files, redundantFiles, redundantFolders))

//     writeFileSync('J3Files.json', JSON.stringify(J3Files, '', 2), ()=> {});
//     writeFileSync('J4Files.json', JSON.stringify(J4Files, '', 2), ()=> {});
//     writeFileSync('Redundant.json', JSON.stringify(redundantFiles, '', 2), ()=> {});
//     writeFileSync('RedundantFolders.json', JSON.stringify(redundantFolders, '', 2), ()=> {});
//   });
// });
