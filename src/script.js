/**
 * 这里作为整个程序的入口文件
 */

// 应用了全局的公用样式
import "./style.css";

// 主要目录结构之一 Experience， 直译过来是实例的意思
import Experience from "./Experience/Experience.js";

// 搭载整个三维世界场景渲染的DOM元素 canvas.webgl，传入后进行整个世界的实例化
new Experience(document.querySelector("canvas.webgl"));
