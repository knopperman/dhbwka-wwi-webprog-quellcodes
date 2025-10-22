const DATABASE     = "Picasso.ai";
const VERSION      = 1;
const STORE_IMAGES = "Images";

/**
 * Minimale Klasse zur Persistierung der Anwendungsdaten in der IndexedDB des Browsers.
 * Diese wurde gewählt, da die Bilder ziemlich groß sind und der wesentliche einfacher
 * zu nutzende Local Storage eine Obergrenze von 5 MB besitzt, die es bei IndexedDB
 * nicht gibt.
 * 
 * Der Begriff "Store" soll dabei entsprechend demselben Begriff in vielen Frameworks
 * andeuten, dass es sich hierbei um globale Anwendungsdaten handelt, die an vielen
 * Stellen gelesen und geschrieben werden.
 */
class ImageStore {
    /**
     * Initialisieren der Indexed DB
     */
    constructor() {
        this.db = null;
    }

    /**
     * Öffne Datenbankverbindung
     */
    async open() {
        this.db = await new Promise((resolve, reject) => {
            let dbRequest = window.indexedDB.open(DATABASE, VERSION);
            dbRequest.onsuccess = event => resolve(event.target.result);
            dbRequest.onerror = event => reject(event.target.error);

            dbRequest.onupgradeneeded = event => {
                let db = event.target.result;

                if (!db.objectStoreNames.contains(STORE_IMAGES)) {
                    db.createObjectStore(STORE_IMAGES, {
                        keyPath: "id",
                        autoIncrement: true,
                    });
                }
            };
        });
    }

    /**
     * @returns Alle Bilder
     */
    async getAllImages() {
        return new Promise((resolve, reject) => {
            let tx    = this.db.transaction(STORE_IMAGES, "readonly");
            let store = tx.objectStore(STORE_IMAGES);

            let dbRequest = store.getAll();
            dbRequest.onsuccess = () => resolve(dbRequest.result);
            dbRequest.onerror   = () => reject(dbRequest.error);
            tx.onabort          = () => reject(tx.error);
        });
    }

    /**
     * Zugriff auf die Detaildaten eines einzelnen Bilds.
     * 
     * @param {number} id Bild-Id
     * @returns Das gesuchte Bild oder `undefined`
     */
    async getImage(id) {
        return new Promise((resolve, reject) => {
            let tx    = this.db.transaction(STORE_IMAGES, "readonly");
            let store = tx.objectStore(STORE_IMAGES);

            let dbRequest = store.get(id);
            dbRequest.onsuccess = () => resolve(dbRequest.result);
            dbRequest.onerror   = () => reject(dbRequest.error);
            tx.onabort          = () => reject(tx.error);
        });
    }

    /**
     * Hinzufügen und Speichern eines neuen Bilds.
     * 
     * @param {string} title Bildtitel
     * @param {string} description Beschreibung
     * @param {string} url URL der Bilddatei
     * @returns Id des neuen Eintrags
     */
    async insertImage(title, description, url) {
        return new Promise((resolve, reject) => {
            let tx    = this.db.transaction(STORE_IMAGES, "readwrite");
            let store = tx.objectStore(STORE_IMAGES);

            let dbRequest = store.add({title, description, url});
            dbRequest.onsuccess = () => resolve(dbRequest.result);
            dbRequest.onerror   = () => reject(dbRequest.error);
            tx.onabort          = () => reject(tx.error);
        });
    }
}

// TODO: Neues Objekt `imageStore` erzeugen und exportieren
// TODO: Datenbank öffnen