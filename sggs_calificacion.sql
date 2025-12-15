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
-- Table structure for table `calificacion`
--

DROP TABLE IF EXISTS `calificacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `calificacion` (
  `id_calificacion` int NOT NULL AUTO_INCREMENT,
  `id_alumno` int NOT NULL,
  `id_materia` int NOT NULL,
  `id_docente` int NOT NULL,
  `id_curso` int NOT NULL,
  `anio_lectivo` int NOT NULL,
  `cuatrimestre` enum('1','2') NOT NULL,
  `nota_1` decimal(4,2) DEFAULT NULL,
  `nota_2` decimal(4,2) DEFAULT NULL,
  `nota_3` decimal(4,2) DEFAULT NULL,
  `promedio_cuatrimestre` decimal(4,2) DEFAULT NULL,
  `periodo_complementario` decimal(4,2) DEFAULT NULL,
  `calificacion_definitiva` decimal(4,2) DEFAULT NULL,
  `estado` enum('cursando','aprobada','desaprobada','libre','previa','final') NOT NULL DEFAULT 'cursando',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_calificacion`),
  UNIQUE KEY `uk_alumno_materia_curso_anio_cuatri` (`id_alumno`,`id_materia`,`id_curso`,`anio_lectivo`,`cuatrimestre`),
  KEY `id_materia` (`id_materia`),
  KEY `id_docente` (`id_docente`),
  KEY `id_curso` (`id_curso`),
  KEY `idx_calificacion_alumno_materia` (`id_alumno`,`id_materia`,`anio_lectivo`),
  CONSTRAINT `calificacion_ibfk_1` FOREIGN KEY (`id_alumno`) REFERENCES `alumno` (`id_alumno`) ON DELETE CASCADE,
  CONSTRAINT `calificacion_ibfk_2` FOREIGN KEY (`id_materia`) REFERENCES `materia` (`id_materia`) ON DELETE CASCADE,
  CONSTRAINT `calificacion_ibfk_3` FOREIGN KEY (`id_docente`) REFERENCES `docente` (`id_docente`) ON DELETE CASCADE,
  CONSTRAINT `calificacion_ibfk_4` FOREIGN KEY (`id_curso`) REFERENCES `curso` (`id_curso`) ON DELETE CASCADE,
  CONSTRAINT `calificacion_chk_1` CHECK ((`nota_1` between 0 and 10)),
  CONSTRAINT `calificacion_chk_2` CHECK ((`nota_2` between 0 and 10)),
  CONSTRAINT `calificacion_chk_3` CHECK ((`nota_3` between 0 and 10)),
  CONSTRAINT `calificacion_chk_4` CHECK ((`promedio_cuatrimestre` between 0 and 10)),
  CONSTRAINT `calificacion_chk_5` CHECK ((`periodo_complementario` between 0 and 10)),
  CONSTRAINT `calificacion_chk_6` CHECK ((`calificacion_definitiva` between 0 and 10))
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `calificacion`
--

