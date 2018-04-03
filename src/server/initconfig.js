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
	hemumysqloption:{
		host: config.hemudb.host || "127.0.0.2",
		user: config.hemudb.user || "",
		password: config.hemudb.pass || "",
		port: config.hemudb.port || "3306",
		database: config.hemudb.database || "",
		dateStrings: true,
	},
	redisoption:{
		host: config.redis.host || "127.0.0.1",
		port: config.redis.port || "6379",
		pass: config.redis.pass || "",
		db: config.redis.db || 0
	},
	thirtyhttpoption: {
		url: config.thirtyhttp.url || "http://127.0.0.1:2223",
		loginuri: config.thirtyhttp.loginuri || "/passport/login.do",
		devqueryuri: config.thirtyhttp.devqueryuri ||"/admin/device/getDeviceListV1.do",
		devqueryconfiguri: config.thirtyhttp.devqueryconfiguri ||"/admin/device/getDeviceConfig.do",
		username: config.thirtyhttp.username || "zy_mzh",
		password: config.thirtyhttp.password || "F7n-Cig-z6m-Phm"
	}
}