window.sequence="SWWWWIWWWWSWWWSWWWWSWWWWSWWWWSWWWWSWWWWSWWWWWSWWWWSWWWWSWWWWWWSWWWSWWWIWWWSWWWSWWWSWWWSWWWSWWWSWWWSWWSWWWWSWWWWSWWWSWWWUWWWSWWWIWWWWSWWWWWSWWWSWWWSWWWWSWWWWSWWWSWWWSWWWWSWWWWSWWSWWWSWWWSWWWWWIWWWSWWWWSWWWWSWWWWSWWWWWWSWWWWSWWWWSWWWWSWWWWEWW";
window.capsules=window.location.hash.substr(1,window.location.hash.length-1);

window.onload=function(){
	// Prevent double-tapping from zooming in on webpage
	document.addEventListener("touchend", function(e){e.preventDefault(); e.target.click();});
	// The save data button
	window.saveButton=document.getElementById("save");
	var i;
	// Put all the boxes on screen in order
	for (i=0; i<window.sequence.length; i++){
		document.getElementById("cap-list").innerHTML+="<b class='cap cap-"+window.sequence[i]+"'>"+(i+1)+"</b>";
	}
	window.capList=document.querySelectorAll("#cap-list .cap");
	render();
}

// The real meat-and-potatos of the program
// The `int main()`
// The core function
// The... this joke is already stale, isn't it?
function render(){
	var i, probe=document.getElementById("cap-prob"), prob=0, ni=getNextIndexes(), nt=getNextTypes(), dc="";
	// If the current sequence is the saved sequence, make the save button green
	// If not, make it red (Yellow on white doesn't work well)
	window.saveButton.style.borderColor=(window.capsules!=localStorage.getItem("data")?"red":"green");
	// Display the current box list
	probe.innerHTML=""; // Remove all of the data
	for (i=0; i<window.capsules.length; i++){
		dc=window.capsules[i];
		if (dc=="*"){dc="x"}
		probe.innerHTML+="<b class='cap cap-"+dc+"'></b>";
	}
	if (ni.length!=0){
		probe.innerHTML+="<br/>";
		// Display the probability of each possible next box
		for (var t in nt){
			prob=(nt[t]/ni.length*100).toFixed(2)+"%"; // 22.25%
			probe.innerHTML+="<span class='prob'><b class='cap cap-"+t+"'></b>:"+nt[t]+" ("+prob+")</span>";
		}
	}

	// Remove all highlights
	window.capList.forEach(function(v,i){v.classList.remove("sel");})
	// Highlight all possible next boxes
	window.capList.forEach(function(v,i){
		if (ni.indexOf(i)!=-1){
			window.capList[i].classList.add("sel");
		}
	})
}


function addCapsule(s){
	if (s!="-"){ // Add a capsule
		window.capsules+=s;
	} else { // Remove a capsule
		window.capsules=window.capsules.substr(0, window.capsules.length-1);
	}
	// Set the window anchor to the current capsule sequence
	// This allows for easy sharing
	window.location.hash="#"+window.capsules;
	render();
}

// If the current sequence is WWS, then it the indexes of every capsule after a WWS sequence
// seq="WWS"; caps="WWSEWWSU"; getNextIndexes() -> [3,7]
function getNextIndexes(){
	var ret=[], i, j, val;
	if (window.capsules.length==0){return ret;}
	for (i=0; i<window.sequence.length; i++){ // For all possible starting capsules
		val=true;
		for (j=0; j<window.capsules.length; j++){ // For all recorded capsules
			if (window.capsules[j]!=window.sequence[(i+j)%window.sequence.length] && window.capsules[j]!="*"){
				// If there's a mismatch, then this isn't a possible starting capsule
				val=false;
				break;
			}
		}
		if (val){
			ret.push((i+window.capsules.length)%window.sequence.length);
		}
	}
	return ret
}

// Take the result of getNextIndexes() and count how many capsules of each type occur
function getNextTypes(){
	var ret={"W":0, "S":0, "I":0, "E":0, "U":0}, ni=getNextIndexes();
	for (var i=0; i<ni.length; i++){
		ret[window.sequence[ni[i]]]+=1;
	}
	return ret;
}

function loadData(){
	var data=localStorage.getItem("data");
	window.location.hash="#"+data;
	window.capsules=data;
	render();
}
function saveData(){
	localStorage.setItem("data", window.location.hash.substr(1, window.location.hash.length-1));
	render();
}