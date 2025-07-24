package database

import (
	"log"
	"project-stage-pfa/internals/models"
	"time"
)

func SeedMockData() {
	// 1. Stagiaire & Assistante
	stagiaire := models.Stagiaire{
		Nom:    "Kasmi",
		Prenom: "El Mehdi",

		Ecole:      "ENSAM Rabat",
		Specialite: "Data Science",
	}

	assistante := models.AssistanteChargeStage{
		Nom:             "Laila",
		Prenom:          "Bennani",
		Identifiant:     "assistante1",
		HashPassword:    "hashed_password2",
		AdresseCourrier: "assistante@example.com",
		NumTelephone:    "0600000000",
	}

	DB.Create(&stagiaire)
	DB.Create(&assistante)

	// 3. Encadrant & Parrain
	encadrant := models.Encadrant{
		Nom: "Ali", Prenom: "Hamid", Numero: "P123", AdresseCourrier: "encadrant@example.com", Ecole: "UM5R",
	}
	parrain := models.ParrainDeStage{
		Nom: "Sami", Prenom: "Youssef", Departement: "Informatique",
	}

	DB.Create(&encadrant)
	DB.Create(&parrain)

	// 4. Thème de stage
	dateDebut := time.Now().AddDate(0, 0, 7)
	dateFin := dateDebut.AddDate(0, 2, 0)

	theme := models.ThemeDeStage{
		Sujet:         "Développement d'un tableau de bord RH",
		Departement:   "Informatique",
		Type:          "PFE",
		Description:   "Création d'une application web pour gérer les présences et évaluations.",
		Prerequisites: "Go, React, PostgreSQL",
		DateDebut:     dateDebut,
		DateFin:       dateFin,
		IDEncadrant:   encadrant.ID,
		Duree:         60,
		EstActif:      true,
	}
	DB.Create(&theme)

	// 5. Demande de stage
	demande := models.DemandeStage{
		StatutDemande: "validee",
		IDTheme:       theme.ID,
		IDStagiaire:   stagiaire.ID,
	}
	DB.Create(&demande)

	// 6. Stage (lié à la demande validée)
	stage := models.Stage{
		StatutStage:    "en_cours",
		DateValidation: func() *time.Time { t := time.Now(); return &t }(),
		IDParrain:      parrain.ID,

		IDAssistante:   assistante.ID,
		IDDemandeStage: demande.ID,
	}
	DB.Create(&stage)

	// 7. Présences
	for i := 0; i < 5; i++ {
		jour := time.Now().AddDate(0, 0, -i)
		DB.Create(&models.Presence{
			Date:        jour,
			Statut:      "present",
			Notes:       "RAS",
			IDStage:     stage.ID,
			IDStagiaire: stagiaire.ID,
		})
	}

	// 8. Attestation
	DB.Create(&models.Attestation{
		Numero:        "ATT-001",
		DateEmission:  time.Now(),
		Contenu:       "Le stage a été effectué avec succès.",
		CheminFichier: "attestations/att-001.pdf",
		IDStage:       stage.ID,
	})

	log.Println("✅ Données fictives mises à jour et insérées avec succès.")
}
