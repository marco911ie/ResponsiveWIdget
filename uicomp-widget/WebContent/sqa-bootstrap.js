// insertionDiv.innerHTML = "test";
var isServer = true; 
var serverUrl = "http://localhost:8082/sqa-demo/";
var insertionDiv = document.getElementById("sqa-insertion-point");
var theVideo = document.getElementsByTagName('video')[0];


var sqa = {};

var id = 125;
var json = [
	{
		id: 123,
		text: "What's up",
		time: 21,
		isQuestion: true,
		isAnswered: false,
		author: "Jonas",
		date: "2015-09-20 19:38",
		replies: [
			{
				id: 125,
				text: "What's up response",
				isQuestion: false,
				isAnswered: false,
				author: "Viktor",
				date: "2015-09-22 19:38"				
			}
		]
	},
	{
		id: 124,
		text: "Cool video...",
		time: 32,
		isQuestion: false,
		isAnswered: false,
		author: "Jim",
		date: "2015-09-23 19:38",
		replies: []
	}
];

sqa.service = function() {
	var loadComments = function (callback /*function called when ready*/) {
		if (isServer) {
			//Go to server and load comments	
		    var xhttp = new XMLHttpRequest();
		    xhttp.onreadystatechange = function() {
		      if (xhttp.readyState == 4 && xhttp.status == 200) {
		    	var json = JSON.parse(xhttp.responseText);
		    	callback(json);
		      }
		    }
		    xhttp.open("GET", serverUrl + "sqa/comments", true);
		    xhttp.setRequestHeader("Accept", "application/json");
		 	xhttp.send();			
		}
		else {
			setTimeout(function() {
				callback(json);
			}, 3000);
		}
	};

	var postComment = function(object, callback) {
		console.log("Post: " + object && object.message);
		if (isServer) {
			//Go to server
		    var xhttp = new XMLHttpRequest();
		    xhttp.onreadystatechange = function() {
		      if (xhttp.readyState == 4 && xhttp.status == 200) {
//		    	var json = JSON.parse(xhttp.responseText);
		    	callback();
		      }
		    }
		    xhttp.open("POST", serverUrl + "sqa/comments", true);
		    xhttp.setRequestHeader("Accept", "application/json");
		    xhttp.setRequestHeader("Content-Type", "application/json");
		 	xhttp.send(JSON.stringify(object));
			
		}
		else {
			//Use dummy data
			id = id + 1;
			if (object.isReply) {
				for (var i = 0; i < json.length; i++) {
					if (json[i].id == object.parentID) {
						json[i].isAnswered = true;
						json[i].replies.push({
							id: id,
							text: object.message,
							isQuestion: false,
							isAnswered: false,
							author: object.author,
							date: "2015-09-25 19:58"
	
						});
					}
				}
			}
			else {
				json.push({
					id: id,
					text: object.message,
					isQuestion: object.isQuestion,
					isAnswered: false,
					author: "Jonas",
					date: "2015-09-25 19:38"
				});
			}
			setTimeout(function() {
				callback();
			}, 3000);
		}
	};

	return {
		loadComments: loadComments,
		postComment: postComment
	}
}();


sqa.utilities = function() {
	var addCss = function() {
		var cssId = 'sqa-css';  // you could encode the css path itself to generate id..
		if (!document.getElementById(cssId)) {
		    var head  = document.getElementsByTagName('head')[0];
		    var link  = document.createElement('link');
		    link.id   = cssId;
		    link.rel  = 'stylesheet';
		    link.type = 'text/css';
		    link.href = serverUrl + 'sqa-style.css';
		    link.media = 'all';
		    head.appendChild(link);
		}
	}

	return {
		addCssToHead: addCss
	}
}();


