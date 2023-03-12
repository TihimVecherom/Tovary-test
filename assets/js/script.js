

function DynamicAdapt(type) {
	this.type = type;
}
DynamicAdapt.prototype.init = function () {
	const _this = this;
	// массив объектов
	this.оbjects = [];
	this.daClassname = "_dynamic_adapt_";
	// массив DOM-элементов
	this.nodes = document.querySelectorAll("[data-da]");
	// наполнение оbjects объктами
	for (let i = 0; i < this.nodes.length; i++) {
		const node = this.nodes[i];
		const data = node.dataset.da.trim();
		const dataArray = data.split(",");
		const оbject = {};
		оbject.element = node;
		оbject.parent = node.parentNode;
		оbject.destination = document.querySelector(dataArray[0].trim());
		оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
		оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
		оbject.index = this.indexInParent(оbject.parent, оbject.element);
		this.оbjects.push(оbject);
	}
	this.arraySort(this.оbjects);
	// массив уникальных медиа-запросов
	this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {
		return '(' + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
	}, this);
	this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
		return Array.prototype.indexOf.call(self, item) === index;
	});
	// навешивание слушателя на медиа-запрос
	// и вызов обработчика при первом запуске
	for (let i = 0; i < this.mediaQueries.length; i++) {
		const media = this.mediaQueries[i];
		const mediaSplit = String.prototype.split.call(media, ',');
		const matchMedia = window.matchMedia(mediaSplit[0]);
		const mediaBreakpoint = mediaSplit[1];
		// массив объектов с подходящим брейкпоинтом
		const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function (item) {
			return item.breakpoint === mediaBreakpoint;
		});
		matchMedia.addListener(function () {
			_this.mediaHandler(matchMedia, оbjectsFilter);
		});
		this.mediaHandler(matchMedia, оbjectsFilter);
	}
};
DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
	if (matchMedia.matches) {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			оbject.index = this.indexInParent(оbject.parent, оbject.element);
			this.moveTo(оbject.place, оbject.element, оbject.destination);
		}
	} else {
		//for (let i = 0; i < оbjects.length; i++) {
		for (let i = оbjects.length - 1; i >= 0; i--) {
			const оbject = оbjects[i];
			if (оbject.element.classList.contains(this.daClassname)) {
				this.moveBack(оbject.parent, оbject.element, оbject.index);
			}
		}
	}
};
// Функция перемещения
DynamicAdapt.prototype.moveTo = function (place, element, destination) {
	element.classList.add(this.daClassname);
	if (place === 'last' || place >= destination.children.length) {
		destination.insertAdjacentElement('beforeend', element);
		return;
	}
	if (place === 'first') {
		destination.insertAdjacentElement('afterbegin', element);
		return;
	}
	destination.children[place].insertAdjacentElement('beforebegin', element);
}
// Функция возврата
DynamicAdapt.prototype.moveBack = function (parent, element, index) {
	element.classList.remove(this.daClassname);
	if (parent.children[index] !== undefined) {
		parent.children[index].insertAdjacentElement('beforebegin', element);
	} else {
		parent.insertAdjacentElement('beforeend', element);
	}
}
// Функция получения индекса внутри родителя
DynamicAdapt.prototype.indexInParent = function (parent, element) {
	const array = Array.prototype.slice.call(parent.children);
	return Array.prototype.indexOf.call(array, element);
};
// Функция сортировки массива по breakpoint и place 
// по возрастанию для this.type = min
// по убыванию для this.type = max
DynamicAdapt.prototype.arraySort = function (arr) {
	if (this.type === "min") {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return -1;
				}

				if (a.place === "last" || b.place === "first") {
					return 1;
				}

				return a.place - b.place;
			}

			return a.breakpoint - b.breakpoint;
		});
	} else {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return 1;
				}

				if (a.place === "last" || b.place === "first") {
					return -1;
				}

				return b.place - a.place;
			}

			return b.breakpoint - a.breakpoint;
		});
		return;
	}
};
const da = new DynamicAdapt("max");
da.init();


//* --- SLIDERS ---
// Slider Progress
if(document.querySelector('.sliders_progress .slider')){
  let sliderProgressCount = 0;
  $('.sliders_progress .slider').each((i, index)=>{
    sliderProgressCount = i+1;
    $(index).addClass(`slider-progress_${i}`)
  })
  for(let slider = 0; slider < sliderProgressCount; slider++){
    $(`.slider-progress_${slider}`).each((idx, el)=>{
      let container = $(el).closest('.sliders_progress');
    if($(container).find('.progress')){
      $(container).on('beforeChange', function(event, slick, currentSlide, nextSlide) {   
        setProgress($(el), $(container).find('.progress'), nextSlide);
      });
    }
    if($(el).hasClass('veiwe-product')){
      $(el).slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        speed: 400,
        arrows: true, 
        dots: false,
        nextArrow: $(container).find('.slider-next'),
        prevArrow: $(container).find('.slider-prev'),
        responsive: [
          {
            breakpoint: 1920,
            settings: {
              slidesToShow: 4,
              slidesToScroll: 1,
              infinite: true,
              dots: false,
              arrows: false, 
              centerMode: false,
            }
          },
          {
            breakpoint: 1700,
            settings: {
              slidesToShow: 4,
              centerPadding: '0px',
              arrows: false,
              slidesToScroll: 1,
              centerMode: false,
            }
          },
          {
            breakpoint: 1500,
            settings: {
              slidesToShow: 4,
              centerPadding: '0px',
              arrows: false,
              slidesToScroll: 1,
              centerMode: false,
            }
          },
          {
            breakpoint: 1023,
            settings: {
              slidesToShow: 3,
              centerPadding: '0px',
              arrows: false,
              slidesToScroll: 1,
              centerMode: false,
            }
          },
          {
            breakpoint: 991,
            settings: {
              slidesToShow: 3,
              centerPadding: '0px',
              arrows: false,
              slidesToScroll: 1,
              centerMode: false,
            }
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 2,
              centerPadding: '0px',
              arrows: false,
              slidesToScroll: 1,
              centerMode: false,
            }
          },
          {
            breakpoint: 650,
            settings: {
              slidesToShow: 2,
              centerPadding: '0px',
              arrows: false,
              slidesToScroll: 2,
              centerMode: false,
            }
          },
          {
            breakpoint: 300,
            settings: {
              slidesToShow: 2,
              centerPadding: '0px',
              arrows: false,
              slidesToScroll: 1,
              centerMode: false,
            }
          },
        ],
      });
    }else if($(el).hasClass('veiwe')){
      $(el).slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        speed: 400,
        arrows: true, 
        nextArrow: $(container).find('.slider-next'),
        prevArrow: $(container).find('.slider-prev'),
        responsive: [
          {
            breakpoint: 1920,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
              infinite: true,
              dots: false,
              arrows: false, 
              centerMode: false,
            }
          },
          {
            breakpoint: 1500,
            settings: {
              slidesToShow: 3,
              centerPadding: '0px',
              arrows: false,
              slidesToScroll: 2,
              centerMode: false,
            }
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 2,
              arrows: false,
              centerPadding: '0px',
              paddingSlide: 20,
              centerMode: true,
              slidesToScroll: 2
            }
          },
          {
            breakpoint: 650,
            settings: {
              slidesToShow: 1,
              arrows: false,
              centerPadding: '0px',
              paddingSlide: 20,
              centerMode: true,
              slidesToScroll: 2
            }
          },
          {
            breakpoint: 440,
            settings: {
              slidesToShow: 1,
              centerPadding: '0',
              arrows: false, 
              centerMode: false,
              slidesToScroll: 1
            }
          }
        ],
      });
    }
    if($(container).find('.progress')){
    setProgress($(el), $(container).find('.progress'), 0);
    }
  })
  }
}
if($('.slider_together')){
  function resizedTogether(){
    if($(window).width() > 1300){
      math = $('.slider_together').width();
      $('.slider_together .slick-slide').width(math/4)
      $('.slider_together .slick-slide .product__slider').width(math/4)
      $('.slider_together .slick-slide .product__slider .image__product').width((math/4)-20)
      $('.slider_together .slick-slide .product__slider .info_product').width((math/4)-20)
      $('.slider_together .slick-slide .product__slider .price_product').width((math/4)-20)
      $('.slider_together .slick-slide .together_price').width(math/4)
    }else{
      math = $('.slider_together').width();
      $('.slider_together .slick-slide').width('100%')
      $('.slider_together .slick-slide .product__slider').width('100%')
      $('.slider_together .slick-slide .product__slider .image__product').width('100%')
      $('.slider_together .slick-slide .product__slider .info_product').width('100%')
      $('.slider_together .slick-slide .product__slider .price_product').width('100%')
      $('.slider_together .slick-slide .together_price').width($('.slider_together').width())
    }
  }
  $(window).resize(()=>{
    $('.slider_together').width($('.slider_together').closest('.wrapper').width())

    resizedTogether()
  })
  $('.slider_together').on('beforeChange', function(event, slick, currentSlide, nextSlide) {   
    setProgress($('.slider_together'), $('#progress_together'), nextSlide);
  });
  $('.slider_together').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    speed: 400,
    arrows: true, 
    nextArrow: document.getElementById('slick-next-together'),
    prevArrow: document.getElementById('slick-previous-together'),
    
  });

  // Slider id
  let slider = 0;
  $('.slider_together .slick-slide').each((idx, item)=>{
    let $slider = $(item).find('.product__slider .image__product .slider_product');
    if($slider.length != 0){
      $slider.each((ix, elem)=>{
        $(elem).attr('id', 'slider_product_' +  slider);

        let container_img = $(elem).closest('.image__product');
        $('#slider_product_' +  slider).slick({
          slidesToShow: 1,
          slidesToScroll: 1,
          variableWidth: false,
          speed: 400,
          arrows: true, 
          nextArrow: $(container_img).find('.slider-next'),
          prevArrow: $(container_img).find('.slider-previous'),
        });

        slider++;
      })
    }
  })
  setProgress($('.slider_together'), $('#progress_together'), 0);
}

