# Scavenger 404 - Schnitzeljagd Mobile Application

## Projektübersicht

**Scavenger 404** ist das Abschlussprojekt des Moduls ÜK M335 "Mobile Applikation realisieren" der ICT Berufsbildung Zentralschweiz. Die innovative Schnitzeljagd-App nutzt native Gerätefunktionen für interaktive Aufgaben und demonstriert die praktische Anwendung von Ionic, Angular und Capacitor-Plugins.

**Repository**: https://github.com/HeiligerG/scavanger_404

## Design und Branding

### Farbschema
Die App verwendet eine konsistente **Light Indigo** Farbpalette für ein modernes und ansprechendes Design:

- **Primary**: `#6d5acf` (Hauptfarbe für Buttons und Akzente)
- **Secondary**: `#7c6bd4` (Sekundäre Aktionen)
- **Light**: `#8a7bd9` - `#b6ade7` (Backgrounds und Cards)
- **Accent**: `#c5bdec` - `#d3cef1` (Subtle Highlights)
- **Background**: `#e2def5` - `#f0effa` (App Hintergrund)
- **White**: `#ffffff` (Text und Kontraste)

### UI-Komponenten basierend auf Mockups
- **Dashboard**: Übersicht mit Previous Completions und Leaderboard
- **Task Cards**: Elegante Modal-Dialoge mit Aufgaben-Information
- **Progress Tracking**: Zeitanzeige und Belohnungssystem
- **Interactive Elements**: Swipe-Gesten und haptisches Feedback

## Technologie-Stack

- **Framework**: Ionic 7+
- **Frontend**: Angular 16+
- **Programmiersprache**: TypeScript
- **Native Funktionen**: Capacitor Plugins
- **UI-Komponenten**: Standard Ionic Components mit Custom Styling
- **Styling**: SCSS mit Indigo-Farbpalette
- **Build-Tools**: Angular CLI, Ionic CLI
- **Versionskontrolle**: Git Repository

## Implementierte Aufgaben (basierend auf Mockups)

### Task 1: Geolocation - "Go to!" ⚠️ (Pflichtaufgabe)
- **Funktion**: Navigation zu vorgegebenen Koordinaten (Migros Kriens Mattenhof)
- **Distanzverfolgung**: Anzeige der verbleibenden Entfernung (20m)
- **UI**: Destination Card mit Standortinformationen

### Task 2: Distance Tracking - "Walk 20 Meters!"
- **Funktion**: Zurücklegen einer bestimmten Strecke
- **Tracking**: Real-time Distanzmessung
- **UI**: Fortschrittsanzeige mit aktueller Distanz

### Task 3: QR-Code Scanner - "Scan the correct QR Code!" ⚠️ (Pflichtaufgabe)
- **Funktion**: QR-Code scannen und Inhaltsvergleich
- **Kamera-Integration**: "Activate Camera" Button
- **Validierung**: Überprüfung gegen vorgegebenen Inhalt

### Task 4: Sensor Integration - "Flip your Phone Over!"
- **Funktion**: Gerätebewegungen und Orientierung erkennen
- **UI**: Visuelle Anleitung mit umgedrehtem Text

### Task 5: Device Status - "Give your Phone Power!"
- **Funktion**: Stromverbindung erkennen
- **Status**: Überwachung der Ladezustand-Änderungen

### Task 6: WLAN Management - "Connect your Phone to the WLAN"
- **Funktion**: WLAN verbinden und trennen
- **UI**: Checkbox-Interface für Connect/Disconnect

## Kern-Features

### Spieler-Management
- **Dashboard**: Zentrale Übersicht mit Name-Eingabe
- **Start-Modal**: "START YOUR RUN" mit Namensfeld
- **Berechtigungen**: Location und Camera Permission Requests

### Aufgaben-System
- **Task Cards**: Elegante Modals mit "FINISH OF TASK" Bestätigung
- **Zeiterfassung**: "You took 1:30 min" Tracking pro Aufgabe
- **5:00 min Timer**: Maximale Zeit pro Aufgabe
- **Navigation**: "Lets go!" Buttons für Aufgaben-Fortsetzung

### Belohnungs- und Feedback-System
- **Schnitzel-System**: 🍖 für erfolgreich abgeschlossene Aufgaben
- **Kartoffel-Penalty**: 🗑️ bei Zeitüberschreitung
- **Results Screen**: "You did it!" mit Rewards-Anzeige (2x 🍖 3x 🗑️)
- **Haptisches Feedback**: Vibration bei Aufgaben-Abschluss

### Persistierung und Leaderboard
- **Dashboard Historie**: Liste der "Previous Completions"
- **Spieler-Scores**: Anzeige von Jürg Jüngster, Richi, Hans Peter, Max Muster
- **Persistierung**: Lokale Speicherung aller Durchläufe
- **Submit Button**: API-Integration für Online-Leaderboard