sqa.ui = {};
sqa.ui.mainUI = function() {
	var spinnerDiv = document.createElement('div');
	var mainDiv = document.createElement('div');
	var newCommentButton = document.createElement('a');
	var commentHolderDiv = document.createElement('div');
	var timelineDiv = document.createElement('div');

	var createMainSqaDiv = function () {	
		spinnerDiv.innerHTML = "Loading comment section...";
		spinnerDiv.className = "sqa-main sqa-text-center";

		mainDiv.className = "sqa-main sqa-remove";

		var mainHeader = document.createElement('div');
		mainHeader.className = "sqa-main-header sqa-text-center";
		var textSpan = document.createElement('span');
		textSpan.innerHTML = "Comments";
		mainHeader.appendChild(textSpan);
		newCommentButton.innerHTML = "New";
		newCommentButton.href = "javascript:"
		newCommentButton.onclick = function(event) {
			var shouldPlayAfterComment = !theVideo.paused;
			theVideo.pause();

			var o = {
				event: event,
				video: theVideo,
				shouldPlayAfterComment: shouldPlayAfterComment
			}
			sqa.ui.commentUI.handleNewComment(o);
		}
		mainHeader.appendChild(newCommentButton);
		mainDiv.appendChild(mainHeader);

		timelineDiv.className = "sqa-timeline";
		mainDiv.appendChild(timelineDiv);
		
		commentHolderDiv.className = "sqa-comment-holder-div";
		mainDiv.appendChild(commentHolderDiv);
	}
	
	var insertTimeLineButtons = function(comments) {
		timelineDiv.innerHTML = "";
		for (var i = 0; i < comments.length; i++) {
			//insert timeline button
			var button = document.createElement('a');
			button.className = "sqa-timeline-button";
			var time = 0;
			if (comments[i].time) {
				var w = timelineDiv.offsetWidth;
				time = Math.round(comments[i].time * w / theVideo.duration);
				if (time >= w - 3) time = w -3;
				time = time + 'px';
			}
			button.style.left = time;
			button.dataTime = comments[i].time;
			button.onclick = function(event) {
				theVideo.currentTime = event.srcElement.dataTime;
			};
			timelineDiv.appendChild(button);			
		}
	};

	var hideSpinner = function() {
		spinnerDiv.className = spinnerDiv.className + " sqa-remove";
		mainDiv.className = mainDiv.className.replace(/\bsqa-remove\b/,'');
	};

	var showSpinner = function() {
		mainDiv.className = mainDiv.className + " sqa-remove";
		spinnerDiv.className = spinnerDiv.className.replace(/\bsqa-remove\b/,'');
	};

	return {
		mainDiv: mainDiv,
		spinnerDiv: spinnerDiv,
		newCommentButton: newCommentButton,
		commentHolderDiv: commentHolderDiv,
		createMainSqaDiv: createMainSqaDiv,
		hideSpinner: hideSpinner,
		showSpinner: showSpinner,
		insertTimeLineButtons: insertTimeLineButtons
	}

}();