LOCK TABLES `calificacion` WRITE;
/*!40000 ALTER TABLE `calificacion` DISABLE KEYS */;
INSERT INTO `calificacion` VALUES (1,1,1,1,1,2025,'1',6.00,9.00,10.00,8.33,9.00,10.00,'cursando','2025-10-22 00:52:42','2025-11-04 20:46:23',NULL),(2,2,1,1,1,2025,'1',4.00,5.00,6.00,5.00,10.00,7.00,'aprobada','2025-10-22 00:52:42','2025-11-04 00:29:36',NULL),(3,3,1,1,1,2025,'1',9.00,7.00,6.00,7.33,7.00,10.00,'libre','2025-10-22 00:52:42','2025-11-03 03:48:34',NULL),(4,4,1,1,1,2025,'1',6.00,7.00,8.00,7.00,9.00,10.00,'aprobada','2025-10-22 00:52:42','2025-11-02 18:04:25',NULL),(5,5,1,1,1,2025,'1',10.00,7.00,8.00,8.33,8.00,NULL,'aprobada','2025-10-22 00:52:42','2025-11-04 20:45:19',NULL),(6,1,1,1,1,2025,'2',8.00,NULL,NULL,8.00,NULL,NULL,'cursando','2025-10-22 00:52:42','2025-10-22 00:52:42',NULL),(7,2,1,1,1,2025,'2',5.00,NULL,NULL,5.00,NULL,NULL,'cursando','2025-10-22 00:52:42','2025-10-22 00:52:42',NULL),(8,11,1,1,1,2025,'1',4.00,5.00,6.00,5.00,9.00,10.00,'cursando','2025-11-02 17:06:04','2025-11-04 20:46:37',NULL),(9,13,1,1,1,2025,'1',2.00,3.00,5.00,3.33,6.00,7.00,'cursando','2025-11-02 17:14:26','2025-11-03 03:48:19',NULL),(10,14,1,1,1,2025,'1',1.00,4.00,7.00,4.00,7.50,10.00,'aprobada','2025-11-02 18:21:45','2025-11-10 18:19:55',NULL),(11,13,2,1,1,2025,'1',4.00,10.00,5.00,6.33,9.00,10.00,'aprobada','2025-11-03 00:25:35','2025-11-03 00:26:25',NULL),(12,1,2,1,1,2025,'1',NULL,7.00,NULL,7.00,NULL,NULL,'cursando','2025-11-03 00:25:41','2025-11-03 00:25:41',NULL),(13,1,4,1,1,2025,'1',2.00,7.00,4.00,4.33,8.00,NULL,'cursando','2025-11-04 01:14:05','2025-11-04 01:14:10',NULL),(14,14,3,1,1,2025,'1',2.00,5.00,2.00,3.00,8.00,10.00,'aprobada','2025-11-04 01:20:20','2025-11-04 01:20:33',NULL),(15,3,3,1,1,2025,'1',4.00,5.00,6.00,5.00,7.00,8.00,'cursando','2025-11-04 02:24:21','2025-11-04 02:24:21',NULL),(16,3,2,1,1,2025,'1',1.00,2.00,3.00,2.00,4.00,6.00,'cursando','2025-11-04 02:31:09','2025-11-04 02:31:09',NULL),(17,1,3,1,1,2025,'1',4.00,5.00,6.00,5.00,7.00,9.00,'cursando','2025-11-06 02:02:21','2025-11-06 02:02:21',NULL),(18,20,3,1,1,2025,'1',7.00,7.00,7.00,7.00,8.00,10.00,'cursando','2025-11-07 00:12:55','2025-11-07 00:12:55',NULL),(19,22,15,1,9,2025,'1',4.00,8.00,9.00,7.00,9.00,10.00,'cursando','2025-11-09 16:10:27','2025-11-09 16:10:27',NULL),(20,23,16,1,10,2025,'1',6.00,5.00,7.00,6.00,9.00,10.00,'cursando','2025-11-09 16:15:28','2025-11-09 16:15:28',NULL),(21,22,1,1,1,2025,'1',4.00,5.00,10.00,6.33,NULL,10.00,'cursando','2025-11-09 22:04:35','2025-11-10 22:36:06',NULL),(22,20,1,1,1,2025,'1',6.00,7.00,8.00,7.00,NULL,NULL,'cursando','2025-11-09 22:05:13','2025-11-10 03:05:42',NULL),(23,18,1,1,1,2025,'1',9.00,NULL,NULL,9.00,NULL,NULL,'cursando','2025-11-10 03:06:39','2025-11-10 03:06:39',NULL),(24,28,9,1,12,2025,'1',6.00,8.00,9.00,7.67,NULL,10.00,'cursando','2025-11-10 17:53:19','2025-11-10 17:53:19',NULL),(25,29,21,1,13,2025,'1',7.00,8.00,10.00,8.33,NULL,10.00,'cursando','2025-11-10 18:15:38','2025-11-10 18:15:50',NULL),(26,22,3,1,1,2025,'1',2.00,2.00,2.00,2.00,2.00,0.00,'desaprobada','2025-11-10 18:47:30','2025-11-10 18:51:57',NULL),(27,16,1,1,1,2025,'1',5.00,7.00,9.00,7.00,NULL,NULL,'cursando','2025-11-10 22:27:09','2025-11-10 22:27:09',NULL),(28,17,23,1,14,2025,'1',10.00,6.00,5.00,7.00,9.00,9.00,'cursando','2025-11-28 19:12:25','2025-11-28 19:12:25',NULL),(29,32,23,1,14,2025,'1',8.00,6.00,7.00,7.00,NULL,8.00,'libre','2025-11-28 19:12:39','2025-12-15 18:52:04',NULL),(30,31,23,1,14,2025,'1',3.00,7.00,8.00,6.00,7.00,7.00,'aprobada','2025-11-28 19:13:17','2025-11-28 19:13:40',NULL),(31,30,23,1,14,2025,'1',3.00,5.00,7.00,5.00,5.00,4.00,'desaprobada','2025-11-28 19:13:34','2025-11-28 19:13:34',NULL),(32,17,24,1,14,2025,'1',6.00,7.00,7.00,6.67,NULL,7.00,'cursando','2025-11-28 19:16:29','2025-11-28 19:16:29',NULL),(33,32,24,1,14,2025,'1',10.00,8.00,7.00,8.33,NULL,8.00,'cursando','2025-11-28 19:16:48','2025-11-28 19:16:48',NULL),(34,31,24,1,14,2025,'1',3.00,4.00,4.00,3.67,5.00,5.00,'final','2025-11-28 19:17:02','2025-12-15 19:32:16',NULL),(35,30,24,1,14,2025,'1',8.00,8.00,9.00,8.33,NULL,8.00,'aprobada','2025-11-28 19:17:17','2025-11-28 19:17:17',NULL),(36,17,22,1,14,2025,'1',7.00,7.00,8.00,7.33,NULL,7.00,'aprobada','2025-11-28 19:18:28','2025-11-28 19:18:28',NULL),(37,32,22,1,14,2025,'1',4.00,7.00,8.00,6.33,7.00,8.00,'aprobada','2025-11-28 19:21:10','2025-11-28 19:21:10',NULL),(38,31,22,1,14,2025,'1',6.00,7.00,8.00,7.00,NULL,8.00,'cursando','2025-11-28 19:22:23','2025-11-28 19:22:23',NULL),(39,30,22,1,14,2025,'1',3.00,4.00,5.00,4.00,8.00,8.00,'cursando','2025-11-28 19:22:32','2025-11-28 19:22:32',NULL),(40,23,18,1,10,2025,'1',4.00,5.00,6.00,5.00,6.00,10.00,'libre','2025-12-10 03:24:35','2025-12-10 04:04:01',NULL);
/*!40000 ALTER TABLE `calificacion` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `after_calificacion_update` AFTER UPDATE ON `calificacion` FOR EACH ROW BEGIN
    DECLARE v_estado_materia ENUM(
        'cursando',
        'aprobada',
        'desaprobada',
        'libre',
        'final',
        'previa',
        'previa_aprobada',
        'equivalencia'
    );
    
    -- 1. Cuando se actualiza la calificación definitiva
    IF NEW.calificacion_definitiva IS NOT NULL AND OLD.calificacion_definitiva IS NULL THEN
        -- Determinar estado basado en la calificación
        IF NEW.calificacion_definitiva >= 6 THEN
            SET v_estado_materia = 'aprobada'; -- Aprobación directa por promoción
        ELSE
            -- Si la nota es menor a 6, pasa directamente a instancia de 'final'
            SET v_estado_materia = 'final';
        END IF;
        
        -- Actualizar tabla alumno_materia_estado
        INSERT INTO alumno_materia_estado 
        (id_alumno, id_materia, id_curso, anio_lectivo, estado, calificacion_final, fecha_estado)
        VALUES (NEW.id_alumno, NEW.id_materia, NEW.id_curso, NEW.anio_lectivo, v_estado_materia, NEW.calificacion_definitiva, CURDATE())
        ON DUPLICATE KEY UPDATE
        estado = v_estado_materia,
        calificacion_final = NEW.calificacion_definitiva,
        fecha_estado = CURDATE(),
        updated_at = NOW();

    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-15 16:58:47
