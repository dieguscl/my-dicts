/* global api */
class ptes_Infopedia {
  constructor(options) {
    this.options = options;
    this.maxexample = 2;
    this.word = "";
  }

  async displayName() {
    return "Infopedia PT->ES Dictionary";
  }

  setOptions(options) {
    this.options = options;
    this.maxexample = options.maxexample;
  }

  async findTerm(word) {
    this.word = word;
    return await this.findWordReference(word);
  }

  removeTags(elem, name) {
    let tags = elem.querySelectorAll(name);
    tags.forEach((x) => {
      x.outerHTML = "";
    });
  }

  removelinks(elem) {
    let tags = elem.querySelectorAll("a");
    tags.forEach((x) => {
      x.outerHTML = x.innerText;
    });

    //tags = elem.querySelectorAll("span");
    //tags.forEach((x) => {
    //  x.outerHTML = `<div class='span ${x.className}'>${x.innerHTML}</div>`;
    //});
  }

  async findAudio(word) {
    let base = "https://www.howtopronounce.com/portuguese/";
    let url = base + encodeURIComponent(word);
    let doc = "";
    try {
      let data = await api.fetch(url);
      let parser = new DOMParser();
      doc = parser.parseFromString(data, "text/html");
    } catch (err) {
      return null;
    }

    let audioImg = doc.querySelector("#iconJs");
    let audio = audioImg.nextElementSibling.src;
    return audio;
  }

  async findWordReference(word) {
    if (!word) return null;

    let notes = [];

    let base = "https://www.infopedia.pt/dicionarios/portugues-espanhol/";
    let url = base + encodeURIComponent(word);
    let doc = "";
    try {
      let data = await api.fetch(url);
      let parser = new DOMParser();
      doc = parser.parseFromString(data, "text/html");
    } catch (err) {
      return null;
    }

    let contents = doc.querySelectorAll(".dolEntradaVverbete") || [];
    if (contents.length == 0) return null;

    let audio = await this.findAudio(word);

    let definition = "";
    for (const content of contents) {
      this.removeTags(content, ".dolLocucao");
      this.removeTags(content, ".dolVerbeteEntrinfo");
      this.removeTags(content, ".favorites");
      this.removeTags(content, ".conjugar");
      this.removeTags(content, ".dolVverbeteLexeger");
      this.removeTags(content, "img");
      this.removelinks(content);
      definition += content.innerHTML;
    }
    let css = this.renderCSS();

    definition += definition + audio;
    notes.push({
      css,
      definitions: [definition],
      audios: [audio],
    });
    return notes;
  }

  renderCSS() {
    let css = `
            <style>
            .dolCatgramTbcat{font-size: 1.1:em;font-weight:bold;}
            .dolAcepsRightCell{margin-left: 0.2rem;display: inline-block;}
            .dolAcepsNum{display: inline-block;}
            .dolAcepsRow{display: flex;}
            </style>`;

    return css;
  }
}