sqa.ui.commentUI = function() {
	var addComments = function(comments, div) {
		for (var i = 0; i < comments.length; i++) {

			//create div
			var commentDiv = document.createElement('div');
			commentDiv.className = "sqa-comment-div";
			div.appendChild(commentDiv);

			var metaDiv = document.createElement('div');
			metaDiv.className = "sqa-comment-metadata sqa-text-center";
			var metaAuthorSpan = document.createElement('span');
			metaAuthorSpan.innerHTML = comments[i].author;
			var metaDateSpan = document.createElement('span');
			metaDateSpan.innerHTML = comments[i].date;
			metaDiv.appendChild(metaAuthorSpan)
			metaDiv.appendChild(document.createTextNode(" @ "))
			metaDiv.appendChild(metaDateSpan)
			commentDiv.appendChild(metaDiv);

			var textDiv = document.createElement('div');
			textDiv.className = "sqa-comment-text";
			textDiv.innerHTML = comments[i].text;
			commentDiv.appendChild(textDiv);

			var replyActionDiv = document.createElement('div');
			replyActionDiv.className = "sqa-comment-text-reply sqa-text-center";
			var replyAction = document.createElement('a');
			replyAction.href = "javascript:"
			replyAction.innerHTML = "Add Reply"
			replyAction.dataId = comments[i];
			replyActionDiv.appendChild(replyAction);
			replyAction.onclick = function(event) {
				var o = {
					event: event,
					isReply: true,
					parentID: event.srcElement.dataId.id
				};
				handleNewComment(o);
			}

			commentDiv.appendChild(replyActionDiv);

			if (comments[i].replies && comments[i].replies.length > 0) {
				//only show first reply by default
				for (var j = 0; j < comments[i].replies.length; j++) {
					var reply = comments[i].replies[j];
					var replyDiv = document.createElement('div');
					replyDiv.className = 'sqa-comment-reply-div';

					var replyMetaDiv = document.createElement('div');
					replyMetaDiv.className = "sqa-comment-metadata sqa-text-center";
					var replayMetaAuthorSpan = document.createElement('span');
					replayMetaAuthorSpan.innerHTML = reply.author;
					var replayMetaDateSpan = document.createElement('span');
					replayMetaDateSpan.innerHTML = reply.date;
					replyMetaDiv.appendChild(replayMetaAuthorSpan)
					replyMetaDiv.appendChild(document.createTextNode(" @ "))
					replyMetaDiv.appendChild(replayMetaDateSpan)
					replyDiv.appendChild(replyMetaDiv);

					var replyTextDiv = document.createElement('div');
					replyTextDiv.className = "sqa-comment-text";
					replyTextDiv.innerHTML = reply.text;
					replyDiv.appendChild(replyTextDiv);

					commentDiv.appendChild(replyDiv);
				}
			}
		}
	}

	var handleNewComment = function (o) {
		var newCommentDiv = document.createElement('div');
		newCommentDiv.className = 'sqa-new-comment-div';
		var headerDiv = document.createElement('div');
		headerDiv.className = "sqa-main-header";
		headerDiv.innerHTML = 'Write comment';
		newCommentDiv.appendChild(headerDiv);

		var textArea = document.createElement('textarea');
		textArea.rows = 3;
		textArea.columns = 40;
		newCommentDiv.appendChild(textArea);

		var questionDiv = document.createElement('div');
		if (o.parentID) {
			questionDiv.className = "sqa-remove";
		}
		var question = document.createElement('input');
		question.type = 'checkbox';
		question.name = 'question';
		question.value = 'isQuestion';
		// question.innerHTML = "This is a question"
		questionDiv.appendChild(question);
		questionDiv.appendChild(document.createTextNode('This is a question'))
		newCommentDiv.appendChild(questionDiv);

		var progressDiv = document.createElement('div');
		newCommentDiv.appendChild(progressDiv);

		var actionDiv = document.createElement('div');
		var submitButton = document.createElement('button');
		submitButton.innerHTML = 'Submit';
		submitButton.onclick = function(event) {
			// alert("submitting: " + textArea.value);
			var postObject = {
				message: textArea.value,
				author: "tester" + id++,
				isQuestion: question.checked
			};
			if (o.parentID) {
				postObject.parentID = o.parentID;
				postObject.isReply = true;
			}
			else {
				postObject.time = o.video.currentTime;
			}
			progressDiv.innerHTML = "Submitting comment...please wait."
			sqa.service.postComment(postObject, function() {
				sqa.ui.mainUI.mainDiv.removeChild(newCommentDiv);
				sqa.service.loadComments(function(comments) {
					sqa.ui.mainUI.showSpinner();
					sqa.ui.mainUI.commentHolderDiv.innerHTML = "";
					sqa.ui.commentUI.addComments(comments, sqa.ui.mainUI.commentHolderDiv);
					sqa.ui.mainUI.hideSpinner();
					sqa.ui.mainUI.insertTimeLineButtons(comments);
					if (o.shouldPlayAfterComment) {
						o.video.play();
					}
				});

			});
		};
		actionDiv.appendChild(submitButton);
		var cancelButton = document.createElement('button');
		cancelButton.innerHTML = 'Cancel';
		cancelButton.onclick = function(event) {
			sqa.ui.mainUI.mainDiv.removeChild(newCommentDiv);
		}
		actionDiv.appendChild(cancelButton);

		newCommentDiv.appendChild(actionDiv);

		sqa.ui.mainUI.mainDiv.appendChild(newCommentDiv);
	}

	return {
		addComments: addComments,
		handleNewComment: handleNewComment
	};
}();

//Start executing!!!
sqa.utilities.addCssToHead();
sqa.ui.mainUI.createMainSqaDiv();
insertionDiv.appendChild(sqa.ui.mainUI.spinnerDiv);
insertionDiv.appendChild(sqa.ui.mainUI.mainDiv);

sqa.service.loadComments(function(comments) {
	sqa.ui.commentUI.addComments(comments, sqa.ui.mainUI.commentHolderDiv);
	sqa.ui.mainUI.hideSpinner();
	if (theVideo.readyState == 4) {
		sqa.ui.mainUI.insertTimeLineButtons(comments);
	}
	else {
		theVideo.addEventListener("canplay", function() {sqa.ui.mainUI.insertTimeLineButtons(comments)});
	}
});
