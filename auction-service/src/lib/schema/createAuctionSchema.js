const schema = {
    type:"object",
    required:['body'],
    properties:{
        body:{
            type:'object',
            required:["title"],
            properties:{
                title:{
                    type:'string'
                }
            }
        }
    }
    
}

module.exports.schema = schema