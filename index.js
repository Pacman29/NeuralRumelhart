import MultilayerPerceptron from "./MultilayerPerceptron";
import random from "./BaseNeuralNetwork/lib/random";
import Dataset from "./DatasetLow";

async function testMultilayer(){
    let dataset = [
        {
            inputs: [0,0],
            result: [0],
        },
        {
            inputs: [0,1],
            result: [1],
        },
        {
            inputs: [1,0],
            result: [1],
        },
        {
            inputs: [1,1],
            result: [0],
        },
    ];
    let net = new MultilayerPerceptron();
    let initWeightsFunc = () => {
        return random(-1,1)*random(0,0.01);
    };
    let activationFunction = (x) => {
        return 1/(1 + Math.exp(-x))
    };
    let error = (nowResult,expResult) => {
        let err = Math.abs(expResult[0] - nowResult[0]);
        return err < 0.01;
    };

    net.addHiddenLayer(2,1,initWeightsFunc,activationFunction,2);
    net.addOutputLayer(2,1,initWeightsFunc,activationFunction,1);

    console.log('START TRAIN');
    net.train(dataset,error,10000000);


    console.log('CHECK');
    dataset.forEach(data => {
        console.log(`${data.inputs}\t${net.solve(data.inputs)}`)
    });
    net.save('test_config.json');

    let net2 =  await MultilayerPerceptron.load('test_config.json',initWeightsFunc,activationFunction);
    console.log('CHECK');
    dataset.forEach(data => {
        console.log(`${data.inputs}\t${net2.solve(data.inputs)}`)
    });
}

let initWeightsFunc = () => {
    return random(0.00001,0.01);
};
let activationFunction = (x) => {
    return 1/(1 + Math.exp(-x))
};
let error = (nowResult,expResult) => {
    let errs = [];
    expResult.forEach((expRes,i) => {
        errs.push(Math.abs(expResult[i] - nowResult[i]))
    });
    let sumErr = Math.max(...errs);
    return sumErr < 0.1;
};

async function multilayerCreateConfig(){
    let dataset = await Dataset.loadDataset('dataset.json');
    let net = new MultilayerPerceptron();

    net.addHiddenLayer(dataset[0].inputs.length,0.01,initWeightsFunc,activationFunction,2*dataset[0].inputs.length);
    net.addOutputLayer(2*dataset[0].inputs.length,0.01,initWeightsFunc,activationFunction,10);

    console.log('START TRAIN');
    net.train(dataset,error,10000000);


    console.log('CHECK');
    dataset.forEach(data => {
        console.log(`${data.inputs}\t${net.solve(data.inputs)}`)
    });
    net.save('test_config_multilayer.json');
}

async function multilayerSolver(img) {
    let imgArray = await Dataset.imageToArray(img);
    let net = await MultilayerPerceptron.load("test_config_multilayer.json",initWeightsFunc,activationFunction);
    return net.solve(imgArray);
}

async function imageLoadTest() {
    let DSCreator = new Dataset();
    let dataset = await DSCreator.createDataset('Dataset');
    DSCreator.saveDataset();
    console.log(dataset);

}

async function calcError() {
    let DSCreator = new Dataset();
    let dirs = await DSCreator._getDirs('Dataset');
    let ok = 0;
    let count = 0;
    let char = 0;
    for(let dir of dirs){
        let _count =0;
        let _ok = 0;
        let imgFiles = await DSCreator._getFiles(dir.path);
        for(let imgFile of imgFiles){
            let res = await multilayerSolver(`${dir.path}/${imgFile}`);
            if(res.indexOf(Math.max(...res)) === char){
                ok++;
                _ok++;
            }
            count++;
            _count++;
        }
        console.log(`er ${char}: ${_ok}/${_count} = ${_ok/_count}`)
        char++;
    }
    console.log(`ERROR: ${ok}/${count} = ${ok/count}`)
}
(async function main() {
    //testMultilayer();
    //await imageLoadTest();
    //await multilayerCreateConfig();

    await calcError();

    // let res = await multilayerSolver('Г.png');
    // let maxIndex = res.indexOf(Math.max(...res));
    // console.log(maxIndex);
})();