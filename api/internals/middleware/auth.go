package middleware

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"net/http"
	"project-stage-pfa/internals/config"
	"slices"
	"strings"
)

func RequireAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		header := c.GetHeader("Authorization")

		if header == "" || !strings.HasPrefix(header, "Bearer ") {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": " Authorization header not found ."})
		}

		tokenString := strings.Split(header, " ")[1]
		if tokenString == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "jwt token not found in Authorization header ."})

		}

		claims := jwt.MapClaims{}
		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return []byte(config.GetJwtSecret()), nil
		})
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "jwt token not found ."})
		}
		if token != nil && token.Valid {
			userID := claims["id_utilisateur"]
			role := claims["role"]
			c.Set("id_utilisateur", userID)
			c.Set("role", role)
		}
		c.Next()
	}

}
func AuthorizedRolesMiddleware(roles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {

		roleVal, ok := c.Get("role")
		if !ok {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": " role not found ."})
		}

		if slices.Contains(roles, roleVal.(string)) {
			c.Next()
		} else {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "unAuthorized role ."})
		}
	}
}
