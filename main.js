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
		window.currentSeq[state[1]]=hash[0].substr(1, state[0].length-1);
		window.currentWorld=state[1];
		setType(hash[1]);
	} else {
		state={};
		for (world in window.loops){
			state[world]=localStorage.getItem("auto-"+world);
		}
		for (world in state){
			if (state[world]!==null){
				window.currentSeq[world]=state[world];
			}
		}
		setType(localStorage.getItem("type"));
	}

	var worldElem, saveWrap;
	for (world in window.loops){

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
		for (world in window.loops){
			window[boxes[index]+"Box"][world]=document.getElementById("cap-"+boxes[index]+"-"+world);
		}
	}

	/*if (localStorage.getItem("type")==null){
		setType(window.currentWorld);
	} else {
		setType(localStorage.getItem("type"));
	}*/
	var world, capName, index;
	for (world in window.loops){
		for (capName in window.capNames[world]){
			window.addBox[world].innerHTML+="<button class='cap cap-"+capName+"' onclick='addCapsule(\""+capName+"\", \""+world+"\")'></button>"
		}
		window.addBox[world].innerHTML+="<button class='cap cap-x' onclick=\"addCapsule('x', '"+world+"')\"></button>"
		window.addBox[world].innerHTML+="<button class='cap cap--' onclick=\"addCapsule('-', '"+world+"')\"></button>"
		for (index=0; index<window.loops[world].length; index++){
			capName=window.loops[world][index];
			window.loopBox[world].innerHTML+="<b class='cap cap-"+capName+"'>"+(index+1)+"</b>"
		}
	}

	render();
}
function addCapsule(t, w){
	if (t=="-"){
		window.currentSeq[w]=window.currentSeq[w].substr(0, window.currentSeq[w].length-1);
	} else {
		window.currentSeq[w]+=t;
	}
	window.localStorage.setItem("auto-"+w, window.currentSeq[w]);
	render();
}
function render(){
	var w, i,
		ni, nt, ntsum, dists,
		loopc, pwrap, pwhtml;
	for (w in window.loops){
		loopc=document.querySelectorAll("#cap-loop-"+w+" .cap");
		pwrap=document.getElementById("cap-prob-"+w);
		window.seqBox[w].innerHTML="";
		for (i=0; i<window.currentSeq[w].length; i++){
			window.seqBox[w].innerHTML+="<b class='cap cap-"+window.currentSeq[w][i]+"'></b>"
		}
		for (i=0; i<window.loops[w].length; i++){
			loopc[i].classList.remove("sel")
		}
		if (window.currentSeq[w]!=""){
			ni=getNextIndexes(w);
			for (i=0; i<window.loops[w].length; i++){
				if (ni.indexOf(i)!=-1){
					loopc[i].classList.add("sel")
				}
			}

			for (i=1; i<=window.saveSlots; i++){
				if (localStorage.getItem("save-"+w+"-"+i)!=null){
					if (localStorage.getItem("save-"+w+"-"+i)!=window.currentSeq[w]){
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
				for (i in window.capNames[w]){
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
	var loop=window.loops[w],
		seq=window.currentSeq[w],
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
	var loop=window.loops[w],
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
	for (t in window.capNames[w]){
		ret[t]=[];
		for (i=0; i<ni.length; i++){
			for (d=0; window.loops[w][(ni[i]+d)%window.loops[w].length]!=t; d++){
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
	localStorage.setItem("save-"+w+"-"+i,window.currentSeq[w]);
	render();
}
function loadState(w, i){
	window.currentSeq[w]=localStorage.getItem("save-"+w+"-"+i);
	render();
}