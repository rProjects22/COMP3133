const fs = require('fs');
const csv = require('csv-parser');
const csvParser = csv();

//Input CSV file path 
const inputFile = 'input_countries.csv';

//Output TXT file path for America
const outputFile = 'america.txt';

//Create read stream from the input CSV file 
const readStream = fs.createReadStream(inputFile, 'utf-8');

//Create a write stream to the output TXT file 
const writeStream = fs.createWriteStream(outputFile, { flags: 'w', encoding: 'utf-8' });


function filterData(row){
     return row.country === 'America';
}

// Function to add a title/header line to the output file
function addTitle() {
     const title = 'country,year,population\n';
     writeStream.write(title);
   }

//delete the file if existing...
function deleteOutputFile() {
     if (fs.existsSync(outputFile)) {
       console.log(`${outputFile} exists. Deleting...`);
       fs.unlinkSync(outputFile);
       console.log(`${outputFile} was deleted`);
     }
   }

deleteOutputFile();
   
addTitle();

readStream
     .pipe(csvParser)
     .on('data', (row) => {
          if (filterData(row)){
               // Write the filtered data to the output TXT file without additional formatting
               writeStream.write(`${row.country},${row.year},${row.population}\n`);
          }
     })
     .on('end', () => {
          // Close the write stream when parsing is complete
          writeStream.end();
        })

        .on('error', (err) => {
          console.error('CSV parser error:', err);
        })

        .on('finish', () => {
          console.log('Filtered data for America written to', outputFile);
        });
