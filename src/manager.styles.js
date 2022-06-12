
export const styles = /* css */`
*,
*:before,
*:after,
:host {
  box-sizing: border-box;
}

body {
  font-family: "HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif; 
  font-weight: 300;
  margin: 0;
}

h1, h2, h3, h4 {
  font-weight: normal;
  margin: 0 0 18px 0;
}

.side-nav {
  width: 320px;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  background: #fafafa;
  overflow: hidden;
  overflow-y: auto;
  padding: 18px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.side-nav a {
  display: block;
  width: 100%;
  color: #2d2d2d;
}

.side-nav ul {
  display: flex;
  gap: 4px;
  flex-direction: column;
  margin: 0;
  padding: 0;
  list-style: none;
}

.side-nav li {
  margin-left: 12px;
}

.side-nav li:first-child {
  margin-left: 0;
  font-size: 18px;
}

.side-nav-logo {
  font-size: 18px;
}

header {
  padding-left: 320px;
}

header nav {
  color: #2d2d2d;
  display: flex;
  gap: 14px;
  padding: 24px;
  border-bottom: 1px solid #ccc;
}

header .full-screen {
  margin-left: auto;
}

main {
  padding: 12px 24px 12px 342px;
  height: calc(100vh - 76px);
}

pre {
  background: #2d2d2d;
  padding: 0;
  overflow: hidden;
  height: fit-content;
  width: 100%;
  padding: 24px;
  margin: 0 0 24px 0;
}

iframe {
  background-color: transparent;
  border: 0 none transparent;
  padding: 0;
  overflow: hidden;
  height: calc(100% - 200px);
  width: 100%;
  resize: inline;
}

.action-log {
  border-top: 1px solid #ccc;
  height: 200px;
  padding: 12px 24px 24px 24px;
  margin-top: 12px;
  overflow-y: auto;
  overscroll-behavior-y: contain;
  scroll-snap-type: y mandatory;
  font-family: monospace;
}

table {
  width: 100%;
  max-width: 920px;
  border-collapse: collapse;
  margin: 0 0 48px 0;
}

table thead {
  border-bottom: 1px solid #ccc;
}

table td {
  padding: 12px;
  border-bottom: 1px solid #ccc;
}

code {
  background: #fafafa;
}

#__bs_notify__ {
  display: none !important;
}
`;