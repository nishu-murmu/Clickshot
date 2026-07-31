export const config = {

}

export const emitKeys = {
  screenshot_ready: "screenshot_ready",
  send_base64_img_edit_window: "send_base64_img_edit_window"
}

export const sleep = (ms: number) => new Promise(res => setTimeout(res, ms))
