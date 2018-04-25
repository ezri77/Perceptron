module.exports = {
    culcDataLength : culcDataLength,
    LettersToCuples : LettersToCuples,
    initWeights: initWeights,
    changeToBipolar : changeToBipolar,
    shuffle : shuffle,
    checkMaxPredicted : checkMaxPredicted,
    printItration :printItration,
    duplicateArray : duplicateArray

};

/**
 * Calculate the length of the data
 * @param data data structure
 */

function culcDataLength(data) {
    let sum = 0;
    for (let letterName in data){
        sum += data[letterName].length;
    }
    console.log("All data length is: " + sum);
}

function LettersToCuples(lettersName){
    let cuples = [];
    for(let i = 0 ; i < lettersName.length ; i ++) {
        for (let j = i + 1 ; j < lettersName.length ; j++) {
            let oneCuple = [] ;
            oneCuple.push(lettersName[i]);
            oneCuple.push(lettersName[j]);
            cuples.push(oneCuple);
        }
    }
    return cuples;
}

function printItration(cPP,cNN,cPN,cNP) {
    console.log("\tPass |\tneedTo | counter");
    console.log('\t---------------------------');
    console.log("\tPos \tPos \t" + cPP);
    console.log("\tNeg \tNeg \t" + cNN);
    console.log("\tPos \tNeg \t" + cPN);
    console.log("\tNeg \tPos \t" + cNP);
}


function initWeights(weightsSize) {
    let weight = [] ;
    for (let i = 0; i < weightsSize; i++) {
        weight[i] =  Math.random() ;
    }
    return weight;
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

function checkMaxPredicted(predicedLabelsCounter){
    let maxLetter ;
    let maxCounter = 0 ;
    for (let maxAttr in predicedLabelsCounter){
        if (predicedLabelsCounter.hasOwnProperty(maxAttr) && predicedLabelsCounter[maxAttr] > maxCounter ){
            maxCounter =  predicedLabelsCounter[maxAttr];
            maxLetter = maxAttr;
        }
    }
    return maxLetter;
}


function duplicateArray(shuffleArray) {
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
}


function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}