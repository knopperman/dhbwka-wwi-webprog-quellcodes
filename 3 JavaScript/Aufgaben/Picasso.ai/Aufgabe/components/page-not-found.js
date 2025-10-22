/**
 * HTML-Element `<page-not-found>`: Seite nicht gefunden
 */
class PageNotFound extends HTMLElement {
    /**
     * HTML-Element wurde der Seite hinzugefügt. Damit es sichtbar wird, wird
     * hier zusätzlicher HTML-Code als sein Inhalt erzeugt.
     */
    connectedCallback() {
        this.innerHTML = `<h1>Seite nicht gefunden …</h1>`;
    }
}

customElements.define("page-not-found", PageNotFound);