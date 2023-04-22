export const button = (label: string, handler: (e: Event) => void) => {
  const btn = document.createElement("button");

  btn.textContent = label;
  btn.style.cssText = `width: 100px;`;
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    handler(e);
  });

  return btn;
};

export const buttons = (btns: HTMLButtonElement[]) => {
  const btnContainer = document.createElement("div");

  btnContainer.style.cssText = `
    position: absolute;
    left: 4px;
    top: 4px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    z-index: 100;
  `;

  btnContainer.append(...btns);

  return btnContainer;
};
