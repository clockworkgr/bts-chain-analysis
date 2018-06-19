var elasticsearch = require('elasticsearch');
const util = require('util');
var client = new elasticsearch.Client({
    host: 'localhost:9200',
});
var opscount=[];

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
    for(var j=0;j<response.hits.hits.length;j++) {
        let op= response.hits.hits[j];
        if (opscount[op._source.operation_type]!=undefined) {
            opscount[op._source.operation_type]=opscount[op._source.operation_type]+1;
        }else{
            opscount[op._source.operation_type]=1;
        }
        console.log(opscount);
       //console.log(JSON.stringify(JSON.parse(op._source.operation_history.op)));
    }
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