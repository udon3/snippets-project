$(document).ready(function(){

    var $tabs = $('.tab-headers').find('li');

    $tabs.on('click', function(e){

        var $this = $(this);
            //hash = $this.attr('href');
        var selected = $this.find('a').attr('href');
        var $tabgroup = $this.parent().parent();
        var $tabgroupContent = $tabgroup.find('.tab-content__content');
        var $tabgroupHeaders = $tabgroup.find('.tab-headers li');

        $tabgroupContent.removeClass('active');
        $this.siblings().removeClass('active');
            $this.addClass('active');
       

        $(selected).addClass('active');


        e.preventDefault();


        // console.log($this.hasClass('active'));



        // if (!$this.hasClass('active')) {

        //     var tabNum = $this.index();

        //     var nthChild = tabNum+1;
        //     //console.log(nthChild);

        //     $('.tab-headers li.active').removeClass('active');
        //     $(this).addClass('active');
        //     $('.tab-content div.active').removeClass('active');
        //     $('.tab-content div:nth-child("+nthChild")').addClass('active');
        // }
    });
});