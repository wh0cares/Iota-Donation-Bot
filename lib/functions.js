var functions = {};

var config = require('../config.json');
var promise = require('bluebird');
var options = {
    promiseLib: promise
};
var pgp = require('pg-promise')(options);
var connection = ('postgres://%s:%s@%s:%d/%s', config.postgresql.username, config.postgresql.password, config.postgresql.host, config.postgresql.port, config.postgresql.database);
var db = pgp(connection);
var qrec = pgp.errors.queryResultErrorCode;

functions.addUserToDatabase = function (discord_id) {
    return new Promise(resolve => {
        db.none('INSERT INTO users(discord_id, balance) VALUES(${discord_id}, ${balance})', {
            discord_id: discord_id,
            balance: 0
        }).then(success => {
            resolve("success");
        }).catch(error => {
            resolve("error");
        });
    });
}

functions.doesUserExist = function (discord_id) {
    return new Promise(resolve => {
        db.one('SELECT * FROM users WHERE discord_id = ${discord_id}', {
            discord_id: discord_id
        }).then(success => {
            resolve("success");
        }).catch(async error => {
            if (error instanceof pgp.errors.QueryResultError) {
                if (error.code === qrec.noData) {
                    var addUserToDatabase = await functions.addUserToDatabase(discord_id);
                    if (addUserToDatabase == "success"){
                        resolve("success");
                    }
                } else {
                    resolve("error");
                }
            } else {
                resolve("error");
            }
        });
    });
}

functions.getUserBalance = function (discord_id) {
    return new Promise(resolve => {
        db.one('SELECT balance FROM users WHERE discord_id = ${discord_id}', {
            discord_id: discord_id
        }).then(success => {
            balance = success.balance;
            resolve(["success", balance]);
        }).catch(error => {
            resolve(["error"]);
        });
    });
}
module.exports = functions;