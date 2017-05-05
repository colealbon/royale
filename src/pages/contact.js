let contactPartial = require("raw-loader!../../views/partials/contact.html");
export class ContactPage extends HTMLElement {
    attachedCallback() {
        this.innerHTML = '<p>' + contactPartial + '</p>';
    }
}
document.registerElement("contact-page", ContactPage);
