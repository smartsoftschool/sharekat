document.addEventListener('polymer-ready', function() {
  var navicon = document.getElementById('navicon');
  var drawerPanel = document.getElementById('drawerPanel');
  navicon.addEventListener('click', function() {
    drawerPanel.togglePanel();
  });
});

function buttonizer(jqArr, hashOrHref) {
  jqArr.each(function() {
    $(this).click(function() {
      if (hashOrHref === "hash") {
        location.hash = $(this).attr('href');
      } else if (hashOrHref === "href") {
        location.href = $(this).attr('href');
      }
    });
  });
}

// setting up hash changes
var menuItems = $('core-item');
buttonizer(menuItems, "hash");

// setting up paper-button links
var paperButtons = $('paper-button');
buttonizer(paperButtons, "href");

// run when you want YT to pull videos
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// url for YT thumbnails
// http://img.youtube.com/vi/NnFMwjeK2g4/0.jpg
// you know what's awesome? yt vids that load onclick
// runPlayer will grab the elem id, which is also the YT ID and it will set the target string and videoId to it.
var player;
function runPlayer() {
  console.log(this.id);
  var id = this.id;
  player = new YT.Player(id, {
    height: '225',
    width: '300',
    videoId: id,
    events: {
      'onReady': onPlayerReady
    }
  });
};

function onYouTubeIframeAPIReady() {
  var yts = document.querySelectorAll('.yt');
  for (vid in yts) yts[vid].onclick = runPlayer;
}

function onPlayerReady(event) {
  event.target.playVideo();
}

function fixMargins() {
  if ($('body').width() > 610) {
    var courseMargin = $('a.course').css('marginLeft');
    $('.aligned').css('marginLeft', courseMargin);
    $('.aligned').css('marginRight', courseMargin);
  } else {
    $('.aligned').css('marginLeft', '0px');
    $('.aligned').css('marginRight', '0px');
  }
}
window.onload = fixMargins;
window.onresize = fixMargins;