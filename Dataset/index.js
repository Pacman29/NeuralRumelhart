import jimp from 'jimp';
import fs from 'mz/fs';

export default class Dataset {
    static async imageToArray(filename){
        let img;
        try {
            img = await jimp.read(filename);
        }catch (e) {
            throw e;
        }
        img.resize(10,10);
        let result = [];
        img.bitmap.data.reduce((prevVal,cur) => {
            if(prevVal.length === 4){
                let flagAllZero = prevVal.find((item) => {
                    return item !== 0;
                });

                result.push( !flagAllZero ? 0 : 1);
                prevVal = [];
            }
            prevVal.push(cur);
            return prevVal;
        },[]);

        return result;
    }

    _datasetObject(array,letter){
        letter = letter.toLowerCase();
        let charcode = letter.charCodeAt();
        let idx;
        if(charcode === 1105)
            idx = 32;
        else
            idx = charcode - 1072;
        let result = {
            inputs: array,
            result: []
        };

        result.result.length = 5;
        result.result.fill(0);
        result.result[idx] = 1;
        return result;
    }

    async _getDirs(root){
        let files;
        let dirs = [];
        try {
            files =  await fs.readdir(root);
            for(let file of files){
                let stats = await fs.stat(`${root}/${file}`);
                if(stats.isDirectory())
                    dirs.push({
                        path: `${root}/${file}`,
                        char: `${file}`
                    });
            }
        } catch (e) {
            throw e;
        }
        return dirs;
    }

    async _getFiles(root){
        let files;
        try {
            files =  await fs.readdir(root);
        } catch (e) {
            throw e;
        }
        return files;
    }

    async createDataset(root = '.'){
        let dataset = [];
        let dirs = await this._getDirs(root);
        for(let dir of dirs){
            let imgFiles = await this._getFiles(dir.path);
            imgFiles = imgFiles.slice(0,30);
            for(let imgFile of imgFiles){
                let imgArray = await Dataset.imageToArray(`${dir.path}/${imgFile}`);
                let obj = this._datasetObject(imgArray,dir.char);
                obj.path = `${dir.path}/${imgFile}`;
                dataset.push(obj);
                console.log(`${dir.path}/${imgFile}`);
            }
        }
        this.dataset = dataset;
        return dataset;
    }

    async saveDataset(){
        try {
            await fs.writeFile('dataset.json',JSON.stringify(this.dataset,null,2));
        }catch (e) {
            throw e;
        }
    }

    static async loadDataset(filename){
        let dataset;
        try {
            dataset = JSON.parse(await fs.readFile(filename, 'utf8'));
        } catch (e) {
            throw e;
        }
        return dataset;
    }
}