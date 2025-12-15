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
-- Table structure for table `materia`
--

DROP TABLE IF EXISTS `materia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `materia` (
  `id_materia` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text,
  `carga_horaria` int DEFAULT NULL,
  `nivel` int NOT NULL,
  `ciclo` enum('basico','orientado') DEFAULT 'basico',
  `estado` enum('activa','inactiva') DEFAULT 'activa',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_materia`),
  KEY `idx_materia_nivel` (`nivel`,`estado`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `materia`
--

LOCK TABLES `materia` WRITE;
/*!40000 ALTER TABLE `materia` DISABLE KEYS */;
INSERT INTO `materia` VALUES (1,'Matemática I','',7,1,'basico','activa','2025-10-22 00:52:42','2025-11-07 00:10:26',NULL),(2,'Lengua y Literaturita I',NULL,20,1,'basico','inactiva','2025-10-22 00:52:42','2025-11-10 00:17:50','2025-11-10 00:17:50'),(3,'Historia 1',NULL,12,1,'basico','activa','2025-10-22 00:52:42','2025-11-10 00:17:27',NULL),(4,'Geografía IIIIII','',12,1,'basico','activa','2025-10-22 00:52:42','2025-11-04 21:05:21','2025-11-04 21:05:21'),(5,'Matemática II',NULL,NULL,2,'basico','activa','2025-10-22 00:52:42','2025-10-22 00:52:42',NULL),(6,'Lengua y Literatura II',NULL,NULL,2,'basico','activa','2025-10-22 00:52:42','2025-10-22 00:52:42',NULL),(7,'Física',NULL,NULL,2,'basico','activa','2025-10-22 00:52:42','2025-10-22 00:52:42',NULL),(8,'Matemática III',NULL,NULL,3,'orientado','inactiva','2025-10-22 00:52:42','2025-11-08 18:49:45',NULL),(9,'Química',NULL,NULL,3,'orientado','activa','2025-10-22 00:52:42','2025-11-04 21:00:25',NULL),(10,'Literatura III',NULL,NULL,3,'orientado','inactiva','2025-10-22 00:52:42','2025-11-08 18:51:53','2025-11-08 18:51:53'),(11,'Fisica Quimica','',12,4,'orientado','activa','2025-11-04 21:01:42','2025-11-04 21:05:26','2025-11-04 21:05:26'),(12,'Quimica Avanzada',NULL,15,6,'orientado','inactiva','2025-11-08 18:50:24','2025-11-08 18:50:43',NULL),(13,'Lengua VI',NULL,12,6,'orientado','activa','2025-11-08 19:21:36','2025-11-08 19:21:36',NULL),(14,'Quimica VI',NULL,12,6,'basico','activa','2025-11-08 19:21:50','2025-11-08 19:21:50',NULL),(15,'Periodismo',NULL,NULL,5,'basico','activa','2025-11-08 22:13:38','2025-11-08 22:13:38',NULL),(16,'Lengua IV',NULL,12,4,'basico','activa','2025-11-09 15:45:09','2025-11-09 15:45:09',NULL),(17,'Biologia IV',NULL,NULL,4,'orientado','activa','2025-11-09 15:45:23','2025-11-09 15:45:23',NULL),(18,'Fisica Quimica IV',NULL,8,4,'basico','activa','2025-11-09 23:48:20','2025-11-09 23:48:20',NULL),(19,'Caligrafia 2',NULL,14,2,'basico','activa','2025-11-10 00:18:03','2025-11-10 00:18:03',NULL),(20,'Filosofia 3',NULL,12,3,'basico','activa','2025-11-10 17:47:40','2025-11-10 17:47:52',NULL),(21,'Programacion IV',NULL,8,4,'basico','activa','2025-11-10 18:10:49','2025-11-10 18:10:49',NULL),(22,'Biologia I',NULL,12,1,'basico','activa','2025-11-28 18:31:50','2025-11-28 18:31:50',NULL),(23,'Educacion Fisica',NULL,4,1,'basico','activa','2025-11-28 18:32:00','2025-11-28 18:32:00',NULL),(24,'Lengua y Literatura I',NULL,7,1,'basico','activa','2025-11-28 18:33:11','2025-11-28 18:33:54',NULL),(25,'Historia I',NULL,6,1,'basico','activa','2025-11-28 18:33:19','2025-11-28 18:33:49',NULL),(26,'Quimica I',NULL,6,1,'basico','activa','2025-11-28 18:33:44','2025-11-28 18:33:44',NULL);
/*!40000 ALTER TABLE `materia` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-15 16:58:48
