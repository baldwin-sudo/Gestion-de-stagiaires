package database

import (
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"log"
	"os"
	"project-stage-pfa/internals/models"
)

var DB *gorm.DB

func ConnectDB() {
	dbPath := "data/stages.db"

	// Vérifie si la base existait déjà
	_, err := os.Stat(dbPath)
	dbExisted := !os.IsNotExist(err)

	// Crée le dossier si nécessaire
	if err := os.MkdirAll("data", os.ModePerm); err != nil {
		log.Fatal("Error lors de la creation du dossier data/ ", err)
	}

	// Ouvre ou crée la base
	db, err := gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
	if err != nil {
		log.Fatal("Échec de la connexion à la base de données SQLite :", err)
	}

	DB = db

	DB = db

	// Migration automatique des modèles
	err = db.AutoMigrate(
		&models.Utilisateur{},
		&models.Stagiaire{},
		&models.AssistanteChargeStage{},
		&models.DemandeStage{},
		&models.ThemeDeStage{},
		&models.Stage{},
		&models.Presence{},
		&models.ParrainDeStage{},
		&models.Encadrant{},
		&models.Attestation{},
	)
	if err != nil {
		log.Fatal("Erreur lors de la migration de la base :", err)
	}

	// Affiche info
	if dbExisted {
		log.Println("📂 Base de données SQLite existante ouverte.")

	} else {
		log.Println("🆕 Nouvelle base de données SQLite créée.")
		SeedMockData()
		log.Println("📂 Base de données SQLite peuplé avec données de test .")

	}

	log.Println("Connexion à la base de données SQLite réussie.")

}
