(function(){
var q=document.getElementById('q');
document.addEventListener('keydown',function(e){if(e.key==='/'&&document.activeElement!==q){e.preventDefault();q.focus()}});
document.querySelector('.hs').addEventListener('submit',function(e){if(!q.value.trim()){e.preventDefault();q.focus()}});
})();
