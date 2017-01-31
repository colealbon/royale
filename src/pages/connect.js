var connectPartial = require("raw-loader!../../views/partials/connect.html");
export class ConnectPage extends HTMLElement {
    attachedCallback() {
        this.innerHTML = '<p>' + connectPartial + '</p>';
    }
}
document.registerElement("connect-page", ConnectPage);
