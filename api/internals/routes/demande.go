package routes

import (
	"project-stage-pfa/internals/handlers"

	"github.com/gin-gonic/gin"
)

func RegisterDemandesStageRoutes(r *gin.Engine) {
	stageRoutes := r.Group("/demande-stage")
	stageRoutes.GET("/", handlers.GetAllDemande())
	stageRoutes.GET("/:id", handlers.GetDemandeById())
	stageRoutes.POST("/", handlers.CreateDemandeDeStage())
	stageRoutes.PUT("/:id", handlers.UpdateDemande())
	stageRoutes.DELETE("/:id", handlers.DeleteDemande())
}
