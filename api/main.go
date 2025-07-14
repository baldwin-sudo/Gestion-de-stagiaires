package main

import (
	"github.com/gin-gonic/gin"
	"log"
	"project-stage-pfa/internals/database"
	"project-stage-pfa/internals/routes"
)

func main() {

	router := gin.Default()
	router.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})
	database.ConnectDB()
	routes.RegisterRoutes(router)
	if err := router.Run(); err != nil {
		log.Fatal("Error starting server")
	} // listen and serve on 0.0.0.0:8080

}
