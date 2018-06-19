var elasticsearch = require('elasticsearch');
const util = require('util');
var client = new elasticsearch.Client({
    host: 'localhost:9200',
});
async function testES() {
    try {
        const response = await client.search({
            q: 'pants'
        });
        console.log(util.inspect(response.hits.hits,{ compact: false, depth: 5, breakLength: 80 }))
    } catch (error) {
        console.trace(error.message)
    }
}
async function getBlock(blockno) {
const response = await client.search({
"body": {
"from" : 0, "size" : 1000,
"query" : {
                "match" : { 
                    "block_data.block_num" : blockno
                }
    }
}
})
 console.log('Block: '+blockno+' Ops: '+response.hits.hits.length);
}
//testES();
async function blocks() {
var i=25000000;
while (true) {
getBlock(i);
await sleep(2);
i++;
}
}
function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}
blocks();
