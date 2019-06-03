window.onload=main;
async function main(){
	var world, cworld,
		indus, cindus,
		build, cbuild,
		attr, cattr,
		card, ccard,
		cattr, ccattr,
		mainDiv=document.getElementById("main-div"),
		wiHTML, wbHTML, ibHTML,
		worldButtons, wbHTML,
		indusButtons, inHTML,
		cardWrap, cwHTML;
	await fetch("/dat.json").then(res=>res.json()).then(res=>{window.dat=res;});

	/*wiHTML="<table id='wi-button-wrap'>"
	for (world in window.dat){
		wiHTML+="<tr><td><table><tr><td><button onclick='setWorld(\""+world+"\")'>"+world+"</button></td></tr><tr>"
		for (indus in window.dat[world]){
			wiHTML+="<td><button onclick='setIndus(\""+world+"\", \""+indus+"\")'>"+indus+"</button></td>"
		}
		wiHTML+="</tr></table></td></tr>"
	}
	wiHTML+="</table>";*/
	wiHTML="<table id='world-button-wrap'><tr>"
	for (world in window.dat){
		wiHTML+="<td><button onclick='setWorld(\""+world+"\")'>"+world+"</button></td>"
	}
	wiHTML+="</tr></table>"
	for (world in window.dat){
		wiHTML+="<table id='"+world+"-button-wrap'><tr>"
		for (indus in window.dat[world]){
			wiHTML+="<td><button onclick='setIndus(\""+world+"\", \""+indus+"\")'>"+indus+"</button></td>"
		}
		wiHTML+="</tr></table>"
	}
	mainDiv.innerHTML+=wiHTML

	for (world in window.dat){
		mainDiv.innerHTML+="<table id='cards-"+world+"-wrap'></table>"
		cardWrap=document.getElementById("cards-"+world+"-wrap");
		cwHTML=""
		cworld=window.dat[world];
		cwHTML+="<table id='industry-"+world+"'><tr>" // Industry wrapper
		// Industry cards (discount and stuff)
		for (indus in cworld){
			cindus=cworld[indus];
			cwHTML+="<td id='call-"+world+"-"+indus+"'>" // World type wrapper
			for (card in cindus["cards"]){
				ccard=cindus["cards"][card];
				cwHTML+="<table>" // Attribute wrapper
				for (cattr in ccard){
					ccattr=ccard[cattr];
					cwHTML+="<tr><td>"+cattr+":"+ccattr+"</td></tr>"
				}
				cwHTML+="</table>" // Close attributes
			}
			// Building specific cards
			cwHTML+="<table id='cspe-"+world+"'><tr><td>"
			for (build in cindus["buildings"]){
				cbuild=cindus["buildings"][build];
				cwHTML+="<table id='cspe-"+world+"-"+build+"'>" // Building wrapper
				for (attr in cbuild){
					if (attr=="cspe"){continue;}
					cattr=cbuild[attr];
					cwHTML+="<tr><td>"+attr+":"+cattr+"</td></tr>"
				}
				cwHTML+="<tr><td><table>"
				for (card in cbuild["cards"]){
					ccard=cbuild["cards"][card]
					for (attr in ccard){
						cattr=ccard[attr]
						cwHTML+="<tr><td>"+attr+":"+cattr+"</td></tr>"
					}
				}
				cwHTML+="</table></td></tr>"
				cwHTML+="</table>"
			}
			cwHTML+="</td></tr></table>"
		}
		cwHTML+="</tr></table>"
		cardWrap.innerHTML=cwHTML;
	}
	cardWrap.innerHTML=cwHTML
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