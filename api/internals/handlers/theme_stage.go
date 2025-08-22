package handlers

import "C"
import (
	"net/http"
	"project-stage-pfa/internals/database"
	"project-stage-pfa/internals/models"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

func GetAllThemeStages() gin.HandlerFunc {
	return func(c *gin.Context) {
		db := database.DB
		var themesStage []models.ThemeDeStage
		db.Find(&themesStage)
		c.IndentedJSON(http.StatusOK, gin.H{"data": themesStage})
	}
}
func GetThemeStageById() gin.HandlerFunc {
	return func(c *gin.Context) {
		db := database.DB
		var themeStage models.ThemeDeStage
		id := c.Param("id")
		if err := db.First(&themeStage, id).Error; err != nil {
			c.IndentedJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		c.IndentedJSON(http.StatusOK, gin.H{"data": themeStage})
	}
}

func CreateThemeStage() gin.HandlerFunc {
	return func(c *gin.Context) {
		type CreateThemeStageRequest struct {
			Sujet         string `form:"sujet" binding:"required"`
			Departement   string `form:"departement" binding:"required"`
			Type          string `form:"type" binding:"required"`
			DateDebut     string `form:"date_debut" binding:"required"`
			DateFin       string `form:"date_fin" binding:"required"`
			Description   string `form:"description" binding:"required"`
			Prerequisites string `form:"prerequisites" binding:"required"`
			Duree         string `form:"duree" binding:"required"`
			IDEncadrant   string `form:"id_encadrant" binding:"required"`
		}
		var createRequest CreateThemeStageRequest
		if err := c.ShouldBind(&createRequest); err != nil {

			c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
			return
		}
		duree, err := strconv.Atoi(createRequest.Duree)
		if err != nil {
			c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Invalid duree number"})
			return
		}
		dateDebut, err := time.Parse("2006-01-02", createRequest.DateDebut)
		if err != nil {
			c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Invalid start date format. Use YYYY-MM-DD"})
			return
		}
		dateFin, err := time.Parse("2006-01-02", createRequest.DateFin)
		if err != nil {
			c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Invalid finish date format. Use YYYY-MM-DD"})
			return
		}
		id_encadrant, err := strconv.Atoi(createRequest.IDEncadrant)
		if err != nil {
			c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Invalid duree number"})
			return
		}
		themeStage := models.ThemeDeStage{
			Sujet:         createRequest.Sujet,
			Departement:   createRequest.Departement,
			Type:          createRequest.Type,
			Description:   createRequest.Description,
			Prerequisites: createRequest.Prerequisites,
			Duree:         duree,
			DateDebut:     dateDebut,
			DateFin:       dateFin,
			IDEncadrant:   uint(id_encadrant),
			EstActif:      false,
		}

		db := database.DB

		if result := db.Create(&themeStage); result.Error != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": result.Error.Error()})
			return
		}
		c.IndentedJSON(http.StatusCreated, gin.H{"data": themeStage})

	}
}
func UpdateThemeStage() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		if id == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "ID is required"})
			return
		}

		type UpdateThemeStageRequest struct {
			Sujet         string `json:"sujet"`
			Departement   string `json:"departement"`
			Type          string `json:"type"`
			Description   string `json:"description"`
			Prerequisites string `json:"prerequisites"`
			Duree         int    `json:"duree"`
			IDEncadrant   uint   `json:"id_encadrant"`
			DateDebut     string `json:"date_debut"`
			DateFin       string `json:"date_fin"`
		}

		var req UpdateThemeStageRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		var themeStage models.ThemeDeStage
		db := database.DB
		
		// Check if theme stage exists
		if err := db.First(&themeStage, id).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Thème de stage introuvable"})
			return
		}

		// Update fields if provided
		if req.Sujet != "" {
			themeStage.Sujet = req.Sujet
		}
		if req.Departement != "" {
			themeStage.Departement = req.Departement
		}
		if req.Type != "" {
			themeStage.Type = req.Type
		}
		if req.Description != "" {
			themeStage.Description = req.Description
		}
		if req.Prerequisites != "" {
			themeStage.Prerequisites = req.Prerequisites
		}
		if req.Duree != 0 {
			themeStage.Duree = req.Duree
		}
		if req.IDEncadrant != 0 {
			themeStage.IDEncadrant = req.IDEncadrant
		}
		if req.DateDebut != "" {
			dateDebut, err := time.Parse("2006-01-02", req.DateDebut)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid start date format. Use YYYY-MM-DD"})
				return
			}
			themeStage.DateDebut = dateDebut
		}
		if req.DateFin != "" {
			dateFin, err := time.Parse("2006-01-02", req.DateFin)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid finish date format. Use YYYY-MM-DD"})
				return
			}
			themeStage.DateFin = dateFin
		}

		if err := db.Save(&themeStage).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"data": themeStage})
	}
}

// DeleteThemeStage deletes a theme stage
func DeleteThemeStage() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		if id == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "ID is required"})
			return
		}

		var themeStage models.ThemeDeStage
		db := database.DB
		
		// Check if theme stage exists
		if err := db.First(&themeStage, id).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Thème de stage introuvable"})
			return
		}

		// Delete the theme stage
		if err := db.Delete(&themeStage).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Thème de stage supprimé avec succès"})
	}
}
