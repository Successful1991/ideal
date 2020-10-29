import $ from 'jquery';
import Slider from  './Slider';
import Helper from  './Helper';


class App {
    constructor(data) {
        this.config = data;
        this.id = data.id;
        this.sectionName = ['complex'];
        this.activeSectionList = ['complex'];
        this.activeSection = 'complex';
        this.activeHouse = undefined;
        // this.flatList = {};
        this.init = this.init.bind(this);
        // this.filterInit = this.filterInit.bind(this);
        this.loader = {
            'show' : () => {
                $('.fs-preloader').addClass('preloader-active');
                $('.fs-preloader-bg').css({'filter':'blur(10px)'})
            },
            'hide': (block) => {
                // if(block ) this.scrollToBlock(0)(block);

                setTimeout(()=>{
                    $('.fs-preloader').removeClass('preloader-active');
                    $('.fs-preloader-bg').css({'filter':'none'});
                    $('.first-loader').removeClass('first-loader');
                },300)
            },
        };
        this.configProject = {};
        // this.changeCurrentFloor = this.changeCurrentFloor.bind(this);
        // this.scrollToBlock = this.scrollToBlock.bind(this);
        // this.animateBlock = this.animateBlock.bind(this);

        this._ActiveHouse = {
            get : () => {
                return this.activeHouse;
            },
            set : num => {
                this.activeHouse = +num;
            }
        };
        this.compass = {
            set: active => {
                let deg = 0;
                if( active ){
                    this.compass.current =  active;
                    deg = 360 / 180 * active + (360 / 180  * this.compass.default);
                } else {
                    deg = this.compass.defaultDeg;
                }
                $('.s3d-filter__compass svg').css('transform','rotate(-'+ deg +'deg)');
            },
            setApart: () => {
                $('.s3d-filter__compass svg').css('transform','rotate('+ this.compass.degApart +'deg)');
            },
            setFloor: () => {
                $('.s3d-filter__compass svg').css('transform','rotate('+ this.compass.degFloor +'deg)');
            },
            save: deg => {
                this.compass.lastDeg = deg;
            },
            current: 0,
            default : 24,
            defaultDeg : -230,
            degApart : -310,
            degFloor : -230,
            lastDeg: -230
        }
    }

    init() {
        // this.history = new History({scrollToBlock:this.scrollToBlock,animateBlock:this.animateBlock });
        // this.history.init();

        // this.getFlatList('/wp-admin/admin-ajax.php', this.filterInit );

        this.loader.show();
        let config = this.config.complex;
        config.idCopmlex = 'complex';
        config.type = 'complex';
        // config.click = this.selectSlider.bind(this);
        config.loader = this.loader;
        config._ActiveHouse = this._ActiveHouse;
        config.compass = this.compass;
        this.createWrap(config, 'canvas');
        this.complex = new Slider(config);
        this.complex.init(this.showAvailableFlat);
        $('.js-s3d__wrapper__complex').css("z-index","100");
        $('.s3d-select__head').on('click', (e)=>{
            let block = $(e.currentTarget).next();
            block.css({'visibility':'visible'});
            $('body').on('mousedown', (e)=>{ select(this,e)} );
            function select(self ,e) {
                if(e.target.className === 's3d-select-value' && e.target.dataset.house) {
                    // self.selectSlider(e, self.complex.type);
                }
                $('body').off('click',(e)=>{ select(e)} );
                block.css({'visibility':'hidden'});
            }
        });

        this.animateFlag = true;

      $('.js-s3d-controller__elem').on('click', '.s3d-select', (e) => {
          const type = e.currentTarget.dataset.type;
          if (type && type !== this.activeSection) {
              // this.history.update(type);
              // this.scrollBlock(e,type);
          }
      });

        let helper = new Helper();
        helper.init();

      $('.js-s3d-controller__showFilter').on('click', () => {
          $('.js-s3d-controller__showFilter--input').prop('checked', !$('.js-s3d-controller__showFilter--input').prop('checked'));
          this.showAvailableFlat();
      });

      // this.helpsInfo();
      //  this.loader.hide();
      this.resize();
    }

    showAvailableFlat() {
        // $('.js-s3d-controller__showFilter--input').click();
        if($('.js-s3d-controller__showFilter--input').prop('checked') ){
            // $('.js-s3d-controller__showFilter--input').prop('checked',false);
           $('.js-s3d-svg__point-group').css({'opacity': '1','display':'flex'});
        } else {
            // $('.js-s3d-controller__showFilter--input').prop('checked',true);
            // $('#js-s3d__wrapper polygon').css({'opacity': ''});
            $('.js-s3d-svg__point-group').css({'opacity': '0','display':'none'});
        }
    }

