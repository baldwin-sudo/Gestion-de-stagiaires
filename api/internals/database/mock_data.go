package database

import (
	"log"
	"project-stage-pfa/internals/models"
	"time"
)

func SeedMockData() {
	// 1. Stagiaires (5 entries)
	stagiaires := []models.Stagiaire{
		{
			Nom:        "Kasmi",
			Prenom:     "El Mehdi",
			Ecole:      "ENSAM Rabat",
			Specialite: "Data Science",
		},
		{
			Nom:        "Alaoui",
			Prenom:     "Fatima",
			Ecole:      "EMSI Casablanca",
			Specialite: "Développement Web",
		},
		{
			Nom:        "Benjelloun",
			Prenom:     "Ahmed",
			Ecole:      "ENSA Marrakech",
			Specialite: "Intelligence Artificielle",
		},
		{
			Nom:        "Tazi",
			Prenom:     "Sara",
			Ecole:      "ENSIAS Rabat",
			Specialite: "Sécurité Informatique",
		},
		{
			Nom:        "Mansouri",
			Prenom:     "Youssef",
			Ecole:      "EMSI Fès",
			Specialite: "Développement Mobile",
		},
	}

	for	 i := range stagiaires {
		DB.Create(&stagiaires[i])
	}

	// 2. Assistantes (5 entries)
	assistantes := []models.AssistanteChargeStage{
		{
			Nom:             "Laila",
			Prenom:          "Bennani",
			Identifiant:     "assistante1",
			HashPassword:    "hashed_password1",
			AdresseCourrier: "laila.bennani@example.com",
			NumTelephone:    "0600000001",
		},
		{
			Nom:             "Amina",
			Prenom:          "El Fassi",
			Identifiant:     "assistante2",
			HashPassword:    "hashed_password2",
			AdresseCourrier: "amina.elfassi@example.com",
			NumTelephone:    "0600000002",
		},
		{
			Nom:             "Khadija",
			Prenom:          "Touil",
			Identifiant:     "assistante3",
			HashPassword:    "hashed_password3",
			AdresseCourrier: "khadija.touil@example.com",
			NumTelephone:    "0600000003",
		},
		{
			Nom:             "Nadia",
			Prenom:          "Rachidi",
			Identifiant:     "assistante4",
			HashPassword:    "hashed_password4",
			AdresseCourrier: "nadia.rachidi@example.com",
			NumTelephone:    "0600000004",
		},
		{
			Nom:             "Hafsa",
			Prenom:          "Bouazza",
			Identifiant:     "assistante5",
			HashPassword:    "hashed_password5",
			AdresseCourrier: "hafsa.bouazza@example.com",
			NumTelephone:    "0600000005",
		},
	}

	for i := range assistantes {
		DB.Create(&assistantes[i])
	}

	// 3. Encadrants (5 entries)
	encadrants := []models.Encadrant{
		{
			Nom:             "Ali",
			Prenom:          "Hamid",
			Numero:          "P123",
			AdresseCourrier: "ali.hamid@example.com",
			Ecole:           "UM5R",
		},
		{
			Nom:             "Karim",
			Prenom:          "El Amrani",
			Numero:          "P124",
			AdresseCourrier: "karim.elamrani@example.com",
			Ecole:           "UM6P",
		},
		{
			Nom:             "Hassan",
			Prenom:          "Benjelloun",
			Numero:          "P125",
			AdresseCourrier: "hassan.benjelloun@example.com",
			Ecole:           "UM2C",
		},
		{
			Nom:             "Mohammed",
			Prenom:          "Tazi",
			Numero:          "P126",
			AdresseCourrier: "mohammed.tazi@example.com",
			Ecole:           "UM1",
		},
		{
			Nom:             "Rachid",
			Prenom:          "Mansouri",
			Numero:          "P127",
			AdresseCourrier: "rachid.mansouri@example.com",
			Ecole:           "UM3",
		},
	}

	for i := range encadrants {
		DB.Create(&encadrants[i])
	}

	// 4. Parrains (5 entries)
	parrains := []models.ParrainDeStage{
		{
			Nom:         "Sami",
			Prenom:      "Youssef",
			Departement: "Informatique",
		},
		{
			Nom:         "Omar",
			Prenom:      "El Khattabi",
			Departement: "Data Science",
		},
		{
			Nom:         "Yassine",
			Prenom:      "Benali",
			Departement: "Sécurité",
		},
		{
			Nom:         "Adil",
			Prenom:      "Rachidi",
			Departement: "Mobile",
		},
		{
			Nom:         "Tarik",
			Prenom:      "Bouazza",
			Departement: "DevOps",
		},
	}

	for i:= range parrains {
		DB.Create(&parrains[i])
	}

	// 5. Thèmes de stage (5 entries)
	dateDebut := time.Now().AddDate(0, 0, 7)
	dateFin := dateDebut.AddDate(0, 2, 0)

	themes := []models.ThemeDeStage{
		{
			Sujet:         "Développement d'un tableau de bord RH",
			Departement:   "Informatique",
			Type:          "PFE",
			Description:   "Création d'une application web pour gérer les présences et évaluations.",
			Prerequisites: "Go, React, PostgreSQL",
			DateDebut:     dateDebut,
			DateFin:       dateFin,
			IDEncadrant:   encadrants[0].ID,
			Duree:         60,
			EstActif:      true,
		},
		{
			Sujet:         "Système de recommandation IA",
			Departement:   "Data Science",
			Type:          "PFE",
			Description:   "Développement d'un système de recommandation basé sur l'IA.",
			Prerequisites: "Python, TensorFlow, MongoDB",
			DateDebut:     dateDebut.AddDate(0, 0, 10),
			DateFin:       dateFin.AddDate(0, 0, 10),
			IDEncadrant:   encadrants[1].ID,
			Duree:         90,
			EstActif:      true,
		},
		{
			Sujet:         "Application mobile de sécurité",
			Departement:   "Sécurité",
			Type:          "PFE",
			Description:   "Création d'une application mobile pour la sécurité informatique.",
			Prerequisites: "Flutter, Firebase, Cryptographie",
			DateDebut:     dateDebut.AddDate(0, 0, 15),
			DateFin:       dateFin.AddDate(0, 0, 15),
			IDEncadrant:   encadrants[2].ID,
			Duree:         75,
			EstActif:      true,
		},
		{
			Sujet:         "Plateforme e-commerce mobile",
			Departement:   "Mobile",
			Type:          "PFE",
			Description:   "Développement d'une application mobile e-commerce complète.",
			Prerequisites: "React Native, Node.js, MySQL",
			DateDebut:     dateDebut.AddDate(0, 0, 20),
			DateFin:       dateFin.AddDate(0, 0, 20),
			IDEncadrant:   encadrants[3].ID,
			Duree:         120,
			EstActif:      true,
		},
		{
			Sujet:         "Infrastructure cloud automatisée",
			Departement:   "DevOps",
			Type:          "PFE",
			Description:   "Mise en place d'une infrastructure cloud avec CI/CD.",
			Prerequisites: "Docker, Kubernetes, AWS",
			DateDebut:     dateDebut.AddDate(0, 0, 25),
			DateFin:       dateFin.AddDate(0, 0, 25),
			IDEncadrant:   encadrants[4].ID,
			Duree:         100,
			EstActif:      true,
		},
	}

	for i := range themes {
		DB.Create(&themes[i])
	}

	// 6. Demandes de stage (5 entries with different statuses)
	demandes := []models.DemandeStage{
		{
			StatutDemande: "validee",
			MotifRejet:    "_",
			IDTheme:       themes[0].ID,
			IDStagiaire:   stagiaires[0].ID,
		},
		{
			StatutDemande: "en_attente",
			MotifRejet:    "_",
			IDTheme:       themes[1].ID,
			IDStagiaire:   stagiaires[1].ID,
		},
		{
			StatutDemande: "validee",
			MotifRejet:    "_",
			IDTheme:       themes[2].ID,
			IDStagiaire:   stagiaires[2].ID,
		},
		{
			StatutDemande: "rejetee",
			MotifRejet:    "Dossier incomplet",
			IDTheme:       themes[3].ID,
			IDStagiaire:   stagiaires[3].ID,
		},
		{
			StatutDemande: "en_attente",
			MotifRejet:    "_",
			IDTheme:       themes[4].ID,
			IDStagiaire:   stagiaires[4].ID,
		},
	}

	for i := range demandes {
		if err := DB.Create(&demandes[i]).Error; err != nil {
			log.Printf("Error creating demande %d: %v", i, err)
		}
	}

	// 7. Stages (2 entries - only for validated demandes)
	stages := []models.Stage{
		{
			StatutStage:    "en_cours",
			DateValidation: func() *time.Time { t := time.Now().AddDate(0, 0, -30); return &t }(),
			IDParrain:      parrains[0].ID,
			IDEncadrant:    encadrants[0].ID,
			IDAssistante:   assistantes[0].ID,
			IDDemandeStage: demandes[0].ID,
		},
		{
			StatutStage:    "en_cours",
			DateValidation: func() *time.Time { t := time.Now().AddDate(0, 0, -15); return &t }(),
			IDParrain:      parrains[2].ID,
			IDEncadrant:    encadrants[2].ID,
			IDAssistante:   assistantes[2].ID,
			IDDemandeStage: demandes[2].ID,
		},
	}

	for id := range stages {
		DB.Create(&stages[id])
	}

	// 8. Présences (for existing stages)
	for _, stage := range stages {
		for i := 0; i < 5; i++ {
			jour := time.Now().AddDate(0, 0, -i)
			DB.Create(&models.Presence{
				Date:        jour,
				Statut:      "present",
				Notes:       "RAS",
				IDStage:     stage.ID,
				IDStagiaire: stagiaires[i].ID,
			})
		}
	}

	// 9. Attestations (for completed stages)
	DB.Create(&models.Attestation{
		Numero:        "ATT-001",
		DateEmission:  time.Now(),
		Contenu:       "Le stage a été effectué avec succès.",
		CheminFichier: "attestations/att-001.pdf",
		IDStage:       stages[0].ID,
	})

	DB.Create(&models.Attestation{
		Numero:        "ATT-002",
		DateEmission:  time.Now(),
		Contenu:       "Stage en cours d'exécution.",
		CheminFichier: "attestations/att-002.pdf",
		IDStage:       stages[1].ID,
	})

	log.Println("✅ Données fictives mises à jour et insérées avec succès.")
}
