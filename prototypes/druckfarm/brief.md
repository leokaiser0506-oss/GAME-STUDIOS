# Game Brief: Druckfarm

## In your words
ich möchte ein robloc spiel bauen unzaw mit der idee ein 3d drucker business tycoon also man starten mit einem 3d drucker verkauft die sachen und kauft damit mehr 3d drucker und bessere druck sachen

Kniffe: filament als ressource und druckfehler/wartungen und weg a

1-6: alles üblich
7. Ziel: endlos würde ich sagen ?

After play: grundprizip sehr gut. im laufe mehrere verbesserungen nötig. man muss im roblox rumlaufen können und alles ich würde bei jedem drucker einzelt das mit filament kaufen und wartungen machen. dazu wird es irgenwann langweilig blöd durchgehend auf wartungen und pipapo zudrücken also im laufe des spieles muss es irgendein ein upgrade zur automatiesirung für einzelnde drucker geben und das mit dem lager man muss die sachen verpacken und noch verschicken aber im schnell ablauf also wenig klicken alle sachen im lager gleichzeitig und alles so das es später auch auf roblox direkt gehen kann
After play: Laufen im Prototyp (Empfohlen)
After play: Fehler beheben ich konnte die 13 pakete nicht verpacken und versanden klick mit E nicht funktioniert
After play: Überarbeite Druckfarm-v2-laufen.html zu v3 [dann: v3 zu v4]. Behalte alles aus v2 bei (Laufen, Prompts, Spule pro Drucker, Automatisierung, Lager/Packen/Versand, Roblox-Kommentare, CONFIG-Struktur, rng(), window.game). Ändere nur Folgendes: 1. FEHLER BEHEBEN - Wartungs-Roboter: Prüfe VOR jedem Druckstart, ob wear + (Verschleiß des nächsten Drucks) > auto_maint_at ist. Wenn ja, zuerst warten, dann drucken. Ziel: Ein Drucker mit Roboter verstopft nie, auch nicht beim Helm auf einem Industrie-Drucker. - Roboter-Wartungen im Ledger immer als „Roboter-Wartung" anzeigen (eigenes Flag statt maintQueued). - canAct(): Teile im Lager zählen nur dann als möglich, wenn das Geld für mindestens 1 Karton reicht. 2. BALANCE (nur CONFIG-Werte und Formeln) - Billig-PLA: druckt schneller (neuer Wert fil_cheap_speed = 1.3), Fehlerquote bleibt hoch. Ziel: Bei Objekten der Stufe 0 bringt Billig-PLA pro Sekunde etwa gleich viel wie PLA+, nur mit mehr Schwankung. - Objekte der Stufen 1 und 2 so einstellen, dass sich €/s auf dem passenden Drucker mit dem besten Filament um höchstens ±15 % unterscheiden. Die Drohne darf nicht mehr klar am besten sein. - Wartungs-Roboter: Jede Roboter-Wartung kostet ×1,5 (neuer Wert auto_maint_cost_mult). - Miete: rent_growth auf 1.03 senken. Den Druck in der Spielmitte erzeugen stattdessen die Kundenaufträge (Punkt 3). 3. KUNDENAUFTRÄGE (neue Mechanik, Handarbeit auch im späten Spiel) - Neue Station „Auftragsbrett" an der Wand. Dort hängen immer 3 Aufträge, z. B. „6× Drache aus PETG bis Tagesende". - Annehmen mit E. Passende Teile werden im Lager reserviert. - Abgeben: Der Spieler geht selbst mit der Lieferung zum Versandtor, E = Auftrag ausliefern. Belohnung ×1,6 auf den Normalpreis. - Läuft die Frist ab, ohne dass geliefert wurde: Strafe 20 % des Auftragswerts. - Der Auto-Versand verschickt KEINE Auftragsteile. Aufträge bleiben Handarbeit. - Größe und Belohnung der Aufträge wachsen mit den freigeschalteten Stufen. Alle Werte in CONFIG. 4. SPEICHERN - Zusätzlich alle 30 s speichern (save_every in CONFIG). 5. HANDY / ROBLOX - Virtueller Joystick unten links und großer Aktionsknopf unten rechts, wenn das Gerät Touch hat. - Zoom übers Mausrad entfernen, die Kamera folgt fest der Spielfigur. - Das Drucker-Panel aufteilen: Standardmäßig nur Start/Stopp, Filament, Wartung. Bauplan, Sorte, Upgrade und Automatisierung hinter einem Knopf „Mehr…". TEST: Simuliere über window.game mit ?seed=1 einen Bot, der 25 Minuten vernünftig spielt (kauft Drucker, automatisiert sobald möglich, nimmt Aufträge an). Gib aus: - Minute, in der die erste Automatisierung gekauft wird - Anzahl Verstopfungen bei Druckern mit Roboter (Soll: 0) - €/s für jede Kombination aus Objekt, Filament und Druckerstufe - Aktionen pro Minute in Minute 5, 15 und 25 - Ab welcher Minute alles automatisiert ist und wie viele Aufträge danach noch manuell anfallen
After play: brauche neue v4 datei
After play: Überarbeite Druckfarm-v4.html zu v5. Behalte alles aus v4 bei. Ändere nur: 1. DROHNE: obj_drone_price 130 -> 210 (Ziel: Drohne mit Resin auf Industrie ca. +9 % €/s gegenüber Zahnrad/Helm). 2. KEINE LÖSCHUNG BEI PLEITE - Kein Game Over und kein clearSave mehr. Statt "zweimal im Minus = Pleite": Ist das Geld am Tagesende negativ, nimmt man automatisch einen Bankkredit (Schulden, 10 % Zinsen pro Tag), der von Einnahmen zuerst abbezahlt wird. Anzeige im HUD. - Käufe, nach denen das Geld unter die heutige Miete fällt, zeigen eine Warnung ("Miete in X s: Y €") und brauchen einen zweiten Druck auf die Taste. 3. UPGRADE VORMERKEN - U während des Drucks merkt das Upgrade vor (wie Wartung). Es wird nach dem aktuellen Druck automatisch ausgeführt und bezahlt. 4. NEUER DRUCKER MIT START-SPULE - Ein gekaufter Drucker bekommt 1 Pack Billig-PLA geschenkt (start_spool_new in CONFIG). 5. AUFTRÄGE - Frist abhängig von der Arbeit: order_time = order_time_base (45 s) + n × Druckzeit des Objekts auf der besten eigenen Druckerstufe × order_time_factor (0,8). Bei 1 Drucker darf der Faktor nicht unter 1,0 liegen. - Am Drucker eine Taste/Prompt "Für Auftrag drucken": stellt Objekt und Filament auf den ältesten offenen Auftrag um und nach Erfüllung automatisch auf den vorherigen Job zurück. - Filamentwechsel wirft die Spule nicht mehr weg: der Rest geht als "angebrochene Spule" ins Lager und wird beim Zurückwechseln wieder eingelegt. - Damit das späte Spiel nicht nur aus gleichen Aufträgen besteht: 1 von 4 Aufträgen ist ein Sonderauftrag (z. B. gemischt "3 Drachen + 3 Zahnräder", oder Eilauftrag mit halber Frist und ×2,2 Lohn). 6. MITTE DES SPIELS ENTLASTEN - Neues Upgrade vor dem Auto-Versand: "Packautomat" (400 €) packt alles im Regal automatisch, Verschicken bleibt Handarbeit. Der Auto-Versand (1.200 €) übernimmt dann nur noch das Verschicken. 7. KAMERA UND LAUFEN - cam_zoom 1.45 -> 1.15. - Pfeile am Bildrand, die auf Probleme außerhalb des Bildes zeigen (verstopft, Lager voll, Auftrag fertig, Frist < 30 s). - Klick/Tippen zum Hinlaufen mit einfacher Wegfindung (Gitter-BFS um die Hindernisse), damit die Figur nicht an Tischen und Werkbänken hängen bleibt. - Am Auftragsbrett das Prompt-Fenster unter die Zettel setzen, nicht darüber. TEST mit ?seed=1 und ?seed=2, je 35 Minuten, Bot mit Wegfindung, der Aufträge annimmt: - Minute des 2. Druckers, der ersten Automatisierung, des ersten Pro-Upgrades, des Auto-Versands - Aufträge erfüllt/verpasst getrennt nach Druckerstufe - Aktionen pro Minute je Minute - Anzahl Tage mit Kredit - €/s-Tabelle für alle Kombinationen aus Objekt, Filament und Druckerstufe

