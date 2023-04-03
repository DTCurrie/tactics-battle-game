import { logger } from "./logger";

type MessageHandler<Sender = unknown, Data = unknown> = (
  sender: Sender,
  data: Data
) => void;

type SenderTable<Sender = unknown, Data = unknown> = Record<
  string,
  MessageHandler<Sender, Data>[]
>;

const defaultSender = "default" as const;

export type Messenger = {
  tables: Record<string, SenderTable>;
  addObserver: (
    messageType: string,
    handler: MessageHandler,
    sender?: string
  ) => void;
  removeObserver: (
    messageType: string,
    handler: MessageHandler,
    sender?: string
  ) => void;
  postMessage: (messageType: string, sender?: string, data?: unknown) => void;
  clean: () => void;
};

const createMessenger = () => {
  const tables: Record<string, SenderTable> = {};
  const invoking = new Set<MessageHandler[]>();

  const { logError, logWarning } = logger("messenger");

  const addObserver = (
    messageType: string,
    handler: MessageHandler,
    sender?: string
  ) => {
    if (!messageType) {
      logError("Can't observe a message with no type", {
        messageType,
        handler,
        sender,
      });

      return;
    }

    const senders = (tables[messageType] ??= {});
    const key = sender ?? defaultSender;
    const list = (senders[key] ??= []);

    if (!list.includes(handler)) {
      senders[key] = [...list, handler];
    }
  };

  const removeObserver = (
    messageType: string,
    handler: MessageHandler,
    sender?: string
  ) => {
    if (!messageType) {
      logError("Can't stop observing a message with no type", {
        messageType,
        handler,
        sender,
      });

      return;
    }

    if (!tables[messageType]) {
      return;
    }

    const senders = tables[messageType];
    const key = sender ?? defaultSender;

    if (!senders[key]) {
      return;
    }

    const list = senders[key];
    if (!list) {
      return;
    }

    const index = list?.indexOf(handler);
    if (index >= 0) {
      list.splice(index, 1);
      senders[key] = [...list];
    }
  };

  const postMessage = (
    messageType: string,
    sender: string = defaultSender,
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

    if (!tables[messageType]) {
      logWarning("Message type is not being observed", {
        messageType,
        sender,
        data,
      });
    }

    const senders = tables[messageType];

    if (senders[sender]) {
      const handlers = senders[sender] ?? [];
      invoking.add(handlers);

      for (const handler of handlers) {
        handler(sender, data);
      }

      invoking.delete(handlers);
    }
  };

  const clean = () => {
    for (const table in tables) {
      for (const sender in tables[table]) {
        const handlers = tables[table][sender];
        if (handlers.length === 0) {
          delete tables[table][sender];
        }
      }

      if (Object.keys(tables[table]).length === 0) {
        delete tables[table];
      }
    }
  };

  return {
    tables,
    addObserver,
    removeObserver,
    postMessage,
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
