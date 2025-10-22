/**
 * Chat-Anfrage an den Server schicken und die Antworten streamen. Der Server erzeugt
 * hier einen Event Stream nach dem Server-Side-Events-Prinzip, wobei jedes Event ein
 * JSON-Objekt beinhaltet:
 * 
 * ```
 * data: {"event": "workflow_started", …}
 * data: {"event": "node_started", …} 
 * data: {"event": "node_finished", …}
 * data: {"event": "workflow_finished", …}
 * data: {"event": "message", "answer": " I", …}
 * data: {"event": "message", "answer": "'m", …}
 * data: {"event": "message", "answer": " glad", …}
 * ```
 * 
 * Interessant sind hier vor allem die "message" Events. Die übergebene Callback-Funktion
 * wird jedoch für jedes Event aufgerufen und bekommt dabei die deserialisierten JSON-Daten
 * übergeben.
 * 
 * @param {string} message User-Nachricht
 * @param {Function} callback Event Handler
 */
export async function streamChatMessage(message, callback) {
    // POST-Anfrage schicken
    let response = await fetch(`${API.URL}/chat-messages`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${API.KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "inputs": {},
            "user":   "Picasso.ai",
            "query":  message,
            "response_mode": "streaming",
        }),
    });

    if (!response.ok) {
        let message = `Request failed: ${response.status} ${response.statusText}`;
        console.error(message);
        alert(message);

        return;
    }

    // Antwort als SSE Event Stream interpretieren
    let reader  = response.body.getReader();
    let decoder = new TextDecoder("utf-8");
    let buffer  = "";
    let index;

    while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, {stream: true});

        while ((index = buffer.indexOf("\n")) >= 0) {
            // Nächste vollständige Zeile verarbeiten und aus dem Puffer löschen
            let line = buffer.slice(0, index).trim();
            buffer = buffer.slice(index + 1);

            if (!line.startsWith("data:")) continue;

            let data = line.slice(5).trim();
            if (data === "" || data === "[DONE]") continue;

            try {
                const event = JSON.parse(data);
                await callback(event);
            } catch (err) {
                console.error(err);
                console.warn("Ungültiges JSON empfangen:", data);
            }
        }
    }

    if (buffer.trim()) {
        console.warn("Unvollständige Daten empfangen:", buffer);
    }
}