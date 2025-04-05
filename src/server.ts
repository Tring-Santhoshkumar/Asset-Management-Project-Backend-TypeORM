import { ApolloServer } from "apollo-server-express";
import dataSource from "./database/data-source";
import { createSchema } from "./schema";
import dotenv from "dotenv";
import express from 'express';
import jwt from 'jsonwebtoken';
dotenv.config();

async function startServer() {

    const app = express() as any;

    await dataSource.initialize();

    console.log('Database is connected!');

    const schema = await createSchema();
    
    const apolloServer = new ApolloServer({ 
        schema,
        context: ({ req }) => {
        const authHeader = req.headers.authorization || '';
        const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
        let decoded = null;
        if (token) {
            try{
                decoded = jwt.verify(token as string, process.env.SECRET_KEY as string);
            }catch(error : any) {
                throw new Error(error);
            }
        }
        return { token, decoded };
    } 
    });
    
    await apolloServer.start();

    apolloServer.applyMiddleware({ app });
  
    app.listen(process.env.BACKEND_PORT, () => console.log(`Server is running on http://localhost:${process.env.BACKEND_PORT}/graphql`));
  }
  
startServer();
