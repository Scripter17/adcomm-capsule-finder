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
window.onload=function(){
	init();
}
function setType(t){
	document.body.setAttribute("type", t);
	localStorage.setItem("type", t);
	window.currentWorld=t;
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
		setType(window.currentWorld);
	} else {
		setType(localStorage.getItem("type"));
	}

	for (w in window.loops){
		for (x in window.capNames[w]){
			window.addBox[w].innerHTML+="<button class='cap cap-"+x+"' onclick='addCapsule(\""+x+"\", \""+w+"\")'></button>"
		}
		window.addBox[w].innerHTML+="<button class='cap cap-x' onclick=\"addCapsule('x', '"+w+"')\"></button>"
		window.addBox[w].innerHTML+="<button class='cap cap--' onclick=\"addCapsule('-', '"+w+"')\"></button>"
		for (i=0; i<window.loops[w].length; i++){
			x=window.loops[w][i];
			window.loopBox[w].innerHTML+="<b class='cap cap-"+x+"'>"+(i+1)+"</b>"
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
	render();
}
function render(){
	var w, i,
		ni, nt, ntsum, dists,
		loopc, pwrap, pwhtml;
	for (w in window.loops){
		loopc=document.querySelectorAll("#cap-loop-"+w+" .cap");
		pwrap=document.getElementById("cap-prob-"+w);
		pwrap.innerHTML="";
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

			nt=getNextTypes(w);
			dists=getDists(w);
			console.log(dists)
			ntsum=0;
			pwhtml="";
			for (i in nt){ntsum+=nt[i]}
			for (i in nt){
				pwhtml+="<div class='cprob'>"
				pwhtml+="<b class='cap cap-"+i+"'></b><br/>"
				pwhtml+=nt[i]+"<br/>"
				pwhtml+=(nt[i]/ntsum*100).toFixed(2)+"%<br/>";
				pwhtml+=dists[i]+"</div>";
				pwrap.innerHTML=pwhtml;
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
	var t, i, d, ret={}, ni=getNextIndexes(w), nt=getNextTypes(w), min, max;
	for (t in nt){
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