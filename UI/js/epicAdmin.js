/* eslint-disable no-undef */
const contact = document.querySelector('.contact');
const bnt = document.querySelector('.bnt');
const closee = document.querySelector('.closee');
const closed = document.querySelector('.closed');
const groupModal = document.querySelector('.group-modal');
const contactModal = document.querySelector('.contact-modal');
const harsh = document.querySelector('.harsh');
const menuBar = document.querySelector('#menu-bar');

bnt.addEventListener('click', (event) => {
  event.preventDefault();
  groupModal.style.display = 'initial';
});

contact.addEventListener('click', (event) => {
  event.preventDefault();
  contactModal.style.display = 'initial';
});

closee.addEventListener('click', (event) => {
  event.preventDefault();
  groupModal.style.display = 'none';
});

closed.addEventListener('click', (event) => {
  event.preventDefault();
  contactModal.style.display = 'none';
});

harsh.addEventListener('click', (event) => {
  event.preventDefault();
  menuBar.style.display = 'initial';
});
