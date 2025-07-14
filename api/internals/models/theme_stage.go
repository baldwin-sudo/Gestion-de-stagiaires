package models

import (
	"gorm.io/gorm"
	"time"
)

// ThemeDeStage represents internship themes/offers
type ThemeDeStage struct {
	ID            uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	Sujet         string    `gorm:"not null;size:255" json:"sujet"`
	Departement   string    `gorm:"size:100" json:"departement"`
	Type          string    `gorm:"size:50" json:"type"` // "ple/pfe" or other types
	Description   string    `gorm:"type:text" json:"description"`
	Prerequisites string    `gorm:"type:text" json:"prerequisites"`
	DateDebut     time.Time `gorm:"type:date" json:"date_debut"`
	DateFin       time.Time `gorm:"type:date" json:"date_fin"`

	Duree     int            `gorm:"not null" json:"duree"` // Duration in days/weeks
	EstActif  bool           `gorm:"default:true" json:"est_actif"`
	CreatedAt time.Time      `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt time.Time      `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

func (ThemeDeStage) TableName() string {
	return "themes_de_stage"
}
