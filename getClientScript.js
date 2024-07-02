//config Header, baseUrl, folderPath
//create a folder "clientScript" in pwd
// const functions = require('./functions');
import { getEndPointForDoctype } from "./functions.js"

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
dotenv.config();
// require('dotenv').config();
// const fs = require('fs');
// const path = require('path');
const myHeaders = new Headers();
myHeaders.append("Authorization", process.env.KEY)
// "Basic MjIxZTVlMzlkODQyNmZlOjVlMjY0YTVjMmY0NjcwZg==");  //configure header

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};
const current_path = process.cwd()
// const host = process.env.HOST
// const clientScriptEndPoint = process.env.CLIENT_SCRIPT_END_POINT
// const protocol = process.env.PROTOCOL

// const baseUrl = `${protocol}://${host}/api/resource/${clientScriptEndPoint}`
const baseUrl = getEndPointForDoctype("Client Script")
//console.log("baseUrl", baseUrl)
// "https://qsgbcz.lmnas.com/api/resource/Client Script";

fetch(`${baseUrl}?filters={\"enabled\":1}&limit_page_length=0`, requestOptions)
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    if (data && data.data && Array.isArray(data.data)) {
      data.data.forEach(documentDetails => {
        const documentName = documentDetails.name;

        // Ensure documentName is truthy before making the additional fetch
        if (documentName) {
          fetch(`${baseUrl}/${documentName}`, requestOptions)
            .then(response => {
              if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
              return response.json();
            })
            .then(documentDetails => {
              const folderName = documentDetails.data.dt;
              console.log("folderpath", current_path)
              const folderPath = path.join(current_path, '/clientScript', folderName); //config folderPath
            
              const scriptName = documentDetails.data.name;
              const scriptFileName = path.join(folderPath, `${scriptName}.js`);
              const metaFileName = path.join(folderPath, `${scriptName}.meta`);

              // Exclude script from metadata
              const metadataWithoutScript = {
                // Include other fields you need in metadata
                name: documentDetails.data.name,
                owner: documentDetails.data.owner,
                creation: documentDetails.data.creation,
                modified: documentDetails.data.modified,
                modified_by: documentDetails.data.modified_by,
                docstatus: documentDetails.data.docstatus,
                idx: documentDetails.data.idx,
                dt: documentDetails.data.dt,
                view: documentDetails.data.view,
                enabled: documentDetails.data.enabled,
                doctype: documentDetails.data.doctype
              };

              fs.mkdir(folderPath, { recursive: true }, (err) => {
                if (err) {
                  console.error('Error creating folder:', err);
                } else {
                  console.log('Folder created successfully:', folderName);

                  // Assuming documentDetails.script contains the script content
                  fs.writeFile(scriptFileName, documentDetails.data.script, { flag: 'w' }, (err) => {
                    if (err) {
                      console.error('Error writing script file:', err);
                    } else {
                      console.log('Script file created successfully:', scriptFileName);

                      // Save metadata as .meta file
                      fs.writeFile(metaFileName, JSON.stringify(metadataWithoutScript), { flag: 'w' }, (err) => {
                        if (err) {
                          console.error('Error writing meta file:', err);
                        } else {
                          console.log('Meta file created successfully:', metaFileName);
                        }
                      });
                    }
                  });
                }
              });
            })
            .catch(error => {
              console.error(`Error fetching details for document ${documentName}:`, error);
              throw error;  // Propagate the error to stop further execution
            });
        } else {
          console.error('Invalid or empty documentName:', documentName);
        }
      });
    } else {
      console.error('Invalid or empty data received from the API.');
    }
  })
  .catch(error => console.error('Error fetching data:', error));