function Marquee(selector, speed) {
    const parentSelector = document.querySelector(selector);
    const clone = parentSelector.innerHTML;
    const firstElement = parentSelector.children[0];
    let i = 0;
    
    parentSelector.insertAdjacentHTML('beforeend', clone);
    parentSelector.insertAdjacentHTML('beforeend', clone);
  
    setInterval(function () {
      firstElement.style.marginLeft = `-${i}px`;
      if (i > firstElement.clientWidth) {
        i = 0;
      }
      i = i + speed;
    }, 0);
}
function menuHeaderPosition(){
  if($('.header')){
    if($('.mobile_menu')){
      let header_position = $('.header').offset().top;
      $('.mobile_menu').css('top', header_position)
    }
  }
}

document.querySelector('.close_marquee').addEventListener('click', ()=>{
  $('.alert_promotion').toggleClass('active');
  setTimeout(()=>{
    menuHeaderPosition()
    menuMobileSize()
  }, 500)

})
window.addEventListener('load', Marquee('.marquee', .3))

// Menu hover | desktop
let desktop = 768;
$('.catalog_header .catalog_btn').hover((e)=>{
  if($(window).width() > desktop){
      $('.menu_desktop').addClass('active')
  }
}, function(){
  if($(window).width() > desktop){
  setTimeout(()=>{
    $('.menu_desktop').removeClass('active')
  }, 1500)

  $('.menu_desktop').hover(()=>{
      $('.menu_desktop').addClass('active')
  }, function(){
      if($(window).width() > desktop){
          $('.menu_desktop').addClass('active')
          setTimeout(()=>{
              if ($('.menu_desktop').is(':hover')){
                  $('.menu_desktop').addClass('active')
              }else{
                  $('.menu_desktop').removeClass('active')
              }
          }, 1500)
          }
      })
  }
})


// const catalogBtn = document.querySelector('.btn-catalog-mb');
// const catalogMenuMb = document.querySelector('.mobile_menu');

// if (catalogBtn) {
//   catalogBtn.addEventListener("click", function (e) {
//     catalogBtn.classList.toggle('_icon-active');
//       if (catalogMenuMb) {
//         catalogMenuMb.classList.toggle('hidden');
//       }
      
      
//    });
// }



$(window).resize(()=>{
  if($(window).width() < desktop){
    $('.menu_desktop').removeClass('active')
  }
})

$('.menu_desktop .list-category .over_scroller a').hover((e)=>{
  $('.menu_desktop .list-category .over_scroller a').each((index, item)=>{
    $(item).removeClass('active');
    if(item == e.target){
      let index_element = index;
      $(item).addClass('active');
      $('.menu_desktop .content_menu .box_content').each((index, item_el)=>{
        $(item_el).addClass('hidden');
        if(index == index_element){
          $(item_el).removeClass('hidden');
          if($(item_el).hasClass('category')){
            $(item_el).find('.content_category').find('.over_scroller a').hover((el)=>{
              $(item_el).find('.content_category').find('.over_scroller a').each((index_q, item_q)=>{
                $(item_q).removeClass('active');
                if(item_q == el.target){
                  let index_el = index_q;
                  $(item_q).addClass('active');
                  $(item_el).find('.links_content .content_box').each((idx, el_x)=>{
                    $(el_x).addClass('hidden');
                    if(index_el == idx){
                      $(el_x).removeClass('hidden');
                    }
                  })
                }
              })
            })
          }
        }
      });
    }
  })
})

/* Основной слайдер продукта */
if($('.slider-for')){
$('.slider-for').slick({
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
  nextArrow: document.getElementById('next_general_slider'),
  prevArrow: document.getElementById('back_general_slider'),
  fade: true,
  dots: false,
  asNavFor: '.slider-nav',
  responsive: [
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        dots: true,
        arrows: false, 
      }
    },
    {
      breakpoint: 440,
      settings: {
        slidesToShow: 1,
        arrows: false, 
        dots: true,
      }
    }
  ],
});
$('.slider-nav').slick({
  slidesToShow: 5,
  vertical: true,
  slidesToScroll: 1,
  asNavFor: '.slider-for',
  nextArrow: document.getElementById('back_nav_slider'),
  prevArrow: document.getElementById('next_nav_slider'),
  dots: false,
  focusOnSelect: true
});
}

