import {imageStore} from "../store.js";

/**
 * HTML-Element `<page-image>`: Details zu einem Bild
 * 
 * Diese Seite zeigt das Bild zusammen mit seinem Titel und seiner Beschreibung.
 */
class PageImage extends HTMLElement {
    /**
     * HTML-Element wurde der Seite hinzugefügt. Damit es sichtbar wird, wird
     * hier zusätzlicher HTML-Code als sein Inhalt erzeugt.
     */
    async connectedCallback() {
        let id    = parseInt(this.getAttribute("id"));
        let image = await imageStore.getImage(id);
        let md    = window.markdownit();

        if (!image) {
            this.innerHTML = "";
            return;
        }

        this.innerHTML = `
            <img src="${image.url}" alt="">

            <div>
                <h2>${image.title}</h2>
                ${md.render(image.description)}
            </div>
        `;
    }
}

customElements.define("page-image", PageImage);