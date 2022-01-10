
const AWS = require('aws-sdk')
const dynamodb = new AWS.DynamoDB.DocumentClient()

const handler = async (auction) => {
    const params = {
        TableName: process.env.AUCTION_TABLE_NAME,
        Key: {
            id: auction.id
        },
        UpdateExpression: 'set #status = :status',
        ExpressionAttributeNames: {
            "#status": "status"
        },
        ExpressionAttributeValues: {
            ':status': 'CLOSED',
        }
    }
    const result = await dynamodb.update(params).promise()
    return result
};


module.exports.handler = handler