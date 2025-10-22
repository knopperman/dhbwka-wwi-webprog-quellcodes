/**
 * HTML-Element `<page-about>`: Informationen zur App
 */
class PageAbout extends HTMLElement {
    /**
     * HTML-Element wurde der Seite hinzugefügt. Damit es sichtbar wird, wird
     * hier zusätzlicher HTML-Code als sein Inhalt erzeugt.
     */
    connectedCallback() {
        this.innerHTML = `
            <div>
                <h1>Picasso.ai</h1>
                <h2>KI-Bildgenerator mit Dify.ai-Backend</h2>

                <table>
                    <tr>
                        <td>Backend-URL:</td>
                        <td>${API.URL}</td>
                    </tr>
                    <tr>
                        <td>API-Key:</td>
                        <td>${API.KEY}</td>
                    </tr>
                </table>
            </div>
        `;
    }
}

customElements.define("page-about", PageAbout);