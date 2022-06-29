-- MySQL Script generated by MySQL Workbench
-- Tue Aug  3 13:40:38 2021
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema Servicio_Medicina
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `Servicio_Medicina` DEFAULT CHARACTER SET utf8mb4 ;
USE `Servicio_Medicina` ;

-- -----------------------------------------------------
-- Table `Servicio_Medicina`.`usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Servicio_Medicina`.`usuario` (
  `id` BIGINT(8) NOT NULL,
  `rol` ENUM('prestador', 'interno', 'revisor', 'administrador'),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Servicio_Medicina`.`servicio`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Servicio_Medicina`.`servicio` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `usuario_id` BIGINT(8) NOT NULL,
  `entidad_receptora` VARCHAR(100),
  `receptor` VARCHAR(100),
  `programa` VARCHAR(500) NULL,
  `objetivos_programa` VARCHAR(1000) NULL,
  `fecha_inicio` DATE,
  `fecha_fin` DATE,
  `horario_hora_inicio` TIME,
  `horario_hora_fin` TIME,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  INDEX `fk_servicio_usuario_idx` (`usuario_id` ASC),
  CONSTRAINT `fk_servicio_usuario`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `Servicio_Medicina`.`usuario` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Servicio_Medicina`.`trimestre`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Servicio_Medicina`.`trimestre` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `fecha_inicio` DATE NOT NULL,
  `fecha_fin` DATE NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Servicio_Medicina`.`reporte_parcial`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Servicio_Medicina`.`reporte_parcial` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `servicio_id` INT NOT NULL,
  `actualizado` DATE,
  `horas_realizadas` INT,
  `trimestre_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  INDEX `fk_reporte_parcial_servicio1_idx` (`servicio_id` ASC),
  INDEX `fk_reporte_parcial_trimestre1_idx` (`trimestre_id` ASC),
  CONSTRAINT `fk_reporte_parcial_servicio1`
    FOREIGN KEY (`servicio_id`)
    REFERENCES `Servicio_Medicina`.`servicio` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_reporte_parcial_trimestre1`
    FOREIGN KEY (`trimestre_id`)
    REFERENCES `Servicio_Medicina`.`trimestre` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Servicio_Medicina`.`actividad_de_usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Servicio_Medicina`.`actividad_de_usuario` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `descripcion` TEXT,
  `servicio_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  INDEX `fk_actividad_de_usuario_servicio1_idx` (`servicio_id` ASC),
  CONSTRAINT `fk_actividad_de_usuario_servicio1`
    FOREIGN KEY (`servicio_id`)
    REFERENCES `Servicio_Medicina`.`servicio` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Servicio_Medicina`.`actividad_realizada`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Servicio_Medicina`.`actividad_realizada` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `cantidad` INT,
  `actividad_de_usuario_id` INT NOT NULL,
  `reporte_parcial_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  INDEX `fk_actividad_realizada_actividad_de_usuario1_idx` (`actividad_de_usuario_id` ASC),
  INDEX `fk_actividad_realizada_reporte_parcial1_idx` (`reporte_parcial_id` ASC),
  CONSTRAINT `fk_actividad_realizada_actividad_de_usuario1`
    FOREIGN KEY (`actividad_de_usuario_id`)
    REFERENCES `Servicio_Medicina`.`actividad_de_usuario` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_actividad_realizada_reporte_parcial1`
    FOREIGN KEY (`reporte_parcial_id`)
    REFERENCES `Servicio_Medicina`.`reporte_parcial` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Servicio_Medicina`.`atencion_realizada`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Servicio_Medicina`.`atencion_realizada` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `tipo` INT,
  `cantidad` INT,
  `usuario_id` BIGINT(8) NOT NULL,
  `reporte_parcial_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  INDEX `fk_atencion_realizada_usuario1_idx` (`usuario_id` ASC),
  INDEX `fk_atencion_realizada_reporte_parcial1_idx` (`reporte_parcial_id` ASC),
  CONSTRAINT `fk_atencion_realizada_usuario1`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `Servicio_Medicina`.`usuario` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_atencion_realizada_reporte_parcial1`
    FOREIGN KEY (`reporte_parcial_id`)
    REFERENCES `Servicio_Medicina`.`reporte_parcial` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Servicio_Medicina`.`reporte_final`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Servicio_Medicina`.`reporte_final` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `servicio_id` INT NOT NULL,
  `metas_alcanzadas` TEXT,
  `metodologia` TEXT,
  `innovacion` TEXT,
  `conclusion` TEXT,
  `propuestas` TEXT,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  INDEX `fk_reporte_final_servicio1_idx` (`servicio_id` ASC),
  CONSTRAINT `fk_reporte_final_servicio1`
    FOREIGN KEY (`servicio_id`)
    REFERENCES `Servicio_Medicina`.`servicio` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
