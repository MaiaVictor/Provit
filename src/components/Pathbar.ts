import { Component, render } from "inferno";
import { h } from "inferno-hyperscript";
import { LayoutConstants, LoadFile } from "../assets/Constants";

export interface Props {
  load_file: LoadFile;
  path: string;
}

class Pathbar extends Component<Props> {
  
  // State
  public editing = false;
  public file_name = this.props.path;

  constructor(props: Props) {
    super(props);
  }

  public onClick() {
    this.editing = true;
    this.file_name = "";
    this.forceUpdate();
  }

  public onBlur() {
    this.editing = false;
    this.file_name = this.props.path;
    console.log("[pathbar] Onblur!!");
    this.forceUpdate();
  }

  public onInput(e: Event) {
    const evt = e as InputEvent;
    if (this.editing && evt.target) {
      const ele = evt.target as HTMLInputElement;
      this.editing = true;
      this.file_name = ele.value;
    }
    this.forceUpdate();
  }

  public onKeyDown(e: KeyboardEvent) {
    const onLoadCode = (file: string) => this.props.load_file(file);
    if (e.keyCode === 13 && this.editing) {
      this.editing = false;
      const is_valid = this.verify_format(this.file_name);
      // TODO: if not valid, tell the user
      if (is_valid) {
        this.props.load_file(this.file_name);
      }
    }
    this.forceUpdate();
  }

  public verify_format(file_name: string): boolean {
    const module_regex = /^[a-zA-Z_\.-@]+#\w+$/;
    return module_regex.test(file_name);
  }

  public render() {
    const onClick = () => this.onClick();
    const onBlur = () => this.onBlur();
    const onKeyDown = (e: KeyboardEvent) => this.onKeyDown(e);
    const onInput = (e: KeyboardEvent) => this.onInput(e);
    if (this.editing) {
      return h("input", {
        type: "text",
        style: input_style,
        value: this.file_name,
        placeholder: "Enter file name...",
        onKeyDown,
        onInput,
        onBlur,
        autofocus: true,
      });
    }
    return h("div", { style, onClick }, this.props.path);
  }
}

const style = {
  "max-width": "160px",
  "color": "#FFFFFF",
  "display": "flex",
  "justify-content": "flex-start",
  "align-items": "center",
  // "margin-left": "30px",
  "margin-bottom": "6px",
  "font-size": "20px",
  "flex-grow": 1,
};

const input_style = {
  ...style,
  "border": "none",
  // "margin-top": "23px",
  // "margin-bottom": "5px",
  "padding": "5px",
  "outline": "none",
  "font-family": "monospace",
  "font-color": LayoutConstants.light_gray_color,
  "background": "transparent"
};

export default Pathbar
