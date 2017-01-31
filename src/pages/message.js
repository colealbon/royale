var clientPubkeyFormPartial = require("raw-loader!../../views/partials/message_form.html");

export class MessagePage extends HTMLElement {
    attachedCallback() {
        this.innerHTML = `
            <p>${clientPubkeyFormPartial}</p>
        `
    }
}
document.registerElement("message-page", MessagePage);
