package models

import (
	"time"

	"gorm.io/gorm"
)

// Stage represents an internship
type Stage struct {
	ID             uint       `gorm:"primaryKey;autoIncrement" json:"id"`
	StatutStage    string     `gorm:"size:50;default:'en_cours'" json:"statut"` // "en_cours", "termine", "suspendu"
	DateValidation *time.Time `gorm:"null" json:"date_validation"`
	IDEncadrant    uint       `gorm:"not null;index" json:"id_encadrant"`
	IDParrain      uint       `gorm:"not null;index" json:"id_parrain"`

	IDAssistante   uint           `gorm:"not null;index" json:"id_assistante"`
	IDDemandeStage uint           `gorm:"not null;index" json:"id_demande_stage"`
	CreatedAt      time.Time      `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt      time.Time      `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt      gorm.DeletedAt `gorm:"index" json:"-"`

	// Relations
	Parrain ParrainDeStage `gorm:"foreignKey:IDParrain" json:"parrain,omitempty"`

	Encadrant    Encadrant             `gorm:"foreignKey:IDEncadrant" json:"encadrant,omitempty"`
	Assistante   AssistanteChargeStage `gorm:"foreignKey:IDAssistante" json:"-"`
	DemandeStage DemandeStage          `gorm:"foreignKey:IDDemandeStage" json:"demande_stage"`
	Presences    []Presence            `gorm:"foreignKey:IDStage" json:"-"`
}

func (Stage) TableName() string {
	return "stages"
}
