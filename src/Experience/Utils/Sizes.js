import EventEmitter from "./EventEmitter.js";

export default class Sizes extends EventEmitter {
  constructor() {
    super();

    // 获取当前视口的宽度和高度，并适配帧率（有些高配机型帧率高，有的低）
    this.init();

    // 监听当前窗口尺寸变化事件
    window.addEventListener("resize", () => {
      this.init();

      this.trigger("resize");
    });

    // window.onorientationchange是一个JavaScript事件处理程序，用于检测设备的方向改变事件。
    window.onorientationchange = async () => {
      await this.sleep(10); // 延迟10ms执行
      this.init();
      this.trigger("resize");
    };

    // 监听可视性变化
    document.addEventListener("visibilitychange", async () => {
      if (document.hidden) {
      } else {
        await this.sleep(500);
        this.init();

        this.trigger("resize");
      }
    });
  }

  // 内置数据初始化
  init() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);
  }

  // 尺寸变化事件
  resize() {
    console.log("click");
    this.init();
    this.trigger("resize");
  }

  /**
   * 延迟某个事件执行
   * @param {Number} ms 延迟时间（ms）
   * @returns 
   */
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
