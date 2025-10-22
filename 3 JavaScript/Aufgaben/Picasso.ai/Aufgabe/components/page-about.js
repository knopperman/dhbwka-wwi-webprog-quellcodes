/**
 * HTML-Element `<page-about>`: Informationen zur App
 */
class PageAbout extends HTMLElement {
    /**
     * HTML-Element wurde der Seite hinzugefügt. Damit es sichtbar wird, wird
     * hier zusätzlicher HTML-Code als sein Inhalt erzeugt.
     */
    connectedCallback() {
        // TODO: Informationen zu App anzeigen: Name, Backend-URL und API-Key
    }
}

customElements.define("page-about", PageAbout);