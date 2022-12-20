var mysql = require("mysql");
const { resolve } = require("path");
var connPool = mysql.createPool({
    connectionLimit: 5,
    host: "cse-mysql-classes-01.cse.umn.edu",
    user: "C4131F22U31",
    database: "C4131F22U31",
    password: "csci4131",
    port: "3306"
});
// table name: list
// get and filter list
function getList(done, priority) {
    return new Promise((resolve, reject) => {
        if ((done == undefined && priority == undefined) || done == 'all') {
            var sql = 'select * from list';
        }
        else if (done != 'all' && done != undefined && priority == undefined) {
            sql = 'select * from list where (done) like (?);';
        }
        else if (done == undefined && priority != undefined) {
            sql = 'select * from list where (priority) like (?);';
            done = priority;
        }
        connPool.query(sql, [done], (err, rows) => {
            // converting to promise -- if error, reject otherwise resolve.
            if (err) {
              console.log(err);
            } else if (rows.length > 0){
              resolve(rows);
            } else {
              resolve(undefined);
            }
          })
    })
}

// add
function addList(message, done, priority) {
    return new Promise((resolve, reject) => {
        const sql = 'insert into list (message, done, priority) values (?, ?, ?);';
        connPool.query(sql, [message, done, priority], (err, rows) => {
            if(err) {
                reject(err);
            } else {
                resolve(rows);
            }
        })
    })
}

// // delete
function deleteList(id) {
    return new Promise((resolve, reject) => {
        const sql = 'delete from list where (id) in (?);';
        connPool.query(sql, [id], (err, rows) => {
            if(err) {
                reject(err);
            } else {
                resolve(rows);
            }
        })
    })
}

function updateList(id, done) {
    return new Promise((resolve, reject) => {
        if (done == '1') {
            var sql = "update list set done = 1 where id = (?);";
        }
        else {
            var sql = "update list set done = 0 where id = (?);";
        }
        connPool.query(sql, [id, done], (err, rows) => {
            // converting to promise -- if error, reject otherwise resolve.
            if (err) {
              console.log(err);
            } else {
              resolve(rows);
            }
          })
    })
}

exports.getList = getList;
exports.addList = addList;
exports.deleteList = deleteList;
exports.updateList = updateList;