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
					{
						"name":name,
						"requirements":requirement,
						"reward":reward
					},
					...
				],
				"rank":rank
			},
			...
		}
	*/
	window.state={};
	// Initialize the state
	// Generate from the JSON, so only one part needs to be edited
	// The idea is that only the JSON needs to be edited to add ranks/worlds
	for (world in window.dat){
		window.state[world]={
			"rank":null,
			"missions":[]
		}
	}
	// Div containing the stuff for each world
	for (world in window.dat){
		mhtml="<div world='"+world+"'>"
		mhtml+="<div id='wrap-rank-"+world+"'><select id='rank-"+world+"'>"
		for (rank=0; rank<window.dat[world].length; rank++){
			mhtml+="<option value='"+rank+"'>Rank "+(rank+1)+"</option>"
		}
		mhtml+="</select><button onclick='genMissionTable(\""+world+"\")'>Select rank</button></div>"
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
		rank=parseInt(document.getElementById("rank-"+world).value),
		shtml,
		mission,
		rankMissions,
		rows;
	// Set the rank for the selected world
	window.state[world]["rank"]=rank;
	// Quick shorthand
	rankMissions=window.dat[world][rank]["missions"];
	shtml="<table>"
	for (mission=0; mission<rankMissions.length; mission++){
		shtml+="<tr mission='"+mission+"'>"
		shtml+="<td>"+rankMissions[mission]["name"]+"</td>"
		shtml+="<td>"+rankMissions[mission]["requirement"]+"</td>"
		shtml+="<td>"+rankMissions[mission]["reward"]+"</td>"
		shtml+="</tr>"
	}
	shtml+="</table>"
	shtml+="<button onclick='genMissionTrack(\""+world+"\")'>Use these as current missions</button>"
	// "[@g]"  => A picture of the gold currency
	// "[@01]" => The farmer industry icon
	shtml=shtml.replace(/\[@(.*?)\]/g, "<img src='img/$1.png'>")
	selectWrap.innerHTML=shtml;

	// -----
	// Add the highlight on click stuff
	// -----
	rows=document.querySelectorAll("#wrap-select-"+world+" tr");
	clickFunc=function(e){
		if (!this.classList.contains("selected")){
			if (document.querySelectorAll("#wrap-select-"+world+" tr.selected").length<3){
				// Only 3 missions can be running at the same time
				this.classList.add("selected");
				var i=window.state[world]["missions"].indexOf(parseInt(this.getAttribute("mission")))
				window.state[world]["missions"].push(parseInt(this.getAttribute("mission")))
			}
		} else {
			this.classList.remove("selected");
			window.state[world]["missions"].splice(i,1);
		}
	}
	for (mission=0; mission<rows.length; mission++){
		// Add the event listener
		rows[mission].addEventListener("click", clickFunc)
	}
}

function genMissionTrack(world){

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
	trackWrap.innerHTML=thtml;
}
function complete(world, mission){
	var tracker=document.getElementById("tracker-"+world),
		e=document.querySelector("#tracker-"+world+" tr[mission='"+mission+"']"),
		thtml="";
	e.parentElement.removeChild(e);
	if (window.state[world]["nextMission"]!=-1){
		thtml+="<tr>"
	}
}