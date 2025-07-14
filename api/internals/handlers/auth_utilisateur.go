package handlers

import (
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"net/http"
	"project-stage-pfa/internals/config"
	"project-stage-pfa/internals/database"
	"project-stage-pfa/internals/models"
)

var jwtSecret = []byte("secret-key")

type JwtCustomClaims struct {
	idUtilisateur uint
	role          string
}

func createJwt(jwtClaims JwtCustomClaims) (string, error) {
	var token *jwt.Token = jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{"id_utilisateur": jwtClaims.idUtilisateur, "role": jwtClaims.role})
	tokenString, err := token.SignedString([]byte(config.GetJwtSecret()))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}
func Login() gin.HandlerFunc {
	return func(c *gin.Context) {
		type LoginRequest struct {
			Identifiant string `form:"identifiant" binding:"required"`
			MotDePasse  string `form:"motdepasse" binding:"required"`
			Role        string `form:"role" binding:"required"`
		}

		var request LoginRequest
		if err := c.ShouldBind(&request); err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Entrée invalide"})
			return
		}

		db := database.DB
		var utilisateur models.Utilisateur
		if err := db.First(&utilisateur, "identifiant = ?", request.Identifiant).Error; err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Identifiant incorrect"})
			return
		}

		// Verify password
		if utilisateur.HashPassword != request.MotDePasse {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Mot de passe invalide"})
			return
		}

		// Check role match
		if utilisateur.Role != request.Role {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Rôle non autorisé"})
			return
		}

		// Load profile based on role
		switch utilisateur.Role {
		case "stagiaire":
			var stagiaire models.Stagiaire
			if err := db.First(&stagiaire, "id_utilisateur = ?", utilisateur.ID).Error; err != nil {
				c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Stagiaire introuvable"})
				return
			}
			var tokenString, err = createJwt(JwtCustomClaims{
				idUtilisateur: utilisateur.ID,
				role:          "stagiaire",
			})
			if err != nil {
				c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			}
			c.JSON(http.StatusOK, gin.H{
				"message":     "Connexion réussie",
				"token":       tokenString,
				"utilisateur": utilisateur,
				"stagiaire":   stagiaire,
			})

		case "assistante":
			var assistante models.AssistanteChargeStage
			if err := db.First(&assistante, "id_utilisateur = ?", utilisateur.ID).Error; err != nil {
				c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Assistante introuvable"})
				return
			}
			var tokenString, err = createJwt(JwtCustomClaims{
				idUtilisateur: utilisateur.ID,
				role:          "assistante",
			})
			if err != nil {
				c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			}
			c.JSON(http.StatusOK, gin.H{
				"message":     "Connexion réussie",
				"utilisateur": utilisateur,
				"assistante":  assistante,
				"token":       tokenString,
			})

		default:
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Rôle inconnu"})
		}
	}
}
