#!/usr/bin/env bash
# ==============================================================================
# deploy_release.sh - Build & Release Automation for Buchhaltungstrainer
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# 1. Determine version
if [ -f "package.json" ]; then
    VERSION_RAW=$(grep -m 1 '"version"' package.json | sed -E 's/.*"version": *"([^"]+)".*/\1/')
else
    VERSION_RAW="0.2.5"
fi

TAG="v${VERSION_RAW#v}"
DIST_DIR="$SCRIPT_DIR/dist"
ARCHIVE_NAME="buchhaltungstrainer-${TAG}.zip"
ARCHIVE_PATH="$DIST_DIR/$ARCHIVE_NAME"

echo "=================================================="
echo "📦 Buchhaltungstrainer Build & Release Tool"
echo "📌 Version: $TAG"
echo "=================================================="

# Function: Build distributable archive
build_archive() {
    echo "▶ Erstelle Distributions-Verzeichnis: $DIST_DIR ..."
    mkdir -p "$DIST_DIR"
    rm -f "$ARCHIVE_PATH"

    echo "▶ Führe Tests aus ..."
    if command -v node >/dev/null 2>&1; then
        node test-node.js
        node test-script.js
    fi

    echo "▶ Erstelle Release-Archiv: $ARCHIVE_NAME ..."
    zip -q -r "$ARCHIVE_PATH" \
        index.html \
        style.css \
        favicon.svg \
        bilanz.js \
        buchfuehrung.js \
        drag-drop-touch.js \
        inventar.js \
        inventur.js \
        script.js \
        stationenlernen.js \
        theorie.js \
        warenwirtschaft.js \
        start-server.command \
        README.md \
        LICENSE \
        package.json \
        wrangler.toml \
        obsidian_copy.md

    echo "✅ Release-Archiv erfolgreich erstellt: $ARCHIVE_PATH ($(du -h "$ARCHIVE_PATH" | cut -f1))"
}

# Function: Create GitHub Release
publish_github_release() {
    if ! command -v gh >/dev/null 2>&1; then
        echo "❌ Fehler: GitHub CLI ('gh') ist nicht installiert." >&2
        exit 1
    fi

    if [ ! -f "$ARCHIVE_PATH" ]; then
        build_archive
    fi

    echo "▶ Prüfe/Erstelle GitHub Release für Tag '$TAG' ..."
    if gh release view "$TAG" >/dev/null 2>&1; then
        echo "ℹ️ Release '$TAG' existiert bereits. Lade Asset hoch ..."
        gh release upload "$TAG" "$ARCHIVE_PATH" --clobber
    else
        echo "🚀 Erstelle neues GitHub Release '$TAG' ..."
        gh release create "$TAG" "$ARCHIVE_PATH" \
            --title "Buchhaltungstrainer $TAG" \
            --notes "### Buchhaltungstrainer & ERP-Simulator $TAG

- **Enterprise Pro Theme**: Neues, am SAP Fiori Horizon orientiertes Enterprise-Theme mit Shell-Bar.
- **Warenwirtschaft / ERP-Simulation**: Integrierte Disposition, Fertigung (BOM), Vertrieb und Anlagenmanagement mit linearer AfA.
- **Finanzbuchhaltung**: T-Konten, Journal, GuV und zusammengesetzte Buchungssätze.
- **Didaktisches Stufenkonzept**: 3 Niveaustufen (Anfänger, Fortgeschritten, Profi mit 19 % Vorsteuer/Umsatzsteuer).
- **Prüfungsmodus**: 5-Minuten-Challenge mit automatischem PDF-Leistungszertifikat."
    fi

    echo "🎉 GitHub Release abgeschlossen!"
}

# Function: Deploy to Cloudflare Workers
deploy_cloudflare() {
    echo "▶ Deploye zu Cloudflare Workers Static Assets ..."
    if command -v npx >/dev/null 2>&1; then
        npx wrangler deploy
    else
        echo "❌ Fehler: npx/wrangler nicht gefunden." >&2
        exit 1
    fi
}

# Argument handling
ACTION="${1:-build}"

case "$ACTION" in
    --build-only|build)
        build_archive
        ;;
    --release|release)
        build_archive
        publish_github_release
        ;;
    --deploy|deploy)
        deploy_cloudflare
        ;;
    --all|all)
        build_archive
        publish_github_release
        deploy_cloudflare
        ;;
    --help|-h)
        echo "Verwendung: $0 [OPTION]"
        echo ""
        echo "Optionen:"
        echo "  --build-only, build     Baut nur das Release-Zip-Archiv in dist/ (Standard)"
        echo "  --release, release      Baut das Archiv und erstellt ein GitHub Release mit gh"
        echo "  --deploy, deploy        Deployt die Anwendung via npx wrangler deploy"
        echo "  --all, all              Baut Archiv, erstellt Release und deployt"
        echo "  --help, -h              Zeigt diese Hilfe an"
        ;;
    *)
        echo "❌ Unbekannte Option: $ACTION"
        echo "Nutze '$0 --help' für weitere Informationen."
        exit 1
        ;;
esac
