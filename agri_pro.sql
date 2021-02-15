-- phpMyAdmin SQL Dump
-- version 4.8.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 14, 2021 at 05:35 PM
-- Server version: 10.1.37-MariaDB
-- PHP Version: 7.3.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `agri pro`
--

-- --------------------------------------------------------

--
-- Table structure for table `buy products`
--

CREATE TABLE `buy products` (
  `email` varchar(30) NOT NULL,
  `pid` int(10) NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `buy products`
--

INSERT INTO `buy products` (`email`, `pid`, `time`) VALUES
('abc@xyz', 1, '2021-02-14 16:10:25');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `product name` varchar(50) NOT NULL,
  `pid` int(10) NOT NULL,
  `price` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`product name`, `pid`, `price`) VALUES
('insecticide', 1, 200);

-- --------------------------------------------------------

--
-- Table structure for table `soil data`
--

CREATE TABLE `soil data` (
  `crop` varchar(20) NOT NULL,
  `soil` varchar(20) NOT NULL,
  `climate` varchar(20) NOT NULL,
  `soil ph` int(2) NOT NULL,
  `cid` int(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `user feed`
--

CREATE TABLE `user feed` (
  `firstame` varchar(30) NOT NULL,
  `comments` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `firstname` varchar(20) NOT NULL,
  `lastname` varchar(20) NOT NULL,
  `phone` decimal(10,0) NOT NULL,
  `email` varchar(30) NOT NULL,
  `password` varchar(15) NOT NULL,
  `address` varchar(50) NOT NULL,
  `dob` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`firstname`, `lastname`, `phone`, `email`, `password`, `address`, `dob`) VALUES
('hanumanth', 'reddy', '984563211', 'abc@xyz', '*6691484EA6B50D', '1111kkkk', '2021-02-01');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `buy products`
--
ALTER TABLE `buy products`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `soil data`
--
ALTER TABLE `soil data`
  ADD UNIQUE KEY `cid` (`cid`),
  ADD UNIQUE KEY `crop` (`crop`);

--
-- Indexes for table `user feed`
--
ALTER TABLE `user feed` ADD FULLTEXT KEY `comments` (`comments`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`email`),
  ADD UNIQUE KEY `phone` (`phone`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
