package routes

import "github.com/gin-gonic/gin"

func RegisterStageRoutes(r *gin.Engine) {
	stageRoutes := r.Group("/stage")
	stageRoutes.GET("/")
	stageRoutes.GET("/:id")
	stageRoutes.POST("/")
	stageRoutes.PUT("/:id")

}
