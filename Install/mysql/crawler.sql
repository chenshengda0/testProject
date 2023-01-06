-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- 主机： dex-mysql
-- 生成日期： 2023-01-06 16:49:20
-- 服务器版本： 8.0.31
-- PHP 版本： 8.0.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 数据库： `crawler`
--
CREATE DATABASE IF NOT EXISTS `crawler` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `crawler`;

-- --------------------------------------------------------

--
-- 表的结构 `baidu`
--

CREATE TABLE IF NOT EXISTS `baidu` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '百度热搜',
  `title` char(200) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT 'title',
  `href` text COLLATE utf8mb4_general_ci NOT NULL COMMENT '链接地址',
  `create_time` int NOT NULL DEFAULT '0' COMMENT '创建时间',
  `create_date` char(30) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0000-00-00' COMMENT '日期',
  PRIMARY KEY (`id`),
  KEY `create_date` (`create_date`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='爬虫-百度热搜';

--
-- 转存表中的数据 `baidu`
--

INSERT INTO `baidu` (`id`, `title`, `href`, `create_time`, `create_date`) VALUES
(1, '用主旋律奏响新征程的奋进乐章', 'https://www.baidu.com/s?wd=%E7%94%A8%E4%B8%BB%E6%97%8B%E5%BE%8B%E5%A5%8F%E5%93%8D%E6%96%B0%E5%BE%81%E7%A8%8B%E7%9A%84%E5%A5%8B%E8%BF%9B%E4%B9%90%E7%AB%A0&tn=baidutop10&rsv_idx=2&usm=1&ie=utf-8&rsv_pq=bba9b7b700159170&oq=%E7%94%A8%E4%B8%BB%E6%97%8B%E5%BE%8B%E5%A5%8F%E5%93%8D%E6%96%B0%E5%BE%81%E7%A8%8B%E7%9A%84%E5%A5%8B%E8%BF%9B%E4%B9%90%E7%AB%A0&rsv_t=9ce52qixBff35hV7Pa9TlEGbqG9WWyN6tTkG8qC5Ls5jl0jh3pwViLqb0er8Qwghgg&rqid=bba9b7b700159170&rsf=99c029d5fa93389c6243e8ef742056f5_1_15_1&rsv_dl=0_right_fyb_pchot_20811&sa=0_right_fyb_pchot_20811', 1673014999, '2023-01-05'),
(2, '新冠诊疗方案（试行第十版）发布', 'https://www.baidu.com/s?wd=%E6%96%B0%E5%86%A0%E8%AF%8A%E7%96%97%E6%96%B9%E6%A1%88%EF%BC%88%E8%AF%95%E8%A1%8C%E7%AC%AC%E5%8D%81%E7%89%88%EF%BC%89%E5%8F%91%E5%B8%83&tn=baidutop10&rsv_idx=2&usm=1&ie=utf-8&rsv_pq=bba9b7b700159170&oq=%E7%94%A8%E4%B8%BB%E6%97%8B%E5%BE%8B%E5%A5%8F%E5%93%8D%E6%96%B0%E5%BE%81%E7%A8%8B%E7%9A%84%E5%A5%8B%E8%BF%9B%E4%B9%90%E7%AB%A0&rsv_t=9ce52qixBff35hV7Pa9TlEGbqG9WWyN6tTkG8qC5Ls5jl0jh3pwViLqb0er8Qwghgg&rqid=bba9b7b700159170&rsf=99c029d5fa93389c6243e8ef742056f5_1_15_2&rsv_dl=0_right_fyb_pchot_20811&sa=0_right_fyb_pchot_20811', 1673014999, '2023-01-05'),
(3, '受贿5.4亿余元 李文喜被判死缓', 'https://www.baidu.com/s?wd=%E5%8F%97%E8%B4%BF5.4%E4%BA%BF%E4%BD%99%E5%85%83%20%E6%9D%8E%E6%96%87%E5%96%9C%E8%A2%AB%E5%88%A4%E6%AD%BB%E7%BC%93&tn=baidutop10&rsv_idx=2&usm=1&ie=utf-8&rsv_pq=bba9b7b700159170&oq=%E7%94%A8%E4%B8%BB%E6%97%8B%E5%BE%8B%E5%A5%8F%E5%93%8D%E6%96%B0%E5%BE%81%E7%A8%8B%E7%9A%84%E5%A5%8B%E8%BF%9B%E4%B9%90%E7%AB%A0&rsv_t=9ce52qixBff35hV7Pa9TlEGbqG9WWyN6tTkG8qC5Ls5jl0jh3pwViLqb0er8Qwghgg&rqid=bba9b7b700159170&rsf=99c029d5fa93389c6243e8ef742056f5_1_15_3&rsv_dl=0_right_fyb_pchot_20811&sa=0_right_fyb_pchot_20811', 1673014999, '2023-01-05'),
(4, '这份春运出行指南请查收', 'https://www.baidu.com/s?wd=%E8%BF%99%E4%BB%BD%E6%98%A5%E8%BF%90%E5%87%BA%E8%A1%8C%E6%8C%87%E5%8D%97%E8%AF%B7%E6%9F%A5%E6%94%B6&tn=baidutop10&rsv_idx=2&usm=1&ie=utf-8&rsv_pq=bba9b7b700159170&oq=%E7%94%A8%E4%B8%BB%E6%97%8B%E5%BE%8B%E5%A5%8F%E5%93%8D%E6%96%B0%E5%BE%81%E7%A8%8B%E7%9A%84%E5%A5%8B%E8%BF%9B%E4%B9%90%E7%AB%A0&rsv_t=9ce52qixBff35hV7Pa9TlEGbqG9WWyN6tTkG8qC5Ls5jl0jh3pwViLqb0er8Qwghgg&rqid=bba9b7b700159170&rsf=99c029d5fa93389c6243e8ef742056f5_1_15_4&rsv_dl=0_right_fyb_pchot_20811&sa=0_right_fyb_pchot_20811', 1673014999, '2023-01-05'),
(5, '男子3年后回家发现巷口被邻居占一半', 'https://www.baidu.com/s?wd=%E7%94%B7%E5%AD%903%E5%B9%B4%E5%90%8E%E5%9B%9E%E5%AE%B6%E5%8F%91%E7%8E%B0%E5%B7%B7%E5%8F%A3%E8%A2%AB%E9%82%BB%E5%B1%85%E5%8D%A0%E4%B8%80%E5%8D%8A&tn=baidutop10&rsv_idx=2&usm=1&ie=utf-8&rsv_pq=bba9b7b700159170&oq=%E7%94%A8%E4%B8%BB%E6%97%8B%E5%BE%8B%E5%A5%8F%E5%93%8D%E6%96%B0%E5%BE%81%E7%A8%8B%E7%9A%84%E5%A5%8B%E8%BF%9B%E4%B9%90%E7%AB%A0&rsv_t=9ce52qixBff35hV7Pa9TlEGbqG9WWyN6tTkG8qC5Ls5jl0jh3pwViLqb0er8Qwghgg&rqid=bba9b7b700159170&rsf=99c029d5fa93389c6243e8ef742056f5_1_15_5&rsv_dl=0_right_fyb_pchot_20811&sa=0_right_fyb_pchot_20811', 1673014999, '2023-01-05'),
(6, '浪莎发文向郎朗吉娜道歉', 'https://www.baidu.com/s?wd=%E6%B5%AA%E8%8E%8E%E5%8F%91%E6%96%87%E5%90%91%E9%83%8E%E6%9C%97%E5%90%89%E5%A8%9C%E9%81%93%E6%AD%89&tn=baidutop10&rsv_idx=2&usm=1&ie=utf-8&rsv_pq=bba9b7b700159170&oq=%E7%94%A8%E4%B8%BB%E6%97%8B%E5%BE%8B%E5%A5%8F%E5%93%8D%E6%96%B0%E5%BE%81%E7%A8%8B%E7%9A%84%E5%A5%8B%E8%BF%9B%E4%B9%90%E7%AB%A0&rsv_t=9ce52qixBff35hV7Pa9TlEGbqG9WWyN6tTkG8qC5Ls5jl0jh3pwViLqb0er8Qwghgg&rqid=bba9b7b700159170&rsf=99c029d5fa93389c6243e8ef742056f5_1_15_6&rsv_dl=0_right_fyb_pchot_20811&sa=0_right_fyb_pchot_20811', 1673014999, '2023-01-05'),
(7, '科学家首次发现专吃病毒生物', 'https://www.baidu.com/s?wd=%E7%A7%91%E5%AD%A6%E5%AE%B6%E9%A6%96%E6%AC%A1%E5%8F%91%E7%8E%B0%E4%B8%93%E5%90%83%E7%97%85%E6%AF%92%E7%94%9F%E7%89%A9&tn=baidutop10&rsv_idx=2&usm=1&ie=utf-8&rsv_pq=bba9b7b700159170&oq=%E7%94%A8%E4%B8%BB%E6%97%8B%E5%BE%8B%E5%A5%8F%E5%93%8D%E6%96%B0%E5%BE%81%E7%A8%8B%E7%9A%84%E5%A5%8B%E8%BF%9B%E4%B9%90%E7%AB%A0&rsv_t=9ce52qixBff35hV7Pa9TlEGbqG9WWyN6tTkG8qC5Ls5jl0jh3pwViLqb0er8Qwghgg&rqid=bba9b7b700159170&rsf=99c029d5fa93389c6243e8ef742056f5_1_15_7&rsv_dl=0_right_fyb_pchot_20811&sa=0_right_fyb_pchot_20811', 1673014999, '2023-01-05'),
(8, '男子洗浴嫌按摩师年纪大起争执', 'https://www.baidu.com/s?wd=%E7%94%B7%E5%AD%90%E6%B4%97%E6%B5%B4%E5%AB%8C%E6%8C%89%E6%91%A9%E5%B8%88%E5%B9%B4%E7%BA%AA%E5%A4%A7%E8%B5%B7%E4%BA%89%E6%89%A7&tn=baidutop10&rsv_idx=2&usm=1&ie=utf-8&rsv_pq=bba9b7b700159170&oq=%E7%94%A8%E4%B8%BB%E6%97%8B%E5%BE%8B%E5%A5%8F%E5%93%8D%E6%96%B0%E5%BE%81%E7%A8%8B%E7%9A%84%E5%A5%8B%E8%BF%9B%E4%B9%90%E7%AB%A0&rsv_t=54bcTVZewFSJvlak1UpYxbGbj3%2B1XLpydYhkBvrHeCQ8PtQ%2F2Jo5rzllz%2B%2BIHPDFvw&rqid=bba9b7b700159170&rsf=99c029d5fa93389c6243e8ef742056f5_1_15_8&rsv_dl=0_right_fyb_pchot_20811&sa=0_right_fyb_pchot_20811', 1673014999, '2023-01-05'),
(9, '武汉66岁太婆一天炸3000个圆子', 'https://www.baidu.com/s?wd=%E6%AD%A6%E6%B1%8966%E5%B2%81%E5%A4%AA%E5%A9%86%E4%B8%80%E5%A4%A9%E7%82%B83000%E4%B8%AA%E5%9C%86%E5%AD%90&tn=baidutop10&rsv_idx=2&usm=1&ie=utf-8&rsv_pq=bba9b7b700159170&oq=%E7%94%A8%E4%B8%BB%E6%97%8B%E5%BE%8B%E5%A5%8F%E5%93%8D%E6%96%B0%E5%BE%81%E7%A8%8B%E7%9A%84%E5%A5%8B%E8%BF%9B%E4%B9%90%E7%AB%A0&rsv_t=54bcTVZewFSJvlak1UpYxbGbj3%2B1XLpydYhkBvrHeCQ8PtQ%2F2Jo5rzllz%2B%2BIHPDFvw&rqid=bba9b7b700159170&rsf=99c029d5fa93389c6243e8ef742056f5_1_15_9&rsv_dl=0_right_fyb_pchot_20811&sa=0_right_fyb_pchot_20811', 1673014999, '2023-01-05'),
(10, '专家回应燃放烟花爆竹能消灭病毒', 'https://www.baidu.com/s?wd=%E4%B8%93%E5%AE%B6%E5%9B%9E%E5%BA%94%E7%87%83%E6%94%BE%E7%83%9F%E8%8A%B1%E7%88%86%E7%AB%B9%E8%83%BD%E6%B6%88%E7%81%AD%E7%97%85%E6%AF%92&tn=baidutop10&rsv_idx=2&usm=1&ie=utf-8&rsv_pq=bba9b7b700159170&oq=%E7%94%A8%E4%B8%BB%E6%97%8B%E5%BE%8B%E5%A5%8F%E5%93%8D%E6%96%B0%E5%BE%81%E7%A8%8B%E7%9A%84%E5%A5%8B%E8%BF%9B%E4%B9%90%E7%AB%A0&rsv_t=54bcTVZewFSJvlak1UpYxbGbj3%2B1XLpydYhkBvrHeCQ8PtQ%2F2Jo5rzllz%2B%2BIHPDFvw&rqid=bba9b7b700159170&rsf=99c029d5fa93389c6243e8ef742056f5_1_15_10&rsv_dl=0_right_fyb_pchot_20811&sa=0_right_fyb_pchot_20811', 1673014999, '2023-01-05'),
(11, '女子阳后一周锻炼晕倒摔断3颗牙', 'https://www.baidu.com/s?wd=%E5%A5%B3%E5%AD%90%E9%98%B3%E5%90%8E%E4%B8%80%E5%91%A8%E9%94%BB%E7%82%BC%E6%99%95%E5%80%92%E6%91%94%E6%96%AD3%E9%A2%97%E7%89%99&tn=baidutop10&rsv_idx=2&usm=1&ie=utf-8&rsv_pq=bba9b7b700159170&oq=%E7%94%A8%E4%B8%BB%E6%97%8B%E5%BE%8B%E5%A5%8F%E5%93%8D%E6%96%B0%E5%BE%81%E7%A8%8B%E7%9A%84%E5%A5%8B%E8%BF%9B%E4%B9%90%E7%AB%A0&rsv_t=54bcTVZewFSJvlak1UpYxbGbj3%2B1XLpydYhkBvrHeCQ8PtQ%2F2Jo5rzllz%2B%2BIHPDFvw&rqid=bba9b7b700159170&rsf=99c029d5fa93389c6243e8ef742056f5_1_15_11&rsv_dl=0_right_fyb_pchot_20811&sa=0_right_fyb_pchot_20811', 1673014999, '2023-01-05'),
(12, '成都回应不雅聊天男干部1月还参会', 'https://www.baidu.com/s?wd=%E6%88%90%E9%83%BD%E5%9B%9E%E5%BA%94%E4%B8%8D%E9%9B%85%E8%81%8A%E5%A4%A9%E7%94%B7%E5%B9%B2%E9%83%A81%E6%9C%88%E8%BF%98%E5%8F%82%E4%BC%9A&tn=baidutop10&rsv_idx=2&usm=1&ie=utf-8&rsv_pq=bba9b7b700159170&oq=%E7%94%A8%E4%B8%BB%E6%97%8B%E5%BE%8B%E5%A5%8F%E5%93%8D%E6%96%B0%E5%BE%81%E7%A8%8B%E7%9A%84%E5%A5%8B%E8%BF%9B%E4%B9%90%E7%AB%A0&rsv_t=54bcTVZewFSJvlak1UpYxbGbj3%2B1XLpydYhkBvrHeCQ8PtQ%2F2Jo5rzllz%2B%2BIHPDFvw&rqid=bba9b7b700159170&rsf=99c029d5fa93389c6243e8ef742056f5_1_15_12&rsv_dl=0_right_fyb_pchot_20811&sa=0_right_fyb_pchot_20811', 1673014999, '2023-01-05'),
(13, '央视网：烟花的禁与放该被正视了', 'https://www.baidu.com/s?wd=%E5%A4%AE%E8%A7%86%E7%BD%91%EF%BC%9A%E7%83%9F%E8%8A%B1%E7%9A%84%E7%A6%81%E4%B8%8E%E6%94%BE%E8%AF%A5%E8%A2%AB%E6%AD%A3%E8%A7%86%E4%BA%86&tn=baidutop10&rsv_idx=2&usm=1&ie=utf-8&rsv_pq=bba9b7b700159170&oq=%E7%94%A8%E4%B8%BB%E6%97%8B%E5%BE%8B%E5%A5%8F%E5%93%8D%E6%96%B0%E5%BE%81%E7%A8%8B%E7%9A%84%E5%A5%8B%E8%BF%9B%E4%B9%90%E7%AB%A0&rsv_t=54bcTVZewFSJvlak1UpYxbGbj3%2B1XLpydYhkBvrHeCQ8PtQ%2F2Jo5rzllz%2B%2BIHPDFvw&rqid=bba9b7b700159170&rsf=99c029d5fa93389c6243e8ef742056f5_1_15_13&rsv_dl=0_right_fyb_pchot_20811&sa=0_right_fyb_pchot_20811', 1673014999, '2023-01-05'),
(14, '哈里王子承认在阿富汗期间杀死25人', 'https://www.baidu.com/s?wd=%E5%93%88%E9%87%8C%E7%8E%8B%E5%AD%90%E6%89%BF%E8%AE%A4%E5%9C%A8%E9%98%BF%E5%AF%8C%E6%B1%97%E6%9C%9F%E9%97%B4%E6%9D%80%E6%AD%BB25%E4%BA%BA&tn=baidutop10&rsv_idx=2&usm=1&ie=utf-8&rsv_pq=bba9b7b700159170&oq=%E7%94%A8%E4%B8%BB%E6%97%8B%E5%BE%8B%E5%A5%8F%E5%93%8D%E6%96%B0%E5%BE%81%E7%A8%8B%E7%9A%84%E5%A5%8B%E8%BF%9B%E4%B9%90%E7%AB%A0&rsv_t=54bcTVZewFSJvlak1UpYxbGbj3%2B1XLpydYhkBvrHeCQ8PtQ%2F2Jo5rzllz%2B%2BIHPDFvw&rqid=bba9b7b700159170&rsf=99c029d5fa93389c6243e8ef742056f5_1_15_14&rsv_dl=0_right_fyb_pchot_20811&sa=0_right_fyb_pchot_20811', 1673014999, '2023-01-05'),
(15, '原来上一个兔年就建议专家不要建议', 'https://www.baidu.com/s?wd=%E5%8E%9F%E6%9D%A5%E4%B8%8A%E4%B8%80%E4%B8%AA%E5%85%94%E5%B9%B4%E5%B0%B1%E5%BB%BA%E8%AE%AE%E4%B8%93%E5%AE%B6%E4%B8%8D%E8%A6%81%E5%BB%BA%E8%AE%AE&tn=baidutop10&rsv_idx=2&usm=1&ie=utf-8&rsv_pq=bba9b7b700159170&oq=%E7%94%A8%E4%B8%BB%E6%97%8B%E5%BE%8B%E5%A5%8F%E5%93%8D%E6%96%B0%E5%BE%81%E7%A8%8B%E7%9A%84%E5%A5%8B%E8%BF%9B%E4%B9%90%E7%AB%A0&rsv_t=54bcTVZewFSJvlak1UpYxbGbj3%2B1XLpydYhkBvrHeCQ8PtQ%2F2Jo5rzllz%2B%2BIHPDFvw&rqid=bba9b7b700159170&rsf=99c029d5fa93389c6243e8ef742056f5_1_15_15&rsv_dl=0_right_fyb_pchot_20811&sa=0_right_fyb_pchot_20811', 1673014999, '2023-01-05'),
(16, '四川一地再现土坑酸菜：工人用脚踩', 'https://www.baidu.com/s?wd=%E5%9B%9B%E5%B7%9D%E4%B8%80%E5%9C%B0%E5%86%8D%E7%8E%B0%E5%9C%9F%E5%9D%91%E9%85%B8%E8%8F%9C%EF%BC%9A%E5%B7%A5%E4%BA%BA%E7%94%A8%E8%84%9A%E8%B8%A9&tn=baidutop10&rsv_idx=2&usm=1&ie=utf-8&rsv_pq=bba9b7b700159170&oq=%E7%94%A8%E4%B8%BB%E6%97%8B%E5%BE%8B%E5%A5%8F%E5%93%8D%E6%96%B0%E5%BE%81%E7%A8%8B%E7%9A%84%E5%A5%8B%E8%BF%9B%E4%B9%90%E7%AB%A0&rsv_t=54bcTVZewFSJvlak1UpYxbGbj3%2B1XLpydYhkBvrHeCQ8PtQ%2F2Jo5rzllz%2B%2BIHPDFvw&rqid=bba9b7b700159170&rsf=99c029d5fa93389c6243e8ef742056f5_16_30_16&rsv_dl=0_right_fyb_pchot_20811&sa=0_right_fyb_pchot_20811', 1673014999, '2023-01-05'),
(17, '印度男子为亡妻打造仿真雕塑', 'https://www.baidu.com/s?wd=%E5%8D%B0%E5%BA%A6%E7%94%B7%E5%AD%90%E4%B8%BA%E4%BA%A1%E5%A6%BB%E6%89%93%E9%80%A0%E4%BB%BF%E7%9C%9F%E9%9B%95%E5%A1%91&tn=baidutop10&rsv_idx=2&usm=1&ie=utf-8&rsv_pq=bba9b7b700159170&oq=%E7%94%A8%E4%B8%BB%E6%97%8B%E5%BE%8B%E5%A5%8F%E5%93%8D%E6%96%B0%E5%BE%81%E7%A8%8B%E7%9A%84%E5%A5%8B%E8%BF%9B%E4%B9%90%E7%AB%A0&rsv_t=54bcTVZewFSJvlak1UpYxbGbj3%2B1XLpydYhkBvrHeCQ8PtQ%2F2Jo5rzllz%2B%2BIHPDFvw&rqid=bba9b7b700159170&rsf=99c029d5fa93389c6243e8ef742056f5_16_30_17&rsv_dl=0_right_fyb_pchot_20811&sa=0_right_fyb_pchot_20811', 1673014999, '2023-01-05'),
(18, '多国要求日本将核污水倒在东京', 'https://www.baidu.com/s?wd=%E5%A4%9A%E5%9B%BD%E8%A6%81%E6%B1%82%E6%97%A5%E6%9C%AC%E5%B0%86%E6%A0%B8%E6%B1%A1%E6%B0%B4%E5%80%92%E5%9C%A8%E4%B8%9C%E4%BA%AC&tn=baidutop10&rsv_idx=2&usm=1&ie=utf-8&rsv_pq=bba9b7b700159170&oq=%E7%94%A8%E4%B8%BB%E6%97%8B%E5%BE%8B%E5%A5%8F%E5%93%8D%E6%96%B0%E5%BE%81%E7%A8%8B%E7%9A%84%E5%A5%8B%E8%BF%9B%E4%B9%90%E7%AB%A0&rsv_t=54bcTVZewFSJvlak1UpYxbGbj3%2B1XLpydYhkBvrHeCQ8PtQ%2F2Jo5rzllz%2B%2BIHPDFvw&rqid=bba9b7b700159170&rsf=99c029d5fa93389c6243e8ef742056f5_16_30_18&rsv_dl=0_right_fyb_pchot_20811&sa=0_right_fyb_pchot_20811', 1673014999, '2023-01-05'),
(19, '上甘岭战役一等功臣蒋诚逝世', 'https://www.baidu.com/s?wd=%E4%B8%8A%E7%94%98%E5%B2%AD%E6%88%98%E5%BD%B9%E4%B8%80%E7%AD%89%E5%8A%9F%E8%87%A3%E8%92%8B%E8%AF%9A%E9%80%9D%E4%B8%96&tn=baidutop10&rsv_idx=2&usm=1&ie=utf-8&rsv_pq=bba9b7b700159170&oq=%E7%94%A8%E4%B8%BB%E6%97%8B%E5%BE%8B%E5%A5%8F%E5%93%8D%E6%96%B0%E5%BE%81%E7%A8%8B%E7%9A%84%E5%A5%8B%E8%BF%9B%E4%B9%90%E7%AB%A0&rsv_t=daf8LfmXdGFq%2BeY1XsPq7kMG8NEEr2G1iTp38R1IqpEHWTDVXBd43dZhlYHxUfGWrg&rqid=bba9b7b700159170&rsf=99c029d5fa93389c6243e8ef742056f5_16_30_19&rsv_dl=0_right_fyb_pchot_20811&sa=0_right_fyb_pchot_20811', 1673014999, '2023-01-05'),
(20, '女子试衣间遭掀帘辱骂 警方立案', 'https://www.baidu.com/s?wd=%E5%A5%B3%E5%AD%90%E8%AF%95%E8%A1%A3%E9%97%B4%E9%81%AD%E6%8E%80%E5%B8%98%E8%BE%B1%E9%AA%82%20%E8%AD%A6%E6%96%B9%E7%AB%8B%E6%A1%88&tn=baidutop10&rsv_idx=2&usm=1&ie=utf-8&rsv_pq=bba9b7b700159170&oq=%E7%94%A8%E4%B8%BB%E6%97%8B%E5%BE%8B%E5%A5%8F%E5%93%8D%E6%96%B0%E5%BE%81%E7%A8%8B%E7%9A%84%E5%A5%8B%E8%BF%9B%E4%B9%90%E7%AB%A0&rsv_t=daf8LfmXdGFq%2BeY1XsPq7kMG8NEEr2G1iTp38R1IqpEHWTDVXBd43dZhlYHxUfGWrg&rqid=bba9b7b700159170&rsf=99c029d5fa93389c6243e8ef742056f5_16_30_20&rsv_dl=0_right_fyb_pchot_20811&sa=0_right_fyb_pchot_20811', 1673014999, '2023-01-05'),
(21, '父亲将石榴埋沙里4个月等儿子', 'https://www.baidu.com/s?wd=%E7%88%B6%E4%BA%B2%E5%B0%86%E7%9F%B3%E6%A6%B4%E5%9F%8B%E6%B2%99%E9%87%8C4%E4%B8%AA%E6%9C%88%E7%AD%89%E5%84%BF%E5%AD%90&tn=baidutop10&rsv_idx=2&usm=1&ie=utf-8&rsv_pq=bba9b7b700159170&oq=%E7%94%A8%E4%B8%BB%E6%97%8B%E5%BE%8B%E5%A5%8F%E5%93%8D%E6%96%B0%E5%BE%81%E7%A8%8B%E7%9A%84%E5%A5%8B%E8%BF%9B%E4%B9%90%E7%AB%A0&rsv_t=daf8LfmXdGFq%2BeY1XsPq7kMG8NEEr2G1iTp38R1IqpEHWTDVXBd43dZhlYHxUfGWrg&rqid=bba9b7b700159170&rsf=99c029d5fa93389c6243e8ef742056f5_16_30_21&rsv_dl=0_right_fyb_pchot_20811&sa=0_right_fyb_pchot_20811', 1673014999, '2023-01-05'),
(22, '洛国富：已经不再有赚大钱的念头', 'https://www.baidu.com/s?wd=%E6%B4%9B%E5%9B%BD%E5%AF%8C%EF%BC%9A%E5%B7%B2%E7%BB%8F%E4%B8%8D%E5%86%8D%E6%9C%89%E8%B5%9A%E5%A4%A7%E9%92%B1%E7%9A%84%E5%BF%B5%E5%A4%B4&tn=baidutop10&rsv_idx=2&usm=1&ie=utf-8&rsv_pq=bba9b7b700159170&oq=%E7%94%A8%E4%B8%BB%E6%97%8B%E5%BE%8B%E5%A5%8F%E5%93%8D%E6%96%B0%E5%BE%81%E7%A8%8B%E7%9A%84%E5%A5%8B%E8%BF%9B%E4%B9%90%E7%AB%A0&rsv_t=daf8LfmXdGFq%2BeY1XsPq7kMG8NEEr2G1iTp38R1IqpEHWTDVXBd43dZhlYHxUfGWrg&rqid=bba9b7b700159170&rsf=99c029d5fa93389c6243e8ef742056f5_16_30_22&rsv_dl=0_right_fyb_pchot_20811&sa=0_right_fyb_pchot_20811', 1673014999, '2023-01-05'),
(23, '重庆一隧道发生摩托车车祸 4人死亡', 'https://www.baidu.com/s?wd=%E9%87%8D%E5%BA%86%E4%B8%80%E9%9A%A7%E9%81%93%E5%8F%91%E7%94%9F%E6%91%A9%E6%89%98%E8%BD%A6%E8%BD%A6%E7%A5%B8%204%E4%BA%BA%E6%AD%BB%E4%BA%A1&tn=baidutop10&rsv_idx=2&usm=1&ie=utf-8&rsv_pq=bba9b7b700159170&oq=%E7%94%A8%E4%B8%BB%E6%97%8B%E5%BE%8B%E5%A5%8F%E5%93%8D%E6%96%B0%E5%BE%81%E7%A8%8B%E7%9A%84%E5%A5%8B%E8%BF%9B%E4%B9%90%E7%AB%A0&rsv_t=daf8LfmXdGFq%2BeY1XsPq7kMG8NEEr2G1iTp38R1IqpEHWTDVXBd43dZhlYHxUfGWrg&rqid=bba9b7b700159170&rsf=99c029d5fa93389c6243e8ef742056f5_16_30_23&rsv_dl=0_right_fyb_pchot_20811&sa=0_right_fyb_pchot_20811', 1673014999, '2023-01-05'),
(24, '女子凌晨坐房顶大哭称不想结婚', 'https://www.baidu.com/s?wd=%E5%A5%B3%E5%AD%90%E5%87%8C%E6%99%A8%E5%9D%90%E6%88%BF%E9%A1%B6%E5%A4%A7%E5%93%AD%E7%A7%B0%E4%B8%8D%E6%83%B3%E7%BB%93%E5%A9%9A&tn=baidutop10&rsv_idx=2&usm=1&ie=utf-8&rsv_pq=bba9b7b700159170&oq=%E7%94%A8%E4%B8%BB%E6%97%8B%E5%BE%8B%E5%A5%8F%E5%93%8D%E6%96%B0%E5%BE%81%E7%A8%8B%E7%9A%84%E5%A5%8B%E8%BF%9B%E4%B9%90%E7%AB%A0&rsv_t=daf8LfmXdGFq%2BeY1XsPq7kMG8NEEr2G1iTp38R1IqpEHWTDVXBd43dZhlYHxUfGWrg&rqid=bba9b7b700159170&rsf=99c029d5fa93389c6243e8ef742056f5_16_30_24&rsv_dl=0_right_fyb_pchot_20811&sa=0_right_fyb_pchot_20811', 1673014999, '2023-01-05'),
(25, '姆巴佩和忍者神龟合影', 'https://www.baidu.com/s?wd=%E5%A7%86%E5%B7%B4%E4%BD%A9%E5%92%8C%E5%BF%8D%E8%80%85%E7%A5%9E%E9%BE%9F%E5%90%88%E5%BD%B1&tn=baidutop10&rsv_idx=2&usm=1&ie=utf-8&rsv_pq=bba9b7b700159170&oq=%E7%94%A8%E4%B8%BB%E6%97%8B%E5%BE%8B%E5%A5%8F%E5%93%8D%E6%96%B0%E5%BE%81%E7%A8%8B%E7%9A%84%E5%A5%8B%E8%BF%9B%E4%B9%90%E7%AB%A0&rsv_t=daf8LfmXdGFq%2BeY1XsPq7kMG8NEEr2G1iTp38R1IqpEHWTDVXBd43dZhlYHxUfGWrg&rqid=bba9b7b700159170&rsf=99c029d5fa93389c6243e8ef742056f5_16_30_25&rsv_dl=0_right_fyb_pchot_20811&sa=0_right_fyb_pchot_20811', 1673014999, '2023-01-05'),
(26, '胶东机场机务人员被碾死调查结果', 'https://www.baidu.com/s?wd=%E8%83%B6%E4%B8%9C%E6%9C%BA%E5%9C%BA%E6%9C%BA%E5%8A%A1%E4%BA%BA%E5%91%98%E8%A2%AB%E7%A2%BE%E6%AD%BB%E8%B0%83%E6%9F%A5%E7%BB%93%E6%9E%9C&tn=baidutop10&rsv_idx=2&usm=1&ie=utf-8&rsv_pq=bba9b7b700159170&oq=%E7%94%A8%E4%B8%BB%E6%97%8B%E5%BE%8B%E5%A5%8F%E5%93%8D%E6%96%B0%E5%BE%81%E7%A8%8B%E7%9A%84%E5%A5%8B%E8%BF%9B%E4%B9%90%E7%AB%A0&rsv_t=daf8LfmXdGFq%2BeY1XsPq7kMG8NEEr2G1iTp38R1IqpEHWTDVXBd43dZhlYHxUfGWrg&rqid=bba9b7b700159170&rsf=99c029d5fa93389c6243e8ef742056f5_16_30_26&rsv_dl=0_right_fyb_pchot_20811&sa=0_right_fyb_pchot_20811', 1673014999, '2023-01-05'),
(27, '74岁爷爷在孙女手机壳写平安快乐', 'https://www.baidu.com/s?wd=74%E5%B2%81%E7%88%B7%E7%88%B7%E5%9C%A8%E5%AD%99%E5%A5%B3%E6%89%8B%E6%9C%BA%E5%A3%B3%E5%86%99%E5%B9%B3%E5%AE%89%E5%BF%AB%E4%B9%90&tn=baidutop10&rsv_idx=2&usm=1&ie=utf-8&rsv_pq=bba9b7b700159170&oq=%E7%94%A8%E4%B8%BB%E6%97%8B%E5%BE%8B%E5%A5%8F%E5%93%8D%E6%96%B0%E5%BE%81%E7%A8%8B%E7%9A%84%E5%A5%8B%E8%BF%9B%E4%B9%90%E7%AB%A0&rsv_t=daf8LfmXdGFq%2BeY1XsPq7kMG8NEEr2G1iTp38R1IqpEHWTDVXBd43dZhlYHxUfGWrg&rqid=bba9b7b700159170&rsf=99c029d5fa93389c6243e8ef742056f5_16_30_27&rsv_dl=0_right_fyb_pchot_20811&sa=0_right_fyb_pchot_20811', 1673014999, '2023-01-05'),
(28, '泽连斯基拒绝俄方停火提议：没必要', 'https://www.baidu.com/s?wd=%E6%B3%BD%E8%BF%9E%E6%96%AF%E5%9F%BA%E6%8B%92%E7%BB%9D%E6%99%AE%E4%BA%AC%E5%81%9C%E7%81%AB%E6%8F%90%E8%AE%AE%EF%BC%9A%E6%B2%A1%E5%BF%85%E8%A6%81&tn=baidutop10&rsv_idx=2&usm=1&ie=utf-8&rsv_pq=bba9b7b700159170&oq=%E7%94%A8%E4%B8%BB%E6%97%8B%E5%BE%8B%E5%A5%8F%E5%93%8D%E6%96%B0%E5%BE%81%E7%A8%8B%E7%9A%84%E5%A5%8B%E8%BF%9B%E4%B9%90%E7%AB%A0&rsv_t=daf8LfmXdGFq%2BeY1XsPq7kMG8NEEr2G1iTp38R1IqpEHWTDVXBd43dZhlYHxUfGWrg&rqid=bba9b7b700159170&rsf=99c029d5fa93389c6243e8ef742056f5_16_30_28&rsv_dl=0_right_fyb_pchot_20811&sa=0_right_fyb_pchot_20811', 1673014999, '2023-01-05'),
(29, '中学回应让学生淡化摒弃春节意识', 'https://www.baidu.com/s?wd=%E4%B8%AD%E5%AD%A6%E5%9B%9E%E5%BA%94%E8%AE%A9%E5%AD%A6%E7%94%9F%E6%B7%A1%E5%8C%96%E6%91%92%E5%BC%83%E6%98%A5%E8%8A%82%E6%84%8F%E8%AF%86&tn=baidutop10&rsv_idx=2&usm=1&ie=utf-8&rsv_pq=bba9b7b700159170&oq=%E7%94%A8%E4%B8%BB%E6%97%8B%E5%BE%8B%E5%A5%8F%E5%93%8D%E6%96%B0%E5%BE%81%E7%A8%8B%E7%9A%84%E5%A5%8B%E8%BF%9B%E4%B9%90%E7%AB%A0&rsv_t=daf8LfmXdGFq%2BeY1XsPq7kMG8NEEr2G1iTp38R1IqpEHWTDVXBd43dZhlYHxUfGWrg&rqid=bba9b7b700159170&rsf=99c029d5fa93389c6243e8ef742056f5_16_30_29&rsv_dl=0_right_fyb_pchot_20811&sa=0_right_fyb_pchot_20811', 1673014999, '2023-01-05'),
(30, '北京中小学2月13日如期正常开学', 'https://www.baidu.com/s?wd=%E5%8C%97%E4%BA%AC%E4%B8%AD%E5%B0%8F%E5%AD%A62%E6%9C%8813%E6%97%A5%E5%A6%82%E6%9C%9F%E6%AD%A3%E5%B8%B8%E5%BC%80%E5%AD%A6&tn=baidutop10&rsv_idx=2&usm=1&ie=utf-8&rsv_pq=bba9b7b700159170&oq=%E7%94%A8%E4%B8%BB%E6%97%8B%E5%BE%8B%E5%A5%8F%E5%93%8D%E6%96%B0%E5%BE%81%E7%A8%8B%E7%9A%84%E5%A5%8B%E8%BF%9B%E4%B9%90%E7%AB%A0&rsv_t=7e3bC3yJTwXlF8vpWVPRV4vFhjyZeRIPdt4uMx4ZakuMYPeA3YKljdeUEmlQEM%2Fwiw&rqid=bba9b7b700159170&rsf=99c029d5fa93389c6243e8ef742056f5_16_30_30&rsv_dl=0_right_fyb_pchot_20811&sa=0_right_fyb_pchot_20811', 1673014999, '2023-01-05'),
(31, '新冠重新分为轻型中型重型危重型', 'https://www.baidu.com/s?wd=%E6%96%B0%E5%86%A0%E9%87%8D%E6%96%B0%E5%88%86%E4%B8%BA%E8%BD%BB%E5%9E%8B%E4%B8%AD%E5%9E%8B%E9%87%8D%E5%9E%8B%E5%8D%B1%E9%87%8D%E5%9E%8B&tn=baidutop10&rsv_idx=2&usm=1&ie=utf-8&rsv_pq=bba9b7b700159170&oq=%E7%94%A8%E4%B8%BB%E6%97%8B%E5%BE%8B%E5%A5%8F%E5%93%8D%E6%96%B0%E5%BE%81%E7%A8%8B%E7%9A%84%E5%A5%8B%E8%BF%9B%E4%B9%90%E7%AB%A0&rsv_t=7e3bC3yJTwXlF8vpWVPRV4vFhjyZeRIPdt4uMx4ZakuMYPeA3YKljdeUEmlQEM%2Fwiw&rqid=bba9b7b700159170&rsf=99c029d5fa93389c6243e8ef742056f5_31_45_31&rsv_dl=0_right_fyb_pchot_20811&sa=0_right_fyb_pchot_20811', 1673014999, '2023-01-05');

-- --------------------------------------------------------

--
-- 表的结构 `good_path`
--

CREATE TABLE IF NOT EXISTS `good_path` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '路径',
  `from_address` char(20) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '起始地点',
  `to_address` char(20) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '到达地点',
  `distance` int NOT NULL DEFAULT '0' COMMENT '距离',
  PRIMARY KEY (`id`),
  KEY `from_address` (`from_address`),
  KEY `to_address` (`to_address`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='最优路径';

--
-- 转存表中的数据 `good_path`
--

INSERT INTO `good_path` (`id`, `from_address`, `to_address`, `distance`) VALUES
(1, 'A', 'B1', 5),
(2, 'A', 'B2', 3),
(3, 'B1', 'C1', 1),
(4, 'B1', 'C2', 3),
(5, 'B1', 'C3', 6),
(6, 'B2', 'C2', 8),
(7, 'B2', 'C3', 7),
(8, 'B2', 'C4', 6),
(9, 'C1', 'D1', 6),
(10, 'C1', 'D2', 8),
(11, 'C2', 'D1', 3),
(12, 'C2', 'D2', 5),
(13, 'C3', 'D2', 3),
(14, 'C3', 'D3', 3),
(15, 'C4', 'D2', 8),
(16, 'C4', 'D3', 4),
(17, 'D1', 'E', 3),
(18, 'D2', 'E', 2),
(19, 'D3', 'E', 2);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
