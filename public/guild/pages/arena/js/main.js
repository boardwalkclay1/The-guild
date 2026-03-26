document.querySelectorAll('.arena-nav button').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.screen;
    switchScreen(target);
  });
});

function switchScreen(name) {
  document.querySelectorAll('.arena-screen').forEach(s => s.style.display = 'none');
  document.querySelector(`#screen-${name}`).style.display = 'block';
}
