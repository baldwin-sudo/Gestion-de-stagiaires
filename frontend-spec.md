
🎨 Color Palette 

Purpose Color Hex Code
Primary Blue  #1E3A8A (Dark Blue)
Light Blue (Sidebar hover/bg)  #3B82F6
Accent Green (Validate)  #10B981
Accent Red (Reject)  #EF4444
Text Black  #111827
Gray Background  #F3F4F6
Card Background  #FFFFFF

⸻

🔤 Font
 • Font Family: Likely Inter, Segoe UI, or Helvetica Neue (commonly used in modern dashboards).
 • You can use: font-family: 'Inter', sans-serif;

⸻

📐 Font Sizes (approximate px values)

Element Font Size Weight
Page Header (Demande de Stage) 24px 700 (bold)
Section Headings (e.g., “Stagiaire”, “Stage”) 18px 600
Labels (e.g., “Sujet”, “Durée”) 14px 500
Subtext / Details (e.g., email, dates) 13px 400–500

⸻

🧱 UI Recommendations (if you’re implementing)

:root {
  --primary-blue: #1E3A8A;
  --accent-blue: #3B82F6;
  --success-green: #10B981;
  --error-red: #EF4444;
  --text-color: #111827;
  --card-bg: #FFFFFF;
  --bg-color: #F3F4F6;
  --font-family: 'Inter', sans-serif;
}

body {
  font-family: var(--font-family);
  background-color: var(--bg-color);
  color: var(--text-color);
}

