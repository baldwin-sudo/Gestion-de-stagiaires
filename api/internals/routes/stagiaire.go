package routes

import (
	"project-stage-pfa/internals/handlers"

	"github.com/gin-gonic/gin"
)

func RegisterStagiaireRoutes(r *gin.Engine) {

	stagiaire := r.Group("/stagiaire")

	// Basic routes
	stagiaire.GET("/", handlers.GetAllStagiaires())
	stagiaire.GET("/:id", handlers.GetStagiaireById())
	// presence total
	stagiaire.GET("/:id/presence/:id_stage", handlers.GetStagiaireAllPresence())
	stagiaire.POST("/:id/presence/:id_stage/today", handlers.MarquerStagiairePresentAujourdui())

	// demande-stage
	stagiaire.POST(":id/demande-stage")

	// Nested group for routes that use a stagiaire ID
}
