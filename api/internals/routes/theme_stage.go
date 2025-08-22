package routes

import (
	"project-stage-pfa/internals/handlers"

	"github.com/gin-gonic/gin"
)

func RegisterThemeDeStageRoutes(r *gin.Engine) {
	themedeStageRoutes := r.Group("/theme_stage")
	themedeStageRoutes.GET("/", handlers.GetAllThemeStages())
	themedeStageRoutes.GET("/:id", handlers.GetThemeStageById())
	themedeStageRoutes.POST("/", handlers.CreateThemeStage())
	themedeStageRoutes.PUT("/:id", handlers.UpdateThemeStage())
	themedeStageRoutes.DELETE("/:id", handlers.DeleteThemeStage())
}
