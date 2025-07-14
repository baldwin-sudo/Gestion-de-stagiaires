package handlers

import "C"
import (
	"github.com/gin-gonic/gin"
	"net/http"
	"project-stage-pfa/internals/database"
	"project-stage-pfa/internals/models"
	"strconv"
	"time"
)

func GetAllStages() gin.HandlerFunc {
	return func(c *gin.Context) {
		db := database.DB
		var themesStage []models.ThemeDeStage
		db.Find(&themesStage)
		c.IndentedJSON(http.StatusOK, gin.H{"data": themesStage})
	}
}
func GetStageById() gin.HandlerFunc {
	return func(c *gin.Context) {
		db := database.DB
		var themeStage models.ThemeDeStage
		id := c.Param("id")
		if err := db.First(&themeStage, id).Error; err != nil {
			c.IndentedJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		role, ok := c.Get("role")
		if !ok {
			c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "role not found in context"})
			return
		}
		c.IndentedJSON(http.StatusOK, gin.H{"data": themeStage, "role": role})
	}
}

func CreateStage() gin.HandlerFunc {
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

		themeStage := models.ThemeDeStage{
			Sujet:         createRequest.Sujet,
			Departement:   createRequest.Departement,
			Type:          createRequest.Type,
			Description:   createRequest.Description,
			Prerequisites: createRequest.Prerequisites,
			Duree:         duree,
			DateDebut:     dateDebut,
			DateFin:       dateFin,
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
func UpdateStage() gin.HandlerFunc {
	return func(c *gin.Context) {
		type UpdateThemeStageRequest struct {
			ID            *string `form:"id" binding:"required"`
			Sujet         *string `form:"sujet" `
			Departement   *string `form:"departement" `
			Type          *string `form:"type" `
			Description   *string `form:"description" `
			Prerequisites *string `form:"prerequisites"`
			Duree         *string `form:"duree" `
		}
		var updateRequest UpdateThemeStageRequest
		if err := c.ShouldBind(&updateRequest); err != nil {
			c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
			return
		}
		var themeStage models.ThemeDeStage
		db := database.DB
		// find the record
		if result := db.First(&themeStage, updateRequest.ID); result.Error != nil {
			c.IndentedJSON(http.StatusBadRequest, gin.H{"error": result.Error.Error()})
			return
		}
		// update the changed fields
		if result := db.Model(&themeStage).Updates(updateRequest); result.Error != nil {
			c.IndentedJSON(http.StatusBadRequest, gin.H{"error": result.Error.Error()})
			return
		}
		// refetch the updated record
		if result := db.First(&themeStage, updateRequest.ID); result.Error != nil {
			c.IndentedJSON(http.StatusBadRequest, gin.H{"error": result.Error.Error()})
			return

		}
		c.IndentedJSON(http.StatusOK, gin.H{"data": themeStage})

	}
}
