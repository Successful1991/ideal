import $ from 'jquery';
class Svg {
    constructor(data){
        this.complexData = {};
        // this.imageUrl = data.imageUrl;
        // this.id = data.id;
        // this.numberSlide = data.numberSlide;
        // this.controllPoint = data.controllPoint;
        this.activeSlide = data.activeSlide;
        // this.mouseSpeed = data.mouseSpeed;
        this.idCopmlex = data.idCopmlex;
        this.type = data.type;
        // this.click = data.click;

    }
    init(fn){
        this.setActiveSvg = fn;
        this.getData(this.selectSvg)
    }

    getData(fn) {
        let self = this;
        // $.ajax('./datfaylik.php').done(function (msg) {
        //     this.complexData = JSON.parse(msg);
        //     fn.call(self, this.complexData)
        // })
        $.ajax('/wp-content/themes/idealist/assets/s3d/svg.json').done(function (msg) {
            // $.ajax('/wp-admin/svg.json').done(function (msg) {
            fn.call(self, msg)
        })
    }

    selectSvg(data) {
        if( this.type === 'complex') {
            this.createSvg(data.complex, this.type)
        } else if(this.type === 'house') {
            for(let i in data.house){ this.createSvg(data.house[i],i) }
            this.setActiveSvg();
        }
    }


    createSvg(data,name) {
        let svgContainer = createMarkup('div', '#js-s3d__wrapper__' + this.idCopmlex, {class:'s3d__svg-container s3d__svg-container' + (name === 'complex'? '__complex': name ) + ' js-s3d__svg-container' + (name === 'complex'? '__complex': name ) });
        for(let key in data) {
            let svgWrap = document.createElement('div');
            if(+key === +this.activeSlide){
                svgWrap.classList = 's3d__svgWrap js-s3d__svgWrap ' + this.type + '__' + key + ' js-s3d__svg__active';
            } else {
                svgWrap.classList = 's3d__svgWrap js-s3d__svgWrap ' + this.type + '__' + key;
            }
            $(svgContainer).append(svgWrap);
            $.ajax(data[+key].path).done((svg)=> {
                $(svgWrap).append(svg.documentElement );
                this.showAvailableFlat();
            });
        }
        $('.js-s3d__svg-container').on('click','.js-s3d-svg__point-group',function () {
            console.log(this.dataset.type);
            $.ajax({
                url: '/wp-admin/admin-ajax.php',
                method: 'POST',
                data: {
                    action: 'markerPopup',
                    type: this.dataset.type
                }
            }).done((response) => {
                return JSON.parse(response)}
            ).done(res => {
                let data = JSON.parse(res);
                console.log(this);
                $('.s3d-point__help-img').attr('src', data.img);
                $('.s3d-point__help-title').html( (data.title || $(this).html()));
                $('.s3d-point__help-text').html(data.text);
                $('.s3d-point__help-button').attr('href',(data.url.url || "#")).html((data.url.name || 'Детальнее'));
                $('.js-s3d-point__help').addClass('point-active');
            });

        });
        $('.js-s3d-point__help').on('click','.js-s3d-point__help-close',function () {
            $('.js-s3d-point__help').removeClass('point-active');
        });


    }

    // createPointInfo() {
    //     let svgContainer = createMarkup('div', '.js-s3d__slideModule' , {class:'js-s3d__svg-point__help s3d__svg-point__help'});
    //     let content = ``;
    // };

    showAvailableFlat() {
        if($('.js-s3d-controller__showFilter--input').prop('checked') ){
            $('.js-s3d-svg__point-group').css({'opacity': '1','display':'flex'});
        } else {
            $('.js-s3d-svg__point-group').css({'opacity': '0','display':'none'});
        }

    }
}


export default Svg;



