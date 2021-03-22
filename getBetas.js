const {execSync} = require('child_process');
const {ensureDir, removeSync} = require('fs-extra');
var AdmZip = require('adm-zip');

//beta 1
// https://github.com/joomla/joomla-cms/releases/download/4.0.0-beta/Joomla_4.0.0-beta1-Beta-Full_Package.zip
// https://github.com/joomla/joomla-cms/releases/download/4.0.0-beta1/Joomla_4.0.0-beta1-Beta-Full_Package.zip
//beta2
// https://github.com/joomla/joomla-cms/releases/download/4.0.0-beta2/Joomla_4.0.0-beta2-Beta-Full_Package.zip

//beta3
// https://github.com/joomla/joomla-cms/releases/download/4.0.0-beta3/Joomla_4.0.0-beta3-Beta-Full_Package.zip

// beta4
// https://github.com/joomla/joomla-cms/releases/download/4.0.0-beta4/Joomla_4.0.0-beta4-Beta-Full_Package.zip

//beta5
// https://github.com/joomla/joomla-cms/releases/download/4.0.0-beta5/Joomla_4.0.0-beta5-Beta-Full_Package.zip

//beta6
// https://github.com/joomla/joomla-cms/releases/download/4.0.0-beta6/Joomla_4.0.0-beta6-Beta-Full_Package.zip

//beta7
// https://github.com/joomla/joomla-cms/releases/download/4.0.0-beta7/Joomla_4.0.0-beta7-Beta-Full_Package.zip

const getJoomla = (version) => {
  console.log(`https://github.com/joomla/joomla-cms/releases/download/4.0.0-beta${version === 1 ? '' : version}/Joomla_4.0.0-beta${version}-Beta-Full_Package.zip`)
  execSync(`wget --no-check-certificate --content-disposition -O ./joomla_beta${version}.zip https://github.com/joomla/joomla-cms/releases/download/4.0.0-beta${version === 1 ? '' : version}/Joomla_4.0.0-beta${version}-Beta-Full_Package.zip`);

  ensureDir(`${process.cwd()}/joomla_beta${version}`);

  const zip = new AdmZip(`${process.cwd()}/joomla_beta${version}.zip`);
  zip.extractAllTo(/*target path*/`${process.cwd()}/joomla_beta${version}`, /*overwrite*/true);

  removeSync(`${process.cwd()}/joomla_beta${version}.zip`)
}

for (let i=0; i<7; i++) {
  getJoomla(i+1)
}
