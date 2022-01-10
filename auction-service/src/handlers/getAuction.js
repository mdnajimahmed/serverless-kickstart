'use strict';


const AWS = require('aws-sdk')
const dynamodb = new AWS.DynamoDB.DocumentClient()
const commonMiddleware = require('../lib/commonMiddleware').handler
const createError = require('http-errors')
const validator = require('@middy/validator')
const getAuctionSchema = require('../lib/schema/getAuctionSchema').schema

const handler = async (event) => {
  const {status} = event.queryStringParameters;
  let auctions = []
  const params = {
    TableName: process.env.AUCTION_TABLE_NAME,
    IndexName: 'statusAndEndedAt',
    KeyConditionExpression: '#status = :status',
    ExpressionAttributeValues: {
      ':status': status,
    },
    ExpressionAttributeNames: {
      "#status": "status"
    }
  }
  try{
    const result = await dynamodb.query(params).promise();
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


// (()=> {
//   console.log("uuid",commonMiddleware)
//   // invokes the handler, note that property foo is missing
//   const event = {
//     queryStringParameters: {}
//   }
//   const handlerTest = commonMiddleware(handler).use(validator({
//     inputSchema: getAuctionSchema,
//     useDefaults: true
//   }))
//   handlerTest(event, {}, (err, res) => {
//     t.is(err.message,'Event object failed validation')
//   })
// })()

module.exports.handler = commonMiddleware(handler).use(validator({
  inputSchema: getAuctionSchema,
  useDefaults: true
}))