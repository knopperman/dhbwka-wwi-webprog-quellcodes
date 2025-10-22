async function startApp() {
    let mainElement = document.querySelector("main");


    /**
     * Hilfsfunktion zum Umschalten des sichtbaren Inhalts
     *
     * @param {String} html Neuer HTML-Code im Hauptbereich der Seite
     * @param {String} title Neuer Titel für den Browser-Tab
     */
    function swapContent(html, title) {
        mainElement.innerHTML = html;
        document.title = `🖌️ ${title} | Lösung: Picasso.ai`;
    }

    // TODO: SPA-Router initialisieren und starten
}

if (document.readyState === "complete") await startApp();
else window.addEventListener("DOMContentLoaded", startApp);