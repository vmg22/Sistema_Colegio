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
-- Temporary view structure for view `vista_estado_academico`
--

DROP TABLE IF EXISTS `vista_estado_academico`;
/*!50001 DROP VIEW IF EXISTS `vista_estado_academico`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vista_estado_academico` AS SELECT 
 1 AS `id_alumno`,
 1 AS `nombre_alumno`,
 1 AS `apellido_alumno`,
 1 AS `curso`,
 1 AS `materia`,
 1 AS `estado`,
 1 AS `calificacion_final`,
 1 AS `anio_lectivo`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vista_docentes_asignaciones`
--

DROP TABLE IF EXISTS `vista_docentes_asignaciones`;
/*!50001 DROP VIEW IF EXISTS `vista_docentes_asignaciones`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vista_docentes_asignaciones` AS SELECT 
 1 AS `id_docente`,
 1 AS `nombre`,
 1 AS `apellido`,
 1 AS `curso`,
 1 AS `materia`,
 1 AS `anio_lectivo`,
 1 AS `estado_asignacion`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `vista_estado_academico`
--

/*!50001 DROP VIEW IF EXISTS `vista_estado_academico`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vista_estado_academico` AS select `a`.`id_alumno` AS `id_alumno`,`a`.`nombre_alumno` AS `nombre_alumno`,`a`.`apellido_alumno` AS `apellido_alumno`,`c`.`nombre` AS `curso`,`m`.`nombre` AS `materia`,`ame`.`estado` AS `estado`,`ame`.`calificacion_final` AS `calificacion_final`,`ame`.`anio_lectivo` AS `anio_lectivo` from (((`alumno` `a` join `alumno_materia_estado` `ame` on((`a`.`id_alumno` = `ame`.`id_alumno`))) join `materia` `m` on((`ame`.`id_materia` = `m`.`id_materia`))) join `curso` `c` on((`ame`.`id_curso` = `c`.`id_curso`))) where ((`a`.`deleted_at` is null) and (`ame`.`deleted_at` is null)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vista_docentes_asignaciones`
--

/*!50001 DROP VIEW IF EXISTS `vista_docentes_asignaciones`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vista_docentes_asignaciones` AS select `d`.`id_docente` AS `id_docente`,`d`.`nombre` AS `nombre`,`d`.`apellido` AS `apellido`,`c`.`nombre` AS `curso`,`m`.`nombre` AS `materia`,`dcm`.`anio_lectivo` AS `anio_lectivo`,`dcm`.`estado` AS `estado_asignacion` from (((`docente` `d` join `docente_curso_materia` `dcm` on((`d`.`id_docente` = `dcm`.`id_docente`))) join `curso` `c` on((`dcm`.`id_curso` = `c`.`id_curso`))) join `materia` `m` on((`dcm`.`id_materia` = `m`.`id_materia`))) where ((`d`.`deleted_at` is null) and (`dcm`.`deleted_at` is null)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Dumping events for database 'sggs'
--

--
-- Dumping routines for database 'sggs'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-15 16:58:48
