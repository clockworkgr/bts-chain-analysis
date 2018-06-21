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
       console.log(extractFeeInfo(op._source.operation_history.op));
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
        case 7:
            payer=op[1].authorizing_account;
            break;
        case 8:
            payer=op[1].account_to_upgrade;
            break;
        case 9:
            payer=op[1].account_id;
            break;
        case 10:
            payer=op[1].issuer;
            break;
        case 11:
            payer=op[1].issuer;
            break;
        case 12:
            payer=op[1].issuer;
            break;
        case 13:
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
        case 18:
            payer=op[1].issuer;
            break;
        case 19:
            payer=op[1].publisher;
            break;
        case 20:
            payer=op[1].witness_account;
            break;
        case 21:
            payer=op[1].witness_account;
            break;
        case 22:
            payer=op[1].fee_paying_account;
            break;
        case 23:
            payer=op[1].fee_paying_account;
            break;
        case 24:
            payer=op[1].fee_paying_account;
            break;
        case 25:
            payer=op[1].withdraw_from_account;
            break;
        case 26:
            payer=op[1].withdraw_from_account;
            break;
        case 27:
            payer=op[1].withdraw_to_account;
            break;
        case 28:
            payer=op[1].withdraw_from_account;
            break;
        case 29:
            payer=op[1].committee_member_account;
            break;
        case 30:
            payer=op[1].committee_member_account;
            break;
        case 31:
            payer="1.2.0";
            break;
        case 32:
            payer=op[1].creator;
            break;
        case 33:
            payer=op[1].owner;
            break;
        case 34:
            payer=op[1].owner;
            break;
        case 35:
            payer=op[1].payer;
            break;
        case 36:
            payer=op[1].fee_paying_account;
            break;
        case 37:
            payer=op[1].deposit_to_account;
            break;
        case 38:
            payer=op[1].issuer;
            break;
        case 39:
            payer=op[1].from;
            break;
        case 41:
            payer=op[1].to;
            break;
        case 42:
            payer=op[1].account;
            break;
        case 43:
            payer=op[1].issuer;
            break;
        case 44:
            payer=op[1].account_id;
            break;
    }
    let new_op={type: op_type,payer: payer,fee:fee,asset_id:asset_id};
    return new_op;
}
importBlocks(22758700);