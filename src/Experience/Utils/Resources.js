/**
 * 静态资源加载工具类
 */
import * as THREE from "three";
import Experience from "../Experience.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { BasisTextureLoader } from "three/examples/jsm/loaders/BasisTextureLoader.js";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader.js";
import EventEmitter from "./EventEmitter.js";

export default class Resources extends EventEmitter {
  constructor(sources) {
    super();

    this.experience = new Experience();
    this.sources = sources;
    this.renderer = this.experience.renderer.instance; // 获取渲染器实例

    this.items = {};
    this.toLoad = this.sources.length; // 待加载列表
    this.loaded = 0; // 目前已加载数目

    this.video = {}; // ??
    this.videoTexture = {}; // ??
    this.mychromavideotexturematerial = {}; // ??

    this.carousel1 = []; // ??
    this.carousel2 = []; // ??

    this.setLoaders();
    this.startLoading();
  }

  /**
   * 设置加载器
   */
  setLoaders() {
    this.loaders = {};
    this.loaders.dracoLoader = new DRACOLoader();
    this.loaders.dracoLoader.setDecoderPath("/draco/");
    this.loaders.gltfLoader = new GLTFLoader();
    this.loaders.gltfLoader.setDRACOLoader(this.loaders.dracoLoader);
    this.loaders.textureLoader = new THREE.TextureLoader();
    this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader();

    this.loaders.basisTextureLoader = new BasisTextureLoader();
    this.loaders.basisTextureLoader.setTranscoderPath("/basis/");
    this.loaders.basisTextureLoader.detectSupport(this.renderer); // 检测硬件对可用压缩纹理格式的支持，以确定代码转换器的输出格式。必须在加载纹理之前调用。

    this.loaders.KTX2TextureLoader = new KTX2Loader();
    this.loaders.KTX2TextureLoader.setTranscoderPath("/basis/");
    this.loaders.KTX2TextureLoader.detectSupport(this.renderer); // 检测硬件对可用压缩纹理格式的支持，以确定代码转换器的输出格式。必须在加载纹理之前调用。
  }

  /**
   * 启动加载
   */
  startLoading() {
    // Load each source
    for (const source of this.sources) {
      if (source.type === "gltfModel") {
        this.loaders.gltfLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      } else if (source.type === "texture") {
        this.loaders.textureLoader.load(source.path, (file) => {
          file.flipY = false;
          file.encoding = THREE.sRGBEncoding;
          this.sourceLoaded(source, file);
        });
      } else if (source.type === "basisTexture") {
        this.loaders.basisTextureLoader.load(source.path, (file) => {
          file.encoding = THREE.sRGBEncoding;
          this.sourceLoaded(source, file);

          if (source.path.includes("smallScreen1")) {
            this.carousel1.push(file);
          }

          if (source.path.includes("smallScreen2")) {
            this.carousel2.push(file);
          }
        });
      } else if (source.type === "KTX2Texture") {
        this.loaders.KTX2TextureLoader.load(source.path, (file) => {
          file.encoding = THREE.sRGBEncoding;
          this.sourceLoaded(source, file);

          // if(source.path.includes("smallScreen1"))
          // {this.carousel1.push(file)}

          // if(source.path.includes("smallScreen2"))
          // {this.carousel2.push(file)}
        });
      } else if (source.type === "videoTexture") {
        this.video[source.name] = document.createElement("video");

        this.video[source.name].src = source.path;

        this.video[source.name].muted = true;
        this.video[source.name].playsInline = true;
        this.video[source.name].autoplay = true;
        this.video[source.name].loop = true;
        // this.video[source.name].play()

        this.videoTexture[source.name] = new THREE.VideoTexture(
          this.video[source.name]
        );
        this.videoTexture[source.name].flipY = false;
        this.videoTexture[source.name].minFilter = THREE.NearestFilter;
        this.videoTexture[source.name].magFilter = THREE.NearestFilter;
        this.videoTexture[source.name].generateMipmaps = false;
        this.videoTexture[source.name].encoding = THREE.sRGBEncoding;

        this.sourceLoaded(source, this.videoTexture[source.name]);
      }
    }
  }

  /**
   * 资源加载成功后的回调事件
   * @param {Object} source 对应资源对象
   * @param {Object} file 资源加载成功回调传参
   */
  sourceLoaded(source, file) {
    this.trigger("itemLoaded");

    this.items[source.name] = file;
    this.loaded++;

    // 等资源加载数等于已加载数既加载完毕, 触发ready事件
    if (this.loaded === this.toLoad) {
      this.trigger("ready");
    }
  }
}