**Pitch:** Starte in einer Garage mit einem wackeligen 3D-Drucker, kauf Filament, drucke und verkauf Teile, und bau daraus eine Druckfarm, bevor dir verstopfte Düsen und leere Spulen das Geld auffressen.

**Genre:** Management-Tycoon

**Controls:** WASD/Pfeile laufen (Klick auf den Boden läuft hin); am Drucker E Start/Stopp, F Filament nachfüllen, R Wartung/Reparieren, Q Filamentsorte, T Auftrag, U Upgrade (Rest unter „Mehr …“); an Stationen E (verpacken, verschicken, Regal erweitern, Drucker kaufen); am Auftragsbrett E/F/R = Auftrag 1/2/3 annehmen; am Drucker G = für den Auftrag drucken, U = Upgrade (während des Drucks vorgemerkt); im Lager F = fertigen Auftrag mitnehmen, am Versandtor E = ausliefern; Touch: Joystick links, Aktionsknopf rechts; Kamera folgt der Figur

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
- Keine Pleite mehr (seit v5): fehlt am Tagesende Geld, gibt die Bank Kredit (10 % Zinsen pro Tag), Einnahmen tilgen zuerst; geht gar nichts mehr, gibt es einen Notkredit für eine Filament-Packung

## Features
- [x] 1 Drucker zum Start, platzierbare weitere Drucker auf einem Raster (Vorschau + Preis), max. 8 Plätze
- [x] 3 Druckerstufen (Starter, Pro, Industrie): Tempo, Verschleiß, welche Filamente sie können
- [x] 3 Filamentsorten (Billig-PLA, PLA+, PETG; Resin später freischaltbar) mit Preis, Fehldruckchance und Wertbonus, gekauft pro Drucker
- [x] 5-6 Druckobjekte, die man freischaltet (Schlüsselanhänger, Handyhalter, Figur, Ersatzteil, Helm ...)
- [x] Verschleiß, Wartung (billig, vorbeugend), Verstopfung (teure Reparatur), Fehldruck (Filament verloren)
- [x] Einnahmen und Ausgaben sichtbar mit Herkunft; Geld kommt mit dem Lieferwagen zurück
- [x] Meilensteine Jetzt / Nächstes / Groß mit „fast geschafft“-Anzeige und Feier beim Erreichen
- [x] Tageszusammenfassung (verdient / ausgegeben) alle paar Minuten, Spielstand im Browser gespeichert
- [x] Pleite-Bildschirm und Neustart (seit v5 ersetzt durch Bankkredit)
- [x] Spielfigur läuft mit WASD durch die Werkstatt, Aktionen per Taste am Drucker/an der Station (wie Roblox-ProximityPrompts)
- [x] Jeder Drucker hat seine eigene Spule: Filament wird am Drucker gekauft und eingelegt
- [x] Automatisierung pro Drucker: Wartungs-Roboter und Filament-Zuführung
- [x] Lager-Regal mit Platzgrenze, Packtisch (alles auf einmal verpacken), Versandtor mit Lieferwagen (alles auf einmal verschicken), Auto-Versand als Upgrade
- [x] Auftragsbrett: 3 Kundenaufträge, annehmen, Teile werden reserviert, selbst zum Versandtor tragen, Lohn ×1,6, verpasste Frist −20 %
- [x] Wartungs-Roboter prüft vor jedem Druck und verstopft nie; Roboter-Wartung kostet ×1,5
- [x] Touch: Joystick und Aktionsknopf; Kamera folgt fest der Figur; Drucker-Panel mit „Mehr …“
- [x] Speichern alle 30 s und am Tagesende
- [x] Bankkredit statt Pleite, Warnung bei Käufen unter die Tagesmiete (zweiter Druck kauft)
- [x] Upgrade vormerken während des Drucks; neuer Drucker mit 1 Pack Billig-PLA
- [x] Auftragsfrist aus der Druckzeit; G = für Auftrag drucken (danach zurück); angebrochene Spulen ins Lager; jeder 4. Auftrag gemischt oder eilig
- [x] Packautomat (400 €) vor dem Auto-Versand (1.200 €, nur Verschicken)
- [x] Kamera-Zoom 1,15, Randpfeile zu Problemen, Klick-Laufen mit Wegfindung, Prompt am Brett unter den Zetteln

## Your systems
- Laufen durch die Werkstatt (wie in Roblox) · in the slice
- Filament pro Drucker kaufen und Wartung pro Drucker · in the slice
- Automatisierung pro Drucker als Upgrade · in the slice
- Lager: verpacken und verschicken, alles auf einmal · in the slice
- Kundenaufträge am Auftragsbrett (Handarbeit, nie per Auto-Versand) · in the slice
- Handy-Steuerung (Joystick + Aktionsknopf) · in the slice
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
