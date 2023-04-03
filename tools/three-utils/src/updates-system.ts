export type UpdateHandler = (time: number, delta: number) => void;

type UpdatesSytem = {
  time: number;
  delta: number;
  addUpdate: (handler: UpdateHandler) => number;
  addPostUpdate: (handler: UpdateHandler) => number;
  removeUpdate: (callback: UpdateHandler) => void;
  removePostUpdate: (callback: UpdateHandler) => void;
  update: () => void;
  postUpdate: () => void;
};

export const createUpdatesSystem = (): UpdatesSytem => {
  const updateHandlers: UpdateHandler[] = [];
  const postUpdateHandlers: UpdateHandler[] = [];

  let time = performance.now();
  let then = performance.now();
  let delta = 0;

  const addUpdate = (handler: UpdateHandler) => updateHandlers.push(handler);
  const addPostUpdate = (handler: UpdateHandler) =>
    postUpdateHandlers.push(handler);

  const removeUpdate = (callback: UpdateHandler) => {
    updateHandlers.splice(updateHandlers.indexOf(callback), 1);
  };

  const removePostUpdate = (callback: UpdateHandler) => {
    postUpdateHandlers.splice(postUpdateHandlers.indexOf(callback), 1);
  };

  const update = () => {
    time = performance.now();
    delta = time - then;
    then = time;

    for (const handler of updateHandlers) {
      handler(time, delta);
    }
  };

  const postUpdate = () => {
    for (const handler of postUpdateHandlers) {
      handler(time, delta);
    }
  };

  return {
    time,
    delta,
    addUpdate,
    addPostUpdate,
    removeUpdate,
    removePostUpdate,
    update,
    postUpdate,
  };
};

let instance: UpdatesSytem | null = null;

export const updatesSystem = () => {
  if (instance !== null) {
    return instance;
  }

  instance = createUpdatesSystem();

  return instance;
};
