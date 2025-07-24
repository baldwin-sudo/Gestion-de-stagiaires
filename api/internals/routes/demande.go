package routes

import (
	"project-stage-pfa/internals/handlers"

	"github.com/gin-gonic/gin"
)

func RegisterDemandeStageRoutes(r *gin.Engine) {
	stageRoutes := r.Group("/demande-stage")
	stageRoutes.GET("/", handlers.GetAllDemande())
	stageRoutes.GET("/:id", handlers.GetDemandeById())
	stageRoutes.POST("/", handlers.CreateDemandeDeStage())
	stageRoutes.PUT("/:id")

}
