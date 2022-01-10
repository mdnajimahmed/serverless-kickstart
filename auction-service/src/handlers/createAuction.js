'use strict';

const uuid = require('uuid').v4
const AWS = require('aws-sdk')
const dynamodb = new AWS.DynamoDB.DocumentClient()
const commonMiddleware = require('../lib/commonMiddleware').handler
const createError = require('http-errors')
const validator = require('@middy/validator')
const createAuctionSchema = require('../lib/schema/createAuctionSchema').schema


const handler = async (event) => {
  const body = event.body
  console.log(body)
  const createdAt = new Date()
  const endedAt = new Date(Date.now() + 1 * (60 * 60 * 1000) );
  const auction = {
    id: uuid(),
    title: body.title,
    status: "OPEN",
    createdAt: createdAt.toISOString(),
    endedAt: endedAt.toISOString(),
    highestBid: {
      amount: 0
    }
  }
  try {
    await dynamodb.put({
      TableName: process.env.AUCTION_TABLE_NAME,
      Item: auction
    }).promise()
  } catch (e) {
    console.error(e)
    throw new createError.InternalServerError(e)
  }
  return {
    statusCode: 201,
    body: JSON.stringify(auction)
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};


// (()=> {
//   console.log("uuid",commonMiddleware)
// })()

module.exports.handler = commonMiddleware(handler).use(
  validator({
    inputSchema:createAuctionSchema
  })
)