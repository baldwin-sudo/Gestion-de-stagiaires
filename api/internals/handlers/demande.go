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

		// More explicit preloading
		result := database.DB.
			Preload("Theme").
			Preload("Stagiaire").
			Find(&demandes)

		if result.Error != nil {
			ctx.AbortWithStatusJSON(http.StatusExpectationFailed, gin.H{
				"err": result.Error.Error()})
			return
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
			return
		}
		var demande models.DemandeStage

		// More explicit preloading
		result := database.DB.
			Preload("Theme").
			Preload("Stagiaire").
			First(&demande, "id=?", id)

		if result.Error != nil {
			ctx.AbortWithStatusJSON(http.StatusExpectationFailed, gin.H{
				"err": result.Error.Error()})
			return
		}

		ctx.IndentedJSON(http.StatusOK, gin.H{
			"demande": demande})

	}
}

// TODO : ajouter son parrain .
func CreateDemandeDeStage() gin.HandlerFunc {
	return func(c *gin.Context) {
		type demandeRequest struct {
			IDTheme     uint `form:"id_theme" binding:"required"`
			IDStagiaire uint `form:"id_stagiaire" binding:"required"`
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
		if err := database.DB.Create(&demandeStage).Error; err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		// Reload with relations
		if err := db.Preload("Stagiaire").Preload("Theme").First(&demandeStage, demandeStage.ID).Error; err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Error loading demande data"})
			return
		}

		c.IndentedJSON(http.StatusOK, gin.H{"data": demandeStage})

	}
}

// UpdateDemande updates an existing demande stage
func UpdateDemande() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		if id == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "ID is required"})
			return
		}

		type UpdateDemandeRequest struct {
			StatutDemande string `json:"statut_demande"`
			MotifRejet    string `json:"motif_rejet"`
			IDTheme       uint   `json:"id_theme"`
		}

		var req UpdateDemandeRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		var demande models.DemandeStage
		db := database.DB
		if err := db.First(&demande, id).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Demande introuvable"})
			return
		}

		// Update fields if provided
		if req.StatutDemande != "" {
			demande.StatutDemande = req.StatutDemande
		}
		if req.MotifRejet != "" {
			demande.MotifRejet = req.MotifRejet
		}
		if req.IDTheme != 0 {
			demande.IDTheme = req.IDTheme
		}

		if err := db.Save(&demande).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		// Reload with relations
		if err := db.Preload("Stagiaire").Preload("Theme").First(&demande, demande.ID).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error loading demande data"})
			return
		}

			c.JSON(http.StatusOK, gin.H{"data": demande})
	}
}

// DeleteDemande deletes a demande stage
func DeleteDemande() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		if id == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "ID is required"})
			return
		}

		var demande models.DemandeStage
		db := database.DB
		
		// Check if demande exists
		if err := db.First(&demande, id).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Demande introuvable"})
			return
		}

		// Delete the demande
		if err := db.Delete(&demande).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Demande supprimée avec succès"})
	}
}
