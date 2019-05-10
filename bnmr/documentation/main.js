const
onAsideLinkClick = (e) => {
  if ($$().scrollTo) {
    e.preventDefault();

    const el = e.target.getAttribute('href');

    $$('main').scrollTo({
      top: document.querySelector(el).offsetTop,
      left: 0,
      behavior: 'smooth'
    });
  }
},

handleFns = (examples, fns) => {
  const docExamples = document.createElement('div');
  docExamples.innerHTML = examples;

  $$('aside').innerHTML = `${fns.map((fn) => {
    return `<a href="#${fn.id}" onclick="onAsideLinkClick(event)">${fn.name}</a>`
  }).join('<br>')}`;

  $$('main').innerHTML = `${fns.map((fn) => { return `
    <section id="${fn.id}">
      <h1>${fn.name}</h1>
      <h2>Description</h2>
      <p>${fn.description}</p>
      <h2>Parameters</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          ${fn.parameters.map((param) => { return `
            <tr>
              <td><code>${param.name}</code></td>
              <td>${param.type}</td>
              <td>
                ${param.description}
              </td>
            </tr>
          `}).join('')}
        </tbody>
      </table>
      <h2>Returns</h2>
      <p>${fn.return}</p>
      <h2>Examples</h2>
      <div class="codeWrapper">
        <code>
${docExamples.querySelector(`#${fn.id}`).innerHTML}
        </code>
      </div>
    </section>
  `}).join('')}`;
}

initFns = () => {
  $$.ajax({
    url: './fns_examples.html',
    callback: (examples) => {
      $$.ajax({
        type: 'json',
        url: './fns.json',
        callback: handleFns.bind(null, examples)
      });
    }
  })
};

document.addEventListener('DOMContentLoaded', initFns);
