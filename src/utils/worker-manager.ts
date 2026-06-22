type EData = {
  id: string
  type: "result" | "error"
  payload: number[][]
  message: string | null
}

let worker: Worker | null = null
const activeRequests = new Map<
  string,
  {
    callback: (err: null | string, data: number[][] | null) => void
  }
>([])

function initWorker() {
  if (worker) return

  worker = new Worker(new URL("../worker/worker.ts", import.meta.url), {
    type: "module",
  })

  worker.onmessage = (e) => {
    const { id, type, payload, message } = e.data as EData
    const req = activeRequests.get(id)

    if (!req) return

    if (type === "error") {
      req.callback(message, null)
    } else if (type === "result") {
      req.callback(null, payload)
    }

    activeRequests.delete(id)

    return payload
  }
}

function runWorkerTask(
  data: ImageDataArray,
  clusters = 3,
  callback: (err: null | string, data: number[][] | null) => void
) {
  initWorker()

  const id = crypto.randomUUID()
  activeRequests.set(id, { callback })

  worker?.postMessage({ id, data, clusters })
}

function clearActiveTasks(reason = "Tasks cancelled by user") {
  if (!worker) return

  for (const [id, t] of activeRequests) {
    t.callback(reason, null)
    activeRequests.delete(id)
  }

  worker.terminate()
  worker = null
}

export { runWorkerTask, clearActiveTasks }
