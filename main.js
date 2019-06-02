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
		// Thank you to /u/zephyron1237 on Reddit for making this part easy on me
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
};
window.saveSlots=3;
window.onload=function(){
	init();
};
// Set whether the user is using the main or event capsule finder
function setWorld(t){
	document.body.setAttribute("world", t);
	localStorage.setItem("world", t);
	window.currentWorld=t;
}
// localhost#PAP&event -> Plastic, Armored, Plastic in the event menu
function handleHash(){
	state=window.location.hash.split("&");
	if (state[1]==undefined){state[1]="main";} // localhost#WWS -> localhost#WWS&main
	state[0]=state[0].toUpperCase();
	state[1]=state[1].toLowerCase();
	window.dat[state[1]].currentSeq=state[0].substr(1, state[0].length-1);
	window.currentWorld=state[1];
	setWorld(state[1]);
}
function init(){
	window.onhashchange=function(){
		handleHash();
		render();
	}
	// Prevent double-tapping on a phone from zooming in.
	// You can still pinch zoom
	document.addEventListener("touchend", function(e){e.preventDefault(); e.target.click();});

	var state, world;
	// Handle autosaved states and hash links
	if (window.location.hash.length>1){
		handleHash();
	} else {
		// Load auto-save
		// Auto-save is updated whenever the user adds/removes a capsule to/from a sequence
		// Loading hash states doesn't affect it
		state={};
		for (world in window.dat){
			state[world]=localStorage.getItem("auto-"+world);
		}
		for (world in state){
			if (state[world]!==null){
				window.dat[world].currentSeq=state[world];
			}
		}
		setWorld(localStorage.getItem("world")); // Store which menu the user was last using
	}

	var worldElem, saveWrap;
	for (world in window.dat){
		// We're making it dynamically so that we can easily add more worlds as needed
		document.getElementById("world-divs-wrap").innerHTML+="<div class='world-wrap' id='world-"+world+"'></div>"
		document.getElementById("world-buttons-wrap").innerHTML+="<button class='set-button' id='setMain' onclick='setWorld(\""+world+"\")'>"+world+"</button>";

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
		swt="<tr>"; // Apparently doing `saveWrap.innerHTML+="<tr>"` adds a `</tr>` too
		for (i=1; i<=window.saveSlots; i++){
			swt+="<td><button id='load-"+world+"-"+i+"' class='ls-button' onclick='loadState(\""+world+"\", "+i+")'>Load "+world[0]+i+"</td>";
		}
		swt+="</tr><tr>"
		for (i=1; i<=window.saveSlots; i++){
			swt+="<td><button id='save-"+world+"-"+i+"' class='ls-button' onclick='saveState(\""+world+"\", "+i+")'>Save "+world[0]+i+"</td>";
		}
		swt+="</tr>";
		saveWrap.innerHTML=swt;

		// Trying to add it to each element doesn't work for some unknown reason
		// It works for the event share button, but not the main one????????????
		document.addEventListener("click", function(e){
			if (e.target.getAttribute("class").indexOf("share-wrap")!=-1){
				e.target.setSelectionRange(0, e.target.value.length);
			}
		})
	}

	// Get box elements
	var index, boxes=["add", "seq", "prob", "save", "loop", "share"], world;
	for (index=0; index<boxes.length; index++){
		window[boxes[index]+"Box"]={};
		for (world in window.dat){
			window[boxes[index]+"Box"][world]=document.getElementById("cap-"+boxes[index]+"-"+world);
		}
	}

	/*if (localStorage.getItem("type")==null){
		setType(window.currentWorld);
	} else {
		setType(localStorage.getItem("type"));
	}*/
	var world, capKey, index;
	for (world in window.dat){
		for (capKey in window.dat[world].capNames){
			window.addBox[world].innerHTML+="<button class='cap cap-"+capKey+"' onclick=\"addCapsule('"+capKey+"', '"+world+"')\" title='"+window.dat[world].capNames[capKey]+"'></button>";
		}
		window.addBox[world].innerHTML+="<button class='cap cap-x' onclick=\"addCapsule('x', '"+world+"')\"></button>";
		window.addBox[world].innerHTML+="<button class='cap cap--' onclick=\"addCapsule('-', '"+world+"')\"></button>";
		for (index=0; index<window.dat[world].loop.length; index++){
			capKey=window.dat[world].loop[index];
			window.loopBox[world].innerHTML+="<b class='cap cap-"+capKey+"'>"+(index+1)+"</b>";
		}
	}

	if (localStorage.getItem("portedOld")!="1"){
		var oldSave;
		for (index=0; index<=3; index++){
			oldSave=localStorage.getItem("data"+index);
			console.log(oldSave);
			if (oldSave!=null){
				saveState("main", index, oldSave);
			}
		}
		localStorage.setItem("portedOld", "1");
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
	var world, index,
		ni, nt, ntsum, dists,
		loopCaps, probe, probeHTML;
	for (world in window.dat){
		ni=getNextIndexes(world);
		loopCaps=document.querySelectorAll("#cap-loop-"+world+" .cap");

		// Show the current capsule sequences
		window.seqBox[world].innerHTML="";
		for (index=0; index<window.dat[world].currentSeq.length; index++){
			window.seqBox[world].innerHTML+="<b class='cap cap-"+window.dat[world].currentSeq[index]+"'></b>";
		}

		// Remove the green highlight from all capsules
		for (index=0; index<window.dat[world].loop.length; index++){
			loopCaps[index].classList.remove("sel");
		}
		// Add a green highlight to all possible next capsules
		if (window.dat[world].currentSeq!=""){
			for (index=0; index<window.dat[world].loop.length; index++){
				if (ni.indexOf(index)!=-1){ // if index in nextCapsuleIndexes
					loopCaps[index].classList.add("sel");
				}
			}

			for (index=1; index<=window.saveSlots; index++){
				if (localStorage.getItem("save-"+world+"-"+index)!=null){
					if (localStorage.getItem("save-"+world+"-"+index)!=window.dat[world].currentSeq){
						document.getElementById("save-"+world+"-"+index).style.borderColor="red";
					} else {
						document.getElementById("save-"+world+"-"+index).style.borderColor="green";
					}
				}
			}
		}

		// Render the probability boxes
		probe=window.probBox[world];
		probe.innerHTML="";
		if (ni.length>0){ // If there are no possible next capsules, do nothing
			nt=getNextTypes(world); // How many next capsules are Wood, Stone, etc.
			dists=getDists(world); // {"W":"1-2", "S":"3-6", "U":"1"} (Not an actual output)
			ntsum=0;
			// Attempting to do `probe.innerHTML+="<div>"` also adds a `</div>`, so we're doing it all at once later
			probeHTML="";
			for (index in nt){ntsum+=nt[index];}
			for (index in window.dat[world].capNames){
				probeHTML+="<div class='cprob'>";
				probeHTML+="<b class='cap cap-"+index+"'></b><br/>"; // The capsule icon
				probeHTML+=(index in nt?nt[index]:0)+"<br/>"; // The amount of next capsules that are that type
				probeHTML+=((index in nt?nt[index]:0)/ntsum*100).toFixed(2)+"%<br/>"; // The probability
				probeHTML+=dists[index]+"</div>"; // The min/max number of capsules until this type
				probe.innerHTML=probeHTML;
			}
		}
		// Write the hotlink to the share button thingy
		window.shareBox[world].value=window.location.href.split("#")[0]+"#"+window.dat[world].currentSeq+"&"+world;
	}
}

function getNextIndexes(world){
	var loop=window.dat[world].loop,
		seq=window.dat[world].currentSeq,
		start, delta, valid, ret=[];
	if (window.dat[world].currentSeq==""){return ret;}
	for (start=0; start<loop.length; start++){
		valid=true;
		for (delta=0; delta<seq.length; delta++){
			if (seq[delta]!=loop[(start+delta)%loop.length] && seq[delta]!="x"){ // "x" is wildcard
				// If there's a mismatch, `start` isn't a starting point, so whatever end we get doesn't work
				valid=false;
				break;
			}
		}
		if (valid){
			ret.push((start+delta)%loop.length);
		}
	}
	return ret;
}

function getNextTypes(world){
	var loop=window.dat[world].loop,
		ni=getNextIndexes(world),
		index, type, ret={};
	for (type in window.dat[world].capNames){ret[type]=0;} // Initialize all the values
	for (index=0; index<ni.length; index++){
	//	[[[[[Index hell]]]]]
		ret[loop[ni[index]]]+=1; // If the capsule is wood, add one to the wood slot
	}
	return ret;
}

function getDists(world){
	var type, index, delta, ret={},
		ni=getNextIndexes(world), min, max;
	for (type in window.dat[world].capNames){
		ret[type]=[];
		for (index=0; index<ni.length; index++){
			for (delta=0; window.dat[world].loop[(ni[index]+delta)%window.dat[world].loop.length]!=type; delta++){
				// I mean, it *works*
			}
			ret[type].push(delta+1);
		}
		min=Math.min.apply(null, ret[type]); // I just read a MDN page on how to do this
		max=Math.max.apply(null, ret[type]); // I don't actually understand why you need the `null`
		if (min==max){
			ret[type]=min.toString();
		} else {
			ret[type]=min+"-"+max;
		}
	}
	return ret;
}

function saveState(world, slot, state){
	if (state===undefined){state=window.dat[world].currentSeq;}
	localStorage.setItem("save-"+world+"-"+slot, state);
	render();
}
function loadState(world, slot){
	var state=localStorage.getItem("save-"+world+"-"+slot);
	if (state==null){state="";}
	window.dat[world].currentSeq=state;
	render();
}
