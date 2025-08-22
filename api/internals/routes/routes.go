package routes

import "github.com/gin-gonic/gin"

func RegisterRoutes(r *gin.Engine) {

	RegisterUtilisateurRoutes(r)

	RegisterAssistanteRoutes(r)

	RegisterStagiaireRoutes(r)

	RegisterParrainRoutes(r)

	RegisterDemandesStageRoutes(r)

	RegisterEncadrantRoutes(r)

	RegisterStageRoutes(r)

	RegisterThemeDeStageRoutes(r)

	RegisterAttestationRoutes(r)
}
