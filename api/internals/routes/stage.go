package routes

import (
	"github.com/gin-gonic/gin"
	"project-stage-pfa/internals/handlers"
)

func RegisterStageRoutes(r *gin.Engine) {
	stageRoutes := r.Group("/stage")
	stageRoutes.GET("/", handlers.GetAllStages())
	stageRoutes.GET("/options", handlers.GetStageOptions())
	stageRoutes.GET("/:id", handlers.GetStageById())
	stageRoutes.POST("/", handlers.CreateStage())
	stageRoutes.PUT("/:id", handlers.UpdateStage())
	stageRoutes.DELETE("/:id", handlers.DeleteStage())
}
