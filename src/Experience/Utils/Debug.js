import * as dat from "lil-gui"; //第三方调试库类

export default class Debug {
  constructor() {
    // 获取当前的link传参，如果含有debug，则初始化调试器
    this.active = window.location.hash === "#debug";

    if (this.active) {
      this.ui = new dat.GUI();
    }
  }
}
