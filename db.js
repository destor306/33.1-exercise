/** Database setup for BizTime. */

const {Client} = require("pg");

let DB_URI;

const PASSWORD= '1234';
if (process.env.NODE_ENV === "test"){
    DB_URI = `postgresql://postgres:${PASSWORD}@localhost/biztime_test`
}
else{
    DB_URI = `postgresql://postgres:${PASSWORD}@localhost/biztime`
}

let db = new Client({
    connectionString: DB_URI
});


db.connect();

module.exports = db;