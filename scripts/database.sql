CREATE TABLE `t_user_info` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `loginuser` varchar(11) NOT NULL DEFAULT '',
  `username` varchar(11) NOT NULL DEFAULT '',
  `userpass` varchar(32) NOT NULL DEFAULT '',
  `token` varchar(32) NOT NULL DEFAULT '',
  `department` varchar(32) DEFAULT NULL,
  `lastloginip` varchar(32) DEFAULT NULL,
  `logintime` datetime DEFAULT NULL,
  `createtime` datetime NOT NULL,
  `updatetime` datetime DEFAULT NULL,
  `createuser` varchar(32) DEFAULT NULL,
  `saltpass` varchar(16) DEFAULT NULL,
  `remark` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `loginpass` (`token`),
  KEY `login_username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;