package handlers

import (
	"net/http"
	"project-stage-pfa/internals/database"
	"project-stage-pfa/internals/models"

	"github.com/gin-gonic/gin"
)

func GetAllEncadrant() gin.HandlerFunc {
	return func(c *gin.Context) {
		var encadrants []models.Encadrant

		if result := database.DB.Find(&encadrants); result.Error != nil {
			c.IndentedJSON(http.StatusNotFound, gin.H{"message": "encadrants not found", "error": result.Error.Error()})
			return

		}
		c.IndentedJSON(http.StatusOK, gin.H{"encadrants": encadrants})

	}
}
func GetEncadrantByID() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		var encadrant models.Encadrant
		if result := database.DB.First(&encadrant, id); result.Error != nil {
			c.IndentedJSON(http.StatusNotFound, gin.H{"message": "encadrant not found", "error": result.Error.Error()})
			return
		}
		c.IndentedJSON(http.StatusOK, gin.H{"encadrant": encadrant})
	}
}
func PostEncdrant() gin.HandlerFunc {
	return func(c *gin.Context) {
		type _encadrantReq struct {
			Nom             string `json:"nom" binding:"required"`
			Prenom          string `json:"prenom" binding:"required"`
			Numero          string `json:"numero" binding:"required"`
			AdresseCourrier string `json:"adresseCourrier"`
			Ecole           string `json:"ecole" binding:"required"`
		}

		var encadrantReq _encadrantReq
		if err := c.BindJSON(&encadrantReq); err != nil {
			c.IndentedJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		var encadrant models.Encadrant = models.Encadrant{
			Nom:             encadrantReq.Nom,
			Prenom:          encadrantReq.Prenom,
			Numero:          encadrantReq.Numero,
			AdresseCourrier: encadrantReq.AdresseCourrier,
			Ecole:           encadrantReq.Ecole,
		}
		if result := database.DB.Create(&encadrant); result.Error != nil {
			c.IndentedJSON(http.StatusInternalServerError, gin.H{"message": result.Error.Error()})
			return
		}

		c.IndentedJSON(http.StatusCreated, gin.H{"encadrant": encadrant})
	}
}

// UpdateEncadrant updates an existing encadrant
func UpdateEncadrant() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		if id == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "ID is required"})
			return
		}

		type UpdateEncadrantRequest struct {
			Nom             string `json:"nom"`
			Prenom          string `json:"prenom"`
			Numero          string `json:"numero"`
			AdresseCourrier string `json:"adresseCourrier"`
			Ecole           string `json:"ecole"`
		}

		var req UpdateEncadrantRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		var encadrant models.Encadrant
		db := database.DB
		if err := db.First(&encadrant, id).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Encadrant introuvable"})
			return
		}

		// Update fields if provided
		if req.Nom != "" {
			encadrant.Nom = req.Nom
		}
		if req.Prenom != "" {
			encadrant.Prenom = req.Prenom
		}
		if req.Numero != "" {
			encadrant.Numero = req.Numero
		}
		if req.AdresseCourrier != "" {
			encadrant.AdresseCourrier = req.AdresseCourrier
		}
		if req.Ecole != "" {
			encadrant.Ecole = req.Ecole
		}

		if err := db.Save(&encadrant).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"data": encadrant})
	}
}

// DeleteEncadrant deletes an encadrant
func DeleteEncadrant() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		if id == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "ID is required"})
			return
		}

		var encadrant models.Encadrant
		db := database.DB
		
		// Check if encadrant exists
		if err := db.First(&encadrant, id).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Encadrant introuvable"})
			return
		}

		// Delete the encadrant
		if err := db.Delete(&encadrant).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Encadrant supprimé avec succès"})
	}
}
