
const { access, stat, ensureDirSync, existsSync, readFile, writeFile } = require('fs-extra');
const {execSync} = require('child_process');
// const emptyDir = require('empty-dir');
const { sep, dirname } = require('path');
const recursive = require('recursive-readdir');
const difference = require('array-difference')

async function createDif(index) {
  const previousVersion = index >= 1 ? JSON.parse(await readFile(`${process.cwd()}/joomla_beta${index}.json`, {encoding: 'utf8'})) : [];
  const currentVersion = JSON.parse(await readFile(`${process.cwd()}/joomla_beta${index + 1}.json`, {encoding: 'utf8'}));

  const a = previousVersion.sort().map(file => file.replace(`${process.cwd()}/joomla_beta${index}${sep}`, ''));
  const b = currentVersion.sort().map(file => file.replace(`${process.cwd()}/joomla_beta${index + 1}${sep}`, ''));

  const diff = [];
  a.forEach(el => {
    if (!b.includes(el)) {
      diff.push(el);
    }
  });

  await writeFile(`${process.cwd()}/diff_beta_${index === 0 ? '_' : index}_${index+1}.json`, JSON.stringify(diff, '', 2), {encoding: 'utf8'});
}

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

const processes = []
for (let i = 0; i < 7; i++) {
  processes.push(createDif(i))
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
