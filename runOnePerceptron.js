
const lettersFolders = './Letters';
const csvFilePath='Bet.csv' ;
const csv = require('csvtojson');
const fs = require('fs');
const jsonfile = require('jsonfile');


//let  file = './data.json';
let data = {} ;
let trainData = [];
let testData = [];
let trainingPresent = 0.8;
let lettersForDS = ["Gimel","Bet"];
let trainLetter = "Gimel";
let testLetter = "Gimel";
let imageSize = 13 * 13 ;
let sumNN = 0;
let sumPP = 0;
let sumPN = 0;
let sumNP = 0;
let numOfTry = 5;
let numOfItr = 100;


function ReadDataFromFiles() {
    return new Promise((resolve,reject)=>{
        fs.readdir(lettersFolders, (err, files) => {
            let filesConter = 0 ;
            files.forEach(file => {
                let fileName = file.split('.')[0];
                readDataFromCsvFile('./Letters/' + file, fileName ).then(function (answer) {
                    //console.log(answer);
                    filesConter ++ ;
                    if(filesConter === files.length){
                        resolve('all done');
                    }
                });

            });

        });
    }) ;
}

function readDataFromCsvFile(filePath , fileName) {
    return new Promise(function (resolve,reject) {
        csv()
            .fromFile(filePath)
            .on('csv',(csvRow, rowIndex)=>{
                changeToNumber(csvRow);
                data[fileName] = data[fileName] ? data[fileName] : [] ;
                data[fileName].push(csvRow);
                resolve(`The letter ${fileName} is completed!`);
            });

    });
}

function changeToNumber(array){
    for (let i = 0 ; i < array.length ; i++  ){
        array[i] = Number(array[i]) ;
    }
}


ReadDataFromFiles().then(function () {
    culcData();
    changeToBipolar();
    splitDataForTrainAndTest(data,lettersForDS,trainingPresent);

    for(let i = 0 ; i < numOfTry ; i++) {
        console.log("\n\n------- Iteration " + i + "-------\n" );
        let inputSize = imageSize;
        let perceptron = {
            weights: initWeights(inputSize),
            bais: Math.random(),
            treshold: 1
        };
        for(let j = 0 ; j < numOfItr ; j++) {
            train(perceptron, trainData, trainLetter);
        }
        test(perceptron, testData, testLetter);
    }
    printConclusion();

});

/*function changeToBipolar(data) {
    for (let )
}*/

function printConclusion() {
    let sumOfSeccsess = sumPP + sumNN ;
    console.log("\n\n----------------- Conclusion: -----------------\n" );
    console.log("predicted Letter: " + testLetter);
    console.log("train Length: " + trainData.length  );
    console.log("test Length: " + testData.length );
    console.log("Average of data of " + numOfTry + " iterations" );
    console.log("\tPos \tPos : \t" + sumPP / numOfTry );
    console.log("\tNeg \tNeg : \t" + sumNN / numOfTry);
    console.log("\tPos \tNeg : \t" + sumPN / numOfTry);
    console.log("\tNeg \tPos : \t" + sumNP / numOfTry);
    console.log("\n\n\nAccuracy:  " + (sumOfSeccsess / numOfTry)/ testData.length * 100 +"%" ) ;
}

function changeToBipolar(data) {
    for (let letterName in data){
        let letterData = data[letterName];
        for (let i = 0 ; i < letterData.length ; i++){
            for (let j = 0 ; j < letterData[i].length ; j++){
                letterData[i][j] = (letterData[i][j] === 0) ? -1 : 1 ;
            }
        }
    }
}



function splitDataForTrainAndTest(data,LettersToSplit,trainPrecent) {
    let testPrecent = 1 - trainPrecent;
    for (let lettersIndex = 0 ; lettersIndex < LettersToSplit.length; lettersIndex++ ){
        let letterName = LettersToSplit[lettersIndex];
        let shuffleArray =  shuffle(data[letterName].slice());
        divedToTrainAndTests (shuffleArray , testPrecent ,letterName ) ;
        shuffle(trainData);
        shuffle(testData);
    }
}

