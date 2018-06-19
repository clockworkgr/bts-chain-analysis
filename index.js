var elasticsearch = require('elasticsearch');
const util = require('util');
var client = new elasticsearch.Client({
    host: 'localhost:9200',
});


function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

async function getBlock(blockno) {
    const response = await client.search({
        "body": {
            "from": 0,
            "size": 1000,
            "query": {
                "match": {
                    "block_data.block_num": blockno
                }
            }
        }
    });
    console.log(response.hits.hits);
}

async function importBlocks(since) {
    var i = since;
    while (true) {
        getBlock(i);
        await sleep(1);
        i++;
    }
}

importBlocks(27000000);