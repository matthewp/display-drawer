const template = `
  <style>
    :host {
      display: block;
    }

    :host([no-divider]) hr {
      display: none;
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
      margin-top: calc(var(--drawer-margin) - 0.7em);
      z-index: 1;
      background-color: inherit;
    }

    :host([no-divider]) .drawer {
      padding-top: 10px;
      margin-top: calc(var(--drawer-margin) - 1px);
    }

    .drawer.mounted {
      transition: margin-top .25s ease-out;
    }

    .drawer.open {
      margin-top: 0;
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
    this._updateHeight = this._updateHeight.bind(this);
  }

  connectedCallback() {
    this._setup();
    this._button.addEventListener('click', this);
    this._mo = new MutationObserver(this._updateHeight);
    this._mo.observe(this, { childList: true, subtree: true });
  }

  disconnectedCallback() {
    this._button.removeEventListener('click', this);
    this._mo.disconnect();
  }

  attributeChangedCallback(_, __, newVal) {
    let shouldDispatch = this._hasSetup;
    this._setup();
    let isOpen = newVal != null;
    this._moveDrawer(isOpen);

    if(shouldDispatch) {
      this.dispatchEvent(new CustomEvent(isOpen ? 'open' : 'close', {
        bubbles: true,
        detail: isOpen
      }));
    }
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
    this._button.classList[fnName]('open');
    this._drawer.classList[fnName]('open');
    this._setMargin();
  }

  _setup() {
    if(!this._hasSetup) {
      this._hasSetup = true;
      let el = this.querySelector('[slot=unselected]');
      
      this.shadowRoot.innerHTML = template;
    
      let root = this.shadowRoot;
      this._button = root.querySelector('button');
      this._drawer = root.querySelector('.drawer');
      this._setHeight();
      this._setMargin();

      setTimeout(() => {
        this._drawer.classList.add('mounted');
      }, 200);
    }
  }

  _updateHeight() {
    this._setHeight();
    this._setMargin();
  }

  _setHeight() {
    this._drawerHeight = '-' + this._drawer.offsetHeight + 'px';
  }

  _setMargin() {
    this._drawer.style.setProperty('--drawer-margin', this._drawerHeight);
  }
}

customElements.define('display-drawer', DisplayDrawer);