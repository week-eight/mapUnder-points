
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `testOne`;
CREATE TABLE `testOne`  (
  `name` varchar(55) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `address` int(11) NULL DEFAULT NULL,
  `order_count` bigint(20) NULL DEFAULT NULL,
  `driver_number` bigint(20) NULL DEFAULT NULL,
  `vehicle_number` bigint(20) NULL DEFAULT NULL
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;

/**
自己制作一些随机数据
 */
