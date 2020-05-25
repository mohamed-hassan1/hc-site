$(document).ready(function() {
  // Global
  let globalObj = {
    dimPercent: null,
    touchStart: 0,
    getPercent: function() { // Get Dimension Percentage
      let getPercent = ($(window).height() / 100) / 9;
      globalObj.dimPercent = getPercent;
    },
    eleValue: function(ele, val) { // Get Element Dimensions
      if ($(ele).css(val) !== null) {
        let num = 1, num2 = 1, screenDim = $(window).width() - $(window).height();
        if (window.innerWidth <= 1100 && ((val !== 'padding-bottom' && val !== 'padding-top') && val !== 'margin-top')) {
          num = 0.80;
        }
        if ((screenDim < 600 && screenDim >= 350) || ($(window).width() >= 1700 && (screenDim >= 600 && screenDim <= 800))) {
          num = 0.80;
        } else if ($(window).width() > 1000 && screenDim < 350) {
          num = 0.60;
        } else if ($(window).width() <= 1000 && screenDim < 350) {
          num = 0.70;
        }
        if (ele.hasAttribute('dim-num') && (val === 'width' || val === 'height')) {
          num2 = Number(ele.getAttribute('dim-num'));
        }
        // Check for default value
        if (ele.hasAttribute('curr' + val)) {
          return Number(ele.getAttribute('curr' + val));
        }
        if (!isNaN(Number($(ele).css(val).replace('px', '')) * num * num2)) {
          return Number($(ele).css(val).replace('px', '')) * num * num2;
        }
      }
      return null;
    },
    eleDimension: function(list, type, arr) { // Set Element Dimensions
      let percent = globalObj.dimPercent;
      for (let i = 0; i < list.length; i++) {
        let values = [
          ['width', globalObj.eleValue(list[i], 'width')],
          ['height', globalObj.eleValue(list[i], 'height')],
          ['font-size', globalObj.eleValue(list[i], 'font-size')],
          ['padding-top', globalObj.eleValue(list[i], 'padding-top')],
          ['padding-bottom', globalObj.eleValue(list[i], 'padding-bottom')],
          ['top', globalObj.eleValue(list[i], 'top')],
          ['left', globalObj.eleValue(list[i], 'left')],
          ['right', globalObj.eleValue(list[i], 'right')],
          ['bottom', globalObj.eleValue(list[i], 'bottom')],
          ['margin-top', globalObj.eleValue(list[i], 'margin-top')]
        ];
        if (type === 'svg') { // SVG
          // Store the default width & height
          if (!list[i].hasAttribute('currwidth')) {
            list[i].setAttribute('currwidth', values[0][1]);
            list[i].setAttribute('currheight', values[1][1]);
          }
          if (!$(list[i]).hasClass('nwidth')) {
            values[0][1] = Number(list[i].getAttribute('currwidth'));
            list[i].setAttribute('width', percent * values[0][1]);
          }
          if (!$(list[i]).hasClass('nheight')) {
            values[1][1] = Number(list[i].getAttribute('currheight'));
            list[i].setAttribute('height', percent * values[1][1]);
          }
          values[0][1] = null;
          values[1][1] = null;
        }

        for (let a = 0; a < arr.length; a++) {
          if (values[arr[a]][1] !== null) {
            let sign = 'px';
            if (arr[a] === 2) { // Font Size
              sign = 'rem';
            }
            // Set Element Value
            if ($(list[i]).hasClass(values[arr[a]][0] + '-dim')) {
              let num = percent * values[arr[a]][1];
              if (arr[a] === 2) { // Font Size rem
                num = num / 16;
              }
              $(list[i]).css(values[arr[a]][0], num + sign);
              // Store the default width & height
              if (!list[i].hasAttribute('curr' + values[arr[a]][0])) {
                list[i].setAttribute('curr' + values[arr[a]][0], values[arr[a]][1]);
              }
            }
          }
        }

        // set ele position
        if ($(list[i]).hasClass('pos') && window.innerWidth > 767) {
          setTimeout(function() {
            let getEle = $(list[i]).parent().parent().find('.txt h1'),
                posTop =  getEle[0].getBoundingClientRect().top + (getEle.height() * 0.5) - ($(list[i]).height() * 0.5),
                posBottom = getEle[0].getBoundingClientRect().top + (getEle.height()) - ($(list[i]).height()),
                addNum = 0;
            if (list[i].hasAttribute('add-num')) {
              addNum = Number(list[i].getAttribute('add-num'));
            }
            posTop += addNum;
            posBottom += addNum;
            if ($(list[i]).hasClass('pos-top')) {
              $(list[i]).css('top', posTop + 'px');
            } else if ($(list[i]).hasClass('pos-bottom')) {
              $(list[i]).css('top', posBottom + 'px');
            }
          },2);
        }
      }
    },
    floatingEleStyle: function(section) { // floating btn/icons style on scroll
      if (window.innerWidth > 767) {
        let logo = $('.floating-content .logo'),
            navBtn1 = $('.navbar-container .nav-btn a').first(),
            navBtn2 = $('.navbar-container .nav-btn a').last(),
            menuBtn = $('.floating-content .menu-container button'),
            socialIcons = $('.floating-content .floating-icons > .social-container'),
            scrollArrow = $('.floating-content .scroll-container'),
            slideArrow = section.closest('.section').find('.slides-arrow button'),
            arr = [
              ['d-logo', logo], //0
              ['d-navbtn1', navBtn1],//1
              ['d-navbtn2', navBtn2],//2
              ['w-navbtn1', navBtn1],//3
              ['w-navbtn2', navBtn2],//4
              ['y-navbtn1', navBtn1],//5
              ['y-navbtn2', navBtn2],//6
              ['w-arrow', scrollArrow],//7
              ['social-space', socialIcons],//8
              ['social-left', socialIcons],//9
              ['social-white', socialIcons],//10
              ['menu-space', menuBtn],//11
              ['menu-white-bg', menuBtn],//12
              ['menu-yellow-bg', menuBtn],//13
              ['s-nextarr', slideArrow.last()],//14
              ['s-prevarr', slideArrow.first()],//15
              ['next-arr-b', slideArrow.last()],//16
              ['prev-arr-b', slideArrow.first()],//17
              ['hide-scrollarr', scrollArrow]//18
            ];
        for (let i = 0; i < arr.length; i++) {
          if (section.hasClass(arr[i][0]) && !(arr[i][1].hasClass(arr[i][0]))) {
            arr[i][1].addClass(arr[i][0]);

          } else if (!(section.hasClass(arr[i][0])) && arr[i][1].hasClass(arr[i][0])) {
            arr[i][1].removeClass(arr[i][0]);
          }
        }
      }
    },
    desktopSlideNavigation: function(section, dir) { // Slide arrow navigation
      if (window.innerWidth > 767 && section.find('.slide')[0]) {
        let currSlide = section.find('.slide.active'),
            nextSlide, prevSlide;
          // get next slide
         if (currSlide.next()[0]) {
          nextSlide = currSlide.next();
         } else {
           nextSlide = $(currSlide.parent()[0].children[0]);
         }
         // get prev slide
         if (currSlide.prev()[0]) {
          prevSlide = currSlide.prev();
         } else {
          prevSlide = currSlide.parent().children().last();
         }

        if (dir === 'next') { // Next Arrow
          globalObj.floatingEleStyle(nextSlide);
          fullpage_api.moveSlideRight();
        } else { // Prev Arrow
          globalObj.floatingEleStyle(prevSlide);
          fullpage_api.moveSlideLeft();
        }
      }
    },
    initFloatingStyle: function(section, des) {
      // Check for Dark/White section classes for logo/btn/arrow
      let scrollArrow = $('.floating-content .scroll-container');
      if (section.hasClass('slides-container')) {
        section = section.find('.slide.active');
      }
      globalObj.floatingEleStyle(section, null);
      // arrow/active
      if (des.index !== 0) {
        scrollArrow.addClass('active');
      } else {
        scrollArrow.removeClass('active');
      }
      if (section.hasClass('line-bar') && section.find('.line-bar-shape').hasClass('active')) {
        scrollArrow.addClass('hide-scrollarr');
      }
      if (section.hasClass('contact-section')) {
        $('#google_map').addClass('active');
      }
    },
    slideHeight: function(section) { // Add height classes
      if ($(window).height() >= 1000) {
        section.addClass('extra-height');
      } else if (window.innerWidth > 767 && ($(window).height() < 1000 && $(window).height() >= 850)) {
        section.addClass('high-height');
      } else if (window.innerWidth > 767 && ($(window).height() < 850 && $(window).height() >= 790)) {
        section.addClass('mid-height');
      } else if (window.innerWidth > 767 && $(window).height() <= 750) {
        section.addClass('low-height');
      }
    },
    lineAnimation: function(line, length, fullWidth, dir, getNum) { // Blog & Feedback line bar animation
      let bar = line.children(),
          num = line.width() / length;
      if (bar.width() === 0) {
        if (fullWidth) {
          num = $(window).width() / length;
        }
      }
      if (getNum) {
        return num;
      }
      if (dir) { // true => next
        bar.css('width', bar.width() + num);
      } else { // false => prev
        bar.css('width', bar.width() - num);
      }
    },
    slideDirection: ['left', null],
    slideLength: { // store blog & feedback slides length
      blog: 0,
      feedback: 0
    }
  };

  // Call fullPage Scroll plugin
  if (window.innerWidth > 767) {
    if ($('#fullpage')[0]) {
      $('#fullpage').fullpage({
        controlArrows: false,
        onLeave: function(ori, des) { // outer slide
          globalObj.initFloatingStyle($(des.item), des);
        },
        onSlideLeave: function(ori,des, slide, dir) { // inner slide
          if ($('.section.active').hasClass('blog-section')) {
            let section = $('.section.blog-section'),
                shape2 = section.find('.shapes .bottom-shape .shape2'),
                blogLength = globalObj.slideLength.blog,
                line = section.find('.shapes .bottom-shape .shape2'),
                owl = section.find('.description.owl-carousel'),
                scrollArrow = $('.floating-content .scroll-container');
            if (dir === 'right') { // Blog arrow
              if (slide.index > 0) {
                line.addClass('active');
                owl.trigger('next.owl.carousel');
                globalObj.lineAnimation(shape2, blogLength, true, true, false);
                if (!section.hasClass('solo-section')) {
                  scrollArrow.addClass('hide-scrollarr');
                }
              } else {
                line.children().css('width', globalObj.lineAnimation(shape2, blogLength, true, true, true));
                line.removeClass('active');
                owl.trigger('to.owl.carousel', 0);
                scrollArrow.removeClass('hide-scrollarr');
              }
            } else {
              if (slide.isLast) {
                owl.trigger('to.owl.carousel', slide.index);
                line.children().css('width', globalObj.lineAnimation(shape2, blogLength, true, true, true) * (slide.index + 1));
                line.addClass('active');
                if (!section.hasClass('solo-section')) {
                  scrollArrow.addClass('hide-scrollarr');
                }
              } else {
                owl.trigger('prev.owl.carousel');
                globalObj.lineAnimation(shape2, blogLength, true, false, false);
                if (slide.isFirst) {
                  line.removeClass('active');
                } 
              }
            }
          } else {
            let getSlide = $($(ori.item).find('.fp-slidesContainer')[0].children[slide.index]);
            globalObj.floatingEleStyle(getSlide);
          }
        }
      });
      globalObj.initFloatingStyle($('.section.active'), {index: 0});
    }
  }
  // show scrollbar
  $('body').addClass('ready');
  // Set Dimensions
  setDimensions();

  // *** Global Events ***

  // On Resize Window
  $(window).on('resize', setDimensions);


  // *** Global Functions ***

  // Set Dimentions
  function setDimensions() {
    if (window.innerWidth > 767) {
      globalObj.getPercent();

      // Set Floating Container to window width & height
      if (!$('.floating-content').hasClass('fixed')) {
        $('.floating-content').css({
          'height' : $(window).height() + 'px'
        });
      }

      // Set ALL Elements Dimensions
      eleDimensions();
      // Services Section
      sectionServices();
      // Transition Section
      sectionTransition();
      // Blog Section
      sectionBlog();
      // Feedback Section
      sectionFeedback();
      // Contact Section
      contactSection();
      // project Detail
      projectDetail();
      // Blog Detail
      blogDetail();
    } else { // Mobile Screen
      // Line shape height
      $('.home-section .side-shape .shape1').css('height', 109.6 + $('.home-section .description').height() + 'px');
      let aSContentHeight = $('.about-section .heading').height() + $('.about-section .description').height();
      if (aSContentHeight > 196) {
        $('.about-section .side-shape .shape7').css('height', ((310 + aSContentHeight) * 0.582) + 'px');
      } else {
        $('.about-section .side-shape .shape7').css('height', '310px');
      }
    }
  }

  if (window.innerWidth <= 767) {
    // Services Section
    sectionServices();
    // Transition Section
    sectionTransition();
    // Blog Section
    sectionBlog();
    // Feedback Section
    sectionFeedback();
    // Contact Section
    contactSection();
    // project Detail
    projectDetail();
    // Blog Detail
    blogDetail();
  }
  
  // Set Content Dimensions
  function eleDimensions() {
    let allSVG = document.querySelectorAll('.section svg'),
        getAllEleDim = document.querySelectorAll('.eledim');
    // Set All SVG Dimensions
    globalObj.eleDimension(allSVG, 'svg', [0,1,4,5,6]);
    // Set Elements Dimensions
    globalObj.eleDimension(getAllEleDim, 'ele', [0,1,2,3,4,5,6,7,8,9]);
  }

  // Menu button
  let menuNavbarBtn = $('.floating-content .menu-container button'),
      navMenu = $('.floating-content .menu-navbar-container'),
      mainLinks = navMenu.find('.main-links'),
      menuCloseBtn = $('.floating-content .menu-navbar-container .close-btn button');
  menuNavbarBtn.on('click', function() {
    navMenu.fadeIn('fast');
    if (window.innerWidth > 767) {
      if ($('#fullpage')[0]) {
        $.fn.fullpage.setAllowScrolling(false);
      } else {
        $('body').css('overflow', 'hidden');
      }
    } else {
      $('body').css('overflow', 'hidden');
    }
  });
  
  // Close menu button
  menuCloseBtn.on('click', function() {
    navMenu.fadeOut('fast');
    mainLinks.removeAttr('style');
    if (window.innerWidth > 767) {
      if ($('#fullpage')[0]) {
        $.fn.fullpage.setAllowScrolling(true);
      } else {
        $('body').css('overflow', 'auto');
      }
    } else {
      $('body').css('overflow', 'auto');
    }
  });

  // Scroll to top button
  if (window.innerWidth <= 767 && $('.go-top')[0]) {
    $('.go-top').on('click', function() {
      $('html, body').animate({scrollTop: 0}, 'slow');
    });
  }
  // Set height classes
  $('.section').each(function() {
    globalObj.slideHeight($(this));
  });

  // *** Sections Functions ***
  // Services Section
  function sectionServices() {
    if (document.querySelector('.section.services-section')) {
      if (window.innerWidth > 767 && $(window).height() >= 780) {
        $('.services-section .panel-container:nth-child(1)').css('padding-top', '83px');
        $('.services-section .panel-container:nth-child(2)').css('padding-top', '30px');
      } else if (window.innerWidth > 767) {
        $('.services-section .panel-container:nth-child(1)').css('padding-top', '53px');
        $('.services-section .panel-container:nth-child(2)').css('padding-top', '10px');
      }
    }
  }

  // Transition Section
  function sectionTransition() {
    if (window.innerWidth > 767 && document.querySelector('.section.transition-section')) {
      let section = $('.section.transition-section'),
          projectHead = section.find('.project-head'),
          winDim = $(window).width() - $(window).height(),
          num = 4;
      if (($(window).height() <= 900 &&winDim <= 800) || ($(window).height() >= 900 && winDim <= 800)) {
        projectHead.addClass('eledim font-size-dim');
        globalObj.eleDimension(projectHead, 'ele', [2]);
      }
      if ($(window).height() <= 710) {
        if (!section.hasClass('btm-space')) {
          section.addClass('btm-space');
        }
      } else {
        if (section.hasClass('btm-space')) {
          section.removeClass('btm-space');
        }
      }
      if (section.find('.transition-slide')[0]) {
        let fInnerTxt = section.find('.bottom-txt .inner-txt:first-child'),
            shapeRect = fInnerTxt.height() - Number(fInnerTxt.find('.shape2').css('height').replace('px', '')),
            getShapeRect = Number(fInnerTxt.find('.shape2').css('height').replace('px', '')),
            shapeLine = fInnerTxt.find('.shape3'),
            topLinePos = fInnerTxt.find('.shape2')[0].getBoundingClientRect().top - section[0].getBoundingClientRect().top;
        if (window.innerWidth <= 1199) {
          num = 18;
        }
        // Line position
        shapeLine.css({
          'top': ((shapeRect + fInnerTxt.height()) - 4) + 'px',
          'height': window.innerHeight - (topLinePos + getShapeRect) + num + 'px'
        });
      }

      let project1 = section.find('.project1'),
          slideArrow = section.find('.project-arrow'),
          headingShape = project1.find('.slide-heading svg')[0].getBoundingClientRect().top - section[0].getBoundingClientRect().top,
          project2Note = section.find('.project2 .slide-heading .note').height() + 5,
          lineShape = section.find('.project:not(.project1) .side-shape .shape1'),
          slideHeading = section.find('.project2 .slide-heading'),
          slideHeadingExtra = section.find('.project .slide-heading.extra-top'),
          imgTop = section.find('.img-top');
      
      // Previous Work button
      section.find('.prev-work-link').on('click', function() {
        globalObj.desktopSlideNavigation(section, 'next');
      });
      // next arrow
      slideArrow.find('.next-arrow').on('click', function() {
        globalObj.desktopSlideNavigation(section, 'next');
      });
      // prev arrow
      slideArrow.find('.prev-arrow').on('click', function() {
        globalObj.desktopSlideNavigation(section, 'prev');
      });
      lineShape.css('top', headingShape + 'px');
      slideHeading .css('margin-top', (headingShape - project2Note) + 'px');
      slideHeadingExtra.css('margin-top', headingShape + lineShape.height() + 50);
      imgTop.each(function() {
        $(this).css('margin-top', headingShape - (($(this).height() * 0.5)) + lineShape.height() * 0.5);
      });
    } else if (window.innerWidth <= 767 && document.querySelector('.section.transition-section')) {
      // Portfolio Owl Carousel mobile
      let section =  $('.section.transition-section'),
          projects = section.find('.project:not(.project1)'),
          nxtArr = section.find('.project-arrow button.next-arrow'),
          prevArr = section.find('.project-arrow button.prev-arrow');

      projects.wrapAll('<div class="project-container owl-carousel"></div>');
      let projectOwl = $('.section.transition-section .project-container');
      // Call OwlCarousel
      projectOwl.owlCarousel({
        dots: true,
        nav: false,
        items: 1,
        smartSpeed: 500
      });
      // Nav arrows
      nxtArr.on('click', function() { // next
        projectOwl.trigger('next.owl.carousel');
      });
      prevArr.on('click', function() { // prev
        projectOwl.trigger('prev.owl.carousel');
      });

      if (section.hasClass('solo-section')) {
        $('.floating-content .logo h1').css('color', '#000');
        if ($('.shape-mob')[0]) {
          section.find('.shape-mob').css('height', (projectOwl.height() - 53) + 'px');
        }
      }

    }
  }

  // Blog Section
  function sectionBlog() {
    if ($('.section.blog-section')[0]) {
      let section = $('.section.blog-section'),
          blogOwl = section.find('.description.owl-carousel'),
          nextBtn = section.find('.slides-arrow .next-arrow'),
          prevBtn = section.find('.slides-arrow .prev-arrow'),
          scrollArrow = $('.floating-content .scroll-container'),
          blogBoxNxtArr = blogOwl.find('.next-arr'),
          blogBoxPrevArr = blogOwl.find('.prev-arr'),
          shape2 = section.find('.shapes .bottom-shape .shape2'),
          num = 0, blogLength = blogOwl.children().length;

      if (window.innerWidth > 767) {
        num = 20;
      }

      globalObj.slideLength.blog = blogLength;

      // Blog Box Carousel
      blogOwl.owlCarousel({
        nav: false,
        mouseDrag: false,
        items: 1,
        center: true,
        margin: num,
        responsive: {
          0: {items: 1},
          768: {items: 2},
          992: {items: 3}
        }
      });
      globalObj.lineAnimation(shape2, blogLength, true, true, false);
      if (section.hasClass('solo-section')) {
        blogOwl.trigger('refresh.owl.carousel');
        $('.floating-content .logo').addClass('d-logo');
        if (window.innerWidth <= 767) {
          let frame = $(window);
          if (frame.height() < $('body').height()) {
            frame = $('body');
          }
          section.find('.shapes .top-shape .shape3').css('min-height', (frame.height() - 110) + 'px');
          section.find('.content').css('min-height', frame.height() + 'px');
        }
      }
      let owlItem = blogOwl.find('.owl-item');
      owlItem.first().addClass('show-des');
      nextBtn.on('click', function() {
        arrowFun(true);
      });
      // Arrow navigation
      blogBoxNxtArr.on('click', function() {
        arrowFun(true);
      });
      prevBtn.on('click', function() {
        arrowFun(false);
      });
      blogBoxPrevArr.on('click', function() {
        arrowFun(false);
      });
      if (window.innerWidth > 767) {
        blogOwl.on('changed.owl.carousel', function(event) {
          if (event.item.index === 0) {
            if (!section.hasClass('solo-section')) {
              scrollArrow.removeClass('hide-scrollarr');
            }
            shape2.removeClass('active');
          }
          owlItem.removeClass('show-des');
          $(owlItem[event.item.index]).addClass('show-des');
        });
        let lineShape = section.find('.side-shape .shape1')[0].getBoundingClientRect().top,
            sectionPos = section[0].getBoundingClientRect().top,
            contentHeading = section.find('.content .heading'),
            headingTxt = contentHeading.find('.blog-heading').height() + 10;
        contentHeading.css('padding-top', (lineShape - sectionPos) - headingTxt);
        contentHeading.css('height', (lineShape - sectionPos) - 25);
      }

      let blogBg = blogOwl.find('.bg');
      if (window.innerWidth > 767 && ($(window).height() <= 785 && $(window).height() > 710)) {
        let blogBg = blogOwl.find('.bg');
        blogBg.attr('currheight', 250);
        globalObj.eleDimension(blogBg, 'ele', [1]);
      } else if (window.innerWidth > 767 && $(window).height() <= 710) {
        section.addClass('mid-height');
        blogBg.attr('currheight', 235);
        globalObj.eleDimension(blogBg, 'ele', [1]);
      }
      // arrow function
      function arrowFun(dir) {
        if (dir) {
          if (window.innerWidth > 767 && section.find('.slide.active').next()[0]) {
            globalObj.slideDirection[0] = 'left';
            globalObj.slideDirection[1] = blogOwl;
            fullpage_api.moveSlideRight();
            if (!section.hasClass('solo-section')) {
              scrollArrow.addClass('hide-scrollarr');
            }
            shape2.addClass('active');
          } else if (window.innerWidth <= 767) {
            blogOwl.trigger('next.owl.carousel');
          }
        } else {
          if (window.innerWidth > 767 && section.find('.slide.active').prev()[0]) {
            globalObj.slideDirection[0] = 'right';
            globalObj.slideDirection[1] = blogOwl;
            fullpage_api.moveSlideLeft();
          } else if (window.innerWidth <= 767) {
            blogOwl.trigger('prev.owl.carousel');
          }
        }
      }

    }
  }

  // Feedback Section
  function sectionFeedback() {
    if ($('.section.feedback-section')[0]) {
      let section = $($('.section.feedback-section')),
          feedbackOwl = section.find('.owl-carousel'),
          feedBackNxtArr = section.find('.next-arrow'),
          feedBackPrevArr = section.find('.prev-arrow'),
          scrollArrow = $('.floating-content .scroll-container'),
          shape1 = section.find('.shapes .bottom-shape .shape1'),
          lineBar = section.find('.line-bar'),
          lineBar2 = section.find('.line-bar-shape'),
          heightStatus = false, feedbackLength = feedbackOwl.children().length;
      
      if (window.innerWidth <= 767 && section.hasClass('about-us-section')) {
        heightStatus = true;
        let slide4Txt = section.find('.slide4-txt');
        slide4Txt.closest('.content')[0].insertBefore(slide4Txt[0], slide4Txt.parent().parent().parent().next()[0]);
      }
      globalObj.slideLength.feedback = feedbackLength;
      // Call owlCarousel
      feedbackOwl.owlCarousel({
        nav: false,
        items: 1,
        mouseDrag: false,
        smartSpeed: 500,
        autoHeight: heightStatus
      });
      
      // About Us Solo Section
      if (section.hasClass('about-us-section')) {
        globalObj.floatingEleStyle(section.find('.owl-item.active .inner-content'));
        let innerSlide = section.find('.slide-txt-content .innerslide-txt-content'),
            lineShape = section.find('.slide-heading .line-shape'),
            innerSlideArr = [];
        if ($(window).width() > 767) {
          feedbackLength = section.find('.fb-slide').length;
          globalObj.slideLength.feedback = feedbackLength;
          globalObj.lineAnimation(lineBar, feedbackLength, false, true, false);
          innerSlide.each(function() {
            innerSlideArr.push($(this).height());
          });
          setTimeout(function() {
            section.find('.fb-slide').css('padding-top', lineShape[0].getBoundingClientRect().top);
          }, 10);
          innerSlide.css('min-height', Math.max(...innerSlideArr));
        }
        // About us navigation button
        let firstSlideBtn = section.find('.slide-btn-slide1 button');
        firstSlideBtn.on('click', function() {
          let index = Array.prototype.slice.call($(this).parent()[0].children).indexOf($(this)[0]) + 1;
          if (window.innerWidth <= 767 && index === 4) {
            index += 1;
          }
          feedbackOwl.trigger('to.owl.carousel', index);
          let innerContent = section.find('.owl-item.active .inner-content');
          globalObj.floatingEleStyle(innerContent);
          if (window.innerWidth > 767 && innerContent.hasClass('fb-slide')) {
            section.find('.feedback-arrow').addClass('d-none');
          }
          if (window.innerWidth <= 767 && innerContent.hasClass('w-next-arr')) {
            $('.slides-arrow .next-arrow').addClass('w-next-arr');
          } else if (window.innerWidth <= 767) {
            $('.slides-arrow .next-arrow').removeClass('w-next-arr');
          }
        });
        // Next Arrow
        section.find('.nextSlideBtn').on('click', function() {
          feedbackOwl.trigger('next.owl.carousel');
          let innerContent = section.find('.owl-item.active .inner-content');
          globalObj.floatingEleStyle(innerContent);
          if (innerContent.hasClass('fb-slide')) {
            lineBar.addClass('active');
          }
        });
        // Prev Arrow
        section.find('.prevSlideBtn').on('click', function() {
          feedbackOwl.trigger('prev.owl.carousel');
          let innerContent = section.find('.owl-item.active .inner-content');
          globalObj.floatingEleStyle(innerContent);
        });
        if (window.innerWidth <= 767) {
          $('.floating-content .logo').addClass('d-logo');
          let fbSlide = section.find('.fb-slide');
          if (fbSlide.length > 1) {
            let num = fbSlide.length - 1,
                dots = section.find('.owl-dots')[0].children;
            for (let i = num; i > 0; i--) {
              $(dots[dots.length - i]).addClass('d-none');
              if (i === num) {
                $(dots[dots.length - i]).prev().addClass('last-dot');
              }
            }
          }
        }
      } else {
        globalObj.lineAnimation(lineBar2, feedbackLength, true, true, false);
      }
      // Next Arrow testimonials
      feedBackNxtArr.on('click', function() {
        if (window.innerWidth <= 767 && $(this).hasClass('top-arrow')) {
          if ($('.owl-dot.active.last-dot')[0]) {
            $('.owl-dot.active.last-dot').addClass('black-dot');
          }
          feedbackOwl.trigger('next.owl.carousel');
        } else {
          if (!(window.innerWidth <= 767 && (section.hasClass('about-us-section') && section.find('.owl-item.active .inner-content.fb-slide')[0]))) {
            if ($('.owl-dot.black-dot')[0]) {
              $('.owl-dot.black-dot').removeClass('black-dot');
            }
            if (section.hasClass('about-us-section')) {
              lineBar2 = lineBar;
            }
            globalObj.lineAnimation(lineBar2, globalObj.slideLength.feedback, true, true, false);
            feedbackOwl.trigger('next.owl.carousel');
            scrollArrow.addClass('hide-scrollarr');
            if (section.hasClass('about-us-section')) {
              let innerContent = section.find('.owl-item.active .inner-content');
              globalObj.floatingEleStyle(innerContent);
              if (innerContent.hasClass('fb-slide') && !innerContent.hasClass('fb1')) {
                lineBar.addClass('active2');
              } else if (innerContent.hasClass('fb-slide')) {
                lineBar.removeClass('active2');
              }
              if (window.innerWidth <= 767 && innerContent.hasClass('w-next-arr')) {
                $('.slides-arrow .next-arrow').addClass('w-next-arr');
              } else if (window.innerWidth <= 767) {
                $('.slides-arrow .next-arrow').removeClass('w-next-arr');
              }
            }
          }
        }
      });
      // prev arrow testimonials
      feedBackPrevArr.on('click', function() {
        if (window.innerWidth <= 767 && $(this).hasClass('top-arrow')) {
          feedbackOwl.trigger('prev.owl.carousel');
        } else {
          if (!(window.innerWidth <= 767 && (section.hasClass('about-us-section') && section.find('.owl-item.active .inner-content.fb-slide:not(.fb1)')[0]))) {
            if (section.hasClass('about-us-section')) {
              lineBar2 = lineBar;
            }
            if (section.find('.owl-item.active .inner-content').closest('.owl-item').prev().find('.inner-content').hasClass('fb-slide') || !section.hasClass('about-us-section')) {
              globalObj.lineAnimation(lineBar2, globalObj.slideLength.feedback, true, false, false);
            }
            feedbackOwl.trigger('prev.owl.carousel');
            if (section.hasClass('about-us-section')) {
              let innerContent = section.find('.owl-item.active .inner-content');
              globalObj.floatingEleStyle(innerContent);
              if (!innerContent.hasClass('fb-slide')) {
                lineBar.removeClass('active');
              }
              if (innerContent.hasClass('fb-slide') && !innerContent.hasClass('fb1')) {
                lineBar.addClass('active2');
              } else if (innerContent.hasClass('fb-slide')) {
                lineBar.removeClass('active2');
              }
              if (window.innerWidth <= 767 && innerContent.hasClass('w-next-arr')) {
                $('.slides-arrow .next-arrow').addClass('w-next-arr');
              } else if (window.innerWidth <= 767) {
                $('.slides-arrow .next-arrow').removeClass('w-next-arr');
              }
            }
          } else {
            let index = Array.prototype.slice.call(section.find('.owl-stage').children()).indexOf(section.find('.fb1').parent().prev()[0]);
            feedbackOwl.trigger('to.owl.carousel', index);
          }
        }
      });

      if (window.innerWidth > 767) {
        section.removeClass('s-prevarr');
        // on Key press
        document.addEventListener('keydown', function(e) {
          if (document.querySelector('.section.active.feedback-section')) {
            let innerContent, prevInnerContent,
                items = Array.prototype.slice.call(feedbackOwl.find('.owl-item')).indexOf(feedbackOwl.find('.owl-item.active')[0]);
            if (e.code == '39' || e.code == 'ArrowRight') { // right
              feedbackOwl.trigger('next.owl.carousel');
              innerContent = section.find('.owl-item.active .inner-content');
              prevInnerContent = innerContent.closest('.owl-item').prev().find('.inner-content');
              if (!section.hasClass('about-us-section') && feedbackOwl.find('.owl-item').length - 1 !== items) {
                globalObj.lineAnimation(lineBar2, globalObj.slideLength.feedback, true, true, false);
              } else if ((section.hasClass('about-us-section') && innerContent.hasClass('fb-slide')) && !prevInnerContent.hasClass('fb-slide')) {
                lineBar.children().css('width', globalObj.lineAnimation(lineBar, globalObj.slideLength.feedback, true, true, true));
              } else if ((section.hasClass('about-us-section') && innerContent.hasClass('fb-slide')) && (prevInnerContent.hasClass('fb-slide') && feedbackOwl.find('.owl-item').length - 1 !== items)) {
                globalObj.lineAnimation(lineBar, globalObj.slideLength.feedback, true, true, false);
              }
            } else if (e.code == 37 || e.code == 'ArrowLeft') { // left
              feedbackOwl.trigger('prev.owl.carousel');
              innerContent = section.find('.owl-item.active .inner-content');
              prevInnerContent = innerContent.closest('.owl-item').prev().find('.inner-content');
              if (!section.hasClass('about-us-section') && items !== 0) {
                globalObj.lineAnimation(lineBar2, globalObj.slideLength.feedback, true, false, false);
              } else if (section.hasClass('about-us-section') && innerContent.hasClass('fb-slide')) {
                globalObj.lineAnimation(lineBar, globalObj.slideLength.feedback, true, false, false);
              } else if (section.hasClass('about-us-section') && !innerContent.hasClass('fb-slide')) {
                lineBar.removeClass('active');
              }
            }
            if (section.hasClass('about-us-section')) {
              innerContent = section.find('.owl-item.active .inner-content');
              globalObj.floatingEleStyle(innerContent);
            }
          }
        });
      }
      // on slide leave
      feedbackOwl.on('translated.owl.carousel', function() {
        if (window.innerWidth <= 767 && section.hasClass('about-us-section')) {
          feedbackOwl.trigger('refresh.owl.carousel');
        } else if (window.innerWidth > 767 && section.hasClass('about-us-section')) {
          if (section.find('.owl-item.active .inner-content').hasClass('fb-slide')) {
            section.find('.feedback-arrow').removeClass('d-none');
            section.find('.line-bar').addClass('active');
          }          
        }
      });
      // slide change
      feedbackOwl.on('changed.owl.carousel', function(event) {
        if (!section.hasClass('hide-scrollarr')) {
          if (event.item.index >= 1) {
            if (!scrollArrow.hasClass('hide-scrollarr')) {
              scrollArrow.addClass('hide-scrollarr');
              shape1.addClass('active');
            }
          } else {
            scrollArrow.removeClass('hide-scrollarr');
            shape1.removeClass('active');
          }
        }
        if (!section.hasClass('about-us-section')) {
          if (event.item.count === (event.item.index + 1)) {
            section.removeClass('s-nextarr');
            feedBackNxtArr.removeClass('s-nextarr');
          } else {
            section.addClass('s-nextarr');
            feedBackNxtArr.addClass('s-nextarr');
          }
          if (event.item.index !== 0) {
            section.addClass('s-prevarr');
            feedBackPrevArr.addClass('s-prevarr');
          } else {
            section.removeClass('s-prevarr');
            feedBackPrevArr.removeClass('s-prevarr');
          }
        } else if (window.innerWidth <= 767 && !section.find('.owl-item.active .inner-content').hasClass('fb-slide')) {
          if ($('.owl-dot.black-dot')[0]) {
            $('.owl-dot.black-dot').removeClass('black-dot');
          }
        }
      });
    }
  }

  // Contact Section
  function contactSection() {
    if ($('.section.contact-section')[0]) {
      let section = $('.section.contact-section'),
          owlContact = section.find('.owl-carousel'),
          categoryBtn = section.find('.category-container button'),
          inputs = section.find('form .form-control'),
          msgComma = section.find('.msg-container label span'),
          prevBtn = section.find('.prev-arrow'),
          topShape = section.find('.top-shape .shape1');
      // owlcarousel contact slide
      owlContact.owlCarousel({
        items: 1,
        mouseDrag: false,
        smartSpeed: 500,
        nav: false,
        dots: false
      });

      // active category button
      categoryBtn.first().addClass('active');
      categoryBtn.on('click', function() {
        owlContact.trigger('next.owl.carousel');
        if (window.innerWidth <= 767) {
          owlContact.find('.owl-item').first().css('display', 'none');
          owlContact.find('.owl-item').last().css('float', 'right');
        }
        if (!$(this).hasClass('active')) {
          categoryBtn.removeClass('active');
          $(this).addClass('active');
        }
      });
      // prev arrow
      prevBtn.on('click', function() {
        owlContact.trigger('prev.owl.carousel');
        if (window.innerWidth <= 767) {
          owlContact.find('.owl-item').first().css('display', 'block');
          owlContact.find('.owl-item').last().css('float', 'left');
        }
      });

      if (window.innerWidth > 767) {
        setTimeout(function() {
          let contactHeading = section.find('.heading'),
              contactHeadingSpace = Number(contactHeading.css('margin-top').replace('px', ''));
        if ($(window).width() - $(window).height() <= 450) {
          contactHeading.css('margin-top', contactHeadingSpace + (contactHeadingSpace * 0.45));
        }
        let mapContainer = section.find('.map-container'),
            mapContainerPos = mapContainer[0].getBoundingClientRect().top,
            shape2Btm = section.find('.bottom-shape .shape2'),
            shape2BtmPos = shape2Btm[0].getBoundingClientRect().top;
        topShape.css('height', 'calc(100% - ' + (section[0].getBoundingClientRect().height - 65)+ 'px)');
        mapContainer.css('height', (shape2BtmPos - mapContainerPos) + (shape2Btm.height() * 0.5) + 'px');
      }, 100);
      } else if (window.innerWidth <= 767 && section.hasClass('solo-section')) {
        $('.floating-content .logo').addClass('d-logo');
        $('.floating-content .menu-container button').addClass('menu-white-bg');
      }

      let arr = [], num = 0;
      // hide/show placeholder txt on type
      inputs.on('input', function() {
        if ($(this).val() === '') {
          $(this).parent().removeClass('active');
          if ($(this)[0].id === 'message') {
            msgComma.text(':');
          }
        } else if (!$(this).parent().hasClass('active') && $(this).val() !== '') {
          $(this).parent().addClass('active');
          if ($(this)[0].id === 'message') {
            msgComma.text(',');
          }
        }
        // textarea AutoSize
        if ($(this)[0].id === 'message') {
          if ($(this)[0].scrollHeight > ($(this).height() + 10)) { // Typeing text (increase)
            arr.push($(this).val().length);
            num = $(this)[0].scrollHeight - ($(this).height() + 10);
            $(this).css('height', $(this)[0].scrollHeight + 'px');
          } else { // Deleting text (decrease)
            let txtLength = $(this).val().length;
            if (txtLength <= 5 && arr.length > 1) {
              num = num * arr.length;
              $(this).css('height', ($(this)[0].scrollHeight - num) + 'px');
            } else {
              for (let i = 0; i < arr.length; i++) {
                if (txtLength < arr[i]) {
                  arr.splice(i, 1);
                  $(this).css('height', ($(this)[0].scrollHeight - num) + 'px');
                }
              }
            }
          } 
        }
      });

      if (window.innerWidth > 767 && ($(window).height() <= 765 && $(window).height() > 700)) {
        section.addClass('mid-height');
      } else if (window.innerWidth > 767 && $(window).height() <= 700) {
        section.addClass('mid-height2');
      }

    }
  }
  // Project Detail Container
  function projectDetail() {
    if ($('.section-container > .about-container')[0]) {
      let aboutContainer = $('.section-container > .about-container'),
          feedbackContainer = $('.section-container > .feedback-container');
      if (window.innerWidth > 767) {
        let shape1 = aboutContainer.find('.shape1'),
            shape2 = aboutContainer.find('.shape2'),
            menuBtn = $('.floating-icons .menu-container button')[0],
            description = aboutContainer.find('.description')[0],
            menuBtnPos = menuBtn.getBoundingClientRect().top,
            descriptionPos = description.getBoundingClientRect().bottom,
            scroll = $(window).scrollTop(),
            shape2Pos =  Math.abs(scroll + descriptionPos),
            fbHeader = feedbackContainer.find('.heading h1 span:not(.txt-line-right)'),
            fbHeader2 = feedbackContainer.find('.heading h1 span.txt-line-right'),
            fbDescription = feedbackContainer.find('.description')[0].getBoundingClientRect().left,
            fbProjectPic = feedbackContainer.find('.project-pic'),
            fbProjectPicPos = Number(fbProjectPic.css('top').replace('px', '')) * -1;
        if (descriptionPos < 0) {
          shape2Pos =  Math.abs(scroll - Math.abs(descriptionPos));
        }
        if (window.innerWidth <= 1100) {
          shape2Pos -= 30;
        }
        // Set elements position
        shape1.css('top', (menuBtnPos - 73) + 'px');
        shape2.css('top', (shape2Pos - 59) + 'px');
        fbHeader.css('margin-right', fbDescription + 'px');
        fbHeader2.css('padding-right', fbDescription + 'px');
        feedbackContainer.css('padding-bottom', fbProjectPic.height() - (feedbackContainer.height() + fbProjectPicPos) + 'px');
      } else {
        let mobLineTxt = feedbackContainer.find('.mob-line-txt'),
            line = feedbackContainer.find('.mob-line'),
            fbHeading = feedbackContainer.find('.heading')[0].getBoundingClientRect().top;
        for (let i = 0; i < mobLineTxt.length; i++) {
          let mobLinePosR = mobLineTxt[i].getBoundingClientRect().right,
              mobLinePosT = mobLineTxt[i].getBoundingClientRect().top,
              mobLinePos = (mobLinePosT - fbHeading) + ($(mobLineTxt[i]).height() * 0.5);
          mobLinePos = mobLinePos - ($(line[i]).height() * 0.5);
          $(line[i]).css({'width': mobLinePosR + 5, 'top' : mobLinePos});
        }
      }
    }
  }
  // Blog Detail Container
  function blogDetail() {
    if ($('.wrapper.blog-detail')[0]) {
      let container = $('.blog-detail'),
          blogOwl = container.find('.owl-carousel'),
          nextArr = container.find('.next-arrow'),
          prevArr = container.find('.prev-arrow'),
          topBlog = container.find('.top-blog-container'),
          btmBlog = container.find('.bottom-blog-container');
      // Call owlCarousel
      blogOwl.owlCarousel({
        items: 1,
        mouseDrag: false,
        smartSpeed: 500,
        nav: false,
        dots: false,
        autoHeight: true
      });
      // Next Arrow
      nextArr.on('click', function() {
        blogOwl.trigger('next.owl.carousel');
      });
      // Prev Arrow
      prevArr.on('click', function() {
        blogOwl.trigger('prev.owl.carousel');
      });
      if (window.innerWidth > 767) {
        let num = 0.8, num2 = 0,
            btmShape2 = btmBlog.find('.shape2'),
            btmBg = btmBlog.find('.btm-blog-bg'),
            btmShape2Pos = (btmShape2[0].getBoundingClientRect().top - btmBlog[0].getBoundingClientRect().top) + btmShape2.height(),
            btmBgPos =  btmShape2Pos * 0.75;
        
        if (window.innerWidth >= 1900) {
          num = 0.7;
        } else if (window.innerWidth <= 1150) {
          num2 = 25;
        }
        if (window.innerWidth <= 1070) {
          num = 1.7;
        }
        // Elements position
        topBlog.each(function() {
          let topBlogPos = $(this)[0].getBoundingClientRect().top,
          topHeadingPos = $(this).find('.heading h1')[0].getBoundingClientRect().top,
          topBg = $(this).find('.top-blog-bg');
          topBg.css('top', (topHeadingPos - topBlogPos) + ($(this).find('.heading h1').height() * num));
        });
        btmBg.css('top', btmBgPos + num2);
      }
    }
  }

  //Remove Loader
  setTimeout(function() {
    $('.loader').fadeOut(500, function() {
      $(this).remove();
    });
  }, 200);
});

