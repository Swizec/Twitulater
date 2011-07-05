
document.write("\r\n  \u003Cstyle type=\"text/css\"\u003E\r\n    #uservoice-dialog {\r\n  z-index: 100003;\r\n  display: block;\r\n  text-align: left;\r\n  margin: -2em auto 0 auto;\r\n  position: absolute; \r\n}\r\n\r\n#uservoice-overlay {\r\n  position: absolute;\r\n  z-index:100002;\r\n  width: 100%;\r\n  height: 100%;\r\n  left: 0;\r\n  top: 0;\r\n  background-color: #000;\r\n  opacity: .7;\r\n}\r\n\r\n#uservoice-dialog[id],\r\n#uservoice-overlay[id] {\r\n\tposition:fixed;\r\n}\r\n\r\n#uservoice-overlay p {\r\npadding: 5px;\r\ncolor: #ddd;\r\nfont: bold 14px arial, sans-serif;\r\nmargin: 0;\r\nletter-spacing: -1px;\r\n}\r\n\r\n#uservoice-dialog #uservoice-dialog-close {\r\nposition: absolute;\r\nheight: 48px;\r\nwidth: 48px;\r\ntop: -11px;\r\nright: -12px;\r\ncolor: #06c;\r\ncursor: pointer;\r\nbackground: url(https://uservoice.com/images/icons/close.png) 0 0 no-repeat;\r\n}\r\n\r\n* html.dialog-open body {\r\nheight: 100%;\r\n}\r\n\r\n* html.dialog-open,\r\n* html.dialog-open body {\r\noverflow: hidden;\r\n}\r\n\r\n\r\n  \u003C/style\u003E\r\n  \r\n  \u003C!--[if IE]\u003E\r\n  \u003Cstyle type=\"text/css\"\u003E\r\n    * html #uservoice-overlay {\r\n  width: 110%;\r\n}\r\n\r\n#uservoice-overlay {\r\nfilter: alpha(opacity=70);\t\r\n}\r\n\r\n* html #uservoice-dialog #uservoice-dialog-close {\r\nbackground: none;\r\nfilter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='http://uservoice.com/images/icons/close.png');\r\n}\r\n  \u003C/style\u003E  \r\n  \u003C![endif]--\u003E\r\n");

if (!UserVoice) {
  var UserVoice = {}
}

UserVoice.Page = {
  getDimensions: function() {
    var de = document.documentElement
//     var width = window.innerWidth || self.innerWidth || (de&&de.clientWidth) || document.body.clientWidth
//     var height = window.innerHeight || self.innerHeight || (de&&de.clientHeight) || document.body.clientHeight
	var width = window.nativeWindow.width;
	var height = window.nativeWindow.height;

    return {width: width, height: height}
  }
}

UserVoice.Dialog = {
  show: function(id_or_html) {
	this.windowOriginalHeight = window.nativeWindow.height;
	window.nativeWindow.height = ( window.nativeWindow.height < 400 ) ? 400 : window.nativeWindow.height;
    var element = document.getElementById(id_or_html)
    var html = (element == null) ? id_or_html : element.innerHTML

    this.Overlay.show()
    this.setContent(html)
    this.setPosition()
    UserVoice.Element.addClassName(this.htmlElement(), 'dialog-open')
    this.element().style.display = 'block'
  },

  close: function() {
    this.element().style.display = 'none'
    UserVoice.Element.removeClassName(this.htmlElement(), 'dialog-open')
    this.Overlay.hide()
    UserVoice.onClose()
  },

  /****** Protected Methods ******/

  id: 'uservoice-dialog',

  element: function() {
    if (!document.getElementById(this.id)){
      var dummy = document.createElement('div')
      dummy.innerHTML = '<div id="'+this.id+'" class="uservoice-component" style="display:none;"><a href="" id="'+this.id+'-close"></a><div id="'+this.id+'-content"></div></div>'
      document.body.appendChild(dummy.firstChild)
    }
    return document.getElementById(this.id)
  },

  setContent: function(html) {
    this.element() // lazily created
    if (typeof(Prototype) != 'undefined') { // gracefully degredation in the absence of Prototype.js
      document.getElementById(this.id+"-content").innerHTML = html.stripScripts()
      setTimeout(function() {html.evalScripts()}, 100)
    } else {
      document.getElementById(this.id+"-content").innerHTML = html
    }
  },

  setPosition: function() {
    var dialogDimensions = UserVoice.Element.getDimensions(this.element())
    var pageDimensions = UserVoice.Page.getDimensions()

    var els = this.element().style
    els.width = 'auto'
    els.height = 'auto'
    els.left = ((pageDimensions.width - dialogDimensions.width)/2) + "px"
    els.top = ((pageDimensions.height - dialogDimensions.height)/2) + "px"
  },

  htmlElement: function() {
    return document.getElementsByTagName('html')[0]
  }
}

