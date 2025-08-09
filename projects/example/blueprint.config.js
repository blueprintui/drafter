export default {
  drafter: {
    dist: './.drafter',
    schema: './custom-elements.json',
    examples: './element.examples.js',
    baseUrl: './',
    aliases: [],
    head: () => {
      return /* html */ `
      <style>
        html { box-sizing: border-box; }
        *, *:before, *:after { box-sizing: inherit; }

        body {
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          padding: 24px;
        }

        ui-badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          background-color: #f0f0f0;
          color: #333;
          font-size: 12px;

          &[status="accent"] {
            background-color: #007bff;
            color: #fff;
          }

          &[status="success"] {
            background-color: #28a745;
            color: #fff;
          }

          &[status="warning"] {
            background-color: #ffc107;
            color: #333;
          }

          &[status="danger"] {
            background-color: #dc3545;
            color: #fff;
          }
        }
      </style>
      `;
    }
  }
};
