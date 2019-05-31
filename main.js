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
window.currentSeq="";
window.onload=function(){
	init();
}
function setType(t){
	if (window.currentType!=t){
		window.currentType=t;
		renderInit();
	}
}
function init(){
	window.addBox=document.getElementById("cap-add");
	window.seqBox=document.getElementById("cap-seq");
	window.probBox=document.getElementById("cap-prob");
	window.saveBox=document.getElementById("cap-save");
	window.loopBox=document.getElementById("cap-loop");
	window.shareBox=document.getElementById("cap-share");

	renderInit();
}
function renderInit(){
	var x, i;

	window.addBox.innerHTML="";
	window.saveBox.innerHTML="";
	window.loopBox.innerHTML="";
	window.currentSeq="";

	for (x in window.capNames[window.currentType]){
		window.addBox.innerHTML+="<button class='cap cap-"+x+"' onclick='addCapsule(\""+x+"\")'></button>"
	}
	for (i=0; i<window.loops[window.currentType].length; i++){
		x=window.loops[window.currentType][i];
		window.loopBox.innerHTML+="<b class='cap cap-"+x+"'>"+(i+1)+"</b>"
	}
	render();
}
function addCapsule(t){
	if (t=="-"){
		window.currentSeq=window.currentSeq.substr(1, window.currentSeq.length-1);
	} else {
		window.currentSeq+=t;
	}
	render();
}
function render(){
	var i;
	window.seqBox.innerHTML="";
	for (i=0; i<window.currentSeq.length; i++){
		window.seqBox.innerHTML+="<b class='cap cap-"+window.currentSeq[i]+"'></b>"
	}
}