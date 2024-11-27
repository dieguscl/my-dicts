/* global api */
class enfr_Cambridge {
  constructor(options) {
    this.options = options;
    this.maxexample = 2;
    this.word = "";
  }

  async displayName() {
    return "Word Reference PT->ES Dictionary";
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

    tags = elem.querySelectorAll("span");
    tags.forEach((x) => {
      x.outerHTML = `<div class='span ${x.className}'>${x.innerHTML}</div>`;
    });
  }
  async findWordReference(word) {
    if (!word) return null;

    let base = "https://www.wordreference.com/ptes/";
    let url = base + encodeURIComponent(word);
    let doc = "";
    try {
      let data = await api.fetch(url);
      let parser = new DOMParser();
      doc = parser.parseFromString(data, "text/html");
    } catch (err) {
      return null;
    }

    let contents = doc.querySelectorAll("#otherDicts") || [];
    if (contents.length == 0) return null;

    let definition = "";
    for (const content of contents) {
      this.removeTags(content, ".small1");
      this.removeTags(content, ".supr1");
      this.removelinks(content);
      definition += content.innerHTML;
    }
    let css = this.renderCSS();
    return definition ? css + definition : null;
  }

  renderCSS() {
    let css = `
            <style>
            .b{font-size: 1.2em;font-weight:bold;}
            .span{display:inline-block}
            </style>`;

    return css;
  }
}

//.entry-body__el{margin-bottom:10px;}
