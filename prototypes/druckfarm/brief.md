# Game Brief: Druckfarm

## In your words
ich möchte ein robloc spiel bauen unzaw mit der idee ein 3d drucker business tycoon also man starten mit einem 3d drucker verkauft die sachen und kauft damit mehr 3d drucker und bessere druck sachen

Kniffe: filament als ressource und druckfehler/wartungen und weg a

1-6: alles üblich
7. Ziel: endlos würde ich sagen ?

After play: grundprizip sehr gut. im laufe mehrere verbesserungen nötig. man muss im roblox rumlaufen können und alles ich würde bei jedem drucker einzelt das mit filament kaufen und wartungen machen. dazu wird es irgenwann langweilig blöd durchgehend auf wartungen und pipapo zudrücken also im laufe des spieles muss es irgendein ein upgrade zur automatiesirung für einzelnde drucker geben und das mit dem lager man muss die sachen verpacken und noch verschicken aber im schnell ablauf also wenig klicken alle sachen im lager gleichzeitig und alles so das es später auch auf roblox direkt gehen kann
After play: Laufen im Prototyp (Empfohlen)

**Pitch:** Starte in einer Garage mit einem wackeligen 3D-Drucker, kauf Filament, drucke und verkauf Teile, und bau daraus eine Druckfarm, bevor dir verstopfte Düsen und leere Spulen das Geld auffressen.

**Genre:** Management-Tycoon

**Controls:** WASD/Pfeile laufen (Klick auf den Boden läuft hin); am Drucker E Start/Stopp, F Filament nachfüllen, R Wartung/Reparieren, Q Filamentsorte, T Auftrag, U Upgrade; an Stationen E (verpacken, verschicken, Regal erweitern, Drucker kaufen); Mausrad Zoom

**Question:** Macht der Loop aus Filament, Drucken, Verkaufen und Upgraden, zusammen mit dem Druck durch Fehler und Wartung, 15+ Minuten Spaß, und stimmt die Balance? *(inferred (strong))*

**Hooks:** Du läufst selbst durch die Werkstatt und versorgst jeden Drucker einzeln, bis du ihn automatisierst. Filament ist eine echte Ressource (Sorten mit Qualität und Preis: billiges PLA verursacht mehr Fehldrucke, teures bringt mehr Verkaufswert). Drucker verschleißen, verstopfen und produzieren Fehldrucke, also musst du reparieren und warten.

**Intent:** no goal to reach *(you said)*

## Look and references
- Look: warme, aufgeräumte Werkstatt (Holzboden, Werkbänke, Lochwand mit Werkzeug). Gezeichnete Drucker mit Rahmen, Druckkopf und Bauplatte. Das Objekt wächst sichtbar Schicht für Schicht, Filamentspulen in ihrer Farbe hängen am Drucker. Farben: Holz- und Grautöne als Hintergrund, Grün = Geld und Erfolg, Orange = Warnung (Verschleiß), Rot = Verstopfung/Fehldruck, Spulenfarben als Akzente. Besonderheit: Ein verstopfter Drucker spuckt sichtbar „Spaghetti“ (Fadengewirr) aus. Jede Figur ist gezeichnet, kein Emoji, keine einfachen Kreise. *(provisional)*
- References: Roblox-Tycoons (wachsende Basis, Kaufknöpfe), Two Point Hospital (Probleme sieht man auf dem Boden) *(guessed)*
- View: 2.5D · Camera: schräg von oben (~50°), Werkstatt passt ins Fenster, Zoom *(provisional)*

## First minute
Du stehst vor Drucker #1. „Drück E“: Der Druck startet, das Teil wächst und fliegt ins Lager-Regal. Nach drei, vier Teilen ist die Spule leer. Der Hinweis schickt dich zum Packtisch (E: alles verpacken) und zum Versandtor (E: alles verschicken). Der Lieferwagen fährt los und bringt das Geld. Dann wieder zum Drucker: F füllt Filament nach. Das erste Ziel ist die erste Lieferung, das nächste der zweite Drucker.

(Erster Stand vor dem Spielen:) Ein Drucker steht da, eine Spule PLA ist eingelegt, 50 € in der Kasse. Ein blinkender Hinweis auf „Schlüsselanhänger drucken“: Klick, und der Druckkopf fährt, das Teil wächst. Nach ca. 8 s ist es fertig und fliegt ins Verkaufsregal, +12 € steigen auf. Der zweite Druck läuft und die Spule wird sichtbar leerer. Dann kommt der Hinweis „Filament kaufen“: Billig oder gut? Etwa bei Sekunde 50 färbt sich der Drucker orange (Verschleiß). Ein Klick auf „Warten“ kostet ein bisschen und setzt ihn zurück. Das erste Ziel „Kauf deinen zweiten Drucker“ ist bei 60 %.

