import {streamChatMessage} from "../backend.js";
import {imageStore}        from "../store.js";

/**
 * HTML-Element `<page-start>`: Startseite
 * 
 * Diese zeigt eine Übersicht aller bereits vorhandenen Bilder sowie ein
 * Eingabefeld zum Erzeugen neuer Bilder.
 */
class PageStart extends HTMLElement {
    generating     = false;
    prompt         = "";
    answerMarkdown = "";
    answerHTML     = "";
    imageUrl       = "";
    md             = window.markdownit();

    /**
     * HTML-Element wurde der Seite hinzugefügt. Damit es sichtbar wird, wird
     * hier zusätzlicher HTML-Code als sein Inhalt erzeugt.
     */
    async connectedCallback() {
        if (!this.generating) {
            // TODO: Übersichtsdarstellung
        } else {
            // Fortschritt bei der Bildgenerierung
            // Spinner: https://pixabay.com/gifs/grey-loader-flower-spinner-path-20302/
            this.innerHTML = `
                <div id="generating" class="panel">
                    <h2>${this.prompt}</h2>
                    ${this.answerHTML}

                    <img src="img/spinner.gif" class="spinner" alt="Generiere …">
                </div>
            `;
        }
    }

    /**
     * Bildgenerierung bei Klick auf den Button starten.
     */
    async onGenerateClick() {
        let prompt = this.querySelector("input").value.trim();
        if (!prompt) return;

        this.generating     = true;
        this.prompt         = prompt;
        this.answerMarkdown = "";
        this.answerHTML     = "";
        this.imageUrl       = "";

        this.connectedCallback();

        await streamChatMessage(prompt, async event => {
            switch (event.event) {
                case "message":
                    // Weiteren Textschnippsel anzeigen
                    if (event.event !== "message") return;
        
                    this.answerMarkdown += event.answer || "";
                    this.answerMarkdown = this.answerMarkdown.replaceAll(/\!\[.*\)/g, "");   // Bild am Ende rausfiltern
                    this.answerHTML = this.md.render(this.answerMarkdown);
        
                    this.connectedCallback();
                    break;
                
                case "node_finished":
                    // Generiertes Bild herausfischen und herunterladen
                    if (event.data?.files?.[0]?.url) {
                        let imageUrl  = event.data?.files[0].url;
                        let response  = await fetch(imageUrl);
                        let imageData = await response.arrayBuffer();
                        let imageBlob = new Blob([imageData]);

                        this.imageUrl = await new Promise((resolve, reject) => {
                            let reader = new FileReader();
                            reader.onloadend = () => resolve(reader.result);
                            reader.onerror = reject;
                            reader.readAsDataURL(imageBlob);
                        });
                    }
                    
                    break;
                case "message_end":
                    // Am Ende der Antwort-Generierung die Bilddetails aufrufen
                    this.generating = false;

                    let index = await imageStore.insertImage(this.prompt, this.answerMarkdown, this.imageUrl);
                    location.href = `#/image/${index}`;
            }
        });
    }
}

customElements.define("page-start", PageStart);