/*function duplicateArray(shuffleArray) {
    console.log("beforeMul " + shuffleArray.length);
    let newArray = [];
    for (let i = 0 ; i < shuffleArray.length ; i++){
        for (let j = 0 ; j < mulExamples ; j++){
            newArray.push(shuffleArray[i]);
        }
    }
    console.log("afterMul " + newArray.length);
    shuffle(newArray);
    return newArray;
}*/


function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function divedToTrainAndTests(shuffleArray, testPrecent, letterName) {
    let testSize = Math.floor(shuffleArray.length * testPrecent);

    for (let i = 0 ; i < testSize ;  i ++ ){
        if(shuffleArray[i]) {
            testData.push(shuffleArray.pop());
        }
    }
    /*  if(letterName === trainLetter){
          shuffleArray =  duplicateArray(shuffleArray);
      }*/
    let trainSize =  shuffleArray.length - testSize;
    for (let i = 0 ; i < trainSize; i ++ ){
        if(shuffleArray[i]) {
            trainData.push(shuffleArray[i]);
        }
    }
}


function train(perceptron,trainData , label) {
    label = convertLetterToNumber(label);
    for (let index = 0 ; index < trainData.length ; index++){
        let isThisLabel = prediction(perceptron,trainData[index]);
        let isNeedsToPass = ( isThisLabel  && label === trainData[index][0] );
        let isntNeedToPass = ( !isThisLabel  && label !== trainData[index][0] ) ;
        if(!(isNeedsToPass || isntNeedToPass)){
            if ( label === trainData[index][0]){
                for (let i = 0 , j = 1 ; i < trainData.length ; i++ ,j++){
                    perceptron.weights[i] += trainData[index][j]
                }

            } else {
                for (let i = 0 , j = 1 ; i < trainData.length ; i++ ,j++){
                    perceptron.weights[i] -= trainData[index][j];
                }
            }
        }
    }
}

function test(perceptron,testData , label) {
    label = convertLetterToNumber(label);
    let cPP = 0, cPN = 0 , cNN = 0 , cNP = 0 ;

    for (let i = 0 ; i < testData.length ; i++) {
        let isThisLabel = prediction(perceptron, testData[i]);
        let isNeedsToPass = (isThisLabel && label === testData[i][0]);
        let isntNeedToPass = (!isThisLabel && label !== testData[i][0]);

        if(isNeedsToPass){
            cPP ++ ;
            sumPP ++;
        }else if(isntNeedToPass){
            cNN ++ ;
            sumNN ++;
        }
        else if(isThisLabel && label !== testData[i][0]){
            cPN ++;
            sumPN ++;
        } else if(!isThisLabel && label === testData[i][0]) {
            cNP ++;
            sumNP ++;

        }
    }
    printItration(cPP,cNN,cPN,cNP);

}

function printItration(cPP,cNN,cPN,cNP) {
    console.log("\tPass |\tneedTo | counter");
    console.log('\t---------------------------');
    console.log("\tPos \tPos \t" + cPP);
    console.log("\tNeg \tNeg \t" + cNN);
    console.log("\tPos \tNeg \t" + cPN);
    console.log("\tNeg \tPos \t" + cNP);
}



function prediction(perceptron,inputsArray) {
    let score = 0;
    for (let i = 0 ,j = 1; i <  perceptron.weights.length ; j++, i++){
        score +=  inputsArray[j] * perceptron.weights[i];
    }
    score += perceptron.bais;
    return score > perceptron.treshold  ;
}


function initWeights(weightsSize) {
    let weight = [] ;
    for (let i = 0; i < weightsSize; i++) {
        weight[i] =  Math.random() ;
    }
    return weight;
}

function convertLetterToNumber(label) {
    let gimatryNumber ;
    switch (label){
        case "Bet":
            gimatryNumber = 2;
            break;
        case "Gimel":
            gimatryNumber = 3;
            break;
        case "Vav":
            gimatryNumber = 6;
            break;
        case "Zain":
            gimatryNumber = 7;
            break;
        case "Yud":
            gimatryNumber = 10;
            break;
        case "Kaf":
            gimatryNumber = 20;
            break;
        case "Nun":
            gimatryNumber = 50;
            break;
    }
    return gimatryNumber;
}


function culcData(lettersForDS) {
    let sum = 0;
    for (let i in data){
        sum += data[i].length;
    }
    console.log("sum of data " + sum)
}