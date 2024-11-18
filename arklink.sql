-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 18, 2024 at 02:05 AM
-- Server version: 8.0.37
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `arklink`
--

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int NOT NULL,
  `name` text NOT NULL,
  `img` longblob NOT NULL,
  `category` text NOT NULL,
  `price` text NOT NULL,
  `size` text NOT NULL,
  `producer` text NOT NULL,
  `reg_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `img`, `category`, `price`, `size`, `producer`, `reg_date`) VALUES
(1, 'Amaranth', 0x433a78616d7070096d70706870413733372e746d70, 'Tile', '993293', '33333333', 'Royal', '2024-11-17 18:46:53'),
(2, '24912', 0x433a78616d7070096d70706870313031382e746d70, 'Tile', '993293', '33333333', 'Time ceramics', '2024-11-17 18:53:53'),
(3, '24302', 0x433a78616d7070096d70706870384243442e746d70, 'Tile', '993293', '33333333', 'Goodwill ceramics', '2024-11-17 18:55:30');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `firstname` varchar(20) NOT NULL,
  `lastname` varchar(20) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(10) DEFAULT 'customer',
  `phonenumber` int NOT NULL,
  `reg_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `firstname`, `lastname`, `email`, `password`, `role`, `phonenumber`, `reg_date`) VALUES
(2, 'obiyom', 'bright', 'brightom2@gmail.com', '$2y$10$kYxv9tyPMWAom5YYucIzSuyFgOb1741UeV6GtoziaZ1r7KRmLtYFm', 'customer', 999999999, '2024-11-02 01:48:30'),
(3, 'obiyom', 'bright', 'brig66htobiyom2@gmail.com', '$2y$10$fgKtoJLpOMFdlF6KVRikEeaTPElQlkNSZuunvMhf6xJsPHTsC.U6e', 'customer', 66666666, '2024-11-02 02:00:41'),
(4, 'obiyom', 'bright', 'brighto666666biyom2@gmail.com', '$2y$10$AnJeZWUICmTkhE3QGajzHueAVfy0OzXKAbVw60Vv3SxuxaP78hvPi', 'customer', 666666, '2024-11-02 02:01:47'),
(5, 'obiyom', 'bright', 'brighto666666b666666iyom2@gmail.com', '$2y$10$nFX4RjjRpDzURJVa1713Ae.pnEv4e4pVIBhAfkhBIfyADAaqxmY16', 'customer', 666666, '2024-11-02 02:02:14'),
(6, 'obiyom', 'bright', 'b666666rightobiyom2@gmail.com', '$2y$10$eMGxoIxD.7NvheEHZXg.H.kUcbdmBEqas8xMjKiZnh/7.H18Gov6W', 'customer', 666666, '2024-11-02 02:02:48'),
(7, 'obiyom', 'bright', 'brightobiyom2@gmail.com', '$2y$10$lyHjdzKsXAhyo0X06hiHa.5x4zJzhtZQlF8NRluLYbqsLOQhiKCFK', 'customer', 555555555, '2024-11-02 03:10:54'),
(8, 'obiyom', 'bright', 'obiyombright@gmail.com', '$2y$10$vbqW5oZUxTZwGwBBoJNn4ejq5nBklFb/ZfeOD8DB0MebyQJOArgRq', 'customer', 222222222, '2024-11-02 03:49:35'),
(9, 'Henry ', 'Hart', 'henryhart@gmail.com', '$2y$10$WfQeeQ3Oinp7VFQ34RXJTuIv8ANKzWN1AiUW05GjxCvW1Ik81BoDy', 'customer', 29429249, '2024-11-03 14:15:37'),
(10, 'obiyom', 'bright', 'obiyomo@gmail.com', '$2y$10$gqG2/TSwLeHJRUEQZ/GYvu4WbEkZF2L./.sdHE7bEPJ5OmkPN00CG', 'customer', 999999, '2024-11-08 20:54:54');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
