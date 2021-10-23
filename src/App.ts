import express from'express'
import Controller from "./admin/controllers/Controller";
import * as dotenv from 'dotenv';
import mongoose from "mongoose";
import morgan from "morgan"
import errorHandlerMiddleware from "./middleware/error-handler";
import logger from './utils/Logger'
require ('express-async-errors')

dotenv.config({ path:'../.env' });


export class App {

    public app: express.Application

    constructor(controllers: Controller[]){
        this.app = express();
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
    }

    private async connectToTheDatabase() {
        const {
            DB_URL,
            DB_NAME
        } = process.env;
        await mongoose.connect(DB_URL as string + DB_NAME);
    }

    private initializeMiddlewares() {
        this.app.use(morgan('tiny'))
        this.app.use(express.json())
    }

    private initializeControllers(controllers: Controller[]) {
        controllers.forEach((controller) => {
            this.app.use('/api/v2/', controller.router);
        });
    }

    private initializeErrorHandling() {
        this.app.use(errorHandlerMiddleware)
    }

    // public getServer() {
    //     return this.app;
    // }

    public listen() {
                this.connectToTheDatabase().then((error)=> {
            this.app.listen(process.env.PORT, () => {
                logger.info(`App listening on the port ${process.env.PORT}...`);
            });
        }).catch(error => {
                    console.log(error)
            logger.info('Error connecting to database')
        })
    }
}
