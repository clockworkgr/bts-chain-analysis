var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'trace'
});
async function testES() {
    try {
        const response = await client.search({
            q: 'pants'
        });
        console.log(response.hits.hits)
    } catch (error) {
        console.trace(error.message)
    }
}