UserVoice.Dialog.Overlay = {

  show: function() {
    this.hideSelects()  // TODO Check for ie6
    this.hideSwf()
    this.element().style.display = 'block'
  },

  hide: function() {
    this.element().style.display = 'none'
    this.showSelects()  // TODO Check for ie6
    this.showSwf()
  },

  /****** Protected Methods ******/

  id: 'uservoice-overlay',

  element: function() {
    if (!document.getElementById(this.id)){
      var dummy = document.createElement('div')
      dummy.innerHTML = '<div id="'+this.id+'" class="uservoice-component" onclick="UserVoice.Dialog.close(); return false;" style="display:none;"></div>'
      document.body.appendChild(dummy.firstChild)
    }
    return document.getElementById(this.id)
  },

  hideSwf: function() {
    embeds = document.getElementsByTagName("embed")
    for (i = 0; i != embeds.length; i++) {
      if (embeds[i].getAttribute('type').match("x-shockwave-flash")) embeds[i].style.visibility = "hidden";
    }

    objects = document.getElementsByTagName("object")
    for (i = 0; i != objects.length; i++) {
      objects[i].style.visibility = "hidden";
    }
  },

  showSwf: function() {
    embeds = document.getElementsByTagName("embed")
    for (i = 0; i != embeds.length; i++) {
      if (embeds[i].getAttribute('type').match("x-shockwave-flash")) embeds[i].style.visibility = "visible";
    }

    objects = document.getElementsByTagName("object")
    for (i = 0; i != objects.length; i++) {
      objects[i].style.visibility = "visible";
    }
  },

  hideSelects: function() {
  	selects = document.getElementsByTagName("select")
  	for (i = 0; i != selects.length; i++) {
  		selects[i].style.visibility = "hidden"
  	}
  },

  showSelects: function() {
  	selects = document.getElementsByTagName("select")
  	for (i = 0; i != selects.length; i++) {
  		selects[i].style.visibility = "visible"
  	}
  }
}

// Culled from Prototype.js
UserVoice.Element = {
  getDimensions: function(element) {
    var display = element.display
    if (display != 'none' && display != null) // Safari bug
      return {width: element.offsetWidth, height: element.offsetHeight}

    // All *Width and *Height properties give 0 on elements with display none,
    // so enable the element temporarily
    var els = element.style
    var originalVisibility = els.visibility
    var originalPosition = els.position
    var originalDisplay = els.display
    els.visibility = 'hidden'
    els.position = 'absolute'
    els.display = 'block'
    var originalWidth = element.clientWidth
    var originalHeight = element.clientHeight
    els.display = originalDisplay
    els.position = originalPosition
    els.visibility = originalVisibility
    return {width: originalWidth, height: originalHeight}
  },

  hasClassName: function(element, className) {
    var elementClassName = element.className
    return (elementClassName.length > 0 && (elementClassName == className ||
      new RegExp("(^|\\s)" + className + "(\\s|$)").test(elementClassName)))
  },

  addClassName: function(element, className) {
    if (!this.hasClassName(element, className))
      element.className += (element.className ? ' ' : '') + className
    return element
  },

  removeClassName: function(element, className) {
    element.className = element.className.replace(
      new RegExp("(^|\\s+)" + className + "(\\s+|$)"), ' ')
    return element
  }
}

UserVoice.onClose = function() {}


UserVoice.PopIn = {
  show: function() {
    var referer = window.location.href;
    if (referer.indexOf('?') != -1) { referer = referer.substring(0, referer.indexOf('?')) } // strip params
    var url = "http://twitulater.uservoice.com/pages/general/widgets/popin.html?referer=" + referer;
    UserVoice.Dialog.show("<iframe src=\"" + url + "\" frameborder=\"0\" scrolling=\"no\" allowtransparency=\"true\" width=\"580px\" height=\"300px\"></iframe>");
  }
}

document.write("\r\n  \u003Cstyle type=\"text/css\"\u003E\r\n    a#uservoice-feedback-tab {\r\n      position: fixed;\r\n      right: 0;\r\n      top: 40%;\r\n      display: block;\r\n      background: #00BCBA url(http://twitulater.uservoice.com/images/feedback_tab.png) -2px 50% no-repeat;\r\n      text-indent: 4000px;\r\n      width: 25px;\r\n      height: 90px;\r\n      margin-top: -45px;\r\n      border: outset 1px #00BCBA;\r\n      border-right: none;\r\n      z-index: 100001;\r\n    }\r\n    \r\n    a#uservoice-feedback-tab:hover {\r\n      background-color: #06c;\r\n      border: outset 1px #06c;\r\n      border-right: none;\r\n      cursor: pointer;\r\n    }\r\n  \u003C/style\u003E\r\n  \r\n  \u003C!--[if IE]\u003E\r\n    \u003Cstyle type=\"text/css\"\u003E\r\n      * html a#uservoice-feedback-tab {\r\n        position: absolute;\r\n        background-image: none;\r\n        filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src='http://twitulater.uservoice.com/images/feedback_tab.png');\r\n      }\r\n    \u003C/style\u003E\r\n  \u003C![endif]--\u003E\r\n  \r\n  \u003Ca id=\"uservoice-feedback-tab\" onclick=\"this.blur(); try { UserVoice.PopIn.show(); return false; } catch(e){}\" href=\"http://twitulater.uservoice.com/?referer_type=tab\"\u003EFeedback\u003C/a\u003E\r\n  \r\n");