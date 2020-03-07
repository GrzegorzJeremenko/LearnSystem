let words = [], wordNum = 0;
let wordInput = [];
let progressTo = 0, progressNow = 0, letterMis = "#2ecc71";
let point = 0, mis = 0;

let correctBar = 100, misBar = 0;

document.querySelector("#fileInput").addEventListener('change', function() {
    let all_files = this.files;
    
	if(all_files.length == 0) {
		alert('No file selected');
		return;
	}
	let file = all_files[0];

	let allowed_types = ['text/plain'];
	if(allowed_types.indexOf(file.type) == -1) {
		alert('Incorrect file type');
		return;
	}

	let max_size_allowed = 1024*1024;
	if(file.size > max_size_allowed) {
		alert('Exceeded size 1MB');
		return;
    }
    
	let reader = new FileReader();
	reader.addEventListener('loadstart', function() {
		document.getElementById("word").innerHTML = "Loading...";
		$("#word").fadeIn(100);
	});

	reader.addEventListener('load', function(e) {
		let text = e.target.result;
		
		const regex = /\s+/g;
		words = text.split(regex);

		if(words.length%2 == 0) {
			$("#fileInput").fadeOut(200);
			gameMain();
		} else alert('Invalid number of words');
	});

	reader.addEventListener('error', function() {
	    alert('Failed to read file');
	});

	reader.addEventListener('progress', function(e) {
	    if(e.lengthComputable == true) {
			progrssTo = Math.floor((e.loaded/e.total)*100);
        }
	});
	reader.readAsText(file);
});

function gameMain() {
	wordRand();

	document.getElementById("correctBar").style.display = "flex";

	setInterval(correctBarUpdate, 2);
	setInterval(progressUpdate, 2);
}

function wordRand() {
	let sent = "";
	let rand = wordNum;

	while(rand == wordNum) wordNum = Math.floor(Math.random() * (words.length)/2)*2;

	letterMis = "#2ecc71";
	progressNow = progressTo = 0;

	$("#sentence").fadeOut(100);

	$("#word").fadeOut(100, function() {
		document.getElementById("word").innerHTML = words[wordNum].replace(/_/g, " ");
		document.getElementById("word").style.backgroundImage = 'linear-gradient(90deg, '+letterMis+' 0%, #fff 0%)';

		for(let i = 0; i < words[wordNum+1].length; i++)sent += "<div class=\"letter\">"+words[wordNum+1][i]+"</div>";
		document.getElementById("sentence").innerHTML = sent;

		$("#word").fadeIn(100);
		$("#sentence").fadeIn(100);
	});
}

function progressUpdate() {
	progressNow = progressNow + (progressTo-progressNow)*0.05;
	document.getElementById("word").style.backgroundImage = 'linear-gradient(90deg, '+letterMis+' '+progressNow+'%, #fff 0%)';
}

function correctBarUpdate() {
	let allQuest = mis + point;

	if(allQuest != 0) {
		correctBar = correctBar + ((point/allQuest*100)-correctBar)*0.1;
		misBar = misBar + ((mis/allQuest*100)-misBar)*0.1;
	}

	document.getElementsByClassName("bar")[0].style.width = correctBar+"%";
	document.getElementsByClassName("bar")[1].style.width = misBar+"%";

	document.getElementsByClassName("bar")[0].innerHTML = Round(correctBar, 2)+"% ("+point+")";
	document.getElementsByClassName("bar")[1].innerHTML = Round(misBar, 2)+"% ("+mis+")";

	if(Math.round(correctBar) < 5) document.getElementsByClassName("bar")[0].innerHTML = "";
	if(Math.round(misBar) < 5) document.getElementsByClassName("bar")[1].innerHTML = "";
}

function key(event) {
	if(event.key != "Enter") {
		if(wordInput.length != words[wordNum+1].length) {
			wordInput = wordInput + event.key.toLowerCase();

			if(wordInput[wordInput.length-1] != words[wordNum+1][wordInput.length-1]) {
				letterMis = "#e74c3c";
				document.getElementsByClassName("letter")[wordInput.length-1].style.borderBottom = "2px solid #e74c3c";
				document.getElementsByClassName("letter")[wordInput.length-1].style.color = "#e74c3c";
				document.getElementsByClassName("letter")[wordInput.length-1].innerHTML = wordInput[wordInput.length-1];
			} else {
				document.getElementsByClassName("letter")[wordInput.length-1].style.borderBottom = "2px solid #2ecc71";
				document.getElementsByClassName("letter")[wordInput.length-1].style.color = "#2ecc71";
			}

			progressTo = Math.round((wordInput.length/words[wordNum+1].length*100));
			progressUpdate();

			if(wordInput.length >= words[wordNum+1].length) {
				if(wordInput == words[wordNum+1]) point++;
				else mis++;
			}
		}
		if(wordInput.length == words[wordNum+1].length) {
			$("#word").fadeOut(100, function() {
				document.getElementById("word").innerHTML = words[wordNum+1].replace(/_/g, " ");
				$("#word").fadeIn(100);
			});
		} 
	} else if(event.key == "Enter") {
		if((wordInput != words[wordNum+1]) && (wordInput.length != words[wordNum+1].length)) mis++;
		wordInput = "";
		wordRand();
	}
}

function Round(n, k) {
    let factor = Math.pow(10, k);
    return Math.round(n*factor)/factor;
}

document.addEventListener("keypress", key, false);