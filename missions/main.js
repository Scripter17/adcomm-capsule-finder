window.onload=init;
async function init(){
	var world, mhtml="", rank;
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
		if (window.dat[world]["type"]=="manual"){
			mhtml+="<div id='wrap-world-"+world+"'>"
				mhtml+="<div id='wrap-rank-"+world+"'>"
					mhtml+="<select onchange='window.state[\""+world+"\"].rank=+this.value' id='rank-"+world+"'>"
					for (rank=0; rank<window.dat[world]["ranks"].length; rank++){
						mhtml+="<option value='"+rank+"'>Rank "+(rank+1)+"</option>"
					}
					mhtml+="</select>"
					mhtml+="<button onclick='genMissionTable(\""+world+"\")'>Select rank</button>"
				mhtml+="</div>"
				mhtml+="<div id='wrap-select-"+world+"'></div>"
				mhtml+="<div id='wrap-track-"+world+"'></div>"
			mhtml+="</div>"
		} else {
			mhtml+="<div id='wrap-world-"+world+"'>"
				mhtml+="<div id='wrap-rank-"+world+"'>"
					mhtml+="<select onchange='window.state[\""+world+"\"].rank=+this.value' id='rank-"+world+"'>"
					for (rank=0; rank<window.dat[world]["ranks"].length; rank++){
						mhtml+="<option value='"+rank+"'>Rank "+(rank+1)+"</option>"
					}
					mhtml+="</select>"
					mhtml+="<button onclick='genMissionTable(\""+world+"\")'>Select rank</button>"
				mhtml+="</div>"
				mhtml+="<div id='wrap-select-"+world+"'></div>"
				mhtml+="<div id='wrap-track-"+world+"'></div>"
			mhtml+="</div>"
		}
	}
	document.getElementById("wrap-all").innerHTML=mhtml;
	//window.sr=document.getElementById("select-rank");
	//window.sc=document.getElementById("select-current");
	//window.tm=document.getElementById("track-missions");
}



