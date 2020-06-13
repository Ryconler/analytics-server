/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 50727
 Source Host           : localhost:3306
 Source Schema         : analytics

 Target Server Type    : MySQL
 Target Server Version : 50727
 File Encoding         : 65001

 Date: 13/06/2020 13:05:28
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for custom
-- ----------------------------
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
  `time` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for record
-- ----------------------------
DROP TABLE IF EXISTS `record`;
CREATE TABLE `record` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `config` varchar(255) DEFAULT NULL,
  `open_time` varchar(20) DEFAULT NULL,
  `close_time` varchar(20) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `urls` varchar(2550) DEFAULT NULL,
  `open_times` varchar(2550) DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `service` varchar(255) DEFAULT NULL,
  `referrer` varchar(255) DEFAULT NULL,
  `wxh` varchar(10) DEFAULT NULL,
  `depth` varchar(10) DEFAULT NULL,
  `device` varchar(10) DEFAULT NULL,
  `os` varchar(255) DEFAULT NULL,
  `browser_name` varchar(255) DEFAULT NULL,
  `browser_version` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(20) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `register_date` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for website
-- ----------------------------
DROP TABLE IF EXISTS `website`;
CREATE TABLE `website` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `u_id` int(11) DEFAULT NULL,
  `config` varchar(255) DEFAULT NULL,
  `host` varchar(255) DEFAULT NULL,
  `index_url` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `create_date` varchar(20) DEFAULT NULL,
  `validate` char(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;


INSERT INTO `user` VALUES (1, 'zhuxingjie', '$2a$10$bjKNpuUn397uooCfV/BQHOwcN6jGohMsTXFLbfWPTzh6.QHUZGxi2', 'ryconler@icloud.com', '2020-06-13 12:18:12');
INSERT INTO `website` VALUES (1, 1, 'WA-LNH5FK-1', 'analytics.jessezhu.cn', 'http://analytics.jessezhu.cn', 'JesseZhu的用户行为分析平台', '2020-06-13 12:29:34', '0'
