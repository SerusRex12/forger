#! /usr/bin/env node

const { Command } = require("commander");
const fs = require("fs");
const path = require("path");
const figlet = require("figlet");
var colors = require('colors');

const program = new Command();
program
  .version("0.1.0")
  .description("A CLI for Graphql Server using 'yoga', 'prisma', 'postgres'.");

program.command('new')
  .description('Create new project in current directory')
  .argument('<string>', 'string to split')
  .action((str: string) => {
    createNewProject(str);
});

program.command('model')
  .description('Create new Model')
  .argument('<string>', 'string to split')
  .option('-a, --all', 'make all')
  .action((str: string) => {
    createModel(str);
});

program.parse();

const options = program.opts();

if (!process.argv.slice(2).length) {
    console.log(figlet.textSync("Forger CLI"));
    program.outputHelp();
}

function createNewProject(str: string) {
  console.log("New Project will be named as " + str);
  const rootPath = require.main?.path;
  const decompress = require('decompress');
  decompress(rootPath+'/template/server.zip', str)
  .then((files: any) => {
    const currentPath = process.cwd() +'/'+ str +'/';
    var content = {
      name: str,
      version: '1.0.0'
    };
    fs.writeFile(currentPath+'forger.json', JSON.stringify(content), function (err: any) {
      if (err) throw err;
      console.log(colors.green('Project ' + str + 'has beeb created!'));
    });
  })
  .catch((error: any) => {
    console.log(error);
  });
}

function createModel(modelName:string) {
  const currentPath = process.cwd();

  fs.readFile(currentPath+'/forger.json', { encoding: 'utf8' }, (err: any, data: string) => {
    if (err) {
      console.log(colors.error("Can't create a model without the project"));
      return;
    }
    let x = JSON.parse(data)
    makeTypeDef(modelName,currentPath);
    makeQuery(modelName,currentPath);
  });
}

function makeTypeDef(typeDefName:string,path:string) {
  let text = "export const "+typeDefName+"Defs = /* GraphQL */`\n\n`;";

  fs.writeFile(path+'/src/typedefs/'+(typeDefName+'Defs.ts'), text, function (err: any) {
    if (err) throw err;
    console.log(colors.green('Type Definition '+typeDefName+' created!'));
  });
}

function makeQuery(queryName:string,path:string) {
  let text = 'import { Context } from \"../../context\";\n\nexport const '+queryName+'Query = {\n\n}';

  fs.writeFile(path+'/src/resolvers/Query/'+(queryName+'Query.ts'), text, function (err: any) {
    if (err) throw err;
    console.log(colors.green('Query '+queryName+' created!'));
  });
}

