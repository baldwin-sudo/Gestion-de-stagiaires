package routes

import (
	"github.com/gin-gonic/gin"
	"project-stage-pfa/internals/handlers"
)

func RegisterUtilisateurRoutes(r *gin.Engine) {
	utilisateurRoutes := r.Group("/utilisateur")

	utilisateurRoutes.POST("/login", handlers.Login())
	utilisateurRoutes.GET("/:id")
	utilisateurRoutes.POST("/")
	utilisateurRoutes.PUT("/:id")
}
