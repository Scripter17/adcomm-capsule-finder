// https://adventurecommunist.fandom.com/wiki/Space
// https://adventurecommunist.fandom.com/wiki/Crusade


window.onload=main;
async function main(){
	var world, cworld,
		indus, cindus,
		build, cbuild,
		card, ccard,
		bname,
		mainDiv=document.getElementById("main-div"),
		htmlTMP="",
		boost,
		boostType;
	await fetch("/dat.json").then(res=>res.json()).then(res=>{window.dat=res;});

	htmlTMP+="<table><tr>";
	for (world in window.dat){
		htmlTMP+="<td><button class='set-world' id='set-world-"+world+"'>"+world+"</button></td>";
	}
	htmlTMP+="</tr></table>";
	for (world in window.dat){
		htmlTMP+="<table class='set-indus-wrap' id='set-indus-"+world+"'><tr>"
		for (indus in window.dat[world]){
			htmlTMP+="<td><button class='set-indus' id='set-indus-"+world+"-"+indus+"'>"+indus+"</button></td>";
		}
		htmlTMP+="</tr></table>"
	}

	//boost=calcBoosts();
	for (world in window.dat){
		cworld=window.dat[world]
		htmlTMP+="<table id='world-"+world+"'><tr>";
		for (indus in cworld){
			cindus=cworld[indus]
			htmlTMP+="<td id='indus-"+indus+"'>";
			for (card in cindus["cards"]){
				ccard=cindus["cards"][card]
				bm=0//boost[world][indus]["cards"][ccard["type"]]
				beforeV=afterV="aa"
				htmlTMP+="<table><tr><td>"+ccard["name"]+"</td></tr>"
				htmlTMP+="<tr><td><input type='number' value='0' min='0' max='"+ccard["multiplier"].length+"' id='cardlev-"+world+"-"+indus+"-null-"+ccard["type"]+"'/></td></tr>"
				htmlTMP+="</table>"
			}
			for (build in cindus["buildings"]){
				noCard={"speed":0, "power":0, "chance":0, "boost":0, "discount":0};
				cbuild=cindus["buildings"][build]
				bname=cbuild["name"]
				htmlTMP+="<table id='build-"+build+"'>";
				htmlTMP+="<tr><td><img src='img/build"+build+".png' alt='"+bname+"'></td><td>"+bname+"</td></tr>"
				for (boostType in noCard){
					isCard=false;
					for (card in cbuild["cards"]){
						if (cbuild["cards"][card]["type"]==boostType){
							isCard=true;
							ccard=cbuild["cards"][card]
						}
					}
					//bm=null//boost[world][indus][build][ccard["type"]]
					bm="<span id='bm-"+world+"-"+indus+"-"+build+"-"+boostType+"'>null</span>"
					if (isCard){
						//ccard=cbuild["cards"][card];
						//bm=boost[world][indus][build][ccard[type]];
						//bm=555
						//console.log(ccard)
						beforeV=afterV="aa"
						htmlTMP+="<tr><td><table><tr><td>"+ccard["name"]+"</td></tr>"
						htmlTMP+="<tr><td><input type='number' value='0' min='0' max='"+ccard["multiplier"].length+"' id='cardlev-"+world+"-"+indus+"-"+build+"-"+ccard["type"]+"'/></td></tr></table></td>"
						htmlTMP+="<td><table><tr><td><img src='img/type-"+ccard["type"]+".png' alt='"+boostType+"'></td><td>"+bm+"</td></tr>"
						if (boostType=="speed" || boostType=="power" || boostType=="discount"){
							htmlTMP+="<tr><td>"+beforeV+"</td><td>"+afterV+"</td></tr>"
						}
						htmlTMP+="</table>"
					} else {
						//bm=444
						beforeV=afterV="bb"
						htmlTMP+="<tr><td colspan='2'><table><tr><td><img src='img/type-"+boostType+".png' alt='"+boostType+"'></td><td>"+bm+"</td></tr>"
						if (boostType=="speed" || boostType=="power" || boostType=="discount"){
							htmlTMP+="<tr><td>"+beforeV+"</td><td>"+afterV+"</td></tr>"
						}
						htmlTMP+="</table>"
					}
				}
				htmlTMP+="</table>"
			}
		}
		htmlTMP+="</tr></table>";
	}
	mainDiv.innerHTML=htmlTMP;

	writeVals();
}
function writeVals(){
	var world, cworld,
		indus, cindus,
		build, cbuild,
		boost, boostType;
	boost=calcBoosts();
	for (world in window.dat){
		cworld=window.dat[world]
		for (indus in cworld){
			cindus=cworld[indus]
			for (build in cindus["buildings"]){
				cbuild=cindus["buildings"][build]
				for (boostType in {"speed":0, "power":0, "chance":0, "boost":0, "discount":0}){
					document.getElementById("bm-"+world+"-"+indus+"-"+build+"-"+boostType).innerHTML=boost[world][indus][build][boostType]
				}
			}
		}
	}
}
function getValue(world, indus, build, card){
	console.trace();
	console.log(world, indus, build, card);
	if (build==null){
		var c=window.dat[world][indus]["cards"][card]
	} else {
		var c=window.dat[world][indus]["buildings"][build]["cards"][card]
	}
	console.log(c)
	var e=document.getElementById("cardlev-"+world+"-"+indus+"-"+build+"-"+c["type"]);
	return c["multiplier"][parseInt(e.value)];
}
function stackValues(a, b, type){
	return a+b;
}
function calcBoosts(){
	var world, ret={};
	for (world in window.dat){
		// For every world
		ret[world]={}
		cworld=window.dat[world]
		for (indus in cworld){
			// For every industry
			ret[world][indus]={}
			cindus=cworld[indus]
			for (build in cindus["buildings"]){
				// For every building
				ret[world][indus][build]={};
				cbuild=cindus["buildings"][build]
				for (card in cbuild["cards"]){
					// For every card in the building
					ccard=cbuild["cards"][card]
					//console.log(world, indus, build, ccard["type"], ret[world][indus][build][ccard["type"]])
					if (ret[world][indus][build][ccard["type"]]==undefined){
						// If the value doesn't exist, write it
						ret[world][indus][build][ccard["type"]]=getValue(world, indus, build, card)
					} else {
						// Properly add values
						a=ret[world][indus][build][ccard["type"]];
						b=getValue(world, indus, build, card)
						ret[world][indus][build][ccard["type"]]=stackValues(a, b, card)
					}
					//console.log(world, indus, build, ccard["type"], ret[world][indus][build][ccard["type"]])
				}
				for (card in cindus["cards"]){
					ccard=cindus["cards"][card]
//					for (build in cindus["buildings"]){
						a=ret[world][indus][build][ccard["type"]];
						b=getValue(world, indus, null, card)
						ret[world][indus][build][ccard["type"]]=stackValues(a, b, ccard["type"])
//					}
				}
			}
		}
	}
	return ret
}

/*
<tr>
	<td><img src="ico.png"></td>
	<td>
		<table>
		<tr><td>Farmer</td></tr>
		<tr><td>Cost:1c+1p</td></tr>
		<tr><td>Output:3p</td></tr>
		<tr><td>Time:2s</td></tr>
	</td>
</tr>
*/

/*

<table>
	<tr><td>main</td><td>space</td><td>crusade</td></tr>
	<tr id="indus-wrap-main">
		<td>Potato</td>
		<td>Land</td>
		<td>Ore</td>
		<td>Bullet</td>
		<td>Placebo</td>
		<td>Supreme</td>
	</tr>
	<tr id="indus-wrap-space">...</tr>
	...

*/