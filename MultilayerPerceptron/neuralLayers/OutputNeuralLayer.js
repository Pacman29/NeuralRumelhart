import BaseMultilayerNeuralLayer from "./baseMultilayerNeuralLayer";
import OutputNeuron from "../neurons/outputNeuron";
import HiddenNeuron from "../neurons/hiddenNeuron";

export default class OutputNeuralLayer extends BaseMultilayerNeuralLayer{
    constructor(){
        super()
    }

    addNeuron(inputsCount,learningSpeed,initWeightsFunction,actiavationFunction){
        let neuron = new OutputNeuron();
        super.addNeuron(neuron,inputsCount,learningSpeed,initWeightsFunction,actiavationFunction);
    }

    correction(needValues){
        this._neurons.forEach((neuron,i) => {
            neuron.correction(needValues[i]);
        })
    }

    saveNeuralLayer(){
        let obj = super.saveNeuralLayer();
        obj.neuralLayerType = 'OutputNeuralLayer';
        return obj;
    }

    loadNeuralLayer(layer){
        if(layer.neuralLayerType !== 'OutputNeuralLayer')
            throw 'layer is not OutputNeuralLayer';

        layer.neurons.forEach(neuron => {
            if(neuron.neuronType !== 'OutputNeuron')
                throw 'incorrect neuronType';

            let newNeuron = new OutputNeuron();
            newNeuron.loadNeuron(neuron.neuronParams);
            this._neurons.push(newNeuron);
        })
    }
}