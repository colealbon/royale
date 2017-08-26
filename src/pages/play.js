var feltPartial = require("raw-loader!../../views/partials/felt.html");

export class PlayPage extends HTMLElement {
    attachedCallback() {
        this.innerHTML = '<p>' + feltPartial + '</p>';
    }
}

document.registerElement("play-page", PlayPage);
