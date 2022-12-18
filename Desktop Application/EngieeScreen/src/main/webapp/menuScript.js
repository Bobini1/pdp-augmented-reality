var selectedHologramNo = 1;

function menuHide(){
  const toggleMenu = document.getElementsByClassName('menu')[0];
  if(toggleMenu.classList.contains('active')){
    toggleMenu.classList.toggle('active');
  }
}

function menuToggle(){
	const toggleMenu = document.getElementsByClassName('menu')[0];
	toggleMenu.classList.toggle('active');
}

function changeObject(objectNo){
  let objectId = "holo" + objectNo.toString();
  let objectSrc = document.getElementById(objectId).src;
  let profile = document.getElementById('selectedHolo');
  profile.src = objectSrc;
  selectedHologramNo = objectNo;
}