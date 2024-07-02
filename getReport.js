//config Header, baseurl and folderPath
//create a folder in pwd "reports"

import { getEndPointForDoctype } from "./functions.js"

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
dotenv.config();

const myHeaders = new Headers();
myHeaders.append("Authorization", process.env.KEY)

const current_path = process.cwd()

const baseUrl = getEndPointForDoctype("Report")

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

fetch(`${baseUrl}?filters={\"is_standard\": \"No\", \"disabled\":0}&limit_page_length=0`, requestOptions)
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    if (data && data.data && Array.isArray(data.data)) {
      data.data.forEach(item => {
        const documentName = item.name;

        if (documentName) {
          fetch(`${baseUrl}/${documentName}`, requestOptions)
            .then(response => {
              if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
              return response.json();
            })
            .then(documentDetails => {
              const folderName = documentDetails.data.name;
              const folderPath = path.join(current_path, '/reports', folderName); //configure folderPath
              const reportScriptContent = documentDetails.data.report_script;
              const javascriptContent = documentDetails.data.javascript;
              const queryContent = documentDetails.data.query;
              const reportScriptName = documentDetails.data.name;
              const javaScriptName = documentDetails.data.name;
              const queryName = documentDetails.data.name;
              const javaScriptFileName = path.join(folderPath, `${javaScriptName}.js`);
              const reportScriptFileName = path.join(folderPath, `${reportScriptName}.py`);
              const queryFileName = path.join(folderPath, `${queryName}.sql`);
              const metaFileName = path.join(folderPath, `${folderName}.meta`);

              if (reportScriptContent || javascriptContent || queryContent) {
                fs.mkdir(folderPath, { recursive: true }, (err) => {
                  if (err) {
                    console.error('Error creating folder:', err);
                  } else {
                    console.log('Folder created successfully:', folderName);

                    // Check if report_script is truthy before writing the file
                    if (reportScriptContent) {
                      fs.writeFile(reportScriptFileName, reportScriptContent, { flag: 'w' }, (err) => {
                        if (err) {
                          console.error('Error writing report script file:', err);
                        } else {
                          console.log('Report script file created successfully:', reportScriptFileName);
                        }
                      });
                    } else {
                      console.log('No report script content to write for:', folderName);
                    }

                    // Check if javascript is truthy before writing the file
                    if (javascriptContent) {
                      fs.writeFile(javaScriptFileName, javascriptContent, { flag: 'w' }, (err) => {
                        if (err) {
                          console.error('Error writing JavaScript file:', err);
                        } else {
                          console.log('JavaScript file created successfully:', javaScriptFileName);
                        }
                      });
                    } else {
                      console.log('No JavaScript content to write for:', folderName);
                    }

                    // Check if query is truthy before writing the file
                    if (queryContent) {
                      fs.writeFile(queryFileName, queryContent, { flag: 'w' }, (err) => {
                        if (err) {
                          console.error('Error writing query file:', err);
                        } else {
                          console.log('Query file created successfully:', queryFileName);
                        }
                      });
                    } else {
                      console.log('No query content to write for:', folderName);
                    }

                    // Create metadata file
                    const metadata = {
                          name: documentDetails.data.name,
                          owner: documentDetails.data.owner,
                          creation: documentDetails.data.creation,
                          modified: documentDetails.data.modified,
                          modified_by: documentDetails.data.modified_by,
                          docstatus: documentDetails.data.docstatus,
                          idx: documentDetails.data.idx,
                          report_name: documentDetails.data.report_name,
                          ref_doctype: documentDetails.data.ref_doctype,
                          is_standard: documentDetails.data.is_standard,
                          module: documentDetails.data.module,
                          report_type: documentDetails.data.report_type,
                          letter_head: documentDetails.data.letter_head,
                          add_total_row: documentDetails.data.add_total_row,
                          disabled: documentDetails.data.disabled,
                          disable_prepared_report: documentDetails.data.disable_prepared_report,
                          prepared_report: documentDetails.data.prepared_report,
                          doctype: documentDetails.data.doctype,
                          columns: documentDetails.data.columns,
                          roles: {
                            
                              name: documentDetails.data.roles.name,
                              owner: documentDetails.data.roles.owner,
                              creation: documentDetails.data.roles.creation,
                              modified: documentDetails.data.roles.modified,
                              modified_by: documentDetails.data.modified_by,
                              docstatus: documentDetails.data.roles.docstatus,
                              idx: documentDetails.data.roles.idx,
                              role: documentDetails.data.roles.role,
                              parent: documentDetails.data.roles.parent,
                              parentfield: documentDetails.data.roles.parentfield,
                              parenttype: documentDetails.data.roles.parenttype,
                              doctype:documentDetails.data.roles.doctype
                          
                          },
                          filters: documentDetails.data.filters,
                    };

                    fs.writeFile(metaFileName, JSON.stringify(metadata), { flag: 'w' }, (err) => {
                      if (err) {
                        console.error('Error writing meta file:', err);
                      } else {
                        console.log('Meta file created successfully:', metaFileName);
                      }
                    });
                  }
                });
              } else {
                console.log('No content to create folder for:', folderName);
              }
            })
            .catch(error => console.error(`Error fetching details for document ${documentName}:`, error));
        } else {
          console.error('Invalid or empty documentName:', documentName);
        }
      });
    } else {
      console.error('Invalid or empty data received from the API.');
    }
  })
  .catch(error => console.error('Error fetching data:', error));