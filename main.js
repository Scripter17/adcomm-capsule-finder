/*
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
window.currentWorld="main";
window.currentSeq={
	"main":"",
	"event":""
};
*/
window.dat={
	"main":{
		loop:"SWWWWIWWWWSWWWSWWWWSWWWWSWWWWSWWWWSWWWWSWWWWWSWWWWSWWWWSWWWWWWSWWWSWWWIWWWSWWWSWWWSWWWSWWWSWWWSWWWSWWSWWWWSWWWWSWWWSWWWUWWWSWWWIWWWWSWWWWWSWWWSWWWSWWWWSWWWWSWWWSWWWSWWWWSWWWWSWWSWWWSWWWSWWWWWIWWWSWWWWSWWWWSWWWWSWWWWWWSWWWWSWWWWSWWWWSWWWWEWW",
		capNames:{
			"W":"Wood",
			"S":"Stone",
			"I":"Iron",
			"E":"Epic",
			"U":"Supreme"
		},
		currentSeq:""
	},
	"event":{
		loop:"PPAPPPAPPPAPPPAPPPAPPPAP",
		capNames:{
			"P":"Plastic",
			"A":"Armored"
		},
		currentSeq:""
	}
}
window.saveSlots=3;
window.onload=function(){
	init();
}
function setType(t){
	document.body.setAttribute("type", t);
	localStorage.setItem("type", t);
	window.currentWorld=t;
}
function init(){


	var state, world;
	// Handle autosaved states and hash links
	if (window.location.hash.length>1){
		state=window.location.state.split("&");
		window.dat[state[1]].currentSeq=hash[0].substr(1, state[0].length-1);
		window.currentWorld=state[1];
		setType(hash[1]);
	} else {
		state={};
		for (world in window.dat){
			state[world]=localStorage.getItem("auto-"+world);
		}
		for (world in state){
			if (state[world]!==null){
				window.dat[world].currentSeq=state[world];
			}
		}
		setType(localStorage.getItem("type"));
	}

	var worldElem, saveWrap;
	for (world in window.dat){

		document.getElementById("world-divs-wrap").innerHTML+="<div class='world-wrap' id='world-"+world+"'></div>"
		document.getElementById("world-buttons-wrap").innerHTML+="<button class='set-button' id='setMain' onclick='setType(\""+world+"\")'>"+world+"</button>"

		worldElem=document.getElementById("world-"+world);
		worldElem.innerHTML+='<div class="add-wrap" id="cap-add-'+world+'"></div>';
		worldElem.innerHTML+='<div class="seq-wrap" id="cap-seq-'+world+'"></div>';
		worldElem.innerHTML+='<div class="prob-wrap" id="cap-prob-'+world+'"></div>';
		worldElem.innerHTML+='<table class="save-wrap" id="cap-save-'+world+'"></table>';
		worldElem.innerHTML+='<input class="share-wrap" id="cap-share-'+world+'" type="text"/>';
		worldElem.innerHTML+='<hr/>';
		worldElem.innerHTML+='<div class="loop-wrap" id="cap-loop-'+world+'"></div>';
		// Add save/load buttons
		saveWrap=document.getElementById("cap-save-"+world);
		swt="<tr>"
		for (i=1; i<=window.saveSlots; i++){
			swt+="<td><button id='load-"+world+"-"+i+"' class='ls-button' onclick='loadState(\""+world+"\", "+i+")'>Load "+world[0]+i+"</td>"
		}
		swt+="</tr><tr>"
		for (i=1; i<=window.saveSlots; i++){
			swt+="<td><button id='save-"+world+"-"+i+"' class='ls-button' onclick='saveState(\""+world+"\", "+i+")'>Save "+world[0]+i+"</td>"
		}
		swt+="</tr>"
		saveWrap.innerHTML=swt;
	}

	// Get box elements
	var index, boxes=["add", "seq", "prob", "save", "loop", "share"], world;
	for (index=0; index<boxes.length; index++){
		window[boxes[index]+"Box"]={}
		for (world in window.dat){
			window[boxes[index]+"Box"][world]=document.getElementById("cap-"+boxes[index]+"-"+world);
		}
	}

	/*if (localStorage.getItem("type")==null){
		setType(window.currentWorld);
	} else {
		setType(localStorage.getItem("type"));
	}*/
	var world, capName, index;
	for (world in window.dat){
		for (capName in window.dat[world].capNames){
			window.addBox[world].innerHTML+="<button class='cap cap-"+capName+"' onclick='addCapsule(\""+capName+"\", \""+world+"\")'></button>"
		}
		window.addBox[world].innerHTML+="<button class='cap cap-x' onclick=\"addCapsule('x', '"+world+"')\"></button>"
		window.addBox[world].innerHTML+="<button class='cap cap--' onclick=\"addCapsule('-', '"+world+"')\"></button>"
		for (index=0; index<window.dat[world].loop.length; index++){
			capName=window.dat[world].loop[index];
			window.loopBox[world].innerHTML+="<b class='cap cap-"+capName+"'>"+(index+1)+"</b>"
		}
	}

	render();
}
function addCapsule(t, w){
	if (t=="-"){
		window.dat[w].currentSeq=window.dat[w].currentSeq.substr(0, window.dat[w].currentSeq.length-1);
	} else {
		window.dat[w].currentSeq+=t;
	}
	window.localStorage.setItem("auto-"+w, window.dat[w].currentSeq);
	render();
}
function render(){
	var w, i,
		ni, nt, ntsum, dists,
		loopc, pwrap, pwhtml;
	for (w in window.dat){
		loopc=document.querySelectorAll("#cap-loop-"+w+" .cap");
		pwrap=document.getElementById("cap-prob-"+w);
		window.seqBox[w].innerHTML="";
		for (i=0; i<window.dat[w].currentSeq.length; i++){
			window.seqBox[w].innerHTML+="<b class='cap cap-"+window.dat[w].currentSeq[i]+"'></b>"
		}
		for (i=0; i<window.dat[w].loop.length; i++){
			loopc[i].classList.remove("sel")
		}
		if (window.dat[w].currentSeq!=""){
			ni=getNextIndexes(w);
			for (i=0; i<window.dat[w].loop.length; i++){
				if (ni.indexOf(i)!=-1){
					loopc[i].classList.add("sel")
				}
			}

			for (i=1; i<=window.saveSlots; i++){
				if (localStorage.getItem("save-"+w+"-"+i)!=null){
					if (localStorage.getItem("save-"+w+"-"+i)!=window.dat[w].currentSeq){
						document.getElementById("save-"+w+"-"+i).style.borderColor="red";
					} else {
						document.getElementById("save-"+w+"-"+i).style.borderColor="green";
					}
				}
			}

			pwrap.innerHTML="";
			if (ni.length>0){
				nt=getNextTypes(w);
				dists=getDists(w);
				ntsum=0;
				pwhtml="";
				for (i in nt){ntsum+=nt[i]}
				for (i in window.dat[w].capNames){
					pwhtml+="<div class='cprob'>"
					pwhtml+="<b class='cap cap-"+i+"'></b><br/>"
					pwhtml+=(i in nt?nt[i]:0)+"<br/>"
					pwhtml+=((i in nt?nt[i]:0)/ntsum*100).toFixed(2)+"%<br/>";
					pwhtml+=dists[i]+"</div>";
					pwrap.innerHTML=pwhtml;
				}
			}
		}
	}
}

