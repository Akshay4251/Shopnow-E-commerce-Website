(function(){
var $=function(s){return document.getElementById(s)};
var files=[],MAX=10*1024*1024,OK=/\.(png|jpe?g|pdf)$/i;
$('ds').addEventListener('input',function(){$('cn').textContent=this.value.length.toLocaleString('en-US')+'/1,000 characters'});
function render(){$('fls').innerHTML='';files.forEach(function(f,i){var li=document.createElement('li');li.innerHTML='<span></span><button type="button" aria-label="Remove file">Remove</button>';li.firstChild.textContent=f.name+' ('+Math.ceil(f.size/1024)+' KB)';li.querySelector('button').onclick=function(){files.splice(i,1);render()};$('fls').appendChild(li)})}
function add(list){var bad=[];[].slice.call(list).forEach(function(f){if(!OK.test(f.name)||f.size>MAX)bad.push(f.name);else files.push(f)});render();var e=$('e3');e.hidden=!bad.length;e.textContent=bad.length?'Not added (only PNG, JPG, PDF up to 10 MB): '+bad.join(', '):''}
var dz=$('dz'),fl=$('fl');
dz.addEventListener('click',function(){fl.click()});dz.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();fl.click()}});
fl.addEventListener('change',function(){add(fl.files);fl.value=''});
['dragenter','dragover'].forEach(function(n){dz.addEventListener(n,function(e){e.preventDefault();dz.classList.add('drag')})});
['dragleave','drop'].forEach(function(n){dz.addEventListener(n,function(e){e.preventDefault();dz.classList.remove('drag')})});
dz.addEventListener('drop',function(e){add(e.dataTransfer.files)});
$('f').addEventListener('submit',function(e){e.preventDefault();
  var a=!$('sj').value.trim(),b=!$('ds').value.trim();$('e1').hidden=!a;$('e2').hidden=!b;
  if(a){$('sj').focus();return}if(b){$('ds').focus();return}
  $('tid').textContent='#SN-TK-'+(2482+Math.floor(Math.random()*20));$('f').hidden=true;$('ok').hidden=false;window.scrollTo(0,0);
});
})();
