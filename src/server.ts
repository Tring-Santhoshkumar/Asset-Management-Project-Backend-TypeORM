import { ApolloServer } from "apollo-server-express";
import dataSource from "./database/data-source";
import { createSchema } from "./schema";
import dotenv from "dotenv";
import express from 'express'
const PORT = 3001;
dotenv.config();


async function startServer() {

    const app = express() as any;

    await dataSource.initialize();
    console.log('Database is connected!');

    const schema = await createSchema();
    
    const apolloServer = new ApolloServer({ schema });

    await apolloServer.start();

    apolloServer.applyMiddleware({ app });
  
    app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}/graphql`));
  }
  
startServer();


// dataSource.initialize().then( async ()  => {
        
//         // await dataSource.initialize();
//         // console.log('Database is connected!');
//         const schema = await createSchema();
//         // app.use(cors({ origin: 'http://localhost:3000', credentials: true}));
//         // app.use(express.json())
//         const server = new ApolloServer({
//             schema
//         })
//         await server.start();
//         console.log("Server Started")
//         app.use(
//             "/graphql",
//             cors({ origin: 'http://localhost:3000', credentials: true}),
//             express.json(),
//             expressMiddleware(server, {
//                 context: async ({ req }) => {
//                     const authHeader = req.headers.authorization || "";
//                     const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
//                     let decoded = null;
//                     if (token) {
//                         try {
//                             decoded = jwt.verify(token, process.env.SECRET_KEY || "santhosh123");
//                             console.log("DECODED:", decoded);
//                         } catch (err) {
//                             console.error("Error in token verification", err);
//                         }
//                     }
//                     return { token, decoded };
//                 }
//             })
//         );
//         app.listen(PORT, () => {
//             console.log(` Server is running on http://localhost:${PORT}/graphql`);
//         });
// }).catch((error) => {
//     console.log('error',error);
// })
// }

// startServer();


//             context: ({ req }) => {
//                 const authHeader = req.headers.authorization || "";
//                 const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
//                 let decoded = null;
//                 if (token) {
//                     try{
//                         decoded = jwt.verify(token, process.env.SECRET_KEY || 'santhosh123');
//                         console.log("DECODED : ", decoded);
//                     }
//                     catch(err){
//                         console.error('Error in token verification',err);
//                     }
//                 }
//                 return { token, decoded };
//             }
//         })



//         const { url } = await startStandaloneServer(server, {
//             listen: { port: 3001 }
//         })
//         console.log( `Server is running on ${url}`);

//     }
//     catch(error){
//         console.log("Error in server",error);
//     }
// }

// startServer();
