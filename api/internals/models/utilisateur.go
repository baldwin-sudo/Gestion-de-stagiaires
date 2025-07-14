package models

import (
	"time"

	"gorm.io/gorm"
)

// Utilisateur represents the base user entity
type Utilisateur struct {
	ID           uint           `gorm:"primaryKey;autoIncrement" json:"id"`
	Identifiant  string         `gorm:"unique;not null;size:50" json:"identifiant"`
	HashPassword string         `gorm:"not null;size:255" json:"-"`   // "-" excludes from JSON
	Role         string         `gorm:"not null;size:20" json:"role"` // "stagiaire" or "assistante"
	CreatedAt    time.Time      `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt    time.Time      `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"-"`
}

func (Utilisateur) TableName() string {
	return "utilisateurs"
}
