import {Router}     from "./router.js";
import {imageStore} from "./store.js";

// Import aller selbst-definierter HTML-Elemente
import "./components/page-about.js";
import "./components/page-image.js";
import "./components/page-not-found.js";
import "./components/page-start.js";

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

    /**
     * Navigation zur Detailseite eines Bilds, wenn es das Bild gibt.
     * Wenn das das Bild nicht gibt, wird die Not-Found Seite angezeigt.
     * 
     * @param {number} index Bilder-Nummer
     */
    async function gotoImage(id) {
        let image = await imageStore.getImage(id);

        if (image) {
            swapContent(`<page-image id="${id}"></page-image>`, image.title);
        } else {
            swapContent("<page-not-found></page-not-found>", "Bild nicht gefunden");
        }
    }

    /**
     * Konfiguration des URL-Routers
     */
    let router = new Router([
        {
            url: "^/$",
            show: () => swapContent("<page-start></page-start>", "Startseite"),
        },
        {
            url: "^/image/(.*)$",
            show: matches => gotoImage(parseInt(matches[1])),
        },
        {
            url: "^/about$",
            show: () => swapContent("<page-about></page-about>", "Informationen zur App"),
        },
        {
            url: ".*",
            show: () => swapContent("<page-not-found></page-not-found>", "Seite nicht gefunden"),
        }
    ]);

    await router.start();
}

if (document.readyState === "complete") await startApp();
else window.addEventListener("DOMContentLoaded", startApp);