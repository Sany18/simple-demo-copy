const template = `
  <style type="text/css" media="screen">
  body {
    overflow: hidden;
  }

  #editor {
    margin: 0;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
  </style>

  <pre id="editor">function foo(items) {
    var i;
    for (i = 0; i &lt; items.length; i++) {
      alert("Ace Rocks " + items[i]);
    }
  }</pre>

  <script src="ace/ace.js" type="text/javascript" charset="utf-8"></script>
  <script>
    let editor = ace.edit("editor");
    editor.setTheme("ace/theme/twilight");
    // editor.session.setMode("ace/mode/javascript");
  </script>
`
document.write(template)
