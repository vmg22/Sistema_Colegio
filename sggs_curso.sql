CREATE DATABASE  IF NOT EXISTS `sggs` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `sggs`;
-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: sggs
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `curso`
--

DROP TABLE IF EXISTS `curso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `curso` (
  `id_curso` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `anio` int NOT NULL,
  `division` varchar(10) NOT NULL,
  `turno` enum('mañana','tarde','noche') NOT NULL,
  `id_docente_tutor` int DEFAULT NULL,
  `estado` enum('activo','inactivo','completado') DEFAULT 'activo',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_curso`),
  KEY `id_docente_tutor` (`id_docente_tutor`),
  KEY `idx_curso_anio_division` (`anio`,`division`,`turno`),
  CONSTRAINT `curso_ibfk_1` FOREIGN KEY (`id_docente_tutor`) REFERENCES `docente` (`id_docente`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `curso`
--

LOCK TABLES `curso` WRITE;
/*!40000 ALTER TABLE `curso` DISABLE KEYS */;
INSERT INTO `curso` VALUES (1,'Primero A',1,'A','mañana',1,'activo','2025-10-22 00:52:42','2025-11-10 20:42:20',NULL),(2,'Primero C',1,'C','mañana',4,'activo','2025-10-22 00:52:42','2025-11-08 16:36:15',NULL),(3,'Segundo A',2,'A','tarde',2,'inactivo','2025-10-22 00:52:42','2025-11-10 00:06:54','2025-11-10 00:06:54'),(4,'Tercero A',3,'A','tarde',3,'inactivo','2025-10-22 00:52:42','2025-11-08 16:39:37','2025-11-08 16:39:37'),(5,'Segundo B',2,'B','mañana',NULL,'inactivo','2025-11-08 16:17:47','2025-11-08 16:39:19',NULL),(6,'Tercero B',3,'B','mañana',NULL,'activo','2025-11-08 16:40:05','2025-11-08 16:40:05',NULL),(7,'Cuarto B',4,'B','tarde',NULL,'activo','2025-11-08 16:53:57','2025-11-10 00:06:47',NULL),(8,'Sexto A',6,'A','mañana',NULL,'activo','2025-11-08 19:21:17','2025-11-08 19:21:17',NULL),(9,'Quinto A',5,'A','mañana',NULL,'activo','2025-11-08 22:13:55','2025-11-08 22:13:55',NULL),(10,'Cuarto B',4,'B','mañana',NULL,'activo','2025-11-09 15:44:48','2025-11-09 15:44:48',NULL),(11,'Sexto C',6,'C','mañana',NULL,'activo','2025-11-10 00:07:04','2025-11-10 00:07:04',NULL),(12,'Tercero A',3,'A','mañana',NULL,'activo','2025-11-10 17:47:02','2025-11-10 17:47:14',NULL),(13,'Cuarto A',4,'A','mañana',NULL,'activo','2025-11-10 18:09:48','2025-11-10 18:10:06',NULL),(14,'Primero B',1,'B','mañana',NULL,'activo','2025-11-28 18:31:22','2025-11-28 18:31:22',NULL);
/*!40000 ALTER TABLE `curso` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-15 16:58:47
