let wordsQuest = [], wordsAnswer = [];

document.querySelector("#fileInput").addEventListener('change', function() {
    let all_files = this.files;
    
	if(all_files.length == 0) {
		console.log('Error : No file selected');
		return;
	}
	let file = all_files[0];

	let allowed_types = ['text/plain'];
	if(allowed_types.indexOf(file.type) == -1) {
		console.log('Error : Incorrect file type');
		return;
	}

	let max_size_allowed = 1024*1024;
	if(file.size > max_size_allowed) {
		console.log('Error : Exceeded size 1MB');
		return;
    }
    
	let reader = new FileReader();
	reader.addEventListener('loadstart', function() {
	    console.log("Loading");
	});

	reader.addEventListener('load', function(e) {
        let text = e.target.result;
        let word = [], type = 1, wordCount = 0;

        for(let i=0; i<text.length+1; i++) {
            if(text[i] == " " || text[i] == "\n" || i == text.length){
                if(type == 1) {
                    wordsQuest[wordCount] = word;
                } else {
                    wordsAnswer[wordCount] = word;
                    wordCount++;
                }

                type *= -1;
                word = "";
            }
            else word += text[i];
        }

        $("#fileInput").fadeOut(200);
        gameMain();
	});

	reader.addEventListener('error', function() {
	    console.log('Error : Failed to read file');
	});

	reader.addEventListener('progress', function(e) {
	    if(e.lengthComputable == true) {
	    	console.log(Math.floor((e.loaded/e.total)*100));
        }
	});
	reader.readAsText(file);
});

function gameMain() {
    console.log("ok");
}