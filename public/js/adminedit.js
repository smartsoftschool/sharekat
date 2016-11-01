$(function () {
    var url = window.location;

    var element = $('ul.nav a').filter(function () {
        return this.href == url || url.href.indexOf(this.href) == 0;
    }).addClass('active').parent().parent().addClass('in').parent();

    var element2 = $('ul.nav a').filter(function () {
        return this.href != url || url.href.indexOf(this.href) != 0;
    }).removeClass('active').parent().parent().addClass('in').parent();


});
// $('#myModal').on('shown.bs.modal', function () {
//   $('#myInput').focus()
// })

// function openConfirmDelete(link){
//     var form = document.getElementById("deleteConfirmModalForm");
//      form.setAttribute('action', link);
//     $("#deleteConfirmModal").modal("show");
// }