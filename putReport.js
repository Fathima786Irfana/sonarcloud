//configure header, baseurl

import { getEndPointForDoctype } from "./functions.js"

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import { execSync } from 'child_process'; 
dotenv.config();


const baseFolder = 'reports';

const myHeaders = {
  'Content-Type': 'application/json',
  'Authorization': process.env.KEY,
};

const baseUrl = getEndPointForDoctype("Report")

const createdReports = new Set();
const errorFile = new Set();

function isFileModified(filePath) {
  try {
    // Use Git to check if the file is modified
    const status = execSync(`git status --porcelain "${filePath}"`, { encoding: 'utf-8' }).trim();
    return status !== '';
  } catch (error) {
    console.error(`Error checking Git status for file ${filePath}: ${error}`);
    return false;
  }
}

function isFileNew(filePath) {
  try {
    // Check if the file exists on the filesystem but is not yet committed
    const isUncommitted = !execSync(`git log --format=%H -- "${filePath}"`, { encoding: 'utf-8' }).trim();
    return isUncommitted;
  } catch (error) {
    console.error(`Error checking Git status for file ${filePath}: ${error}`);
    return false;
  }
}

function readContent(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      return content.length > 0 ? content : null;
    }
  } catch (error) {
    console.error(`Error reading file: ${error.message}`);
  }
  return null;
}

async function createNewReport(folderPath, jsContent, pyContent, sqlContent, metaContent) {
  const folderName = path.basename(folderPath);

  if (!createdReports.has(folderName)) {
    // Make a POST request to create a new report
    
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({
        report_name: folderName,
        report_script: pyContent,
        javascript: jsContent,
        query: sqlContent,
        ...JSON.parse(metaContent),
      }),
      redirect: 'follow',
    };

    const url = baseUrl;
    
   await fetch(url, requestOptions)
      .then(response => {
        if (!response.ok) {
          if (response.status === 409) {
            console.log(`Report creation conflict for ${folderName}. Skipping creation...`);
          } else {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
        } else {
          console.log(`New report created: ${folderName}`);
          createdReports.add(folderName); // Mark the report as created
        }
      }) 
      .catch(error => {
        console.error(`Error creating new report ${folderName}: ${error}`);
      });
  } else {
    console.log(`Report ${folderName} already created. Skipping creation...`);
  }
}

async function processFilesInFolder(folderPath, baseFolder) {
  try {
    const files = fs.readdirSync(folderPath);

    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const stats = fs.statSync(filePath);
      const fileExtension = path.extname(file).toLowerCase();
      const folderName = path.basename(folderPath); // Define folderName within the scope of the loop

      if (stats.isDirectory()) {
        processFilesInFolder(filePath, baseFolder);
      } else if ((isFileNew(filePath) || isFileModified(filePath)) && fileExtension !== '.meta' && !errorFile.has(file.replace(new RegExp(`\\${fileExtension}$`), ''))) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const metaFilePathPut = path.join(baseFolder, folderName, `${folderName}.meta`);
        const metaContentPutString = fs.readFileSync(metaFilePathPut, 'utf-8');
        const metaContentPut = JSON.parse(metaContentPutString);

        delete metaContentPut.name;
        delete metaContentPut.owner;
        delete metaContentPut.modified;
        delete metaContentPut.modified_by;
        delete metaContentPut.creation;
        delete metaContentPut.roles;

        const encodedFilename = encodeURIComponent(file.replace(new RegExp(`\\${fileExtension}$`), ''));

        const requestOptions = {
          method: 'PUT',
          headers: myHeaders,
          body: JSON.stringify({
            filename: encodedFilename,
            [fileExtension === '.js' ? 'javascript' : (fileExtension === '.py' ? 'report_script' : 'query')]: fileContent,
            ...metaContentPut,
          }),
          redirect: 'follow',
        };

        const url = `${baseUrl}/${encodedFilename}`

      await fetch(url, requestOptions)
          .then(response => {
            if (!response.ok) {
              if (response.status === 404) {
                // If the file doesn't exist, create a new report and retry the PUT request
                const metaFilePath = path.join(baseFolder, folderName, `${folderName}.meta`);
                const jsFilePath = path.join(baseFolder, folderName, `${folderName}.js`);
                const pyFilePath = path.join(baseFolder, folderName, `${folderName}.py`);
                const sqlFilePath = path.join(baseFolder, folderName, `${folderName}.sql`);
                const metaContent = fs.readFileSync(metaFilePath, 'utf-8');
                const jsContent = readContent(jsFilePath);
                const pyContent = readContent(pyFilePath);
                const sqlContent = readContent(sqlFilePath);
                
                createNewReport(folderPath, jsContent, pyContent, sqlContent, metaContent, folderName);
                errorFile.add(file.replace(new RegExp(`\\${fileExtension}$`), ''));
              } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
            }
            return response.json();
          })
          .then(result => {
            console.log(`Processing file: ${file}`);
          })
          .catch(error => {
            console.error(`Error processing file ${file}: ${error}`);
          });
      }
    }
  } catch (error) {
    console.error(`Error reading folder ${folderPath}: ${error}`);
  }
}

// Start processing the base folder
processFilesInFolder(baseFolder, baseFolder);