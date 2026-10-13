(function(){
var A=[['Orders','How do I mark an order as shipped?','Open the order, choose Shipped in Update status and press Update status.'],
['Orders','Can I cancel an order after it is packed?','Packed orders can be cancelled before dispatch. Contact support with the order ID.'],
['Shipping','How is the delivery agent assigned?','An agent is assigned automatically once an order is marked ready to ship.'],
['Shipping','What should I do if a courier misses pickup?','Raise a ticket with the tracking ID and we will rebook the pickup.'],
['Payments','When do I receive my payout?','Payouts are sent every week to your bank account on file, 2 working days after delivery.'],
['Payments','Why is my payout lower than my sales?','Commission, shipping charges and discounts are deducted. See the order summary for details.'],
['Products','How do I add or update a product?','Go to Products, choose Add product or the pencil icon, then save your changes.'],
['Products','What image sizes work best?','Use JPG or PNG up to 5 MB. The first photo becomes the cover image.'],
['Returns','How do I approve or reject a return?','Open the return request and choose Approve return or Reject return with a reason.'],
['Account','How do I change my pickup address?','Open Profile, update the pickup address and press Save changes.']];
var q=(new URLSearchParams(location.search).get('q')||'').trim(),$=function(s){return document.getElementById(s)};
$('q').value=q;
var terms=q.toLowerCase().split(/\s+/).filter(Boolean);
var hit=A.filter(function(a){var t=(a[1]+' '+a[2]+' '+a[0]).toLowerCase();return terms.every(function(w){return t.indexOf(w)>-1})});
var ul=$('ha');
hit.forEach(function(a){var li=document.createElement('li'),s=document.createElement('span'),h=document.createElement('h3'),p=document.createElement('p');s.className='ct2';s.textContent=a[0];h.textContent=a[1];p.textContent=a[2];li.appendChild(s);li.appendChild(h);li.appendChild(p);ul.appendChild(li)});
$('empty').style.display=hit.length?'none':'block';
$('sum').textContent=q?(hit.length+' result'+(hit.length===1?'':'s')+' for “'+q+'”'):'Browse all help articles';
})();
