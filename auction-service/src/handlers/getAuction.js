'use strict';


const AWS = require('aws-sdk')
const dynamodb = new AWS.DynamoDB.DocumentClient()
const commonMiddleware = require('../lib/commonMiddleware').handler
const createError = require('http-errors')

const handler = async (event) => {
  let auctions = []
  try{
    const result = await dynamodb.scan({
      TableName: process.env.AUCTION_TABLE_NAME,

    }).promise();
    auctions = result.Items
    console.log("auctions",auctions)
  }catch(e){
    console.error(e)
    throw new createError.InternalServerError(e)
  }
  return {
    statusCode : 200,
    body: JSON.stringify(auctions)
  }
};


(()=> {
  console.log("uuid",commonMiddleware)
})()

module.exports.handler = commonMiddleware(handler)