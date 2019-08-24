const {Component, render} = require("inferno");
const h = require("inferno-hyperscript").h;
const fm = require("./../../Formality-JavaScript");

const code = `import Base@0 open

T Bool
| true
| false

// ::::::::::::::::::::::
// :: Simple functions ::
// ::::::::::::::::::::::

copy : {case b : Bool} -> [:Bool, Bool]
| true  => [true, true]
| false => [false, false]

not : {case b : Bool} -> Bool
| true  => false
| false => true

and : {case a : Bool, b : Bool} -> Bool
| true  => b
| false => false

or : {case a : Bool, b : Bool} -> Bool
| true  => true
| false => b
`;

class Code extends Component {
  constructor(props) {
    super(props);
    this.parse(props.code);
  }
  parse(code) {
    this.code = code;
    this.defs = null;
    this.tokens = null;
    fm.lang.parse("test_file", this.code, true).then(({defs, tokens}) => {
      console.log("parsed", defs, tokens);
      this.defs = defs;
      this.tokens = tokens;
      this.forceUpdate();
    });
  }
  componentWillReceiveProps(props) {
    this.parse(props.code);
  }
  typecheck(name) {
    try {
      var type = fm.lang.show(fm.lang.norm(this.state.defs[name], this.state.defs, "TYPE", {}));
      var good = true;
    } catch (e) {
      var type = e.toString().replace(/\[[0-9]m/g, "").replace(/\[[0-9][0-9]m/g, "");
      var good = false;
    }
    var text = "";
    if (good) {
      text += "✓ " + name + " : " + type + "\n\nTerm checked successfully!";
    } else {
      text += "✗ " + name + "\n\n" + type;
    }
    alert(text);
  }
  normalize(name) {
    try {
      var norm = fm.lang.show(fm.lang.norm(this.state.defs[name], this.state.defs, "DEBUG", {}));
    } catch (e) {
      var norm = "<unable_to_normalize>";
    };
    alert(norm);
  }
  async componentDidMount() {
  }
  render() {
    if (this.tokens) {
      const onClickDef = name => (e) => {
        if (!e.shiftKey) {
          return this.typecheck(name);
        } else {
          return this.normalize(name);
        }
      };
      var line_num = 0;
      var add_line_nums = str => {
        var result = "";
        for (var i = 0; i < str.length; ++i) {
          if (str[i] === "\n") {
            var line_str = ("   " + String(line_num)).slice(-3);
            result += (line_num > 0 ? "\n" : "") + line_str + " | ";
            line_num += 1;
          } else {
            result += str[i];
          }
        }
        return result;
      };
      //this.elems.push(h("span", {style: {"color": "black"}}, add_line_nums("\n")));
      var elems = [];
      for (var i = 0; i < this.tokens.length; ++i) {
        var attrs = (() => {
          switch (this.tokens[i][0]) {
            case "txt" : return {style: {"color": "black"}};
            case "sym" : return {style: {"color": "#15568f"}};
            case "cmm" : return {style: {"color": "#A2A8D3"}};
            case "num" : return {style: {"color": "green"}};
            case "var" : return {style: {"color": "black"}};
            case "ref" : return {style: {"color": "#38598B", "text-decoration": "underline", "font-weight": "bold", "cursor": "pointer"}};
            case "def" : return {style: {"color": "#4384e6", "text-decoration": "underline", "font-weight": "bold", "cursor": "pointer"}, onClick: onClickDef(this.tokens[i][1])}; 
            default    : return {};
          }
        })();
        elems.push(h("span", attrs, (this.tokens[i][1])));
      }

      return h("code", 
        {style: {
          "background": "white",
          "width": "600px",
          "overflow": "scroll",
          "padding": "8px",
          "border-radius": "6px",
          "box-shadow": "0px 0px 6px 0px rgba(0,0,0,0.5)"
        }},
        h("pre", {}, elems));
    } else {
      return h("div", {}, "...");
    }
  }
}

class Main extends Component {
  constructor(props) {
    super(props)
    this.state = {defs: null};
    this.elems = [];
  }
  render() {
    return h("div", {style: {"font-family": "Gotham Book"}}, [
      h("div", {style: {
        "background": "white",
        "margin-bottom": "24px",
        "border-bottom": "1px solid gray",
        "display": "flex",
        "flex-flow": "row nowrap",
        "align-items": "center",
        //"box-shadow": "inset 0px -32px 32px -32px rgba(0,0,0,0.5)",
        "height": "44px"
        }}, [
          h("img", {style: {"width": "42px"}, src: "fm-logo.png"}),
          h("span", {style: {"padding-top": "6px", "font-family": "Gotham Book"}}, "Provit!")
        ]),
      h("div", {style: {
        "display": "flex",
        "flex-flow": "column nowrap",
        "align-items": "center",
        }}, [h(Code, {code})])
    ]);
  }
}

window.onload = () => {
  render(h(Main), document.getElementById("main"));
};
