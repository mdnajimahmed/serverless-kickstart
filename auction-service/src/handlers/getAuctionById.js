'use strict';


const AWS = require('aws-sdk')
const dynamodb = new AWS.DynamoDB.DocumentClient()
const commonMiddleware = require('../lib/commonMiddleware').handler

const handler = async (event) => {
  let auction = null
  const id = event.pathParameters.id;
  try{
    const result = await dynamodb.get({
      TableName: process.env.AUCTION_TABLE_NAME,
      Key : {id}
    }).promise();
    auction = result.Item
  }catch(e){
    console.error(e)
    throw new createError.InternalServerError(e)
  }
  if(!auction){
    throw new createError.NotFound(`Auction not found with id = ${id}`)
  }
  return {
    statusCode : 200,
    body: JSON.stringify(auction)
  }
};


(()=> {
  console.log("uuid",commonMiddleware)
})()

module.exports.handler = commonMiddleware(handler)