$('.slider_partners').slick({
  slidesToShow: 6,
  slidesToScroll: 1,
  nextArrow: document.getElementById('back_nav_slider'),
  prevArrow: document.getElementById('next_nav_slider'),
  dots: false,
  focusOnSelect: true,
  responsive: [
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 5,
        slidesToScroll: 1,
        infinite: true,
        dots: false,
        arrows: true, 
      }
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 4,
        arrows: true, 
        dots: false,
      }
    },
    {
      breakpoint: 450,
      settings: {
        slidesToShow: 3,
        arrows: true, 
        dots: false,
      }
    }
  ],
});


if($('.slick_full_screen')){
  $('.slick_full_screen').slick({
    autoplay: false,
    nextArrow: document.getElementById('next_full_slider'),
    prevArrow: document.getElementById('back_full_slider'),
    fade: true,
    arrows: true,
  });
}
if($('.open_full_slider')){
  $('.open_full_slider').click(()=>{
    $('.slick_full_screen').slick('slickGoTo', 1)
    $('.slider-for .slick-slide').each((index, item)=>{
      if($(item).hasClass('slick-active')){
        $('.product_slider').removeClass('hidden')
        $('.slick_full_screen').slick('slickGoTo', index);
      }
    })
  })

  $('.slick_full_screen').slick('slickGoTo', 1)
}
if($('.slider-for .slick-slide')){
  $('.slider-for .slick-slide').click((e)=>{
    $('.slider-for .slick-slide').each((index, item)=>{
      if($(item).hasClass('slick-active')){
        $('.product_slider').removeClass('hidden')
        $('.slick_full_screen').slick('slickGoTo', index);
      }
    })
  })
}
if($('.close_full_slider')){
  $('.close_full_slider').click(()=>{
    $('.product_slider').addClass('hidden');
  })
}
if($('.feedback_wrap')){
  if($('.feedback_wrap .cont_feedback .feadback_box')){
    let index = 5;
    $('.feedback_wrap .cont_feedback .feadback_box').each((idx, item)=>{
      $(item).addClass('hidden');
      if(idx <= index-1){
        $(item).removeClass('hidden');
      } 
    })
  }
  let len_count = 0;
  $('.feedback_wrap .cont_feedback .feadback_box').each((idx, item)=>{ len_count = idx+1 });
  $('.feedback_wrap .cont_feedback .cont_line .count').text(len_count);
  $('#progress_feedback').css('background-size', `${((5) / (len_count)) * 100}% 100%`).attr('aria-valuenow', ((5) / (len_count)) * 100);

  if(len_count < 5){
    $('#load_feadback').addClass('hidden');
    $('.feedback_wrap .cont_feedback .cont_line .status_count').text(len_count);
  }
  else{
    $('#load_feadback').click(()=>{
      let added = 5;
      let status = $('#progress_feedback').attr('status');
      let count = Number(status)+Number(added);
      $('#progress_feedback').attr('status', count);

      const calc = ((count + 1) / (len_count)) * 100;
      $('#progress_feedback').css('background-size', `${calc}% 100%`).attr('aria-valuenow', calc);

      if(Number(count) >= Number(len_count)){
        $('.feedback_wrap .cont_feedback .cont_line .status_count').text(len_count);
        $('#load_feadback').addClass('hidden');
      }else{
        $('.feedback_wrap .cont_feedback .cont_line .status_count').text(count);
      }
      $('.feedback_wrap .cont_feedback .feadback_box').each((idx, item)=>{
        if(idx < count){
          $(item).removeClass('hidden');
        }
      })
    })
  }


  // Отзывы
  if($('.feedback_wrap .cont_question .feadback_box')){
    let index = 5;
    $('.feedback_wrap .cont_question .feadback_box').each((idx, item)=>{
      $(item).addClass('hidden');
      if(idx <= index-1){
        $(item).removeClass('hidden');
      } 
    })
  }
  let len_count_question = 0;
  $('.feedback_wrap .cont_question .feadback_box').each((idx, item)=>{ len_count_question = idx+1 });
  $('.feedback_wrap .cont_question .cont_line .count').text(len_count_question);
  $('#progress_question').css('background-size', `${((5) / (len_count_question)) * 100}% 100%`).attr('aria-valuenow', ((5) / (len_count_question)) * 100);
  if(len_count_question < 5){
    $('#load_question').addClass('hidden');
    $('.feedback_wrap .cont_question .cont_line .status_count').text(len_count_question);
  }else{
    $('#load_question').click(()=>{
      let added = 5;
      let status = $('#progress_question').attr('status');
      let count = Number(status)+Number(added);
      $('#progress_question').attr('status', count);

      const calc = ((count + 1) / (len_count_question)) * 100;
      $('#progress_question').css('background-size', `${calc}% 100%`).attr('aria-valuenow', calc);

      if(Number(count) >= Number(len_count_question)){
        $('.feedback_wrap .cont_question .cont_line .status_count').text(len_count_question);
        $('#load_question').addClass('hidden');
      }else{
        $('.feedback_wrap .cont_question .cont_line .status_count').text(count);
      }
      $('.feedback_wrap .cont_question .feadback_box').each((idx, item)=>{
        if(idx < count){
          $(item).removeClass('hidden');
        }
      })
    })
  }
}
if($('.top_ancor')){
  $(window).scroll(()=>{
    let y = $(window).scrollTop();
    if(y > 300){
      $('.top_ancor').css('transition', '0.5s ease');
      $('.top_ancor').css('bottom', '80px');
    }else{
      $('.top_ancor').css('transition', '0.5s ease');
      $('.top_ancor').css('bottom', '-80px');
    }
  })
}
if($('.change_box')){
  $('.change_box').click((e)=>{
    let target = $(e.target).closest('.change_box');
    let father =  target.closest('.feedback_wrap');

    father.find('.buttons .change_box').each((idx, item)=>{
      $(item).removeClass('active');
      if(item == $(target)[0]){
        $(item).addClass('active');
        $('.feedback_wrap .container .contain').each((index, elem)=>{
          $(elem).addClass('hidden')
          if(idx == index){
            if(index == 0){
              $('.cont_feedback .form').addClass('hidden')
              $('.cont_question .form').addClass('hidden')
              $('#add_feadback').removeClass('hidden')
              $('#add_question').addClass('hidden')
            }else if(index == 1){
              $('.cont_feedback .form').addClass('hidden')
              $('.cont_question .form').addClass('hidden')
              $('#add_feadback').addClass('hidden')
              $('#add_question').removeClass('hidden')
            }
            $(elem).removeClass('hidden')
          }
        })
      }
    })
  })
}
// Fixed product
// if(document.querySelector('.product_fixed')){
//   let offsetFixed = $('.product_fixed').offset().top;
//   $('.btn-fixed').click((e)=>{
//     let target = $(e.target).closest('.btn-fixed');
//     let attr = $(target).attr('ancor');
//     $('.product_fixed .btn-fixed').each((idx, item)=>{
//       $(item).removeClass('active')
//     })
//     target.addClass('active')
//     let offset = $('.' + attr).offset().top-parseInt($('.product_fixed').height()*2-20);
//     $(window).scrollTop(offset)
//   })
//   $(window).scroll(()=>{
//     let scroll = $(window).scrollTop();
//     if(scroll > offsetFixed){
//       $('.product_fixed').addClass('fixed');
//     }else{
//       $('.product_fixed').removeClass('fixed');
//     }

