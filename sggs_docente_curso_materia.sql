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
-- Table structure for table `docente_curso_materia`
--

DROP TABLE IF EXISTS `docente_curso_materia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `docente_curso_materia` (
  `id_asignacion` int NOT NULL AUTO_INCREMENT,
  `id_docente` int NOT NULL,
  `id_curso` int NOT NULL,
  `id_materia` int NOT NULL,
  `anio_lectivo` int NOT NULL,
  `estado` enum('activo','completado','inactivo') DEFAULT 'activo',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_asignacion`),
  UNIQUE KEY `unique_docente_curso_materia_anio` (`id_docente`,`id_curso`,`id_materia`,`anio_lectivo`),
  KEY `id_curso` (`id_curso`),
  KEY `id_materia` (`id_materia`),
  CONSTRAINT `docente_curso_materia_ibfk_1` FOREIGN KEY (`id_docente`) REFERENCES `docente` (`id_docente`) ON DELETE CASCADE,
  CONSTRAINT `docente_curso_materia_ibfk_2` FOREIGN KEY (`id_curso`) REFERENCES `curso` (`id_curso`) ON DELETE CASCADE,
  CONSTRAINT `docente_curso_materia_ibfk_3` FOREIGN KEY (`id_materia`) REFERENCES `materia` (`id_materia`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `docente_curso_materia`
--

LOCK TABLES `docente_curso_materia` WRITE;
/*!40000 ALTER TABLE `docente_curso_materia` DISABLE KEYS */;
INSERT INTO `docente_curso_materia` VALUES (1,1,1,1,2025,'activo','2025-10-22 00:52:42','2025-10-22 00:52:42',NULL),(2,2,1,2,2025,'activo','2025-10-22 00:52:42','2025-10-22 00:52:42',NULL),(3,3,1,3,2025,'inactivo','2025-10-22 00:52:42','2025-11-10 19:11:37',NULL),(4,1,3,5,2025,'activo','2025-10-22 00:52:42','2025-11-10 00:41:02','2025-11-10 00:41:02'),(5,2,3,6,2025,'activo','2025-10-22 00:52:42','2025-10-22 00:52:42',NULL),(6,1,3,9,2025,'activo','2025-11-04 20:55:52','2025-11-04 20:55:52',NULL),(7,5,8,14,2025,'activo','2025-11-08 20:54:00','2025-11-08 22:14:25','2025-11-08 22:14:25'),(8,5,8,13,2025,'activo','2025-11-08 20:56:21','2025-11-08 20:56:21',NULL),(9,8,9,15,2025,'activo','2025-11-08 22:14:13','2025-11-08 22:14:13',NULL),(10,8,8,14,2025,'activo','2025-11-08 22:14:43','2025-11-08 22:14:43',NULL),(11,1,10,17,2025,'activo','2025-11-09 15:45:50','2025-11-09 15:45:50',NULL),(12,7,10,16,2025,'activo','2025-11-09 15:46:04','2025-11-09 15:46:04',NULL),(13,10,7,18,2025,'activo','2025-11-09 23:49:12','2025-11-09 23:49:12',NULL),(14,1,11,12,2025,'activo','2025-11-10 00:40:48','2025-11-10 00:40:48',NULL),(15,13,12,20,2025,'activo','2025-11-10 17:49:04','2025-11-10 17:49:04',NULL),(16,14,13,21,2025,'activo','2025-11-10 18:12:15','2025-11-10 18:12:15',NULL),(17,15,1,3,2025,'activo','2025-11-10 19:12:52','2025-11-10 19:12:52',NULL),(18,17,14,22,2025,'activo','2025-11-28 18:44:04','2025-11-28 18:44:04',NULL),(19,18,14,24,2025,'activo','2025-11-28 18:44:20','2025-11-28 18:44:20',NULL),(20,21,2,1,2025,'activo','2025-12-10 02:19:24','2025-12-10 02:19:24',NULL),(21,19,6,8,2025,'activo','2025-12-10 02:40:13','2025-12-10 02:40:13',NULL);
/*!40000 ALTER TABLE `docente_curso_materia` ENABLE KEYS */;
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
