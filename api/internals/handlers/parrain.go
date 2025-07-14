package handlers

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"project-stage-pfa/internals/database"
	"project-stage-pfa/internals/models"
)

func GetAllParrain() gin.HandlerFunc {
	return func(c *gin.Context) {
		var parrains []models.ParrainDeStage

		if result := database.DB.Find(&parrains); result.Error != nil {
			c.IndentedJSON(http.StatusNotFound, gin.H{"message": "parrains not found", "error": result.Error.Error()})
			return

		}
		c.IndentedJSON(http.StatusOK, gin.H{"parrains": parrains})

	}
}
func GetParrainByID() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		var parrain models.ParrainDeStage
		if result := database.DB.First(&parrain, id); result.Error != nil {
			c.IndentedJSON(http.StatusNotFound, gin.H{"message": "parrain not found", "error": result.Error.Error()})
			return
		}
		c.IndentedJSON(http.StatusOK, gin.H{"parrain": parrain})
	}
}
func PostParrain() gin.HandlerFunc {
	return func(c *gin.Context) {
		type _parrainReq struct {
			Nom         string `form:"nom" binding:"required"`
			Prenom      string `form:"prenom" binding:"required"`
			Departement string `form:"departement" binding:"required"`
		}

		var parrainReq _parrainReq
		if err := c.Bind(&parrainReq); err != nil {
			c.IndentedJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		var parrain models.ParrainDeStage = models.ParrainDeStage{
			Nom:         parrainReq.Nom,
			Prenom:      parrainReq.Prenom,
			Departement: parrainReq.Departement,
		}
		if result := database.DB.Create(&parrain); result.Error != nil {
			c.IndentedJSON(http.StatusInternalServerError, gin.H{"message": result.Error.Error()})
			return
		}
		c.IndentedJSON(http.StatusCreated, gin.H{"parrain": parrain})
	}
}
