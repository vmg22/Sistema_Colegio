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
-- Table structure for table `comunicacion_destinatario`
--

DROP TABLE IF EXISTS `comunicacion_destinatario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comunicacion_destinatario` (
  `id_destinatario` int NOT NULL AUTO_INCREMENT,
  `id_comunicacion` int NOT NULL,
  `id_alumno` int DEFAULT NULL,
  `id_docente` int DEFAULT NULL,
  `id_curso` int DEFAULT NULL,
  `id_tutor` int DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `asistio` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_destinatario`),
  KEY `id_alumno` (`id_alumno`),
  KEY `id_docente` (`id_docente`),
  KEY `id_curso` (`id_curso`),
  KEY `id_tutor` (`id_tutor`),
  KEY `idx_comunicacion_destinatario` (`id_comunicacion`,`id_alumno`,`id_docente`,`id_curso`,`id_tutor`),
  CONSTRAINT `comunicacion_destinatario_ibfk_1` FOREIGN KEY (`id_comunicacion`) REFERENCES `comunicacion` (`id_comunicacion`) ON DELETE CASCADE,
  CONSTRAINT `comunicacion_destinatario_ibfk_2` FOREIGN KEY (`id_alumno`) REFERENCES `alumno` (`id_alumno`) ON DELETE CASCADE,
  CONSTRAINT `comunicacion_destinatario_ibfk_3` FOREIGN KEY (`id_docente`) REFERENCES `docente` (`id_docente`) ON DELETE CASCADE,
  CONSTRAINT `comunicacion_destinatario_ibfk_4` FOREIGN KEY (`id_curso`) REFERENCES `curso` (`id_curso`) ON DELETE CASCADE,
  CONSTRAINT `comunicacion_destinatario_ibfk_5` FOREIGN KEY (`id_tutor`) REFERENCES `tutor` (`id_tutor`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comunicacion_destinatario`
--

LOCK TABLES `comunicacion_destinatario` WRITE;
/*!40000 ALTER TABLE `comunicacion_destinatario` DISABLE KEYS */;
INSERT INTO `comunicacion_destinatario` VALUES (1,1,NULL,NULL,NULL,1,'rgomez.tutor@example.com',0,'2025-10-22 00:52:42',NULL),(2,1,NULL,NULL,NULL,2,'mgomez.tutor@example.com',0,'2025-10-22 00:52:42',NULL),(3,1,NULL,NULL,NULL,3,'cfernandez.tutor@example.com',0,'2025-10-22 00:52:42',NULL),(4,1,NULL,NULL,NULL,4,'mjuarez.tutor@example.com',0,'2025-10-22 00:52:42',NULL),(5,1,NULL,NULL,NULL,5,'mdiaz.tutor@example.com',0,'2025-10-22 00:52:42',NULL),(6,1,NULL,NULL,NULL,6,'storres.tutor@example.com',0,'2025-10-22 00:52:42',NULL),(7,2,4,NULL,1,5,'mdiaz.tutor@example.com',1,'2025-11-04 02:35:39',NULL),(8,3,11,NULL,1,7,'msosa.tutor@example.com',1,'2025-11-04 19:11:04',NULL),(9,5,14,NULL,1,11,'msala@example.com',1,'2025-11-10 03:18:44',NULL),(10,6,3,NULL,1,4,'mjuarez.tutor@example.com',1,'2025-11-10 03:19:42',NULL),(11,8,28,NULL,12,26,'denisesofiasanchez2@gmail.com',1,'2025-11-10 17:51:41',NULL),(12,9,28,NULL,12,26,'denisesofiasanchez2@gmail.com',1,'2025-11-10 17:53:05',NULL),(13,10,28,NULL,12,26,'denisesofiasanchez2@gmail.com',1,'2025-11-10 17:54:05',NULL),(14,11,28,NULL,12,26,'denisesofiasanchez2@gmail.com',1,'2025-11-10 17:54:57',NULL),(15,12,29,NULL,13,27,'nadiapetrelli25@gmail.com',1,'2025-11-10 18:16:47',NULL),(16,13,29,NULL,13,27,'nadiapetrelli25@gmail.com',1,'2025-11-10 18:17:53',NULL),(17,14,3,NULL,1,4,'mjuarez.tutor@example.com',1,'2025-11-10 18:43:36',NULL),(18,15,14,NULL,1,11,'msala@example.com',1,'2025-11-10 22:34:36',NULL),(19,16,30,NULL,14,28,'antonia@gmail.com',1,'2025-11-28 22:53:31',NULL);
/*!40000 ALTER TABLE `comunicacion_destinatario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-15 16:58:45
