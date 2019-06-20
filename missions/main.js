window.onload=main
async function main(){
	await fetch("dat.json").then(res=>res.json()).then(res=>{window.dat=res;});

	window.rdiv=document.getElementById("main-rank");
	window.sdiv=document.getElementById("main-select");
	window.tdiv=document.getElementById("main-track");

	rhtml="Select your rank: <select id='rank'>";
	for (rank in window.dat){
		rhtml+="<option value='"+rank+"'>Rank "+rank+"</option>"
	}
	rhtml+="</select><button onclick='setRank()'>Set rank</button>"
	rdiv.innerHTML=rhtml
}

function setRank(){
	window.rdiv.style.display="none";
	window.currentRank=document.getElementById("rank").value;
	shtml="<table id='table-select'>"
	for (mission in window.dat[window.currentRank]["missions"]){
		cmission=window.dat[window.currentRank]["missions"][mission];
		shtml+="<tr class='sel-mission' data-mission='"+mission+"'><td>"+cmission["name"]+"</td>"
		shtml+="<td>"+cmission["requirement"]+"</td>"
		shtml+="<td>"+cmission["reward"]+"</td></tr>"
	}
	shtml+="</table>"
	shtml=shtml.replace(/\[@(.*?)\]/g, x=>"<img src='pics/"+x.substr(2,x.length-3)+".png'>")
	shtml+="<button onclick=setMissions()>Set these as current missions</button>"
	window.sdiv.innerHTML=shtml
	rows=document.getElementsByClassName("sel-mission");
	for (elem=0; elem<rows.length; elem++){
		rows[elem].addEventListener("click", function(){
			this.classList.toggle("selected")
			if (document.getElementsByClassName("selected").length>3){
				this.classList.toggle("selected")
			}
		})
	}
}

function setMissions(){
	window.sdiv.style.display="none";
	thtml=""
	window.currentMissions={};
	missionElements=document.getElementsByClassName("selected");
	for (i=0; i<missionElements.length; i++){
		window.currentMissions[parseInt(missionElements[i].getAttribute("data-mission"))]=i
	}
	console.log(window.currentMissions);

	thtml+="<table id='table-track'>"
	for (mission in window.currentMissions){
		cmission=window.dat[window.currentRank]["missions"][mission];
		thtml+="<tr class='track-mission' data-mission='"+mission+"'><td>"+cmission["name"]+"</td>"
		thtml+="<td><button onclick='finish("+mission+")'>Finish mission "+mission+"</td>"
		thtml+="</tr>"
	}
	thtml+="</table>"
	thtml+="<button onclick='rankUp()'>Rank Up</button>"
	thtml=thtml.replace(/\[@(.*?)\]/g, x=>"<img src='pics/"+x.substr(2,x.length-3)+".png'>")
	window.tdiv.innerHTML=thtml
}
function finishMission(){
	
}