//     let arr = ['fixed-info', 'fixed-property', 'fixed-description', 'fixed-feadback', 'fixed-video', 'fixed-null'];
//     let obj = [];

//     arr.map((item)=>{ if($('.' + item)){  obj.push($('.' + item).offset().top-offsetFixed); }

//     let resScrollTop = $(window).scrollTop();
//     if(arr.length > 0){
//       if(resScrollTop < arr[0]){
//       }else{
//         obj.map((elem, index)=>{
//           if(resScrollTop > obj[index] && resScrollTop < obj[index+1]){
//             $('.product_fixed .content .btn-fixed').each((idx, elem)=>{
//               $(elem).removeClass('active');
//               if(idx === index){
//                 $(elem).addClass('active');
//               }
//             })
//           }else if(resScrollTop > obj[obj.length - 1]){
//             $('.product_fixed .content .btn-fixed').each((i, el)=>{
//               $(el).removeClass('active');
//             })
//           }
//         })
//       }
//     }

//     })
//   })
// }
$('.top_ancor').click(()=>{
  window.scrollTo(0, 0);
})
function ratingStar(){
  document.querySelectorAll('.rating-container').forEach((item)=>{
    let star = item.getAttribute('star');
    item.querySelectorAll('label').forEach((input, intex)=>{
      if(intex+1 <= star){
        $(input).addClass('active')
      }
    })
  })
}ratingStar()
// Accordeon
let items = document.querySelectorAll(".accordion button");
items.forEach(item => item.addEventListener('click', (e)=>{
  let target = e.target;
  let father = target.closest('button');
  const itemToggle = father.getAttribute('aria-expanded');
  for (let i = 0; i < items.length; i++) {
    items[i].setAttribute('aria-expanded', 'false');
  }
  if (itemToggle == 'false') {
    father.setAttribute('aria-expanded', 'true');
  }
}));
function setProgress(slider, progress, index) {
  const calc = ((index + 1) / ($(slider).slick('getSlick').slideCount)) * 100;
  $(progress).css('background-size', `${calc}% 100%`).attr('aria-valuenow', calc);
}
// Discount
if(document.querySelector('.discount_cont')){
  if($('.discount_cont .box')){
    let index = 9;
    $('.discount_cont .box').each((idx, item)=>{
      $(item).addClass('hidden');
      if(idx <= index-1){
        $(item).removeClass('hidden');
      } 
    })
  }
  let len_count = 0;
  $('.discount_cont .box').each((idx, item)=>{ len_count = idx+1 });
  $('.cont_line .count').text(len_count);
  $('#progress_discount').css('background-size', `${((9) / (len_count)) * 100}% 100%`).attr('aria-valuenow', ((9) / (len_count)) * 100);

  if(len_count < 9){
    $('#load_discount').addClass('hidden');
    $('.cont_line .status_count').text(len_count);
  }
  else{
    $('#load_discount').removeClass('hidden');
    $('#load_discount').click(()=>{
      let added = 9;
      let status = $('#progress_discount').attr('status');
      let count = Number(status)+Number(added);
      $('#progress_discount').attr('status', count);

      const calc = ((count + 1) / (len_count)) * 100;
      $('#progress_discount').css('background-size', `${calc}% 100%`).attr('aria-valuenow', calc);

      if(Number(count) >= Number(len_count)){
        $('.cont_line .status_count').text(len_count);
        $('#load_discount').addClass('hidden');
      }else{
        $('.cont_line .status_count').text(count);
      }
      $('.discount_cont .box').each((idx, item)=>{
        if(idx < count){
          $(item).removeClass('hidden');
        }
      })
    })
  }
}
// Slick
if($('.slider_like')){
  $('.slider_like').on('beforeChange', function(event, slick, currentSlide, nextSlide) {   
    setProgress($('.slider_like'), $('#progress_like'), nextSlide);
  });
  $('.slider_like').slick({
    slidesToShow: 4,
    slidesToScroll: 1,
    speed: 400,
    arrows: true, 
    nextArrow: document.getElementById('slick-next-like'),
    prevArrow: document.getElementById('slick-previous-like'),
    responsive: [
      {
        breakpoint: 1920,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: false,
          arrows: false, 
          centerMode: false,
        }
      },
      {
        breakpoint: 1500,
        settings: {
          slidesToShow: 2,
          centerPadding: '0px',
          arrows: false,
          slidesToScroll: 2,
          centerMode: false,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          arrows: false,
          centerPadding: '0',
          paddingSlide: 20,
          centerMode: false,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          centerPadding: '0px',
          arrows: false, 
          centerMode: false,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 440,
        settings: {
          slidesToShow: 1,
          centerPadding: '0',
          arrows: false, 
          centerMode: false,
          slidesToScroll: 1
        }
      }
    ],
  });  
  setProgress($('.slider_like'), $('#progress_like'), 0);
}
if($('.slider_prom_start')){
  let father = $('.slider_prom_start').closest('.slider_promotion');
  $('.slider_prom_start').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    speed: 400,
    arrows: true, 
    dots: true,
    nextArrow: $(father).find('.slider-next'),
    prevArrow: $(father).find('.slider-prev'),
    
  });  
  
}

// Delete favorites
function deleteFavorite(target){
  let time = 500;
  $(target).addClass('delete');
  setTimeout(()=>{
    $(target).remove()
    setTimeout(()=>{
      checkfavorites()
    }, 220)
  }, time)

}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function checkfavorites(){
  if(!document.querySelector('.favorites .favorites-list .favorite_container')){
    $('.favorites .line_btn').remove()
  }
}checkfavorites()

$('.favorites .clear_all').click(()=>{
  let len = $('.favorites .favorites-list').children().length
    async function deleteSleep() {
        for (let i = len; i > -1; i--) {
            deleteFavorite($('.favorites .favorites-list .favorite_container')[i])
            await sleep(200);
        }
    }
    deleteSleep();
})

// Удаление товара из избраных 
$('.favorites-list .favorite_container .box_favorite .delete').click((e)=>{
  let target = $(e.target).closest('.favorite_container')
  deleteFavorite(target)
})

// Удаление товара из страницы оформления заказа 
$('.container_grid .grid_offers .favorite_container .box_favorite .delete').click((e)=>{
  let target = $(e.target).closest('.favorite_container')
  deleteFavorite(target)
})

// Удаление товара из корзины 
$('.cart-list .favorite_container .box_favorite .delete').click((e)=>{
  let target = $(e.target).closest('.favorite_container')
  deleteFavorite(target)
})

