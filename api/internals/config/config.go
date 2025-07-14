package config

import (
	"github.com/joho/godotenv"
	"log"
	"os"
)

func LoadEnv() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file")

	}

}
func GetJwtSecret() string {
	return os.Getenv("JWT_SECRET")
}
