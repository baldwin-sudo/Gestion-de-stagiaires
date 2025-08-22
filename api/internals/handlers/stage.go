package handlers

import (
	"net/http"
	"project-stage-pfa/internals/database"
	"project-stage-pfa/internals/models"

	"github.com/gin-gonic/gin"
)

func GetAllStages() gin.HandlerFunc {
	return func(c *gin.Context) {
		var stages []models.Stage
		db := database.DB
		// Preload all relations
		if err := db.Preload("Encadrant").
			Preload("Parrain").
			Preload("Assistante").
			Preload("DemandeStage").
			Preload("DemandeStage.Stagiaire").
			Preload("DemandeStage.Theme").
			Find(&stages).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"data": stages})
	}
}

func GetStageById() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		var stage models.Stage
		db := database.DB
		if err := db.Preload("Encadrant").
			Preload("Parrain").
			Preload("Assistante").
			Preload("DemandeStage").
			Preload("DemandeStage.Stagiaire").
			Preload("DemandeStage.Theme").
			First(&stage, id).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Stage introuvable"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"data": stage})
	}
}

func CreateStage() gin.HandlerFunc {
	return func(c *gin.Context) {
		type StageRequest struct {
			StatutStage    string `json:"statut_stage" binding:"required"`
			IDEncadrant    uint   `json:"id_encadrant" binding:"required"`
			IDParrain      uint   `json:"id_parrain" binding:"required"`
			IDAssistante   uint   `json:"id_assistante" binding:"required"`
			IDDemandeStage uint   `json:"id_demande_stage" binding:"required"`
		}
		var req StageRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error binding": err.Error()})
			return
		}
		stage := models.Stage{
			StatutStage:    req.StatutStage,
			IDEncadrant:    req.IDEncadrant,
			IDParrain:      req.IDParrain,
			IDAssistante:   req.IDAssistante,
			IDDemandeStage: req.IDDemandeStage,
		}
		db := database.DB
		if err := db.Create(&stage).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		// Preload relations for response
		if err := db.Preload("Encadrant").
			Preload("Parrain").
			Preload("Assistante").
			Preload("DemandeStage").
			Preload("DemandeStage.Stagiaire").
			Preload("DemandeStage.Theme").
			First(&stage, stage.ID).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error loading stage data"})
			return
		}
		c.JSON(http.StatusCreated, gin.H{"data": stage})
	}
}

// GET /stage/options
func GetStageOptions() gin.HandlerFunc {
	return func(c *gin.Context) {
		db := database.DB
		var encadrants []models.Encadrant
		var parrains []models.ParrainDeStage
		var assistantes []models.AssistanteChargeStage
		var demandes []models.DemandeStage

		if err := db.Find(&encadrants).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error loading encadrants"})
			return
		}
		if err := db.Find(&parrains).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error loading parrains"})
			return
		}
		if err := db.Find(&assistantes).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error loading assistantes"})
			return
		}
		if err := db.Preload("Stagiaire").Preload("Theme").Find(&demandes).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error loading demandes"})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"encadrants":  encadrants,
			"parrains":    parrains,
			"assistantes": assistantes,
			"demandes":    demandes,
		})
	}
}

// UpdateStage updates an existing stage
func UpdateStage() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		if id == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "ID is required"})
			return
		}

		type UpdateStageRequest struct {
			StatutStage    string `json:"statut_stage"`
			IDEncadrant    uint   `json:"id_encadrant"`
			IDParrain      uint   `json:"id_parrain"`
			IDAssistante   uint   `json:"id_assistante"`
			IDDemandeStage uint   `json:"id_demande_stage"`
		}

		var req UpdateStageRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		var stage models.Stage
		db := database.DB
		if err := db.First(&stage, id).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Stage introuvable"})
			return
		}

		// Update fields if provided
		if req.StatutStage != "" {
			stage.StatutStage = req.StatutStage
		}
		if req.IDEncadrant != 0 {
			stage.IDEncadrant = req.IDEncadrant
		}
		if req.IDParrain != 0 {
			stage.IDParrain = req.IDParrain
		}
		if req.IDAssistante != 0 {
			stage.IDAssistante = req.IDAssistante
		}
		if req.IDDemandeStage != 0 {
			stage.IDDemandeStage = req.IDDemandeStage
		}

		if err := db.Save(&stage).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		// Preload relations for response
		if err := db.Preload("Encadrant").
			Preload("Parrain").
			Preload("Assistante").
			Preload("DemandeStage").
			Preload("DemandeStage.Stagiaire").
			Preload("DemandeStage.Theme").
			First(&stage, stage.ID).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error loading stage data"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"data": stage})
	}
}

// DeleteStage deletes a stage
func DeleteStage() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		if id == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "ID is required"})
			return
		}

		var stage models.Stage
		db := database.DB
		
		// Check if stage exists
		if err := db.First(&stage, id).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Stage introuvable"})
			return
		}

		// Delete the stage
		if err := db.Delete(&stage).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Stage supprimé avec succès"})
	}
}
