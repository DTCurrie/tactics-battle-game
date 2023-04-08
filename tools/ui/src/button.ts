export const button = (label: string, handler: (e: Event) => void) => {
  const btn = document.createElement("button");

  btn.textContent = label;
  btn.style.width = "100px";
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    handler(e);
  });

  return btn;
};

export const buttons = (btns: HTMLButtonElement[]) => {
  const btnContainer = document.createElement("div");

  btnContainer.style.position = "absolute";
  btnContainer.style.left = "4px";
  btnContainer.style.top = "4px";
  btnContainer.style.display = "flex";
  btnContainer.style.flexDirection = "column";
  btnContainer.style.gap = "2px";
  btnContainer.style.zIndex = "100";
  btnContainer.append(...btns);

  return btnContainer;
};
