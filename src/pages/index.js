var indexPartial = require("raw-loader!../../views/partials/index.html");
export class IndexPage extends HTMLElement {
    attachedCallback() {
        this.innerHTML = `
        <p>${indexPartial}</p>
        `;
    }
}
document.registerElement("index-page", IndexPage);
