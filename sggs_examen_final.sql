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
-- Table structure for table `examen_final`
--

DROP TABLE IF EXISTS `examen_final`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `examen_final` (
  `id_examen_final` int NOT NULL AUTO_INCREMENT,
  `id_alumno` int NOT NULL,
  `id_materia` int NOT NULL,
  `id_curso` int NOT NULL,
  `anio_lectivo` int NOT NULL,
  `instancia` enum('diciembre','febrero','marzo','extraordinaria') NOT NULL,
  `fecha_examen` date NOT NULL,
  `id_docente` int DEFAULT NULL,
  `nota_obtenida` decimal(4,2) DEFAULT NULL,
  `aprobada` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_examen_final`),
  UNIQUE KEY `uk_examen_unico` (`id_alumno`,`id_materia`,`anio_lectivo`,`instancia`),
  KEY `fk_final_materia` (`id_materia`),
  KEY `fk_final_curso` (`id_curso`),
  KEY `fk_final_docente` (`id_docente`),
  CONSTRAINT `fk_final_alumno` FOREIGN KEY (`id_alumno`) REFERENCES `alumno` (`id_alumno`),
  CONSTRAINT `fk_final_curso` FOREIGN KEY (`id_curso`) REFERENCES `curso` (`id_curso`),
  CONSTRAINT `fk_final_docente` FOREIGN KEY (`id_docente`) REFERENCES `docente` (`id_docente`),
  CONSTRAINT `fk_final_materia` FOREIGN KEY (`id_materia`) REFERENCES `materia` (`id_materia`),
  CONSTRAINT `examen_final_chk_1` CHECK ((`nota_obtenida` between 0 and 10))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `examen_final`
--

LOCK TABLES `examen_final` WRITE;
/*!40000 ALTER TABLE `examen_final` DISABLE KEYS */;
/*!40000 ALTER TABLE `examen_final` ENABLE KEYS */;
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
