'use strict';

const AWS = require('aws-sdk')
const dynamodb = new AWS.DynamoDB.DocumentClient()
const commonMiddleware = require('../lib/commonMiddleware').handler

const handler = async (event) => {
  const {id} = event.pathParameters
  const {amount} = event.body
  // const params = {
  //   TableName: process.env.AUCTION_TABLE_NAME,
  //   Key: {id},
  //   UpdateExpression: "set highestBid.amount = :amount",
  //   ExpressionAttributeValues : {
  //     ':amount':amount
  //   },
  //   ReturnValues: 'ALL_NEW'
  // }
  const params = {
    TableName: process.env.AUCTION_TABLE_NAME,
    Key: {id},
    UpdateExpression: "set highestBid = :highestBid",
    ExpressionAttributeValues : {
      ':highestBid':{
        amount
      }
    },
    ReturnValues: 'ALL_NEW'
  }

  let updatedAuction = null
  try{
    const result = await dynamodb.update(params).promise();
    updatedAuction = result.Attributes
    console.log("updatedAuction",updatedAuction)
  }catch(e){
    console.error(e)
    throw new createError.InternalServerError(e)
  }
  return {
    statusCode : 200,
    body: JSON.stringify(updatedAuction)
  }
};

(()=> {
  console.log("uuid",commonMiddleware)
})()

module.exports.handler = commonMiddleware(handler)