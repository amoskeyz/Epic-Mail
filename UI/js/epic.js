document.querySelector('.bnt').addEventListener('click',(event) => {
    document.querySelector('.bg-modal').style.display = 'initial';
});

document.querySelector('.userName').addEventListener('click',(event) => {
    document.querySelector('.profile-modal').style.display = 'initial';
});

document.querySelector('.clos').addEventListener('click',(event)=> {
    document.querySelector('.bg-modal').style.display = 'none';
});

document.querySelector('.closa').addEventListener('click',(event)=> {
    document.querySelector('.profile-modal').style.display = 'none';
});


document.querySelector('.harsh').addEventListener('click',(event)=> {
  document.querySelector('#menu-bar').style.display ='initial';
});
