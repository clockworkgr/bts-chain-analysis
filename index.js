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
       console.log(JSON.stringify(JSON.parse(op._source.operation_history.op)));
    }
    //console.log(opscount);
    await getBlock(blockno+1)
    
}

async function importBlocks(since) {
    await  getBlock(since);
}
function extractFeeInfo(op) {
    let op_id;
    let op_type;
    let fee;
    let asset_id;
    let payer;

    op_type=op[0];
    fee=op[1].fee.amount;
    asset_id=op[1].fee.asset_id;
    switch(op_type) {
        case 0:
            payer=op[1].from;
            break;
        case 3:
            payer=op[1].funding_account;
            break;
        case 5:
            payer=op[1].registrar;
            break;
        case 6:
            payer=op[1].account;
            break;
        case 8:
            payer=op[1].account_to_upgrade;
            break;
        case 10:
            payer=op[1].issuer;
            break;
        case 11:
            payer=op[1].issuer;
            break;
        case 14:
            payer=op[1].issuer;
            break;
        case 15:
            payer=op[1].payer;
            break;
        case 16:
            payer=op[1].from_account;
            break;
        case 17:
            payer=op[1].account;
            break;
        case 19:
            payer=op[1].publisher;
            break;
        case 22:
            payer=op[1].fee_paying_account;
            break;
        case 23:
            payer=op[1].fee_paying_account;
            break;
        case 32:
            payer=op[1].creator;
            break;
        case 33:
            payer=op[1].owner;
            break;
        case 33:
            payer=op[1].owner;
            break;
    }
}
importBlocks(22758700);