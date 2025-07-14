package routes

import (
	"github.com/gin-gonic/gin"
	"project-stage-pfa/internals/handlers"
)

func RegisterThemeDeStageRoutes(r *gin.Engine) {
	themedeStageRoutes := r.Group("/theme_stage")
	themedeStageRoutes.GET("/", handlers.GetAllStages())
	themedeStageRoutes.GET("/:id", handlers.GetStageById())
	themedeStageRoutes.POST("/", handlers.CreateStage())
	themedeStageRoutes.PUT("/:id", handlers.UpdateStage())

}
