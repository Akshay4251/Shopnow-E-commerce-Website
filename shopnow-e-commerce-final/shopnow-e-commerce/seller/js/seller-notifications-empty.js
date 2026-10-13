(function(){
var tabs=[].slice.call(document.querySelectorAll('.nts button'));
tabs.forEach(function(b){b.addEventListener('click',function(){tabs.forEach(function(x){x.classList.remove('on')});b.classList.add('on')})});
})();
