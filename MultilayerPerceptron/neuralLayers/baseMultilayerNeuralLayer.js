import BaseNeuralLayer from "../../BaseNeuralNetwork/neuralLayers/baseNeuralLayer";

export default class BaseMultilayerNeuralLayer extends BaseNeuralLayer{
    constructor(){
        super()
    }

    addNeuron(neuron ,inputsCount,learningSpeed,initWeightsFunction,actiavationFunction){
        neuron.setInitWeightsFunction(initWeightsFunction);
        neuron.initInputsWeights(inputsCount);
        neuron.setActivationFunction(actiavationFunction);
        neuron.setLearningSpeed(learningSpeed);
        super.addNeuron(neuron);
    }

    solve(inputs) {
        let results = [];
        this._neurons.forEach((neuron) => {
            results.push(neuron.solve(inputs));
        });
        return results;
    }

    correction() {
        super.correction();
    }

    saveNeuralLayer(){
        return super.saveNeuralLayer();
    }

    loadNeuralLayer(){
        super.loadNeuralLayer();
    }

    setActivationFunction(activationFunction){
        this._neurons.forEach(neuron => {
            neuron.setActivationFunction(activationFunction);
        })
    }

    setInitWeightsFunction(initWeightsFunction){
        this._neurons.forEach(neuron => {
            neuron.setInitWeightsFunction(initWeightsFunction);
        })
    }
}