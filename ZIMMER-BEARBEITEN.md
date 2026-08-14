# Zimmerdaten bearbeiten

Preise, Balkon-Kennzeichnung und Status-Hinweise der Zimmer stehen in der Datei
**`docs/zimmer.json`**. Änderungen daran erscheinen nach 1–2 Minuten automatisch
auf der Live-Seite (`/zimmer.html`).

## So geht's (direkt auf GitHub, ohne Programme)

1. Datei öffnen: **`docs/zimmer.json`** im GitHub-Repository.
2. Rechts oben auf das **Stift-Symbol** („Edit this file") klicken.
3. Den gewünschten Wert ändern (siehe unten).
4. Unten auf **„Commit changes"** klicken.
5. Fertig – die Seite baut sich automatisch neu.

## Was darf geändert werden?

Jedes Zimmer sieht so aus:

```json
{
  "name": "Wien",
  "size": 23,
  "price": 430,
  "balkon": true,
  "hinweis": "",
  "photos": [ ... ]
}
```

| Feld | Bedeutung | Beispiele |
|------|-----------|-----------|
| `price` | Miete in Euro pro Monat | `430` &nbsp;·&nbsp; `null` = „auf Anfrage" |
| `balkon` | zeigt den Balkon-Tag an | `true` oder `false` |
| `hinweis` | kleines Abzeichen auf dem Foto | `"Frei ab Sept. 2026"`, `"Reserviert"`, `"Belegt"` &nbsp;·&nbsp; `""` = kein Abzeichen |
| `size` | Größe in m² | `23` |
| `photos` | Bildliste (nur bei neuen Fotos ändern) | — |

## Wichtig (sonst bricht die Seite)

- Texte immer in **geraden Anführungszeichen**: `"Reserviert"` (nicht „…").
- Zahlen **ohne** Anführungszeichen: `430`. `null` ebenfalls ohne.
- Zwischen den Einträgen steht ein **Komma**, nach dem **letzten** Eintrag **kein** Komma.
- Im Zweifel vor dem Commit auf <https://jsonlint.com> prüfen (Inhalt reinkopieren → „Validate JSON").

Die Erklärungen stehen auch nochmal im Feld `_hinweise` oben in der Datei selbst.
