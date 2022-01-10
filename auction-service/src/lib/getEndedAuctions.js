
const AWS = require('aws-sdk')
const dynamodb = new AWS.DynamoDB.DocumentClient()
const handler = async (event) => {
    const now = new Date()
    const params = {
        TableName: process.env.AUCTION_TABLE_NAME,
        IndexName: 'statusAndEndedAt',
        KeyConditionExpression: '#status = :status AND endedAt <= :now',
        ExpressionAttributeValues: {
          ':status': 'OPEN',
          ':now':now.toISOString()
        },
        ExpressionAttributeNames: {
          "#status": "status"
        },
        ReturnValues: 'ALL_NEW'
      }
    const result = await dynamodb.query(params).promise()
    console.log("returning auction to close = " , now.toISOString(), result)
    return result
};
  

module.exports.handler = handler