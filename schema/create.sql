DROP TABLE IF EXISTS `website`;
CREATE TABLE `website` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `u_id` int(11) DEFAULT NULL,
  `config` varchar(255) DEFAULT NULL,
  `host` varchar(255) DEFAULT NULL,
  `index_url` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `create_date` datetime DEFAULT NULL,
  `validate` char(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `record`;
CREATE TABLE `record` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `config` varchar(255) DEFAULT NULL,
  `open_time` timestamp NULL DEFAULT NULL,
  `close_time` timestamp NULL DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `service` varchar(255) DEFAULT NULL,
  `referrer` varchar(255) DEFAULT NULL,
  `wxh` varchar(255) DEFAULT NULL,
  `depth` varchar(10) DEFAULT NULL,
  `device` varchar(10) DEFAULT NULL,
  `os` varchar(255) DEFAULT NULL,
  `browser_name` varchar(255) DEFAULT NULL,
  `browser_version` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `custom`;
CREATE TABLE `custom` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `config` varchar(255) DEFAULT NULL,
  `track` varchar(255) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `action` varchar(255) DEFAULT NULL,
  `label` varchar(255) DEFAULT NULL,
  `value` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `ip` varchar(255) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(20) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `register_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO `user` VALUES (1, 'admin', '$2a$10$bjKNpuUn397uooCfV/BQHOwcN6jGohMsTXFLbfWPTzh6.QHUZGxi2', 'zxj@wzmxx.com', now());
INSERT INTO `website` VALUES (1, 1, 'WA-LNH5FK-1', 'analytics.wzmxx.com', 'http://analytics.wzmxx.com', 'JesseZhu的用户行为分析平台', now(), '0');
INSERT INTO `custom`(`id`, `config`, `track`, `category`, `action`, `label`, `value`, `url`, `ip`, `create_time`) VALUES (1, 'WA-LNH5FK-1', 'event', '登录按钮', '点击', '登录', NULL, 'http://analytics.wzmxx.com/login', '101.245.241.102', now());
INSERT INTO `custom`(`id`, `config`, `track`, `category`, `action`, `label`, `value`, `url`, `ip`, `create_time`) VALUES (2, 'WA-LNH5FK-1', 'conversion', '注册转化', '注册页面', '1', NULL, 'http://analytics.wzmxx.com/register', '101.245.241.102', now());
INSERT INTO `custom`(`id`, `config`, `track`, `category`, `action`, `label`, `value`, `url`, `ip`, `create_time`) VALUES (3, 'WA-LNH5FK-1', 'conversion', '注册转化', '注册页面', '1', NULL, 'http://analytics.wzmxx.com/register', '101.245.241.102', now());
INSERT INTO `custom`(`id`, `config`, `track`, `category`, `action`, `label`, `value`, `url`, `ip`, `create_time`) VALUES (4, 'WA-LNH5FK-1', 'conversion', '注册转化', '注册成功', '2', NULL, 'http://analytics.wzmxx.com/register', '101.245.241.102', now());
INSERT INTO `custom`(`id`, `config`, `track`, `category`, `action`, `label`, `value`, `url`, `ip`, `create_time`) VALUES (5, 'WA-LNH5FK-1', 'event', '登录按钮', '点击', '登录', NULL, 'http://analytics.wzmxx.com/login', '101.245.241.102', now());
INSERT INTO `record`(`id`, `config`, `open_time`, `close_time`, `url`, `ip`, `address`, `service`, `referrer`, `wxh`, `depth`, `device`, `os`, `browser_name`, `browser_version`) 
  VALUES (1, 'WA-LNH5FK-1', now(), now(), 'http://analytics.wzmxx.com/login', '101.245.241.102', NULL, NULL, '', '1440x900', '30', 'pc', 'Mac/iOS', 'Chrome', NULL);
INSERT INTO `record`(`id`, `config`, `open_time`, `close_time`, `url`, `ip`, `address`, `service`, `referrer`, `wxh`, `depth`, `device`, `os`, `browser_name`, `browser_version`)
  VALUES (2, 'WA-LNH5FK-1', now(), now(), 'http://localhost:8080/', '101.245.241.102', NULL, NULL, '', '1440x900', '30', 'pc', 'Mac/iOS', 'Chrome', NULL);

CREATE EVENT `analytics`.`无标题`
ON SCHEDULE
EVERY '200' MINUTE
DO INSERT INTO record (config,open_time,close_time,url,ip,wxh,depth,device,os,browser_name)
VALUES('WA-LNH5FK-1',NOW(),NOW(),'http://analytics.jessezhu.cn/login','222.66.77.226','1440x900','30','pc','Mac/iOS','Chrome');
SET GLOBAL event_scheduler = ON;