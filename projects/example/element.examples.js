export const metadata = {
  name: 'badge',
  elements: ['ui-badge']
};

export function example() {
  return /* html */`
    <div bp-layout="inline gap:xs">
      <ui-badge>default</ui-badge>
      <ui-badge status="accent">accent</ui-badge>
      <ui-badge status="success">success</ui-badge>
      <ui-badge status="warning">warning</ui-badge>
      <ui-badge status="danger">danger</ui-badge>
    </div>
    `;
}

export function number() {
  return /* html */`
    <div bp-layout="inline gap:xs">
      <ui-badge>10</ui-badge>
      <ui-badge status="accent">10</ui-badge>
      <ui-badge status="success">10</ui-badge>
      <ui-badge status="warning">10</ui-badge>
      <ui-badge status="danger">10</ui-badge>
    </div>
    `;
}

export function longForm() {
  return /* html */`
    <div bp-layout="inline gap:xs">
      <ui-badge>0.0.0</ui-badge>
      <ui-badge status="accent">0.0.0</ui-badge>
      <ui-badge status="success">0.0.0</ui-badge>
      <ui-badge status="warning">0.0.0</ui-badge>
      <ui-badge status="danger">0.0.0</ui-badge>
    </div>
    `;
}