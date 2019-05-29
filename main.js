window.sequence="\
SWWWWIWWWWSWWWSWWWWS\
WWWWSWWWWSWWWWSWWWWS\
WWWWWSWWWWSWWWWSWWWW\
WWSWWWSWWWIWWWSWWWSW\
WWSWWWSWWWSWWWSWWWSW\
WSWWWWSWWWWSWWWSWWWU\
WWWSWWWIWWWWSWWWWWSW\
WWSWWWSWWWWSWWWWSWWW\
SWWWSWWWWSWWWWSWWSWW\
WSWWWSWWWWWIWWWSWWWW\
SWWWWSWWWWSWWWWWWSWW\
WWSWWWWSWWWWSWWWWEWW"; // Each row is 20 long
window.capsules="";

window.onload=function(){
	if (navigator.userAgent.indexOf("MSIE ")!=-1 || navigator.userAgent.indexOf("Trident/")!=-1){
		// https://stackoverflow.com/a/21712356/10720231
		// I will not be removing this.
		document.body.innerHTML="";
		alert("Why are you using IE?");
		alert("Why are you making us web developers suffer because you want to use a browser from the 1750's?");
		alert("Do you know how painful it is to make stuff work on that *atrocity* of a web browser?");
		alert("Furthermore, are you unaware of all the security holes in it?");
		alert("How about the fact that FireFox and Chrome actually try to keep you safe, AND act like software made in this century.");
		alert("The most basic of stuff takes hours in IE, the web standards that every browser is supposed to follow is ignored by IE.")
		while (true){
			alert("WHY WOULD YOU USE INTERNET EXPLORER IN THE 21ST CENTURY");
		}
	}
	// Prevent double-tapping from zooming in
	document.addEventListener("touchend", function(e){e.preventDefault(); e.target.click();});

	// The save data button
	window.capList=document.getElementById("cap-list");
	window.capProb=document.getElementById("cap-prob");
	window.capCaps=document.getElementById("cap-caps");
	window.shareButton=document.getElementById("share");
	window.probWrap=document.getElementById("prob-wrap");
	window.cprob={
		"W":document.getElementById("cprob-W"),
		"S":document.getElementById("cprob-S"),
		"I":document.getElementById("cprob-I"),
		"E":document.getElementById("cprob-E"),
		"U":document.getElementById("cprob-U")
	};
	window.saveButtons=[
		document.getElementById("save1"),
		document.getElementById("save2"),
		document.getElementById("save3")
	]
	var i;
	// Put all the boxes on screen in order
	for (i=0; i<window.sequence.length; i++){
		window.capList.innerHTML+="<b class='cap cap-"+window.sequence[i]+"'>"+(i+1)+"</b>";
	}
	window.capListCaps=document.querySelectorAll("#cap-list .cap");
	if (window.location.hash.length>1){
		window.capsules=window.location.hash.substr(1,window.location.hash.length-1);
	} else if (localStorage.getItem("data0")!=null){
		loadData(0);
	}
	window.shareButton.addEventListener("click", function(e){this.setSelectionRange(0, this.value.length)});
	render();
}

// The real meat-and-potatoes of the program
// The `int main()`
// The core function
// The... this joke is already stale, isn't it?
function render(){
	var i, t, d, e, min, max,
		prob=0,
		ni=getNextIndexes(window.sequence, window.capsules),
		nt=getNextTypes(window.sequence, window.capsules),
		dc="";

	// Properly color-code each save button
	// Green=The current sequence is the saved sequence
	// Red=The current sequence is not the saved sequence
	for (i=0; i<3; i++){
		// Note: Very rarely do I get to use `i<3`, so I'm pretty happy about this
		window.saveButtons[i].style.borderColor=(window.capsules!=localStorage.getItem("data"+(i+1))?"red":"green");
		// Fun fact: You can write to both `elem.style.borderColor` AND `elem.style["border-color"]` for the same effect
	}

	// Display the current capsule sequence
	window.capCaps.innerHTML="";
	for (i=0; i<window.capsules.length; i++){
		dc=window.capsules[i];
		window.capCaps.innerHTML+="<b class='cap cap-"+dc+"'></b>";
	}

	// This fucking mess handles displaying the "next capsule" stuff
	// Like 43 and 100% of the next capsules are wooden, you will get a supreme in 3-235 capsules, etc.
	if (ni.length!=0){
		// Calculate the "X capsule in Y-Z" string
		var dists={"W":[], "S":[], "I":[], "E":[], "U":[]};
		for (t in dists){
			for (i=0; i<ni.length; i++){
				// I mean, it *works*
				for (d=0; window.sequence[(ni[i]+d)%window.sequence.length]!=t; d++){}
				dists[t].push(d+1);
			}
			// Changed so that IE doesn't throw a hissy-fit
			min=Math.min.apply(null, dists[t]);
			max=Math.max.apply(null, dists[t]);
			/*if (min==max){
				dists[t]=min.toString();
			} else {
				dists[t]=min+"-"+max;
			}*/
			dists[t]=(min==max?min.toString():min+"-"+max);
		}
		for (t in nt){
			e=window.cprob[t];
			e.innerHTML="<b class='cap cap-"+t+"'></b>";
			e.innerHTML+="<br/>"+nt[t];
			e.innerHTML+="<br/>"+(nt[t]/ni.length*100).toFixed(2)+"%";
			e.innerHTML+="<br/>"+dists[t];
		}
		window.probWrap.style.display="block";
	} else {
		window.probWrap.style.display="none";
	}

	window.shareButton.value=window.location.href.split("#")[0]+"#"+window.capsules;

	// Remove all highlights
	window.capListCaps.forEach(function(v,i){v.classList.remove("sel");});
	// Highlight all possible next boxes
	window.capListCaps.forEach(function(v,i){
		if (ni.indexOf(i)!=-1){
			v.classList.add("sel");
		}
	});
}


function addCapsule(s){
	if (s=="-"){ // Remove a capsule
		window.capsules=window.capsules.substr(0, window.capsules.length-1);
	} else { // Add a capsule
		window.capsules+=s;
	}
	// Set the auto-save data
	saveData(0);
	render();
}

// If the current sequence is WWS, then it the indexes of every capsule after a WWS sequence
// seq="WWS"; caps="WWSEWWSU"; getNextIndexes() -> [3,7]
function getNextIndexes(seq, cap){
	var ret=[], i, j, val;
	if (cap.length==0){return ret;}
	for (i=0; i<seq.length; i++){ // For all possible starting capsules
		val=true;
		for (j=0; j<cap.length; j++){ // For all recorded capsules
			// Wow, this is some *proper* spaghetti
			if (cap[j]!=seq[(i+j)%seq.length] && cap[j]!="x"){
				// If there's a mismatch, then this isn't a possible starting capsule
				val=false;
				break;
			}
		}
		if (val){
			ret.push((i+window.capsules.length)%window.sequence.length);
		}
	}
	return ret;
}

// Take the result of getNextIndexes() and count how many capsules of each type occur
function getNextTypes(seq, cap){
	var ret={"W":0, "S":0, "I":0, "E":0, "U":0}, ni=getNextIndexes(seq, cap);
	for (var i=0; i<ni.length; i++){ // for (x in arr) is deceptive, it doesn't work
		ret[seq[ni[i]]]+=1;
	}
	return ret;
}

// slot 0=auto; 1,2,3=manual
function loadData(slot){
	var data=localStorage.getItem("data"+slot);
	if (data==null){data="";}
	window.capsules=data;
	render();
}
function saveData(slot){
	localStorage.setItem("data"+slot, window.capsules);
	render();
}
