/**
 * 这里我估计是订阅发布者类
 * 但是不太明确，或者问：订阅发布者类的特征是什么，以下的类需要优化处理吗 ?? （我感觉不是订阅发布者模式）
 * 感觉还是没怎么弄懂，可用但是不懂，回头再想想 ??
 */

// 事件触发器 -- 用于在应用程序中管理和分派事件
export default class EventEmitter {
  constructor() {
    this.callbacks = {};
    this.callbacks.base = {};
  }

  /**
   * 该方法用于将回调函数添加到指定事件的回调数组中，以便在事件触发时调用它们。
   * 第一个参数_names是一个字符串，其中包含一个或多个事件名称。
   * 该方法会将事件名称解析成一个数组并遍历每个事件名称，
   * 然后使用resolveName()方法将其解析为名称和命名空间，
   * 并将其添加到相应的命名空间中。
   * @param {String} _names 字符串，其中包含一个或多个事件名称。
   * @param {*} callback
   * @returns
   */
  on(_names, callback) {
    // Errors
    if (typeof _names === "undefined" || _names === "") {
      console.warn("wrong names");
      return false;
    }

    if (typeof callback === "undefined") {
      console.warn("wrong callback");
      return false;
    }

    // Resolve names
    const names = this.resolveNames(_names);

    // Each name
    names.forEach((_name) => {
      // Resolve name
      const name = this.resolveName(_name);

      // Create namespace if not exist
      if (!(this.callbacks[name.namespace] instanceof Object))
        this.callbacks[name.namespace] = {};

      // Create callback if not exist
      if (!(this.callbacks[name.namespace][name.value] instanceof Array))
        this.callbacks[name.namespace][name.value] = [];

      // Add callback
      this.callbacks[name.namespace][name.value].push(callback);
    });

    return this;
  }

  /**
   * 该方法用于从指定事件的回调数组中删除回调函数。
   * 第一个参数_names是一个字符串，其中包含一个或多个事件名称。
   * 与on()方法一样，
   * 该方法也会将事件名称解析成一个数组并遍历每个事件名称，
   * 然后使用resolveName()方法将其解析为名称和命名空间，
   * 并将其从相应的命名空间中删除。
   * @param {String} _names
   * @returns
   */
  off(_names) {
    // Errors
    if (typeof _names === "undefined" || _names === "") {
      console.warn("wrong name");
      return false;
    }

    // Resolve names
    const names = this.resolveNames(_names);

    // Each name
    names.forEach((_name) => {
      // Resolve name
      const name = this.resolveName(_name);

      // Remove namespace
      if (name.namespace !== "base" && name.value === "") {
        delete this.callbacks[name.namespace];
      }

      // Remove specific callback in namespace
      else {
        // Default
        if (name.namespace === "base") {
          // Try to remove from each namespace
          for (const namespace in this.callbacks) {
            if (
              this.callbacks[namespace] instanceof Object &&
              this.callbacks[namespace][name.value] instanceof Array
            ) {
              delete this.callbacks[namespace][name.value];

              // Remove namespace if empty
              if (Object.keys(this.callbacks[namespace]).length === 0)
                delete this.callbacks[namespace];
            }
          }
        }

        // Specified namespace
        else if (
          this.callbacks[name.namespace] instanceof Object &&
          this.callbacks[name.namespace][name.value] instanceof Array
        ) {
          delete this.callbacks[name.namespace][name.value];

          // Remove namespace if empty
          if (Object.keys(this.callbacks[name.namespace]).length === 0)
            delete this.callbacks[name.namespace];
        }
      }
    });

    return this;
  }

  /**
   * 该方法用于手动触发事件并调用与事件相关联的回调函数。
   * 该方法会将事件名称解析为一个单独的名称和命名空间，
   * 并在相应的命名空间中查找回调函数，
   * 然后对每个回调函数进行调用并将参数传递给它。
   * @param {String} _name 要触发的事件名称
   * @param {*} _args 用于传递到回调函数中的参数
   * @returns
   */
  trigger(_name, _args) {
    // Errors
    if (typeof _name === "undefined" || _name === "") {
      console.warn("wrong name");
      return false;
    }

    let finalResult = null;
    let result = null;

    // Default args
    const args = !(_args instanceof Array) ? [] : _args;

    // Resolve names (should on have one event)
    let name = this.resolveNames(_name);

    // Resolve name
    name = this.resolveName(name[0]);

    // Default namespace
    if (name.namespace === "base") {
      // Try to find callback in each namespace
      for (const namespace in this.callbacks) {
        if (
          this.callbacks[namespace] instanceof Object &&
          this.callbacks[namespace][name.value] instanceof Array
        ) {
          this.callbacks[namespace][name.value].forEach(function (callback) {
            result = callback.apply(this, args);

            if (typeof finalResult === "undefined") {
              finalResult = result;
            }
          });
        }
      }
    }
    // Specified namespace
    else if (this.callbacks[name.namespace] instanceof Object) {
      if (name.value === "") {
        console.warn("wrong name");
        return this;
      }

      this.callbacks[name.namespace][name.value].forEach(function (callback) {
        result = callback.apply(this, args);

        if (typeof finalResult === "undefined") finalResult = result;
      });
    }

    return finalResult;
  }

  /**
   * 该方法用于解析事件名称字符串，并返回一个数组，其中包含各个事件名称。
   * 该方法首先清除所有非字母数字字符，
   * 然后使用一个或多个逗号和斜杠来分隔事件名称，
   * 并将其拆分成一个数组。
   * @param {String} _names
   * @returns
   */
  resolveNames(_names) {
    let names = _names;
    names = names.replace(/[^a-zA-Z0-9 ,/.]/g, "");
    names = names.replace(/[,/]+/g, " ");
    names = names.split(" ");

    return names;
  }

  /**
   * 该方法用于解析事件名称，并返回一个对象，其中包含名称、命名空间和原始名称。
   * 该方法将事件名称拆分为名称和命名空间，并将其存储在新对象中。
   * 如果未指定命名空间，则默认使用名为"base"的命名空间。
   * @param {String} name
   * @returns
   */
  resolveName(name) {
    const newName = {};
    const parts = name.split(".");

    newName.original = name;
    newName.value = parts[0];
    newName.namespace = "base"; // 默认命名空间

    // Specified namespace
    if (parts.length > 1 && parts[1] !== "") {
      newName.namespace = parts[1];
    }

    return newName;
  }
}
