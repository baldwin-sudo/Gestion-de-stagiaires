package handlers

import (
	"net/http"
	"project-stage-pfa/internals/database"
	"project-stage-pfa/internals/models"

	"github.com/gin-gonic/gin"
)

// GetAssistanteById gets an assistante by ID
func GetAssistanteById() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		if id == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "ID is required"})
			return
		}

		var assistante models.AssistanteChargeStage
		db := database.DB
		if err := db.First(&assistante, id).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Assistante introuvable"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"data": assistante})
	}
}

func TraiterDemande() gin.HandlerFunc {
	return func(c *gin.Context) {
		type traitementRequest struct {
			IsValider    bool   `json:"isValider"`
			MotifDeRejet string `json:"motifDeRejet,omitempty"`
			IdEncadrant  uint   `json:"id_encadrant,omitempty"`
		}
		var traitementRes traitementRequest
		if err := c.BindJSON(&traitementRes); err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		idDemande := c.Param("id_demande")

		var demande_stage models.DemandeStage
		if result := database.DB.First(&demande_stage, idDemande); result.Error != nil {
			c.AbortWithStatus(http.StatusNotFound)
			return
		}
		// cas 1 : rejet
		if !traitementRes.IsValider {
			demande_stage.StatutDemande = "rejetee"
			demande_stage.MotifRejet = traitementRes.MotifDeRejet
			database.DB.Save(&demande_stage)
			c.IndentedJSON(http.StatusOK, gin.H{"data": demande_stage})
			return
		}

		// cas 2 : valider
		idAssistanteStr := c.Param("id_assistante")

		var assistante models.AssistanteChargeStage
		if result := database.DB.First(&assistante, idAssistanteStr); result.Error != nil {
			c.AbortWithStatus(http.StatusNotFound)
			return
		}
		var encadrant models.Encadrant
		if result := database.DB.First(&encadrant, traitementRes.IdEncadrant); result.Error != nil {
			c.AbortWithStatus(http.StatusNotFound)
			return
		}

		demande_stage.StatutDemande = "validee"
		demande_stage.MotifRejet = "_"
		database.DB.Save(&demande_stage)
		newStage := models.Stage{
			StatutStage:    "en_cours",
			IDDemandeStage: demande_stage.ID,
			IDAssistante:   assistante.ID,
			IDEncadrant:    traitementRes.IdEncadrant,
		}
		// Création du stage
		if err := database.DB.Create(&newStage).Error; err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		// Rechargement avec relations (si tu veux les retourner dans la réponse)
		database.DB.Preload("Encadrant").Preload("DemandeStage").First(&newStage, newStage.ID)

		c.IndentedJSON(http.StatusOK, gin.H{"data": newStage})

	}
}

// GetAllAssistantes gets all assistantes
func GetAllAssistantes() gin.HandlerFunc {
	return func(c *gin.Context) {
		var assistantes []models.AssistanteChargeStage
		db := database.DB
		if err := db.Find(&assistantes).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"data": assistantes})
	}
}

// CreateAssistante creates a new assistante
func CreateAssistante() gin.HandlerFunc {
	return func(c *gin.Context) {
		type CreateAssistanteRequest struct {
			Nom          string `json:"nom" binding:"required"`
			Prenom       string `json:"prenom" binding:"required"`
			Identifiant  string `json:"identifiant" binding:"required"`
			HashPassword string `json:"hash_password" binding:"required"`
		}

		var req CreateAssistanteRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		assistante := models.AssistanteChargeStage{
			Nom:          req.Nom,
			Prenom:       req.Prenom,
			Identifiant:  req.Identifiant,
			HashPassword: req.HashPassword,
		}

		db := database.DB
		if err := db.Create(&assistante).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusCreated, gin.H{"data": assistante})
	}
}

// UpdateAssistante updates an existing assistante
func UpdateAssistante() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		if id == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "ID is required"})
			return
		}

		type UpdateAssistanteRequest struct {
			Nom          string `json:"nom"`
			Prenom       string `json:"prenom"`
			Identifiant  string `json:"identifiant"`
			HashPassword string `json:"hash_password"`
		}

		var req UpdateAssistanteRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		var assistante models.AssistanteChargeStage
		db := database.DB
		if err := db.First(&assistante, id).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Assistante introuvable"})
			return
		}

		// Update fields if provided
		if req.Nom != "" {
			assistante.Nom = req.Nom
		}
		if req.Prenom != "" {
			assistante.Prenom = req.Prenom
		}
		if req.Identifiant != "" {
			assistante.Identifiant = req.Identifiant
		}
		if req.HashPassword != "" {
			assistante.HashPassword = req.HashPassword
		}

		if err := db.Save(&assistante).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"data": assistante})
	}
}

// DeleteAssistante deletes an assistante
func DeleteAssistante() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		if id == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "ID is required"})
			return
		}

		var assistante models.AssistanteChargeStage
		db := database.DB
		
		// Check if assistante exists
		if err := db.First(&assistante, id).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Assistante introuvable"})
			return
		}

		// Delete the assistante
		if err := db.Delete(&assistante).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Assistante supprimée avec succès"})
	}
}
