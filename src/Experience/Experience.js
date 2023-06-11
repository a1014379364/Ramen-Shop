import * as THREE from "three";

import Debug from "./Utils/Debug.js"; // 调试用的工具类
import Sizes from "./Utils/Sizes.js"; // 跟视口尺寸处理相关的工具类
import Time from "./Utils/Time.js"; // 跟帧、时间处理相关的工具类
import Camera from "./Camera.js"; // 相机类
import Renderer from "./Renderer.js"; // 渲染器类
import Sounds from "./Sounds.js"; // 音效管理类
import World from "./World/World.js"; // ??
import Resources from "./Utils/Resources.js"; // 静态资源，如：三维模型的管理工具类
import Materials from "./World/Materials.js"; // 材质类
import Animations from "./World/Animations.js"; // 动画类
import sources from "./sources.js"; // 静态资源路径配置类
import PostProcessing from "./PostProcessing.js"; // ??
import RayCaster from "./RayCaster.js"; // 暂时猜测是三维空间射线拾纳之类的计算类 ??
import Performance from "./Performance.js"; // 暂时推测是性能优化类 ??
import PreLoader from "./PreLoader.js"; // 预加载处理类
import Controller from "./Controller.js"; // 控制器类

let instance = null; // 全局变量instance，用于辅助实现单例模式

export default class Experience {
  constructor(_canvas) {
    // Singleton
    if (instance) {
      return instance;
    }
    instance = this;

    // Global access
    window.experience = this; // 全局存储实例

    // Options
    this.canvas = _canvas; // 存储渲染载体DOM元素

    //config
    this.config = {}; // 全局配置文件 ??
    this.config.touch = false; // 当前是否可以触发触摸事件了
    window.addEventListener(
      "touchstart",
      () => {
        this.config.touch = true; // 触摸事件生效了，将配置flag置起
      },
      { once: true }
    );

    // Setup
    this.debug = new Debug(); // 初始化调试类
    this.scene = new THREE.Scene(); // 初始化整个三维场景，场景容器
    this.sizes = new Sizes(); // 和视口变化关的管理类

    // 简易地获取当前设备是纵向还是横向
    if (this.sizes.width / this.sizes.height > 1) {
      this.config.vertical = false;
    } else {
      this.config.vertical = true;
    }

    this.time = new Time(); // 启动时钟，开始每帧触发一次 tick
    this.camera = new Camera();
    this.renderer = new Renderer();
    this.sounds = new Sounds();
    this.resources = new Resources(sources);
    this.performance = new Performance();
    this.preLoader = new PreLoader();
    this.world = new World();
    this.materials = new Materials();
    this.animations = new Animations();
    this.postProcessing = new PostProcessing();
    this.controller = new Controller();
    this.rayCaster = new RayCaster();

    // Resize event
    this.sizes.on("resize", () => {
      this.resize();
    });

    // Time tick event
    this.time.on("tick", () => {
      this.update();
    });
  }

  // 处理视口尺寸变化的事件
  resize() {
    this.camera.resize();
    this.renderer.resize();
    this.postProcessing.resize();
  }

  // 处理更新事件
  update() {
    this.camera.update();
    this.world.update();
    this.postProcessing.update();
    this.animations.update();
    this.performance.update();
  }

  // 处理销毁事件，但不知道为啥注释了，是因为他觉得全局只有一个实例用不上 ??
  // destroy()
  // {
  //     this.sizes.off('resize')
  //     this.time.off('tick')

  //     // Traverse the whole scene
  //     this.scene.traverse((child) =>
  //     {
  //         // Test if it's a mesh
  //         if(child instanceof THREE.Mesh)
  //         {
  //             child.geometry.dispose()

  //             // Loop through the material properties
  //             for(const key in child.material)
  //             {
  //                 const value = child.material[key]

  //                 // Test if there is a dispose function
  //                 if(value && typeof value.dispose === 'function')
  //                 {
  //                     value.dispose()
  //                 }
  //             }
  //         }
  //     })

  //     this.camera.controls.dispose()
  //     this.renderer.instance.dispose()

  //     if(this.debug.active)
  //         this.debug.ui.destroy()
  // }
}
