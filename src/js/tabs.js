document.getElementById('revealexpress').addEventListener('loaded', () => {

  const buttons = document.querySelectorAll('.tab-button');

  for (const button of buttons) {
    button.addEventListener('click', e => {
      e.preventDefault();

      const targetSelector = e.currentTarget.dataset.target;
      const targetEverywhere = e.currentTarget.dataset.targetEverywhere;
      let container = targetEverywhere ? document.querySelector('#revealexpress') : e.currentTarget.closest('.tabs-container');

      // Activate the button(s)
      Array.from(container.querySelectorAll('.tab-button')).forEach(btn => {
        // Check if the current button is in a group containing a button with the current target selector
        if (btn.closest('.tabs-buttons-container').querySelectorAll('[data-target="' + targetSelector + '"]').length > 0) {
          if (btn.dataset.target === targetSelector) {
            btn.classList.add('active');
          } else {
            btn.classList.remove('active');
          }
        }
      });

      // Hide all tabs
      Array.from(container.querySelectorAll('.tabs > *')).forEach(tab => tab.classList.remove('active'));

      // Show the target tab(s)
      Array.from(container.querySelectorAll(targetSelector)).forEach(tab => tab.classList.add('active'));

      // Prism line-numbers and line-highlight recompute their layout on resize (hidden tabs have no size)
      window.dispatchEvent(new Event('resize'));
    });
  }

});
