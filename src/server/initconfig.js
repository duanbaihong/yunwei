var config= require('../../config/config');


module.exports={
	mysqloption:{
		host: config.mysql.host || "127.0.0.1",
		user: config.mysql.user || "",
		password: config.mysql.pass || "",
		port: config.mysql.port || "3306",
		database: config.mysql.database || "",
		dateStrings: true ,
	},
	redisoption:{
		host: config.redis.host || "127.0.0.1",
		port: config.redis.port || "6379",
		pass: config.redis.pass || "",
		db: config.redis.db || 0
	}
}