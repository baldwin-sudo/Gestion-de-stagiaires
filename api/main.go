package main

import (
	"log"
	"project-stage-pfa/internals/database"
	"project-stage-pfa/internals/middleware"
	"project-stage-pfa/internals/routes"

	"github.com/gin-gonic/gin"
)

func main() {

	router := gin.Default()

	// Add CORS middleware
	router.Use(middleware.CORSMiddleware())

	router.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})
	database.ConnectDB()
	routes.RegisterRoutes(router)
	router.SetTrustedProxies(nil)
	if err := router.Run(); err != nil {
		log.Fatal("Error starting server")
	} // listen and serve on 0.0.0.0:8080

}
