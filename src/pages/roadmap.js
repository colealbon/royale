var roadmapPartial = require("raw-loader!../../views/partials/roadmap.html");
export class RoadmapPage extends HTMLElement {
    attachedCallback() {
        this.innerHTML = '<p>' + roadmapPartial + '</p>';
    }
}
document.registerElement("roadmap-page", RoadmapPage);
