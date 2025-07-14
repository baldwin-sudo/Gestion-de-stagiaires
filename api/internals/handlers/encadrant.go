package handlers

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"project-stage-pfa/internals/database"
	"project-stage-pfa/internals/models"
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
			nom             string `form:"nom" binding:"required"`
			prenom          string `form:"prenom" binding:"required"`
			numero          string `form:"numero" binding:"required"`
			adresseCourrier string `form:"adresseCourrier"`
			ecole           string `form:"ecole" binding:"required"`
		}

		var encadrantReq _encadrantReq
		if err := c.Bind(&encadrantReq); err != nil {
			c.IndentedJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		var encadrant models.Encadrant = models.Encadrant{
			Nom:             encadrantReq.nom,
			Prenom:          encadrantReq.prenom,
			Numero:          encadrantReq.numero,
			AdresseCourrier: encadrantReq.adresseCourrier,
			Ecole:           encadrantReq.ecole,
		}
		if result := database.DB.Create(&encadrant); result.Error != nil {
			c.IndentedJSON(http.StatusInternalServerError, gin.H{"message": result.Error.Error()})
			return
		}

		c.IndentedJSON(http.StatusCreated, gin.H{"encadrant": encadrant})
	}
}
