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
-- Table structure for table `comunicacion`
--

DROP TABLE IF EXISTS `comunicacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comunicacion` (
  `id_comunicacion` int NOT NULL AUTO_INCREMENT,
  `asunto` varchar(150) NOT NULL,
  `contenido` text NOT NULL,
  `fecha_envio` datetime DEFAULT CURRENT_TIMESTAMP,
  `id_usuario` int NOT NULL,
  `destinatario_tipo` enum('alumno','docente','curso','tutor','todos') NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_comunicacion`),
  KEY `id_usuario` (`id_usuario`),
  KEY `idx_comunicacion_fecha` (`fecha_envio`),
  CONSTRAINT `comunicacion_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comunicacion`
--

LOCK TABLES `comunicacion` WRITE;
/*!40000 ALTER TABLE `comunicacion` DISABLE KEYS */;
INSERT INTO `comunicacion` VALUES (1,'Reunión de Padres - 1er Año A','Estimados tutores, los convocamos...','2025-10-21 21:52:42',6,'curso','2025-10-22 00:52:42',NULL),(2,'Alerta de Asistencia (0/20)','Alerta de Asistencia','2025-11-03 23:35:39',1,'alumno','2025-11-04 02:35:39',NULL),(3,'Alerta de Calificaciones: Pucharras, Agustina','\n        <p>Estimado/a tutor/a,</p>\n        <p>Le informamos que el alumno <strong>Pucharras, Agustina</strong> presenta un rendimiento académico que requiere seguimiento.</p>\n        <p><strong>Detalle:</strong> Calificaciones Bajas (Promedio actual: <strong>5.00</strong>)</p>\n        <p>Por favor, le solicitamos contactarse con la institución para conversar sobre su situación.</p>\n      ','2025-11-04 16:11:04',1,'alumno','2025-11-04 19:11:04',NULL),(4,'Alerta de Calificaciones: pando, vlack','\n        <p>Estimado/a tutor/a,</p>\n        <p>Le informamos que el alumno <strong>pando, vlack</strong> presenta un rendimiento académico que requiere seguimiento.</p>\n        <p><strong>Detalle:</strong> Calificaciones Bajas (Promedio actual: <strong>4.50</strong>)</p>\n        <p>Por favor, le solicitamos contactarse con la institución para conversar sobre su situación.</p>\n      ','2025-11-10 00:17:01',1,'alumno','2025-11-10 03:17:01',NULL),(5,'Alerta de Calificaciones: Pucharras, Agustina Nahir','\n        <p>Estimado/a tutor/a,</p>\n        <p>Le informamos que el alumno <strong>Pucharras, Agustina Nahir</strong> presenta un rendimiento académico que requiere seguimiento.</p>\n        <p><strong>Detalle:</strong> Calificaciones Bajas (Promedio actual: <strong>4.00</strong>)</p>\n        <p>Por favor, le solicitamos contactarse con la institución para conversar sobre su situación.</p>\n      ','2025-11-10 00:18:44',1,'alumno','2025-11-10 03:18:44',NULL),(6,'hthty','tyh','2025-11-10 00:19:42',1,'alumno','2025-11-10 03:19:42',NULL),(7,'tgrgt','rtgrt','2025-11-10 00:20:11',1,'alumno','2025-11-10 03:20:11',NULL),(8,'falta','esta faltando mucho','2025-11-10 14:51:41',1,'alumno','2025-11-10 17:51:41',NULL),(9,'Alerta de Calificaciones: Pucharras, Aguchis','\n        <p>Estimado/a tutor/a,</p>\n        <p>Le informamos que el alumno <strong>Pucharras, Aguchis</strong> presenta un rendimiento académico que requiere seguimiento.</p>\n        <p><strong>Detalle:</strong> Calificaciones Bajas (Promedio actual: <strong>0.00</strong>)</p>\n        <p>Por favor, le solicitamos contactarse con la institución para conversar sobre su situación.</p>\n      ','2025-11-10 14:53:05',1,'alumno','2025-11-10 17:53:05',NULL),(10,'Alerta de Asistencia (0/20)','Alerta de Asistencia','2025-11-10 14:54:05',1,'alumno','2025-11-10 17:54:05',NULL),(11,'deja de faltar','pokemonsuelo','2025-11-10 14:54:57',1,'alumno','2025-11-10 17:54:57',NULL),(12,'Alerta de Asistencia (0/20)','Alerta de Asistencia','2025-11-10 15:16:47',1,'alumno','2025-11-10 18:16:47',NULL),(13,'faltas','falrta mucho','2025-11-10 15:17:53',1,'alumno','2025-11-10 18:17:53',NULL),(14,'Vacaciones','Vacaciones','2025-11-10 15:43:36',1,'alumno','2025-11-10 18:43:36',NULL),(15,'Alerta de Asistencia (0/20)','Alerta de Asistencia','2025-11-10 19:34:36',1,'alumno','2025-11-10 22:34:36',NULL),(16,'Alerta de Calificaciones: Medina, Marcelo','\n        <p>Estimado/a tutor/a,</p>\n        <p>Le informamos que el alumno <strong>Medina, Marcelo</strong> presenta un rendimiento académico que requiere seguimiento.</p>\n        <p><strong>Detalle:</strong> Calificaciones Bajas (Promedio actual: <strong>4.00</strong>)</p>\n        <p>Por favor, le solicitamos contactarse con la institución para conversar sobre su situación.</p>\n      ','2025-11-28 19:53:31',1,'alumno','2025-11-28 22:53:31',NULL);
/*!40000 ALTER TABLE `comunicacion` ENABLE KEYS */;
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
