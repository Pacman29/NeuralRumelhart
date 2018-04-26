import BaseMultilayerNeuron from "./baseMultilayerNeuron";

export default class OutputNeuron extends BaseMultilayerNeuron{
    constructor(){
        super()
    }

    _newSigma(needValue) {
        this._sigma = this._lastResult*(1 - this._lastResult)*(needValue-this._lastResult);
    }

    correction(needValue) {
        this._newSigma(needValue);
        super.correction();
    }


    saveNeuron() {
        let neuronParams = super.saveNeuron();
        return {
            neuronType: 'OutputNeuron',
            neuronParams
        }
    }
}