## Installation und Setup

### Voraussetzungen
```bash
node --version  # v24.x oder höher
npm --version   # v11.x oder höher
```

### Repository klonen
```bash
git clone https://github.com/HeiligerG/scavanger_404.git
cd scavanger_404
```

### Erforderliche Capacitor Plugins
```bash
npm install @capacitor/geolocation
npm install @capacitor/camera
npm install @capacitor/device
npm install @capacitor/network
npm install @capacitor/haptics
npm install @capacitor-community/barcode-scanner
npm install @capacitor/motion
```

### Installation und Start
```bash
# Dependencies installieren
npm install

# Ionic CLI installieren (falls nicht vorhanden)
npm install -g @ionic/cli

# Capacitor Setup
npx cap init
npx cap add android
npx cap add ios

# Entwicklungsserver starten
ionic serve
```

### Build und Deployment
```bash
# Produktions-Build mit Custom Styling
ionic build --prod

# Capacitor sync
npx cap sync

# Platform-spezifische Builds
npx cap open android
npx cap open ios
```

## Projektstruktur

```
src/
├── app/
│   ├── components/
│   │   ├── task-modal/       # Wiederverwendbare Task-Modals
│   │   ├── timer/           # 5:00 min Timer Component
│   │   └── reward-display/   # Schnitzel/Kartoffel Anzeige
│   ├── pages/
│   │   ├── dashboard/        # Hauptseite mit Start-Button
│   │   ├── tasks/
│   │   │   ├── geolocation/  # "Go to!" Task
│   │   │   ├── distance/     # "Walk 20 Meters!" Task
│   │   │   ├── qr-scanner/   # QR-Code Scanner
│   │   │   ├── sensor/       # Phone Flip Task
│   │   │   ├── power/        # Power Connection Task
│   │   │   └── wifi/         # WLAN Connect Task
│   │   ├── results/          # "You did it!" Ergebnis-Screen
│   │   └── leaderboard/      # Previous Completions Liste
│   ├── services/
│   │   ├── game.service.ts   # Spiellogik und State Management
│   │   ├── storage.service.ts # Lokale Persistierung
│   │   ├── permission.service.ts # Permission Handling
│   │   └── api.service.ts    # Leaderboard API
│   ├── models/
│   │   ├── task.model.ts     # Task Interface
│   │   ├── player.model.ts   # Player Interface
│   │   └── result.model.ts   # Results Interface
│   └── theme/
│       └── variables.scss    # Indigo Color Palette
└── assets/
    └── mockups/              # Original Mockup Screenshots
```

## Styling und Theming

### SCSS Variables (theme/variables.scss)
```scss
:root {
  --ion-color-primary: #6d5acf;
  --ion-color-primary-rgb: 109, 90, 207;
  --ion-color-primary-contrast: #ffffff;
  
  --ion-color-secondary: #7c6bd4;
  --ion-color-secondary-rgb: 124, 107, 212;
  
  --ion-color-light: #c5bdec;
  --ion-color-light-rgb: 197, 189, 236;
  
  --ion-background-color: #f0effa;
  --ion-background-color-rgb: 240, 239, 250;
}
```

## Testing und Qualitätssicherung

### Test-Coverage
- **Native Funktionen**: GPS, Kamera, Sensoren, Power Status, WLAN
- **UI-Flows**: Task-Modalitäten und Navigation
- **Persistierung**: Lokale Storage und API-Integration
- **Cross-Platform**: Android/iOS Kompatibilität

### Performance-Optimierung
- **Lazy Loading**: Aufgaben-spezifische Module
- **OnPush Change Detection**: Optimierte Render-Performance
- **Capacitor Plugin Caching**: Minimale Native Bridge Calls

## Entwicklungsteam

- **Repository Owner**: HeiligerG / Yannickict
- **Modul**: ÜK M335 - Mobile Applikation realisieren
- **Institution**: ICT Berufsbildung Zentralschweiz

## API-Integration

### Leaderboard-Endpoint
```typescript
interface ScavengerResult {
  playerName: string;
  schnitzelCount: number;
  kartoffelCount: number;
  totalDuration: number;
  completedTasks: string[];
  timestamp: Date;
}
```

### Submit-Function
```typescript
async submitResult(result: ScavengerResult): Promise<void> {
  // API Call zum Online-Leaderboard
  // Implementierung nach Mockup "Submit" Button
}
```

## Projektabschluss

**Scavenger 404** repräsentiert eine vollständige, moderne mobile Anwendung, die alle Anforderungen des M335 Moduls erfüllt. Die App demonstriert professionelle Mobile-Development-Practices mit einem ansprechenden Indigo-Design und nahtloser Integration nativer Gerätefunktionen.