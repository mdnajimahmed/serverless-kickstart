const schema = {
    type:"object",
    required:['queryStringParameters'],
    properties:{
        queryStringParameters:{
            type:'object',
            // required:["status"],
            properties:{
                status:{
                    type:'string',
                    enum:['OPEN','CLOSED'],
                    default:'OPEN'
                }
            }
        }
    }
    
}

module.exports.schema = schema