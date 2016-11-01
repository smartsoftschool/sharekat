$('.form').find('input, textarea').on('keyup blur focus', function (e) {

    var $this = $(this),
        label = $this.prev('label');

    if (e.type === 'keyup') {
        if ($this.val() === '') {
            label.removeClass('active highlight');
        } else {
            label.addClass('active highlight');
        }
    } else if (e.type === 'blur') {
        if ($this.val() === '') {
            label.removeClass('active highlight');
        } else {
            label.removeClass('highlight');
        }
    } else if (e.type === 'focus') {

        if ($this.val() === '') {
            label.removeClass('highlight');
        }
        else if ($this.val() !== '') {
            label.addClass('highlight');
        }
    }

});

$('.tab a').on('click', function (e) {

    e.preventDefault();

    $(this).parent().addClass('active');
    $(this).parent().siblings().removeClass('active');

    target = $(this).attr('href');

    $('.tab-content > div').not(target).hide();

    $(target).fadeIn(600);

});

(function () {
   var firstPasswordInput = document.querySelector('#first');
var secondPasswordInput = document.querySelector('#second');
var submit = document.querySelector('#submit');

/*
I'm using this IssueTracker to help me format my validation messages.
 */
function IssueTracker() {
  this.issues = [];
}
IssueTracker.prototype = {
  add: function (issue) {
    this.issues.push(issue);
  },
  retrieve: function () {
    var message = "";
    switch (this.issues.length) {
      case 0:
        // do nothing because message is already ""
        break;
      case 1:
        message = "الرجاء التاكد من المشكله:\n" + this.issues[0];
        break;
      default:
        message = "الرجاء التاكد من المشاكل:\n" + this.issues.join("\n");
        break;
    }
    return message;
  }
};

submit.onclick = function () {
  /*
  Don't forget to grab the input's .value!
   */
  var firstPassword = firstPasswordInput.value;
  var secondPassword = secondPasswordInput.value;

  /*
  Make an issue tracker for each input because some validation messages should
  end up on the first one, some on the second.
   */
  var firstInputIssuesTracker = new IssueTracker();
  var secondInputIssuesTracker = new IssueTracker();

  /*
  This steps through all of the requirements and adds messages when a requirement fails.
  Just checks the first password because the second should be the same when it runs.
   */
  function checkRequirements() {
    if (firstPassword.length < 5) {
      firstInputIssuesTracker.add("كلمه المرور اقل من 5 حروف");
    } else if (firstPassword.length > 15) {
      firstInputIssuesTracker.add("كلمه المرور اكبر من 5 حروف");
    }

    

    if (!firstPassword.match(/[a-z | A-Z | ا-ي]/g)) {
      firstInputIssuesTracker.add("الرجاء استخدام الحروف والارقام");
    }

    

    var illegalCharacterGroup = firstPassword.match(/[^A-z0-9أ-ي!\@\#\$\%\^\&\*]/g)
    if (illegalCharacterGroup) {
      illegalCharacterGroup.forEach(function (illegalChar) {
        firstInputIssuesTracker.add("غير مسموح بهذه الرموز: " + illegalChar);
      });
    }
  };

  /*
  Here's the first validation check. Gotta make sure they match.
   */
  if (firstPassword === secondPassword && firstPassword.length > 0) {
    /*
    They match, so make sure the rest of the requirements have been met.
     */
    checkRequirements();
  } else {
    secondInputIssuesTracker.add("كلمه المرور غير متطابقه");
  }

  /*
  Get the validation message strings after all the requirements have been checked.
   */
  var firstInputIssues = firstInputIssuesTracker.retrieve()
  var secondInputIssues = secondInputIssuesTracker.retrieve()

  /*
  Let input.setCustomValidity() do its magic :)
   */
  firstPasswordInput.setCustomValidity(firstInputIssues);
  secondPasswordInput.setCustomValidity(secondInputIssues);

  /*
  You would probably replace this with a POST message in a real app.
   */
  if (firstInputIssues.length + secondInputIssues.length === 0) {
    // $("button").click(function(){
    //     $("p:first").addClass("intro");
    // });

  }
};


})();

$(function() {
   $('.avatar').click(function(e) {
  $('.card').toggleClass('active');
});

// Ripple effect
var target, ink, d, x, y;
$(".social").click(function(e) {
  target = $(this);
  //create .ink element if it doesn't exist
  if (target.find(".ink").length === 0)
    target.prepend("<span class='ink'></span>");

  ink = target.find(".ink");
  //incase of quick double clicks stop the previous animation
  ink.removeClass("animate");

  //set size of .ink
  if (!ink.height() && !ink.width()) {
    //use parent's width or height whichever is larger for the diameter to make a circle which can cover the entire element.
    d = Math.max(target.outerWidth(), target.outerHeight());
    ink.css({
      height: d,
      width: d
    });
  }

  //get click coordinates
  //logic = click coordinates relative to page - parent's position relative to page - half of self height/width to make it controllable from the center;
  x = e.pageX - target.offset().left - ink.width() / 2;
  y = e.pageY - target.offset().top - ink.height() / 2;

  //set the position and add class .animate
  ink.css({
    top: y + 'px',
    left: x + 'px'
  }).addClass("animate");
});

});

$(function() {

});