// Slider main
if(document.querySelector('.main_slider__content')){
  let father = $('.main_slider__content').closest('.main_slider');
  $('.main_slider__content').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    speed: 400,
    arrows: true, 
    dots: false,
    nextArrow: $(father).find('.slider-next-main'),
    prevArrow: $(father).find('.slider-prev-main'),
    responsive: [
      {
        breakpoint: 1500,
        settings: {
          arrows: true,
          dots: false
        }
      },
      {
        breakpoint: 768,
        settings: {
          arrows: true,
          dots: false
        }
      },
      {
        breakpoint: 600,
        settings: {
          arrows: false, 
          dots: true
        }
      },
      {
        breakpoint: 400,
        settings: {
          arrows: false, 
          dots: true
        }
      }
    ],
  });
}
$('.main_slider__content').width(parseInt($('.main .wrapper').width()))
let min_H = 0;
if( parseInt($('.main_slider__content img').height()) > 200){
  if(parseInt($('.main_slider__content img').height()) < 500){
    min_H = 500;
  }
}else{
  min_H = parseInt($('.main_slider__content img').height());
}
$('.main_slider__content').height(500 + 'px');
$('.main_slider__content img').height($('.main_slider__content').height())
$(window).resize(()=>{ 
  $('.main_slider__content').width(parseInt($('.main .wrapper').width()))
  if( parseInt($('.main_slider__content img').height()) > 200){
    if(parseInt($('.main_slider__content img').height()) < 500){
      min_H = 500;
    }
  }else{
    min_H = parseInt($('.main_slider__content img').height());
  }
  $('.main_slider__content').height(500 + 'px');
  $('.main_slider__content img').height($('.main_slider__content').height())
})





if($('#feadback_product')){
  $('#feadback_product').click(()=>{
    $('.cont_feedback .form').removeClass('hidden');
    $(window).scrollTop($('.feadback_contain').offset().top)
  })
}
if($('#add_feadback')){
  $('#add_feadback').click(()=>{
    $('.cont_feedback .form').removeClass('hidden');
  })
}
if($('#add_question')){
  $('#add_question').click(()=>{
    $('.cont_question .form').removeClass('hidden');
  })
}

// Modal
$('.btn-fast_buy').click(()=>{
  $('.absolute_alert').removeClass('hidden')
  document.querySelectorAll('.absolute_alert .modal').forEach((item)=>{
    item.classList.add('hidden');
    $('body').css('overflow', 'hidden');
  })
  $('.fast_modal').removeClass('hidden');
})
// Modal cart



// Close modal
for(let elem of document.querySelectorAll('.close_modal'))
{
  elem.addEventListener('click', (e)=>{
    document.querySelectorAll('.absolute_alert .modal').forEach((item)=>{
      item.classList.add('hidden');
      document.querySelector('.absolute_alert').classList.add('hidden');
      $('body').css('overflow', 'auto');
    })
  })
}

$('.go_buyed').click(()=>{
  document.querySelectorAll('.absolute_alert .modal').forEach((item)=>{
    item.classList.add('hidden');
    document.querySelector('.absolute_alert').classList.add('hidden');
    $('body').css('overflow', 'auto');
  })
})

// Phone Mask 
$(document).ready(function() {
  $("input[type=tel]").mask("+38 (099) 99-99-999");
});

function menuMobileSize(){
  let header_position = $('.header').offset().top;
  let inner = $(window).innerHeight()
  let menu = inner-header_position;
  $('.mobile_menu').css('height', menu);
  $('.mobile_menu .section_menu').css('height', menu-$('.position_menu').height());
}menuMobileSize()
$(window).resize(()=>{
  menuHeaderPosition();
  menuMobileSize()
})

let steepMenu = 'start';
$('.mobile_menu .section_menu .next').each((idx, item)=>{
  $(item).click((e)=>{
    let target = $(e.target).closest('.next');
    $('.mobile_menu .section_menu .next').each((idx, el)=>{
      if(el == $(target)[0]){
        let index = idx + 1;
        $('.mobile_menu .position_menu .btn_menu .close_menu_mobile').addClass('hidden');
        $('.mobile_menu .position_menu .btn_menu .back_menu_mobile').removeClass('hidden');
        $('.mobile_menu .position_menu .btn_menu .back_menu_mobile').attr('section', 0)
        let text = $(el).attr('name-link')
        $('.mobile_menu .position_menu .viewe .logo_link').addClass('hidden')
        $('.mobile_menu .position_menu .viewe .name_contain').removeClass('hidden').text(text);

        $('.mobile_menu .section_menu .contain').each((i, elem)=>{
          $(elem).addClass('hidden');
          if(i == index){
            $(elem).removeClass('hidden');

            // Если я открыл каталог
            if($(elem).hasClass('catalog_menu')){
              $(elem).children().each((q, element)=>{
                if($(element).hasClass('content_')){
                  $(element).removeClass('hidden')
                }else{
                  $(element).addClass('hidden')
                }
              })
            }
          }
        })
      }
    })
  })
})

$('.position_menu').height($('.header').height());$('.position_menu').css('min-height', $('.header').height());
$(window).resize(()=>{
  let width = $(window).width();
  if(width > 1200){
    $('.mobile_menu').css('transition', '0.5s ease');
    $('.mobile_menu').css('left', '-100%');
    setTimeout(()=>{
      $('.mobile_menu').addClass('hidden');
      $('body').css('overflow', 'auto');
    }, 500)
  }
  $('.position_menu').height($('.header').height());$('.position_menu').css('min-height', $('.header').height());})
$('.menu_burger').click(()=>{
  $('.mobile_menu').removeClass('hidden');
  $('body').css('overflow', 'hidden');
  setTimeout(()=>{
    $('.mobile_menu').css('transition', '0.5s ease');
    $('.mobile_menu').css('left', '0');
  }, 10)

  $('.position_menu').height($('.header').height());
  $('.position_menu').css('min-height', $('.header').height());
})
$('.close_menu_mobile').click(()=>{
  $('.mobile_menu').css('transition', '0.5s ease');
  $('.mobile_menu').css('left', '-100%');
  setTimeout(()=>{
    $('.mobile_menu').addClass('hidden');
    $('body').css('overflow', 'auto');
  }, 500)
})

// Catalog
let statusValid = 0;
let backEl = '';
$('.mobile_menu .line').each((index, item)=>{
  $(item).click((e)=>{
    let target = $(e.target).closest('.line');
    if($(e.target).closest('.line').hasClass('catalog')){
      let f = $(e.target).closest('.line').closest('.father').children();
      $(f).each((i, elem)=>{
        if($(elem).hasClass('content_')){
          $(elem).children().each((idx, el)=>{
              if(el == $(target)[0]){
                let father = $(el).closest('.father');
                let content_link = '';
                $(father).children().each((i, el)=>{ if($(el).hasClass('content_')){  content_link = $(el); }})
                $(father).children().each((i, el)=>{
                  if($(el).hasClass('links_content')){
                    $(el).removeClass('hidden');
                    $(content_link).addClass('hidden');
                    $(el).children().each((iterator, itm)=>{
                      $(itm).addClass('hidden');
                      if(iterator == idx){
                        $(itm).removeClass('hidden');
                        statusValid++;
                        backEl = $(itm);

                        if($(itm).children()){
                          $(itm).children().each((i, el)=>{  
                            if($(el).hasClass('content_')){ 
                              $(el).removeClass('hidden');
                            }
                            else if($(el).hasClass('links_content')){ $(el).addClass('hidden')}
                          })                                        
                        }
                      }
                    })
                  }
              })
          }})
        }
      })
    }
  })
});

