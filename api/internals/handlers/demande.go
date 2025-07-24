package handlers

import (
	"net/http"
	"project-stage-pfa/internals/database"
	"project-stage-pfa/internals/models"

	"github.com/gin-gonic/gin"
)

// TODO : get all demande and single demande info
func GetAllDemande() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var demandes []models.DemandeStage
		if result := database.DB.Find(&demandes); result.Error != nil {
			ctx.AbortWithStatusJSON(http.StatusExpectationFailed, gin.H{
				"err": result.Error.Error()})
		}
		ctx.IndentedJSON(http.StatusOK, gin.H{
			"data": demandes})
	}
}
func GetDemandeById() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		id, ok := ctx.Params.Get("id")
		if !ok {
			ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": "send id in req params "})
		}
		var demande models.DemandeStage
		if result := database.DB.First(demande, "id=?", id); result.Error != nil {
			ctx.AbortWithStatusJSON(http.StatusExpectationFailed, gin.H{
				"err": result.Error.Error()})
		}
		ctx.IndentedJSON(http.StatusOK, gin.H{
			"demande": demande})

	}
}

// TODO : ajouter son parrain .
func CreateDemandeDeStage() gin.HandlerFunc {
	return func(c *gin.Context) {
		type demandeRequest struct {
			IDTheme     uint   `form:"id_theme" binding:"required"`
			IDStagiaire uint   `form:"id_stagiaire" binding:"required"`
			Departement string `form:"departement"`
		}
		var demandeForm demandeRequest
		if err := c.Bind(&demandeForm); err != nil {
			c.IndentedJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return

		}

		// find the current stagiaire
		var stagiaire models.Stagiaire
		db := database.DB
		if err := db.First(&stagiaire, demandeForm.IDStagiaire).Error; err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Stagiaire introuvable"})
			return
		}

		var demandeStage models.DemandeStage = models.DemandeStage{
			IDTheme:       demandeForm.IDTheme,
			StatutDemande: "en_attente",
			MotifRejet:    "_",
			IDStagiaire:   stagiaire.ID,
		}
		database.DB.Create(&demandeStage)

		// Reload with relations
		db.Preload("Stagiaire").Preload("Theme").First(&demandeStage, demandeStage.ID)

		c.IndentedJSON(http.StatusOK, gin.H{"data": demandeStage})

	}
}
