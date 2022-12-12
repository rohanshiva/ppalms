import { Pool, QueryResult } from "pg";
import pgConfig = require("../config/DB.json");

let pool = new Pool(pgConfig.local);
if(process.env.DB_MODE === "remote"){
    pool = new Pool(pgConfig.remote);
}

function query(text:string, args:any[], callback:(err:Error, res:QueryResult)=>void){
    return pool.query(text, args, callback);
}

const DB = {
    query: query
}

export default DB