package models

import (
	"time"

	"gorm.io/gorm"
)

// Stagiaire represents an intern
type Stagiaire struct {
	ID         uint           `gorm:"primaryKey;autoIncrement" json:"id"`
	Nom        string         `gorm:"not null;size:100" json:"nom"`
	Prenom     string         `gorm:"not null;size:100" json:"prenom"`
	Ecole      string         `gorm:"size:200" json:"ecole"`
	Specialite string         `gorm:"size:200" json:"specialite"`
	CreatedAt  time.Time      `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt  time.Time      `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt  gorm.DeletedAt `gorm:"index" json:"-"`

	// Relations
	Demandes []DemandeStage `gorm:"foreignKey:IDStagiaire" json:"demandes,omitempty"`
	Presences []Presence    `gorm:"foreignKey:IDStagiaire" json:"presences,omitempty"`
}

func (Stagiaire) TableName() string {
	return "stagiaires"
}
