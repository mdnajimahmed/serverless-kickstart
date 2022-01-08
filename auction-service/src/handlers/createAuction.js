'use strict';

const uuid = require('uuid').v4
const AWS = require('aws-sdk')
const dynamodb = new AWS.DynamoDB.DocumentClient()

module.exports.handler = async (event) => {
  const body = JSON.parse(event.body)
  console.log(body)
  const now = new Date()
  const auction = {
    id : uuid(),
    title : body.title,
    status: "OPEN",
    createdAt : now.toISOString()
  }
  const saveResult = await dynamodb.put({
    TableName: process.env.AUCTION_TABLE_NAME,
    Item: auction
  }).promise()

  console.log("saveResult",saveResult)
  return {
    statusCode: 201,
    body: JSON.stringify(auction)
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};


// (()=> {
//   console.log("uuid",uuid)
// })()