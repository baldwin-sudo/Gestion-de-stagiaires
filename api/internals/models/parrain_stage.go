package models

import (
	"gorm.io/gorm"
	"time"
)

// ParrainDeStage represents a mentor
type ParrainDeStage struct {
	ID          uint           `gorm:"primaryKey;autoIncrement" json:"id"`
	Nom         string         `gorm:"not null;size:100" json:"nom"`
	Prenom      string         `gorm:"not null;size:100" json:"prenom"`
	Departement string         `gorm:"size:100" json:"departement"`
	CreatedAt   time.Time      `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt   time.Time      `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}

func (ParrainDeStage) TableName() string {
	return "parrains_de_stage"
}
