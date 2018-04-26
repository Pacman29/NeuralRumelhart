import BaseMultilayerNeuralLayer from "./baseMultilayerNeuralLayer";
import HiddenNeuron from "../neurons/hiddenNeuron";

export default class HiddenNeuralLayer extends BaseMultilayerNeuralLayer{
    constructor(){
        super()
    }

    addNeuron(inputsCount,learningSpeed,initWeightsFunction,actiavationFunction){
        let neuron = new HiddenNeuron();
        super.addNeuron(neuron,inputsCount,learningSpeed,initWeightsFunction,actiavationFunction);
    }

    correction(nextLayer){
        let nextNeurons = nextLayer.getNeurons();
        let nextSigmas = [];
        nextNeurons.forEach(neuron => {
            nextSigmas.push(neuron.getSigma());
        });
        this._neurons.forEach((neuron,i) => {
            let nextWeights = [];
            nextNeurons.forEach(nextNeuron => {
                let weights = nextNeuron.getInputsWeights();
                nextWeights.push(weights[i]);
            });
            neuron.correction(nextSigmas.length,nextSigmas,nextWeights);
        })
    }

    saveNeuralLayer(){
        let obj = super.saveNeuralLayer();
        obj.neuralLayerType = 'HiddenNeuralLayer';
        return obj;
    }

    loadNeuralLayer(layer){
        if(layer.neuralLayerType !== 'HiddenNeuralLayer')
            throw 'layer is not HiddenNeuralLayer';

        layer.neurons.forEach(neuron => {
            if(neuron.neuronType !== 'HiddenNeuron')
                throw 'incorrect neuronType';

            let newNeuron = new HiddenNeuron();
            newNeuron.loadNeuron(neuron.neuronParams);
            this._neurons.push(newNeuron);
        })
    }
}