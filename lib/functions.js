var functions = {};

var config = require('../config.json');
var bot = require('../bot');
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
                    if (addUserToDatabase == "success") {
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

functions.getNewIotaAddress = function (discord_id) {
    return new Promise(resolve => {
        bot.iota.api.getNewAddress(config.iota.seed, { checksum: true }, function (error, address) {
            if (address) {
                bot.iota.api.sendTransfer(config.iota.seed, 4, 14, [{ 'address': address, 'value': 0 }], function (error, bundle) {
                    if (error) {
                        resolve(["error"]);
                    } else {
                        db.none('INSERT INTO addresses(address) VALUES(${address})', {
                            address: address
                        }).then(success => {
                            db.none('INSERT INTO users_addresses(users_discord_id, addresses_address) VALUES(${discord_id}, ${address})', {
                                discord_id: discord_id,
                                address: address
                            }).then(success => {
                                resolve(["success", address]);
                            }).catch(error => {
                                console.log(error);
                                resolve(["error"]);
                            });
                        }).catch(error => {
                            console.log(error);
                            resolve(["error"]);
                        });
                    }
                });
            } else {
                resolve(["error"]);
            }
        });
    });
}

functions.withdrawIota = function (discord_id, withdraw_address, amount) {
    return new Promise(resolve => {
        bot.iota.api.getNewAddress(config.iota.seed, { checksum: true }, function (error, address) {
            if (address) {
                bot.iota.api.sendTransfer(config.iota.seed, 4, 14, [{ 'address': address, 'value': 0 }], function (error, bundle) {
                    if (error) {
                        resolve(["error"]);
                    } else {
                        db.none('INSERT INTO addresses(address) VALUES(${address})', {
                            address: address
                        }).then(success => {
                            bot.iota.api.sendTransfer(config.iota.seed, 4, 14, [{ 'address': withdraw_address, 'value': amount }], { address: address }, function (error, bundle) {
                                if (error) {
                                    resolve(["error"]);
                                } else {
                                    db.none('UPDATE users SET balance = balance - ${balance} WHERE discord_id = ${discord_id}', {
                                        balance: amount,
                                        discord_id: discord_id
                                    }).then(success => {
                                        resolve(["success"]);
                                    }).catch(error => {
                                        console.log(error);
                                        resolve(["error"]);
                                    });
                                }
                            });
                        }).catch(error => {
                            console.log(error);
                            resolve(["error"]);
                        });
                    }
                });
            } else {
                resolve(["error"]);
            }
        });
    });
}
module.exports = functions;