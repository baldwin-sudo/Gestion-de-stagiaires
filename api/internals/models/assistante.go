package models

import (
	"time"

	"gorm.io/gorm"
)

// AssistanteChargeStage represents the admin/assistant
type AssistanteChargeStage struct {
	ID           uint   `gorm:"primaryKey;autoIncrement" json:"id"`
	Nom          string `gorm:"not null;size:100" json:"nom"`
	Prenom       string `gorm:"not null;size:100" json:"prenom"`
	Identifiant  string `gorm:"unique;not null;size:50" json:"identifiant"`
	HashPassword string `gorm:"not null;size:255" json:"-"` // "-" excludes from JSON

	AdresseCourrier string         `gorm:"size:255" json:"adresse_courrier"`
	NumTelephone    string         `gorm:"size:20" json:"num_telephone"`
	CreatedAt       time.Time      `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt       time.Time      `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt       gorm.DeletedAt `gorm:"index" json:"-"`

	// Relations
	Stages []Stage `gorm:"foreignKey:IDAssistante" json:"stages,omitempty"`
}

func (AssistanteChargeStage) TableName() string {
	return "assistantes_charge_stage"
}
