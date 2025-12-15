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
-- Table structure for table `alumno`
--

DROP TABLE IF EXISTS `alumno`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alumno` (
  `id_alumno` int NOT NULL AUTO_INCREMENT,
  `dni_alumno` varchar(20) NOT NULL,
  `nombre_alumno` varchar(100) NOT NULL,
  `apellido_alumno` varchar(100) NOT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `lugar_nacimiento` varchar(100) DEFAULT NULL,
  `direccion` varchar(150) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `fecha_inscripcion` date DEFAULT NULL,
  `estado` enum('activo','egresado','baja','suspendido','inactivo') NOT NULL DEFAULT 'activo',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_alumno`),
  UNIQUE KEY `dni_alumno` (`dni_alumno`),
  KEY `idx_alumno_nombre_apellido` (`nombre_alumno`,`apellido_alumno`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alumno`
--

LOCK TABLES `alumno` WRITE;
/*!40000 ALTER TABLE `alumno` DISABLE KEYS */;
INSERT INTO `alumno` VALUES (1,'50111222','Lucas','Gómez','2012-05-15',NULL,NULL,NULL,'lucas.gomez@example.com','2025-02-15','inactivo','2025-10-22 00:52:42','2025-11-06 22:41:08','2025-11-06 22:41:08'),(2,'50222333','Sofía','Fernández','2012-09-22',NULL,NULL,NULL,'sofia.fernandez@example.com','2025-11-28','egresado','2025-10-22 00:52:42','2025-11-28 18:49:35',NULL),(3,'50333444','Mateo','Rodríguez','2012-02-10',NULL,NULL,NULL,'mateo.rodriguez@example.com','2025-02-17','activo','2025-10-22 00:52:42','2025-10-22 00:52:42',NULL),(4,'50444777','Valentina Roberta','Díaz Paz','2012-11-22','San Miguel de Tucuman','Av america 1374','381596478','valentina.diaz@example.com.ar','2025-11-10','suspendido','2025-10-22 00:52:42','2025-11-10 00:50:42',NULL),(5,'50555666','Julián','Torres','2012-01-05',NULL,NULL,NULL,'julian.torres@example.com','2025-02-19','activo','2025-10-22 00:52:42','2025-10-22 00:52:42',NULL),(6,'49111222','Martina','Sosa','2011-03-12',NULL,NULL,NULL,'martina.sosa@example.com','2025-02-15','activo','2025-10-22 00:52:42','2025-10-22 00:52:42',NULL),(7,'49222334','Thiago Emanuel','Alvarez','2011-07-20','San Miguel de Tucuman','Viamonte 1660',NULL,'thiago.alvarez@example.com','2025-11-28','activo','2025-10-22 00:52:42','2025-11-28 18:49:44',NULL),(8,'49333444','Emilia','Paez','2011-10-01',NULL,NULL,NULL,'emilia.paez@example.com','2025-02-17','inactivo','2025-10-22 00:52:42','2025-11-06 02:15:20','2025-11-06 02:15:20'),(9,'48111222','Bautista','Garcia','2010-04-25','','','','bautista.garcia@example.com',NULL,'inactivo','2025-10-22 00:52:42','2025-11-10 01:02:09','2025-11-10 01:02:09'),(10,'48222332','Olivia Marcela','Martinez Lopez','2010-08-18','Catamarca','Viamonte 1660','3814956789','olivia.martinez2@example.com',NULL,'activo','2025-10-22 00:52:42','2025-11-06 18:35:47',NULL),(11,'43965740','Agustina','Pucharras','2002-06-05','Tucuman','Houssay 3430','3814060647','agusp@example.com','2025-02-15','inactivo','2025-10-24 21:53:45','2025-11-06 02:10:49','2025-11-06 02:10:49'),(13,'43965741','Agustina Nahir','Pucharras','2002-06-05','Tucuman','Houssay 3430','3814060647','agusp@example.com','2025-02-15','inactivo','2025-10-24 22:21:50','2025-11-06 02:14:43','2025-11-06 02:14:43'),(14,'43965742','Agustina Nahir','Pucharras','2002-06-05','Tucuman','Houssay 3430','3814060647','agusp@example.com','2025-02-15','activo','2025-10-24 22:26:40','2025-10-24 22:26:40',NULL),(15,'21929976','Mirian Del Valle','Salazar','2005-06-20','Catamarca','Pje Houssay 3130','3813001518','pucharra81@gmail.com',NULL,'inactivo','2025-11-06 03:04:50','2025-11-06 03:06:10',NULL),(16,'21369789','lucas','pucharras','2025-11-05','tucuman','pj hou','3816666777','l@gmail.com','2025-11-06','activo','2025-11-06 03:13:28','2025-11-06 03:13:28',NULL),(17,'21659789','Matias','Garnica','2025-11-03','La Cocha','Marcos Paz 123','3814555666','mvg@gmail.com','2025-11-28','activo','2025-11-06 18:37:10','2025-11-28 18:55:22',NULL),(18,'32156478','Nahir','Pucharras','2025-11-03','Santiago del Estero','Thames 382',NULL,NULL,'2025-11-06','activo','2025-11-06 19:17:57','2025-11-06 19:17:57',NULL),(19,'24856321','Polo','Pucharras','2025-11-04','La Banda','Pje payro 1320','381555555','polo@gmail.com','2025-11-06','activo','2025-11-06 19:19:24','2025-11-06 19:19:24',NULL),(20,'43965748','Agucha Nahirr','Pucharras','2002-06-05','Tucuman','Houssay 3432','3814060644','agusp@example.com',NULL,'activo','2025-11-06 23:41:46','2025-11-08 22:48:52',NULL),(21,'32654720','Flora','Pucharras','2025-07-16','El Cadillal','Buenos Aires 829','381200600','flora@gmail.com','2025-11-08','activo','2025-11-08 22:50:35','2025-11-08 22:50:35',NULL),(22,'12365745','vlack','pando','2025-11-05',NULL,NULL,NULL,NULL,'2025-11-08','inactivo','2025-11-08 23:06:05','2025-11-28 18:49:49','2025-11-28 18:49:49'),(23,'23000000','joaquin','rodrigues','2025-10-27','salta','jujuy 200','381500600','joa@gmail.com','2025-11-09','activo','2025-11-09 15:47:57','2025-11-09 15:47:57',NULL),(24,'21300644','gee','ergr','2025-11-04',NULL,NULL,NULL,NULL,'2025-11-10','inactivo','2025-11-09 20:19:31','2025-11-28 18:49:30','2025-11-28 18:49:30'),(25,'43534534','gsrstgrt','trgtrg','2025-11-04',NULL,NULL,NULL,NULL,'2025-11-09','inactivo','2025-11-09 20:28:36','2025-11-28 18:50:14','2025-11-28 18:50:14'),(26,'3221321','Denise','Sanchez','2025-11-04',NULL,NULL,NULL,NULL,'2025-11-28','activo','2025-11-10 00:51:28','2025-11-28 18:50:09',NULL),(27,'2312321312','erfer','erfer','2025-11-03',NULL,NULL,NULL,NULL,'2025-11-10','inactivo','2025-11-10 01:02:51','2025-11-28 18:49:26','2025-11-28 18:49:26'),(28,'10200500','Aguchis','Pucharras','2002-05-06','Salta','Venezuela 300','381700700','aguchis@gmail.com','2025-11-10','inactivo','2025-11-10 17:50:22','2025-11-28 18:50:20','2025-11-28 18:50:20'),(29,'45100300','marcelo carlos','medina','2002-06-06','Salta','Paraguay 3200','381700100','marcelo@gmail.com','2025-11-10','inactivo','2025-11-10 18:13:46','2025-11-28 18:54:46','2025-11-28 18:54:46'),(30,'32100700','Marcelo','Medina','2005-02-22','Tucumán','Av America 1374','3814581535','m@gmail.com','2025-11-28','activo','2025-11-28 18:48:51','2025-11-28 18:48:51',NULL),(31,'30800400','Samuel','Hernandez','2002-06-28','Catamarca','San Lorenzo 1820','381111200','samuel@gmail.com','2025-11-28','activo','2025-11-28 18:57:59','2025-11-28 18:57:59',NULL),(32,'60500400','Micaela','Garnica','2025-01-02','Tucuman','Maipu 660','3811234100','micaela@gmail.com','2025-11-28','activo','2025-11-28 18:59:57','2025-11-28 18:59:57',NULL),(33,'34223422','fwefew','wefwef','2025-12-03','Catamarca','Viamonte 1660',NULL,'ewfwe@gmail.com','2025-12-10','activo','2025-12-10 02:11:48','2025-12-10 02:11:48',NULL);
/*!40000 ALTER TABLE `alumno` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-15 16:58:46
