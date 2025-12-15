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
-- Table structure for table `docente`
--

DROP TABLE IF EXISTS `docente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `docente` (
  `id_docente` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int DEFAULT NULL,
  `dni_docente` varchar(20) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `especialidad` varchar(100) DEFAULT NULL,
  `estado` enum('activo','licencia','inactivo') DEFAULT 'activo',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_docente`),
  UNIQUE KEY `dni_docente` (`dni_docente`),
  KEY `id_usuario` (`id_usuario`),
  KEY `idx_docente_nombre_apellido` (`nombre`,`apellido`),
  CONSTRAINT `docente_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `docente`
--

LOCK TABLES `docente` WRITE;
/*!40000 ALTER TABLE `docente` DISABLE KEYS */;
INSERT INTO `docente` VALUES (1,2,'25123456','Juannnn','Pérez22','jperez.doc@instituto.edu.arr','','Matemáticas','activo','2025-10-22 00:52:42','2025-11-10 00:34:48',NULL),(2,3,'28765432','Maríaaaaaaaaaaa','Lópezaaaaaaaaaaaa','mlopez.doc@instituto.edu.ar','','Lengua y Literatura','inactivo','2025-10-22 00:52:42','2025-11-28 18:40:53','2025-11-28 18:40:53'),(3,4,'30111222','Carlos','Sánchez','csanchez.doc@instituto.edu.ar','','Historia','licencia','2025-10-22 00:52:42','2025-11-10 19:14:07',NULL),(4,NULL,'29555888','Ana','Díaz','adiaz.doc@instituto.edu.ar','','Biología','inactivo','2025-10-22 00:52:42','2025-11-06 22:39:58',NULL),(5,9,'21929976','julio','pucharrras','','381655995','','activo','2025-11-04 20:42:33','2025-11-08 20:30:45',NULL),(6,10,'21564820','pepe','ochoa','pepe@gmail.com','3815456978','','inactivo','2025-11-08 20:28:35','2025-11-08 20:29:56',NULL),(7,11,'21000000','denise','sanchez','gtrgtgt@gmai.com','381564596','','activo','2025-11-08 20:34:11','2025-11-08 20:35:23',NULL),(8,12,'21856321','Agustina','Pucharra',NULL,NULL,NULL,'activo','2025-11-08 22:13:15','2025-11-08 22:13:24',NULL),(9,13,'23000000','Pedro','Garcia',NULL,'381555666',NULL,'activo','2025-11-09 15:46:27','2025-11-09 15:46:37',NULL),(10,14,'21300900','Gonzalo','Pucharras',NULL,NULL,NULL,'activo','2025-11-09 23:44:52','2025-11-09 23:45:15',NULL),(11,15,'4352454','fdgsdg','fdgdf',NULL,NULL,NULL,'activo','2025-11-10 00:35:04','2025-11-10 00:35:12',NULL),(12,16,'20300400','lucas','pucharras',NULL,NULL,NULL,'activo','2025-11-10 01:47:56','2025-11-10 01:48:21',NULL),(13,17,'50400600','Sofia','Pucharras',NULL,'3814500200',NULL,'activo','2025-11-10 17:48:30','2025-11-10 17:48:47',NULL),(14,18,'31200200','matias','ferreyra',NULL,'381000000',NULL,'activo','2025-11-10 18:11:36','2025-11-10 18:11:51',NULL),(15,19,'123','Claudia','Sandez',NULL,'33445','informática','activo','2025-11-10 19:07:45','2025-11-10 19:08:32',NULL),(16,20,'30600800','marcela','medina',NULL,'381500600',NULL,'activo','2025-11-10 22:17:35','2025-11-10 22:17:57',NULL),(17,21,'20500453','Matias','Chocobar',NULL,'381500600',NULL,'activo','2025-11-28 18:40:08','2025-11-28 18:40:25',NULL),(18,25,'10500400','Claudia','Sandez',NULL,NULL,NULL,'activo','2025-11-28 18:41:24','2025-11-28 18:41:50',NULL),(19,26,'20300500','julio','pucharr',NULL,NULL,NULL,'activo','2025-12-08 22:59:42','2025-12-08 22:59:54',NULL),(20,NULL,'10200888','polo','pucharras','polox@gmail.com','381400000',NULL,'activo','2025-12-10 01:47:43','2025-12-10 01:47:43',NULL),(21,27,'10033333','kiri','pucharrras','kiri@gmail.com','381500000',NULL,'activo','2025-12-10 01:54:54','2025-12-10 01:55:23',NULL);
/*!40000 ALTER TABLE `docente` ENABLE KEYS */;
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
