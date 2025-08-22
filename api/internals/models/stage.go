package models

import (
	"time"

)

// Stage represents an internship
type Stage struct {
	ID             uint           `gorm:"primaryKey;autoIncrement"`
	StatutStage    string
	DateValidation *time.Time

	IDParrain      uint
	Parrain        ParrainDeStage `gorm:"foreignKey:IDParrain"`

	IDEncadrant    uint
	Encadrant      Encadrant `gorm:"foreignKey:IDEncadrant"`

	IDAssistante   uint
	Assistante     AssistanteChargeStage `gorm:"foreignKey:IDAssistante"`

	IDDemandeStage uint
	DemandeStage   DemandeStage `gorm:"foreignKey:IDDemandeStage"`

	CreatedAt time.Time
	UpdatedAt time.Time
}

func (Stage) TableName() string {
	return "stages"
}
