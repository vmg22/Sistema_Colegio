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
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `email_usuario` varchar(100) NOT NULL,
  `rol` enum('admin','docente','preceptor','secretario','tutor') NOT NULL,
  `estado` enum('activo','inactivo','pendiente') DEFAULT 'activo',
  `ultimo_login` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email_usuario` (`email_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'admin','$2b$10$e7k92/qUSODZ.IlawV8Ah.Yj9FYF.Kdbp9YhW7KvOPOPW6walmSDC','pucharra81@gmail.com','admin','activo','2025-12-15 16:28:31','2025-10-22 00:52:42','2025-12-15 19:28:31',NULL),(2,'jperez','$2a$10$f.Tj.w1q.1x.1T.1T.1T.uL.4Q.6t.8U.9u.2v.3w.4x','jperez.doc@instituto.edu.ar','docente','activo',NULL,'2025-10-22 00:52:42','2025-10-22 00:52:42',NULL),(3,'mlopez','$2a$10$f.Tj.w1q.1x.1T.1T.1T.uL.4Q.6t.8U.9u.2v.3w.4x','mlopez.doc@instituto.edu.ar','docente','activo',NULL,'2025-10-22 00:52:42','2025-11-28 18:40:53','2025-11-28 18:40:53'),(4,'csanchez','$2a$10$f.Tj.w1q.1x.1T.1T.1T.uL.4Q.6t.8U.9u.2v.3w.4x','csanchez.doc@instituto.edu.ar','docente','activo',NULL,'2025-10-22 00:52:42','2025-10-22 00:52:42',NULL),(5,'preceptor.tm','$2a$10$f.Tj.w1q.1x.1T.1T.1T.uL.4Q.6t.8U.9u.2v.3w.4x','preceptor.tm@‌instituto.edu.ar','preceptor','activo',NULL,'2025-10-22 00:52:42','2025-10-22 00:52:42',NULL),(6,'secretaria','$2a$10$f.Tj.w1q.1x.1T.1T.1T.uL.4Q.6t.8U.9u.2v.3w.4x','secretaria@instituto.edu.ar','secretario','activo',NULL,'2025-10-22 00:52:42','2025-10-22 00:52:42',NULL),(7,'rgomez','$2a$10$f.Tj.w1q.1x.1T.1T.1T.uL.4Q.6t.8U.9u.2v.3w.4x','rgomez.tutor@example.com','tutor','activo',NULL,'2025-10-22 00:52:42','2025-10-22 00:52:42',NULL),(8,'mjuarez','$2a$10$f.Tj.w1q.1x.1T.1T.1T.uL.4Q.6t.8U.9u.2v.3w.4x','mjuarez.tutor@example.com','tutor','activo',NULL,'2025-10-22 00:52:42','2025-10-22 00:52:42',NULL),(9,'juliopuch','$2b$10$fNIE0Vf07v/tHnvIukEbseVRj5GyMGtSpjZOLC//oM0PCdw8GAuFa','jp@gmail.com','docente','activo',NULL,'2025-11-04 20:42:45','2025-11-04 20:42:45',NULL),(10,'pepeochoa','$2b$10$W996U2F3Cxl3Hlpr52QDduGG3K2A23foNxyErwJYXxBCvK0hN4nR.','pepe@gmail.com.ar','docente','activo',NULL,'2025-11-08 20:28:52','2025-11-08 20:28:52',NULL),(11,'denise','$2b$10$acM9PXIon5nbOqJrzW/KmOILLA4wYo2JVuAR4O7.FC6URO6I1wlhW','denise@gmail.com','docente','activo',NULL,'2025-11-08 20:34:22','2025-11-08 20:34:22',NULL),(12,'agusp','$2b$10$UuvwhveRUScw9azDC///kuR56fI16OIc0SRQuIIZJbD0tgPMfHMba','agux@gmail.com','docente','activo',NULL,'2025-11-08 22:13:24','2025-11-08 22:13:24',NULL),(13,'pedro','$2b$10$YYLhfxE2eVre16qrT/jbvOy8wC7NtR/1dJJdYcIlacZQ2ps5FW7DC','pedro@gmail.com','docente','activo',NULL,'2025-11-09 15:46:37','2025-11-09 15:46:37',NULL),(14,'gpdocente','$2b$10$KSEQYHU/fsFpgQKvb39CqOcrq8xqcbrW9GE9Kb.8tKa6QBIUM7fLW','jpequipcomyhogar@gmail.com','docente','activo','2025-11-09 20:49:51','2025-11-09 23:45:15','2025-11-09 23:49:51',NULL),(15,'fgfgd','$2b$10$9zrHXgiFJHFE65SXuN5bMOKN8oFZbJEfUBMfvEvnUVMQhctdB5bC.','valz@example.com.ar','docente','activo',NULL,'2025-11-10 00:35:12','2025-11-10 00:35:12',NULL),(16,'lucaspuch','$2b$10$sRrQNDqA9NJ6ELrfB6DTZuihWOrGZbfPnfOQfEKKnWYsFiYBs2pN6','sanchezdeniseana@gmail.com','docente','activo','2025-11-09 22:48:32','2025-11-10 01:48:21','2025-11-10 01:48:32',NULL),(17,'sofiap','$2b$10$30FhEDrpOAbCX2/EhczztecOVnA78DoJAOPCENhmg7cKz4MAPiaN2','sofiap@gmail.com','docente','activo',NULL,'2025-11-10 17:48:47','2025-11-10 17:48:47',NULL),(18,'matiasf','$2b$10$H1Dqy0RYc2KTxy3cahkEWOqhS99VJ1ZAQ0r0qsPKvuHOcnJuR4Xqa','matias@gmail.com','docente','activo',NULL,'2025-11-10 18:11:51','2025-11-10 18:11:51',NULL),(19,'claudias','$2b$10$RMTtkTkiglNmjgUm0DeMB.qCLCHzisHLpVWxqNe/TCBUSjO0D8jo2','claudia@gmail.com','docente','activo','2025-11-10 16:16:00','2025-11-10 19:08:32','2025-11-10 19:16:00',NULL),(20,'marcelam','$2b$10$7opFH7bPuZjgAxxwf4Z/Gu7gfl6TB2jVHFqXzpWkNoqYvrQpLYSp6','marcelam@gmail.com','docente','activo','2025-11-10 19:18:09','2025-11-10 22:17:57','2025-11-10 22:18:09',NULL),(21,'matiasc','$2b$10$VZ/JTNIO14TPHFsz.2YsAeGxPeYEr/93rOs8PRcRtex0Yt6x36zHa','matiasc@gmail.com','docente','activo',NULL,'2025-11-28 18:40:25','2025-11-28 18:40:25',NULL),(25,'claudiasan','$2b$10$qtEH7RK/XhMn/qDVFvWEcemX5xaHH5393MWXHVfkYheBxqmp.1YrO','claudiasan@gmail.com','docente','activo',NULL,'2025-11-28 18:41:50','2025-11-28 18:41:50',NULL),(26,'juliop','$2b$10$5ObnJwDXBQLvD10rqIDdVOOvotc64775zJAiIr1Cvn4O0QjC0ZyGy','juliopucharras@gmail.com','docente','activo','2025-12-09 23:40:23','2025-12-08 22:59:54','2025-12-10 02:40:23',NULL),(27,'kirix','$2b$10$AsY5GznnxDLNVF.1W6dh4evAYgp8nxd2Y5X3sSebYVPLtX9XVQxqq','kirix@gmail.com','docente','activo',NULL,'2025-12-10 01:55:23','2025-12-10 01:55:23',NULL);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
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
