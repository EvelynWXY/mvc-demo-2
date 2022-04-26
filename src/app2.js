import "./app2.css";
import $ from "jquery";

const eventBus = $({ window });

const localKey = "app2.index"; //本地存下的值
//数据相关都放到 m
const m = {
  data: {
    //初始化数据,localStorage 只能获取到字符串
    index: parseInt(localStorage.getItem(localKey)) || 0, //index 保底值为0
  },
  create() {},
  delete() {},
  update(data) {
    Object.assign(m.data, data); //把data 赋值到原有的 m.data
    eventBus.trigger("m:updated"); //触发事件
    localStorage.setItem("index", m.data.index);
  },
  get() {},
};

//视图相关都放到 v
const v = {
  el: null, //表示容器，代替之前的 container
  html: (index) => {
    return `
              <div>
                  <ol class="tab-bar">
                    <li class = "${
                      index === 0 ? "selected" : ""
                    }" data-index = "0"<span>11111</span></li>
                    <li class = "${
                      index === 1 ? "selected" : ""
                    }" data-index = "1"><span>22222</span></li>
                  </ol>
                  <ol class="tab-content">
                    <li class = "${index === 0 ? "active" : ""}">内容1</li>
                    <li class = "${index === 1 ? "active" : ""}">内容2</li>
                  </ol>
              </div>`;
  },
  init(container) {
    v.el = $(container);
  },
  render(index) {
    if (v.el.children.length !== 0) v.el.empty();
    //jquery 会把字符串 html 变成 section 标签
    $(v.html(index)).appendTo(v.el);
  },
};

//其他都 c
const c = {
  init(container) {
    v.init(container);
    v.render(m.data.index); //第一次 view = render(data)
    c.autoBindEvents();
    eventBus.on("m:updated", () => {
      v.render(m.data.index);
    });
  },
  events: {
    "click .tab-bar li": "x",
  },
  x(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    m.update({ index: index });
    console.log("x");
  },

  autoBindEvents() {
    //绑定鼠标事件，绑定的是 section 不是 button，事件委托，绑定在最外面的那个元素上
    for (let key in c.events) {
      const value = c[c.events[key]];
      const spaceIndex = key.indexOf(" ");
      const part1 = key.slice(0, spaceIndex);
      const part2 = key.slice(spaceIndex + 1);
      v.el.on(part1, part2, value);
    }
  },
};
export default c;
