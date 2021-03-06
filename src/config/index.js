import * as dotenv from "dotenv";
import Web3 from 'web3';
import mongoose from "mongoose";
import Product from '../abis/Product.json'

dotenv.config();

const PORT = process.env.PORT || 4001;
const db = mongoose.connection;

const modelOptions = {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
}

const startApplication = (app) => {
    mongoose.connect(process.env.DB_HOST, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        })
        .then(() => {
            app.listen(PORT, () => {
                console.log(`Listening on port ${PORT}`);
            });
        })
        .catch(error => {
            console.log(error)
        })

    db.once("open", () => {
        console.log('connected to database!');
    });
    db.on("error", console.error.bind(console, "connection error:"));
};

const web3 = new Web3(Web3.providers.HttpProvider("http://127.0.0.1:8545"));
const networkId = async () => web3.eth.net.getId();
const productNetworkData = async () => Product.networks[await networkId()]
const productContractAddress = async () => await productNetworkData.address;
const productContract = async () => new web3.eth.Contract(Product.abi, await productContractAddress());


export {
    web3,
    productContract,
    startApplication,
    modelOptions
}