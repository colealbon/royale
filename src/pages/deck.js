var freshDeckPartial = require("raw-loader!../../views/partials/freshdeck.html");

export class DeckPage extends HTMLElement {
    attachedCallback() {
        this.innerHTML = '<p>' + freshDeckPartial + '</p>';
    }
}
document.registerElement("deck-page", DeckPage);
document.registerElement('playing-card', {
    prototype: Object.create(HTMLElement.prototype, { createdCallback: {
            value: function() {
                  var root = this.createShadowRoot();
                  var template = document.querySelector('#' + this.textContent || '#█');
                  var clone = document.importNode(template.content, true);
                  var colorOverride = (this.querySelector('span')) ? this.querySelector('span').style.color: null; if (colorOverride) { clone.querySelector('svg').style.fill = this.querySelector('span').style.color; }; root.appendChild(clone);
            },
        }
    })
});
