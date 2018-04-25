
const ReadCsvFiles = require('./ReadCsvFiles') ;
const Utilities = require('./Utilities') ;

//global variables

let data = {} ;
let trainData = [];
let testData = [];
let trainingPresent = 0.8;
let imageSize = 13 * 13 ;

/*** Run the program***/
main();


function main(){
    ReadCsvFiles.ReadDataFromFiles(data).then((info) => {
        console.log(info);
        Utilities.culcDataLength(data);
        let lettersName = ["Gimel","Bet","Vav", "Yud", "Kaf","Zain","Nun"];
        splitDataForTrainAndTest(data,lettersName,trainingPresent);
        let perceptrons = trainFullModal(lettersName);
        testFullModal(perceptrons);
    }, (errInfo)=>{
        console.error(errInfo);
    });
}

/**
 * Build perceptron for each strange couples and send to training
 * @param lettersName           -   array of the letters for training
 * @returns {Array}             - array of perceptrons
 */
function trainFullModal(lettersName) {
    let strangeCuples = Utilities.LettersToCuples(lettersName);
    let perceptrons = [];
    for (let i = 0; i < strangeCuples.length ; i ++){
        let perceptron = {
            label1: strangeCuples[i][0],
            label2: strangeCuples[i][1],
            weights: Utilities.initWeights(imageSize),
            bais: Math.random(),
            treshold: 1
        };
        train(perceptron, trainData);
        perceptrons.push(perceptron);
    }
    return perceptrons ;
}

/**
 * testing the quality of the learning
 * each neuron predict his prediction
 * and adds to his counter +1.
 * after testing one example check which counter letter with the max value
 * this letter is the prediction that we check vs the true data.
 * @param perceptrons       - perceptrons that trains.d
 */

function testFullModal(perceptrons) {
    let goodResults = 0;
    for (let i = 0 ; i < testData.length ; i++) {
        let yLabel = testData[i][0];
        let predicedLabelsCounter = {
            "Gimel": 0,
            "Bet": 0,
            "Vav": 0,
            "Yud": 0,
            "Kaf": 0,
            "Zain": 0,
            "Nun": 0
        };
        console.log("----------- itr num " + i + "-----------") ;
        for (let j = 0; j < perceptrons.length; j++) {
            let label1 = convertLetterToNumber(perceptrons[j].label1);
            let label2 = convertLetterToNumber(perceptrons[j].label2);
            if (yLabel === label1 || yLabel === label2) {
                let predictedLabel = test(perceptrons[j], testData[i]);
                console.log(`Test: yLabel ${yLabel} , label1 ${perceptrons[j].label1} label2: ${perceptrons[j].label2} predictedLabel: ${predictedLabel} `);
                predicedLabelsCounter[predictedLabel]++;
            }
        }
        let maxPredictionLabel = Utilities.checkMaxPredicted(predicedLabelsCounter);
        maxPredictionLabel = convertLetterToNumber(maxPredictionLabel) ;
        console.log(`maxPredictionLabel: ${maxPredictionLabel}, yLabel: ${yLabel} `);
        if (maxPredictionLabel === yLabel) {
            console.log(`predicted true`);
            goodResults ++;
        }
    }
    console.log("accuracy: " + ((goodResults /testData.length) * 100) + "%");
}


/**
 * split all the data structure to train and test and put
 * it together in arrays train and test
 * @param data                      - the data stracture to split
 * @param LettersToSplit            - which letters together
 * @param trainPercent              - how much to dived the train and test  in percent
 */
function splitDataForTrainAndTest(data,LettersToSplit,trainPercent) {
    let testPrecent = 1 - trainPercent;
    for (let lettersIndex = 0 ; lettersIndex < LettersToSplit.length; lettersIndex++ ){
        let letterName = LettersToSplit[lettersIndex];
        let shuffledArray =  Utilities.shuffle(data[letterName].slice());
        divedToTrainAndTests (shuffledArray , testPrecent) ;
        Utilities.shuffle(trainData);
        Utilities.shuffle(testData);
    }
}

/**
 * take each letter data array and dived him train and test
 *
 * @param shuffledArray             - letter data array
 * @param testPrecent               - how much to dived the train and test  in percent
 */

function divedToTrainAndTests(shuffledArray, testPrecent) {
    let testSize = Math.floor(shuffledArray.length * testPrecent);

    for (let i = 0 ; i < testSize ;  i ++ ){
        if(shuffledArray[i]) {
            testData.push(shuffledArray.pop());
        }
    }
    let trainSize =  shuffledArray.length - testSize;
    for (let i = 0 ; i < trainSize; i ++ ){
        if(shuffledArray[i]) {
            trainData.push(shuffledArray[i]);
        }
    }
}

/**
 * The train of each perceptron learns by the algorithm of test and fix
 * @param perceptron                - perceptrom for training
 * @param trainData                 - the data for training
 */
function train(perceptron,trainData) {
    let label1 = convertLetterToNumber(perceptron.label1);
    let label2 = convertLetterToNumber(perceptron.label2);
    for (let index = 0 ; index < trainData.length ; index++){
        let yLabel = trainData[index][0];
        if(yLabel === label1 || yLabel === label2) {
            let isPassTrashold = prediction(perceptron, trainData[index]);
            let isLabel1 = (isPassTrashold && label1 === yLabel);
            let isLabel2 = (!isPassTrashold && label1 !== yLabel);
            if (!(isLabel1 || isLabel2)) {
                if (label1 === yLabel) {
                    for (let i = 0, j = 1; i < trainData.length; i++ , j++) {
                        perceptron.weights[i] += trainData[index][j];
                    }
                } else {
                    for (let i = 0, j = 1; i < trainData.length; i++ , j++) {
                        perceptron.weights[i] -= trainData[index][j] ;
                    }
                }
            }
        }
    }
}

/**
 * check if the predict if pass the line or not
 *
 * @param perceptron            - the trained perceptron
 * @param inputs                - the input from the data that never trained
 * @returns {string}            - which label predicted
 */
function test(perceptron,inputs) {
    let isPassTrashold = prediction(perceptron, inputs);
    let predictedLabel = "not predicted yet";
    if (isPassTrashold) {
        predictedLabel = perceptron.label1;
    } else {
        predictedLabel = perceptron.label2;
    }
    return predictedLabel;
}

/**
 * culc Weight * Input + Bias
 * @param perceptron            - perceptron that we working on
 * @param inputsArray           - the inputs of each pixel
 * @returns {boolean}           - pass the trashold or not
 */
function prediction(perceptron,inputsArray) {
    let score = 0;
    for (let i = 0 ,j = 1; i <  perceptron.weights.length ; j++, i++){
        score +=  inputsArray[j] * perceptron.weights[i];
    }
    score += perceptron.bais;
    return score > perceptron.treshold  ;
}

/**
 * change the label to gimatry number
 * @param label1            - the letter
 * @returns {*}             - the gimatry number
 */
function convertLetterToNumber(label1) {
    let gimatryNumber ;
    switch (label1){
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
