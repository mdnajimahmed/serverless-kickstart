'use strict';

const AWS = require('aws-sdk')
const dynamodb = new AWS.DynamoDB.DocumentClient()
const commonMiddleware = require('../lib/commonMiddleware').handler
const createError = require('http-errors')

const validator = require('@middy/validator')
const placeBidSchema = require('../lib/schema/placeBidSchema').schema


// classic locking problem
// use redis to lock the item
// use sqs fifo queue to update auctions asynchrnously, use itemid as grp in fifo queue.

const handler = async (event) => {
  const { id } = event.pathParameters
  const { amount } = event.body
  const params = {
    TableName: process.env.AUCTION_TABLE_NAME,
    Key: { id },
    UpdateExpression: "set highestBid = :highestBid",
    ExpressionAttributeValues: {
      ':highestBid': {
        amount
      },
      ':amount':amount,
      ':openStatus':'OPEN'
    },
    ConditionExpression: "attribute_not_exists(#highestBid) or (#highestBid.amount < :amount and #status = :openStatus)",
    ExpressionAttributeNames: {
      "#highestBid": "highestBid",
      "#status": "status"
    },
    ReturnValues: 'ALL_NEW'
  }

  let updatedAuction = null
  try {
    const result = await dynamodb.update(params).promise();
    updatedAuction = result.Attributes
    console.log("updatedAuction", updatedAuction)
  } catch (e) {
    console.error("myerror = ",e)
    console.error("debug => code = ",e.code,' eq = ',e.code == 'ConditionalCheckFailedException')
    if (e.code == 'ConditionalCheckFailedException'){
      throw new createError.BadRequest(`${amount} is not the highest bid`)
    }
    throw new createError.InternalServerError(e)
  }
  return {
    statusCode: 200,
    body: JSON.stringify(updatedAuction)
  }
};

// (() => {
//   console.log("uuid", commonMiddleware)
// })()

module.exports.handler = commonMiddleware(handler).use(
  validator({
    inputSchema:placeBidSchema
  })
)