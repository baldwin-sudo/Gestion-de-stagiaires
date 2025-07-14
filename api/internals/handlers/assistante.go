package handlers

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"project-stage-pfa/internals/database"
	"project-stage-pfa/internals/models"
)

func TraiterDemande() gin.HandlerFunc {
	return func(c *gin.Context) {
		type traitementRequest struct {
			IsValider    bool   `json:"isValider"`
			MotifDeRejet string `json:"MotifDeRejet,omitEmpty"`
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
