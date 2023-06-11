/**
 * 这里应该是一个时间管理类
 */
import EventEmitter from "./EventEmitter.js";

export default class Time extends EventEmitter {
  constructor() {
    super();

    // Setup
    this.start = Date.now(); // 获取当前时间
    this.current = this.start; // 初始化这个当前时间
    this.elapsed = 0; // 当前距离开始的时间已经过去了多久
    this.delta = 16; // 步间时长

    /**
     * requestAnimationFrame一个帧循环方法
     * 简单来说就是，它会自动地循环获取下一次浏览器的渲染时机，然后在下次渲染后立刻执行传参进来的方法
     */
    window.requestAnimationFrame(() => {
      this.tick();
    });
  }

  tick() {
    const currentTime = Date.now(); // 获取当前时间
    this.delta = currentTime - this.current; // 计算离上一次执行已经经过了多长时间
    this.current = currentTime; // 重置当前时间（最近的一次时间）
    this.elapsed = this.current - this.start; // 记录已经离最开始记录的时间过了多久

    this.trigger("tick"); // 调用名为tick的回调函数

    // 自动执行下一次循环
    window.requestAnimationFrame(() => {
      this.tick();
    });
  }
}
