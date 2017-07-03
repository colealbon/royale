var freshDeckPartial = require("raw-loader!../../views/partials/freshdeck.html");

export class DeckPage extends HTMLElement {
    attachedCallback() {
        this.innerHTML = '<p>' + freshDeckPartial + '</p>';
    }
}
document.registerElement("deck-page", DeckPage);
