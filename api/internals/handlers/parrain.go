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

// UpdateParrain updates an existing parrain
func UpdateParrain() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		if id == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "ID is required"})
			return
		}

		type UpdateParrainRequest struct {
			Nom         string `json:"nom"`
			Prenom      string `json:"prenom"`
			Departement string `json:"departement"`
		}

		var req UpdateParrainRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		var parrain models.ParrainDeStage
		db := database.DB
		if err := db.First(&parrain, id).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Parrain introuvable"})
			return
		}

		// Update fields if provided
		if req.Nom != "" {
			parrain.Nom = req.Nom
		}
		if req.Prenom != "" {
			parrain.Prenom = req.Prenom
		}
		if req.Departement != "" {
			parrain.Departement = req.Departement
		}

		if err := db.Save(&parrain).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"data": parrain})
	}
}

// DeleteParrain deletes a parrain
func DeleteParrain() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		if id == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "ID is required"})
			return
		}

		var parrain models.ParrainDeStage
		db := database.DB
		
		// Check if parrain exists
		if err := db.First(&parrain, id).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Parrain introuvable"})
			return
		}

		// Delete the parrain
		if err := db.Delete(&parrain).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Parrain supprimé avec succès"})
	}
}
