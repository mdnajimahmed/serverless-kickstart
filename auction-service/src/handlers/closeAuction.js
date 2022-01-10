
const AWS = require('aws-sdk')
const dynamodb = new AWS.DynamoDB.DocumentClient()
const getEndedAuctions = require('../lib/getEndedAuctions').handler
const closeAuction = require('../lib/closeAuction').handler
const createError = require('http-errors')

const handler = async (event) => {
    try{
        console.log("My close auction handler")
        const auctionsToClose = await getEndedAuctions()
        console.log("auctionsToClose",auctionsToClose)
        const closePromises = auctionsToClose.Items.map(auction => closeAuction(auction))
        console.log("closePromises",closePromises)
        await Promise.all(closePromises)
        return {
            close : closePromises.length
        }
    }catch(e){
        console.error(e)
        throw new createError.InternalServerError(e)
    }
};
  
  
//   (async ()=> {
//     const result = await getEndedAuctions()
//     console.log("Result",result)
//   })()
  
  module.exports.handler = handler