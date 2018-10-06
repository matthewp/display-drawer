const template = `
  <style>
    :host {
      display: block;
    }

    .wrapper {
      background-color: inherit;
      overflow: hidden;
    }

    .counter {
      z-index: 2;
      position: relative;
      background-color: inherit;
    }

    button {
      border: 0;
      background: transparent;
      font-size: 100%;
      font-family: inherit;
      cursor: pointer;
      padding: 0.4em;
      width: 100%;

      display: flex;
      justify-content: space-between;
    }

    button:not(:focus-visible) {
      outline: none;
    }

    button .arrow {
      transition: 0.25s;
      transition-style: preserve-3d;
    }

    button .arrow:after {
      content: '⌃';
    }
  
    button.open .arrow {
      transform: rotateX(180deg);
    }

    .drawer {
      transition: transform .25s ease-out;
      transform: translate3d(0, calc(-100% - 0.7em), 0);
      z-index: 1;
      background-color: inherit;
    }

    .drawer.open {
      transform: translate3d(0, 0, 0);
    }

    hr {
      border: 3px solid #cfd3d7;
      margin: 0.7em 0;
    }
  </style>
  <div class="wrapper">
    <div class="counter">
      <button type="button">
        <slot name="header">Open</slot>
        <span class="arrow"></span>
      </button>
      <slot name="selected"></slot>
    </div>
    <div class="drawer">
      <hr />
      <slot name="unselected"></slot>
    </div>
  </div>
`.trim();

class DisplayDrawer extends HTMLElement {
  static get observedAttributes() {
    return ['open'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this._drawer = null;
    this._button = null;
  }

  connectedCallback() {
    this._setup();
    this._button.addEventListener('click', this);
  }

  attributeChangedCallback(attrName, oldValue, newVal) {
    this._setup();
    let isOpen = newVal != null;
    this._moveDrawer(isOpen);
  }

  handleEvent() {
    this.open = !this.open;
  }

  get open() {
    return this.hasAttribute('open');
  }

  set open(val) {
    let isOpen = !!val;
    if(isOpen) {
      this.setAttribute('open', '');
    } else {
      this.removeAttribute('open');
    }
  }

  _moveDrawer(isOpen) {
    let fnName = isOpen ? 'add' : 'remove';
    this._drawer.classList[fnName]('open');
    this._button.classList[fnName]('open');
  }

  _setup() {
    if(!this._hasSetup) {
      this._hasSetup = true;
      this.shadowRoot.innerHTML = template;
      
      let root = this.shadowRoot;
      this._button = root.querySelector('button');
      this._drawer = root.querySelector('.drawer');
    }
  }
}

customElements.define('display-drawer', DisplayDrawer);