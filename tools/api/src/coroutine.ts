export function startCoroutine(coroutine: Generator) {
  let curr = coroutine.next();
  for (; !curr.done; ) {
    curr = coroutine.next();
  }
}
export async function startAsyncCoroutine(coroutine: AsyncGenerator) {
  let curr = await coroutine.next();
  for (; !curr.done; ) {
    curr = await coroutine.next();
  }
}
