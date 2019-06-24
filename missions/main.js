window.onload=init;
async function init(){
	var world, mhtml, rank;
	// The JSON data for the game
	// 4 worlds, 139 ranks, and a fuckton of missions
	await fetch("dat.json").then(res=>res.json()).then(res=>{window.dat=res;});
	/*
		window.state={
			world:{
				"missions":[
					index,
					...
				],
				"rank":rank
			},
			...
		}
	*/
	// Initialize the state
	// Generate from the JSON, so only one part needs to be edited
	// The idea is that only the JSON needs to be edited to add ranks/worlds
	window.state={};
	for (world in window.dat){
		window.state[world]={
			"rank":0,
			"missions":[],
			"nextMission":null
		}
	}
	// Div containing the stuff for each world
	for (world in window.dat){
		mhtml="<div id='wrap-world-"+world+"'>"
			mhtml+="<div id='wrap-rank-"+world+"'>"
				mhtml+="<select onchange='window.state[\""+world+"\"].rank=+this.value' id='rank-"+world+"'>"
				for (rank=0; rank<window.dat[world].length; rank++){
					mhtml+="<option value='"+rank+"'>Rank "+(rank+1)+"</option>"
				}
				mhtml+="</select>"
				mhtml+="<button onclick='genMissionTable(\""+world+"\")'>Select rank</button>"
			mhtml+="</div>"
			mhtml+="<div id='wrap-select-"+world+"'></div>"
			mhtml+="<div id='wrap-track-"+world+"'></div>"
		mhtml+="</div>"
	}
	document.getElementById("wrap-all").innerHTML=mhtml;
	//window.sr=document.getElementById("select-rank");
	//window.sc=document.getElementById("select-current");
	//window.tm=document.getElementById("track-missions");
}



function genMissionTable(world){
	var selectWrap=document.getElementById("wrap-select-"+world),
		rank=window.state[world]["rank"],
		shtml,
		mission,
		rankMissions;
	// Quick shorthand
	rankMissions=window.dat[world][rank]["missions"];
	shtml="<table id='select-"+world+"'>"
	for (mission=0; mission<rankMissions.length; mission++){
		shtml+="<tr onclick='missionSelectClick(\""+world+"\", this)' mission='"+mission+"'>"
		shtml+="<td>"+rankMissions[mission]["name"]+"</td>"
		shtml+="<td>"+rankMissions[mission]["requirement"]+"</td>"
		shtml+="<td>"+rankMissions[mission]["reward"]+"</td>"
		shtml+="</tr>"
	}
	shtml+="</table>"
	shtml+="<button onclick='applyMissions(\""+world+"\")'>Use these as current missions</button>"
	// "[@g]"  => A picture of the gold currency
	// "[@01]" => The farmer industry icon
	shtml=shtml.replace(/\[@(.*?)\]/g, "<img src='img/$1.png'>")
	selectWrap.innerHTML=shtml;
}



function missionSelectClick(world, e){

	e.classList.toggle("selected")
	if (document.querySelectorAll("#wrap-select-"+world+" tr.selected").length>3){
		e.classList.remove("selected")
	}
	
	/*if (!this.classList.contains("selected")){
		if (document.querySelectorAll("#wrap-select-"+world+" tr.selected").length<3){
			// Only 3 missions can be running at the same time
			this.classList.add("selected");
			var i=window.state[world]["missions"].indexOf(parseInt(this.getAttribute("mission")))
			window.state[world]["missions"].push(parseInt(this.getAttribute("mission")))
		}
	} else {
		this.classList.remove("selected");
		window.state[world]["missions"].splice(i,1);
	}*/
}

function applyMissions(world){
	var i,
		missionElems=document.querySelectorAll("#select-"+world+" tr.selected");
	for (i=0; i<missionElems.length; i++){
		window.state[world]["missions"].push(+missionElems[i].getAttribute("mission"));
	}
	window.state[world]["nextMission"]=Math.max.apply(null, window.state[world]["missions"])+1
	genMissionTrack(world)
}

function genMissionTrack(world){
	var i,
		thtml="",
		rank=window.state[world]["rank"],
		cmission;
	var missions=window.dat[world][rank]["missions"]
	thtml+="<table>"
	for (i=0; i<window.state[world]["missions"].length; i++){
		cmission=missions[window.state[world]["missions"][i]]
		thtml+="<tr>"
		thtml+="<td>"+cmission["name"]+"</td>"
		thtml+="<td>"+cmission["requirement"]+"</td>"
		thtml+="<td>"+cmission["reward"]+"</td>"
		thtml+="<td><button onclick='finishMission(\""+world+"\", "+window.state[world]["missions"][i]+")'>Complete</button>"
		thtml+="</tr>"
	}
	thtml+="</table>"
	thtml+="<button onclick='rankUp(\""+world+"\")'>Rank up</button>"
	document.getElementById("wrap-track-"+world).innerHTML=thtml

	/*
	// -----
	// Get next mission ID
	// If the last mission was added, set it to -1
	// -----
	window.state[world]["nextMission"]=Math.max.apply(null, window.state[world]["missions"])+1
	if (window.state[world]["nextMission"]>=window.dat[world][rank]["missions"]){window.state[world]["nextMission"]=-1;}

	// -----
	// Generate the tracking table
	// -----
	var thtml,
		i,
		mission,
		rank=window.state[world]["rank"],
		rankMissions=window.dat[world][window.state[world]["rank"]]["missions"],
		trackWrap=document.getElementById("wrap-track-"+world);
	thtml="<table id='tracker-"+world+"'>"
	for (i=0; i<window.state[world]["missions"].length; i++){
		mission=window.state[world]["missions"][i];
		thtml+="<tr mission='"+mission+"'>"
		thtml+="<td>"+rankMissions[mission]["name"]+"</td>"
		thtml+="<td>"+rankMissions[mission]["requirement"]+"</td>"
		thtml+="<td>"+rankMissions[mission]["reward"]+"</td>"
		thtml+="<td><button onclick='complete(\""+world+"\", "+mission+")'>Completed</button></td>"
		thtml+="</tr>"
	}
	thtml+="</table>"
	trackWrap.innerHTML=thtml;*/
}

function finishMission(world, mission){
	if (window.state[world]["nextMission"]<window.dat[world][window.state[world]["rank"]]["missions"].length){
		window.state[world]["missions"].push(window.state[world]["nextMission"])
	}
	window.state[world]["missions"].splice(window.state[world]["missions"].indexOf(mission),1)
	window.state[world]["nextMission"]++;
	console.log(window.state[world]["missions"])
	genMissionTrack(world)
}

function rankUp(world){
	window.state[world]["rank"]++;
	window.state[world]["missions"]=[0,1,2]
	window.state[world]["nextMission"]=3
	genMissionTrack(world);
}