## Challenge
Ab ca. 3 Minuten wird es eng: Mehrere Drucker fressen schneller Filament als gedacht. Billiges Filament verursacht Fehldrucke, ignorierte Wartung führt zu Verstopfung (Spaghetti, der Drucker steht still, die Reparatur ist teurer als Wartung). Geld unter 0 bei leeren Spulen und stillstehenden Druckern bedeutet Pleite: Der Run endet und es geht von vorn los. Später: teurere Objekte brauchen bessere Drucker und Filamentsorten (PETG, Resin), und Verschleiß wächst mit dem Tempo. *(provisional)*

## Core loop
- Filament kaufen (Sorte wählen: billig und fehleranfällig oder teuer und wertvoller)
- Objekt wählen und drucken, das Teil wächst und verbraucht Filament, der Drucker verschleißt
- Verkaufen, Geld steigt, davon neue/bessere Drucker kaufen, neue Objekte freischalten, warten und reparieren
- Mehr Drucker bedeuten mehr Verbrauch und mehr Störungen, also den nächsten Engpass finden. Wiederholen, endlos. Bei Pleite startet ein neuer Run.

## Goal & fail state
- Kein Endziel (endlos). Meilensteine (Jetzt / Nächstes / Groß) geben immer ein nächstes Ziel *(you said / provisional)*
- Pleite: Geld reicht weder für Filament noch für Reparatur und kein Drucker kann laufen, dann ist der Run vorbei und man startet neu

## Features
- [x] 1 Drucker zum Start, platzierbare weitere Drucker auf einem Raster (Vorschau + Preis), max. 8 Plätze
- [x] 3 Druckerstufen (Starter, Pro, Industrie): Tempo, Verschleiß, welche Filamente sie können
- [x] 3 Filamentsorten (Billig-PLA, PLA+, PETG; Resin später freischaltbar) mit Preis, Fehldruckchance und Wertbonus, gekauft pro Drucker
- [x] 5-6 Druckobjekte, die man freischaltet (Schlüsselanhänger, Handyhalter, Figur, Ersatzteil, Helm ...)
- [x] Verschleiß, Wartung (billig, vorbeugend), Verstopfung (teure Reparatur), Fehldruck (Filament verloren)
- [x] Einnahmen und Ausgaben sichtbar mit Herkunft; Geld kommt mit dem Lieferwagen zurück
- [x] Meilensteine Jetzt / Nächstes / Groß mit „fast geschafft“-Anzeige und Feier beim Erreichen
- [x] Tageszusammenfassung (verdient / ausgegeben) alle paar Minuten, Spielstand im Browser gespeichert
- [x] Pleite-Bildschirm und Neustart
- [x] Spielfigur läuft mit WASD durch die Werkstatt, Aktionen per Taste am Drucker/an der Station (wie Roblox-ProximityPrompts)
- [x] Jeder Drucker hat seine eigene Spule: Filament wird am Drucker gekauft und eingelegt
- [x] Automatisierung pro Drucker: Wartungs-Roboter und Filament-Zuführung
- [x] Lager-Regal mit Platzgrenze, Packtisch (alles auf einmal verpacken), Versandtor mit Lieferwagen (alles auf einmal verschicken), Auto-Versand als Upgrade

## Your systems
- Laufen durch die Werkstatt (wie in Roblox) · in the slice
- Filament pro Drucker kaufen und Wartung pro Drucker · in the slice
- Automatisierung pro Drucker als Upgrade · in the slice
- Lager: verpacken und verschicken, alles auf einmal · in the slice
- Filament als Ressource · in the slice
- Druckfehler / Wartung · in the slice
- Mehr und bessere Drucker kaufen · in the slice
- Bessere Druckobjekte · in the slice

## Keep
- Grundprinzip (drucken, verkaufen, mehr und bessere Drucker, Filament, Wartung) *(you said)*

## Avoid
-

## Out of scope
- Forschungsbaum: grow it
- Mehrere Werkstätten / Standorte: grow it
- Langfristige Balance über Stunden: grow it
- Mehrere Währungen (z. B. Robux-artige Premiumwährung): add it as a feature
- Kredite: change it after play
- Roblox-Multiplayer und Tycoon-Plots: Im Browser wird es ein Einzelspieler-Prototyp. Multiplayer kommt beim Roblox-Port.

## Build order
1. Der Slice: Ein Drucker, Filament kaufen, drucken, verkaufen, Verschleiß, Wartung und Verstopfung, ein zweiter Drucker kaufbar, Meilensteine, Pleite
2. Druckerstufen, alle Filamentsorten, Objekte freischalten, Raster bis 8
3. Tageszusammenfassung, Speichern, Feinschliff (Sound, Effekte)

---
**Kill condition:** Wenn sich Wartung und Reparatur nach zwei Balance-Runden nur wie lästiges Klicken anfühlen und nicht wie eine Entscheidung *(guessed)*

**Who it's for / what they feel:** Roblox-Tycoon-Spieler; das Gefühl „meine Farm wächst und ich hab sie im Griff“ *(guessed)*

**Games you love / don't:** —