    // scrollBlock(e,active) {
    //     let ind = this.activeSectionList.findIndex((el)=>{ if(el === active) return true});
    //     if(this.animateFlag && this.activeSectionList.length >= 2 ) {
    //       this.complex.hiddenInfo();
    //         this.animateFlag = false;
    //         if(e.originalEvent && e.originalEvent.wheelDelta /120 > 0 ) {
    //             this.animateBlock('translate', 'up');
    //             if(ind > 0){
    //               this.history.update(this.activeSectionList[ind - 1]);
    //               this.scrollToBlock(700)(this.activeSectionList[ind - 1]);
    //             } else if(ind === 0) {
    //               this.history.update(this.activeSectionList[this.activeSectionList.length - 1]);
    //               this.scrollToBlock(700)(this.activeSectionList[this.activeSectionList.length - 1]);
    //             }
    //         }
    //         else if(e.originalEvent && e.originalEvent.wheelDelta /120 < 0 ){
    //             this.animateBlock('translate', 'down');
    //             if(ind < this.activeSectionList.length - 1){
    //               this.history.update(this.activeSectionList[ind + 1]);
    //               this.scrollToBlock(700)(this.activeSectionList[ind + 1]);
    //             } else if(ind === this.activeSectionList.length - 1) {
    //               this.history.update(this.activeSectionList[0]);
    //               this.scrollToBlock(700)(this.activeSectionList[0]);
    //             }
    //         } else {
    //             this.animateBlock('translate', 'down');
    //             this.scrollToBlock(700)(active);
    //         }
    //     }
    // }

    // filterButtonShowHide(type) {
    //   if(type !== 'complex') {
    //     $('.js-s3d-filter').removeClass('active');
    //   }
    // }

    // getFlatList(url, callback) {
    //     $.ajax({
    //         url: url,
    //         type: 'POST',
    //         data: 'action=getFlats',
    //         success: response => {
    //             callback(JSON.parse(response))
    //         }
    //     });
    // }

    // getMinMaxParam(data){
    //     const names = this.filter.getNameFilterFlat();
    //     data.forEach(el=> {
    //       for(let key in el) {
    //         for(let nameKey in names) {
    //             if(key === names[nameKey]) {
    //                 const num = typeof el[key] === 'string' ? el[key].replace(/\s+/g, '') : el[key];
    //                 if(!this.configProject[key])  this.configProject[key] = {min:num, max:num};
    //                 if(num < +this.configProject[key].min ) this.configProject[key].min = num;
    //                 if(num > +this.configProject[key].max ) this.configProject[key].max = num;
    //             }
    //         }
    //       }
    //     });
    // }

    // filterInit(data) {
    //     // this.filter = new Filter(this.config, data);
    //     // this.getMinMaxParam(data);
    //     // this.filter.init(this.configProject);
    // }

    createWrap(conf, tag){
        let wrap = createMarkup('div','#'+conf.id, {class:'js-s3d__wrap js-s3d__wrapper__' + conf.idCopmlex } );
        let wrap2 = createMarkup('div', wrap, {id:"js-s3d__wrapper__" + conf.idCopmlex, style: 'position:relative;'} );
        createMarkup(tag, wrap2, {id:'js-s3d__' + conf.idCopmlex} );
    }

    // selectSlider(e, type) {
    //     let houseNum = e.currentTarget.dataset.build || e.currentTarget.value;
    //     this.loader.show();
    //     switch (type) {
    //         case 'complex':
    //             // this.selectSliderType(e, 'house', Slider);
    //             this.selectSliderType(e, 'floor', Layout);
    //             break;
    //         // case 'house':
    //         //     this.selectSliderType(e, 'floor', Layout);
    //         //     break;
    //         case 'floor':
    //             $('.fs-preloader').addClass('s3d-preloader__full');
    //             this.selectSliderType(e, 'apart', Apartments);
    //             break;
    //     }
    //   this.resize();
    // }
    //
    // selectSliderType(e, type, fn) {
    //     let config;
    //     this.history.update(type);
    //     if(type === 'house') {
    //         config = this.config.house.config[this.activeHouse];
    //         $('.js-s3d-select__number-house').html(this.activeHouse);
    //     } else {
    //         config = this.config[type];
    //         if(e.currentTarget.dataset.section) config.section = e.currentTarget.dataset.section;
    //         if(e.currentTarget.dataset.floor) config.floor = e.currentTarget.dataset.floor;
    //         if(e.currentTarget.dataset.flat_id) config.flat = e.currentTarget.dataset.flat_id;
    //     }
    //
    //     config.idCopmlex = type;
    //     config.type = type;
    //     config.loader = this.loader;
    //     config.configProject = this.configProject;
    //     config.changeCurrentFloor = this.changeCurrentFloor;
    //     config._ActiveHouse = this._ActiveHouse;
    //     config.compass = this.compass;
    //
    //     if ($('#js-s3d__'+type).length > 0) {
    //         this[type].update(config);
    //     } else {
    //         config.click = this.selectSlider.bind(this);
    //         config.scrollToBlock = this.scrollToBlock.bind(this);
    //         this.createWrap(config, type !== 'house'?'div': 'canvas');
    //         this[type] = new fn(config);
    //         this[type].init(config);
    //
    //         this.activeSectionList.push(config.idCopmlex);
    //         $('.js-s3d-select__'+ config.type).prop("disabled", false);
    //     }
    // }

