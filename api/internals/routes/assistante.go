package routes

import (
	"github.com/gin-gonic/gin"
	"project-stage-pfa/internals/handlers"
)

func RegisterAssistanteRoutes(r *gin.Engine) {
	assistanteRoutes := r.Group("/assistante")
	assistanteRoutes.GET("/:id")
	assistanteRoutes.PUT("/:id_assistante/traiter-demande/:id_demande", handlers.TraiterDemande())

	// TODO : route pour creation de stagiaire et leur identifiant
}