function getNextIndexes(w){
	var loop=window.dat[w].loop,
		seq=window.dat[w].currentSeq,
		capBoxes=document.querySelectorAll("#cap-loop-"+w+" .cap"),
		s, i, valid, ret=[];
	for (s=0; s<loop.length; s++){
		valid=true;
		for (i=0; i<seq.length; i++){
			if (seq[i]!=loop[(s+i)%loop.length] && seq[i]!="x"){
				valid=false;
				break;
			}
		}
		if (valid){
			ret.push((s+i)%loop.length)
		}
	}
	return ret;
}

function getNextTypes(w){
	var loop=window.dat[w].loop,
		ni=getNextIndexes(w),
		i, ret={};
	for (i=0; i<ni.length; i++){
		if (loop[ni[i]] in ret){
			ret[loop[ni[i]]]+=1;
		} else {
			ret[loop[ni[i]]]=1;
		}
	}
	return ret;
}

function getDists(w){
	var t, i, d, ret={}, ni=getNextIndexes(w), min, max;
	for (t in window.dat[w].capNames){
		ret[t]=[];
		for (i=0; i<ni.length; i++){
			for (d=0; window.dat[w].loop[(ni[i]+d)%window.dat[w].loop.length]!=t; d++){
				// I mean, it *works*
			}
			ret[t].push(d+1);
		}
		min=Math.min.apply(null, ret[t]);
		max=Math.max.apply(null, ret[t]);
		if (min==max){
			ret[t]=min.toString();
		} else {
			ret[t]=min+"-"+max;
		}
	}
	return ret
}

function saveState(w, i){
	var s=window.dat[w].currentSeq;
	localStorage.setItem("save-"+w+"-"+i, s);
	render();
}
function loadState(w, i){
	var l=localStorage.getItem("save-"+w+"-"+i);
	if (l==null){l="";}
	window.dat[w].currentSeq=l;
	render();
}