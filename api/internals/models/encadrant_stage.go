package models

import (
	"gorm.io/gorm"
	"time"
)

// Encadrant represents a supervisor

type Encadrant struct {
	ID              uint           `gorm:"primaryKey;autoIncrement" json:"id"`
	Nom             string         `gorm:"not null;size:100" json:"nom"`
	Prenom          string         `gorm:"not null;size:100" json:"prenom"`
	Numero          string         `gorm:"size:50" json:"numero"`
	AdresseCourrier string         `gorm:"size:255" json:"adresse_courrier"`
	Ecole           string         `gorm:"size:200" json:"ecole"`
	CreatedAt       time.Time      `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt       time.Time      `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt       gorm.DeletedAt `gorm:"index" json:"-"`

	// Relations
	Stages []Stage `gorm:"foreignKey:IDEncadrant" json:"stages,omitempty"`
}

func (Encadrant) TableName() string {
	return "encadrants"
}
