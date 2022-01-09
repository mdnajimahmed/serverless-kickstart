'use strict';

const uuid = require('uuid').v4
const AWS = require('aws-sdk')
const dynamodb = new AWS.DynamoDB.DocumentClient()
const commonMiddleware = require('../lib/commonMiddleware').handler
const createError = require('http-errors')

const handler = async (event) => {
  const body = event.body
  console.log(body)
  const now = new Date()
  const auction = {
    id: uuid(),
    title: body.title,
    status: "OPEN",
    createdAt: now.toISOString(),
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

module.exports.handler = commonMiddleware(handler)