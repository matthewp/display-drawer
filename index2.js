import { component, useEffect, useMemo, useState } from 'https://unpkg.com/@matthewp/haunted@1.6.1/haunted.js';
import { html } from 'https://unpkg.com/lit-html/lit-html.js';

function getDrawerTransform(height, open) {
  if(open) {
    return 'translate3d(0, 0, 0)';
  }
  let dem;
  if(height) {
    dem = '-' + height + 'px';
  } else {
    dem = '-100%';
  }
  return `translate3d(0, calc(${dem} - 0.7em), 0)`;
}

function SingleDrawer(el) {
  const { open: initialOpen } = el;
  const [open, setOpen] = useState(initialOpen);
  const [drawerHeight, setDrawerHeight] = useState(0);

  let drawerTransform = getDrawerTransform(drawerHeight, open);

  console.log("TRANS", drawerTransform);

  useEffect(() => {
    let drawer = el.shadowRoot.querySelector('.drawer');
    setDrawerHeight(drawer.offsetHeight);
  }, []);

  return html`
    <style>
      :host {
        display: block;
        background-color: inherit;
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
        <button type="button" class="${open ? 'open': ''}"
          @click=${() => setOpen(!open)}>
          <slot name="header">Open</slot>
          <span class="arrow"></span>
        </button>
        <slot name="visible"></slot>
      </div>
      <div class="drawer ${open ? 'open': ''}" style="transform: ${drawerTransform};">
        <hr />
        <slot name="contents"></slot>
      </div>
    </div>
  `;
}

SingleDrawer.observedAttributes = ['open'];

customElements.define('single-drawer', component(SingleDrawer));

function calculate() {

}

function getNumberOfPanels() {
  return Array.from(this.querySelectorAll('single-drawer')).length;
}

function DrawerChest(el) {
  const initialCount = useMemo(getNumberOfPanels.bind(el), []);
  const [count, setCount] = useState(initialCount);

  console.log("COUNT", count);

  return html`
    <style>
      :host {
        display: block;
      }
      :host, slot {
        background-color: inherit;
      }
    </style>
    <slot></slot>
  `;
}

customElements.define('drawer-chest', component(DrawerChest));