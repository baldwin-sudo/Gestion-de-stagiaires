package models

import (
	"time"

	"gorm.io/gorm"
)

type DemandeStage struct {
	ID            uint           `gorm:"primaryKey;autoIncrement" json:"id"`
	StatutDemande string         `gorm:"size:20;default:'en_attente'" json:"statut_demande"`
	MotifRejet    string         `gorm:"type:text" json:"motif_rejet"`
	IDTheme       uint           `gorm:"not null;index" json:"id_theme"`
	IDStagiaire   uint           `gorm:"not null;index" json:"id_stagiaire"`
	CreatedAt     time.Time      `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt     time.Time      `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt     gorm.DeletedAt `gorm:"index" json:"-"`

	// ✅ Correct relationships
	Theme     ThemeDeStage `gorm:"foreignKey:IDTheme"`     // DemandeStage.IDTheme → ThemeDeStage.ID
	Stagiaire Stagiaire    `gorm:"foreignKey:IDStagiaire"` // DemandeStage.IDStagiaire → Stagiaire.ID
	Stage     *Stage       `gorm:"foreignKey:IDDemandeStage"` // Stage.IDDemandeStage → DemandeStage.ID
}
func (DemandeStage) TableName() string {
	return "demandes_stage"
}
