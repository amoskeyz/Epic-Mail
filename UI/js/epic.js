/* eslint-disable no-undef */
const inbox = document.querySelector('.inbox');
const draft = document.querySelector('.draft');
const sent = document.querySelector('.sent');
const unread = document.querySelector('.unread');
const group = document.querySelector('.group');
const trash = document.querySelector('.trash');
const focus = document.querySelector('.focus');
const bnt = document.querySelector('.bnt');
const userName = document.querySelector('.userName');
const clos = document.querySelector('.clos');
const closa = document.querySelector('.closa');
const bgModal = document.querySelector('.bg-modal');
const profileModal = document.querySelector('.profile-modal');
const harsh = document.querySelector('.harsh');
const menuBar = document.querySelector('#menu-bar');

inbox.addEventListener('click', (event) => {
  event.preventDefault();
  focus.textContent = 'Inbox';
});

draft.addEventListener('click', (event) => {
  event.preventDefault();
  focus.textContent = 'Draft';
});

sent.addEventListener('click', (event) => {
  event.preventDefault();
  focus.textContent = 'Sent';
});

unread.addEventListener('click', (event) => {
  event.preventDefault();
  focus.textContent = 'Unread';
});

group.addEventListener('click', (event) => {
  event.preventDefault();
  focus.textContent = 'Groups';
});


trash.addEventListener('click', (event) => {
  event.preventDefault();
  focus.textContent = 'Trash';
});


bnt.addEventListener('click', (event) => {
  event.preventDefault();
  bgModal.style.display = 'initial';
});

userName.addEventListener('click', (event) => {
  event.preventDefault();
  profileModal.style.display = 'initial';
});

clos.addEventListener('click', (event) => {
  event.preventDefault();
  bgModal.style.display = 'none';
});

closa.addEventListener('click', (event) => {
  event.preventDefault();
  profileModal.style.display = 'none';
});

harsh.addEventListener('click', (event) => {
  event.preventDefault();
  menuBar.style.display = 'initial';
});
