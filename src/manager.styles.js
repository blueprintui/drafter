
export const styles = /* css */`
*,
*:before,
*:after,
:host {
  box-sizing: border-box;
}

:root {
  --body-background: #fff;
  --body-color: #2d2d2d;
  --anchor-color: #2d2d2d;
  --nav-background: #fafafa;
  --nav-color: #2d2d2d;
  --log-background: #fafafa;
  --log-color: #2d2d2d;
  --nav-item-selected-background: #ededed;
  --nav-item-selected-color: #2d2d2d;
  --pre-background: #fafafa;
  --border-color: #ccc;
}

@media(prefers-color-scheme: dark) {
  :root {
    color-scheme: dark;
    --body-background: #1f1f1f;
    --body-color: #fff;
    --anchor-color: #fff;
    --nav-background: #2d2d2d;
    --nav-color: #fff;
    --log-background: #2d2d2d;
    --log-color: #fff;
    --nav-item-selected-background: #1f1f1f;
    --nav-item-selected-color: #fff;
    --pre-background: #2d2d2d;
    --code-background: #2d2d2d;
    --border-color: #555;
  }
}

body {
  font-family: "HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif; 
  font-weight: 300;
  margin: 0;
  background: var(--body-background);
  color: var(--body-color);
  display: flex;
  overflow: hidden;
}

h1, h2, h3, h4 {
  font-weight: normal;
  margin: 0 0 18px 0;
}

a {
  color: var(--anchor-color);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.side-nav {
  position: sticky;
  height: 100vh;
  background: var(--nav-background);
  color: var(--nav-color);
  overflow: hidden;
  overflow-y: auto;
  padding: 18px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  resize: horizontal;
  overflow-x: hidden;
  width: 320px;
  min-width: 200px;
  max-width: 700px;
}

.side-nav a {
  display: block;
  width: 100%;
}

.side-nav ul {
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  list-style: none;
}

.side-nav li {
  padding: 8px 24px;
}

.side-nav li[selected] {
  background: var(--nav-item-selected-background);
  color: var(--nav-item-selected-color);
}

.side-nav li a {
  padding-left: 12px;
}

.side-nav li:first-child {
  margin-left: 0;
  font-size: 18px;
}

.side-nav-logo {
  font-size: 18px;
}

.content-panel {
  width: 100%;
}

header nav {
  color: #2d2d2d;
  display: flex;
  gap: 24px;
  padding: 24px;
  border-bottom: 1px solid var(--border-color);
}

header .full-screen {
  margin-left: auto;
}

main {
  padding: 24px 24px 16px 24px;
  height: calc(100vh - 71px);
  overflow-y: auto;
}

pre {
  background: var(--pre-background);
  padding: 0;
  overflow: hidden;
  height: fit-content;
  max-height: 400px;
  overflow: auto;
  width: 100%;
  padding: 24px;
  margin: 0 0 24px 0;
}

iframe {
  background-color: transparent;
  border: 0 none transparent;
  padding: 0;
  overflow: hidden;
  height: calc(100% - 6px);
  width: 100%;
  resize: both;
}

.action-log {
  background: var(--log-background);
  color: var(--log-color);
  height: 200px;
  padding: 12px 24px 24px 24px;
  margin-top: 12px;
  overflow-y: auto;
  overscroll-behavior-y: contain;
  scroll-snap-type: y mandatory;
  font-family: monospace;
  display: none;
}

.action-log-active .action-log {
  display: block;
}

.action-log-active iframe {
  height: calc(100% - 220px);
}

table {
  width: 100%;
  max-width: 920px;
  border-collapse: collapse;
  margin: 0 0 48px 0;
}

table thead {
  border-bottom: 1px solid var(--border-color);
}

table td {
  padding: 12px;
  border-bottom: 1px solid var(--border-color);
}

table code {
  background: var(--code-background);
}

#__bs_notify__ {
  display: none !important;
}

/* https://unpkg.com/prismjs@1.29.0/themes/prism.min.css */
code[class*=language-],pre[class*=language-]{color:#000;background:0 0;text-shadow:0 1px #fff;font-family:Consolas,Monaco,'Andale Mono','Ubuntu Mono',monospace;font-size:1em;text-align:left;white-space:pre;word-spacing:normal;word-break:normal;word-wrap:normal;line-height:1.5;-moz-tab-size:4;-o-tab-size:4;tab-size:4;-webkit-hyphens:none;-moz-hyphens:none;-ms-hyphens:none;hyphens:none}code[class*=language-] ::-moz-selection,code[class*=language-]::-moz-selection,pre[class*=language-] ::-moz-selection,pre[class*=language-]::-moz-selection{text-shadow:none;background:#b3d4fc}code[class*=language-] ::selection,code[class*=language-]::selection,pre[class*=language-] ::selection,pre[class*=language-]::selection{text-shadow:none;background:#b3d4fc}@media print{code[class*=language-],pre[class*=language-]{text-shadow:none}}pre[class*=language-]{padding:1em;margin:.5em 0;overflow:auto}:not(pre)>code[class*=language-],pre[class*=language-]{background:#f5f2f0}:not(pre)>code[class*=language-]{padding:.1em;border-radius:.3em;white-space:normal}.token.cdata,.token.comment,.token.doctype,.token.prolog{color:#708090}.token.punctuation{color:#999}.token.namespace{opacity:.7}.token.boolean,.token.constant,.token.deleted,.token.number,.token.property,.token.symbol,.token.tag{color:#905}.token.attr-name,.token.builtin,.token.char,.token.inserted,.token.selector,.token.string{color:#690}.language-css .token.string,.style .token.string,.token.entity,.token.operator,.token.url{color:#9a6e3a;background:hsla(0,0%,100%,.5)}.token.atrule,.token.attr-value,.token.keyword{color:#07a}.token.class-name,.token.function{color:#dd4a68}.token.important,.token.regex,.token.variable{color:#e90}.token.bold,.token.important{font-weight:700}.token.italic{font-style:italic}.token.entity{cursor:help}

@media(prefers-color-scheme: dark) {
  /* https://unpkg.com/prismjs@1.29.0/themes/prism-okaidia.min.css */
  code[class*=language-],pre[class*=language-]{color:#f8f8f2;background:0 0;text-shadow:0 1px rgba(0,0,0,.3);font-family:Consolas,Monaco,'Andale Mono','Ubuntu Mono',monospace;font-size:1em;text-align:left;white-space:pre;word-spacing:normal;word-break:normal;word-wrap:normal;line-height:1.5;-moz-tab-size:4;-o-tab-size:4;tab-size:4;-webkit-hyphens:none;-moz-hyphens:none;-ms-hyphens:none;hyphens:none}pre[class*=language-]{padding:1em;margin:.5em 0;overflow:auto;border-radius:.3em}:not(pre)>code[class*=language-],pre[class*=language-]{background:#272822}:not(pre)>code[class*=language-]{padding:.1em;border-radius:.3em;white-space:normal}.token.cdata,.token.comment,.token.doctype,.token.prolog{color:#8292a2}.token.punctuation{color:#f8f8f2}.token.namespace{opacity:.7}.token.constant,.token.deleted,.token.property,.token.symbol,.token.tag{color:#f92672}.token.boolean,.token.number{color:#ae81ff}.token.attr-name,.token.builtin,.token.char,.token.inserted,.token.selector,.token.string{color:#a6e22e}.language-css .token.string,.style .token.string,.token.entity,.token.operator,.token.url,.token.variable{color:#f8f8f2}.token.atrule,.token.attr-value,.token.class-name,.token.function{color:#e6db74}.token.keyword{color:#66d9ef}.token.important,.token.regex{color:#fd971f}.token.bold,.token.important{font-weight:700}.token.italic{font-style:italic}.token.entity{cursor:help}
}
`;