    // scrollToBlock(time = 0){
    //    return (block) => {
    //        $('.js-s3d-select__'+ this.activeSection).removeClass('active');
    //        $('.js-s3d-select__'+ block).addClass('active');
    //        $('.js-s3d-filter').removeClass('active');
    //        if(block !== 'apart') {
    //            $('.fs-preloader').removeClass('s3d-preloader__full');
    //        }
    //        setTimeout(() => {
    //            if(block === 'apart') {
    //                this.complex.hiddenInfo();
    //                this.complex.hiddenInfoFloor();
    //                $('.s3d-controller').addClass('s3d-nav__block-apart');
    //                $('.s3d-controller').removeClass('s3d-nav__block-floor');
    //                this.compass.save(this.compass.current);
    //                this.compass.setApart();
    //                // $('.s3d-filter__compass svg').css('transform','rotate(230deg)');
    //            } else if(block === 'floor')  {
    //                this.complex.hiddenInfo();
    //                this.complex.hiddenInfoFloor();
    //                $('.s3d-controller').removeClass('s3d-nav__block-apart');
    //                $('.s3d-controller').addClass('s3d-nav__block-floor');
    //                this.compass.save(this.compass.current);
    //                this.compass.setFloor();
    //                // $('.s3d-filter__compass svg').css('transform','rotate(230deg)');
    //            } else {
    //                this.complex.showInfoFloor();
    //                $('.s3d-controller').removeClass('s3d-nav__block-apart');
    //                $('.s3d-controller').removeClass('s3d-nav__block-floor');
    //                this.compass.set(this.compass.lastDeg);
    //                // let deg = 360 / 120 * self._activeElem + (360 / 120  * 57);
    //                // $('.s3d-filter__compass svg').css('transform','rotate('+ deg +'deg)');
    //            }
    //           // this.filterButtonShowHide(block);
    //           this.sectionName.forEach(name => {
    //             if(name === block){
    //                 this.activeSection = name;
    //                 $('.js-s3d__wrapper__'+name).css("z-index","100");
    //             } else {
    //                 $('.js-s3d__wrapper__'+name).css("z-index","");
    //             }
    //         })
    //        },time);
    //    }
    // }

    // changeCurrentFloor(floor) {
    //     this.complex.updateActiveFloor(floor);
    // }

    // animateBlock(id, clas){
    //     const layers = document.querySelectorAll("." + id+ "-layer");
    //     layers[0].classList.remove('translate-layer__down','translate-layer__up','active');
    //     layers[0].classList.add('translate-layer__'+ clas);
    //     setTimeout(()=> layers[0].classList.add('active') ,100);
    //     setTimeout(()=> this.animateFlag = true ,1000)
    //
    // }

    // helpsInfo(){
    //     // if(!window.localStorage.getItem('helps')) {
    //         $('.js-first-info').css({'visibility' :'visible'});
    //
    //       $('.js-first-info__button').on('click', e => {
    //         switch (e.target.dataset.type){
    //           case 'next':
    //             let step = $('.js-first-info-step.active').removeClass('active').data('step');
    //             $(`.js-first-info-step[data-step="${step+1}"]`).addClass('active');
    //             break;
    //           case 'end':
    //             $('.js-first-info-step.active').removeClass('active');
    //             window.localStorage.setItem('helps',true);
    //             $('.js-first-info').css({'visibility' : ''});
    //             break;
    //         }
    //       })
    //     // }
    // }

    resize() {
        const doc = $('.js-s3d__slideModule');
        let height = doc.height();
        const width = doc.width();
        // if(height >= width) {
        //     height = height/2;
            // $('.js-s3d__wrapper__complex').css({'height':'50%'});
            // $('.js-s3d__helper').css({'visibility':'visible'});
            // $('.js-s3d-filter').addClass('filter-small');
            // $('.js-s3d__slideModule').addClass('s3d-active-vertical');
        // } else {
            $('.js-s3d__wrapper__complex').css({'height':''});
            // $('.js-s3d__helper').css({'visibility':'hidden'});
            // $('.js-s3d-filter').removeClass('filter-small');
            // $('.js-s3d__slideModule').removeClass('s3d-active-vertical');
        // }
      this.complex.resizeCanvas();
    }
}

export default App;
// module.exports = App;