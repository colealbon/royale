var feltPartial = require("raw-loader!../../views/partials/felt.html");

export class PlayPage extends HTMLElement {
    attachedCallback() {
        this.innerHTML = '<p>' + feltPartial + '</p>';
    }
}

document.registerElement("play-page", PlayPage);
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
