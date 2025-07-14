package models

import (
	"gorm.io/gorm"
	"time"
)

// Stagiaire represents an intern
type Stagiaire struct {
	ID            uint           `gorm:"primaryKey;autoIncrement" json:"id"`
	Nom           string         `gorm:"not null;size:100" json:"nom"`
	Prenom        string         `gorm:"not null;size:100" json:"prenom"`
	Ecole         string         `gorm:"size:200" json:"ecole"`
	Specialite    string         `gorm:"size:200" json:"specialite"`
	IDUtilisateur uint           `gorm:"not null;index" json:"id_utilisateur"`
	CreatedAt     time.Time      `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt     time.Time      `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt     gorm.DeletedAt `gorm:"index" json:"-"`

	// Relations
	Utilisateur Utilisateur `gorm:"foreignKey:IDUtilisateur" json:"-"`
}

func (Stagiaire) TableName() string {
	return "stagiaires"
}