// Back menu
$('.mobile_menu .position_menu .btn_menu .back_menu_mobile').each((i, ele)=>{
  $(ele).click((e)=>{
    if(statusValid <= 0){
      $('.mobile_menu .section_menu .contain').each((i, elem)=>{
        $(elem).addClass('hidden');
        if(i == 0){
          statusValid=0;
          $('.mobile_menu .position_menu .btn_menu .close_menu_mobile').removeClass('hidden');
          $('.mobile_menu .position_menu .btn_menu .back_menu_mobile').addClass('hidden');
          $('.mobile_menu .position_menu .btn_menu .back_menu_mobile').attr('section', '')
          $('.mobile_menu .position_menu .viewe .logo_link').removeClass('hidden')
          $('.mobile_menu .position_menu .viewe .name_contain').addClass('hidden').text('');
          $(elem).removeClass('hidden');
        }
      })
    }else{

      let container = $(backEl)[0].parentNode;
      let parent = $(container)[0].parentNode
      if($(parent).hasClass('catalog_menu')){
        $(parent).children().each((i, lem)=>{
          $(lem).addClass('hidden')
          if($(lem).hasClass('content_')){
            $(lem).removeClass('hidden')
          }
        })
        statusValid--;
      }else{
        if(statusValid == 1){
          let list = $(parent)[0].parentNode;
          let prev = list.parentNode;
          $(prev).children().each((i, lem)=>{
            $(lem).addClass('hidden')
            if($(lem).hasClass('content_')){
              $(lem).removeClass('hidden')
            }
          })
        }else{
          $(parent).children().each((i, lem)=>{
            $(lem).addClass('hidden')
            if($(lem).hasClass('content_')){
              $(lem).removeClass('hidden')
            }
          })
        }

        statusValid--;
      }
    }
  })
})

// Sticky
// if(document.querySelector('.box_grid')){
//   function topScroll(){
//     let windowScroll = $(window).scrollTop()
//     let offsettop_el = $('.box_grid').offset().top;
//     if(windowScroll+$('.product_fixed .wrapper').height() > offsettop_el){
//       $('.boxed .product__slider').addClass('sticky')
//       $('.boxed .sticky').css('bottom', 'auto')
//       $('.boxed .sticky').css('top', $('.product_fixed').height()+10)
//       $('.boxed .sticky').css('position', 'fixed')

//       let math = $('.slider_cont.fixed-null').offset().top-$('.boxed .product__slider.sticky').height()-$('.boxed .product__slider.sticky').height();
//       if(windowScroll > math){
//         $('.boxed .sticky').css('bottom', 0)
//         $('.boxed .sticky').css('top', 'auto')
//         $('.boxed .sticky').css('position', 'absolute')
//       }else{
//         $('.boxed .sticky').css('bottom', 'auto')
//         $('.boxed .sticky').css('top', $('.product_fixed').height()+10)
//         $('.boxed .sticky').css('position', 'fixed')
//       }

//     }else{
//       $('.boxed .product__slider').removeClass('sticky')
//       $('.boxed .product__slider').css('bottom', 'auto')
//       $('.boxed .product__slider').css('top', 'auto')
//       $('.boxed .product__slider').css('position', 'relative')
//     }
//   }
//   $(window).scroll(()=>{ topScroll() })
// }

// Size slider nav
function size(){
  if($(window).width() > 1200){
    let wi = $('.container__product_info .fixed-info').width()
    let pad = $('.container__product_info .fixed-info').css('padding')
    let res = (parseInt(wi)-parseInt(pad)-60) / 2;
    $('.slider_product .main_line').width($('.info_product_contain').width())
    $('.slider_product .slider-for').width($('.slider_product .main_line').width() - 100)
    $('.slider_product .slider-nav').width(100)
    $('.slider_product .slider-nav').css('margin', '0 auto')
  }else{
    $('.slider_product .slider-for').width($('.slider_product .main_line').width()-20)
    $('.slider_product .main_line').css('width', '100%')
    $('.slider_product .slider-nav').width()
  }
}size()
$(window).resize(()=>{size()})



// Timer
function timerDiscount(){
  function changeTimezone(date, ianatz) {
    var invdate = new Date(date.toLocaleString('en-US', {
      timeZone: ianatz
    }));
    var diff = invdate.getTime() - date.getTime();
    return new Date(date.getTime() - diff);
  };
  
  document.addEventListener('DOMContentLoaded', function() {
    // конечная дата
    const x = new Date(document.querySelector('.timer').getAttribute('date'));
    // часовой пояс
    var deadline = changeTimezone(x, "Europe/Kyiv");
    // id таймера
    let timerId = null;
    // склонение числительных
    function declensionNum(num, words) {
      return words[(num % 100 > 4 && num % 100 < 20) ? 2 : [2, 0, 1, 1, 1, 2][(num % 10 < 5) ? num % 10 : 5]];
    }
    // вычисляем разницу дат и устанавливаем оставшееся времени в качестве содержимого элементов
    function countdownTimer() {
      const diff = deadline - new Date();
      if (diff <= 0) {
        clearInterval(timerId);
      }
      const days = diff > 0 ? Math.floor(diff / 1000 / 60 / 60 / 24) : 0;
      const hours = diff > 0 ? Math.floor(diff / 1000 / 60 / 60) % 24 : 0;
      const minutes = diff > 0 ? Math.floor(diff / 1000 / 60) % 60 : 0;
      const seconds = diff > 0 ? Math.floor(diff / 1000) % 60 : 0;
      $days.textContent = days < 10 ? '0' + days : days;
      $hours.textContent = hours < 10 ? '0' + hours : hours;
      $minutes.textContent = minutes < 10 ? '0' + minutes : minutes;
      $seconds.textContent = seconds < 10 ? '0' + seconds : seconds;
      $days.dataset.title = declensionNum(days, ['день', 'дня', 'дней']);
      $hours.dataset.title = declensionNum(hours, ['час', 'часа', 'часов']);
      $minutes.dataset.title = declensionNum(minutes, ['минута', 'минуты', 'минут']);
      $seconds.dataset.title = declensionNum(seconds, ['секунда', 'секунды', 'секунд']);
    }
    // получаем элементы, содержащие компоненты даты
    const $days = document.querySelector('.timer__days');
    const $hours = document.querySelector('.timer__hours');
    const $minutes = document.querySelector('.timer__minutes');
    const $seconds = document.querySelector('.timer__seconds');
    // вызываем функцию countdownTimer
    countdownTimer();
    // вызываем функцию countdownTimer каждую секунду
    timerId = setInterval(countdownTimer, 1000);
  });
}
if(document.querySelector('.timer')){ timerDiscount() }


