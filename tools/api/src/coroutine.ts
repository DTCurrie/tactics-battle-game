export function startCoroutine(coroutine: Generator) {
  let curr = coroutine.next();
  while (!curr.done) {
    curr = coroutine.next();
  }
}
export async function startAsyncCoroutine(coroutine: AsyncGenerator) {
  let curr = await coroutine.next();
  while (!curr.done) {
    curr = await coroutine.next();
  }
}
