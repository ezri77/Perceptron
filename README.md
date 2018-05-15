# Perceptron



We were asked in Neuro-calculations lecture to implement a working perceptron (i.e. one McCullough-Pitts style neuron) system that can identify Hebrew Script amongst the seven letters the class prepared data for.

This system built in JavaScript with NodeJs Modules by 4 steps:
1. Write the database of 7 handwritten words in Hebrew and covert it to maniset binary vector. 
We were writing the words on 13 * 13 matrix and then convert it to a binary array that represents this word by in each cell that the handwritten letter pass we write 1 otherwise we write 0.
2. Read the data from the CSV files by node module and convert it to fit data structure  that represented by an object that each attribute consist an array of arrays from this specified letter
3. Implement one perceptron that will train the threshold by 80% of the data with the test&fix algorithm to accomplish linear isolating between each tow letters.
4. General the idea of step 3, To create one layer network that recognizing between all the 7 words by that each neuron isolating between 2 letters (and not between one to all other because of the lack of data).

The final accuracy that we got to is 84%. 


![alt text](https://github.com/ezri77/Perceptron/blob/master/mnist-input.png)


 

