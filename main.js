window.loops={
	"main":"SWWWWIWWWWSWWWSWWWWSWWWWSWWWWSWWWWSWWWWSWWWWWSWWWWSWWWWSWWWWWWSWWWSWWWIWWWSWWWSWWWSWWWSWWWSWWWSWWWSWWSWWWWSWWWWSWWWSWWWUWWWSWWWIWWWWSWWWWWSWWWSWWWSWWWWSWWWWSWWWSWWWSWWWWSWWWWSWWSWWWSWWWSWWWWWIWWWSWWWWSWWWWSWWWWSWWWWWWSWWWWSWWWWSWWWWSWWWWEWW",
	"event":"PPAPPPAPPPAPPPAPPPAPPPAP"
}
window.capNames={
	"main":{
		"W":"Wood",
		"S":"Stone",
		"I":"Iron",
		"E":"Epic",
		"U":"Supreme"
	},
	"event":{
		"P":"Plastic",
		"A":"Armored"
	}
}
window.currentType="main";
window.currentSeq={
	"main":"",
	"event":""
};
window.onload=function(){
	init();
}
function setType(t){
	document.body.setAttribute("type", t);
	localStorage.setItem("type", t);
	window.currentType=t;
}
function init(){
	var x, i, w, e,
		b=["add", "seq", "prob", "save", "loop", "share"];
	for (w in window.loops){
		e=document.getElementById("world-"+w);
		e.innerHTML+='<div class="add-wrap" id="cap-add-'+w+'"></div>'
		e.innerHTML+='<div class="seq-wrap" id="cap-seq-'+w+'"></div>'
		e.innerHTML+='<div class="prob-wrap" id="cap-prob-'+w+'"></div>'
		e.innerHTML+='<table class="save-wrap" id="cap-save-'+w+'"></table>'
		e.innerHTML+='<input class="share-wrap" id="cap-share-'+w+'" type="text"/>'
		e.innerHTML+='<hr/>'
		e.innerHTML+='<div class="loop-wrap" id="cap-loop-'+w+'"></div>'
	}

	for (i=0; i<b.length; i++){
		window[b[i]+"Box"]={}
		for (w in window.loops){
			window[b[i]+"Box"][w]=document.getElementById("cap-"+b[i]+"-"+w);
		}
	}

	if (localStorage.getItem("type")==null){
		setType(window.currentType);
	} else {
		setType(localStorage.getItem("type"));
	}

	for (w in window.loops){
		for (x in window.capNames[w]){
			window.addBox[w].innerHTML+="<button class='cap cap-"+x+"' onclick='addCapsule(\""+x+"\", \""+w+"\")'></button>"
		}
		window.addBox[w].innerHTML+="<button class='cap cap-1' onclick=\"addCapsule('1', '"+w+"')\"></button>"
		window.addBox[w].innerHTML+="<button class='cap cap-DEL' onclick=\"addCapsule('-', '"+w+"')\"></button>"
		for (i=0; i<window.loops[w].length; i++){
			x=window.loops[w][i];
			window.loopBox[w].innerHTML+="<b class='cap cap-"+x+"'>"+(i+1)+"</b>"
		}
	}

	render();
}
function addCapsule(t, w){
	if (t=="-"){
		window.currentSeq[w]=window.currentSeq[w].substr(1, window.currentSeq[w].length-1);
	} else {
		window.currentSeq[w]+=t;
	}
	render();
}
function render(){
	var i, w;
	for (w in window.loops){
		window.seqBox[w].innerHTML="";
		for (i=0; i<window.currentSeq[w].length; i++){
			window.seqBox[w].innerHTML+="<b class='cap cap-"+window.currentSeq[w][i]+"'></b>"
		}
	}
}