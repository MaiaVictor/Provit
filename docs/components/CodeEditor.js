// Edits Formality Code

const h = require("inferno-hyperscript").h;

const Editor = ({code, on_input_code}) => {
  return h("textarea", {
    "oninput": (e) => on_input_code(e.target.value),
    "value": code,
    "style": {
      "font-family": "monospace",
      "font-size": "14px",
      "padding": "7px",
      "width": "100%",
      "height": "100%"
    },
  }, [])
};

module.exports = Editor;
