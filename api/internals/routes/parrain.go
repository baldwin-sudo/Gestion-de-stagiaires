package routes

import (
	"github.com/gin-gonic/gin"
	"project-stage-pfa/internals/handlers"
)

func RegisterParrainRoutes(r *gin.Engine) {
	parrainRoutes := r.Group("/parrain")
	parrainRoutes.GET("/", handlers.GetAllParrain())
	parrainRoutes.GET("/:id", handlers.GetParrainByID())
	parrainRoutes.POST("/", handlers.PostParrain())
	parrainRoutes.PUT("/:id", handlers.UpdateParrain())
	parrainRoutes.DELETE("/:id", handlers.DeleteParrain())
}
