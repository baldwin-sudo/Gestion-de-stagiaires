package handlers

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"project-stage-pfa/internals/database"
	"project-stage-pfa/internals/models"
	"strconv"
	"time"
)

func GetAllStagiaires() gin.HandlerFunc {
	return func(c *gin.Context) {
		var stagiaires []models.Stagiaire
		database.DB.Find(&stagiaires)
		c.JSON(http.StatusOK, gin.H{"data": stagiaires})

	}
}
func GetStagiaireById() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		var stagiaire models.Stagiaire
		if result := database.DB.Where("id = ?", id).First(&stagiaire); result == nil {
			c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"message": "stagiaire introuvable"})
		}
		c.JSON(http.StatusOK, gin.H{"data": stagiaire})

	}
}
func GetStagiaireAllPresence() gin.HandlerFunc {
	return func(c *gin.Context) {
		var id_stagiaire = c.Param("id")
		var id_stage = c.Param("id_stage")
		db := database.DB
		var presences []models.Presence
		if result := db.Find(&presences, "id_stagiaire =? AND id_stage=?", id_stagiaire, id_stage); result.Error != nil {
			c.IndentedJSON(http.StatusNotFound, gin.H{"message": "stagiaires not found", "error": result.Error.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"data": presences})

	}
}
func MarquerStagiairePresentAujourdui() gin.HandlerFunc {
	return func(c *gin.Context) {
		type _presenceRequest struct {
			status string `form:"status" binding:"required"`
			notes  string `form:"notes" binding:"required"`
		}

		var presenceRequest _presenceRequest
		if err := c.Bind(&presenceRequest); err != nil {
			c.IndentedJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		if presenceRequest.status == "" {
			presenceRequest.status = "present"
		}
		if presenceRequest.notes == "" {
			presenceRequest.notes = "RAS"
		}
		id_stagaire := c.Param("id")
		idStagiaire, err := strconv.Atoi(id_stagaire)
		if err != nil {
			c.IndentedJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		id_stage := c.Param("id_stage")
		idStage, err := strconv.Atoi(id_stage)
		if err != nil {
			c.IndentedJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		var presence models.Presence = models.Presence{
			Date:        time.Now(),
			Statut:      presenceRequest.status,
			Notes:       presenceRequest.notes,
			IDStagiaire: uint(idStagiaire),
			IDStage:     uint(idStage),
		}
		if result := database.DB.Create(&presence); result.Error != nil {
			c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
			return
		}
	}
}

// TODO : ajouter son parrain .
func EnvoyerDemandeDeStage() gin.HandlerFunc {
	return func(c *gin.Context) {
		type demandeRequest struct {
			IDTheme       uint   `form:"id_theme" binding:"required"`
			IDStagiaire   uint   `form:"id_stagiaire" binding:"required"`
			NomParrain    string `form:"nom_parrain"`
			PrenomParrain string `form:"prenom_parrain"`
			Departement   string `form:"departement"`
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
		var nv_parrain models.ParrainDeStage = models.ParrainDeStage{
			Nom:         demandeForm.NomParrain,
			Prenom:      demandeForm.PrenomParrain,
			Departement: demandeForm.Departement,
		}
		database.DB.Create(&nv_parrain)

		var demandeStage models.DemandeStage = models.DemandeStage{
			IDTheme:       demandeForm.IDTheme,
			StatutDemande: "en_attente",
			MotifRejet:    "_",
			IDStagiaire:   stagiaire.ID,
			IDParrain:     nv_parrain.ID,
		}
		database.DB.Create(&demandeStage)

		// Reload with relations
		db.Preload("Stagiaire").Preload("Parrain").Preload("Theme").First(&demandeStage, demandeStage.ID)

		c.IndentedJSON(http.StatusOK, gin.H{"data": demandeStage})

	}
}
