package models

import (
	"gorm.io/gorm"
	"time"
)

// Presence represents daily attendance
type Presence struct {
	ID          uint           `gorm:"primaryKey;autoIncrement" json:"id"`
	Date        time.Time      `gorm:"not null;index" json:"date"`
	Statut      string         `gorm:"size:20;default:'present'" json:"statut"` // "present", "absent", "retard"
	Notes       string         `gorm:"type:text" json:"notes"`
	IDStage     uint           `gorm:"not null;index" json:"id_stage"`
	IDStagiaire uint           `gorm:"not null;index" json:"id_stagiaire"`
	CreatedAt   time.Time      `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt   time.Time      `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`

	// Relations
	Stage     Stage     `gorm:"foreignKey:IDStage" json:"-"`
	Stagiaire Stagiaire `gorm:"foreignKey:IDStagiaire" json:"-"`
}

func (Presence) TableName() string {
	return "presences"
}
