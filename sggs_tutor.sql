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
-- Table structure for table `tutor`
--

DROP TABLE IF EXISTS `tutor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tutor` (
  `id_tutor` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int DEFAULT NULL,
  `dni_tutor` varchar(20) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `direccion` varchar(150) DEFAULT NULL,
  `parentesco` enum('padre','madre','tutor legal','abuelo/a','otro') NOT NULL,
  `estado` enum('activo','inactivo') DEFAULT 'activo',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_tutor`),
  UNIQUE KEY `dni_tutor` (`dni_tutor`),
  KEY `id_usuario` (`id_usuario`),
  KEY `idx_tutor_nombre_apellido` (`nombre`,`apellido`),
  CONSTRAINT `tutor_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tutor`
--

LOCK TABLES `tutor` WRITE;
/*!40000 ALTER TABLE `tutor` DISABLE KEYS */;
INSERT INTO `tutor` VALUES (1,7,'22111222','Roberto','Gómez','rgomez.tutor@example.com',NULL,NULL,'padre','activo','2025-10-22 00:52:42','2025-10-22 00:52:42',NULL),(2,NULL,'23222333','Maria','Gómez','mgomez.tutor@example.com',NULL,NULL,'madre','activo','2025-10-22 00:52:42','2025-10-22 00:52:42',NULL),(3,NULL,'24333444','Carlos','Fernández','cfernandez.tutor@example.com',NULL,NULL,'padre','activo','2025-10-22 00:52:42','2025-10-22 00:52:42',NULL),(4,8,'15444555','Marta','Juárez','mjuarez.tutor@example.com',NULL,NULL,'abuelo/a','activo','2025-10-22 00:52:42','2025-10-22 00:52:42',NULL),(5,NULL,'21929970','Mirix','Salax','miri.tutor@example.com','38120040065','Salta 123','madre','activo','2025-10-22 00:52:42','2025-11-06 20:01:38',NULL),(6,NULL,'27666777','Silvia','Torres','storres.tutor@example.com',NULL,NULL,'tutor legal','activo','2025-10-22 00:52:42','2025-10-22 00:52:42',NULL),(7,NULL,'28777888','Marcos','Sosa','msosa.tutor@example.com',NULL,NULL,'padre','activo','2025-10-22 00:52:42','2025-10-22 00:52:42',NULL),(8,NULL,'29888999','Ana','Alvarez','aalvarez.tutor@example.com','38120040065','','madre','inactivo','2025-10-22 00:52:42','2025-11-07 19:59:28',NULL),(9,NULL,'21999000','Jorge','Paez','jpaez.tutor@example.com',NULL,NULL,'tutor legal','activo','2025-10-22 00:52:42','2025-10-22 00:52:42',NULL),(10,NULL,'22000111','Laura','Martinez','lmartinez.tutor@example.com',NULL,NULL,'madre','activo','2025-10-22 00:52:42','2025-10-22 00:52:42',NULL),(11,7,'21929978','Mirian','Salazar','msala@example.com','3813001518','Pje Houssay 3000','madre','activo','2025-10-24 22:08:31','2025-10-24 22:08:31',NULL),(12,NULL,'21829421','Julio','Pucharras','jpequipcomyhogar@gmail.com','3814060215','Pje Houssay 3100','padre','activo','2025-11-06 03:04:50','2025-11-06 03:04:50',NULL),(13,NULL,'216547896','miri','sla','mir@gmail.com','386447777',NULL,'madre','activo','2025-11-06 03:13:28','2025-11-06 03:13:28',NULL),(14,NULL,'21789423','Marcela','Gimenez','madre@gmail.com','381456213','Cordoba 124','madre','activo','2025-11-06 18:37:10','2025-11-06 18:37:10',NULL),(15,NULL,'21926475','marta','bracamonte',NULL,NULL,NULL,'abuelo/a','activo','2025-11-06 19:17:57','2025-11-06 19:17:57',NULL),(16,NULL,'19635421','kira','salazar','kira@gmail.com','381456829','Paraguay 1203','madre','activo','2025-11-06 19:19:24','2025-11-06 19:19:24',NULL),(18,9,'21929974','Mirian','Salazar','msala@example.com','3813001518','Pje Houssay 3000','madre','activo','2025-11-06 23:42:48','2025-11-06 23:42:48',NULL),(19,NULL,'30564872','Mirian Del Vallee','Salazar','sala@gmail.com.ar','3813001518','El Salado 2003','madre','activo','2025-11-08 22:50:35','2025-11-08 22:51:39',NULL),(20,NULL,'42100300','sole','pando',NULL,'3814500600',NULL,'madre','activo','2025-11-08 23:06:05','2025-11-08 23:06:05',NULL),(21,NULL,'10000000','lucas','rodrigues','pedro@gmail.com','381400600','salta 89','padre','activo','2025-11-09 15:47:57','2025-11-09 15:47:57',NULL),(22,NULL,'30600600','regerg','ergerg',NULL,'3422342',NULL,'padre','activo','2025-11-09 20:19:31','2025-11-09 20:19:31',NULL),(23,NULL,'5634635','dgsbfs','sfbgb',NULL,'534543',NULL,'padre','activo','2025-11-09 20:28:36','2025-11-09 20:28:36',NULL),(24,NULL,'23131111','pepe','sanchez','','21312444','','padre','activo','2025-11-10 00:51:28','2025-11-10 01:00:21',NULL),(25,NULL,'342432','ergre','regrg',NULL,'3424234123',NULL,'abuelo/a','activo','2025-11-10 01:02:51','2025-11-10 01:02:51',NULL),(26,NULL,'40600900','denise anaa','sanchez','denisesofiasanchez2@gmail.com','381100100','uruguay 500','madre','activo','2025-11-10 17:50:22','2025-11-10 17:50:55',NULL),(27,NULL,'74100200','Nadia','Petrelli','nadiapetrelli25@gmail.com','381600900','Rivadavia 1200','madre','activo','2025-11-10 18:13:46','2025-11-10 18:13:46',NULL),(28,NULL,'17200100','Antonia Del Vale','Pisa','antonia@gmail.com','381400200','Juan B Teran 2000','madre','activo','2025-11-28 18:48:51','2025-11-28 18:48:51',NULL),(29,NULL,'61500200','Ernesto','Rodriguez','ernesto@gmail.com','381555666','San Lorenzo 1200','padre','activo','2025-11-28 18:57:59','2025-11-28 18:57:59',NULL),(30,NULL,'11444555','Denise','Garnica','deniseg@gmail.com','381222000','Maipu 1200','madre','activo','2025-11-28 18:59:57','2025-11-28 18:59:57',NULL),(31,NULL,'34234423','gerge','rgerg',NULL,'324234',NULL,'padre','activo','2025-12-10 02:11:48','2025-12-10 02:11:48',NULL);
/*!40000 ALTER TABLE `tutor` ENABLE KEYS */;
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
