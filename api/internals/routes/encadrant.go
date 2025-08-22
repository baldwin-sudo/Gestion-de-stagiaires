package routes

import (
	"github.com/gin-gonic/gin"
	"project-stage-pfa/internals/handlers"
)

func RegisterEncadrantRoutes(r *gin.Engine) {
	parrainRoutes := r.Group("/encadrant")
	parrainRoutes.GET("/", handlers.GetAllEncadrant())
	parrainRoutes.GET("/:id", handlers.GetEncadrantByID())
	parrainRoutes.POST("/", handlers.PostEncdrant())
	parrainRoutes.PUT("/:id", handlers.UpdateEncadrant())
	parrainRoutes.DELETE("/:id", handlers.DeleteEncadrant())
}
