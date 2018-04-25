



const lettersFolders = './Letters';
const csv = require('csvtojson');
const fs = require('fs');
const jsonfile = require('jsonfile');



module.exports = {
    ReadDataFromFiles :   ReadDataFromFiles ,

};

/**
 * Reads letter files from given folder and build it in Data Structure.
 * @param data data structure
 * @returns {Promise}
 *resolve - info of success
 *reject - info of error
 */

function ReadDataFromFiles(data) {
    return new Promise((resolve,reject)=> {
        fs.readdir(lettersFolders, (err, files) => {
            if(err){
                reject('error occurred : ' + err);
            }
            let filesConter = 0 ;
            files.forEach(file => {
                let fileName = file.split('.')[0];
                readDataFromCsvFile(data,'./Letters/' + file, fileName ).then(function (answer) {
                    filesConter ++ ;
                    if(filesConter === files.length){
                        resolve('Reading csv file is done, the dataset is ready to use');
                    }
                });

            });

        });
    }) ;
}

/**
 * build the data structure form given file path.
 * @param data              - to fill in
 * @param filePath          - file path to read
 * @param letterName        - the letter for to fill in the data structure
 * @returns {Promise<any>}
 * resolve - info of success
 */

function readDataFromCsvFile(data,filePath , letterName) {
    return new Promise(function (resolve) {
        csv()
            .fromFile(filePath)
            .on('csv',(csvRow)=>{
                csvRow = csvRow.map(x => Number(x));
                data[letterName] = data[letterName] ? data[letterName] : [] ;
                data[letterName].push(csvRow);
                resolve(`The letter ${letterName} is completed!`);
            });
    });
}
