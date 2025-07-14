package models

import (
	"gorm.io/gorm"
	"time"
)

// AssistanteChargeStage represents the admin/assistant
type AssistanteChargeStage struct {
	ID              uint           `gorm:"primaryKey;autoIncrement" json:"id"`
	Nom             string         `gorm:"not null;size:100" json:"nom"`
	Prenom          string         `gorm:"not null;size:100" json:"prenom"`
	AdresseCourrier string         `gorm:"size:255" json:"adresse_courrier"`
	NumTelephone    string         `gorm:"size:20" json:"num_telephone"`
	IDUtilisateur   uint           `gorm:"not null;index" json:"id_utilisateur"`
	CreatedAt       time.Time      `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt       time.Time      `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt       gorm.DeletedAt `gorm:"index" json:"-"`

	// Relations
	Utilisateur Utilisateur `gorm:"foreignKey:IDUtilisateur" json:"utilisateur,omitempty"`
	Stages      []Stage     `gorm:"foreignKey:IDAssistante" json:"stages,omitempty"`
}

func (AssistanteChargeStage) TableName() string {
	return "assistantes_charge_stage"
}
