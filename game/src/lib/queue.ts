export const createQueue = <Entry>() => {
  const queue: Record<number, Entry> = {};
  let tail = 0;
  let head = 0;

  const enqueue = (entry: Entry) => {
    queue[tail++] = entry;
  };

  const dequeue = () => {
    if (tail === head) {
      return;
    }

    const entry = queue[head];
    delete queue[head++];
    return entry;
  };

  const count = () => Object.keys(queue).length;

  return {
    enqueue,
    dequeue,
    count,
  };
};
