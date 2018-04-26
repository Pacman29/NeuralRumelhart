import BaseMultilayerNeuron from "./baseMultilayerNeuron";

export default class HiddenNeuron extends BaseMultilayerNeuron{
    constructor(){
        super()
    }

    _newSigma(nextNeuronsCount,nextSigmas,nextWeights){
        this._sigma = this._lastResult *(1-this._lastResult);

        let sum = 0;
        for(let i = 0; i<nextNeuronsCount; ++i)
            sum += nextSigmas[i]*nextWeights[i];
        this._sigma *= sum;
    }

    correction(nextNeuronsCount,nextSigmas,nextWeights) {
        this._newSigma(nextNeuronsCount,nextSigmas,nextWeights);
        super.correction();
    }

    saveNeuron() {
        let neuronParams = super.saveNeuron();
        return {
            neuronType: 'HiddenNeuron',
            neuronParams
        }
    }
}