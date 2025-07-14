var open = false;

function node_list(elements){
	var fragment = document.createDocumentFragment();
	elements.forEach(function(item){fragment.appendChild(item)})
	return fragment.childNodes;
}

function togglefs(){
	if (window.screenTop && window.screenY){
		document.exitFullscreen();
	}else{
		document.documentElement.requestFullscreen(); 
	}
}

function togglemode(){
	if (localStorage.mode == "light_mode"){
		document.getElementById("dmbutton").id = "lmbutton"; 
		document.body.id = localStorage.mode = "dark_mode"; 
	}else{
		document.getElementById("lmbutton").id = "dmbutton"; 
		document.body.id = localStorage.mode = "light_mode"; 
	}
}

function togglenav(){
	if (open){
		document.getElementsByClassName("opennav")[0].classList.toggle("closenav"); 
		document.getElementById("sidenav").style.width = "0"; 
		document.getElementById("text").style.marginLeft = "0"; 
		if (window.innerWidth <= 700){
			document.getElementById("text").style.width = "calc(100vw - 40px)"; 
		}else{
			document.getElementById("text").style.width = "calc(100vw - 100px)"; 
		}
		document.getElementById("search").value = ""; 
		open = false; 
	}else{
		document.getElementsByClassName("opennav")[0].classList.toggle("closenav"); 
		document.getElementById("sidenav").style.width = "235px"; 
		document.getElementById("text").style.marginLeft = "235px"; 
		if (window.innerWidth <= 700){
			document.getElementById("text").style.width = "calc(100vw - 285px)"; 
		}else{
			document.getElementById("text").style.width = "calc(100vw - 335px)"; 
		}
		open = true;
	}
}

function filter(search){
	var count = 0; 

	for (var child of document.getElementById("sidenav").childNodes){
		if (child.tagName == "A"){
			if (child.innerHTML.toLowerCase().replace(/ *<span [^)]*>[^)]*<\/span> */g, "").includes(search.toLowerCase())){
				child.style.display = "block"; 
				document.getElementById("nothing").innerHTML = ""; 
				count++; 
			}else{
				child.style.display = "none"; 
			}
		}
	}
	if (count == 0) document.getElementById("nothing").innerHTML = "No search results found for ❝" + search + "❞. "; 
}

function ripple(event){
	const button = event.currentTarget, circle = document.createElement("span");

	circle.style.width = circle.style.height = Math.max(button.clientWidth, button.clientHeight) + "px"; 
	circle.style.left = event.clientX - button.offsetLeft - Math.max(button.clientWidth, button.clientHeight) / 2 + "px";
	circle.style.top = event.clientY - button.offsetTop - Math.max(button.clientWidth, button.clientHeight) / 2 + document.getElementById("text").scrollTop + "px";
	circle.classList.add("ripple");
	if (button.getElementsByClassName("ripple")[0]) button.getElementsByClassName("ripple")[0].remove();
	button.appendChild(circle);
}

function move(){
	const placeholder = event.currentTarget.childNodes[1]; 
	
	placeholder.style.fontSize = "14px"; 
	placeholder.style.top = "-8px"; 
	placeholder.style.color = "var(--tcolour)"; 
}

function reset(input){
	const placeholder = input.childNodes[1]; 
	placeholder.style.color = "#777777"; 
	
	if (input.getElementsByTagName("input")[0].value == ""){
		placeholder.style.fontSize = "16px"; 
		placeholder.style.top = "13px"; 
	}
}

if (localStorage.mode){
	document.body.id = localStorage.mode; 
	if (localStorage.mode == "light_mode") document.getElementById("lmbutton").id = "dmbutton"; 
}else{
	localStorage.mode = "dark_mode"; 
}
setTimeout(function(){document.getElementById("dark_mode").style.transition = "0.5s"}, 500); 
if (window.innerWidth < 700) for (var element of document.getElementsByClassName("tbutton")) element.remove(); 
for (const button of document.getElementsByTagName("button")) button.addEventListener("click", ripple);
for (const input of document.getElementsByClassName("input")) input.addEventListener("click", move);

onclick = () => {
	if (event.target.parentElement && event.target.parentElement.className != "input") for (const input of document.getElementsByClassName("input")) reset(input); 
}

onkeydown = () => {
	if (event.altKey && event.key == "n"){
		togglenav(); 
	}else if (event.key == "/" && document.activeElement != document.getElementById("search")){
		document.getElementById("search").focus(); 
		event.preventDefault(); 
	}else if (event.altKey && event.keyCode == 13 && document.getElementById("search").value != ""){
		for (var child of document.getElementById("sidenav").childNodes){
			if (child.tagName == "A" && child.style.display == "block"){
				location.replace(child.href); 
				break; 
			}
		}
	}else if (event.altKey && event.key == "m"){
		togglemode(); 
	}else if (event.altKey && event.key == "s"){
		togglefs(); 
	}
}

onkeyup = () => {
	if ((event.keyCode == 8 || event.keyCode == 46 || document.getElementById("search").value != "") && document.activeElement == document.getElementById("search")){
		if (!open) togglenav(); 
		filter(document.getElementById("search").value); 
	}
}

setInterval(function(){
	if (document.getElementById("fullscreen")){
		if (window.screenTop && window.screenY){
			document.getElementById("fullscreen").innerHTML = "close_fullscreen"; 
		}else{
			document.getElementById("fullscreen").innerHTML = "fullscreen"; 
		}
	}
}, 30); 