// Accordeon filter
document.querySelectorAll('.acc_button').forEach((item)=>{
  item.addEventListener('click', (e)=>{
    let target = e.target;
    let father = target.closest('.accordion_filter');
    if(father.classList.contains('active')){
      father.classList.remove('active');
      father.querySelector('.acc_container').style.transition = 1 + 's ease';
      father.querySelector('.acc_container').style.height = 0;
    }else{
      father.classList.add('active');
      father.querySelector('.acc_container').style.transition = 1 + 's ease';
      father.querySelector('.acc_container').style.height = 'auto';
    }
  })
})

// Range slider
const onInput = (parent, e) => {
  const slides = parent.querySelectorAll('input');
  const min = parseFloat(slides[0].min);
  const max = parseFloat(slides[0].max);
  const slide1 = parseFloat(slides[0].value);
  const slide2 = parseFloat(slides[1].value);
  const percentageMin = (slide1 / (max - min)) * 100;
  const percentageMax = (slide2 / (max - min)) * 100;
  let father = parent.closest('.range-filter');
  father.querySelector('.range_min').value = Number.parseInt(Math.floor(slide1)).toLocaleString('ru');
  father.querySelector('.range_max').value =  Number.parseInt(Math.floor(slide2)).toLocaleString('ru');
  parent.style.setProperty('--range-slider-value-low', percentageMin);
  parent.style.setProperty('--range-slider-value-high', percentageMax);

  if (slide1 > slide2) {
    father.querySelector('.range_min').value = Number.parseInt(Math.floor(slide2)).toLocaleString('ru');

    if (e?.currentTarget === slides[0]) {
      slides[0].insertAdjacentElement('beforebegin', slides[1]);
    } else {
      slides[1].insertAdjacentElement('afterend', slides[0]);
    }
  }
  
  parent.querySelector('.range-slider__display').setAttribute('data-low', slide1);
  parent.querySelector('.range-slider__display').setAttribute('data-high', slide2);
}

addEventListener('DOMContentLoaded', (event) => {
  document.querySelectorAll('.range-slider')
   .forEach(range => range.querySelectorAll('input')
      .forEach((input) => {
      if (input.type === 'range') {
        input.oninput = (e) => onInput(range, e);
        onInput(range);
      }
   }))
});

// Overwlower
$('.btn_overflower').each((i, item)=>{
  $(item).find('p').text($(item).attr('lang-all'))

  $(item).click((e)=>{
    let target = $(e.target).closest('.overflower-text');
    $(target).toggleClass('active');
    if($(target).hasClass('active')){
      $(item).find('p').text($(item).attr('lang'))
    }else{
      $(item).find('p').text($(item).attr('lang-all'))
    }
  })
})


function redeEffect(){
  document.querySelectorAll('.like').forEach((item) => {
    item.addEventListener('click', (e)=>{
      let target = e.target.closest('.like');
      target.classList.toggle('active');
    })
  })
  
  document.querySelectorAll('.сompare').forEach((item) => {
    item.addEventListener('click', (e)=>{
      let target = e.target.closest('.сompare');
      target.classList.toggle('active');
    })
  })
  
}redeEffect()

// Filter
$('.filter_btn').click(()=>{
  $('body').css('overflow', 'hidden')
  $('.filtered').addClass('active');
})
$('.close_filter').click(()=>{
  $('body').css('overflow', 'inherit')
  $('.filtered').removeClass('active');
})
$('.button_done').click(()=>{
  $('body').css('overflow', 'inherit')
  $('.filtered').removeClass('active');
})

let resizeFilterPoint =  960;
function resizeFilter(){
  
  if($(window).width() > resizeFilterPoint){
    $('.filtered .filter_flow').height('auto')
    $('.filtered .box_controll').height('auto')
    $('.filtered').removeClass('active')
    $('body').css('overflow', 'inherit')
  }
  
  if($(window).width() < resizeFilterPoint){
    $('.filtered .box_controll').height($('.header').height())
    $('.filtered .filter_flow').height($(window).height() - $('.header').height())
  
  }
}resizeFilter()

$('.refresh').click(()=>{
  $('.filtered input[type="checkbox"]').prop('checked', false)
  $('.filtered input[type="radio"]').prop('checked', false)
})
$(window).resize(()=>{resizeFilter()})


document.querySelector('.absolute_alert').addEventListener('click', (e)=>{
  let father = e.target
  if(father.classList.contains('absolute_alert')){
    document.querySelectorAll('.absolute_alert .modal').forEach((item)=>{
      item.classList.add('hidden');
      document.querySelector('.absolute_alert').classList.add('hidden');
      $('body').css('overflow', 'auto');
    })
  }
})

function autoSizeContainerModal(className=".modal"){
  document.querySelectorAll(className).forEach((item)=>{
    let styles = window.getComputedStyle(item)
    function resizeContain(){
      item.style.height = 'auto';
      if(parseInt(styles.height) > window.innerHeight){let persent = window.innerHeight-50;
        item.style.height = persent-100 + "px";
      }
    }
    resizeContain()
    window.addEventListener('resize', ()=>{ resizeContain() })
  })
}
$('.line_functions .cart').click(()=>{
  $('.absolute_alert').removeClass('hidden')
  document.querySelectorAll('.absolute_alert .modal').forEach((item)=>{
    item.classList.add('hidden');
    $('body').css('overflow', 'hidden');
  })
  $('.cart_modal').removeClass('hidden');
  autoSizeContainerModal('.cart_modal')
})
autoSizeContainerModal('.cart_modal')



$(document).ready(function() {
  $('.js-select').each((i, el)=>{
    $(el).select2({
      placeholder: 'Select an option'
    });
  })
});

// Валидация полей на странице оформления заказа
if(document.querySelector('.valid')){
  function validInputOffers(e){
    let valid = 0;
    document.querySelectorAll('.valid').forEach((item)=>{
      if(item.querySelector('input').value == '' || item.querySelector('input').value == "+38 (0__) __-__-___"){
        valid++;
        item.classList.add('invalid_input');
        item.querySelector('.invalid').classList.remove('hidden')
      }else{
        item.classList.remove('invalid_input');
        item.querySelector('.invalid').classList.add('hidden')
      }

      if(!document.querySelector('#doc_read').checked){
        valid++;
      }

      if(valid == 0){
        document.getElementById('sbt_button').removeAttribute('disabled');
      }else{
        document.getElementById('sbt_button').setAttribute('disabled', 'disabled');
      }
    })
  }
  function beforeSbtButtonClick(){
    let valid = 0;
      document.querySelectorAll('.valid').forEach((item)=>{
        if(item.querySelector('input').value == '' || item.querySelector('input').value == "+38 (0__) __-__-___"){
          valid++;
        }

        if(!document.querySelector('#doc_read').checked){
          valid++;
        }

        setTimeout(()=>{
          if(valid == 0){
            document.getElementById('sbt_button').removeAttribute('disabled');
            document.getElementById('sbt_button').setAttribute('type', 'button');
          }else{
            document.getElementById('sbt_button').setAttribute('disabled', 'disabled');
            document.getElementById('sbt_button').setAttribute('type', 'submit');
          }
        }, 200)
      })
  }beforeSbtButtonClick()
  function targetCheckInput(e){
    let target = e.target;
    let father = target.closest('.valid');
    if(father.querySelector('input').value == '' || father.querySelector('input').value == "+38 (0__) __-__-___"){
      father.classList.add('invalid_input');
      father.querySelector('.invalid').classList.remove('hidden')
    }else{
      father.classList.remove('invalid_input');
      father.querySelector('.invalid').classList.add('hidden')
    }
  }
  document.querySelectorAll('.container_grid .grid_offers .valid input').forEach((el)=>{
    el.addEventListener('input', (e)=>{
      targetCheckInput(e)
      beforeSbtButtonClick()
    })
  })
  document.querySelectorAll('.container_grid .grid_offers .valid input').forEach((el)=>{
    el.addEventListener('change', (e)=>{
      targetCheckInput(e)
      beforeSbtButtonClick()
    })
  })
  document.querySelector('#doc_read').addEventListener('click', (e)=>{
    validInputOffers(e)
    beforeSbtButtonClick()
  })
  document.querySelector('#sbt_button').addEventListener('click', (e)=>{
    validInputOffers()
  })
}

