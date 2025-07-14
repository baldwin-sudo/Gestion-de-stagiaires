package routes

import "github.com/gin-gonic/gin"

func RegisterAttestationRoutes(r *gin.Engine) {
	attestationRoutes := r.Group("/attestation")
	attestationRoutes.GET("/")
	attestationRoutes.GET("/:id")
	attestationRoutes.POST("/")
	attestationRoutes.PUT("/:id")
}
