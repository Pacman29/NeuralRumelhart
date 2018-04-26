import BaseNeuron from "../../BaseNeuralNetwork/neuros/baseNeuron";

export default class BaseMultilayerNeuron extends BaseNeuron {
    constructor(){
        super();
    }

    setActivationFunction(activationFunc){
        this._activationFunction = activationFunc;
    }

    _summator(inputs){
        let result = 0;
        this._inputsWeights.forEach((weight,i) => {
           result += weight * inputs[i];
        });
        result += this._bias;
        return result;
    }

    solve(inputs) {
        this._lastInputs = inputs;
        this._lastResult = this._activationFunction(this._summator(inputs));
        return this._lastResult;
    }

    _newSigma(){
        throw '_newSigma method is not owerride';
    }

    correction() {
        for(let i = 0; i<this._inputsWeights.length; ++i)
            this._inputsWeights[i] += this._learningSpeed * this._sigma * this._lastInputs[i];
        this._bias += this._sigma;
    }


    saveNeuron() {
        return super.saveNeuron();
    }

    loadNeuron(params){
        super.loadNeuron(params)
    }
}