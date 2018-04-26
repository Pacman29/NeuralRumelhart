import BaseNeuralNetworkManager from "../BaseNeuralNetwork/BaseNeuralNetworkManager";
import HiddenNeuralLayer from "./neuralLayers/HiddenNeuralLayer";
import OutputNeuralLayer from "./neuralLayers/OutputNeuralLayer";
import fs from 'mz/fs';

export default class MultilayerPerceptron extends BaseNeuralNetworkManager{
    constructor(){
        super();
        this._layers = [];
    }

    addHiddenLayer(inputsCount,learningSpeed,initWeightsFunction,actiavationFunction,neuronsCount){
        let layer = new HiddenNeuralLayer();
        for(let i = 0; i< neuronsCount; ++i)
            layer.addNeuron(inputsCount,learningSpeed,initWeightsFunction,actiavationFunction);
        this._layers.push(layer);
    }

    addOutputLayer(inputsCount,learningSpeed,initWeightsFunction,actiavationFunction,neuronsCount){
        let layer = new OutputNeuralLayer();
        for(let i = 0; i< neuronsCount; ++i)
            layer.addNeuron(inputsCount,learningSpeed,initWeightsFunction,actiavationFunction);
        this._layers.push(layer);
    }

    solve(inputs){
        let _results = inputs;
        this._layers.forEach(layer => {
            _results = layer.solve(_results)
        });
        return _results;
    }

    correction(result){
        let _result = result;
        for(let i = this._layers.length - 1; i >=0; --i ){
            let layer = this._layers[i];
            layer.correction(_result);
            _result = layer;
        }
    }

    reInitWeights(){
        this._layers.forEach(layer => {
            layer.reInitWeights();
        });
    }

    train(dataset,error, maxIterations){
        let flagCheck = true;
        let i = 0;
        while (flagCheck){
            flagCheck = false;
            dataset.forEach(data => {
                let res = this.solve(data.inputs);
                if(!error(res,data.result)){
                    if(!(i%500))
                       console.log(data.path);
                    flagCheck = true;
                    this.correction(data.result);
                }
            });
            if(i === maxIterations && flagCheck !== false){
                flagCheck = true;
                this.reInitWeights();
            }
            if(!(i%500)){
                dataset.forEach(data => {
                    let result = this.solve(data.inputs);
                    result = result.map(x => x.toFixed(3));
                    console.log(`${i}\t${data.path}\t${result}`)
                })
            }
            i++;
        }
    }

    async save(fileName){
        let config = [];
        this._layers.forEach(layer => {
            config.push(layer.saveNeuralLayer());
        });
        let obj = {
            neuralType: 'MultilayerPerceptron',
            neuralConfig: config,
        };
        try {
            await fs.writeFile(fileName,JSON.stringify(obj,null,2))
        } catch (err) {
            console.log('config not save');
        }
        console.log('config save');
    }

    static async load(fileName,initWeightsFunction,actiavationFunction){
        let data;
        try {
            data = JSON.parse(await fs.readFile(fileName, 'utf8'));
        } catch (err) {
            console.log('config not read');
        }
        if(data.neuralType !== 'MultilayerPerceptron'){
            console.log('config not support');
            return;
        }
        let network = new MultilayerPerceptron();
        data.neuralConfig.forEach(layer => {
            let newLayer;
            switch (layer.neuralLayerType){
                case 'HiddenNeuralLayer': {
                    newLayer = new HiddenNeuralLayer();
                    break;
                }
                case 'OutputNeuralLayer':{
                    newLayer = new OutputNeuralLayer();
                    break;
                }
            }
            newLayer.loadNeuralLayer(layer);
            newLayer.setActivationFunction(actiavationFunction);
            newLayer.setInitWeightsFunction(initWeightsFunction);
            network._layers.push(newLayer);
        });
        return network;
    }
}