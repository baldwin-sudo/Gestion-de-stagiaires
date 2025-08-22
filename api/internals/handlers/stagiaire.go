package handlers

import (
	"net/http"
	"project-stage-pfa/internals/database"
	"project-stage-pfa/internals/models"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

func CreateStagiaire() gin.HandlerFunc {
	return func(c *gin.Context) {
		type StagiaireRequest struct {
			Nom        string `json:"nom" binding:"required"`
			Prenom     string `json:"prenom" binding:"required"`
			Ecole      string `json:"ecole"`
			Specialite string `json:"specialite"`
		}

		var req StagiaireRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		stagiaire := models.Stagiaire{
			Nom:        req.Nom,
			Prenom:     req.Prenom,
			Ecole:      req.Ecole,
			Specialite: req.Specialite,
		}

		db := database.DB
		if err := db.Create(&stagiaire).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		// Return the newly created stagiaire
		c.JSON(http.StatusCreated, gin.H{"data": stagiaire})
	}
}
func GetAllStagiaires() gin.HandlerFunc {
	return func(c *gin.Context) {
		var stagiaires []models.Stagiaire
		if result := database.DB.Preload("Demandes").Preload("Presences").Find(&stagiaires); result.Error != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"data": stagiaires})
	}
}

func GetStagiaireById() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		var stagiaire models.Stagiaire
		if result := database.DB.Preload("Demandes").Preload("Presences").First(&stagiaire, id); result.Error != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Stagiaire introuvable"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"data": stagiaire})
	}
}

func GetStagiaireAllPresence() gin.HandlerFunc {
	return func(c *gin.Context) {
		stagiaireID := c.Param("id")
		stageID := c.Param("id_stage")
		if stagiaireID == "" || stageID == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Stagiaire ID and Stage ID are required"})
			return
		}

		var presences []models.Presence
		db := database.DB
		if err := db.Where("id_stagiaire = ? AND id_stage = ?", stagiaireID, stageID).Find(&presences).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"data": presences})
	}
}

func MarquerStagiairePresentAujourdui() gin.HandlerFunc {
	return func(c *gin.Context) {
		stagiaireID := c.Param("id")
		stageID := c.Param("id_stage")
		if stagiaireID == "" || stageID == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Stagiaire ID and Stage ID are required"})
			return
		}

		// Convert string IDs to uint
		stagiaireIDUint, err := strconv.ParseUint(stagiaireID, 10, 32)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid stagiaire ID"})
			return
		}

		stageIDUint, err := strconv.ParseUint(stageID, 10, 32)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid stage ID"})
			return
		}

		var presence models.Presence
		db := database.DB
		// Check if presence already exists for today
		if err := db.Where("id_stagiaire = ? AND id_stage = ? AND date = CURDATE()", stagiaireIDUint, stageIDUint).First(&presence).Error; err == nil {
			c.JSON(http.StatusConflict, gin.H{"error": "Presence already marked for today"})
			return
		}

		// Create new presence record
		presence = models.Presence{
			IDStagiaire: uint(stagiaireIDUint),
			IDStage:     uint(stageIDUint),
			Date:        time.Now(),
			Statut:      "present",
			Notes:       "RAS",
		}

		if err := db.Create(&presence).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusCreated, gin.H{"data": presence})
	}
}

// CreateDemandeForStagiaire creates a demande stage for a specific stagiaire
func CreateDemandeForStagiaire() gin.HandlerFunc {
	return func(c *gin.Context) {
		stagiaireID := c.Param("id")
		if stagiaireID == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Stagiaire ID is required"})
			return
		}

		type DemandeRequest struct {
			IDTheme uint `json:"id_theme" binding:"required"`
		}

		var req DemandeRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// Convert stagiaireID to uint
		stagiaireIDUint, err := strconv.ParseUint(stagiaireID, 10, 32)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid stagiaire ID"})
			return
		}

		// Verify stagiaire exists
		var stagiaire models.Stagiaire
		db := database.DB
		if err := db.First(&stagiaire, stagiaireIDUint).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Stagiaire introuvable"})
			return
		}

		// Create demande stage
		demandeStage := models.DemandeStage{
			IDTheme:       req.IDTheme,
			StatutDemande: "en_attente",
			MotifRejet:    "_",
			IDStagiaire:   stagiaire.ID,
		}

		if err := db.Create(&demandeStage).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		// Reload with relations
		if err := db.Preload("Stagiaire").Preload("Theme").First(&demandeStage, demandeStage.ID).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error loading demande data"})
			return
		}

		c.JSON(http.StatusCreated, gin.H{"data": demandeStage})
	}
}

// UpdateStagiaire updates an existing stagiaire
func UpdateStagiaire() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		if id == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "ID is required"})
			return
		}

		type UpdateStagiaireRequest struct {
			Nom        string `json:"nom"`
			Prenom     string `json:"prenom"`
			Ecole      string `json:"ecole"`
			Specialite string `json:"specialite"`
		}

		var req UpdateStagiaireRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		var stagiaire models.Stagiaire
		db := database.DB
		if err := db.First(&stagiaire, id).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Stagiaire introuvable"})
			return
		}

		// Update fields if provided
		if req.Nom != "" {
			stagiaire.Nom = req.Nom
		}
		if req.Prenom != "" {
			stagiaire.Prenom = req.Prenom
		}
		if req.Ecole != "" {
			stagiaire.Ecole = req.Ecole
		}
		if req.Specialite != "" {
			stagiaire.Specialite = req.Specialite
		}

		if err := db.Save(&stagiaire).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"data": stagiaire})
	}
}

// DeleteStagiaire deletes a stagiaire
func DeleteStagiaire() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		if id == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "ID is required"})
			return
		}

		var stagiaire models.Stagiaire
		db := database.DB
		
		// Check if stagiaire exists
		if err := db.First(&stagiaire, id).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Stagiaire introuvable"})
			return
		}

		// Delete the stagiaire
		if err := db.Delete(&stagiaire).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Stagiaire supprimé avec succès"})
	}
}
