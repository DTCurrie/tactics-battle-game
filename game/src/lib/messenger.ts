import { logger } from "./logger";

type Sender = string;
type Listener = (sender: Sender, data: unknown) => void;
type Observer = Listener[];
type Observers = Record<Sender, Observer>;
type MessageType = string;
type ObserversTable = Record<MessageType, Observers>;

const defaultSender = "default" as const;

export type Messenger = {
  table: () => ObserversTable;
  addObserver: (
    messageType: MessageType,
    handler: Listener,
    sender?: Sender
  ) => void;

  removeObserver: (
    messageType: MessageType,
    handler: Listener,
    sender?: Sender
  ) => void;

  message: (messageType: MessageType, sender?: Sender, data?: unknown) => void;
  clean: () => void;
};

const createMessenger = () => {
  const table: ObserversTable = {};
  const invoking = new Set<Listener[]>();

  const { logError, logWarning } = logger("messenger");

  const addObserver = (
    messageType: MessageType,
    handler: Listener,
    sender: Sender = defaultSender
  ) => {
    if (!messageType) {
      logError("Can't observe a message with no type", {
        messageType,
        handler,
        sender,
      });

      return;
    }

    const observers = (table[messageType] ??= {});
    const observer = (observers[sender] ??= []);

    if (!observer.includes(handler)) {
      if (invoking.has(observer)) {
        observers[sender] = [...observer];
      }

      observers[sender] = [...observer, handler];
    }
  };

  const removeObserver = (
    messageType: MessageType,
    handler: Listener,
    sender: Sender = defaultSender
  ) => {
    if (!messageType) {
      logError("Can't stop observing a message with no type", {
        messageType,
        handler,
        sender,
      });

      return;
    }

    if (!table[messageType]) {
      return;
    }

    const observers = table[messageType];
    if (!observers[sender]) {
      return;
    }

    const observer = observers[sender];
    const index = observer?.indexOf(handler);

    if (index >= 0) {
      observer.splice(index, 1);
      observers[sender] = [...observer];
    }
  };

  const message = (
    messageType: MessageType,
    sender: Sender = defaultSender,
    data?: unknown
  ) => {
    if (!messageType) {
      logError("Can't post a message with no type", {
        messageType,
        sender,
        data,
      });

      return;
    }

    if (!table[messageType]) {
      logWarning("Message type is not being observed", {
        messageType,
        sender,
        data,
      });

      return;
    }

    const observers = table[messageType];

    if (observers[sender]) {
      const observer = observers[sender];
      invoking.add(observer);

      for (const listener of observer) {
        listener(sender, data);
      }

      invoking.delete(observer);
    }
  };

  const clean = () => {
    for (const messageType in table) {
      for (const sender in table[messageType]) {
        if (table[messageType][sender].length === 0) {
          delete table[messageType][sender];
        }
      }

      if (Object.keys(table[messageType]).length === 0) {
        delete table[messageType];
      }
    }
  };

  return {
    table: () => table,
    addObserver,
    removeObserver,
    message,
    clean,
  };
};

let instance: Messenger | null = null;
export const messenger = () => {
  if (instance !== null) {
    return instance;
  }

  instance = createMessenger();
  return instance;
};
