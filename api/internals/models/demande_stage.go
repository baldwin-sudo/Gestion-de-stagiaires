package models

import (
	"gorm.io/gorm"
	"time"
)

type DemandeStage struct {
	ID            uint           `gorm:"primaryKey;autoIncrement" json:"id"`
	StatutDemande string         `gorm:"size:20;default:'en_attente'" json:"statut_demande"` // "en_attente", "validee", "rejetee"
	MotifRejet    string         `gorm:"type:text" json:"motif_rejet"`
	IDTheme       uint           `gorm:"not null;index" json:"id_theme"`
	IDStagiaire   uint           `gorm:"not null;index" json:"id_stagiaire"`
	IDParrain     uint           `gorm:"not null;index" json:"id_parrain"`
	CreatedAt     time.Time      `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt     time.Time      `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt     gorm.DeletedAt `gorm:"index" json:"-"`

	// Relations
	Parrain ParrainDeStage `gorm:"foreignKey:IDParrain" json:"parrain,omitempty"`

	Theme     ThemeDeStage `gorm:"foreignKey:IDTheme" json:"theme,omitempty"`
	Stagiaire Stagiaire    `gorm:"foreignKey:IDStagiaire" json:"stagiaire,omitempty"`
}

func (DemandeStage) TableName() string {
	return "demandes_stage"
}