// Counter product
document.querySelectorAll('.minus_counter').forEach((item)=>{item.addEventListener('click', (e)=>{
  let target = e.target;
  let container = target.closest('.counter_product');
  let input_counter = container.querySelector('.val-counter').value;
  if(parseInt(input_counter) < 3){
    container.querySelector('.val-counter').value = 1;
    item.classList.add('none');
  }else{
    container.querySelector('.val-counter').value = parseInt(input_counter)-1;
    item.classList.remove('none');
  }
})
})

document.querySelectorAll('.plus_counter').forEach((item)=>{item.addEventListener('click', (e)=>{
  let target = e.target;
  let container = target.closest('.counter_product');
  let input_counter = container.querySelector('.val-counter').value;
  container.querySelector('.val-counter').value = parseInt(input_counter)+1; 

  if(parseInt(input_counter) > 0){
    container.querySelector('.minus_counter').classList.remove('none')
  }else if(parseInt(input_counter) <= 1){
    container.querySelector('.minus_counter').classList.add('none')
  }
})
})

document.querySelectorAll('.container_tabs .row_tabed .tabs-button').forEach((item)=>{
  item.addEventListener('click', (e)=>{
    let target = e.target;
    let father = target.closest('.tabs-button');
    let container = target.closest('.container_tabs');
    container.querySelectorAll('.row_tabed .tabs-button').forEach((ite, idx)=>{
      ite.classList.remove('active')
      if(ite == father){
        ite.classList.add('active')
        container.querySelectorAll('.tabs-content .container_content').forEach((el, i)=>{
          el.classList.add('hidden')
            if(i == idx){
              el.classList.remove('hidden')

              $('.fixed_comparison .wrapper .fixed_contains .box_flow').each((xx, ele)=>{ $(ele).addClass('hidden') })
              $('.fixed_comparison .wrapper .fixed_contains .box_flow').each((xx, ele)=>{
                if(xx == idx){
                  $(ele).removeClass('hidden')
                }
              })
            }
        })
      }
    })
  })
})

// Comparsion function
function comparsionSize(){
  $('.container_comparison .overflow_collection').each((idx, item) => {
    let child_count = $(item).children().length;
    $(item).width(child_count * 350);

    $('.fixed_comparison .wrapper .fixed_contains .box_flow').each((i, el)=>{
      if(i == idx){
        $(el).width(child_count * 350);
      }
    })

    $('.tabs-content .container_content .content').each((ia, elem) => {
      $(elem).scroll(() => {
        let positionScroll = $(elem).scrollLeft();
        var maxScroll = elem.scrollWidth - elem.clientWidth;
        let innerWidth = maxScroll / child_count;
        let currentChild = Math.ceil(positionScroll / innerWidth);
        let progressPercent = currentChild / child_count * 100;
        let container = $(elem).closest('.container_content');
        let progress = $(container).find('.progress');
        $(progress).css('background-size', `${progressPercent}% 100%`).attr('aria-valuenow', progressPercent);
        $('.fixed_comparison .wrapper .fixed_contains .box_flow').each((ix, el)=>{
          if(ix == ia){
            $(el).css('transform', 'translateX(-' + $(elem).scrollLeft() + 'px)')
          }
        })
      });
    });
  });
}comparsionSize()
$(window).resize(()=>{comparsionSize()})
if(document.querySelector('.container_comparison')){
function closeFixedCoparison(){
  $('.fixed_comparison').css('transition', '0.5s ease-in-out')
  $('.fixed_comparison').css('top', -$('.fixed_comparison').height() + 'px')
  setTimeout(()=>{
    $('.fixed_comparison').css('display', 'none')
  }, 500)
}
$(window).scroll(()=>{
  let top = $(window).scrollTop();
  let positionContain = $('.container_comparison').offset().top;
  let calcPos = positionContain+parseInt($('.params_comparison').height()-100);
  if( Math.floor(top) >= Math.floor(calcPos)){
    $('.fixed_comparison').css('transition', 'none')
    $('.fixed_comparison').css('top', 0)
    $('.fixed_comparison').css('display', 'flex')

    if( Math.floor(top+200) > Math.floor($('.sliders_progress').offset().top)){
      $('.fixed_comparison').css('transition', 'none')
      $('.fixed_comparison').css('top', -$('.fixed_comparison').height() + 'px')
      $('.fixed_comparison').css('display', 'none')
    }
  }else if(Math.floor(top) <= Math.floor(calcPos)){
    closeFixedCoparison()
  }
})
}
$('.container_content .content .toggle_checkbox .check').each((i, el)=>{
  $(el).change((e)=>{
    let target = $(e.target).closest('.check');
    $('.fixed_comparison .wrapper .fixed_contains .box_flow').each((xx, ele)=>{
      if(xx == i){
        $(ele).find('.check').prop('checked', $(target).prop('checked'));
      }
    })
  })
})
$('.fixed_comparison .wrapper .fixed_contains .box_flow .check').each((i, el)=>{
  $(el).change((e)=>{
    let target = $(e.target).closest('.check');
    $('.container_content .content').each((xx, ele)=>{
      if(xx == i){
        $(ele).find('.check').prop('checked', $(target).prop('checked'));
      }
    })
  })
})


// $('.container_comparison .overflow_collection .box_content .close_product').each((i, item)=>{
//   $(item).click((e)=>{
//     let father = $(e.target).closest('.box_content');
//     $('.container_comparison .overflow_collection .box_content').each((idx, elem)=>{
//       if($(elem)[0] == father[0]){
//         console.log(idx)
//         $(item).remove();
//         $('.fixed_comparison .wrapper .fixed_contains .box_flow .box_content').each((qx, el)=>{
//           if(qx == idx){
//             console.log(item)
//             $(el).remove()
//           }
//         })
//       }
//     })
//   })
// })

// .fixed_comparison .wrapper .fixed_contains .box_flow .box_content .close_product