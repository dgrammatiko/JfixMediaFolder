/**
 * Fetch PHP versions
 * Author Dimitris Grammatikogiannis
 * License MIT
 */

// Needs "@octokit/rest" installed!
const { Octokit } = require("@octokit/rest");
const { writeFile, readFile } = require('fs/promises');
// Adjust this
const outputFilename = 'php-versions.json';

const main = async () => {
  const octokit = new Octokit();

  // Get the existing list
  const previousVersionsTxt = await readFile(outputFilename, {encoding: 'utf8'});
  const previousVersions = JSON.parse(previousVersionsTxt);

  // Grab the list of currently maintained versions
  octokit.repos.listTags({
    owner: "php",
    repo: "php-src",
  }).then(async ({ data }) => {
    const verTmp = [];

      // Clean the tags
      data.map(el => verTmp.push(el.name.replace('php-', '')));

      // Filter
      const vers = verTmp.filter(ver => ![
        'yaf-2.1.0',
        'xmlrpc_epi_0_51_merge_pt',
        'php5_5_0',
        'php4',
        'php_ibase_before_split'].includes(ver));

        const versions = vers.filter(ver => !ver.match(/(RC)|(ALPHA)|(alpha)|(BETA)|(beta)|(rc)/gm));

      console.log([...new Set(versions.concat(previousVersions))].sort());

      await writeFile(outputFilename, JSON.stringify([...new Set(versions.concat(previousVersions))].sort(), '', 2), {encoding: 'utf8'});
  });
}

main();
