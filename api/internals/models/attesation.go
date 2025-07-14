package models

import (
	"gorm.io/gorm"
	"time"
)

// Attestation represents internship certificates
type Attestation struct {
	ID            uint           `gorm:"primaryKey;autoIncrement" json:"id"`
	Numero        string         `gorm:"unique;not null;size:50" json:"numero"`
	DateEmission  time.Time      `gorm:"not null" json:"date_emission"`
	Contenu       string         `gorm:"type:text" json:"contenu"`
	CheminFichier string         `gorm:"size:255" json:"chemin_fichier"`
	IDStage       uint           `gorm:"not null;index" json:"id_stage"`
	CreatedAt     time.Time      `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt     time.Time      `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt     gorm.DeletedAt `gorm:"index" json:"-"`

	// Relations
	Stage Stage `gorm:"foreignKey:IDStage" json:"stage,omitempty"`
}

func (Attestation) TableName() string { return "attestations" }
