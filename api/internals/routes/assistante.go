package routes

import (
	"project-stage-pfa/internals/handlers"

	"github.com/gin-gonic/gin"
)

func RegisterAssistanteRoutes(r *gin.Engine) {
	assistanteRoutes := r.Group("/assistante")
	assistanteRoutes.GET("/", handlers.GetAllAssistantes())
	assistanteRoutes.GET("/:id", handlers.GetAssistanteById())
	assistanteRoutes.POST("/", handlers.CreateAssistante())
	assistanteRoutes.PUT("/:id", handlers.UpdateAssistante())
	assistanteRoutes.DELETE("/:id", handlers.DeleteAssistante())
	assistanteRoutes.PUT("/:id/traiter-demande/:id_demande", handlers.TraiterDemande())

	// TODO : route pour creation de stagiaire et leur identifiant
}
