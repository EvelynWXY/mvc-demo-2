import "./app1.css";
import $ from "jquery";

const eventBus = $({ window });

//数据相关都放到 m
const m = {
  data: {
    //初始化数据,localStorage 只能获取到字符串
    n: parseInt(localStorage.getItem("n")), //第一次要初始化 n，使用localStorage get、set实现每次刷新页面数据也不会丢失
  },
  create() {},
  delete() {},
  update(data) {
    Object.assign(m.data, data);
    eventBus.trigger("m:updated"); //触发事件
    localStorage.setItem("n", m.data.n);
  },
  get() {},
};
//视图相关都放到 v
const v = {
  el: null, //表示容器，代替之前的 container
  html: `
  <div>
          <div class="output">
            <span id="number">{{n}}</span>
          </div>
          <div class="actions">
            <button id="add1">+1</button>
            <button id="minus1">-1</button>
            <button id="mul2">*2</button>
            <button id="divide2">÷2</button>
          </div>
        </div>`,
  init(container) {
    v.el = $(container);
  },
  render(n) {
    if (v.el.children.length !== 0) v.el.empty();
    //jquery 会把字符串 html 变成 section 标签
    $(v.html.replace("{{n}}", m.data.n)).appendTo(v.el);
  },
};
//其他都 c
const c = {
  init(container) {
    v.init(container);
    v.render(m.data.n); //第一次 view = render(data)
    c.autoBindEvents();
    eventBus.on("m:updated", () => {
      v.render(m.data.n);
    });
  },
  events: {
    "click #add1": "add",
    "click #minus1": "minus",
    "click #mul2": "mul",
    "click #divide2": "div",
  },
  add() {
    m.update({ n: m.data.n + 1 });
  },
  minus() {
    m.update({ n: m.data.n - 1 });
  },
  mul() {
    m.update({ n: m.data.n * 2 });
  },
  div() {
    m.update({ n: m.data.n / 2 });
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
