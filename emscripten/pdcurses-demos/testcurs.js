// include: shell.js
// The Module object: Our interface to the outside world. We import
// and export values on it. There are various ways Module can be used:
// 1. Not defined. We create it here
// 2. A function parameter, function(moduleArg) => Promise<Module>
// 3. pre-run appended it, var Module = {}; ..generated code..
// 4. External script tag defines var Module.
// We need to check if Module already exists (e.g. case 3 above).
// Substitution will be replaced with actual code on later stage of the build,
// this way Closure Compiler will not mangle it (e.g. case 4. above).
// Note that if you want to run closure, and also to use Module
// after the generated code, you will need to define   var Module = {};
// before the code. Then that object will be used in the code, and you
// can continue to use Module afterwards as well.
var Module = typeof Module != 'undefined' ? Module : {};

// Determine the runtime environment we are in. You can customize this by
// setting the ENVIRONMENT setting at compile time (see settings.js).

// Attempt to auto-detect the environment
var ENVIRONMENT_IS_WEB = typeof window == 'object';
var ENVIRONMENT_IS_WORKER = typeof importScripts == 'function';
// N.b. Electron.js environment is simultaneously a NODE-environment, but
// also a web environment.
var ENVIRONMENT_IS_NODE = typeof process == 'object' && typeof process.versions == 'object' && typeof process.versions.node == 'string';
var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;

if (Module['ENVIRONMENT']) {
  throw new Error('Module.ENVIRONMENT has been deprecated. To force the environment, use the ENVIRONMENT compile-time option (for example, -sENVIRONMENT=web or -sENVIRONMENT=node)');
}

if (ENVIRONMENT_IS_NODE) {
  // `require()` is no-op in an ESM module, use `createRequire()` to construct
  // the require()` function.  This is only necessary for multi-environment
  // builds, `-sENVIRONMENT=node` emits a static import declaration instead.
  // TODO: Swap all `require()`'s with `import()`'s?

}

// --pre-jses are emitted after the Module integration code, so that they can
// refer to Module (if they choose; they can also define Module)
// include: /home/david/dev/ws/emcurses/emscripten/termlib.js
/*
  termlib.js - JS-WebTerminal Object v1.66

  (c) Norbert Landsteiner 2003-2015
  mass:werk - media environments
  <http://www.masswerk.at/termlib/>

  Creates [multiple] Terminal instances.

  Synopsis:

  myTerminal = new Terminal(<config object>);
  myTerminal.open();

  <config object> overrides any values of object `TerminalDefaults'.
  individual values of `id' must be supplied for multiple terminals.
  `handler' specifies a function to be called for input handling.
  (see `Terminal.prototype.defaultHandler()' and documentation.)

  globals defined in this library:
  	Terminal           (Terminal object)
    TerminalDefaults   (default configuration)
    termDefaultHandler (default command line handler)
    TermGlobals        (common vars and code for all instances)
    termKey            (named mappings for special keys)
    termDomKeyRef      (special key mapping for DOM constants)

  (please see the v. 1.4 history entry on these elements)

  required CSS classes for font definitions: ".term", ".termReverse".

  Compatibilty:
  Standard web browsers with a JavaScript implementation compliant to
  ECMA-262 2nd edition and support for the anonymous array and object
  constructs and the anonymous function construct in the form of
  "myfunc=function(x) {}" (c.f. ECMA-262 3rd edion for details).
  This comprises almost all current browsers but Konquerer (khtml) and
  versions of Apple Safari for Mac OS 10.0-10.28 (Safari 1.0) which
  lack support for keyboard events.
  v1.5: Dropped support of Netscape 4 (layers)

  License:
  This JavaScript-library is free.
  Include a visible backlink to <http://www.masswerk.at/termlib/> in the
  embedding web page or application.
  The library should always be accompanied by the 'readme.txt' and the
  sample HTML-documents.
  
  Any changes should be commented and must be reflected in `Terminal.version'
  in the format: "Version.Subversion (compatibility)".
  
  Donations:
  Donations are welcome: You may support and/or honor the development of
  "termlib.js" via PayPal at: <http://www.masswerk.at/termlib/donate/>

  Disclaimer:
  This software is distributed AS IS and in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. The entire risk as to
  the quality and performance of the product is borne by the user. No use of
  the product is authorized hereunder except under this disclaimer.

  ### The sections above must not be removed. ###
  
  version 1.01: added Terminal.prototype.resizeTo(x,y)
                added Terminal.conf.fontClass (=> configureable class name)
                Terminal.prototype.open() now checks for element conf.termDiv
                in advance and returns success.

  version 1.02: added support for <TAB> and Euro sign
                (Terminal.conf.printTab, Terminal.conf.printEuro)
                and a method to evaluate printable chars:
                Terminal.prototype.isPrintable(keycode)

  version 1.03: added global keyboard locking (TermGlobals.keylock)
                modified Terminal.prototype.redraw for speed (use of locals)

  version 1.04: modified the key handler to fix a bug with MSIE5/Mac
                fixed a bug in TermGlobals.setVisible with older MSIE-alike
                browsers without DOM support.

  version 1.05: added config flag historyUnique.
 
  version 1.06: fixed CTRl+ALT (Windows alt gr) isn't CTRL any more
                fixed double backspace bug for Safari;
                added TermGlobals.setDisplay for setting style.display props
                termlib.js now outputs lower case html (xhtml compatibility)

  version 1.07: added method rebuild() to rebuild with new color settings.

  version 1.1:  fixed a bug in 'more' output mode (cursor could be hidden after
                quit)
                added socket-extension for server-client talk in a separate file
                -> "temlib_socket.js" (to be loaded after termlib.js)
                (this is a separate file because we break our compatibility
                guide lines with this IO/AJAX library.)

  version 1.2   added color support ("%[+-]c(<color>)" markup)
                moved paste support from sample file to lib
                * TermGlobals.insertText( <text>)
                * TermGlobals.importEachLine( <text> )
                * TermGlobals.importMultiLine( <text> )

  version 1.3   added word wrapping to write()
                * activate with myTerm.wrapOn()
                * deactivate with myTerm.wrapOff()
                use conf.wrapping (boolean) for a global setting

  version 1.4   Terminal is now an entirely self-contained object
                Global references to inner objects for backward compatipility:
                * TerminalDefaults   => Terminal.prototype.Defaults
                * termDefaultHandler => Terminal.prototype.defaultHandler
                * termKey            => Terminal.prototype.globals.termKey
                                        see also: Terminal.prototype.termKey
                * TermGlobals        => Terminal.prototype.globals
                * termDomKeyRef      => Terminal.prototype.globals.termDomKeyRef

                So in effect to outside scripts everything remains the same;
                no need to rewrite any existing scripts.
                You may now use "this.globals" inside any handlers
                to refer to the static global object (TermGlobals).
                You may also refer to key definitions as "this.termKey.*".
                (Please mind that "this.termKey" is a reference to the static object
                and not specific to the instance. A change to "this.termKey" will be
                by any other instances of Terminal too.)
                
                Added method TermGlobals.assignStyle() for custom styles & mark up.
                
                Unified the color mark up: You may now use color codes (decimal or hex)
                inside brackets. e.g.: %c(10)DARKRED%c() or %c(a)DARKRED%c()
                
                Added key repeat for remapped keys (cursor movements etc).

  version 1.41  fixed a bug in the word wrapping regarding write() output, when
                the cursor was set with cursorSet() before.

  version 1.42  fixed a bug which caused Opera to delete 2 chars at once.
                introduced property Terminal.isOpera (Boolean)

  version 1.43  enhanced the control handler so it also catches ESC if flag closeOnESC
                is set to false. fixed a bug with Safari which fired repeated events
                for the control handler for TAB if flag printTab was set to false.

  version 1.5   Changed the license.
                Dropped support for Netscape 4 (layers).
                HTML-elements are now created by document.createElement, if applicable.
                Included the formerly separate socket extension in the main library.
                Added methods 'backupScreen()' and 'restoreScreen()' to save a screen
                and restore it's content from backup. (see the globbing sample).

  version 1.51  Added basic support of ANSI-SGR-sequences.

  version 1.52  Added method swapBackup(), reorganized some of the accompanying files.

  version 1.54  Fixed BACK_SPACE for Chrome, DELETE for Safari/WebKit.

  version 1.55  Fixed dead keys issue for Mac OS (Leapard & later), vowels only.
  version 1.56  Fixed new ESC issue for Safari.
  version 1.57  Fixed dead keys fix: now only for Safari/Mac, German (de-de).
  version 1.59  Dropped dead keys fix, fixed backspace for Safari.
  version 1.6   Saved some bytes by discarding traces of ancient condition syntax
                Added input mode "fieldMode"
  version 1.61  Changes to defaults implementation of the constructor.
  version 1.62  Fixed a bug related to AltGr-sequences with IE8+.
  version 1.65  Added options for textColor and textBlur.
  version 1.66  textBlur accepts also an array of values for multiple text-shadows.

*/

var Terminal = function(conf) {
	if (typeof conf != 'object') conf=new Object();
	for (var i in this.Defaults) {
		if (typeof conf[i] == 'undefined') conf[i]=this.Defaults[i];
	}
	if (typeof conf.handler != 'function') conf.handler=Terminal.prototype.defaultHandler;
	this.conf=conf;
	this.setInitValues();
}


Terminal.prototype = {
// prototype definitions (save some 2k on indentation)

version: '1.66 (original)',

Defaults: {
	// dimensions
	cols:80,
	rows:24,
	// appearance
	x:100,
	y:100,
	termDiv:'termDiv',
	bgColor:'#181818',
	frameColor:'#555555',
	frameWidth:1,
	rowHeight:0,
	blinkDelay:500,
	// css class
	fontClass:'term',
	// initial cursor mode
	crsrBlinkMode:false,
	crsrBlockMode:true,
	// key mapping
	DELisBS:false,
	printTab:true,
	printEuro:true,
	catchCtrlH:true,
	closeOnESC:true,
	// prevent consecutive history doublets
	historyUnique:false,
	// optional id
	id:0,
	// strings
	ps:'>',
	greeting:'%+r Terminal ready. %-r',
	// handlers
	handler:null,
	ctrlHandler:null,
	initHandler:null,
	exitHandler:null,
	wrapping:false,
	mapANSI:false,
	ANSItrueBlack:false,
	textBlur: 0,
	textColor: ''
},

setInitValues: function() {
	this.isSafari= (navigator.userAgent.indexOf('Safari')>=0 || navigator.userAgent.indexOf('WebKit')>=0)? true:false;
	this.isOpera= (window.opera && navigator.userAgent.indexOf('Opera')>=0)? true:false;
	this.isChrome= (navigator.userAgent.indexOf('Chrome/')>=0 && navigator.userAgent.indexOf('WebKit')>=0)? true:false;
	this.domAPI= (document && document.createElement)? true:false;
	this.isMac= (navigator.userAgent.indexOf('Mac')>=0)? true:false;
	this.id=this.conf.id;
	this.maxLines=this.conf.rows;
	this.maxCols=this.conf.cols;
	this.termDiv=this.conf.termDiv;
	this.crsrBlinkMode=this.conf.crsrBlinkMode;
	this.crsrBlockMode=this.conf.crsrBlockMode;
	this.blinkDelay=this.conf.blinkDelay;
	this.DELisBS=this.conf.DELisBS;
	this.printTab=this.conf.printTab;
	this.printEuro=this.conf.printEuro;
	this.catchCtrlH=this.conf.catchCtrlH;
	this.closeOnESC=this.conf.closeOnESC;
	this.historyUnique=this.conf.historyUnique;
	this.ps=this.conf.ps;
	this.closed=false;
	this.r;
	this.c;
	this.charBuf=new Array();
	this.styleBuf=new Array();
	this.scrollBuf=null;
	this.blinkBuffer=0;
	this.blinkTimer;
	this.cursoractive=false;
	this.lock=true;
	this.insert=false;
	this.charMode=false;
	this.rawMode=false;
	this.lineBuffer='';
	this.inputChar=0;
	this.lastLine='';
	this.guiCounter=0;
	this.history=new Array();
	this.histPtr=0;
	this.env=new Object();
	this.buckupBuffer=null;
	this.handler=this.conf.handler;
	this.wrapping=this.conf.wrapping;
	this.mapANSI=this.conf.mapANSI;
	this.ANSItrueBlack=this.conf.ANSItrueBlack;
	this.ctrlHandler=this.conf.ctrlHandler;
	this.initHandler=this.conf.initHandler;
	this.exitHandler=this.conf.exitHandler;
	this.fieldMode=false;
	this.fieldStart=this.fieldEnd=this.fieldC=0;
	if (typeof this.conf.textBlur === 'object' && this.conf.textBlur.length) {
		var a=[];
		for (var i=0; i<this.conf.textBlur.length; i++) {
			var b=Number(this.conf.textBlur[i]);
			if (!isNaN(b) && b>0) a.push(b);
		}
		this.textBlur=(a.length)? a:0;
	}
	else {
		this.textBlur=Number(this.conf.textBlur);
		if (isNaN(this.textBlur) || this.textBlur<0 || this.textBlur>40) this.textBlur=0;
	}
	this.textColor=this.conf.textColor || '';
	this.contentEditable = null;
},

defaultHandler: function() {
	this.newLine();
	if (this.lineBuffer != '') {
		this.type('You typed: '+this.lineBuffer);
		this.newLine();
	}
	this.prompt();
},

open: function() {
	if (this.termDivReady()) {
		if (!this.closed) this._makeTerm();
		this.init();
		return true;
	}
	else {
		return false;
	}
},

close: function() {
	this.lock=true;
	this.cursorOff();
	if (this.exitHandler) this.exitHandler();
	this.globals.setVisible(this.termDiv,0);
	this.closed=true;
},

init: function() {
	// wait for gui
	if (this.guiReady()) {
		this.guiCounter=0;
		// clean up at re-entry
		if (this.closed) {
			this.setInitValues();
		}
		this.clear();
		this.globals.setVisible(this.termDiv,1);
		this.globals.enableKeyboard(this);
		if (this.initHandler) {
			this.initHandler();
		}
		else {
			this.write(this.conf.greeting);
			this.newLine();
			this.prompt();
		}
	}
	else {
		this.guiCounter++;
		if (this.guiCounter>18000) {
			if (confirm('Terminal:\nYour browser hasn\'t responded for more than 2 minutes.\nRetry?')) {
				this.guiCounter=0;
			}
			else {
				return;
			}
		};
		this.globals.termToInitialze=this;
		window.setTimeout('Terminal.prototype.globals.termToInitialze.init()',200);
	}
},

getRowArray: function(l,v) {
	// returns a fresh array of l length initialized with value v
	var a=new Array();
	for (var i=0; i<l; i++) a[i]=v;
	return a;
},

wrapOn: function() {
	// activate word wrap, wrapping workes with write() only!
	this.wrapping=true;
},

wrapOff: function() {
	this.wrapping=false;
},

setTextBlur: function(v) {
	var rerender=false;
	if (typeof v === 'object' && v.length) {
		var a=[];
		for (var i=0; i<v.length; i++) {
			var b=Number(v[i]);
			if (!isNaN(b) && b>0) a.push(b);
		}
		this.textBlur=(a.length)? a:0;
		rerender=true;
	}
	else {
		v=Number(v);
		if (isNaN(v) || v<0 || v>40) v=0;
		if (v!=this.textBlur) {
			this.textBlur=v;
			rerender=true;
		}
	}
	if (rerender) {
		for (var r=0, l=this.conf.rows; r<l; r++) this.redraw(r);
	}
},

setTextColor: function(v) {
	if (!v) v='';
	if (v!=this.textColor) {
		this.textColor=v;
		for (var r=0, l=this.conf.rows; r<l; r++) {
			this.redraw(r);
		}
	}
},

// main output methods

type: function(text,style) {
	for (var i=0; i<text.length; i++) {
		var ch=text.charCodeAt(i);
		if (!this.isPrintable(ch)) ch=94;
		this.charBuf[this.r][this.c]=ch;
		this.styleBuf[this.r][this.c]=(style)? style:0;
		var last_r=this.r;
		this._incCol();
		if (this.r!=last_r) this.redraw(last_r);
	}
	this.redraw(this.r)
},

write: function(text,usemore) {
	// write to scroll buffer with markup
	// new line = '%n' prepare any strings or arrys first
	if (typeof text != 'object') {
		if (typeof text!='string') text=''+text;
		if (text.indexOf('\n')>=0) {
			var ta=text.split('\n');
			text=ta.join('%n');
		}
	}
	else {
		if (text.join) {
			text=text.join('%n');
		}
		else {
			text=''+text;
		}
		if (text.indexOf('\n')>=0) {
			var ta=text.split('\n');
			text=ta.join('%n');
		}
	}
	if (this.mapANSI) text=this.globals.ANSI_map(text, this.ANSItrueBlack);
	this._sbInit(usemore);
	var chunks=text.split('%');
	var esc=(text.charAt(0)!='%');
	var style=0;
	var styleMarkUp=this.globals.termStyleMarkup;
	for (var i=0; i<chunks.length; i++) {
		if (esc) {
			if (chunks[i].length>0) {
				this._sbType(chunks[i],style);
			}
			else if (i>0) {
				this._sbType('%', style);
			}
			esc=false;
		}
		else {
			var func=chunks[i].charAt(0);
			if (chunks[i].length==0 && i>0) {
				this._sbType("%",style);
				esc=true;
			}
			else if (func=='n') {
				this._sbNewLine(true);
				if (chunks[i].length>1) this._sbType(chunks[i].substring(1),style);
			}
			else if (func=='+') {
				var opt=chunks[i].charAt(1);
				opt=opt.toLowerCase();
				if (opt=='p') {
					style=0;
				}
				else if (styleMarkUp[opt]) {
					style|=styleMarkUp[opt];
				}
				if (chunks[i].length>2) this._sbType(chunks[i].substring(2),style);
			}
			else if (func=='-') {
				var opt=chunks[i].charAt(1);
				opt=opt.toLowerCase();
				if (opt=='p') {
					style=0;
				}
				else if (styleMarkUp[opt]) {
					style&=~styleMarkUp[opt];
				}
				if (chunks[i].length>2) this._sbType(chunks[i].substring(2),style);
			}
			else if (chunks[i].length>1 && func=='c') {
				var cinfo=this._parseColor(chunks[i].substring(1));
				style=(style&(~0xfffff0))|cinfo.style;
				if (cinfo.rest) this._sbType(cinfo.rest,style);
			}
			else if (chunks[i].length>1 && chunks[i].charAt(0)=='C' && chunks[i].charAt(1)=='S') {
				this.clear();
				this._sbInit();
				if (chunks[i].length>2) this._sbType(chunks[i].substring(2),style);
			}
			else {
				if (chunks[i].length>0) this._sbType(chunks[i],style);
			}
		}
	}
	this._sbOut();
},

// parse a color markup
_parseColor: function(chunk) {
	var rest='';
	var style=0;
	if (chunk.length) {
		if (chunk.charAt(0)=='(') {
			var clabel='';
			for (var i=1; i<chunk.length; i++) {
				var c=chunk.charAt(i);
				if (c==')') {
					if (chunk.length>i) rest=chunk.substring(i+1);
					break;
				}
				clabel+=c;
			}
			if (clabel) {
				if (clabel.charAt(0) == '@') {
					var sc=this.globals.nsColors[clabel.substring(1).toLowerCase()];
					if (sc) style=(16+sc)*0x100;
				}
				else if (clabel.charAt(0) == '#') {
					var cl=clabel.substring(1).toLowerCase();
					var sc=this.globals.webColors[cl];
					if (sc) {
						style=sc*0x10000;
					}
					else {
						cl=this.globals.webifyColor(cl);
						if (cl) style=this.globals.webColors[cl]*0x10000;
					}
				}
				else if (clabel.length && clabel.length<=2) {
					var isHex=false;
					for (var i=0; i<clabel.length; i++) {
						if (this.globals.isHexOnlyChar(clabel.charAt(i))) {
							isHex=true;
							break;
						}
					}
					var cl=(isHex)? parseInt(clabel, 16):parseInt(clabel,10);
					if (!isNaN(cl) || cl<=15) {
						style=cl*0x100;
					}
				}
				else {
					style=this.globals.getColorCode(clabel)*0x100;
				}
			}
		}
		else {
			var c=chunk.charAt(0);
			if (this.globals.isHexChar(c)) {
				style=this.globals.hexToNum[c]*0x100;
				rest=chunk.substring(1);
			}
			else {
				rest=chunk;
			}
		}
	}
	return { rest: rest, style: style };
},

// internal scroll buffer output methods

_sbInit: function(usemore) {
	var sb=this.scrollBuf=new Object();
	var sbl=sb.lines=new Array();
	var sbs=sb.styles=new Array();
	sb.more=usemore;
	sb.line=0;
	sb.status=0;
	sb.r=0;
	sb.c=this.c;
	sbl[0]=this.getRowArray(this.conf.cols,0);
	sbs[0]=this.getRowArray(this.conf.cols,0);
	for (var i=0; i<this.c; i++) {
		sbl[0][i]=this.charBuf[this.r][i];
		sbs[0][i]=this.styleBuf[this.r][i];
	}
},

_sbType: function(text,style) {
	// type to scroll buffer
	var sb=this.scrollBuf;
	for (var i=0; i<text.length; i++) {
		var ch=text.charCodeAt(i);
		if (!this.isPrintable(ch)) ch=94;
		sb.lines[sb.r][sb.c]=ch;
		sb.styles[sb.r][sb.c++]=(style)? style:0;
		if (sb.c>=this.maxCols) this._sbNewLine();
	}
},

_sbNewLine: function(forced) {
	var sb=this.scrollBuf;
	if (this.wrapping && forced) {
		sb.lines[sb.r][sb.c]=10;
		sb.lines[sb.r].length=sb.c+1;
	}
	sb.r++;
	sb.c=0;
	sb.lines[sb.r]=this.getRowArray(this.conf.cols,0);
	sb.styles[sb.r]=this.getRowArray(this.conf.cols,0);
},

_sbWrap: function() {
	// create a temp wrap buffer wb and scan for words/wrap-chars
	// then re-asign lines & styles to scrollBuf
	var wb=new Object();
	wb.lines=new Array();
	wb.styles=new Array();
	wb.lines[0]=this.getRowArray(this.conf.cols,0);
	wb.styles[0]=this.getRowArray(this.conf.cols,0);
	wb.r=0;
	wb.c=0;
	var sb=this.scrollBuf;
	var sbl=sb.lines;
	var sbs=sb.styles;
	var ch, st, wrap, lc, ls;
	var l=this.c;
	var lastR=0;
	var lastC=0;
	wb.cBreak=false;
	for (var r=0; r<sbl.length; r++) {
		lc=sbl[r];
		ls=sbs[r];
		for (var c=0; c<lc.length; c++) {
			ch=lc[c];
			st=ls[c];
			if (ch) {
				var wrap=this.globals.wrapChars[ch];
				if (ch==10) wrap=1;
				if (wrap) {
					if (wrap==2) {
						l++;
					}
					else if (wrap==4) {
						l++;
						lc[c]=45;
					}
					this._wbOut(wb, lastR, lastC, l);		
					if (ch==10) {
						this._wbIncLine(wb);
					}
					else if (wrap==1 && wb.c<this.maxCols) {
						wb.lines[wb.r][wb.c]=ch;
						wb.styles[wb.r][wb.c++]=st;
						if (wb.c>=this.maxCols) this._wbIncLine(wb);
					}
					if (wrap==3) {
						lastR=r;
						lastC=c;
						l=1;
					}
					else {
						l=0;
						lastR=r;
						lastC=c+1;
						if (lastC==lc.length) {
							lastR++;
							lastC=0;
						}
						if (wrap==4) wb.cBreak=true;
					}
				}
				else {
					l++;
				}
			}
			else {
				continue;
			}
		}
	}
	if (l) {
		if (wb.cBreak && wb.c!=0) wb.c--;
		this._wbOut(wb, lastR, lastC, l);
	}
	sb.lines=wb.lines;
	sb.styles=wb.styles;
	sb.r=wb.r;
	sb.c=wb.c;
},

_wbOut: function(wb, br, bc, l) {
	// copy a word (of l length from br/bc) to wrap buffer wb
	var sb=this.scrollBuf;
	var sbl=sb.lines;
	var sbs=sb.styles;
	var ofs=0;
	var lc, ls;
	if (l+wb.c>this.maxCols) {
		if (l<this.maxCols) {
			this._wbIncLine(wb);
		}
		else {
			var i0=0;
			ofs=this.maxCols-wb.c;
			lc=sbl[br];
			ls=sbs[br];
			while (true) {
				for (var i=i0; i<ofs; i++) {
					wb.lines[wb.r][wb.c]=lc[bc];
					wb.styles[wb.r][wb.c++]=ls[bc++];
					if (bc==sbl[br].length) {
						bc=0;
						br++;
						lc=sbl[br];
						ls=sbs[br];
					}
				}
				this._wbIncLine(wb);
				if (l-ofs<this.maxCols) break;
				i0=ofs;
				ofs+=this.maxCols;
			}
		}
	}
	else if (wb.cBreak) {
		wb.c--;
	}
	lc=sbl[br];
	ls=sbs[br];
	for (var i=ofs; i<l; i++) {
		wb.lines[wb.r][wb.c]=lc[bc];
		wb.styles[wb.r][wb.c++]=ls[bc++];
		if (bc==sbl[br].length) {
			bc=0;
			br++;
			lc=sbl[br];
			ls=sbs[br];
		}
	}
	wb.cBreak=false;
},

_wbIncLine: function(wb) {
	// create a new line in temp buffer
	wb.r++;
	wb.c=0;
	wb.lines[wb.r]=this.getRowArray(this.conf.cols,0);
	wb.styles[wb.r]=this.getRowArray(this.conf.cols,0);
},

_sbOut: function() {
	var sb=this.scrollBuf;
	if (this.wrapping && !sb.status) this._sbWrap();
	var sbl=sb.lines;
	var sbs=sb.styles;
	var tcb=this.charBuf;
	var tsb=this.styleBuf;
	var ml=this.maxLines;
	var buflen=sbl.length;
	if (sb.more) {
		if (sb.status) {
			if (this.inputChar==this.globals.lcMoreKeyAbort) {
				this.r=ml-1;
				this.c=0;
				tcb[this.r]=this.getRowArray(this.conf.cols,0);
				tsb[this.r]=this.getRowArray(this.conf.cols,0);
				this.redraw(this.r);
				this.handler=sb.handler;
				this.charMode=false;
				this.inputChar=0;
				this.scrollBuf=null;
				this.prompt();
				return;
			}
			else if (this.inputChar==this.globals.lcMoreKeyContinue) {
				this.clear();
			}
			else {
				return;
			}
		}
		else {
			if (this.r>=ml-1) this.clear();
		}
	}
	if (this.r+buflen-sb.line<=ml) {
		for (var i=sb.line; i<buflen; i++) {
			var r=this.r+i-sb.line;
			tcb[r]=sbl[i];
			tsb[r]=sbs[i];
			this.redraw(r);
		}
		this.r+=sb.r-sb.line;
		this.c=sb.c;
		if (sb.more) {
			if (sb.status) this.handler=sb.handler;
			this.charMode=false;
			this.inputChar=0;
			this.scrollBuf=null;
			this.prompt();
			return;
		}
	}
	else if (sb.more) {
		ml--;
		if (sb.status==0) {
			sb.handler=this.handler;
			this.handler=this._sbOut;
			this.charMode=true;
			sb.status=1;
		}
		if (this.r) {
			var ofs=ml-this.r;
			for (var i=sb.line; i<ofs; i++) {
				var r=this.r+i-sb.line;
				tcb[r]=sbl[i];
				tsb[r]=sbs[i];
				this.redraw(r);
			}
		}
		else {
			var ofs=sb.line+ml;
			for (var i=sb.line; i<ofs; i++) {
				var r=this.r+i-sb.line;
				tcb[r]=sbl[i];
				tsb[r]=sbs[i];
				this.redraw(r);
			}
		}
		sb.line=ofs;
		this.r=ml;
		this.c=0;
		this.type(this.globals.lcMorePrompt1, this.globals.lcMorePromtp1Style);
		this.type(this.globals.lcMorePrompt2, this.globals.lcMorePrompt2Style);
		this.lock=false;
		return;
	}
	else if (buflen>=ml) {
		var ofs=buflen-ml;
		for (var i=0; i<ml; i++) {
			var r=ofs+i;
			tcb[i]=sbl[r];
			tsb[i]=sbs[r];
			this.redraw(i);
		}
		this.r=ml-1;
		this.c=sb.c;
	}
	else {
		var dr=ml-buflen;
		var ofs=this.r-dr;
		for (var i=0; i<dr; i++) {
			var r=ofs+i;
			for (var c=0; c<this.maxCols; c++) {
				tcb[i][c]=tcb[r][c];
				tsb[i][c]=tsb[r][c];
			}
			this.redraw(i);
		}
		for (var i=0; i<buflen; i++) {
			var r=dr+i;
			tcb[r]=sbl[i];
			tsb[r]=sbs[i];
			this.redraw(r);
		}
		this.r=ml-1;
		this.c=sb.c;
	}
	this.scrollBuf=null;
},

// basic console output

typeAt: function(r,c,text,style) {
	var tr1=this.r;
	var tc1=this.c;
	this.cursorSet(r,c);
	for (var i=0; i<text.length; i++) {
		var ch=text.charCodeAt(i);
		if (!this.isPrintable(ch)) ch=94;
		this.charBuf[this.r][this.c]=ch;
		this.styleBuf[this.r][this.c]=(style)? style:0;
		var last_r=this.r;
		this._incCol();
		if (this.r!=last_r) this.redraw(last_r);
	}
	this.redraw(this.r);
	this.r=tr1;
	this.c=tc1;
},

statusLine: function(text,style,offset) {
	var ch,r;
	style=(style && !isNaN(style))? parseInt(style)&15:0;
	if (offset && offset>0) {
		r=this.conf.rows-offset;
	}
	else {
		r=this.conf.rows-1;
	}
	for (var i=0; i<this.conf.cols; i++) {
		if (i<text.length) {
			ch=text.charCodeAt(i);
			if (!this.isPrintable(ch)) ch = 94;
		}
		else {
			ch=0;
		}
		this.charBuf[r][i]=ch;
		this.styleBuf[r][i]=style;
	}
	this.redraw(r);
},

printRowFromString: function(r,text,style) {
	var ch;
	style=(style && !isNaN(style))? parseInt(style)&15:0;
	if (r>=0 && r<this.maxLines) {
		if (typeof text != 'string') text=''+text;
		for (var i=0; i<this.conf.cols; i++) {
			if (i<text.length) {
				ch=text.charCodeAt(i);
				if (!this.isPrintable(ch)) ch = 94;
			}
			else {
				ch=0;
			}
			this.charBuf[r][i]=ch;
			this.styleBuf[r][i]=style;
		}
		this.redraw(r);
	}
},

setChar: function(ch,r,c,style) {
	this.charBuf[r][c]=ch;
	var usestyle=(style)? style:0;
	this.styleBuf[r][c]=usestyle;
	if (r==this.r && c==this.c) this.blinkBuffer=usestyle;
	this.redraw(r);
},

newLine: function() {
	this.c=0;
	this._incRow();
},

// internal methods for output

_charOut: function(ch, style) {
	this.charBuf[this.r][this.c]=ch;
	this.styleBuf[this.r][this.c]=(style)? style:0;
	this.redraw(this.r);
	this._incCol();
},

_incCol: function() {
	this.c++;
	if (this.c>=this.maxCols) {
		this.c=0;
		this._incRow();
	}
},

_incRow: function() {
	this.r++;
	if (this.r>=this.maxLines) {
		this._scrollLines(0,this.maxLines);
		this.r=this.maxLines-1;
	}
},

_scrollLines: function(start, end) {
	window.status='Scrolling lines ...';
	start++;
	for (var ri=start; ri<end; ri++) {
		var rt=ri-1;
		this.charBuf[rt]=this.charBuf[ri];
		this.styleBuf[rt]=this.styleBuf[ri];
	}
	// clear last line
	var rt=end-1;
	this.charBuf[rt]=this.getRowArray(this.conf.cols,0);
	this.styleBuf[rt]=this.getRowArray(this.conf.cols,0);
	this.redraw(rt);
	for (var r=end-1; r>=start; r--) this.redraw(r-1);
	window.status='';
},

// control methods

clear: function() {
	window.status='Clearing display ...';
	this.cursorOff();
	this.insert=false;
	for (var ri=0; ri<this.maxLines; ri++) {
		this.charBuf[ri]=this.getRowArray(this.conf.cols,0);
		this.styleBuf[ri]=this.getRowArray(this.conf.cols,0);
		this.redraw(ri);
	}
	this.r=0;
	this.c=0;
	window.status='';
},

reset: function() {
	if (this.lock) return;
	this.lock=true;
	this.rawMode=false;
	this.charMode=false;
	this.maxLines=this.conf.rows;
	this.maxCols=this.conf.cols;
	this.lastLine='';
	this.lineBuffer='';
	this.inputChar=0;
	this.clear();
},

prompt: function() {
	this.lock=true;
	if (this.c>0) this.newLine();
	this.type(this.ps);
	this._charOut(1);
	this.lock=false;
	this.cursorOn();
},

isPrintable: function(ch, unicodePage1only) {
	if (this.wrapping && this.globals.wrapChars[ch]==4) return true;
	if (unicodePage1only && ch>255) {
		return (ch==this.termKey.EURO && this.printEuro)? true:false;
	}
	return (
		(ch>=32 && ch!=this.termKey.DEL) ||
		(this.printTab && ch==this.termKey.TAB)
	);
},

// cursor methods

cursorSet: function(r,c) {
	var crsron=this.cursoractive;
	if (crsron) this.cursorOff();
	this.r=r%this.maxLines;
	this.c=c%this.maxCols;
	this._cursorReset(crsron);
},

cursorOn: function() {
	if (this.blinkTimer) clearTimeout(this.blinkTimer);
	this.blinkBuffer=this.styleBuf[this.r][this.c];
	this._cursorBlink();
	this.cursoractive=true;
},

cursorOff: function() {
	if (this.blinkTimer) clearTimeout(this.blinkTimer);
	if (this.cursoractive) {
		this.styleBuf[this.r][this.c]=this.blinkBuffer;
		this.redraw(this.r);
		this.cursoractive=false;
	}
},

cursorLeft: function() {
	var crsron=this.cursoractive;
	if (crsron) this.cursorOff();
	var r=this.r;
	var c=this.c;
	if (c>0) {
		c--;
	}
	else if (r>0) {
		c=this.maxCols-1;
		r--;
	}
	if (this.isPrintable(this.charBuf[r][c])) {
		this.r=r;
		this.c=c;
	}
	this.insert=true;
	this._cursorReset(crsron);
},

cursorRight: function() {
	var crsron=this.cursoractive;
	if (crsron) this.cursorOff();
	var r=this.r;
	var c=this.c;
	if (c<this.maxCols-1) {
		c++;
	}
	else if (r<this.maxLines-1) {
		c=0;
		r++;
	}
	if (!this.isPrintable(this.charBuf[r][c])) {
		this.insert=false;
	}
	if (this.isPrintable(this.charBuf[this.r][this.c])) {
		this.r=r;
		this.c=c;
	}
	this._cursorReset(crsron);
},

backspace: function() {
	var crsron=this.cursoractive;
	if (crsron) this.cursorOff();
	var r=this.r;
	var c=this.c;
	if (c>0) c--
	else if (r>0) {
		c=this.maxCols-1;
		r--;
	};
	if (this.isPrintable(this.charBuf[r][c])) {
		this._scrollLeft(r, c);
		this.r=r;
		this.c=c;
	};	
	this._cursorReset(crsron);
},

fwdDelete: function() {
	var crsron=this.cursoractive;
	if (crsron) this.cursorOff();
	if (this.isPrintable(this.charBuf[this.r][this.c])) {
		this._scrollLeft(this.r,this.c);
		if (!this.isPrintable(this.charBuf[this.r][this.c])) this.insert=false;
	}
	this._cursorReset(crsron);
},

_cursorReset: function(crsron) {
	if (crsron) {
		this.cursorOn();
	}
	else {
		this.blinkBuffer=this.styleBuf[this.r][this.c];
	}
},

_cursorBlink: function() {
	if (this.blinkTimer) clearTimeout(this.blinkTimer);
	if (this == this.globals.activeTerm) {
		if (this.crsrBlockMode) {
			this.styleBuf[this.r][this.c]=(this.styleBuf[this.r][this.c]&1)?
				this.styleBuf[this.r][this.c]&0xfffffe:this.styleBuf[this.r][this.c]|1;
		}
		else {
			this.styleBuf[this.r][this.c]=(this.styleBuf[this.r][this.c]&2)?
				this.styleBuf[this.r][this.c]&0xffffd:this.styleBuf[this.r][this.c]|2;
		}
		this.redraw(this.r);
	}
	if (this.crsrBlinkMode) this.blinkTimer=setTimeout('Terminal.prototype.globals.activeTerm._cursorBlink()', this.blinkDelay);
},

_scrollLeft: function(r,c) {
	var rows=new Array();
	rows[0]=r;
	while (this.isPrintable(this.charBuf[r][c])) {
		var ri=r;
		var ci=c+1;
		if (ci==this.maxCols) {
			if (ri<this.maxLines-1) {
				ci=0;
				ri++;
				rows[rows.length]=ri;
			}
			else {
				break;
			}
		}
		this.charBuf[r][c]=this.charBuf[ri][ci];
		this.styleBuf[r][c]=this.styleBuf[ri][ci];
		c=ci;
		r=ri;
	}
	if (this.charBuf[r][c]!=0) this.charBuf[r][c]=0;
	for (var i=0; i<rows.length; i++) this.redraw(rows[i]);
},

_scrollRight: function(r,c) {
	var rows=new Array();
	var end=this._getLineEnd(r,c);
	var ri=end[0];
	var ci=end[1];
	if (ci==this.maxCols-1 && ri==this.maxLines-1) {
		if (r==0) return;
		this._scrollLines(0,this.maxLines);
		this.r--;
		r--;
		ri--;
	}
	rows[r]=1;
	while (this.isPrintable(this.charBuf[ri][ci])) {
		var rt=ri;
		var ct=ci+1;
		if (ct==this.maxCols) {
			ct=0;
			rt++;
			rows[rt]=1;
		}
		this.charBuf[rt][ct]=this.charBuf[ri][ci];
		this.styleBuf[rt][ct]=this.styleBuf[ri][ci];
		if (ri==r && ci==c) break;
		ci--;
		if (ci<0) {
			ci=this.maxCols-1;
			ri--;
			rows[ri]=1;
		}
	}
	for (var i=r; i<this.maxLines; i++) {
		if (rows[i]) this.redraw(i);
	}
},

_getLineEnd: function(r,c) {
	if (!this.isPrintable(this.charBuf[r][c])) {
		c--;
		if (c<0) {
			if (r>0) {
				r--;
				c=this.maxCols-1;
			}
			else {
				c=0;
			}
		}
	}
	if (this.isPrintable(this.charBuf[r][c])) {
		while (true) {
			var ri=r;
			var ci=c+1;
			if (ci==this.maxCols) {
				if (ri<this.maxLines-1) {
					ri++;
					ci=0;
				}
				else {
					break;
				}
			}
			if (!this.isPrintable(this.charBuf[ri][ci])) break;
			c=ci;
			r=ri;
		}
	}
	return [r,c];
},

_getLineStart: function(r,c) {
	// not used by now, just in case anyone needs this ...
	var ci, ri;
	if (!this.isPrintable(this.charBuf[r][c])) {
		ci=c-1;
		ri=r;
		if (ci<0) {
			if (ri==0) return [0,0];
			ci=this.maxCols-1;
			ri--;
		}
		if (!this.isPrintable(this.charBuf[ri][ci])) {
			return [r,c];
		}
		else {
			r=ri;
			c=ci;
		}
	}
	while (true) {
		var ri=r;
		var ci=c-1;
		if (ci<0) {
			if (ri==0) break;
			ci=this.maxCols-1;
			ri--;
		}
		if (!this.isPrintable(this.charBuf[ri][ci])) break;;
		r=ri;
		c=ci;
	}
	return [r,c];
},

_getLine: function(adjustCrsrPos) {
	var end=this._getLineEnd(this.r,this.c);
	var r=end[0];
	var c=end[1];
	if (adjustCrsrPos && (this.r!=r || this.c!=c+1)) {
		this.r=r;
		this.c=c+1;
		if (this.c>=this.maxCols) this.c=this.maxCols-1;
	}
	var line=new Array();
	while (this.isPrintable(this.charBuf[r][c])) {
		line[line.length]=String.fromCharCode(this.charBuf[r][c]);
		if (c>0) {
			c--;
		}
		else if (r>0) {
			c=this.maxCols-1;
			r--;
		}
		else {
			break;
		}
	}
	line.reverse();
	return line.join('');
},

_clearLine: function() {
	var end=this._getLineEnd(this.r,this.c);
	var r=end[0];
	var c=end[1];
	var line='';
	while (this.isPrintable(this.charBuf[r][c])) {
		this.charBuf[r][c]=0;
		if (c>0) {
			c--;
		}
		else if (r>0) {
			this.redraw(r);
			c=this.maxCols-1;
			r--;
		}
		else {
			break;
		}
	}
	if (r!=end[0]) this.redraw(r);
	c++;
	this.cursorSet(r,c);
	this.insert=false;
},

// backup/restore screen & state

backupScreen: function() {
	var backup=this.backupBuffer=new Object();
	var rl=this.conf.rows;
	var cl=this.conf.cols;
	backup.cbuf=new Array(rl);
	backup.sbuf=new Array(rl);
	backup.maxCols=this.maxCols;
	backup.maxLines=this.maxLines;
	backup.r=this.r;
	backup.c=this.c;
	backup.charMode=this.charMode;
	backup.rawMode=this.rawMode;
	backup.handler=this.handler;
	backup.ctrlHandler=this.ctrlHandler;
	backup.cursoractive=this.cursoractive;
	
	backup.crsrBlinkMode=this.crsrBlinkMode;
	backup.crsrBlockMode=this.crsrBlockMode;
	backup.blinkDelay=this.blinkDelay;
	backup.DELisBS=this.DELisBS;
	backup.printTab=this.printTab;
	backup.printEuro=this.printEuro;
	backup.catchCtrlH=this.catchCtrlH;
	backup.closeOnESC=this.closeOnESC;
	backup.historyUnique=this.historyUnique;
	backup.ps=this.ps;
	backup.lineBuffer=this.lineBuffer;
	backup.inputChar=this.inputChar;
	backup.lastLine=this.lastLine;
	backup.historyLength=this.history.length;
	backup.histPtr=this.histPtr;
	backup.wrapping=this.wrapping;
	backup.mapANSI=this.mapANSI;
	backup.ANSItrueBlack=this.ANSItrueBlack;
	if (this.cursoractive) this.cursorOff();
	for (var r=0; r<rl; r++) {
		var cbr=this.charBuf[r];
		var sbr=this.styleBuf[r];
		var tcbr=backup.cbuf[r]=new Array(cl);
		var tsbr=backup.sbuf[r]=new Array(cl);
		for (var c=0; c<cl; c++) {
			tcbr[c]=cbr[c];
			tsbr[c]=sbr[c];
		}
	}
},

restoreScreen: function() {
	var backup=this.backupBuffer;
	if (!backup) return;
	var rl=this.conf.rows;
	for (var r=0; r<rl; r++) {
		this.charBuf[r]=backup.cbuf[r];
		this.styleBuf[r]=backup.sbuf[r];
		this.redraw(r);
	}
	this.maxCols=backup.maxCols;
	this.maxLines=backup.maxLines;
	this.r=backup.r;
	this.c=backup.c;
	this.charMode=backup.charMode;
	this.rawMode=backup.rawMode;
	this.handler=backup.handler;
	this.ctrlHandler=backup.ctrlHandler;
	this.cursoractive=backup.cursoractive;
	this.crsrBlinkMode=backup.crsrBlinkMode;
	this.crsrBlockMode=backup.crsrBlockMode;
	this.blinkDelay=backup.blinkDelay;
	this.DELisBS=backup.DELisBS;
	this.printTab=backup.printTab;
	this.printEuro=backup.printEuro;
	this.catchCtrlH=backup.catchCtrlH;
	this.closeOnESC=backup.closeOnESC;
	this.historyUnique=backup.historyUnique;
	this.ps=backup.ps;
	this.lineBuffer=backup.lineBuffer;
	this.inputChar=backup.inputChar;
	this.lastLine=backup.lastLine;
	if (this.history.length>backup.historyLength) {
		this.history.length=backup.historyLength;
		this.histPtr=backup.histPtr;
	}
	this.wrapping=backup.wrapping;
	this.mapANSI=backup.mapANSI;
	this.ANSItrueBlack=backup.ANSItrueBlack;
	if (this.cursoractive) this.cursorOn();
	this.backupBuffer=null;
},

swapBackup: function() {
	// swap current state and backup buffer (e.g.: toggle do/undo)
	var backup=this.backupBuffer;
	this.backupScreen;
	if (backup) {
		var backup2=this.backupBuffer;
		this.backupBuffer=backup;
		this.restoreScreen();
		this.backupBuffer=backup2;
	}
},

// simple markup escaping

escapeMarkup: function(t) {
	return t.replace(/%/g, '%%');
},

// field mode

enterFieldMode: function(start, end, style) {
	this.cursorOff();
	if (start===undefined || start<0) start=this.c;
	if (end=== undefined || end<start || end>this.maxCols) end=this.maxCols;
	if (!style) style=0;
	this.fieldStart=start;
	this.fieldEnd=end;
	this.fieldStyle=style;
	this.fieldC=0;
	this.lastLine='';
	this.fieldMode=true;
	this.rawMode=this.charMode=false;
	if (style&1) {
		this._crsrWasBlockMode=this.crsrBlockMode;
		this._crsrWasBlinkMode=this.crsrBlinkMode;
		this.crsrBlockMode=false;
		this.crsrBlinkMode=true;
	}
	this.drawField();
	this.lock=false;
},

exitFieldMode: function() {
	this.drawField(true);
	this.fieldMode=false;
	this.c=this.fieldEnd;
	if (this.c==this.maxLine) this.newLine();
	this.lock=true;
},

drawField: function(isfinal) {
	this.cursorOff();
	if (isfinal) this.fieldC=0;
	var fl=this.fieldEnd-this.fieldStart;
	if (this.fieldC==this.lastLine.length) fl--;
	var ofs=this.fieldC-fl;
	if (ofs<0) ofs=0;
	var line = (ofs)?  this.lastLine.substring(ofs):this.lastLine;
	var sb=this.styleBuf[this.r];
	var cb=this.charBuf[this.r];
	var max=line.length;
	for (var i=this.fieldStart, k=0; i<this.fieldEnd; i++, k++) {
		sb[i]=this.fieldStyle;
		cb[i]=(k<max)? line.charCodeAt(k):0;
	}
	this.redraw(this.r);
	if (isfinal) {
		if (this.fieldStyle&1) {
			this.crsrBlockMode=this._crsrWasBlockMode;
			this.crsrBlinkMode=this._crsrWasBlinkMode;
			delete this._crsrWasBlockMode;
			delete this._crsrWasBlinkMode;
		}
	}
	else {
		this.c=this.fieldStart+this.fieldC-ofs;
		this.cursorOn();
	}
},

// keyboard focus

focus: function() {
	this.globals.setFocus(this);
},

// a inner reference (just for comfort) to be mapped to Terminal.prototype.globals.termKey
termKey: null,


// GUI related methods

_makeTerm: function(rebuild) {
	window.status='Building terminal ...';
	var divPrefix=this.termDiv+'_r';
	if (this.domAPI) {
		// if applicable we're using createElement
		this.globals.hasSubDivs=false;
		var td, row, table, tbody, table2, tbody2, tr, td, node;
		table=document.createElement('table');
		table.setAttribute('border', 0);
		table.setAttribute('cellSpacing', 0);
		table.setAttribute('cellPadding', this.conf.frameWidth);
		tbody=document.createElement('tbody');
		table.appendChild(tbody);
		row=document.createElement('tr');
		tbody.appendChild(row);
		ptd=document.createElement('td');
		ptd.style.backgroundColor=this.conf.frameColor;
		row.appendChild(ptd);
		table2=document.createElement('table');
		table2.setAttribute('border', 0);
		table2.setAttribute('cellSpacing', 0);
		table2.setAttribute('cellPadding', 2);
		tbody2=document.createElement('tbody');
		table2.appendChild(tbody2);
		tr=document.createElement('tr');
		tbody2.appendChild(tr);
		td=document.createElement('td');
		td.style.backgroundColor=this.conf.bgColor;
		tr.appendChild(td);
		ptd.appendChild(table2);
		ptd=td;
		table2=document.createElement('table');
		table2.setAttribute('border', 0);
		table2.setAttribute('cellSpacing', 0);
		table2.setAttribute('cellPadding', 0);
		tbody2=document.createElement('tbody');
		table2.appendChild(tbody2);
		var rstr='';
		for (var c=0; c<this.conf.cols; c++) rstr+='&nbsp;';
		for (var r=0; r<this.conf.rows; r++) {
			tr=document.createElement('tr');
			td=document.createElement('td');
			td.id=divPrefix+r;
			if (this.conf.rowHeight)
				td.style.height=td.style.minHeight=td.style.maxHeight=this.conf.rowHeight;
			td.style.whiteSpace='nowrap';
			td.className=this.conf.fontClass;
			td.innerHTML=rstr;
			tr.appendChild(td);
			tbody2.appendChild(tr);
		}
		ptd.appendChild(table2);
		node=document.getElementById(this.termDiv);
		this.contentEditable=node.contentEditable;
		while (node.hasChildNodes()) node.removeChild(node.firstChild);
		node.appendChild(table);
	}
	else {
		// legacy code
		this.globals.hasSubDivs=(navigator.userAgent.indexOf('Gecko')<0);
		var s='',
			bgColorAttribute = (this.conf.bgColor && (this.conf.bgColor!=='none' || this.conf.bgColor!='transparent'))? ' bgcolor="'+this.conf.bgColor+'"':'',
			frameColorAttribute = (this.conf.frameColor && (this.conf.frameColor!=='none' || this.conf.frameColor!='transparent'))? ' bgcolor="'+this.conf.frameColor+'"':'';
		s+='<table border="0" cellspacing="0" cellpadding="'+this.conf.frameWidth+'">\n';
		s+='<tr><td'+frameColorAttribute+'><table border="0" cellspacing="0" cellpadding="2"><tr><td'+bgColorAttribute+'><table border="0" cellspacing="0" cellpadding="0">\n';
		var rstr='';
		for (var c=0; c<this.conf.cols; c++) rstr+='&nbsp;';
		for (var r=0; r<this.conf.rows; r++) {
			var termid=(this.globals.hasSubDivs)? '' : ' id="'+divPrefix+r+'"';
			s+='<tr><td nowrap'
			if (this.conf.rowHeight)
				s+=' height="'+this.conf.rowHeight+'"'
			s+=termid+' class="'+this.conf.fontClass+'">'+rstr+'<\/td><\/tr>\n';
		}
		s+='<\/table><\/td><\/tr>\n';
		s+='<\/table><\/td><\/tr>\n';
		s+='<\/table>\n';
		var termOffset=2+this.conf.frameWidth;
		if (this.globals.hasSubDivs) {
			for (var r=0; r<this.conf.rows; r++) {
				s+='<div id="'+divPrefix+r+'" style="position:absolute; top:'+(termOffset+r*this.conf.rowHeight)+'px; left: '+termOffset+'px;" class="'+this.conf.fontClass+'"><\/div>\n';
			}
			this.globals.termStringStart='<table border="0" cellspacing="0" cellpadding="0"><tr><td nowrap height="'+this.conf.rowHeight+'" class="'+this.conf.fontClass+'">';
			this.globals.termStringEnd='<\/td><\/tr><\/table>';
		}
		this.globals.writeElement(this.termDiv,s);
	}
	if (!rebuild) {
		this.globals.setElementXY(this.termDiv,this.conf.x,this.conf.y);
		this.globals.setVisible(this.termDiv,1);
	}
	window.status='';
},

rebuild: function() {
	// check for bounds and array lengths
	var rl=this.conf.rows;
	var cl=this.conf.cols;
	for (var r=0; r<rl; r++) {
		var cbr=this.charBuf[r];
		if (!cbr) {
			this.charBuf[r]=this.getRowArray(cl,0);
			this.styleBuf[r]=this.getRowArray(cl,0);
		}
		else if (cbr.length<cl) {
			for (var c=cbr.length; c<cl; c++) {
				this.charBuf[r][c]=0;
				this.styleBuf[r][c]=0;
			}
		}
	}
	var resetcrsr=false;
	if (this.r>=rl) {
		r=rl-1;
		resetcrsr=true;
	}
	if (this.c>=cl) {
		c=cl-1;
		resetcrsr=true;
	}
	if (resetcrsr && this.cursoractive) this.cursorOn();
	// and actually rebuild
	this._makeTerm(true);
	for (var r=0; r<rl; r++) {
		this.redraw(r);
	}
	// clear backup buffer to prevent errors
	this.backupBuffer=null;
},

moveTo: function(x,y) {
	this.globals.setElementXY(this.termDiv,x,y);
},

resizeTo: function(x,y) {
	if (this.termDivReady()) {
		x=parseInt(x,10);
		y=parseInt(y,10);
		if (isNaN(x) || isNaN(y) || x<4 || y<2) return false;
		this.maxCols=this.conf.cols=x;
		this.maxLines=this.conf.rows=y;
		this._makeTerm();
		this.clear();
		return true;
	}
	else {
		return false;
	}
},

redraw: function(r) {
	var s=this.globals.termStringStart;
	var curStyle=0;
	var tstls=this.globals.termStyles;
	var tscls=this.globals.termStyleClose;
	var tsopn=this.globals.termStyleOpen;
	var tspcl=this.globals.termSpecials;
	var tclrs=this.globals.colorCodes;
	var tnclrs=this.globals.nsColorCodes;
	var twclrs=this.globals.webColorCodes;
	var t_cb=this.charBuf;
	var t_sb=this.styleBuf;
	var blur=this.textBlur;
	var clr='';
	var textColor=this.textColor || '';
	for (var i=0; i<this.conf.cols; i++) {
		var c=t_cb[r][i];
		var cs=t_sb[r][i];
		if (cs!=curStyle || (i==0 && textColor)) {
			if (curStyle) {
				if (curStyle & 0xffff00) s+='</span>';
				for (var k=tstls.length-1; k>=0; k--) {
					var st=tstls[k];
					if (curStyle & st) s+=tscls[st];
				}
			}
			curStyle=cs;
			for (var k=0; k<tstls.length; k++) {
				var st=tstls[k];
				if (curStyle&st) s+=tsopn[st];
			}
			clr=textColor;
			if (curStyle & 0xffff00) {
				s+='<span style="'
				if (curStyle & 0xff00) {
					var cc=(curStyle & 0xff00)>>>8;
					clr= (cc<17)? tclrs[cc] : '#'+tnclrs[cc-16];
					s+='color:'+clr+' !important;';
				}
				else if (typeof blur === 'object') {
					s+='<span style="color:'+clr+' !important; text-shadow: 0 0 '+blur.join('px '+clr+', 0 0 ')+'px '+clr+';">';
				}
				else if (blur) {
					 s+='<span style="color:'+clr+' !important; text-shadow: 0 0 '+blur+'px '+clr+';">';
				}
				if (curStyle & 0xff0000) {
					var cc=(curStyle & 0xff0000)>>>16;
					clr= (cc<17)? tclrs[cc] : '#'+tnclrs[cc-16];
					s+='background-color:'+clr+' !important;';
 				}
				s+='">'
			}
		}
		s+= (tspcl[c])? tspcl[c] : String.fromCharCode(c);
	}
	if (curStyle>0) {
		if (curStyle & 0xffff00) s+='</span>';
		for (var k=tstls.length-1; k>=0; k--) {
			var st=tstls[k];
			if (curStyle&st) s+=tscls[st];
		}
	}
	s+=this.globals.termStringEnd;
	this.globals.writeElement(this.termDiv+'_r'+r,s);
},

guiReady: function() {
	var ready=true;
	if (this.globals.guiElementsReady(this.termDiv)) {
		for (var r=0; r<this.conf.rows; r++) {
			if (this.globals.guiElementsReady(this.termDiv+'_r'+r)==false) {
				ready=false;
				break;
			}
		}
	}
	else {
		ready=false;
	}
	return ready;
},

termDivReady: function() {
	if (document.getElementById) {
		return (document.getElementById(this.termDiv))? true:false;
	}
	else if (document.all) {
		return (document.all[this.termDiv])? true:false;
	}
	else {
		return false;
	}
},

getDimensions: function() {
	var w=0;
	var h=0;
	var d=this.termDiv;
	if (document.getElementById) {
		var obj=document.getElementById(d);
		if (obj && obj.firstChild) {
			w=parseInt(obj.firstChild.offsetWidth,10);
			h=parseInt(obj.firstChild.offsetHeight,10);
		}
		else if (obj && obj.children && obj.children[0]) {
			w=parseInt(obj.children[0].offsetWidth,10);
			h=parseInt(obj.children[0].offsetHeight,10);
		}
	}
	else if (document.all) {
		var obj=document.all[d];
		if (obj && obj.children && obj.children[0]) {
			w=parseInt(obj.children[0].offsetWidth,10);
			h=parseInt(obj.children[0].offsetHeight,10);
		}
	}
	return { width: w, height: h };
},


// global store for static data and methods (former "TermGlobals")

globals: {

	termToInitialze:null,
	activeTerm:null,
	kbdEnabled:false,
	keylock:false,
	keyRepeatDelay1: 450, // initial delay
	keyRepeatDelay2: 100, // consecutive delays
	keyRepeatTimer: null,
	lcMorePrompt1: ' -- MORE -- ',
	lcMorePromtp1Style: 1,
	lcMorePrompt2: ' (Type: space to continue, \'q\' to quit)',
	lcMorePrompt2Style: 0,
	lcMoreKeyAbort: 113,
	lcMoreKeyContinue: 32,

	// initialize global data structs

	_initGlobals: function() {
		var tg=Terminal.prototype.globals;
		tg._extendMissingStringMethods();
		tg._initWebColors();
		tg._initDomKeyRef();
		Terminal.prototype.termKey=tg.termKey;
	},

	// hex support (don't rely on generic support like Number.toString(16))

	getHexChar: function(c) {
		var tg=Terminal.prototype.globals;
		if (tg.isHexChar(c)) return tg.hexToNum[c];
		return -1;
	},

	isHexChar: function(c) {
		return ((c>='0' && c<='9') || (c>='a' && c<='f') || (c>='A' && c<='F'))? true:false;
	},

	isHexOnlyChar: function(c) {
		return ((c>='a' && c<='f') || (c>='A' && c<='F'))? true:false;
	},

	hexToNum: {
		'0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7,
		'8': 8, '9': 9, 'a': 10, 'b': 11, 'c': 12, 'd': 13, 'e': 14, 'f': 15,
		'A': 10, 'B': 11, 'C': 12, 'D': 13, 'E': 14, 'F': 15
	},

	// data for color support

	webColors: [],
	webColorCodes: [''],

	colors: {
		black: 1,
		// dark color set
		blue2: 2,
		green2: 3,
		cyan2: 4,
		red2: 5,
		magenta2: 6,
		brown: 7,
		gray: 8,
		gray2: 9,
		// ANSI bright (bold) color set
		blue: 10,
		green: 11,
		cyan: 12,
		red: 13,
		magenta: 14,
		yellow: 15,
		white: 16,
		// synonyms
		darkblue: 2,
		darkgreen: 3,
		darkcyan: 4,
		darkred: 5,
		darkmagenta: 6,
		gray1: 8,
		darkgray: 9,
		blue1: 10,
		green1: 11,
		cyan1: 12,
		red1: 13,
		magenta1: 14,
		// default color
		'default': 0,
		clear: 0
	},

	colorCodes: [
		'',
		'#000000', '#0000aa', '#00aa00', '#00aaaa',
		'#aa0000', '#aa00aa', '#aa5500', '#aaaaaa',
		'#555555', '#5555ff', '#55ff55', '#55ffff',
		'#ff5555', '#ff55ff', '#ffff55', '#ffffff'
	],

	nsColors: {
		'aliceblue': 1, 'antiquewhite': 2, 'aqua': 3, 'aquamarine': 4,
		'azure': 5, 'beige': 6, 'black': 7, 'blue': 8,
		'blueviolet': 9, 'brown': 10, 'burlywood': 11, 'cadetblue': 12,
		'chartreuse': 13, 'chocolate': 14, 'coral': 15, 'cornflowerblue': 16,
		'cornsilk': 17, 'crimson': 18, 'darkblue': 19, 'darkcyan': 20,
		'darkgoldenrod': 21, 'darkgray': 22, 'darkgreen': 23, 'darkkhaki': 24,
		'darkmagenta': 25, 'darkolivegreen': 26, 'darkorange': 27, 'darkorchid': 28,
		'darkred': 29, 'darksalmon': 30, 'darkseagreen': 31, 'darkslateblue': 32,
		'darkslategray': 33, 'darkturquoise': 34, 'darkviolet': 35, 'deeppink': 36,
		'deepskyblue': 37, 'dimgray': 38, 'dodgerblue': 39, 'firebrick': 40,
		'floralwhite': 41, 'forestgreen': 42, 'fuchsia': 43, 'gainsboro': 44,
		'ghostwhite': 45, 'gold': 46, 'goldenrod': 47, 'gray': 48,
		'green': 49, 'greenyellow': 50, 'honeydew': 51, 'hotpink': 52,
		'indianred': 53, 'indigo': 54, 'ivory': 55, 'khaki': 56,
		'lavender': 57, 'lavenderblush': 58, 'lawngreen': 59, 'lemonchiffon': 60,
		'lightblue': 61, 'lightcoral': 62, 'lightcyan': 63, 'lightgoldenrodyellow': 64,
		'lightgreen': 65, 'lightgrey': 66, 'lightpink': 67, 'lightsalmon': 68,
		'lightseagreen': 69, 'lightskyblue': 70, 'lightslategray': 71, 'lightsteelblue': 72,
		'lightyellow': 73, 'lime': 74, 'limegreen': 75, 'linen': 76,
		'maroon': 77, 'mediumaquamarine': 78, 'mediumblue': 79, 'mediumorchid': 80,
		'mediumpurple': 81, 'mediumseagreen': 82, 'mediumslateblue': 83, 'mediumspringgreen': 84,
		'mediumturquoise': 85, 'mediumvioletred': 86, 'midnightblue': 87, 'mintcream': 88,
		'mistyrose': 89, 'moccasin': 90, 'navajowhite': 91, 'navy': 92,
		'oldlace': 93, 'olive': 94, 'olivedrab': 95, 'orange': 96,
		'orangered': 97, 'orchid': 98, 'palegoldenrod': 99, 'palegreen': 100,
		'paleturquoise': 101, 'palevioletred': 102, 'papayawhip': 103, 'peachpuff': 104,
		'peru': 105, 'pink': 106, 'plum': 107, 'powderblue': 108,
		'purple': 109, 'red': 110, 'rosybrown': 111, 'royalblue': 112,
		'saddlebrown': 113, 'salmon': 114, 'sandybrown': 115, 'seagreen': 116,
		'seashell': 117, 'sienna': 118, 'silver': 119, 'skyblue': 120,
		'slateblue': 121, 'slategray': 122, 'snow': 123, 'springgreen': 124,
		'steelblue': 125, 'tan': 126, 'teal': 127, 'thistle': 128,
		'tomato': 129, 'turquoise': 130, 'violet': 131, 'wheat': 132,
		'white': 133, 'whitesmoke': 134, 'yellow': 135, 'yellowgreen': 136
	},

	nsColorCodes: [
		'',
		'f0f8ff', 'faebd7', '00ffff', '7fffd4',
		'f0ffff', 'f5f5dc', '000000', '0000ff',
		'8a2be2', 'a52a2a', 'deb887', '5f9ea0',
		'7fff00', 'd2691e', 'ff7f50', '6495ed',
		'fff8dc', 'dc143c', '00008b', '008b8b',
		'b8860b', 'a9a9a9', '006400', 'bdb76b',
		'8b008b', '556b2f', 'ff8c00', '9932cc',
		'8b0000', 'e9967a', '8fbc8f', '483d8b',
		'2f4f4f', '00ced1', '9400d3', 'ff1493',
		'00bfff', '696969', '1e90ff', 'b22222',
		'fffaf0', '228b22', 'ff00ff', 'dcdcdc',
		'f8f8ff', 'ffd700', 'daa520', '808080',
		'008000', 'adff2f', 'f0fff0', 'ff69b4',
		'cd5c5c', '4b0082', 'fffff0', 'f0e68c',
		'e6e6fa', 'fff0f5', '7cfc00', 'fffacd',
		'add8e6', 'f08080', 'e0ffff', 'fafad2',
		'90ee90', 'd3d3d3', 'ffb6c1', 'ffa07a',
		'20b2aa', '87cefa', '778899', 'b0c4de',
		'ffffe0', '00ff00', '32cd32', 'faf0e6',
		'800000', '66cdaa', '0000cd', 'ba55d3',
		'9370db', '3cb371', '7b68ee', '00fa9a',
		'48d1cc', 'c71585', '191970', 'f5fffa',
		'ffe4e1', 'ffe4b5', 'ffdead', '000080',
		'fdf5e6', '808000', '6b8e23', 'ffa500',
		'ff4500', 'da70d6', 'eee8aa', '98fb98',
		'afeeee', 'db7093', 'ffefd5', 'ffdab9',
		'cd853f', 'ffc0cb', 'dda0dd', 'b0e0e6',
		'800080', 'ff0000', 'bc8f8f', '4169e1',
		'8b4513', 'fa8072', 'f4a460', '2e8b57',
		'fff5ee', 'a0522d', 'c0c0c0', '87ceeb',
		'6a5acd', '708090', 'fffafa', '00ff7f',
		'4682b4', 'd2b48c', '008080', 'd8bfd8',
		'ff6347', '40e0d0', 'ee82ee', 'f5deb3',
		'ffffff', 'f5f5f5', 'ffff00', '9acd32'
	],
	_webSwatchChars: ['0','3','6','9','c','f'],
	_initWebColors: function() {
		// generate long and short web color ref
		var tg=Terminal.prototype.globals;
		var ws=tg._webColorSwatch;
		var wn=tg.webColors;
		var cc=tg.webColorCodes;
		var n=1;
		var a, b, c, al, bl, bs, cl;
		for (var i=0; i<6; i++) {
			a=tg._webSwatchChars[i];
			al=a+a;
			for (var j=0; j<6; j++) {
				b=tg._webSwatchChars[j];
				bl=al+b+b;
				bs=a+b;
				for (var k=0; k<6; k++) {
					c=tg._webSwatchChars[k];
					cl=bl+c+c;
					wn[bs+c]=wn[cl]=n;
					cc[n]=cl;
					n++;
				}
			}
		}
	},

	webifyColor: function(s) {
		// return nearest web color in 3 digit format
		// (do without RegExp for compatibility)
		var tg=Terminal.prototype.globals;
		if (s.length==6) {
			var c='';
			for (var i=0; i<6; i+=2) {
				var a=s.charAt(i);
				var b=s.charAt(i+1);
				if (tg.isHexChar(a) && tg.isHexChar(b)) {
					c+=tg._webSwatchChars[Math.round(parseInt(a+b,16)/255*5)];
				}
				else {
					return '';
				}
			}
			return c;
		}
		else if (s.length==3) {
			var c='';
			for (var i=0; i<3; i++) {
				var a=s.charAt(i);
				if (tg.isHexChar(a)) {
					c+=tg._webSwatchChars[Math.round(parseInt(a,16)/15*5)];
				}
				else {
					return '';
				}
			}
			return c;
		}
		else {
			return '';
		}
	},

	// public methods for color support

	setColor: function(label, value) {
		var tg=Terminal.prototype.globals;
		if (typeof label == 'number' && label>=1 && label<=15) {
			tg.colorCodes[label]=value;
		}
		else if (typeof label == 'string') {
			label=label.toLowerCase();
			if (label.length==1 && tg.isHexChar(label)) {
				var n=tg.hexToNum[label];
				if (n) tg.colorCodes[n]=value;
			}
			else if (typeof tg.colors[label] != 'undefined') {
				var n=tg.colors[label];
				if (n) tg.colorCodes[n]=value;
			}
		}
	},

	getColorString: function(label) {
		var tg=Terminal.prototype.globals;
		if (typeof label == 'number' && label>=0 && label<=15) {
			return tg.colorCodes[label];
		}
		else if (typeof label == 'string') {
			label=label.toLowerCase();
			if (label.length==1 && tg.isHexChar(label)) {
				return tg.colorCodes[tg.hexToNum[label]];
			}
			else if (typeof tg.colors[label] != 'undefined') {
				return tg.colorCodes[tg.colors[label]];
			}
		}
		return '';
	},

	getColorCode: function(label) {
		var tg=Terminal.prototype.globals;
		if (typeof label == 'number' && label>=0 && label<=15) {
			return label;
		}
		else if (typeof label == 'string') {
			label=label.toLowerCase();
			if (label.length==1 && tg.isHexChar(label)) {
				return parseInt(label,16);
			}
			else if (typeof tg.colors[label] != 'undefined') {
				return tg.colors[label];
			}
		}
		return 0;
	},

	// import/paste methods (methods return success)

	insertText: function(text) {
		// auto-types a given string to the active terminal
		// returns success (false indicates a lock or no active terminal)
		var tg=Terminal.prototype.globals;
		var termRef = tg.activeTerm;
		if (!termRef || termRef.closed || tg.keylock || termRef.lock || termRef.charMode || termRef.fieldMode) return false;
		// terminal open and unlocked, so type the text
		for (var i=0; i<text.length; i++) {
			tg.keyHandler({which: text.charCodeAt(i), _remapped:true});
		}
		return true;
	},

	importEachLine: function(text) {
		// import multiple lines of text per line each and execs
		// returns success (false indicates a lock or no active terminal)
		var tg=Terminal.prototype.globals;
		var termRef = tg.activeTerm;
		if (!termRef || termRef.closed || tg.keylock || termRef.lock || termRef.charMode || termRef.fieldMode) return false;
		// clear the current command line
		termRef.cursorOff();
		termRef._clearLine();
		// normalize line breaks
		text=text.replace(/\r\n?/g, '\n');
		// split lines and auto-type the text
		var t=text.split('\n');
		for (var i=0; i<t.length; i++) {
			for (var k=0; k<t[i].length; k++) {
				tg.keyHandler({which: t[i].charCodeAt(k), _remapped:true});
			}
			tg.keyHandler({which: term.termKey.CR, _remapped:true});
		}
		return true;
	},

	importMultiLine: function(text) {
		// importing multi-line text as single input with "\n" in lineBuffer
		var tg=Terminal.prototype.globals;
		var termRef = tg.activeTerm;
		if (!termRef || termRef.closed || tg.keylock || termRef.lock || termRef.charMode || termRef.fieldMode) return false;
		// lock and clear the line
		termRef.lock = true;
		termRef.cursorOff();
		termRef._clearLine();
		// normalize linebreaks and echo the text linewise
		text = text.replace(/\r\n?/g, '\n');
		var lines = text.split('\n');
		for (var i=0; i<lines.length; i++) {
			termRef.type(lines[i]);
			if (i<lines.length-1) termRef.newLine();
		}
		// fake <ENTER>;
		// (no history entry for this)
		termRef.lineBuffer = text;
		termRef.lastLine = '';
		termRef.inputChar = 0;
		termRef.handler();
		return true;
	},

	// text related service functions

	normalize: function(n,m) {
		var s=''+n;
		while (s.length<m) s='0'+s;
		return s;
	},

	fillLeft: function(t,n) {
		if (typeof t != 'string') t=''+t;
		while (t.length<n) t=' '+t;
		return t;
	},

	center: function(t,l) {
		var s='';
		for (var i=t.length; i<l; i+=2) s+=' ';
		return s+t;
	},

	// simple substitute for String.replace()
	stringReplace: function(s1,s2,t) {
		var l1=s1.length;
		var l2=s2.length;
		var ofs=t.indexOf(s1);
		while (ofs>=0) {
			t=t.substring(0,ofs)+s2+t.substring(ofs+l1);
			ofs=t.indexOf(s1,ofs+l2);
		}
		return t;
	},


	// config data for text wrap

	wrapChars: {
		// keys: charCode
		// values: 1 = white space, 2 = wrap after, 3 = wrap before, 4 = conditional word break
		9:   1, // tab
		10:  1, // new line - don't change this (used internally)!!!
		12:  4, // form feed (use this for conditional word breaks)
		13:  1, // cr
		32:  1, // blank
		40:  3, // (
		45:  2, // dash/hyphen
		61:  2, // =
		91:  3, // [
		94:  3, // caret (non-printing chars)
		123: 3  // {
	},


	// keyboard methods & controls

	setFocus: function(termref) {
		Terminal.prototype.globals.activeTerm=termref;
		Terminal.prototype.globals.clearRepeatTimer();
	},

	termKey: {
		// codes of special keys
		'NUL': 0x00,
		'SOH': 0x01,
		'STX': 0x02,
		'ETX': 0x03,
		'EOT': 0x04,
		'ENQ': 0x05,
		'ACK': 0x06,
		'BEL': 0x07,
		'BS': 0x08,
		'BACKSPACE': 0x08,
		'HT': 0x09,
		'TAB': 0x09,
		'LF': 0x0A,
		'VT': 0x0B,
		'FF': 0x0C,
		'CR': 0x0D,
		'SO': 0x0E,
		'SI': 0x0F,
		'DLE': 0x10,
		'DC1': 0x11,
		'DC2': 0x12,
		'DC3': 0x13,
		'DC4': 0x14,
		'NAK': 0x15,
		'SYN': 0x16,
		'ETB': 0x17,
		'CAN': 0x18,
		'EM': 0x19,
		'SUB': 0x1A,
		'ESC': 0x1B,
		'IS4': 0x1C,
		'IS3': 0x1D,
		'IS2': 0x1E,
		'IS1': 0x1F,
		'DEL': 0x7F,
		// other specials
		'EURO': 0x20AC,
		// cursor mapping
		'LEFT': 0x1C,
		'RIGHT': 0x1D,
		'UP': 0x1E,
		'DOWN': 0x1F
	},

	// map some DOM_VK_* properties to values defined in termKey
	termDomKeyRef: {},
	_domKeyMappingData: {
		'LEFT': 'LEFT',
		'RIGHT': 'RIGHT',
		'UP': 'UP',
		'DOWN': 'DOWN',
		'BACK_SPACE': 'BS',
		'RETURN': 'CR',
		'ENTER': 'CR',
		'ESCAPE': 'ESC',
		'DELETE': 'DEL',
		'TAB': 'TAB'
	},
	_initDomKeyRef: function() {
		var tg=Terminal.prototype.globals;
		var m=tg._domKeyMappingData;
		var r=tg.termDomKeyRef;
		var k=tg.termKey;
		for (var i in m) r['DOM_VK_'+i]=k[m[i]];
	},
	
	registerEvent: function(obj, eventType, handler, capture) {
		if (obj.addEventListener) {
			obj.addEventListener(eventType.toLowerCase(), handler, capture);
		}
		/*
		else if (obj.attachEvent) {
			obj.attachEvent('on'+eventType.toLowerCase(), handler);
		}
		*/
		else {
			var et=eventType.toUpperCase();
			if (window.Event && window.Event[et] && obj.captureEvents) obj.captureEvents(Event[et]);
			obj['on'+eventType.toLowerCase()]=handler;
		}
	},
	releaseEvent: function(obj, eventType, handler, capture) {
		if (obj.removeEventListener) {
			obj.removeEventListener(eventType.toLowerCase(), handler, capture);
		}
		/*
		else if (obj.detachEvent) {
			obj.detachEvent('on'+eventType.toLowerCase(), handler);
		}
		*/
		else {
			var et=eventType.toUpperCase();
			if (window.Event && window.Event[et] && obj.releaseEvents) obj.releaseEvents(Event[et]);
			et='on'+eventType.toLowerCase();
			if (obj[et] && obj[et]==handler) obj.et=null;
		}
	},

	isBeforeInputEventAvailable: function () {
		return (
			window.InputEvent &&
			typeof InputEvent.prototype.getTargetRanges === "function"
		);
	},

	enableKeyboard: function(term) {
		var tg=Terminal.prototype.globals;
		if (!tg.kbdEnabled) {
			if (tg.isBeforeInputEventAvailable() &&
				[ "true", "on" ].includes(term.contentEditable))
			{
				tg.registerEvent(document, 'beforeinput', tg.keyBI, true);
				tg.registerEvent(document, 'keydown', tg.keyFix, true);
				tg.registerEvent(document, 'keyup', tg.clearRepeatTimer, true);
			}
			else {
				tg.registerEvent(document, 'keypress', tg.keyHandler, true);
				tg.registerEvent(document, 'keydown', tg.keyFix, true);
				tg.registerEvent(document, 'keyup', tg.clearRepeatTimer, true);
			}
			tg.kbdEnabled=true;
		}
		tg.activeTerm=term;
	},

	disableKeyboard: function(term) {
		var tg=Terminal.prototype.globals;
		if (tg.kbdEnabled) {
			tg.releaseEvent(document, 'keypress', tg.keyHandler, true);
			tg.releaseEvent(document, 'keydown', tg.keyFix, true);
			tg.releaseEvent(document, 'keyup', tg.clearRepeatTimer, true);
			tg.releaseEvent(document, 'beforeinput', tg.keyBI, true);
			tg.kbdEnabled=false;
		}
		tg.activeTerm=null;
	},

	keyBI: function (e) {
		var tg=Terminal.prototype.globals;
		var text=e.data;

		if (e.isComposing ||
			![ "insertText", "insertCompositionText" ].includes(e.inputType))
		{
			return false;
		}

		for (var i=0; i<text.length; i++) {
			tg.keyHandler({which: text.charCodeAt(i), _remapped:true});
		}
		// As of 2024, major browsers do not implement cancelation of
		// composition events. As a result, CJK text input cannot be prevented.
		e.preventDefault();
		e.stopPropagation();
		e.cancelBubble=true;

		return true;
	},

	// remap some special key mappings on keydown

	keyFix: function(e) {
		var tg=Terminal.prototype.globals;
		var term=tg.activeTerm;
		var ch;
		if (tg.keylock || term.lock) return true;
		if (window.event) {
			if  (!e) e=window.event;
			ch=e.keyCode;
			if (e.DOM_VK_UP) {
				for (var i in tg.termDomKeyRef) {
					if (e[i] && ch == e[i]) {
						tg.keyHandler({which:tg.termDomKeyRef[i],_remapped:true,_repeat:(ch==0x1B)? true:false});
						if (e.preventDefault) e.preventDefault();
						if (e.stopPropagation) e.stopPropagation();
						e.cancelBubble=true;
						return false;
					}
				}
				e.cancelBubble=false;
				return true;
			}
			else {
				// no DOM support
				var termKey=term.termKey;
				var keyHandler=tg.keyHandler;
				if (ch==8 && !term.isOpera) { keyHandler({which:termKey.BS,_remapped:true,_repeat:true}); }
				else if (ch==9) { keyHandler({which:termKey.TAB,_remapped:true,_repeat: (term.printTab)? false:true}); }
				else if (ch==27) { keyHandler({which:termKey.ESC,_remapped:true,_repeat: (term.printTab)? false:true}); }
				else if (ch==37) { keyHandler({which:termKey.LEFT,_remapped:true,_repeat:true}); }
				else if (ch==39) { keyHandler({which:termKey.RIGHT,_remapped:true,_repeat:true}); }
				else if (ch==38) { keyHandler({which:termKey.UP,_remapped:true,_repeat:true}); }
				else if (ch==40) { keyHandler({which:termKey.DOWN,_remapped:true,_repeat:true}); }
				else if (ch==127 || ch==46) { keyHandler({which:termKey.DEL,_remapped:true,_repeat:true}); }
				else if (ch>=57373 && ch<=57376) {
					if (ch==57373) { keyHandler({which:termKey.UP,_remapped:true,_repeat:true}); }
					else if (ch==57374) { keyHandler({which:termKey.DOWN,_remapped:true,_repeat:true}); }
					else if (ch==57375) { keyHandler({which:termKey.LEFT,_remapped:true,_repeat:true}); }
					else if (ch==57376) { keyHandler({which:termKey.RIGHT,_remapped:true,_repeat:true}); }
				}
				else {
					e.cancelBubble=false;
					return true;
				}
				if (e.preventDefault) e.preventDefault();
				if (e.stopPropagation) e.stopPropagation();
				e.cancelBubble=true;
				return false;
			}
		}
	},
	
	clearRepeatTimer: function(e) {
		var tg=Terminal.prototype.globals;
		if (tg.keyRepeatTimer) {
			clearTimeout(tg.keyRepeatTimer);
			tg.keyRepeatTimer=null;
		}
	},
	
	doKeyRepeat: function(ch) {
		Terminal.prototype.globals.keyHandler({which:ch,_remapped:true,_repeated:true})
	},

	keyHandler: function(e) {
		var tg=Terminal.prototype.globals;
		var term=tg.activeTerm;
		if (tg.keylock || term.lock || term.isMac && e && e.metaKey) return true;
		if (window.event) {
			if (window.event.preventDefault) window.event.preventDefault();
			if (window.event.stopPropagation) window.event.stopPropagation();
		}
		else if (e) {
			if (e.preventDefault) e.preventDefault();
			if (e.stopPropagation) e.stopPropagation();
		}
		var ch;
		var ctrl=false;
		var shft=false;
		var remapped=false;
		var termKey=term.termKey;
		var keyRepeat=0;
		if (e) {
			ch=e.which;
			ctrl=((e.ctrlKey && !e.altKey) || e.modifiers==2);
			shft=(e.shiftKey || e.modifiers==4);
			if (e._remapped) {
				remapped=true;
				if (window.event) {
					//ctrl=(ctrl || window.event.ctrlKey);
					ctrl=(ctrl || (window.event.ctrlKey && !window.event.altKey));
					shft=(shft || window.event.shiftKey);
				}
			}
			if (e._repeated) {
				keyRepeat=2;
			}
			else if (e._repeat) {
				keyRepeat=1;
			}
		}
		else if (window.event) {
			ch=window.event.keyCode;
			//ctrl=(window.event.ctrlKey);
			ctrl=(window.event.ctrlKey && !window.event.altKey); // allow alt gr == ctrl alt
			shft=(window.event.shiftKey);
			if (window.event._repeated) {
				keyRepeat=2;
			}
			else if (window.event._repeat) {
				keyRepeat=1;
			}
		}
		else {
			return true;
		}
		if (ch=='' && remapped==false) {
			// map specials
			if (e==null) e=window.event;
			if (e.charCode==0 && e.keyCode) {
				if (e.DOM_VK_UP) {
					var dkr=tg.termDomKeyRef;
					for (var i in dkr) {
						if (e[i] && e.keyCode == e[i]) {
							ch=dkr[i];
							break;
						}
					}
				}
				else {
					// NS4
					if (e.keyCode==28) { ch=termKey.LEFT; }
					else if (e.keyCode==29) { ch=termKey.RIGHT; }
					else if (e.keyCode==30) { ch=termKey.UP; }
					else if (e.keyCode==31) { ch=termKey.DOWN; }
					// Mozilla alike but no DOM support
					else if (e.keyCode==37) { ch=termKey.LEFT; }
					else if (e.keyCode==39) { ch=termKey.RIGHT; }
					else if (e.keyCode==38) { ch=termKey.UP; }
					else if (e.keyCode==40) { ch=termKey.DOWN; }
					// just to have the TAB mapping here too
					else if (e.keyCode==9) { ch=termKey.TAB; }
				}
			}
		}
		// leave on unicode private use area (might be function key etc)
		if ((ch>=0xE000) && (ch<= 0xF8FF)) return;
		if (keyRepeat) {
			tg.clearRepeatTimer();
			tg.keyRepeatTimer = window.setTimeout(
				'Terminal.prototype.globals.doKeyRepeat('+ch+')',
				(keyRepeat==1)? tg.keyRepeatDelay1:tg.keyRepeatDelay2
			);
		}
		// key actions
		if (term.charMode) {
			term.insert=false;
			term.inputChar=ch;
			term.lineBuffer='';
			term.handler();
			if (ch<=32 && window.event) window.event.cancelBubble=true;
			return false;
		}
		if (!ctrl) {
			// special keys
			if (ch==termKey.CR) {
				term.lock=true;
				term.cursorOff();
				term.insert=false;
				if (term.rawMode) {
					term.lineBuffer=term.lastLine;
				}
				else if (term.fieldMode) {
					term.lineBuffer=term.lastLine;
					term.exitFieldMode();
				}
				else {
					term.lineBuffer=term._getLine(true);
					if (
						term.lineBuffer!='' &&
						(!term.historyUnique || term.history.length==0 ||
						term.lineBuffer!=term.history[term.history.length-1])
					   ) {
						term.history[term.history.length]=term.lineBuffer;
					}
					term.histPtr=term.history.length;
				}
				term.lastLine='';
				term.inputChar=0;
				term.handler();
				if (window.event) window.event.cancelBubble=true;
				return false;
			}
			else if (term.fieldMode) {
				if (ch==termKey.ESC) {
					term.lineBuffer=term.lastLine='';
					term.exitFieldMode();
					term.lastLine='';
					term.inputChar=0;
					term.handler();
					if (window.event) window.event.cancelBubble=true;
					return false;
				}
				else if (ch==termKey.LEFT) {
					if (term.fieldC>0) term.fieldC--;
				}
				else if (ch==termKey.RIGHT) {
					if (term.fieldC<term.lastLine.length) term.fieldC++;
				}
				else if (ch==termKey.BS) {
					if (term.fieldC>0) {
						term.lastLine=term.lastLine.substring(0,term.fieldC-1)+term.lastLine.substring(term.fieldC);
						term.fieldC--;
					}
				}
				else if (ch==termKey.DEL) {
					if (term.fieldC<term.lastLine.length) {
						term.lastLine=term.lastLine.substring(0,term.fieldC)+term.lastLine.substring(term.fieldC+1);
					}
				}
				else if (ch>=32) {
					term.lastLine=term.lastLine.substring(0,term.fieldC)+String.fromCharCode(ch)+term.lastLine.substring(term.fieldC);
					term.fieldC++;
				}
				term.drawField();
				return false;
			}
			else if (ch==termKey.ESC && term.conf.closeOnESC) {
				term.close();
				if (window.event) window.event.cancelBubble=true;
				return false;
			}
			if (ch<32 && term.rawMode) {
				if (window.event) window.event.cancelBubble=true;
				return false;
			}
			else {
				if (ch==termKey.LEFT) {
					term.cursorLeft();
					if (window.event) window.event.cancelBubble=true;
					return false;
				}
				else if (ch==termKey.RIGHT) {
					term.cursorRight();
					if (window.event) window.event.cancelBubble=true;
					return false;
				}
				else if (ch==termKey.UP) {
					term.cursorOff();
					if (term.histPtr==term.history.length) term.lastLine=term._getLine();
					term._clearLine();
					if (term.history.length && term.histPtr>=0) {
						if (term.histPtr>0) term.histPtr--;
						term.type(term.history[term.histPtr]);
					}
					else if (term.lastLine) {
						term.type(term.lastLine);
					}
					term.cursorOn();
					if (window.event) window.event.cancelBubble=true;
					return false;
				}
				else if (ch==termKey.DOWN) {
					term.cursorOff();
					if (term.histPtr==term.history.length) term.lastLine=term._getLine();
					term._clearLine();
					if (term.history.length && term.histPtr<=term.history.length) {
						if (term.histPtr<term.history.length) term.histPtr++;
						if (term.histPtr<term.history.length) {
							term.type(term.history[term.histPtr]);
						}
						else if (term.lastLine) {
							term.type(term.lastLine);
						}
					}
					else if (term.lastLine) {
						term.type(term.lastLine);
					}
					term.cursorOn();
					if (window.event) window.event.cancelBubble=true;
					return false;
				}
				else if (ch==termKey.BS) {
					term.backspace();
					if (window.event) window.event.cancelBubble=true;
					return false;
				}
				else if (ch==termKey.DEL) {
					if (term.DELisBS) {
						term.backspace();
					}
					else {
						term.fwdDelete();
					}
					if (window.event) window.event.cancelBubble=true;
					return false;
				}
			}
		}
		if (term.rawMode) {
			if (term.isPrintable(ch)) {
				term.lastLine+=String.fromCharCode(ch);
			}
			if (ch==32 && window.event) {
				window.event.cancelBubble=true;
			}
			else if (window.opera && window.event) {
				window.event.cancelBubble=true;
			}
			return false;
		}
		else {
			if (term.conf.catchCtrlH && (ch==termKey.BS || (ctrl && ch==72))) {
				// catch ^H
				term.backspace();
				if (window.event) window.event.cancelBubble=true;
				return false;
			}
			else if (term.ctrlHandler && (ch<32 || (ctrl && term.isPrintable(ch,true)))) {
				if ((ch>=65 && ch<=96) || ch==63) {
					// remap canonical
					if (ch==63) {
						ch=31;
					}
					else {
						ch-=64;
					}
				}
				term.inputChar=ch;
				term.ctrlHandler();
				if (window.event) window.event.cancelBubble=true;
				return false;
			}
			else if (ctrl || !term.isPrintable(ch,true)) {
				if (window.event) window.event.cancelBubble=true;
				return false;
			}
			else if (term.isPrintable(ch,true)) {
				if (term.blinkTimer) clearTimeout(term.blinkTimer);
				if (term.insert) {
					term.cursorOff();
					term._scrollRight(term.r,term.c);
				}
				term._charOut(ch);
				term.cursorOn();
				if (ch==32 && window.event) {
					window.event.cancelBubble=true;
				}
				else if (window.opera && window.event) {
					window.event.cancelBubble=true;
				}
				return false;
			}
		}
		return true;
	},


	// gui mappings

	hasSubDivs: false,
	termStringStart: '',
	termStringEnd: '',

	termSpecials: {
		// special HTML escapes
		0: '&nbsp;',
		1: '&nbsp;',
		9: '&nbsp;',
		32: '&nbsp;',
		34: '&quot;',
		38: '&amp;',
		60: '&lt;',
		62: '&gt;',
		127: '&loz;',
		0x20AC: '&euro;'
	},

	// extensive list of max 8 styles (2^n, n<16)
	termStyles: [1,2,4,8, 16],
	// style markup: one letter keys, reserved keys: "p" (plain), "c" (color)
	termStyleMarkup: {
		'r': 1,
		'u': 2,
		'i': 4,
		's': 8,
		'b': 16 // map "b" to 16 (italics) for ANSI mapping
	},
	// mappings for styles (heading HTML)
	termStyleOpen: {
		1: '<span class="termReverse">',
		2: '<u>',
		4: '<i>',
		8: '<strike>',
		16: '<i>'
	},
	// mapping for styles (trailing HTML)
	termStyleClose: {
		1: '<\/span>',
		2: '<\/u>',
		4: '<\/i>',
		8: '<\/strike>',
		16: '</i>'
	},
	
	// method to install custom styles
	assignStyle: function(styleCode, markup, htmlOpen, htmlClose) {
		var tg=Terminal.prototype.globals;
		// check params
		if (!styleCode || isNaN(styleCode)) {
			if (styleCode>=256) {
				alert('termlib.js:\nCould not assign style.\n'+s+' is not a valid power of 2 between 0 and 256.');
				return;
			}
		}
		var s=styleCode&0xff;
		var matched=false;
		for (var i=0; i<8; i++) {
			if ((s>>>i)&1) {
				if (matched) {
					alert('termlib.js:\nCould not assign style code.\n'+s+' is not a power of 2!');
					return;
				}
				matched=true;
			}
		}
		if (!matched) {
			alert('termlib.js:\nCould not assign style code.\n'+s+' is not a valid power of 2 between 0 and 256.');
			return;
		}
		markup=String(markup).toLowerCase();
		if (markup=='c' || markup=='p') {
			alert('termlib.js:\nCould not assign mark up.\n"'+markup+'" is a reserved code.');
			return;
		}
		if (markup.length>1) {
			alert('termlib.js:\nCould not assign mark up.\n"'+markup+'" is not a single letter code.');
			return;
		}
		var exists=false;
		for (var i=0; i<tg.termStyles.length; i++) {
			if (tg.termStyles[i]==s) {
				exists=true;
				break;
			}
		}
		if (exists) {
			var m=tg.termStyleMarkup[markup];
			if (m && m!=s) {
				alert('termlib.js:\nCould not assign mark up.\n"'+markup+'" is already in use.');
				return;
			}
		}
		else {
			if (tg.termStyleMarkup[markup]) {
				alert('termlib.js:\nCould not assign mark up.\n"'+markup+'" is already in use.');
				return;
			}
			tg.termStyles[tg.termStyles.length]=s;
		}
		// install properties
		tg.termStyleMarkup[markup]=s;
		tg.termStyleOpen[s]=htmlOpen;
		tg.termStyleClose[s]=htmlClose;
	},
	
	// ANSI output mapping (styles & fg colors only)
	
	ANSI_regexp: /(\x1b\[|x9b)([0-9;]+?)([a-zA-Z])/g, // CSI ( = 0x1b+"[" or 0x9b ) + params + letter
	ANIS_SGR_codes: {
		'0': '%+p',
		'1': '%+b',
		'3': '%+i',
		'4': '%+u',
		'7': '%+r',
		'9': '%+s',
		'21': '%+u',
		'22': '%-b',
		'23': '%-i',
		'24': '%-u',
		'27': '%-r',
		'29': '%-s',
		'30': '%c(0)', // using default fg color for black (black: "%c(1)")
		'31': '%c(a)',
		'32': '%c(b)',
		'33': '%c(c)',
		'34': '%c(d)',
		'35': '%c(e)',
		'36': '%c(f)',
		'37': '%c(#999)',
		'39': '%c(0)',
		'90': '%c(9)',
		'91': '%c(2)',
		'92': '%c(3)',
		'93': '%c(4)',
		'94': '%c(5)',
		'95': '%c(6)',
		'96': '%c(7)',
		'97': '%c(8)',
		'99': '%c(0)',
		'trueBlack': '%c(1)'
	},
	
	ANSI_map: function(t, trueBlack) {
		// transform simple ANSI SGR codes to internal markup
		var tg=Terminal.prototype.globals;
		tg.ANSI_regexp.lastIndex=0;
		return t.replace(
			tg.ANSI_regexp,
			function (str, p1, p2, p3, offset, s) {
				return tg.ANSI_replace(p2, p3, trueBlack);
			}
		);
	},
	
	ANSI_replace: function(p, cmd, trueBlack) {
		var tg=Terminal.prototype.globals;
		if (cmd=='m') {
			if (p=='') {
				return tg.ANIS_SGR_codes[0];
			}
			else if (trueBlack && p=='30') {
				return tg.ANIS_SGR_codes.trueBlack;
			}
			else if (tg.ANIS_SGR_codes[p]) {
				return tg.ANIS_SGR_codes[p];
			}
		}
		return '';
	},


	// basic DHTML dynamics and browser abstraction

	writeElement: function(e,t) {
		if (document.getElementById) {
			var obj=document.getElementById(e);
			obj.innerHTML=t;
		}
		else if (document.all) {
			document.all[e].innerHTML=t;
		}
	},

	setElementXY: function(d,x,y) {
		if (document.getElementById) {
			var obj=document.getElementById(d);
			obj.style.left=x+'px';
			obj.style.top=y+'px';
		}
		else if (document.all) {
			document.all[d].style.left=x+'px';
			document.all[d].style.top=y+'px';
		}
	},

	setVisible: function(d,v) {
		if (document.getElementById) {
			var obj=document.getElementById(d);
			obj.style.visibility= (v)? 'visible':'hidden';
		}
		else if (document.all) {
			document.all[d].style.visibility= (v)? 'visible':'hidden';
		}
	},

	setDisplay: function(d,v) {
		if (document.getElementById) {
			var obj=document.getElementById(d);
			obj.style.display=v;
		}
		else if (document.all) {
			document.all[d].style.display=v;
		}
	},

	guiElementsReady: function(e) {
		if (document.getElementById) {
			return (document.getElementById(e))? true:false;
		}
		else if (document.all) {
			return (document.all[e])? true:false;
		}
		else {
			return false;
		}
	},


	// constructor mods (MSIE fixes)

	_termString_makeKeyref: function() {
		var tg=Terminal.prototype.globals;
		var termString_keyref= tg.termString_keyref= new Array();
		var termString_keycoderef= tg.termString_keycoderef= new Array();
		var hex= new Array('A','B','C','D','E','F');
		for (var i=0; i<=15; i++) {
			var high=(i<10)? i:hex[i-10];
			for (var k=0; k<=15; k++) {
				var low=(k<10)? k:hex[k-10];
				var cc=i*16+k;
				if (cc>=32) {
					var cs=unescape("%"+high+low);
					termString_keyref[cc]=cs;
					termString_keycoderef[cs]=cc;
				}
			}
		}
	},

	_extendMissingStringMethods: function() {
		if (!String.fromCharCode || !String.prototype.charCodeAt) {
			Terminal.prototype.globals._termString_makeKeyref();
		}
		if (!String.fromCharCode) {
			String.fromCharCode=function(cc) {
				return (cc!=null)? Terminal.prototype.globals.termString_keyref[cc] : '';
			};
		}
		if (!String.prototype.charCodeAt) {
			String.prototype.charCodeAt=function(n) {
				cs=this.charAt(n);
				return (Terminal.prototype.globals.termString_keycoderef[cs])?
					Terminal.prototype.globals.termString_keycoderef[cs] : 0;
			};
		}
	}

	// end of Terminal.prototype.globals
}

// end of Terminal.prototype
}

// initialize global data
Terminal.prototype.globals._initGlobals();

// global entities for backward compatibility with termlib 1.x applications
var TerminalDefaults = Terminal.prototype.Defaults;
var termDefaultHandler = Terminal.prototype.defaultHandler;
var TermGlobals = Terminal.prototype.globals;
var termKey = Terminal.prototype.globals.termKey;
var termDomKeyRef = Terminal.prototype.globals.termDomKeyRef;


/*
  === termlib.js Socket Extension v.1.02 ===

  (c) Norbert Landsteiner 2003-2007
  mass:werk - media environments
  <http://www.masswerk.at>

# Synopsis:
  Integrates async XMLHttpRequests (AJAX/JSON) tightly into termlib.js

# Example:

  myTerm = new Terminal( { handler: myTermHandler } );
  myTerm.open();

  function myTermHandler() {
    this.newLine();
    if (this.lineBuffer == 'get file') {
       myTerm.send(
         {
           url: 'myservice',
           data: {
               book: 'theBook',
               chapter: 7,
               page: 45
             },
           callback: myCallback
          }
       );
       return;
    }
    else {
       // ...
    }
    this.prompt();
  }

  function myCallback() {
  	if (this.socket.success) {
  		this.write(this.socket.responseText);
  	}
  	else {
  		this.write('OOPS: ' + this.socket.status + ' ' + this.socket.statusText);
  		if (this.socket.errno) {
  			this.newLine();
  			this.write('Error: ' + this.socket.errstring);
  		}
  	}
  	this.prompt();
  }


# Documentation:

  for usage and description see readme.txt chapter 13:
  <http://www.masswerk.at/termlib/readme.txt>

  or refer to the sample page:
  <http://www.masswerk.at/termlib/sample_socket.html>

*/
  
Terminal.prototype._HttpSocket = function() {
	var req=null;
	if (window.XMLHttpRequest) {
		try {
			req=new XMLHttpRequest();
		}
		catch(e) {}
	}
	else if (window.ActiveXObject) {
		var prtcls=this._msXMLHttpObjects;
		for (var i=0; i<prtcls.length; i++) {
			try {
				req=new ActiveXObject(prtcls[i]);
				if (req) {
					// shorten proto list to working element
					if (prtcls.length>1) this.prototype._msXMLHttpObjects= [ prtcls[i] ];
					break;
				}
			}
			catch(e) {}
		}
	}
	this.request=req;
	this.url;
	this.data=null;
	this.query='';
	this.timeoutTimer=null;
	this.localMode=Boolean(window.location.href.search(/^file:/i)==0);
	this.error=0;
}

Terminal.prototype._HttpSocket.prototype = {
	version: '1.02',
	// config
	useXMLEncoding: false, // use ";" as separator if true, "&" else
	defaulTimeout: 10000,  // request timeout in ticks (milliseconds)
	defaultMethod: 'GET',
	forceNewline: true,    // translate line-breaks in responseText to newlines
	
	// static const
	errno: {
		OK: 0,
		NOTIMPLEMENTED: 1,
		FATALERROR: 2,
		TIMEOUT: 3,
		NETWORKERROR: 4,
		LOCALFILEERROR: 5
	},
	errstring: [
		'',
		'XMLHttpRequest not implemented.',
		'Could not open XMLHttpRequest.',
		'The connection timed out.',
		'Network error.',
		'The requested local document was not found.'
	],
	
	// private static data
	_msXMLHttpObjects: [
		'Msxml2.XMLHTTP',
		'Microsoft.XMLHTTP',
		'Msxml2.XMLHTTP.5.0',
		'Msxml2.XMLHTTP.4.0',
		'Msxml2.XMLHTTP.3.0'
	],
	
	// internal methods
	serializeData: function() {
		this.query=this.serialize(this.data);
	},
	serialize: function(data) {
		var v='';
		if( data != null ) {
			switch (typeof data) {
				case 'object':
					var d=[];
					if (data instanceof Array) {
						// array
						for (var i=0; i<data.length; i++) {
							d.push(this.serialize(data[i]));
						}
						v= d.join(',');
						break;
					}
					for (var i in data) {
						switch (typeof data[i]) {
							case 'object':
								d.push(encodeURIComponent(i)+'='+this.serialize(data[i]));
								break;
							default:
								d.push(encodeURIComponent(i)+'='+encodeURIComponent(data[i]));
								break;
						}
					}
					v= (this.useXMLEncoding)? d.join(';') : d.join('&');
					break;
				case 'number':
					v=String(data);
					break;
				case 'string':
					v=encodeURIComponent(data);
					break;
				case 'boolean':
					v=(data)? '1':'0';
					break;
			}
		}
		return v;
	},
	toCamelCase: function(s) {
		if (typeof s!='string') s=String(s);
		var a=s.toLowerCase().split('-');
		var cc=a[0];
		for (var i=1; i<a.length; i++) {
			p=a[i];
			if (p.length) cc+=p.charAt(0).toUpperCase()+p.substring(1);
		}
		return cc;
	},
	callbackHandler: function() {
		if (this.termRef.closed) return;
		var r=this.request;
		if (this.error==0 && r.readyState!=4) return;
		if (this.timeoutTimer) {
			clearTimeout (this.timeoutTimer);
			this.timeoutTimer = null;
		}
		var success=false;
		var failed=true;
		var response={
			headers: {},
			ErrorCodes: this.errno
		};
		if (this.localMode) {
			if (this.error && this.error<this.errno.NETWORKERROR) {
				response.status=0;
				response.statusText='Connection Error';
				response.responseText='';
				response.responseXML=null;
			}
			else if (this.error || r.responseText==null) {
				failed=false;
				response.status=404;
				response.statusText='Not Found';
				response.responseText='The document '+this.url+' was not found on this file system.';
				response.responseXML=null;
				this.error=this.errno.LOCALFILEERROR;
			}
			else {
				success=true;
				failed=false;
				response.status=200;
				response.statusText='OK';
				response.responseText=r.responseText;
				response.responseXML=r.responseXML;
			}
		}
		else {
			try {
				if (!this.error) {
					if (typeof r == 'object' && r.status != undefined)  {
						failed=false;
						if (r.status >= 200 && r.status < 300) {
							success=true;
						}
						else if (r.status >= 12000) {
							// MSIE network error
							failed=true;
							this.error=this.errno.NETWORKERROR;
						}
					}
				}
			}
			catch(e) {}
			if (!failed) {
				response.status=r.status;
				response.statusText= (r.status==404)? 'Not Found':r.statusText; // force correct header
				response.responseText=r.responseText;
				response.responseXML=r.responseXML;
				if (this.getHeaders) {
					if (this.getHeaders instanceof Array) {
						for (var i=0; i<this.getHeaders.length; i++) {
							var h=this.getHeaders[i];
							try {
								response.headers[this.toCamelCase(h)]=r.getResponseHeader(h);
							}
							catch(e) {}
						}
					}
					else {
						for (var h in this.getHeaders) {
							try {
								response.headers[this.toCamelCase(h)]=r.getResponseHeader(h);
							}
							catch(e) {}
						}
					}
				}
			}
			else {
				response.status=0;
				response.statusText='Connection Error';
				response.responseText='';
				response.responseXML=null;
			}
		}
		if (this.forceNewline) response.responseText=response.responseText.replace(/\r\n?/g, '\n');
		response.url=this.url;
		response.data=this.data;
		response.query=this.query;
		response.method=this.method;
		response.success=success;
		response.errno=this.error;
		response.errstring=this.errstring[this.error];
		var term=this.termRef;
		term.socket=response;
		if (this.callback) {
			if (typeof this.callback=='function') {
				this.callback.apply(term);
			}
			else if (window[this.callback] && typeof window[this.callback]=='function') {
				window[this.callback].apply(term);
			}
			else {
				term._defaultServerCallback();
			}
		}
		else {
			term._defaultServerCallback();
		}
		delete term.socket;
		this.request=null;
		this.callback=null;
	},
	timeoutHandler: function() {
		this.error = this.errno.TIMEOUT;
		try {
			this.request.abort();
		}
		catch(e) {}
		if (!this.localMode) this.callbackHandler();
	}
}

Terminal.prototype.send = function( opts ) {
	var soc = new this._HttpSocket();
	if (opts) {
		if (typeof opts.method == 'string') {
			switch (opts.method.toLowerCase()) {
				case 'post':
					soc.method='POST'; break;
				case 'get':
					soc.method='GET'; break;
				default:
					soc.method=soc.defaultMethod.toUpperCase();
			}
		}
		else {
			soc.method=soc.defaultMethod;
		}
		if (opts.postbody != undefined) {
			soc.method='POST';
			soc.query=opts.postbody;
			soc.data=opts.data;
		}
		else if (opts.data != undefined) {
			soc.data=opts.data;
			soc.serializeData();
		}
		if (opts.url) soc.url=opts.url;
		if (opts.getHeaders && typeof opts.getHeaders=='object') {
			soc.getHeaders=opts.getHeaders;
		}
	}
	else {
		opts = {}
		soc.method=soc.defaultMethod;
	}
	var uri=soc.url;
	if (soc.method=='GET') {
		if (soc.query) {
			uri+= (uri.indexOf('?')<0)?
				'?'+soc.query :
				(soc.useXMLEncoding)? ';'+soc.query : '&'+soc.query;
		}
		if (!soc.localMode) {
			// add a random value to the query string (force a request)
			var uniqueparam= '_termlib_reqid=' +new Date().getTime()+'_'+Math.floor(Math.random()*100000);
			uri+= (uri.indexOf('?')<0)?
				'?'+uniqueparam :
				(soc.useXMLEncoding)? ';'+uniqueparam : '&'+uniqueparam;
		}
	}
	soc.callback=opts.callback;
	soc.termRef=this;
	if (!soc.request) {
		soc.error = soc.errno.NOTIMPLEMENTED;
		soc.callbackHandler();
		return;
	}
	else {
		try {
			if (opts.userid!=undefined) {
				if (opts.password!=undefined) {
					soc.request.open(soc.method, uri, true, opts.userid, opts.password);
				}
				else {
					soc.request.open(soc.method, uri, true, opts.userid);
				}
			}
			else {
				soc.request.open(soc.method, uri, true);
			}
		}
		catch(e) {
			soc.error = soc.errno.FATALERROR;
			soc.callbackHandler();
			return;
		}
		var body=null;
		if (soc.method == 'POST') {
			try {
				soc.request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			}
			catch(e) {}
			body=soc.query;
		}
		if (opts.headers && typeof opts.headers == 'objects') {
			for (var i in opts.headers) {
				try {
					soc.request.setRequestHeader(i, opts.headers[i]);
				}
				catch(e) {}
			}
		}
		if (opts.mimetype && soc.request.overrideMimeType) {
			try {
				soc.request.overrideMimeType(opts.mimetype);
				// force "Connection: close" (Bugzilla #246651)
				soc.request.setRequestHeader('Connection', 'close');
			}
			catch(e) {}
		}
		
		var timeoutDelay=(opts.timeout && typeof opts.timeout=='number')? opts.tiomeout : soc.defaulTimeout;
		
		soc.request.onreadystatechange=function() { soc.callbackHandler(); };
		try {
			soc.request.send(body);
		}
		catch(e) {
			if (soc.localMode) {
				soc.request.onreadystatechange=null;
				soc.request.abort();
				soc.error = soc.errno.LOCALFILEERROR;
			}
			else {
				soc.request.onreadystatechange=null;
				try {
					soc.request.abort();
				}
				catch(e2) {}
				soc.error = soc.errno.NETWORKERROR;
			}
			soc.callbackHandler();
			return true;
		}
		soc.timeoutTimer = setTimeout(function() { soc.timeoutHandler() }, timeoutDelay);
	}
}
Terminal.prototype._defaultServerCallback = function() {
	if (this.socket.success) {
		// output im more-mode
		this.write('Server Response:%n'+this.socket.responseText, true);
	}
	else {
		var s='Request failed: '+this.socket.status+' '+this.socket.statusText;
		if (this.socket.errno) s+='%n'+this.socket.errstring;
		this.write(s);
		this.prompt();
	}
}


// eof
// end include: /home/david/dev/ws/emcurses/emscripten/termlib.js


// Sometimes an existing Module object exists with properties
// meant to overwrite the default module functionality. Here
// we collect those properties and reapply _after_ we configure
// the current environment's defaults to avoid having to be so
// defensive during initialization.
var moduleOverrides = Object.assign({}, Module);

var arguments_ = [];
var thisProgram = './this.program';
var quit_ = (status, toThrow) => {
  throw toThrow;
};

// `/` should be present at the end if `scriptDirectory` is not empty
var scriptDirectory = '';
function locateFile(path) {
  if (Module['locateFile']) {
    return Module['locateFile'](path, scriptDirectory);
  }
  return scriptDirectory + path;
}

// Hooks that are implemented differently in different runtime environments.
var readAsync, readBinary;

if (ENVIRONMENT_IS_NODE) {
  if (typeof process == 'undefined' || !process.release || process.release.name !== 'node') throw new Error('not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)');

  var nodeVersion = process.versions.node;
  var numericVersion = nodeVersion.split('.').slice(0, 3);
  numericVersion = (numericVersion[0] * 10000) + (numericVersion[1] * 100) + (numericVersion[2].split('-')[0] * 1);
  var minVersion = 160000;
  if (numericVersion < 160000) {
    throw new Error('This emscripten-generated code requires node v16.0.0 (detected v' + nodeVersion + ')');
  }

  // These modules will usually be used on Node.js. Load them eagerly to avoid
  // the complexity of lazy-loading.
  var fs = require('fs');
  var nodePath = require('path');

  scriptDirectory = __dirname + '/';

// include: node_shell_read.js
readBinary = (filename) => {
  // We need to re-wrap `file://` strings to URLs. Normalizing isn't
  // necessary in that case, the path should already be absolute.
  filename = isFileURI(filename) ? new URL(filename) : nodePath.normalize(filename);
  var ret = fs.readFileSync(filename);
  assert(ret.buffer);
  return ret;
};

readAsync = (filename, binary = true) => {
  // See the comment in the `readBinary` function.
  filename = isFileURI(filename) ? new URL(filename) : nodePath.normalize(filename);
  return new Promise((resolve, reject) => {
    fs.readFile(filename, binary ? undefined : 'utf8', (err, data) => {
      if (err) reject(err);
      else resolve(binary ? data.buffer : data);
    });
  });
};
// end include: node_shell_read.js
  if (!Module['thisProgram'] && process.argv.length > 1) {
    thisProgram = process.argv[1].replace(/\\/g, '/');
  }

  arguments_ = process.argv.slice(2);

  if (typeof module != 'undefined') {
    module['exports'] = Module;
  }

  process.on('uncaughtException', (ex) => {
    // suppress ExitStatus exceptions from showing an error
    if (ex !== 'unwind' && !(ex instanceof ExitStatus) && !(ex.context instanceof ExitStatus)) {
      throw ex;
    }
  });

  quit_ = (status, toThrow) => {
    process.exitCode = status;
    throw toThrow;
  };

} else
if (ENVIRONMENT_IS_SHELL) {

  if ((typeof process == 'object' && typeof require === 'function') || typeof window == 'object' || typeof importScripts == 'function') throw new Error('not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)');

} else

// Note that this includes Node.js workers when relevant (pthreads is enabled).
// Node.js workers are detected as a combination of ENVIRONMENT_IS_WORKER and
// ENVIRONMENT_IS_NODE.
if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  if (ENVIRONMENT_IS_WORKER) { // Check worker, not web, since window could be polyfilled
    scriptDirectory = self.location.href;
  } else if (typeof document != 'undefined' && document.currentScript) { // web
    scriptDirectory = document.currentScript.src;
  }
  // blob urls look like blob:http://site.com/etc/etc and we cannot infer anything from them.
  // otherwise, slice off the final part of the url to find the script directory.
  // if scriptDirectory does not contain a slash, lastIndexOf will return -1,
  // and scriptDirectory will correctly be replaced with an empty string.
  // If scriptDirectory contains a query (starting with ?) or a fragment (starting with #),
  // they are removed because they could contain a slash.
  if (scriptDirectory.startsWith('blob:')) {
    scriptDirectory = '';
  } else {
    scriptDirectory = scriptDirectory.substr(0, scriptDirectory.replace(/[?#].*/, '').lastIndexOf('/')+1);
  }

  if (!(typeof window == 'object' || typeof importScripts == 'function')) throw new Error('not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)');

  {
// include: web_or_worker_shell_read.js
if (ENVIRONMENT_IS_WORKER) {
    readBinary = (url) => {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, false);
      xhr.responseType = 'arraybuffer';
      xhr.send(null);
      return new Uint8Array(/** @type{!ArrayBuffer} */(xhr.response));
    };
  }

  readAsync = (url) => {
    // Fetch has some additional restrictions over XHR, like it can't be used on a file:// url.
    // See https://github.com/github/fetch/pull/92#issuecomment-140665932
    // Cordova or Electron apps are typically loaded from a file:// url.
    // So use XHR on webview if URL is a file URL.
    if (isFileURI(url)) {
      return new Promise((reject, resolve) => {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = () => {
          if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
            resolve(xhr.response);
          }
          reject(xhr.status);
        };
        xhr.onerror = reject;
        xhr.send(null);
      });
    }
    return fetch(url, { credentials: 'same-origin' })
      .then((response) => {
        if (response.ok) {
          return response.arrayBuffer();
        }
        return Promise.reject(new Error(response.status + ' : ' + response.url));
      })
  };
// end include: web_or_worker_shell_read.js
  }
} else
{
  throw new Error('environment detection error');
}

var out = Module['print'] || console.log.bind(console);
var err = Module['printErr'] || console.error.bind(console);

// Merge back in the overrides
Object.assign(Module, moduleOverrides);
// Free the object hierarchy contained in the overrides, this lets the GC
// reclaim data used.
moduleOverrides = null;
checkIncomingModuleAPI();

// Emit code to handle expected values on the Module object. This applies Module.x
// to the proper local x. This has two benefits: first, we only emit it if it is
// expected to arrive, and second, by using a local everywhere else that can be
// minified.

if (Module['arguments']) arguments_ = Module['arguments'];legacyModuleProp('arguments', 'arguments_');

if (Module['thisProgram']) thisProgram = Module['thisProgram'];legacyModuleProp('thisProgram', 'thisProgram');

if (Module['quit']) quit_ = Module['quit'];legacyModuleProp('quit', 'quit_');

// perform assertions in shell.js after we set up out() and err(), as otherwise if an assertion fails it cannot print the message
// Assertions on removed incoming Module JS APIs.
assert(typeof Module['memoryInitializerPrefixURL'] == 'undefined', 'Module.memoryInitializerPrefixURL option was removed, use Module.locateFile instead');
assert(typeof Module['pthreadMainPrefixURL'] == 'undefined', 'Module.pthreadMainPrefixURL option was removed, use Module.locateFile instead');
assert(typeof Module['cdInitializerPrefixURL'] == 'undefined', 'Module.cdInitializerPrefixURL option was removed, use Module.locateFile instead');
assert(typeof Module['filePackagePrefixURL'] == 'undefined', 'Module.filePackagePrefixURL option was removed, use Module.locateFile instead');
assert(typeof Module['read'] == 'undefined', 'Module.read option was removed');
assert(typeof Module['readAsync'] == 'undefined', 'Module.readAsync option was removed (modify readAsync in JS)');
assert(typeof Module['readBinary'] == 'undefined', 'Module.readBinary option was removed (modify readBinary in JS)');
assert(typeof Module['setWindowTitle'] == 'undefined', 'Module.setWindowTitle option was removed (modify emscripten_set_window_title in JS)');
assert(typeof Module['TOTAL_MEMORY'] == 'undefined', 'Module.TOTAL_MEMORY has been renamed Module.INITIAL_MEMORY');
legacyModuleProp('asm', 'wasmExports');
legacyModuleProp('readAsync', 'readAsync');
legacyModuleProp('readBinary', 'readBinary');
legacyModuleProp('setWindowTitle', 'setWindowTitle');
var IDBFS = 'IDBFS is no longer included by default; build with -lidbfs.js';
var PROXYFS = 'PROXYFS is no longer included by default; build with -lproxyfs.js';
var WORKERFS = 'WORKERFS is no longer included by default; build with -lworkerfs.js';
var FETCHFS = 'FETCHFS is no longer included by default; build with -lfetchfs.js';
var ICASEFS = 'ICASEFS is no longer included by default; build with -licasefs.js';
var JSFILEFS = 'JSFILEFS is no longer included by default; build with -ljsfilefs.js';
var OPFS = 'OPFS is no longer included by default; build with -lopfs.js';

var NODEFS = 'NODEFS is no longer included by default; build with -lnodefs.js';

assert(!ENVIRONMENT_IS_SHELL, 'shell environment detected but not enabled at build time.  Add `shell` to `-sENVIRONMENT` to enable.');

// end include: shell.js

// include: preamble.js
// === Preamble library stuff ===

// Documentation for the public APIs defined in this file must be updated in:
//    site/source/docs/api_reference/preamble.js.rst
// A prebuilt local version of the documentation is available at:
//    site/build/text/docs/api_reference/preamble.js.txt
// You can also build docs locally as HTML or other formats in site/
// An online HTML version (which may be of a different version of Emscripten)
//    is up at http://kripken.github.io/emscripten-site/docs/api_reference/preamble.js.html

var wasmBinary; 
if (Module['wasmBinary']) wasmBinary = Module['wasmBinary'];legacyModuleProp('wasmBinary', 'wasmBinary');

if (typeof WebAssembly != 'object') {
  err('no native wasm support detected');
}

// Wasm globals

var wasmMemory;

//========================================
// Runtime essentials
//========================================

// whether we are quitting the application. no code should run after this.
// set in exit() and abort()
var ABORT = false;

// set by exit() and abort().  Passed to 'onExit' handler.
// NOTE: This is also used as the process return code code in shell environments
// but only when noExitRuntime is false.
var EXITSTATUS;

// In STRICT mode, we only define assert() when ASSERTIONS is set.  i.e. we
// don't define it at all in release modes.  This matches the behaviour of
// MINIMAL_RUNTIME.
// TODO(sbc): Make this the default even without STRICT enabled.
/** @type {function(*, string=)} */
function assert(condition, text) {
  if (!condition) {
    abort('Assertion failed' + (text ? ': ' + text : ''));
  }
}

// We used to include malloc/free by default in the past. Show a helpful error in
// builds with assertions.

// Memory management

var HEAP,
/** @type {!Int8Array} */
  HEAP8,
/** @type {!Uint8Array} */
  HEAPU8,
/** @type {!Int16Array} */
  HEAP16,
/** @type {!Uint16Array} */
  HEAPU16,
/** @type {!Int32Array} */
  HEAP32,
/** @type {!Uint32Array} */
  HEAPU32,
/** @type {!Float32Array} */
  HEAPF32,
/** @type {!Float64Array} */
  HEAPF64;

// include: runtime_shared.js
function updateMemoryViews() {
  var b = wasmMemory.buffer;
  Module['HEAP8'] = HEAP8 = new Int8Array(b);
  Module['HEAP16'] = HEAP16 = new Int16Array(b);
  Module['HEAPU8'] = HEAPU8 = new Uint8Array(b);
  Module['HEAPU16'] = HEAPU16 = new Uint16Array(b);
  Module['HEAP32'] = HEAP32 = new Int32Array(b);
  Module['HEAPU32'] = HEAPU32 = new Uint32Array(b);
  Module['HEAPF32'] = HEAPF32 = new Float32Array(b);
  Module['HEAPF64'] = HEAPF64 = new Float64Array(b);
}
// end include: runtime_shared.js
assert(!Module['STACK_SIZE'], 'STACK_SIZE can no longer be set at runtime.  Use -sSTACK_SIZE at link time')

assert(typeof Int32Array != 'undefined' && typeof Float64Array !== 'undefined' && Int32Array.prototype.subarray != undefined && Int32Array.prototype.set != undefined,
       'JS engine does not provide full typed array support');

// If memory is defined in wasm, the user can't provide it, or set INITIAL_MEMORY
assert(!Module['wasmMemory'], 'Use of `wasmMemory` detected.  Use -sIMPORTED_MEMORY to define wasmMemory externally');
assert(!Module['INITIAL_MEMORY'], 'Detected runtime INITIAL_MEMORY setting.  Use -sIMPORTED_MEMORY to define wasmMemory dynamically');

// include: runtime_stack_check.js
// Initializes the stack cookie. Called at the startup of main and at the startup of each thread in pthreads mode.
function writeStackCookie() {
  var max = _emscripten_stack_get_end();
  assert((max & 3) == 0);
  // If the stack ends at address zero we write our cookies 4 bytes into the
  // stack.  This prevents interference with SAFE_HEAP and ASAN which also
  // monitor writes to address zero.
  if (max == 0) {
    max += 4;
  }
  // The stack grow downwards towards _emscripten_stack_get_end.
  // We write cookies to the final two words in the stack and detect if they are
  // ever overwritten.
  HEAPU32[((max)>>2)] = 0x02135467;
  HEAPU32[(((max)+(4))>>2)] = 0x89BACDFE;
  // Also test the global address 0 for integrity.
  HEAPU32[((0)>>2)] = 1668509029;
}

function checkStackCookie() {
  if (ABORT) return;
  var max = _emscripten_stack_get_end();
  // See writeStackCookie().
  if (max == 0) {
    max += 4;
  }
  var cookie1 = HEAPU32[((max)>>2)];
  var cookie2 = HEAPU32[(((max)+(4))>>2)];
  if (cookie1 != 0x02135467 || cookie2 != 0x89BACDFE) {
    abort(`Stack overflow! Stack cookie has been overwritten at ${ptrToString(max)}, expected hex dwords 0x89BACDFE and 0x2135467, but received ${ptrToString(cookie2)} ${ptrToString(cookie1)}`);
  }
  // Also test the global address 0 for integrity.
  if (HEAPU32[((0)>>2)] != 0x63736d65 /* 'emsc' */) {
    abort('Runtime error: The application has corrupted its heap memory area (address zero)!');
  }
}
// end include: runtime_stack_check.js
// include: runtime_assertions.js
// Endianness check
(function() {
  var h16 = new Int16Array(1);
  var h8 = new Int8Array(h16.buffer);
  h16[0] = 0x6373;
  if (h8[0] !== 0x73 || h8[1] !== 0x63) throw 'Runtime error: expected the system to be little-endian! (Run with -sSUPPORT_BIG_ENDIAN to bypass)';
})();

// end include: runtime_assertions.js
var __ATPRERUN__  = []; // functions called before the runtime is initialized
var __ATINIT__    = []; // functions called during startup
var __ATMAIN__    = []; // functions called when main() is to be run
var __ATEXIT__    = []; // functions called during shutdown
var __ATPOSTRUN__ = []; // functions called after the main() is called

var runtimeInitialized = false;

function preRun() {
  if (Module['preRun']) {
    if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']];
    while (Module['preRun'].length) {
      addOnPreRun(Module['preRun'].shift());
    }
  }
  callRuntimeCallbacks(__ATPRERUN__);
}

function initRuntime() {
  assert(!runtimeInitialized);
  runtimeInitialized = true;

  checkStackCookie();

  
if (!Module['noFSInit'] && !FS.init.initialized)
  FS.init();
FS.ignorePermissions = false;

TTY.init();
PIPEFS.root = FS.mount(PIPEFS, {}, null);
SOCKFS.root = FS.mount(SOCKFS, {}, null);
  callRuntimeCallbacks(__ATINIT__);
}

function preMain() {
  checkStackCookie();
  
  callRuntimeCallbacks(__ATMAIN__);
}

function postRun() {
  checkStackCookie();

  if (Module['postRun']) {
    if (typeof Module['postRun'] == 'function') Module['postRun'] = [Module['postRun']];
    while (Module['postRun'].length) {
      addOnPostRun(Module['postRun'].shift());
    }
  }

  callRuntimeCallbacks(__ATPOSTRUN__);
}

function addOnPreRun(cb) {
  __ATPRERUN__.unshift(cb);
}

function addOnInit(cb) {
  __ATINIT__.unshift(cb);
}

function addOnPreMain(cb) {
  __ATMAIN__.unshift(cb);
}

function addOnExit(cb) {
}

function addOnPostRun(cb) {
  __ATPOSTRUN__.unshift(cb);
}

// include: runtime_math.js
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/imul

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/fround

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/clz32

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/trunc

assert(Math.imul, 'This browser does not support Math.imul(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill');
assert(Math.fround, 'This browser does not support Math.fround(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill');
assert(Math.clz32, 'This browser does not support Math.clz32(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill');
assert(Math.trunc, 'This browser does not support Math.trunc(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill');
// end include: runtime_math.js
// A counter of dependencies for calling run(). If we need to
// do asynchronous work before running, increment this and
// decrement it. Incrementing must happen in a place like
// Module.preRun (used by emcc to add file preloading).
// Note that you can add dependencies in preRun, even though
// it happens right before run - run will be postponed until
// the dependencies are met.
var runDependencies = 0;
var runDependencyWatcher = null;
var dependenciesFulfilled = null; // overridden to take different actions when all run dependencies are fulfilled
var runDependencyTracking = {};

function getUniqueRunDependency(id) {
  var orig = id;
  while (1) {
    if (!runDependencyTracking[id]) return id;
    id = orig + Math.random();
  }
}

function addRunDependency(id) {
  runDependencies++;

  Module['monitorRunDependencies']?.(runDependencies);

  if (id) {
    assert(!runDependencyTracking[id]);
    runDependencyTracking[id] = 1;
    if (runDependencyWatcher === null && typeof setInterval != 'undefined') {
      // Check for missing dependencies every few seconds
      runDependencyWatcher = setInterval(() => {
        if (ABORT) {
          clearInterval(runDependencyWatcher);
          runDependencyWatcher = null;
          return;
        }
        var shown = false;
        for (var dep in runDependencyTracking) {
          if (!shown) {
            shown = true;
            err('still waiting on run dependencies:');
          }
          err(`dependency: ${dep}`);
        }
        if (shown) {
          err('(end of list)');
        }
      }, 10000);
    }
  } else {
    err('warning: run dependency added without ID');
  }
}

function removeRunDependency(id) {
  runDependencies--;

  Module['monitorRunDependencies']?.(runDependencies);

  if (id) {
    assert(runDependencyTracking[id]);
    delete runDependencyTracking[id];
  } else {
    err('warning: run dependency removed without ID');
  }
  if (runDependencies == 0) {
    if (runDependencyWatcher !== null) {
      clearInterval(runDependencyWatcher);
      runDependencyWatcher = null;
    }
    if (dependenciesFulfilled) {
      var callback = dependenciesFulfilled;
      dependenciesFulfilled = null;
      callback(); // can add another dependenciesFulfilled
    }
  }
}

/** @param {string|number=} what */
function abort(what) {
  Module['onAbort']?.(what);

  what = 'Aborted(' + what + ')';
  // TODO(sbc): Should we remove printing and leave it up to whoever
  // catches the exception?
  err(what);

  ABORT = true;
  EXITSTATUS = 1;

  if (what.indexOf('RuntimeError: unreachable') >= 0) {
    what += '. "unreachable" may be due to ASYNCIFY_STACK_SIZE not being large enough (try increasing it)';
  }

  // Use a wasm runtime error, because a JS error might be seen as a foreign
  // exception, which means we'd run destructors on it. We need the error to
  // simply make the program stop.
  // FIXME This approach does not work in Wasm EH because it currently does not assume
  // all RuntimeErrors are from traps; it decides whether a RuntimeError is from
  // a trap or not based on a hidden field within the object. So at the moment
  // we don't have a way of throwing a wasm trap from JS. TODO Make a JS API that
  // allows this in the wasm spec.

  // Suppress closure compiler warning here. Closure compiler's builtin extern
  // definition for WebAssembly.RuntimeError claims it takes no arguments even
  // though it can.
  // TODO(https://github.com/google/closure-compiler/pull/3913): Remove if/when upstream closure gets fixed.
  /** @suppress {checkTypes} */
  var e = new WebAssembly.RuntimeError(what);

  // Throw the error whether or not MODULARIZE is set because abort is used
  // in code paths apart from instantiation where an exception is expected
  // to be thrown when abort is called.
  throw e;
}

// include: memoryprofiler.js
// end include: memoryprofiler.js
// include: URIUtils.js
// Prefix of data URIs emitted by SINGLE_FILE and related options.
var dataURIPrefix = 'data:application/octet-stream;base64,';

/**
 * Indicates whether filename is a base64 data URI.
 * @noinline
 */
var isDataURI = (filename) => filename.startsWith(dataURIPrefix);

/**
 * Indicates whether filename is delivered via file protocol (as opposed to http/https)
 * @noinline
 */
var isFileURI = (filename) => filename.startsWith('file://');
// end include: URIUtils.js
function createExportWrapper(name, nargs) {
  return (...args) => {
    assert(runtimeInitialized, `native function \`${name}\` called before runtime initialization`);
    var f = wasmExports[name];
    assert(f, `exported native function \`${name}\` not found`);
    // Only assert for too many arguments. Too few can be valid since the missing arguments will be zero filled.
    assert(args.length <= nargs, `native function \`${name}\` called with ${args.length} args but expects ${nargs}`);
    return f(...args);
  };
}

// include: runtime_exceptions.js
// end include: runtime_exceptions.js
function findWasmBinary() {
    var f = 'testcurs.wasm';
    if (!isDataURI(f)) {
      return locateFile(f);
    }
    return f;
}

var wasmBinaryFile;

function getBinarySync(file) {
  if (file == wasmBinaryFile && wasmBinary) {
    return new Uint8Array(wasmBinary);
  }
  if (readBinary) {
    return readBinary(file);
  }
  throw 'both async and sync fetching of the wasm failed';
}

function getBinaryPromise(binaryFile) {
  // If we don't have the binary yet, load it asynchronously using readAsync.
  if (!wasmBinary
      ) {
    // Fetch the binary using readAsync
    return readAsync(binaryFile).then(
      (response) => new Uint8Array(/** @type{!ArrayBuffer} */(response)),
      // Fall back to getBinarySync if readAsync fails
      () => getBinarySync(binaryFile)
    );
  }

  // Otherwise, getBinarySync should be able to get it synchronously
  return Promise.resolve().then(() => getBinarySync(binaryFile));
}

function instantiateArrayBuffer(binaryFile, imports, receiver) {
  return getBinaryPromise(binaryFile).then((binary) => {
    return WebAssembly.instantiate(binary, imports);
  }).then(receiver, (reason) => {
    err(`failed to asynchronously prepare wasm: ${reason}`);

    // Warn on some common problems.
    if (isFileURI(wasmBinaryFile)) {
      err(`warning: Loading from a file URI (${wasmBinaryFile}) is not supported in most browsers. See https://emscripten.org/docs/getting_started/FAQ.html#how-do-i-run-a-local-webserver-for-testing-why-does-my-program-stall-in-downloading-or-preparing`);
    }
    abort(reason);
  });
}

function instantiateAsync(binary, binaryFile, imports, callback) {
  if (!binary &&
      typeof WebAssembly.instantiateStreaming == 'function' &&
      !isDataURI(binaryFile) &&
      // Don't use streaming for file:// delivered objects in a webview, fetch them synchronously.
      !isFileURI(binaryFile) &&
      // Avoid instantiateStreaming() on Node.js environment for now, as while
      // Node.js v18.1.0 implements it, it does not have a full fetch()
      // implementation yet.
      //
      // Reference:
      //   https://github.com/emscripten-core/emscripten/pull/16917
      !ENVIRONMENT_IS_NODE &&
      typeof fetch == 'function') {
    return fetch(binaryFile, { credentials: 'same-origin' }).then((response) => {
      // Suppress closure warning here since the upstream definition for
      // instantiateStreaming only allows Promise<Repsponse> rather than
      // an actual Response.
      // TODO(https://github.com/google/closure-compiler/pull/3913): Remove if/when upstream closure is fixed.
      /** @suppress {checkTypes} */
      var result = WebAssembly.instantiateStreaming(response, imports);

      return result.then(
        callback,
        function(reason) {
          // We expect the most common failure cause to be a bad MIME type for the binary,
          // in which case falling back to ArrayBuffer instantiation should work.
          err(`wasm streaming compile failed: ${reason}`);
          err('falling back to ArrayBuffer instantiation');
          return instantiateArrayBuffer(binaryFile, imports, callback);
        });
    });
  }
  return instantiateArrayBuffer(binaryFile, imports, callback);
}

function getWasmImports() {
  // instrumenting imports is used in asyncify in two ways: to add assertions
  // that check for proper import use, and for ASYNCIFY=2 we use them to set up
  // the Promise API on the import side.
  Asyncify.instrumentWasmImports(wasmImports);
  // prepare imports
  return {
    'env': wasmImports,
    'wasi_snapshot_preview1': wasmImports,
  }
}

// Create the wasm instance.
// Receives the wasm imports, returns the exports.
function createWasm() {
  var info = getWasmImports();
  // Load the wasm module and create an instance of using native support in the JS engine.
  // handle a generated wasm instance, receiving its exports and
  // performing other necessary setup
  /** @param {WebAssembly.Module=} module*/
  function receiveInstance(instance, module) {
    wasmExports = instance.exports;

    wasmExports = Asyncify.instrumentWasmExports(wasmExports);

    

    wasmMemory = wasmExports['memory'];
    
    assert(wasmMemory, 'memory not found in wasm exports');
    updateMemoryViews();

    wasmTable = wasmExports['__indirect_function_table'];
    
    assert(wasmTable, 'table not found in wasm exports');

    addOnInit(wasmExports['__wasm_call_ctors']);

    removeRunDependency('wasm-instantiate');
    return wasmExports;
  }
  // wait for the pthread pool (if any)
  addRunDependency('wasm-instantiate');

  // Prefer streaming instantiation if available.
  // Async compilation can be confusing when an error on the page overwrites Module
  // (for example, if the order of elements is wrong, and the one defining Module is
  // later), so we save Module and check it later.
  var trueModule = Module;
  function receiveInstantiationResult(result) {
    // 'result' is a ResultObject object which has both the module and instance.
    // receiveInstance() will swap in the exports (to Module.asm) so they can be called
    assert(Module === trueModule, 'the Module object should not be replaced during async compilation - perhaps the order of HTML elements is wrong?');
    trueModule = null;
    // TODO: Due to Closure regression https://github.com/google/closure-compiler/issues/3193, the above line no longer optimizes out down to the following line.
    // When the regression is fixed, can restore the above PTHREADS-enabled path.
    receiveInstance(result['instance']);
  }

  // User shell pages can write their own Module.instantiateWasm = function(imports, successCallback) callback
  // to manually instantiate the Wasm module themselves. This allows pages to
  // run the instantiation parallel to any other async startup actions they are
  // performing.
  // Also pthreads and wasm workers initialize the wasm instance through this
  // path.
  if (Module['instantiateWasm']) {
    try {
      return Module['instantiateWasm'](info, receiveInstance);
    } catch(e) {
      err(`Module.instantiateWasm callback failed with error: ${e}`);
        return false;
    }
  }

  if (!wasmBinaryFile) wasmBinaryFile = findWasmBinary();

  instantiateAsync(wasmBinary, wasmBinaryFile, info, receiveInstantiationResult);
  return {}; // no exports yet; we'll fill them in later
}

// Globals used by JS i64 conversions (see makeSetValue)
var tempDouble;
var tempI64;

// include: runtime_debug.js
function legacyModuleProp(prop, newName, incoming=true) {
  if (!Object.getOwnPropertyDescriptor(Module, prop)) {
    Object.defineProperty(Module, prop, {
      configurable: true,
      get() {
        let extra = incoming ? ' (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)' : '';
        abort(`\`Module.${prop}\` has been replaced by \`${newName}\`` + extra);

      }
    });
  }
}

function ignoredModuleProp(prop) {
  if (Object.getOwnPropertyDescriptor(Module, prop)) {
    abort(`\`Module.${prop}\` was supplied but \`${prop}\` not included in INCOMING_MODULE_JS_API`);
  }
}

// forcing the filesystem exports a few things by default
function isExportedByForceFilesystem(name) {
  return name === 'FS_createPath' ||
         name === 'FS_createDataFile' ||
         name === 'FS_createPreloadedFile' ||
         name === 'FS_unlink' ||
         name === 'addRunDependency' ||
         // The old FS has some functionality that WasmFS lacks.
         name === 'FS_createLazyFile' ||
         name === 'FS_createDevice' ||
         name === 'removeRunDependency';
}

function missingGlobal(sym, msg) {
  if (typeof globalThis != 'undefined') {
    Object.defineProperty(globalThis, sym, {
      configurable: true,
      get() {
        warnOnce(`\`${sym}\` is not longer defined by emscripten. ${msg}`);
        return undefined;
      }
    });
  }
}

missingGlobal('buffer', 'Please use HEAP8.buffer or wasmMemory.buffer');
missingGlobal('asm', 'Please use wasmExports instead');

function missingLibrarySymbol(sym) {
  if (typeof globalThis != 'undefined' && !Object.getOwnPropertyDescriptor(globalThis, sym)) {
    Object.defineProperty(globalThis, sym, {
      configurable: true,
      get() {
        // Can't `abort()` here because it would break code that does runtime
        // checks.  e.g. `if (typeof SDL === 'undefined')`.
        var msg = `\`${sym}\` is a library symbol and not included by default; add it to your library.js __deps or to DEFAULT_LIBRARY_FUNCS_TO_INCLUDE on the command line`;
        // DEFAULT_LIBRARY_FUNCS_TO_INCLUDE requires the name as it appears in
        // library.js, which means $name for a JS name with no prefix, or name
        // for a JS name like _name.
        var librarySymbol = sym;
        if (!librarySymbol.startsWith('_')) {
          librarySymbol = '$' + sym;
        }
        msg += ` (e.g. -sDEFAULT_LIBRARY_FUNCS_TO_INCLUDE='${librarySymbol}')`;
        if (isExportedByForceFilesystem(sym)) {
          msg += '. Alternatively, forcing filesystem support (-sFORCE_FILESYSTEM) can export this for you';
        }
        warnOnce(msg);
        return undefined;
      }
    });
  }
  // Any symbol that is not included from the JS library is also (by definition)
  // not exported on the Module object.
  unexportedRuntimeSymbol(sym);
}

function unexportedRuntimeSymbol(sym) {
  if (!Object.getOwnPropertyDescriptor(Module, sym)) {
    Object.defineProperty(Module, sym, {
      configurable: true,
      get() {
        var msg = `'${sym}' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the Emscripten FAQ)`;
        if (isExportedByForceFilesystem(sym)) {
          msg += '. Alternatively, forcing filesystem support (-sFORCE_FILESYSTEM) can export this for you';
        }
        abort(msg);
      }
    });
  }
}

// Used by XXXXX_DEBUG settings to output debug messages.
function dbg(...args) {
  // TODO(sbc): Make this configurable somehow.  Its not always convenient for
  // logging to show up as warnings.
  console.warn(...args);
}
// end include: runtime_debug.js
// === Body ===

var ASM_CONSTS = {
  90732: ($0, $1) => { term.cursorSet($0, $1); },  
 90760: ($0, $1, $2, $3) => { term.setChar($0, $1, $2, $3); },  
 90794: () => { return term.crsrBlinkMode ? 0 : term.crsrBlockMode ? 1 : 2; },  
 90858: () => { return term.conf.rows; },  
 90885: () => { return term.conf.cols; },  
 90912: () => { return term.inputChar; },  
 90939: () => { var c = term.inputChar; term.inputChar = 0; return c; },  
 90997: () => { term.inputChar = 0 },  
 91016: () => { term.close() },  
 91029: () => { term = new Terminal({ termDiv: 'termDiv', handler: function() {}, x: 0, y: 0, initHandler: function() { term.charMode = true; term.lock = false; term.cursorOn(); } }); term.open(); },  
 91210: ($0, $1) => { term.resizeTo($0, $1); },  
 91237: ($0) => { term.handler = function() { Runtime.dynCall('v', $0); }; term.orig_resizeTo = term.orig_resizeTo || term.resizeTo; term.resizeTo = function(x,y) { var r = this.orig_resizeTo(x,y); if (r) Runtime.dynCall('v', $0); return r; }; },  
 91467: () => { throw 'SimulateInfiniteLoop' },  
 91496: ($0, $1) => { term.resizeTo($0, $1); },  
 91523: ($0) => { return stringToNewUTF8(TermGlobals.getColorString($0)); },  
 91583: ($0, $1) => { TermGlobals.setColor($0, UTF8ToString($1)); },  
 91631: () => { term.cursorOn() },  
 91647: () => { term.cursorOff() },  
 91664: () => { (function () { let started = false; if (!this.emcurses_beep) { this.emcurses_beep = { ctx: null, os: null, playing: false, queue: 0 }; } try { if (this.emcurses_beep.playing) { if (this.emcurses_beep.queue < 10) { this.emcurses_beep.queue += 1; } } else { this.emcurses_beep.ctx = new AudioContext(); os = this.emcurses_beep.os = this.emcurses_beep.ctx.createOscillator(); this.emcurses_beep.os.type = "sine"; this.emcurses_beep.os.frequency.value = 1000; this.emcurses_beep.os.connect( this.emcurses_beep.ctx.destination); this.emcurses_beep.os.start(); this.emcurses_beep.playing = started = true; function atend () { this.emcurses_beep.os.stop(); setTimeout(function () { if (this.emcurses_beep.queue > 0) { let started = false; try { this.emcurses_beep.queue -= 1; this.emcurses_beep.os = this.emcurses_beep.ctx.createOscillator(); this.emcurses_beep.os.type = "sine"; this.emcurses_beep.os.frequency.value = 1000; this.emcurses_beep.os.connect( this.emcurses_beep.ctx.destination); this.emcurses_beep.os.start(); started = true; setTimeout(atend, 200); } catch (e) { console.error(e); if (started) { this.emcurses_beep.os.stop(); this.emcurses_beep.ctx.close(); } this.emcurses_beep.ctx = null; this.emcurses_beep.os = null; this.emcurses_beep.playing = false; this.emcurses_beep.queue = 0; } } else { this.emcurses_beep.ctx.close(); this.emcurses_beep.ctx = null; this.emcurses_beep.os = null; this.emcurses_beep.playing = false; } }, 200); } setTimeout(atend, 200); } } catch (e) { console.error(e); if (started) { this.emcurses_beep.os.stop(); this.emcurses_beep.ctx.close(); } this.emcurses_beep.ctx = null; this.emcurses_beep.os = null; this.emcurses_beep.playing = false; this.emcurses_beep.queue = 0; } })() }
};

// end include: preamble.js


  /** @constructor */
  function ExitStatus(status) {
      this.name = 'ExitStatus';
      this.message = `Program terminated with exit(${status})`;
      this.status = status;
    }

  var callRuntimeCallbacks = (callbacks) => {
      while (callbacks.length > 0) {
        // Pass the module as the first argument.
        callbacks.shift()(Module);
      }
    };

  
    /**
     * @param {number} ptr
     * @param {string} type
     */
  function getValue(ptr, type = 'i8') {
    if (type.endsWith('*')) type = '*';
    switch (type) {
      case 'i1': return HEAP8[ptr];
      case 'i8': return HEAP8[ptr];
      case 'i16': return HEAP16[((ptr)>>1)];
      case 'i32': return HEAP32[((ptr)>>2)];
      case 'i64': abort('to do getValue(i64) use WASM_BIGINT');
      case 'float': return HEAPF32[((ptr)>>2)];
      case 'double': return HEAPF64[((ptr)>>3)];
      case '*': return HEAPU32[((ptr)>>2)];
      default: abort(`invalid type for getValue: ${type}`);
    }
  }

  var noExitRuntime = Module['noExitRuntime'] || true;

  var ptrToString = (ptr) => {
      assert(typeof ptr === 'number');
      // With CAN_ADDRESS_2GB or MEMORY64, pointers are already unsigned.
      ptr >>>= 0;
      return '0x' + ptr.toString(16).padStart(8, '0');
    };

  
    /**
     * @param {number} ptr
     * @param {number} value
     * @param {string} type
     */
  function setValue(ptr, value, type = 'i8') {
    if (type.endsWith('*')) type = '*';
    switch (type) {
      case 'i1': HEAP8[ptr] = value; break;
      case 'i8': HEAP8[ptr] = value; break;
      case 'i16': HEAP16[((ptr)>>1)] = value; break;
      case 'i32': HEAP32[((ptr)>>2)] = value; break;
      case 'i64': abort('to do setValue(i64) use WASM_BIGINT');
      case 'float': HEAPF32[((ptr)>>2)] = value; break;
      case 'double': HEAPF64[((ptr)>>3)] = value; break;
      case '*': HEAPU32[((ptr)>>2)] = value; break;
      default: abort(`invalid type for setValue: ${type}`);
    }
  }

  var stackRestore = (val) => __emscripten_stack_restore(val);

  var stackSave = () => _emscripten_stack_get_current();

  var warnOnce = (text) => {
      warnOnce.shown ||= {};
      if (!warnOnce.shown[text]) {
        warnOnce.shown[text] = 1;
        if (ENVIRONMENT_IS_NODE) text = 'warning: ' + text;
        err(text);
      }
    };

  var UTF8Decoder = typeof TextDecoder != 'undefined' ? new TextDecoder() : undefined;
  
    /**
     * Given a pointer 'idx' to a null-terminated UTF8-encoded string in the given
     * array that contains uint8 values, returns a copy of that string as a
     * Javascript String object.
     * heapOrArray is either a regular array, or a JavaScript typed array view.
     * @param {number} idx
     * @param {number=} maxBytesToRead
     * @return {string}
     */
  var UTF8ArrayToString = (heapOrArray, idx, maxBytesToRead) => {
      var endIdx = idx + maxBytesToRead;
      var endPtr = idx;
      // TextDecoder needs to know the byte length in advance, it doesn't stop on
      // null terminator by itself.  Also, use the length info to avoid running tiny
      // strings through TextDecoder, since .subarray() allocates garbage.
      // (As a tiny code save trick, compare endPtr against endIdx using a negation,
      // so that undefined means Infinity)
      while (heapOrArray[endPtr] && !(endPtr >= endIdx)) ++endPtr;
  
      if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
        return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr));
      }
      var str = '';
      // If building with TextDecoder, we have already computed the string length
      // above, so test loop end condition against that
      while (idx < endPtr) {
        // For UTF8 byte structure, see:
        // http://en.wikipedia.org/wiki/UTF-8#Description
        // https://www.ietf.org/rfc/rfc2279.txt
        // https://tools.ietf.org/html/rfc3629
        var u0 = heapOrArray[idx++];
        if (!(u0 & 0x80)) { str += String.fromCharCode(u0); continue; }
        var u1 = heapOrArray[idx++] & 63;
        if ((u0 & 0xE0) == 0xC0) { str += String.fromCharCode(((u0 & 31) << 6) | u1); continue; }
        var u2 = heapOrArray[idx++] & 63;
        if ((u0 & 0xF0) == 0xE0) {
          u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
        } else {
          if ((u0 & 0xF8) != 0xF0) warnOnce('Invalid UTF-8 leading byte ' + ptrToString(u0) + ' encountered when deserializing a UTF-8 string in wasm memory to a JS string!');
          u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (heapOrArray[idx++] & 63);
        }
  
        if (u0 < 0x10000) {
          str += String.fromCharCode(u0);
        } else {
          var ch = u0 - 0x10000;
          str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
        }
      }
      return str;
    };
  
    /**
     * Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the
     * emscripten HEAP, returns a copy of that string as a Javascript String object.
     *
     * @param {number} ptr
     * @param {number=} maxBytesToRead - An optional length that specifies the
     *   maximum number of bytes to read. You can omit this parameter to scan the
     *   string until the first 0 byte. If maxBytesToRead is passed, and the string
     *   at [ptr, ptr+maxBytesToReadr[ contains a null byte in the middle, then the
     *   string will cut short at that byte index (i.e. maxBytesToRead will not
     *   produce a string of exact length [ptr, ptr+maxBytesToRead[) N.B. mixing
     *   frequent uses of UTF8ToString() with and without maxBytesToRead may throw
     *   JS JIT optimizations off, so it is worth to consider consistently using one
     * @return {string}
     */
  var UTF8ToString = (ptr, maxBytesToRead) => {
      assert(typeof ptr == 'number', `UTF8ToString expects a number (got ${typeof ptr})`);
      return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : '';
    };
  var ___assert_fail = (condition, filename, line, func) => {
      abort(`Assertion failed: ${UTF8ToString(condition)}, at: ` + [filename ? UTF8ToString(filename) : 'unknown filename', line, func ? UTF8ToString(func) : 'unknown function']);
    };

  var ___call_sighandler = (fp, sig) => ((a1) => dynCall_vi(fp, a1))(sig);

  var __abort_js = () => {
      abort('native code called abort()');
    };

  var __emscripten_memcpy_js = (dest, src, num) => HEAPU8.copyWithin(dest, src, src + num);

  var __emscripten_runtime_keepalive_clear = () => {
      noExitRuntime = false;
      runtimeKeepaliveCounter = 0;
    };

  var timers = {
  };
  
  var handleException = (e) => {
      // Certain exception types we do not treat as errors since they are used for
      // internal control flow.
      // 1. ExitStatus, which is thrown by exit()
      // 2. "unwind", which is thrown by emscripten_unwind_to_js_event_loop() and others
      //    that wish to return to JS event loop.
      if (e instanceof ExitStatus || e == 'unwind') {
        return EXITSTATUS;
      }
      checkStackCookie();
      if (e instanceof WebAssembly.RuntimeError) {
        if (_emscripten_stack_get_current() <= 0) {
          err('Stack overflow detected.  You can try increasing -sSTACK_SIZE (currently set to 65536)');
        }
      }
      quit_(1, e);
    };
  
  
  var runtimeKeepaliveCounter = 0;
  var keepRuntimeAlive = () => noExitRuntime || runtimeKeepaliveCounter > 0;
  var _proc_exit = (code) => {
      EXITSTATUS = code;
      if (!keepRuntimeAlive()) {
        Module['onExit']?.(code);
        ABORT = true;
      }
      quit_(code, new ExitStatus(code));
    };
  
  /** @suppress {duplicate } */
  /** @param {boolean|number=} implicit */
  var exitJS = (status, implicit) => {
      EXITSTATUS = status;
  
      checkUnflushedContent();
  
      // if exit() was called explicitly, warn the user if the runtime isn't actually being shut down
      if (keepRuntimeAlive() && !implicit) {
        var msg = `program exited (with status: ${status}), but keepRuntimeAlive() is set (counter=${runtimeKeepaliveCounter}) due to an async operation, so halting execution but not exiting the runtime or preventing further async execution (you can use emscripten_force_exit, if you want to force a true shutdown)`;
        err(msg);
      }
  
      _proc_exit(status);
    };
  var _exit = exitJS;
  
  
  var maybeExit = () => {
      if (!keepRuntimeAlive()) {
        try {
          _exit(EXITSTATUS);
        } catch (e) {
          handleException(e);
        }
      }
    };
  var callUserCallback = (func) => {
      if (ABORT) {
        err('user callback triggered after runtime exited or application aborted.  Ignoring.');
        return;
      }
      try {
        func();
        maybeExit();
      } catch (e) {
        handleException(e);
      }
    };
  
  
  var _emscripten_get_now;
      // Modern environment where performance.now() is supported:
      // N.B. a shorter form "_emscripten_get_now = performance.now;" is
      // unfortunately not allowed even in current browsers (e.g. FF Nightly 75).
      _emscripten_get_now = () => performance.now();
  ;
  var __setitimer_js = (which, timeout_ms) => {
      // First, clear any existing timer.
      if (timers[which]) {
        clearTimeout(timers[which].id);
        delete timers[which];
      }
  
      // A timeout of zero simply cancels the current timeout so we have nothing
      // more to do.
      if (!timeout_ms) return 0;
  
      var id = setTimeout(() => {
        assert(which in timers);
        delete timers[which];
        callUserCallback(() => __emscripten_timeout(which, _emscripten_get_now()));
      }, timeout_ms);
      timers[which] = { id, timeout_ms };
      return 0;
    };

  var readEmAsmArgsArray = [];
  var readEmAsmArgs = (sigPtr, buf) => {
      // Nobody should have mutated _readEmAsmArgsArray underneath us to be something else than an array.
      assert(Array.isArray(readEmAsmArgsArray));
      // The input buffer is allocated on the stack, so it must be stack-aligned.
      assert(buf % 16 == 0);
      readEmAsmArgsArray.length = 0;
      var ch;
      // Most arguments are i32s, so shift the buffer pointer so it is a plain
      // index into HEAP32.
      while (ch = HEAPU8[sigPtr++]) {
        var chr = String.fromCharCode(ch);
        var validChars = ['d', 'f', 'i', 'p'];
        assert(validChars.includes(chr), `Invalid character ${ch}("${chr}") in readEmAsmArgs! Use only [${validChars}], and do not specify "v" for void return argument.`);
        // Floats are always passed as doubles, so all types except for 'i'
        // are 8 bytes and require alignment.
        var wide = (ch != 105);
        wide &= (ch != 112);
        buf += wide && (buf % 8) ? 4 : 0;
        readEmAsmArgsArray.push(
          // Special case for pointers under wasm64 or CAN_ADDRESS_2GB mode.
          ch == 112 ? HEAPU32[((buf)>>2)] :
          ch == 105 ?
            HEAP32[((buf)>>2)] :
            HEAPF64[((buf)>>3)]
        );
        buf += wide ? 8 : 4;
      }
      return readEmAsmArgsArray;
    };
  var runEmAsmFunction = (code, sigPtr, argbuf) => {
      var args = readEmAsmArgs(sigPtr, argbuf);
      assert(ASM_CONSTS.hasOwnProperty(code), `No EM_ASM constant found at address ${code}.  The loaded WebAssembly file is likely out of sync with the generated JavaScript.`);
      return ASM_CONSTS[code](...args);
    };
  var _emscripten_asm_const_int = (code, sigPtr, argbuf) => {
      return runEmAsmFunction(code, sigPtr, argbuf);
    };

  var _emscripten_asm_const_ptr = (code, sigPtr, argbuf) => {
      return runEmAsmFunction(code, sigPtr, argbuf);
    };

  var getHeapMax = () =>
      HEAPU8.length;
  
  var abortOnCannotGrowMemory = (requestedSize) => {
      abort(`Cannot enlarge memory arrays to size ${requestedSize} bytes (OOM). Either (1) compile with -sINITIAL_MEMORY=X with X higher than the current value ${HEAP8.length}, (2) compile with -sALLOW_MEMORY_GROWTH which allows increasing the size at runtime, or (3) if you want malloc to return NULL (0) instead of this abort, compile with -sABORTING_MALLOC=0`);
    };
  var _emscripten_resize_heap = (requestedSize) => {
      var oldSize = HEAPU8.length;
      // With CAN_ADDRESS_2GB or MEMORY64, pointers are already unsigned.
      requestedSize >>>= 0;
      abortOnCannotGrowMemory(requestedSize);
    };

  /** @param {number=} timeout */
  var safeSetTimeout = (func, timeout) => {
      
      return setTimeout(() => {
        
        callUserCallback(func);
      }, timeout);
    };
  var _emscripten_sleep = (ms) => {
      // emscripten_sleep() does not return a value, but we still need a |return|
      // here for stack switching support (ASYNCIFY=2). In that mode this function
      // returns a Promise instead of nothing, and that Promise is what tells the
      // wasm VM to pause the stack.
      return Asyncify.handleSleep((wakeUp) => safeSetTimeout(wakeUp, ms));
    };
  _emscripten_sleep.isAsync = true;

  var ENV = {
  };
  
  var getExecutableName = () => {
      return thisProgram || './this.program';
    };
  var getEnvStrings = () => {
      if (!getEnvStrings.strings) {
        // Default values.
        // Browser language detection #8751
        var lang = ((typeof navigator == 'object' && navigator.languages && navigator.languages[0]) || 'C').replace('-', '_') + '.UTF-8';
        var env = {
          'USER': 'web_user',
          'LOGNAME': 'web_user',
          'PATH': '/',
          'PWD': '/',
          'HOME': '/home/web_user',
          'LANG': lang,
          '_': getExecutableName()
        };
        // Apply the user-provided values, if any.
        for (var x in ENV) {
          // x is a key in ENV; if ENV[x] is undefined, that means it was
          // explicitly set to be so. We allow user code to do that to
          // force variables with default values to remain unset.
          if (ENV[x] === undefined) delete env[x];
          else env[x] = ENV[x];
        }
        var strings = [];
        for (var x in env) {
          strings.push(`${x}=${env[x]}`);
        }
        getEnvStrings.strings = strings;
      }
      return getEnvStrings.strings;
    };
  
  var stringToAscii = (str, buffer) => {
      for (var i = 0; i < str.length; ++i) {
        assert(str.charCodeAt(i) === (str.charCodeAt(i) & 0xff));
        HEAP8[buffer++] = str.charCodeAt(i);
      }
      // Null-terminate the string
      HEAP8[buffer] = 0;
    };
  var _environ_get = (__environ, environ_buf) => {
      var bufSize = 0;
      getEnvStrings().forEach((string, i) => {
        var ptr = environ_buf + bufSize;
        HEAPU32[(((__environ)+(i*4))>>2)] = ptr;
        stringToAscii(string, ptr);
        bufSize += string.length + 1;
      });
      return 0;
    };

  var _environ_sizes_get = (penviron_count, penviron_buf_size) => {
      var strings = getEnvStrings();
      HEAPU32[((penviron_count)>>2)] = strings.length;
      var bufSize = 0;
      strings.forEach((string) => bufSize += string.length + 1);
      HEAPU32[((penviron_buf_size)>>2)] = bufSize;
      return 0;
    };


  var PATH = {
  isAbs:(path) => path.charAt(0) === '/',
  splitPath:(filename) => {
        var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
        return splitPathRe.exec(filename).slice(1);
      },
  normalizeArray:(parts, allowAboveRoot) => {
        // if the path tries to go above the root, `up` ends up > 0
        var up = 0;
        for (var i = parts.length - 1; i >= 0; i--) {
          var last = parts[i];
          if (last === '.') {
            parts.splice(i, 1);
          } else if (last === '..') {
            parts.splice(i, 1);
            up++;
          } else if (up) {
            parts.splice(i, 1);
            up--;
          }
        }
        // if the path is allowed to go above the root, restore leading ..s
        if (allowAboveRoot) {
          for (; up; up--) {
            parts.unshift('..');
          }
        }
        return parts;
      },
  normalize:(path) => {
        var isAbsolute = PATH.isAbs(path),
            trailingSlash = path.substr(-1) === '/';
        // Normalize the path
        path = PATH.normalizeArray(path.split('/').filter((p) => !!p), !isAbsolute).join('/');
        if (!path && !isAbsolute) {
          path = '.';
        }
        if (path && trailingSlash) {
          path += '/';
        }
        return (isAbsolute ? '/' : '') + path;
      },
  dirname:(path) => {
        var result = PATH.splitPath(path),
            root = result[0],
            dir = result[1];
        if (!root && !dir) {
          // No dirname whatsoever
          return '.';
        }
        if (dir) {
          // It has a dirname, strip trailing slash
          dir = dir.substr(0, dir.length - 1);
        }
        return root + dir;
      },
  basename:(path) => {
        // EMSCRIPTEN return '/'' for '/', not an empty string
        if (path === '/') return '/';
        path = PATH.normalize(path);
        path = path.replace(/\/$/, "");
        var lastSlash = path.lastIndexOf('/');
        if (lastSlash === -1) return path;
        return path.substr(lastSlash+1);
      },
  join:(...paths) => PATH.normalize(paths.join('/')),
  join2:(l, r) => PATH.normalize(l + '/' + r),
  };
  
  var initRandomFill = () => {
      if (typeof crypto == 'object' && typeof crypto['getRandomValues'] == 'function') {
        // for modern web browsers
        return (view) => crypto.getRandomValues(view);
      } else
      if (ENVIRONMENT_IS_NODE) {
        // for nodejs with or without crypto support included
        try {
          var crypto_module = require('crypto');
          var randomFillSync = crypto_module['randomFillSync'];
          if (randomFillSync) {
            // nodejs with LTS crypto support
            return (view) => crypto_module['randomFillSync'](view);
          }
          // very old nodejs with the original crypto API
          var randomBytes = crypto_module['randomBytes'];
          return (view) => (
            view.set(randomBytes(view.byteLength)),
            // Return the original view to match modern native implementations.
            view
          );
        } catch (e) {
          // nodejs doesn't have crypto support
        }
      }
      // we couldn't find a proper implementation, as Math.random() is not suitable for /dev/random, see emscripten-core/emscripten/pull/7096
      abort('no cryptographic support found for randomDevice. consider polyfilling it if you want to use something insecure like Math.random(), e.g. put this in a --pre-js: var crypto = { getRandomValues: (array) => { for (var i = 0; i < array.length; i++) array[i] = (Math.random()*256)|0 } };');
    };
  var randomFill = (view) => {
      // Lazily init on the first invocation.
      return (randomFill = initRandomFill())(view);
    };
  
  
  
  var PATH_FS = {
  resolve:(...args) => {
        var resolvedPath = '',
          resolvedAbsolute = false;
        for (var i = args.length - 1; i >= -1 && !resolvedAbsolute; i--) {
          var path = (i >= 0) ? args[i] : FS.cwd();
          // Skip empty and invalid entries
          if (typeof path != 'string') {
            throw new TypeError('Arguments to path.resolve must be strings');
          } else if (!path) {
            return ''; // an invalid portion invalidates the whole thing
          }
          resolvedPath = path + '/' + resolvedPath;
          resolvedAbsolute = PATH.isAbs(path);
        }
        // At this point the path should be resolved to a full absolute path, but
        // handle relative paths to be safe (might happen when process.cwd() fails)
        resolvedPath = PATH.normalizeArray(resolvedPath.split('/').filter((p) => !!p), !resolvedAbsolute).join('/');
        return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
      },
  relative:(from, to) => {
        from = PATH_FS.resolve(from).substr(1);
        to = PATH_FS.resolve(to).substr(1);
        function trim(arr) {
          var start = 0;
          for (; start < arr.length; start++) {
            if (arr[start] !== '') break;
          }
          var end = arr.length - 1;
          for (; end >= 0; end--) {
            if (arr[end] !== '') break;
          }
          if (start > end) return [];
          return arr.slice(start, end - start + 1);
        }
        var fromParts = trim(from.split('/'));
        var toParts = trim(to.split('/'));
        var length = Math.min(fromParts.length, toParts.length);
        var samePartsLength = length;
        for (var i = 0; i < length; i++) {
          if (fromParts[i] !== toParts[i]) {
            samePartsLength = i;
            break;
          }
        }
        var outputParts = [];
        for (var i = samePartsLength; i < fromParts.length; i++) {
          outputParts.push('..');
        }
        outputParts = outputParts.concat(toParts.slice(samePartsLength));
        return outputParts.join('/');
      },
  };
  
  
  
  var FS_stdin_getChar_buffer = [];
  
  var lengthBytesUTF8 = (str) => {
      var len = 0;
      for (var i = 0; i < str.length; ++i) {
        // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code
        // unit, not a Unicode code point of the character! So decode
        // UTF16->UTF32->UTF8.
        // See http://unicode.org/faq/utf_bom.html#utf16-3
        var c = str.charCodeAt(i); // possibly a lead surrogate
        if (c <= 0x7F) {
          len++;
        } else if (c <= 0x7FF) {
          len += 2;
        } else if (c >= 0xD800 && c <= 0xDFFF) {
          len += 4; ++i;
        } else {
          len += 3;
        }
      }
      return len;
    };
  
  var stringToUTF8Array = (str, heap, outIdx, maxBytesToWrite) => {
      assert(typeof str === 'string', `stringToUTF8Array expects a string (got ${typeof str})`);
      // Parameter maxBytesToWrite is not optional. Negative values, 0, null,
      // undefined and false each don't write out any bytes.
      if (!(maxBytesToWrite > 0))
        return 0;
  
      var startIdx = outIdx;
      var endIdx = outIdx + maxBytesToWrite - 1; // -1 for string null terminator.
      for (var i = 0; i < str.length; ++i) {
        // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code
        // unit, not a Unicode code point of the character! So decode
        // UTF16->UTF32->UTF8.
        // See http://unicode.org/faq/utf_bom.html#utf16-3
        // For UTF8 byte structure, see http://en.wikipedia.org/wiki/UTF-8#Description
        // and https://www.ietf.org/rfc/rfc2279.txt
        // and https://tools.ietf.org/html/rfc3629
        var u = str.charCodeAt(i); // possibly a lead surrogate
        if (u >= 0xD800 && u <= 0xDFFF) {
          var u1 = str.charCodeAt(++i);
          u = 0x10000 + ((u & 0x3FF) << 10) | (u1 & 0x3FF);
        }
        if (u <= 0x7F) {
          if (outIdx >= endIdx) break;
          heap[outIdx++] = u;
        } else if (u <= 0x7FF) {
          if (outIdx + 1 >= endIdx) break;
          heap[outIdx++] = 0xC0 | (u >> 6);
          heap[outIdx++] = 0x80 | (u & 63);
        } else if (u <= 0xFFFF) {
          if (outIdx + 2 >= endIdx) break;
          heap[outIdx++] = 0xE0 | (u >> 12);
          heap[outIdx++] = 0x80 | ((u >> 6) & 63);
          heap[outIdx++] = 0x80 | (u & 63);
        } else {
          if (outIdx + 3 >= endIdx) break;
          if (u > 0x10FFFF) warnOnce('Invalid Unicode code point ' + ptrToString(u) + ' encountered when serializing a JS string to a UTF-8 string in wasm memory! (Valid unicode code points should be in range 0-0x10FFFF).');
          heap[outIdx++] = 0xF0 | (u >> 18);
          heap[outIdx++] = 0x80 | ((u >> 12) & 63);
          heap[outIdx++] = 0x80 | ((u >> 6) & 63);
          heap[outIdx++] = 0x80 | (u & 63);
        }
      }
      // Null-terminate the pointer to the buffer.
      heap[outIdx] = 0;
      return outIdx - startIdx;
    };
  /** @type {function(string, boolean=, number=)} */
  function intArrayFromString(stringy, dontAddNull, length) {
    var len = length > 0 ? length : lengthBytesUTF8(stringy)+1;
    var u8array = new Array(len);
    var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
    if (dontAddNull) u8array.length = numBytesWritten;
    return u8array;
  }
  var FS_stdin_getChar = () => {
      if (!FS_stdin_getChar_buffer.length) {
        var result = null;
        if (ENVIRONMENT_IS_NODE) {
          // we will read data by chunks of BUFSIZE
          var BUFSIZE = 256;
          var buf = Buffer.alloc(BUFSIZE);
          var bytesRead = 0;
  
          // For some reason we must suppress a closure warning here, even though
          // fd definitely exists on process.stdin, and is even the proper way to
          // get the fd of stdin,
          // https://github.com/nodejs/help/issues/2136#issuecomment-523649904
          // This started to happen after moving this logic out of library_tty.js,
          // so it is related to the surrounding code in some unclear manner.
          /** @suppress {missingProperties} */
          var fd = process.stdin.fd;
  
          try {
            bytesRead = fs.readSync(fd, buf, 0, BUFSIZE);
          } catch(e) {
            // Cross-platform differences: on Windows, reading EOF throws an
            // exception, but on other OSes, reading EOF returns 0. Uniformize
            // behavior by treating the EOF exception to return 0.
            if (e.toString().includes('EOF')) bytesRead = 0;
            else throw e;
          }
  
          if (bytesRead > 0) {
            result = buf.slice(0, bytesRead).toString('utf-8');
          }
        } else
        if (typeof window != 'undefined' &&
          typeof window.prompt == 'function') {
          // Browser.
          result = window.prompt('Input: ');  // returns null on cancel
          if (result !== null) {
            result += '\n';
          }
        } else
        {}
        if (!result) {
          return null;
        }
        FS_stdin_getChar_buffer = intArrayFromString(result, true);
      }
      return FS_stdin_getChar_buffer.shift();
    };
  var TTY = {
  ttys:[],
  init() {
        // https://github.com/emscripten-core/emscripten/pull/1555
        // if (ENVIRONMENT_IS_NODE) {
        //   // currently, FS.init does not distinguish if process.stdin is a file or TTY
        //   // device, it always assumes it's a TTY device. because of this, we're forcing
        //   // process.stdin to UTF8 encoding to at least make stdin reading compatible
        //   // with text files until FS.init can be refactored.
        //   process.stdin.setEncoding('utf8');
        // }
      },
  shutdown() {
        // https://github.com/emscripten-core/emscripten/pull/1555
        // if (ENVIRONMENT_IS_NODE) {
        //   // inolen: any idea as to why node -e 'process.stdin.read()' wouldn't exit immediately (with process.stdin being a tty)?
        //   // isaacs: because now it's reading from the stream, you've expressed interest in it, so that read() kicks off a _read() which creates a ReadReq operation
        //   // inolen: I thought read() in that case was a synchronous operation that just grabbed some amount of buffered data if it exists?
        //   // isaacs: it is. but it also triggers a _read() call, which calls readStart() on the handle
        //   // isaacs: do process.stdin.pause() and i'd think it'd probably close the pending call
        //   process.stdin.pause();
        // }
      },
  register(dev, ops) {
        TTY.ttys[dev] = { input: [], output: [], ops: ops };
        FS.registerDevice(dev, TTY.stream_ops);
      },
  stream_ops:{
  open(stream) {
          var tty = TTY.ttys[stream.node.rdev];
          if (!tty) {
            throw new FS.ErrnoError(43);
          }
          stream.tty = tty;
          stream.seekable = false;
        },
  close(stream) {
          // flush any pending line data
          stream.tty.ops.fsync(stream.tty);
        },
  fsync(stream) {
          stream.tty.ops.fsync(stream.tty);
        },
  read(stream, buffer, offset, length, pos /* ignored */) {
          if (!stream.tty || !stream.tty.ops.get_char) {
            throw new FS.ErrnoError(60);
          }
          var bytesRead = 0;
          for (var i = 0; i < length; i++) {
            var result;
            try {
              result = stream.tty.ops.get_char(stream.tty);
            } catch (e) {
              throw new FS.ErrnoError(29);
            }
            if (result === undefined && bytesRead === 0) {
              throw new FS.ErrnoError(6);
            }
            if (result === null || result === undefined) break;
            bytesRead++;
            buffer[offset+i] = result;
          }
          if (bytesRead) {
            stream.node.timestamp = Date.now();
          }
          return bytesRead;
        },
  write(stream, buffer, offset, length, pos) {
          if (!stream.tty || !stream.tty.ops.put_char) {
            throw new FS.ErrnoError(60);
          }
          try {
            for (var i = 0; i < length; i++) {
              stream.tty.ops.put_char(stream.tty, buffer[offset+i]);
            }
          } catch (e) {
            throw new FS.ErrnoError(29);
          }
          if (length) {
            stream.node.timestamp = Date.now();
          }
          return i;
        },
  },
  default_tty_ops:{
  get_char(tty) {
          return FS_stdin_getChar();
        },
  put_char(tty, val) {
          if (val === null || val === 10) {
            out(UTF8ArrayToString(tty.output, 0));
            tty.output = [];
          } else {
            if (val != 0) tty.output.push(val); // val == 0 would cut text output off in the middle.
          }
        },
  fsync(tty) {
          if (tty.output && tty.output.length > 0) {
            out(UTF8ArrayToString(tty.output, 0));
            tty.output = [];
          }
        },
  ioctl_tcgets(tty) {
          // typical setting
          return {
            c_iflag: 25856,
            c_oflag: 5,
            c_cflag: 191,
            c_lflag: 35387,
            c_cc: [
              0x03, 0x1c, 0x7f, 0x15, 0x04, 0x00, 0x01, 0x00, 0x11, 0x13, 0x1a, 0x00,
              0x12, 0x0f, 0x17, 0x16, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
              0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            ]
          };
        },
  ioctl_tcsets(tty, optional_actions, data) {
          // currently just ignore
          return 0;
        },
  ioctl_tiocgwinsz(tty) {
          return [24, 80];
        },
  },
  default_tty1_ops:{
  put_char(tty, val) {
          if (val === null || val === 10) {
            err(UTF8ArrayToString(tty.output, 0));
            tty.output = [];
          } else {
            if (val != 0) tty.output.push(val);
          }
        },
  fsync(tty) {
          if (tty.output && tty.output.length > 0) {
            err(UTF8ArrayToString(tty.output, 0));
            tty.output = [];
          }
        },
  },
  };
  
  
  var zeroMemory = (address, size) => {
      HEAPU8.fill(0, address, address + size);
      return address;
    };
  
  var alignMemory = (size, alignment) => {
      assert(alignment, "alignment argument is required");
      return Math.ceil(size / alignment) * alignment;
    };
  var mmapAlloc = (size) => {
      size = alignMemory(size, 65536);
      var ptr = _emscripten_builtin_memalign(65536, size);
      if (!ptr) return 0;
      return zeroMemory(ptr, size);
    };
  var MEMFS = {
  ops_table:null,
  mount(mount) {
        return MEMFS.createNode(null, '/', 16384 | 511 /* 0777 */, 0);
      },
  createNode(parent, name, mode, dev) {
        if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
          // no supported
          throw new FS.ErrnoError(63);
        }
        MEMFS.ops_table ||= {
          dir: {
            node: {
              getattr: MEMFS.node_ops.getattr,
              setattr: MEMFS.node_ops.setattr,
              lookup: MEMFS.node_ops.lookup,
              mknod: MEMFS.node_ops.mknod,
              rename: MEMFS.node_ops.rename,
              unlink: MEMFS.node_ops.unlink,
              rmdir: MEMFS.node_ops.rmdir,
              readdir: MEMFS.node_ops.readdir,
              symlink: MEMFS.node_ops.symlink
            },
            stream: {
              llseek: MEMFS.stream_ops.llseek
            }
          },
          file: {
            node: {
              getattr: MEMFS.node_ops.getattr,
              setattr: MEMFS.node_ops.setattr
            },
            stream: {
              llseek: MEMFS.stream_ops.llseek,
              read: MEMFS.stream_ops.read,
              write: MEMFS.stream_ops.write,
              allocate: MEMFS.stream_ops.allocate,
              mmap: MEMFS.stream_ops.mmap,
              msync: MEMFS.stream_ops.msync
            }
          },
          link: {
            node: {
              getattr: MEMFS.node_ops.getattr,
              setattr: MEMFS.node_ops.setattr,
              readlink: MEMFS.node_ops.readlink
            },
            stream: {}
          },
          chrdev: {
            node: {
              getattr: MEMFS.node_ops.getattr,
              setattr: MEMFS.node_ops.setattr
            },
            stream: FS.chrdev_stream_ops
          }
        };
        var node = FS.createNode(parent, name, mode, dev);
        if (FS.isDir(node.mode)) {
          node.node_ops = MEMFS.ops_table.dir.node;
          node.stream_ops = MEMFS.ops_table.dir.stream;
          node.contents = {};
        } else if (FS.isFile(node.mode)) {
          node.node_ops = MEMFS.ops_table.file.node;
          node.stream_ops = MEMFS.ops_table.file.stream;
          node.usedBytes = 0; // The actual number of bytes used in the typed array, as opposed to contents.length which gives the whole capacity.
          // When the byte data of the file is populated, this will point to either a typed array, or a normal JS array. Typed arrays are preferred
          // for performance, and used by default. However, typed arrays are not resizable like normal JS arrays are, so there is a small disk size
          // penalty involved for appending file writes that continuously grow a file similar to std::vector capacity vs used -scheme.
          node.contents = null; 
        } else if (FS.isLink(node.mode)) {
          node.node_ops = MEMFS.ops_table.link.node;
          node.stream_ops = MEMFS.ops_table.link.stream;
        } else if (FS.isChrdev(node.mode)) {
          node.node_ops = MEMFS.ops_table.chrdev.node;
          node.stream_ops = MEMFS.ops_table.chrdev.stream;
        }
        node.timestamp = Date.now();
        // add the new node to the parent
        if (parent) {
          parent.contents[name] = node;
          parent.timestamp = node.timestamp;
        }
        return node;
      },
  getFileDataAsTypedArray(node) {
        if (!node.contents) return new Uint8Array(0);
        if (node.contents.subarray) return node.contents.subarray(0, node.usedBytes); // Make sure to not return excess unused bytes.
        return new Uint8Array(node.contents);
      },
  expandFileStorage(node, newCapacity) {
        var prevCapacity = node.contents ? node.contents.length : 0;
        if (prevCapacity >= newCapacity) return; // No need to expand, the storage was already large enough.
        // Don't expand strictly to the given requested limit if it's only a very small increase, but instead geometrically grow capacity.
        // For small filesizes (<1MB), perform size*2 geometric increase, but for large sizes, do a much more conservative size*1.125 increase to
        // avoid overshooting the allocation cap by a very large margin.
        var CAPACITY_DOUBLING_MAX = 1024 * 1024;
        newCapacity = Math.max(newCapacity, (prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2.0 : 1.125)) >>> 0);
        if (prevCapacity != 0) newCapacity = Math.max(newCapacity, 256); // At minimum allocate 256b for each file when expanding.
        var oldContents = node.contents;
        node.contents = new Uint8Array(newCapacity); // Allocate new storage.
        if (node.usedBytes > 0) node.contents.set(oldContents.subarray(0, node.usedBytes), 0); // Copy old data over to the new storage.
      },
  resizeFileStorage(node, newSize) {
        if (node.usedBytes == newSize) return;
        if (newSize == 0) {
          node.contents = null; // Fully decommit when requesting a resize to zero.
          node.usedBytes = 0;
        } else {
          var oldContents = node.contents;
          node.contents = new Uint8Array(newSize); // Allocate new storage.
          if (oldContents) {
            node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes))); // Copy old data over to the new storage.
          }
          node.usedBytes = newSize;
        }
      },
  node_ops:{
  getattr(node) {
          var attr = {};
          // device numbers reuse inode numbers.
          attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
          attr.ino = node.id;
          attr.mode = node.mode;
          attr.nlink = 1;
          attr.uid = 0;
          attr.gid = 0;
          attr.rdev = node.rdev;
          if (FS.isDir(node.mode)) {
            attr.size = 4096;
          } else if (FS.isFile(node.mode)) {
            attr.size = node.usedBytes;
          } else if (FS.isLink(node.mode)) {
            attr.size = node.link.length;
          } else {
            attr.size = 0;
          }
          attr.atime = new Date(node.timestamp);
          attr.mtime = new Date(node.timestamp);
          attr.ctime = new Date(node.timestamp);
          // NOTE: In our implementation, st_blocks = Math.ceil(st_size/st_blksize),
          //       but this is not required by the standard.
          attr.blksize = 4096;
          attr.blocks = Math.ceil(attr.size / attr.blksize);
          return attr;
        },
  setattr(node, attr) {
          if (attr.mode !== undefined) {
            node.mode = attr.mode;
          }
          if (attr.timestamp !== undefined) {
            node.timestamp = attr.timestamp;
          }
          if (attr.size !== undefined) {
            MEMFS.resizeFileStorage(node, attr.size);
          }
        },
  lookup(parent, name) {
          throw FS.genericErrors[44];
        },
  mknod(parent, name, mode, dev) {
          return MEMFS.createNode(parent, name, mode, dev);
        },
  rename(old_node, new_dir, new_name) {
          // if we're overwriting a directory at new_name, make sure it's empty.
          if (FS.isDir(old_node.mode)) {
            var new_node;
            try {
              new_node = FS.lookupNode(new_dir, new_name);
            } catch (e) {
            }
            if (new_node) {
              for (var i in new_node.contents) {
                throw new FS.ErrnoError(55);
              }
            }
          }
          // do the internal rewiring
          delete old_node.parent.contents[old_node.name];
          old_node.parent.timestamp = Date.now()
          old_node.name = new_name;
          new_dir.contents[new_name] = old_node;
          new_dir.timestamp = old_node.parent.timestamp;
        },
  unlink(parent, name) {
          delete parent.contents[name];
          parent.timestamp = Date.now();
        },
  rmdir(parent, name) {
          var node = FS.lookupNode(parent, name);
          for (var i in node.contents) {
            throw new FS.ErrnoError(55);
          }
          delete parent.contents[name];
          parent.timestamp = Date.now();
        },
  readdir(node) {
          var entries = ['.', '..'];
          for (var key of Object.keys(node.contents)) {
            entries.push(key);
          }
          return entries;
        },
  symlink(parent, newname, oldpath) {
          var node = MEMFS.createNode(parent, newname, 511 /* 0777 */ | 40960, 0);
          node.link = oldpath;
          return node;
        },
  readlink(node) {
          if (!FS.isLink(node.mode)) {
            throw new FS.ErrnoError(28);
          }
          return node.link;
        },
  },
  stream_ops:{
  read(stream, buffer, offset, length, position) {
          var contents = stream.node.contents;
          if (position >= stream.node.usedBytes) return 0;
          var size = Math.min(stream.node.usedBytes - position, length);
          assert(size >= 0);
          if (size > 8 && contents.subarray) { // non-trivial, and typed array
            buffer.set(contents.subarray(position, position + size), offset);
          } else {
            for (var i = 0; i < size; i++) buffer[offset + i] = contents[position + i];
          }
          return size;
        },
  write(stream, buffer, offset, length, position, canOwn) {
          // The data buffer should be a typed array view
          assert(!(buffer instanceof ArrayBuffer));
  
          if (!length) return 0;
          var node = stream.node;
          node.timestamp = Date.now();
  
          if (buffer.subarray && (!node.contents || node.contents.subarray)) { // This write is from a typed array to a typed array?
            if (canOwn) {
              assert(position === 0, 'canOwn must imply no weird position inside the file');
              node.contents = buffer.subarray(offset, offset + length);
              node.usedBytes = length;
              return length;
            } else if (node.usedBytes === 0 && position === 0) { // If this is a simple first write to an empty file, do a fast set since we don't need to care about old data.
              node.contents = buffer.slice(offset, offset + length);
              node.usedBytes = length;
              return length;
            } else if (position + length <= node.usedBytes) { // Writing to an already allocated and used subrange of the file?
              node.contents.set(buffer.subarray(offset, offset + length), position);
              return length;
            }
          }
  
          // Appending to an existing file and we need to reallocate, or source data did not come as a typed array.
          MEMFS.expandFileStorage(node, position+length);
          if (node.contents.subarray && buffer.subarray) {
            // Use typed array write which is available.
            node.contents.set(buffer.subarray(offset, offset + length), position);
          } else {
            for (var i = 0; i < length; i++) {
             node.contents[position + i] = buffer[offset + i]; // Or fall back to manual write if not.
            }
          }
          node.usedBytes = Math.max(node.usedBytes, position + length);
          return length;
        },
  llseek(stream, offset, whence) {
          var position = offset;
          if (whence === 1) {
            position += stream.position;
          } else if (whence === 2) {
            if (FS.isFile(stream.node.mode)) {
              position += stream.node.usedBytes;
            }
          }
          if (position < 0) {
            throw new FS.ErrnoError(28);
          }
          return position;
        },
  allocate(stream, offset, length) {
          MEMFS.expandFileStorage(stream.node, offset + length);
          stream.node.usedBytes = Math.max(stream.node.usedBytes, offset + length);
        },
  mmap(stream, length, position, prot, flags) {
          if (!FS.isFile(stream.node.mode)) {
            throw new FS.ErrnoError(43);
          }
          var ptr;
          var allocated;
          var contents = stream.node.contents;
          // Only make a new copy when MAP_PRIVATE is specified.
          if (!(flags & 2) && contents.buffer === HEAP8.buffer) {
            // We can't emulate MAP_SHARED when the file is not backed by the
            // buffer we're mapping to (e.g. the HEAP buffer).
            allocated = false;
            ptr = contents.byteOffset;
          } else {
            // Try to avoid unnecessary slices.
            if (position > 0 || position + length < contents.length) {
              if (contents.subarray) {
                contents = contents.subarray(position, position + length);
              } else {
                contents = Array.prototype.slice.call(contents, position, position + length);
              }
            }
            allocated = true;
            ptr = mmapAlloc(length);
            if (!ptr) {
              throw new FS.ErrnoError(48);
            }
            HEAP8.set(contents, ptr);
          }
          return { ptr, allocated };
        },
  msync(stream, buffer, offset, length, mmapFlags) {
          MEMFS.stream_ops.write(stream, buffer, 0, length, offset, false);
          // should we check if bytesWritten and length are the same?
          return 0;
        },
  },
  };
  
  /** @param {boolean=} noRunDep */
  var asyncLoad = (url, onload, onerror, noRunDep) => {
      var dep = !noRunDep ? getUniqueRunDependency(`al ${url}`) : '';
      readAsync(url).then(
        (arrayBuffer) => {
          assert(arrayBuffer, `Loading data file "${url}" failed (no arrayBuffer).`);
          onload(new Uint8Array(arrayBuffer));
          if (dep) removeRunDependency(dep);
        },
        (err) => {
          if (onerror) {
            onerror();
          } else {
            throw `Loading data file "${url}" failed.`;
          }
        }
      );
      if (dep) addRunDependency(dep);
    };
  
  
  var FS_createDataFile = (parent, name, fileData, canRead, canWrite, canOwn) => {
      FS.createDataFile(parent, name, fileData, canRead, canWrite, canOwn);
    };
  
  var preloadPlugins = Module['preloadPlugins'] || [];
  var FS_handledByPreloadPlugin = (byteArray, fullname, finish, onerror) => {
      // Ensure plugins are ready.
      if (typeof Browser != 'undefined') Browser.init();
  
      var handled = false;
      preloadPlugins.forEach((plugin) => {
        if (handled) return;
        if (plugin['canHandle'](fullname)) {
          plugin['handle'](byteArray, fullname, finish, onerror);
          handled = true;
        }
      });
      return handled;
    };
  var FS_createPreloadedFile = (parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish) => {
      // TODO we should allow people to just pass in a complete filename instead
      // of parent and name being that we just join them anyways
      var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent;
      var dep = getUniqueRunDependency(`cp ${fullname}`); // might have several active requests for the same fullname
      function processData(byteArray) {
        function finish(byteArray) {
          preFinish?.();
          if (!dontCreateFile) {
            FS_createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
          }
          onload?.();
          removeRunDependency(dep);
        }
        if (FS_handledByPreloadPlugin(byteArray, fullname, finish, () => {
          onerror?.();
          removeRunDependency(dep);
        })) {
          return;
        }
        finish(byteArray);
      }
      addRunDependency(dep);
      if (typeof url == 'string') {
        asyncLoad(url, processData, onerror);
      } else {
        processData(url);
      }
    };
  
  var FS_modeStringToFlags = (str) => {
      var flagModes = {
        'r': 0,
        'r+': 2,
        'w': 512 | 64 | 1,
        'w+': 512 | 64 | 2,
        'a': 1024 | 64 | 1,
        'a+': 1024 | 64 | 2,
      };
      var flags = flagModes[str];
      if (typeof flags == 'undefined') {
        throw new Error(`Unknown file open mode: ${str}`);
      }
      return flags;
    };
  
  var FS_getMode = (canRead, canWrite) => {
      var mode = 0;
      if (canRead) mode |= 292 | 73;
      if (canWrite) mode |= 146;
      return mode;
    };
  
  
  
  
  
  
  var strError = (errno) => {
      return UTF8ToString(_strerror(errno));
    };
  
  var ERRNO_CODES = {
      'EPERM': 63,
      'ENOENT': 44,
      'ESRCH': 71,
      'EINTR': 27,
      'EIO': 29,
      'ENXIO': 60,
      'E2BIG': 1,
      'ENOEXEC': 45,
      'EBADF': 8,
      'ECHILD': 12,
      'EAGAIN': 6,
      'EWOULDBLOCK': 6,
      'ENOMEM': 48,
      'EACCES': 2,
      'EFAULT': 21,
      'ENOTBLK': 105,
      'EBUSY': 10,
      'EEXIST': 20,
      'EXDEV': 75,
      'ENODEV': 43,
      'ENOTDIR': 54,
      'EISDIR': 31,
      'EINVAL': 28,
      'ENFILE': 41,
      'EMFILE': 33,
      'ENOTTY': 59,
      'ETXTBSY': 74,
      'EFBIG': 22,
      'ENOSPC': 51,
      'ESPIPE': 70,
      'EROFS': 69,
      'EMLINK': 34,
      'EPIPE': 64,
      'EDOM': 18,
      'ERANGE': 68,
      'ENOMSG': 49,
      'EIDRM': 24,
      'ECHRNG': 106,
      'EL2NSYNC': 156,
      'EL3HLT': 107,
      'EL3RST': 108,
      'ELNRNG': 109,
      'EUNATCH': 110,
      'ENOCSI': 111,
      'EL2HLT': 112,
      'EDEADLK': 16,
      'ENOLCK': 46,
      'EBADE': 113,
      'EBADR': 114,
      'EXFULL': 115,
      'ENOANO': 104,
      'EBADRQC': 103,
      'EBADSLT': 102,
      'EDEADLOCK': 16,
      'EBFONT': 101,
      'ENOSTR': 100,
      'ENODATA': 116,
      'ETIME': 117,
      'ENOSR': 118,
      'ENONET': 119,
      'ENOPKG': 120,
      'EREMOTE': 121,
      'ENOLINK': 47,
      'EADV': 122,
      'ESRMNT': 123,
      'ECOMM': 124,
      'EPROTO': 65,
      'EMULTIHOP': 36,
      'EDOTDOT': 125,
      'EBADMSG': 9,
      'ENOTUNIQ': 126,
      'EBADFD': 127,
      'EREMCHG': 128,
      'ELIBACC': 129,
      'ELIBBAD': 130,
      'ELIBSCN': 131,
      'ELIBMAX': 132,
      'ELIBEXEC': 133,
      'ENOSYS': 52,
      'ENOTEMPTY': 55,
      'ENAMETOOLONG': 37,
      'ELOOP': 32,
      'EOPNOTSUPP': 138,
      'EPFNOSUPPORT': 139,
      'ECONNRESET': 15,
      'ENOBUFS': 42,
      'EAFNOSUPPORT': 5,
      'EPROTOTYPE': 67,
      'ENOTSOCK': 57,
      'ENOPROTOOPT': 50,
      'ESHUTDOWN': 140,
      'ECONNREFUSED': 14,
      'EADDRINUSE': 3,
      'ECONNABORTED': 13,
      'ENETUNREACH': 40,
      'ENETDOWN': 38,
      'ETIMEDOUT': 73,
      'EHOSTDOWN': 142,
      'EHOSTUNREACH': 23,
      'EINPROGRESS': 26,
      'EALREADY': 7,
      'EDESTADDRREQ': 17,
      'EMSGSIZE': 35,
      'EPROTONOSUPPORT': 66,
      'ESOCKTNOSUPPORT': 137,
      'EADDRNOTAVAIL': 4,
      'ENETRESET': 39,
      'EISCONN': 30,
      'ENOTCONN': 53,
      'ETOOMANYREFS': 141,
      'EUSERS': 136,
      'EDQUOT': 19,
      'ESTALE': 72,
      'ENOTSUP': 138,
      'ENOMEDIUM': 148,
      'EILSEQ': 25,
      'EOVERFLOW': 61,
      'ECANCELED': 11,
      'ENOTRECOVERABLE': 56,
      'EOWNERDEAD': 62,
      'ESTRPIPE': 135,
    };
  var FS = {
  root:null,
  mounts:[],
  devices:{
  },
  streams:[],
  nextInode:1,
  nameTable:null,
  currentPath:"/",
  initialized:false,
  ignorePermissions:true,
  ErrnoError:class extends Error {
        // We set the `name` property to be able to identify `FS.ErrnoError`
        // - the `name` is a standard ECMA-262 property of error objects. Kind of good to have it anyway.
        // - when using PROXYFS, an error can come from an underlying FS
        // as different FS objects have their own FS.ErrnoError each,
        // the test `err instanceof FS.ErrnoError` won't detect an error coming from another filesystem, causing bugs.
        // we'll use the reliable test `err.name == "ErrnoError"` instead
        constructor(errno) {
          super(runtimeInitialized ? strError(errno) : '');
          // TODO(sbc): Use the inline member declaration syntax once we
          // support it in acorn and closure.
          this.name = 'ErrnoError';
          this.errno = errno;
          for (var key in ERRNO_CODES) {
            if (ERRNO_CODES[key] === errno) {
              this.code = key;
              break;
            }
          }
        }
      },
  genericErrors:{
  },
  filesystems:null,
  syncFSRequests:0,
  FSStream:class {
        constructor() {
          // TODO(https://github.com/emscripten-core/emscripten/issues/21414):
          // Use inline field declarations.
          this.shared = {};
        }
        get object() {
          return this.node;
        }
        set object(val) {
          this.node = val;
        }
        get isRead() {
          return (this.flags & 2097155) !== 1;
        }
        get isWrite() {
          return (this.flags & 2097155) !== 0;
        }
        get isAppend() {
          return (this.flags & 1024);
        }
        get flags() {
          return this.shared.flags;
        }
        set flags(val) {
          this.shared.flags = val;
        }
        get position() {
          return this.shared.position;
        }
        set position(val) {
          this.shared.position = val;
        }
      },
  FSNode:class {
        constructor(parent, name, mode, rdev) {
          if (!parent) {
            parent = this;  // root node sets parent to itself
          }
          this.parent = parent;
          this.mount = parent.mount;
          this.mounted = null;
          this.id = FS.nextInode++;
          this.name = name;
          this.mode = mode;
          this.node_ops = {};
          this.stream_ops = {};
          this.rdev = rdev;
          this.readMode = 292/*292*/ | 73/*73*/;
          this.writeMode = 146/*146*/;
        }
        get read() {
          return (this.mode & this.readMode) === this.readMode;
        }
        set read(val) {
          val ? this.mode |= this.readMode : this.mode &= ~this.readMode;
        }
        get write() {
          return (this.mode & this.writeMode) === this.writeMode;
        }
        set write(val) {
          val ? this.mode |= this.writeMode : this.mode &= ~this.writeMode;
        }
        get isFolder() {
          return FS.isDir(this.mode);
        }
        get isDevice() {
          return FS.isChrdev(this.mode);
        }
      },
  lookupPath(path, opts = {}) {
        path = PATH_FS.resolve(path);
  
        if (!path) return { path: '', node: null };
  
        var defaults = {
          follow_mount: true,
          recurse_count: 0
        };
        opts = Object.assign(defaults, opts)
  
        if (opts.recurse_count > 8) {  // max recursive lookup of 8
          throw new FS.ErrnoError(32);
        }
  
        // split the absolute path
        var parts = path.split('/').filter((p) => !!p);
  
        // start at the root
        var current = FS.root;
        var current_path = '/';
  
        for (var i = 0; i < parts.length; i++) {
          var islast = (i === parts.length-1);
          if (islast && opts.parent) {
            // stop resolving
            break;
          }
  
          current = FS.lookupNode(current, parts[i]);
          current_path = PATH.join2(current_path, parts[i]);
  
          // jump to the mount's root node if this is a mountpoint
          if (FS.isMountpoint(current)) {
            if (!islast || (islast && opts.follow_mount)) {
              current = current.mounted.root;
            }
          }
  
          // by default, lookupPath will not follow a symlink if it is the final path component.
          // setting opts.follow = true will override this behavior.
          if (!islast || opts.follow) {
            var count = 0;
            while (FS.isLink(current.mode)) {
              var link = FS.readlink(current_path);
              current_path = PATH_FS.resolve(PATH.dirname(current_path), link);
  
              var lookup = FS.lookupPath(current_path, { recurse_count: opts.recurse_count + 1 });
              current = lookup.node;
  
              if (count++ > 40) {  // limit max consecutive symlinks to 40 (SYMLOOP_MAX).
                throw new FS.ErrnoError(32);
              }
            }
          }
        }
  
        return { path: current_path, node: current };
      },
  getPath(node) {
        var path;
        while (true) {
          if (FS.isRoot(node)) {
            var mount = node.mount.mountpoint;
            if (!path) return mount;
            return mount[mount.length-1] !== '/' ? `${mount}/${path}` : mount + path;
          }
          path = path ? `${node.name}/${path}` : node.name;
          node = node.parent;
        }
      },
  hashName(parentid, name) {
        var hash = 0;
  
        for (var i = 0; i < name.length; i++) {
          hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
        }
        return ((parentid + hash) >>> 0) % FS.nameTable.length;
      },
  hashAddNode(node) {
        var hash = FS.hashName(node.parent.id, node.name);
        node.name_next = FS.nameTable[hash];
        FS.nameTable[hash] = node;
      },
  hashRemoveNode(node) {
        var hash = FS.hashName(node.parent.id, node.name);
        if (FS.nameTable[hash] === node) {
          FS.nameTable[hash] = node.name_next;
        } else {
          var current = FS.nameTable[hash];
          while (current) {
            if (current.name_next === node) {
              current.name_next = node.name_next;
              break;
            }
            current = current.name_next;
          }
        }
      },
  lookupNode(parent, name) {
        var errCode = FS.mayLookup(parent);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        var hash = FS.hashName(parent.id, name);
        for (var node = FS.nameTable[hash]; node; node = node.name_next) {
          var nodeName = node.name;
          if (node.parent.id === parent.id && nodeName === name) {
            return node;
          }
        }
        // if we failed to find it in the cache, call into the VFS
        return FS.lookup(parent, name);
      },
  createNode(parent, name, mode, rdev) {
        assert(typeof parent == 'object')
        var node = new FS.FSNode(parent, name, mode, rdev);
  
        FS.hashAddNode(node);
  
        return node;
      },
  destroyNode(node) {
        FS.hashRemoveNode(node);
      },
  isRoot(node) {
        return node === node.parent;
      },
  isMountpoint(node) {
        return !!node.mounted;
      },
  isFile(mode) {
        return (mode & 61440) === 32768;
      },
  isDir(mode) {
        return (mode & 61440) === 16384;
      },
  isLink(mode) {
        return (mode & 61440) === 40960;
      },
  isChrdev(mode) {
        return (mode & 61440) === 8192;
      },
  isBlkdev(mode) {
        return (mode & 61440) === 24576;
      },
  isFIFO(mode) {
        return (mode & 61440) === 4096;
      },
  isSocket(mode) {
        return (mode & 49152) === 49152;
      },
  flagsToPermissionString(flag) {
        var perms = ['r', 'w', 'rw'][flag & 3];
        if ((flag & 512)) {
          perms += 'w';
        }
        return perms;
      },
  nodePermissions(node, perms) {
        if (FS.ignorePermissions) {
          return 0;
        }
        // return 0 if any user, group or owner bits are set.
        if (perms.includes('r') && !(node.mode & 292)) {
          return 2;
        } else if (perms.includes('w') && !(node.mode & 146)) {
          return 2;
        } else if (perms.includes('x') && !(node.mode & 73)) {
          return 2;
        }
        return 0;
      },
  mayLookup(dir) {
        if (!FS.isDir(dir.mode)) return 54;
        var errCode = FS.nodePermissions(dir, 'x');
        if (errCode) return errCode;
        if (!dir.node_ops.lookup) return 2;
        return 0;
      },
  mayCreate(dir, name) {
        try {
          var node = FS.lookupNode(dir, name);
          return 20;
        } catch (e) {
        }
        return FS.nodePermissions(dir, 'wx');
      },
  mayDelete(dir, name, isdir) {
        var node;
        try {
          node = FS.lookupNode(dir, name);
        } catch (e) {
          return e.errno;
        }
        var errCode = FS.nodePermissions(dir, 'wx');
        if (errCode) {
          return errCode;
        }
        if (isdir) {
          if (!FS.isDir(node.mode)) {
            return 54;
          }
          if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
            return 10;
          }
        } else {
          if (FS.isDir(node.mode)) {
            return 31;
          }
        }
        return 0;
      },
  mayOpen(node, flags) {
        if (!node) {
          return 44;
        }
        if (FS.isLink(node.mode)) {
          return 32;
        } else if (FS.isDir(node.mode)) {
          if (FS.flagsToPermissionString(flags) !== 'r' || // opening for write
              (flags & 512)) { // TODO: check for O_SEARCH? (== search for dir only)
            return 31;
          }
        }
        return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
      },
  MAX_OPEN_FDS:4096,
  nextfd() {
        for (var fd = 0; fd <= FS.MAX_OPEN_FDS; fd++) {
          if (!FS.streams[fd]) {
            return fd;
          }
        }
        throw new FS.ErrnoError(33);
      },
  getStreamChecked(fd) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(8);
        }
        return stream;
      },
  getStream:(fd) => FS.streams[fd],
  createStream(stream, fd = -1) {
        assert(fd >= -1);
  
        // clone it, so we can return an instance of FSStream
        stream = Object.assign(new FS.FSStream(), stream);
        if (fd == -1) {
          fd = FS.nextfd();
        }
        stream.fd = fd;
        FS.streams[fd] = stream;
        return stream;
      },
  closeStream(fd) {
        FS.streams[fd] = null;
      },
  dupStream(origStream, fd = -1) {
        var stream = FS.createStream(origStream, fd);
        stream.stream_ops?.dup?.(stream);
        return stream;
      },
  chrdev_stream_ops:{
  open(stream) {
          var device = FS.getDevice(stream.node.rdev);
          // override node's stream ops with the device's
          stream.stream_ops = device.stream_ops;
          // forward the open call
          stream.stream_ops.open?.(stream);
        },
  llseek() {
          throw new FS.ErrnoError(70);
        },
  },
  major:(dev) => ((dev) >> 8),
  minor:(dev) => ((dev) & 0xff),
  makedev:(ma, mi) => ((ma) << 8 | (mi)),
  registerDevice(dev, ops) {
        FS.devices[dev] = { stream_ops: ops };
      },
  getDevice:(dev) => FS.devices[dev],
  getMounts(mount) {
        var mounts = [];
        var check = [mount];
  
        while (check.length) {
          var m = check.pop();
  
          mounts.push(m);
  
          check.push(...m.mounts);
        }
  
        return mounts;
      },
  syncfs(populate, callback) {
        if (typeof populate == 'function') {
          callback = populate;
          populate = false;
        }
  
        FS.syncFSRequests++;
  
        if (FS.syncFSRequests > 1) {
          err(`warning: ${FS.syncFSRequests} FS.syncfs operations in flight at once, probably just doing extra work`);
        }
  
        var mounts = FS.getMounts(FS.root.mount);
        var completed = 0;
  
        function doCallback(errCode) {
          assert(FS.syncFSRequests > 0);
          FS.syncFSRequests--;
          return callback(errCode);
        }
  
        function done(errCode) {
          if (errCode) {
            if (!done.errored) {
              done.errored = true;
              return doCallback(errCode);
            }
            return;
          }
          if (++completed >= mounts.length) {
            doCallback(null);
          }
        };
  
        // sync all mounts
        mounts.forEach((mount) => {
          if (!mount.type.syncfs) {
            return done(null);
          }
          mount.type.syncfs(mount, populate, done);
        });
      },
  mount(type, opts, mountpoint) {
        if (typeof type == 'string') {
          // The filesystem was not included, and instead we have an error
          // message stored in the variable.
          throw type;
        }
        var root = mountpoint === '/';
        var pseudo = !mountpoint;
        var node;
  
        if (root && FS.root) {
          throw new FS.ErrnoError(10);
        } else if (!root && !pseudo) {
          var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
  
          mountpoint = lookup.path;  // use the absolute path
          node = lookup.node;
  
          if (FS.isMountpoint(node)) {
            throw new FS.ErrnoError(10);
          }
  
          if (!FS.isDir(node.mode)) {
            throw new FS.ErrnoError(54);
          }
        }
  
        var mount = {
          type,
          opts,
          mountpoint,
          mounts: []
        };
  
        // create a root node for the fs
        var mountRoot = type.mount(mount);
        mountRoot.mount = mount;
        mount.root = mountRoot;
  
        if (root) {
          FS.root = mountRoot;
        } else if (node) {
          // set as a mountpoint
          node.mounted = mount;
  
          // add the new mount to the current mount's children
          if (node.mount) {
            node.mount.mounts.push(mount);
          }
        }
  
        return mountRoot;
      },
  unmount(mountpoint) {
        var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
  
        if (!FS.isMountpoint(lookup.node)) {
          throw new FS.ErrnoError(28);
        }
  
        // destroy the nodes for this mount, and all its child mounts
        var node = lookup.node;
        var mount = node.mounted;
        var mounts = FS.getMounts(mount);
  
        Object.keys(FS.nameTable).forEach((hash) => {
          var current = FS.nameTable[hash];
  
          while (current) {
            var next = current.name_next;
  
            if (mounts.includes(current.mount)) {
              FS.destroyNode(current);
            }
  
            current = next;
          }
        });
  
        // no longer a mountpoint
        node.mounted = null;
  
        // remove this mount from the child mounts
        var idx = node.mount.mounts.indexOf(mount);
        assert(idx !== -1);
        node.mount.mounts.splice(idx, 1);
      },
  lookup(parent, name) {
        return parent.node_ops.lookup(parent, name);
      },
  mknod(path, mode, dev) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        if (!name || name === '.' || name === '..') {
          throw new FS.ErrnoError(28);
        }
        var errCode = FS.mayCreate(parent, name);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        if (!parent.node_ops.mknod) {
          throw new FS.ErrnoError(63);
        }
        return parent.node_ops.mknod(parent, name, mode, dev);
      },
  create(path, mode) {
        mode = mode !== undefined ? mode : 438 /* 0666 */;
        mode &= 4095;
        mode |= 32768;
        return FS.mknod(path, mode, 0);
      },
  mkdir(path, mode) {
        mode = mode !== undefined ? mode : 511 /* 0777 */;
        mode &= 511 | 512;
        mode |= 16384;
        return FS.mknod(path, mode, 0);
      },
  mkdirTree(path, mode) {
        var dirs = path.split('/');
        var d = '';
        for (var i = 0; i < dirs.length; ++i) {
          if (!dirs[i]) continue;
          d += '/' + dirs[i];
          try {
            FS.mkdir(d, mode);
          } catch(e) {
            if (e.errno != 20) throw e;
          }
        }
      },
  mkdev(path, mode, dev) {
        if (typeof dev == 'undefined') {
          dev = mode;
          mode = 438 /* 0666 */;
        }
        mode |= 8192;
        return FS.mknod(path, mode, dev);
      },
  symlink(oldpath, newpath) {
        if (!PATH_FS.resolve(oldpath)) {
          throw new FS.ErrnoError(44);
        }
        var lookup = FS.lookupPath(newpath, { parent: true });
        var parent = lookup.node;
        if (!parent) {
          throw new FS.ErrnoError(44);
        }
        var newname = PATH.basename(newpath);
        var errCode = FS.mayCreate(parent, newname);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        if (!parent.node_ops.symlink) {
          throw new FS.ErrnoError(63);
        }
        return parent.node_ops.symlink(parent, newname, oldpath);
      },
  rename(old_path, new_path) {
        var old_dirname = PATH.dirname(old_path);
        var new_dirname = PATH.dirname(new_path);
        var old_name = PATH.basename(old_path);
        var new_name = PATH.basename(new_path);
        // parents must exist
        var lookup, old_dir, new_dir;
  
        // let the errors from non existent directories percolate up
        lookup = FS.lookupPath(old_path, { parent: true });
        old_dir = lookup.node;
        lookup = FS.lookupPath(new_path, { parent: true });
        new_dir = lookup.node;
  
        if (!old_dir || !new_dir) throw new FS.ErrnoError(44);
        // need to be part of the same mount
        if (old_dir.mount !== new_dir.mount) {
          throw new FS.ErrnoError(75);
        }
        // source must exist
        var old_node = FS.lookupNode(old_dir, old_name);
        // old path should not be an ancestor of the new path
        var relative = PATH_FS.relative(old_path, new_dirname);
        if (relative.charAt(0) !== '.') {
          throw new FS.ErrnoError(28);
        }
        // new path should not be an ancestor of the old path
        relative = PATH_FS.relative(new_path, old_dirname);
        if (relative.charAt(0) !== '.') {
          throw new FS.ErrnoError(55);
        }
        // see if the new path already exists
        var new_node;
        try {
          new_node = FS.lookupNode(new_dir, new_name);
        } catch (e) {
          // not fatal
        }
        // early out if nothing needs to change
        if (old_node === new_node) {
          return;
        }
        // we'll need to delete the old entry
        var isdir = FS.isDir(old_node.mode);
        var errCode = FS.mayDelete(old_dir, old_name, isdir);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        // need delete permissions if we'll be overwriting.
        // need create permissions if new doesn't already exist.
        errCode = new_node ?
          FS.mayDelete(new_dir, new_name, isdir) :
          FS.mayCreate(new_dir, new_name);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        if (!old_dir.node_ops.rename) {
          throw new FS.ErrnoError(63);
        }
        if (FS.isMountpoint(old_node) || (new_node && FS.isMountpoint(new_node))) {
          throw new FS.ErrnoError(10);
        }
        // if we are going to change the parent, check write permissions
        if (new_dir !== old_dir) {
          errCode = FS.nodePermissions(old_dir, 'w');
          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
        }
        // remove the node from the lookup hash
        FS.hashRemoveNode(old_node);
        // do the underlying fs rename
        try {
          old_dir.node_ops.rename(old_node, new_dir, new_name);
          // update old node (we do this here to avoid each backend 
          // needing to)
          old_node.parent = new_dir;
        } catch (e) {
          throw e;
        } finally {
          // add the node back to the hash (in case node_ops.rename
          // changed its name)
          FS.hashAddNode(old_node);
        }
      },
  rmdir(path) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var errCode = FS.mayDelete(parent, name, true);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        if (!parent.node_ops.rmdir) {
          throw new FS.ErrnoError(63);
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(10);
        }
        parent.node_ops.rmdir(parent, name);
        FS.destroyNode(node);
      },
  readdir(path) {
        var lookup = FS.lookupPath(path, { follow: true });
        var node = lookup.node;
        if (!node.node_ops.readdir) {
          throw new FS.ErrnoError(54);
        }
        return node.node_ops.readdir(node);
      },
  unlink(path) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        if (!parent) {
          throw new FS.ErrnoError(44);
        }
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var errCode = FS.mayDelete(parent, name, false);
        if (errCode) {
          // According to POSIX, we should map EISDIR to EPERM, but
          // we instead do what Linux does (and we must, as we use
          // the musl linux libc).
          throw new FS.ErrnoError(errCode);
        }
        if (!parent.node_ops.unlink) {
          throw new FS.ErrnoError(63);
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(10);
        }
        parent.node_ops.unlink(parent, name);
        FS.destroyNode(node);
      },
  readlink(path) {
        var lookup = FS.lookupPath(path);
        var link = lookup.node;
        if (!link) {
          throw new FS.ErrnoError(44);
        }
        if (!link.node_ops.readlink) {
          throw new FS.ErrnoError(28);
        }
        return PATH_FS.resolve(FS.getPath(link.parent), link.node_ops.readlink(link));
      },
  stat(path, dontFollow) {
        var lookup = FS.lookupPath(path, { follow: !dontFollow });
        var node = lookup.node;
        if (!node) {
          throw new FS.ErrnoError(44);
        }
        if (!node.node_ops.getattr) {
          throw new FS.ErrnoError(63);
        }
        return node.node_ops.getattr(node);
      },
  lstat(path) {
        return FS.stat(path, true);
      },
  chmod(path, mode, dontFollow) {
        var node;
        if (typeof path == 'string') {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(63);
        }
        node.node_ops.setattr(node, {
          mode: (mode & 4095) | (node.mode & ~4095),
          timestamp: Date.now()
        });
      },
  lchmod(path, mode) {
        FS.chmod(path, mode, true);
      },
  fchmod(fd, mode) {
        var stream = FS.getStreamChecked(fd);
        FS.chmod(stream.node, mode);
      },
  chown(path, uid, gid, dontFollow) {
        var node;
        if (typeof path == 'string') {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(63);
        }
        node.node_ops.setattr(node, {
          timestamp: Date.now()
          // we ignore the uid / gid for now
        });
      },
  lchown(path, uid, gid) {
        FS.chown(path, uid, gid, true);
      },
  fchown(fd, uid, gid) {
        var stream = FS.getStreamChecked(fd);
        FS.chown(stream.node, uid, gid);
      },
  truncate(path, len) {
        if (len < 0) {
          throw new FS.ErrnoError(28);
        }
        var node;
        if (typeof path == 'string') {
          var lookup = FS.lookupPath(path, { follow: true });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(63);
        }
        if (FS.isDir(node.mode)) {
          throw new FS.ErrnoError(31);
        }
        if (!FS.isFile(node.mode)) {
          throw new FS.ErrnoError(28);
        }
        var errCode = FS.nodePermissions(node, 'w');
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        node.node_ops.setattr(node, {
          size: len,
          timestamp: Date.now()
        });
      },
  ftruncate(fd, len) {
        var stream = FS.getStreamChecked(fd);
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(28);
        }
        FS.truncate(stream.node, len);
      },
  utime(path, atime, mtime) {
        var lookup = FS.lookupPath(path, { follow: true });
        var node = lookup.node;
        node.node_ops.setattr(node, {
          timestamp: Math.max(atime, mtime)
        });
      },
  open(path, flags, mode) {
        if (path === "") {
          throw new FS.ErrnoError(44);
        }
        flags = typeof flags == 'string' ? FS_modeStringToFlags(flags) : flags;
        if ((flags & 64)) {
          mode = typeof mode == 'undefined' ? 438 /* 0666 */ : mode;
          mode = (mode & 4095) | 32768;
        } else {
          mode = 0;
        }
        var node;
        if (typeof path == 'object') {
          node = path;
        } else {
          path = PATH.normalize(path);
          try {
            var lookup = FS.lookupPath(path, {
              follow: !(flags & 131072)
            });
            node = lookup.node;
          } catch (e) {
            // ignore
          }
        }
        // perhaps we need to create the node
        var created = false;
        if ((flags & 64)) {
          if (node) {
            // if O_CREAT and O_EXCL are set, error out if the node already exists
            if ((flags & 128)) {
              throw new FS.ErrnoError(20);
            }
          } else {
            // node doesn't exist, try to create it
            node = FS.mknod(path, mode, 0);
            created = true;
          }
        }
        if (!node) {
          throw new FS.ErrnoError(44);
        }
        // can't truncate a device
        if (FS.isChrdev(node.mode)) {
          flags &= ~512;
        }
        // if asked only for a directory, then this must be one
        if ((flags & 65536) && !FS.isDir(node.mode)) {
          throw new FS.ErrnoError(54);
        }
        // check permissions, if this is not a file we just created now (it is ok to
        // create and write to a file with read-only permissions; it is read-only
        // for later use)
        if (!created) {
          var errCode = FS.mayOpen(node, flags);
          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
        }
        // do truncation if necessary
        if ((flags & 512) && !created) {
          FS.truncate(node, 0);
        }
        // we've already handled these, don't pass down to the underlying vfs
        flags &= ~(128 | 512 | 131072);
  
        // register the stream with the filesystem
        var stream = FS.createStream({
          node,
          path: FS.getPath(node),  // we want the absolute path to the node
          flags,
          seekable: true,
          position: 0,
          stream_ops: node.stream_ops,
          // used by the file family libc calls (fopen, fwrite, ferror, etc.)
          ungotten: [],
          error: false
        });
        // call the new stream's open function
        if (stream.stream_ops.open) {
          stream.stream_ops.open(stream);
        }
        if (Module['logReadFiles'] && !(flags & 1)) {
          if (!FS.readFiles) FS.readFiles = {};
          if (!(path in FS.readFiles)) {
            FS.readFiles[path] = 1;
          }
        }
        return stream;
      },
  close(stream) {
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if (stream.getdents) stream.getdents = null; // free readdir state
        try {
          if (stream.stream_ops.close) {
            stream.stream_ops.close(stream);
          }
        } catch (e) {
          throw e;
        } finally {
          FS.closeStream(stream.fd);
        }
        stream.fd = null;
      },
  isClosed(stream) {
        return stream.fd === null;
      },
  llseek(stream, offset, whence) {
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if (!stream.seekable || !stream.stream_ops.llseek) {
          throw new FS.ErrnoError(70);
        }
        if (whence != 0 && whence != 1 && whence != 2) {
          throw new FS.ErrnoError(28);
        }
        stream.position = stream.stream_ops.llseek(stream, offset, whence);
        stream.ungotten = [];
        return stream.position;
      },
  read(stream, buffer, offset, length, position) {
        assert(offset >= 0);
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(28);
        }
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if ((stream.flags & 2097155) === 1) {
          throw new FS.ErrnoError(8);
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(31);
        }
        if (!stream.stream_ops.read) {
          throw new FS.ErrnoError(28);
        }
        var seeking = typeof position != 'undefined';
        if (!seeking) {
          position = stream.position;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(70);
        }
        var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
        if (!seeking) stream.position += bytesRead;
        return bytesRead;
      },
  write(stream, buffer, offset, length, position, canOwn) {
        assert(offset >= 0);
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(28);
        }
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(8);
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(31);
        }
        if (!stream.stream_ops.write) {
          throw new FS.ErrnoError(28);
        }
        if (stream.seekable && stream.flags & 1024) {
          // seek to the end before writing in append mode
          FS.llseek(stream, 0, 2);
        }
        var seeking = typeof position != 'undefined';
        if (!seeking) {
          position = stream.position;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(70);
        }
        var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
        if (!seeking) stream.position += bytesWritten;
        return bytesWritten;
      },
  allocate(stream, offset, length) {
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if (offset < 0 || length <= 0) {
          throw new FS.ErrnoError(28);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(8);
        }
        if (!FS.isFile(stream.node.mode) && !FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(43);
        }
        if (!stream.stream_ops.allocate) {
          throw new FS.ErrnoError(138);
        }
        stream.stream_ops.allocate(stream, offset, length);
      },
  mmap(stream, length, position, prot, flags) {
        // User requests writing to file (prot & PROT_WRITE != 0).
        // Checking if we have permissions to write to the file unless
        // MAP_PRIVATE flag is set. According to POSIX spec it is possible
        // to write to file opened in read-only mode with MAP_PRIVATE flag,
        // as all modifications will be visible only in the memory of
        // the current process.
        if ((prot & 2) !== 0
            && (flags & 2) === 0
            && (stream.flags & 2097155) !== 2) {
          throw new FS.ErrnoError(2);
        }
        if ((stream.flags & 2097155) === 1) {
          throw new FS.ErrnoError(2);
        }
        if (!stream.stream_ops.mmap) {
          throw new FS.ErrnoError(43);
        }
        return stream.stream_ops.mmap(stream, length, position, prot, flags);
      },
  msync(stream, buffer, offset, length, mmapFlags) {
        assert(offset >= 0);
        if (!stream.stream_ops.msync) {
          return 0;
        }
        return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags);
      },
  ioctl(stream, cmd, arg) {
        if (!stream.stream_ops.ioctl) {
          throw new FS.ErrnoError(59);
        }
        return stream.stream_ops.ioctl(stream, cmd, arg);
      },
  readFile(path, opts = {}) {
        opts.flags = opts.flags || 0;
        opts.encoding = opts.encoding || 'binary';
        if (opts.encoding !== 'utf8' && opts.encoding !== 'binary') {
          throw new Error(`Invalid encoding type "${opts.encoding}"`);
        }
        var ret;
        var stream = FS.open(path, opts.flags);
        var stat = FS.stat(path);
        var length = stat.size;
        var buf = new Uint8Array(length);
        FS.read(stream, buf, 0, length, 0);
        if (opts.encoding === 'utf8') {
          ret = UTF8ArrayToString(buf, 0);
        } else if (opts.encoding === 'binary') {
          ret = buf;
        }
        FS.close(stream);
        return ret;
      },
  writeFile(path, data, opts = {}) {
        opts.flags = opts.flags || 577;
        var stream = FS.open(path, opts.flags, opts.mode);
        if (typeof data == 'string') {
          var buf = new Uint8Array(lengthBytesUTF8(data)+1);
          var actualNumBytes = stringToUTF8Array(data, buf, 0, buf.length);
          FS.write(stream, buf, 0, actualNumBytes, undefined, opts.canOwn);
        } else if (ArrayBuffer.isView(data)) {
          FS.write(stream, data, 0, data.byteLength, undefined, opts.canOwn);
        } else {
          throw new Error('Unsupported data type');
        }
        FS.close(stream);
      },
  cwd:() => FS.currentPath,
  chdir(path) {
        var lookup = FS.lookupPath(path, { follow: true });
        if (lookup.node === null) {
          throw new FS.ErrnoError(44);
        }
        if (!FS.isDir(lookup.node.mode)) {
          throw new FS.ErrnoError(54);
        }
        var errCode = FS.nodePermissions(lookup.node, 'x');
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        FS.currentPath = lookup.path;
      },
  createDefaultDirectories() {
        FS.mkdir('/tmp');
        FS.mkdir('/home');
        FS.mkdir('/home/web_user');
      },
  createDefaultDevices() {
        // create /dev
        FS.mkdir('/dev');
        // setup /dev/null
        FS.registerDevice(FS.makedev(1, 3), {
          read: () => 0,
          write: (stream, buffer, offset, length, pos) => length,
        });
        FS.mkdev('/dev/null', FS.makedev(1, 3));
        // setup /dev/tty and /dev/tty1
        // stderr needs to print output using err() rather than out()
        // so we register a second tty just for it.
        TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
        TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
        FS.mkdev('/dev/tty', FS.makedev(5, 0));
        FS.mkdev('/dev/tty1', FS.makedev(6, 0));
        // setup /dev/[u]random
        // use a buffer to avoid overhead of individual crypto calls per byte
        var randomBuffer = new Uint8Array(1024), randomLeft = 0;
        var randomByte = () => {
          if (randomLeft === 0) {
            randomLeft = randomFill(randomBuffer).byteLength;
          }
          return randomBuffer[--randomLeft];
        };
        FS.createDevice('/dev', 'random', randomByte);
        FS.createDevice('/dev', 'urandom', randomByte);
        // we're not going to emulate the actual shm device,
        // just create the tmp dirs that reside in it commonly
        FS.mkdir('/dev/shm');
        FS.mkdir('/dev/shm/tmp');
      },
  createSpecialDirectories() {
        // create /proc/self/fd which allows /proc/self/fd/6 => readlink gives the
        // name of the stream for fd 6 (see test_unistd_ttyname)
        FS.mkdir('/proc');
        var proc_self = FS.mkdir('/proc/self');
        FS.mkdir('/proc/self/fd');
        FS.mount({
          mount() {
            var node = FS.createNode(proc_self, 'fd', 16384 | 511 /* 0777 */, 73);
            node.node_ops = {
              lookup(parent, name) {
                var fd = +name;
                var stream = FS.getStreamChecked(fd);
                var ret = {
                  parent: null,
                  mount: { mountpoint: 'fake' },
                  node_ops: { readlink: () => stream.path },
                };
                ret.parent = ret; // make it look like a simple root node
                return ret;
              }
            };
            return node;
          }
        }, {}, '/proc/self/fd');
      },
  createStandardStreams() {
        // TODO deprecate the old functionality of a single
        // input / output callback and that utilizes FS.createDevice
        // and instead require a unique set of stream ops
  
        // by default, we symlink the standard streams to the
        // default tty devices. however, if the standard streams
        // have been overwritten we create a unique device for
        // them instead.
        if (Module['stdin']) {
          FS.createDevice('/dev', 'stdin', Module['stdin']);
        } else {
          FS.symlink('/dev/tty', '/dev/stdin');
        }
        if (Module['stdout']) {
          FS.createDevice('/dev', 'stdout', null, Module['stdout']);
        } else {
          FS.symlink('/dev/tty', '/dev/stdout');
        }
        if (Module['stderr']) {
          FS.createDevice('/dev', 'stderr', null, Module['stderr']);
        } else {
          FS.symlink('/dev/tty1', '/dev/stderr');
        }
  
        // open default streams for the stdin, stdout and stderr devices
        var stdin = FS.open('/dev/stdin', 0);
        var stdout = FS.open('/dev/stdout', 1);
        var stderr = FS.open('/dev/stderr', 1);
        assert(stdin.fd === 0, `invalid handle for stdin (${stdin.fd})`);
        assert(stdout.fd === 1, `invalid handle for stdout (${stdout.fd})`);
        assert(stderr.fd === 2, `invalid handle for stderr (${stderr.fd})`);
      },
  staticInit() {
        // Some errors may happen quite a bit, to avoid overhead we reuse them (and suffer a lack of stack info)
        [44].forEach((code) => {
          FS.genericErrors[code] = new FS.ErrnoError(code);
          FS.genericErrors[code].stack = '<generic error, no stack>';
        });
  
        FS.nameTable = new Array(4096);
  
        FS.mount(MEMFS, {}, '/');
  
        FS.createDefaultDirectories();
        FS.createDefaultDevices();
        FS.createSpecialDirectories();
  
        FS.filesystems = {
          'MEMFS': MEMFS,
        };
      },
  init(input, output, error) {
        assert(!FS.init.initialized, 'FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)');
        FS.init.initialized = true;
  
        // Allow Module.stdin etc. to provide defaults, if none explicitly passed to us here
        Module['stdin'] = input || Module['stdin'];
        Module['stdout'] = output || Module['stdout'];
        Module['stderr'] = error || Module['stderr'];
  
        FS.createStandardStreams();
      },
  quit() {
        FS.init.initialized = false;
        // force-flush all streams, so we get musl std streams printed out
        _fflush(0);
        // close all of our streams
        for (var i = 0; i < FS.streams.length; i++) {
          var stream = FS.streams[i];
          if (!stream) {
            continue;
          }
          FS.close(stream);
        }
      },
  findObject(path, dontResolveLastLink) {
        var ret = FS.analyzePath(path, dontResolveLastLink);
        if (!ret.exists) {
          return null;
        }
        return ret.object;
      },
  analyzePath(path, dontResolveLastLink) {
        // operate from within the context of the symlink's target
        try {
          var lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
          path = lookup.path;
        } catch (e) {
        }
        var ret = {
          isRoot: false, exists: false, error: 0, name: null, path: null, object: null,
          parentExists: false, parentPath: null, parentObject: null
        };
        try {
          var lookup = FS.lookupPath(path, { parent: true });
          ret.parentExists = true;
          ret.parentPath = lookup.path;
          ret.parentObject = lookup.node;
          ret.name = PATH.basename(path);
          lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
          ret.exists = true;
          ret.path = lookup.path;
          ret.object = lookup.node;
          ret.name = lookup.node.name;
          ret.isRoot = lookup.path === '/';
        } catch (e) {
          ret.error = e.errno;
        };
        return ret;
      },
  createPath(parent, path, canRead, canWrite) {
        parent = typeof parent == 'string' ? parent : FS.getPath(parent);
        var parts = path.split('/').reverse();
        while (parts.length) {
          var part = parts.pop();
          if (!part) continue;
          var current = PATH.join2(parent, part);
          try {
            FS.mkdir(current);
          } catch (e) {
            // ignore EEXIST
          }
          parent = current;
        }
        return current;
      },
  createFile(parent, name, properties, canRead, canWrite) {
        var path = PATH.join2(typeof parent == 'string' ? parent : FS.getPath(parent), name);
        var mode = FS_getMode(canRead, canWrite);
        return FS.create(path, mode);
      },
  createDataFile(parent, name, data, canRead, canWrite, canOwn) {
        var path = name;
        if (parent) {
          parent = typeof parent == 'string' ? parent : FS.getPath(parent);
          path = name ? PATH.join2(parent, name) : parent;
        }
        var mode = FS_getMode(canRead, canWrite);
        var node = FS.create(path, mode);
        if (data) {
          if (typeof data == 'string') {
            var arr = new Array(data.length);
            for (var i = 0, len = data.length; i < len; ++i) arr[i] = data.charCodeAt(i);
            data = arr;
          }
          // make sure we can write to the file
          FS.chmod(node, mode | 146);
          var stream = FS.open(node, 577);
          FS.write(stream, data, 0, data.length, 0, canOwn);
          FS.close(stream);
          FS.chmod(node, mode);
        }
      },
  createDevice(parent, name, input, output) {
        var path = PATH.join2(typeof parent == 'string' ? parent : FS.getPath(parent), name);
        var mode = FS_getMode(!!input, !!output);
        if (!FS.createDevice.major) FS.createDevice.major = 64;
        var dev = FS.makedev(FS.createDevice.major++, 0);
        // Create a fake device that a set of stream ops to emulate
        // the old behavior.
        FS.registerDevice(dev, {
          open(stream) {
            stream.seekable = false;
          },
          close(stream) {
            // flush any pending line data
            if (output?.buffer?.length) {
              output(10);
            }
          },
          read(stream, buffer, offset, length, pos /* ignored */) {
            var bytesRead = 0;
            for (var i = 0; i < length; i++) {
              var result;
              try {
                result = input();
              } catch (e) {
                throw new FS.ErrnoError(29);
              }
              if (result === undefined && bytesRead === 0) {
                throw new FS.ErrnoError(6);
              }
              if (result === null || result === undefined) break;
              bytesRead++;
              buffer[offset+i] = result;
            }
            if (bytesRead) {
              stream.node.timestamp = Date.now();
            }
            return bytesRead;
          },
          write(stream, buffer, offset, length, pos) {
            for (var i = 0; i < length; i++) {
              try {
                output(buffer[offset+i]);
              } catch (e) {
                throw new FS.ErrnoError(29);
              }
            }
            if (length) {
              stream.node.timestamp = Date.now();
            }
            return i;
          }
        });
        return FS.mkdev(path, mode, dev);
      },
  forceLoadFile(obj) {
        if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
        if (typeof XMLHttpRequest != 'undefined') {
          throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
        } else { // Command-line.
          try {
            obj.contents = readBinary(obj.url);
            obj.usedBytes = obj.contents.length;
          } catch (e) {
            throw new FS.ErrnoError(29);
          }
        }
      },
  createLazyFile(parent, name, url, canRead, canWrite) {
        // Lazy chunked Uint8Array (implements get and length from Uint8Array).
        // Actual getting is abstracted away for eventual reuse.
        class LazyUint8Array {
          constructor() {
            this.lengthKnown = false;
            this.chunks = []; // Loaded chunks. Index is the chunk number
          }
          get(idx) {
            if (idx > this.length-1 || idx < 0) {
              return undefined;
            }
            var chunkOffset = idx % this.chunkSize;
            var chunkNum = (idx / this.chunkSize)|0;
            return this.getter(chunkNum)[chunkOffset];
          }
          setDataGetter(getter) {
            this.getter = getter;
          }
          cacheLength() {
            // Find length
            var xhr = new XMLHttpRequest();
            xhr.open('HEAD', url, false);
            xhr.send(null);
            if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
            var datalength = Number(xhr.getResponseHeader("Content-length"));
            var header;
            var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
            var usesGzip = (header = xhr.getResponseHeader("Content-Encoding")) && header === "gzip";
  
            var chunkSize = 1024*1024; // Chunk size in bytes
  
            if (!hasByteServing) chunkSize = datalength;
  
            // Function to get a range from the remote URL.
            var doXHR = (from, to) => {
              if (from > to) throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
              if (to > datalength-1) throw new Error("only " + datalength + " bytes available! programmer error!");
  
              // TODO: Use mozResponseArrayBuffer, responseStream, etc. if available.
              var xhr = new XMLHttpRequest();
              xhr.open('GET', url, false);
              if (datalength !== chunkSize) xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
  
              // Some hints to the browser that we want binary data.
              xhr.responseType = 'arraybuffer';
              if (xhr.overrideMimeType) {
                xhr.overrideMimeType('text/plain; charset=x-user-defined');
              }
  
              xhr.send(null);
              if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
              if (xhr.response !== undefined) {
                return new Uint8Array(/** @type{Array<number>} */(xhr.response || []));
              }
              return intArrayFromString(xhr.responseText || '', true);
            };
            var lazyArray = this;
            lazyArray.setDataGetter((chunkNum) => {
              var start = chunkNum * chunkSize;
              var end = (chunkNum+1) * chunkSize - 1; // including this byte
              end = Math.min(end, datalength-1); // if datalength-1 is selected, this is the last block
              if (typeof lazyArray.chunks[chunkNum] == 'undefined') {
                lazyArray.chunks[chunkNum] = doXHR(start, end);
              }
              if (typeof lazyArray.chunks[chunkNum] == 'undefined') throw new Error('doXHR failed!');
              return lazyArray.chunks[chunkNum];
            });
  
            if (usesGzip || !datalength) {
              // if the server uses gzip or doesn't supply the length, we have to download the whole file to get the (uncompressed) length
              chunkSize = datalength = 1; // this will force getter(0)/doXHR do download the whole file
              datalength = this.getter(0).length;
              chunkSize = datalength;
              out("LazyFiles on gzip forces download of the whole file when length is accessed");
            }
  
            this._length = datalength;
            this._chunkSize = chunkSize;
            this.lengthKnown = true;
          }
          get length() {
            if (!this.lengthKnown) {
              this.cacheLength();
            }
            return this._length;
          }
          get chunkSize() {
            if (!this.lengthKnown) {
              this.cacheLength();
            }
            return this._chunkSize;
          }
        }
  
        if (typeof XMLHttpRequest != 'undefined') {
          if (!ENVIRONMENT_IS_WORKER) throw 'Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc';
          var lazyArray = new LazyUint8Array();
          var properties = { isDevice: false, contents: lazyArray };
        } else {
          var properties = { isDevice: false, url: url };
        }
  
        var node = FS.createFile(parent, name, properties, canRead, canWrite);
        // This is a total hack, but I want to get this lazy file code out of the
        // core of MEMFS. If we want to keep this lazy file concept I feel it should
        // be its own thin LAZYFS proxying calls to MEMFS.
        if (properties.contents) {
          node.contents = properties.contents;
        } else if (properties.url) {
          node.contents = null;
          node.url = properties.url;
        }
        // Add a function that defers querying the file size until it is asked the first time.
        Object.defineProperties(node, {
          usedBytes: {
            get: function() { return this.contents.length; }
          }
        });
        // override each stream op with one that tries to force load the lazy file first
        var stream_ops = {};
        var keys = Object.keys(node.stream_ops);
        keys.forEach((key) => {
          var fn = node.stream_ops[key];
          stream_ops[key] = (...args) => {
            FS.forceLoadFile(node);
            return fn(...args);
          };
        });
        function writeChunks(stream, buffer, offset, length, position) {
          var contents = stream.node.contents;
          if (position >= contents.length)
            return 0;
          var size = Math.min(contents.length - position, length);
          assert(size >= 0);
          if (contents.slice) { // normal array
            for (var i = 0; i < size; i++) {
              buffer[offset + i] = contents[position + i];
            }
          } else {
            for (var i = 0; i < size; i++) { // LazyUint8Array from sync binary XHR
              buffer[offset + i] = contents.get(position + i);
            }
          }
          return size;
        }
        // use a custom read function
        stream_ops.read = (stream, buffer, offset, length, position) => {
          FS.forceLoadFile(node);
          return writeChunks(stream, buffer, offset, length, position)
        };
        // use a custom mmap function
        stream_ops.mmap = (stream, length, position, prot, flags) => {
          FS.forceLoadFile(node);
          var ptr = mmapAlloc(length);
          if (!ptr) {
            throw new FS.ErrnoError(48);
          }
          writeChunks(stream, HEAP8, ptr, length, position);
          return { ptr, allocated: true };
        };
        node.stream_ops = stream_ops;
        return node;
      },
  absolutePath() {
        abort('FS.absolutePath has been removed; use PATH_FS.resolve instead');
      },
  createFolder() {
        abort('FS.createFolder has been removed; use FS.mkdir instead');
      },
  createLink() {
        abort('FS.createLink has been removed; use FS.symlink instead');
      },
  joinPath() {
        abort('FS.joinPath has been removed; use PATH.join instead');
      },
  mmapAlloc() {
        abort('FS.mmapAlloc has been replaced by the top level function mmapAlloc');
      },
  standardizePath() {
        abort('FS.standardizePath has been removed; use PATH.normalize instead');
      },
  };
  
  var SYSCALLS = {
  DEFAULT_POLLMASK:5,
  calculateAt(dirfd, path, allowEmpty) {
        if (PATH.isAbs(path)) {
          return path;
        }
        // relative path
        var dir;
        if (dirfd === -100) {
          dir = FS.cwd();
        } else {
          var dirstream = SYSCALLS.getStreamFromFD(dirfd);
          dir = dirstream.path;
        }
        if (path.length == 0) {
          if (!allowEmpty) {
            throw new FS.ErrnoError(44);;
          }
          return dir;
        }
        return PATH.join2(dir, path);
      },
  doStat(func, path, buf) {
        var stat = func(path);
        HEAP32[((buf)>>2)] = stat.dev;
        HEAP32[(((buf)+(4))>>2)] = stat.mode;
        HEAPU32[(((buf)+(8))>>2)] = stat.nlink;
        HEAP32[(((buf)+(12))>>2)] = stat.uid;
        HEAP32[(((buf)+(16))>>2)] = stat.gid;
        HEAP32[(((buf)+(20))>>2)] = stat.rdev;
        (tempI64 = [stat.size>>>0,(tempDouble = stat.size,(+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? (+(Math.floor((tempDouble)/4294967296.0)))>>>0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)], HEAP32[(((buf)+(24))>>2)] = tempI64[0],HEAP32[(((buf)+(28))>>2)] = tempI64[1]);
        HEAP32[(((buf)+(32))>>2)] = 4096;
        HEAP32[(((buf)+(36))>>2)] = stat.blocks;
        var atime = stat.atime.getTime();
        var mtime = stat.mtime.getTime();
        var ctime = stat.ctime.getTime();
        (tempI64 = [Math.floor(atime / 1000)>>>0,(tempDouble = Math.floor(atime / 1000),(+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? (+(Math.floor((tempDouble)/4294967296.0)))>>>0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)], HEAP32[(((buf)+(40))>>2)] = tempI64[0],HEAP32[(((buf)+(44))>>2)] = tempI64[1]);
        HEAPU32[(((buf)+(48))>>2)] = (atime % 1000) * 1000;
        (tempI64 = [Math.floor(mtime / 1000)>>>0,(tempDouble = Math.floor(mtime / 1000),(+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? (+(Math.floor((tempDouble)/4294967296.0)))>>>0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)], HEAP32[(((buf)+(56))>>2)] = tempI64[0],HEAP32[(((buf)+(60))>>2)] = tempI64[1]);
        HEAPU32[(((buf)+(64))>>2)] = (mtime % 1000) * 1000;
        (tempI64 = [Math.floor(ctime / 1000)>>>0,(tempDouble = Math.floor(ctime / 1000),(+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? (+(Math.floor((tempDouble)/4294967296.0)))>>>0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)], HEAP32[(((buf)+(72))>>2)] = tempI64[0],HEAP32[(((buf)+(76))>>2)] = tempI64[1]);
        HEAPU32[(((buf)+(80))>>2)] = (ctime % 1000) * 1000;
        (tempI64 = [stat.ino>>>0,(tempDouble = stat.ino,(+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? (+(Math.floor((tempDouble)/4294967296.0)))>>>0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)], HEAP32[(((buf)+(88))>>2)] = tempI64[0],HEAP32[(((buf)+(92))>>2)] = tempI64[1]);
        return 0;
      },
  doMsync(addr, stream, len, flags, offset) {
        if (!FS.isFile(stream.node.mode)) {
          throw new FS.ErrnoError(43);
        }
        if (flags & 2) {
          // MAP_PRIVATE calls need not to be synced back to underlying fs
          return 0;
        }
        var buffer = HEAPU8.slice(addr, addr + len);
        FS.msync(stream, buffer, offset, len, flags);
      },
  getStreamFromFD(fd) {
        var stream = FS.getStreamChecked(fd);
        return stream;
      },
  varargs:undefined,
  getStr(ptr) {
        var ret = UTF8ToString(ptr);
        return ret;
      },
  };
  function _fd_close(fd) {
  try {
  
      var stream = SYSCALLS.getStreamFromFD(fd);
      FS.close(stream);
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return e.errno;
  }
  }

  
  var convertI32PairToI53Checked = (lo, hi) => {
      assert(lo == (lo >>> 0) || lo == (lo|0)); // lo should either be a i32 or a u32
      assert(hi === (hi|0));                    // hi should be a i32
      return ((hi + 0x200000) >>> 0 < 0x400001 - !!lo) ? (lo >>> 0) + hi * 4294967296 : NaN;
    };
  function _fd_seek(fd,offset_low, offset_high,whence,newOffset) {
    var offset = convertI32PairToI53Checked(offset_low, offset_high);
  
    
  try {
  
      if (isNaN(offset)) return 61;
      var stream = SYSCALLS.getStreamFromFD(fd);
      FS.llseek(stream, offset, whence);
      (tempI64 = [stream.position>>>0,(tempDouble = stream.position,(+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? (+(Math.floor((tempDouble)/4294967296.0)))>>>0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)], HEAP32[((newOffset)>>2)] = tempI64[0],HEAP32[(((newOffset)+(4))>>2)] = tempI64[1]);
      if (stream.getdents && offset === 0 && whence === 0) stream.getdents = null; // reset readdir state
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return e.errno;
  }
  ;
  }

  /** @param {number=} offset */
  var doWritev = (stream, iov, iovcnt, offset) => {
      var ret = 0;
      for (var i = 0; i < iovcnt; i++) {
        var ptr = HEAPU32[((iov)>>2)];
        var len = HEAPU32[(((iov)+(4))>>2)];
        iov += 8;
        var curr = FS.write(stream, HEAP8, ptr, len, offset);
        if (curr < 0) return -1;
        ret += curr;
        if (typeof offset != 'undefined') {
          offset += curr;
        }
      }
      return ret;
    };
  
  function _fd_write(fd, iov, iovcnt, pnum) {
  try {
  
      var stream = SYSCALLS.getStreamFromFD(fd);
      var num = doWritev(stream, iov, iovcnt);
      HEAPU32[((pnum)>>2)] = num;
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return e.errno;
  }
  }




  
  var stringToUTF8 = (str, outPtr, maxBytesToWrite) => {
      assert(typeof maxBytesToWrite == 'number', 'stringToUTF8(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!');
      return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
    };
  
  var stackAlloc = (sz) => __emscripten_stack_alloc(sz);
  var stringToUTF8OnStack = (str) => {
      var size = lengthBytesUTF8(str) + 1;
      var ret = stackAlloc(size);
      stringToUTF8(str, ret, size);
      return ret;
    };

  var runAndAbortIfError = (func) => {
      try {
        return func();
      } catch (e) {
        abort(e);
      }
    };
  
  
  var sigToWasmTypes = (sig) => {
      assert(!sig.includes('j'), 'i64 not permitted in function signatures when WASM_BIGINT is disabled');
      var typeNames = {
        'i': 'i32',
        'j': 'i64',
        'f': 'f32',
        'd': 'f64',
        'e': 'externref',
        'p': 'i32',
      };
      var type = {
        parameters: [],
        results: sig[0] == 'v' ? [] : [typeNames[sig[0]]]
      };
      for (var i = 1; i < sig.length; ++i) {
        assert(sig[i] in typeNames, 'invalid signature char: ' + sig[i]);
        type.parameters.push(typeNames[sig[i]]);
      }
      return type;
    };
  
  var runtimeKeepalivePush = () => {
      runtimeKeepaliveCounter += 1;
    };
  
  var runtimeKeepalivePop = () => {
      assert(runtimeKeepaliveCounter > 0);
      runtimeKeepaliveCounter -= 1;
    };
  
  
  var Asyncify = {
  instrumentWasmImports(imports) {
        var importPattern = /^(invoke_.*|__asyncjs__.*)$/;
  
        for (let [x, original] of Object.entries(imports)) {
          if (typeof original == 'function') {
            let isAsyncifyImport = original.isAsync || importPattern.test(x);
            imports[x] = (...args) => {
              var originalAsyncifyState = Asyncify.state;
              try {
                return original(...args);
              } finally {
                // Only asyncify-declared imports are allowed to change the
                // state.
                // Changing the state from normal to disabled is allowed (in any
                // function) as that is what shutdown does (and we don't have an
                // explicit list of shutdown imports).
                var changedToDisabled =
                      originalAsyncifyState === Asyncify.State.Normal &&
                      Asyncify.state        === Asyncify.State.Disabled;
                // invoke_* functions are allowed to change the state if we do
                // not ignore indirect calls.
                var ignoredInvoke = x.startsWith('invoke_') &&
                                    true;
                if (Asyncify.state !== originalAsyncifyState &&
                    !isAsyncifyImport &&
                    !changedToDisabled &&
                    !ignoredInvoke) {
                  throw new Error(`import ${x} was not in ASYNCIFY_IMPORTS, but changed the state`);
                }
              }
            };
          }
        }
      },
  instrumentWasmExports(exports) {
        var ret = {};
        for (let [x, original] of Object.entries(exports)) {
          if (typeof original == 'function') {
            ret[x] = (...args) => {
              Asyncify.exportCallStack.push(x);
              try {
                return original(...args);
              } finally {
                if (!ABORT) {
                  var y = Asyncify.exportCallStack.pop();
                  assert(y === x);
                  Asyncify.maybeStopUnwind();
                }
              }
            };
          } else {
            ret[x] = original;
          }
        }
        return ret;
      },
  State:{
  Normal:0,
  Unwinding:1,
  Rewinding:2,
  Disabled:3,
  },
  state:0,
  StackSize:4096,
  currData:null,
  handleSleepReturnValue:0,
  exportCallStack:[],
  callStackNameToId:{
  },
  callStackIdToName:{
  },
  callStackId:0,
  asyncPromiseHandlers:null,
  sleepCallbacks:[],
  getCallStackId(funcName) {
        var id = Asyncify.callStackNameToId[funcName];
        if (id === undefined) {
          id = Asyncify.callStackId++;
          Asyncify.callStackNameToId[funcName] = id;
          Asyncify.callStackIdToName[id] = funcName;
        }
        return id;
      },
  maybeStopUnwind() {
        if (Asyncify.currData &&
            Asyncify.state === Asyncify.State.Unwinding &&
            Asyncify.exportCallStack.length === 0) {
          // We just finished unwinding.
          // Be sure to set the state before calling any other functions to avoid
          // possible infinite recursion here (For example in debug pthread builds
          // the dbg() function itself can call back into WebAssembly to get the
          // current pthread_self() pointer).
          Asyncify.state = Asyncify.State.Normal;
          
          // Keep the runtime alive so that a re-wind can be done later.
          runAndAbortIfError(_asyncify_stop_unwind);
          if (typeof Fibers != 'undefined') {
            Fibers.trampoline();
          }
        }
      },
  whenDone() {
        assert(Asyncify.currData, 'Tried to wait for an async operation when none is in progress.');
        assert(!Asyncify.asyncPromiseHandlers, 'Cannot have multiple async operations in flight at once');
        return new Promise((resolve, reject) => {
          Asyncify.asyncPromiseHandlers = { resolve, reject };
        });
      },
  allocateData() {
        // An asyncify data structure has three fields:
        //  0  current stack pos
        //  4  max stack pos
        //  8  id of function at bottom of the call stack (callStackIdToName[id] == name of js function)
        //
        // The Asyncify ABI only interprets the first two fields, the rest is for the runtime.
        // We also embed a stack in the same memory region here, right next to the structure.
        // This struct is also defined as asyncify_data_t in emscripten/fiber.h
        var ptr = _malloc(12 + Asyncify.StackSize);
        Asyncify.setDataHeader(ptr, ptr + 12, Asyncify.StackSize);
        Asyncify.setDataRewindFunc(ptr);
        return ptr;
      },
  setDataHeader(ptr, stack, stackSize) {
        HEAPU32[((ptr)>>2)] = stack;
        HEAPU32[(((ptr)+(4))>>2)] = stack + stackSize;
      },
  setDataRewindFunc(ptr) {
        var bottomOfCallStack = Asyncify.exportCallStack[0];
        var rewindId = Asyncify.getCallStackId(bottomOfCallStack);
        HEAP32[(((ptr)+(8))>>2)] = rewindId;
      },
  getDataRewindFuncName(ptr) {
        var id = HEAP32[(((ptr)+(8))>>2)];
        var name = Asyncify.callStackIdToName[id];
        return name;
      },
  getDataRewindFunc(name) {
        var func = wasmExports[name];
        return func;
      },
  doRewind(ptr) {
        var name = Asyncify.getDataRewindFuncName(ptr);
        var func = Asyncify.getDataRewindFunc(name);
        // Once we have rewound and the stack we no longer need to artificially
        // keep the runtime alive.
        
        return func();
      },
  handleSleep(startAsync) {
        assert(Asyncify.state !== Asyncify.State.Disabled, 'Asyncify cannot be done during or after the runtime exits');
        if (ABORT) return;
        if (Asyncify.state === Asyncify.State.Normal) {
          // Prepare to sleep. Call startAsync, and see what happens:
          // if the code decided to call our callback synchronously,
          // then no async operation was in fact begun, and we don't
          // need to do anything.
          var reachedCallback = false;
          var reachedAfterCallback = false;
          startAsync((handleSleepReturnValue = 0) => {
            assert(!handleSleepReturnValue || typeof handleSleepReturnValue == 'number' || typeof handleSleepReturnValue == 'boolean'); // old emterpretify API supported other stuff
            if (ABORT) return;
            Asyncify.handleSleepReturnValue = handleSleepReturnValue;
            reachedCallback = true;
            if (!reachedAfterCallback) {
              // We are happening synchronously, so no need for async.
              return;
            }
            // This async operation did not happen synchronously, so we did
            // unwind. In that case there can be no compiled code on the stack,
            // as it might break later operations (we can rewind ok now, but if
            // we unwind again, we would unwind through the extra compiled code
            // too).
            assert(!Asyncify.exportCallStack.length, 'Waking up (starting to rewind) must be done from JS, without compiled code on the stack.');
            Asyncify.state = Asyncify.State.Rewinding;
            runAndAbortIfError(() => _asyncify_start_rewind(Asyncify.currData));
            if (typeof Browser != 'undefined' && Browser.mainLoop.func) {
              Browser.mainLoop.resume();
            }
            var asyncWasmReturnValue, isError = false;
            try {
              asyncWasmReturnValue = Asyncify.doRewind(Asyncify.currData);
            } catch (err) {
              asyncWasmReturnValue = err;
              isError = true;
            }
            // Track whether the return value was handled by any promise handlers.
            var handled = false;
            if (!Asyncify.currData) {
              // All asynchronous execution has finished.
              // `asyncWasmReturnValue` now contains the final
              // return value of the exported async WASM function.
              //
              // Note: `asyncWasmReturnValue` is distinct from
              // `Asyncify.handleSleepReturnValue`.
              // `Asyncify.handleSleepReturnValue` contains the return
              // value of the last C function to have executed
              // `Asyncify.handleSleep()`, where as `asyncWasmReturnValue`
              // contains the return value of the exported WASM function
              // that may have called C functions that
              // call `Asyncify.handleSleep()`.
              var asyncPromiseHandlers = Asyncify.asyncPromiseHandlers;
              if (asyncPromiseHandlers) {
                Asyncify.asyncPromiseHandlers = null;
                (isError ? asyncPromiseHandlers.reject : asyncPromiseHandlers.resolve)(asyncWasmReturnValue);
                handled = true;
              }
            }
            if (isError && !handled) {
              // If there was an error and it was not handled by now, we have no choice but to
              // rethrow that error into the global scope where it can be caught only by
              // `onerror` or `onunhandledpromiserejection`.
              throw asyncWasmReturnValue;
            }
          });
          reachedAfterCallback = true;
          if (!reachedCallback) {
            // A true async operation was begun; start a sleep.
            Asyncify.state = Asyncify.State.Unwinding;
            // TODO: reuse, don't alloc/free every sleep
            Asyncify.currData = Asyncify.allocateData();
            if (typeof Browser != 'undefined' && Browser.mainLoop.func) {
              Browser.mainLoop.pause();
            }
            runAndAbortIfError(() => _asyncify_start_unwind(Asyncify.currData));
          }
        } else if (Asyncify.state === Asyncify.State.Rewinding) {
          // Stop a resume.
          Asyncify.state = Asyncify.State.Normal;
          runAndAbortIfError(_asyncify_stop_rewind);
          _free(Asyncify.currData);
          Asyncify.currData = null;
          // Call all sleep callbacks now that the sleep-resume is all done.
          Asyncify.sleepCallbacks.forEach(callUserCallback);
        } else {
          abort(`invalid state: ${Asyncify.state}`);
        }
        return Asyncify.handleSleepReturnValue;
      },
  handleAsync(startAsync) {
        return Asyncify.handleSleep((wakeUp) => {
          // TODO: add error handling as a second param when handleSleep implements it.
          startAsync().then(wakeUp);
        });
      },
  };

  var readI53FromI64 = (ptr) => {
      return HEAPU32[((ptr)>>2)] + HEAP32[(((ptr)+(4))>>2)] * 4294967296;
    };
  
  var readI53FromU64 = (ptr) => {
      return HEAPU32[((ptr)>>2)] + HEAPU32[(((ptr)+(4))>>2)] * 4294967296;
    };
  var writeI53ToI64 = (ptr, num) => {
      HEAPU32[((ptr)>>2)] = num;
      var lower = HEAPU32[((ptr)>>2)];
      HEAPU32[(((ptr)+(4))>>2)] = (num - lower)/4294967296;
      var deserialized = (num >= 0) ? readI53FromU64(ptr) : readI53FromI64(ptr);
      var offset = ((ptr)>>2);
      if (deserialized != num) warnOnce(`writeI53ToI64() out of range: serialized JS Number ${num} to Wasm heap as bytes lo=${ptrToString(HEAPU32[offset])}, hi=${ptrToString(HEAPU32[offset+1])}, which deserializes back to ${deserialized} instead!`);
    };

  var writeI53ToI64Clamped = (ptr, num) => {
      if (num > 0x7FFFFFFFFFFFFFFF) {
        HEAPU32[((ptr)>>2)] = 4294967295;
        HEAPU32[(((ptr)+(4))>>2)] = 2147483647;
      } else if (num < -0x8000000000000000) {
        HEAPU32[((ptr)>>2)] = 0;
        HEAPU32[(((ptr)+(4))>>2)] = 2147483648;
      } else {
        writeI53ToI64(ptr, num);
      }
    };

  var writeI53ToI64Signaling = (ptr, num) => {
      if (num > 0x7FFFFFFFFFFFFFFF || num < -0x8000000000000000) {
        throw `RangeError in writeI53ToI64Signaling(): input value ${num} is out of range of int64`;
      }
      writeI53ToI64(ptr, num);
    };

  var writeI53ToU64Clamped = (ptr, num) => {
      if (num > 0xFFFFFFFFFFFFFFFF) {
        HEAPU32[((ptr)>>2)] = 4294967295;
        HEAPU32[(((ptr)+(4))>>2)] = 4294967295;
      } else if (num < 0) {
        HEAPU32[((ptr)>>2)] = 0;
        HEAPU32[(((ptr)+(4))>>2)] = 0;
      } else {
        writeI53ToI64(ptr, num);
      }
    };

  var writeI53ToU64Signaling = (ptr, num) => {
      if (num < 0 || num > 0xFFFFFFFFFFFFFFFF) {
        throw `RangeError in writeI53ToU64Signaling(): input value ${num} is out of range of uint64`;
      }
      writeI53ToI64(ptr, num);
    };



  var convertI32PairToI53 = (lo, hi) => {
      // This function should not be getting called with too large unsigned numbers
      // in high part (if hi >= 0x7FFFFFFFF, one should have been calling
      // convertU32PairToI53())
      assert(hi === (hi|0));
      return (lo >>> 0) + hi * 4294967296;
    };


  var convertU32PairToI53 = (lo, hi) => {
      return (lo >>> 0) + (hi >>> 0) * 4294967296;
    };




  var getTempRet0 = (val) => __emscripten_tempret_get();

  var setTempRet0 = (val) => __emscripten_tempret_set(val);

  var _stackAlloc = stackAlloc;

  var _stackSave = stackSave;

  var _stackRestore = stackSave;

  var _setTempRet0 = setTempRet0;

  var _getTempRet0 = getTempRet0;





  var _emscripten_get_heap_max = () => getHeapMax();



  var growMemory = (size) => {
      var b = wasmMemory.buffer;
      var pages = (size - b.byteLength + 65535) / 65536;
      try {
        // round size grow request up to wasm page size (fixed 64KB per spec)
        wasmMemory.grow(pages); // .grow() takes a delta compared to the previous size
        updateMemoryViews();
        return 1 /*success*/;
      } catch(e) {
        err(`growMemory: Attempted to grow heap from ${b.byteLength} bytes to ${size} bytes, but got error: ${e}`);
      }
      // implicit 0 return to save code size (caller will cast "undefined" into 0
      // anyhow)
    };


  var _emscripten_notify_memory_growth = (memoryIndex) => {
      assert(memoryIndex == 0);
      updateMemoryViews();
    };

  var __emscripten_system = (command) => {
      if (ENVIRONMENT_IS_NODE) {
        if (!command) return 1; // shell is available
  
        var cmdstr = UTF8ToString(command);
        if (!cmdstr.length) return 0; // this is what glibc seems to do (shell works test?)
  
        var cp = require('child_process');
        var ret = cp.spawnSync(cmdstr, [], {shell:true, stdio:'inherit'});
  
        var _W_EXITCODE = (ret, sig) => ((ret) << 8 | (sig));
  
        // this really only can happen if process is killed by signal
        if (ret.status === null) {
          // sadly node doesn't expose such function
          var signalToNumber = (sig) => {
            // implement only the most common ones, and fallback to SIGINT
            switch (sig) {
              case 'SIGHUP': return 1;
              case 'SIGINT': return 2;
              case 'SIGQUIT': return 3;
              case 'SIGFPE': return 8;
              case 'SIGKILL': return 9;
              case 'SIGALRM': return 14;
              case 'SIGTERM': return 15;
            }
            return 2; // SIGINT
          }
          return _W_EXITCODE(0, signalToNumber(ret.signal));
        }
  
        return _W_EXITCODE(ret.status, 0);
      }
      // int system(const char *command);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/system.html
      // Can't call external programs.
      if (!command) return 0; // no shell available
      return -52;
    };





  var isLeapYear = (year) => year%4 === 0 && (year%100 !== 0 || year%400 === 0);
  
  var MONTH_DAYS_LEAP_CUMULATIVE = [0,31,60,91,121,152,182,213,244,274,305,335];
  
  var MONTH_DAYS_REGULAR_CUMULATIVE = [0,31,59,90,120,151,181,212,243,273,304,334];
  var ydayFromDate = (date) => {
      var leap = isLeapYear(date.getFullYear());
      var monthDaysCumulative = (leap ? MONTH_DAYS_LEAP_CUMULATIVE : MONTH_DAYS_REGULAR_CUMULATIVE);
      var yday = monthDaysCumulative[date.getMonth()] + date.getDate() - 1; // -1 since it's days since Jan 1
  
      return yday;
    };
  
  
  var __mktime_js = function(tmPtr) {
  
    var ret = (() => { 
      var date = new Date(HEAP32[(((tmPtr)+(20))>>2)] + 1900,
                          HEAP32[(((tmPtr)+(16))>>2)],
                          HEAP32[(((tmPtr)+(12))>>2)],
                          HEAP32[(((tmPtr)+(8))>>2)],
                          HEAP32[(((tmPtr)+(4))>>2)],
                          HEAP32[((tmPtr)>>2)],
                          0);
  
      // There's an ambiguous hour when the time goes back; the tm_isdst field is
      // used to disambiguate it.  Date() basically guesses, so we fix it up if it
      // guessed wrong, or fill in tm_isdst with the guess if it's -1.
      var dst = HEAP32[(((tmPtr)+(32))>>2)];
      var guessedOffset = date.getTimezoneOffset();
      var start = new Date(date.getFullYear(), 0, 1);
      var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
      var winterOffset = start.getTimezoneOffset();
      var dstOffset = Math.min(winterOffset, summerOffset); // DST is in December in South
      if (dst < 0) {
        // Attention: some regions don't have DST at all.
        HEAP32[(((tmPtr)+(32))>>2)] = Number(summerOffset != winterOffset && dstOffset == guessedOffset);
      } else if ((dst > 0) != (dstOffset == guessedOffset)) {
        var nonDstOffset = Math.max(winterOffset, summerOffset);
        var trueOffset = dst > 0 ? dstOffset : nonDstOffset;
        // Don't try setMinutes(date.getMinutes() + ...) -- it's messed up.
        date.setTime(date.getTime() + (trueOffset - guessedOffset)*60000);
      }
  
      HEAP32[(((tmPtr)+(24))>>2)] = date.getDay();
      var yday = ydayFromDate(date)|0;
      HEAP32[(((tmPtr)+(28))>>2)] = yday;
      // To match expected behavior, update fields from date
      HEAP32[((tmPtr)>>2)] = date.getSeconds();
      HEAP32[(((tmPtr)+(4))>>2)] = date.getMinutes();
      HEAP32[(((tmPtr)+(8))>>2)] = date.getHours();
      HEAP32[(((tmPtr)+(12))>>2)] = date.getDate();
      HEAP32[(((tmPtr)+(16))>>2)] = date.getMonth();
      HEAP32[(((tmPtr)+(20))>>2)] = date.getYear();
  
      var timeMs = date.getTime();
      if (isNaN(timeMs)) {
        return -1;
      }
      // Return time in microseconds
      return timeMs / 1000;
     })();
    return (setTempRet0((tempDouble = ret,(+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? (+(Math.floor((tempDouble)/4294967296.0)))>>>0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)), ret>>>0);
  };

  function __gmtime_js(time_low, time_high,tmPtr) {
    var time = convertI32PairToI53Checked(time_low, time_high);
  
    
      var date = new Date(time * 1000);
      HEAP32[((tmPtr)>>2)] = date.getUTCSeconds();
      HEAP32[(((tmPtr)+(4))>>2)] = date.getUTCMinutes();
      HEAP32[(((tmPtr)+(8))>>2)] = date.getUTCHours();
      HEAP32[(((tmPtr)+(12))>>2)] = date.getUTCDate();
      HEAP32[(((tmPtr)+(16))>>2)] = date.getUTCMonth();
      HEAP32[(((tmPtr)+(20))>>2)] = date.getUTCFullYear()-1900;
      HEAP32[(((tmPtr)+(24))>>2)] = date.getUTCDay();
      var start = Date.UTC(date.getUTCFullYear(), 0, 1, 0, 0, 0, 0);
      var yday = ((date.getTime() - start) / (1000 * 60 * 60 * 24))|0;
      HEAP32[(((tmPtr)+(28))>>2)] = yday;
    ;
  }

  
  var __timegm_js = function(tmPtr) {
  
    var ret = (() => { 
      var time = Date.UTC(HEAP32[(((tmPtr)+(20))>>2)] + 1900,
                          HEAP32[(((tmPtr)+(16))>>2)],
                          HEAP32[(((tmPtr)+(12))>>2)],
                          HEAP32[(((tmPtr)+(8))>>2)],
                          HEAP32[(((tmPtr)+(4))>>2)],
                          HEAP32[((tmPtr)>>2)],
                          0);
      var date = new Date(time);
  
      HEAP32[(((tmPtr)+(24))>>2)] = date.getUTCDay();
      var start = Date.UTC(date.getUTCFullYear(), 0, 1, 0, 0, 0, 0);
      var yday = ((date.getTime() - start) / (1000 * 60 * 60 * 24))|0;
      HEAP32[(((tmPtr)+(28))>>2)] = yday;
  
      return date.getTime() / 1000;
     })();
    return (setTempRet0((tempDouble = ret,(+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? (+(Math.floor((tempDouble)/4294967296.0)))>>>0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)), ret>>>0);
  };

  
  function __localtime_js(time_low, time_high,tmPtr) {
    var time = convertI32PairToI53Checked(time_low, time_high);
  
    
      var date = new Date(time*1000);
      HEAP32[((tmPtr)>>2)] = date.getSeconds();
      HEAP32[(((tmPtr)+(4))>>2)] = date.getMinutes();
      HEAP32[(((tmPtr)+(8))>>2)] = date.getHours();
      HEAP32[(((tmPtr)+(12))>>2)] = date.getDate();
      HEAP32[(((tmPtr)+(16))>>2)] = date.getMonth();
      HEAP32[(((tmPtr)+(20))>>2)] = date.getFullYear()-1900;
      HEAP32[(((tmPtr)+(24))>>2)] = date.getDay();
  
      var yday = ydayFromDate(date)|0;
      HEAP32[(((tmPtr)+(28))>>2)] = yday;
      HEAP32[(((tmPtr)+(36))>>2)] = -(date.getTimezoneOffset() * 60);
  
      // Attention: DST is in December in South, and some regions don't have DST at all.
      var start = new Date(date.getFullYear(), 0, 1);
      var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
      var winterOffset = start.getTimezoneOffset();
      var dst = (summerOffset != winterOffset && date.getTimezoneOffset() == Math.min(winterOffset, summerOffset))|0;
      HEAP32[(((tmPtr)+(32))>>2)] = dst;
    ;
  }

  var ___asctime_r = (tmPtr, buf) => {
      var date = {
        tm_sec: HEAP32[((tmPtr)>>2)],
        tm_min: HEAP32[(((tmPtr)+(4))>>2)],
        tm_hour: HEAP32[(((tmPtr)+(8))>>2)],
        tm_mday: HEAP32[(((tmPtr)+(12))>>2)],
        tm_mon: HEAP32[(((tmPtr)+(16))>>2)],
        tm_year: HEAP32[(((tmPtr)+(20))>>2)],
        tm_wday: HEAP32[(((tmPtr)+(24))>>2)]
      };
      var days = [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ];
      var months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                     "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
      var s = days[date.tm_wday] + ' ' + months[date.tm_mon] +
          (date.tm_mday < 10 ? '  ' : ' ') + date.tm_mday +
          (date.tm_hour < 10 ? ' 0' : ' ') + date.tm_hour +
          (date.tm_min < 10 ? ':0' : ':') + date.tm_min +
          (date.tm_sec < 10 ? ':0' : ':') + date.tm_sec +
          ' ' + (1900 + date.tm_year) + "\n";
  
      // asctime_r is specced to behave in an undefined manner if the algorithm would attempt
      // to write out more than 26 bytes (including the null terminator).
      // See http://pubs.opengroup.org/onlinepubs/9699919799/functions/asctime.html
      // Our undefined behavior is to truncate the write to at most 26 bytes, including null terminator.
      stringToUTF8(s, buf, 26);
      return buf;
    };

  
  var withStackSave = (f) => {
      var stack = stackSave();
      var ret = f();
      stackRestore(stack);
      return ret;
    };

  
  var __tzset_js = (timezone, daylight, std_name, dst_name) => {
      // TODO: Use (malleable) environment variables instead of system settings.
      var currentYear = new Date().getFullYear();
      var winter = new Date(currentYear, 0, 1);
      var summer = new Date(currentYear, 6, 1);
      var winterOffset = winter.getTimezoneOffset();
      var summerOffset = summer.getTimezoneOffset();
  
      // Local standard timezone offset. Local standard time is not adjusted for
      // daylight savings.  This code uses the fact that getTimezoneOffset returns
      // a greater value during Standard Time versus Daylight Saving Time (DST).
      // Thus it determines the expected output during Standard Time, and it
      // compares whether the output of the given date the same (Standard) or less
      // (DST).
      var stdTimezoneOffset = Math.max(winterOffset, summerOffset);
  
      // timezone is specified as seconds west of UTC ("The external variable
      // `timezone` shall be set to the difference, in seconds, between
      // Coordinated Universal Time (UTC) and local standard time."), the same
      // as returned by stdTimezoneOffset.
      // See http://pubs.opengroup.org/onlinepubs/009695399/functions/tzset.html
      HEAPU32[((timezone)>>2)] = stdTimezoneOffset * 60;
  
      HEAP32[((daylight)>>2)] = Number(winterOffset != summerOffset);
  
      var extractZone = (timezoneOffset) => {
        // Why inverse sign?
        // Read here https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset
        var sign = timezoneOffset >= 0 ? "-" : "+";
  
        var absOffset = Math.abs(timezoneOffset)
        var hours = String(Math.floor(absOffset / 60)).padStart(2, "0");
        var minutes = String(absOffset % 60).padStart(2, "0");
  
        return `UTC${sign}${hours}${minutes}`;
      }
  
      var winterName = extractZone(winterOffset);
      var summerName = extractZone(summerOffset);
      assert(winterName);
      assert(summerName);
      assert(lengthBytesUTF8(winterName) <= 16, `timezone name truncated to fit in TZNAME_MAX (${winterName})`);
      assert(lengthBytesUTF8(summerName) <= 16, `timezone name truncated to fit in TZNAME_MAX (${summerName})`);
      if (summerOffset < winterOffset) {
        // Northern hemisphere
        stringToUTF8(winterName, std_name, 17);
        stringToUTF8(summerName, dst_name, 17);
      } else {
        stringToUTF8(winterName, dst_name, 17);
        stringToUTF8(summerName, std_name, 17);
      }
    };

  var MONTH_DAYS_REGULAR = [31,28,31,30,31,30,31,31,30,31,30,31];

  var MONTH_DAYS_LEAP = [31,29,31,30,31,30,31,31,30,31,30,31];





  var arraySum = (array, index) => {
      var sum = 0;
      for (var i = 0; i <= index; sum += array[i++]) {
        // no-op
      }
      return sum;
    };

  
  
  var addDays = (date, days) => {
      var newDate = new Date(date.getTime());
      while (days > 0) {
        var leap = isLeapYear(newDate.getFullYear());
        var currentMonth = newDate.getMonth();
        var daysInCurrentMonth = (leap ? MONTH_DAYS_LEAP : MONTH_DAYS_REGULAR)[currentMonth];
  
        if (days > daysInCurrentMonth-newDate.getDate()) {
          // we spill over to next month
          days -= (daysInCurrentMonth-newDate.getDate()+1);
          newDate.setDate(1);
          if (currentMonth < 11) {
            newDate.setMonth(currentMonth+1)
          } else {
            newDate.setMonth(0);
            newDate.setFullYear(newDate.getFullYear()+1);
          }
        } else {
          // we stay in current month
          newDate.setDate(newDate.getDate()+days);
          return newDate;
        }
      }
  
      return newDate;
    };

  
  
  
  
  
  /** @suppress {checkTypes} */
  var jstoi_q = (str) => parseInt(str);
  
  
  var _strptime = (buf, format, tm) => {
      // char *strptime(const char *restrict buf, const char *restrict format, struct tm *restrict tm);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/strptime.html
      var pattern = UTF8ToString(format);
  
      // escape special characters
      // TODO: not sure we really need to escape all of these in JS regexps
      var SPECIAL_CHARS = '\\!@#$^&*()+=-[]/{}|:<>?,.';
      for (var i=0, ii=SPECIAL_CHARS.length; i<ii; ++i) {
        pattern = pattern.replace(new RegExp('\\'+SPECIAL_CHARS[i], 'g'), '\\'+SPECIAL_CHARS[i]);
      }
  
      // reduce number of matchers
      var EQUIVALENT_MATCHERS = {
        'A':  '%a',
        'B':  '%b',
        'c':  '%a %b %d %H:%M:%S %Y',
        'D':  '%m\\/%d\\/%y',
        'e':  '%d',
        'F':  '%Y-%m-%d',
        'h':  '%b',
        'R':  '%H\\:%M',
        'r':  '%I\\:%M\\:%S\\s%p',
        'T':  '%H\\:%M\\:%S',
        'x':  '%m\\/%d\\/(?:%y|%Y)',
        'X':  '%H\\:%M\\:%S'
      };
      // TODO: take care of locale
  
      var DATE_PATTERNS = {
        /* weekday name */    'a': '(?:Sun(?:day)?)|(?:Mon(?:day)?)|(?:Tue(?:sday)?)|(?:Wed(?:nesday)?)|(?:Thu(?:rsday)?)|(?:Fri(?:day)?)|(?:Sat(?:urday)?)',
        /* month name */      'b': '(?:Jan(?:uary)?)|(?:Feb(?:ruary)?)|(?:Mar(?:ch)?)|(?:Apr(?:il)?)|May|(?:Jun(?:e)?)|(?:Jul(?:y)?)|(?:Aug(?:ust)?)|(?:Sep(?:tember)?)|(?:Oct(?:ober)?)|(?:Nov(?:ember)?)|(?:Dec(?:ember)?)',
        /* century */         'C': '\\d\\d',
        /* day of month */    'd': '0[1-9]|[1-9](?!\\d)|1\\d|2\\d|30|31',
        /* hour (24hr) */     'H': '\\d(?!\\d)|[0,1]\\d|20|21|22|23',
        /* hour (12hr) */     'I': '\\d(?!\\d)|0\\d|10|11|12',
        /* day of year */     'j': '00[1-9]|0?[1-9](?!\\d)|0?[1-9]\\d(?!\\d)|[1,2]\\d\\d|3[0-6]\\d',
        /* month */           'm': '0[1-9]|[1-9](?!\\d)|10|11|12',
        /* minutes */         'M': '0\\d|\\d(?!\\d)|[1-5]\\d',
        /* whitespace */      'n': ' ',
        /* AM/PM */           'p': 'AM|am|PM|pm|A\\.M\\.|a\\.m\\.|P\\.M\\.|p\\.m\\.',
        /* seconds */         'S': '0\\d|\\d(?!\\d)|[1-5]\\d|60',
        /* week number */     'U': '0\\d|\\d(?!\\d)|[1-4]\\d|50|51|52|53',
        /* week number */     'W': '0\\d|\\d(?!\\d)|[1-4]\\d|50|51|52|53',
        /* weekday number */  'w': '[0-6]',
        /* 2-digit year */    'y': '\\d\\d',
        /* 4-digit year */    'Y': '\\d\\d\\d\\d',
        /* whitespace */      't': ' ',
        /* time zone */       'z': 'Z|(?:[\\+\\-]\\d\\d:?(?:\\d\\d)?)'
      };
  
      var MONTH_NUMBERS = {JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5, JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11};
      var DAY_NUMBERS_SUN_FIRST = {SUN: 0, MON: 1, TUE: 2, WED: 3, THU: 4, FRI: 5, SAT: 6};
      var DAY_NUMBERS_MON_FIRST = {MON: 0, TUE: 1, WED: 2, THU: 3, FRI: 4, SAT: 5, SUN: 6};
  
      var capture = [];
      var pattern_out = pattern
        .replace(/%(.)/g, (m, c) => EQUIVALENT_MATCHERS[c] || m)
        .replace(/%(.)/g, (_, c) => {
          let pat = DATE_PATTERNS[c];
          if (pat){
            capture.push(c);
            return `(${pat})`;
          } else {
            return c;
          }
        })
        .replace( // any number of space or tab characters match zero or more spaces
          /\s+/g,'\\s*'
        );
  
      var matches = new RegExp('^'+pattern_out, "i").exec(UTF8ToString(buf))
  
      function initDate() {
        function fixup(value, min, max) {
          return (typeof value != 'number' || isNaN(value)) ? min : (value>=min ? (value<=max ? value: max): min);
        };
        return {
          year: fixup(HEAP32[(((tm)+(20))>>2)] + 1900 , 1970, 9999),
          month: fixup(HEAP32[(((tm)+(16))>>2)], 0, 11),
          day: fixup(HEAP32[(((tm)+(12))>>2)], 1, 31),
          hour: fixup(HEAP32[(((tm)+(8))>>2)], 0, 23),
          min: fixup(HEAP32[(((tm)+(4))>>2)], 0, 59),
          sec: fixup(HEAP32[((tm)>>2)], 0, 59),
          gmtoff: 0
        };
      };
  
      if (matches) {
        var date = initDate();
        var value;
  
        var getMatch = (symbol) => {
          var pos = capture.indexOf(symbol);
          // check if symbol appears in regexp
          if (pos >= 0) {
            // return matched value or null (falsy!) for non-matches
            return matches[pos+1];
          }
          return;
        };
  
        // seconds
        if ((value=getMatch('S'))) {
          date.sec = jstoi_q(value);
        }
  
        // minutes
        if ((value=getMatch('M'))) {
          date.min = jstoi_q(value);
        }
  
        // hours
        if ((value=getMatch('H'))) {
          // 24h clock
          date.hour = jstoi_q(value);
        } else if ((value = getMatch('I'))) {
          // AM/PM clock
          var hour = jstoi_q(value);
          if ((value=getMatch('p'))) {
            hour += value.toUpperCase()[0] === 'P' ? 12 : 0;
          }
          date.hour = hour;
        }
  
        // year
        if ((value=getMatch('Y'))) {
          // parse from four-digit year
          date.year = jstoi_q(value);
        } else if ((value=getMatch('y'))) {
          // parse from two-digit year...
          var year = jstoi_q(value);
          if ((value=getMatch('C'))) {
            // ...and century
            year += jstoi_q(value)*100;
          } else {
            // ...and rule-of-thumb
            year += year<69 ? 2000 : 1900;
          }
          date.year = year;
        }
  
        // month
        if ((value=getMatch('m'))) {
          // parse from month number
          date.month = jstoi_q(value)-1;
        } else if ((value=getMatch('b'))) {
          // parse from month name
          date.month = MONTH_NUMBERS[value.substring(0,3).toUpperCase()] || 0;
          // TODO: derive month from day in year+year, week number+day of week+year
        }
  
        // day
        if ((value=getMatch('d'))) {
          // get day of month directly
          date.day = jstoi_q(value);
        } else if ((value=getMatch('j'))) {
          // get day of month from day of year ...
          var day = jstoi_q(value);
          var leapYear = isLeapYear(date.year);
          for (var month=0; month<12; ++month) {
            var daysUntilMonth = arraySum(leapYear ? MONTH_DAYS_LEAP : MONTH_DAYS_REGULAR, month-1);
            if (day<=daysUntilMonth+(leapYear ? MONTH_DAYS_LEAP : MONTH_DAYS_REGULAR)[month]) {
              date.day = day-daysUntilMonth;
            }
          }
        } else if ((value=getMatch('a'))) {
          // get day of month from weekday ...
          var weekDay = value.substring(0,3).toUpperCase();
          if ((value=getMatch('U'))) {
            // ... and week number (Sunday being first day of week)
            // Week number of the year (Sunday as the first day of the week) as a decimal number [00,53].
            // All days in a new year preceding the first Sunday are considered to be in week 0.
            var weekDayNumber = DAY_NUMBERS_SUN_FIRST[weekDay];
            var weekNumber = jstoi_q(value);
  
            // January 1st
            var janFirst = new Date(date.year, 0, 1);
            var endDate;
            if (janFirst.getDay() === 0) {
              // Jan 1st is a Sunday, and, hence in the 1st CW
              endDate = addDays(janFirst, weekDayNumber+7*(weekNumber-1));
            } else {
              // Jan 1st is not a Sunday, and, hence still in the 0th CW
              endDate = addDays(janFirst, 7-janFirst.getDay()+weekDayNumber+7*(weekNumber-1));
            }
            date.day = endDate.getDate();
            date.month = endDate.getMonth();
          } else if ((value=getMatch('W'))) {
            // ... and week number (Monday being first day of week)
            // Week number of the year (Monday as the first day of the week) as a decimal number [00,53].
            // All days in a new year preceding the first Monday are considered to be in week 0.
            var weekDayNumber = DAY_NUMBERS_MON_FIRST[weekDay];
            var weekNumber = jstoi_q(value);
  
            // January 1st
            var janFirst = new Date(date.year, 0, 1);
            var endDate;
            if (janFirst.getDay()===1) {
              // Jan 1st is a Monday, and, hence in the 1st CW
               endDate = addDays(janFirst, weekDayNumber+7*(weekNumber-1));
            } else {
              // Jan 1st is not a Monday, and, hence still in the 0th CW
              endDate = addDays(janFirst, 7-janFirst.getDay()+1+weekDayNumber+7*(weekNumber-1));
            }
  
            date.day = endDate.getDate();
            date.month = endDate.getMonth();
          }
        }
  
        // time zone
        if ((value = getMatch('z'))) {
          // GMT offset as either 'Z' or +-HH:MM or +-HH or +-HHMM
          if (value.toLowerCase() === 'z'){
            date.gmtoff = 0;
          } else {          
            var match = value.match(/^((?:\-|\+)\d\d):?(\d\d)?/);
            date.gmtoff = match[1] * 3600;
            if (match[2]) {
              date.gmtoff += date.gmtoff >0 ? match[2] * 60 : -match[2] * 60
            }
          }
        }
  
        /*
        tm_sec  int seconds after the minute  0-61*
        tm_min  int minutes after the hour  0-59
        tm_hour int hours since midnight  0-23
        tm_mday int day of the month  1-31
        tm_mon  int months since January  0-11
        tm_year int years since 1900
        tm_wday int days since Sunday 0-6
        tm_yday int days since January 1  0-365
        tm_isdst  int Daylight Saving Time flag
        tm_gmtoff long offset from GMT (seconds)
        */
  
        var fullDate = new Date(date.year, date.month, date.day, date.hour, date.min, date.sec, 0);
        HEAP32[((tm)>>2)] = fullDate.getSeconds();
        HEAP32[(((tm)+(4))>>2)] = fullDate.getMinutes();
        HEAP32[(((tm)+(8))>>2)] = fullDate.getHours();
        HEAP32[(((tm)+(12))>>2)] = fullDate.getDate();
        HEAP32[(((tm)+(16))>>2)] = fullDate.getMonth();
        HEAP32[(((tm)+(20))>>2)] = fullDate.getFullYear()-1900;
        HEAP32[(((tm)+(24))>>2)] = fullDate.getDay();
        HEAP32[(((tm)+(28))>>2)] = arraySum(isLeapYear(fullDate.getFullYear()) ? MONTH_DAYS_LEAP : MONTH_DAYS_REGULAR, fullDate.getMonth()-1)+fullDate.getDate()-1;
        HEAP32[(((tm)+(32))>>2)] = 0;
        HEAP32[(((tm)+(36))>>2)] = date.gmtoff;
   
        // we need to convert the matched sequence into an integer array to take care of UTF-8 characters > 0x7F
        // TODO: not sure that intArrayFromString handles all unicode characters correctly
        return buf+intArrayFromString(matches[0]).length-1;
      }
  
      return 0;
    };

  var _strptime_l = (buf, format, tm, locale) => {
      return _strptime(buf, format, tm); // no locale support yet
    };

  var __emscripten_throw_longjmp = () => {
      throw Infinity;
    };



  var inetPton4 = (str) => {
      var b = str.split('.');
      for (var i = 0; i < 4; i++) {
        var tmp = Number(b[i]);
        if (isNaN(tmp)) return null;
        b[i] = tmp;
      }
      return (b[0] | (b[1] << 8) | (b[2] << 16) | (b[3] << 24)) >>> 0;
    };

  var inetNtop4 = (addr) => {
      return (addr & 0xff) + '.' + ((addr >> 8) & 0xff) + '.' + ((addr >> 16) & 0xff) + '.' + ((addr >> 24) & 0xff)
    };

  
  var inetPton6 = (str) => {
      var words;
      var w, offset, z, i;
      /* http://home.deds.nl/~aeron/regex/ */
      var valid6regx = /^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i
      var parts = [];
      if (!valid6regx.test(str)) {
        return null;
      }
      if (str === "::") {
        return [0, 0, 0, 0, 0, 0, 0, 0];
      }
      // Z placeholder to keep track of zeros when splitting the string on ":"
      if (str.startsWith("::")) {
        str = str.replace("::", "Z:"); // leading zeros case
      } else {
        str = str.replace("::", ":Z:");
      }
  
      if (str.indexOf(".") > 0) {
        // parse IPv4 embedded stress
        str = str.replace(new RegExp('[.]', 'g'), ":");
        words = str.split(":");
        words[words.length-4] = jstoi_q(words[words.length-4]) + jstoi_q(words[words.length-3])*256;
        words[words.length-3] = jstoi_q(words[words.length-2]) + jstoi_q(words[words.length-1])*256;
        words = words.slice(0, words.length-2);
      } else {
        words = str.split(":");
      }
  
      offset = 0; z = 0;
      for (w=0; w < words.length; w++) {
        if (typeof words[w] == 'string') {
          if (words[w] === 'Z') {
            // compressed zeros - write appropriate number of zero words
            for (z = 0; z < (8 - words.length+1); z++) {
              parts[w+z] = 0;
            }
            offset = z-1;
          } else {
            // parse hex to field to 16-bit value and write it in network byte-order
            parts[w+offset] = _htons(parseInt(words[w],16));
          }
        } else {
          // parsed IPv4 words
          parts[w+offset] = words[w];
        }
      }
      return [
        (parts[1] << 16) | parts[0],
        (parts[3] << 16) | parts[2],
        (parts[5] << 16) | parts[4],
        (parts[7] << 16) | parts[6]
      ];
    };

  
  var inetNtop6 = (ints) => {
      //  ref:  http://www.ietf.org/rfc/rfc2373.txt - section 2.5.4
      //  Format for IPv4 compatible and mapped  128-bit IPv6 Addresses
      //  128-bits are split into eight 16-bit words
      //  stored in network byte order (big-endian)
      //  |                80 bits               | 16 |      32 bits        |
      //  +-----------------------------------------------------------------+
      //  |               10 bytes               |  2 |      4 bytes        |
      //  +--------------------------------------+--------------------------+
      //  +               5 words                |  1 |      2 words        |
      //  +--------------------------------------+--------------------------+
      //  |0000..............................0000|0000|    IPv4 ADDRESS     | (compatible)
      //  +--------------------------------------+----+---------------------+
      //  |0000..............................0000|FFFF|    IPv4 ADDRESS     | (mapped)
      //  +--------------------------------------+----+---------------------+
      var str = "";
      var word = 0;
      var longest = 0;
      var lastzero = 0;
      var zstart = 0;
      var len = 0;
      var i = 0;
      var parts = [
        ints[0] & 0xffff,
        (ints[0] >> 16),
        ints[1] & 0xffff,
        (ints[1] >> 16),
        ints[2] & 0xffff,
        (ints[2] >> 16),
        ints[3] & 0xffff,
        (ints[3] >> 16)
      ];
  
      // Handle IPv4-compatible, IPv4-mapped, loopback and any/unspecified addresses
  
      var hasipv4 = true;
      var v4part = "";
      // check if the 10 high-order bytes are all zeros (first 5 words)
      for (i = 0; i < 5; i++) {
        if (parts[i] !== 0) { hasipv4 = false; break; }
      }
  
      if (hasipv4) {
        // low-order 32-bits store an IPv4 address (bytes 13 to 16) (last 2 words)
        v4part = inetNtop4(parts[6] | (parts[7] << 16));
        // IPv4-mapped IPv6 address if 16-bit value (bytes 11 and 12) == 0xFFFF (6th word)
        if (parts[5] === -1) {
          str = "::ffff:";
          str += v4part;
          return str;
        }
        // IPv4-compatible IPv6 address if 16-bit value (bytes 11 and 12) == 0x0000 (6th word)
        if (parts[5] === 0) {
          str = "::";
          //special case IPv6 addresses
          if (v4part === "0.0.0.0") v4part = ""; // any/unspecified address
          if (v4part === "0.0.0.1") v4part = "1";// loopback address
          str += v4part;
          return str;
        }
      }
  
      // Handle all other IPv6 addresses
  
      // first run to find the longest contiguous zero words
      for (word = 0; word < 8; word++) {
        if (parts[word] === 0) {
          if (word - lastzero > 1) {
            len = 0;
          }
          lastzero = word;
          len++;
        }
        if (len > longest) {
          longest = len;
          zstart = word - longest + 1;
        }
      }
  
      for (word = 0; word < 8; word++) {
        if (longest > 1) {
          // compress contiguous zeros - to produce "::"
          if (parts[word] === 0 && word >= zstart && word < (zstart + longest) ) {
            if (word === zstart) {
              str += ":";
              if (zstart === 0) str += ":"; //leading zeros case
            }
            continue;
          }
        }
        // converts 16-bit words from big-endian to little-endian before converting to hex string
        str += Number(_ntohs(parts[word] & 0xffff)).toString(16);
        str += word < 7 ? ":" : "";
      }
      return str;
    };

  var Sockets = {
  BUFFER_SIZE:10240,
  MAX_BUFFER_SIZE:10485760,
  nextFd:1,
  fds:{
  },
  nextport:1,
  maxport:65535,
  peer:null,
  connections:{
  },
  portmap:{
  },
  localAddr:4261412874,
  addrPool:[33554442,50331658,67108874,83886090,100663306,117440522,134217738,150994954,167772170,184549386,201326602,218103818,234881034],
  };
  
  
  
  var readSockaddr = (sa, salen) => {
      // family / port offsets are common to both sockaddr_in and sockaddr_in6
      var family = HEAP16[((sa)>>1)];
      var port = _ntohs(HEAPU16[(((sa)+(2))>>1)]);
      var addr;
  
      switch (family) {
        case 2:
          if (salen !== 16) {
            return { errno: 28 };
          }
          addr = HEAP32[(((sa)+(4))>>2)];
          addr = inetNtop4(addr);
          break;
        case 10:
          if (salen !== 28) {
            return { errno: 28 };
          }
          addr = [
            HEAP32[(((sa)+(8))>>2)],
            HEAP32[(((sa)+(12))>>2)],
            HEAP32[(((sa)+(16))>>2)],
            HEAP32[(((sa)+(20))>>2)]
          ];
          addr = inetNtop6(addr);
          break;
        default:
          return { errno: 5 };
      }
  
      return { family: family, addr: addr, port: port };
    };

  
  
  
  
  /** @param {number=} addrlen */
  var writeSockaddr = (sa, family, addr, port, addrlen) => {
      switch (family) {
        case 2:
          addr = inetPton4(addr);
          zeroMemory(sa, 16);
          if (addrlen) {
            HEAP32[((addrlen)>>2)] = 16;
          }
          HEAP16[((sa)>>1)] = family;
          HEAP32[(((sa)+(4))>>2)] = addr;
          HEAP16[(((sa)+(2))>>1)] = _htons(port);
          break;
        case 10:
          addr = inetPton6(addr);
          zeroMemory(sa, 28);
          if (addrlen) {
            HEAP32[((addrlen)>>2)] = 28;
          }
          HEAP32[((sa)>>2)] = family;
          HEAP32[(((sa)+(8))>>2)] = addr[0];
          HEAP32[(((sa)+(12))>>2)] = addr[1];
          HEAP32[(((sa)+(16))>>2)] = addr[2];
          HEAP32[(((sa)+(20))>>2)] = addr[3];
          HEAP16[(((sa)+(2))>>1)] = _htons(port);
          break;
        default:
          return 5;
      }
      return 0;
    };

  
  var DNS = {
  address_map:{
  id:1,
  addrs:{
  },
  names:{
  },
  },
  lookup_name(name) {
        // If the name is already a valid ipv4 / ipv6 address, don't generate a fake one.
        var res = inetPton4(name);
        if (res !== null) {
          return name;
        }
        res = inetPton6(name);
        if (res !== null) {
          return name;
        }
  
        // See if this name is already mapped.
        var addr;
  
        if (DNS.address_map.addrs[name]) {
          addr = DNS.address_map.addrs[name];
        } else {
          var id = DNS.address_map.id++;
          assert(id < 65535, 'exceeded max address mappings of 65535');
  
          addr = '172.29.' + (id & 0xff) + '.' + (id & 0xff00);
  
          DNS.address_map.names[addr] = name;
          DNS.address_map.addrs[name] = addr;
        }
  
        return addr;
      },
  lookup_addr(addr) {
        if (DNS.address_map.names[addr]) {
          return DNS.address_map.names[addr];
        }
  
        return null;
      },
  };

  
  
  
  var __emscripten_lookup_name = (name) => {
      // uint32_t _emscripten_lookup_name(const char *name);
      var nameString = UTF8ToString(name);
      return inetPton4(DNS.lookup_name(nameString));
    };

  
  
  
  
  
  
  
  
  
  var _getaddrinfo = (node, service, hint, out) => {
      // Note getaddrinfo currently only returns a single addrinfo with ai_next defaulting to NULL. When NULL
      // hints are specified or ai_family set to AF_UNSPEC or ai_socktype or ai_protocol set to 0 then we
      // really should provide a linked list of suitable addrinfo values.
      var addrs = [];
      var canon = null;
      var addr = 0;
      var port = 0;
      var flags = 0;
      var family = 0;
      var type = 0;
      var proto = 0;
      var ai, last;
  
      function allocaddrinfo(family, type, proto, canon, addr, port) {
        var sa, salen, ai;
        var errno;
  
        salen = family === 10 ?
          28 :
          16;
        addr = family === 10 ?
          inetNtop6(addr) :
          inetNtop4(addr);
        sa = _malloc(salen);
        errno = writeSockaddr(sa, family, addr, port);
        assert(!errno);
  
        ai = _malloc(32);
        HEAP32[(((ai)+(4))>>2)] = family;
        HEAP32[(((ai)+(8))>>2)] = type;
        HEAP32[(((ai)+(12))>>2)] = proto;
        HEAPU32[(((ai)+(24))>>2)] = canon;
        HEAPU32[(((ai)+(20))>>2)] = sa;
        if (family === 10) {
          HEAP32[(((ai)+(16))>>2)] = 28;
        } else {
          HEAP32[(((ai)+(16))>>2)] = 16;
        }
        HEAP32[(((ai)+(28))>>2)] = 0;
  
        return ai;
      }
  
      if (hint) {
        flags = HEAP32[((hint)>>2)];
        family = HEAP32[(((hint)+(4))>>2)];
        type = HEAP32[(((hint)+(8))>>2)];
        proto = HEAP32[(((hint)+(12))>>2)];
      }
      if (type && !proto) {
        proto = type === 2 ? 17 : 6;
      }
      if (!type && proto) {
        type = proto === 17 ? 2 : 1;
      }
  
      // If type or proto are set to zero in hints we should really be returning multiple addrinfo values, but for
      // now default to a TCP STREAM socket so we can at least return a sensible addrinfo given NULL hints.
      if (proto === 0) {
        proto = 6;
      }
      if (type === 0) {
        type = 1;
      }
  
      if (!node && !service) {
        return -2;
      }
      if (flags & ~(1|2|4|
          1024|8|16|32)) {
        return -1;
      }
      if (hint !== 0 && (HEAP32[((hint)>>2)] & 2) && !node) {
        return -1;
      }
      if (flags & 32) {
        // TODO
        return -2;
      }
      if (type !== 0 && type !== 1 && type !== 2) {
        return -7;
      }
      if (family !== 0 && family !== 2 && family !== 10) {
        return -6;
      }
  
      if (service) {
        service = UTF8ToString(service);
        port = parseInt(service, 10);
  
        if (isNaN(port)) {
          if (flags & 1024) {
            return -2;
          }
          // TODO support resolving well-known service names from:
          // http://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.txt
          return -8;
        }
      }
  
      if (!node) {
        if (family === 0) {
          family = 2;
        }
        if ((flags & 1) === 0) {
          if (family === 2) {
            addr = _htonl(2130706433);
          } else {
            addr = [0, 0, 0, 1];
          }
        }
        ai = allocaddrinfo(family, type, proto, null, addr, port);
        HEAPU32[((out)>>2)] = ai;
        return 0;
      }
  
      //
      // try as a numeric address
      //
      node = UTF8ToString(node);
      addr = inetPton4(node);
      if (addr !== null) {
        // incoming node is a valid ipv4 address
        if (family === 0 || family === 2) {
          family = 2;
        }
        else if (family === 10 && (flags & 8)) {
          addr = [0, 0, _htonl(0xffff), addr];
          family = 10;
        } else {
          return -2;
        }
      } else {
        addr = inetPton6(node);
        if (addr !== null) {
          // incoming node is a valid ipv6 address
          if (family === 0 || family === 10) {
            family = 10;
          } else {
            return -2;
          }
        }
      }
      if (addr != null) {
        ai = allocaddrinfo(family, type, proto, node, addr, port);
        HEAPU32[((out)>>2)] = ai;
        return 0;
      }
      if (flags & 4) {
        return -2;
      }
  
      //
      // try as a hostname
      //
      // resolve the hostname to a temporary fake address
      node = DNS.lookup_name(node);
      addr = inetPton4(node);
      if (family === 0) {
        family = 2;
      } else if (family === 10) {
        addr = [0, 0, _htonl(0xffff), addr];
      }
      ai = allocaddrinfo(family, type, proto, null, addr, port);
      HEAPU32[((out)>>2)] = ai;
      return 0;
    };

  
  
  
  var _getnameinfo = (sa, salen, node, nodelen, serv, servlen, flags) => {
      var info = readSockaddr(sa, salen);
      if (info.errno) {
        return -6;
      }
      var port = info.port;
      var addr = info.addr;
  
      var overflowed = false;
  
      if (node && nodelen) {
        var lookup;
        if ((flags & 1) || !(lookup = DNS.lookup_addr(addr))) {
          if (flags & 8) {
            return -2;
          }
        } else {
          addr = lookup;
        }
        var numBytesWrittenExclNull = stringToUTF8(addr, node, nodelen);
  
        if (numBytesWrittenExclNull+1 >= nodelen) {
          overflowed = true;
        }
      }
  
      if (serv && servlen) {
        port = '' + port;
        var numBytesWrittenExclNull = stringToUTF8(port, serv, servlen);
  
        if (numBytesWrittenExclNull+1 >= servlen) {
          overflowed = true;
        }
      }
  
      if (overflowed) {
        // Note: even when we overflow, getnameinfo() is specced to write out the truncated results.
        return -12;
      }
  
      return 0;
    };

  var Protocols = {
  list:[],
  map:{
  },
  };

  
  
  var _setprotoent = (stayopen) => {
      // void setprotoent(int stayopen);
  
      // Allocate and populate a protoent structure given a name, protocol number and array of aliases
      function allocprotoent(name, proto, aliases) {
        // write name into buffer
        var nameBuf = _malloc(name.length + 1);
        stringToAscii(name, nameBuf);
  
        // write aliases into buffer
        var j = 0;
        var length = aliases.length;
        var aliasListBuf = _malloc((length + 1) * 4); // Use length + 1 so we have space for the terminating NULL ptr.
  
        for (var i = 0; i < length; i++, j += 4) {
          var alias = aliases[i];
          var aliasBuf = _malloc(alias.length + 1);
          stringToAscii(alias, aliasBuf);
          HEAPU32[(((aliasListBuf)+(j))>>2)] = aliasBuf;
        }
        HEAPU32[(((aliasListBuf)+(j))>>2)] = 0; // Terminating NULL pointer.
  
        // generate protoent
        var pe = _malloc(12);
        HEAPU32[((pe)>>2)] = nameBuf;
        HEAPU32[(((pe)+(4))>>2)] = aliasListBuf;
        HEAP32[(((pe)+(8))>>2)] = proto;
        return pe;
      };
  
      // Populate the protocol 'database'. The entries are limited to tcp and udp, though it is fairly trivial
      // to add extra entries from /etc/protocols if desired - though not sure if that'd actually be useful.
      var list = Protocols.list;
      var map  = Protocols.map;
      if (list.length === 0) {
          var entry = allocprotoent('tcp', 6, ['TCP']);
          list.push(entry);
          map['tcp'] = map['6'] = entry;
          entry = allocprotoent('udp', 17, ['UDP']);
          list.push(entry);
          map['udp'] = map['17'] = entry;
      }
  
      _setprotoent.index = 0;
    };

  var _endprotoent = () => {
      // void endprotoent(void);
      // We're not using a real protocol database so we don't do a real close.
    };

  
  var _getprotoent = (number) => {
      // struct protoent *getprotoent(void);
      // reads the  next  entry  from  the  protocols 'database' or return NULL if 'eof'
      if (_setprotoent.index === Protocols.list.length) {
        return 0;
      }
      var result = Protocols.list[_setprotoent.index++];
      return result;
    };

  
  
  var _getprotobyname = (name) => {
      // struct protoent *getprotobyname(const char *);
      name = UTF8ToString(name);
      _setprotoent(true);
      var result = Protocols.map[name];
      return result;
    };

  
  var _getprotobynumber = (number) => {
      // struct protoent *getprotobynumber(int proto);
      _setprotoent(true);
      var result = Protocols.map[number];
      return result;
    };




  var _getentropy = (buffer, size) => {
      randomFill(HEAPU8.subarray(buffer, buffer + size));
      return 0;
    };




  var _emscripten_run_script = (ptr) => {
      eval(UTF8ToString(ptr));
    };

  /** @suppress{checkTypes} */
  var _emscripten_run_script_int = (ptr) => {
      return eval(UTF8ToString(ptr))|0;
    };

  
  
  
  var _emscripten_run_script_string = (ptr) => {
      var s = eval(UTF8ToString(ptr));
      if (s == null) {
        return 0;
      }
      s += '';
      var me = _emscripten_run_script_string;
      var len = lengthBytesUTF8(s);
      if (!me.bufferSize || me.bufferSize < len+1) {
        if (me.bufferSize) _free(me.buffer);
        me.bufferSize = len+1;
        me.buffer = _malloc(me.bufferSize);
      }
      stringToUTF8(s, me.buffer, me.bufferSize);
      return me.buffer;
    };

  var _emscripten_random = () => Math.random();


  var _emscripten_get_now_res = () => { // return resolution of get_now, in nanoseconds
      if (ENVIRONMENT_IS_NODE) {
        return 1; // nanoseconds
      }
      // Modern environment where performance.now() is supported:
      return 1000; // microseconds (1/1000 of a millisecond)
    };

  var nowIsMonotonic = 1;

  var __emscripten_get_now_is_monotonic = () => nowIsMonotonic;


  function jsStackTrace() {
      return new Error().stack.toString();
    }
  
  /** @param {number=} flags */
  function getCallstack(flags) {
      var callstack = jsStackTrace();
  
      // Find the symbols in the callstack that corresponds to the functions that
      // report callstack information, and remove everything up to these from the
      // output.
      var iThisFunc = callstack.lastIndexOf('_emscripten_log');
      var iThisFunc2 = callstack.lastIndexOf('_emscripten_get_callstack');
      var iNextLine = callstack.indexOf('\n', Math.max(iThisFunc, iThisFunc2))+1;
      callstack = callstack.slice(iNextLine);
  
      // If user requested to see the original source stack, but no source map
      // information is available, just fall back to showing the JS stack.
      if (flags & 8 && typeof emscripten_source_map == 'undefined') {
        warnOnce('Source map information is not available, emscripten_log with EM_LOG_C_STACK will be ignored. Build with "--pre-js $EMSCRIPTEN/src/emscripten-source-map.min.js" linker flag to add source map loading to code.');
        flags ^= 8;
        flags |= 16;
      }
  
      // Process all lines:
      var lines = callstack.split('\n');
      callstack = '';
      // New FF30 with column info: extract components of form:
      // '       Object._main@http://server.com:4324:12'
      var newFirefoxRe = new RegExp('\\s*(.*?)@(.*?):([0-9]+):([0-9]+)');
      // Old FF without column info: extract components of form:
      // '       Object._main@http://server.com:4324'
      var firefoxRe = new RegExp('\\s*(.*?)@(.*):(.*)(:(.*))?');
      // Extract components of form:
      // '    at Object._main (http://server.com/file.html:4324:12)'
      var chromeRe = new RegExp('\\s*at (.*?) \\\((.*):(.*):(.*)\\\)');
  
      for (var l in lines) {
        var line = lines[l];
  
        var symbolName = '';
        var file = '';
        var lineno = 0;
        var column = 0;
  
        var parts = chromeRe.exec(line);
        if (parts && parts.length == 5) {
          symbolName = parts[1];
          file = parts[2];
          lineno = parts[3];
          column = parts[4];
        } else {
          parts = newFirefoxRe.exec(line);
          if (!parts) parts = firefoxRe.exec(line);
          if (parts && parts.length >= 4) {
            symbolName = parts[1];
            file = parts[2];
            lineno = parts[3];
            // Old Firefox doesn't carry column information, but in new FF30, it
            // is present. See https://bugzilla.mozilla.org/show_bug.cgi?id=762556
            column = parts[4]|0;
          } else {
            // Was not able to extract this line for demangling/sourcemapping
            // purposes. Output it as-is.
            callstack += line + '\n';
            continue;
          }
        }
  
        var haveSourceMap = false;
  
        if (flags & 8) {
          var orig = emscripten_source_map.originalPositionFor({line: lineno, column: column});
          haveSourceMap = orig?.source;
          if (haveSourceMap) {
            if (flags & 64) {
              orig.source = orig.source.substring(orig.source.replace(/\\/g, "/").lastIndexOf('/')+1);
            }
            callstack += `    at ${symbolName} (${orig.source}:${orig.line}:${orig.column})\n`;
          }
        }
        if ((flags & 16) || !haveSourceMap) {
          if (flags & 64) {
            file = file.substring(file.replace(/\\/g, "/").lastIndexOf('/')+1);
          }
          callstack += (haveSourceMap ? (`     = ${symbolName}`) : (`    at ${symbolName}`)) + ` (${file}:${lineno}:${column})\n`;
        }
      }
      // Trim extra whitespace at the end of the output.
      callstack = callstack.replace(/\s+$/, '');
      return callstack;
    }
  var emscriptenLog = (flags, str) => {
      if (flags & 24) {
        str = str.replace(/\s+$/, ''); // Ensure the message and the callstack are joined cleanly with exactly one newline.
        str += (str.length > 0 ? '\n' : '') + getCallstack(flags);
      }
  
      if (flags & 1) {
        if (flags & 4) {
          console.error(str);
        } else if (flags & 2) {
          console.warn(str);
        } else if (flags & 512) {
          console.info(str);
        } else if (flags & 256) {
          console.debug(str);
        } else {
          console.log(str);
        }
      } else if (flags & 6) {
        err(str);
      } else {
        out(str);
      }
    };

  var reallyNegative = (x) => x < 0 || (x === 0 && (1/x) === -Infinity);
  
  
  
  var reSign = (value, bits) => {
      if (value <= 0) {
        return value;
      }
      var half = bits <= 32 ? Math.abs(1 << (bits-1)) // abs is needed if bits == 32
                            : Math.pow(2, bits-1);
      // for huge values, we can hit the precision limit and always get true here.
      // so don't do that but, in general there is no perfect solution here. With
      // 64-bit ints, we get rounding and errors
      // TODO: In i64 mode 1, resign the two parts separately and safely
      if (value >= half && (bits <= 32 || value > half)) {
        // Cannot bitshift half, as it may be at the limit of the bits JS uses in
        // bitshifts
        value = -2*half + value;
      }
      return value;
    };
  
  var unSign = (value, bits) => {
      if (value >= 0) {
        return value;
      }
      // Need some trickery, since if bits == 32, we are right at the limit of the
      // bits JS uses in bitshifts
      return bits <= 32 ? 2*Math.abs(1 << (bits-1)) + value
                        : Math.pow(2, bits)         + value;
    };
  
  var strLen = (ptr) => {
      var end = ptr;
      while (HEAPU8[end]) ++end;
      return end - ptr;
    };
  
  var formatString = (format, varargs) => {
      assert((varargs & 3) === 0);
      var textIndex = format;
      var argIndex = varargs;
      // This must be called before reading a double or i64 vararg. It will bump the pointer properly.
      // It also does an assert on i32 values, so it's nice to call it before all varargs calls.
      function prepVararg(ptr, type) {
        if (type === 'double' || type === 'i64') {
          // move so the load is aligned
          if (ptr & 7) {
            assert((ptr & 7) === 4);
            ptr += 4;
          }
        } else {
          assert((ptr & 3) === 0);
        }
        return ptr;
      }
      function getNextArg(type) {
        // NOTE: Explicitly ignoring type safety. Otherwise this fails:
        //       int x = 4; printf("%c\n", (char)x);
        var ret;
        argIndex = prepVararg(argIndex, type);
        if (type === 'double') {
          ret = HEAPF64[((argIndex)>>3)];
          argIndex += 8;
        } else if (type == 'i64') {
          ret = [HEAP32[((argIndex)>>2)],
                 HEAP32[(((argIndex)+(4))>>2)]];
          argIndex += 8;
        } else {
          assert((argIndex & 3) === 0);
          type = 'i32'; // varargs are always i32, i64, or double
          ret = HEAP32[((argIndex)>>2)];
          argIndex += 4;
        }
        return ret;
      }
  
      var ret = [];
      var curr, next, currArg;
      while (1) {
        var startTextIndex = textIndex;
        curr = HEAP8[textIndex];
        if (curr === 0) break;
        next = HEAP8[textIndex+1];
        if (curr == 37) {
          // Handle flags.
          var flagAlwaysSigned = false;
          var flagLeftAlign = false;
          var flagAlternative = false;
          var flagZeroPad = false;
          var flagPadSign = false;
          flagsLoop: while (1) {
            switch (next) {
              case 43:
                flagAlwaysSigned = true;
                break;
              case 45:
                flagLeftAlign = true;
                break;
              case 35:
                flagAlternative = true;
                break;
              case 48:
                if (flagZeroPad) {
                  break flagsLoop;
                } else {
                  flagZeroPad = true;
                  break;
                }
              case 32:
                flagPadSign = true;
                break;
              default:
                break flagsLoop;
            }
            textIndex++;
            next = HEAP8[textIndex+1];
          }
  
          // Handle width.
          var width = 0;
          if (next == 42) {
            width = getNextArg('i32');
            textIndex++;
            next = HEAP8[textIndex+1];
          } else {
            while (next >= 48 && next <= 57) {
              width = width * 10 + (next - 48);
              textIndex++;
              next = HEAP8[textIndex+1];
            }
          }
  
          // Handle precision.
          var precisionSet = false, precision = -1;
          if (next == 46) {
            precision = 0;
            precisionSet = true;
            textIndex++;
            next = HEAP8[textIndex+1];
            if (next == 42) {
              precision = getNextArg('i32');
              textIndex++;
            } else {
              while (1) {
                var precisionChr = HEAP8[textIndex+1];
                if (precisionChr < 48 ||
                    precisionChr > 57) break;
                precision = precision * 10 + (precisionChr - 48);
                textIndex++;
              }
            }
            next = HEAP8[textIndex+1];
          }
          if (precision < 0) {
            precision = 6; // Standard default.
            precisionSet = false;
          }
  
          // Handle integer sizes. WARNING: These assume a 32-bit architecture!
          var argSize;
          switch (String.fromCharCode(next)) {
            case 'h':
              var nextNext = HEAP8[textIndex+2];
              if (nextNext == 104) {
                textIndex++;
                argSize = 1; // char (actually i32 in varargs)
              } else {
                argSize = 2; // short (actually i32 in varargs)
              }
              break;
            case 'l':
              var nextNext = HEAP8[textIndex+2];
              if (nextNext == 108) {
                textIndex++;
                argSize = 8; // long long
              } else {
                argSize = 4; // long
              }
              break;
            case 'L': // long long
            case 'q': // int64_t
            case 'j': // intmax_t
              argSize = 8;
              break;
            case 'z': // size_t
            case 't': // ptrdiff_t
            case 'I': // signed ptrdiff_t or unsigned size_t
              argSize = 4;
              break;
            default:
              argSize = null;
          }
          if (argSize) textIndex++;
          next = HEAP8[textIndex+1];
  
          // Handle type specifier.
          switch (String.fromCharCode(next)) {
            case 'd': case 'i': case 'u': case 'o': case 'x': case 'X': case 'p': {
              // Integer.
              var signed = next == 100 || next == 105;
              argSize = argSize || 4;
              currArg = getNextArg('i' + (argSize * 8));
              var argText;
              // Flatten i64-1 [low, high] into a (slightly rounded) double
              if (argSize == 8) {
                currArg = next == 117 ? convertU32PairToI53(currArg[0], currArg[1]) : convertI32PairToI53(currArg[0], currArg[1]);
              }
              // Truncate to requested size.
              if (argSize <= 4) {
                var limit = Math.pow(256, argSize) - 1;
                currArg = (signed ? reSign : unSign)(currArg & limit, argSize * 8);
              }
              // Format the number.
              var currAbsArg = Math.abs(currArg);
              var prefix = '';
              if (next == 100 || next == 105) {
                argText = reSign(currArg, 8 * argSize).toString(10);
              } else if (next == 117) {
                argText = unSign(currArg, 8 * argSize).toString(10);
                currArg = Math.abs(currArg);
              } else if (next == 111) {
                argText = (flagAlternative ? '0' : '') + currAbsArg.toString(8);
              } else if (next == 120 || next == 88) {
                prefix = (flagAlternative && currArg != 0) ? '0x' : '';
                if (currArg < 0) {
                  // Represent negative numbers in hex as 2's complement.
                  currArg = -currArg;
                  argText = (currAbsArg - 1).toString(16);
                  var buffer = [];
                  for (var i = 0; i < argText.length; i++) {
                    buffer.push((0xF - parseInt(argText[i], 16)).toString(16));
                  }
                  argText = buffer.join('');
                  while (argText.length < argSize * 2) argText = 'f' + argText;
                } else {
                  argText = currAbsArg.toString(16);
                }
                if (next == 88) {
                  prefix = prefix.toUpperCase();
                  argText = argText.toUpperCase();
                }
              } else if (next == 112) {
                if (currAbsArg === 0) {
                  argText = '(nil)';
                } else {
                  prefix = '0x';
                  argText = currAbsArg.toString(16);
                }
              }
              if (precisionSet) {
                while (argText.length < precision) {
                  argText = '0' + argText;
                }
              }
  
              // Add sign if needed
              if (currArg >= 0) {
                if (flagAlwaysSigned) {
                  prefix = '+' + prefix;
                } else if (flagPadSign) {
                  prefix = ' ' + prefix;
                }
              }
  
              // Move sign to prefix so we zero-pad after the sign
              if (argText.charAt(0) == '-') {
                prefix = '-' + prefix;
                argText = argText.substr(1);
              }
  
              // Add padding.
              while (prefix.length + argText.length < width) {
                if (flagLeftAlign) {
                  argText += ' ';
                } else {
                  if (flagZeroPad) {
                    argText = '0' + argText;
                  } else {
                    prefix = ' ' + prefix;
                  }
                }
              }
  
              // Insert the result into the buffer.
              argText = prefix + argText;
              argText.split('').forEach(function(chr) {
                ret.push(chr.charCodeAt(0));
              });
              break;
            }
            case 'f': case 'F': case 'e': case 'E': case 'g': case 'G': {
              // Float.
              currArg = getNextArg('double');
              var argText;
              if (isNaN(currArg)) {
                argText = 'nan';
                flagZeroPad = false;
              } else if (!isFinite(currArg)) {
                argText = (currArg < 0 ? '-' : '') + 'inf';
                flagZeroPad = false;
              } else {
                var isGeneral = false;
                var effectivePrecision = Math.min(precision, 20);
  
                // Convert g/G to f/F or e/E, as per:
                // http://pubs.opengroup.org/onlinepubs/9699919799/functions/printf.html
                if (next == 103 || next == 71) {
                  isGeneral = true;
                  precision = precision || 1;
                  var exponent = parseInt(currArg.toExponential(effectivePrecision).split('e')[1], 10);
                  if (precision > exponent && exponent >= -4) {
                    next = ((next == 103) ? 'f' : 'F').charCodeAt(0);
                    precision -= exponent + 1;
                  } else {
                    next = ((next == 103) ? 'e' : 'E').charCodeAt(0);
                    precision--;
                  }
                  effectivePrecision = Math.min(precision, 20);
                }
  
                if (next == 101 || next == 69) {
                  argText = currArg.toExponential(effectivePrecision);
                  // Make sure the exponent has at least 2 digits.
                  if (/[eE][-+]\d$/.test(argText)) {
                    argText = argText.slice(0, -1) + '0' + argText.slice(-1);
                  }
                } else if (next == 102 || next == 70) {
                  argText = currArg.toFixed(effectivePrecision);
                  if (currArg === 0 && reallyNegative(currArg)) {
                    argText = '-' + argText;
                  }
                }
  
                var parts = argText.split('e');
                if (isGeneral && !flagAlternative) {
                  // Discard trailing zeros and periods.
                  while (parts[0].length > 1 && parts[0].includes('.') &&
                         (parts[0].slice(-1) == '0' || parts[0].slice(-1) == '.')) {
                    parts[0] = parts[0].slice(0, -1);
                  }
                } else {
                  // Make sure we have a period in alternative mode.
                  if (flagAlternative && argText.indexOf('.') == -1) parts[0] += '.';
                  // Zero pad until required precision.
                  while (precision > effectivePrecision++) parts[0] += '0';
                }
                argText = parts[0] + (parts.length > 1 ? 'e' + parts[1] : '');
  
                // Capitalize 'E' if needed.
                if (next == 69) argText = argText.toUpperCase();
  
                // Add sign.
                if (currArg >= 0) {
                  if (flagAlwaysSigned) {
                    argText = '+' + argText;
                  } else if (flagPadSign) {
                    argText = ' ' + argText;
                  }
                }
              }
  
              // Add padding.
              while (argText.length < width) {
                if (flagLeftAlign) {
                  argText += ' ';
                } else {
                  if (flagZeroPad && (argText[0] == '-' || argText[0] == '+')) {
                    argText = argText[0] + '0' + argText.slice(1);
                  } else {
                    argText = (flagZeroPad ? '0' : ' ') + argText;
                  }
                }
              }
  
              // Adjust case.
              if (next < 97) argText = argText.toUpperCase();
  
              // Insert the result into the buffer.
              argText.split('').forEach(function(chr) {
                ret.push(chr.charCodeAt(0));
              });
              break;
            }
            case 's': {
              // String.
              var arg = getNextArg('i8*');
              var argLength = arg ? strLen(arg) : '(null)'.length;
              if (precisionSet) argLength = Math.min(argLength, precision);
              if (!flagLeftAlign) {
                while (argLength < width--) {
                  ret.push(32);
                }
              }
              if (arg) {
                for (var i = 0; i < argLength; i++) {
                  ret.push(HEAPU8[arg++]);
                }
              } else {
                ret = ret.concat(intArrayFromString('(null)'.substr(0, argLength), true));
              }
              if (flagLeftAlign) {
                while (argLength < width--) {
                  ret.push(32);
                }
              }
              break;
            }
            case 'c': {
              // Character.
              if (flagLeftAlign) ret.push(getNextArg('i8'));
              while (--width > 0) {
                ret.push(32);
              }
              if (!flagLeftAlign) ret.push(getNextArg('i8'));
              break;
            }
            case 'n': {
              // Write the length written so far to the next parameter.
              var ptr = getNextArg('i32*');
              HEAP32[((ptr)>>2)] = ret.length;
              break;
            }
            case '%': {
              // Literal percent sign.
              ret.push(curr);
              break;
            }
            default: {
              // Unknown specifiers remain untouched.
              for (var i = startTextIndex; i < textIndex + 2; i++) {
                ret.push(HEAP8[i]);
              }
            }
          }
          textIndex += 2;
          // TODO: Support a/A (hex float) and m (last error) specifiers.
          // TODO: Support %1${specifier} for arg selection.
        } else {
          ret.push(curr);
          textIndex += 1;
        }
      }
      return ret;
    };
  
  var _emscripten_log = (flags, format, varargs) => {
      var result = formatString(format, varargs);
      var str = UTF8ArrayToString(result, 0);
      emscriptenLog(flags, str);
    };

  var _emscripten_get_compiler_setting = (name) => {
      throw 'You must build with -sRETAIN_COMPILER_SETTINGS for getCompilerSetting or emscripten_get_compiler_setting to work';
    };

  var _emscripten_has_asyncify = () => 1;

  function _emscripten_debugger() { debugger }

  
  var _emscripten_print_double = (x, to, max) => {
      var str = x + '';
      if (to) return stringToUTF8(str, to, max);
      else return lengthBytesUTF8(str);
    };





  var _emscripten_asm_const_double = (code, sigPtr, argbuf) => {
      return runEmAsmFunction(code, sigPtr, argbuf);
    };


  var runMainThreadEmAsm = (emAsmAddr, sigPtr, argbuf, sync) => {
      var args = readEmAsmArgs(sigPtr, argbuf);
      assert(ASM_CONSTS.hasOwnProperty(emAsmAddr), `No EM_ASM constant found at address ${emAsmAddr}.  The loaded WebAssembly file is likely out of sync with the generated JavaScript.`);
      return ASM_CONSTS[emAsmAddr](...args);
    };

  var _emscripten_asm_const_int_sync_on_main_thread = (emAsmAddr, sigPtr, argbuf) => runMainThreadEmAsm(emAsmAddr, sigPtr, argbuf, 1);

  var _emscripten_asm_const_ptr_sync_on_main_thread = (emAsmAddr, sigPtr, argbuf) => runMainThreadEmAsm(emAsmAddr, sigPtr, argbuf, 1);

  var _emscripten_asm_const_double_sync_on_main_thread = _emscripten_asm_const_int_sync_on_main_thread;

  var _emscripten_asm_const_async_on_main_thread = (emAsmAddr, sigPtr, argbuf) => runMainThreadEmAsm(emAsmAddr, sigPtr, argbuf, 0);


  var jstoi_s = Number;

  var __Unwind_Backtrace = (func, arg) => {
      var trace = getCallstack();
      var parts = trace.split('\n');
      for (var i = 0; i < parts.length; i++) {
        var ret = ((a1, a2) => dynCall_iii(func, a1, a2))(0, arg);
        if (ret !== 0) return;
      }
    };

  var __Unwind_GetIPInfo = (context, ipBefore) => abort('Unwind_GetIPInfo');

  var __Unwind_FindEnclosingFunction = (ip) => 0;

  class ExceptionInfo {
      // excPtr - Thrown object pointer to wrap. Metadata pointer is calculated from it.
      constructor(excPtr) {
        this.excPtr = excPtr;
        this.ptr = excPtr - 24;
      }
  
      set_type(type) {
        HEAPU32[(((this.ptr)+(4))>>2)] = type;
      }
  
      get_type() {
        return HEAPU32[(((this.ptr)+(4))>>2)];
      }
  
      set_destructor(destructor) {
        HEAPU32[(((this.ptr)+(8))>>2)] = destructor;
      }
  
      get_destructor() {
        return HEAPU32[(((this.ptr)+(8))>>2)];
      }
  
      set_caught(caught) {
        caught = caught ? 1 : 0;
        HEAP8[(this.ptr)+(12)] = caught;
      }
  
      get_caught() {
        return HEAP8[(this.ptr)+(12)] != 0;
      }
  
      set_rethrown(rethrown) {
        rethrown = rethrown ? 1 : 0;
        HEAP8[(this.ptr)+(13)] = rethrown;
      }
  
      get_rethrown() {
        return HEAP8[(this.ptr)+(13)] != 0;
      }
  
      // Initialize native structure fields. Should be called once after allocated.
      init(type, destructor) {
        this.set_adjusted_ptr(0);
        this.set_type(type);
        this.set_destructor(destructor);
      }
  
      set_adjusted_ptr(adjustedPtr) {
        HEAPU32[(((this.ptr)+(16))>>2)] = adjustedPtr;
      }
  
      get_adjusted_ptr() {
        return HEAPU32[(((this.ptr)+(16))>>2)];
      }
  
      // Get pointer which is expected to be received by catch clause in C++ code. It may be adjusted
      // when the pointer is casted to some of the exception object base classes (e.g. when virtual
      // inheritance is used). When a pointer is thrown this method should return the thrown pointer
      // itself.
      get_exception_ptr() {
        // Work around a fastcomp bug, this code is still included for some reason in a build without
        // exceptions support.
        var isPointer = ___cxa_is_pointer_type(this.get_type());
        if (isPointer) {
          return HEAPU32[((this.excPtr)>>2)];
        }
        var adjusted = this.get_adjusted_ptr();
        if (adjusted !== 0) return adjusted;
        return this.excPtr;
      }
    }
  
  var exceptionLast = 0;
  
  var uncaughtExceptionCount = 0;
  var ___cxa_throw = (ptr, type, destructor) => {
      var info = new ExceptionInfo(ptr);
      // Initialize ExceptionInfo content after it was allocated in __cxa_allocate_exception.
      info.init(type, destructor);
      exceptionLast = ptr;
      uncaughtExceptionCount++;
      assert(false, 'Exception thrown, but exception catching is not enabled. Compile with -sNO_DISABLE_EXCEPTION_CATCHING or -sEXCEPTION_CATCHING_ALLOWED=[..] to catch.');
    };
  var __Unwind_RaiseException = (ex) => {
      err('Warning: _Unwind_RaiseException is not correctly implemented');
      return ___cxa_throw(ex, 0, 0);
    };

  var __Unwind_DeleteException = (ex) => {
      err('TODO: Unwind_DeleteException');
    };

  
  
  var ___handle_stack_overflow = (requested) => {
      var base = _emscripten_stack_get_base();
      var end = _emscripten_stack_get_end();
      abort(`stack overflow (Attempt to set SP to ${ptrToString(requested)}` +
            `, with stack limits [${ptrToString(end)} - ${ptrToString(base)}` +
            ']). If you require more stack space build with -sSTACK_SIZE=<bytes>');
    };


  var listenOnce = (object, event, func) => {
      object.addEventListener(event, func, { 'once': true });
    };

  /** @param {Object=} elements */
  var autoResumeAudioContext = (ctx, elements) => {
      if (!elements) {
        elements = [document, document.getElementById('canvas')];
      }
      ['keydown', 'mousedown', 'touchstart'].forEach((event) => {
        elements.forEach((element) => {
          if (element) {
            listenOnce(element, event, () => {
              if (ctx.state === 'suspended') ctx.resume();
            });
          }
        });
      });
    };

  var dynCallLegacy = (sig, ptr, args) => {
      sig = sig.replace(/p/g, 'i')
      assert(('dynCall_' + sig) in Module, `bad function pointer type - dynCall function not found for sig '${sig}'`);
      if (args?.length) {
        // j (64-bit integer) must be passed in as two numbers [low 32, high 32].
        assert(args.length === sig.substring(1).replace(/j/g, '--').length);
      } else {
        assert(sig.length == 1);
      }
      var f = Module['dynCall_' + sig];
      return f(ptr, ...args);
    };

  
  var wasmTableMirror = [];
  
  /** @type {WebAssembly.Table} */
  var wasmTable;
  var getWasmTableEntry = (funcPtr) => {
      var func = wasmTableMirror[funcPtr];
      if (!func) {
        if (funcPtr >= wasmTableMirror.length) wasmTableMirror.length = funcPtr + 1;
        wasmTableMirror[funcPtr] = func = wasmTable.get(funcPtr);
      }
      assert(wasmTable.get(funcPtr) == func, 'JavaScript-side Wasm function table mirror is out of date!');
      return func;
    };
  var dynCall = (sig, ptr, args = []) => {
      var rtn = dynCallLegacy(sig, ptr, args);
      return rtn;
    };
  var getDynCaller = (sig, ptr) => {
      return (...args) => dynCall(sig, ptr, args);
    };




  
  var setWasmTableEntry = (idx, func) => {
      wasmTable.set(idx, func);
      // With ABORT_ON_WASM_EXCEPTIONS wasmTable.get is overridden to return wrapped
      // functions so we need to call it here to retrieve the potential wrapper correctly
      // instead of just storing 'func' directly into wasmTableMirror
      wasmTableMirror[idx] = wasmTable.get(idx);
    };


  var _emscripten_exit_with_live_runtime = () => {
      
      throw 'unwind';
    };


  
  
  
  var _emscripten_force_exit = (status) => {
      warnOnce('emscripten_force_exit cannot actually shut down the runtime, as the build does not have EXIT_RUNTIME set');
      __emscripten_runtime_keepalive_clear();
      _exit(status);
    };

  var _emscripten_out = (str) => out(UTF8ToString(str));

  var _emscripten_outn = (str, len) => out(UTF8ToString(str, len));

  var _emscripten_err = (str) => err(UTF8ToString(str));

  var _emscripten_errn = (str, len) => err(UTF8ToString(str, len));

  var _emscripten_dbg = (str) => dbg(UTF8ToString(str));

  var _emscripten_dbgn = (str, len) => dbg(UTF8ToString(str, len));

  
  var __emscripten_get_progname = (str, len) => {
      stringToUTF8(getExecutableName(), str, len);
    };

  var _emscripten_console_log = (str) => {
      assert(typeof str == 'number');
      console.log(UTF8ToString(str));
    };

  var _emscripten_console_warn = (str) => {
      assert(typeof str == 'number');
      console.warn(UTF8ToString(str));
    };

  var _emscripten_console_error = (str) => {
      assert(typeof str == 'number');
      console.error(UTF8ToString(str));
    };

  var _emscripten_throw_number = (number) => {
      throw number;
    };

  var _emscripten_throw_string = (str) => {
      assert(typeof str == 'number');
      throw UTF8ToString(str);
    };






  var _emscripten_runtime_keepalive_push = runtimeKeepalivePush;

  var _emscripten_runtime_keepalive_pop = runtimeKeepalivePop;

  var _emscripten_runtime_keepalive_check = keepRuntimeAlive;



  var asmjsMangle = (x) => {
      if (x == '__main_argc_argv') {
        x = 'main';
      }
      return x.startsWith('dynCall_') ? x : '_' + x;
    };




  
  
  var __emscripten_fs_load_embedded_files = (ptr) => {
      do {
        var name_addr = HEAPU32[((ptr)>>2)];
        ptr += 4;
        var len = HEAPU32[((ptr)>>2)];
        ptr += 4;
        var content = HEAPU32[((ptr)>>2)];
        ptr += 4;
        var name = UTF8ToString(name_addr)
        FS.createPath('/', PATH.dirname(name), true, true);
        // canOwn this data in the filesystem, it is a slice of wasm memory that will never change
        FS.createDataFile(name, null, HEAP8.subarray(content, content + len), true, true, true);
      } while (HEAPU32[((ptr)>>2)]);
    };

  class HandleAllocator {
      constructor() {
        // TODO(https://github.com/emscripten-core/emscripten/issues/21414):
        // Use inline field declarations.
        this.allocated = [undefined];
        this.freelist = [];
      }
      get(id) {
        assert(this.allocated[id] !== undefined, `invalid handle: ${id}`);
        return this.allocated[id];
      }
      has(id) {
        return this.allocated[id] !== undefined;
      }
      allocate(handle) {
        var id = this.freelist.pop() || this.allocated.length;
        this.allocated[id] = handle;
        return id;
      }
      free(id) {
        assert(this.allocated[id] !== undefined);
        // Set the slot to `undefined` rather than using `delete` here since
        // apparently arrays with holes in them can be less efficient.
        this.allocated[id] = undefined;
        this.freelist.push(id);
      }
    }

  var POINTER_SIZE = 4;
  function getNativeTypeSize(type) {
    // prettier-ignore
    switch (type) {
      case 'i1': case 'i8': case 'u8': return 1;
      case 'i16': case 'u16': return 2;
      case 'i32': case 'u32': return 4;
      case 'i64': case 'u64': return 8;
      case 'float': return 4;
      case 'double': return 8;
      default: {
        if (type[type.length - 1] === '*') {
          return POINTER_SIZE;
        }
        if (type[0] === 'i') {
          const bits = Number(type.substr(1));
          assert(bits % 8 === 0, `getNativeTypeSize invalid bits ${bits}, ${type} type`);
          return bits / 8;
        }
        return 0;
      }
    }
  }



  var STACK_SIZE = 65536;

  var STACK_ALIGN = 16;


  var ASSERTIONS = 1;

  var getCFunc = (ident) => {
      var func = Module['_' + ident]; // closure exported function
      assert(func, 'Cannot call unknown function ' + ident + ', make sure it is exported');
      return func;
    };

  
  var writeArrayToMemory = (array, buffer) => {
      assert(array.length >= 0, 'writeArrayToMemory array must have a length (should be an array or typed array)')
      HEAP8.set(array, buffer);
    };
  
  
  
  
  
  
  
  
    /**
     * @param {string|null=} returnType
     * @param {Array=} argTypes
     * @param {Arguments|Array=} args
     * @param {Object=} opts
     */
  var ccall = (ident, returnType, argTypes, args, opts) => {
      // For fast lookup of conversion functions
      var toC = {
        'string': (str) => {
          var ret = 0;
          if (str !== null && str !== undefined && str !== 0) { // null string
            // at most 4 bytes per UTF-8 code point, +1 for the trailing '\0'
            ret = stringToUTF8OnStack(str);
          }
          return ret;
        },
        'array': (arr) => {
          var ret = stackAlloc(arr.length);
          writeArrayToMemory(arr, ret);
          return ret;
        }
      };
  
      function convertReturnValue(ret) {
        if (returnType === 'string') {
          
          return UTF8ToString(ret);
        }
        if (returnType === 'boolean') return Boolean(ret);
        return ret;
      }
  
      var func = getCFunc(ident);
      var cArgs = [];
      var stack = 0;
      assert(returnType !== 'array', 'Return type should not be "array".');
      if (args) {
        for (var i = 0; i < args.length; i++) {
          var converter = toC[argTypes[i]];
          if (converter) {
            if (stack === 0) stack = stackSave();
            cArgs[i] = converter(args[i]);
          } else {
            cArgs[i] = args[i];
          }
        }
      }
      // Data for a previous async operation that was in flight before us.
      var previousAsync = Asyncify.currData;
      var ret = func(...cArgs);
      function onDone(ret) {
        runtimeKeepalivePop();
        if (stack !== 0) stackRestore(stack);
        return convertReturnValue(ret);
      }
    var asyncMode = opts?.async;
  
      // Keep the runtime alive through all calls. Note that this call might not be
      // async, but for simplicity we push and pop in all calls.
      runtimeKeepalivePush();
      if (Asyncify.currData != previousAsync) {
        // A change in async operation happened. If there was already an async
        // operation in flight before us, that is an error: we should not start
        // another async operation while one is active, and we should not stop one
        // either. The only valid combination is to have no change in the async
        // data (so we either had one in flight and left it alone, or we didn't have
        // one), or to have nothing in flight and to start one.
        assert(!(previousAsync && Asyncify.currData), 'We cannot start an async operation when one is already flight');
        assert(!(previousAsync && !Asyncify.currData), 'We cannot stop an async operation in flight');
        // This is a new async operation. The wasm is paused and has unwound its stack.
        // We need to return a Promise that resolves the return value
        // once the stack is rewound and execution finishes.
        assert(asyncMode, 'The call to ' + ident + ' is running asynchronously. If this was intended, add the async option to the ccall/cwrap call.');
        return Asyncify.whenDone().then(onDone);
      }
  
      ret = onDone(ret);
      // If this is an async ccall, ensure we return a promise
      if (asyncMode) return Promise.resolve(ret);
      return ret;
    };

  
  
    /**
     * @param {string=} returnType
     * @param {Array=} argTypes
     * @param {Object=} opts
     */
  var cwrap = (ident, returnType, argTypes, opts) => {
      return (...args) => ccall(ident, returnType, argTypes, args, opts);
    };

  var uleb128Encode = (n, target) => {
      assert(n < 16384);
      if (n < 128) {
        target.push(n);
      } else {
        target.push((n % 128) | 128, n >> 7);
      }
    };


  var generateFuncType = (sig, target) => {
      var sigRet = sig.slice(0, 1);
      var sigParam = sig.slice(1);
      var typeCodes = {
        'i': 0x7f, // i32
        'p': 0x7f, // i32
        'j': 0x7e, // i64
        'f': 0x7d, // f32
        'd': 0x7c, // f64
        'e': 0x6f, // externref
      };
  
      // Parameters, length + signatures
      target.push(0x60 /* form: func */);
      uleb128Encode(sigParam.length, target);
      for (var i = 0; i < sigParam.length; ++i) {
        assert(sigParam[i] in typeCodes, 'invalid signature char: ' + sigParam[i]);
        target.push(typeCodes[sigParam[i]]);
      }
  
      // Return values, length + signatures
      // With no multi-return in MVP, either 0 (void) or 1 (anything else)
      if (sigRet == 'v') {
        target.push(0x00);
      } else {
        target.push(0x01, typeCodes[sigRet]);
      }
    };

  
  
  var convertJsFunctionToWasm = (func, sig) => {
  
      assert(!sig.includes('j'), 'i64 not permitted in function signatures when WASM_BIGINT is disabled');
  
      // If the type reflection proposal is available, use the new
      // "WebAssembly.Function" constructor.
      // Otherwise, construct a minimal wasm module importing the JS function and
      // re-exporting it.
      if (typeof WebAssembly.Function == "function") {
        return new WebAssembly.Function(sigToWasmTypes(sig), func);
      }
  
      // The module is static, with the exception of the type section, which is
      // generated based on the signature passed in.
      var typeSectionBody = [
        0x01, // count: 1
      ];
      generateFuncType(sig, typeSectionBody);
  
      // Rest of the module is static
      var bytes = [
        0x00, 0x61, 0x73, 0x6d, // magic ("\0asm")
        0x01, 0x00, 0x00, 0x00, // version: 1
        0x01, // Type section code
      ];
      // Write the overall length of the type section followed by the body
      uleb128Encode(typeSectionBody.length, bytes);
      bytes.push(...typeSectionBody);
  
      // The rest of the module is static
      bytes.push(
        0x02, 0x07, // import section
          // (import "e" "f" (func 0 (type 0)))
          0x01, 0x01, 0x65, 0x01, 0x66, 0x00, 0x00,
        0x07, 0x05, // export section
          // (export "f" (func 0 (type 0)))
          0x01, 0x01, 0x66, 0x00, 0x00,
      );
  
      // We can compile this wasm module synchronously because it is very small.
      // This accepts an import (at "e.f"), that it reroutes to an export (at "f")
      var module = new WebAssembly.Module(new Uint8Array(bytes));
      var instance = new WebAssembly.Instance(module, { 'e': { 'f': func } });
      var wrappedFunc = instance.exports['f'];
      return wrappedFunc;
    };

  var freeTableIndexes = [];

  var functionsInTableMap;

  
  var getEmptyTableSlot = () => {
      // Reuse a free index if there is one, otherwise grow.
      if (freeTableIndexes.length) {
        return freeTableIndexes.pop();
      }
      // Grow the table
      try {
        wasmTable.grow(1);
      } catch (err) {
        if (!(err instanceof RangeError)) {
          throw err;
        }
        throw 'Unable to grow wasm table. Set ALLOW_TABLE_GROWTH.';
      }
      return wasmTable.length - 1;
    };

  
  var updateTableMap = (offset, count) => {
      if (functionsInTableMap) {
        for (var i = offset; i < offset + count; i++) {
          var item = getWasmTableEntry(i);
          // Ignore null values.
          if (item) {
            functionsInTableMap.set(item, i);
          }
        }
      }
    };

  
  
  var getFunctionAddress = (func) => {
      // First, create the map if this is the first use.
      if (!functionsInTableMap) {
        functionsInTableMap = new WeakMap();
        updateTableMap(0, wasmTable.length);
      }
      return functionsInTableMap.get(func) || 0;
    };

  
  
  
  
  
  
  /** @param {string=} sig */
  var addFunction = (func, sig) => {
      assert(typeof func != 'undefined');
      // Check if the function is already in the table, to ensure each function
      // gets a unique index.
      var rtn = getFunctionAddress(func);
      if (rtn) {
        return rtn;
      }
  
      // It's not in the table, add it now.
  
      var ret = getEmptyTableSlot();
  
      // Set the new value.
      try {
        // Attempting to call this with JS function will cause of table.set() to fail
        setWasmTableEntry(ret, func);
      } catch (err) {
        if (!(err instanceof TypeError)) {
          throw err;
        }
        assert(typeof sig != 'undefined', 'Missing signature argument to addFunction: ' + func);
        var wrapped = convertJsFunctionToWasm(func, sig);
        setWasmTableEntry(ret, wrapped);
      }
  
      functionsInTableMap.set(func, ret);
  
      return ret;
    };

  
  
  
  
  var removeFunction = (index) => {
      functionsInTableMap.delete(getWasmTableEntry(index));
      setWasmTableEntry(index, null);
      freeTableIndexes.push(index);
    };








  var _emscripten_math_cbrt = Math.cbrt;

  var _emscripten_math_pow = Math.pow;

  var _emscripten_math_random = Math.random;

  var _emscripten_math_sign = Math.sign;

  var _emscripten_math_sqrt = Math.sqrt;

  var _emscripten_math_exp = Math.exp;

  var _emscripten_math_expm1 = Math.expm1;

  var _emscripten_math_fmod = (x, y) => x % y;

  var _emscripten_math_log = Math.log;

  var _emscripten_math_log1p = Math.log1p;

  var _emscripten_math_log10 = Math.log10;

  var _emscripten_math_log2 = Math.log2;

  var _emscripten_math_round = Math.round;

  var _emscripten_math_acos = Math.acos;

  var _emscripten_math_acosh = Math.acosh;

  var _emscripten_math_asin = Math.asin;

  var _emscripten_math_asinh = Math.asinh;

  var _emscripten_math_atan = Math.atan;

  var _emscripten_math_atanh = Math.atanh;

  var _emscripten_math_atan2 = Math.atan2;

  var _emscripten_math_cos = Math.cos;

  var _emscripten_math_cosh = Math.cosh;

  var _emscripten_math_hypot = (count, varargs) => {
      var args = [];
      for (var i = 0; i < count; ++i) {
        args.push(HEAPF64[(((varargs)+(i * 8))>>3)]);
      }
      return Math.hypot(...args);
    };

  var _emscripten_math_sin = Math.sin;

  var _emscripten_math_sinh = Math.sinh;

  var _emscripten_math_tan = Math.tan;

  var _emscripten_math_tanh = Math.tanh;










  function intArrayToString(array) {
    var ret = [];
    for (var i = 0; i < array.length; i++) {
      var chr = array[i];
      if (chr > 0xFF) {
        assert(false, `Character code ${chr} (${String.fromCharCode(chr)}) at offset ${i} not in 0x00-0xFF.`);
        chr &= 0xFF;
      }
      ret.push(String.fromCharCode(chr));
    }
    return ret.join('');
  }

  var AsciiToString = (ptr) => {
      var str = '';
      while (1) {
        var ch = HEAPU8[ptr++];
        if (!ch) return str;
        str += String.fromCharCode(ch);
      }
    };


  var UTF16Decoder = typeof TextDecoder != 'undefined' ? new TextDecoder('utf-16le') : undefined;;

  var UTF16ToString = (ptr, maxBytesToRead) => {
      assert(ptr % 2 == 0, 'Pointer passed to UTF16ToString must be aligned to two bytes!');
      var endPtr = ptr;
      // TextDecoder needs to know the byte length in advance, it doesn't stop on
      // null terminator by itself.
      // Also, use the length info to avoid running tiny strings through
      // TextDecoder, since .subarray() allocates garbage.
      var idx = endPtr >> 1;
      var maxIdx = idx + maxBytesToRead / 2;
      // If maxBytesToRead is not passed explicitly, it will be undefined, and this
      // will always evaluate to true. This saves on code size.
      while (!(idx >= maxIdx) && HEAPU16[idx]) ++idx;
      endPtr = idx << 1;
  
      if (endPtr - ptr > 32 && UTF16Decoder)
        return UTF16Decoder.decode(HEAPU8.subarray(ptr, endPtr));
  
      // Fallback: decode without UTF16Decoder
      var str = '';
  
      // If maxBytesToRead is not passed explicitly, it will be undefined, and the
      // for-loop's condition will always evaluate to true. The loop is then
      // terminated on the first null char.
      for (var i = 0; !(i >= maxBytesToRead / 2); ++i) {
        var codeUnit = HEAP16[(((ptr)+(i*2))>>1)];
        if (codeUnit == 0) break;
        // fromCharCode constructs a character from a UTF-16 code unit, so we can
        // pass the UTF16 string right through.
        str += String.fromCharCode(codeUnit);
      }
  
      return str;
    };

  var stringToUTF16 = (str, outPtr, maxBytesToWrite) => {
      assert(outPtr % 2 == 0, 'Pointer passed to stringToUTF16 must be aligned to two bytes!');
      assert(typeof maxBytesToWrite == 'number', 'stringToUTF16(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!');
      // Backwards compatibility: if max bytes is not specified, assume unsafe unbounded write is allowed.
      maxBytesToWrite ??= 0x7FFFFFFF;
      if (maxBytesToWrite < 2) return 0;
      maxBytesToWrite -= 2; // Null terminator.
      var startPtr = outPtr;
      var numCharsToWrite = (maxBytesToWrite < str.length*2) ? (maxBytesToWrite / 2) : str.length;
      for (var i = 0; i < numCharsToWrite; ++i) {
        // charCodeAt returns a UTF-16 encoded code unit, so it can be directly written to the HEAP.
        var codeUnit = str.charCodeAt(i); // possibly a lead surrogate
        HEAP16[((outPtr)>>1)] = codeUnit;
        outPtr += 2;
      }
      // Null-terminate the pointer to the HEAP.
      HEAP16[((outPtr)>>1)] = 0;
      return outPtr - startPtr;
    };

  var lengthBytesUTF16 = (str) => {
      return str.length*2;
    };

  var UTF32ToString = (ptr, maxBytesToRead) => {
      assert(ptr % 4 == 0, 'Pointer passed to UTF32ToString must be aligned to four bytes!');
      var i = 0;
  
      var str = '';
      // If maxBytesToRead is not passed explicitly, it will be undefined, and this
      // will always evaluate to true. This saves on code size.
      while (!(i >= maxBytesToRead / 4)) {
        var utf32 = HEAP32[(((ptr)+(i*4))>>2)];
        if (utf32 == 0) break;
        ++i;
        // Gotcha: fromCharCode constructs a character from a UTF-16 encoded code (pair), not from a Unicode code point! So encode the code point to UTF-16 for constructing.
        // See http://unicode.org/faq/utf_bom.html#utf16-3
        if (utf32 >= 0x10000) {
          var ch = utf32 - 0x10000;
          str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
        } else {
          str += String.fromCharCode(utf32);
        }
      }
      return str;
    };

  var stringToUTF32 = (str, outPtr, maxBytesToWrite) => {
      assert(outPtr % 4 == 0, 'Pointer passed to stringToUTF32 must be aligned to four bytes!');
      assert(typeof maxBytesToWrite == 'number', 'stringToUTF32(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!');
      // Backwards compatibility: if max bytes is not specified, assume unsafe unbounded write is allowed.
      maxBytesToWrite ??= 0x7FFFFFFF;
      if (maxBytesToWrite < 4) return 0;
      var startPtr = outPtr;
      var endPtr = startPtr + maxBytesToWrite - 4;
      for (var i = 0; i < str.length; ++i) {
        // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! We must decode the string to UTF-32 to the heap.
        // See http://unicode.org/faq/utf_bom.html#utf16-3
        var codeUnit = str.charCodeAt(i); // possibly a lead surrogate
        if (codeUnit >= 0xD800 && codeUnit <= 0xDFFF) {
          var trailSurrogate = str.charCodeAt(++i);
          codeUnit = 0x10000 + ((codeUnit & 0x3FF) << 10) | (trailSurrogate & 0x3FF);
        }
        HEAP32[((outPtr)>>2)] = codeUnit;
        outPtr += 4;
        if (outPtr + 4 > endPtr) break;
      }
      // Null-terminate the pointer to the HEAP.
      HEAP32[((outPtr)>>2)] = 0;
      return outPtr - startPtr;
    };

  var lengthBytesUTF32 = (str) => {
      var len = 0;
      for (var i = 0; i < str.length; ++i) {
        // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! We must decode the string to UTF-32 to the heap.
        // See http://unicode.org/faq/utf_bom.html#utf16-3
        var codeUnit = str.charCodeAt(i);
        if (codeUnit >= 0xD800 && codeUnit <= 0xDFFF) ++i; // possibly a lead surrogate, so skip over the tail surrogate.
        len += 4;
      }
  
      return len;
    };

  
  
  var stringToNewUTF8 = (str) => {
      var size = lengthBytesUTF8(str) + 1;
      var ret = _malloc(size);
      if (ret) stringToUTF8(str, ret, size);
      return ret;
    };



  var JSEvents = {
  removeAllEventListeners() {
        while (JSEvents.eventHandlers.length) {
          JSEvents._removeHandler(JSEvents.eventHandlers.length - 1);
        }
        JSEvents.deferredCalls = [];
      },
  inEventHandler:0,
  deferredCalls:[],
  deferCall(targetFunction, precedence, argsList) {
        function arraysHaveEqualContent(arrA, arrB) {
          if (arrA.length != arrB.length) return false;
  
          for (var i in arrA) {
            if (arrA[i] != arrB[i]) return false;
          }
          return true;
        }
        // Test if the given call was already queued, and if so, don't add it again.
        for (var call of JSEvents.deferredCalls) {
          if (call.targetFunction == targetFunction && arraysHaveEqualContent(call.argsList, argsList)) {
            return;
          }
        }
        JSEvents.deferredCalls.push({
          targetFunction,
          precedence,
          argsList
        });
  
        JSEvents.deferredCalls.sort((x,y) => x.precedence < y.precedence);
      },
  removeDeferredCalls(targetFunction) {
        JSEvents.deferredCalls = JSEvents.deferredCalls.filter((call) => call.targetFunction != targetFunction);
      },
  canPerformEventHandlerRequests() {
        if (navigator.userActivation) {
          // Verify against transient activation status from UserActivation API
          // whether it is possible to perform a request here without needing to defer. See
          // https://developer.mozilla.org/en-US/docs/Web/Security/User_activation#transient_activation
          // and https://caniuse.com/mdn-api_useractivation
          // At the time of writing, Firefox does not support this API: https://bugzilla.mozilla.org/show_bug.cgi?id=1791079
          return navigator.userActivation.isActive;
        }
  
        return JSEvents.inEventHandler && JSEvents.currentEventHandler.allowsDeferredCalls;
      },
  runDeferredCalls() {
        if (!JSEvents.canPerformEventHandlerRequests()) {
          return;
        }
        var deferredCalls = JSEvents.deferredCalls;
        JSEvents.deferredCalls = [];
        for (var call of deferredCalls) {
          call.targetFunction(...call.argsList);
        }
      },
  eventHandlers:[],
  removeAllHandlersOnTarget:(target, eventTypeString) => {
        for (var i = 0; i < JSEvents.eventHandlers.length; ++i) {
          if (JSEvents.eventHandlers[i].target == target &&
            (!eventTypeString || eventTypeString == JSEvents.eventHandlers[i].eventTypeString)) {
             JSEvents._removeHandler(i--);
           }
        }
      },
  _removeHandler(i) {
        var h = JSEvents.eventHandlers[i];
        h.target.removeEventListener(h.eventTypeString, h.eventListenerFunc, h.useCapture);
        JSEvents.eventHandlers.splice(i, 1);
      },
  registerOrRemoveHandler(eventHandler) {
        if (!eventHandler.target) {
          err('registerOrRemoveHandler: the target element for event handler registration does not exist, when processing the following event handler registration:');
          console.dir(eventHandler);
          return -4;
        }
        if (eventHandler.callbackfunc) {
          eventHandler.eventListenerFunc = function(event) {
            // Increment nesting count for the event handler.
            ++JSEvents.inEventHandler;
            JSEvents.currentEventHandler = eventHandler;
            // Process any old deferred calls the user has placed.
            JSEvents.runDeferredCalls();
            // Process the actual event, calls back to user C code handler.
            eventHandler.handlerFunc(event);
            // Process any new deferred calls that were placed right now from this event handler.
            JSEvents.runDeferredCalls();
            // Out of event handler - restore nesting count.
            --JSEvents.inEventHandler;
          };
  
          eventHandler.target.addEventListener(eventHandler.eventTypeString,
                                               eventHandler.eventListenerFunc,
                                               eventHandler.useCapture);
          JSEvents.eventHandlers.push(eventHandler);
        } else {
          for (var i = 0; i < JSEvents.eventHandlers.length; ++i) {
            if (JSEvents.eventHandlers[i].target == eventHandler.target
             && JSEvents.eventHandlers[i].eventTypeString == eventHandler.eventTypeString) {
               JSEvents._removeHandler(i--);
             }
          }
        }
        return 0;
      },
  getNodeNameForTarget(target) {
        if (!target) return '';
        if (target == window) return '#window';
        if (target == screen) return '#screen';
        return target?.nodeName || '';
      },
  fullscreenEnabled() {
        return document.fullscreenEnabled
        // Safari 13.0.3 on macOS Catalina 10.15.1 still ships with prefixed webkitFullscreenEnabled.
        // TODO: If Safari at some point ships with unprefixed version, update the version check above.
        || document.webkitFullscreenEnabled
         ;
      },
  };

  
  var maybeCStringToJsString = (cString) => {
      // "cString > 2" checks if the input is a number, and isn't of the special
      // values we accept here, EMSCRIPTEN_EVENT_TARGET_* (which map to 0, 1, 2).
      // In other words, if cString > 2 then it's a pointer to a valid place in
      // memory, and points to a C string.
      return cString > 2 ? UTF8ToString(cString) : cString;
    };
  
  /** @type {Object} */
  var specialHTMLTargets = [0, typeof document != 'undefined' ? document : 0, typeof window != 'undefined' ? window : 0];
  var findEventTarget = (target) => {
      target = maybeCStringToJsString(target);
      var domElement = specialHTMLTargets[target] || (typeof document != 'undefined' ? document.querySelector(target) : undefined);
      return domElement;
    };
  
  
  var registerKeyEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) => {
      if (!JSEvents.keyEvent) JSEvents.keyEvent = _malloc(160);
  
      var keyEventHandlerFunc = (e) => {
        assert(e);
  
        var keyEventData = JSEvents.keyEvent;
        HEAPF64[((keyEventData)>>3)] = e.timeStamp;
  
        var idx = ((keyEventData)>>2);
  
        HEAP32[idx + 2] = e.location;
        HEAP8[keyEventData + 12] = e.ctrlKey;
        HEAP8[keyEventData + 13] = e.shiftKey;
        HEAP8[keyEventData + 14] = e.altKey;
        HEAP8[keyEventData + 15] = e.metaKey;
        HEAP8[keyEventData + 16] = e.repeat;
        HEAP32[idx + 5] = e.charCode;
        HEAP32[idx + 6] = e.keyCode;
        HEAP32[idx + 7] = e.which;
        stringToUTF8(e.key || '', keyEventData + 32, 32);
        stringToUTF8(e.code || '', keyEventData + 64, 32);
        stringToUTF8(e.char || '', keyEventData + 96, 32);
        stringToUTF8(e.locale || '', keyEventData + 128, 32);
  
        if (((a1, a2, a3) => dynCall_iiii(callbackfunc, a1, a2, a3))(eventTypeId, keyEventData, userData)) e.preventDefault();
      };
  
      var eventHandler = {
        target: findEventTarget(target),
        eventTypeString,
        callbackfunc,
        handlerFunc: keyEventHandlerFunc,
        useCapture
      };
      return JSEvents.registerOrRemoveHandler(eventHandler);
    };




  var findCanvasEventTarget = findEventTarget;

  var _emscripten_set_keypress_callback_on_thread = (target, userData, useCapture, callbackfunc, targetThread) =>
      registerKeyEventCallback(target, userData, useCapture, callbackfunc, 1, "keypress", targetThread);

  var _emscripten_set_keydown_callback_on_thread = (target, userData, useCapture, callbackfunc, targetThread) =>
      registerKeyEventCallback(target, userData, useCapture, callbackfunc, 2, "keydown", targetThread);

  var _emscripten_set_keyup_callback_on_thread = (target, userData, useCapture, callbackfunc, targetThread) =>
      registerKeyEventCallback(target, userData, useCapture, callbackfunc, 3, "keyup", targetThread);

  var getBoundingClientRect = (e) => specialHTMLTargets.indexOf(e) < 0 ? e.getBoundingClientRect() : {'left':0,'top':0};

  
  
  var fillMouseEventData = (eventStruct, e, target) => {
      assert(eventStruct % 4 == 0);
      HEAPF64[((eventStruct)>>3)] = e.timeStamp;
      var idx = ((eventStruct)>>2);
      HEAP32[idx + 2] = e.screenX;
      HEAP32[idx + 3] = e.screenY;
      HEAP32[idx + 4] = e.clientX;
      HEAP32[idx + 5] = e.clientY;
      HEAP8[eventStruct + 24] = e.ctrlKey;
      HEAP8[eventStruct + 25] = e.shiftKey;
      HEAP8[eventStruct + 26] = e.altKey;
      HEAP8[eventStruct + 27] = e.metaKey;
      HEAP16[idx*2 + 14] = e.button;
      HEAP16[idx*2 + 15] = e.buttons;
  
      HEAP32[idx + 8] = e["movementX"]
        ;
  
      HEAP32[idx + 9] = e["movementY"]
        ;
  
      // Note: rect contains doubles (truncated to placate SAFE_HEAP, which is the same behaviour when writing to HEAP32 anyway)
      var rect = getBoundingClientRect(target);
      HEAP32[idx + 10] = e.clientX - (rect.left | 0);
      HEAP32[idx + 11] = e.clientY - (rect.top  | 0);
  
    };

  
  
  
  var registerMouseEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) => {
      if (!JSEvents.mouseEvent) JSEvents.mouseEvent = _malloc(64);
      target = findEventTarget(target);
  
      var mouseEventHandlerFunc = (e = event) => {
        // TODO: Make this access thread safe, or this could update live while app is reading it.
        fillMouseEventData(JSEvents.mouseEvent, e, target);
  
        if (((a1, a2, a3) => dynCall_iiii(callbackfunc, a1, a2, a3))(eventTypeId, JSEvents.mouseEvent, userData)) e.preventDefault();
      };
  
      var eventHandler = {
        target,
        allowsDeferredCalls: eventTypeString != 'mousemove' && eventTypeString != 'mouseenter' && eventTypeString != 'mouseleave', // Mouse move events do not allow fullscreen/pointer lock requests to be handled in them!
        eventTypeString,
        callbackfunc,
        handlerFunc: mouseEventHandlerFunc,
        useCapture
      };
      return JSEvents.registerOrRemoveHandler(eventHandler);
    };

  var _emscripten_set_click_callback_on_thread = (target, userData, useCapture, callbackfunc, targetThread) =>
      registerMouseEventCallback(target, userData, useCapture, callbackfunc, 4, "click", targetThread);

  var _emscripten_set_mousedown_callback_on_thread = (target, userData, useCapture, callbackfunc, targetThread) =>
      registerMouseEventCallback(target, userData, useCapture, callbackfunc, 5, "mousedown", targetThread);

  var _emscripten_set_mouseup_callback_on_thread = (target, userData, useCapture, callbackfunc, targetThread) =>
      registerMouseEventCallback(target, userData, useCapture, callbackfunc, 6, "mouseup", targetThread);

  var _emscripten_set_dblclick_callback_on_thread = (target, userData, useCapture, callbackfunc, targetThread) =>
      registerMouseEventCallback(target, userData, useCapture, callbackfunc, 7, "dblclick", targetThread);

  var _emscripten_set_mousemove_callback_on_thread = (target, userData, useCapture, callbackfunc, targetThread) =>
      registerMouseEventCallback(target, userData, useCapture, callbackfunc, 8, "mousemove", targetThread);

  var _emscripten_set_mouseenter_callback_on_thread = (target, userData, useCapture, callbackfunc, targetThread) =>
      registerMouseEventCallback(target, userData, useCapture, callbackfunc, 33, "mouseenter", targetThread);

  var _emscripten_set_mouseleave_callback_on_thread = (target, userData, useCapture, callbackfunc, targetThread) =>
      registerMouseEventCallback(target, userData, useCapture, callbackfunc, 34, "mouseleave", targetThread);

  var _emscripten_set_mouseover_callback_on_thread = (target, userData, useCapture, callbackfunc, targetThread) =>
      registerMouseEventCallback(target, userData, useCapture, callbackfunc, 35, "mouseover", targetThread);

  var _emscripten_set_mouseout_callback_on_thread = (target, userData, useCapture, callbackfunc, targetThread) =>
      registerMouseEventCallback(target, userData, useCapture, callbackfunc, 36, "mouseout", targetThread);

  var _emscripten_get_mouse_status = (mouseState) => {
      if (!JSEvents.mouseEvent) return -7;
      // HTML5 does not really have a polling API for mouse events, so implement one manually by
      // returning the data from the most recently received event. This requires that user has registered
      // at least some no-op function as an event handler to any of the mouse function.
      HEAP8.set(HEAP8.subarray(JSEvents.mouseEvent, JSEvents.mouseEvent + 64), mouseState);
      return 0;
    };

  
  
  
  var registerWheelEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) => {
      if (!JSEvents.wheelEvent) JSEvents.wheelEvent = _malloc(96);
  
      // The DOM Level 3 events spec event 'wheel'
      var wheelHandlerFunc = (e = event) => {
        var wheelEvent = JSEvents.wheelEvent;
        fillMouseEventData(wheelEvent, e, target);
        HEAPF64[(((wheelEvent)+(64))>>3)] = e["deltaX"];
        HEAPF64[(((wheelEvent)+(72))>>3)] = e["deltaY"];
        HEAPF64[(((wheelEvent)+(80))>>3)] = e["deltaZ"];
        HEAP32[(((wheelEvent)+(88))>>2)] = e["deltaMode"];
        if (((a1, a2, a3) => dynCall_iiii(callbackfunc, a1, a2, a3))(eventTypeId, wheelEvent, userData)) e.preventDefault();
      };
  
      var eventHandler = {
        target,
        allowsDeferredCalls: true,
        eventTypeString,
        callbackfunc,
        handlerFunc: wheelHandlerFunc,
        useCapture
      };
      return JSEvents.registerOrRemoveHandler(eventHandler);
    };

  
  
  var _emscripten_set_wheel_callback_on_thread = (target, userData, useCapture, callbackfunc, targetThread) => {
      target = findEventTarget(target);
      if (!target) return -4;
      if (typeof target.onwheel != 'undefined') {
        return registerWheelEventCallback(target, userData, useCapture, callbackfunc, 9, "wheel", targetThread);
      } else {
        return -1;
      }
    };

  
  
  var registerUiEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) => {
      if (!JSEvents.uiEvent) JSEvents.uiEvent = _malloc(36);
  
      target = findEventTarget(target);
  
      var uiEventHandlerFunc = (e = event) => {
        if (e.target != target) {
          // Never take ui events such as scroll via a 'bubbled' route, but always from the direct element that
          // was targeted. Otherwise e.g. if app logs a message in response to a page scroll, the Emscripten log
          // message box could cause to scroll, generating a new (bubbled) scroll message, causing a new log print,
          // causing a new scroll, etc..
          return;
        }
        var b = document.body; // Take document.body to a variable, Closure compiler does not outline access to it on its own.
        if (!b) {
          // During a page unload 'body' can be null, with "Cannot read property 'clientWidth' of null" being thrown
          return;
        }
        var uiEvent = JSEvents.uiEvent;
        HEAP32[((uiEvent)>>2)] = 0; // always zero for resize and scroll
        HEAP32[(((uiEvent)+(4))>>2)] = b.clientWidth;
        HEAP32[(((uiEvent)+(8))>>2)] = b.clientHeight;
        HEAP32[(((uiEvent)+(12))>>2)] = innerWidth;
        HEAP32[(((uiEvent)+(16))>>2)] = innerHeight;
        HEAP32[(((uiEvent)+(20))>>2)] = outerWidth;
        HEAP32[(((uiEvent)+(24))>>2)] = outerHeight;
        HEAP32[(((uiEvent)+(28))>>2)] = pageXOffset | 0; // scroll offsets are float
        HEAP32[(((uiEvent)+(32))>>2)] = pageYOffset | 0;
        if (((a1, a2, a3) => dynCall_iiii(callbackfunc, a1, a2, a3))(eventTypeId, uiEvent, userData)) e.preventDefault();
      };
  
      var eventHandler = {
        target,
        eventTypeString,
        callbackfunc,
        handlerFunc: uiEventHandlerFunc,
        useCapture
      };
      return JSEvents.registerOrRemoveHandler(eventHandler);
    };

  var _emscripten_set_resize_callback_on_thread = (target, userData, useCapture, callbackfunc, targetThread) =>
      registerUiEventCallback(target, userData, useCapture, callbackfunc, 10, "resize", targetThread);

  var _emscripten_set_scroll_callback_on_thread = (target, userData, useCapture, callbackfunc, targetThread) =>
      registerUiEventCallback(target, userData, useCapture, callbackfunc, 11, "scroll", targetThread);

  
  
  
  var registerFocusEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) => {
      if (!JSEvents.focusEvent) JSEvents.focusEvent = _malloc(256);
  
      var focusEventHandlerFunc = (e = event) => {
        var nodeName = JSEvents.getNodeNameForTarget(e.target);
        var id = e.target.id ? e.target.id : '';
  
        var focusEvent = JSEvents.focusEvent;
        stringToUTF8(nodeName, focusEvent + 0, 128);
        stringToUTF8(id, focusEvent + 128, 128);
  
        if (((a1, a2, a3) => dynCall_iiii(callbackfunc, a1, a2, a3))(eventTypeId, focusEvent, userData)) e.preventDefault();
      };
  
      var eventHandler = {
        target: findEventTarget(target),
        eventTypeString,
        callbackfunc,
        handlerFunc: focusEventHandlerFunc,
        useCapture
      };
      return JSEvents.registerOrRemoveHandler(eventHandler);
    };

  var _emscripten_set_blur_callback_on_thread = (target, userData, useCapture, callbackfunc, targetThread) =>
      registerFocusEventCallback(target, userData, useCapture, callbackfunc, 12, "blur", targetThread);

  var _emscripten_set_focus_callback_on_thread = (target, userData, useCapture, callbackfunc, targetThread) =>
      registerFocusEventCallback(target, userData, useCapture, callbackfunc, 13, "focus", targetThread);

  var _emscripten_set_focusin_callback_on_thread = (target, userData, useCapture, callbackfunc, targetThread) =>
      registerFocusEventCallback(target, userData, useCapture, callbackfunc, 14, "focusin", targetThread);

  var _emscripten_set_focusout_callback_on_thread = (target, userData, useCapture, callbackfunc, targetThread) =>
      registerFocusEventCallback(target, userData, useCapture, callbackfunc, 15, "focusout", targetThread);

  var fillDeviceOrientationEventData = (eventStruct, e, target) => {
      HEAPF64[((eventStruct)>>3)] = e.alpha;
      HEAPF64[(((eventStruct)+(8))>>3)] = e.beta;
      HEAPF64[(((eventStruct)+(16))>>3)] = e.gamma;
      HEAP8[(eventStruct)+(24)] = e.absolute;
    };

  
  
  var registerDeviceOrientationEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) => {
      if (!JSEvents.deviceOrientationEvent) JSEvents.deviceOrientationEvent = _malloc(32);
  
      var deviceOrientationEventHandlerFunc = (e = event) => {
        fillDeviceOrientationEventData(JSEvents.deviceOrientationEvent, e, target); // TODO: Thread-safety with respect to emscripten_get_deviceorientation_status()
  
        if (((a1, a2, a3) => dynCall_iiii(callbackfunc, a1, a2, a3))(eventTypeId, JSEvents.deviceOrientationEvent, userData)) e.preventDefault();
      };
  
      var eventHandler = {
        target: findEventTarget(target),
        eventTypeString,
        callbackfunc,
        handlerFunc: deviceOrientationEventHandlerFunc,
        useCapture
      };
      return JSEvents.registerOrRemoveHandler(eventHandler);
    };

  var _emscripten_set_deviceorientation_callback_on_thread = (userData, useCapture, callbackfunc, targetThread) => {
      return registerDeviceOrientationEventCallback(2, userData, useCapture, callbackfunc, 16, "deviceorientation", targetThread);
    };

  
  var _emscripten_get_deviceorientation_status = (orientationState) => {
      if (!JSEvents.deviceOrientationEvent) return -7;
      // HTML5 does not really have a polling API for device orientation events, so implement one manually by
      // returning the data from the most recently received event. This requires that user has registered
      // at least some no-op function as an event handler.
      HEAP32.set(HEAP32.subarray(JSEvents.deviceOrientationEvent, 32), orientationState);
      return 0;
    };

  var fillDeviceMotionEventData = (eventStruct, e, target) => {
      var supportedFields = 0;
      var a = e['acceleration'];
      supportedFields |= a && 1;
      var ag = e['accelerationIncludingGravity'];
      supportedFields |= ag && 2;
      var rr = e['rotationRate'];
      supportedFields |= rr && 4;
      a = a || {};
      ag = ag || {};
      rr = rr || {};
      HEAPF64[((eventStruct)>>3)] = a["x"];
      HEAPF64[(((eventStruct)+(8))>>3)] = a["y"];
      HEAPF64[(((eventStruct)+(16))>>3)] = a["z"];
      HEAPF64[(((eventStruct)+(24))>>3)] = ag["x"];
      HEAPF64[(((eventStruct)+(32))>>3)] = ag["y"];
      HEAPF64[(((eventStruct)+(40))>>3)] = ag["z"];
      HEAPF64[(((eventStruct)+(48))>>3)] = rr["alpha"];
      HEAPF64[(((eventStruct)+(56))>>3)] = rr["beta"];
      HEAPF64[(((eventStruct)+(64))>>3)] = rr["gamma"];
    };

  
  
  
  var registerDeviceMotionEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) => {
      if (!JSEvents.deviceMotionEvent) JSEvents.deviceMotionEvent = _malloc(80);
  
      var deviceMotionEventHandlerFunc = (e = event) => {
        fillDeviceMotionEventData(JSEvents.deviceMotionEvent, e, target); // TODO: Thread-safety with respect to emscripten_get_devicemotion_status()
  
        if (((a1, a2, a3) => dynCall_iiii(callbackfunc, a1, a2, a3))(eventTypeId, JSEvents.deviceMotionEvent, userData)) e.preventDefault();
      };
  
      var eventHandler = {
        target: findEventTarget(target),
        eventTypeString,
        callbackfunc,
        handlerFunc: deviceMotionEventHandlerFunc,
        useCapture
      };
      return JSEvents.registerOrRemoveHandler(eventHandler);
    };

  var _emscripten_set_devicemotion_callback_on_thread = (userData, useCapture, callbackfunc, targetThread) => {
      return registerDeviceMotionEventCallback(2, userData, useCapture, callbackfunc, 17, "devicemotion", targetThread);
    };

  var _emscripten_get_devicemotion_status = (motionState) => {
      if (!JSEvents.deviceMotionEvent) return -7;
      // HTML5 does not really have a polling API for device motion events, so implement one manually by
      // returning the data from the most recently received event. This requires that user has registered
      // at least some no-op function as an event handler.
      HEAP32.set(HEAP32.subarray(JSEvents.deviceMotionEvent, 80), motionState);
      return 0;
    };

  var screenOrientation = () => {
      if (!window.screen) return undefined;
      return screen.orientation || screen['mozOrientation'] || screen['webkitOrientation'];
    };

  var fillOrientationChangeEventData = (eventStruct) => {
      // OrientationType enum
      var orientationsType1 = ['portrait-primary', 'portrait-secondary', 'landscape-primary', 'landscape-secondary'];
      // alternative selection from OrientationLockType enum
      var orientationsType2 = ['portrait',         'portrait',           'landscape',         'landscape'];
  
      var orientationIndex = 0;
      var orientationAngle = 0;
      var screenOrientObj  = screenOrientation();
      if (typeof screenOrientObj === 'object') {
        orientationIndex = orientationsType1.indexOf(screenOrientObj.type);
        if (orientationIndex < 0) {
          orientationIndex = orientationsType2.indexOf(screenOrientObj.type);
        }
        if (orientationIndex >= 0) {
          orientationIndex = 1 << orientationIndex;
        }
        orientationAngle = screenOrientObj.angle;
      }
      else {
        // fallback for Safari earlier than 16.4 (March 2023)
        orientationAngle = window.orientation;
      }
  
      HEAP32[((eventStruct)>>2)] = orientationIndex;
      HEAP32[(((eventStruct)+(4))>>2)] = orientationAngle;
    };

  
  
  
  var registerOrientationChangeEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) => {
      if (!JSEvents.orientationChangeEvent) JSEvents.orientationChangeEvent = _malloc(8);
  
      var orientationChangeEventHandlerFunc = (e = event) => {
        var orientationChangeEvent = JSEvents.orientationChangeEvent;
  
        fillOrientationChangeEventData(orientationChangeEvent);
  
        if (((a1, a2, a3) => dynCall_iiii(callbackfunc, a1, a2, a3))(eventTypeId, orientationChangeEvent, userData)) e.preventDefault();
      };
  
      var eventHandler = {
        target,
        eventTypeString,
        callbackfunc,
        handlerFunc: orientationChangeEventHandlerFunc,
        useCapture
      };
      return JSEvents.registerOrRemoveHandler(eventHandler);
    };

  var _emscripten_set_orientationchange_callback_on_thread = (userData, useCapture, callbackfunc, targetThread) => {
      if (!window.screen || !screen.orientation) return -1;
      return registerOrientationChangeEventCallback(screen.orientation, userData, useCapture, callbackfunc, 18, 'change', targetThread);
    };

  
  var _emscripten_get_orientation_status = (orientationChangeEvent) => {
      // screenOrientation() resolving standard, window.orientation being the deprecated mobile-only
      if (!screenOrientation() && typeof orientation == 'undefined') return -1;
      fillOrientationChangeEventData(orientationChangeEvent);
      return 0;
    };

  var _emscripten_lock_orientation = (allowedOrientations) => {
      var orientations = [];
      if (allowedOrientations & 1) orientations.push("portrait-primary");
      if (allowedOrientations & 2) orientations.push("portrait-secondary");
      if (allowedOrientations & 4) orientations.push("landscape-primary");
      if (allowedOrientations & 8) orientations.push("landscape-secondary");
      var succeeded;
      if (screen.lockOrientation) {
        succeeded = screen.lockOrientation(orientations);
      } else if (screen.mozLockOrientation) {
        succeeded = screen.mozLockOrientation(orientations);
      } else if (screen.webkitLockOrientation) {
        succeeded = screen.webkitLockOrientation(orientations);
      } else {
        return -1;
      }
      if (succeeded) {
        return 0;
      }
      return -6;
    };

  var _emscripten_unlock_orientation = () => {
      if (screen.unlockOrientation) {
        screen.unlockOrientation();
      } else if (screen.mozUnlockOrientation) {
        screen.mozUnlockOrientation();
      } else if (screen.webkitUnlockOrientation) {
        screen.webkitUnlockOrientation();
      } else {
        return -1;
      }
      return 0;
    };

  
  var fillFullscreenChangeEventData = (eventStruct) => {
      var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
      var isFullscreen = !!fullscreenElement;
      // Assigning a boolean to HEAP32 with expected type coercion.
      /** @suppress{checkTypes} */
      HEAP8[eventStruct] = isFullscreen;
      HEAP8[(eventStruct)+(1)] = JSEvents.fullscreenEnabled();
      // If transitioning to fullscreen, report info about the element that is now fullscreen.
      // If transitioning to windowed mode, report info about the element that just was fullscreen.
      var reportedElement = isFullscreen ? fullscreenElement : JSEvents.previousFullscreenElement;
      var nodeName = JSEvents.getNodeNameForTarget(reportedElement);
      var id = reportedElement?.id || '';
      stringToUTF8(nodeName, eventStruct + 2, 128);
      stringToUTF8(id, eventStruct + 130, 128);
      HEAP32[(((eventStruct)+(260))>>2)] = reportedElement ? reportedElement.clientWidth : 0;
      HEAP32[(((eventStruct)+(264))>>2)] = reportedElement ? reportedElement.clientHeight : 0;
      HEAP32[(((eventStruct)+(268))>>2)] = screen.width;
      HEAP32[(((eventStruct)+(272))>>2)] = screen.height;
      if (isFullscreen) {
        JSEvents.previousFullscreenElement = fullscreenElement;
      }
    };

  
  
  
  var registerFullscreenChangeEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) => {
      if (!JSEvents.fullscreenChangeEvent) JSEvents.fullscreenChangeEvent = _malloc(276);
  
      var fullscreenChangeEventhandlerFunc = (e = event) => {
        var fullscreenChangeEvent = JSEvents.fullscreenChangeEvent;
  
        fillFullscreenChangeEventData(fullscreenChangeEvent);
  
        if (((a1, a2, a3) => dynCall_iiii(callbackfunc, a1, a2, a3))(eventTypeId, fullscreenChangeEvent, userData)) e.preventDefault();
      };
  
      var eventHandler = {
        target,
        eventTypeString,
        callbackfunc,
        handlerFunc: fullscreenChangeEventhandlerFunc,
        useCapture
      };
      return JSEvents.registerOrRemoveHandler(eventHandler);
    };

  
  
  
  var _emscripten_set_fullscreenchange_callback_on_thread = (target, userData, useCapture, callbackfunc, targetThread) => {
      if (!JSEvents.fullscreenEnabled()) return -1;
      target = findEventTarget(target);
      if (!target) return -4;
  
      // Unprefixed Fullscreen API shipped in Chromium 71 (https://bugs.chromium.org/p/chromium/issues/detail?id=383813)
      // As of Safari 13.0.3 on macOS Catalina 10.15.1 still ships with prefixed webkitfullscreenchange. TODO: revisit this check once Safari ships unprefixed version.
      registerFullscreenChangeEventCallback(target, userData, useCapture, callbackfunc, 19, "webkitfullscreenchange", targetThread);
  
      return registerFullscreenChangeEventCallback(target, userData, useCapture, callbackfunc, 19, "fullscreenchange", targetThread);
    };

  
  var _emscripten_get_fullscreen_status = (fullscreenStatus) => {
      if (!JSEvents.fullscreenEnabled()) return -1;
      fillFullscreenChangeEventData(fullscreenStatus);
      return 0;
    };

  
  
  
  var _emscripten_get_canvas_element_size = (target, width, height) => {
      var canvas = findCanvasEventTarget(target);
      if (!canvas) return -4;
      HEAP32[((width)>>2)] = canvas.width;
      HEAP32[((height)>>2)] = canvas.height;
    };
  
  
  
  var getCanvasElementSize = (target) => {
      var sp = stackSave();
      var w = stackAlloc(8);
      var h = w + 4;
  
      var targetInt = stringToUTF8OnStack(target.id);
      var ret = _emscripten_get_canvas_element_size(targetInt, w, h);
      var size = [HEAP32[((w)>>2)], HEAP32[((h)>>2)]];
      stackRestore(sp);
      return size;
    };
  
  
  var _emscripten_set_canvas_element_size = (target, width, height) => {
      var canvas = findCanvasEventTarget(target);
      if (!canvas) return -4;
      canvas.width = width;
      canvas.height = height;
      return 0;
    };
  
  
  
  var setCanvasElementSize = (target, width, height) => {
      if (!target.controlTransferredOffscreen) {
        target.width = width;
        target.height = height;
      } else {
        // This function is being called from high-level JavaScript code instead of asm.js/Wasm,
        // and it needs to synchronously proxy over to another thread, so marshal the string onto the heap to do the call.
        var sp = stackSave();
        var targetInt = stringToUTF8OnStack(target.id);
        _emscripten_set_canvas_element_size(targetInt, width, height);
        stackRestore(sp);
      }
    };
  var registerRestoreOldStyle = (canvas) => {
      var canvasSize = getCanvasElementSize(canvas);
      var oldWidth = canvasSize[0];
      var oldHeight = canvasSize[1];
      var oldCssWidth = canvas.style.width;
      var oldCssHeight = canvas.style.height;
      var oldBackgroundColor = canvas.style.backgroundColor; // Chrome reads color from here.
      var oldDocumentBackgroundColor = document.body.style.backgroundColor; // IE11 reads color from here.
      // Firefox always has black background color.
      var oldPaddingLeft = canvas.style.paddingLeft; // Chrome, FF, Safari
      var oldPaddingRight = canvas.style.paddingRight;
      var oldPaddingTop = canvas.style.paddingTop;
      var oldPaddingBottom = canvas.style.paddingBottom;
      var oldMarginLeft = canvas.style.marginLeft; // IE11
      var oldMarginRight = canvas.style.marginRight;
      var oldMarginTop = canvas.style.marginTop;
      var oldMarginBottom = canvas.style.marginBottom;
      var oldDocumentBodyMargin = document.body.style.margin;
      var oldDocumentOverflow = document.documentElement.style.overflow; // Chrome, Firefox
      var oldDocumentScroll = document.body.scroll; // IE
      var oldImageRendering = canvas.style.imageRendering;
  
      function restoreOldStyle() {
        var fullscreenElement = document.fullscreenElement
          || document.webkitFullscreenElement
          ;
        if (!fullscreenElement) {
          document.removeEventListener('fullscreenchange', restoreOldStyle);
  
          // Unprefixed Fullscreen API shipped in Chromium 71 (https://bugs.chromium.org/p/chromium/issues/detail?id=383813)
          // As of Safari 13.0.3 on macOS Catalina 10.15.1 still ships with prefixed webkitfullscreenchange. TODO: revisit this check once Safari ships unprefixed version.
          document.removeEventListener('webkitfullscreenchange', restoreOldStyle);
  
          setCanvasElementSize(canvas, oldWidth, oldHeight);
  
          canvas.style.width = oldCssWidth;
          canvas.style.height = oldCssHeight;
          canvas.style.backgroundColor = oldBackgroundColor; // Chrome
          // IE11 hack: assigning 'undefined' or an empty string to document.body.style.backgroundColor has no effect, so first assign back the default color
          // before setting the undefined value. Setting undefined value is also important, or otherwise we would later treat that as something that the user
          // had explicitly set so subsequent fullscreen transitions would not set background color properly.
          if (!oldDocumentBackgroundColor) document.body.style.backgroundColor = 'white';
          document.body.style.backgroundColor = oldDocumentBackgroundColor; // IE11
          canvas.style.paddingLeft = oldPaddingLeft; // Chrome, FF, Safari
          canvas.style.paddingRight = oldPaddingRight;
          canvas.style.paddingTop = oldPaddingTop;
          canvas.style.paddingBottom = oldPaddingBottom;
          canvas.style.marginLeft = oldMarginLeft; // IE11
          canvas.style.marginRight = oldMarginRight;
          canvas.style.marginTop = oldMarginTop;
          canvas.style.marginBottom = oldMarginBottom;
          document.body.style.margin = oldDocumentBodyMargin;
          document.documentElement.style.overflow = oldDocumentOverflow; // Chrome, Firefox
          document.body.scroll = oldDocumentScroll; // IE
          canvas.style.imageRendering = oldImageRendering;
          if (canvas.GLctxObject) canvas.GLctxObject.GLctx.viewport(0, 0, oldWidth, oldHeight);
  
          if (currentFullscreenStrategy.canvasResizedCallback) {
            ((a1, a2, a3) => dynCall_iiii(currentFullscreenStrategy.canvasResizedCallback, a1, a2, a3))(37, 0, currentFullscreenStrategy.canvasResizedCallbackUserData);
          }
        }
      }
      document.addEventListener('fullscreenchange', restoreOldStyle);
      // Unprefixed Fullscreen API shipped in Chromium 71 (https://bugs.chromium.org/p/chromium/issues/detail?id=383813)
      // As of Safari 13.0.3 on macOS Catalina 10.15.1 still ships with prefixed webkitfullscreenchange. TODO: revisit this check once Safari ships unprefixed version.
      document.addEventListener('webkitfullscreenchange', restoreOldStyle);
      return restoreOldStyle;
    };
  
  
  var setLetterbox = (element, topBottom, leftRight) => {
      // Cannot use margin to specify letterboxes in FF or Chrome, since those ignore margins in fullscreen mode.
      element.style.paddingLeft = element.style.paddingRight = leftRight + 'px';
      element.style.paddingTop = element.style.paddingBottom = topBottom + 'px';
    };
  
  
  var JSEvents_resizeCanvasForFullscreen = (target, strategy) => {
      var restoreOldStyle = registerRestoreOldStyle(target);
      var cssWidth = strategy.softFullscreen ? innerWidth : screen.width;
      var cssHeight = strategy.softFullscreen ? innerHeight : screen.height;
      var rect = getBoundingClientRect(target);
      var windowedCssWidth = rect.width;
      var windowedCssHeight = rect.height;
      var canvasSize = getCanvasElementSize(target);
      var windowedRttWidth = canvasSize[0];
      var windowedRttHeight = canvasSize[1];
  
      if (strategy.scaleMode == 3) {
        setLetterbox(target, (cssHeight - windowedCssHeight) / 2, (cssWidth - windowedCssWidth) / 2);
        cssWidth = windowedCssWidth;
        cssHeight = windowedCssHeight;
      } else if (strategy.scaleMode == 2) {
        if (cssWidth*windowedRttHeight < windowedRttWidth*cssHeight) {
          var desiredCssHeight = windowedRttHeight * cssWidth / windowedRttWidth;
          setLetterbox(target, (cssHeight - desiredCssHeight) / 2, 0);
          cssHeight = desiredCssHeight;
        } else {
          var desiredCssWidth = windowedRttWidth * cssHeight / windowedRttHeight;
          setLetterbox(target, 0, (cssWidth - desiredCssWidth) / 2);
          cssWidth = desiredCssWidth;
        }
      }
  
      // If we are adding padding, must choose a background color or otherwise Chrome will give the
      // padding a default white color. Do it only if user has not customized their own background color.
      if (!target.style.backgroundColor) target.style.backgroundColor = 'black';
      // IE11 does the same, but requires the color to be set in the document body.
      if (!document.body.style.backgroundColor) document.body.style.backgroundColor = 'black'; // IE11
      // Firefox always shows black letterboxes independent of style color.
  
      target.style.width = cssWidth + 'px';
      target.style.height = cssHeight + 'px';
  
      if (strategy.filteringMode == 1) {
        target.style.imageRendering = 'optimizeSpeed';
        target.style.imageRendering = '-moz-crisp-edges';
        target.style.imageRendering = '-o-crisp-edges';
        target.style.imageRendering = '-webkit-optimize-contrast';
        target.style.imageRendering = 'optimize-contrast';
        target.style.imageRendering = 'crisp-edges';
        target.style.imageRendering = 'pixelated';
      }
  
      var dpiScale = (strategy.canvasResolutionScaleMode == 2) ? devicePixelRatio : 1;
      if (strategy.canvasResolutionScaleMode != 0) {
        var newWidth = (cssWidth * dpiScale)|0;
        var newHeight = (cssHeight * dpiScale)|0;
        setCanvasElementSize(target, newWidth, newHeight);
        if (target.GLctxObject) target.GLctxObject.GLctx.viewport(0, 0, newWidth, newHeight);
      }
      return restoreOldStyle;
    };
  var JSEvents_requestFullscreen = (target, strategy) => {
      // EMSCRIPTEN_FULLSCREEN_SCALE_DEFAULT + EMSCRIPTEN_FULLSCREEN_CANVAS_SCALE_NONE is a mode where no extra logic is performed to the DOM elements.
      if (strategy.scaleMode != 0 || strategy.canvasResolutionScaleMode != 0) {
        JSEvents_resizeCanvasForFullscreen(target, strategy);
      }
  
      if (target.requestFullscreen) {
        target.requestFullscreen();
      } else if (target.webkitRequestFullscreen) {
        target.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      } else {
        return JSEvents.fullscreenEnabled() ? -3 : -1;
      }
  
      currentFullscreenStrategy = strategy;
  
      if (strategy.canvasResizedCallback) {
        ((a1, a2, a3) => dynCall_iiii(strategy.canvasResizedCallback, a1, a2, a3))(37, 0, strategy.canvasResizedCallbackUserData);
      }
  
      return 0;
    };



  var hideEverythingExceptGivenElement = (onlyVisibleElement) => {
      var child = onlyVisibleElement;
      var parent = child.parentNode;
      var hiddenElements = [];
      while (child != document.body) {
        var children = parent.children;
        for (var i = 0; i < children.length; ++i) {
          if (children[i] != child) {
            hiddenElements.push({ node: children[i], displayState: children[i].style.display });
            children[i].style.display = 'none';
          }
        }
        child = parent;
        parent = parent.parentNode;
      }
      return hiddenElements;
    };

  var restoreHiddenElements = (hiddenElements) => {
      for (var elem of hiddenElements) {
        elem.node.style.display = elem.displayState;
      }
    };


  var currentFullscreenStrategy = {
  };

  var restoreOldWindowedStyle = null;

  
  
  
  
  
  var softFullscreenResizeWebGLRenderTarget = () => {
      var dpr = devicePixelRatio;
      var inHiDPIFullscreenMode = currentFullscreenStrategy.canvasResolutionScaleMode == 2;
      var inAspectRatioFixedFullscreenMode = currentFullscreenStrategy.scaleMode == 2;
      var inPixelPerfectFullscreenMode = currentFullscreenStrategy.canvasResolutionScaleMode != 0;
      var inCenteredWithoutScalingFullscreenMode = currentFullscreenStrategy.scaleMode == 3;
      var screenWidth = inHiDPIFullscreenMode ? Math.round(innerWidth*dpr) : innerWidth;
      var screenHeight = inHiDPIFullscreenMode ? Math.round(innerHeight*dpr) : innerHeight;
      var w = screenWidth;
      var h = screenHeight;
      var canvas = currentFullscreenStrategy.target;
      var canvasSize = getCanvasElementSize(canvas);
      var x = canvasSize[0];
      var y = canvasSize[1];
      var topMargin;
  
      if (inAspectRatioFixedFullscreenMode) {
        if (w*y < x*h) h = (w * y / x) | 0;
        else if (w*y > x*h) w = (h * x / y) | 0;
        topMargin = ((screenHeight - h) / 2) | 0;
      }
  
      if (inPixelPerfectFullscreenMode) {
        setCanvasElementSize(canvas, w, h);
        if (canvas.GLctxObject) canvas.GLctxObject.GLctx.viewport(0, 0, w, h);
      }
  
      // Back to CSS pixels.
      if (inHiDPIFullscreenMode) {
        topMargin /= dpr;
        w /= dpr;
        h /= dpr;
        // Round to nearest 4 digits of precision.
        w = Math.round(w*1e4)/1e4;
        h = Math.round(h*1e4)/1e4;
        topMargin = Math.round(topMargin*1e4)/1e4;
      }
  
      if (inCenteredWithoutScalingFullscreenMode) {
        var t = (innerHeight - jstoi_q(canvas.style.height)) / 2;
        var b = (innerWidth - jstoi_q(canvas.style.width)) / 2;
        setLetterbox(canvas, t, b);
      } else {
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        var b = (innerWidth - w) / 2;
        setLetterbox(canvas, topMargin, b);
      }
  
      if (!inCenteredWithoutScalingFullscreenMode && currentFullscreenStrategy.canvasResizedCallback) {
        ((a1, a2, a3) => dynCall_iiii(currentFullscreenStrategy.canvasResizedCallback, a1, a2, a3))(37, 0, currentFullscreenStrategy.canvasResizedCallbackUserData);
      }
    };

  
  
  
  
  
  
  
  var doRequestFullscreen = (target, strategy) => {
      if (!JSEvents.fullscreenEnabled()) return -1;
      target = findEventTarget(target);
      if (!target) return -4;
  
      if (!target.requestFullscreen
        && !target.webkitRequestFullscreen
        ) {
        return -3;
      }
  
      // Queue this function call if we're not currently in an event handler and
      // the user saw it appropriate to do so.
      if (!JSEvents.canPerformEventHandlerRequests()) {
        if (strategy.deferUntilInEventHandler) {
          JSEvents.deferCall(JSEvents_requestFullscreen, 1 /* priority over pointer lock */, [target, strategy]);
          return 1;
        }
        return -2;
      }
  
      return JSEvents_requestFullscreen(target, strategy);
    };

  var _emscripten_request_fullscreen = (target, deferUntilInEventHandler) => {
      var strategy = {
        // These options perform no added logic, but just bare request fullscreen.
        scaleMode: 0,
        canvasResolutionScaleMode: 0,
        filteringMode: 0,
        deferUntilInEventHandler,
        canvasResizedCallbackTargetThread: 2
      };
      return doRequestFullscreen(target, strategy);
    };

  
  
  var _emscripten_request_fullscreen_strategy = (target, deferUntilInEventHandler, fullscreenStrategy) => {
      var strategy = {
        scaleMode: HEAP32[((fullscreenStrategy)>>2)],
        canvasResolutionScaleMode: HEAP32[(((fullscreenStrategy)+(4))>>2)],
        filteringMode: HEAP32[(((fullscreenStrategy)+(8))>>2)],
        deferUntilInEventHandler,
        canvasResizedCallback: HEAP32[(((fullscreenStrategy)+(12))>>2)],
        canvasResizedCallbackUserData: HEAP32[(((fullscreenStrategy)+(16))>>2)]
      };
  
      return doRequestFullscreen(target, strategy);
    };

  
  
  
  
  
  
  
  
  
  
  
  var _emscripten_enter_soft_fullscreen = (target, fullscreenStrategy) => {
      target = findEventTarget(target);
      if (!target) return -4;
  
      var strategy = {
          scaleMode: HEAP32[((fullscreenStrategy)>>2)],
          canvasResolutionScaleMode: HEAP32[(((fullscreenStrategy)+(4))>>2)],
          filteringMode: HEAP32[(((fullscreenStrategy)+(8))>>2)],
          canvasResizedCallback: HEAP32[(((fullscreenStrategy)+(12))>>2)],
          canvasResizedCallbackUserData: HEAP32[(((fullscreenStrategy)+(16))>>2)],
          target,
          softFullscreen: true
      };
  
      var restoreOldStyle = JSEvents_resizeCanvasForFullscreen(target, strategy);
  
      document.documentElement.style.overflow = 'hidden';  // Firefox, Chrome
      document.body.scroll = "no"; // IE11
      document.body.style.margin = '0px'; // Override default document margin area on all browsers.
  
      var hiddenElements = hideEverythingExceptGivenElement(target);
  
      function restoreWindowedState() {
        restoreOldStyle();
        restoreHiddenElements(hiddenElements);
        removeEventListener('resize', softFullscreenResizeWebGLRenderTarget);
        if (strategy.canvasResizedCallback) {
          ((a1, a2, a3) => dynCall_iiii(strategy.canvasResizedCallback, a1, a2, a3))(37, 0, strategy.canvasResizedCallbackUserData);
        }
        currentFullscreenStrategy = 0;
      }
      restoreOldWindowedStyle = restoreWindowedState;
      currentFullscreenStrategy = strategy;
      addEventListener('resize', softFullscreenResizeWebGLRenderTarget);
  
      // Inform the caller that the canvas size has changed.
      if (strategy.canvasResizedCallback) {
        ((a1, a2, a3) => dynCall_iiii(strategy.canvasResizedCallback, a1, a2, a3))(37, 0, strategy.canvasResizedCallbackUserData);
      }
  
      return 0;
    };

  var _emscripten_exit_soft_fullscreen = () => {
      restoreOldWindowedStyle?.();
      restoreOldWindowedStyle = null;
  
      return 0;
    };

  
  
  
  var _emscripten_exit_fullscreen = () => {
      if (!JSEvents.fullscreenEnabled()) return -1;
      // Make sure no queued up calls will fire after this.
      JSEvents.removeDeferredCalls(JSEvents_requestFullscreen);
  
      var d = specialHTMLTargets[1];
      if (d.exitFullscreen) {
        d.fullscreenElement && d.exitFullscreen();
      } else if (d.webkitExitFullscreen) {
        d.webkitFullscreenElement && d.webkitExitFullscreen();
      } else {
        return -1;
      }
  
      return 0;
    };

  
  var fillPointerlockChangeEventData = (eventStruct) => {
      var pointerLockElement = document.pointerLockElement || document.mozPointerLockElement || document.webkitPointerLockElement || document.msPointerLockElement;
      var isPointerlocked = !!pointerLockElement;
      // Assigning a boolean to HEAP32 with expected type coercion.
      /** @suppress{checkTypes} */
      HEAP8[eventStruct] = isPointerlocked;
      var nodeName = JSEvents.getNodeNameForTarget(pointerLockElement);
      var id = pointerLockElement?.id || '';
      stringToUTF8(nodeName, eventStruct + 1, 128);
      stringToUTF8(id, eventStruct + 129, 128);
    };

  
  
  
  var registerPointerlockChangeEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) => {
      if (!JSEvents.pointerlockChangeEvent) JSEvents.pointerlockChangeEvent = _malloc(257);
  
      var pointerlockChangeEventHandlerFunc = (e = event) => {
        var pointerlockChangeEvent = JSEvents.pointerlockChangeEvent;
        fillPointerlockChangeEventData(pointerlockChangeEvent);
  
        if (((a1, a2, a3) => dynCall_iiii(callbackfunc, a1, a2, a3))(eventTypeId, pointerlockChangeEvent, userData)) e.preventDefault();
      };
  
      var eventHandler = {
        target,
        eventTypeString,
        callbackfunc,
        handlerFunc: pointerlockChangeEventHandlerFunc,
        useCapture
      };
      return JSEvents.registerOrRemoveHandler(eventHandler);
    };

  
  
  
  /** @suppress {missingProperties} */
  var _emscripten_set_pointerlockchange_callback_on_thread = (target, userData, useCapture, callbackfunc, targetThread) => {
      // TODO: Currently not supported in pthreads or in --proxy-to-worker mode. (In pthreads mode, document object is not defined)
      if (!document || !document.body || (!document.body.requestPointerLock && !document.body.mozRequestPointerLock && !document.body.webkitRequestPointerLock && !document.body.msRequestPointerLock)) {
        return -1;
      }
  
      target = findEventTarget(target);
      if (!target) return -4;
      registerPointerlockChangeEventCallback(target, userData, useCapture, callbackfunc, 20, "mozpointerlockchange", targetThread);
      registerPointerlockChangeEventCallback(target, userData, useCapture, callbackfunc, 20, "webkitpointerlockchange", targetThread);
      registerPointerlockChangeEventCallback(target, userData, useCapture, callbackfunc, 20, "mspointerlockchange", targetThread);
      return registerPointerlockChangeEventCallback(target, userData, useCapture, callbackfunc, 20, "pointerlockchange", targetThread);
    };

  
  
  var registerPointerlockErrorEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) => {
  
      var pointerlockErrorEventHandlerFunc = (e = event) => {
        if (((a1, a2, a3) => dynCall_iiii(callbackfunc, a1, a2, a3))(eventTypeId, 0, userData)) e.preventDefault();
      };
  
      var eventHandler = {
        target,
        eventTypeString,
        callbackfunc,
        handlerFunc: pointerlockErrorEventHandlerFunc,
        useCapture
      };
      return JSEvents.registerOrRemoveHandler(eventHandler);
    };

  
  
  
  /** @suppress {missingProperties} */
  var _emscripten_set_pointerlockerror_callback_on_thread = (target, userData, useCapture, callbackfunc, targetThread) => {
      // TODO: Currently not supported in pthreads or in --proxy-to-worker mode. (In pthreads mode, document object is not defined)
      if (!document || !document.body.requestPointerLock && !document.body.mozRequestPointerLock && !document.body.webkitRequestPointerLock && !document.body.msRequestPointerLock) {
        return -1;
      }
  
      target = findEventTarget(target);
  
      if (!target) return -4;
      registerPointerlockErrorEventCallback(target, userData, useCapture, callbackfunc, 38, "mozpointerlockerror", targetThread);
      registerPointerlockErrorEventCallback(target, userData, useCapture, callbackfunc, 38, "webkitpointerlockerror", targetThread);
      registerPointerlockErrorEventCallback(target, userData, useCapture, callbackfunc, 38, "mspointerlockerror", targetThread);
      return registerPointerlockErrorEventCallback(target, userData, useCapture, callbackfunc, 38, "pointerlockerror", targetThread);
    };

  /** @suppress {missingProperties} */
  var _emscripten_get_pointerlock_status = (pointerlockStatus) => {
      if (pointerlockStatus) fillPointerlockChangeEventData(pointerlockStatus);
      if (!document.body || (!document.body.requestPointerLock && !document.body.mozRequestPointerLock && !document.body.webkitRequestPointerLock && !document.body.msRequestPointerLock)) {
        return -1;
      }
      return 0;
    };

  var requestPointerLock = (target) => {
      if (target.requestPointerLock) {
        target.requestPointerLock();
      } else {
        // document.body is known to accept pointer lock, so use that to differentiate if the user passed a bad element,
        // or if the whole browser just doesn't support the feature.
        if (document.body.requestPointerLock
          ) {
          return -3;
        }
        return -1;
      }
      return 0;
    };

  
  
  var _emscripten_request_pointerlock = (target, deferUntilInEventHandler) => {
      target = findEventTarget(target);
      if (!target) return -4;
      if (!target.requestPointerLock
        ) {
        return -1;
      }
  
      // Queue this function call if we're not currently in an event handler and
      // the user saw it appropriate to do so.
      if (!JSEvents.canPerformEventHandlerRequests()) {
        if (deferUntilInEventHandler) {
          JSEvents.deferCall(requestPointerLock, 2 /* priority below fullscreen */, [target]);
          return 1;
        }
        return -2;
      }
  
      return requestPointerLock(target);
    };

  
  var _emscripten_exit_pointerlock = () => {
      // Make sure no queued up calls will fire after this.
      JSEvents.removeDeferredCalls(requestPointerLock);
  
      if (document.exitPointerLock) {
        document.exitPointerLock();
      } else {
        return -1;
      }
      return 0;
    };

  var _emscripten_vibrate = (msecs) => {
      if (!navigator.vibrate) return -1;
      navigator.vibrate(msecs);
      return 0;
    };

  var _emscripten_vibrate_pattern = (msecsArray, numEntries) => {
      if (!navigator.vibrate) return -1;
  
      var vibrateList = [];
      for (var i = 0; i < numEntries; ++i) {
        var msecs = HEAP32[(((msecsArray)+(i*4))>>2)];
        vibrateList.push(msecs);
      }
      navigator.vibrate(vibrateList);
      return 0;
    };

  var fillVisibilityChangeEventData = (eventStruct) => {
      var visibilityStates = [ "hidden", "visible", "prerender", "unloaded" ];
      var visibilityState = visibilityStates.indexOf(document.visibilityState);
  
      // Assigning a boolean to HEAP32 with expected type coercion.
      /** @suppress{checkTypes} */
      HEAP8[eventStruct] = document.hidden;
      HEAP32[(((eventStruct)+(4))>>2)] = visibilityState;
    };

  
  
  
  var registerVisibilityChangeEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) => {
      if (!JSEvents.visibilityChangeEvent) JSEvents.visibilityChangeEvent = _malloc(8);
  
      var visibilityChangeEventHandlerFunc = (e = event) => {
        var visibilityChangeEvent = JSEvents.visibilityChangeEvent;
  
        fillVisibilityChangeEventData(visibilityChangeEvent);
  
        if (((a1, a2, a3) => dynCall_iiii(callbackfunc, a1, a2, a3))(eventTypeId, visibilityChangeEvent, userData)) e.preventDefault();
      };
  
      var eventHandler = {
        target,
        eventTypeString,
        callbackfunc,
        handlerFunc: visibilityChangeEventHandlerFunc,
        useCapture
      };
      return JSEvents.registerOrRemoveHandler(eventHandler);
    };

  
  var _emscripten_set_visibilitychange_callback_on_thread = (userData, useCapture, callbackfunc, targetThread) => {
    if (!specialHTMLTargets[1]) {
      return -4;
    }
      return registerVisibilityChangeEventCallback(specialHTMLTargets[1], userData, useCapture, callbackfunc, 21, "visibilitychange", targetThread);
    };

  var _emscripten_get_visibility_status = (visibilityStatus) => {
      if (typeof document.visibilityState == 'undefined' && typeof document.hidden == 'undefined') {
        return -1;
      }
      fillVisibilityChangeEventData(visibilityStatus);
      return 0;
    };

  
  
  
  var registerTouchEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) => {
      if (!JSEvents.touchEvent) JSEvents.touchEvent = _malloc(1552);
  
      target = findEventTarget(target);
  
      var touchEventHandlerFunc = (e) => {
        assert(e);
        var t, touches = {}, et = e.touches;
        // To ease marshalling different kinds of touches that browser reports (all touches are listed in e.touches,
        // only changed touches in e.changedTouches, and touches on target at a.targetTouches), mark a boolean in
        // each Touch object so that we can later loop only once over all touches we see to marshall over to Wasm.
  
        for (let t of et) {
          // Browser might recycle the generated Touch objects between each frame (Firefox on Android), so reset any
          // changed/target states we may have set from previous frame.
          t.isChanged = t.onTarget = 0;
          touches[t.identifier] = t;
        }
        // Mark which touches are part of the changedTouches list.
        for (let t of e.changedTouches) {
          t.isChanged = 1;
          touches[t.identifier] = t;
        }
        // Mark which touches are part of the targetTouches list.
        for (let t of e.targetTouches) {
          touches[t.identifier].onTarget = 1;
        }
  
        var touchEvent = JSEvents.touchEvent;
        HEAPF64[((touchEvent)>>3)] = e.timeStamp;
        HEAP8[touchEvent + 12] = e.ctrlKey;
        HEAP8[touchEvent + 13] = e.shiftKey;
        HEAP8[touchEvent + 14] = e.altKey;
        HEAP8[touchEvent + 15] = e.metaKey;
        var idx = touchEvent + 16;
        var targetRect = getBoundingClientRect(target);
        var numTouches = 0;
        for (let t of Object.values(touches)) {
          var idx32 = ((idx)>>2); // Pre-shift the ptr to index to HEAP32 to save code size
          HEAP32[idx32 + 0] = t.identifier;
          HEAP32[idx32 + 1] = t.screenX;
          HEAP32[idx32 + 2] = t.screenY;
          HEAP32[idx32 + 3] = t.clientX;
          HEAP32[idx32 + 4] = t.clientY;
          HEAP32[idx32 + 5] = t.pageX;
          HEAP32[idx32 + 6] = t.pageY;
          HEAP8[idx + 28] = t.isChanged;
          HEAP8[idx + 29] = t.onTarget;
          HEAP32[idx32 + 8] = t.clientX - (targetRect.left | 0);
          HEAP32[idx32 + 9] = t.clientY - (targetRect.top  | 0);
  
          idx += 48;
  
          if (++numTouches > 31) {
            break;
          }
        }
        HEAP32[(((touchEvent)+(8))>>2)] = numTouches;
  
        if (((a1, a2, a3) => dynCall_iiii(callbackfunc, a1, a2, a3))(eventTypeId, touchEvent, userData)) e.preventDefault();
      };
  
      var eventHandler = {
        target,
        allowsDeferredCalls: eventTypeString == 'touchstart' || eventTypeString == 'touchend',
        eventTypeString,
        callbackfunc,
        handlerFunc: touchEventHandlerFunc,
        useCapture
      };
      return JSEvents.registerOrRemoveHandler(eventHandler);
    };

  var _emscripten_set_touchstart_callback_on_thread = (target, userData, useCapture, callbackfunc, targetThread) =>
      registerTouchEventCallback(target, userData, useCapture, callbackfunc, 22, "touchstart", targetThread);

  var _emscripten_set_touchend_callback_on_thread = (target, userData, useCapture, callbackfunc, targetThread) =>
      registerTouchEventCallback(target, userData, useCapture, callbackfunc, 23, "touchend", targetThread);

  var _emscripten_set_touchmove_callback_on_thread = (target, userData, useCapture, callbackfunc, targetThread) =>
      registerTouchEventCallback(target, userData, useCapture, callbackfunc, 24, "touchmove", targetThread);

  var _emscripten_set_touchcancel_callback_on_thread = (target, userData, useCapture, callbackfunc, targetThread) =>
      registerTouchEventCallback(target, userData, useCapture, callbackfunc, 25, "touchcancel", targetThread);

  var fillGamepadEventData = (eventStruct, e) => {
      HEAPF64[((eventStruct)>>3)] = e.timestamp;
      for (var i = 0; i < e.axes.length; ++i) {
        HEAPF64[(((eventStruct+i*8)+(16))>>3)] = e.axes[i];
      }
      for (var i = 0; i < e.buttons.length; ++i) {
        if (typeof e.buttons[i] == 'object') {
          HEAPF64[(((eventStruct+i*8)+(528))>>3)] = e.buttons[i].value;
        } else {
          HEAPF64[(((eventStruct+i*8)+(528))>>3)] = e.buttons[i];
        }
      }
      for (var i = 0; i < e.buttons.length; ++i) {
        if (typeof e.buttons[i] == 'object') {
          HEAP8[(eventStruct+i)+(1040)] = e.buttons[i].pressed;
        } else {
          // Assigning a boolean to HEAP32, that's ok, but Closure would like to warn about it:
          /** @suppress {checkTypes} */
          HEAP8[(eventStruct+i)+(1040)] = e.buttons[i] == 1;
        }
      }
      HEAP8[(eventStruct)+(1104)] = e.connected;
      HEAP32[(((eventStruct)+(1108))>>2)] = e.index;
      HEAP32[(((eventStruct)+(8))>>2)] = e.axes.length;
      HEAP32[(((eventStruct)+(12))>>2)] = e.buttons.length;
      stringToUTF8(e.id, eventStruct + 1112, 64);
      stringToUTF8(e.mapping, eventStruct + 1176, 64);
    };

  
  
  
  var registerGamepadEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) => {
      if (!JSEvents.gamepadEvent) JSEvents.gamepadEvent = _malloc(1240);
  
      var gamepadEventHandlerFunc = (e = event) => {
        var gamepadEvent = JSEvents.gamepadEvent;
        fillGamepadEventData(gamepadEvent, e["gamepad"]);
  
        if (((a1, a2, a3) => dynCall_iiii(callbackfunc, a1, a2, a3))(eventTypeId, gamepadEvent, userData)) e.preventDefault();
      };
  
      var eventHandler = {
        target: findEventTarget(target),
        allowsDeferredCalls: true,
        eventTypeString,
        callbackfunc,
        handlerFunc: gamepadEventHandlerFunc,
        useCapture
      };
      return JSEvents.registerOrRemoveHandler(eventHandler);
    };

  
  /** @suppress {checkTypes} */
  var _emscripten_sample_gamepad_data = () => {
      try {
        if (navigator.getGamepads) return (JSEvents.lastGamepadState = navigator.getGamepads())
          ? 0 : -1;
      } catch(e) {
        err(`navigator.getGamepads() exists, but failed to execute with exception ${e}. Disabling Gamepad access.`);
        navigator.getGamepads = null; // Disable getGamepads() so that it won't be attempted to be used again.
      }
      return -1;
    };
  var _emscripten_set_gamepadconnected_callback_on_thread = (userData, useCapture, callbackfunc, targetThread) => {
      if (_emscripten_sample_gamepad_data()) return -1;
      return registerGamepadEventCallback(2, userData, useCapture, callbackfunc, 26, "gamepadconnected", targetThread);
    };

  
  var _emscripten_set_gamepaddisconnected_callback_on_thread = (userData, useCapture, callbackfunc, targetThread) => {
      if (_emscripten_sample_gamepad_data()) return -1;
      return registerGamepadEventCallback(2, userData, useCapture, callbackfunc, 27, "gamepaddisconnected", targetThread);
    };


  var _emscripten_get_num_gamepads = () => {
      if (!JSEvents.lastGamepadState) throw 'emscripten_get_num_gamepads() can only be called after having first called emscripten_sample_gamepad_data() and that function has returned EMSCRIPTEN_RESULT_SUCCESS!';
      // N.B. Do not call emscripten_get_num_gamepads() unless having first called emscripten_sample_gamepad_data(), and that has returned EMSCRIPTEN_RESULT_SUCCESS.
      // Otherwise the following line will throw an exception.
      return JSEvents.lastGamepadState.length;
    };

  
  var _emscripten_get_gamepad_status = (index, gamepadState) => {
      if (!JSEvents.lastGamepadState) throw 'emscripten_get_gamepad_status() can only be called after having first called emscripten_sample_gamepad_data() and that function has returned EMSCRIPTEN_RESULT_SUCCESS!';
      // INVALID_PARAM is returned on a Gamepad index that never was there.
      if (index < 0 || index >= JSEvents.lastGamepadState.length) return -5;
  
      // NO_DATA is returned on a Gamepad index that was removed.
      // For previously disconnected gamepads there should be an empty slot (null/undefined/false) at the index.
      // This is because gamepads must keep their original position in the array.
      // For example, removing the first of two gamepads produces [null/undefined/false, gamepad].
      if (!JSEvents.lastGamepadState[index]) return -7;
  
      fillGamepadEventData(gamepadState, JSEvents.lastGamepadState[index]);
      return 0;
    };

  
  
  var registerBeforeUnloadEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) => {
      var beforeUnloadEventHandlerFunc = (e = event) => {
        // Note: This is always called on the main browser thread, since it needs synchronously return a value!
        var confirmationMessage = ((a1, a2, a3) => dynCall_iiii(callbackfunc, a1, a2, a3))(eventTypeId, 0, userData);
  
        if (confirmationMessage) {
          confirmationMessage = UTF8ToString(confirmationMessage);
        }
        if (confirmationMessage) {
          e.preventDefault();
          e.returnValue = confirmationMessage;
          return confirmationMessage;
        }
      };
  
      var eventHandler = {
        target: findEventTarget(target),
        eventTypeString,
        callbackfunc,
        handlerFunc: beforeUnloadEventHandlerFunc,
        useCapture
      };
      return JSEvents.registerOrRemoveHandler(eventHandler);
    };

  var _emscripten_set_beforeunload_callback_on_thread = (userData, callbackfunc, targetThread) => {
      if (typeof onbeforeunload == 'undefined') return -1;
      // beforeunload callback can only be registered on the main browser thread, because the page will go away immediately after returning from the handler,
      // and there is no time to start proxying it anywhere.
      if (targetThread !== 1) return -5;
      return registerBeforeUnloadEventCallback(2, userData, true, callbackfunc, 28, "beforeunload");
    };

  var fillBatteryEventData = (eventStruct, e) => {
      HEAPF64[((eventStruct)>>3)] = e.chargingTime;
      HEAPF64[(((eventStruct)+(8))>>3)] = e.dischargingTime;
      HEAPF64[(((eventStruct)+(16))>>3)] = e.level;
      HEAP8[(eventStruct)+(24)] = e.charging;
    };

  var battery = () => navigator.battery || navigator.mozBattery || navigator.webkitBattery;

  
  
  
  
  var registerBatteryEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) => {
      if (!JSEvents.batteryEvent) JSEvents.batteryEvent = _malloc(32);
  
      var batteryEventHandlerFunc = (e = event) => {
        var batteryEvent = JSEvents.batteryEvent;
        fillBatteryEventData(batteryEvent, battery());
  
        if (((a1, a2, a3) => dynCall_iiii(callbackfunc, a1, a2, a3))(eventTypeId, batteryEvent, userData)) e.preventDefault();
      };
  
      var eventHandler = {
        target: findEventTarget(target),
        eventTypeString,
        callbackfunc,
        handlerFunc: batteryEventHandlerFunc,
        useCapture
      };
      return JSEvents.registerOrRemoveHandler(eventHandler);
    };

  
  var _emscripten_set_batterychargingchange_callback_on_thread = (userData, callbackfunc, targetThread) => {
      if (!battery()) return -1;
      return registerBatteryEventCallback(battery(), userData, true, callbackfunc, 29, "chargingchange", targetThread);
    };

  
  var _emscripten_set_batterylevelchange_callback_on_thread = (userData, callbackfunc, targetThread) => {
      if (!battery()) return -1;
      return registerBatteryEventCallback(battery(), userData, true, callbackfunc, 30, "levelchange", targetThread);
    };

  
  var _emscripten_get_battery_status = (batteryState) => {
      if (!battery()) return -1;
      fillBatteryEventData(batteryState, battery());
      return 0;
    };




  var __emscripten_set_offscreencanvas_size = (target, width, height) => {
      err('emscripten_set_offscreencanvas_size: Build with -sOFFSCREENCANVAS_SUPPORT=1 to enable transferring canvases to pthreads.');
      return -1;
    };


  
  var _emscripten_set_element_css_size = (target, width, height) => {
      target = findEventTarget(target);
      if (!target) return -4;
  
      target.style.width = width + "px";
      target.style.height = height + "px";
  
      return 0;
    };

  
  
  var _emscripten_get_element_css_size = (target, width, height) => {
      target = findEventTarget(target);
      if (!target) return -4;
  
      var rect = getBoundingClientRect(target);
      HEAPF64[((width)>>3)] = rect.width;
      HEAPF64[((height)>>3)] = rect.height;
  
      return 0;
    };

  var _emscripten_html5_remove_all_event_listeners = () => JSEvents.removeAllEventListeners();

  var _emscripten_request_animation_frame = (cb, userData) =>
      requestAnimationFrame((timeStamp) => ((a1, a2) => { throw 'Internal Error! Attempted to invoke wasm function pointer with signature "idi", but no such functions have gotten exported!' })(timeStamp, userData));

  var _emscripten_cancel_animation_frame = (id) => cancelAnimationFrame(id);

  var _emscripten_request_animation_frame_loop = (cb, userData) => {
      function tick(timeStamp) {
        if (((a1, a2) => { throw 'Internal Error! Attempted to invoke wasm function pointer with signature "idi", but no such functions have gotten exported!' })(timeStamp, userData)) {
          requestAnimationFrame(tick);
        }
      }
      return requestAnimationFrame(tick);
    };

  var _emscripten_date_now = () => Date.now();

  var _emscripten_performance_now = () => performance.now();

  var _emscripten_get_device_pixel_ratio = () => {
      return (typeof devicePixelRatio == 'number' && devicePixelRatio) || 1.0;
    };



  
  
  function _emscripten_get_callstack(flags, str, maxbytes) {
      var callstack = getCallstack(flags);
      // User can query the required amount of bytes to hold the callstack.
      if (!str || maxbytes <= 0) {
        return lengthBytesUTF8(callstack)+1;
      }
      // Output callstack string as C string to HEAP.
      var bytesWrittenExcludingNull = stringToUTF8(callstack, str, maxbytes);
  
      // Return number of bytes written, including null.
      return bytesWrittenExcludingNull+1;
    }

  /** @returns {number} */
  var convertFrameToPC = (frame) => {
      abort('Cannot use convertFrameToPC (needed by __builtin_return_address) without -sUSE_OFFSET_CONVERTER');
      // return 0 if we can't find any
      return 0;
    };

  
  var _emscripten_return_address = (level) => {
      var callstack = jsStackTrace().split('\n');
      if (callstack[0] == 'Error') {
        callstack.shift();
      }
      // skip this function and the caller to get caller's return address
      var caller = callstack[level + 3];
      return convertFrameToPC(caller);
    };

  var UNWIND_CACHE = {
  };

  
  
  
  var saveInUnwindCache = (callstack) => {
      callstack.forEach((frame) => {
        var pc = convertFrameToPC(frame);
        if (pc) {
          UNWIND_CACHE[pc] = frame;
        }
      });
    };
  
  function _emscripten_stack_snapshot() {
      var callstack = jsStackTrace().split('\n');
      if (callstack[0] == 'Error') {
        callstack.shift();
      }
      saveInUnwindCache(callstack);
  
      // Caches the stack snapshot so that emscripten_stack_unwind_buffer() can
      // unwind from this spot.
      UNWIND_CACHE.last_addr = convertFrameToPC(callstack[3]);
      UNWIND_CACHE.last_stack = callstack;
      return UNWIND_CACHE.last_addr;
    }


  
  
  
  var _emscripten_stack_unwind_buffer = (addr, buffer, count) => {
      var stack;
      if (UNWIND_CACHE.last_addr == addr) {
        stack = UNWIND_CACHE.last_stack;
      } else {
        stack = jsStackTrace().split('\n');
        if (stack[0] == 'Error') {
          stack.shift();
        }
        saveInUnwindCache(stack);
      }
  
      var offset = 3;
      while (stack[offset] && convertFrameToPC(stack[offset]) != addr) {
        ++offset;
      }
  
      for (var i = 0; i < count && stack[i+offset]; ++i) {
        HEAP32[(((buffer)+(i*4))>>2)] = convertFrameToPC(stack[i + offset]);
      }
      return i;
    };

  var _emscripten_pc_get_function = (pc) => {
      abort('Cannot use emscripten_pc_get_function without -sUSE_OFFSET_CONVERTER');
      return 0;
    };

  
  var convertPCtoSourceLocation = (pc) => {
      if (UNWIND_CACHE.last_get_source_pc == pc) return UNWIND_CACHE.last_source;
  
      var match;
      var source;
  
      if (!source) {
        var frame = UNWIND_CACHE[pc];
        if (!frame) return null;
        // Example: at callMain (a.out.js:6335:22)
        if (match = /\((.*):(\d+):(\d+)\)$/.exec(frame)) {
          source = {file: match[1], line: match[2], column: match[3]};
        // Example: main@a.out.js:1337:42
        } else if (match = /@(.*):(\d+):(\d+)/.exec(frame)) {
          source = {file: match[1], line: match[2], column: match[3]};
        }
      }
      UNWIND_CACHE.last_get_source_pc = pc;
      UNWIND_CACHE.last_source = source;
      return source;
    };

  
  
  var _emscripten_pc_get_file = (pc) => {
      var result = convertPCtoSourceLocation(pc);
      if (!result) return 0;
  
      if (_emscripten_pc_get_file.ret) _free(_emscripten_pc_get_file.ret);
      _emscripten_pc_get_file.ret = stringToNewUTF8(result.file);
      return _emscripten_pc_get_file.ret;
    };

  var _emscripten_pc_get_line = (pc) => {
      var result = convertPCtoSourceLocation(pc);
      return result ? result.line : 0;
    };

  var _emscripten_pc_get_column = (pc) => {
      var result = convertPCtoSourceLocation(pc);
      return result ? result.column || 0 : 0;
    };



  var _sched_yield = () => 0;

  function _random_get(buf, buf_len) {
  try {
  
      _getentropy(buf, buf_len);
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return e.errno;
  }
  }




  var checkWasiClock = (clock_id) => {
      return clock_id == 0 ||
             clock_id == 1 ||
             clock_id == 2 ||
             clock_id == 3;
    };

  
  
  
  function _clock_time_get(clk_id,ignored_precision_low, ignored_precision_high,ptime) {
    var ignored_precision = convertI32PairToI53Checked(ignored_precision_low, ignored_precision_high);
  
    
      if (!checkWasiClock(clk_id)) {
        return 28;
      }
      var now;
      // all wasi clocks but realtime are monotonic
      if (clk_id === 0) {
        now = Date.now();
      } else if (nowIsMonotonic) {
        now = _emscripten_get_now();
      } else {
        return 52;
      }
      // "now" is in ms, and wasi times are in ns.
      var nsec = Math.round(now * 1000 * 1000);
      HEAP32[((ptime)>>2)] = nsec >>> 0;
      HEAP32[(((ptime)+(4))>>2)] = (nsec / Math.pow(2, 32)) >>> 0;
      return 0;
    ;
  }

  
  
  
  var _clock_res_get = (clk_id, pres) => {
      if (!checkWasiClock(clk_id)) {
        return 28;
      }
      var nsec;
      // all wasi clocks but realtime are monotonic
      if (clk_id === 0) {
        nsec = 1000 * 1000; // educated guess that it's milliseconds
      } else if (nowIsMonotonic) {
        nsec = _emscripten_get_now_res();
      } else {
        return 52;
      }
      HEAP32[((pres)>>2)] = nsec >>> 0;
      HEAP32[(((pres)+(4))>>2)] = (nsec / Math.pow(2, 32)) >>> 0;
      return 0;
    };

  /** @param {number=} offset */
  var doReadv = (stream, iov, iovcnt, offset) => {
      var ret = 0;
      for (var i = 0; i < iovcnt; i++) {
        var ptr = HEAPU32[((iov)>>2)];
        var len = HEAPU32[(((iov)+(4))>>2)];
        iov += 8;
        var curr = FS.read(stream, HEAP8, ptr, len, offset);
        if (curr < 0) return -1;
        ret += curr;
        if (curr < len) break; // nothing more to read
        if (typeof offset != 'undefined') {
          offset += curr;
        }
      }
      return ret;
    };



  
  
  function _fd_pwrite(fd,iov,iovcnt,offset_low, offset_high,pnum) {
    var offset = convertI32PairToI53Checked(offset_low, offset_high);
  
    
  try {
  
      if (isNaN(offset)) return 61;
      var stream = SYSCALLS.getStreamFromFD(fd)
      var num = doWritev(stream, iov, iovcnt, offset);
      HEAPU32[((pnum)>>2)] = num;
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return e.errno;
  }
  ;
  }


  
  function _fd_read(fd, iov, iovcnt, pnum) {
  try {
  
      var stream = SYSCALLS.getStreamFromFD(fd);
      var num = doReadv(stream, iov, iovcnt);
      HEAPU32[((pnum)>>2)] = num;
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return e.errno;
  }
  }

  
  
  function _fd_pread(fd,iov,iovcnt,offset_low, offset_high,pnum) {
    var offset = convertI32PairToI53Checked(offset_low, offset_high);
  
    
  try {
  
      if (isNaN(offset)) return 61;
      var stream = SYSCALLS.getStreamFromFD(fd)
      var num = doReadv(stream, iov, iovcnt, offset);
      HEAPU32[((pnum)>>2)] = num;
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return e.errno;
  }
  ;
  }


  var wasiRightsToMuslOFlags = (rights) => {
      if ((rights & 2) && (rights & 64)) {
        return 2;
      }
      if (rights & 2) {
        return 0;
      }
      if (rights & 64) {
        return 1;
      }
      throw new FS.ErrnoError(28);
    };

  var wasiOFlagsToMuslOFlags = (oflags) => {
      var musl_oflags = 0;
      if (oflags & 1) {
        musl_oflags |= 64;
      }
      if (oflags & 8) {
        musl_oflags |= 512;
      }
      if (oflags & 2) {
        musl_oflags |= 65536;
      }
      if (oflags & 4) {
        musl_oflags |= 128;
      }
      return musl_oflags;
    };

  function _fd_fdstat_get(fd, pbuf) {
  try {
  
      var rightsBase = 0;
      var rightsInheriting = 0;
      var flags = 0;
      {
        var stream = SYSCALLS.getStreamFromFD(fd);
        // All character devices are terminals (other things a Linux system would
        // assume is a character device, like the mouse, we have special APIs for).
        var type = stream.tty ? 2 :
                   FS.isDir(stream.mode) ? 3 :
                   FS.isLink(stream.mode) ? 7 :
                   4;
      }
      HEAP8[pbuf] = type;
      HEAP16[(((pbuf)+(2))>>1)] = flags;
      (tempI64 = [rightsBase>>>0,(tempDouble = rightsBase,(+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? (+(Math.floor((tempDouble)/4294967296.0)))>>>0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)], HEAP32[(((pbuf)+(8))>>2)] = tempI64[0],HEAP32[(((pbuf)+(12))>>2)] = tempI64[1]);
      (tempI64 = [rightsInheriting>>>0,(tempDouble = rightsInheriting,(+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? (+(Math.floor((tempDouble)/4294967296.0)))>>>0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)], HEAP32[(((pbuf)+(16))>>2)] = tempI64[0],HEAP32[(((pbuf)+(20))>>2)] = tempI64[1]);
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return e.errno;
  }
  }

  var _fd_sync = function (fd) {
  try {
  
      var stream = SYSCALLS.getStreamFromFD(fd);
      return Asyncify.handleSleep((wakeUp) => {
        var mount = stream.node.mount;
        if (!mount.type.syncfs) {
          // We write directly to the file system, so there's nothing to do here.
          wakeUp(0);
          return;
        }
        mount.type.syncfs(mount, false, (err) => {
          if (err) {
            wakeUp(29);
            return;
          }
          wakeUp(0);
        });
      });
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return e.errno;
  }
  };
  _fd_sync.isAsync = true;

  
  
  
  var createDyncallWrapper = (sig) => {
      var sections = [];
      var prelude = [
        0x00, 0x61, 0x73, 0x6d, // magic ("\0asm")
        0x01, 0x00, 0x00, 0x00, // version: 1
      ];
      sections.push(prelude);
      var wrappersig = [
        // if return type is j, we will put the upper 32 bits into tempRet0.
        sig[0].replace("j", "i"),
        "i", // The first argument is the function pointer to call
        // in the rest of the argument list, one 64 bit integer is legalized into
        // two 32 bit integers.
        sig.slice(1).replace(/j/g, "ii")
      ].join("");
  
      var typeSectionBody = [
        0x03, // number of types = 3
      ];
      generateFuncType(wrappersig, typeSectionBody); // The signature of the wrapper we are generating
      generateFuncType(sig, typeSectionBody); // the signature of the function pointer we will call
      generateFuncType("vi", typeSectionBody); // the signature of setTempRet0
  
      var typeSection = [0x01 /* Type section code */];
      uleb128Encode(typeSectionBody.length, typeSection); // length of section in bytes
      typeSection.push(...typeSectionBody);
      sections.push(typeSection);
  
      var importSection = [
        0x02, // import section code
        0x0F, // length of section in bytes
        0x02, // number of imports = 2
        // Import the wasmTable, which we will call "t"
        0x01, 0x65, // name "e"
        0x01, 0x74, // name "t"
        0x01, 0x70, // importing a table
        0x00, // with no max # of elements
        0x00, // and min of 0 elements
        // Import the setTempRet0 function, which we will call "r"
        0x01, 0x65, // name "e"
        0x01, 0x72, // name "r"
        0x00, // importing a function
        0x02, // type 2
      ];
      sections.push(importSection);
  
      var functionSection = [
        0x03, // function section code
        0x02, // length of section in bytes
        0x01, // number of functions = 1
        0x00, // type 0 = wrappersig
      ];
      sections.push(functionSection);
  
      var exportSection = [
        0x07, // export section code
        0x05, // length of section in bytes
        0x01, // One export
        0x01, 0x66, // name "f"
        0x00, // type: function
        0x01, // function index 1 = the wrapper function (index 0 is setTempRet0)
      ];
      sections.push(exportSection);
  
      var convert_code = [];
      if (sig[0] === "j") {
        // Add a single extra i64 local. In order to legalize the return value we
        // need a local to store it in. Local variables are run length encoded.
        convert_code = [
          0x01, // One run
          0x01, // of length 1
          0x7e, // of i64
        ];
      } else {
        convert_code.push(0x00); // no local variables (except the arguments)
      }
  
      function localGet(j) {
        convert_code.push(0x20); // local.get
        uleb128Encode(j, convert_code);
      }
  
      var j = 1;
      for (var i = 1; i < sig.length; i++) {
        if (sig[i] == "j") {
          localGet(j + 1);
          convert_code.push(
            0xad, // i64.extend_i32_unsigned
            0x42, 0x20, // i64.const 32
            0x86, // i64.shl,
          )
          localGet(j);
          convert_code.push(
            0xac, // i64.extend_i32_signed
            0x84, // i64.or
          );
          j+=2;
        } else {
          localGet(j);
          j++;
        }
      }
  
      convert_code.push(
        0x20, 0x00, // local.get 0 (put function pointer on stack)
        0x11, 0x01, 0x00, // call_indirect type 1 = wrapped_sig, table 0 = only table
      );
  if (sig[0] === "j") {
      // tee into j (after the argument handling loop, j is one past the
      // argument list so it points to the i64 local we added)
        convert_code.push(0x22);
        uleb128Encode(j, convert_code);
        convert_code.push(
          0x42, 0x20, // i64.const 32
          0x88, // i64.shr_u
          0xa7, // i32.wrap_i64
          0x10, 0x00, // Call function 0
        );
        localGet(j);
        convert_code.push(
          0xa7, // i32.wrap_i64
        );
      }
      convert_code.push(0x0b); // end
  
      var codeBody = [0x01]; // one code
      uleb128Encode(convert_code.length, codeBody);
      codeBody.push(...convert_code);
      var codeSection = [0x0A /* Code section code */];
      uleb128Encode(codeBody.length, codeSection);
      codeSection.push(...codeBody);
      sections.push(codeSection);
  
      var bytes = new Uint8Array([].concat.apply([], sections));
      // We can compile this wasm module synchronously because it is small.
      var module = new WebAssembly.Module(bytes);
      var instance = new WebAssembly.Instance(module, {
      'e': {
        't': wasmTable,
        'r': setTempRet0,
      }
      });
      var wrappedFunc = instance.exports['f'];
      return wrappedFunc;
    };

  var _emscripten_unwind_to_js_event_loop = () => {
      throw 'unwind';
    };


  var setImmediateWrapped = (func) => {
      setImmediateWrapped.mapping ||= [];
      var id = setImmediateWrapped.mapping.length;
      setImmediateWrapped.mapping[id] = setImmediate(() => {
        setImmediateWrapped.mapping[id] = undefined;
        func();
      });
      return id;
    };

  var clearImmediateWrapped = (id) => {
      assert(id);
      assert(setImmediateWrapped.mapping[id]);
      clearImmediate(setImmediateWrapped.mapping[id]);
      setImmediateWrapped.mapping[id] = undefined;
    };

  
  var polyfillSetImmediate = () => {
      // nop, used for its postset to ensure setImmediate() polyfill is
      // not duplicated between emscripten_set_immediate() and
      // emscripten_set_immediate_loop() if application links to both of them.
    };

  
  var _emscripten_set_immediate = (cb, userData) => {
      
      return emSetImmediate(() => {
        
        callUserCallback(() => ((a1) => dynCall_vi(cb, a1))(userData));
      });
    };

  var _emscripten_clear_immediate = (id) => {
      
      emClearImmediate(id);
    };

  
  var _emscripten_set_immediate_loop = (cb, userData) => {
      function tick() {
        callUserCallback(() => {
          if (((a1) => dynCall_ii(cb, a1))(userData)) {
            emSetImmediate(tick);
          } else {
            
          }
        });
      }
      
      emSetImmediate(tick);
    };

  var _emscripten_set_timeout = (cb, msecs, userData) =>
      safeSetTimeout(() => ((a1) => dynCall_vi(cb, a1))(userData), msecs);

  var _emscripten_clear_timeout = clearTimeout;

  
  var _emscripten_set_timeout_loop = (cb, msecs, userData) => {
      function tick() {
        var t = _emscripten_get_now();
        var n = t + msecs;
        
        callUserCallback(() => {
          if (((a1, a2) => { throw 'Internal Error! Attempted to invoke wasm function pointer with signature "idi", but no such functions have gotten exported!' })(t, userData)) {
            // Save a little bit of code space: modern browsers should treat
            // negative setTimeout as timeout of 0
            // (https://stackoverflow.com/questions/8430966/is-calling-settimeout-with-a-negative-delay-ok)
            
            setTimeout(tick, n - _emscripten_get_now());
          }
        });
      }
      
      return setTimeout(tick, 0);
    };

  var _emscripten_set_interval = (cb, msecs, userData) => {
      
      return setInterval(() => {
        callUserCallback(() => ((a1) => dynCall_vi(cb, a1))(userData));
      }, msecs);
    };

  var _emscripten_clear_interval = (id) => {
      
      clearInterval(id);
    };

  var promiseMap = new HandleAllocator();;

  var getPromise = (id) => promiseMap.get(id).promise;

  var makePromise = () => {
      var promiseInfo = {};
      promiseInfo.promise = new Promise((resolve, reject) => {
        promiseInfo.reject = reject;
        promiseInfo.resolve = resolve;
      });
      promiseInfo.id = promiseMap.allocate(promiseInfo);
      return promiseInfo;
    };

  
  var idsToPromises = (idBuf, size) => {
      var promises = [];
      for (var i = 0; i < size; i++) {
        var id = HEAP32[(((idBuf)+(i*4))>>2)];
        promises[i] = getPromise(id);
      }
      return promises;
    };

  var _emscripten_promise_create = () => makePromise().id;

  var _emscripten_promise_destroy = (id) => {
      promiseMap.free(id);
    };

  
  
  var _emscripten_promise_resolve = (id, result, value) => {
      var info = promiseMap.get(id);
      switch (result) {
        case 0:
          info.resolve(value);
          return;
        case 1:
          info.resolve(getPromise(value));
          return;
        case 2:
          info.resolve(getPromise(value));
          _emscripten_promise_destroy(value);
          return;
        case 3:
          info.reject(value);
          return;
      }
      abort("unexpected promise callback result " + result);
    };

  
  
  
  
  
  var makePromiseCallback = (callback, userData) => {
      return (value) => {
        ;
        var stack = stackSave();
        // Allocate space for the result value and initialize it to NULL.
        var resultPtr = stackAlloc(POINTER_SIZE);
        HEAPU32[((resultPtr)>>2)] = 0;
        try {
          var result =
              ((a1, a2, a3) => dynCall_iiii(callback, a1, a2, a3))(resultPtr, userData, value);
          var resultVal = HEAPU32[((resultPtr)>>2)];
        } catch (e) {
          // If the thrown value is potentially a valid pointer, use it as the
          // rejection reason. Otherwise use a null pointer as the reason. If we
          // allow arbitrary objects to be thrown here, we will get a TypeError in
          // MEMORY64 mode when they are later converted to void* rejection
          // values.
          if (typeof e != 'number') {
            throw 0;
          }
          throw e;
        } finally {
          // Thrown errors will reject the promise, but at least we will restore
          // the stack first.
          stackRestore(stack);
        }
        switch (result) {
          case 0:
            return resultVal;
          case 1:
            return getPromise(resultVal);
          case 2:
            var ret = getPromise(resultVal);
            _emscripten_promise_destroy(resultVal);
            return ret;
          case 3:
            throw resultVal;
        }
        abort("unexpected promise callback result " + result);
      };
    };

  
  
  var _emscripten_promise_then = (id, onFulfilled, onRejected, userData) => {
      ;
      var promise = getPromise(id);
      var newId = promiseMap.allocate({
        promise: promise.then(makePromiseCallback(onFulfilled, userData),
                              makePromiseCallback(onRejected, userData))
      });
      return newId;
    };

  
  var _emscripten_promise_all = (idBuf, resultBuf, size) => {
      var promises = idsToPromises(idBuf, size);
      var id = promiseMap.allocate({
        promise: Promise.all(promises).then((results) => {
          if (resultBuf) {
            for (var i = 0; i < size; i++) {
              var result = results[i];
              HEAPU32[(((resultBuf)+(i*4))>>2)] = result;
            }
          }
          return resultBuf;
        })
      });
      return id;
    };

  var setPromiseResult = (ptr, fulfill, value) => {
      assert(typeof value == 'undefined' || typeof value === 'number', `native promises can only handle numeric results (${value} ${typeof value})`);
      var result = fulfill ? 0 : 3
      HEAP32[((ptr)>>2)] = result;
      HEAPU32[(((ptr)+(4))>>2)] = value;
    };

  
  
  var _emscripten_promise_all_settled = (idBuf, resultBuf, size) => {
      var promises = idsToPromises(idBuf, size);
      var id = promiseMap.allocate({
        promise: Promise.allSettled(promises).then((results) => {
          if (resultBuf) {
            var offset = resultBuf;
            for (var i = 0; i < size; i++, offset += 8) {
              if (results[i].status === 'fulfilled') {
                setPromiseResult(offset, true, results[i].value);
              } else {
                setPromiseResult(offset, false, results[i].reason);
              }
            }
          }
          return resultBuf;
        })
      });
      return id;
    };

  
  var _emscripten_promise_any = (idBuf, errorBuf, size) => {
      var promises = idsToPromises(idBuf, size);
      assert(typeof Promise.any != 'undefined', "Promise.any does not exist");
      var id = promiseMap.allocate({
        promise: Promise.any(promises).catch((err) => {
          if (errorBuf) {
            for (var i = 0; i < size; i++) {
              HEAPU32[(((errorBuf)+(i*4))>>2)] = err.errors[i];
            }
          }
          throw errorBuf;
        })
      });
      return id;
    };

  
  var _emscripten_promise_race = (idBuf, size) => {
      var promises = idsToPromises(idBuf, size);
      var id = promiseMap.allocate({
        promise: Promise.race(promises)
      });
      return id;
    };

  
  var _emscripten_promise_await = (returnValuePtr, id) => {
      return Asyncify.handleSleep((wakeUp) => {
        getPromise(id).then((value) => {
          setPromiseResult(returnValuePtr, true, value);
          wakeUp();
        }, (value) => {
          setPromiseResult(returnValuePtr, false, value);
          wakeUp();
        });
      });
    };
  _emscripten_promise_await.isAsync = true;

  
  
  var ___resumeException = (ptr) => {
      if (!exceptionLast) {
        exceptionLast = ptr;
      }
      assert(false, 'Exception thrown, but exception catching is not enabled. Compile with -sNO_DISABLE_EXCEPTION_CATCHING or -sEXCEPTION_CATCHING_ALLOWED=[..] to catch.');
    };
  
  
  var findMatchingCatch = (args) => {
      var thrown =
        exceptionLast;
      if (!thrown) {
        // just pass through the null ptr
        setTempRet0(0);
        return 0;
      }
      var info = new ExceptionInfo(thrown);
      info.set_adjusted_ptr(thrown);
      var thrownType = info.get_type();
      if (!thrownType) {
        // just pass through the thrown ptr
        setTempRet0(0);
        return thrown;
      }
  
      // can_catch receives a **, add indirection
      // The different catch blocks are denoted by different types.
      // Due to inheritance, those types may not precisely match the
      // type of the thrown object. Find one which matches, and
      // return the type of the catch block which should be called.
      for (var caughtType of args) {
        if (caughtType === 0 || caughtType === thrownType) {
          // Catch all clause matched or exactly the same type is caught
          break;
        }
        var adjusted_ptr_addr = info.ptr + 16;
        if (___cxa_can_catch(caughtType, thrownType, adjusted_ptr_addr)) {
          setTempRet0(caughtType);
          return thrown;
        }
      }
      setTempRet0(thrownType);
      return thrown;
    };
  var ___cxa_find_matching_catch_2 = () => findMatchingCatch([]);

  var ___cxa_find_matching_catch_3 = (arg0) => findMatchingCatch([arg0]);

  var ___cxa_find_matching_catch_4 = (arg0,arg1) => findMatchingCatch([arg0,arg1]);



  var exceptionCaught =  [];



  
  
  var ___cxa_rethrow = () => {
      var info = exceptionCaught.pop();
      if (!info) {
        abort('no exception to throw');
      }
      var ptr = info.excPtr;
      if (!info.get_rethrown()) {
        // Only pop if the corresponding push was through rethrow_primary_exception
        exceptionCaught.push(info);
        info.set_rethrown(true);
        info.set_caught(false);
        uncaughtExceptionCount++;
      }
      exceptionLast = ptr;
      assert(false, 'Exception thrown, but exception catching is not enabled. Compile with -sNO_DISABLE_EXCEPTION_CATCHING or -sEXCEPTION_CATCHING_ALLOWED=[..] to catch.');
    };

  var _llvm_eh_typeid_for = (type) => type;

  
  
  var ___cxa_begin_catch = (ptr) => {
      var info = new ExceptionInfo(ptr);
      if (!info.get_caught()) {
        info.set_caught(true);
        uncaughtExceptionCount--;
      }
      info.set_rethrown(false);
      exceptionCaught.push(info);
      ___cxa_increment_exception_refcount(info.excPtr);
      return info.get_exception_ptr();
    };

  
  
  
  var ___cxa_end_catch = () => {
      // Clear state flag.
      _setThrew(0, 0);
      assert(exceptionCaught.length > 0);
      // Call destructor if one is registered then clear it.
      var info = exceptionCaught.pop();
  
      ___cxa_decrement_exception_refcount(info.excPtr);
      exceptionLast = 0; // XXX in decRef?
    };

  var ___cxa_get_exception_ptr = (ptr) => {
      var rtn = new ExceptionInfo(ptr).get_exception_ptr();
      return rtn;
    };

  var ___cxa_uncaught_exceptions = () => uncaughtExceptionCount;

  var ___cxa_call_unexpected = (exception) => abort('Unexpected exception thrown, this is not properly supported - aborting');

  
  var ___cxa_current_primary_exception = () => {
      if (!exceptionCaught.length) {
        return 0;
      }
      var info = exceptionCaught[exceptionCaught.length - 1];
      ___cxa_increment_exception_refcount(info.excPtr);
      return info.excPtr;
    };

  
  
  var ___cxa_rethrow_primary_exception = (ptr) => {
      if (!ptr) return;
      var info = new ExceptionInfo(ptr);
      exceptionCaught.push(info);
      info.set_rethrown(true);
      ___cxa_rethrow();
    };



  var _emscripten_set_main_loop_timing = (mode, value) => {
      Browser.mainLoop.timingMode = mode;
      Browser.mainLoop.timingValue = value;
  
      if (!Browser.mainLoop.func) {
        err('emscripten_set_main_loop_timing: Cannot set timing mode for main loop since a main loop does not exist! Call emscripten_set_main_loop first to set one up.');
        return 1; // Return non-zero on failure, can't set timing mode when there is no main loop.
      }
  
      if (!Browser.mainLoop.running) {
        
        Browser.mainLoop.running = true;
      }
      if (mode == 0) {
        Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_setTimeout() {
          var timeUntilNextTick = Math.max(0, Browser.mainLoop.tickStartTime + value - _emscripten_get_now())|0;
          setTimeout(Browser.mainLoop.runner, timeUntilNextTick); // doing this each time means that on exception, we stop
        };
        Browser.mainLoop.method = 'timeout';
      } else if (mode == 1) {
        Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_rAF() {
          Browser.requestAnimationFrame(Browser.mainLoop.runner);
        };
        Browser.mainLoop.method = 'rAF';
      } else if (mode == 2) {
        if (typeof Browser.setImmediate == 'undefined') {
          if (typeof setImmediate == 'undefined') {
            // Emulate setImmediate. (note: not a complete polyfill, we don't emulate clearImmediate() to keep code size to minimum, since not needed)
            var setImmediates = [];
            var emscriptenMainLoopMessageId = 'setimmediate';
            /** @param {Event} event */
            var Browser_setImmediate_messageHandler = (event) => {
              // When called in current thread or Worker, the main loop ID is structured slightly different to accommodate for --proxy-to-worker runtime listening to Worker events,
              // so check for both cases.
              if (event.data === emscriptenMainLoopMessageId || event.data.target === emscriptenMainLoopMessageId) {
                event.stopPropagation();
                setImmediates.shift()();
              }
            };
            addEventListener("message", Browser_setImmediate_messageHandler, true);
            Browser.setImmediate = /** @type{function(function(): ?, ...?): number} */(function Browser_emulated_setImmediate(func) {
              setImmediates.push(func);
              if (ENVIRONMENT_IS_WORKER) {
                Module['setImmediates'] ??= [];
                Module['setImmediates'].push(func);
                postMessage({target: emscriptenMainLoopMessageId}); // In --proxy-to-worker, route the message via proxyClient.js
              } else postMessage(emscriptenMainLoopMessageId, "*"); // On the main thread, can just send the message to itself.
            });
          } else {
            Browser.setImmediate = setImmediate;
          }
        }
        Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_setImmediate() {
          Browser.setImmediate(Browser.mainLoop.runner);
        };
        Browser.mainLoop.method = 'immediate';
      }
      return 0;
    };
  
  
  
    /**
     * @param {number=} arg
     * @param {boolean=} noSetTiming
     */
  var setMainLoop = (browserIterationFunc, fps, simulateInfiniteLoop, arg, noSetTiming) => {
      assert(!Browser.mainLoop.func, 'emscripten_set_main_loop: there can only be one main loop function at once: call emscripten_cancel_main_loop to cancel the previous one before setting a new one with different parameters.');
      Browser.mainLoop.func = browserIterationFunc;
      Browser.mainLoop.arg = arg;
  
      // Closure compiler bug(?): Closure does not see that the assignment
      //   var thisMainLoopId = Browser.mainLoop.currentlyRunningMainloop
      // is a value copy of a number (even with the JSDoc @type annotation)
      // but optimizeis the code as if the assignment was a reference assignment,
      // which results in Browser.mainLoop.pause() not working. Hence use a
      // workaround to make Closure believe this is a value copy that should occur:
      // (TODO: Minimize this down to a small test case and report - was unable
      // to reproduce in a small written test case)
      /** @type{number} */
      var thisMainLoopId = (() => Browser.mainLoop.currentlyRunningMainloop)();
      function checkIsRunning() {
        if (thisMainLoopId < Browser.mainLoop.currentlyRunningMainloop) {
          
          return false;
        }
        return true;
      }
  
      // We create the loop runner here but it is not actually running until
      // _emscripten_set_main_loop_timing is called (which might happen a
      // later time).  This member signifies that the current runner has not
      // yet been started so that we can call runtimeKeepalivePush when it
      // gets it timing set for the first time.
      Browser.mainLoop.running = false;
      Browser.mainLoop.runner = function Browser_mainLoop_runner() {
        if (ABORT) return;
        if (Browser.mainLoop.queue.length > 0) {
          var start = Date.now();
          var blocker = Browser.mainLoop.queue.shift();
          blocker.func(blocker.arg);
          if (Browser.mainLoop.remainingBlockers) {
            var remaining = Browser.mainLoop.remainingBlockers;
            var next = remaining%1 == 0 ? remaining-1 : Math.floor(remaining);
            if (blocker.counted) {
              Browser.mainLoop.remainingBlockers = next;
            } else {
              // not counted, but move the progress along a tiny bit
              next = next + 0.5; // do not steal all the next one's progress
              Browser.mainLoop.remainingBlockers = (8*remaining + next)/9;
            }
          }
          Browser.mainLoop.updateStatus();
  
          // catches pause/resume main loop from blocker execution
          if (!checkIsRunning()) return;
  
          setTimeout(Browser.mainLoop.runner, 0);
          return;
        }
  
        // catch pauses from non-main loop sources
        if (!checkIsRunning()) return;
  
        // Implement very basic swap interval control
        Browser.mainLoop.currentFrameNumber = Browser.mainLoop.currentFrameNumber + 1 | 0;
        if (Browser.mainLoop.timingMode == 1 && Browser.mainLoop.timingValue > 1 && Browser.mainLoop.currentFrameNumber % Browser.mainLoop.timingValue != 0) {
          // Not the scheduled time to render this frame - skip.
          Browser.mainLoop.scheduler();
          return;
        } else if (Browser.mainLoop.timingMode == 0) {
          Browser.mainLoop.tickStartTime = _emscripten_get_now();
        }
  
        // Signal GL rendering layer that processing of a new frame is about to start. This helps it optimize
        // VBO double-buffering and reduce GPU stalls.
  
        if (Browser.mainLoop.method === 'timeout' && Module.ctx) {
          warnOnce('Looks like you are rendering without using requestAnimationFrame for the main loop. You should use 0 for the frame rate in emscripten_set_main_loop in order to use requestAnimationFrame, as that can greatly improve your frame rates!');
          Browser.mainLoop.method = ''; // just warn once per call to set main loop
        }
  
        Browser.mainLoop.runIter(browserIterationFunc);
  
        checkStackCookie();
  
        // catch pauses from the main loop itself
        if (!checkIsRunning()) return;
  
        // Queue new audio data. This is important to be right after the main loop invocation, so that we will immediately be able
        // to queue the newest produced audio samples.
        // TODO: Consider adding pre- and post- rAF callbacks so that GL.newRenderingFrameStarted() and SDL.audio.queueNewAudioData()
        //       do not need to be hardcoded into this function, but can be more generic.
        if (typeof SDL == 'object') SDL.audio?.queueNewAudioData?.();
  
        Browser.mainLoop.scheduler();
      }
  
      if (!noSetTiming) {
        if (fps && fps > 0) {
          _emscripten_set_main_loop_timing(0, 1000.0 / fps);
        } else {
          // Do rAF by rendering each frame (no decimating)
          _emscripten_set_main_loop_timing(1, 1);
        }
  
        Browser.mainLoop.scheduler();
      }
  
      if (simulateInfiniteLoop) {
        throw 'unwind';
      }
    };
  
  
  
  
  
  
  var Browser = {
  mainLoop:{
  running:false,
  scheduler:null,
  method:"",
  currentlyRunningMainloop:0,
  func:null,
  arg:0,
  timingMode:0,
  timingValue:0,
  currentFrameNumber:0,
  queue:[],
  pause() {
          Browser.mainLoop.scheduler = null;
          // Incrementing this signals the previous main loop that it's now become old, and it must return.
          Browser.mainLoop.currentlyRunningMainloop++;
        },
  resume() {
          Browser.mainLoop.currentlyRunningMainloop++;
          var timingMode = Browser.mainLoop.timingMode;
          var timingValue = Browser.mainLoop.timingValue;
          var func = Browser.mainLoop.func;
          Browser.mainLoop.func = null;
          // do not set timing and call scheduler, we will do it on the next lines
          setMainLoop(func, 0, false, Browser.mainLoop.arg, true);
          _emscripten_set_main_loop_timing(timingMode, timingValue);
          Browser.mainLoop.scheduler();
        },
  updateStatus() {
          if (Module['setStatus']) {
            var message = Module['statusMessage'] || 'Please wait...';
            var remaining = Browser.mainLoop.remainingBlockers;
            var expected = Browser.mainLoop.expectedBlockers;
            if (remaining) {
              if (remaining < expected) {
                Module['setStatus'](`{message} ({expected - remaining}/{expected})`);
              } else {
                Module['setStatus'](message);
              }
            } else {
              Module['setStatus']('');
            }
          }
        },
  runIter(func) {
          if (ABORT) return;
          if (Module['preMainLoop']) {
            var preRet = Module['preMainLoop']();
            if (preRet === false) {
              return; // |return false| skips a frame
            }
          }
          callUserCallback(func);
          Module['postMainLoop']?.();
        },
  },
  isFullscreen:false,
  pointerLock:false,
  moduleContextCreatedCallbacks:[],
  workers:[],
  init() {
        if (Browser.initted) return;
        Browser.initted = true;
  
        // Support for plugins that can process preloaded files. You can add more of these to
        // your app by creating and appending to preloadPlugins.
        //
        // Each plugin is asked if it can handle a file based on the file's name. If it can,
        // it is given the file's raw data. When it is done, it calls a callback with the file's
        // (possibly modified) data. For example, a plugin might decompress a file, or it
        // might create some side data structure for use later (like an Image element, etc.).
  
        var imagePlugin = {};
        imagePlugin['canHandle'] = function imagePlugin_canHandle(name) {
          return !Module.noImageDecoding && /\.(jpg|jpeg|png|bmp)$/i.test(name);
        };
        imagePlugin['handle'] = function imagePlugin_handle(byteArray, name, onload, onerror) {
          var b = new Blob([byteArray], { type: Browser.getMimetype(name) });
          if (b.size !== byteArray.length) { // Safari bug #118630
            // Safari's Blob can only take an ArrayBuffer
            b = new Blob([(new Uint8Array(byteArray)).buffer], { type: Browser.getMimetype(name) });
          }
          var url = URL.createObjectURL(b);
          assert(typeof url == 'string', 'createObjectURL must return a url as a string');
          var img = new Image();
          img.onload = () => {
            assert(img.complete, `Image ${name} could not be decoded`);
            var canvas = /** @type {!HTMLCanvasElement} */ (document.createElement('canvas'));
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            preloadedImages[name] = canvas;
            URL.revokeObjectURL(url);
            onload?.(byteArray);
          };
          img.onerror = (event) => {
            err(`Image ${url} could not be decoded`);
            onerror?.();
          };
          img.src = url;
        };
        preloadPlugins.push(imagePlugin);
  
        var audioPlugin = {};
        audioPlugin['canHandle'] = function audioPlugin_canHandle(name) {
          return !Module.noAudioDecoding && name.substr(-4) in { '.ogg': 1, '.wav': 1, '.mp3': 1 };
        };
        audioPlugin['handle'] = function audioPlugin_handle(byteArray, name, onload, onerror) {
          var done = false;
          function finish(audio) {
            if (done) return;
            done = true;
            preloadedAudios[name] = audio;
            onload?.(byteArray);
          }
          function fail() {
            if (done) return;
            done = true;
            preloadedAudios[name] = new Audio(); // empty shim
            onerror?.();
          }
          var b = new Blob([byteArray], { type: Browser.getMimetype(name) });
          var url = URL.createObjectURL(b); // XXX we never revoke this!
          assert(typeof url == 'string', 'createObjectURL must return a url as a string');
          var audio = new Audio();
          audio.addEventListener('canplaythrough', () => finish(audio), false); // use addEventListener due to chromium bug 124926
          audio.onerror = function audio_onerror(event) {
            if (done) return;
            err(`warning: browser could not fully decode audio ${name}, trying slower base64 approach`);
            function encode64(data) {
              var BASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
              var PAD = '=';
              var ret = '';
              var leftchar = 0;
              var leftbits = 0;
              for (var i = 0; i < data.length; i++) {
                leftchar = (leftchar << 8) | data[i];
                leftbits += 8;
                while (leftbits >= 6) {
                  var curr = (leftchar >> (leftbits-6)) & 0x3f;
                  leftbits -= 6;
                  ret += BASE[curr];
                }
              }
              if (leftbits == 2) {
                ret += BASE[(leftchar&3) << 4];
                ret += PAD + PAD;
              } else if (leftbits == 4) {
                ret += BASE[(leftchar&0xf) << 2];
                ret += PAD;
              }
              return ret;
            }
            audio.src = 'data:audio/x-' + name.substr(-3) + ';base64,' + encode64(byteArray);
            finish(audio); // we don't wait for confirmation this worked - but it's worth trying
          };
          audio.src = url;
          // workaround for chrome bug 124926 - we do not always get oncanplaythrough or onerror
          safeSetTimeout(() => {
            finish(audio); // try to use it even though it is not necessarily ready to play
          }, 10000);
        };
        preloadPlugins.push(audioPlugin);
  
        // Canvas event setup
  
        function pointerLockChange() {
          Browser.pointerLock = document['pointerLockElement'] === Module['canvas'] ||
                                document['mozPointerLockElement'] === Module['canvas'] ||
                                document['webkitPointerLockElement'] === Module['canvas'] ||
                                document['msPointerLockElement'] === Module['canvas'];
        }
        var canvas = Module['canvas'];
        if (canvas) {
          // forced aspect ratio can be enabled by defining 'forcedAspectRatio' on Module
          // Module['forcedAspectRatio'] = 4 / 3;
  
          canvas.requestPointerLock = canvas['requestPointerLock'] ||
                                      canvas['mozRequestPointerLock'] ||
                                      canvas['webkitRequestPointerLock'] ||
                                      canvas['msRequestPointerLock'] ||
                                      (() => {});
          canvas.exitPointerLock = document['exitPointerLock'] ||
                                   document['mozExitPointerLock'] ||
                                   document['webkitExitPointerLock'] ||
                                   document['msExitPointerLock'] ||
                                   (() => {}); // no-op if function does not exist
          canvas.exitPointerLock = canvas.exitPointerLock.bind(document);
  
          document.addEventListener('pointerlockchange', pointerLockChange, false);
          document.addEventListener('mozpointerlockchange', pointerLockChange, false);
          document.addEventListener('webkitpointerlockchange', pointerLockChange, false);
          document.addEventListener('mspointerlockchange', pointerLockChange, false);
  
          if (Module['elementPointerLock']) {
            canvas.addEventListener("click", (ev) => {
              if (!Browser.pointerLock && Module['canvas'].requestPointerLock) {
                Module['canvas'].requestPointerLock();
                ev.preventDefault();
              }
            }, false);
          }
        }
      },
  createContext(/** @type {HTMLCanvasElement} */ canvas, useWebGL, setInModule, webGLContextAttributes) {
        if (useWebGL && Module.ctx && canvas == Module.canvas) return Module.ctx; // no need to recreate GL context if it's already been created for this canvas.
  
        var ctx;
        var contextHandle;
        if (useWebGL) {
          // For GLES2/desktop GL compatibility, adjust a few defaults to be different to WebGL defaults, so that they align better with the desktop defaults.
          var contextAttributes = {
            antialias: false,
            alpha: false,
            majorVersion: 1,
          };
  
          if (webGLContextAttributes) {
            for (var attribute in webGLContextAttributes) {
              contextAttributes[attribute] = webGLContextAttributes[attribute];
            }
          }
  
          // This check of existence of GL is here to satisfy Closure compiler, which yells if variable GL is referenced below but GL object is not
          // actually compiled in because application is not doing any GL operations. TODO: Ideally if GL is not being used, this function
          // Browser.createContext() should not even be emitted.
          if (typeof GL != 'undefined') {
            contextHandle = GL.createContext(canvas, contextAttributes);
            if (contextHandle) {
              ctx = GL.getContext(contextHandle).GLctx;
            }
          }
        } else {
          ctx = canvas.getContext('2d');
        }
  
        if (!ctx) return null;
  
        if (setInModule) {
          if (!useWebGL) assert(typeof GLctx == 'undefined', 'cannot set in module if GLctx is used, but we are a non-GL context that would replace it');
          Module.ctx = ctx;
          if (useWebGL) GL.makeContextCurrent(contextHandle);
          Module.useWebGL = useWebGL;
          Browser.moduleContextCreatedCallbacks.forEach((callback) => callback());
          Browser.init();
        }
        return ctx;
      },
  destroyContext(canvas, useWebGL, setInModule) {},
  fullscreenHandlersInstalled:false,
  lockPointer:undefined,
  resizeCanvas:undefined,
  requestFullscreen(lockPointer, resizeCanvas) {
        Browser.lockPointer = lockPointer;
        Browser.resizeCanvas = resizeCanvas;
        if (typeof Browser.lockPointer == 'undefined') Browser.lockPointer = true;
        if (typeof Browser.resizeCanvas == 'undefined') Browser.resizeCanvas = false;
  
        var canvas = Module['canvas'];
        function fullscreenChange() {
          Browser.isFullscreen = false;
          var canvasContainer = canvas.parentNode;
          if ((document['fullscreenElement'] || document['mozFullScreenElement'] ||
               document['msFullscreenElement'] || document['webkitFullscreenElement'] ||
               document['webkitCurrentFullScreenElement']) === canvasContainer) {
            canvas.exitFullscreen = Browser.exitFullscreen;
            if (Browser.lockPointer) canvas.requestPointerLock();
            Browser.isFullscreen = true;
            if (Browser.resizeCanvas) {
              Browser.setFullscreenCanvasSize();
            } else {
              Browser.updateCanvasDimensions(canvas);
            }
          } else {
            // remove the full screen specific parent of the canvas again to restore the HTML structure from before going full screen
            canvasContainer.parentNode.insertBefore(canvas, canvasContainer);
            canvasContainer.parentNode.removeChild(canvasContainer);
  
            if (Browser.resizeCanvas) {
              Browser.setWindowedCanvasSize();
            } else {
              Browser.updateCanvasDimensions(canvas);
            }
          }
          Module['onFullScreen']?.(Browser.isFullscreen);
          Module['onFullscreen']?.(Browser.isFullscreen);
        }
  
        if (!Browser.fullscreenHandlersInstalled) {
          Browser.fullscreenHandlersInstalled = true;
          document.addEventListener('fullscreenchange', fullscreenChange, false);
          document.addEventListener('mozfullscreenchange', fullscreenChange, false);
          document.addEventListener('webkitfullscreenchange', fullscreenChange, false);
          document.addEventListener('MSFullscreenChange', fullscreenChange, false);
        }
  
        // create a new parent to ensure the canvas has no siblings. this allows browsers to optimize full screen performance when its parent is the full screen root
        var canvasContainer = document.createElement("div");
        canvas.parentNode.insertBefore(canvasContainer, canvas);
        canvasContainer.appendChild(canvas);
  
        // use parent of canvas as full screen root to allow aspect ratio correction (Firefox stretches the root to screen size)
        canvasContainer.requestFullscreen = canvasContainer['requestFullscreen'] ||
                                            canvasContainer['mozRequestFullScreen'] ||
                                            canvasContainer['msRequestFullscreen'] ||
                                           (canvasContainer['webkitRequestFullscreen'] ? () => canvasContainer['webkitRequestFullscreen'](Element['ALLOW_KEYBOARD_INPUT']) : null) ||
                                           (canvasContainer['webkitRequestFullScreen'] ? () => canvasContainer['webkitRequestFullScreen'](Element['ALLOW_KEYBOARD_INPUT']) : null);
  
        canvasContainer.requestFullscreen();
      },
  requestFullScreen() {
        abort('Module.requestFullScreen has been replaced by Module.requestFullscreen (without a capital S)');
      },
  exitFullscreen() {
        // This is workaround for chrome. Trying to exit from fullscreen
        // not in fullscreen state will cause "TypeError: Document not active"
        // in chrome. See https://github.com/emscripten-core/emscripten/pull/8236
        if (!Browser.isFullscreen) {
          return false;
        }
  
        var CFS = document['exitFullscreen'] ||
                  document['cancelFullScreen'] ||
                  document['mozCancelFullScreen'] ||
                  document['msExitFullscreen'] ||
                  document['webkitCancelFullScreen'] ||
            (() => {});
        CFS.apply(document, []);
        return true;
      },
  nextRAF:0,
  fakeRequestAnimationFrame(func) {
        // try to keep 60fps between calls to here
        var now = Date.now();
        if (Browser.nextRAF === 0) {
          Browser.nextRAF = now + 1000/60;
        } else {
          while (now + 2 >= Browser.nextRAF) { // fudge a little, to avoid timer jitter causing us to do lots of delay:0
            Browser.nextRAF += 1000/60;
          }
        }
        var delay = Math.max(Browser.nextRAF - now, 0);
        setTimeout(func, delay);
      },
  requestAnimationFrame(func) {
        if (typeof requestAnimationFrame == 'function') {
          requestAnimationFrame(func);
          return;
        }
        var RAF = Browser.fakeRequestAnimationFrame;
        RAF(func);
      },
  safeSetTimeout(func, timeout) {
        // Legacy function, this is used by the SDL2 port so we need to keep it
        // around at least until that is updated.
        // See https://github.com/libsdl-org/SDL/pull/6304
        return safeSetTimeout(func, timeout);
      },
  safeRequestAnimationFrame(func) {
        
        return Browser.requestAnimationFrame(() => {
          
          callUserCallback(func);
        });
      },
  getMimetype(name) {
        return {
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'png': 'image/png',
          'bmp': 'image/bmp',
          'ogg': 'audio/ogg',
          'wav': 'audio/wav',
          'mp3': 'audio/mpeg'
        }[name.substr(name.lastIndexOf('.')+1)];
      },
  getUserMedia(func) {
        window.getUserMedia ||= navigator['getUserMedia'] ||
                                navigator['mozGetUserMedia'];
        window.getUserMedia(func);
      },
  getMovementX(event) {
        return event['movementX'] ||
               event['mozMovementX'] ||
               event['webkitMovementX'] ||
               0;
      },
  getMovementY(event) {
        return event['movementY'] ||
               event['mozMovementY'] ||
               event['webkitMovementY'] ||
               0;
      },
  getMouseWheelDelta(event) {
        var delta = 0;
        switch (event.type) {
          case 'DOMMouseScroll':
            // 3 lines make up a step
            delta = event.detail / 3;
            break;
          case 'mousewheel':
            // 120 units make up a step
            delta = event.wheelDelta / 120;
            break;
          case 'wheel':
            delta = event.deltaY
            switch (event.deltaMode) {
              case 0:
                // DOM_DELTA_PIXEL: 100 pixels make up a step
                delta /= 100;
                break;
              case 1:
                // DOM_DELTA_LINE: 3 lines make up a step
                delta /= 3;
                break;
              case 2:
                // DOM_DELTA_PAGE: A page makes up 80 steps
                delta *= 80;
                break;
              default:
                throw 'unrecognized mouse wheel delta mode: ' + event.deltaMode;
            }
            break;
          default:
            throw 'unrecognized mouse wheel event: ' + event.type;
        }
        return delta;
      },
  mouseX:0,
  mouseY:0,
  mouseMovementX:0,
  mouseMovementY:0,
  touches:{
  },
  lastTouches:{
  },
  calculateMouseCoords(pageX, pageY) {
        // Calculate the movement based on the changes
        // in the coordinates.
        var rect = Module["canvas"].getBoundingClientRect();
        var cw = Module["canvas"].width;
        var ch = Module["canvas"].height;
  
        // Neither .scrollX or .pageXOffset are defined in a spec, but
        // we prefer .scrollX because it is currently in a spec draft.
        // (see: http://www.w3.org/TR/2013/WD-cssom-view-20131217/)
        var scrollX = ((typeof window.scrollX != 'undefined') ? window.scrollX : window.pageXOffset);
        var scrollY = ((typeof window.scrollY != 'undefined') ? window.scrollY : window.pageYOffset);
        // If this assert lands, it's likely because the browser doesn't support scrollX or pageXOffset
        // and we have no viable fallback.
        assert((typeof scrollX != 'undefined') && (typeof scrollY != 'undefined'), 'Unable to retrieve scroll position, mouse positions likely broken.');
        var adjustedX = pageX - (scrollX + rect.left);
        var adjustedY = pageY - (scrollY + rect.top);
  
        // the canvas might be CSS-scaled compared to its backbuffer;
        // SDL-using content will want mouse coordinates in terms
        // of backbuffer units.
        adjustedX = adjustedX * (cw / rect.width);
        adjustedY = adjustedY * (ch / rect.height);
  
        return { x: adjustedX, y: adjustedY };
      },
  setMouseCoords(pageX, pageY) {
        const {x, y} = Browser.calculateMouseCoords(pageX, pageY);
        Browser.mouseMovementX = x - Browser.mouseX;
        Browser.mouseMovementY = y - Browser.mouseY;
        Browser.mouseX = x;
        Browser.mouseY = y;
      },
  calculateMouseEvent(event) { // event should be mousemove, mousedown or mouseup
        if (Browser.pointerLock) {
          // When the pointer is locked, calculate the coordinates
          // based on the movement of the mouse.
          // Workaround for Firefox bug 764498
          if (event.type != 'mousemove' &&
              ('mozMovementX' in event)) {
            Browser.mouseMovementX = Browser.mouseMovementY = 0;
          } else {
            Browser.mouseMovementX = Browser.getMovementX(event);
            Browser.mouseMovementY = Browser.getMovementY(event);
          }
  
          // add the mouse delta to the current absolute mouse position
          Browser.mouseX += Browser.mouseMovementX;
          Browser.mouseY += Browser.mouseMovementY;
        } else {
          if (event.type === 'touchstart' || event.type === 'touchend' || event.type === 'touchmove') {
            var touch = event.touch;
            if (touch === undefined) {
              return; // the "touch" property is only defined in SDL
  
            }
            var coords = Browser.calculateMouseCoords(touch.pageX, touch.pageY);
  
            if (event.type === 'touchstart') {
              Browser.lastTouches[touch.identifier] = coords;
              Browser.touches[touch.identifier] = coords;
            } else if (event.type === 'touchend' || event.type === 'touchmove') {
              var last = Browser.touches[touch.identifier];
              last ||= coords;
              Browser.lastTouches[touch.identifier] = last;
              Browser.touches[touch.identifier] = coords;
            }
            return;
          }
  
          Browser.setMouseCoords(event.pageX, event.pageY);
        }
      },
  resizeListeners:[],
  updateResizeListeners() {
        var canvas = Module['canvas'];
        Browser.resizeListeners.forEach((listener) => listener(canvas.width, canvas.height));
      },
  setCanvasSize(width, height, noUpdates) {
        var canvas = Module['canvas'];
        Browser.updateCanvasDimensions(canvas, width, height);
        if (!noUpdates) Browser.updateResizeListeners();
      },
  windowedWidth:0,
  windowedHeight:0,
  setFullscreenCanvasSize() {
        // check if SDL is available
        if (typeof SDL != "undefined") {
          var flags = HEAPU32[((SDL.screen)>>2)];
          flags = flags | 0x00800000; // set SDL_FULLSCREEN flag
          HEAP32[((SDL.screen)>>2)] = flags;
        }
        Browser.updateCanvasDimensions(Module['canvas']);
        Browser.updateResizeListeners();
      },
  setWindowedCanvasSize() {
        // check if SDL is available
        if (typeof SDL != "undefined") {
          var flags = HEAPU32[((SDL.screen)>>2)];
          flags = flags & ~0x00800000; // clear SDL_FULLSCREEN flag
          HEAP32[((SDL.screen)>>2)] = flags;
        }
        Browser.updateCanvasDimensions(Module['canvas']);
        Browser.updateResizeListeners();
      },
  updateCanvasDimensions(canvas, wNative, hNative) {
        if (wNative && hNative) {
          canvas.widthNative = wNative;
          canvas.heightNative = hNative;
        } else {
          wNative = canvas.widthNative;
          hNative = canvas.heightNative;
        }
        var w = wNative;
        var h = hNative;
        if (Module['forcedAspectRatio'] && Module['forcedAspectRatio'] > 0) {
          if (w/h < Module['forcedAspectRatio']) {
            w = Math.round(h * Module['forcedAspectRatio']);
          } else {
            h = Math.round(w / Module['forcedAspectRatio']);
          }
        }
        if (((document['fullscreenElement'] || document['mozFullScreenElement'] ||
             document['msFullscreenElement'] || document['webkitFullscreenElement'] ||
             document['webkitCurrentFullScreenElement']) === canvas.parentNode) && (typeof screen != 'undefined')) {
           var factor = Math.min(screen.width / w, screen.height / h);
           w = Math.round(w * factor);
           h = Math.round(h * factor);
        }
        if (Browser.resizeCanvas) {
          if (canvas.width  != w) canvas.width  = w;
          if (canvas.height != h) canvas.height = h;
          if (typeof canvas.style != 'undefined') {
            canvas.style.removeProperty( "width");
            canvas.style.removeProperty("height");
          }
        } else {
          if (canvas.width  != wNative) canvas.width  = wNative;
          if (canvas.height != hNative) canvas.height = hNative;
          if (typeof canvas.style != 'undefined') {
            if (w != wNative || h != hNative) {
              canvas.style.setProperty( "width", w + "px", "important");
              canvas.style.setProperty("height", h + "px", "important");
            } else {
              canvas.style.removeProperty( "width");
              canvas.style.removeProperty("height");
            }
          }
        }
      },
  };

  
  
  var _emscripten_run_preload_plugins = (file, onload, onerror) => {
      
  
      var _file = UTF8ToString(file);
      var data = FS.analyzePath(_file);
      if (!data.exists) return -1;
      FS.createPreloadedFile(
        PATH.dirname(_file),
        PATH.basename(_file),
        // TODO: This copy is not needed if the contents are already a Uint8Array,
        //       which they often are (and always are in WasmFS).
        new Uint8Array(data.object.contents), true, true,
        () => {
          
          if (onload) ((a1) => dynCall_vi(onload, a1))(file);
        },
        () => {
          
          if (onerror) ((a1) => dynCall_vi(onerror, a1))(file);
        },
        true // don'tCreateFile - it's already there
      );
      return 0;
    };

  var Browser_asyncPrepareDataCounter = 0;

  
  
  
  var _emscripten_run_preload_plugins_data = (data, size, suffix, arg, onload, onerror) => {
      
  
      var _suffix = UTF8ToString(suffix);
      var name = 'prepare_data_' + (Browser_asyncPrepareDataCounter++) + '.' + _suffix;
      var cname = stringToNewUTF8(name);
      FS.createPreloadedFile(
        '/',
        name,
        HEAPU8.subarray((data), data + size),
        true, true,
        () => {
          
          if (onload) ((a1, a2) => dynCall_vii(onload, a1, a2))(arg, cname);
        },
        () => {
          
          if (onerror) ((a1) => dynCall_vi(onerror, a1))(arg);
        },
        true // don'tCreateFile - it's already there
      );
    };

  
  
  var _emscripten_async_run_script = (script, millis) => {
      // TODO: cache these to avoid generating garbage
      safeSetTimeout(() => _emscripten_run_script(script), millis);
    };

  
  
  var _emscripten_async_load_script = (url, onload, onerror) => {
      url = UTF8ToString(url);
      onload = (() => dynCall_v(onload));
      onerror = (() => dynCall_v(onerror));
  
      assert(runDependencies === 0, 'async_load_script must be run when no other dependencies are active');
      
  
      var loadDone = () => {
        
        if (onload) {
          if (runDependencies > 0) {
            dependenciesFulfilled = onload;
          } else {
            onload();
          }
        }
      }
  
      var loadError = () => {
        
        onerror?.();
      };
  
      if (ENVIRONMENT_IS_NODE) {
        readAsync(url, false).then((data) => {
          eval(data);
          loadDone();
        }, loadError);
        return;
      }
  
      var script = document.createElement('script');
      script.onload = loadDone;
      script.onerror = loadError;
      script.src = url;
      document.body.appendChild(script);
    };

  var _emscripten_get_main_loop_timing = (mode, value) => {
      if (mode) HEAP32[((mode)>>2)] = Browser.mainLoop.timingMode;
      if (value) HEAP32[((value)>>2)] = Browser.mainLoop.timingValue;
    };


  
  var _emscripten_set_main_loop = (func, fps, simulateInfiniteLoop) => {
      var browserIterationFunc = (() => dynCall_v(func));
      setMainLoop(browserIterationFunc, fps, simulateInfiniteLoop);
    };


  
  var _emscripten_set_main_loop_arg = (func, arg, fps, simulateInfiniteLoop) => {
      var browserIterationFunc = () => ((a1) => dynCall_vi(func, a1))(arg);
      setMainLoop(browserIterationFunc, fps, simulateInfiniteLoop, arg);
    };

  var _emscripten_cancel_main_loop = () => {
      Browser.mainLoop.pause();
      Browser.mainLoop.func = null;
    };

  var _emscripten_pause_main_loop = () => {
      Browser.mainLoop.pause();
    };

  var _emscripten_resume_main_loop = () => {
      Browser.mainLoop.resume();
    };

  
  var __emscripten_push_main_loop_blocker = (func, arg, name) => {
      Browser.mainLoop.queue.push({ func: () => {
        ((a1) => dynCall_vi(func, a1))(arg);
      }, name: UTF8ToString(name), counted: true });
      Browser.mainLoop.updateStatus();
    };

  
  var __emscripten_push_uncounted_main_loop_blocker = (func, arg, name) => {
      Browser.mainLoop.queue.push({ func: () => {
        ((a1) => dynCall_vi(func, a1))(arg);
      }, name: UTF8ToString(name), counted: false });
      Browser.mainLoop.updateStatus();
    };

  var _emscripten_set_main_loop_expected_blockers = (num) => {
      Browser.mainLoop.expectedBlockers = num;
      Browser.mainLoop.remainingBlockers = num;
      Browser.mainLoop.updateStatus();
    };

  
  var _emscripten_async_call = (func, arg, millis) => {
      function wrapper() {
        ((a1) => dynCall_vi(func, a1))(arg);
      }
  
      if (millis >= 0
        // node does not support requestAnimationFrame
        || ENVIRONMENT_IS_NODE
      ) {
        safeSetTimeout(wrapper, millis);
      } else {
        Browser.safeRequestAnimationFrame(wrapper);
      }
    };

  var _emscripten_get_window_title = () => {
      var buflen = 256;
  
      if (!_emscripten_get_window_title.buffer) {
        _emscripten_get_window_title.buffer = _malloc(buflen);
      }
  
      stringToUTF8(document.title, _emscripten_get_window_title.buffer, buflen);
  
      return _emscripten_get_window_title.buffer;
    };

  
  var _emscripten_set_window_title = (title) => document.title = UTF8ToString(title);

  var _emscripten_get_screen_size = (width, height) => {
      HEAP32[((width)>>2)] = screen.width;
      HEAP32[((height)>>2)] = screen.height;
    };

  var _emscripten_hide_mouse = () => {
      var styleSheet = document.styleSheets[0];
      var rules = styleSheet.cssRules;
      for (var i = 0; i < rules.length; i++) {
        if (rules[i].cssText.substr(0, 6) == 'canvas') {
          styleSheet.deleteRule(i);
          i--;
        }
      }
      styleSheet.insertRule('canvas.emscripten { border: 1px solid black; cursor: none; }', 0);
    };

  var _emscripten_set_canvas_size = (width, height) => {
      Browser.setCanvasSize(width, height);
    };

  var _emscripten_get_canvas_size = (width, height, isFullscreen) => {
      var canvas = Module['canvas'];
      HEAP32[((width)>>2)] = canvas.width;
      HEAP32[((height)>>2)] = canvas.height;
      HEAP32[((isFullscreen)>>2)] = Browser.isFullscreen ? 1 : 0;
    };

  
  
  
  
  var _emscripten_create_worker = (url) => {
      url = UTF8ToString(url);
      var id = Browser.workers.length;
      var info = {
        worker: new Worker(url),
        callbacks: [],
        awaited: 0,
        buffer: 0,
        bufferSize: 0
      };
      info.worker.onmessage = function info_worker_onmessage(msg) {
        if (ABORT) return;
        var info = Browser.workers[id];
        if (!info) return; // worker was destroyed meanwhile
        var callbackId = msg.data['callbackId'];
        var callbackInfo = info.callbacks[callbackId];
        if (!callbackInfo) return; // no callback or callback removed meanwhile
        // Don't trash our callback state if we expect additional calls.
        if (msg.data['finalResponse']) {
          info.awaited--;
          info.callbacks[callbackId] = null; // TODO: reuse callbackIds, compress this
          
        }
        var data = msg.data['data'];
        if (data) {
          if (!data.byteLength) data = new Uint8Array(data);
          if (!info.buffer || info.bufferSize < data.length) {
            if (info.buffer) _free(info.buffer);
            info.bufferSize = data.length;
            info.buffer = _malloc(data.length);
          }
          HEAPU8.set(data, info.buffer);
          callbackInfo.func(info.buffer, data.length, callbackInfo.arg);
        } else {
          callbackInfo.func(0, 0, callbackInfo.arg);
        }
      };
      Browser.workers.push(info);
      return id;
    };

  
  var _emscripten_destroy_worker = (id) => {
      var info = Browser.workers[id];
      info.worker.terminate();
      if (info.buffer) _free(info.buffer);
      Browser.workers[id] = null;
    };

  
  var _emscripten_call_worker = (id, funcName, data, size, callback, arg) => {
      funcName = UTF8ToString(funcName);
      var info = Browser.workers[id];
      var callbackId = -1;
      if (callback) {
        // If we are waiting for a response from the worker we need to keep
        // the runtime alive at least long enough to receive it.
        // The corresponding runtimeKeepalivePop is in the `finalResponse`
        // handler above.
        
        callbackId = info.callbacks.length;
        info.callbacks.push({
          func: ((a1, a2, a3) => { throw 'Internal Error! Attempted to invoke wasm function pointer with signature "viii", but no such functions have gotten exported!' }),
          arg
        });
        info.awaited++;
      }
      var transferObject = {
        'funcName': funcName,
        'callbackId': callbackId,
        'data': data ? new Uint8Array(HEAPU8.subarray((data), data + size)) : 0
      };
      if (data) {
        info.worker.postMessage(transferObject, [transferObject.data.buffer]);
      } else {
        info.worker.postMessage(transferObject);
      }
    };

  var _emscripten_get_worker_queue_size = (id) => {
      var info = Browser.workers[id];
      if (!info) return -1;
      return info.awaited;
    };

  var getPreloadedImageData = (path, w, h) => {
      path = PATH_FS.resolve(path);
  
      var canvas = /** @type {HTMLCanvasElement} */(preloadedImages[path]);
      if (!canvas) return 0;
  
      var ctx = canvas.getContext("2d");
      var image = ctx.getImageData(0, 0, canvas.width, canvas.height);
      var buf = _malloc(canvas.width * canvas.height * 4);
  
      HEAPU8.set(image.data, buf);
  
      HEAP32[((w)>>2)] = canvas.width;
      HEAP32[((h)>>2)] = canvas.height;
      return buf;
    };
  
  
  
  var _emscripten_get_preloaded_image_data = (path, w, h) => getPreloadedImageData(UTF8ToString(path), w, h);

  var getPreloadedImageData__data = ["$PATH_FS","malloc"];


  
  
  var _emscripten_get_preloaded_image_data_from_FILE = (file, w, h) => {
      var fd = _fileno(file);
      var stream = FS.getStream(fd);
      if (stream) {
        return getPreloadedImageData(stream.path, w, h);
      }
  
      return 0;
    };

  var wget = {
  wgetRequests:{
  },
  nextWgetRequestHandle:0,
  getNextWgetRequestHandle() {
        var handle = wget.nextWgetRequestHandle;
        wget.nextWgetRequestHandle++;
        return handle;
      },
  };

  
  
  
  
  
  
  
    /**
     * @param {number=} mode Optionally, the mode to create in. Uses mkdir's
     *                       default if not set.
     */
  var FS_mkdirTree = (path, mode) => FS.mkdirTree(path, mode);
  
  
  var FS_unlink = (path) => FS.unlink(path);
  
  var _emscripten_async_wget = (url, file, onload, onerror) => {
      
  
      var _url = UTF8ToString(url);
      var _file = UTF8ToString(file);
      _file = PATH_FS.resolve(_file);
      function doCallback(callback) {
        if (callback) {
          
          callUserCallback(() => {
            var sp = stackSave();
            ((a1) => dynCall_vi(callback, a1))(stringToUTF8OnStack(_file));
            stackRestore(sp);
          });
        }
      }
      var destinationDirectory = PATH.dirname(_file);
      FS_createPreloadedFile(
        destinationDirectory,
        PATH.basename(_file),
        _url, true, true,
        () => doCallback(onload),
        () => doCallback(onerror),
        false, // dontCreateFile
        false, // canOwn
        () => { // preFinish
          // if a file exists there, we overwrite it
          try {
            FS_unlink(_file);
          } catch (e) {}
          // if the destination directory does not yet exist, create it
          FS_mkdirTree(destinationDirectory);
        }
      );
    };

  
  
  
  
  var _emscripten_async_wget_data = (url, userdata, onload, onerror) => {
      
      asyncLoad(UTF8ToString(url), (byteArray) => {
        
        callUserCallback(() => {
          var buffer = _malloc(byteArray.length);
          HEAPU8.set(byteArray, buffer);
          ((a1, a2, a3) => { throw 'Internal Error! Attempted to invoke wasm function pointer with signature "viii", but no such functions have gotten exported!' })(userdata, buffer, byteArray.length);
          _free(buffer);
        });
      }, () => {
        if (onerror) {
          
          callUserCallback(() => {
            ((a1) => dynCall_vi(onerror, a1))(userdata);
          });
        }
      }, true /* no need for run dependency, this is async but will not do any prepare etc. step */ );
    };

  
  
  
  
  var _emscripten_async_wget2 = (url, file, request, param, userdata, onload, onerror, onprogress) => {
      
  
      var _url = UTF8ToString(url);
      var _file = UTF8ToString(file);
      _file = PATH_FS.resolve(_file);
      var _request = UTF8ToString(request);
      var _param = UTF8ToString(param);
      var index = _file.lastIndexOf('/');
  
      var http = new XMLHttpRequest();
      http.open(_request, _url, true);
      http.responseType = 'arraybuffer';
  
      var handle = wget.getNextWgetRequestHandle();
  
      var destinationDirectory = PATH.dirname(_file);
  
      // LOAD
      http.onload = (e) => {
        
        if (http.status >= 200 && http.status < 300) {
          // if a file exists there, we overwrite it
          try {
            FS.unlink(_file);
          } catch (e) {}
          // if the destination directory does not yet exist, create it
          FS.mkdirTree(destinationDirectory);
  
          FS.createDataFile( _file.substr(0, index), _file.substr(index + 1), new Uint8Array(/** @type{ArrayBuffer}*/(http.response)), true, true, false);
          if (onload) {
            var sp = stackSave();
            ((a1, a2, a3) => { throw 'Internal Error! Attempted to invoke wasm function pointer with signature "viii", but no such functions have gotten exported!' })(handle, userdata, stringToUTF8OnStack(_file));
            stackRestore(sp);
          }
        } else {
          if (onerror) ((a1, a2, a3) => { throw 'Internal Error! Attempted to invoke wasm function pointer with signature "viii", but no such functions have gotten exported!' })(handle, userdata, http.status);
        }
  
        delete wget.wgetRequests[handle];
      };
  
      // ERROR
      http.onerror = (e) => {
        
        if (onerror) ((a1, a2, a3) => { throw 'Internal Error! Attempted to invoke wasm function pointer with signature "viii", but no such functions have gotten exported!' })(handle, userdata, http.status);
        delete wget.wgetRequests[handle];
      };
  
      // PROGRESS
      http.onprogress = (e) => {
        if (e.lengthComputable || (e.lengthComputable === undefined && e.total != 0)) {
          var percentComplete = (e.loaded / e.total)*100;
          if (onprogress) ((a1, a2, a3) => { throw 'Internal Error! Attempted to invoke wasm function pointer with signature "viii", but no such functions have gotten exported!' })(handle, userdata, percentComplete);
        }
      };
  
      // ABORT
      http.onabort = (e) => {
        
        delete wget.wgetRequests[handle];
      };
  
      if (_request == "POST") {
        //Send the proper header information along with the request
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        http.send(_param);
      } else {
        http.send(null);
      }
  
      wget.wgetRequests[handle] = http;
  
      return handle;
    };

  
  
  
  var _emscripten_async_wget2_data = (url, request, param, userdata, free, onload, onerror, onprogress) => {
      var _url = UTF8ToString(url);
      var _request = UTF8ToString(request);
      var _param = UTF8ToString(param);
  
      var http = new XMLHttpRequest();
      http.open(_request, _url, true);
      http.responseType = 'arraybuffer';
  
      var handle = wget.getNextWgetRequestHandle();
  
      function onerrorjs() {
        if (onerror) {
          var sp = stackSave();
          var statusText = 0;
          if (http.statusText) {
            statusText = stringToUTF8OnStack(http.statusText);
          }
          ((a1, a2, a3, a4) => dynCall_viiii(onerror, a1, a2, a3, a4))(handle, userdata, http.status, statusText);
          stackRestore(sp);
        }
      }
  
      // LOAD
      http.onload = (e) => {
        if (http.status >= 200 && http.status < 300 || (http.status === 0 && _url.substr(0,4).toLowerCase() != "http")) {
          var byteArray = new Uint8Array(/** @type{ArrayBuffer} */(http.response));
          var buffer = _malloc(byteArray.length);
          HEAPU8.set(byteArray, buffer);
          if (onload) ((a1, a2, a3, a4) => dynCall_viiii(onload, a1, a2, a3, a4))(handle, userdata, buffer, byteArray.length);
          if (free) _free(buffer);
        } else {
          onerrorjs();
        }
        delete wget.wgetRequests[handle];
      };
  
      // ERROR
      http.onerror = (e) => {
        onerrorjs();
        delete wget.wgetRequests[handle];
      };
  
      // PROGRESS
      http.onprogress = (e) => {
        if (onprogress) ((a1, a2, a3, a4) => dynCall_viiii(onprogress, a1, a2, a3, a4))(handle, userdata, e.loaded, e.lengthComputable || e.lengthComputable === undefined ? e.total : 0);
      };
  
      // ABORT
      http.onabort = (e) => {
        delete wget.wgetRequests[handle];
      };
  
      if (_request == "POST") {
        //Send the proper header information along with the request
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        http.send(_param);
      } else {
        http.send(null);
      }
  
      wget.wgetRequests[handle] = http;
  
      return handle;
    };

  var _emscripten_async_wget2_abort = (handle) => {
      var http = wget.wgetRequests[handle];
      http?.abort();
    };


  function syscallGetVarargI() {
      assert(SYSCALLS.varargs != undefined);
      // the `+` prepended here is necessary to convince the JSCompiler that varargs is indeed a number.
      var ret = HEAP32[((+SYSCALLS.varargs)>>2)];
      SYSCALLS.varargs += 4;
      return ret;
    }

  var syscallGetVarargP = syscallGetVarargI;

  
  
  
  
  
  function __mmap_js(len,prot,flags,fd,offset_low, offset_high,allocated,addr) {
    var offset = convertI32PairToI53Checked(offset_low, offset_high);
  
    
  try {
  
      if (isNaN(offset)) return 61;
      var stream = SYSCALLS.getStreamFromFD(fd);
      var res = FS.mmap(stream, len, offset, prot, flags);
      var ptr = res.ptr;
      HEAP32[((allocated)>>2)] = res.allocated;
      HEAPU32[((addr)>>2)] = ptr;
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return -e.errno;
  }
  ;
  }

  
  function __munmap_js(addr,len,prot,flags,fd,offset_low, offset_high) {
    var offset = convertI32PairToI53Checked(offset_low, offset_high);
  
    
  try {
  
      var stream = SYSCALLS.getStreamFromFD(fd);
      if (prot & 2) {
        SYSCALLS.doMsync(addr, stream, len, flags, offset);
      }
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return -e.errno;
  }
  ;
  }

  function ___syscall_chdir(path) {
  try {
  
      path = SYSCALLS.getStr(path);
      FS.chdir(path);
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return -e.errno;
  }
  }

  function ___syscall_chmod(path, mode) {
  try {
  
      path = SYSCALLS.getStr(path);
      FS.chmod(path, mode);
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return -e.errno;
  }
  }

  function ___syscall_rmdir(path) {
  try {
  
      path = SYSCALLS.getStr(path);
      FS.rmdir(path);
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return -e.errno;
  }
  }

  function ___syscall_dup(fd) {
  try {
  
      var old = SYSCALLS.getStreamFromFD(fd);
      return FS.dupStream(old).fd;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return -e.errno;
  }
  }

  var PIPEFS = {
  BUCKET_BUFFER_SIZE:8192,
  mount(mount) {
        // Do not pollute the real root directory or its child nodes with pipes
        // Looks like it is OK to create another pseudo-root node not linked to the FS.root hierarchy this way
        return FS.createNode(null, '/', 16384 | 511 /* 0777 */, 0);
      },
  createPipe() {
        var pipe = {
          buckets: [],
          // refcnt 2 because pipe has a read end and a write end. We need to be
          // able to read from the read end after write end is closed.
          refcnt : 2,
        };
  
        pipe.buckets.push({
          buffer: new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE),
          offset: 0,
          roffset: 0
        });
  
        var rName = PIPEFS.nextname();
        var wName = PIPEFS.nextname();
        var rNode = FS.createNode(PIPEFS.root, rName, 4096, 0);
        var wNode = FS.createNode(PIPEFS.root, wName, 4096, 0);
  
        rNode.pipe = pipe;
        wNode.pipe = pipe;
  
        var readableStream = FS.createStream({
          path: rName,
          node: rNode,
          flags: 0,
          seekable: false,
          stream_ops: PIPEFS.stream_ops
        });
        rNode.stream = readableStream;
  
        var writableStream = FS.createStream({
          path: wName,
          node: wNode,
          flags: 1,
          seekable: false,
          stream_ops: PIPEFS.stream_ops
        });
        wNode.stream = writableStream;
  
        return {
          readable_fd: readableStream.fd,
          writable_fd: writableStream.fd
        };
      },
  stream_ops:{
  poll(stream) {
          var pipe = stream.node.pipe;
  
          if ((stream.flags & 2097155) === 1) {
            return (256 | 4);
          }
          if (pipe.buckets.length > 0) {
            for (var i = 0; i < pipe.buckets.length; i++) {
              var bucket = pipe.buckets[i];
              if (bucket.offset - bucket.roffset > 0) {
                return (64 | 1);
              }
            }
          }
  
          return 0;
        },
  ioctl(stream, request, varargs) {
          return 28;
        },
  fsync(stream) {
          return 28;
        },
  read(stream, buffer, offset, length, position /* ignored */) {
          var pipe = stream.node.pipe;
          var currentLength = 0;
  
          for (var i = 0; i < pipe.buckets.length; i++) {
            var bucket = pipe.buckets[i];
            currentLength += bucket.offset - bucket.roffset;
          }
  
          assert(buffer instanceof ArrayBuffer || ArrayBuffer.isView(buffer));
          var data = buffer.subarray(offset, offset + length);
  
          if (length <= 0) {
            return 0;
          }
          if (currentLength == 0) {
            // Behave as if the read end is always non-blocking
            throw new FS.ErrnoError(6);
          }
          var toRead = Math.min(currentLength, length);
  
          var totalRead = toRead;
          var toRemove = 0;
  
          for (var i = 0; i < pipe.buckets.length; i++) {
            var currBucket = pipe.buckets[i];
            var bucketSize = currBucket.offset - currBucket.roffset;
  
            if (toRead <= bucketSize) {
              var tmpSlice = currBucket.buffer.subarray(currBucket.roffset, currBucket.offset);
              if (toRead < bucketSize) {
                tmpSlice = tmpSlice.subarray(0, toRead);
                currBucket.roffset += toRead;
              } else {
                toRemove++;
              }
              data.set(tmpSlice);
              break;
            } else {
              var tmpSlice = currBucket.buffer.subarray(currBucket.roffset, currBucket.offset);
              data.set(tmpSlice);
              data = data.subarray(tmpSlice.byteLength);
              toRead -= tmpSlice.byteLength;
              toRemove++;
            }
          }
  
          if (toRemove && toRemove == pipe.buckets.length) {
            // Do not generate excessive garbage in use cases such as
            // write several bytes, read everything, write several bytes, read everything...
            toRemove--;
            pipe.buckets[toRemove].offset = 0;
            pipe.buckets[toRemove].roffset = 0;
          }
  
          pipe.buckets.splice(0, toRemove);
  
          return totalRead;
        },
  write(stream, buffer, offset, length, position /* ignored */) {
          var pipe = stream.node.pipe;
  
          assert(buffer instanceof ArrayBuffer || ArrayBuffer.isView(buffer));
          var data = buffer.subarray(offset, offset + length);
  
          var dataLen = data.byteLength;
          if (dataLen <= 0) {
            return 0;
          }
  
          var currBucket = null;
  
          if (pipe.buckets.length == 0) {
            currBucket = {
              buffer: new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE),
              offset: 0,
              roffset: 0
            };
            pipe.buckets.push(currBucket);
          } else {
            currBucket = pipe.buckets[pipe.buckets.length - 1];
          }
  
          assert(currBucket.offset <= PIPEFS.BUCKET_BUFFER_SIZE);
  
          var freeBytesInCurrBuffer = PIPEFS.BUCKET_BUFFER_SIZE - currBucket.offset;
          if (freeBytesInCurrBuffer >= dataLen) {
            currBucket.buffer.set(data, currBucket.offset);
            currBucket.offset += dataLen;
            return dataLen;
          } else if (freeBytesInCurrBuffer > 0) {
            currBucket.buffer.set(data.subarray(0, freeBytesInCurrBuffer), currBucket.offset);
            currBucket.offset += freeBytesInCurrBuffer;
            data = data.subarray(freeBytesInCurrBuffer, data.byteLength);
          }
  
          var numBuckets = (data.byteLength / PIPEFS.BUCKET_BUFFER_SIZE) | 0;
          var remElements = data.byteLength % PIPEFS.BUCKET_BUFFER_SIZE;
  
          for (var i = 0; i < numBuckets; i++) {
            var newBucket = {
              buffer: new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE),
              offset: PIPEFS.BUCKET_BUFFER_SIZE,
              roffset: 0
            };
            pipe.buckets.push(newBucket);
            newBucket.buffer.set(data.subarray(0, PIPEFS.BUCKET_BUFFER_SIZE));
            data = data.subarray(PIPEFS.BUCKET_BUFFER_SIZE, data.byteLength);
          }
  
          if (remElements > 0) {
            var newBucket = {
              buffer: new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE),
              offset: data.byteLength,
              roffset: 0
            };
            pipe.buckets.push(newBucket);
            newBucket.buffer.set(data);
          }
  
          return dataLen;
        },
  close(stream) {
          var pipe = stream.node.pipe;
          pipe.refcnt--;
          if (pipe.refcnt === 0) {
            pipe.buckets = null;
          }
        },
  },
  nextname() {
        if (!PIPEFS.nextname.current) {
          PIPEFS.nextname.current = 0;
        }
        return 'pipe[' + (PIPEFS.nextname.current++) + ']';
      },
  };
  function ___syscall_pipe(fdPtr) {
  try {
  
      if (fdPtr == 0) {
        throw new FS.ErrnoError(21);
      }
  
      var res = PIPEFS.createPipe();
  
      HEAP32[((fdPtr)>>2)] = res.readable_fd;
      HEAP32[(((fdPtr)+(4))>>2)] = res.writable_fd;
  
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return -e.errno;
  }
  }

  
  function ___syscall_ioctl(fd, op, varargs) {
  SYSCALLS.varargs = varargs;
  try {
  
      var stream = SYSCALLS.getStreamFromFD(fd);
      switch (op) {
        case 21509: {
          if (!stream.tty) return -59;
          return 0;
        }
        case 21505: {
          if (!stream.tty) return -59;
          if (stream.tty.ops.ioctl_tcgets) {
            var termios = stream.tty.ops.ioctl_tcgets(stream);
            var argp = syscallGetVarargP();
            HEAP32[((argp)>>2)] = termios.c_iflag || 0;
            HEAP32[(((argp)+(4))>>2)] = termios.c_oflag || 0;
            HEAP32[(((argp)+(8))>>2)] = termios.c_cflag || 0;
            HEAP32[(((argp)+(12))>>2)] = termios.c_lflag || 0;
            for (var i = 0; i < 32; i++) {
              HEAP8[(argp + i)+(17)] = termios.c_cc[i] || 0;
            }
            return 0;
          }
          return 0;
        }
        case 21510:
        case 21511:
        case 21512: {
          if (!stream.tty) return -59;
          return 0; // no-op, not actually adjusting terminal settings
        }
        case 21506:
        case 21507:
        case 21508: {
          if (!stream.tty) return -59;
          if (stream.tty.ops.ioctl_tcsets) {
            var argp = syscallGetVarargP();
            var c_iflag = HEAP32[((argp)>>2)];
            var c_oflag = HEAP32[(((argp)+(4))>>2)];
            var c_cflag = HEAP32[(((argp)+(8))>>2)];
            var c_lflag = HEAP32[(((argp)+(12))>>2)];
            var c_cc = []
            for (var i = 0; i < 32; i++) {
              c_cc.push(HEAP8[(argp + i)+(17)]);
            }
            return stream.tty.ops.ioctl_tcsets(stream.tty, op, { c_iflag, c_oflag, c_cflag, c_lflag, c_cc });
          }
          return 0; // no-op, not actually adjusting terminal settings
        }
        case 21519: {
          if (!stream.tty) return -59;
          var argp = syscallGetVarargP();
          HEAP32[((argp)>>2)] = 0;
          return 0;
        }
        case 21520: {
          if (!stream.tty) return -59;
          return -28; // not supported
        }
        case 21531: {
          var argp = syscallGetVarargP();
          return FS.ioctl(stream, op, argp);
        }
        case 21523: {
          // TODO: in theory we should write to the winsize struct that gets
          // passed in, but for now musl doesn't read anything on it
          if (!stream.tty) return -59;
          if (stream.tty.ops.ioctl_tiocgwinsz) {
            var winsize = stream.tty.ops.ioctl_tiocgwinsz(stream.tty);
            var argp = syscallGetVarargP();
            HEAP16[((argp)>>1)] = winsize[0];
            HEAP16[(((argp)+(2))>>1)] = winsize[1];
          }
          return 0;
        }
        case 21524: {
          // TODO: technically, this ioctl call should change the window size.
          // but, since emscripten doesn't have any concept of a terminal window
          // yet, we'll just silently throw it away as we do TIOCGWINSZ
          if (!stream.tty) return -59;
          return 0;
        }
        case 21515: {
          if (!stream.tty) return -59;
          return 0;
        }
        default: return -28; // not supported
      }
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return -e.errno;
  }
  }

  function ___syscall_symlink(target, linkpath) {
  try {
  
      target = SYSCALLS.getStr(target);
      linkpath = SYSCALLS.getStr(linkpath);
      FS.symlink(target, linkpath);
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return -e.errno;
  }
  }

  function ___syscall_fchmod(fd, mode) {
  try {
  
      FS.fchmod(fd, mode);
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return -e.errno;
  }
  }

  var SOCKFS = {
  mount(mount) {
        // If Module['websocket'] has already been defined (e.g. for configuring
        // the subprotocol/url) use that, if not initialise it to a new object.
        Module['websocket'] = (Module['websocket'] &&
                               ('object' === typeof Module['websocket'])) ? Module['websocket'] : {};
  
        // Add the Event registration mechanism to the exported websocket configuration
        // object so we can register network callbacks from native JavaScript too.
        // For more documentation see system/include/emscripten/emscripten.h
        Module['websocket']._callbacks = {};
        Module['websocket']['on'] = /** @this{Object} */ function(event, callback) {
          if ('function' === typeof callback) {
            this._callbacks[event] = callback;
          }
          return this;
        };
  
        Module['websocket'].emit = /** @this{Object} */ function(event, param) {
          if ('function' === typeof this._callbacks[event]) {
            this._callbacks[event].call(this, param);
          }
        };
  
        // If debug is enabled register simple default logging callbacks for each Event.
  
        return FS.createNode(null, '/', 16384 | 511 /* 0777 */, 0);
      },
  createSocket(family, type, protocol) {
        type &= ~526336; // Some applications may pass it; it makes no sense for a single process.
        var streaming = type == 1;
        if (streaming && protocol && protocol != 6) {
          throw new FS.ErrnoError(66); // if SOCK_STREAM, must be tcp or 0.
        }
  
        // create our internal socket structure
        var sock = {
          family,
          type,
          protocol,
          server: null,
          error: null, // Used in getsockopt for SOL_SOCKET/SO_ERROR test
          peers: {},
          pending: [],
          recv_queue: [],
          sock_ops: SOCKFS.websocket_sock_ops
        };
  
        // create the filesystem node to store the socket structure
        var name = SOCKFS.nextname();
        var node = FS.createNode(SOCKFS.root, name, 49152, 0);
        node.sock = sock;
  
        // and the wrapping stream that enables library functions such
        // as read and write to indirectly interact with the socket
        var stream = FS.createStream({
          path: name,
          node,
          flags: 2,
          seekable: false,
          stream_ops: SOCKFS.stream_ops
        });
  
        // map the new stream to the socket structure (sockets have a 1:1
        // relationship with a stream)
        sock.stream = stream;
  
        return sock;
      },
  getSocket(fd) {
        var stream = FS.getStream(fd);
        if (!stream || !FS.isSocket(stream.node.mode)) {
          return null;
        }
        return stream.node.sock;
      },
  stream_ops:{
  poll(stream) {
          var sock = stream.node.sock;
          return sock.sock_ops.poll(sock);
        },
  ioctl(stream, request, varargs) {
          var sock = stream.node.sock;
          return sock.sock_ops.ioctl(sock, request, varargs);
        },
  read(stream, buffer, offset, length, position /* ignored */) {
          var sock = stream.node.sock;
          var msg = sock.sock_ops.recvmsg(sock, length);
          if (!msg) {
            // socket is closed
            return 0;
          }
          buffer.set(msg.buffer, offset);
          return msg.buffer.length;
        },
  write(stream, buffer, offset, length, position /* ignored */) {
          var sock = stream.node.sock;
          return sock.sock_ops.sendmsg(sock, buffer, offset, length);
        },
  close(stream) {
          var sock = stream.node.sock;
          sock.sock_ops.close(sock);
        },
  },
  nextname() {
        if (!SOCKFS.nextname.current) {
          SOCKFS.nextname.current = 0;
        }
        return 'socket[' + (SOCKFS.nextname.current++) + ']';
      },
  websocket_sock_ops:{
  createPeer(sock, addr, port) {
          var ws;
  
          if (typeof addr == 'object') {
            ws = addr;
            addr = null;
            port = null;
          }
  
          if (ws) {
            // for sockets that've already connected (e.g. we're the server)
            // we can inspect the _socket property for the address
            if (ws._socket) {
              addr = ws._socket.remoteAddress;
              port = ws._socket.remotePort;
            }
            // if we're just now initializing a connection to the remote,
            // inspect the url property
            else {
              var result = /ws[s]?:\/\/([^:]+):(\d+)/.exec(ws.url);
              if (!result) {
                throw new Error('WebSocket URL must be in the format ws(s)://address:port');
              }
              addr = result[1];
              port = parseInt(result[2], 10);
            }
          } else {
            // create the actual websocket object and connect
            try {
              // runtimeConfig gets set to true if WebSocket runtime configuration is available.
              var runtimeConfig = (Module['websocket'] && ('object' === typeof Module['websocket']));
  
              // The default value is 'ws://' the replace is needed because the compiler replaces '//' comments with '#'
              // comments without checking context, so we'd end up with ws:#, the replace swaps the '#' for '//' again.
              var url = 'ws:#'.replace('#', '//');
  
              if (runtimeConfig) {
                if ('string' === typeof Module['websocket']['url']) {
                  url = Module['websocket']['url']; // Fetch runtime WebSocket URL config.
                }
              }
  
              if (url === 'ws://' || url === 'wss://') { // Is the supplied URL config just a prefix, if so complete it.
                var parts = addr.split('/');
                url = url + parts[0] + ":" + port + "/" + parts.slice(1).join('/');
              }
  
              // Make the WebSocket subprotocol (Sec-WebSocket-Protocol) default to binary if no configuration is set.
              var subProtocols = 'binary'; // The default value is 'binary'
  
              if (runtimeConfig) {
                if ('string' === typeof Module['websocket']['subprotocol']) {
                  subProtocols = Module['websocket']['subprotocol']; // Fetch runtime WebSocket subprotocol config.
                }
              }
  
              // The default WebSocket options
              var opts = undefined;
  
              if (subProtocols !== 'null') {
                // The regex trims the string (removes spaces at the beginning and end, then splits the string by
                // <any space>,<any space> into an Array. Whitespace removal is important for Websockify and ws.
                subProtocols = subProtocols.replace(/^ +| +$/g,"").split(/ *, */);
  
                opts = subProtocols;
              }
  
              // some webservers (azure) does not support subprotocol header
              if (runtimeConfig && null === Module['websocket']['subprotocol']) {
                subProtocols = 'null';
                opts = undefined;
              }
  
              // If node we use the ws library.
              var WebSocketConstructor;
              if (ENVIRONMENT_IS_NODE) {
                WebSocketConstructor = /** @type{(typeof WebSocket)} */(require('ws'));
              } else
              {
                WebSocketConstructor = WebSocket;
              }
              ws = new WebSocketConstructor(url, opts);
              ws.binaryType = 'arraybuffer';
            } catch (e) {
              throw new FS.ErrnoError(23);
            }
          }
  
          var peer = {
            addr,
            port,
            socket: ws,
            dgram_send_queue: []
          };
  
          SOCKFS.websocket_sock_ops.addPeer(sock, peer);
          SOCKFS.websocket_sock_ops.handlePeerEvents(sock, peer);
  
          // if this is a bound dgram socket, send the port number first to allow
          // us to override the ephemeral port reported to us by remotePort on the
          // remote end.
          if (sock.type === 2 && typeof sock.sport != 'undefined') {
            peer.dgram_send_queue.push(new Uint8Array([
                255, 255, 255, 255,
                'p'.charCodeAt(0), 'o'.charCodeAt(0), 'r'.charCodeAt(0), 't'.charCodeAt(0),
                ((sock.sport & 0xff00) >> 8) , (sock.sport & 0xff)
            ]));
          }
  
          return peer;
        },
  getPeer(sock, addr, port) {
          return sock.peers[addr + ':' + port];
        },
  addPeer(sock, peer) {
          sock.peers[peer.addr + ':' + peer.port] = peer;
        },
  removePeer(sock, peer) {
          delete sock.peers[peer.addr + ':' + peer.port];
        },
  handlePeerEvents(sock, peer) {
          var first = true;
  
          var handleOpen = function () {
  
            Module['websocket'].emit('open', sock.stream.fd);
  
            try {
              var queued = peer.dgram_send_queue.shift();
              while (queued) {
                peer.socket.send(queued);
                queued = peer.dgram_send_queue.shift();
              }
            } catch (e) {
              // not much we can do here in the way of proper error handling as we've already
              // lied and said this data was sent. shut it down.
              peer.socket.close();
            }
          };
  
          function handleMessage(data) {
            if (typeof data == 'string') {
              var encoder = new TextEncoder(); // should be utf-8
              data = encoder.encode(data); // make a typed array from the string
            } else {
              assert(data.byteLength !== undefined); // must receive an ArrayBuffer
              if (data.byteLength == 0) {
                // An empty ArrayBuffer will emit a pseudo disconnect event
                // as recv/recvmsg will return zero which indicates that a socket
                // has performed a shutdown although the connection has not been disconnected yet.
                return;
              }
              data = new Uint8Array(data); // make a typed array view on the array buffer
            }
  
            // if this is the port message, override the peer's port with it
            var wasfirst = first;
            first = false;
            if (wasfirst &&
                data.length === 10 &&
                data[0] === 255 && data[1] === 255 && data[2] === 255 && data[3] === 255 &&
                data[4] === 'p'.charCodeAt(0) && data[5] === 'o'.charCodeAt(0) && data[6] === 'r'.charCodeAt(0) && data[7] === 't'.charCodeAt(0)) {
              // update the peer's port and it's key in the peer map
              var newport = ((data[8] << 8) | data[9]);
              SOCKFS.websocket_sock_ops.removePeer(sock, peer);
              peer.port = newport;
              SOCKFS.websocket_sock_ops.addPeer(sock, peer);
              return;
            }
  
            sock.recv_queue.push({ addr: peer.addr, port: peer.port, data: data });
            Module['websocket'].emit('message', sock.stream.fd);
          };
  
          if (ENVIRONMENT_IS_NODE) {
            peer.socket.on('open', handleOpen);
            peer.socket.on('message', function(data, isBinary) {
              if (!isBinary) {
                return;
              }
              handleMessage((new Uint8Array(data)).buffer); // copy from node Buffer -> ArrayBuffer
            });
            peer.socket.on('close', function() {
              Module['websocket'].emit('close', sock.stream.fd);
            });
            peer.socket.on('error', function(error) {
              // Although the ws library may pass errors that may be more descriptive than
              // ECONNREFUSED they are not necessarily the expected error code e.g.
              // ENOTFOUND on getaddrinfo seems to be node.js specific, so using ECONNREFUSED
              // is still probably the most useful thing to do.
              sock.error = 14; // Used in getsockopt for SOL_SOCKET/SO_ERROR test.
              Module['websocket'].emit('error', [sock.stream.fd, sock.error, 'ECONNREFUSED: Connection refused']);
              // don't throw
            });
          } else {
            peer.socket.onopen = handleOpen;
            peer.socket.onclose = function() {
              Module['websocket'].emit('close', sock.stream.fd);
            };
            peer.socket.onmessage = function peer_socket_onmessage(event) {
              handleMessage(event.data);
            };
            peer.socket.onerror = function(error) {
              // The WebSocket spec only allows a 'simple event' to be thrown on error,
              // so we only really know as much as ECONNREFUSED.
              sock.error = 14; // Used in getsockopt for SOL_SOCKET/SO_ERROR test.
              Module['websocket'].emit('error', [sock.stream.fd, sock.error, 'ECONNREFUSED: Connection refused']);
            };
          }
        },
  poll(sock) {
          if (sock.type === 1 && sock.server) {
            // listen sockets should only say they're available for reading
            // if there are pending clients.
            return sock.pending.length ? (64 | 1) : 0;
          }
  
          var mask = 0;
          var dest = sock.type === 1 ?  // we only care about the socket state for connection-based sockets
            SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport) :
            null;
  
          if (sock.recv_queue.length ||
              !dest ||  // connection-less sockets are always ready to read
              (dest && dest.socket.readyState === dest.socket.CLOSING) ||
              (dest && dest.socket.readyState === dest.socket.CLOSED)) {  // let recv return 0 once closed
            mask |= (64 | 1);
          }
  
          if (!dest ||  // connection-less sockets are always ready to write
              (dest && dest.socket.readyState === dest.socket.OPEN)) {
            mask |= 4;
          }
  
          if ((dest && dest.socket.readyState === dest.socket.CLOSING) ||
              (dest && dest.socket.readyState === dest.socket.CLOSED)) {
            mask |= 16;
          }
  
          return mask;
        },
  ioctl(sock, request, arg) {
          switch (request) {
            case 21531:
              var bytes = 0;
              if (sock.recv_queue.length) {
                bytes = sock.recv_queue[0].data.length;
              }
              HEAP32[((arg)>>2)] = bytes;
              return 0;
            default:
              return 28;
          }
        },
  close(sock) {
          // if we've spawned a listen server, close it
          if (sock.server) {
            try {
              sock.server.close();
            } catch (e) {
            }
            sock.server = null;
          }
          // close any peer connections
          var peers = Object.keys(sock.peers);
          for (var i = 0; i < peers.length; i++) {
            var peer = sock.peers[peers[i]];
            try {
              peer.socket.close();
            } catch (e) {
            }
            SOCKFS.websocket_sock_ops.removePeer(sock, peer);
          }
          return 0;
        },
  bind(sock, addr, port) {
          if (typeof sock.saddr != 'undefined' || typeof sock.sport != 'undefined') {
            throw new FS.ErrnoError(28);  // already bound
          }
          sock.saddr = addr;
          sock.sport = port;
          // in order to emulate dgram sockets, we need to launch a listen server when
          // binding on a connection-less socket
          // note: this is only required on the server side
          if (sock.type === 2) {
            // close the existing server if it exists
            if (sock.server) {
              sock.server.close();
              sock.server = null;
            }
            // swallow error operation not supported error that occurs when binding in the
            // browser where this isn't supported
            try {
              sock.sock_ops.listen(sock, 0);
            } catch (e) {
              if (!(e.name === 'ErrnoError')) throw e;
              if (e.errno !== 138) throw e;
            }
          }
        },
  connect(sock, addr, port) {
          if (sock.server) {
            throw new FS.ErrnoError(138);
          }
  
          // TODO autobind
          // if (!sock.addr && sock.type == 2) {
          // }
  
          // early out if we're already connected / in the middle of connecting
          if (typeof sock.daddr != 'undefined' && typeof sock.dport != 'undefined') {
            var dest = SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport);
            if (dest) {
              if (dest.socket.readyState === dest.socket.CONNECTING) {
                throw new FS.ErrnoError(7);
              } else {
                throw new FS.ErrnoError(30);
              }
            }
          }
  
          // add the socket to our peer list and set our
          // destination address / port to match
          var peer = SOCKFS.websocket_sock_ops.createPeer(sock, addr, port);
          sock.daddr = peer.addr;
          sock.dport = peer.port;
  
          // always "fail" in non-blocking mode
          throw new FS.ErrnoError(26);
        },
  listen(sock, backlog) {
          if (!ENVIRONMENT_IS_NODE) {
            throw new FS.ErrnoError(138);
          }
          if (sock.server) {
             throw new FS.ErrnoError(28);  // already listening
          }
          var WebSocketServer = require('ws').Server;
          var host = sock.saddr;
          sock.server = new WebSocketServer({
            host,
            port: sock.sport
            // TODO support backlog
          });
          Module['websocket'].emit('listen', sock.stream.fd); // Send Event with listen fd.
  
          sock.server.on('connection', function(ws) {
            if (sock.type === 1) {
              var newsock = SOCKFS.createSocket(sock.family, sock.type, sock.protocol);
  
              // create a peer on the new socket
              var peer = SOCKFS.websocket_sock_ops.createPeer(newsock, ws);
              newsock.daddr = peer.addr;
              newsock.dport = peer.port;
  
              // push to queue for accept to pick up
              sock.pending.push(newsock);
              Module['websocket'].emit('connection', newsock.stream.fd);
            } else {
              // create a peer on the listen socket so calling sendto
              // with the listen socket and an address will resolve
              // to the correct client
              SOCKFS.websocket_sock_ops.createPeer(sock, ws);
              Module['websocket'].emit('connection', sock.stream.fd);
            }
          });
          sock.server.on('close', function() {
            Module['websocket'].emit('close', sock.stream.fd);
            sock.server = null;
          });
          sock.server.on('error', function(error) {
            // Although the ws library may pass errors that may be more descriptive than
            // ECONNREFUSED they are not necessarily the expected error code e.g.
            // ENOTFOUND on getaddrinfo seems to be node.js specific, so using EHOSTUNREACH
            // is still probably the most useful thing to do. This error shouldn't
            // occur in a well written app as errors should get trapped in the compiled
            // app's own getaddrinfo call.
            sock.error = 23; // Used in getsockopt for SOL_SOCKET/SO_ERROR test.
            Module['websocket'].emit('error', [sock.stream.fd, sock.error, 'EHOSTUNREACH: Host is unreachable']);
            // don't throw
          });
        },
  accept(listensock) {
          if (!listensock.server || !listensock.pending.length) {
            throw new FS.ErrnoError(28);
          }
          var newsock = listensock.pending.shift();
          newsock.stream.flags = listensock.stream.flags;
          return newsock;
        },
  getname(sock, peer) {
          var addr, port;
          if (peer) {
            if (sock.daddr === undefined || sock.dport === undefined) {
              throw new FS.ErrnoError(53);
            }
            addr = sock.daddr;
            port = sock.dport;
          } else {
            // TODO saddr and sport will be set for bind()'d UDP sockets, but what
            // should we be returning for TCP sockets that've been connect()'d?
            addr = sock.saddr || 0;
            port = sock.sport || 0;
          }
          return { addr, port };
        },
  sendmsg(sock, buffer, offset, length, addr, port) {
          if (sock.type === 2) {
            // connection-less sockets will honor the message address,
            // and otherwise fall back to the bound destination address
            if (addr === undefined || port === undefined) {
              addr = sock.daddr;
              port = sock.dport;
            }
            // if there was no address to fall back to, error out
            if (addr === undefined || port === undefined) {
              throw new FS.ErrnoError(17);
            }
          } else {
            // connection-based sockets will only use the bound
            addr = sock.daddr;
            port = sock.dport;
          }
  
          // find the peer for the destination address
          var dest = SOCKFS.websocket_sock_ops.getPeer(sock, addr, port);
  
          // early out if not connected with a connection-based socket
          if (sock.type === 1) {
            if (!dest || dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
              throw new FS.ErrnoError(53);
            } else if (dest.socket.readyState === dest.socket.CONNECTING) {
              throw new FS.ErrnoError(6);
            }
          }
  
          // create a copy of the incoming data to send, as the WebSocket API
          // doesn't work entirely with an ArrayBufferView, it'll just send
          // the entire underlying buffer
          if (ArrayBuffer.isView(buffer)) {
            offset += buffer.byteOffset;
            buffer = buffer.buffer;
          }
  
          var data;
            data = buffer.slice(offset, offset + length);
  
          // if we're emulating a connection-less dgram socket and don't have
          // a cached connection, queue the buffer to send upon connect and
          // lie, saying the data was sent now.
          if (sock.type === 2) {
            if (!dest || dest.socket.readyState !== dest.socket.OPEN) {
              // if we're not connected, open a new connection
              if (!dest || dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
                dest = SOCKFS.websocket_sock_ops.createPeer(sock, addr, port);
              }
              dest.dgram_send_queue.push(data);
              return length;
            }
          }
  
          try {
            // send the actual data
            dest.socket.send(data);
            return length;
          } catch (e) {
            throw new FS.ErrnoError(28);
          }
        },
  recvmsg(sock, length) {
          // http://pubs.opengroup.org/onlinepubs/7908799/xns/recvmsg.html
          if (sock.type === 1 && sock.server) {
            // tcp servers should not be recv()'ing on the listen socket
            throw new FS.ErrnoError(53);
          }
  
          var queued = sock.recv_queue.shift();
          if (!queued) {
            if (sock.type === 1) {
              var dest = SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport);
  
              if (!dest) {
                // if we have a destination address but are not connected, error out
                throw new FS.ErrnoError(53);
              }
              if (dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
                // return null if the socket has closed
                return null;
              }
              // else, our socket is in a valid state but truly has nothing available
              throw new FS.ErrnoError(6);
            }
            throw new FS.ErrnoError(6);
          }
  
          // queued.data will be an ArrayBuffer if it's unadulterated, but if it's
          // requeued TCP data it'll be an ArrayBufferView
          var queuedLength = queued.data.byteLength || queued.data.length;
          var queuedOffset = queued.data.byteOffset || 0;
          var queuedBuffer = queued.data.buffer || queued.data;
          var bytesRead = Math.min(length, queuedLength);
          var res = {
            buffer: new Uint8Array(queuedBuffer, queuedOffset, bytesRead),
            addr: queued.addr,
            port: queued.port
          };
  
          // push back any unread data for TCP connections
          if (sock.type === 1 && bytesRead < queuedLength) {
            var bytesRemaining = queuedLength - bytesRead;
            queued.data = new Uint8Array(queuedBuffer, queuedOffset + bytesRead, bytesRemaining);
            sock.recv_queue.unshift(queued);
          }
  
          return res;
        },
  },
  };
  
  var getSocketFromFD = (fd) => {
      var socket = SOCKFS.getSocket(fd);
      if (!socket) throw new FS.ErrnoError(8);
      return socket;
    };

  
  
  /** @param {boolean=} allowNull */
  var getSocketAddress = (addrp, addrlen, allowNull) => {
      if (allowNull && addrp === 0) return null;
      var info = readSockaddr(addrp, addrlen);
      if (info.errno) throw new FS.ErrnoError(info.errno);
      info.addr = DNS.lookup_addr(info.addr) || info.addr;
      return info;
    };

  function ___syscall_socket(domain, type, protocol) {
  try {
  
      var sock = SOCKFS.createSocket(domain, type, protocol);
      assert(sock.stream.fd < 64); // XXX ? select() assumes socket fd values are in 0..63
      return sock.stream.fd;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return -e.errno;
  }
  }

  
  
  function ___syscall_getsockname(fd, addr, addrlen, d1, d2, d3) {
  try {
  
      var sock = getSocketFromFD(fd);
      // TODO: sock.saddr should never be undefined, see TODO in websocket_sock_ops.getname
      var errno = writeSockaddr(addr, sock.family, DNS.lookup_name(sock.saddr || '0.0.0.0'), sock.sport, addrlen);
      assert(!errno);
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return -e.errno;
  }
  }

  
  
  function ___syscall_getpeername(fd, addr, addrlen, d1, d2, d3) {
  try {
  
      var sock = getSocketFromFD(fd);
      if (!sock.daddr) {
        return -53; // The socket is not connected.
      }
      var errno = writeSockaddr(addr, sock.family, DNS.lookup_name(sock.daddr), sock.dport, addrlen);
      assert(!errno);
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return -e.errno;
  }
  }

  
  function ___syscall_connect(fd, addr, addrlen, d1, d2, d3) {
  try {
  
      var sock = getSocketFromFD(fd);
      var info = getSocketAddress(addr, addrlen);
      sock.sock_ops.connect(sock, info.addr, info.port);
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return -e.errno;
  }
  }

  function ___syscall_shutdown(fd, how) {
  try {
  
      getSocketFromFD(fd);
      return -52; // unsupported feature
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return -e.errno;
  }
  }

  
  
  function ___syscall_accept4(fd, addr, addrlen, flags, d1, d2) {
  try {
  
      var sock = getSocketFromFD(fd);
      var newsock = sock.sock_ops.accept(sock);
      if (addr) {
        var errno = writeSockaddr(addr, newsock.family, DNS.lookup_name(newsock.daddr), newsock.dport, addrlen);
        assert(!errno);
      }
      return newsock.stream.fd;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return -e.errno;
  }
  }

  
  function ___syscall_bind(fd, addr, addrlen, d1, d2, d3) {
  try {
  
      var sock = getSocketFromFD(fd);
      var info = getSocketAddress(addr, addrlen);
      sock.sock_ops.bind(sock, info.addr, info.port);
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return -e.errno;
  }
  }

  function ___syscall_listen(fd, backlog) {
  try {
  
      var sock = getSocketFromFD(fd);
      sock.sock_ops.listen(sock, backlog);
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return -e.errno;
  }
  }

  
  
  function ___syscall_recvfrom(fd, buf, len, flags, addr, addrlen) {
  try {
  
      var sock = getSocketFromFD(fd);
      var msg = sock.sock_ops.recvmsg(sock, len);
      if (!msg) return 0; // socket is closed
      if (addr) {
        var errno = writeSockaddr(addr, sock.family, DNS.lookup_name(msg.addr), msg.port, addrlen);
        assert(!errno);
      }
      HEAPU8.set(msg.buffer, buf);
      return msg.buffer.byteLength;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return -e.errno;
  }
  }

  
  function ___syscall_sendto(fd, message, length, flags, addr, addr_len) {
  try {
  
      var sock = getSocketFromFD(fd);
      var dest = getSocketAddress(addr, addr_len, true);
      if (!dest) {
        // send, no address provided
        return FS.write(sock.stream, HEAP8, message, length);
      }
      // sendto an address
      return sock.sock_ops.sendmsg(sock, HEAP8, message, length, dest.addr, dest.port);
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return -e.errno;
  }
  }

  function ___syscall_getsockopt(fd, level, optname, optval, optlen, d1) {
  try {
  
      var sock = getSocketFromFD(fd);
      // Minimal getsockopt aimed at resolving https://github.com/emscripten-core/emscripten/issues/2211
      // so only supports SOL_SOCKET with SO_ERROR.
      if (level === 1) {
        if (optname === 4) {
          HEAP32[((optval)>>2)] = sock.error;
          HEAP32[((optlen)>>2)] = 4;
          sock.error = null; // Clear the error (The SO_ERROR option obtains and then clears this field).
          return 0;
        }
      }
      return -50; // The option is unknown at the level indicated.
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return -e.errno;
  }
  }

  
  
  function ___syscall_sendmsg(fd, message, flags, d1, d2, d3) {
  try {
  
      var sock = getSocketFromFD(fd);
      var iov = HEAPU32[(((message)+(8))>>2)];
      var num = HEAP32[(((message)+(12))>>2)];
      // read the address and port to send to
      var addr, port;
      var name = HEAPU32[((message)>>2)];
      var namelen = HEAP32[(((message)+(4))>>2)];
      if (name) {
        var info = readSockaddr(name, namelen);
        if (info.errno) return -info.errno;
        port = info.port;
        addr = DNS.lookup_addr(info.addr) || info.addr;
      }
      // concatenate scatter-gather arrays into one message buffer
      var total = 0;
      for (var i = 0; i < num; i++) {
        total += HEAP32[(((iov)+((8 * i) + 4))>>2)];
      }
      var view = new Uint8Array(total);
      var offset = 0;
      for (var i = 0; i < num; i++) {
        var iovbase = HEAPU32[(((iov)+((8 * i) + 0))>>2)];
        var iovlen = HEAP32[(((iov)+((8 * i) + 4))>>2)];
        for (var j = 0; j < iovlen; j++) {
          view[offset++] = HEAP8[(iovbase)+(j)];
        }
      }
      // write the buffer
      return sock.sock_ops.sendmsg(sock, view, 0, total, addr, port);
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return -e.errno;
  }
  }

  
  
  function ___syscall_recvmsg(fd, message, flags, d1, d2, d3) {
  try {
  
      var sock = getSocketFromFD(fd);
      var iov = HEAPU32[(((message)+(8))>>2)];
      var num = HEAP32[(((message)+(12))>>2)];
      // get the total amount of data we can read across all arrays
      var total = 0;
      for (var i = 0; i < num; i++) {
        total += HEAP32[(((iov)+((8 * i) + 4))>>2)];
      }
      // try to read total data
      var msg = sock.sock_ops.recvmsg(sock, total);
      if (!msg) return 0; // socket is closed
  
      // TODO honor flags:
      // MSG_OOB
      // Requests out-of-band data. The significance and semantics of out-of-band data are protocol-specific.
      // MSG_PEEK
      // Peeks at the incoming message.
      // MSG_WAITALL
      // Requests that the function block until the full amount of data requested can be returned. The function may return a smaller amount of data if a signal is caught, if the connection is terminated, if MSG_PEEK was specified, or if an error is pending for the socket.
  
      // write the source address out
      var name = HEAPU32[((message)>>2)];
      if (name) {
        var errno = writeSockaddr(name, sock.family, DNS.lookup_name(msg.addr), msg.port);
        assert(!errno);
      }
      // write the buffer out to the scatter-gather arrays
      var bytesRead = 0;
      var bytesRemaining = msg.buffer.byteLength;
      for (var i = 0; bytesRemaining > 0 && i < num; i++) {
        var iovbase = HEAPU32[(((iov)+((8 * i) + 0))>>2)];
        var iovlen = HEAP32[(((iov)+((8 * i) + 4))>>2)];
        if (!iovlen) {
          continue;
        }
        var length = Math.min(iovlen, bytesRemaining);
        var buf = msg.buffer.subarray(bytesRead, bytesRead + length);
        HEAPU8.set(buf, iovbase + bytesRead);
        bytesRead += length;
        bytesRemaining -= length;
      }
  
      // TODO set msghdr.msg_flags
      // MSG_EOR
      // End of record was received (if supported by the protocol).
      // MSG_OOB
      // Out-of-band data was received.
      // MSG_TRUNC
      // Normal data was truncated.
      // MSG_CTRUNC
  
      return bytesRead;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return -e.errno;
  }
  }

  function ___syscall_fchdir(fd) {
  try {
  
      var stream = SYSCALLS.getStreamFromFD(fd);
      FS.chdir(stream.path);
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return -e.errno;
  }
  }

  function ___syscall__newselect(nfds, readfds, writefds, exceptfds, timeout) {
  try {
  
      // readfds are supported,
      // writefds checks socket open status
      // exceptfds are supported, although on web, such exceptional conditions never arise in web sockets
      //                          and so the exceptfds list will always return empty.
      // timeout is supported, although on SOCKFS and PIPEFS these are ignored and always treated as 0 - fully async
      assert(nfds <= 64, 'nfds must be less than or equal to 64');  // fd sets have 64 bits // TODO: this could be 1024 based on current musl headers
  
      var total = 0;
  
      var srcReadLow = (readfds ? HEAP32[((readfds)>>2)] : 0),
          srcReadHigh = (readfds ? HEAP32[(((readfds)+(4))>>2)] : 0);
      var srcWriteLow = (writefds ? HEAP32[((writefds)>>2)] : 0),
          srcWriteHigh = (writefds ? HEAP32[(((writefds)+(4))>>2)] : 0);
      var srcExceptLow = (exceptfds ? HEAP32[((exceptfds)>>2)] : 0),
          srcExceptHigh = (exceptfds ? HEAP32[(((exceptfds)+(4))>>2)] : 0);
  
      var dstReadLow = 0,
          dstReadHigh = 0;
      var dstWriteLow = 0,
          dstWriteHigh = 0;
      var dstExceptLow = 0,
          dstExceptHigh = 0;
  
      var allLow = (readfds ? HEAP32[((readfds)>>2)] : 0) |
                   (writefds ? HEAP32[((writefds)>>2)] : 0) |
                   (exceptfds ? HEAP32[((exceptfds)>>2)] : 0);
      var allHigh = (readfds ? HEAP32[(((readfds)+(4))>>2)] : 0) |
                    (writefds ? HEAP32[(((writefds)+(4))>>2)] : 0) |
                    (exceptfds ? HEAP32[(((exceptfds)+(4))>>2)] : 0);
  
      var check = function(fd, low, high, val) {
        return (fd < 32 ? (low & val) : (high & val));
      };
  
      for (var fd = 0; fd < nfds; fd++) {
        var mask = 1 << (fd % 32);
        if (!(check(fd, allLow, allHigh, mask))) {
          continue;  // index isn't in the set
        }
  
        var stream = SYSCALLS.getStreamFromFD(fd);
  
        var flags = SYSCALLS.DEFAULT_POLLMASK;
  
        if (stream.stream_ops.poll) {
          var timeoutInMillis = -1;
          if (timeout) {
            // select(2) is declared to accept "struct timeval { time_t tv_sec; suseconds_t tv_usec; }".
            // However, musl passes the two values to the syscall as an array of long values.
            // Note that sizeof(time_t) != sizeof(long) in wasm32. The former is 8, while the latter is 4.
            // This means using "C_STRUCTS.timeval.tv_usec" leads to a wrong offset.
            // So, instead, we use POINTER_SIZE.
            var tv_sec = (readfds ? HEAP32[((timeout)>>2)] : 0),
                tv_usec = (readfds ? HEAP32[(((timeout)+(4))>>2)] : 0);
            timeoutInMillis = (tv_sec + tv_usec / 1000000) * 1000;
          }
          flags = stream.stream_ops.poll(stream, timeoutInMillis);
        }
  
        if ((flags & 1) && check(fd, srcReadLow, srcReadHigh, mask)) {
          fd < 32 ? (dstReadLow = dstReadLow | mask) : (dstReadHigh = dstReadHigh | mask);
          total++;
        }
        if ((flags & 4) && check(fd, srcWriteLow, srcWriteHigh, mask)) {
          fd < 32 ? (dstWriteLow = dstWriteLow | mask) : (dstWriteHigh = dstWriteHigh | mask);
          total++;
        }
        if ((flags & 2) && check(fd, srcExceptLow, srcExceptHigh, mask)) {
          fd < 32 ? (dstExceptLow = dstExceptLow | mask) : (dstExceptHigh = dstExceptHigh | mask);
          total++;
        }
      }
  
      if (readfds) {
        HEAP32[((readfds)>>2)] = dstReadLow;
        HEAP32[(((readfds)+(4))>>2)] = dstReadHigh;
      }
      if (writefds) {
        HEAP32[((writefds)>>2)] = dstWriteLow;
        HEAP32[(((writefds)+(4))>>2)] = dstWriteHigh;
      }
      if (exceptfds) {
        HEAP32[((exceptfds)>>2)] = dstExceptLow;
        HEAP32[(((exceptfds)+(4))>>2)] = dstExceptHigh;
      }
  
      return total;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return -e.errno;
  }
  }

  
  function __msync_js(addr,len,prot,flags,fd,offset_low, offset_high) {
    var offset = convertI32PairToI53Checked(offset_low, offset_high);
  
    
  try {
  
      if (isNaN(offset)) return 61;
      SYSCALLS.doMsync(addr, SYSCALLS.getStreamFromFD(fd), len, flags, offset);
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return -e.errno;
  }
  ;
  }

  function ___syscall_fdatasync(fd) {
  try {
  
      var stream = SYSCALLS.getStreamFromFD(fd);
      return 0; // we can't do anything synchronously; the in-memory FS is already synced to
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return -e.errno;
  }
  }

  function ___syscall_poll(fds, nfds, timeout) {
  try {
  
      var nonzero = 0;
      for (var i = 0; i < nfds; i++) {
        var pollfd = fds + 8 * i;
        var fd = HEAP32[((pollfd)>>2)];
        var events = HEAP16[(((pollfd)+(4))>>1)];
        var mask = 32;
        var stream = FS.getStream(fd);
        if (stream) {
          mask = SYSCALLS.DEFAULT_POLLMASK;
          if (stream.stream_ops.poll) {
            mask = stream.stream_ops.poll(stream, -1);
          }
        }
        mask &= events | 8 | 16;
        if (mask) nonzero++;
        HEAP16[(((pollfd)+(6))>>1)] = mask;
      }
      return nonzero;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return -e.errno;
  }
  }

  
  function ___syscall_getcwd(buf, size) {
  try {
  
      if (size === 0) return -28;
      var cwd = FS.cwd();
      var cwdLengthInBytes = lengthBytesUTF8(cwd) + 1;
      if (size < cwdLengthInBytes) return -68;
      stringToUTF8(cwd, buf, size);
      return cwdLengthInBytes;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return -e.errno;
  }
  }

  
  function ___syscall_truncate64(path,length_low, length_high) {
    var length = convertI32PairToI53Checked(length_low, length_high);
  
    
  try {
  
      if (isNaN(length)) return 61;
      path = SYSCALLS.getStr(path);
      FS.truncate(path, length);
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return -e.errno;
  }
  ;
  }

  function ___syscall_ftruncate64(fd,length_low, length_high) {
    var length = convertI32PairToI53Checked(length_low, length_high);
  
    
  try {
  
      if (isNaN(length)) return 61;
      FS.ftruncate(fd, length);
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return -e.errno;
  }
  ;
  }

  function ___syscall_stat64(path, buf) {
  try {
  
      path = SYSCALLS.getStr(path);
      return SYSCALLS.doStat(FS.stat, path, buf);
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return -e.errno;
  }
  }

  function ___syscall_lstat64(path, buf) {
  try {
  
      path = SYSCALLS.getStr(path);
      return SYSCALLS.doStat(FS.lstat, path, buf);
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return -e.errno;
  }
  }

  function ___syscall_fstat64(fd, buf) {
  try {
  
      var stream = SYSCALLS.getStreamFromFD(fd);
      return SYSCALLS.doStat(FS.stat, stream.path, buf);
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return -e.errno;
  }
  }

  function ___syscall_fchown32(fd, owner, group) {
  try {
  
      FS.fchown(fd, owner, group);
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return -e.errno;
  }
  }

  
  function ___syscall_getdents64(fd, dirp, count) {
  try {
  
      var stream = SYSCALLS.getStreamFromFD(fd)
      stream.getdents ||= FS.readdir(stream.path);
  
      var struct_size = 280;
      var pos = 0;
      var off = FS.llseek(stream, 0, 1);
  
      var idx = Math.floor(off / struct_size);
  
      while (idx < stream.getdents.length && pos + struct_size <= count) {
        var id;
        var type;
        var name = stream.getdents[idx];
        if (name === '.') {
          id = stream.node.id;
          type = 4; // DT_DIR
        }
        else if (name === '..') {
          var lookup = FS.lookupPath(stream.path, { parent: true });
          id = lookup.node.id;
          type = 4; // DT_DIR
        }
        else {
          var child = FS.lookupNode(stream.node, name);
          id = child.id;
          type = FS.isChrdev(child.mode) ? 2 :  // DT_CHR, character device.
                 FS.isDir(child.mode) ? 4 :     // DT_DIR, directory.
                 FS.isLink(child.mode) ? 10 :   // DT_LNK, symbolic link.
                 8;                             // DT_REG, regular file.
        }
        assert(id);
        (tempI64 = [id>>>0,(tempDouble = id,(+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? (+(Math.floor((tempDouble)/4294967296.0)))>>>0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)], HEAP32[((dirp + pos)>>2)] = tempI64[0],HEAP32[(((dirp + pos)+(4))>>2)] = tempI64[1]);
        (tempI64 = [(idx + 1) * struct_size>>>0,(tempDouble = (idx + 1) * struct_size,(+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? (+(Math.floor((tempDouble)/4294967296.0)))>>>0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)], HEAP32[(((dirp + pos)+(8))>>2)] = tempI64[0],HEAP32[(((dirp + pos)+(12))>>2)] = tempI64[1]);
        HEAP16[(((dirp + pos)+(16))>>1)] = 280;
        HEAP8[(dirp + pos)+(18)] = type;
        stringToUTF8(name, dirp + pos + 19, 256);
        pos += struct_size;
        idx += 1;
      }
      FS.llseek(stream, idx * struct_size, 0);
      return pos;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return -e.errno;
  }
  }

  
  
  function ___syscall_fcntl64(fd, cmd, varargs) {
  SYSCALLS.varargs = varargs;
  try {
  
      var stream = SYSCALLS.getStreamFromFD(fd);
      switch (cmd) {
        case 0: {
          var arg = syscallGetVarargI();
          if (arg < 0) {
            return -28;
          }
          while (FS.streams[arg]) {
            arg++;
          }
          var newStream;
          newStream = FS.dupStream(stream, arg);
          return newStream.fd;
        }
        case 1:
        case 2:
          return 0;  // FD_CLOEXEC makes no sense for a single process.
        case 3:
          return stream.flags;
        case 4: {
          var arg = syscallGetVarargI();
          stream.flags |= arg;
          return 0;
        }
        case 12: {
          var arg = syscallGetVarargP();
          var offset = 0;
          // We're always unlocked.
          HEAP16[(((arg)+(offset))>>1)] = 2;
          return 0;
        }
        case 13:
        case 14:
          return 0; // Pretend that the locking is successful.
      }
      return -28;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return -e.errno;
  }
  }

  function ___syscall_statfs64(path, size, buf) {
  try {
  
      path = SYSCALLS.getStr(path);
      assert(size === 64);
      // NOTE: None of the constants here are true. We're just returning safe and
      //       sane values.
      HEAP32[(((buf)+(4))>>2)] = 4096;
      HEAP32[(((buf)+(40))>>2)] = 4096;
      HEAP32[(((buf)+(8))>>2)] = 1000000;
      HEAP32[(((buf)+(12))>>2)] = 500000;
      HEAP32[(((buf)+(16))>>2)] = 500000;
      HEAP32[(((buf)+(20))>>2)] = FS.nextInode;
      HEAP32[(((buf)+(24))>>2)] = 1000000;
      HEAP32[(((buf)+(28))>>2)] = 42;
      HEAP32[(((buf)+(44))>>2)] = 2;  // ST_NOSUID
      HEAP32[(((buf)+(36))>>2)] = 255;
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return -e.errno;
  }
  }

  
  function ___syscall_fstatfs64(fd, size, buf) {
  try {
  
      var stream = SYSCALLS.getStreamFromFD(fd);
      return ___syscall_statfs64(0, size, buf);
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return -e.errno;
  }
  }

  var ___syscall_fadvise64 = (fd, offset, len, advice) => {
      return 0; // your advice is important to us (but we can't use it)
    };

  
  function ___syscall_openat(dirfd, path, flags, varargs) {
  SYSCALLS.varargs = varargs;
  try {
  
      path = SYSCALLS.getStr(path);
      path = SYSCALLS.calculateAt(dirfd, path);
      var mode = varargs ? syscallGetVarargI() : 0;
      return FS.open(path, flags, mode).fd;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return -e.errno;
  }
  }

  function ___syscall_mkdirat(dirfd, path, mode) {
  try {
  
      path = SYSCALLS.getStr(path);
      path = SYSCALLS.calculateAt(dirfd, path);
      // remove a trailing slash, if one - /a/b/ has basename of '', but
      // we want to create b in the context of this function
      path = PATH.normalize(path);
      if (path[path.length-1] === '/') path = path.substr(0, path.length-1);
      FS.mkdir(path, mode, 0);
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return -e.errno;
  }
  }

  function ___syscall_mknodat(dirfd, path, mode, dev) {
  try {
  
      path = SYSCALLS.getStr(path);
      path = SYSCALLS.calculateAt(dirfd, path);
      // we don't want this in the JS API as it uses mknod to create all nodes.
      switch (mode & 61440) {
        case 32768:
        case 8192:
        case 24576:
        case 4096:
        case 49152:
          break;
        default: return -28;
      }
      FS.mknod(path, mode, dev);
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return -e.errno;
  }
  }

  function ___syscall_fchownat(dirfd, path, owner, group, flags) {
  try {
  
      path = SYSCALLS.getStr(path);
      var nofollow = flags & 256;
      flags = flags & (~256);
      assert(flags === 0);
      path = SYSCALLS.calculateAt(dirfd, path);
      (nofollow ? FS.lchown : FS.chown)(path, owner, group);
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return -e.errno;
  }
  }

  function ___syscall_newfstatat(dirfd, path, buf, flags) {
  try {
  
      path = SYSCALLS.getStr(path);
      var nofollow = flags & 256;
      var allowEmpty = flags & 4096;
      flags = flags & (~6400);
      assert(!flags, `unknown flags in __syscall_newfstatat: ${flags}`);
      path = SYSCALLS.calculateAt(dirfd, path, allowEmpty);
      return SYSCALLS.doStat(nofollow ? FS.lstat : FS.stat, path, buf);
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return -e.errno;
  }
  }

  function ___syscall_unlinkat(dirfd, path, flags) {
  try {
  
      path = SYSCALLS.getStr(path);
      path = SYSCALLS.calculateAt(dirfd, path);
      if (flags === 0) {
        FS.unlink(path);
      } else if (flags === 512) {
        FS.rmdir(path);
      } else {
        abort('Invalid flags passed to unlinkat');
      }
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return -e.errno;
  }
  }

  function ___syscall_renameat(olddirfd, oldpath, newdirfd, newpath) {
  try {
  
      oldpath = SYSCALLS.getStr(oldpath);
      newpath = SYSCALLS.getStr(newpath);
      oldpath = SYSCALLS.calculateAt(olddirfd, oldpath);
      newpath = SYSCALLS.calculateAt(newdirfd, newpath);
      FS.rename(oldpath, newpath);
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return -e.errno;
  }
  }

  function ___syscall_symlinkat(target, newdirfd, linkpath) {
  try {
  
      linkpath = SYSCALLS.calculateAt(newdirfd, linkpath);
      FS.symlink(target, linkpath);
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return -e.errno;
  }
  }

  
  
  function ___syscall_readlinkat(dirfd, path, buf, bufsize) {
  try {
  
      path = SYSCALLS.getStr(path);
      path = SYSCALLS.calculateAt(dirfd, path);
      if (bufsize <= 0) return -28;
      var ret = FS.readlink(path);
  
      var len = Math.min(bufsize, lengthBytesUTF8(ret));
      var endChar = HEAP8[buf+len];
      stringToUTF8(ret, buf, bufsize+1);
      // readlink is one of the rare functions that write out a C string, but does never append a null to the output buffer(!)
      // stringToUTF8() always appends a null byte, so restore the character under the null byte after the write.
      HEAP8[buf+len] = endChar;
      return len;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return -e.errno;
  }
  }

  function ___syscall_fchmodat2(dirfd, path, mode, flags) {
  try {
  
      var nofollow = flags & 256;
      path = SYSCALLS.getStr(path);
      path = SYSCALLS.calculateAt(dirfd, path);
      FS.chmod(path, mode, nofollow);
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return -e.errno;
  }
  }

  function ___syscall_faccessat(dirfd, path, amode, flags) {
  try {
  
      path = SYSCALLS.getStr(path);
      assert(flags === 0);
      path = SYSCALLS.calculateAt(dirfd, path);
      if (amode & ~7) {
        // need a valid mode
        return -28;
      }
      var lookup = FS.lookupPath(path, { follow: true });
      var node = lookup.node;
      if (!node) {
        return -44;
      }
      var perms = '';
      if (amode & 4) perms += 'r';
      if (amode & 2) perms += 'w';
      if (amode & 1) perms += 'x';
      if (perms /* otherwise, they've just passed F_OK */ && FS.nodePermissions(node, perms)) {
        return -2;
      }
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return -e.errno;
  }
  }

  
  function ___syscall_utimensat(dirfd, path, times, flags) {
  try {
  
      path = SYSCALLS.getStr(path);
      assert(flags === 0);
      path = SYSCALLS.calculateAt(dirfd, path, true);
      if (!times) {
        var atime = Date.now();
        var mtime = atime;
      } else {
        var seconds = readI53FromI64(times);
        var nanoseconds = HEAP32[(((times)+(8))>>2)];
        atime = (seconds*1000) + (nanoseconds/(1000*1000));
        times += 16;
        seconds = readI53FromI64(times);
        nanoseconds = HEAP32[(((times)+(8))>>2)];
        mtime = (seconds*1000) + (nanoseconds/(1000*1000));
      }
      FS.utime(path, atime, mtime);
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return -e.errno;
  }
  }

  
  function ___syscall_fallocate(fd,mode,offset_low, offset_high,len_low, len_high) {
    var offset = convertI32PairToI53Checked(offset_low, offset_high);
    var len = convertI32PairToI53Checked(len_low, len_high);
  
    
  try {
  
      if (isNaN(offset)) return 61;
      var stream = SYSCALLS.getStreamFromFD(fd)
      assert(mode === 0);
      FS.allocate(stream, offset, len);
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return -e.errno;
  }
  ;
  }

  function ___syscall_dup3(fd, newfd, flags) {
  try {
  
      var old = SYSCALLS.getStreamFromFD(fd);
      assert(!flags);
      if (old.fd === newfd) return -28;
      // Check newfd is within range of valid open file descriptors.
      if (newfd < 0 || newfd >= FS.MAX_OPEN_FDS) return -8;
      var existing = FS.getStream(newfd);
      if (existing) FS.close(existing);
      return FS.dupStream(old, newfd).fd;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return -e.errno;
  }
  }









  var FS_createPath = FS.createPath;

  var FS_createDevice = FS.createDevice;

  var FS_readFile = FS.readFile;




  var FS_createLazyFile = FS.createLazyFile;





  
  
  var _setNetworkCallback = (event, userData, callback) => {
      function _callback(data) {
        try {
          if (event === 'error') {
            var sp = stackSave();
            var msg = stringToUTF8OnStack(data[2]);
            ((a1, a2, a3, a4) => dynCall_viiii(callback, a1, a2, a3, a4))(data[0], data[1], msg, userData);
            stackRestore(sp);
          } else {
            ((a1, a2) => dynCall_vii(callback, a1, a2))(data, userData);
          }
        } catch (e) {
          if (!(e instanceof ExitStatus)) {
            if (e && typeof e == 'object' && e.stack) err('exception thrown: ' + [e, e.stack]);
            throw e;
          }
        }
      };
  
      // FIXME(sbc): This has no corresponding Pop so will currently keep the
      // runtime alive indefinitely.
      
      Module['websocket']['on'](event, callback ? _callback : null);
    };

  var _emscripten_set_socket_error_callback = (userData, callback) => {
      _setNetworkCallback('error', userData, callback);
    };

  var _emscripten_set_socket_open_callback = (userData, callback) => {
      _setNetworkCallback('open', userData, callback);
    };

  var _emscripten_set_socket_listen_callback = (userData, callback) => {
      _setNetworkCallback('listen', userData, callback);
    };

  var _emscripten_set_socket_connection_callback = (userData, callback) => {
      _setNetworkCallback('connection', userData, callback);
    };

  var _emscripten_set_socket_message_callback = (userData, callback) => {
      _setNetworkCallback('message', userData, callback);
    };

  var _emscripten_set_socket_close_callback = (userData, callback) => {
      _setNetworkCallback('close', userData, callback);
    };

  var webgl_enable_ANGLE_instanced_arrays = (ctx) => {
      // Extension available in WebGL 1 from Firefox 26 and Google Chrome 30 onwards. Core feature in WebGL 2.
      var ext = ctx.getExtension('ANGLE_instanced_arrays');
      if (ext) {
        ctx['vertexAttribDivisor'] = (index, divisor) => ext['vertexAttribDivisorANGLE'](index, divisor);
        ctx['drawArraysInstanced'] = (mode, first, count, primcount) => ext['drawArraysInstancedANGLE'](mode, first, count, primcount);
        ctx['drawElementsInstanced'] = (mode, count, type, indices, primcount) => ext['drawElementsInstancedANGLE'](mode, count, type, indices, primcount);
        return 1;
      }
    };
  
  var webgl_enable_OES_vertex_array_object = (ctx) => {
      // Extension available in WebGL 1 from Firefox 25 and WebKit 536.28/desktop Safari 6.0.3 onwards. Core feature in WebGL 2.
      var ext = ctx.getExtension('OES_vertex_array_object');
      if (ext) {
        ctx['createVertexArray'] = () => ext['createVertexArrayOES']();
        ctx['deleteVertexArray'] = (vao) => ext['deleteVertexArrayOES'](vao);
        ctx['bindVertexArray'] = (vao) => ext['bindVertexArrayOES'](vao);
        ctx['isVertexArray'] = (vao) => ext['isVertexArrayOES'](vao);
        return 1;
      }
    };
  
  var webgl_enable_WEBGL_draw_buffers = (ctx) => {
      // Extension available in WebGL 1 from Firefox 28 onwards. Core feature in WebGL 2.
      var ext = ctx.getExtension('WEBGL_draw_buffers');
      if (ext) {
        ctx['drawBuffers'] = (n, bufs) => ext['drawBuffersWEBGL'](n, bufs);
        return 1;
      }
    };
  
  var webgl_enable_WEBGL_multi_draw = (ctx) => {
      // Closure is expected to be allowed to minify the '.multiDrawWebgl' property, so not accessing it quoted.
      return !!(ctx.multiDrawWebgl = ctx.getExtension('WEBGL_multi_draw'));
    };
  
  var getEmscriptenSupportedExtensions = (ctx) => {
      // Restrict the list of advertised extensions to those that we actually
      // support.
      var supportedExtensions = [
        // WebGL 1 extensions
        'ANGLE_instanced_arrays',
        'EXT_blend_minmax',
        'EXT_disjoint_timer_query',
        'EXT_frag_depth',
        'EXT_shader_texture_lod',
        'EXT_sRGB',
        'OES_element_index_uint',
        'OES_fbo_render_mipmap',
        'OES_standard_derivatives',
        'OES_texture_float',
        'OES_texture_half_float',
        'OES_texture_half_float_linear',
        'OES_vertex_array_object',
        'WEBGL_color_buffer_float',
        'WEBGL_depth_texture',
        'WEBGL_draw_buffers',
        // WebGL 1 and WebGL 2 extensions
        'EXT_color_buffer_half_float',
        'EXT_depth_clamp',
        'EXT_float_blend',
        'EXT_texture_compression_bptc',
        'EXT_texture_compression_rgtc',
        'EXT_texture_filter_anisotropic',
        'KHR_parallel_shader_compile',
        'OES_texture_float_linear',
        'WEBGL_blend_func_extended',
        'WEBGL_compressed_texture_astc',
        'WEBGL_compressed_texture_etc',
        'WEBGL_compressed_texture_etc1',
        'WEBGL_compressed_texture_s3tc',
        'WEBGL_compressed_texture_s3tc_srgb',
        'WEBGL_debug_renderer_info',
        'WEBGL_debug_shaders',
        'WEBGL_lose_context',
        'WEBGL_multi_draw',
      ];
      // .getSupportedExtensions() can return null if context is lost, so coerce to empty array.
      return (ctx.getSupportedExtensions() || []).filter(ext => supportedExtensions.includes(ext));
    };
  
  
  var GL = {
  counter:1,
  buffers:[],
  programs:[],
  framebuffers:[],
  renderbuffers:[],
  textures:[],
  shaders:[],
  vaos:[],
  contexts:[],
  offscreenCanvases:{
  },
  queries:[],
  stringCache:{
  },
  unpackAlignment:4,
  unpackRowLength:0,
  recordError:(errorCode) => {
        if (!GL.lastError) {
          GL.lastError = errorCode;
        }
      },
  getNewId:(table) => {
        var ret = GL.counter++;
        for (var i = table.length; i < ret; i++) {
          table[i] = null;
        }
        return ret;
      },
  genObject:(n, buffers, createFunction, objectTable
        ) => {
        for (var i = 0; i < n; i++) {
          var buffer = GLctx[createFunction]();
          var id = buffer && GL.getNewId(objectTable);
          if (buffer) {
            buffer.name = id;
            objectTable[id] = buffer;
          } else {
            GL.recordError(0x502 /* GL_INVALID_OPERATION */);
          }
          HEAP32[(((buffers)+(i*4))>>2)] = id;
        }
      },
  getSource:(shader, count, string, length) => {
        var source = '';
        for (var i = 0; i < count; ++i) {
          var len = length ? HEAPU32[(((length)+(i*4))>>2)] : undefined;
          source += UTF8ToString(HEAPU32[(((string)+(i*4))>>2)], len);
        }
        return source;
      },
  createContext:(/** @type {HTMLCanvasElement} */ canvas, webGLContextAttributes) => {
  
        // BUG: Workaround Safari WebGL issue: After successfully acquiring WebGL
        // context on a canvas, calling .getContext() will always return that
        // context independent of which 'webgl' or 'webgl2'
        // context version was passed. See:
        //   https://bugs.webkit.org/show_bug.cgi?id=222758
        // and:
        //   https://github.com/emscripten-core/emscripten/issues/13295.
        // TODO: Once the bug is fixed and shipped in Safari, adjust the Safari
        // version field in above check.
        if (!canvas.getContextSafariWebGL2Fixed) {
          canvas.getContextSafariWebGL2Fixed = canvas.getContext;
          /** @type {function(this:HTMLCanvasElement, string, (Object|null)=): (Object|null)} */
          function fixedGetContext(ver, attrs) {
            var gl = canvas.getContextSafariWebGL2Fixed(ver, attrs);
            return ((ver == 'webgl') == (gl instanceof WebGLRenderingContext)) ? gl : null;
          }
          canvas.getContext = fixedGetContext;
        }
  
        var ctx =
          (canvas.getContext("webgl", webGLContextAttributes)
            // https://caniuse.com/#feat=webgl
            );
  
        if (!ctx) return 0;
  
        var handle = GL.registerContext(ctx, webGLContextAttributes);
  
        return handle;
      },
  registerContext:(ctx, webGLContextAttributes) => {
        // without pthreads a context is just an integer ID
        var handle = GL.getNewId(GL.contexts);
  
        var context = {
          handle,
          attributes: webGLContextAttributes,
          version: webGLContextAttributes.majorVersion,
          GLctx: ctx
        };
  
        // Store the created context object so that we can access the context
        // given a canvas without having to pass the parameters again.
        if (ctx.canvas) ctx.canvas.GLctxObject = context;
        GL.contexts[handle] = context;
        if (typeof webGLContextAttributes.enableExtensionsByDefault == 'undefined' || webGLContextAttributes.enableExtensionsByDefault) {
          GL.initExtensions(context);
        }
  
        return handle;
      },
  makeContextCurrent:(contextHandle) => {
  
        // Active Emscripten GL layer context object.
        GL.currentContext = GL.contexts[contextHandle];
        // Active WebGL context object.
        Module.ctx = GLctx = GL.currentContext?.GLctx;
        return !(contextHandle && !GLctx);
      },
  getContext:(contextHandle) => {
        return GL.contexts[contextHandle];
      },
  deleteContext:(contextHandle) => {
        if (GL.currentContext === GL.contexts[contextHandle]) {
          GL.currentContext = null;
        }
        if (typeof JSEvents == 'object') {
          // Release all JS event handlers on the DOM element that the GL context is
          // associated with since the context is now deleted.
          JSEvents.removeAllHandlersOnTarget(GL.contexts[contextHandle].GLctx.canvas);
        }
        // Make sure the canvas object no longer refers to the context object so
        // there are no GC surprises.
        if (GL.contexts[contextHandle] && GL.contexts[contextHandle].GLctx.canvas) {
          GL.contexts[contextHandle].GLctx.canvas.GLctxObject = undefined;
        }
        GL.contexts[contextHandle] = null;
      },
  initExtensions:(context) => {
        // If this function is called without a specific context object, init the
        // extensions of the currently active context.
        context ||= GL.currentContext;
  
        if (context.initExtensionsDone) return;
        context.initExtensionsDone = true;
  
        var GLctx = context.GLctx;
  
        // Detect the presence of a few extensions manually, ction GL interop
        // layer itself will need to know if they exist.
  
        // Extensions that are only available in WebGL 1 (the calls will be no-ops
        // if called on a WebGL 2 context active)
        webgl_enable_ANGLE_instanced_arrays(GLctx);
        webgl_enable_OES_vertex_array_object(GLctx);
        webgl_enable_WEBGL_draw_buffers(GLctx);
  
        {
          GLctx.disjointTimerQueryExt = GLctx.getExtension("EXT_disjoint_timer_query");
        }
  
        webgl_enable_WEBGL_multi_draw(GLctx);
  
        getEmscriptenSupportedExtensions(GLctx).forEach((ext) => {
          // WEBGL_lose_context, WEBGL_debug_renderer_info and WEBGL_debug_shaders
          // are not enabled by default.
          if (!ext.includes('lose_context') && !ext.includes('debug')) {
            // Call .getExtension() to enable that extension permanently.
            GLctx.getExtension(ext);
          }
        });
      },
  };
  var tempFixedLengthArray = [];

  var miniTempWebGLFloatBuffers = [];

  var miniTempWebGLIntBuffers = [];

  var heapObjectForWebGLType = (type) => {
      // Micro-optimization for size: Subtract lowest GL enum number (0x1400/* GL_BYTE */) from type to compare
      // smaller values for the heap, for shorter generated code size.
      // Also the type HEAPU16 is not tested for explicitly, but any unrecognized type will return out HEAPU16.
      // (since most types are HEAPU16)
      type -= 0x1400;
  
      if (type == 1) return HEAPU8;
  
      if (type == 4) return HEAP32;
  
      if (type == 6) return HEAPF32;
  
      if (type == 5
        || type == 28922
        )
        return HEAPU32;
  
      return HEAPU16;
    };

  var toTypedArrayIndex = (pointer, heap) =>
      pointer >>> (31 - Math.clz32(heap.BYTES_PER_ELEMENT));


  
  var _emscripten_webgl_enable_ANGLE_instanced_arrays = (ctx) => webgl_enable_ANGLE_instanced_arrays(GL.contexts[ctx].GLctx);


  
  var _emscripten_webgl_enable_OES_vertex_array_object = (ctx) => webgl_enable_OES_vertex_array_object(GL.contexts[ctx].GLctx);


  
  var _emscripten_webgl_enable_WEBGL_draw_buffers = (ctx) => webgl_enable_WEBGL_draw_buffers(GL.contexts[ctx].GLctx);


  
  var _emscripten_webgl_enable_WEBGL_multi_draw = (ctx) => webgl_enable_WEBGL_multi_draw(GL.contexts[ctx].GLctx);



  
  var webglGetExtensions = function $webglGetExtensions() {
      var exts = getEmscriptenSupportedExtensions(GLctx);
      exts = exts.concat(exts.map((e) => "GL_" + e));
      return exts;
    };

  var _glPixelStorei = (pname, param) => {
      if (pname == 3317) {
        GL.unpackAlignment = param;
      } else if (pname == 3314) {
        GL.unpackRowLength = param;
      }
      GLctx.pixelStorei(pname, param);
    };

  
  
  var _glGetString = (name_) => {
      var ret = GL.stringCache[name_];
      if (!ret) {
        switch (name_) {
          case 0x1F03 /* GL_EXTENSIONS */:
            ret = stringToNewUTF8(webglGetExtensions().join(' '));
            break;
          case 0x1F00 /* GL_VENDOR */:
          case 0x1F01 /* GL_RENDERER */:
          case 0x9245 /* UNMASKED_VENDOR_WEBGL */:
          case 0x9246 /* UNMASKED_RENDERER_WEBGL */:
            var s = GLctx.getParameter(name_);
            if (!s) {
              GL.recordError(0x500/*GL_INVALID_ENUM*/);
            }
            ret = s ? stringToNewUTF8(s) : 0;
            break;
  
          case 0x1F02 /* GL_VERSION */:
            var glVersion = GLctx.getParameter(0x1F02 /*GL_VERSION*/);
            // return GLES version string corresponding to the version of the WebGL context
            {
              glVersion = `OpenGL ES 2.0 (${glVersion})`;
            }
            ret = stringToNewUTF8(glVersion);
            break;
          case 0x8B8C /* GL_SHADING_LANGUAGE_VERSION */:
            var glslVersion = GLctx.getParameter(0x8B8C /*GL_SHADING_LANGUAGE_VERSION*/);
            // extract the version number 'N.M' from the string 'WebGL GLSL ES N.M ...'
            var ver_re = /^WebGL GLSL ES ([0-9]\.[0-9][0-9]?)(?:$| .*)/;
            var ver_num = glslVersion.match(ver_re);
            if (ver_num !== null) {
              if (ver_num[1].length == 3) ver_num[1] = ver_num[1] + '0'; // ensure minor version has 2 digits
              glslVersion = `OpenGL ES GLSL ES ${ver_num[1]} (${glslVersion})`;
            }
            ret = stringToNewUTF8(glslVersion);
            break;
          default:
            GL.recordError(0x500/*GL_INVALID_ENUM*/);
            // fall through
        }
        GL.stringCache[name_] = ret;
      }
      return ret;
    };

  
  var emscriptenWebGLGet = (name_, p, type) => {
      // Guard against user passing a null pointer.
      // Note that GLES2 spec does not say anything about how passing a null
      // pointer should be treated.  Testing on desktop core GL 3, the application
      // crashes on glGetIntegerv to a null pointer, but better to report an error
      // instead of doing anything random.
      if (!p) {
        GL.recordError(0x501 /* GL_INVALID_VALUE */);
        return;
      }
      var ret = undefined;
      switch (name_) { // Handle a few trivial GLES values
        case 0x8DFA: // GL_SHADER_COMPILER
          ret = 1;
          break;
        case 0x8DF8: // GL_SHADER_BINARY_FORMATS
          if (type != 0 && type != 1) {
            GL.recordError(0x500); // GL_INVALID_ENUM
          }
          // Do not write anything to the out pointer, since no binary formats are
          // supported.
          return;
        case 0x8DF9: // GL_NUM_SHADER_BINARY_FORMATS
          ret = 0;
          break;
        case 0x86A2: // GL_NUM_COMPRESSED_TEXTURE_FORMATS
          // WebGL doesn't have GL_NUM_COMPRESSED_TEXTURE_FORMATS (it's obsolete
          // since GL_COMPRESSED_TEXTURE_FORMATS returns a JS array that can be
          // queried for length), so implement it ourselves to allow C++ GLES2
          // code get the length.
          var formats = GLctx.getParameter(0x86A3 /*GL_COMPRESSED_TEXTURE_FORMATS*/);
          ret = formats ? formats.length : 0;
          break;
  
      }
  
      if (ret === undefined) {
        var result = GLctx.getParameter(name_);
        switch (typeof result) {
          case "number":
            ret = result;
            break;
          case "boolean":
            ret = result ? 1 : 0;
            break;
          case "string":
            GL.recordError(0x500); // GL_INVALID_ENUM
            return;
          case "object":
            if (result === null) {
              // null is a valid result for some (e.g., which buffer is bound -
              // perhaps nothing is bound), but otherwise can mean an invalid
              // name_, which we need to report as an error
              switch (name_) {
                case 0x8894: // ARRAY_BUFFER_BINDING
                case 0x8B8D: // CURRENT_PROGRAM
                case 0x8895: // ELEMENT_ARRAY_BUFFER_BINDING
                case 0x8CA6: // FRAMEBUFFER_BINDING or DRAW_FRAMEBUFFER_BINDING
                case 0x8CA7: // RENDERBUFFER_BINDING
                case 0x8069: // TEXTURE_BINDING_2D
                case 0x85B5: // WebGL 2 GL_VERTEX_ARRAY_BINDING, or WebGL 1 extension OES_vertex_array_object GL_VERTEX_ARRAY_BINDING_OES
                case 0x8514: { // TEXTURE_BINDING_CUBE_MAP
                  ret = 0;
                  break;
                }
                default: {
                  GL.recordError(0x500); // GL_INVALID_ENUM
                  return;
                }
              }
            } else if (result instanceof Float32Array ||
                       result instanceof Uint32Array ||
                       result instanceof Int32Array ||
                       result instanceof Array) {
              for (var i = 0; i < result.length; ++i) {
                switch (type) {
                  case 0: HEAP32[(((p)+(i*4))>>2)] = result[i]; break;
                  case 2: HEAPF32[(((p)+(i*4))>>2)] = result[i]; break;
                  case 4: HEAP8[(p)+(i)] = result[i] ? 1 : 0; break;
                }
              }
              return;
            } else {
              try {
                ret = result.name | 0;
              } catch(e) {
                GL.recordError(0x500); // GL_INVALID_ENUM
                err(`GL_INVALID_ENUM in glGet${type}v: Unknown object returned from WebGL getParameter(${name_})! (error: ${e})`);
                return;
              }
            }
            break;
          default:
            GL.recordError(0x500); // GL_INVALID_ENUM
            err(`GL_INVALID_ENUM in glGet${type}v: Native code calling glGet${type}v(${name_}) and it returns ${result} of type ${typeof(result)}!`);
            return;
        }
      }
  
      switch (type) {
        case 1: writeI53ToI64(p, ret); break;
        case 0: HEAP32[((p)>>2)] = ret; break;
        case 2:   HEAPF32[((p)>>2)] = ret; break;
        case 4: HEAP8[p] = ret ? 1 : 0; break;
      }
    };

  
  var _glGetIntegerv = (name_, p) => emscriptenWebGLGet(name_, p, 0);

  
  var _glGetFloatv = (name_, p) => emscriptenWebGLGet(name_, p, 2);

  
  var _glGetBooleanv = (name_, p) => emscriptenWebGLGet(name_, p, 4);

  var _glDeleteTextures = (n, textures) => {
      for (var i = 0; i < n; i++) {
        var id = HEAP32[(((textures)+(i*4))>>2)];
        var texture = GL.textures[id];
        // GL spec: "glDeleteTextures silently ignores 0s and names that do not
        // correspond to existing textures".
        if (!texture) continue;
        GLctx.deleteTexture(texture);
        texture.name = 0;
        GL.textures[id] = null;
      }
    };

  var _glCompressedTexImage2D = (target, level, internalFormat, width, height, border, imageSize, data) => {
      GLctx.compressedTexImage2D(target, level, internalFormat, width, height, border, data ? HEAPU8.subarray((data), data+imageSize) : null);
    };

  var _glCompressedTexSubImage2D = (target, level, xoffset, yoffset, width, height, format, imageSize, data) => {
      GLctx.compressedTexSubImage2D(target, level, xoffset, yoffset, width, height, format, data ? HEAPU8.subarray((data), data+imageSize) : null);
    };

  var computeUnpackAlignedImageSize = (width, height, sizePerPixel) => {
      function roundedToNextMultipleOf(x, y) {
        return (x + y - 1) & -y;
      }
      var plainRowSize = (GL.unpackRowLength || width) * sizePerPixel;
      var alignedRowSize = roundedToNextMultipleOf(plainRowSize, GL.unpackAlignment);
      return height * alignedRowSize;
    };

  var colorChannelsInGlTextureFormat = (format) => {
      // Micro-optimizations for size: map format to size by subtracting smallest
      // enum value (0x1902) from all values first.  Also omit the most common
      // size value (1) from the list, which is assumed by formats not on the
      // list.
      var colorChannels = {
        // 0x1902 /* GL_DEPTH_COMPONENT */ - 0x1902: 1,
        // 0x1906 /* GL_ALPHA */ - 0x1902: 1,
        5: 3,
        6: 4,
        // 0x1909 /* GL_LUMINANCE */ - 0x1902: 1,
        8: 2,
        29502: 3,
        29504: 4,
      };
      return colorChannels[format - 0x1902]||1;
    };

  
  
  
  
  var emscriptenWebGLGetTexPixelData = (type, format, width, height, pixels, internalFormat) => {
      var heap = heapObjectForWebGLType(type);
      var sizePerPixel = colorChannelsInGlTextureFormat(format) * heap.BYTES_PER_ELEMENT;
      var bytes = computeUnpackAlignedImageSize(width, height, sizePerPixel);
      return heap.subarray(toTypedArrayIndex(pixels, heap), toTypedArrayIndex(pixels + bytes, heap));
    };

  
  var _glTexImage2D = (target, level, internalFormat, width, height, border, format, type, pixels) => {
      var pixelData = pixels ? emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, internalFormat) : null;
      GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, pixelData);
    };

  
  var _glTexSubImage2D = (target, level, xoffset, yoffset, width, height, format, type, pixels) => {
      var pixelData = pixels ? emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, 0) : null;
      GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixelData);
    };

  
  var _glReadPixels = (x, y, width, height, format, type, pixels) => {
      var pixelData = emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, format);
      if (!pixelData) {
        GL.recordError(0x500/*GL_INVALID_ENUM*/);
        return;
      }
      GLctx.readPixels(x, y, width, height, format, type, pixelData);
    };

  var _glBindTexture = (target, texture) => {
      GLctx.bindTexture(target, GL.textures[texture]);
    };

  var _glGetTexParameterfv = (target, pname, params) => {
      if (!params) {
        // GLES2 specification does not specify how to behave if params is a null
        // pointer. Since calling this function does not make sense if p == null,
        // issue a GL error to notify user about it.
        GL.recordError(0x501 /* GL_INVALID_VALUE */);
        return;
      }
      HEAPF32[((params)>>2)] = GLctx.getTexParameter(target, pname);
    };

  var _glGetTexParameteriv = (target, pname, params) => {
      if (!params) {
        // GLES2 specification does not specify how to behave if params is a null
        // pointer. Since calling this function does not make sense if p == null,
        // issue a GL error to notify user about it.
        GL.recordError(0x501 /* GL_INVALID_VALUE */);
        return;
      }
      HEAP32[((params)>>2)] = GLctx.getTexParameter(target, pname);
    };

  var _glTexParameterfv = (target, pname, params) => {
      var param = HEAPF32[((params)>>2)];
      GLctx.texParameterf(target, pname, param);
    };

  var _glTexParameteriv = (target, pname, params) => {
      var param = HEAP32[((params)>>2)];
      GLctx.texParameteri(target, pname, param);
    };

  var _glIsTexture = (id) => {
      var texture = GL.textures[id];
      if (!texture) return 0;
      return GLctx.isTexture(texture);
    };

  var _glGenBuffers = (n, buffers) => {
      GL.genObject(n, buffers, 'createBuffer', GL.buffers
        );
    };

  var _glGenTextures = (n, textures) => {
      GL.genObject(n, textures, 'createTexture', GL.textures
        );
    };

  var _glDeleteBuffers = (n, buffers) => {
      for (var i = 0; i < n; i++) {
        var id = HEAP32[(((buffers)+(i*4))>>2)];
        var buffer = GL.buffers[id];
  
        // From spec: "glDeleteBuffers silently ignores 0's and names that do not
        // correspond to existing buffer objects."
        if (!buffer) continue;
  
        GLctx.deleteBuffer(buffer);
        buffer.name = 0;
        GL.buffers[id] = null;
  
      }
    };

  var _glGetBufferParameteriv = (target, value, data) => {
      if (!data) {
        // GLES2 specification does not specify how to behave if data is a null
        // pointer. Since calling this function does not make sense if data ==
        // null, issue a GL error to notify user about it.
        GL.recordError(0x501 /* GL_INVALID_VALUE */);
        return;
      }
      HEAP32[((data)>>2)] = GLctx.getBufferParameter(target, value);
    };

  var _glBufferData = (target, size, data, usage) => {
  
      // N.b. here first form specifies a heap subarray, second form an integer
      // size, so the ?: code here is polymorphic. It is advised to avoid
      // randomly mixing both uses in calling code, to avoid any potential JS
      // engine JIT issues.
      GLctx.bufferData(target, data ? HEAPU8.subarray(data, data+size) : size, usage);
    };

  var _glBufferSubData = (target, offset, size, data) => {
      GLctx.bufferSubData(target, offset, HEAPU8.subarray(data, data+size));
    };

  var _glGenQueriesEXT = (n, ids) => {
      for (var i = 0; i < n; i++) {
        var query = GLctx.disjointTimerQueryExt['createQueryEXT']();
        if (!query) {
          GL.recordError(0x502 /* GL_INVALID_OPERATION */);
          while (i < n) HEAP32[(((ids)+(i++*4))>>2)] = 0;
          return;
        }
        var id = GL.getNewId(GL.queries);
        query.name = id;
        GL.queries[id] = query;
        HEAP32[(((ids)+(i*4))>>2)] = id;
      }
    };

  var _glDeleteQueriesEXT = (n, ids) => {
      for (var i = 0; i < n; i++) {
        var id = HEAP32[(((ids)+(i*4))>>2)];
        var query = GL.queries[id];
        if (!query) continue; // GL spec: "unused names in ids are ignored, as is the name zero."
        GLctx.disjointTimerQueryExt['deleteQueryEXT'](query);
        GL.queries[id] = null;
      }
    };

  var _glIsQueryEXT = (id) => {
      var query = GL.queries[id];
      if (!query) return 0;
      return GLctx.disjointTimerQueryExt['isQueryEXT'](query);
    };

  var _glBeginQueryEXT = (target, id) => {
      GLctx.disjointTimerQueryExt['beginQueryEXT'](target, GL.queries[id]);
    };

  var _glEndQueryEXT = (target) => {
      GLctx.disjointTimerQueryExt['endQueryEXT'](target);
    };

  var _glQueryCounterEXT = (id, target) => {
      GLctx.disjointTimerQueryExt['queryCounterEXT'](GL.queries[id], target);
    };

  var _glGetQueryivEXT = (target, pname, params) => {
      if (!params) {
        // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
        // if p == null, issue a GL error to notify user about it.
        GL.recordError(0x501 /* GL_INVALID_VALUE */);
        return;
      }
      HEAP32[((params)>>2)] = GLctx.disjointTimerQueryExt['getQueryEXT'](target, pname);
    };

  var _glGetQueryObjectivEXT = (id, pname, params) => {
      if (!params) {
        // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
        // if p == null, issue a GL error to notify user about it.
        GL.recordError(0x501 /* GL_INVALID_VALUE */);
        return;
      }
      var query = GL.queries[id];
      var param = GLctx.disjointTimerQueryExt['getQueryObjectEXT'](query, pname);
      var ret;
      if (typeof param == 'boolean') {
        ret = param ? 1 : 0;
      } else {
        ret = param;
      }
      HEAP32[((params)>>2)] = ret;
    };

  
  var _glGetQueryObjectuivEXT = _glGetQueryObjectivEXT;

  
  var _glGetQueryObjecti64vEXT = (id, pname, params) => {
      if (!params) {
        // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
        // if p == null, issue a GL error to notify user about it.
        GL.recordError(0x501 /* GL_INVALID_VALUE */);
        return;
      }
      var query = GL.queries[id];
      var param;
      {
        param = GLctx.disjointTimerQueryExt['getQueryObjectEXT'](query, pname);
      }
      var ret;
      if (typeof param == 'boolean') {
        ret = param ? 1 : 0;
      } else {
        ret = param;
      }
      writeI53ToI64(params, ret);
    };

  
  var _glGetQueryObjectui64vEXT = _glGetQueryObjecti64vEXT;

  var _glIsBuffer = (buffer) => {
      var b = GL.buffers[buffer];
      if (!b) return 0;
      return GLctx.isBuffer(b);
    };

  var _glGenRenderbuffers = (n, renderbuffers) => {
      GL.genObject(n, renderbuffers, 'createRenderbuffer', GL.renderbuffers
        );
    };

  var _glDeleteRenderbuffers = (n, renderbuffers) => {
      for (var i = 0; i < n; i++) {
        var id = HEAP32[(((renderbuffers)+(i*4))>>2)];
        var renderbuffer = GL.renderbuffers[id];
        if (!renderbuffer) continue; // GL spec: "glDeleteRenderbuffers silently ignores 0s and names that do not correspond to existing renderbuffer objects".
        GLctx.deleteRenderbuffer(renderbuffer);
        renderbuffer.name = 0;
        GL.renderbuffers[id] = null;
      }
    };

  var _glBindRenderbuffer = (target, renderbuffer) => {
      GLctx.bindRenderbuffer(target, GL.renderbuffers[renderbuffer]);
    };

  var _glGetRenderbufferParameteriv = (target, pname, params) => {
      if (!params) {
        // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
        // if params == null, issue a GL error to notify user about it.
        GL.recordError(0x501 /* GL_INVALID_VALUE */);
        return;
      }
      HEAP32[((params)>>2)] = GLctx.getRenderbufferParameter(target, pname);
    };

  var _glIsRenderbuffer = (renderbuffer) => {
      var rb = GL.renderbuffers[renderbuffer];
      if (!rb) return 0;
      return GLctx.isRenderbuffer(rb);
    };

  var webglGetUniformLocation = (location) => {
      var p = GLctx.currentProgram;
  
      if (p) {
        var webglLoc = p.uniformLocsById[location];
        // p.uniformLocsById[location] stores either an integer, or a
        // WebGLUniformLocation.
        // If an integer, we have not yet bound the location, so do it now. The
        // integer value specifies the array index we should bind to.
        if (typeof webglLoc == 'number') {
          p.uniformLocsById[location] = webglLoc = GLctx.getUniformLocation(p, p.uniformArrayNamesById[location] + (webglLoc > 0 ? `[${webglLoc}]` : ''));
        }
        // Else an already cached WebGLUniformLocation, return it.
        return webglLoc;
      } else {
        GL.recordError(0x502/*GL_INVALID_OPERATION*/);
      }
    };
  
  /** @noinline */
  var webglGetLeftBracePos = (name) => name.slice(-1) == ']' && name.lastIndexOf('[');
  
  var webglPrepareUniformLocationsBeforeFirstUse = (program) => {
      var uniformLocsById = program.uniformLocsById, // Maps GLuint -> WebGLUniformLocation
        uniformSizeAndIdsByName = program.uniformSizeAndIdsByName, // Maps name -> [uniform array length, GLuint]
        i, j;
  
      // On the first time invocation of glGetUniformLocation on this shader program:
      // initialize cache data structures and discover which uniforms are arrays.
      if (!uniformLocsById) {
        // maps GLint integer locations to WebGLUniformLocations
        program.uniformLocsById = uniformLocsById = {};
        // maps integer locations back to uniform name strings, so that we can lazily fetch uniform array locations
        program.uniformArrayNamesById = {};
  
        for (i = 0; i < GLctx.getProgramParameter(program, 0x8B86/*GL_ACTIVE_UNIFORMS*/); ++i) {
          var u = GLctx.getActiveUniform(program, i);
          var nm = u.name;
          var sz = u.size;
          var lb = webglGetLeftBracePos(nm);
          var arrayName = lb > 0 ? nm.slice(0, lb) : nm;
  
          // Assign a new location.
          var id = program.uniformIdCounter;
          program.uniformIdCounter += sz;
          // Eagerly get the location of the uniformArray[0] base element.
          // The remaining indices >0 will be left for lazy evaluation to
          // improve performance. Those may never be needed to fetch, if the
          // application fills arrays always in full starting from the first
          // element of the array.
          uniformSizeAndIdsByName[arrayName] = [sz, id];
  
          // Store placeholder integers in place that highlight that these
          // >0 index locations are array indices pending population.
          for (j = 0; j < sz; ++j) {
            uniformLocsById[id] = j;
            program.uniformArrayNamesById[id++] = arrayName;
          }
        }
      }
    };
  
  /** @suppress{checkTypes} */
  var emscriptenWebGLGetUniform = (program, location, params, type) => {
      if (!params) {
        // GLES2 specification does not specify how to behave if params is a null
        // pointer. Since calling this function does not make sense if params ==
        // null, issue a GL error to notify user about it.
        GL.recordError(0x501 /* GL_INVALID_VALUE */);
        return;
      }
      program = GL.programs[program];
      webglPrepareUniformLocationsBeforeFirstUse(program);
      var data = GLctx.getUniform(program, webglGetUniformLocation(location));
      if (typeof data == 'number' || typeof data == 'boolean') {
        switch (type) {
          case 0: HEAP32[((params)>>2)] = data; break;
          case 2: HEAPF32[((params)>>2)] = data; break;
        }
      } else {
        for (var i = 0; i < data.length; i++) {
          switch (type) {
            case 0: HEAP32[(((params)+(i*4))>>2)] = data[i]; break;
            case 2: HEAPF32[(((params)+(i*4))>>2)] = data[i]; break;
          }
        }
      }
    };

  
  var _glGetUniformfv = (program, location, params) => {
      emscriptenWebGLGetUniform(program, location, params, 2);
    };

  
  var _glGetUniformiv = (program, location, params) => {
      emscriptenWebGLGetUniform(program, location, params, 0);
    };




  
  
  
  
  var _glGetUniformLocation = (program, name) => {
  
      name = UTF8ToString(name);
  
      if (program = GL.programs[program]) {
        webglPrepareUniformLocationsBeforeFirstUse(program);
        var uniformLocsById = program.uniformLocsById; // Maps GLuint -> WebGLUniformLocation
        var arrayIndex = 0;
        var uniformBaseName = name;
  
        // Invariant: when populating integer IDs for uniform locations, we must
        // maintain the precondition that arrays reside in contiguous addresses,
        // i.e. for a 'vec4 colors[10];', colors[4] must be at location
        // colors[0]+4.  However, user might call glGetUniformLocation(program,
        // "colors") for an array, so we cannot discover based on the user input
        // arguments whether the uniform we are dealing with is an array. The only
        // way to discover which uniforms are arrays is to enumerate over all the
        // active uniforms in the program.
        var leftBrace = webglGetLeftBracePos(name);
  
        // If user passed an array accessor "[index]", parse the array index off the accessor.
        if (leftBrace > 0) {
          arrayIndex = jstoi_q(name.slice(leftBrace + 1)) >>> 0; // "index]", coerce parseInt(']') with >>>0 to treat "foo[]" as "foo[0]" and foo[-1] as unsigned out-of-bounds.
          uniformBaseName = name.slice(0, leftBrace);
        }
  
        // Have we cached the location of this uniform before?
        // A pair [array length, GLint of the uniform location]
        var sizeAndId = program.uniformSizeAndIdsByName[uniformBaseName];
  
        // If an uniform with this name exists, and if its index is within the
        // array limits (if it's even an array), query the WebGLlocation, or
        // return an existing cached location.
        if (sizeAndId && arrayIndex < sizeAndId[0]) {
          arrayIndex += sizeAndId[1]; // Add the base location of the uniform to the array index offset.
          if ((uniformLocsById[arrayIndex] = uniformLocsById[arrayIndex] || GLctx.getUniformLocation(program, name))) {
            return arrayIndex;
          }
        }
      }
      else {
        // N.b. we are currently unable to distinguish between GL program IDs that
        // never existed vs GL program IDs that have been deleted, so report
        // GL_INVALID_VALUE in both cases.
        GL.recordError(0x501 /* GL_INVALID_VALUE */);
      }
      return -1;
    };

  /** @suppress{checkTypes} */
  var emscriptenWebGLGetVertexAttrib = (index, pname, params, type) => {
      if (!params) {
        // GLES2 specification does not specify how to behave if params is a null
        // pointer. Since calling this function does not make sense if params ==
        // null, issue a GL error to notify user about it.
        GL.recordError(0x501 /* GL_INVALID_VALUE */);
        return;
      }
      var data = GLctx.getVertexAttrib(index, pname);
      if (pname == 0x889F/*VERTEX_ATTRIB_ARRAY_BUFFER_BINDING*/) {
        HEAP32[((params)>>2)] = data && data["name"];
      } else if (typeof data == 'number' || typeof data == 'boolean') {
        switch (type) {
          case 0: HEAP32[((params)>>2)] = data; break;
          case 2: HEAPF32[((params)>>2)] = data; break;
          case 5: HEAP32[((params)>>2)] = Math.fround(data); break;
        }
      } else {
        for (var i = 0; i < data.length; i++) {
          switch (type) {
            case 0: HEAP32[(((params)+(i*4))>>2)] = data[i]; break;
            case 2: HEAPF32[(((params)+(i*4))>>2)] = data[i]; break;
            case 5: HEAP32[(((params)+(i*4))>>2)] = Math.fround(data[i]); break;
          }
        }
      }
    };

  
  var _glGetVertexAttribfv = (index, pname, params) => {
      // N.B. This function may only be called if the vertex attribute was
      // specified using the function glVertexAttrib*f(), otherwise the results
      // are undefined. (GLES3 spec 6.1.12)
      emscriptenWebGLGetVertexAttrib(index, pname, params, 2);
    };

  
  var _glGetVertexAttribiv = (index, pname, params) => {
      // N.B. This function may only be called if the vertex attribute was
      // specified using the function glVertexAttrib*f(), otherwise the results
      // are undefined. (GLES3 spec 6.1.12)
      emscriptenWebGLGetVertexAttrib(index, pname, params, 5);
    };

  var _glGetVertexAttribPointerv = (index, pname, pointer) => {
      if (!pointer) {
        // GLES2 specification does not specify how to behave if pointer is a null
        // pointer. Since calling this function does not make sense if pointer ==
        // null, issue a GL error to notify user about it.
        GL.recordError(0x501 /* GL_INVALID_VALUE */);
        return;
      }
      HEAP32[((pointer)>>2)] = GLctx.getVertexAttribOffset(index, pname);
    };

  
  var _glUniform1f = (location, v0) => {
      GLctx.uniform1f(webglGetUniformLocation(location), v0);
    };

  
  var _glUniform2f = (location, v0, v1) => {
      GLctx.uniform2f(webglGetUniformLocation(location), v0, v1);
    };

  
  var _glUniform3f = (location, v0, v1, v2) => {
      GLctx.uniform3f(webglGetUniformLocation(location), v0, v1, v2);
    };

  
  var _glUniform4f = (location, v0, v1, v2, v3) => {
      GLctx.uniform4f(webglGetUniformLocation(location), v0, v1, v2, v3);
    };

  
  var _glUniform1i = (location, v0) => {
      GLctx.uniform1i(webglGetUniformLocation(location), v0);
    };

  
  var _glUniform2i = (location, v0, v1) => {
      GLctx.uniform2i(webglGetUniformLocation(location), v0, v1);
    };

  
  var _glUniform3i = (location, v0, v1, v2) => {
      GLctx.uniform3i(webglGetUniformLocation(location), v0, v1, v2);
    };

  
  var _glUniform4i = (location, v0, v1, v2, v3) => {
      GLctx.uniform4i(webglGetUniformLocation(location), v0, v1, v2, v3);
    };

  
  
  var _glUniform1iv = (location, count, value) => {
  
      if (count <= 288) {
        // avoid allocation when uploading few enough uniforms
        var view = miniTempWebGLIntBuffers[count];
        for (var i = 0; i < count; ++i) {
          view[i] = HEAP32[(((value)+(4*i))>>2)];
        }
      } else
      {
        var view = HEAP32.subarray((((value)>>2)), ((value+count*4)>>2));
      }
      GLctx.uniform1iv(webglGetUniformLocation(location), view);
    };

  
  
  var _glUniform2iv = (location, count, value) => {
  
      if (count <= 144) {
        // avoid allocation when uploading few enough uniforms
        var view = miniTempWebGLIntBuffers[2*count];
        for (var i = 0; i < 2*count; i += 2) {
          view[i] = HEAP32[(((value)+(4*i))>>2)];
          view[i+1] = HEAP32[(((value)+(4*i+4))>>2)];
        }
      } else
      {
        var view = HEAP32.subarray((((value)>>2)), ((value+count*8)>>2));
      }
      GLctx.uniform2iv(webglGetUniformLocation(location), view);
    };

  
  
  var _glUniform3iv = (location, count, value) => {
  
      if (count <= 96) {
        // avoid allocation when uploading few enough uniforms
        var view = miniTempWebGLIntBuffers[3*count];
        for (var i = 0; i < 3*count; i += 3) {
          view[i] = HEAP32[(((value)+(4*i))>>2)];
          view[i+1] = HEAP32[(((value)+(4*i+4))>>2)];
          view[i+2] = HEAP32[(((value)+(4*i+8))>>2)];
        }
      } else
      {
        var view = HEAP32.subarray((((value)>>2)), ((value+count*12)>>2));
      }
      GLctx.uniform3iv(webglGetUniformLocation(location), view);
    };

  
  
  var _glUniform4iv = (location, count, value) => {
  
      if (count <= 72) {
        // avoid allocation when uploading few enough uniforms
        var view = miniTempWebGLIntBuffers[4*count];
        for (var i = 0; i < 4*count; i += 4) {
          view[i] = HEAP32[(((value)+(4*i))>>2)];
          view[i+1] = HEAP32[(((value)+(4*i+4))>>2)];
          view[i+2] = HEAP32[(((value)+(4*i+8))>>2)];
          view[i+3] = HEAP32[(((value)+(4*i+12))>>2)];
        }
      } else
      {
        var view = HEAP32.subarray((((value)>>2)), ((value+count*16)>>2));
      }
      GLctx.uniform4iv(webglGetUniformLocation(location), view);
    };

  
  
  var _glUniform1fv = (location, count, value) => {
  
      if (count <= 288) {
        // avoid allocation when uploading few enough uniforms
        var view = miniTempWebGLFloatBuffers[count];
        for (var i = 0; i < count; ++i) {
          view[i] = HEAPF32[(((value)+(4*i))>>2)];
        }
      } else
      {
        var view = HEAPF32.subarray((((value)>>2)), ((value+count*4)>>2));
      }
      GLctx.uniform1fv(webglGetUniformLocation(location), view);
    };

  
  
  var _glUniform2fv = (location, count, value) => {
  
      if (count <= 144) {
        // avoid allocation when uploading few enough uniforms
        var view = miniTempWebGLFloatBuffers[2*count];
        for (var i = 0; i < 2*count; i += 2) {
          view[i] = HEAPF32[(((value)+(4*i))>>2)];
          view[i+1] = HEAPF32[(((value)+(4*i+4))>>2)];
        }
      } else
      {
        var view = HEAPF32.subarray((((value)>>2)), ((value+count*8)>>2));
      }
      GLctx.uniform2fv(webglGetUniformLocation(location), view);
    };

  
  
  var _glUniform3fv = (location, count, value) => {
  
      if (count <= 96) {
        // avoid allocation when uploading few enough uniforms
        var view = miniTempWebGLFloatBuffers[3*count];
        for (var i = 0; i < 3*count; i += 3) {
          view[i] = HEAPF32[(((value)+(4*i))>>2)];
          view[i+1] = HEAPF32[(((value)+(4*i+4))>>2)];
          view[i+2] = HEAPF32[(((value)+(4*i+8))>>2)];
        }
      } else
      {
        var view = HEAPF32.subarray((((value)>>2)), ((value+count*12)>>2));
      }
      GLctx.uniform3fv(webglGetUniformLocation(location), view);
    };

  
  
  var _glUniform4fv = (location, count, value) => {
  
      if (count <= 72) {
        // avoid allocation when uploading few enough uniforms
        var view = miniTempWebGLFloatBuffers[4*count];
        // hoist the heap out of the loop for size and for pthreads+growth.
        var heap = HEAPF32;
        value = ((value)>>2);
        for (var i = 0; i < 4 * count; i += 4) {
          var dst = value + i;
          view[i] = heap[dst];
          view[i + 1] = heap[dst + 1];
          view[i + 2] = heap[dst + 2];
          view[i + 3] = heap[dst + 3];
        }
      } else
      {
        var view = HEAPF32.subarray((((value)>>2)), ((value+count*16)>>2));
      }
      GLctx.uniform4fv(webglGetUniformLocation(location), view);
    };

  
  
  var _glUniformMatrix2fv = (location, count, transpose, value) => {
  
      if (count <= 72) {
        // avoid allocation when uploading few enough uniforms
        var view = miniTempWebGLFloatBuffers[4*count];
        for (var i = 0; i < 4*count; i += 4) {
          view[i] = HEAPF32[(((value)+(4*i))>>2)];
          view[i+1] = HEAPF32[(((value)+(4*i+4))>>2)];
          view[i+2] = HEAPF32[(((value)+(4*i+8))>>2)];
          view[i+3] = HEAPF32[(((value)+(4*i+12))>>2)];
        }
      } else
      {
        var view = HEAPF32.subarray((((value)>>2)), ((value+count*16)>>2));
      }
      GLctx.uniformMatrix2fv(webglGetUniformLocation(location), !!transpose, view);
    };

  
  
  var _glUniformMatrix3fv = (location, count, transpose, value) => {
  
      if (count <= 32) {
        // avoid allocation when uploading few enough uniforms
        var view = miniTempWebGLFloatBuffers[9*count];
        for (var i = 0; i < 9*count; i += 9) {
          view[i] = HEAPF32[(((value)+(4*i))>>2)];
          view[i+1] = HEAPF32[(((value)+(4*i+4))>>2)];
          view[i+2] = HEAPF32[(((value)+(4*i+8))>>2)];
          view[i+3] = HEAPF32[(((value)+(4*i+12))>>2)];
          view[i+4] = HEAPF32[(((value)+(4*i+16))>>2)];
          view[i+5] = HEAPF32[(((value)+(4*i+20))>>2)];
          view[i+6] = HEAPF32[(((value)+(4*i+24))>>2)];
          view[i+7] = HEAPF32[(((value)+(4*i+28))>>2)];
          view[i+8] = HEAPF32[(((value)+(4*i+32))>>2)];
        }
      } else
      {
        var view = HEAPF32.subarray((((value)>>2)), ((value+count*36)>>2));
      }
      GLctx.uniformMatrix3fv(webglGetUniformLocation(location), !!transpose, view);
    };

  
  
  var _glUniformMatrix4fv = (location, count, transpose, value) => {
  
      if (count <= 18) {
        // avoid allocation when uploading few enough uniforms
        var view = miniTempWebGLFloatBuffers[16*count];
        // hoist the heap out of the loop for size and for pthreads+growth.
        var heap = HEAPF32;
        value = ((value)>>2);
        for (var i = 0; i < 16 * count; i += 16) {
          var dst = value + i;
          view[i] = heap[dst];
          view[i + 1] = heap[dst + 1];
          view[i + 2] = heap[dst + 2];
          view[i + 3] = heap[dst + 3];
          view[i + 4] = heap[dst + 4];
          view[i + 5] = heap[dst + 5];
          view[i + 6] = heap[dst + 6];
          view[i + 7] = heap[dst + 7];
          view[i + 8] = heap[dst + 8];
          view[i + 9] = heap[dst + 9];
          view[i + 10] = heap[dst + 10];
          view[i + 11] = heap[dst + 11];
          view[i + 12] = heap[dst + 12];
          view[i + 13] = heap[dst + 13];
          view[i + 14] = heap[dst + 14];
          view[i + 15] = heap[dst + 15];
        }
      } else
      {
        var view = HEAPF32.subarray((((value)>>2)), ((value+count*64)>>2));
      }
      GLctx.uniformMatrix4fv(webglGetUniformLocation(location), !!transpose, view);
    };

  var _glBindBuffer = (target, buffer) => {
  
      GLctx.bindBuffer(target, GL.buffers[buffer]);
    };

  var _glVertexAttrib1fv = (index, v) => {
  
      GLctx.vertexAttrib1f(index, HEAPF32[v>>2]);
    };

  var _glVertexAttrib2fv = (index, v) => {
  
      GLctx.vertexAttrib2f(index, HEAPF32[v>>2], HEAPF32[v+4>>2]);
    };

  var _glVertexAttrib3fv = (index, v) => {
  
      GLctx.vertexAttrib3f(index, HEAPF32[v>>2], HEAPF32[v+4>>2], HEAPF32[v+8>>2]);
    };

  var _glVertexAttrib4fv = (index, v) => {
  
      GLctx.vertexAttrib4f(index, HEAPF32[v>>2], HEAPF32[v+4>>2], HEAPF32[v+8>>2], HEAPF32[v+12>>2]);
    };

  
  var _glGetAttribLocation = (program, name) => {
      return GLctx.getAttribLocation(GL.programs[program], UTF8ToString(name));
    };

  
  var __glGetActiveAttribOrUniform = (funcName, program, index, bufSize, length, size, type, name) => {
      program = GL.programs[program];
      var info = GLctx[funcName](program, index);
      if (info) {
        // If an error occurs, nothing will be written to length, size and type and name.
        var numBytesWrittenExclNull = name && stringToUTF8(info.name, name, bufSize);
        if (length) HEAP32[((length)>>2)] = numBytesWrittenExclNull;
        if (size) HEAP32[((size)>>2)] = info.size;
        if (type) HEAP32[((type)>>2)] = info.type;
      }
    };

  
  var _glGetActiveAttrib = (program, index, bufSize, length, size, type, name) => {
      __glGetActiveAttribOrUniform('getActiveAttrib', program, index, bufSize, length, size, type, name);
    };

  
  var _glGetActiveUniform = (program, index, bufSize, length, size, type, name) => {
      __glGetActiveAttribOrUniform('getActiveUniform', program, index, bufSize, length, size, type, name);
    };

  var _glCreateShader = (shaderType) => {
      var id = GL.getNewId(GL.shaders);
      GL.shaders[id] = GLctx.createShader(shaderType);
  
      return id;
    };

  var _glDeleteShader = (id) => {
      if (!id) return;
      var shader = GL.shaders[id];
      if (!shader) {
        // glDeleteShader actually signals an error when deleting a nonexisting
        // object, unlike some other GL delete functions.
        GL.recordError(0x501 /* GL_INVALID_VALUE */);
        return;
      }
      GLctx.deleteShader(shader);
      GL.shaders[id] = null;
    };

  var _glGetAttachedShaders = (program, maxCount, count, shaders) => {
      var result = GLctx.getAttachedShaders(GL.programs[program]);
      var len = result.length;
      if (len > maxCount) {
        len = maxCount;
      }
      HEAP32[((count)>>2)] = len;
      for (var i = 0; i < len; ++i) {
        var id = GL.shaders.indexOf(result[i]);
        HEAP32[(((shaders)+(i*4))>>2)] = id;
      }
    };

  var _glShaderSource = (shader, count, string, length) => {
      var source = GL.getSource(shader, count, string, length);
  
      GLctx.shaderSource(GL.shaders[shader], source);
    };

  var _glGetShaderSource = (shader, bufSize, length, source) => {
      var result = GLctx.getShaderSource(GL.shaders[shader]);
      if (!result) return; // If an error occurs, nothing will be written to length or source.
      var numBytesWrittenExclNull = (bufSize > 0 && source) ? stringToUTF8(result, source, bufSize) : 0;
      if (length) HEAP32[((length)>>2)] = numBytesWrittenExclNull;
    };

  var _glCompileShader = (shader) => {
      GLctx.compileShader(GL.shaders[shader]);
    };

  
  var _glGetShaderInfoLog = (shader, maxLength, length, infoLog) => {
      var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
      if (log === null) log = '(unknown error)';
      var numBytesWrittenExclNull = (maxLength > 0 && infoLog) ? stringToUTF8(log, infoLog, maxLength) : 0;
      if (length) HEAP32[((length)>>2)] = numBytesWrittenExclNull;
    };

  var _glGetShaderiv = (shader, pname, p) => {
      if (!p) {
        // GLES2 specification does not specify how to behave if p is a null
        // pointer. Since calling this function does not make sense if p == null,
        // issue a GL error to notify user about it.
        GL.recordError(0x501 /* GL_INVALID_VALUE */);
        return;
      }
      if (pname == 0x8B84) { // GL_INFO_LOG_LENGTH
        var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
        if (log === null) log = '(unknown error)';
        // The GLES2 specification says that if the shader has an empty info log,
        // a value of 0 is returned. Otherwise the log has a null char appended.
        // (An empty string is falsey, so we can just check that instead of
        // looking at log.length.)
        var logLength = log ? log.length + 1 : 0;
        HEAP32[((p)>>2)] = logLength;
      } else if (pname == 0x8B88) { // GL_SHADER_SOURCE_LENGTH
        var source = GLctx.getShaderSource(GL.shaders[shader]);
        // source may be a null, or the empty string, both of which are falsey
        // values that we report a 0 length for.
        var sourceLength = source ? source.length + 1 : 0;
        HEAP32[((p)>>2)] = sourceLength;
      } else {
        HEAP32[((p)>>2)] = GLctx.getShaderParameter(GL.shaders[shader], pname);
      }
    };

  var _glGetProgramiv = (program, pname, p) => {
      if (!p) {
        // GLES2 specification does not specify how to behave if p is a null
        // pointer. Since calling this function does not make sense if p == null,
        // issue a GL error to notify user about it.
        GL.recordError(0x501 /* GL_INVALID_VALUE */);
        return;
      }
  
      if (program >= GL.counter) {
        GL.recordError(0x501 /* GL_INVALID_VALUE */);
        return;
      }
  
      program = GL.programs[program];
  
      if (pname == 0x8B84) { // GL_INFO_LOG_LENGTH
        var log = GLctx.getProgramInfoLog(program);
        if (log === null) log = '(unknown error)';
        HEAP32[((p)>>2)] = log.length + 1;
      } else if (pname == 0x8B87 /* GL_ACTIVE_UNIFORM_MAX_LENGTH */) {
        if (!program.maxUniformLength) {
          for (var i = 0; i < GLctx.getProgramParameter(program, 0x8B86/*GL_ACTIVE_UNIFORMS*/); ++i) {
            program.maxUniformLength = Math.max(program.maxUniformLength, GLctx.getActiveUniform(program, i).name.length+1);
          }
        }
        HEAP32[((p)>>2)] = program.maxUniformLength;
      } else if (pname == 0x8B8A /* GL_ACTIVE_ATTRIBUTE_MAX_LENGTH */) {
        if (!program.maxAttributeLength) {
          for (var i = 0; i < GLctx.getProgramParameter(program, 0x8B89/*GL_ACTIVE_ATTRIBUTES*/); ++i) {
            program.maxAttributeLength = Math.max(program.maxAttributeLength, GLctx.getActiveAttrib(program, i).name.length+1);
          }
        }
        HEAP32[((p)>>2)] = program.maxAttributeLength;
      } else if (pname == 0x8A35 /* GL_ACTIVE_UNIFORM_BLOCK_MAX_NAME_LENGTH */) {
        if (!program.maxUniformBlockNameLength) {
          for (var i = 0; i < GLctx.getProgramParameter(program, 0x8A36/*GL_ACTIVE_UNIFORM_BLOCKS*/); ++i) {
            program.maxUniformBlockNameLength = Math.max(program.maxUniformBlockNameLength, GLctx.getActiveUniformBlockName(program, i).length+1);
          }
        }
        HEAP32[((p)>>2)] = program.maxUniformBlockNameLength;
      } else {
        HEAP32[((p)>>2)] = GLctx.getProgramParameter(program, pname);
      }
    };

  var _glIsShader = (shader) => {
      var s = GL.shaders[shader];
      if (!s) return 0;
      return GLctx.isShader(s);
    };

  var _glCreateProgram = () => {
      var id = GL.getNewId(GL.programs);
      var program = GLctx.createProgram();
      // Store additional information needed for each shader program:
      program.name = id;
      // Lazy cache results of
      // glGetProgramiv(GL_ACTIVE_UNIFORM_MAX_LENGTH/GL_ACTIVE_ATTRIBUTE_MAX_LENGTH/GL_ACTIVE_UNIFORM_BLOCK_MAX_NAME_LENGTH)
      program.maxUniformLength = program.maxAttributeLength = program.maxUniformBlockNameLength = 0;
      program.uniformIdCounter = 1;
      GL.programs[id] = program;
      return id;
    };

  var _glDeleteProgram = (id) => {
      if (!id) return;
      var program = GL.programs[id];
      if (!program) {
        // glDeleteProgram actually signals an error when deleting a nonexisting
        // object, unlike some other GL delete functions.
        GL.recordError(0x501 /* GL_INVALID_VALUE */);
        return;
      }
      GLctx.deleteProgram(program);
      program.name = 0;
      GL.programs[id] = null;
    };

  var _glAttachShader = (program, shader) => {
      GLctx.attachShader(GL.programs[program], GL.shaders[shader]);
    };

  var _glDetachShader = (program, shader) => {
      GLctx.detachShader(GL.programs[program], GL.shaders[shader]);
    };

  var _glGetShaderPrecisionFormat = (shaderType, precisionType, range, precision) => {
      var result = GLctx.getShaderPrecisionFormat(shaderType, precisionType);
      HEAP32[((range)>>2)] = result.rangeMin;
      HEAP32[(((range)+(4))>>2)] = result.rangeMax;
      HEAP32[((precision)>>2)] = result.precision;
    };

  var _glLinkProgram = (program) => {
      program = GL.programs[program];
      GLctx.linkProgram(program);
      // Invalidate earlier computed uniform->ID mappings, those have now become stale
      program.uniformLocsById = 0; // Mark as null-like so that glGetUniformLocation() knows to populate this again.
      program.uniformSizeAndIdsByName = {};
  
    };

  var _glGetProgramInfoLog = (program, maxLength, length, infoLog) => {
      var log = GLctx.getProgramInfoLog(GL.programs[program]);
      if (log === null) log = '(unknown error)';
      var numBytesWrittenExclNull = (maxLength > 0 && infoLog) ? stringToUTF8(log, infoLog, maxLength) : 0;
      if (length) HEAP32[((length)>>2)] = numBytesWrittenExclNull;
    };

  var _glUseProgram = (program) => {
      program = GL.programs[program];
      GLctx.useProgram(program);
      // Record the currently active program so that we can access the uniform
      // mapping table of that program.
      GLctx.currentProgram = program;
    };

  var _glValidateProgram = (program) => {
      GLctx.validateProgram(GL.programs[program]);
    };

  var _glIsProgram = (program) => {
      program = GL.programs[program];
      if (!program) return 0;
      return GLctx.isProgram(program);
    };

  
  var _glBindAttribLocation = (program, index, name) => {
      GLctx.bindAttribLocation(GL.programs[program], index, UTF8ToString(name));
    };

  var _glBindFramebuffer = (target, framebuffer) => {
  
      GLctx.bindFramebuffer(target, GL.framebuffers[framebuffer]);
  
    };

  var _glGenFramebuffers = (n, ids) => {
      GL.genObject(n, ids, 'createFramebuffer', GL.framebuffers
        );
    };

  var _glDeleteFramebuffers = (n, framebuffers) => {
      for (var i = 0; i < n; ++i) {
        var id = HEAP32[(((framebuffers)+(i*4))>>2)];
        var framebuffer = GL.framebuffers[id];
        if (!framebuffer) continue; // GL spec: "glDeleteFramebuffers silently ignores 0s and names that do not correspond to existing framebuffer objects".
        GLctx.deleteFramebuffer(framebuffer);
        framebuffer.name = 0;
        GL.framebuffers[id] = null;
      }
    };

  var _glFramebufferRenderbuffer = (target, attachment, renderbuffertarget, renderbuffer) => {
      GLctx.framebufferRenderbuffer(target, attachment, renderbuffertarget,
                                         GL.renderbuffers[renderbuffer]);
    };

  var _glFramebufferTexture2D = (target, attachment, textarget, texture, level) => {
      GLctx.framebufferTexture2D(target, attachment, textarget,
                                      GL.textures[texture], level);
    };

  var _glGetFramebufferAttachmentParameteriv = (target, attachment, pname, params) => {
      var result = GLctx.getFramebufferAttachmentParameter(target, attachment, pname);
      if (result instanceof WebGLRenderbuffer ||
          result instanceof WebGLTexture) {
        result = result.name | 0;
      }
      HEAP32[((params)>>2)] = result;
    };

  var _glIsFramebuffer = (framebuffer) => {
      var fb = GL.framebuffers[framebuffer];
      if (!fb) return 0;
      return GLctx.isFramebuffer(fb);
    };

  var _glGenVertexArrays = (n, arrays) => {
      GL.genObject(n, arrays, 'createVertexArray', GL.vaos
        );
    };

  var _glDeleteVertexArrays = (n, vaos) => {
      for (var i = 0; i < n; i++) {
        var id = HEAP32[(((vaos)+(i*4))>>2)];
        GLctx.deleteVertexArray(GL.vaos[id]);
        GL.vaos[id] = null;
      }
    };

  var _glBindVertexArray = (vao) => {
      GLctx.bindVertexArray(GL.vaos[vao]);
    };

  var _glIsVertexArray = (array) => {
  
      var vao = GL.vaos[array];
      if (!vao) return 0;
      return GLctx.isVertexArray(vao);
    };

  var _glVertexPointer = (size, type, stride, ptr) => {
      throw 'Legacy GL function (glVertexPointer) called. If you want legacy GL emulation, you need to compile with -sLEGACY_GL_EMULATION to enable legacy GL emulation.';
    };

  var _glMatrixMode = () => {
      throw 'Legacy GL function (glMatrixMode) called. If you want legacy GL emulation, you need to compile with -sLEGACY_GL_EMULATION to enable legacy GL emulation.';
    };

  var _glBegin = () => {
      throw 'Legacy GL function (glBegin) called. If you want legacy GL emulation, you need to compile with -sLEGACY_GL_EMULATION to enable legacy GL emulation.';
    };

  var _glLoadIdentity = () => {
      throw 'Legacy GL function (glLoadIdentity) called. If you want legacy GL emulation, you need to compile with -sLEGACY_GL_EMULATION to enable legacy GL emulation.';
    };

  
  var _glGenVertexArraysOES = _glGenVertexArrays;

  
  var _glDeleteVertexArraysOES = _glDeleteVertexArrays;

  
  var _glBindVertexArrayOES = _glBindVertexArray;

  
  var _glIsVertexArrayOES = _glIsVertexArray;

  var _glVertexAttribPointer = (index, size, type, normalized, stride, ptr) => {
      GLctx.vertexAttribPointer(index, size, type, !!normalized, stride, ptr);
    };

  var _glEnableVertexAttribArray = (index) => {
      GLctx.enableVertexAttribArray(index);
    };

  var _glDisableVertexAttribArray = (index) => {
      GLctx.disableVertexAttribArray(index);
    };

  var _glDrawArrays = (mode, first, count) => {
  
      GLctx.drawArrays(mode, first, count);
  
    };

  var _glDrawElements = (mode, count, type, indices) => {
  
      GLctx.drawElements(mode, count, type, indices);
  
    };

  var _glShaderBinary = (count, shaders, binaryformat, binary, length) => {
      GL.recordError(0x500/*GL_INVALID_ENUM*/);
    };

  var _glReleaseShaderCompiler = () => {
      // NOP (as allowed by GLES 2.0 spec)
    };

  var _glGetError = () => {
      var error = GLctx.getError() || GL.lastError;
      GL.lastError = 0/*GL_NO_ERROR*/;
      return error;
    };

  var _glVertexAttribDivisor = (index, divisor) => {
      GLctx.vertexAttribDivisor(index, divisor);
    };

  var _glDrawArraysInstanced = (mode, first, count, primcount) => {
      GLctx.drawArraysInstanced(mode, first, count, primcount);
    };

  var _glDrawElementsInstanced = (mode, count, type, indices, primcount) => {
      GLctx.drawElementsInstanced(mode, count, type, indices, primcount);
    };

  
  var _glVertexAttribDivisorNV = _glVertexAttribDivisor;

  
  var _glDrawArraysInstancedNV = _glDrawArraysInstanced;

  
  var _glDrawElementsInstancedNV = _glDrawElementsInstanced;

  
  var _glVertexAttribDivisorEXT = _glVertexAttribDivisor;

  
  var _glDrawArraysInstancedEXT = _glDrawArraysInstanced;

  
  var _glDrawElementsInstancedEXT = _glDrawElementsInstanced;

  
  var _glVertexAttribDivisorARB = _glVertexAttribDivisor;

  
  var _glDrawArraysInstancedARB = _glDrawArraysInstanced;

  
  var _glDrawElementsInstancedARB = _glDrawElementsInstanced;

  
  var _glVertexAttribDivisorANGLE = _glVertexAttribDivisor;

  
  var _glDrawArraysInstancedANGLE = _glDrawArraysInstanced;

  
  var _glDrawElementsInstancedANGLE = _glDrawElementsInstanced;

  
  var _glDrawBuffers = (n, bufs) => {
  
      var bufArray = tempFixedLengthArray[n];
      for (var i = 0; i < n; i++) {
        bufArray[i] = HEAP32[(((bufs)+(i*4))>>2)];
      }
  
      GLctx.drawBuffers(bufArray);
    };

  
  var _glDrawBuffersEXT = _glDrawBuffers;

  
  var _glDrawBuffersWEBGL = _glDrawBuffers;

  var _glColorMask = (red, green, blue, alpha) => {
      GLctx.colorMask(!!red, !!green, !!blue, !!alpha);
    };

  var _glDepthMask = (flag) => {
      GLctx.depthMask(!!flag);
    };

  var _glSampleCoverage = (value, invert) => {
      GLctx.sampleCoverage(value, !!invert);
    };

  
  /** @suppress {duplicate } */
  var _glMultiDrawArraysWEBGL = (mode, firsts, counts, drawcount) => {
      GLctx.multiDrawWebgl['multiDrawArraysWEBGL'](
        mode,
        HEAP32,
        ((firsts)>>2),
        HEAP32,
        ((counts)>>2),
        drawcount);
    };
  var _glMultiDrawArrays = _glMultiDrawArraysWEBGL;

  
  var _glMultiDrawArraysANGLE = _glMultiDrawArraysWEBGL;


  
  /** @suppress {duplicate } */
  var _glMultiDrawArraysInstancedWEBGL = (mode, firsts, counts, instanceCounts, drawcount) => {
      GLctx.multiDrawWebgl['multiDrawArraysInstancedWEBGL'](
        mode,
        HEAP32,
        ((firsts)>>2),
        HEAP32,
        ((counts)>>2),
        HEAP32,
        ((instanceCounts)>>2),
        drawcount);
    };
  var _glMultiDrawArraysInstancedANGLE = _glMultiDrawArraysInstancedWEBGL;


  
  /** @suppress {duplicate } */
  var _glMultiDrawElementsWEBGL = (mode, counts, type, offsets, drawcount) => {
      GLctx.multiDrawWebgl['multiDrawElementsWEBGL'](
        mode,
        HEAP32,
        ((counts)>>2),
        type,
        HEAP32,
        ((offsets)>>2),
        drawcount);
    };
  var _glMultiDrawElements = _glMultiDrawElementsWEBGL;

  
  var _glMultiDrawElementsANGLE = _glMultiDrawElementsWEBGL;


  
  /** @suppress {duplicate } */
  var _glMultiDrawElementsInstancedWEBGL = (mode, counts, type, offsets, instanceCounts, drawcount) => {
      GLctx.multiDrawWebgl['multiDrawElementsInstancedWEBGL'](
        mode,
        HEAP32,
        ((counts)>>2),
        type,
        HEAP32,
        ((offsets)>>2),
        HEAP32,
        ((instanceCounts)>>2),
        drawcount);
    };
  var _glMultiDrawElementsInstancedANGLE = _glMultiDrawElementsInstancedWEBGL;


  var _glFinish = () => GLctx.finish();

  var _glFlush = () => GLctx.flush();

  var _glClearDepth = (x0) => GLctx.clearDepth(x0);

  var _glClearDepthf = (x0) => GLctx.clearDepth(x0);

  var _glDepthFunc = (x0) => GLctx.depthFunc(x0);

  var _glEnable = (x0) => GLctx.enable(x0);

  var _glDisable = (x0) => GLctx.disable(x0);

  var _glFrontFace = (x0) => GLctx.frontFace(x0);

  var _glCullFace = (x0) => GLctx.cullFace(x0);

  var _glClear = (x0) => GLctx.clear(x0);

  var _glLineWidth = (x0) => GLctx.lineWidth(x0);

  var _glClearStencil = (x0) => GLctx.clearStencil(x0);

  var _glStencilMask = (x0) => GLctx.stencilMask(x0);

  var _glCheckFramebufferStatus = (x0) => GLctx.checkFramebufferStatus(x0);

  var _glGenerateMipmap = (x0) => GLctx.generateMipmap(x0);

  var _glActiveTexture = (x0) => GLctx.activeTexture(x0);

  var _glBlendEquation = (x0) => GLctx.blendEquation(x0);

  var _glIsEnabled = (x0) => GLctx.isEnabled(x0);

  var _glBlendFunc = (x0, x1) => GLctx.blendFunc(x0, x1);

  var _glBlendEquationSeparate = (x0, x1) => GLctx.blendEquationSeparate(x0, x1);

  var _glDepthRange = (x0, x1) => GLctx.depthRange(x0, x1);

  var _glDepthRangef = (x0, x1) => GLctx.depthRange(x0, x1);

  var _glStencilMaskSeparate = (x0, x1) => GLctx.stencilMaskSeparate(x0, x1);

  var _glHint = (x0, x1) => GLctx.hint(x0, x1);

  var _glPolygonOffset = (x0, x1) => GLctx.polygonOffset(x0, x1);

  var _glVertexAttrib1f = (x0, x1) => GLctx.vertexAttrib1f(x0, x1);

  var _glTexParameteri = (x0, x1, x2) => GLctx.texParameteri(x0, x1, x2);

  var _glTexParameterf = (x0, x1, x2) => GLctx.texParameterf(x0, x1, x2);

  var _glVertexAttrib2f = (x0, x1, x2) => GLctx.vertexAttrib2f(x0, x1, x2);

  var _glStencilFunc = (x0, x1, x2) => GLctx.stencilFunc(x0, x1, x2);

  var _glStencilOp = (x0, x1, x2) => GLctx.stencilOp(x0, x1, x2);

  var _glViewport = (x0, x1, x2, x3) => GLctx.viewport(x0, x1, x2, x3);

  var _glClearColor = (x0, x1, x2, x3) => GLctx.clearColor(x0, x1, x2, x3);

  var _glScissor = (x0, x1, x2, x3) => GLctx.scissor(x0, x1, x2, x3);

  var _glVertexAttrib3f = (x0, x1, x2, x3) => GLctx.vertexAttrib3f(x0, x1, x2, x3);

  var _glRenderbufferStorage = (x0, x1, x2, x3) => GLctx.renderbufferStorage(x0, x1, x2, x3);

  var _glBlendFuncSeparate = (x0, x1, x2, x3) => GLctx.blendFuncSeparate(x0, x1, x2, x3);

  var _glBlendColor = (x0, x1, x2, x3) => GLctx.blendColor(x0, x1, x2, x3);

  var _glStencilFuncSeparate = (x0, x1, x2, x3) => GLctx.stencilFuncSeparate(x0, x1, x2, x3);

  var _glStencilOpSeparate = (x0, x1, x2, x3) => GLctx.stencilOpSeparate(x0, x1, x2, x3);

  var _glVertexAttrib4f = (x0, x1, x2, x3, x4) => GLctx.vertexAttrib4f(x0, x1, x2, x3, x4);

  var _glCopyTexImage2D = (x0, x1, x2, x3, x4, x5, x6, x7) => GLctx.copyTexImage2D(x0, x1, x2, x3, x4, x5, x6, x7);

  var _glCopyTexSubImage2D = (x0, x1, x2, x3, x4, x5, x6, x7) => GLctx.copyTexSubImage2D(x0, x1, x2, x3, x4, x5, x6, x7);

  var _emscripten_glPixelStorei = _glPixelStorei;

  var _emscripten_glGetString = _glGetString;

  var _emscripten_glGetIntegerv = _glGetIntegerv;

  var _emscripten_glGetFloatv = _glGetFloatv;

  var _emscripten_glGetBooleanv = _glGetBooleanv;

  var _emscripten_glDeleteTextures = _glDeleteTextures;

  var _emscripten_glCompressedTexImage2D = _glCompressedTexImage2D;

  var _emscripten_glCompressedTexSubImage2D = _glCompressedTexSubImage2D;

  var _emscripten_glTexImage2D = _glTexImage2D;

  var _emscripten_glTexSubImage2D = _glTexSubImage2D;

  var _emscripten_glReadPixels = _glReadPixels;

  var _emscripten_glBindTexture = _glBindTexture;

  var _emscripten_glGetTexParameterfv = _glGetTexParameterfv;

  var _emscripten_glGetTexParameteriv = _glGetTexParameteriv;

  var _emscripten_glTexParameterfv = _glTexParameterfv;

  var _emscripten_glTexParameteriv = _glTexParameteriv;

  var _emscripten_glIsTexture = _glIsTexture;

  var _emscripten_glGenBuffers = _glGenBuffers;

  var _emscripten_glGenTextures = _glGenTextures;

  var _emscripten_glDeleteBuffers = _glDeleteBuffers;

  var _emscripten_glGetBufferParameteriv = _glGetBufferParameteriv;

  var _emscripten_glBufferData = _glBufferData;

  var _emscripten_glBufferSubData = _glBufferSubData;

  var _emscripten_glGenQueriesEXT = _glGenQueriesEXT;

  var _emscripten_glDeleteQueriesEXT = _glDeleteQueriesEXT;

  var _emscripten_glIsQueryEXT = _glIsQueryEXT;

  var _emscripten_glBeginQueryEXT = _glBeginQueryEXT;

  var _emscripten_glEndQueryEXT = _glEndQueryEXT;

  var _emscripten_glQueryCounterEXT = _glQueryCounterEXT;

  var _emscripten_glGetQueryivEXT = _glGetQueryivEXT;

  var _emscripten_glGetQueryObjectivEXT = _glGetQueryObjectivEXT;

  var _emscripten_glGetQueryObjectuivEXT = _glGetQueryObjectuivEXT;

  var _emscripten_glGetQueryObjecti64vEXT = _glGetQueryObjecti64vEXT;

  var _emscripten_glGetQueryObjectui64vEXT = _glGetQueryObjectui64vEXT;

  var _emscripten_glIsBuffer = _glIsBuffer;

  var _emscripten_glGenRenderbuffers = _glGenRenderbuffers;

  var _emscripten_glDeleteRenderbuffers = _glDeleteRenderbuffers;

  var _emscripten_glBindRenderbuffer = _glBindRenderbuffer;

  var _emscripten_glGetRenderbufferParameteriv = _glGetRenderbufferParameteriv;

  var _emscripten_glIsRenderbuffer = _glIsRenderbuffer;

  var _emscripten_glGetUniformfv = _glGetUniformfv;

  var _emscripten_glGetUniformiv = _glGetUniformiv;

  var _emscripten_glGetUniformLocation = _glGetUniformLocation;

  var _emscripten_glGetVertexAttribfv = _glGetVertexAttribfv;

  var _emscripten_glGetVertexAttribiv = _glGetVertexAttribiv;

  var _emscripten_glGetVertexAttribPointerv = _glGetVertexAttribPointerv;

  var _emscripten_glUniform1f = _glUniform1f;

  var _emscripten_glUniform2f = _glUniform2f;

  var _emscripten_glUniform3f = _glUniform3f;

  var _emscripten_glUniform4f = _glUniform4f;

  var _emscripten_glUniform1i = _glUniform1i;

  var _emscripten_glUniform2i = _glUniform2i;

  var _emscripten_glUniform3i = _glUniform3i;

  var _emscripten_glUniform4i = _glUniform4i;

  var _emscripten_glUniform1iv = _glUniform1iv;

  var _emscripten_glUniform2iv = _glUniform2iv;

  var _emscripten_glUniform3iv = _glUniform3iv;

  var _emscripten_glUniform4iv = _glUniform4iv;

  var _emscripten_glUniform1fv = _glUniform1fv;

  var _emscripten_glUniform2fv = _glUniform2fv;

  var _emscripten_glUniform3fv = _glUniform3fv;

  var _emscripten_glUniform4fv = _glUniform4fv;

  var _emscripten_glUniformMatrix2fv = _glUniformMatrix2fv;

  var _emscripten_glUniformMatrix3fv = _glUniformMatrix3fv;

  var _emscripten_glUniformMatrix4fv = _glUniformMatrix4fv;

  var _emscripten_glBindBuffer = _glBindBuffer;

  var _emscripten_glVertexAttrib1fv = _glVertexAttrib1fv;

  var _emscripten_glVertexAttrib2fv = _glVertexAttrib2fv;

  var _emscripten_glVertexAttrib3fv = _glVertexAttrib3fv;

  var _emscripten_glVertexAttrib4fv = _glVertexAttrib4fv;

  var _emscripten_glGetAttribLocation = _glGetAttribLocation;

  var _emscripten_glGetActiveAttrib = _glGetActiveAttrib;

  var _emscripten_glGetActiveUniform = _glGetActiveUniform;

  var _emscripten_glCreateShader = _glCreateShader;

  var _emscripten_glDeleteShader = _glDeleteShader;

  var _emscripten_glGetAttachedShaders = _glGetAttachedShaders;

  var _emscripten_glShaderSource = _glShaderSource;

  var _emscripten_glGetShaderSource = _glGetShaderSource;

  var _emscripten_glCompileShader = _glCompileShader;

  var _emscripten_glGetShaderInfoLog = _glGetShaderInfoLog;

  var _emscripten_glGetShaderiv = _glGetShaderiv;

  var _emscripten_glGetProgramiv = _glGetProgramiv;

  var _emscripten_glIsShader = _glIsShader;

  var _emscripten_glCreateProgram = _glCreateProgram;

  var _emscripten_glDeleteProgram = _glDeleteProgram;

  var _emscripten_glAttachShader = _glAttachShader;

  var _emscripten_glDetachShader = _glDetachShader;

  var _emscripten_glGetShaderPrecisionFormat = _glGetShaderPrecisionFormat;

  var _emscripten_glLinkProgram = _glLinkProgram;

  var _emscripten_glGetProgramInfoLog = _glGetProgramInfoLog;

  var _emscripten_glUseProgram = _glUseProgram;

  var _emscripten_glValidateProgram = _glValidateProgram;

  var _emscripten_glIsProgram = _glIsProgram;

  var _emscripten_glBindAttribLocation = _glBindAttribLocation;

  var _emscripten_glBindFramebuffer = _glBindFramebuffer;

  var _emscripten_glGenFramebuffers = _glGenFramebuffers;

  var _emscripten_glDeleteFramebuffers = _glDeleteFramebuffers;

  var _emscripten_glFramebufferRenderbuffer = _glFramebufferRenderbuffer;

  var _emscripten_glFramebufferTexture2D = _glFramebufferTexture2D;

  var _emscripten_glGetFramebufferAttachmentParameteriv = _glGetFramebufferAttachmentParameteriv;

  var _emscripten_glIsFramebuffer = _glIsFramebuffer;

  var _emscripten_glGenVertexArrays = _glGenVertexArrays;

  var _emscripten_glDeleteVertexArrays = _glDeleteVertexArrays;

  var _emscripten_glBindVertexArray = _glBindVertexArray;

  var _emscripten_glIsVertexArray = _glIsVertexArray;

  var _emscripten_glVertexPointer = _glVertexPointer;

  var _emscripten_glMatrixMode = _glMatrixMode;

  var _emscripten_glBegin = _glBegin;

  var _emscripten_glLoadIdentity = _glLoadIdentity;

  var _emscripten_glGenVertexArraysOES = _glGenVertexArraysOES;

  var _emscripten_glDeleteVertexArraysOES = _glDeleteVertexArraysOES;

  var _emscripten_glBindVertexArrayOES = _glBindVertexArrayOES;

  var _emscripten_glIsVertexArrayOES = _glIsVertexArrayOES;

  var _emscripten_glVertexAttribPointer = _glVertexAttribPointer;

  var _emscripten_glEnableVertexAttribArray = _glEnableVertexAttribArray;

  var _emscripten_glDisableVertexAttribArray = _glDisableVertexAttribArray;

  var _emscripten_glDrawArrays = _glDrawArrays;

  var _emscripten_glDrawElements = _glDrawElements;

  var _emscripten_glShaderBinary = _glShaderBinary;

  var _emscripten_glReleaseShaderCompiler = _glReleaseShaderCompiler;

  var _emscripten_glGetError = _glGetError;

  var _emscripten_glVertexAttribDivisor = _glVertexAttribDivisor;

  var _emscripten_glDrawArraysInstanced = _glDrawArraysInstanced;

  var _emscripten_glDrawElementsInstanced = _glDrawElementsInstanced;

  var _emscripten_glVertexAttribDivisorNV = _glVertexAttribDivisorNV;

  var _emscripten_glDrawArraysInstancedNV = _glDrawArraysInstancedNV;

  var _emscripten_glDrawElementsInstancedNV = _glDrawElementsInstancedNV;

  var _emscripten_glVertexAttribDivisorEXT = _glVertexAttribDivisorEXT;

  var _emscripten_glDrawArraysInstancedEXT = _glDrawArraysInstancedEXT;

  var _emscripten_glDrawElementsInstancedEXT = _glDrawElementsInstancedEXT;

  var _emscripten_glVertexAttribDivisorARB = _glVertexAttribDivisorARB;

  var _emscripten_glDrawArraysInstancedARB = _glDrawArraysInstancedARB;

  var _emscripten_glDrawElementsInstancedARB = _glDrawElementsInstancedARB;

  var _emscripten_glVertexAttribDivisorANGLE = _glVertexAttribDivisorANGLE;

  var _emscripten_glDrawArraysInstancedANGLE = _glDrawArraysInstancedANGLE;

  var _emscripten_glDrawElementsInstancedANGLE = _glDrawElementsInstancedANGLE;

  var _emscripten_glDrawBuffers = _glDrawBuffers;

  var _emscripten_glDrawBuffersEXT = _glDrawBuffersEXT;

  var _emscripten_glDrawBuffersWEBGL = _glDrawBuffersWEBGL;

  var _emscripten_glColorMask = _glColorMask;

  var _emscripten_glDepthMask = _glDepthMask;

  var _emscripten_glSampleCoverage = _glSampleCoverage;

  var _emscripten_glMultiDrawArrays = _glMultiDrawArrays;

  var _emscripten_glMultiDrawArraysANGLE = _glMultiDrawArraysANGLE;

  var _emscripten_glMultiDrawArraysWEBGL = _glMultiDrawArraysWEBGL;

  var _emscripten_glMultiDrawArraysInstancedANGLE = _glMultiDrawArraysInstancedANGLE;

  var _emscripten_glMultiDrawArraysInstancedWEBGL = _glMultiDrawArraysInstancedWEBGL;

  var _emscripten_glMultiDrawElements = _glMultiDrawElements;

  var _emscripten_glMultiDrawElementsANGLE = _glMultiDrawElementsANGLE;

  var _emscripten_glMultiDrawElementsWEBGL = _glMultiDrawElementsWEBGL;

  var _emscripten_glMultiDrawElementsInstancedANGLE = _glMultiDrawElementsInstancedANGLE;

  var _emscripten_glMultiDrawElementsInstancedWEBGL = _glMultiDrawElementsInstancedWEBGL;

  var _emscripten_glFinish = _glFinish;

  var _emscripten_glFlush = _glFlush;

  var _emscripten_glClearDepth = _glClearDepth;

  var _emscripten_glClearDepthf = _glClearDepthf;

  var _emscripten_glDepthFunc = _glDepthFunc;

  var _emscripten_glEnable = _glEnable;

  var _emscripten_glDisable = _glDisable;

  var _emscripten_glFrontFace = _glFrontFace;

  var _emscripten_glCullFace = _glCullFace;

  var _emscripten_glClear = _glClear;

  var _emscripten_glLineWidth = _glLineWidth;

  var _emscripten_glClearStencil = _glClearStencil;

  var _emscripten_glStencilMask = _glStencilMask;

  var _emscripten_glCheckFramebufferStatus = _glCheckFramebufferStatus;

  var _emscripten_glGenerateMipmap = _glGenerateMipmap;

  var _emscripten_glActiveTexture = _glActiveTexture;

  var _emscripten_glBlendEquation = _glBlendEquation;

  var _emscripten_glIsEnabled = _glIsEnabled;

  var _emscripten_glBlendFunc = _glBlendFunc;

  var _emscripten_glBlendEquationSeparate = _glBlendEquationSeparate;

  var _emscripten_glDepthRange = _glDepthRange;

  var _emscripten_glDepthRangef = _glDepthRangef;

  var _emscripten_glStencilMaskSeparate = _glStencilMaskSeparate;

  var _emscripten_glHint = _glHint;

  var _emscripten_glPolygonOffset = _glPolygonOffset;

  var _emscripten_glVertexAttrib1f = _glVertexAttrib1f;

  var _emscripten_glTexParameteri = _glTexParameteri;

  var _emscripten_glTexParameterf = _glTexParameterf;

  var _emscripten_glVertexAttrib2f = _glVertexAttrib2f;

  var _emscripten_glStencilFunc = _glStencilFunc;

  var _emscripten_glStencilOp = _glStencilOp;

  var _emscripten_glViewport = _glViewport;

  var _emscripten_glClearColor = _glClearColor;

  var _emscripten_glScissor = _glScissor;

  var _emscripten_glVertexAttrib3f = _glVertexAttrib3f;

  var _emscripten_glRenderbufferStorage = _glRenderbufferStorage;

  var _emscripten_glBlendFuncSeparate = _glBlendFuncSeparate;

  var _emscripten_glBlendColor = _glBlendColor;

  var _emscripten_glStencilFuncSeparate = _glStencilFuncSeparate;

  var _emscripten_glStencilOpSeparate = _glStencilOpSeparate;

  var _emscripten_glVertexAttrib4f = _glVertexAttrib4f;

  var _emscripten_glCopyTexImage2D = _glCopyTexImage2D;

  var _emscripten_glCopyTexSubImage2D = _glCopyTexSubImage2D;

  var writeGLArray = (arr, dst, dstLength, heapType) => {
      assert(arr);
      assert(typeof arr.length != 'undefined');
      var len = arr.length;
      var writeLength = dstLength < len ? dstLength : len;
      var heap = heapType ? HEAPF32 : HEAP32;
      // Works because HEAPF32 and HEAP32 have the same bytes-per-element
      dst = ((dst)>>2);
      for (var i = 0; i < writeLength; ++i) {
        heap[dst + i] = arr[i];
      }
      return len;
    };

  var webglPowerPreferences = ["default","low-power","high-performance"];

  
  
  
  
  
  /** @suppress {duplicate } */
  var _emscripten_webgl_do_create_context = (target, attributes) => {
      assert(attributes);
      var attr32 = ((attributes)>>2);
      var powerPreference = HEAP32[attr32 + (8>>2)];
      var contextAttributes = {
        'alpha': !!HEAP8[attributes + 0],
        'depth': !!HEAP8[attributes + 1],
        'stencil': !!HEAP8[attributes + 2],
        'antialias': !!HEAP8[attributes + 3],
        'premultipliedAlpha': !!HEAP8[attributes + 4],
        'preserveDrawingBuffer': !!HEAP8[attributes + 5],
        'powerPreference': webglPowerPreferences[powerPreference],
        'failIfMajorPerformanceCaveat': !!HEAP8[attributes + 12],
        // The following are not predefined WebGL context attributes in the WebGL specification, so the property names can be minified by Closure.
        majorVersion: HEAP32[attr32 + (16>>2)],
        minorVersion: HEAP32[attr32 + (20>>2)],
        enableExtensionsByDefault: HEAP8[attributes + 24],
        explicitSwapControl: HEAP8[attributes + 25],
        proxyContextToMainThread: HEAP32[attr32 + (28>>2)],
        renderViaOffscreenBackBuffer: HEAP8[attributes + 32]
      };
  
      var canvas = findCanvasEventTarget(target);
  
      if (!canvas) {
        return 0;
      }
  
      if (contextAttributes.explicitSwapControl) {
        return 0;
      }
  
      var contextHandle = GL.createContext(canvas, contextAttributes);
      return contextHandle;
    };
  var _emscripten_webgl_create_context = _emscripten_webgl_do_create_context;

  
  /** @suppress {duplicate } */
  var _emscripten_webgl_do_get_current_context = () => GL.currentContext ? GL.currentContext.handle : 0;
  var _emscripten_webgl_get_current_context = _emscripten_webgl_do_get_current_context;

  
  /** @suppress {duplicate } */
  var _emscripten_webgl_do_commit_frame = () => {
      if (!GL.currentContext || !GL.currentContext.GLctx) {
        return -3;
      }
  
      if (!GL.currentContext.attributes.explicitSwapControl) {
        return -3;
      }
      // We would do GL.currentContext.GLctx.commit(); here, but the current implementation
      // in browsers has removed it - swap is implicit, so this function is a no-op for now
      // (until/unless the spec changes).
      return 0;
    };
  var _emscripten_webgl_commit_frame = _emscripten_webgl_do_commit_frame;


  var _emscripten_webgl_make_context_current = (contextHandle) => {
      var success = GL.makeContextCurrent(contextHandle);
      return success ? 0 : -5;
    };


  var _emscripten_webgl_get_drawing_buffer_size = (contextHandle, width, height) => {
      var GLContext = GL.getContext(contextHandle);
  
      if (!GLContext || !GLContext.GLctx || !width || !height) {
        return -5;
      }
      HEAP32[((width)>>2)] = GLContext.GLctx.drawingBufferWidth;
      HEAP32[((height)>>2)] = GLContext.GLctx.drawingBufferHeight;
      return 0;
    };


  
  var _emscripten_webgl_get_context_attributes = (c, a) => {
      if (!a) return -5;
      c = GL.contexts[c];
      if (!c) return -3;
      var t = c.GLctx;
      if (!t) return -3;
      t = t.getContextAttributes();
  
      HEAP8[a] = t.alpha;
      HEAP8[(a)+(1)] = t.depth;
      HEAP8[(a)+(2)] = t.stencil;
      HEAP8[(a)+(3)] = t.antialias;
      HEAP8[(a)+(4)] = t.premultipliedAlpha;
      HEAP8[(a)+(5)] = t.preserveDrawingBuffer;
      var power = t['powerPreference'] && webglPowerPreferences.indexOf(t['powerPreference']);
      HEAP32[(((a)+(8))>>2)] = power;
      HEAP8[(a)+(12)] = t.failIfMajorPerformanceCaveat;
      HEAP32[(((a)+(16))>>2)] = c.version;
      HEAP32[(((a)+(20))>>2)] = 0;
      HEAP8[(a)+(24)] = c.attributes.enableExtensionsByDefault;
      return 0;
    };

  
  var _emscripten_webgl_destroy_context = (contextHandle) => {
      if (GL.currentContext == contextHandle) GL.currentContext = 0;
      GL.deleteContext(contextHandle);
    };

  
  
  
  
  
  var _emscripten_webgl_enable_extension = (contextHandle, extension) => {
      var context = GL.getContext(contextHandle);
      var extString = UTF8ToString(extension);
      if (extString.startsWith('GL_')) extString = extString.substr(3); // Allow enabling extensions both with "GL_" prefix and without.
  
      // Switch-board that pulls in code for all GL extensions, even if those are not used :/
      // Build with -sGL_SUPPORT_SIMPLE_ENABLE_EXTENSIONS=0 to avoid this.
  
      // Obtain function entry points to WebGL 1 extension related functions.
      if (extString == 'ANGLE_instanced_arrays') webgl_enable_ANGLE_instanced_arrays(GLctx);
      if (extString == 'OES_vertex_array_object') webgl_enable_OES_vertex_array_object(GLctx);
      if (extString == 'WEBGL_draw_buffers') webgl_enable_WEBGL_draw_buffers(GLctx);
  
      if (extString == 'WEBGL_multi_draw') webgl_enable_WEBGL_multi_draw(GLctx);
  
      var ext = context.GLctx.getExtension(extString);
      return !!ext;
    };

  var _emscripten_supports_offscreencanvas = () =>
      // TODO: Add a new build mode, e.g. OFFSCREENCANVAS_SUPPORT=2, which
      // necessitates OffscreenCanvas support at build time, and "return 1;" here in that build mode.
      0;

  
  
  var registerWebGlEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) => {
  
      var webGlEventHandlerFunc = (e = event) => {
        if (((a1, a2, a3) => dynCall_iiii(callbackfunc, a1, a2, a3))(eventTypeId, 0, userData)) e.preventDefault();
      };
  
      var eventHandler = {
        target: findEventTarget(target),
        eventTypeString,
        callbackfunc,
        handlerFunc: webGlEventHandlerFunc,
        useCapture
      };
      JSEvents.registerOrRemoveHandler(eventHandler);
    };

  
  var _emscripten_set_webglcontextlost_callback_on_thread = (target, userData, useCapture, callbackfunc, targetThread) => {
      registerWebGlEventCallback(target, userData, useCapture, callbackfunc, 31, "webglcontextlost", targetThread);
      return 0;
    };

  
  var _emscripten_set_webglcontextrestored_callback_on_thread = (target, userData, useCapture, callbackfunc, targetThread) => {
      registerWebGlEventCallback(target, userData, useCapture, callbackfunc, 32, "webglcontextrestored", targetThread);
      return 0;
    };

  var _emscripten_is_webgl_context_lost = (contextHandle) => {
      return !GL.contexts[contextHandle] || GL.contexts[contextHandle].GLctx.isContextLost(); // No context ~> lost context.
    };

  
  var _emscripten_webgl_get_supported_extensions = () =>
      stringToNewUTF8(GLctx.getSupportedExtensions().join(' '));

  var _emscripten_webgl_get_program_parameter_d = (program, param) =>
      GLctx.getProgramParameter(GL.programs[program], param);

  
  var _emscripten_webgl_get_program_info_log_utf8 = (program) =>
      stringToNewUTF8(GLctx.getProgramInfoLog(GL.programs[program]));

  var _emscripten_webgl_get_shader_parameter_d = (shader, param) =>
      GLctx.getShaderParameter(GL.shaders[shader], param);

  
  var _emscripten_webgl_get_shader_info_log_utf8 = (shader) =>
      stringToNewUTF8(GLctx.getShaderInfoLog(GL.shaders[shader]));

  
  var _emscripten_webgl_get_shader_source_utf8 = (shader) =>
      stringToNewUTF8(GLctx.getShaderSource(GL.shaders[shader]));

  var _emscripten_webgl_get_vertex_attrib_d = (index, param) =>
      GLctx.getVertexAttrib(index, param);

  var _emscripten_webgl_get_vertex_attrib_o = (index, param) => {
      var obj = GLctx.getVertexAttrib(index, param);
      return obj?.name;
    };

  
  var _emscripten_webgl_get_vertex_attrib_v = (index, param, dst, dstLength, dstType) =>
      writeGLArray(GLctx.getVertexAttrib(index, param), dst, dstLength, dstType);

  
  var _emscripten_webgl_get_uniform_d = (program, location) =>
      GLctx.getUniform(GL.programs[program], webglGetUniformLocation(location));

  
  
  var _emscripten_webgl_get_uniform_v = (program, location, dst, dstLength, dstType) =>
      writeGLArray(GLctx.getUniform(GL.programs[program], webglGetUniformLocation(location)), dst, dstLength, dstType);

  
  var _emscripten_webgl_get_parameter_v = (param, dst, dstLength, dstType) =>
      writeGLArray(GLctx.getParameter(param), dst, dstLength, dstType);

  var _emscripten_webgl_get_parameter_d = (param) => GLctx.getParameter(param);

  var _emscripten_webgl_get_parameter_o = (param) => {
      var obj = GLctx.getParameter(param);
      return obj?.name;
    };

  
  var _emscripten_webgl_get_parameter_utf8 = (param) => stringToNewUTF8(GLctx.getParameter(param));

  
  var _emscripten_webgl_get_parameter_i64v = (param, dst) => writeI53ToI64(dst, GLctx.getParameter(param));

  
  var AL = {
  QUEUE_INTERVAL:25,
  QUEUE_LOOKAHEAD:0.1,
  DEVICE_NAME:"Emscripten OpenAL",
  CAPTURE_DEVICE_NAME:"Emscripten OpenAL capture",
  ALC_EXTENSIONS:{
  ALC_SOFT_pause_device:true,
  ALC_SOFT_HRTF:true,
  },
  AL_EXTENSIONS:{
  AL_EXT_float32:true,
  AL_SOFT_loop_points:true,
  AL_SOFT_source_length:true,
  AL_EXT_source_distance_model:true,
  AL_SOFT_source_spatialize:true,
  },
  _alcErr:0,
  alcErr:0,
  deviceRefCounts:{
  },
  alcStringCache:{
  },
  paused:false,
  stringCache:{
  },
  contexts:{
  },
  currentCtx:null,
  buffers:{
  0:{
  id:0,
  refCount:0,
  audioBuf:null,
  frequency:0,
  bytesPerSample:2,
  channels:1,
  length:0,
  },
  },
  paramArray:[],
  _nextId:1,
  newId:() => AL.freeIds.length > 0 ? AL.freeIds.pop() : AL._nextId++,
  freeIds:[],
  scheduleContextAudio:(ctx) => {
        // If we are animating using the requestAnimationFrame method, then the main loop does not run when in the background.
        // To give a perfect glitch-free audio stop when switching from foreground to background, we need to avoid updating
        // audio altogether when in the background, so detect that case and kill audio buffer streaming if so.
        if (Browser.mainLoop.timingMode === 1 && document['visibilityState'] != 'visible') {
          return;
        }
  
        for (var i in ctx.sources) {
          AL.scheduleSourceAudio(ctx.sources[i]);
        }
      },
  scheduleSourceAudio:(src, lookahead) => {
        // See comment on scheduleContextAudio above.
        if (Browser.mainLoop.timingMode === 1 && document['visibilityState'] != 'visible') {
          return;
        }
        if (src.state !== 4114) {
          return;
        }
  
        var currentTime = AL.updateSourceTime(src);
  
        var startTime = src.bufStartTime;
        var startOffset = src.bufOffset;
        var bufCursor = src.bufsProcessed;
  
        // Advance past any audio that is already scheduled
        for (var i = 0; i < src.audioQueue.length; i++) {
          var audioSrc = src.audioQueue[i];
          startTime = audioSrc._startTime + audioSrc._duration;
          startOffset = 0.0;
          bufCursor += audioSrc._skipCount + 1;
        }
  
        if (!lookahead) {
          lookahead = AL.QUEUE_LOOKAHEAD;
        }
        var lookaheadTime = currentTime + lookahead;
        var skipCount = 0;
        while (startTime < lookaheadTime) {
          if (bufCursor >= src.bufQueue.length) {
            if (src.looping) {
              bufCursor %= src.bufQueue.length;
            } else {
              break;
            }
          }
  
          var buf = src.bufQueue[bufCursor % src.bufQueue.length];
          // If the buffer contains no data, skip it
          if (buf.length === 0) {
            skipCount++;
            // If we've gone through the whole queue and everything is 0 length, just give up
            if (skipCount === src.bufQueue.length) {
              break;
            }
          } else {
            var audioSrc = src.context.audioCtx.createBufferSource();
            audioSrc.buffer = buf.audioBuf;
            audioSrc.playbackRate.value = src.playbackRate;
            if (buf.audioBuf._loopStart || buf.audioBuf._loopEnd) {
              audioSrc.loopStart = buf.audioBuf._loopStart;
              audioSrc.loopEnd = buf.audioBuf._loopEnd;
            }
  
            var duration = 0.0;
            // If the source is a looping static buffer, use native looping for gapless playback
            if (src.type === 4136 && src.looping) {
              duration = Number.POSITIVE_INFINITY;
              audioSrc.loop = true;
              if (buf.audioBuf._loopStart) {
                audioSrc.loopStart = buf.audioBuf._loopStart;
              }
              if (buf.audioBuf._loopEnd) {
                audioSrc.loopEnd = buf.audioBuf._loopEnd;
              }
            } else {
              duration = (buf.audioBuf.duration - startOffset) / src.playbackRate;
            }
  
            audioSrc._startOffset = startOffset;
            audioSrc._duration = duration;
            audioSrc._skipCount = skipCount;
            skipCount = 0;
  
            audioSrc.connect(src.gain);
  
            if (typeof audioSrc.start != 'undefined') {
              // Sample the current time as late as possible to mitigate drift
              startTime = Math.max(startTime, src.context.audioCtx.currentTime);
              audioSrc.start(startTime, startOffset);
            } else if (typeof audioSrc.noteOn != 'undefined') {
              startTime = Math.max(startTime, src.context.audioCtx.currentTime);
              audioSrc.noteOn(startTime);
            }
            audioSrc._startTime = startTime;
            src.audioQueue.push(audioSrc);
  
            startTime += duration;
          }
  
          startOffset = 0.0;
          bufCursor++;
        }
      },
  updateSourceTime:(src) => {
        var currentTime = src.context.audioCtx.currentTime;
        if (src.state !== 4114) {
          return currentTime;
        }
  
        // if the start time is unset, determine it based on the current offset.
        // This will be the case when a source is resumed after being paused, and
        // allows us to pretend that the source actually started playing some time
        // in the past such that it would just now have reached the stored offset.
        if (!isFinite(src.bufStartTime)) {
          src.bufStartTime = currentTime - src.bufOffset / src.playbackRate;
          src.bufOffset = 0.0;
        }
  
        var nextStartTime = 0.0;
        while (src.audioQueue.length) {
          var audioSrc = src.audioQueue[0];
          src.bufsProcessed += audioSrc._skipCount;
          nextStartTime = audioSrc._startTime + audioSrc._duration; // n.b. audioSrc._duration already factors in playbackRate, so no divide by src.playbackRate on it.
  
          if (currentTime < nextStartTime) {
            break;
          }
  
          src.audioQueue.shift();
          src.bufStartTime = nextStartTime;
          src.bufOffset = 0.0;
          src.bufsProcessed++;
        }
  
        if (src.bufsProcessed >= src.bufQueue.length && !src.looping) {
          // The source has played its entire queue and is non-looping, so just mark it as stopped.
          AL.setSourceState(src, 4116);
        } else if (src.type === 4136 && src.looping) {
          // If the source is a looping static buffer, determine the buffer offset based on the loop points
          var buf = src.bufQueue[0];
          if (buf.length === 0) {
            src.bufOffset = 0.0;
          } else {
            var delta = (currentTime - src.bufStartTime) * src.playbackRate;
            var loopStart = buf.audioBuf._loopStart || 0.0;
            var loopEnd = buf.audioBuf._loopEnd || buf.audioBuf.duration;
            if (loopEnd <= loopStart) {
              loopEnd = buf.audioBuf.duration;
            }
  
            if (delta < loopEnd) {
              src.bufOffset = delta;
            } else {
              src.bufOffset = loopStart + (delta - loopStart) % (loopEnd - loopStart);
            }
          }
        } else if (src.audioQueue[0]) {
          // The source is still actively playing, so we just need to calculate where we are in the current buffer
          // so it can be remembered if the source gets paused.
          src.bufOffset = (currentTime - src.audioQueue[0]._startTime) * src.playbackRate;
        } else {
          // The source hasn't finished yet, but there is no scheduled audio left for it. This can be because
          // the source has just been started/resumed, or due to an underrun caused by a long blocking operation.
          // We need to determine what state we would be in by this point in time so that when we next schedule
          // audio playback, it will be just as if no underrun occurred.
  
          if (src.type !== 4136 && src.looping) {
            // if the source is a looping buffer queue, let's first calculate the queue duration, so we can
            // quickly fast forward past any full loops of the queue and only worry about the remainder.
            var srcDuration = AL.sourceDuration(src) / src.playbackRate;
            if (srcDuration > 0.0) {
              src.bufStartTime += Math.floor((currentTime - src.bufStartTime) / srcDuration) * srcDuration;
            }
          }
  
          // Since we've already skipped any full-queue loops if there were any, we just need to find
          // out where in the queue the remaining time puts us, which won't require stepping through the
          // entire queue more than once.
          for (var i = 0; i < src.bufQueue.length; i++) {
            if (src.bufsProcessed >= src.bufQueue.length) {
              if (src.looping) {
                src.bufsProcessed %= src.bufQueue.length;
              } else {
                AL.setSourceState(src, 4116);
                break;
              }
            }
  
            var buf = src.bufQueue[src.bufsProcessed];
            if (buf.length > 0) {
              nextStartTime = src.bufStartTime + buf.audioBuf.duration / src.playbackRate;
  
              if (currentTime < nextStartTime) {
                src.bufOffset = (currentTime - src.bufStartTime) * src.playbackRate;
                break;
              }
  
              src.bufStartTime = nextStartTime;
            }
  
            src.bufOffset = 0.0;
            src.bufsProcessed++;
          }
        }
  
        return currentTime;
      },
  cancelPendingSourceAudio:(src) => {
        AL.updateSourceTime(src);
  
        for (var i = 1; i < src.audioQueue.length; i++) {
          var audioSrc = src.audioQueue[i];
          audioSrc.stop();
        }
  
        if (src.audioQueue.length > 1) {
          src.audioQueue.length = 1;
        }
      },
  stopSourceAudio:(src) => {
        for (var i = 0; i < src.audioQueue.length; i++) {
          src.audioQueue[i].stop();
        }
        src.audioQueue.length = 0;
      },
  setSourceState:(src, state) => {
        if (state === 4114) {
          if (src.state === 4114 || src.state == 4116) {
            src.bufsProcessed = 0;
            src.bufOffset = 0.0;
          } else {
          }
  
          AL.stopSourceAudio(src);
  
          src.state = 4114;
          src.bufStartTime = Number.NEGATIVE_INFINITY;
          AL.scheduleSourceAudio(src);
        } else if (state === 4115) {
          if (src.state === 4114) {
            // Store off the current offset to restore with on resume.
            AL.updateSourceTime(src);
            AL.stopSourceAudio(src);
  
            src.state = 4115;
          }
        } else if (state === 4116) {
          if (src.state !== 4113) {
            src.state = 4116;
            src.bufsProcessed = src.bufQueue.length;
            src.bufStartTime = Number.NEGATIVE_INFINITY;
            src.bufOffset = 0.0;
            AL.stopSourceAudio(src);
          }
        } else if (state === 4113) {
          if (src.state !== 4113) {
            src.state = 4113;
            src.bufsProcessed = 0;
            src.bufStartTime = Number.NEGATIVE_INFINITY;
            src.bufOffset = 0.0;
            AL.stopSourceAudio(src);
          }
        }
      },
  initSourcePanner:(src) => {
        if (src.type === 0x1030 /* AL_UNDETERMINED */) {
          return;
        }
  
        // Find the first non-zero buffer in the queue to determine the proper format
        var templateBuf = AL.buffers[0];
        for (var i = 0; i < src.bufQueue.length; i++) {
          if (src.bufQueue[i].id !== 0) {
            templateBuf = src.bufQueue[i];
            break;
          }
        }
        // Create a panner if AL_SOURCE_SPATIALIZE_SOFT is set to true, or alternatively if it's set to auto and the source is mono
        if (src.spatialize === 1 || (src.spatialize === 2 /* AL_AUTO_SOFT */ && templateBuf.channels === 1)) {
          if (src.panner) {
            return;
          }
          src.panner = src.context.audioCtx.createPanner();
  
          AL.updateSourceGlobal(src);
          AL.updateSourceSpace(src);
  
          src.panner.connect(src.context.gain);
          src.gain.disconnect();
          src.gain.connect(src.panner);
        } else {
          if (!src.panner) {
            return;
          }
  
          src.panner.disconnect();
          src.gain.disconnect();
          src.gain.connect(src.context.gain);
          src.panner = null;
        }
      },
  updateContextGlobal:(ctx) => {
        for (var i in ctx.sources) {
          AL.updateSourceGlobal(ctx.sources[i]);
        }
      },
  updateSourceGlobal:(src) => {
        var panner = src.panner;
        if (!panner) {
          return;
        }
  
        panner.refDistance = src.refDistance;
        panner.maxDistance = src.maxDistance;
        panner.rolloffFactor = src.rolloffFactor;
  
        panner.panningModel = src.context.hrtf ? 'HRTF' : 'equalpower';
  
        // Use the source's distance model if AL_SOURCE_DISTANCE_MODEL is enabled
        var distanceModel = src.context.sourceDistanceModel ? src.distanceModel : src.context.distanceModel;
        switch (distanceModel) {
        case 0:
          panner.distanceModel = 'inverse';
          panner.refDistance = 3.40282e38 /* FLT_MAX */;
          break;
        case 0xd001 /* AL_INVERSE_DISTANCE */:
        case 0xd002 /* AL_INVERSE_DISTANCE_CLAMPED */:
          panner.distanceModel = 'inverse';
          break;
        case 0xd003 /* AL_LINEAR_DISTANCE */:
        case 0xd004 /* AL_LINEAR_DISTANCE_CLAMPED */:
          panner.distanceModel = 'linear';
          break;
        case 0xd005 /* AL_EXPONENT_DISTANCE */:
        case 0xd006 /* AL_EXPONENT_DISTANCE_CLAMPED */:
          panner.distanceModel = 'exponential';
          break;
        }
      },
  updateListenerSpace:(ctx) => {
        var listener = ctx.audioCtx.listener;
        if (listener.positionX) {
          listener.positionX.value = ctx.listener.position[0];
          listener.positionY.value = ctx.listener.position[1];
          listener.positionZ.value = ctx.listener.position[2];
        } else {
          listener.setPosition(ctx.listener.position[0], ctx.listener.position[1], ctx.listener.position[2]);
        }
        if (listener.forwardX) {
          listener.forwardX.value = ctx.listener.direction[0];
          listener.forwardY.value = ctx.listener.direction[1];
          listener.forwardZ.value = ctx.listener.direction[2];
          listener.upX.value = ctx.listener.up[0];
          listener.upY.value = ctx.listener.up[1];
          listener.upZ.value = ctx.listener.up[2];
        } else {
          listener.setOrientation(
            ctx.listener.direction[0], ctx.listener.direction[1], ctx.listener.direction[2],
            ctx.listener.up[0], ctx.listener.up[1], ctx.listener.up[2]);
        }
  
        // Update sources that are relative to the listener
        for (var i in ctx.sources) {
          AL.updateSourceSpace(ctx.sources[i]);
        }
      },
  updateSourceSpace:(src) => {
        if (!src.panner) {
          return;
        }
        var panner = src.panner;
  
        var posX = src.position[0];
        var posY = src.position[1];
        var posZ = src.position[2];
        var dirX = src.direction[0];
        var dirY = src.direction[1];
        var dirZ = src.direction[2];
  
        var listener = src.context.listener;
        var lPosX = listener.position[0];
        var lPosY = listener.position[1];
        var lPosZ = listener.position[2];
  
        // WebAudio does spatialization in world-space coordinates, meaning both the buffer sources and
        // the listener position are in the same absolute coordinate system relative to a fixed origin.
        // By default, OpenAL works this way as well, but it also provides a "listener relative" mode, where
        // a buffer source's coordinate are interpreted not in absolute world space, but as being relative
        // to the listener object itself, so as the listener moves the source appears to move with it
        // with no update required. Since web audio does not support this mode, we must transform the source
        // coordinates from listener-relative space to absolute world space.
        //
        // We do this via affine transformation matrices applied to the source position and source direction.
        // A change-of-basis converts from listener-space displacements to world-space displacements,
        // which must be done for both the source position and direction. Lastly, the source position must be
        // added to the listener position to get the final source position, since the source position represents
        // a displacement from the listener.
        if (src.relative) {
          // Negate the listener direction since forward is -Z.
          var lBackX = -listener.direction[0];
          var lBackY = -listener.direction[1];
          var lBackZ = -listener.direction[2];
          var lUpX = listener.up[0];
          var lUpY = listener.up[1];
          var lUpZ = listener.up[2];
  
          var inverseMagnitude = (x, y, z) => {
            var length = Math.sqrt(x * x + y * y + z * z);
  
            if (length < Number.EPSILON) {
              return 0.0;
            }
  
            return 1.0 / length;
          };
  
          // Normalize the Back vector
          var invMag = inverseMagnitude(lBackX, lBackY, lBackZ);
          lBackX *= invMag;
          lBackY *= invMag;
          lBackZ *= invMag;
  
          // ...and the Up vector
          invMag = inverseMagnitude(lUpX, lUpY, lUpZ);
          lUpX *= invMag;
          lUpY *= invMag;
          lUpZ *= invMag;
  
          // Calculate the Right vector as the cross product of the Up and Back vectors
          var lRightX = (lUpY * lBackZ - lUpZ * lBackY);
          var lRightY = (lUpZ * lBackX - lUpX * lBackZ);
          var lRightZ = (lUpX * lBackY - lUpY * lBackX);
  
          // Back and Up might not be exactly perpendicular, so the cross product also needs normalization
          invMag = inverseMagnitude(lRightX, lRightY, lRightZ);
          lRightX *= invMag;
          lRightY *= invMag;
          lRightZ *= invMag;
  
          // Recompute Up from the now orthonormal Right and Back vectors so we have a fully orthonormal basis
          lUpX = (lBackY * lRightZ - lBackZ * lRightY);
          lUpY = (lBackZ * lRightX - lBackX * lRightZ);
          lUpZ = (lBackX * lRightY - lBackY * lRightX);
  
          var oldX = dirX;
          var oldY = dirY;
          var oldZ = dirZ;
  
          // Use our 3 vectors to apply a change-of-basis matrix to the source direction
          dirX = oldX * lRightX + oldY * lUpX + oldZ * lBackX;
          dirY = oldX * lRightY + oldY * lUpY + oldZ * lBackY;
          dirZ = oldX * lRightZ + oldY * lUpZ + oldZ * lBackZ;
  
          oldX = posX;
          oldY = posY;
          oldZ = posZ;
  
          // ...and to the source position
          posX = oldX * lRightX + oldY * lUpX + oldZ * lBackX;
          posY = oldX * lRightY + oldY * lUpY + oldZ * lBackY;
          posZ = oldX * lRightZ + oldY * lUpZ + oldZ * lBackZ;
  
          // The change-of-basis corrects the orientation, but the origin is still the listener.
          // Translate the source position by the listener position to finish.
          posX += lPosX;
          posY += lPosY;
          posZ += lPosZ;
        }
  
        if (panner.positionX) {
          // Assigning to panner.positionX/Y/Z unnecessarily seems to cause performance issues
          // See https://github.com/emscripten-core/emscripten/issues/15847
  
          if (posX != panner.positionX.value) panner.positionX.value = posX;
          if (posY != panner.positionY.value) panner.positionY.value = posY;
          if (posZ != panner.positionZ.value) panner.positionZ.value = posZ;
        } else {
          panner.setPosition(posX, posY, posZ);
        }
        if (panner.orientationX) {
          // Assigning to panner.orientation/Y/Z unnecessarily seems to cause performance issues
          // See https://github.com/emscripten-core/emscripten/issues/15847
  
          if (dirX != panner.orientationX.value) panner.orientationX.value = dirX;
          if (dirY != panner.orientationY.value) panner.orientationY.value = dirY;
          if (dirZ != panner.orientationZ.value) panner.orientationZ.value = dirZ;
        } else {
          panner.setOrientation(dirX, dirY, dirZ);
        }
  
        var oldShift = src.dopplerShift;
        var velX = src.velocity[0];
        var velY = src.velocity[1];
        var velZ = src.velocity[2];
        var lVelX = listener.velocity[0];
        var lVelY = listener.velocity[1];
        var lVelZ = listener.velocity[2];
        if (posX === lPosX && posY === lPosY && posZ === lPosZ
          || velX === lVelX && velY === lVelY && velZ === lVelZ)
        {
          src.dopplerShift = 1.0;
        } else {
          // Doppler algorithm from 1.1 spec
          var speedOfSound = src.context.speedOfSound;
          var dopplerFactor = src.context.dopplerFactor;
  
          var slX = lPosX - posX;
          var slY = lPosY - posY;
          var slZ = lPosZ - posZ;
  
          var magSl = Math.sqrt(slX * slX + slY * slY + slZ * slZ);
          var vls = (slX * lVelX + slY * lVelY + slZ * lVelZ) / magSl;
          var vss = (slX * velX + slY * velY + slZ * velZ) / magSl;
  
          vls = Math.min(vls, speedOfSound / dopplerFactor);
          vss = Math.min(vss, speedOfSound / dopplerFactor);
  
          src.dopplerShift = (speedOfSound - dopplerFactor * vls) / (speedOfSound - dopplerFactor * vss);
        }
        if (src.dopplerShift !== oldShift) {
          AL.updateSourceRate(src);
        }
      },
  updateSourceRate:(src) => {
        if (src.state === 4114) {
          // clear scheduled buffers
          AL.cancelPendingSourceAudio(src);
  
          var audioSrc = src.audioQueue[0];
          if (!audioSrc) {
            return; // It is possible that AL.scheduleContextAudio() has not yet fed the next buffer, if so, skip.
          }
  
          var duration;
          if (src.type === 4136 && src.looping) {
            duration = Number.POSITIVE_INFINITY;
          } else {
            // audioSrc._duration is expressed after factoring in playbackRate, so when changing playback rate, need
            // to recompute/rescale the rate to the new playback speed.
            duration = (audioSrc.buffer.duration - audioSrc._startOffset) / src.playbackRate;
          }
  
          audioSrc._duration = duration;
          audioSrc.playbackRate.value = src.playbackRate;
  
          // reschedule buffers with the new playbackRate
          AL.scheduleSourceAudio(src);
        }
      },
  sourceDuration:(src) => {
        var length = 0.0;
        for (var i = 0; i < src.bufQueue.length; i++) {
          var audioBuf = src.bufQueue[i].audioBuf;
          length += audioBuf ? audioBuf.duration : 0.0;
        }
        return length;
      },
  sourceTell:(src) => {
        AL.updateSourceTime(src);
  
        var offset = 0.0;
        for (var i = 0; i < src.bufsProcessed; i++) {
          if (src.bufQueue[i].audioBuf) {
            offset += src.bufQueue[i].audioBuf.duration;
          }
        }
        offset += src.bufOffset;
  
        return offset;
      },
  sourceSeek:(src, offset) => {
        var playing = src.state == 4114;
        if (playing) {
          AL.setSourceState(src, 4113);
        }
  
        if (src.bufQueue[src.bufsProcessed].audioBuf !== null) {
          src.bufsProcessed = 0;
          while (offset > src.bufQueue[src.bufsProcessed].audioBuf.duration) {
            offset -= src.bufQueue[src.bufsProcessed].audioBuf.duration;
            src.bufsProcessed++;
          }
  
          src.bufOffset = offset;
        }
  
        if (playing) {
          AL.setSourceState(src, 4114);
        }
      },
  getGlobalParam:(funcname, param) => {
        if (!AL.currentCtx) {
          return null;
        }
  
        switch (param) {
        case 49152:
          return AL.currentCtx.dopplerFactor;
        case 49155:
          return AL.currentCtx.speedOfSound;
        case 53248:
          return AL.currentCtx.distanceModel;
        default:
          AL.currentCtx.err = 40962;
          return null;
        }
      },
  setGlobalParam:(funcname, param, value) => {
        if (!AL.currentCtx) {
          return;
        }
  
        switch (param) {
        case 49152:
          if (!Number.isFinite(value) || value < 0.0) { // Strictly negative values are disallowed
            AL.currentCtx.err = 40963;
            return;
          }
  
          AL.currentCtx.dopplerFactor = value;
          AL.updateListenerSpace(AL.currentCtx);
          break;
        case 49155:
          if (!Number.isFinite(value) || value <= 0.0) { // Negative or zero values are disallowed
            AL.currentCtx.err = 40963;
            return;
          }
  
          AL.currentCtx.speedOfSound = value;
          AL.updateListenerSpace(AL.currentCtx);
          break;
        case 53248:
          switch (value) {
          case 0:
          case 0xd001 /* AL_INVERSE_DISTANCE */:
          case 0xd002 /* AL_INVERSE_DISTANCE_CLAMPED */:
          case 0xd003 /* AL_LINEAR_DISTANCE */:
          case 0xd004 /* AL_LINEAR_DISTANCE_CLAMPED */:
          case 0xd005 /* AL_EXPONENT_DISTANCE */:
          case 0xd006 /* AL_EXPONENT_DISTANCE_CLAMPED */:
            AL.currentCtx.distanceModel = value;
            AL.updateContextGlobal(AL.currentCtx);
            break;
          default:
            AL.currentCtx.err = 40963;
            return;
          }
          break;
        default:
          AL.currentCtx.err = 40962;
          return;
        }
      },
  getListenerParam:(funcname, param) => {
        if (!AL.currentCtx) {
          return null;
        }
  
        switch (param) {
        case 4100:
          return AL.currentCtx.listener.position;
        case 4102:
          return AL.currentCtx.listener.velocity;
        case 4111:
          return AL.currentCtx.listener.direction.concat(AL.currentCtx.listener.up);
        case 4106:
          return AL.currentCtx.gain.gain.value;
        default:
          AL.currentCtx.err = 40962;
          return null;
        }
      },
  setListenerParam:(funcname, param, value) => {
        if (!AL.currentCtx) {
          return;
        }
        if (value === null) {
          AL.currentCtx.err = 40962;
          return;
        }
  
        var listener = AL.currentCtx.listener;
        switch (param) {
        case 4100:
          if (!Number.isFinite(value[0]) || !Number.isFinite(value[1]) || !Number.isFinite(value[2])) {
            AL.currentCtx.err = 40963;
            return;
          }
  
          listener.position[0] = value[0];
          listener.position[1] = value[1];
          listener.position[2] = value[2];
          AL.updateListenerSpace(AL.currentCtx);
          break;
        case 4102:
          if (!Number.isFinite(value[0]) || !Number.isFinite(value[1]) || !Number.isFinite(value[2])) {
            AL.currentCtx.err = 40963;
            return;
          }
  
          listener.velocity[0] = value[0];
          listener.velocity[1] = value[1];
          listener.velocity[2] = value[2];
          AL.updateListenerSpace(AL.currentCtx);
          break;
        case 4106:
          if (!Number.isFinite(value) || value < 0.0) {
            AL.currentCtx.err = 40963;
            return;
          }
  
          AL.currentCtx.gain.gain.value = value;
          break;
        case 4111:
          if (!Number.isFinite(value[0]) || !Number.isFinite(value[1]) || !Number.isFinite(value[2])
            || !Number.isFinite(value[3]) || !Number.isFinite(value[4]) || !Number.isFinite(value[5])
          ) {
            AL.currentCtx.err = 40963;
            return;
          }
  
          listener.direction[0] = value[0];
          listener.direction[1] = value[1];
          listener.direction[2] = value[2];
          listener.up[0] = value[3];
          listener.up[1] = value[4];
          listener.up[2] = value[5];
          AL.updateListenerSpace(AL.currentCtx);
          break;
        default:
          AL.currentCtx.err = 40962;
          return;
        }
      },
  getBufferParam:(funcname, bufferId, param) => {
        if (!AL.currentCtx) {
          return;
        }
        var buf = AL.buffers[bufferId];
        if (!buf || bufferId === 0) {
          AL.currentCtx.err = 40961;
          return;
        }
  
        switch (param) {
        case 0x2001 /* AL_FREQUENCY */:
          return buf.frequency;
        case 0x2002 /* AL_BITS */:
          return buf.bytesPerSample * 8;
        case 0x2003 /* AL_CHANNELS */:
          return buf.channels;
        case 0x2004 /* AL_SIZE */:
          return buf.length * buf.bytesPerSample * buf.channels;
        case 0x2015 /* AL_LOOP_POINTS_SOFT */:
          if (buf.length === 0) {
            return [0, 0];
          }
          return [
            (buf.audioBuf._loopStart || 0.0) * buf.frequency,
            (buf.audioBuf._loopEnd || buf.length) * buf.frequency
          ];
        default:
          AL.currentCtx.err = 40962;
          return null;
        }
      },
  setBufferParam:(funcname, bufferId, param, value) => {
        if (!AL.currentCtx) {
          return;
        }
        var buf = AL.buffers[bufferId];
        if (!buf || bufferId === 0) {
          AL.currentCtx.err = 40961;
          return;
        }
        if (value === null) {
          AL.currentCtx.err = 40962;
          return;
        }
  
        switch (param) {
        case 0x2004 /* AL_SIZE */:
          if (value !== 0) {
            AL.currentCtx.err = 40963;
            return;
          }
  
          // Per the spec, setting AL_SIZE to 0 is a legal NOP.
          break;
        case 0x2015 /* AL_LOOP_POINTS_SOFT */:
          if (value[0] < 0 || value[0] > buf.length || value[1] < 0 || value[1] > buf.Length || value[0] >= value[1]) {
            AL.currentCtx.err = 40963;
            return;
          }
          if (buf.refCount > 0) {
            AL.currentCtx.err = 40964;
            return;
          }
  
          if (buf.audioBuf) {
            buf.audioBuf._loopStart = value[0] / buf.frequency;
            buf.audioBuf._loopEnd = value[1] / buf.frequency;
          }
          break;
        default:
          AL.currentCtx.err = 40962;
          return;
        }
      },
  getSourceParam:(funcname, sourceId, param) => {
        if (!AL.currentCtx) {
          return null;
        }
        var src = AL.currentCtx.sources[sourceId];
        if (!src) {
          AL.currentCtx.err = 40961;
          return null;
        }
  
        switch (param) {
        case 0x202 /* AL_SOURCE_RELATIVE */:
          return src.relative;
        case 0x1001 /* AL_CONE_INNER_ANGLE */:
          return src.coneInnerAngle;
        case 0x1002 /* AL_CONE_OUTER_ANGLE */:
          return src.coneOuterAngle;
        case 0x1003 /* AL_PITCH */:
          return src.pitch;
        case 4100:
          return src.position;
        case 4101:
          return src.direction;
        case 4102:
          return src.velocity;
        case 0x1007 /* AL_LOOPING */:
          return src.looping;
        case 0x1009 /* AL_BUFFER */:
          if (src.type === 4136) {
            return src.bufQueue[0].id;
          }
          return 0;
        case 4106:
          return src.gain.gain.value;
         case 0x100D /* AL_MIN_GAIN */:
          return src.minGain;
        case 0x100E /* AL_MAX_GAIN */:
          return src.maxGain;
        case 0x1010 /* AL_SOURCE_STATE */:
          return src.state;
        case 0x1015 /* AL_BUFFERS_QUEUED */:
          if (src.bufQueue.length === 1 && src.bufQueue[0].id === 0) {
            return 0;
          }
          return src.bufQueue.length;
        case 0x1016 /* AL_BUFFERS_PROCESSED */:
          if ((src.bufQueue.length === 1 && src.bufQueue[0].id === 0) || src.looping) {
            return 0;
          }
          return src.bufsProcessed;
        case 0x1020 /* AL_REFERENCE_DISTANCE */:
          return src.refDistance;
        case 0x1021 /* AL_ROLLOFF_FACTOR */:
          return src.rolloffFactor;
        case 0x1022 /* AL_CONE_OUTER_GAIN */:
          return src.coneOuterGain;
        case 0x1023 /* AL_MAX_DISTANCE */:
          return src.maxDistance;
        case 0x1024 /* AL_SEC_OFFSET */:
          return AL.sourceTell(src);
        case 0x1025 /* AL_SAMPLE_OFFSET */:
          var offset = AL.sourceTell(src);
          if (offset > 0.0) {
            offset *= src.bufQueue[0].frequency;
          }
          return offset;
        case 0x1026 /* AL_BYTE_OFFSET */:
          var offset = AL.sourceTell(src);
          if (offset > 0.0) {
            offset *= src.bufQueue[0].frequency * src.bufQueue[0].bytesPerSample;
          }
          return offset;
        case 0x1027 /* AL_SOURCE_TYPE */:
          return src.type;
        case 0x1214 /* AL_SOURCE_SPATIALIZE_SOFT */:
          return src.spatialize;
        case 0x2009 /* AL_BYTE_LENGTH_SOFT */:
          var length = 0;
          var bytesPerFrame = 0;
          for (var i = 0; i < src.bufQueue.length; i++) {
            length += src.bufQueue[i].length;
            if (src.bufQueue[i].id !== 0) {
              bytesPerFrame = src.bufQueue[i].bytesPerSample * src.bufQueue[i].channels;
            }
          }
          return length * bytesPerFrame;
        case 0x200A /* AL_SAMPLE_LENGTH_SOFT */:
          var length = 0;
          for (var i = 0; i < src.bufQueue.length; i++) {
            length += src.bufQueue[i].length;
          }
          return length;
        case 0x200B /* AL_SEC_LENGTH_SOFT */:
          return AL.sourceDuration(src);
        case 53248:
          return src.distanceModel;
        default:
          AL.currentCtx.err = 40962;
          return null;
        }
      },
  setSourceParam:(funcname, sourceId, param, value) => {
        if (!AL.currentCtx) {
          return;
        }
        var src = AL.currentCtx.sources[sourceId];
        if (!src) {
          AL.currentCtx.err = 40961;
          return;
        }
        if (value === null) {
          AL.currentCtx.err = 40962;
          return;
        }
  
        switch (param) {
        case 0x202 /* AL_SOURCE_RELATIVE */:
          if (value === 1) {
            src.relative = true;
            AL.updateSourceSpace(src);
          } else if (value === 0) {
            src.relative = false;
            AL.updateSourceSpace(src);
          } else {
            AL.currentCtx.err = 40963;
            return;
          }
          break;
        case 0x1001 /* AL_CONE_INNER_ANGLE */:
          if (!Number.isFinite(value)) {
            AL.currentCtx.err = 40963;
            return;
          }
  
          src.coneInnerAngle = value;
          if (src.panner) {
            src.panner.coneInnerAngle = value % 360.0;
          }
          break;
        case 0x1002 /* AL_CONE_OUTER_ANGLE */:
          if (!Number.isFinite(value)) {
            AL.currentCtx.err = 40963;
            return;
          }
  
          src.coneOuterAngle = value;
          if (src.panner) {
            src.panner.coneOuterAngle = value % 360.0;
          }
          break;
        case 0x1003 /* AL_PITCH */:
          if (!Number.isFinite(value) || value <= 0.0) {
            AL.currentCtx.err = 40963;
            return;
          }
  
          if (src.pitch === value) {
            break;
          }
  
          src.pitch = value;
          AL.updateSourceRate(src);
          break;
        case 4100:
          if (!Number.isFinite(value[0]) || !Number.isFinite(value[1]) || !Number.isFinite(value[2])) {
            AL.currentCtx.err = 40963;
            return;
          }
  
          src.position[0] = value[0];
          src.position[1] = value[1];
          src.position[2] = value[2];
          AL.updateSourceSpace(src);
          break;
        case 4101:
          if (!Number.isFinite(value[0]) || !Number.isFinite(value[1]) || !Number.isFinite(value[2])) {
            AL.currentCtx.err = 40963;
            return;
          }
  
          src.direction[0] = value[0];
          src.direction[1] = value[1];
          src.direction[2] = value[2];
          AL.updateSourceSpace(src);
          break;
        case 4102:
          if (!Number.isFinite(value[0]) || !Number.isFinite(value[1]) || !Number.isFinite(value[2])) {
            AL.currentCtx.err = 40963;
            return;
          }
  
          src.velocity[0] = value[0];
          src.velocity[1] = value[1];
          src.velocity[2] = value[2];
          AL.updateSourceSpace(src);
          break;
        case 0x1007 /* AL_LOOPING */:
          if (value === 1) {
            src.looping = true;
            AL.updateSourceTime(src);
            if (src.type === 4136 && src.audioQueue.length > 0) {
              var audioSrc  = src.audioQueue[0];
              audioSrc.loop = true;
              audioSrc._duration = Number.POSITIVE_INFINITY;
            }
          } else if (value === 0) {
            src.looping = false;
            var currentTime = AL.updateSourceTime(src);
            if (src.type === 4136 && src.audioQueue.length > 0) {
              var audioSrc  = src.audioQueue[0];
              audioSrc.loop = false;
              audioSrc._duration = src.bufQueue[0].audioBuf.duration / src.playbackRate;
              audioSrc._startTime = currentTime - src.bufOffset / src.playbackRate;
            }
          } else {
            AL.currentCtx.err = 40963;
            return;
          }
          break;
        case 0x1009 /* AL_BUFFER */:
          if (src.state === 4114 || src.state === 4115) {
            AL.currentCtx.err = 40964;
            return;
          }
  
          if (value === 0) {
            for (var i in src.bufQueue) {
              src.bufQueue[i].refCount--;
            }
            src.bufQueue.length = 1;
            src.bufQueue[0] = AL.buffers[0];
  
            src.bufsProcessed = 0;
            src.type = 0x1030 /* AL_UNDETERMINED */;
          } else {
            var buf = AL.buffers[value];
            if (!buf) {
              AL.currentCtx.err = 40963;
              return;
            }
  
            for (var i in src.bufQueue) {
              src.bufQueue[i].refCount--;
            }
            src.bufQueue.length = 0;
  
            buf.refCount++;
            src.bufQueue = [buf];
            src.bufsProcessed = 0;
            src.type = 4136;
          }
  
          AL.initSourcePanner(src);
          AL.scheduleSourceAudio(src);
          break;
        case 4106:
          if (!Number.isFinite(value) || value < 0.0) {
            AL.currentCtx.err = 40963;
            return;
          }
          src.gain.gain.value = value;
          break;
        case 0x100D /* AL_MIN_GAIN */:
          if (!Number.isFinite(value) || value < 0.0 || value > Math.min(src.maxGain, 1.0)) {
            AL.currentCtx.err = 40963;
            return;
          }
          src.minGain = value;
          break;
        case 0x100E /* AL_MAX_GAIN */:
          if (!Number.isFinite(value) || value < Math.max(0.0, src.minGain) || value > 1.0) {
            AL.currentCtx.err = 40963;
            return;
          }
          src.maxGain = value;
          break;
        case 0x1020 /* AL_REFERENCE_DISTANCE */:
          if (!Number.isFinite(value) || value < 0.0) {
            AL.currentCtx.err = 40963;
            return;
          }
          src.refDistance = value;
          if (src.panner) {
            src.panner.refDistance = value;
          }
          break;
        case 0x1021 /* AL_ROLLOFF_FACTOR */:
          if (!Number.isFinite(value) || value < 0.0) {
            AL.currentCtx.err = 40963;
            return;
          }
          src.rolloffFactor = value;
          if (src.panner) {
            src.panner.rolloffFactor = value;
          }
          break;
        case 0x1022 /* AL_CONE_OUTER_GAIN */:
          if (!Number.isFinite(value) || value < 0.0 || value > 1.0) {
            AL.currentCtx.err = 40963;
            return;
          }
          src.coneOuterGain = value;
          if (src.panner) {
            src.panner.coneOuterGain = value;
          }
          break;
        case 0x1023 /* AL_MAX_DISTANCE */:
          if (!Number.isFinite(value) || value < 0.0) {
            AL.currentCtx.err = 40963;
            return;
          }
          src.maxDistance = value;
          if (src.panner) {
            src.panner.maxDistance = value;
          }
          break;
        case 0x1024 /* AL_SEC_OFFSET */:
          if (value < 0.0 || value > AL.sourceDuration(src)) {
            AL.currentCtx.err = 40963;
            return;
          }
  
          AL.sourceSeek(src, value);
          break;
        case 0x1025 /* AL_SAMPLE_OFFSET */:
          var srcLen = AL.sourceDuration(src);
          if (srcLen > 0.0) {
            var frequency;
            for (var bufId in src.bufQueue) {
              if (bufId) {
                frequency = src.bufQueue[bufId].frequency;
                break;
              }
            }
            value /= frequency;
          }
          if (value < 0.0 || value > srcLen) {
            AL.currentCtx.err = 40963;
            return;
          }
  
          AL.sourceSeek(src, value);
          break;
        case 0x1026 /* AL_BYTE_OFFSET */:
          var srcLen = AL.sourceDuration(src);
          if (srcLen > 0.0) {
            var bytesPerSec;
            for (var bufId in src.bufQueue) {
              if (bufId) {
                var buf = src.bufQueue[bufId];
                bytesPerSec = buf.frequency * buf.bytesPerSample * buf.channels;
                break;
              }
            }
            value /= bytesPerSec;
          }
          if (value < 0.0 || value > srcLen) {
            AL.currentCtx.err = 40963;
            return;
          }
  
          AL.sourceSeek(src, value);
          break;
        case 0x1214 /* AL_SOURCE_SPATIALIZE_SOFT */:
          if (value !== 0 && value !== 1 && value !== 2 /* AL_AUTO_SOFT */) {
            AL.currentCtx.err = 40963;
            return;
          }
  
          src.spatialize = value;
          AL.initSourcePanner(src);
          break;
        case 0x2009 /* AL_BYTE_LENGTH_SOFT */:
        case 0x200A /* AL_SAMPLE_LENGTH_SOFT */:
        case 0x200B /* AL_SEC_LENGTH_SOFT */:
          AL.currentCtx.err = 40964;
          break;
        case 53248:
          switch (value) {
          case 0:
          case 0xd001 /* AL_INVERSE_DISTANCE */:
          case 0xd002 /* AL_INVERSE_DISTANCE_CLAMPED */:
          case 0xd003 /* AL_LINEAR_DISTANCE */:
          case 0xd004 /* AL_LINEAR_DISTANCE_CLAMPED */:
          case 0xd005 /* AL_EXPONENT_DISTANCE */:
          case 0xd006 /* AL_EXPONENT_DISTANCE_CLAMPED */:
            src.distanceModel = value;
            if (AL.currentCtx.sourceDistanceModel) {
              AL.updateContextGlobal(AL.currentCtx);
            }
            break;
          default:
            AL.currentCtx.err = 40963;
            return;
          }
          break;
        default:
          AL.currentCtx.err = 40962;
          return;
        }
      },
  captures:{
  },
  sharedCaptureAudioCtx:null,
  requireValidCaptureDevice:(deviceId, funcname) => {
        if (deviceId === 0) {
          AL.alcErr = 40961;
          return null;
        }
        var c = AL.captures[deviceId];
        if (!c) {
          AL.alcErr = 40961;
          return null;
        }
        var err = c.mediaStreamError;
        if (err) {
          AL.alcErr = 40961;
          return null;
        }
        return c;
      },
  };

  
  
  var _alcCaptureOpenDevice = (pDeviceName, requestedSampleRate, format, bufferFrameCapacity) => {
  
      var resolvedDeviceName = AL.CAPTURE_DEVICE_NAME;
  
      // NULL is a valid device name here (resolves to default);
      if (pDeviceName !== 0) {
        resolvedDeviceName = UTF8ToString(pDeviceName);
        if (resolvedDeviceName !== AL.CAPTURE_DEVICE_NAME) {
          // ALC_OUT_OF_MEMORY
          // From the programmer's guide, ALC_OUT_OF_MEMORY's meaning is
          // overloaded here, to mean:
          // 'The specified device is invalid, or can not capture audio.'
          // This may be misleading to API users, but well...
          AL.alcErr = 0xA005 /* ALC_OUT_OF_MEMORY */;
          return 0;
        }
      }
  
      // Otherwise it's probably okay (though useless) for bufferFrameCapacity to be zero.
      if (bufferFrameCapacity < 0) { // ALCsizei is signed int
        AL.alcErr = 40964;
        return 0;
      }
  
      navigator.getUserMedia = navigator.getUserMedia
        || navigator.webkitGetUserMedia
        || navigator.mozGetUserMedia
        || navigator.msGetUserMedia;
      var has_getUserMedia = navigator.getUserMedia
        || (navigator.mediaDevices
        &&  navigator.mediaDevices.getUserMedia);
  
      if (!has_getUserMedia) {
        // See previously mentioned rationale for ALC_OUT_OF_MEMORY
        AL.alcErr = 0xA005 /* ALC_OUT_OF_MEMORY */;
        return 0;
      }
  
      var AudioContext = window.AudioContext || window.webkitAudioContext;
  
      if (!AL.sharedCaptureAudioCtx) {
        try {
          AL.sharedCaptureAudioCtx = new AudioContext();
        } catch(e) {
          // See previously mentioned rationale for ALC_OUT_OF_MEMORY
          AL.alcErr = 0xA005 /* ALC_OUT_OF_MEMORY */;
          return 0;
        }
      }
  
      autoResumeAudioContext(AL.sharedCaptureAudioCtx);
  
      var outputChannelCount;
  
      switch (format) {
      case 0x10010: /* AL_FORMAT_MONO_FLOAT32 */
      case 0x1101:  /* AL_FORMAT_MONO16 */
      case 0x1100:  /* AL_FORMAT_MONO8 */
        outputChannelCount = 1;
        break;
      case 0x10011: /* AL_FORMAT_STEREO_FLOAT32 */
      case 0x1103:  /* AL_FORMAT_STEREO16 */
      case 0x1102:  /* AL_FORMAT_STEREO8 */
        outputChannelCount = 2;
        break;
      default:
        AL.alcErr = 40964;
        return 0;
      }
  
      function newF32Array(cap) { return new Float32Array(cap);}
      function newI16Array(cap) { return new Int16Array(cap);  }
      function newU8Array(cap)  { return new Uint8Array(cap);  }
  
      var requestedSampleType;
      var newSampleArray;
  
      switch (format) {
      case 0x10010: /* AL_FORMAT_MONO_FLOAT32 */
      case 0x10011: /* AL_FORMAT_STEREO_FLOAT32 */
        requestedSampleType = 'f32';
        newSampleArray = newF32Array;
        break;
      case 0x1101:  /* AL_FORMAT_MONO16 */
      case 0x1103:  /* AL_FORMAT_STEREO16 */
        requestedSampleType = 'i16';
        newSampleArray = newI16Array;
        break;
      case 0x1100:  /* AL_FORMAT_MONO8 */
      case 0x1102:  /* AL_FORMAT_STEREO8 */
        requestedSampleType = 'u8';
        newSampleArray = newU8Array;
        break;
      }
  
      var buffers = [];
      try {
        for (var chan=0; chan < outputChannelCount; ++chan) {
          buffers[chan] = newSampleArray(bufferFrameCapacity);
        }
      } catch(e) {
        AL.alcErr = 0xA005 /* ALC_OUT_OF_MEMORY */;
        return 0;
      }
  
      // What we'll place into the `AL.captures` array in the end,
      // declared here for closures to access it
      var newCapture = {
        audioCtx: AL.sharedCaptureAudioCtx,
        deviceName: resolvedDeviceName,
        requestedSampleRate,
        requestedSampleType,
        outputChannelCount,
        inputChannelCount: null, // Not known until the getUserMedia() promise resolves
        mediaStreamError: null, // Used by other functions to return early and report an error.
        mediaStreamSourceNode: null,
        mediaStream: null,
        // Either one, or none of the below two, is active.
        mergerNode: null,
        splitterNode: null,
        scriptProcessorNode: null,
        isCapturing: false,
        buffers,
        get bufferFrameCapacity() {
          return buffers[0].length;
        },
        capturePlayhead: 0, // current write position, in sample frames
        captureReadhead: 0,
        capturedFrameCount: 0
      };
  
      // Preparing for getUserMedia()
  
      var onError = (mediaStreamError) => {
        newCapture.mediaStreamError = mediaStreamError;
      };
      var onSuccess = (mediaStream) => {
        newCapture.mediaStreamSourceNode = newCapture.audioCtx.createMediaStreamSource(mediaStream);
        newCapture.mediaStream = mediaStream;
  
        var inputChannelCount = 1;
        switch (newCapture.mediaStreamSourceNode.channelCountMode) {
        case 'max':
          inputChannelCount = outputChannelCount;
          break;
        case 'clamped-max':
          inputChannelCount = Math.min(outputChannelCount, newCapture.mediaStreamSourceNode.channelCount);
          break;
        case 'explicit':
          inputChannelCount = newCapture.mediaStreamSourceNode.channelCount;
          break;
        }
  
        newCapture.inputChannelCount = inputChannelCount;
  
        // Have to pick a size from 256, 512, 1024, 2048, 4096, 8192, 16384.
        // One can also set it to zero, which leaves the decision up to the impl.
        // An extension could allow specifying this value.
        var processorFrameCount = 512;
  
        newCapture.scriptProcessorNode = newCapture.audioCtx.createScriptProcessor(
          processorFrameCount, inputChannelCount, outputChannelCount
        );
  
        if (inputChannelCount > outputChannelCount) {
          newCapture.mergerNode = newCapture.audioCtx.createChannelMerger(inputChannelCount);
          newCapture.mediaStreamSourceNode.connect(newCapture.mergerNode);
          newCapture.mergerNode.connect(newCapture.scriptProcessorNode);
        } else if (inputChannelCount < outputChannelCount) {
          newCapture.splitterNode = newCapture.audioCtx.createChannelSplitter(outputChannelCount);
          newCapture.mediaStreamSourceNode.connect(newCapture.splitterNode);
          newCapture.splitterNode.connect(newCapture.scriptProcessorNode);
        } else {
          newCapture.mediaStreamSourceNode.connect(newCapture.scriptProcessorNode);
        }
  
        newCapture.scriptProcessorNode.connect(newCapture.audioCtx.destination);
  
        newCapture.scriptProcessorNode.onaudioprocess = (audioProcessingEvent) => {
          if (!newCapture.isCapturing) {
            return;
          }
  
          var c = newCapture;
          var srcBuf = audioProcessingEvent.inputBuffer;
  
          // Actually just copy srcBuf's channel data into
          // c.buffers, optimizing for each case.
          switch (format) {
          case 0x10010: /* AL_FORMAT_MONO_FLOAT32 */
            var channel0 = srcBuf.getChannelData(0);
            for (var i = 0 ; i < srcBuf.length; ++i) {
              var wi = (c.capturePlayhead + i) % c.bufferFrameCapacity;
              c.buffers[0][wi] = channel0[i];
            }
            break;
          case 0x10011: /* AL_FORMAT_STEREO_FLOAT32 */
            var channel0 = srcBuf.getChannelData(0);
            var channel1 = srcBuf.getChannelData(1);
            for (var i = 0 ; i < srcBuf.length; ++i) {
              var wi = (c.capturePlayhead + i) % c.bufferFrameCapacity;
              c.buffers[0][wi] = channel0[i];
              c.buffers[1][wi] = channel1[i];
            }
            break;
          case 0x1101:  /* AL_FORMAT_MONO16 */
            var channel0 = srcBuf.getChannelData(0);
            for (var i = 0 ; i < srcBuf.length; ++i) {
              var wi = (c.capturePlayhead + i) % c.bufferFrameCapacity;
              c.buffers[0][wi] = channel0[i] * 32767;
            }
            break;
          case 0x1103:  /* AL_FORMAT_STEREO16 */
            var channel0 = srcBuf.getChannelData(0);
            var channel1 = srcBuf.getChannelData(1);
            for (var i = 0 ; i < srcBuf.length; ++i) {
              var wi = (c.capturePlayhead + i) % c.bufferFrameCapacity;
              c.buffers[0][wi] = channel0[i] * 32767;
              c.buffers[1][wi] = channel1[i] * 32767;
            }
            break;
          case 0x1100:  /* AL_FORMAT_MONO8 */
            var channel0 = srcBuf.getChannelData(0);
            for (var i = 0 ; i < srcBuf.length; ++i) {
              var wi = (c.capturePlayhead + i) % c.bufferFrameCapacity;
              c.buffers[0][wi] = (channel0[i] + 1.0) * 127;
            }
            break;
          case 0x1102:  /* AL_FORMAT_STEREO8 */
            var channel0 = srcBuf.getChannelData(0);
            var channel1 = srcBuf.getChannelData(1);
            for (var i = 0 ; i < srcBuf.length; ++i) {
              var wi = (c.capturePlayhead + i) % c.bufferFrameCapacity;
              c.buffers[0][wi] = (channel0[i] + 1.0) * 127;
              c.buffers[1][wi] = (channel1[i] + 1.0) * 127;
            }
            break;
          }
  
          c.capturePlayhead += srcBuf.length;
          c.capturePlayhead %= c.bufferFrameCapacity;
          c.capturedFrameCount += srcBuf.length;
          c.capturedFrameCount = Math.min(c.capturedFrameCount, c.bufferFrameCapacity);
        };
      };
  
      // The latest way to call getUserMedia()
      if (navigator.mediaDevices?.getUserMedia) {
        navigator.mediaDevices
             .getUserMedia({audio: true})
             .then(onSuccess)
             .catch(onError);
      } else { // The usual (now deprecated) way
        navigator.getUserMedia({audio: true}, onSuccess, onError);
      }
  
      var id = AL.newId();
      AL.captures[id] = newCapture;
      return id;
    };

  var _alcCaptureCloseDevice = (deviceId) => {
      var c = AL.requireValidCaptureDevice(deviceId, 'alcCaptureCloseDevice');
      if (!c) return false;
  
      delete AL.captures[deviceId];
      AL.freeIds.push(deviceId);
  
      // This clean-up might be unnecessary (paranoid) ?
  
      // May happen if user hasn't decided to grant or deny input
      c.mediaStreamSourceNode?.disconnect();
      c.mergerNode?.disconnect();
      c.splitterNode?.disconnect();
      // May happen if user hasn't decided to grant or deny input
      c.scriptProcessorNode?.disconnect();
      if (c.mediaStream) {
        // Disabling the microphone of the browser.
        // Without this operation, the red dot on the browser tab page will remain.
        c.mediaStream.getTracks().forEach((track) => track.stop());
      }
  
      delete c.buffers;
  
      c.capturedFrameCount = 0;
      c.isCapturing = false;
  
      return true;
    };

  var _alcCaptureStart = (deviceId) => {
      var c = AL.requireValidCaptureDevice(deviceId, 'alcCaptureStart');
      if (!c) return;
  
      if (c.isCapturing) {
        // NOTE: Spec says (emphasis mine):
        //     The amount of audio samples available after **restarting** a
        //     stopped capture device is reset to zero.
        // So redundant calls to alcCaptureStart() must have no effect.
        return;
      }
      c.isCapturing = true;
      c.capturedFrameCount = 0;
      c.capturePlayhead = 0;
    };

  var _alcCaptureStop = (deviceId) => {
      var c = AL.requireValidCaptureDevice(deviceId, 'alcCaptureStop');
      if (!c) return;
  
      c.isCapturing = false;
    };

  var _alcCaptureSamples = (deviceId, pFrames, requestedFrameCount) => {
      var c = AL.requireValidCaptureDevice(deviceId, 'alcCaptureSamples');
      if (!c) return;
  
      // ALCsizei is actually 32-bit signed int, so could be negative
      // Also, spec says :
      //   Requesting more sample frames than are currently available is
      //   an error.
  
      var dstfreq = c.requestedSampleRate;
      var srcfreq = c.audioCtx.sampleRate;
  
      var fratio = srcfreq / dstfreq;
  
      if (requestedFrameCount < 0
      ||  requestedFrameCount > (c.capturedFrameCount / fratio))
      {
        AL.alcErr = 40964;
        return;
      }
  
      function setF32Sample(i, sample) {
        HEAPF32[(((pFrames)+(4*i))>>2)] = sample;
      }
      function setI16Sample(i, sample) {
        HEAP16[(((pFrames)+(2*i))>>1)] = sample;
      }
      function setU8Sample(i, sample) {
        HEAP8[(pFrames)+(i)] = sample;
      }
  
      var setSample;
  
      switch (c.requestedSampleType) {
      case 'f32': setSample = setF32Sample; break;
      case 'i16': setSample = setI16Sample; break;
      case 'u8' : setSample = setU8Sample ; break;
      default:
        return;
      }
  
      // If fratio is an integer we don't need linear resampling, just skip samples
      if (Math.floor(fratio) == fratio) {
        for (var i = 0, frame_i = 0; frame_i < requestedFrameCount; ++frame_i) {
          for (var chan = 0; chan < c.buffers.length; ++chan, ++i) {
            setSample(i, c.buffers[chan][c.captureReadhead]);
          }
          c.captureReadhead = (fratio + c.captureReadhead) % c.bufferFrameCapacity;
        }
      } else {
        // Perform linear resampling.
  
        // There is room for improvement - right now we're fine with linear resampling.
        // We don't use OfflineAudioContexts for this: See the discussion at
        // https://github.com/jpernst/emscripten/issues/2#issuecomment-312729735
        // if you're curious about why.
        for (var i = 0, frame_i = 0; frame_i < requestedFrameCount; ++frame_i) {
          var lefti = Math.floor(c.captureReadhead);
          var righti = Math.ceil(c.captureReadhead);
          var d = c.captureReadhead - lefti;
          for (var chan = 0; chan < c.buffers.length; ++chan, ++i) {
            var lefts = c.buffers[chan][lefti];
            var rights = c.buffers[chan][righti];
            setSample(i, (1 - d) * lefts + d * rights);
          }
          c.captureReadhead = (c.captureReadhead + fratio) % c.bufferFrameCapacity;
        }
      }
  
      // Spec doesn't say if alcCaptureSamples() must zero the number
      // of available captured sample-frames, but not only would it
      // be insane not to do, OpenAL-Soft happens to do that as well.
      c.capturedFrameCount = 0;
    };

  
  var _alcOpenDevice = (pDeviceName) => {
      if (pDeviceName) {
        var name = UTF8ToString(pDeviceName);
        if (name !== AL.DEVICE_NAME) {
          return 0;
        }
      }
  
      if (typeof AudioContext != 'undefined' || typeof webkitAudioContext != 'undefined') {
        var deviceId = AL.newId();
        AL.deviceRefCounts[deviceId] = 0;
        return deviceId;
      }
      return 0;
    };

  var _alcCloseDevice = (deviceId) => {
      if (!(deviceId in AL.deviceRefCounts) || AL.deviceRefCounts[deviceId] > 0) {
        return 0;
      }
  
      delete AL.deviceRefCounts[deviceId];
      AL.freeIds.push(deviceId);
      return 1;
    };

  
  var _alcCreateContext = (deviceId, pAttrList) => {
      if (!(deviceId in AL.deviceRefCounts)) {
        AL.alcErr = 0xA001; /* ALC_INVALID_DEVICE */
        return 0;
      }
  
      var options = null;
      var attrs = [];
      var hrtf = null;
      pAttrList >>= 2;
      if (pAttrList) {
        var attr = 0;
        var val = 0;
        while (true) {
          attr = HEAP32[pAttrList++];
          attrs.push(attr);
          if (attr === 0) {
            break;
          }
          val = HEAP32[pAttrList++];
          attrs.push(val);
  
          switch (attr) {
          case 0x1007 /* ALC_FREQUENCY */:
            if (!options) {
              options = {};
            }
  
            options.sampleRate = val;
            break;
          case 0x1010 /* ALC_MONO_SOURCES */: // fallthrough
          case 0x1011 /* ALC_STEREO_SOURCES */:
            // Do nothing; these hints are satisfied by default
            break
          case 0x1992 /* ALC_HRTF_SOFT */:
            switch (val) {
              case 0:
                hrtf = false;
                break;
              case 1:
                hrtf = true;
                break;
              case 2 /* ALC_DONT_CARE_SOFT */:
                break;
              default:
                AL.alcErr = 40964;
                return 0;
            }
            break;
          case 0x1996 /* ALC_HRTF_ID_SOFT */:
            if (val !== 0) {
              AL.alcErr = 40964;
              return 0;
            }
            break;
          default:
            AL.alcErr = 0xA004; /* ALC_INVALID_VALUE */
            return 0;
          }
        }
      }
  
      var AudioContext = window.AudioContext || window.webkitAudioContext;
      var ac = null;
      try {
        // Only try to pass options if there are any, for compat with browsers that don't support this
        if (options) {
          ac = new AudioContext(options);
        } else {
          ac = new AudioContext();
        }
      } catch (e) {
        if (e.name === 'NotSupportedError') {
          AL.alcErr = 0xA004; /* ALC_INVALID_VALUE */
        } else {
          AL.alcErr = 0xA001; /* ALC_INVALID_DEVICE */
        }
  
        return 0;
      }
  
      autoResumeAudioContext(ac);
  
      // Old Web Audio API (e.g. Safari 6.0.5) had an inconsistently named createGainNode function.
      if (typeof ac.createGain == 'undefined') {
        ac.createGain = ac.createGainNode;
      }
  
      var gain = ac.createGain();
      gain.connect(ac.destination);
      var ctx = {
        deviceId,
        id: AL.newId(),
        attrs,
        audioCtx: ac,
        listener: {
          position: [0.0, 0.0, 0.0],
          velocity: [0.0, 0.0, 0.0],
          direction: [0.0, 0.0, 0.0],
          up: [0.0, 0.0, 0.0]
        },
        sources: [],
        interval: setInterval(() => AL.scheduleContextAudio(ctx), AL.QUEUE_INTERVAL),
        gain,
        distanceModel: 0xd002 /* AL_INVERSE_DISTANCE_CLAMPED */,
        speedOfSound: 343.3,
        dopplerFactor: 1.0,
        sourceDistanceModel: false,
        hrtf: hrtf || false,
  
        _err: 0,
        get err() {
          return this._err;
        },
        set err(val) {
          // Errors should not be overwritten by later errors until they are cleared by a query.
          if (this._err === 0 || val === 0) {
            this._err = val;
          }
        }
      };
      AL.deviceRefCounts[deviceId]++;
      AL.contexts[ctx.id] = ctx;
  
      if (hrtf !== null) {
        // Apply hrtf attrib to all contexts for this device
        for (var ctxId in AL.contexts) {
          var c = AL.contexts[ctxId];
          if (c.deviceId === deviceId) {
            c.hrtf = hrtf;
            AL.updateContextGlobal(c);
          }
        }
      }
  
      return ctx.id;
    };

  var _alcDestroyContext = (contextId) => {
      var ctx = AL.contexts[contextId];
      if (AL.currentCtx === ctx) {
        AL.alcErr = 0xA002 /* ALC_INVALID_CONTEXT */;
        return;
      }
  
      // Stop playback, etc
      if (AL.contexts[contextId].interval) {
        clearInterval(AL.contexts[contextId].interval);
      }
      AL.deviceRefCounts[ctx.deviceId]--;
      delete AL.contexts[contextId];
      AL.freeIds.push(contextId);
    };

  var _alcGetError = (deviceId) => {
      var err = AL.alcErr;
      AL.alcErr = 0;
      return err;
    };

  var _alcGetCurrentContext = () => {
      if (AL.currentCtx !== null) {
        return AL.currentCtx.id;
      }
      return 0;
    };

  var _alcMakeContextCurrent = (contextId) => {
      if (contextId === 0) {
        AL.currentCtx = null;
      } else {
        AL.currentCtx = AL.contexts[contextId];
      }
      return 1;
    };

  var _alcGetContextsDevice = (contextId) => {
      if (contextId in AL.contexts) {
        return AL.contexts[contextId].deviceId;
      }
      return 0;
    };

  var _alcProcessContext = (contextId) => {};

  var _alcSuspendContext = (contextId) => {};

  
  var _alcIsExtensionPresent = (deviceId, pExtName) => {
      var name = UTF8ToString(pExtName);
  
      return AL.ALC_EXTENSIONS[name] ? 1 : 0;
    };

  
  var _alcGetEnumValue = (deviceId, pEnumName) => {
      // Spec says :
      // Using a NULL handle is legal, but only the
      // tokens defined by the AL core are guaranteed.
      if (deviceId !== 0 && !(deviceId in AL.deviceRefCounts)) {
        // ALC_INVALID_DEVICE is not listed as a possible error state for
        // this function, sadly.
        return 0;
      } else if (!pEnumName) {
        AL.alcErr = 40964;
        return 0;
      }
      var name = UTF8ToString(pEnumName);
      // See alGetEnumValue(), but basically behave the same as OpenAL-Soft
      switch (name) {
      case 'ALC_NO_ERROR': return 0;
      case 'ALC_INVALID_DEVICE': return 0xA001;
      case 'ALC_INVALID_CONTEXT': return 0xA002;
      case 'ALC_INVALID_ENUM': return 0xA003;
      case 'ALC_INVALID_VALUE': return 0xA004;
      case 'ALC_OUT_OF_MEMORY': return 0xA005;
      case 'ALC_MAJOR_VERSION': return 0x1000;
      case 'ALC_MINOR_VERSION': return 0x1001;
      case 'ALC_ATTRIBUTES_SIZE': return 0x1002;
      case 'ALC_ALL_ATTRIBUTES': return 0x1003;
      case 'ALC_DEFAULT_DEVICE_SPECIFIER': return 0x1004;
      case 'ALC_DEVICE_SPECIFIER': return 0x1005;
      case 'ALC_EXTENSIONS': return 0x1006;
      case 'ALC_FREQUENCY': return 0x1007;
      case 'ALC_REFRESH': return 0x1008;
      case 'ALC_SYNC': return 0x1009;
      case 'ALC_MONO_SOURCES': return 0x1010;
      case 'ALC_STEREO_SOURCES': return 0x1011;
      case 'ALC_CAPTURE_DEVICE_SPECIFIER': return 0x310;
      case 'ALC_CAPTURE_DEFAULT_DEVICE_SPECIFIER': return 0x311;
      case 'ALC_CAPTURE_SAMPLES': return 0x312;
  
      /* Extensions */
      case 'ALC_HRTF_SOFT': return 0x1992;
      case 'ALC_HRTF_ID_SOFT': return 0x1996;
      case 'ALC_DONT_CARE_SOFT': return 0x0002;
      case 'ALC_HRTF_STATUS_SOFT': return 0x1993;
      case 'ALC_NUM_HRTF_SPECIFIERS_SOFT': return 0x1994;
      case 'ALC_HRTF_SPECIFIER_SOFT': return 0x1995;
      case 'ALC_HRTF_DISABLED_SOFT': return 0x0000;
      case 'ALC_HRTF_ENABLED_SOFT': return 0x0001;
      case 'ALC_HRTF_DENIED_SOFT': return 0x0002;
      case 'ALC_HRTF_REQUIRED_SOFT': return 0x0003;
      case 'ALC_HRTF_HEADPHONES_DETECTED_SOFT': return 0x0004;
      case 'ALC_HRTF_UNSUPPORTED_FORMAT_SOFT': return 0x0005;
  
      default:
        AL.alcErr = 40964;
        return 0;
      }
    };

  
  var _alcGetString = (deviceId, param) => {
      if (AL.alcStringCache[param]) {
        return AL.alcStringCache[param];
      }
  
      var ret;
      switch (param) {
      case 0:
        ret = 'No Error';
        break;
      case 40961:
        ret = 'Invalid Device';
        break;
      case 0xA002 /* ALC_INVALID_CONTEXT */:
        ret = 'Invalid Context';
        break;
      case 40963:
        ret = 'Invalid Enum';
        break;
      case 40964:
        ret = 'Invalid Value';
        break;
      case 0xA005 /* ALC_OUT_OF_MEMORY */:
        ret = 'Out of Memory';
        break;
      case 0x1004 /* ALC_DEFAULT_DEVICE_SPECIFIER */:
        if (typeof AudioContext != 'undefined' ||
            typeof webkitAudioContext != 'undefined') {
          ret = AL.DEVICE_NAME;
        } else {
          return 0;
        }
        break;
      case 0x1005 /* ALC_DEVICE_SPECIFIER */:
        if (typeof AudioContext != 'undefined' ||
            typeof webkitAudioContext != 'undefined') {
          ret = AL.DEVICE_NAME + '\0';
        } else {
          ret = '\0';
        }
        break;
      case 0x311 /* ALC_CAPTURE_DEFAULT_DEVICE_SPECIFIER */:
        ret = AL.CAPTURE_DEVICE_NAME;
        break;
      case 0x310 /* ALC_CAPTURE_DEVICE_SPECIFIER */:
        if (deviceId === 0) {
          ret = AL.CAPTURE_DEVICE_NAME + '\0';
        } else {
          var c = AL.requireValidCaptureDevice(deviceId, 'alcGetString');
          if (!c) {
            return 0;
          }
          ret = c.deviceName;
        }
        break;
      case 0x1006 /* ALC_EXTENSIONS */:
        if (!deviceId) {
          AL.alcErr = 40961;
          return 0;
        }
  
        ret = Object.keys(AL.ALC_EXTENSIONS).join(' ')
        break;
      default:
        AL.alcErr = 40963;
        return 0;
      }
  
      ret = stringToNewUTF8(ret);
      AL.alcStringCache[param] = ret;
      return ret;
    };

  var _alcGetIntegerv = (deviceId, param, size, pValues) => {
      if (size === 0 || !pValues) {
        // Ignore the query, per the spec
        return;
      }
  
      switch (param) {
      case 0x1000 /* ALC_MAJOR_VERSION */:
        HEAP32[((pValues)>>2)] = 1;
        break;
      case 0x1001 /* ALC_MINOR_VERSION */:
        HEAP32[((pValues)>>2)] = 1;
        break;
      case 0x1002 /* ALC_ATTRIBUTES_SIZE */:
        if (!(deviceId in AL.deviceRefCounts)) {
          AL.alcErr = 40961;
          return;
        }
        if (!AL.currentCtx) {
          AL.alcErr = 0xA002 /* ALC_INVALID_CONTEXT */;
          return;
        }
  
        HEAP32[((pValues)>>2)] = AL.currentCtx.attrs.length;
        break;
      case 0x1003 /* ALC_ALL_ATTRIBUTES */:
        if (!(deviceId in AL.deviceRefCounts)) {
          AL.alcErr = 40961;
          return;
        }
        if (!AL.currentCtx) {
          AL.alcErr = 0xA002 /* ALC_INVALID_CONTEXT */;
          return;
        }
  
        for (var i = 0; i < AL.currentCtx.attrs.length; i++) {
          HEAP32[(((pValues)+(i*4))>>2)] = AL.currentCtx.attrs[i];
        }
        break;
      case 0x1007 /* ALC_FREQUENCY */:
        if (!(deviceId in AL.deviceRefCounts)) {
          AL.alcErr = 40961;
          return;
        }
        if (!AL.currentCtx) {
          AL.alcErr = 0xA002 /* ALC_INVALID_CONTEXT */;
          return;
        }
  
        HEAP32[((pValues)>>2)] = AL.currentCtx.audioCtx.sampleRate;
        break;
      case 0x1010 /* ALC_MONO_SOURCES */:
      case 0x1011 /* ALC_STEREO_SOURCES */:
        if (!(deviceId in AL.deviceRefCounts)) {
          AL.alcErr = 40961;
          return;
        }
        if (!AL.currentCtx) {
          AL.alcErr = 0xA002 /* ALC_INVALID_CONTEXT */;
          return;
        }
  
        HEAP32[((pValues)>>2)] = 0x7FFFFFFF;
        break;
      case 0x1992 /* ALC_HRTF_SOFT */:
      case 0x1993 /* ALC_HRTF_STATUS_SOFT */:
        if (!(deviceId in AL.deviceRefCounts)) {
          AL.alcErr = 40961;
          return;
        }
  
        var hrtfStatus = 0 /* ALC_HRTF_DISABLED_SOFT */;
        for (var ctxId in AL.contexts) {
          var ctx = AL.contexts[ctxId];
          if (ctx.deviceId === deviceId) {
            hrtfStatus = ctx.hrtf ? 1 /* ALC_HRTF_ENABLED_SOFT */ : 0 /* ALC_HRTF_DISABLED_SOFT */;
          }
        }
        HEAP32[((pValues)>>2)] = hrtfStatus;
        break;
      case 0x1994 /* ALC_NUM_HRTF_SPECIFIERS_SOFT */:
        if (!(deviceId in AL.deviceRefCounts)) {
          AL.alcErr = 40961;
          return;
        }
        HEAP32[((pValues)>>2)] = 1;
        break;
      case 0x20003 /* ALC_MAX_AUXILIARY_SENDS */:
        if (!(deviceId in AL.deviceRefCounts)) {
          AL.alcErr = 40961;
          return;
        }
        if (!AL.currentCtx) {
          AL.alcErr = 0xA002 /* ALC_INVALID_CONTEXT */;
          return;
        }
  
        HEAP32[((pValues)>>2)] = 1;
      case 0x312 /* ALC_CAPTURE_SAMPLES */:
        var c = AL.requireValidCaptureDevice(deviceId, 'alcGetIntegerv');
        if (!c) {
          return;
        }
        var n = c.capturedFrameCount;
        var dstfreq = c.requestedSampleRate;
        var srcfreq = c.audioCtx.sampleRate;
        var nsamples = Math.floor(n * (dstfreq/srcfreq));
        HEAP32[((pValues)>>2)] = nsamples;
        break;
      default:
        AL.alcErr = 40963;
        return;
      }
    };

  var _emscripten_alcDevicePauseSOFT = (deviceId) => {
      if (!(deviceId in AL.deviceRefCounts)) {
        AL.alcErr = 40961;
        return;
      }
  
      if (AL.paused) {
        return;
      }
      AL.paused = true;
  
      for (var ctxId in AL.contexts) {
        var ctx = AL.contexts[ctxId];
        if (ctx.deviceId !== deviceId) {
          continue;
        }
  
        ctx.audioCtx.suspend();
        clearInterval(ctx.interval);
        ctx.interval = null;
      }
    };

  var _emscripten_alcDeviceResumeSOFT = (deviceId) => {
      if (!(deviceId in AL.deviceRefCounts)) {
        AL.alcErr = 40961;
        return;
      }
  
      if (!AL.paused) {
        return;
      }
      AL.paused = false;
  
      for (var ctxId in AL.contexts) {
        var ctx = AL.contexts[ctxId];
        if (ctx.deviceId !== deviceId) {
          continue;
        }
  
        ctx.interval = setInterval(() => AL.scheduleContextAudio(ctx), AL.QUEUE_INTERVAL);
        ctx.audioCtx.resume();
      }
    };

  
  
  var _emscripten_alcGetStringiSOFT = (deviceId, param, index) => {
      if (!(deviceId in AL.deviceRefCounts)) {
        AL.alcErr = 40961;
        return 0;
      }
  
      if (AL.alcStringCache[param]) {
        return AL.alcStringCache[param];
      }
  
      var ret;
      switch (param) {
      case 0x1995 /* ALC_HRTF_SPECIFIER_SOFT */:
        if (index === 0) {
          ret = 'Web Audio HRTF';
        } else {
          AL.alcErr = 40964;
          return 0;
        }
        break;
      default:
        if (index !== 0) {
          AL.alcErr = 40963;
          return 0;
        }
        return _alcGetString(deviceId, param);
      }
  
      ret = stringToNewUTF8(ret);
      AL.alcStringCache[param] = ret;
      return ret;
    };

  var _emscripten_alcResetDeviceSOFT = (deviceId, pAttrList) => {
      if (!(deviceId in AL.deviceRefCounts)) {
        AL.alcErr = 40961;
        return 0;
      }
  
      var hrtf = null;
      pAttrList >>= 2;
      if (pAttrList) {
        var attr = 0;
        var val = 0;
        while (true) {
          attr = HEAP32[pAttrList++];
          if (attr === 0) {
            break;
          }
          val = HEAP32[pAttrList++];
  
          switch (attr) {
          case 0x1992 /* ALC_HRTF_SOFT */:
            if (val === 1) {
              hrtf = true;
            } else if (val === 0) {
              hrtf = false;
            }
            break;
          }
        }
      }
  
      if (hrtf !== null) {
        // Apply hrtf attrib to all contexts for this device
        for (var ctxId in AL.contexts) {
          var ctx = AL.contexts[ctxId];
          if (ctx.deviceId === deviceId) {
            ctx.hrtf = hrtf;
            AL.updateContextGlobal(ctx);
          }
        }
      }
  
      return 1;
    };

  var _alGenBuffers = (count, pBufferIds) => {
      if (!AL.currentCtx) {
        return;
      }
  
      for (var i = 0; i < count; ++i) {
        var buf = {
          deviceId: AL.currentCtx.deviceId,
          id: AL.newId(),
          refCount: 0,
          audioBuf: null,
          frequency: 0,
          bytesPerSample: 2,
          channels: 1,
          length: 0,
        };
        AL.deviceRefCounts[buf.deviceId]++;
        AL.buffers[buf.id] = buf;
        HEAP32[(((pBufferIds)+(i*4))>>2)] = buf.id;
      }
    };

  var _alDeleteBuffers = (count, pBufferIds) => {
      if (!AL.currentCtx) {
        return;
      }
  
      for (var i = 0; i < count; ++i) {
        var bufId = HEAP32[(((pBufferIds)+(i*4))>>2)];
        /// Deleting the zero buffer is a legal NOP, so ignore it
        if (bufId === 0) {
          continue;
        }
  
        // Make sure the buffer index is valid.
        if (!AL.buffers[bufId]) {
          AL.currentCtx.err = 40961;
          return;
        }
  
        // Make sure the buffer is no longer in use.
        if (AL.buffers[bufId].refCount) {
          AL.currentCtx.err = 40964;
          return;
        }
      }
  
      for (var i = 0; i < count; ++i) {
        var bufId = HEAP32[(((pBufferIds)+(i*4))>>2)];
        if (bufId === 0) {
          continue;
        }
  
        AL.deviceRefCounts[AL.buffers[bufId].deviceId]--;
        delete AL.buffers[bufId];
        AL.freeIds.push(bufId);
      }
    };

  var _alGenSources = (count, pSourceIds) => {
      if (!AL.currentCtx) {
        return;
      }
      for (var i = 0; i < count; ++i) {
        var gain = AL.currentCtx.audioCtx.createGain();
        gain.connect(AL.currentCtx.gain);
        var src = {
          context: AL.currentCtx,
          id: AL.newId(),
          type: 0x1030 /* AL_UNDETERMINED */,
          state: 4113,
          bufQueue: [AL.buffers[0]],
          audioQueue: [],
          looping: false,
          pitch: 1.0,
          dopplerShift: 1.0,
          gain,
          minGain: 0.0,
          maxGain: 1.0,
          panner: null,
          bufsProcessed: 0,
          bufStartTime: Number.NEGATIVE_INFINITY,
          bufOffset: 0.0,
          relative: false,
          refDistance: 1.0,
          maxDistance: 3.40282e38 /* FLT_MAX */,
          rolloffFactor: 1.0,
          position: [0.0, 0.0, 0.0],
          velocity: [0.0, 0.0, 0.0],
          direction: [0.0, 0.0, 0.0],
          coneOuterGain: 0.0,
          coneInnerAngle: 360.0,
          coneOuterAngle: 360.0,
          distanceModel: 0xd002 /* AL_INVERSE_DISTANCE_CLAMPED */,
          spatialize: 2 /* AL_AUTO_SOFT */,
  
          get playbackRate() {
            return this.pitch * this.dopplerShift;
          }
        };
        AL.currentCtx.sources[src.id] = src;
        HEAP32[(((pSourceIds)+(i*4))>>2)] = src.id;
      }
    };

  var _alSourcei = (sourceId, param, value) => {
      switch (param) {
      case 0x202 /* AL_SOURCE_RELATIVE */:
      case 0x1001 /* AL_CONE_INNER_ANGLE */:
      case 0x1002 /* AL_CONE_OUTER_ANGLE */:
      case 0x1007 /* AL_LOOPING */:
      case 0x1009 /* AL_BUFFER */:
      case 0x1020 /* AL_REFERENCE_DISTANCE */:
      case 0x1021 /* AL_ROLLOFF_FACTOR */:
      case 0x1023 /* AL_MAX_DISTANCE */:
      case 0x1024 /* AL_SEC_OFFSET */:
      case 0x1025 /* AL_SAMPLE_OFFSET */:
      case 0x1026 /* AL_BYTE_OFFSET */:
      case 0x1214 /* AL_SOURCE_SPATIALIZE_SOFT */:
      case 0x2009 /* AL_BYTE_LENGTH_SOFT */:
      case 0x200A /* AL_SAMPLE_LENGTH_SOFT */:
      case 53248:
        AL.setSourceParam('alSourcei', sourceId, param, value);
        break;
      default:
        AL.setSourceParam('alSourcei', sourceId, param, null);
        break;
      }
    };
  
  var _alDeleteSources = (count, pSourceIds) => {
      if (!AL.currentCtx) {
        return;
      }
  
      for (var i = 0; i < count; ++i) {
        var srcId = HEAP32[(((pSourceIds)+(i*4))>>2)];
        if (!AL.currentCtx.sources[srcId]) {
          AL.currentCtx.err = 40961;
          return;
        }
      }
  
      for (var i = 0; i < count; ++i) {
        var srcId = HEAP32[(((pSourceIds)+(i*4))>>2)];
        AL.setSourceState(AL.currentCtx.sources[srcId], 4116);
        _alSourcei(srcId, 0x1009 /* AL_BUFFER */, 0);
        delete AL.currentCtx.sources[srcId];
        AL.freeIds.push(srcId);
      }
    };

  var _alGetError = () => {
      if (!AL.currentCtx) {
        return 40964;
      }
      // Reset error on get.
      var err = AL.currentCtx.err;
      AL.currentCtx.err = 0;
      return err;
    };

  
  var _alIsExtensionPresent = (pExtName) => {
      var name = UTF8ToString(pExtName);
  
      return AL.AL_EXTENSIONS[name] ? 1 : 0;
    };

  
  var _alGetEnumValue = (pEnumName) => {
      if (!AL.currentCtx) {
        return 0;
      }
  
      if (!pEnumName) {
        AL.currentCtx.err = 40963;
        return 0;
      }
      var name = UTF8ToString(pEnumName);
  
      switch (name) {
      // Spec doesn't clearly state that alGetEnumValue() is required to
      // support _only_ extension tokens.
      // We should probably follow OpenAL-Soft's example and support all
      // of the names we know.
      // See http://repo.or.cz/openal-soft.git/blob/HEAD:/Alc/ALc.c
      case 'AL_BITS': return 0x2002;
      case 'AL_BUFFER': return 0x1009;
      case 'AL_BUFFERS_PROCESSED': return 0x1016;
      case 'AL_BUFFERS_QUEUED': return 0x1015;
      case 'AL_BYTE_OFFSET': return 0x1026;
      case 'AL_CHANNELS': return 0x2003;
      case 'AL_CONE_INNER_ANGLE': return 0x1001;
      case 'AL_CONE_OUTER_ANGLE': return 0x1002;
      case 'AL_CONE_OUTER_GAIN': return 0x1022;
      case 'AL_DIRECTION': return 0x1005;
      case 'AL_DISTANCE_MODEL': return 0xD000;
      case 'AL_DOPPLER_FACTOR': return 0xC000;
      case 'AL_DOPPLER_VELOCITY': return 0xC001;
      case 'AL_EXPONENT_DISTANCE': return 0xD005;
      case 'AL_EXPONENT_DISTANCE_CLAMPED': return 0xD006;
      case 'AL_EXTENSIONS': return 0xB004;
      case 'AL_FORMAT_MONO16': return 0x1101;
      case 'AL_FORMAT_MONO8': return 0x1100;
      case 'AL_FORMAT_STEREO16': return 0x1103;
      case 'AL_FORMAT_STEREO8': return 0x1102;
      case 'AL_FREQUENCY': return 0x2001;
      case 'AL_GAIN': return 0x100A;
      case 'AL_INITIAL': return 0x1011;
      case 'AL_INVALID': return -1;
      case 'AL_ILLEGAL_ENUM': // fallthrough
      case 'AL_INVALID_ENUM': return 0xA002;
      case 'AL_INVALID_NAME': return 0xA001;
      case 'AL_ILLEGAL_COMMAND': // fallthrough
      case 'AL_INVALID_OPERATION': return 0xA004;
      case 'AL_INVALID_VALUE': return 0xA003;
      case 'AL_INVERSE_DISTANCE': return 0xD001;
      case 'AL_INVERSE_DISTANCE_CLAMPED': return 0xD002;
      case 'AL_LINEAR_DISTANCE': return 0xD003;
      case 'AL_LINEAR_DISTANCE_CLAMPED': return 0xD004;
      case 'AL_LOOPING': return 0x1007;
      case 'AL_MAX_DISTANCE': return 0x1023;
      case 'AL_MAX_GAIN': return 0x100E;
      case 'AL_MIN_GAIN': return 0x100D;
      case 'AL_NONE': return 0;
      case 'AL_NO_ERROR': return 0;
      case 'AL_ORIENTATION': return 0x100F;
      case 'AL_OUT_OF_MEMORY': return 0xA005;
      case 'AL_PAUSED': return 0x1013;
      case 'AL_PENDING': return 0x2011;
      case 'AL_PITCH': return 0x1003;
      case 'AL_PLAYING': return 0x1012;
      case 'AL_POSITION': return 0x1004;
      case 'AL_PROCESSED': return 0x2012;
      case 'AL_REFERENCE_DISTANCE': return 0x1020;
      case 'AL_RENDERER': return 0xB003;
      case 'AL_ROLLOFF_FACTOR': return 0x1021;
      case 'AL_SAMPLE_OFFSET': return 0x1025;
      case 'AL_SEC_OFFSET': return 0x1024;
      case 'AL_SIZE': return 0x2004;
      case 'AL_SOURCE_RELATIVE': return 0x202;
      case 'AL_SOURCE_STATE': return 0x1010;
      case 'AL_SOURCE_TYPE': return 0x1027;
      case 'AL_SPEED_OF_SOUND': return 0xC003;
      case 'AL_STATIC': return 0x1028;
      case 'AL_STOPPED': return 0x1014;
      case 'AL_STREAMING': return 0x1029;
      case 'AL_UNDETERMINED': return 0x1030;
      case 'AL_UNUSED': return 0x2010;
      case 'AL_VELOCITY': return 0x1006;
      case 'AL_VENDOR': return 0xB001;
      case 'AL_VERSION': return 0xB002;
  
      /* Extensions */
      case 'AL_AUTO_SOFT': return 0x0002;
      case 'AL_SOURCE_DISTANCE_MODEL': return 0x200;
      case 'AL_SOURCE_SPATIALIZE_SOFT': return 0x1214;
      case 'AL_LOOP_POINTS_SOFT': return 0x2015;
      case 'AL_BYTE_LENGTH_SOFT': return 0x2009;
      case 'AL_SAMPLE_LENGTH_SOFT': return 0x200A;
      case 'AL_SEC_LENGTH_SOFT': return 0x200B;
      case 'AL_FORMAT_MONO_FLOAT32': return 0x10010;
      case 'AL_FORMAT_STEREO_FLOAT32': return 0x10011;
  
      default:
        AL.currentCtx.err = 40963;
        return 0;
      }
    };

  
  var _alGetString = (param) => {
      if (AL.stringCache[param]) {
        return AL.stringCache[param];
      }
  
      var ret;
      switch (param) {
      case 0:
        ret = 'No Error';
        break;
      case 40961:
        ret = 'Invalid Name';
        break;
      case 40962:
        ret = 'Invalid Enum';
        break;
      case 40963:
        ret = 'Invalid Value';
        break;
      case 40964:
        ret = 'Invalid Operation';
        break;
      case 0xA005 /* AL_OUT_OF_MEMORY */:
        ret = 'Out of Memory';
        break;
      case 0xB001 /* AL_VENDOR */:
        ret = 'Emscripten';
        break;
      case 0xB002 /* AL_VERSION */:
        ret = '1.1';
        break;
      case 0xB003 /* AL_RENDERER */:
        ret = 'WebAudio';
        break;
      case 0xB004 /* AL_EXTENSIONS */:
        ret = Object.keys(AL.AL_EXTENSIONS).join(' ');
        break;
      default:
        if (AL.currentCtx) {
          AL.currentCtx.err = 40962;
        } else {
        }
        return 0;
      }
  
      ret = stringToNewUTF8(ret);
      AL.stringCache[param] = ret;
      return ret;
    };

  var _alEnable = (param) => {
      if (!AL.currentCtx) {
        return;
      }
      switch (param) {
      case 0x200 /* AL_SOURCE_DISTANCE_MODEL */:
        AL.currentCtx.sourceDistanceModel = true;
        AL.updateContextGlobal(AL.currentCtx);
        break;
      default:
        AL.currentCtx.err = 40962;
        return;
      }
    };

  var _alDisable = (param) => {
      if (!AL.currentCtx) {
        return;
      }
      switch (param) {
      case 0x200 /* AL_SOURCE_DISTANCE_MODEL */:
        AL.currentCtx.sourceDistanceModel = false;
        AL.updateContextGlobal(AL.currentCtx);
        break;
      default:
        AL.currentCtx.err = 40962;
        return;
      }
    };

  var _alIsEnabled = (param) => {
      if (!AL.currentCtx) {
        return 0;
      }
      switch (param) {
      case 0x200 /* AL_SOURCE_DISTANCE_MODEL */:
        return AL.currentCtx.sourceDistanceModel ? 0 : 1;
      default:
        AL.currentCtx.err = 40962;
        return 0;
      }
    };

  var _alGetDouble = (param) => {
      var val = AL.getGlobalParam('alGetDouble', param);
      if (val === null) {
        return 0.0;
      }
  
      switch (param) {
      case 49152:
      case 49155:
      case 53248:
        return val;
      default:
        AL.currentCtx.err = 40962;
        return 0.0;
      }
    };

  var _alGetDoublev = (param, pValues) => {
      var val = AL.getGlobalParam('alGetDoublev', param);
      // Silently ignore null destinations, as per the spec for global state functions
      if (val === null || !pValues) {
        return;
      }
  
      switch (param) {
      case 49152:
      case 49155:
      case 53248:
        HEAPF64[((pValues)>>3)] = val;
        break;
      default:
        AL.currentCtx.err = 40962;
        return;
      }
    };

  var _alGetFloat = (param) => {
      var val = AL.getGlobalParam('alGetFloat', param);
      if (val === null) {
        return 0.0;
      }
  
      switch (param) {
      case 49152:
      case 49155:
      case 53248:
        return val;
      default:
        return 0.0;
      }
    };

  var _alGetFloatv = (param, pValues) => {
      var val = AL.getGlobalParam('alGetFloatv', param);
      // Silently ignore null destinations, as per the spec for global state functions
      if (val === null || !pValues) {
        return;
      }
  
      switch (param) {
      case 49152:
      case 49155:
      case 53248:
        HEAPF32[((pValues)>>2)] = val;
        break;
      default:
        AL.currentCtx.err = 40962;
        return;
      }
    };

  var _alGetInteger = (param) => {
      var val = AL.getGlobalParam('alGetInteger', param);
      if (val === null) {
        return 0;
      }
  
      switch (param) {
      case 49152:
      case 49155:
      case 53248:
        return val;
      default:
        AL.currentCtx.err = 40962;
        return 0;
      }
    };

  var _alGetIntegerv = (param, pValues) => {
      var val = AL.getGlobalParam('alGetIntegerv', param);
      // Silently ignore null destinations, as per the spec for global state functions
      if (val === null || !pValues) {
        return;
      }
  
      switch (param) {
      case 49152:
      case 49155:
      case 53248:
        HEAP32[((pValues)>>2)] = val;
        break;
      default:
        AL.currentCtx.err = 40962;
        return;
      }
    };

  var _alGetBoolean = (param) => {
      var val = AL.getGlobalParam('alGetBoolean', param);
      if (val === null) {
        return 0;
      }
  
      switch (param) {
      case 49152:
      case 49155:
      case 53248:
        return val !== 0 ? 1 : 0;
      default:
        AL.currentCtx.err = 40962;
        return 0;
      }
    };

  var _alGetBooleanv = (param, pValues) => {
      var val = AL.getGlobalParam('alGetBooleanv', param);
      // Silently ignore null destinations, as per the spec for global state functions
      if (val === null || !pValues) {
        return;
      }
  
      switch (param) {
      case 49152:
      case 49155:
      case 53248:
        HEAP8[pValues] = val;
        break;
      default:
        AL.currentCtx.err = 40962;
        return;
      }
    };

  var _alDistanceModel = (model) => {
      AL.setGlobalParam('alDistanceModel', 53248, model);
    };

  var _alSpeedOfSound = (value) => {
      AL.setGlobalParam('alSpeedOfSound', 49155, value);
    };

  var _alDopplerFactor = (value) => {
      AL.setGlobalParam('alDopplerFactor', 49152, value);
    };

  var _alDopplerVelocity = (value) => {
      warnOnce('alDopplerVelocity() is deprecated, and only kept for compatibility with OpenAL 1.0. Use alSpeedOfSound() instead.');
      if (!AL.currentCtx) {
        return;
      }
      if (value <= 0) { // Negative or zero values are disallowed
        AL.currentCtx.err = 40963;
        return;
      }
    };

  var _alGetListenerf = (param, pValue) => {
      var val = AL.getListenerParam('alGetListenerf', param);
      if (val === null) {
        return;
      }
      if (!pValue) {
        AL.currentCtx.err = 40963;
        return;
      }
  
      switch (param) {
      case 4106:
        HEAPF32[((pValue)>>2)] = val;
        break;
      default:
        AL.currentCtx.err = 40962;
        return;
      }
    };

  var _alGetListener3f = (param, pValue0, pValue1, pValue2) => {
      var val = AL.getListenerParam('alGetListener3f', param);
      if (val === null) {
        return;
      }
      if (!pValue0 || !pValue1 || !pValue2) {
        AL.currentCtx.err = 40963;
        return;
      }
  
      switch (param) {
      case 4100:
      case 4102:
        HEAPF32[((pValue0)>>2)] = val[0];
        HEAPF32[((pValue1)>>2)] = val[1];
        HEAPF32[((pValue2)>>2)] = val[2];
        break;
      default:
        AL.currentCtx.err = 40962;
        return;
      }
    };

  var _alGetListenerfv = (param, pValues) => {
      var val = AL.getListenerParam('alGetListenerfv', param);
      if (val === null) {
        return;
      }
      if (!pValues) {
        AL.currentCtx.err = 40963;
        return;
      }
  
      switch (param) {
      case 4100:
      case 4102:
        HEAPF32[((pValues)>>2)] = val[0];
        HEAPF32[(((pValues)+(4))>>2)] = val[1];
        HEAPF32[(((pValues)+(8))>>2)] = val[2];
        break;
      case 4111:
        HEAPF32[((pValues)>>2)] = val[0];
        HEAPF32[(((pValues)+(4))>>2)] = val[1];
        HEAPF32[(((pValues)+(8))>>2)] = val[2];
        HEAPF32[(((pValues)+(12))>>2)] = val[3];
        HEAPF32[(((pValues)+(16))>>2)] = val[4];
        HEAPF32[(((pValues)+(20))>>2)] = val[5];
        break;
      default:
        AL.currentCtx.err = 40962;
        return;
      }
    };

  var _alGetListeneri = (param, pValue) => {
      var val = AL.getListenerParam('alGetListeneri', param);
      if (val === null) {
        return;
      }
      if (!pValue) {
        AL.currentCtx.err = 40963;
        return;
      }
  
      AL.currentCtx.err = 40962;
    };

  var _alGetListener3i = (param, pValue0, pValue1, pValue2) => {
      var val = AL.getListenerParam('alGetListener3i', param);
      if (val === null) {
        return;
      }
      if (!pValue0 || !pValue1 || !pValue2) {
        AL.currentCtx.err = 40963;
        return;
      }
  
      switch (param) {
      case 4100:
      case 4102:
        HEAP32[((pValue0)>>2)] = val[0];
        HEAP32[((pValue1)>>2)] = val[1];
        HEAP32[((pValue2)>>2)] = val[2];
        break;
      default:
        AL.currentCtx.err = 40962;
        return;
      }
    };

  var _alGetListeneriv = (param, pValues) => {
      var val = AL.getListenerParam('alGetListeneriv', param);
      if (val === null) {
        return;
      }
      if (!pValues) {
        AL.currentCtx.err = 40963;
        return;
      }
  
      switch (param) {
      case 4100:
      case 4102:
        HEAP32[((pValues)>>2)] = val[0];
        HEAP32[(((pValues)+(4))>>2)] = val[1];
        HEAP32[(((pValues)+(8))>>2)] = val[2];
        break;
      case 4111:
        HEAP32[((pValues)>>2)] = val[0];
        HEAP32[(((pValues)+(4))>>2)] = val[1];
        HEAP32[(((pValues)+(8))>>2)] = val[2];
        HEAP32[(((pValues)+(12))>>2)] = val[3];
        HEAP32[(((pValues)+(16))>>2)] = val[4];
        HEAP32[(((pValues)+(20))>>2)] = val[5];
        break;
      default:
        AL.currentCtx.err = 40962;
        return;
      }
    };

  var _alListenerf = (param, value) => {
      switch (param) {
      case 4106:
        AL.setListenerParam('alListenerf', param, value);
        break;
      default:
        AL.setListenerParam('alListenerf', param, null);
        break;
      }
    };

  var _alListener3f = (param, value0, value1, value2) => {
      switch (param) {
      case 4100:
      case 4102:
        AL.paramArray[0] = value0;
        AL.paramArray[1] = value1;
        AL.paramArray[2] = value2;
        AL.setListenerParam('alListener3f', param, AL.paramArray);
        break;
      default:
        AL.setListenerParam('alListener3f', param, null);
        break;
      }
    };

  var _alListenerfv = (param, pValues) => {
      if (!AL.currentCtx) {
        return;
      }
      if (!pValues) {
        AL.currentCtx.err = 40963;
        return;
      }
  
      switch (param) {
      case 4100:
      case 4102:
        AL.paramArray[0] = HEAPF32[((pValues)>>2)];
        AL.paramArray[1] = HEAPF32[(((pValues)+(4))>>2)];
        AL.paramArray[2] = HEAPF32[(((pValues)+(8))>>2)];
        AL.setListenerParam('alListenerfv', param, AL.paramArray);
        break;
      case 4111:
        AL.paramArray[0] = HEAPF32[((pValues)>>2)];
        AL.paramArray[1] = HEAPF32[(((pValues)+(4))>>2)];
        AL.paramArray[2] = HEAPF32[(((pValues)+(8))>>2)];
        AL.paramArray[3] = HEAPF32[(((pValues)+(12))>>2)];
        AL.paramArray[4] = HEAPF32[(((pValues)+(16))>>2)];
        AL.paramArray[5] = HEAPF32[(((pValues)+(20))>>2)];
        AL.setListenerParam('alListenerfv', param, AL.paramArray);
        break;
      default:
        AL.setListenerParam('alListenerfv', param, null);
        break;
      }
    };

  var _alListeneri = (param, value) => {
      AL.setListenerParam('alListeneri', param, null);
    };

  var _alListener3i = (param, value0, value1, value2) => {
      switch (param) {
      case 4100:
      case 4102:
        AL.paramArray[0] = value0;
        AL.paramArray[1] = value1;
        AL.paramArray[2] = value2;
        AL.setListenerParam('alListener3i', param, AL.paramArray);
        break;
      default:
        AL.setListenerParam('alListener3i', param, null);
        break;
      }
    };

  var _alListeneriv = (param, pValues) => {
      if (!AL.currentCtx) {
        return;
      }
      if (!pValues) {
        AL.currentCtx.err = 40963;
        return;
      }
  
      switch (param) {
      case 4100:
      case 4102:
        AL.paramArray[0] = HEAP32[((pValues)>>2)];
        AL.paramArray[1] = HEAP32[(((pValues)+(4))>>2)];
        AL.paramArray[2] = HEAP32[(((pValues)+(8))>>2)];
        AL.setListenerParam('alListeneriv', param, AL.paramArray);
        break;
      case 4111:
        AL.paramArray[0] = HEAP32[((pValues)>>2)];
        AL.paramArray[1] = HEAP32[(((pValues)+(4))>>2)];
        AL.paramArray[2] = HEAP32[(((pValues)+(8))>>2)];
        AL.paramArray[3] = HEAP32[(((pValues)+(12))>>2)];
        AL.paramArray[4] = HEAP32[(((pValues)+(16))>>2)];
        AL.paramArray[5] = HEAP32[(((pValues)+(20))>>2)];
        AL.setListenerParam('alListeneriv', param, AL.paramArray);
        break;
      default:
        AL.setListenerParam('alListeneriv', param, null);
        break;
      }
    };

  var _alIsBuffer = (bufferId) => {
      if (!AL.currentCtx) {
        return false;
      }
      if (bufferId > AL.buffers.length) {
        return false;
      }
  
      if (!AL.buffers[bufferId]) {
        return false;
      }
      return true;
    };

  var _alBufferData = (bufferId, format, pData, size, freq) => {
      if (!AL.currentCtx) {
        return;
      }
      var buf = AL.buffers[bufferId];
      if (!buf) {
        AL.currentCtx.err = 40963;
        return;
      }
      if (freq <= 0) {
        AL.currentCtx.err = 40963;
        return;
      }
  
      var audioBuf = null;
      try {
        switch (format) {
        case 0x1100 /* AL_FORMAT_MONO8 */:
          if (size > 0) {
            audioBuf = AL.currentCtx.audioCtx.createBuffer(1, size, freq);
            var channel0 = audioBuf.getChannelData(0);
            for (var i = 0; i < size; ++i) {
              channel0[i] = HEAPU8[pData++] * 0.0078125 /* 1/128 */ - 1.0;
            }
          }
          buf.bytesPerSample = 1;
          buf.channels = 1;
          buf.length = size;
          break;
        case 0x1101 /* AL_FORMAT_MONO16 */:
          if (size > 0) {
            audioBuf = AL.currentCtx.audioCtx.createBuffer(1, size >> 1, freq);
            var channel0 = audioBuf.getChannelData(0);
            pData >>= 1;
            for (var i = 0; i < size >> 1; ++i) {
              channel0[i] = HEAP16[pData++] * 0.000030517578125 /* 1/32768 */;
            }
          }
          buf.bytesPerSample = 2;
          buf.channels = 1;
          buf.length = size >> 1;
          break;
        case 0x1102 /* AL_FORMAT_STEREO8 */:
          if (size > 0) {
            audioBuf = AL.currentCtx.audioCtx.createBuffer(2, size >> 1, freq);
            var channel0 = audioBuf.getChannelData(0);
            var channel1 = audioBuf.getChannelData(1);
            for (var i = 0; i < size >> 1; ++i) {
              channel0[i] = HEAPU8[pData++] * 0.0078125 /* 1/128 */ - 1.0;
              channel1[i] = HEAPU8[pData++] * 0.0078125 /* 1/128 */ - 1.0;
            }
          }
          buf.bytesPerSample = 1;
          buf.channels = 2;
          buf.length = size >> 1;
          break;
        case 0x1103 /* AL_FORMAT_STEREO16 */:
          if (size > 0) {
            audioBuf = AL.currentCtx.audioCtx.createBuffer(2, size >> 2, freq);
            var channel0 = audioBuf.getChannelData(0);
            var channel1 = audioBuf.getChannelData(1);
            pData >>= 1;
            for (var i = 0; i < size >> 2; ++i) {
              channel0[i] = HEAP16[pData++] * 0.000030517578125 /* 1/32768 */;
              channel1[i] = HEAP16[pData++] * 0.000030517578125 /* 1/32768 */;
            }
          }
          buf.bytesPerSample = 2;
          buf.channels = 2;
          buf.length = size >> 2;
          break;
        case 0x10010 /* AL_FORMAT_MONO_FLOAT32 */:
          if (size > 0) {
            audioBuf = AL.currentCtx.audioCtx.createBuffer(1, size >> 2, freq);
            var channel0 = audioBuf.getChannelData(0);
            pData >>= 2;
            for (var i = 0; i < size >> 2; ++i) {
              channel0[i] = HEAPF32[pData++];
            }
          }
          buf.bytesPerSample = 4;
          buf.channels = 1;
          buf.length = size >> 2;
          break;
        case 0x10011 /* AL_FORMAT_STEREO_FLOAT32 */:
          if (size > 0) {
            audioBuf = AL.currentCtx.audioCtx.createBuffer(2, size >> 3, freq);
            var channel0 = audioBuf.getChannelData(0);
            var channel1 = audioBuf.getChannelData(1);
            pData >>= 2;
            for (var i = 0; i < size >> 3; ++i) {
              channel0[i] = HEAPF32[pData++];
              channel1[i] = HEAPF32[pData++];
            }
          }
          buf.bytesPerSample = 4;
          buf.channels = 2;
          buf.length = size >> 3;
          break;
        default:
          AL.currentCtx.err = 40963;
          return;
        }
        buf.frequency = freq;
        buf.audioBuf = audioBuf;
      } catch (e) {
        AL.currentCtx.err = 40963;
        return;
      }
    };

  var _alGetBufferf = (bufferId, param, pValue) => {
      var val = AL.getBufferParam('alGetBufferf', bufferId, param);
      if (val === null) {
        return;
      }
      if (!pValue) {
        AL.currentCtx.err = 40963;
        return;
      }
  
      AL.currentCtx.err = 40962;
    };

  var _alGetBuffer3f = (bufferId, param, pValue0, pValue1, pValue2) => {
      var val = AL.getBufferParam('alGetBuffer3f', bufferId, param);
      if (val === null) {
        return;
      }
      if (!pValue0 || !pValue1 || !pValue2) {
        AL.currentCtx.err = 40963;
        return;
      }
  
      AL.currentCtx.err = 40962;
    };

  var _alGetBufferfv = (bufferId, param, pValues) => {
      var val = AL.getBufferParam('alGetBufferfv', bufferId, param);
      if (val === null) {
        return;
      }
      if (!pValues) {
        AL.currentCtx.err = 40963;
        return;
      }
  
      AL.currentCtx.err = 40962;
    };

  var _alGetBufferi = (bufferId, param, pValue) => {
      var val = AL.getBufferParam('alGetBufferi', bufferId, param);
      if (val === null) {
        return;
      }
      if (!pValue) {
        AL.currentCtx.err = 40963;
        return;
      }
  
      switch (param) {
      case 0x2001 /* AL_FREQUENCY */:
      case 0x2002 /* AL_BITS */:
      case 0x2003 /* AL_CHANNELS */:
      case 0x2004 /* AL_SIZE */:
        HEAP32[((pValue)>>2)] = val;
        break;
      default:
        AL.currentCtx.err = 40962;
        return;
      }
    };

  var _alGetBuffer3i = (bufferId, param, pValue0, pValue1, pValue2) => {
      var val = AL.getBufferParam('alGetBuffer3i', bufferId, param);
      if (val === null) {
        return;
      }
      if (!pValue0 || !pValue1 || !pValue2) {
        AL.currentCtx.err = 40963;
        return;
      }
  
      AL.currentCtx.err = 40962;
    };

  var _alGetBufferiv = (bufferId, param, pValues) => {
      var val = AL.getBufferParam('alGetBufferiv', bufferId, param);
      if (val === null) {
        return;
      }
      if (!pValues) {
        AL.currentCtx.err = 40963;
        return;
      }
  
      switch (param) {
      case 0x2001 /* AL_FREQUENCY */:
      case 0x2002 /* AL_BITS */:
      case 0x2003 /* AL_CHANNELS */:
      case 0x2004 /* AL_SIZE */:
        HEAP32[((pValues)>>2)] = val;
        break;
      case 0x2015 /* AL_LOOP_POINTS_SOFT */:
        HEAP32[((pValues)>>2)] = val[0];
        HEAP32[(((pValues)+(4))>>2)] = val[1];
        break;
      default:
        AL.currentCtx.err = 40962;
        return;
      }
    };

  var _alBufferf = (bufferId, param, value) => {
      AL.setBufferParam('alBufferf', bufferId, param, null);
    };

  var _alBuffer3f = (bufferId, param, value0, value1, value2) => {
      AL.setBufferParam('alBuffer3f', bufferId, param, null);
    };

  var _alBufferfv = (bufferId, param, pValues) => {
      if (!AL.currentCtx) {
        return;
      }
      if (!pValues) {
        AL.currentCtx.err = 40963;
        return;
      }
  
      AL.setBufferParam('alBufferfv', bufferId, param, null);
    };

  var _alBufferi = (bufferId, param, value) => {
      AL.setBufferParam('alBufferi', bufferId, param, null);
    };

  var _alBuffer3i = (bufferId, param, value0, value1, value2) => {
      AL.setBufferParam('alBuffer3i', bufferId, param, null);
    };

  var _alBufferiv = (bufferId, param, pValues) => {
      if (!AL.currentCtx) {
        return;
      }
      if (!pValues) {
        AL.currentCtx.err = 40963;
        return;
      }
  
      switch (param) {
      case 0x2015 /* AL_LOOP_POINTS_SOFT */:
        AL.paramArray[0] = HEAP32[((pValues)>>2)];
        AL.paramArray[1] = HEAP32[(((pValues)+(4))>>2)];
        AL.setBufferParam('alBufferiv', bufferId, param, AL.paramArray);
        break;
      default:
        AL.setBufferParam('alBufferiv', bufferId, param, null);
        break;
      }
    };

  var _alIsSource = (sourceId) => {
      if (!AL.currentCtx) {
        return false;
      }
  
      if (!AL.currentCtx.sources[sourceId]) {
        return false;
      }
      return true;
    };

  var _alSourceQueueBuffers = (sourceId, count, pBufferIds) => {
      if (!AL.currentCtx) {
        return;
      }
      var src = AL.currentCtx.sources[sourceId];
      if (!src) {
        AL.currentCtx.err = 40961;
        return;
      }
      if (src.type === 4136) {
        AL.currentCtx.err = 40964;
        return;
      }
  
      if (count === 0) {
        return;
      }
  
      // Find the first non-zero buffer in the queue to determine the proper format
      var templateBuf = AL.buffers[0];
      for (var i = 0; i < src.bufQueue.length; i++) {
        if (src.bufQueue[i].id !== 0) {
          templateBuf = src.bufQueue[i];
          break;
        }
      }
  
      for (var i = 0; i < count; ++i) {
        var bufId = HEAP32[(((pBufferIds)+(i*4))>>2)];
        var buf = AL.buffers[bufId];
        if (!buf) {
          AL.currentCtx.err = 40961;
          return;
        }
  
        // Check that the added buffer has the correct format. If the template is the zero buffer, any format is valid.
        if (templateBuf.id !== 0 && (
          buf.frequency !== templateBuf.frequency
          || buf.bytesPerSample !== templateBuf.bytesPerSample
          || buf.channels !== templateBuf.channels)
        ) {
          AL.currentCtx.err = 40964;
        }
      }
  
      // If the only buffer in the queue is the zero buffer, clear the queue before we add anything.
      if (src.bufQueue.length === 1 && src.bufQueue[0].id === 0) {
        src.bufQueue.length = 0;
      }
  
      src.type = 0x1029 /* AL_STREAMING */;
      for (var i = 0; i < count; ++i) {
        var bufId = HEAP32[(((pBufferIds)+(i*4))>>2)];
        var buf = AL.buffers[bufId];
        buf.refCount++;
        src.bufQueue.push(buf);
      }
  
      // if the source is looping, cancel the schedule so we can reschedule the loop order
      if (src.looping) {
        AL.cancelPendingSourceAudio(src);
      }
  
      AL.initSourcePanner(src);
      AL.scheduleSourceAudio(src);
    };

  var _alSourceUnqueueBuffers = (sourceId, count, pBufferIds) => {
      if (!AL.currentCtx) {
        return;
      }
      var src = AL.currentCtx.sources[sourceId];
      if (!src) {
        AL.currentCtx.err = 40961;
        return;
      }
      if (count > (src.bufQueue.length === 1 && src.bufQueue[0].id === 0 ? 0 : src.bufsProcessed)) {
        AL.currentCtx.err = 40963;
        return;
      }
  
      if (count === 0) {
        return;
      }
  
      for (var i = 0; i < count; i++) {
        var buf = src.bufQueue.shift();
        buf.refCount--;
        // Write the buffers index out to the return list.
        HEAP32[(((pBufferIds)+(i*4))>>2)] = buf.id;
        src.bufsProcessed--;
      }
  
      /// If the queue is empty, put the zero buffer back in
      if (src.bufQueue.length === 0) {
        src.bufQueue.push(AL.buffers[0]);
      }
  
      AL.initSourcePanner(src);
      AL.scheduleSourceAudio(src);
    };

  var _alSourcePlay = (sourceId) => {
      if (!AL.currentCtx) {
        return;
      }
      var src = AL.currentCtx.sources[sourceId];
      if (!src) {
        AL.currentCtx.err = 40961;
        return;
      }
      AL.setSourceState(src, 4114);
    };

  var _alSourcePlayv = (count, pSourceIds) => {
      if (!AL.currentCtx) {
        return;
      }
      if (!pSourceIds) {
        AL.currentCtx.err = 40963;
      }
      for (var i = 0; i < count; ++i) {
        if (!AL.currentCtx.sources[HEAP32[(((pSourceIds)+(i*4))>>2)]]) {
          AL.currentCtx.err = 40961;
          return;
        }
      }
  
      for (var i = 0; i < count; ++i) {
        var srcId = HEAP32[(((pSourceIds)+(i*4))>>2)];
        AL.setSourceState(AL.currentCtx.sources[srcId], 4114);
      }
    };

  var _alSourceStop = (sourceId) => {
      if (!AL.currentCtx) {
        return;
      }
      var src = AL.currentCtx.sources[sourceId];
      if (!src) {
        AL.currentCtx.err = 40961;
        return;
      }
      AL.setSourceState(src, 4116);
    };

  var _alSourceStopv = (count, pSourceIds) => {
      if (!AL.currentCtx) {
        return;
      }
      if (!pSourceIds) {
        AL.currentCtx.err = 40963;
      }
      for (var i = 0; i < count; ++i) {
        if (!AL.currentCtx.sources[HEAP32[(((pSourceIds)+(i*4))>>2)]]) {
          AL.currentCtx.err = 40961;
          return;
        }
      }
  
      for (var i = 0; i < count; ++i) {
        var srcId = HEAP32[(((pSourceIds)+(i*4))>>2)];
        AL.setSourceState(AL.currentCtx.sources[srcId], 4116);
      }
    };

  var _alSourceRewind = (sourceId) => {
      if (!AL.currentCtx) {
        return;
      }
      var src = AL.currentCtx.sources[sourceId];
      if (!src) {
        AL.currentCtx.err = 40961;
        return;
      }
      // Stop the source first to clear the source queue
      AL.setSourceState(src, 4116);
      // Now set the state of AL_INITIAL according to the specification
      AL.setSourceState(src, 4113);
    };

  var _alSourceRewindv = (count, pSourceIds) => {
      if (!AL.currentCtx) {
        return;
      }
      if (!pSourceIds) {
        AL.currentCtx.err = 40963;
      }
      for (var i = 0; i < count; ++i) {
        if (!AL.currentCtx.sources[HEAP32[(((pSourceIds)+(i*4))>>2)]]) {
          AL.currentCtx.err = 40961;
          return;
        }
      }
  
      for (var i = 0; i < count; ++i) {
        var srcId = HEAP32[(((pSourceIds)+(i*4))>>2)];
        AL.setSourceState(AL.currentCtx.sources[srcId], 4113);
      }
    };

  var _alSourcePause = (sourceId) => {
      if (!AL.currentCtx) {
        return;
      }
      var src = AL.currentCtx.sources[sourceId];
      if (!src) {
        AL.currentCtx.err = 40961;
        return;
      }
      AL.setSourceState(src, 4115);
    };

  var _alSourcePausev = (count, pSourceIds) => {
      if (!AL.currentCtx) {
        return;
      }
      if (!pSourceIds) {
        AL.currentCtx.err = 40963;
      }
      for (var i = 0; i < count; ++i) {
        if (!AL.currentCtx.sources[HEAP32[(((pSourceIds)+(i*4))>>2)]]) {
          AL.currentCtx.err = 40961;
          return;
        }
      }
  
      for (var i = 0; i < count; ++i) {
        var srcId = HEAP32[(((pSourceIds)+(i*4))>>2)];
        AL.setSourceState(AL.currentCtx.sources[srcId], 4115);
      }
    };

  var _alGetSourcef = (sourceId, param, pValue) => {
      var val = AL.getSourceParam('alGetSourcef', sourceId, param);
      if (val === null) {
        return;
      }
      if (!pValue) {
        AL.currentCtx.err = 40963;
        return;
      }
  
      switch (param) {
      case 0x1001 /* AL_CONE_INNER_ANGLE */:
      case 0x1002 /* AL_CONE_OUTER_ANGLE */:
      case 0x1003 /* AL_PITCH */:
      case 4106:
      case 0x100D /* AL_MIN_GAIN */:
      case 0x100E /* AL_MAX_GAIN */:
      case 0x1020 /* AL_REFERENCE_DISTANCE */:
      case 0x1021 /* AL_ROLLOFF_FACTOR */:
      case 0x1022 /* AL_CONE_OUTER_GAIN */:
      case 0x1023 /* AL_MAX_DISTANCE */:
      case 0x1024 /* AL_SEC_OFFSET */:
      case 0x1025 /* AL_SAMPLE_OFFSET */:
      case 0x1026 /* AL_BYTE_OFFSET */:
      case 0x200B /* AL_SEC_LENGTH_SOFT */:
        HEAPF32[((pValue)>>2)] = val;
        break;
      default:
        AL.currentCtx.err = 40962;
        return;
      }
    };

  var _alGetSource3f = (sourceId, param, pValue0, pValue1, pValue2) => {
      var val = AL.getSourceParam('alGetSource3f', sourceId, param);
      if (val === null) {
        return;
      }
      if (!pValue0 || !pValue1 || !pValue2) {
        AL.currentCtx.err = 40963;
        return;
      }
  
      switch (param) {
      case 4100:
      case 4101:
      case 4102:
        HEAPF32[((pValue0)>>2)] = val[0];
        HEAPF32[((pValue1)>>2)] = val[1];
        HEAPF32[((pValue2)>>2)] = val[2];
        break;
      default:
        AL.currentCtx.err = 40962;
        return;
      }
    };

  var _alGetSourcefv = (sourceId, param, pValues) => {
      var val = AL.getSourceParam('alGetSourcefv', sourceId, param);
      if (val === null) {
        return;
      }
      if (!pValues) {
        AL.currentCtx.err = 40963;
        return;
      }
  
      switch (param) {
      case 0x1001 /* AL_CONE_INNER_ANGLE */:
      case 0x1002 /* AL_CONE_OUTER_ANGLE */:
      case 0x1003 /* AL_PITCH */:
      case 4106:
      case 0x100D /* AL_MIN_GAIN */:
      case 0x100E /* AL_MAX_GAIN */:
      case 0x1020 /* AL_REFERENCE_DISTANCE */:
      case 0x1021 /* AL_ROLLOFF_FACTOR */:
      case 0x1022 /* AL_CONE_OUTER_GAIN */:
      case 0x1023 /* AL_MAX_DISTANCE */:
      case 0x1024 /* AL_SEC_OFFSET */:
      case 0x1025 /* AL_SAMPLE_OFFSET */:
      case 0x1026 /* AL_BYTE_OFFSET */:
      case 0x200B /* AL_SEC_LENGTH_SOFT */:
        HEAPF32[((pValues)>>2)] = val[0];
        break;
      case 4100:
      case 4101:
      case 4102:
        HEAPF32[((pValues)>>2)] = val[0];
        HEAPF32[(((pValues)+(4))>>2)] = val[1];
        HEAPF32[(((pValues)+(8))>>2)] = val[2];
        break;
      default:
        AL.currentCtx.err = 40962;
        return;
      }
    };

  var _alGetSourcei = (sourceId, param, pValue) => {
      var val = AL.getSourceParam('alGetSourcei', sourceId, param);
      if (val === null) {
        return;
      }
      if (!pValue) {
        AL.currentCtx.err = 40963;
        return;
      }
  
      switch (param) {
      case 0x202 /* AL_SOURCE_RELATIVE */:
      case 0x1001 /* AL_CONE_INNER_ANGLE */:
      case 0x1002 /* AL_CONE_OUTER_ANGLE */:
      case 0x1007 /* AL_LOOPING */:
      case 0x1009 /* AL_BUFFER */:
      case 0x1010 /* AL_SOURCE_STATE */:
      case 0x1015 /* AL_BUFFERS_QUEUED */:
      case 0x1016 /* AL_BUFFERS_PROCESSED */:
      case 0x1020 /* AL_REFERENCE_DISTANCE */:
      case 0x1021 /* AL_ROLLOFF_FACTOR */:
      case 0x1023 /* AL_MAX_DISTANCE */:
      case 0x1024 /* AL_SEC_OFFSET */:
      case 0x1025 /* AL_SAMPLE_OFFSET */:
      case 0x1026 /* AL_BYTE_OFFSET */:
      case 0x1027 /* AL_SOURCE_TYPE */:
      case 0x1214 /* AL_SOURCE_SPATIALIZE_SOFT */:
      case 0x2009 /* AL_BYTE_LENGTH_SOFT */:
      case 0x200A /* AL_SAMPLE_LENGTH_SOFT */:
      case 53248:
        HEAP32[((pValue)>>2)] = val;
        break;
      default:
        AL.currentCtx.err = 40962;
        return;
      }
    };

  var _alGetSource3i = (sourceId, param, pValue0, pValue1, pValue2) => {
      var val = AL.getSourceParam('alGetSource3i', sourceId, param);
      if (val === null) {
        return;
      }
      if (!pValue0 || !pValue1 || !pValue2) {
        AL.currentCtx.err = 40963;
        return;
      }
  
      switch (param) {
      case 4100:
      case 4101:
      case 4102:
        HEAP32[((pValue0)>>2)] = val[0];
        HEAP32[((pValue1)>>2)] = val[1];
        HEAP32[((pValue2)>>2)] = val[2];
        break;
      default:
        AL.currentCtx.err = 40962;
        return;
      }
    };

  var _alGetSourceiv = (sourceId, param, pValues) => {
      var val = AL.getSourceParam('alGetSourceiv', sourceId, param);
      if (val === null) {
        return;
      }
      if (!pValues) {
        AL.currentCtx.err = 40963;
        return;
      }
  
      switch (param) {
      case 0x202 /* AL_SOURCE_RELATIVE */:
      case 0x1001 /* AL_CONE_INNER_ANGLE */:
      case 0x1002 /* AL_CONE_OUTER_ANGLE */:
      case 0x1007 /* AL_LOOPING */:
      case 0x1009 /* AL_BUFFER */:
      case 0x1010 /* AL_SOURCE_STATE */:
      case 0x1015 /* AL_BUFFERS_QUEUED */:
      case 0x1016 /* AL_BUFFERS_PROCESSED */:
      case 0x1020 /* AL_REFERENCE_DISTANCE */:
      case 0x1021 /* AL_ROLLOFF_FACTOR */:
      case 0x1023 /* AL_MAX_DISTANCE */:
      case 0x1024 /* AL_SEC_OFFSET */:
      case 0x1025 /* AL_SAMPLE_OFFSET */:
      case 0x1026 /* AL_BYTE_OFFSET */:
      case 0x1027 /* AL_SOURCE_TYPE */:
      case 0x1214 /* AL_SOURCE_SPATIALIZE_SOFT */:
      case 0x2009 /* AL_BYTE_LENGTH_SOFT */:
      case 0x200A /* AL_SAMPLE_LENGTH_SOFT */:
      case 53248:
        HEAP32[((pValues)>>2)] = val;
        break;
      case 4100:
      case 4101:
      case 4102:
        HEAP32[((pValues)>>2)] = val[0];
        HEAP32[(((pValues)+(4))>>2)] = val[1];
        HEAP32[(((pValues)+(8))>>2)] = val[2];
        break;
      default:
        AL.currentCtx.err = 40962;
        return;
      }
    };

  var _alSourcef = (sourceId, param, value) => {
      switch (param) {
      case 0x1001 /* AL_CONE_INNER_ANGLE */:
      case 0x1002 /* AL_CONE_OUTER_ANGLE */:
      case 0x1003 /* AL_PITCH */:
      case 4106:
      case 0x100D /* AL_MIN_GAIN */:
      case 0x100E /* AL_MAX_GAIN */:
      case 0x1020 /* AL_REFERENCE_DISTANCE */:
      case 0x1021 /* AL_ROLLOFF_FACTOR */:
      case 0x1022 /* AL_CONE_OUTER_GAIN */:
      case 0x1023 /* AL_MAX_DISTANCE */:
      case 0x1024 /* AL_SEC_OFFSET */:
      case 0x1025 /* AL_SAMPLE_OFFSET */:
      case 0x1026 /* AL_BYTE_OFFSET */:
      case 0x200B /* AL_SEC_LENGTH_SOFT */:
        AL.setSourceParam('alSourcef', sourceId, param, value);
        break;
      default:
        AL.setSourceParam('alSourcef', sourceId, param, null);
        break;
      }
    };

  var _alSource3f = (sourceId, param, value0, value1, value2) => {
      switch (param) {
      case 4100:
      case 4101:
      case 4102:
        AL.paramArray[0] = value0;
        AL.paramArray[1] = value1;
        AL.paramArray[2] = value2;
        AL.setSourceParam('alSource3f', sourceId, param, AL.paramArray);
        break;
      default:
        AL.setSourceParam('alSource3f', sourceId, param, null);
        break;
      }
    };

  var _alSourcefv = (sourceId, param, pValues) => {
      if (!AL.currentCtx) {
        return;
      }
      if (!pValues) {
        AL.currentCtx.err = 40963;
        return;
      }
  
      switch (param) {
      case 0x1001 /* AL_CONE_INNER_ANGLE */:
      case 0x1002 /* AL_CONE_OUTER_ANGLE */:
      case 0x1003 /* AL_PITCH */:
      case 4106:
      case 0x100D /* AL_MIN_GAIN */:
      case 0x100E /* AL_MAX_GAIN */:
      case 0x1020 /* AL_REFERENCE_DISTANCE */:
      case 0x1021 /* AL_ROLLOFF_FACTOR */:
      case 0x1022 /* AL_CONE_OUTER_GAIN */:
      case 0x1023 /* AL_MAX_DISTANCE */:
      case 0x1024 /* AL_SEC_OFFSET */:
      case 0x1025 /* AL_SAMPLE_OFFSET */:
      case 0x1026 /* AL_BYTE_OFFSET */:
      case 0x200B /* AL_SEC_LENGTH_SOFT */:
        var val = HEAPF32[((pValues)>>2)];
        AL.setSourceParam('alSourcefv', sourceId, param, val);
        break;
      case 4100:
      case 4101:
      case 4102:
        AL.paramArray[0] = HEAPF32[((pValues)>>2)];
        AL.paramArray[1] = HEAPF32[(((pValues)+(4))>>2)];
        AL.paramArray[2] = HEAPF32[(((pValues)+(8))>>2)];
        AL.setSourceParam('alSourcefv', sourceId, param, AL.paramArray);
        break;
      default:
        AL.setSourceParam('alSourcefv', sourceId, param, null);
        break;
      }
    };


  var _alSource3i = (sourceId, param, value0, value1, value2) => {
      switch (param) {
      case 4100:
      case 4101:
      case 4102:
        AL.paramArray[0] = value0;
        AL.paramArray[1] = value1;
        AL.paramArray[2] = value2;
        AL.setSourceParam('alSource3i', sourceId, param, AL.paramArray);
        break;
      default:
        AL.setSourceParam('alSource3i', sourceId, param, null);
        break;
      }
    };

  var _alSourceiv = (sourceId, param, pValues) => {
      if (!AL.currentCtx) {
        return;
      }
      if (!pValues) {
        AL.currentCtx.err = 40963;
        return;
      }
  
      switch (param) {
      case 0x202 /* AL_SOURCE_RELATIVE */:
      case 0x1001 /* AL_CONE_INNER_ANGLE */:
      case 0x1002 /* AL_CONE_OUTER_ANGLE */:
      case 0x1007 /* AL_LOOPING */:
      case 0x1009 /* AL_BUFFER */:
      case 0x1020 /* AL_REFERENCE_DISTANCE */:
      case 0x1021 /* AL_ROLLOFF_FACTOR */:
      case 0x1023 /* AL_MAX_DISTANCE */:
      case 0x1024 /* AL_SEC_OFFSET */:
      case 0x1025 /* AL_SAMPLE_OFFSET */:
      case 0x1026 /* AL_BYTE_OFFSET */:
      case 0x1214 /* AL_SOURCE_SPATIALIZE_SOFT */:
      case 0x2009 /* AL_BYTE_LENGTH_SOFT */:
      case 0x200A /* AL_SAMPLE_LENGTH_SOFT */:
      case 53248:
        var val = HEAP32[((pValues)>>2)];
        AL.setSourceParam('alSourceiv', sourceId, param, val);
        break;
      case 4100:
      case 4101:
      case 4102:
        AL.paramArray[0] = HEAP32[((pValues)>>2)];
        AL.paramArray[1] = HEAP32[(((pValues)+(4))>>2)];
        AL.paramArray[2] = HEAP32[(((pValues)+(8))>>2)];
        AL.setSourceParam('alSourceiv', sourceId, param, AL.paramArray);
        break;
      default:
        AL.setSourceParam('alSourceiv', sourceId, param, null);
        break;
      }
    };

  
  var _glutPostRedisplay = () => {
      if (GLUT.displayFunc && !GLUT.requestedAnimationFrame) {
        GLUT.requestedAnimationFrame = true;
        Browser.requestAnimationFrame(function() {
          GLUT.requestedAnimationFrame = false;
          Browser.mainLoop.runIter(function() {
            (() => dynCall_v(GLUT.displayFunc))();
          });
        });
      }
    };
  
  var GLUT = {
  initTime:null,
  idleFunc:null,
  displayFunc:null,
  keyboardFunc:null,
  keyboardUpFunc:null,
  specialFunc:null,
  specialUpFunc:null,
  reshapeFunc:null,
  motionFunc:null,
  passiveMotionFunc:null,
  mouseFunc:null,
  buttons:0,
  modifiers:0,
  initWindowWidth:256,
  initWindowHeight:256,
  initDisplayMode:18,
  windowX:0,
  windowY:0,
  windowWidth:0,
  windowHeight:0,
  requestedAnimationFrame:false,
  saveModifiers:(event) => {
        GLUT.modifiers = 0;
        if (event['shiftKey'])
          GLUT.modifiers += 1; /* GLUT_ACTIVE_SHIFT */
        if (event['ctrlKey'])
          GLUT.modifiers += 2; /* GLUT_ACTIVE_CTRL */
        if (event['altKey'])
          GLUT.modifiers += 4; /* GLUT_ACTIVE_ALT */
      },
  onMousemove:(event) => {
        /* Send motion event only if the motion changed, prevents
         * spamming our app with uncessary callback call. It does happen in
         * Chrome on Windows.
         */
        var lastX = Browser.mouseX;
        var lastY = Browser.mouseY;
        Browser.calculateMouseEvent(event);
        var newX = Browser.mouseX;
        var newY = Browser.mouseY;
        if (newX == lastX && newY == lastY) return;
  
        if (GLUT.buttons == 0 && event.target == Module["canvas"] && GLUT.passiveMotionFunc) {
          event.preventDefault();
          GLUT.saveModifiers(event);
          ((a1, a2) => dynCall_vii(GLUT.passiveMotionFunc, a1, a2))(lastX, lastY);
        } else if (GLUT.buttons != 0 && GLUT.motionFunc) {
          event.preventDefault();
          GLUT.saveModifiers(event);
          ((a1, a2) => dynCall_vii(GLUT.motionFunc, a1, a2))(lastX, lastY);
        }
      },
  getSpecialKey:(keycode) => {
          var key = null;
          switch (keycode) {
            case 8:  key = 120 /* backspace */; break;
            case 46: key = 111 /* delete */; break;
  
            case 0x70 /*DOM_VK_F1*/: key = 1 /* GLUT_KEY_F1 */; break;
            case 0x71 /*DOM_VK_F2*/: key = 2 /* GLUT_KEY_F2 */; break;
            case 0x72 /*DOM_VK_F3*/: key = 3 /* GLUT_KEY_F3 */; break;
            case 0x73 /*DOM_VK_F4*/: key = 4 /* GLUT_KEY_F4 */; break;
            case 0x74 /*DOM_VK_F5*/: key = 5 /* GLUT_KEY_F5 */; break;
            case 0x75 /*DOM_VK_F6*/: key = 6 /* GLUT_KEY_F6 */; break;
            case 0x76 /*DOM_VK_F7*/: key = 7 /* GLUT_KEY_F7 */; break;
            case 0x77 /*DOM_VK_F8*/: key = 8 /* GLUT_KEY_F8 */; break;
            case 0x78 /*DOM_VK_F9*/: key = 9 /* GLUT_KEY_F9 */; break;
            case 0x79 /*DOM_VK_F10*/: key = 10 /* GLUT_KEY_F10 */; break;
            case 0x7a /*DOM_VK_F11*/: key = 11 /* GLUT_KEY_F11 */; break;
            case 0x7b /*DOM_VK_F12*/: key = 12 /* GLUT_KEY_F12 */; break;
            case 0x25 /*DOM_VK_LEFT*/: key = 100 /* GLUT_KEY_LEFT */; break;
            case 0x26 /*DOM_VK_UP*/: key = 101 /* GLUT_KEY_UP */; break;
            case 0x27 /*DOM_VK_RIGHT*/: key = 102 /* GLUT_KEY_RIGHT */; break;
            case 0x28 /*DOM_VK_DOWN*/: key = 103 /* GLUT_KEY_DOWN */; break;
            case 0x21 /*DOM_VK_PAGE_UP*/: key = 104 /* GLUT_KEY_PAGE_UP */; break;
            case 0x22 /*DOM_VK_PAGE_DOWN*/: key = 105 /* GLUT_KEY_PAGE_DOWN */; break;
            case 0x24 /*DOM_VK_HOME*/: key = 106 /* GLUT_KEY_HOME */; break;
            case 0x23 /*DOM_VK_END*/: key = 107 /* GLUT_KEY_END */; break;
            case 0x2d /*DOM_VK_INSERT*/: key = 108 /* GLUT_KEY_INSERT */; break;
  
            case 16   /*DOM_VK_SHIFT*/:
            case 0x05 /*DOM_VK_LEFT_SHIFT*/:
              key = 112 /* GLUT_KEY_SHIFT_L */;
              break;
            case 0x06 /*DOM_VK_RIGHT_SHIFT*/:
              key = 113 /* GLUT_KEY_SHIFT_R */;
              break;
  
            case 17   /*DOM_VK_CONTROL*/:
            case 0x03 /*DOM_VK_LEFT_CONTROL*/:
              key = 114 /* GLUT_KEY_CONTROL_L */;
              break;
            case 0x04 /*DOM_VK_RIGHT_CONTROL*/:
              key = 115 /* GLUT_KEY_CONTROL_R */;
              break;
  
            case 18   /*DOM_VK_ALT*/:
            case 0x02 /*DOM_VK_LEFT_ALT*/:
              key = 116 /* GLUT_KEY_ALT_L */;
              break;
            case 0x01 /*DOM_VK_RIGHT_ALT*/:
              key = 117 /* GLUT_KEY_ALT_R */;
              break;
          };
          return key;
      },
  getASCIIKey:(event) => {
        if (event['ctrlKey'] || event['altKey'] || event['metaKey']) return null;
  
        var keycode = event['keyCode'];
  
        /* The exact list is soooo hard to find in a canonical place! */
  
        if (48 <= keycode && keycode <= 57)
          return keycode; // numeric  TODO handle shift?
        if (65 <= keycode && keycode <= 90)
          return event['shiftKey'] ? keycode : keycode + 32;
        if (96 <= keycode && keycode <= 105)
          return keycode - 48; // numpad numbers
        if (106 <= keycode && keycode <= 111)
          return keycode - 106 + 42; // *,+-./  TODO handle shift?
  
        switch (keycode) {
          case 9:  // tab key
          case 13: // return key
          case 27: // escape
          case 32: // space
          case 61: // equal
            return keycode;
        }
  
        var s = event['shiftKey'];
        switch (keycode) {
          case 186: return s ? 58 : 59; // colon / semi-colon
          case 187: return s ? 43 : 61; // add / equal (these two may be wrong)
          case 188: return s ? 60 : 44; // less-than / comma
          case 189: return s ? 95 : 45; // dash
          case 190: return s ? 62 : 46; // greater-than / period
          case 191: return s ? 63 : 47; // forward slash
          case 219: return s ? 123 : 91; // open bracket
          case 220: return s ? 124 : 47; // back slash
          case 221: return s ? 125 : 93; // close bracket
          case 222: return s ? 34 : 39; // single quote
        }
  
        return null;
      },
  onKeydown:(event) => {
        if (GLUT.specialFunc || GLUT.keyboardFunc) {
          var key = GLUT.getSpecialKey(event['keyCode']);
          if (key !== null) {
            if (GLUT.specialFunc) {
              event.preventDefault();
              GLUT.saveModifiers(event);
              ((a1, a2, a3) => { throw 'Internal Error! Attempted to invoke wasm function pointer with signature "viii", but no such functions have gotten exported!' })(key, Browser.mouseX, Browser.mouseY);
            }
          } else {
            key = GLUT.getASCIIKey(event);
            if (key !== null && GLUT.keyboardFunc) {
              event.preventDefault();
              GLUT.saveModifiers(event);
              ((a1, a2, a3) => { throw 'Internal Error! Attempted to invoke wasm function pointer with signature "viii", but no such functions have gotten exported!' })(key, Browser.mouseX, Browser.mouseY);
            }
          }
        }
      },
  onKeyup:(event) => {
        if (GLUT.specialUpFunc || GLUT.keyboardUpFunc) {
          var key = GLUT.getSpecialKey(event['keyCode']);
          if (key !== null) {
            if (GLUT.specialUpFunc) {
              event.preventDefault ();
              GLUT.saveModifiers(event);
              ((a1, a2, a3) => { throw 'Internal Error! Attempted to invoke wasm function pointer with signature "viii", but no such functions have gotten exported!' })(key, Browser.mouseX, Browser.mouseY);
            }
          } else {
            key = GLUT.getASCIIKey(event);
            if (key !== null && GLUT.keyboardUpFunc) {
              event.preventDefault ();
              GLUT.saveModifiers(event);
              ((a1, a2, a3) => { throw 'Internal Error! Attempted to invoke wasm function pointer with signature "viii", but no such functions have gotten exported!' })(key, Browser.mouseX, Browser.mouseY);
            }
          }
        }
      },
  touchHandler:(event) => {
        if (event.target != Module['canvas']) {
          return;
        }
  
        var touches = event.changedTouches,
            main = touches[0],
            type = "";
  
        switch (event.type) {
          case "touchstart": type = "mousedown"; break;
          case "touchmove": type = "mousemove"; break;
          case "touchend": type = "mouseup"; break;
          default: return;
        }
  
        var simulatedEvent = document.createEvent("MouseEvent");
        simulatedEvent.initMouseEvent(type, true, true, window, 1,
                                      main.screenX, main.screenY,
                                      main.clientX, main.clientY, false,
                                      false, false, false, 0/*main*/, null);
  
        main.target.dispatchEvent(simulatedEvent);
        event.preventDefault();
      },
  onMouseButtonDown:(event) => {
        Browser.calculateMouseEvent(event);
  
        GLUT.buttons |= (1 << event['button']);
  
        if (event.target == Module["canvas"] && GLUT.mouseFunc) {
          try {
            event.target.setCapture();
          } catch (e) {}
          event.preventDefault();
          GLUT.saveModifiers(event);
          ((a1, a2, a3, a4) => dynCall_viiii(GLUT.mouseFunc, a1, a2, a3, a4))(event['button'], 0/*GLUT_DOWN*/, Browser.mouseX, Browser.mouseY);
        }
      },
  onMouseButtonUp:(event) => {
        Browser.calculateMouseEvent(event);
  
        GLUT.buttons &= ~(1 << event['button']);
  
        if (GLUT.mouseFunc) {
          event.preventDefault();
          GLUT.saveModifiers(event);
          ((a1, a2, a3, a4) => dynCall_viiii(GLUT.mouseFunc, a1, a2, a3, a4))(event['button'], 1/*GLUT_UP*/, Browser.mouseX, Browser.mouseY);
        }
      },
  onMouseWheel:(event) => {
        Browser.calculateMouseEvent(event);
  
        // cross-browser wheel delta
        var e = window.event || event; // old IE support
        // Note the minus sign that flips browser wheel direction (positive direction scrolls page down) to native wheel direction (positive direction is mouse wheel up)
        var delta = -Browser.getMouseWheelDelta(event);
        delta = (delta == 0) ? 0 : (delta > 0 ? Math.max(delta, 1) : Math.min(delta, -1)); // Quantize to integer so that minimum scroll is at least +/- 1.
  
        var button = 3; // wheel up
        if (delta < 0) {
          button = 4; // wheel down
        }
  
        if (GLUT.mouseFunc) {
          event.preventDefault();
          GLUT.saveModifiers(event);
          ((a1, a2, a3, a4) => dynCall_viiii(GLUT.mouseFunc, a1, a2, a3, a4))(button, 0/*GLUT_DOWN*/, Browser.mouseX, Browser.mouseY);
        }
      },
  onFullscreenEventChange:(event) => {
        var width;
        var height;
        if (document["fullscreen"] || document["fullScreen"] || document["mozFullScreen"] || document["webkitIsFullScreen"]) {
          width = screen["width"];
          height = screen["height"];
        } else {
          width = GLUT.windowWidth;
          height = GLUT.windowHeight;
          // TODO set position
          document.removeEventListener('fullscreenchange', GLUT.onFullscreenEventChange, true);
          document.removeEventListener('mozfullscreenchange', GLUT.onFullscreenEventChange, true);
          document.removeEventListener('webkitfullscreenchange', GLUT.onFullscreenEventChange, true);
        }
        Browser.setCanvasSize(width, height, true); // N.B. GLUT.reshapeFunc is also registered as a canvas resize callback.
                                                    // Just call it once here.
        /* Can't call _glutReshapeWindow as that requests cancelling fullscreen. */
        if (GLUT.reshapeFunc) {
          // out("GLUT.reshapeFunc (from FS): " + width + ", " + height);
          ((a1, a2) => dynCall_vii(GLUT.reshapeFunc, a1, a2))(width, height);
        }
        _glutPostRedisplay();
      },
  };

  var _glutGetModifiers = () => GLUT.modifiers;

  
  var _glutInit = (argcp, argv) => {
      // Ignore arguments
      GLUT.initTime = Date.now();
  
      var isTouchDevice = 'ontouchstart' in document.documentElement;
      if (isTouchDevice) {
        // onMouseButtonDown, onMouseButtonUp and onMousemove handlers
        // depend on Browser.mouseX / Browser.mouseY fields. Those fields
        // don't get updated by touch events. So register a touchHandler
        // function that translates the touch events to mouse events.
  
        // GLUT doesn't support touch, mouse only, so from touch events we
        // are only looking at single finger touches to emulate left click,
        // so we can use workaround and convert all touch events in mouse
        // events. See touchHandler.
        window.addEventListener("touchmove", GLUT.touchHandler, true);
        window.addEventListener("touchstart", GLUT.touchHandler, true);
        window.addEventListener("touchend", GLUT.touchHandler, true);
      }
  
      window.addEventListener("keydown", GLUT.onKeydown, true);
      window.addEventListener("keyup", GLUT.onKeyup, true);
      window.addEventListener("mousemove", GLUT.onMousemove, true);
      window.addEventListener("mousedown", GLUT.onMouseButtonDown, true);
      window.addEventListener("mouseup", GLUT.onMouseButtonUp, true);
      // IE9, Chrome, Safari, Opera
      window.addEventListener("mousewheel", GLUT.onMouseWheel, true);
      // Firefox
      window.addEventListener("DOMMouseScroll", GLUT.onMouseWheel, true);
  
      Browser.resizeListeners.push(function(width, height) {
        if (GLUT.reshapeFunc) {
          ((a1, a2) => dynCall_vii(GLUT.reshapeFunc, a1, a2))(width, height);
        }
      });
  
      __ATEXIT__.push(function() {
        if (isTouchDevice) {
          window.removeEventListener("touchmove", GLUT.touchHandler, true);
          window.removeEventListener("touchstart", GLUT.touchHandler, true);
          window.removeEventListener("touchend", GLUT.touchHandler, true);
        }
  
        window.removeEventListener("keydown", GLUT.onKeydown, true);
        window.removeEventListener("keyup", GLUT.onKeyup, true);
        window.removeEventListener("mousemove", GLUT.onMousemove, true);
        window.removeEventListener("mousedown", GLUT.onMouseButtonDown, true);
        window.removeEventListener("mouseup", GLUT.onMouseButtonUp, true);
        // IE9, Chrome, Safari, Opera
        window.removeEventListener("mousewheel", GLUT.onMouseWheel, true);
        // Firefox
        window.removeEventListener("DOMMouseScroll", GLUT.onMouseWheel, true);
  
        Module["canvas"].width = Module["canvas"].height = 1;
      });
    };

  var _glutInitWindowSize = (width, height) => {
      Browser.setCanvasSize( GLUT.initWindowWidth = width,
                             GLUT.initWindowHeight = height );
    };

  var _glutInitWindowPosition = (x, y) => {};

  var _glutGet = (type) => {
      switch (type) {
        case 100: /* GLUT_WINDOW_X */
          return 0; /* TODO */
        case 101: /* GLUT_WINDOW_Y */
          return 0; /* TODO */
        case 102: /* GLUT_WINDOW_WIDTH */
          return Module['canvas'].width;
        case 103: /* GLUT_WINDOW_HEIGHT */
          return Module['canvas'].height;
        case 200: /* GLUT_SCREEN_WIDTH */
          return Module['canvas'].width;
        case 201: /* GLUT_SCREEN_HEIGHT */
          return Module['canvas'].height;
        case 500: /* GLUT_INIT_WINDOW_X */
          return 0; /* TODO */
        case 501: /* GLUT_INIT_WINDOW_Y */
          return 0; /* TODO */
        case 502: /* GLUT_INIT_WINDOW_WIDTH */
          return GLUT.initWindowWidth;
        case 503: /* GLUT_INIT_WINDOW_HEIGHT */
          return GLUT.initWindowHeight;
        case 700: /* GLUT_ELAPSED_TIME */
          var now = Date.now();
          return now - GLUT.initTime;
        case 0x0069: /* GLUT_WINDOW_STENCIL_SIZE */
          return Module.ctx.getContextAttributes().stencil ? 8 : 0;
        case 0x006A: /* GLUT_WINDOW_DEPTH_SIZE */
          return Module.ctx.getContextAttributes().depth ? 8 : 0;
        case 0x006E: /* GLUT_WINDOW_ALPHA_SIZE */
          return Module.ctx.getContextAttributes().alpha ? 8 : 0;
        case 0x0078: /* GLUT_WINDOW_NUM_SAMPLES */
          return Module.ctx.getContextAttributes().antialias ? 1 : 0;
  
        default:
          throw "glutGet(" + type + ") not implemented yet";
      }
    };

  
  var _glutIdleFunc = (func) => {
      function callback() {
        if (GLUT.idleFunc) {
          (() => dynCall_v(GLUT.idleFunc))();
          safeSetTimeout(callback, 4); // HTML spec specifies a 4ms minimum delay on the main thread; workers might get more, but we standardize here
        }
      }
      if (!GLUT.idleFunc) {
        safeSetTimeout(callback, 0);
      }
      GLUT.idleFunc = func;
    };

  
  var _glutTimerFunc = (msec, func, value) =>
      safeSetTimeout(() => ((a1) => dynCall_vi(func, a1))(value), msec);

  var _glutDisplayFunc = (func) => {
      GLUT.displayFunc = func;
    };

  var _glutKeyboardFunc = (func) => {
      GLUT.keyboardFunc = func;
    };

  var _glutKeyboardUpFunc = (func) => {
      GLUT.keyboardUpFunc = func;
    };

  var _glutSpecialFunc = (func) => {
      GLUT.specialFunc = func;
    };

  var _glutSpecialUpFunc = (func) => {
      GLUT.specialUpFunc = func;
    };

  var _glutReshapeFunc = (func) => {
      GLUT.reshapeFunc = func;
    };

  var _glutMotionFunc = (func) => {
      GLUT.motionFunc = func;
    };

  var _glutPassiveMotionFunc = (func) => {
      GLUT.passiveMotionFunc = func;
    };

  var _glutMouseFunc = (func) => {
      GLUT.mouseFunc = func;
    };

  var _glutSetCursor = (cursor) => {
      var cursorStyle = 'auto';
      switch (cursor) {
        case 0x0000: /* GLUT_CURSOR_RIGHT_ARROW */
          // No equivalent css cursor style, fallback to 'auto'
          break;
        case 0x0001: /* GLUT_CURSOR_LEFT_ARROW */
          // No equivalent css cursor style, fallback to 'auto'
          break;
        case 0x0002: /* GLUT_CURSOR_INFO */
          cursorStyle = 'pointer';
          break;
        case 0x0003: /* GLUT_CURSOR_DESTROY */
          // No equivalent css cursor style, fallback to 'auto'
          break;
        case 0x0004: /* GLUT_CURSOR_HELP */
          cursorStyle = 'help';
          break;
        case 0x0005: /* GLUT_CURSOR_CYCLE */
          // No equivalent css cursor style, fallback to 'auto'
          break;
        case 0x0006: /* GLUT_CURSOR_SPRAY */
          // No equivalent css cursor style, fallback to 'auto'
          break;
        case 0x0007: /* GLUT_CURSOR_WAIT */
          cursorStyle = 'wait';
          break;
        case 0x0008: /* GLUT_CURSOR_TEXT */
          cursorStyle = 'text';
          break;
        case 0x0009: /* GLUT_CURSOR_CROSSHAIR */
        case 0x0066: /* GLUT_CURSOR_FULL_CROSSHAIR */
          cursorStyle = 'crosshair';
          break;
        case 0x000A: /* GLUT_CURSOR_UP_DOWN */
          cursorStyle = 'ns-resize';
          break;
        case 0x000B: /* GLUT_CURSOR_LEFT_RIGHT */
          cursorStyle = 'ew-resize';
          break;
        case 0x000C: /* GLUT_CURSOR_TOP_SIDE */
          cursorStyle = 'n-resize';
          break;
        case 0x000D: /* GLUT_CURSOR_BOTTOM_SIDE */
          cursorStyle = 's-resize';
          break;
        case 0x000E: /* GLUT_CURSOR_LEFT_SIDE */
          cursorStyle = 'w-resize';
          break;
        case 0x000F: /* GLUT_CURSOR_RIGHT_SIDE */
          cursorStyle = 'e-resize';
          break;
        case 0x0010: /* GLUT_CURSOR_TOP_LEFT_CORNER */
          cursorStyle = 'nw-resize';
          break;
        case 0x0011: /* GLUT_CURSOR_TOP_RIGHT_CORNER */
          cursorStyle = 'ne-resize';
          break;
        case 0x0012: /* GLUT_CURSOR_BOTTOM_RIGHT_CORNER */
          cursorStyle = 'se-resize';
          break;
        case 0x0013: /* GLUT_CURSOR_BOTTOM_LEFT_CORNER */
          cursorStyle = 'sw-resize';
          break;
        case 0x0064: /* GLUT_CURSOR_INHERIT */
          break;
        case 0x0065: /* GLUT_CURSOR_NONE */
          cursorStyle = 'none';
          break;
        default:
          throw "glutSetCursor: Unknown cursor type: " + cursor;
      }
      Module['canvas'].style.cursor = cursorStyle;
    };

  
  var _glutCreateWindow = (name) => {
      var contextAttributes = {
        antialias: ((GLUT.initDisplayMode & 0x0080 /*GLUT_MULTISAMPLE*/) != 0),
        depth: ((GLUT.initDisplayMode & 0x0010 /*GLUT_DEPTH*/) != 0),
        stencil: ((GLUT.initDisplayMode & 0x0020 /*GLUT_STENCIL*/) != 0),
        alpha: ((GLUT.initDisplayMode & 0x0008 /*GLUT_ALPHA*/) != 0)
      };
      Module.ctx = Browser.createContext(Module['canvas'], true, true, contextAttributes);
      return Module.ctx ? 1 /* a new GLUT window ID for the created context */ : 0 /* failure */;
    };

  
  var _glutDestroyWindow = (name) => {
      Module.ctx = Browser.destroyContext(Module['canvas'], true, true);
      return 1;
    };

  
  
  var _glutReshapeWindow = (width, height) => {
      Browser.exitFullscreen();
      Browser.setCanvasSize(width, height, true); // N.B. GLUT.reshapeFunc is also registered as a canvas resize callback.
                                                  // Just call it once here.
      if (GLUT.reshapeFunc) {
        ((a1, a2) => dynCall_vii(GLUT.reshapeFunc, a1, a2))(width, height);
      }
      _glutPostRedisplay();
    };

  
  
  var _glutPositionWindow = (x, y) => {
      Browser.exitFullscreen();
      /* TODO */
      _glutPostRedisplay();
    };

  
  
  var _glutFullScreen = () => {
      GLUT.windowX = 0; // TODO
      GLUT.windowY = 0; // TODO
      GLUT.windowWidth  = Module['canvas'].width;
      GLUT.windowHeight = Module['canvas'].height;
      document.addEventListener('fullscreenchange', GLUT.onFullscreenEventChange, true);
      document.addEventListener('mozfullscreenchange', GLUT.onFullscreenEventChange, true);
      document.addEventListener('webkitfullscreenchange', GLUT.onFullscreenEventChange, true);
      Browser.requestFullscreen(/*lockPointer=*/false, /*resizeCanvas=*/false);
    };

  var _glutInitDisplayMode = (mode) => GLUT.initDisplayMode = mode;

  var _glutSwapBuffers = () => {};


  
  
  
  var _glutMainLoop = () => {
      _glutReshapeWindow(Module['canvas'].width, Module['canvas'].height);
      _glutPostRedisplay();
      throw 'unwind';
    };

  var _XOpenDisplay = (name) => 1;

  var _XCreateWindow = (display, parent, x, y, width, height, border_width, depth, class_, visual, valuemask, attributes) => {
      // All we can do is set the width and height
      Browser.setCanvasSize(width, height);
      return 2;
    };

  var _XChangeWindowAttributes = (display, window, valuemask, attributes) => {};

  var _XSetWMHints = (display, win, hints) => {};

  var _XMapWindow = (display, win) => {};

  var _XStoreName = (display, win, name) => {};

  var _XInternAtom = (display, name_, hmm)  => 0;

  var _XSendEvent = (display, win, propagate, event_mask, even_send) => {};

  var _XPending = (display) => 0;

  
  var EGL = {
  errorCode:12288,
  defaultDisplayInitialized:false,
  currentContext:0,
  currentReadSurface:0,
  currentDrawSurface:0,
  contextAttributes:{
  alpha:false,
  depth:false,
  stencil:false,
  antialias:false,
  },
  stringCache:{
  },
  setErrorCode(code) {
        EGL.errorCode = code;
      },
  chooseConfig(display, attribList, config, config_size, numConfigs) {
        if (display != 62000) {
          EGL.setErrorCode(0x3008 /* EGL_BAD_DISPLAY */);
          return 0;
        }
  
        if (attribList) {
          // read attribList if it is non-null
          for (;;) {
            var param = HEAP32[((attribList)>>2)];
            if (param == 0x3021 /*EGL_ALPHA_SIZE*/) {
              var alphaSize = HEAP32[(((attribList)+(4))>>2)];
              EGL.contextAttributes.alpha = (alphaSize > 0);
            } else if (param == 0x3025 /*EGL_DEPTH_SIZE*/) {
              var depthSize = HEAP32[(((attribList)+(4))>>2)];
              EGL.contextAttributes.depth = (depthSize > 0);
            } else if (param == 0x3026 /*EGL_STENCIL_SIZE*/) {
              var stencilSize = HEAP32[(((attribList)+(4))>>2)];
              EGL.contextAttributes.stencil = (stencilSize > 0);
            } else if (param == 0x3031 /*EGL_SAMPLES*/) {
              var samples = HEAP32[(((attribList)+(4))>>2)];
              EGL.contextAttributes.antialias = (samples > 0);
            } else if (param == 0x3032 /*EGL_SAMPLE_BUFFERS*/) {
              var samples = HEAP32[(((attribList)+(4))>>2)];
              EGL.contextAttributes.antialias = (samples == 1);
            } else if (param == 0x3100 /*EGL_CONTEXT_PRIORITY_LEVEL_IMG*/) {
              var requestedPriority = HEAP32[(((attribList)+(4))>>2)];
              EGL.contextAttributes.lowLatency = (requestedPriority != 0x3103 /*EGL_CONTEXT_PRIORITY_LOW_IMG*/);
            } else if (param == 0x3038 /*EGL_NONE*/) {
                break;
            }
            attribList += 8;
          }
        }
  
        if ((!config || !config_size) && !numConfigs) {
          EGL.setErrorCode(0x300C /* EGL_BAD_PARAMETER */);
          return 0;
        }
        if (numConfigs) {
          HEAP32[((numConfigs)>>2)] = 1; // Total number of supported configs: 1.
        }
        if (config && config_size > 0) {
          HEAPU32[((config)>>2)] = 62002;
        }
  
        EGL.setErrorCode(0x3000 /* EGL_SUCCESS */);
        return 1;
      },
  };

  var _eglGetDisplay = (nativeDisplayType) => {
      EGL.setErrorCode(0x3000 /* EGL_SUCCESS */);
      // Emscripten EGL implementation "emulates" X11, and eglGetDisplay is
      // expected to accept/receive a pointer to an X11 Display object (or
      // EGL_DEFAULT_DISPLAY).
      if (nativeDisplayType != 0 /* EGL_DEFAULT_DISPLAY */ && nativeDisplayType != 1 /* see library_xlib.js */) {
        return 0; // EGL_NO_DISPLAY
      }
      return 62000;
    };

  var _eglInitialize = (display, majorVersion, minorVersion) => {
      if (display != 62000) {
        EGL.setErrorCode(0x3008 /* EGL_BAD_DISPLAY */);
        return 0;
      }
      if (majorVersion) {
        HEAP32[((majorVersion)>>2)] = 1; // Advertise EGL Major version: '1'
      }
      if (minorVersion) {
        HEAP32[((minorVersion)>>2)] = 4; // Advertise EGL Minor version: '4'
      }
      EGL.defaultDisplayInitialized = true;
      EGL.setErrorCode(0x3000 /* EGL_SUCCESS */);
      return 1;
    };

  var _eglTerminate = (display) => {
      if (display != 62000) {
        EGL.setErrorCode(0x3008 /* EGL_BAD_DISPLAY */);
        return 0;
      }
      EGL.currentContext = 0;
      EGL.currentReadSurface = 0;
      EGL.currentDrawSurface = 0;
      EGL.defaultDisplayInitialized = false;
      EGL.setErrorCode(0x3000 /* EGL_SUCCESS */);
      return 1;
    };

  var _eglGetConfigs = (display, configs, config_size, numConfigs) => {
      return EGL.chooseConfig(display, 0, configs, config_size, numConfigs);
    };

  var _eglChooseConfig = (display, attrib_list, configs, config_size, numConfigs) => {
      return EGL.chooseConfig(display, attrib_list, configs, config_size, numConfigs);
    };

  var _eglGetConfigAttrib = (display, config, attribute, value) => {
      if (display != 62000) {
        EGL.setErrorCode(0x3008 /* EGL_BAD_DISPLAY */);
        return 0;
      }
      if (config != 62002) {
        EGL.setErrorCode(0x3005 /* EGL_BAD_CONFIG */);
        return 0;
      }
      if (!value) {
        EGL.setErrorCode(0x300C /* EGL_BAD_PARAMETER */);
        return 0;
      }
      EGL.setErrorCode(0x3000 /* EGL_SUCCESS */);
      switch (attribute) {
      case 0x3020: // EGL_BUFFER_SIZE
        HEAP32[((value)>>2)] = EGL.contextAttributes.alpha ? 32 : 24;
        return 1;
      case 0x3021: // EGL_ALPHA_SIZE
        HEAP32[((value)>>2)] = EGL.contextAttributes.alpha ? 8 : 0;
        return 1;
      case 0x3022: // EGL_BLUE_SIZE
        HEAP32[((value)>>2)] = 8;
        return 1;
      case 0x3023: // EGL_GREEN_SIZE
        HEAP32[((value)>>2)] = 8;
        return 1;
      case 0x3024: // EGL_RED_SIZE
        HEAP32[((value)>>2)] = 8;
        return 1;
      case 0x3025: // EGL_DEPTH_SIZE
        HEAP32[((value)>>2)] = EGL.contextAttributes.depth ? 24 : 0;
        return 1;
      case 0x3026: // EGL_STENCIL_SIZE
        HEAP32[((value)>>2)] = EGL.contextAttributes.stencil ? 8 : 0;
        return 1;
      case 0x3027: // EGL_CONFIG_CAVEAT
        // We can return here one of EGL_NONE (0x3038), EGL_SLOW_CONFIG (0x3050) or EGL_NON_CONFORMANT_CONFIG (0x3051).
        HEAP32[((value)>>2)] = 0x3038;
        return 1;
      case 0x3028: // EGL_CONFIG_ID
        HEAP32[((value)>>2)] = 62002;
        return 1;
      case 0x3029: // EGL_LEVEL
        HEAP32[((value)>>2)] = 0;
        return 1;
      case 0x302A: // EGL_MAX_PBUFFER_HEIGHT
        HEAP32[((value)>>2)] = 4096;
        return 1;
      case 0x302B: // EGL_MAX_PBUFFER_PIXELS
        HEAP32[((value)>>2)] = 16777216;
        return 1;
      case 0x302C: // EGL_MAX_PBUFFER_WIDTH
        HEAP32[((value)>>2)] = 4096;
        return 1;
      case 0x302D: // EGL_NATIVE_RENDERABLE
        HEAP32[((value)>>2)] = 0;
        return 1;
      case 0x302E: // EGL_NATIVE_VISUAL_ID
        HEAP32[((value)>>2)] = 0;
        return 1;
      case 0x302F: // EGL_NATIVE_VISUAL_TYPE
        HEAP32[((value)>>2)] = 0x3038;
        return 1;
      case 0x3031: // EGL_SAMPLES
        HEAP32[((value)>>2)] = EGL.contextAttributes.antialias ? 4 : 0;
        return 1;
      case 0x3032: // EGL_SAMPLE_BUFFERS
        HEAP32[((value)>>2)] = EGL.contextAttributes.antialias ? 1 : 0;
        return 1;
      case 0x3033: // EGL_SURFACE_TYPE
        HEAP32[((value)>>2)] = 0x4;
        return 1;
      case 0x3034: // EGL_TRANSPARENT_TYPE
        // If this returns EGL_TRANSPARENT_RGB (0x3052), transparency is used through color-keying. No such thing applies to Emscripten canvas.
        HEAP32[((value)>>2)] = 0x3038;
        return 1;
      case 0x3035: // EGL_TRANSPARENT_BLUE_VALUE
      case 0x3036: // EGL_TRANSPARENT_GREEN_VALUE
      case 0x3037: // EGL_TRANSPARENT_RED_VALUE
        // "If EGL_TRANSPARENT_TYPE is EGL_NONE, then the values for EGL_TRANSPARENT_RED_VALUE, EGL_TRANSPARENT_GREEN_VALUE, and EGL_TRANSPARENT_BLUE_VALUE are undefined."
        HEAP32[((value)>>2)] = -1;
        return 1;
      case 0x3039: // EGL_BIND_TO_TEXTURE_RGB
      case 0x303A: // EGL_BIND_TO_TEXTURE_RGBA
        HEAP32[((value)>>2)] = 0;
        return 1;
      case 0x303B: // EGL_MIN_SWAP_INTERVAL
        HEAP32[((value)>>2)] = 0;
        return 1;
      case 0x303C: // EGL_MAX_SWAP_INTERVAL
        HEAP32[((value)>>2)] = 1;
        return 1;
      case 0x303D: // EGL_LUMINANCE_SIZE
      case 0x303E: // EGL_ALPHA_MASK_SIZE
        HEAP32[((value)>>2)] = 0;
        return 1;
      case 0x303F: // EGL_COLOR_BUFFER_TYPE
        // EGL has two types of buffers: EGL_RGB_BUFFER and EGL_LUMINANCE_BUFFER.
        HEAP32[((value)>>2)] = 0x308E;
        return 1;
      case 0x3040: // EGL_RENDERABLE_TYPE
        // A bit combination of EGL_OPENGL_ES_BIT,EGL_OPENVG_BIT,EGL_OPENGL_ES2_BIT and EGL_OPENGL_BIT.
        HEAP32[((value)>>2)] = 0x4;
        return 1;
      case 0x3042: // EGL_CONFORMANT
        // "EGL_CONFORMANT is a mask indicating if a client API context created with respect to the corresponding EGLConfig will pass the required conformance tests for that API."
        HEAP32[((value)>>2)] = 0;
        return 1;
      default:
        EGL.setErrorCode(0x3004 /* EGL_BAD_ATTRIBUTE */);
        return 0;
      }
    };

  var _eglCreateWindowSurface = (display, config, win, attrib_list) => {
      if (display != 62000) {
        EGL.setErrorCode(0x3008 /* EGL_BAD_DISPLAY */);
        return 0;
      }
      if (config != 62002) {
        EGL.setErrorCode(0x3005 /* EGL_BAD_CONFIG */);
        return 0;
      }
      // TODO: Examine attrib_list! Parameters that can be present there are:
      // - EGL_RENDER_BUFFER (must be EGL_BACK_BUFFER)
      // - EGL_VG_COLORSPACE (can't be set)
      // - EGL_VG_ALPHA_FORMAT (can't be set)
      EGL.setErrorCode(0x3000 /* EGL_SUCCESS */);
      return 62006; /* Magic ID for Emscripten 'default surface' */
    };

  var _eglDestroySurface = (display, surface) => {
      if (display != 62000) {
        EGL.setErrorCode(0x3008 /* EGL_BAD_DISPLAY */);
        return 0;
      }
      if (surface != 62006 /* Magic ID for the only EGLSurface supported by Emscripten */) {
        EGL.setErrorCode(0x300D /* EGL_BAD_SURFACE */);
        return 1;
      }
      if (EGL.currentReadSurface == surface) {
        EGL.currentReadSurface = 0;
      }
      if (EGL.currentDrawSurface == surface) {
        EGL.currentDrawSurface = 0;
      }
      EGL.setErrorCode(0x3000 /* EGL_SUCCESS */);
      return 1; /* Magic ID for Emscripten 'default surface' */
    };

  
  var _eglCreateContext = (display, config, hmm, contextAttribs) => {
      if (display != 62000) {
        EGL.setErrorCode(0x3008 /* EGL_BAD_DISPLAY */);
        return 0;
      }
  
      // EGL 1.4 spec says default EGL_CONTEXT_CLIENT_VERSION is GLES1, but this is not supported by Emscripten.
      // So user must pass EGL_CONTEXT_CLIENT_VERSION == 2 to initialize EGL.
      var glesContextVersion = 1;
      for (;;) {
        var param = HEAP32[((contextAttribs)>>2)];
        if (param == 0x3098 /*EGL_CONTEXT_CLIENT_VERSION*/) {
          glesContextVersion = HEAP32[(((contextAttribs)+(4))>>2)];
        } else if (param == 0x3038 /*EGL_NONE*/) {
          break;
        } else {
          /* EGL1.4 specifies only EGL_CONTEXT_CLIENT_VERSION as supported attribute */
          EGL.setErrorCode(0x3004 /*EGL_BAD_ATTRIBUTE*/);
          return 0;
        }
        contextAttribs += 8;
      }
      if (glesContextVersion != 2) {
        EGL.setErrorCode(0x3005 /* EGL_BAD_CONFIG */);
        return 0; /* EGL_NO_CONTEXT */
      }
  
      EGL.contextAttributes.majorVersion = glesContextVersion - 1; // WebGL 1 is GLES 2, WebGL2 is GLES3
      EGL.contextAttributes.minorVersion = 0;
  
      EGL.context = GL.createContext(Module['canvas'], EGL.contextAttributes);
  
      if (EGL.context != 0) {
        EGL.setErrorCode(0x3000 /* EGL_SUCCESS */);
  
        // Run callbacks so that GL emulation works
        GL.makeContextCurrent(EGL.context);
        Module.useWebGL = true;
        Browser.moduleContextCreatedCallbacks.forEach(function(callback) { callback() });
  
        // Note: This function only creates a context, but it shall not make it active.
        GL.makeContextCurrent(null);
        return 62004;
      } else {
        EGL.setErrorCode(0x3009 /* EGL_BAD_MATCH */); // By the EGL 1.4 spec, an implementation that does not support GLES2 (WebGL in this case), this error code is set.
        return 0; /* EGL_NO_CONTEXT */
      }
    };

  
  var _eglDestroyContext = (display, context) => {
      if (display != 62000) {
        EGL.setErrorCode(0x3008 /* EGL_BAD_DISPLAY */);
        return 0;
      }
      if (context != 62004) {
        EGL.setErrorCode(0x3006 /* EGL_BAD_CONTEXT */);
        return 0;
      }
  
      GL.deleteContext(EGL.context);
      EGL.setErrorCode(0x3000 /* EGL_SUCCESS */);
      if (EGL.currentContext == context) {
        EGL.currentContext = 0;
      }
      return 1 /* EGL_TRUE */;
    };

  var _eglQuerySurface = (display, surface, attribute, value) => {
      if (display != 62000) {
        EGL.setErrorCode(0x3008 /* EGL_BAD_DISPLAY */);
        return 0;
      }
      if (surface != 62006 /* Magic ID for Emscripten 'default surface' */) {
        EGL.setErrorCode(0x300D /* EGL_BAD_SURFACE */);
        return 0;
      }
      if (!value) {
        EGL.setErrorCode(0x300C /* EGL_BAD_PARAMETER */);
        return 0;
      }
      EGL.setErrorCode(0x3000 /* EGL_SUCCESS */);
      switch (attribute) {
      case 0x3028: // EGL_CONFIG_ID
        HEAP32[((value)>>2)] = 62002;
          return 1;
      case 0x3058: // EGL_LARGEST_PBUFFER
        // Odd EGL API: If surface is not a pbuffer surface, 'value' should not be written to. It's not specified as an error, so true should(?) be returned.
        // Existing Android implementation seems to do so at least.
        return 1;
      case 0x3057: // EGL_WIDTH
        HEAP32[((value)>>2)] = Module["canvas"].width;
        return 1;
      case 0x3056: // EGL_HEIGHT
        HEAP32[((value)>>2)] = Module["canvas"].height;
        return 1;
      case 0x3090: // EGL_HORIZONTAL_RESOLUTION
        HEAP32[((value)>>2)] = -1;
        return 1;
      case 0x3091: // EGL_VERTICAL_RESOLUTION
        HEAP32[((value)>>2)] = -1;
        return 1;
      case 0x3092: // EGL_PIXEL_ASPECT_RATIO
        HEAP32[((value)>>2)] = -1;
        return 1;
      case 0x3086: // EGL_RENDER_BUFFER
        // The main surface is bound to the visible canvas window - it's always backbuffered.
        // Alternative to EGL_BACK_BUFFER would be EGL_SINGLE_BUFFER.
        HEAP32[((value)>>2)] = 0x3084;
        return 1;
      case 0x3099: // EGL_MULTISAMPLE_RESOLVE
        HEAP32[((value)>>2)] = 0x309A;
        return 1;
      case 0x3093: // EGL_SWAP_BEHAVIOR
        // The two possibilities are EGL_BUFFER_PRESERVED and EGL_BUFFER_DESTROYED. Slightly unsure which is the
        // case for browser environment, but advertise the 'weaker' behavior to be sure.
        HEAP32[((value)>>2)] = 0x3095;
        return 1;
      case 0x3080: // EGL_TEXTURE_FORMAT
      case 0x3081: // EGL_TEXTURE_TARGET
      case 0x3082: // EGL_MIPMAP_TEXTURE
      case 0x3083: // EGL_MIPMAP_LEVEL
        // This is a window surface, not a pbuffer surface. Spec:
        // "Querying EGL_TEXTURE_FORMAT, EGL_TEXTURE_TARGET, EGL_MIPMAP_TEXTURE, or EGL_MIPMAP_LEVEL for a non-pbuffer surface is not an error, but value is not modified."
        // So pass-through.
        return 1;
      default:
        EGL.setErrorCode(0x3004 /* EGL_BAD_ATTRIBUTE */);
        return 0;
      }
    };

  var _eglQueryContext = (display, context, attribute, value) => {
      if (display != 62000) {
        EGL.setErrorCode(0x3008 /* EGL_BAD_DISPLAY */);
        return 0;
      }
      //\todo An EGL_NOT_INITIALIZED error is generated if EGL is not initialized for dpy.
      if (context != 62004) {
        EGL.setErrorCode(0x3006 /* EGL_BAD_CONTEXT */);
        return 0;
      }
      if (!value) {
        EGL.setErrorCode(0x300C /* EGL_BAD_PARAMETER */);
        return 0;
      }
  
      EGL.setErrorCode(0x3000 /* EGL_SUCCESS */);
      switch (attribute) {
        case 0x3028: // EGL_CONFIG_ID
          HEAP32[((value)>>2)] = 62002;
          return 1;
        case 0x3097: // EGL_CONTEXT_CLIENT_TYPE
          HEAP32[((value)>>2)] = 0x30A0;
          return 1;
        case 0x3098: // EGL_CONTEXT_CLIENT_VERSION
          HEAP32[((value)>>2)] = EGL.contextAttributes.majorVersion + 1;
          return 1;
        case 0x3086: // EGL_RENDER_BUFFER
          // The context is bound to the visible canvas window - it's always backbuffered.
          // Alternative to EGL_BACK_BUFFER would be EGL_SINGLE_BUFFER.
          HEAP32[((value)>>2)] = 0x3084;
          return 1;
        default:
          EGL.setErrorCode(0x3004 /* EGL_BAD_ATTRIBUTE */);
          return 0;
      }
    };

  var _eglGetError = () => EGL.errorCode;

  
  var _eglQueryString = (display, name) => {
      if (display != 62000) {
        EGL.setErrorCode(0x3008 /* EGL_BAD_DISPLAY */);
        return 0;
      }
      //\todo An EGL_NOT_INITIALIZED error is generated if EGL is not initialized for dpy.
      EGL.setErrorCode(0x3000 /* EGL_SUCCESS */);
      if (EGL.stringCache[name]) return EGL.stringCache[name];
      var ret;
      switch (name) {
        case 0x3053 /* EGL_VENDOR */: ret = stringToNewUTF8("Emscripten"); break;
        case 0x3054 /* EGL_VERSION */: ret = stringToNewUTF8("1.4 Emscripten EGL"); break;
        case 0x3055 /* EGL_EXTENSIONS */:  ret = stringToNewUTF8(""); break; // Currently not supporting any EGL extensions.
        case 0x308D /* EGL_CLIENT_APIS */: ret = stringToNewUTF8("OpenGL_ES"); break;
        default:
          EGL.setErrorCode(0x300C /* EGL_BAD_PARAMETER */);
          return 0;
      }
      EGL.stringCache[name] = ret;
      return ret;
    };

  var _eglBindAPI = (api) => {
      if (api == 0x30A0 /* EGL_OPENGL_ES_API */) {
        EGL.setErrorCode(0x3000 /* EGL_SUCCESS */);
        return 1;
      }
      // if (api == 0x30A1 /* EGL_OPENVG_API */ || api == 0x30A2 /* EGL_OPENGL_API */) {
      EGL.setErrorCode(0x300C /* EGL_BAD_PARAMETER */);
      return 0;
    };

  var _eglQueryAPI = () => {
      EGL.setErrorCode(0x3000 /* EGL_SUCCESS */);
      return 0x30A0; // EGL_OPENGL_ES_API
    };

  var _eglWaitClient = () => {
      EGL.setErrorCode(0x3000 /* EGL_SUCCESS */);
      return 1;
    };

  var _eglWaitNative = (nativeEngineId) => {
      EGL.setErrorCode(0x3000 /* EGL_SUCCESS */);
      return 1;
    };

  
  var _eglWaitGL = _eglWaitClient;

  
  var _eglSwapInterval = (display, interval) => {
      if (display != 62000) {
        EGL.setErrorCode(0x3008 /* EGL_BAD_DISPLAY */);
        return 0;
      }
      if (interval == 0) _emscripten_set_main_loop_timing(0, 0);
      else _emscripten_set_main_loop_timing(1, interval);
  
      EGL.setErrorCode(0x3000 /* EGL_SUCCESS */);
      return 1;
    };

  
  var _eglMakeCurrent = (display, draw, read, context) => {
      if (display != 62000) {
        EGL.setErrorCode(0x3008 /* EGL_BAD_DISPLAY */);
        return 0 /* EGL_FALSE */;
      }
      //\todo An EGL_NOT_INITIALIZED error is generated if EGL is not initialized for dpy.
      if (context != 0 && context != 62004) {
        EGL.setErrorCode(0x3006 /* EGL_BAD_CONTEXT */);
        return 0;
      }
      if ((read != 0 && read != 62006) || (draw != 0 && draw != 62006 /* Magic ID for Emscripten 'default surface' */)) {
        EGL.setErrorCode(0x300D /* EGL_BAD_SURFACE */);
        return 0;
      }
  
      GL.makeContextCurrent(context ? EGL.context : null);
  
      EGL.currentContext = context;
      EGL.currentDrawSurface = draw;
      EGL.currentReadSurface = read;
      EGL.setErrorCode(0x3000 /* EGL_SUCCESS */);
      return 1 /* EGL_TRUE */;
    };

  var _eglGetCurrentContext = () => EGL.currentContext;

  var _eglGetCurrentSurface = (readdraw) => {
      if (readdraw == 0x305A /* EGL_READ */) {
        return EGL.currentReadSurface;
      } else if (readdraw == 0x3059 /* EGL_DRAW */) {
        return EGL.currentDrawSurface;
      } else {
        EGL.setErrorCode(0x300C /* EGL_BAD_PARAMETER */);
        return 0 /* EGL_NO_SURFACE */;
      }
    };

  var _eglGetCurrentDisplay = () => EGL.currentContext ? 62000 : 0;

  var _eglSwapBuffers = (dpy, surface) => {
  
      if (!EGL.defaultDisplayInitialized) {
        EGL.setErrorCode(0x3001 /* EGL_NOT_INITIALIZED */);
      } else if (!Module.ctx) {
        EGL.setErrorCode(0x3002 /* EGL_BAD_ACCESS */);
      } else if (Module.ctx.isContextLost()) {
        EGL.setErrorCode(0x300E /* EGL_CONTEXT_LOST */);
      } else {
        // According to documentation this does an implicit flush.
        // Due to discussion at https://github.com/emscripten-core/emscripten/pull/1871
        // the flush was removed since this _may_ result in slowing code down.
        //_glFlush();
        EGL.setErrorCode(0x3000 /* EGL_SUCCESS */);
        return 1 /* EGL_TRUE */;
      }
      return 0 /* EGL_FALSE */;
    };

  var _eglReleaseThread = () => {
      // Equivalent to eglMakeCurrent with EGL_NO_CONTEXT and EGL_NO_SURFACE.
      EGL.currentContext = 0;
      EGL.currentReadSurface = 0;
      EGL.currentDrawSurface = 0;
      // EGL spec v1.4 p.55:
      // "calling eglGetError immediately following a successful call to eglReleaseThread should not be done.
      //  Such a call will return EGL_SUCCESS - but will also result in reallocating per-thread state."
      EGL.setErrorCode(0x3000 /* EGL_SUCCESS */);
      return 1 /* EGL_TRUE */;
    };

  var _uuid_clear = (uu) => zeroMemory(uu, 16);

  var _uuid_compare = (uu1, uu2) => _memcmp(uu1, uu2, 16);

  var _uuid_copy = (dst, src) => _memcpy(dst, src, 16);

  var _uuid_generate = (out) => {
      // void uuid_generate(uuid_t out);
      var uuid = null;
  
      if (ENVIRONMENT_IS_NODE) {
        // If Node.js try to use crypto.randomBytes
        try {
          var rb = require('crypto')['randomBytes'];
          uuid = rb(16);
        } catch(e) {}
      } else if (ENVIRONMENT_IS_WEB &&
                 typeof window.crypto != 'undefined' &&
                 typeof window.crypto.getRandomValues != 'undefined') {
        // If crypto.getRandomValues is available try to use it.
        uuid = new Uint8Array(16);
        window.crypto.getRandomValues(uuid);
      }
  
      // Fall back to Math.random if a higher quality random number generator is not available.
      if (!uuid) {
        uuid = new Array(16);
        var d = new Date().getTime();
        for (var i = 0; i < 16; i++) {
          var r = ((d + Math.random() * 256) % 256)|0;
          d = (d / 256)|0;
          uuid[i] = r;
        }
      }
  
      // Makes uuid compliant to RFC-4122
      uuid[6] = (uuid[6] & 0x0F) | 0x40; // uuid version
      uuid[8] = (uuid[8] & 0x3F) | 0x80; // uuid variant
      writeArrayToMemory(uuid, out);
    };

  var _uuid_is_null = (uu) => {
      // int uuid_is_null(const uuid_t uu);
      for (var i = 0; i < 4; i++, uu = (uu+4)|0) {
        var val = HEAP32[((uu)>>2)];
        if (val) {
          return 0;
        }
      }
      return 1;
    };

  var _uuid_parse = (inp, uu) => {
      // int uuid_parse(const char *in, uuid_t uu);
      inp = UTF8ToString(inp);
      if (inp.length === 36) {
        var i = 0;
        var uuid = new Array(16);
        inp.toLowerCase().replace(/[0-9a-f]{2}/g, function(byte) {
          if (i < 16) {
            uuid[i++] = parseInt(byte, 16);
          }
        });
  
        if (i < 16) {
          return -1;
        }
        writeArrayToMemory(uuid, uu);
        return 0;
      }
      return -1;
    };

  /** @param {number|boolean=} upper */
  var _uuid_unparse = (uu, out, upper) => {
      // void uuid_unparse(const uuid_t uu, char *out);
      var i = 0;
      var uuid = 'xxxx-xx-xx-xx-xxxxxx'.replace(/[x]/g, function(c) {
        var r = upper ? (HEAPU8[(uu)+(i)]).toString(16).toUpperCase() :
                        (HEAPU8[(uu)+(i)]).toString(16);
        r = (r.length === 1) ? '0' + r : r; // Zero pad single digit hex values
        i++;
        return r;
      });
      stringToUTF8(uuid, out, 37); // Always fixed 36 bytes of ASCII characters and a trailing \0.
    };

  var _uuid_unparse_lower = (uu, out) => {
      // void uuid_unparse_lower(const uuid_t uu, char *out);
      _uuid_unparse(uu, out);
    };

  var _uuid_unparse_upper = (uu, out) => {
      // void uuid_unparse_upper(const uuid_t uu, char *out);
      _uuid_unparse(uu, out, true);
    };

  var _uuid_type = (uu) => 4;

  var _uuid_variant = (uu) => 1;

  
  
  
  
  var GLEW = {
  isLinaroFork:1,
  extensions:null,
  error:{
  0:null,
  1:null,
  2:null,
  3:null,
  4:null,
  5:null,
  6:null,
  7:null,
  8:null,
  },
  version:{
  1:null,
  2:null,
  3:null,
  4:null,
  },
  errorStringConstantFromCode(error) {
        if (GLEW.isLinaroFork) {
          switch (error) {
            case 4:return "OpenGL ES lib expected, found OpenGL lib"; // GLEW_ERROR_NOT_GLES_VERSION
            case 5:return "OpenGL lib expected, found OpenGL ES lib"; // GLEW_ERROR_GLES_VERSION
            case 6:return "Missing EGL version"; // GLEW_ERROR_NO_EGL_VERSION
            case 7:return "EGL 1.1 and up are supported"; // GLEW_ERROR_EGL_VERSION_10_ONLY
            default:break;
          }
        }
  
        switch (error) {
          case 0:return "No error"; // GLEW_OK || GLEW_NO_ERROR
          case 1:return "Missing GL version"; // GLEW_ERROR_NO_GL_VERSION
          case 2:return "GL 1.1 and up are supported"; // GLEW_ERROR_GL_VERSION_10_ONLY
          case 3:return "GLX 1.2 and up are supported"; // GLEW_ERROR_GLX_VERSION_11_ONLY
          default:return null;
        }
      },
  errorString(error) {
        if (!GLEW.error[error]) {
          var string = GLEW.errorStringConstantFromCode(error);
          if (!string) {
            string = "Unknown error";
            error = 8; // prevent array from growing more than this
          }
          GLEW.error[error] = stringToNewUTF8(string);
        }
        return GLEW.error[error];
      },
  versionStringConstantFromCode(name) {
        switch (name) {
          case 1:return "1.10.0"; // GLEW_VERSION
          case 2:return "1"; // GLEW_VERSION_MAJOR
          case 3:return "10"; // GLEW_VERSION_MINOR
          case 4:return "0"; // GLEW_VERSION_MICRO
          default:return null;
        }
      },
  versionString(name) {
        if (!GLEW.version[name]) {
          var string = GLEW.versionStringConstantFromCode(name);
          if (!string)
            return 0;
          GLEW.version[name] = stringToNewUTF8(string);
        }
        return GLEW.version[name];
      },
  extensionIsSupported(name) {
        GLEW.extensions ||= webglGetExtensions();
  
        if (GLEW.extensions.includes(name))
          return 1;
  
        // extensions from GLEmulations do not come unprefixed
        // so, try with prefix
        return (GLEW.extensions.includes("GL_" + name));
      },
  };

  var _glewInit = () => 0;

  
  var _glewIsSupported = (name) => {
      var exts = UTF8ToString(name).split(' ');
      for (var i = 0; i < exts.length; ++i) {
        if (!GLEW.extensionIsSupported(exts[i]))
          return 0;
      }
      return 1;
    };

  
  var _glewGetExtension = (name) => GLEW.extensionIsSupported(UTF8ToString(name));

  var _glewGetErrorString = (error) => GLEW.errorString(error);

  var _glewGetString = (name) => GLEW.versionString(name);

  var IDBStore = {
  indexedDB() {
      if (typeof indexedDB != 'undefined') return indexedDB;
      var ret = null;
      if (typeof window == 'object') ret = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
      assert(ret, 'IDBStore used, but indexedDB not supported');
      return ret;
    },
  DB_VERSION:22,
  DB_STORE_NAME:"FILE_DATA",
  dbs:{
  },
  blobs:[0],
  getDB(name, callback) {
      // check the cache first
      var db = IDBStore.dbs[name];
      if (db) {
        return callback(null, db);
      }
      var req;
      try {
        req = IDBStore.indexedDB().open(name, IDBStore.DB_VERSION);
      } catch (e) {
        return callback(e);
      }
      req.onupgradeneeded = (e) => {
        var db = /** @type {IDBDatabase} */ (e.target.result);
        var transaction = e.target.transaction;
        var fileStore;
        if (db.objectStoreNames.contains(IDBStore.DB_STORE_NAME)) {
          fileStore = transaction.objectStore(IDBStore.DB_STORE_NAME);
        } else {
          fileStore = db.createObjectStore(IDBStore.DB_STORE_NAME);
        }
      };
      req.onsuccess = () => {
        db = /** @type {IDBDatabase} */ (req.result);
        // add to the cache
        IDBStore.dbs[name] = db;
        callback(null, db);
      };
      req.onerror = function(event) {
        callback(event.target.error || 'unknown error');
        event.preventDefault();
      };
    },
  getStore(dbName, type, callback) {
      IDBStore.getDB(dbName, (error, db) => {
        if (error) return callback(error);
        var transaction = db.transaction([IDBStore.DB_STORE_NAME], type);
        transaction.onerror = (event) => {
          callback(event.target.error || 'unknown error');
          event.preventDefault();
        };
        var store = transaction.objectStore(IDBStore.DB_STORE_NAME);
        callback(null, store);
      });
    },
  getFile(dbName, id, callback) {
      IDBStore.getStore(dbName, 'readonly', (err, store) => {
        if (err) return callback(err);
        var req = store.get(id);
        req.onsuccess = (event) => {
          var result = event.target.result;
          if (!result) {
            return callback(`file ${id} not found`);
          }
          return callback(null, result);
        };
        req.onerror = callback;
      });
    },
  setFile(dbName, id, data, callback) {
      IDBStore.getStore(dbName, 'readwrite', (err, store) => {
        if (err) return callback(err);
        var req = store.put(data, id);
        req.onsuccess = (event) => callback();
        req.onerror = callback;
      });
    },
  deleteFile(dbName, id, callback) {
      IDBStore.getStore(dbName, 'readwrite', (err, store) => {
        if (err) return callback(err);
        var req = store.delete(id);
        req.onsuccess = (event) => callback();
        req.onerror = callback;
      });
    },
  existsFile(dbName, id, callback) {
      IDBStore.getStore(dbName, 'readonly', (err, store) => {
        if (err) return callback(err);
        var req = store.count(id);
        req.onsuccess = (event) => callback(null, event.target.result > 0);
        req.onerror = callback;
      });
    },
  clearStore(dbName, callback) {
      IDBStore.getStore(dbName, 'readwrite', (err, store) => {
        if (err) return callback(err);
        var req = store.clear();
        req.onsuccess = (event) => callback();
        req.onerror = callback;
      });
    },
  };

  
  
  
  
  
  var _emscripten_idb_async_load = (db, id, arg, onload, onerror) => {
      ;
      IDBStore.getFile(UTF8ToString(db), UTF8ToString(id), (error, byteArray) => {
        
        callUserCallback(() => {
          if (error) {
            if (onerror) ((a1) => dynCall_vi(onerror, a1))(arg);
            return;
          }
          var buffer = _malloc(byteArray.length);
          HEAPU8.set(byteArray, buffer);
          ((a1, a2, a3) => { throw 'Internal Error! Attempted to invoke wasm function pointer with signature "viii", but no such functions have gotten exported!' })(arg, buffer, byteArray.length);
          _free(buffer);
        });
      });
    };

  
  
  
  
  var _emscripten_idb_async_store = (db, id, ptr, num, arg, onstore, onerror) => {
      // note that we copy the data here, as these are async operatins - changes
      // to HEAPU8 meanwhile should not affect us!
      ;
      IDBStore.setFile(UTF8ToString(db), UTF8ToString(id), new Uint8Array(HEAPU8.subarray(ptr, ptr+num)), (error) => {
        
        callUserCallback(() => {
          if (error) {
            if (onerror) ((a1) => dynCall_vi(onerror, a1))(arg);
            return;
          }
          if (onstore) ((a1) => dynCall_vi(onstore, a1))(arg);
        });
      });
    };

  
  
  
  var _emscripten_idb_async_delete = (db, id, arg, ondelete, onerror) => {
      ;
      IDBStore.deleteFile(UTF8ToString(db), UTF8ToString(id), (error) => {
        
        callUserCallback(() => {
          if (error) {
            if (onerror) ((a1) => dynCall_vi(onerror, a1))(arg);
            return;
          }
          if (ondelete) ((a1) => dynCall_vi(ondelete, a1))(arg);
        });
      });
    };

  
  
  
  var _emscripten_idb_async_exists = (db, id, arg, oncheck, onerror) => {
      ;
      IDBStore.existsFile(UTF8ToString(db), UTF8ToString(id), (error, exists) => {
        
        callUserCallback(() => {
          if (error) {
            if (onerror) ((a1) => dynCall_vi(onerror, a1))(arg);
            return;
          }
          if (oncheck) ((a1, a2) => dynCall_vii(oncheck, a1, a2))(arg, exists);
        });
      });
    };

  
  
  
  var _emscripten_idb_async_clear = (db, arg, onclear, onerror) => {
      ;
      IDBStore.clearStore(UTF8ToString(db), (error) => {
        
        callUserCallback(() => {
          if (error) {
            if (onerror) ((a1) => dynCall_vi(onerror, a1))(arg);
            return;
          }
          if (onclear) ((a1) => dynCall_vi(onclear, a1))(arg);
        });
      });
    };

  
  
  var _emscripten_idb_load = (db, id, pbuffer, pnum, perror) => Asyncify.handleSleep((wakeUp) => {
      IDBStore.getFile(UTF8ToString(db), UTF8ToString(id), (error, byteArray) => {
        if (error) {
          HEAP32[((perror)>>2)] = 1;
          wakeUp();
          return;
        }
        var buffer = _malloc(byteArray.length); // must be freed by the caller!
        HEAPU8.set(byteArray, buffer);
        HEAPU32[((pbuffer)>>2)] = buffer;
        HEAP32[((pnum)>>2)] = byteArray.length;
        HEAP32[((perror)>>2)] = 0;
        wakeUp();
      });
    });
  _emscripten_idb_load.isAsync = true;

  
  var _emscripten_idb_store = (db, id, ptr, num, perror) => Asyncify.handleSleep((wakeUp) => {
      IDBStore.setFile(UTF8ToString(db), UTF8ToString(id), new Uint8Array(HEAPU8.subarray(ptr, ptr+num)), (error) => {
        HEAP32[((perror)>>2)] = !!error;
        wakeUp();
      });
    });
  _emscripten_idb_store.isAsync = true;

  
  var _emscripten_idb_delete = (db, id, perror) => Asyncify.handleSleep((wakeUp) => {
      IDBStore.deleteFile(UTF8ToString(db), UTF8ToString(id), (error) => {
        HEAP32[((perror)>>2)] = !!error;
        wakeUp();
      });
    });
  _emscripten_idb_delete.isAsync = true;

  
  var _emscripten_idb_exists = (db, id, pexists, perror) => Asyncify.handleSleep((wakeUp) => {
      IDBStore.existsFile(UTF8ToString(db), UTF8ToString(id), (error, exists) => {
        HEAP32[((pexists)>>2)] = !!exists;
        HEAP32[((perror)>>2)] = !!error;
        wakeUp();
      });
    });
  _emscripten_idb_exists.isAsync = true;

  
  var _emscripten_idb_clear = (db, perror) => Asyncify.handleSleep((wakeUp) => {
      IDBStore.clearStore(UTF8ToString(db), (error) => {
        HEAP32[((perror)>>2)] = !!error;
        wakeUp();
      });
    });
  _emscripten_idb_clear.isAsync = true;

  
  var _emscripten_idb_load_blob = (db, id, pblob, perror) => Asyncify.handleSleep((wakeUp) => {
      assert(!IDBStore.pending);
      IDBStore.pending = (msg) => {
        IDBStore.pending = null;
        var blob = msg.blob;
        if (!blob) {
          HEAP32[((perror)>>2)] = 1;
          wakeUp();
          return;
        }
        assert(blob instanceof Blob);
        var blobId = IDBStore.blobs.length;
        IDBStore.blobs.push(blob);
        HEAP32[((pblob)>>2)] = blobId;
        wakeUp();
      };
      postMessage({
        target: 'IDBStore',
        method: 'loadBlob',
        db: UTF8ToString(db),
        id: UTF8ToString(id)
      });
    });
  _emscripten_idb_load_blob.isAsync = true;

  
  var _emscripten_idb_store_blob = (db, id, ptr, num, perror) => Asyncify.handleSleep((wakeUp) => {
      assert(!IDBStore.pending);
      IDBStore.pending = (msg) => {
        IDBStore.pending = null;
        HEAP32[((perror)>>2)] = !!msg.error;
        wakeUp();
      };
      postMessage({
        target: 'IDBStore',
        method: 'storeBlob',
        db: UTF8ToString(db),
        id: UTF8ToString(id),
        blob: new Blob([new Uint8Array(HEAPU8.subarray(ptr, ptr+num))])
      });
    });
  _emscripten_idb_store_blob.isAsync = true;

  var _emscripten_idb_read_from_blob = (blobId, start, num, buffer) => {
      var blob = IDBStore.blobs[blobId];
      if (!blob) return 1;
      if (start+num > blob.size) return 2;
      var byteArray = (new FileReaderSync()).readAsArrayBuffer(blob.slice(start, start+num));
      HEAPU8.set(new Uint8Array(byteArray), buffer);
      return 0;
    };

  var _emscripten_idb_free_blob = (blobId) => {
      assert(IDBStore.blobs[blobId]);
      IDBStore.blobs[blobId] = null;
    };




  
  
  var _emscripten_wget_data = (url, pbuffer, pnum, perror) => {
      return Asyncify.handleSleep((wakeUp) => {
        asyncLoad(UTF8ToString(url), (byteArray) => {
          // can only allocate the buffer after the wakeUp, not during an asyncing
          var buffer = _malloc(byteArray.length); // must be freed by caller!
          HEAPU8.set(byteArray, buffer);
          HEAPU32[((pbuffer)>>2)] = buffer;
          HEAP32[((pnum)>>2)] = byteArray.length;
          HEAP32[((perror)>>2)] = 0;
          wakeUp();
        }, () => {
          HEAP32[((perror)>>2)] = 1;
          wakeUp();
        }, true /* no need for run dependency, this is async but will not do any prepare etc. step */ );
      });
    };
  _emscripten_wget_data.isAsync = true;

  var _emscripten_scan_registers = (func) => {
      return Asyncify.handleSleep((wakeUp) => {
        // We must first unwind, so things are spilled to the stack. Then while
        // we are pausing we do the actual scan. After that we can resume. Note
        // how using a timeout here avoids unbounded call stack growth, which
        // could happen if we tried to scan the stack immediately after unwinding.
        safeSetTimeout(() => {
          var stackBegin = Asyncify.currData + 12;
          var stackEnd = HEAPU32[((Asyncify.currData)>>2)];
          ((a1, a2) => dynCall_vii(func, a1, a2))(stackBegin, stackEnd);
          wakeUp();
        }, 0);
      });
    };
  _emscripten_scan_registers.isAsync = true;

  var _emscripten_lazy_load_code = () => Asyncify.handleSleep((wakeUp) => {
      // Update the expected wasm binary file to be the lazy one.
      wasmBinaryFile += '.lazy.wasm';
      // Add a callback for when all run dependencies are fulfilled, which happens when async wasm loading is done.
      dependenciesFulfilled = wakeUp;
      // Load the new wasm.
      createWasm();
    });
  _emscripten_lazy_load_code.isAsync = true;

  async function __load_secondary_module() {
      // Mark the module as loading for the wasm module (so it doesn't try to load it again).
      wasmExports['load_secondary_module_status'].value = 1;
      var imports = {'primary': wasmExports};
      // Replace '.wasm' suffix with '.deferred.wasm'.
      var deferred = wasmBinaryFile.slice(0, -5) + '.deferred.wasm';
      await new Promise((resolve) => {
        instantiateAsync(null, deferred, imports, resolve);
      });
    }
  __load_secondary_module.isAsync = true;

  
  
  var Fibers = {
  nextFiber:0,
  trampolineRunning:false,
  trampoline() {
        if (!Fibers.trampolineRunning && Fibers.nextFiber) {
          Fibers.trampolineRunning = true;
          do {
            var fiber = Fibers.nextFiber;
            Fibers.nextFiber = 0;
            Fibers.finishContextSwitch(fiber);
          } while (Fibers.nextFiber);
          Fibers.trampolineRunning = false;
        }
      },
  finishContextSwitch(newFiber) {
        var stack_base = HEAPU32[((newFiber)>>2)];
        var stack_max =  HEAPU32[(((newFiber)+(4))>>2)];
        _emscripten_stack_set_limits(stack_base, stack_max);
  
        stackRestore(HEAPU32[(((newFiber)+(8))>>2)]);
  
        var entryPoint = HEAPU32[(((newFiber)+(12))>>2)];
  
        if (entryPoint !== 0) {
          writeStackCookie();
          Asyncify.currData = null;
          HEAPU32[(((newFiber)+(12))>>2)] = 0;
  
          var userData = HEAPU32[(((newFiber)+(16))>>2)];
          ((a1) => dynCall_vi(entryPoint, a1))(userData);
        } else {
          var asyncifyData = newFiber + 20;
          Asyncify.currData = asyncifyData;
  
          Asyncify.state = Asyncify.State.Rewinding;
          _asyncify_start_rewind(asyncifyData);
          Asyncify.doRewind(asyncifyData);
        }
      },
  };

  
  
  var _emscripten_fiber_swap = (oldFiber, newFiber) => {
      if (ABORT) return;
      if (Asyncify.state === Asyncify.State.Normal) {
        Asyncify.state = Asyncify.State.Unwinding;
  
        var asyncifyData = oldFiber + 20;
        Asyncify.setDataRewindFunc(asyncifyData);
        Asyncify.currData = asyncifyData;
  
        _asyncify_start_unwind(asyncifyData);
  
        var stackTop = stackSave();
        HEAPU32[(((oldFiber)+(8))>>2)] = stackTop;
  
        Fibers.nextFiber = newFiber;
      } else {
        assert(Asyncify.state === Asyncify.State.Rewinding);
        Asyncify.state = Asyncify.State.Normal;
        _asyncify_stop_rewind();
        Asyncify.currData = null;
      }
    };
  _emscripten_fiber_swap.isAsync = true;

  
  
  var _SDL_GetTicks = () => (Date.now() - SDL.startTime)|0;
  
  var _SDL_LockSurface = (surf) => {
      var surfData = SDL.surfaces[surf];
  
      surfData.locked++;
      if (surfData.locked > 1) return 0;
  
      if (!surfData.buffer) {
        surfData.buffer = _malloc(surfData.width * surfData.height * 4);
        HEAPU32[(((surf)+(20))>>2)] = surfData.buffer;
      }
  
      // Mark in C/C++-accessible SDL structure
      // SDL_Surface has the following fields: Uint32 flags, SDL_PixelFormat *format; int w, h; Uint16 pitch; void *pixels; ...
      // So we have fields all of the same size, and 5 of them before us.
      // TODO: Use macros like in library.js
      HEAPU32[(((surf)+(20))>>2)] = surfData.buffer;
  
      if (surf == SDL.screen && Module.screenIsReadOnly && surfData.image) return 0;
  
      if (SDL.defaults.discardOnLock) {
        if (!surfData.image) {
          surfData.image = surfData.ctx.createImageData(surfData.width, surfData.height);
        }
        if (!SDL.defaults.opaqueFrontBuffer) return;
      } else {
        surfData.image = surfData.ctx.getImageData(0, 0, surfData.width, surfData.height);
      }
  
      // Emulate desktop behavior and kill alpha values on the locked surface. (very costly!) Set SDL.defaults.opaqueFrontBuffer = false
      // if you don't want this.
      if (surf == SDL.screen && SDL.defaults.opaqueFrontBuffer) {
        var data = surfData.image.data;
        var num = data.length;
        for (var i = 0; i < num/4; i++) {
          data[i*4+3] = 255; // opacity, as canvases blend alpha
        }
      }
  
      if (SDL.defaults.copyOnLock && !SDL.defaults.discardOnLock) {
        // Copy pixel data to somewhere accessible to 'C/C++'
        if (surfData.isFlagSet(0x00200000 /* SDL_HWPALETTE */)) {
          // If this is needed then
          // we should compact the data from 32bpp to 8bpp index.
          // I think best way to implement this is use
          // additional colorMap hash (color->index).
          // Something like this:
          //
          // var size = surfData.width * surfData.height;
          // var data = '';
          // for (var i = 0; i<size; i++) {
          //   var color = SDL.translateRGBAToColor(
          //     surfData.image.data[i*4   ],
          //     surfData.image.data[i*4 +1],
          //     surfData.image.data[i*4 +2],
          //     255);
          //   var index = surfData.colorMap[color];
          //   HEAP8[(surfData.buffer)+(i)] = index;
          // }
          throw 'CopyOnLock is not supported for SDL_LockSurface with SDL_HWPALETTE flag set' + new Error().stack;
        } else {
          HEAPU8.set(surfData.image.data, surfData.buffer);
        }
      }
  
      return 0;
    };
  
  
  
  
  var SDL = {
  defaults:{
  width:320,
  height:200,
  copyOnLock:true,
  discardOnLock:false,
  opaqueFrontBuffer:true,
  },
  version:null,
  surfaces:{
  },
  canvasPool:[],
  events:[],
  fonts:[null],
  audios:[null],
  rwops:[null],
  music:{
  audio:null,
  volume:1,
  },
  mixerFrequency:22050,
  mixerFormat:32784,
  mixerNumChannels:2,
  mixerChunkSize:1024,
  channelMinimumNumber:0,
  GL:false,
  glAttributes:{
  0:3,
  1:3,
  2:2,
  3:0,
  4:0,
  5:1,
  6:16,
  7:0,
  8:0,
  9:0,
  10:0,
  11:0,
  12:0,
  13:0,
  14:0,
  15:1,
  16:0,
  17:0,
  18:0,
  },
  keyboardState:null,
  keyboardMap:{
  },
  canRequestFullscreen:false,
  isRequestingFullscreen:false,
  textInput:false,
  unicode:false,
  ttfContext:null,
  audio:null,
  startTime:null,
  initFlags:0,
  buttonState:0,
  modState:0,
  DOMButtons:[0,0,0],
  DOMEventToSDLEvent:{
  },
  TOUCH_DEFAULT_ID:0,
  eventHandler:null,
  eventHandlerContext:null,
  eventHandlerTemp:0,
  keyCodes:{
  16:1249,
  17:1248,
  18:1250,
  20:1081,
  33:1099,
  34:1102,
  35:1101,
  36:1098,
  37:1104,
  38:1106,
  39:1103,
  40:1105,
  44:316,
  45:1097,
  46:127,
  91:1251,
  93:1125,
  96:1122,
  97:1113,
  98:1114,
  99:1115,
  100:1116,
  101:1117,
  102:1118,
  103:1119,
  104:1120,
  105:1121,
  106:1109,
  107:1111,
  109:1110,
  110:1123,
  111:1108,
  112:1082,
  113:1083,
  114:1084,
  115:1085,
  116:1086,
  117:1087,
  118:1088,
  119:1089,
  120:1090,
  121:1091,
  122:1092,
  123:1093,
  124:1128,
  125:1129,
  126:1130,
  127:1131,
  128:1132,
  129:1133,
  130:1134,
  131:1135,
  132:1136,
  133:1137,
  134:1138,
  135:1139,
  144:1107,
  160:94,
  161:33,
  162:34,
  163:35,
  164:36,
  165:37,
  166:38,
  167:95,
  168:40,
  169:41,
  170:42,
  171:43,
  172:124,
  173:45,
  174:123,
  175:125,
  176:126,
  181:127,
  182:129,
  183:128,
  188:44,
  190:46,
  191:47,
  192:96,
  219:91,
  220:92,
  221:93,
  222:39,
  224:1251,
  },
  scanCodes:{
  8:42,
  9:43,
  13:40,
  27:41,
  32:44,
  35:204,
  39:53,
  44:54,
  46:55,
  47:56,
  48:39,
  49:30,
  50:31,
  51:32,
  52:33,
  53:34,
  54:35,
  55:36,
  56:37,
  57:38,
  58:203,
  59:51,
  61:46,
  91:47,
  92:49,
  93:48,
  96:52,
  97:4,
  98:5,
  99:6,
  100:7,
  101:8,
  102:9,
  103:10,
  104:11,
  105:12,
  106:13,
  107:14,
  108:15,
  109:16,
  110:17,
  111:18,
  112:19,
  113:20,
  114:21,
  115:22,
  116:23,
  117:24,
  118:25,
  119:26,
  120:27,
  121:28,
  122:29,
  127:76,
  305:224,
  308:226,
  316:70,
  },
  loadRect(rect) {
        return {
          x: HEAP32[((rect + 0)>>2)],
          y: HEAP32[((rect + 4)>>2)],
          w: HEAP32[((rect + 8)>>2)],
          h: HEAP32[((rect + 12)>>2)]
        };
      },
  updateRect(rect, r) {
        HEAP32[((rect)>>2)] = r.x;
        HEAP32[(((rect)+(4))>>2)] = r.y;
        HEAP32[(((rect)+(8))>>2)] = r.w;
        HEAP32[(((rect)+(12))>>2)] = r.h;
      },
  intersectionOfRects(first, second) {
        var leftX = Math.max(first.x, second.x);
        var leftY = Math.max(first.y, second.y);
        var rightX = Math.min(first.x + first.w, second.x + second.w);
        var rightY = Math.min(first.y + first.h, second.y + second.h);
  
        return {
          x: leftX,
          y: leftY,
          w: Math.max(leftX, rightX) - leftX,
          h: Math.max(leftY, rightY) - leftY
        }
      },
  checkPixelFormat(fmt) {
        // Canvas screens are always RGBA.
        var format = HEAP32[((fmt)>>2)];
        if (format != -2042224636) {
          warnOnce('Unsupported pixel format!');
        }
      },
  loadColorToCSSRGB(color) {
        var rgba = HEAP32[((color)>>2)];
        return 'rgb(' + (rgba&255) + ',' + ((rgba >> 8)&255) + ',' + ((rgba >> 16)&255) + ')';
      },
  loadColorToCSSRGBA(color) {
        var rgba = HEAP32[((color)>>2)];
        return 'rgba(' + (rgba&255) + ',' + ((rgba >> 8)&255) + ',' + ((rgba >> 16)&255) + ',' + (((rgba >> 24)&255)/255) + ')';
      },
  translateColorToCSSRGBA:(rgba) =>
        'rgba(' + (rgba&0xff) + ',' + (rgba>>8 & 0xff) + ',' + (rgba>>16 & 0xff) + ',' + (rgba>>>24)/0xff + ')',
  translateRGBAToCSSRGBA:(r, g, b, a) =>
        'rgba(' + (r&0xff) + ',' + (g&0xff) + ',' + (b&0xff) + ',' + (a&0xff)/255 + ')',
  translateRGBAToColor:(r, g, b, a) => r | g << 8 | b << 16 | a << 24,
  makeSurface(width, height, flags, usePageCanvas, source, rmask, gmask, bmask, amask) {
        var is_SDL_HWSURFACE = flags & 0x00000001;
        var is_SDL_HWPALETTE = flags & 0x00200000;
        var is_SDL_OPENGL = flags & 0x04000000;
  
        var surf = _malloc(60);
        var pixelFormat = _malloc(44);
        //surface with SDL_HWPALETTE flag is 8bpp surface (1 byte)
        var bpp = is_SDL_HWPALETTE ? 1 : 4;
        var buffer = 0;
  
        // preemptively initialize this for software surfaces,
        // otherwise it will be lazily initialized inside of SDL_LockSurface
        if (!is_SDL_HWSURFACE && !is_SDL_OPENGL) {
          buffer = _malloc(width * height * 4);
        }
  
        HEAP32[((surf)>>2)] = flags;
        HEAPU32[(((surf)+(4))>>2)] = pixelFormat;
        HEAP32[(((surf)+(8))>>2)] = width;
        HEAP32[(((surf)+(12))>>2)] = height;
        HEAP32[(((surf)+(16))>>2)] = width * bpp;  // assuming RGBA or indexed for now,
                                                                                          // since that is what ImageData gives us in browsers
        HEAPU32[(((surf)+(20))>>2)] = buffer;
  
        HEAP32[(((surf)+(36))>>2)] = 0;
        HEAP32[(((surf)+(40))>>2)] = 0;
        HEAP32[(((surf)+(44))>>2)] = Module["canvas"].width;
        HEAP32[(((surf)+(48))>>2)] = Module["canvas"].height;
  
        HEAP32[(((surf)+(56))>>2)] = 1;
  
        HEAP32[((pixelFormat)>>2)] = -2042224636;
        HEAP32[(((pixelFormat)+(4))>>2)] = 0;// TODO
        HEAP8[(pixelFormat)+(8)] = bpp * 8;
        HEAP8[(pixelFormat)+(9)] = bpp;
  
        HEAP32[(((pixelFormat)+(12))>>2)] = rmask || 0x000000ff;
        HEAP32[(((pixelFormat)+(16))>>2)] = gmask || 0x0000ff00;
        HEAP32[(((pixelFormat)+(20))>>2)] = bmask || 0x00ff0000;
        HEAP32[(((pixelFormat)+(24))>>2)] = amask || 0xff000000;
  
        // Decide if we want to use WebGL or not
        SDL.GL = SDL.GL || is_SDL_OPENGL;
        var canvas;
        if (!usePageCanvas) {
          if (SDL.canvasPool.length > 0) {
            canvas = SDL.canvasPool.pop();
          } else {
            canvas = document.createElement('canvas');
          }
          canvas.width = width;
          canvas.height = height;
        } else {
          canvas = Module['canvas'];
        }
  
        var webGLContextAttributes = {
          antialias: ((SDL.glAttributes[13 /*SDL_GL_MULTISAMPLEBUFFERS*/] != 0) && (SDL.glAttributes[14 /*SDL_GL_MULTISAMPLESAMPLES*/] > 1)),
          depth: (SDL.glAttributes[6 /*SDL_GL_DEPTH_SIZE*/] > 0),
          stencil: (SDL.glAttributes[7 /*SDL_GL_STENCIL_SIZE*/] > 0),
          alpha: (SDL.glAttributes[3 /*SDL_GL_ALPHA_SIZE*/] > 0)
        };
  
        var ctx = Browser.createContext(canvas, is_SDL_OPENGL, usePageCanvas, webGLContextAttributes);
  
        SDL.surfaces[surf] = {
          width,
          height,
          canvas,
          ctx,
          surf,
          buffer,
          pixelFormat,
          alpha: 255,
          flags,
          locked: 0,
          usePageCanvas,
          source,
  
          isFlagSet: (flag) => flags & flag
        };
  
        return surf;
      },
  copyIndexedColorData(surfData, rX, rY, rW, rH) {
        // HWPALETTE works with palette
        // set by SDL_SetColors
        if (!surfData.colors) {
          return;
        }
  
        var fullWidth  = Module['canvas'].width;
        var fullHeight = Module['canvas'].height;
  
        var startX  = rX || 0;
        var startY  = rY || 0;
        var endX    = (rW || (fullWidth - startX)) + startX;
        var endY    = (rH || (fullHeight - startY)) + startY;
  
        var buffer  = surfData.buffer;
  
        if (!surfData.image.data32) {
          surfData.image.data32 = new Uint32Array(surfData.image.data.buffer);
        }
        var data32   = surfData.image.data32;
  
        var colors32 = surfData.colors32;
  
        for (var y = startY; y < endY; ++y) {
          var base = y * fullWidth;
          for (var x = startX; x < endX; ++x) {
            data32[base + x] = colors32[HEAPU8[buffer + base + x]];
          }
        }
      },
  freeSurface(surf) {
        var refcountPointer = surf + 56;
        var refcount = HEAP32[((refcountPointer)>>2)];
        if (refcount > 1) {
          HEAP32[((refcountPointer)>>2)] = refcount - 1;
          return;
        }
  
        var info = SDL.surfaces[surf];
        if (!info.usePageCanvas && info.canvas) SDL.canvasPool.push(info.canvas);
        if (info.buffer) _free(info.buffer);
        _free(info.pixelFormat);
        _free(surf);
        SDL.surfaces[surf] = null;
  
        if (surf === SDL.screen) {
          SDL.screen = null;
        }
      },
  blitSurface(src, srcrect, dst, dstrect, scale) {
        var srcData = SDL.surfaces[src];
        var dstData = SDL.surfaces[dst];
        var sr, dr;
        if (srcrect) {
          sr = SDL.loadRect(srcrect);
        } else {
          sr = { x: 0, y: 0, w: srcData.width, h: srcData.height };
        }
        if (dstrect) {
          dr = SDL.loadRect(dstrect);
        } else {
          dr = { x: 0, y: 0, w: srcData.width, h: srcData.height };
        }
        if (dstData.clipRect) {
          var widthScale = (!scale || sr.w === 0) ? 1 : sr.w / dr.w;
          var heightScale = (!scale || sr.h === 0) ? 1 : sr.h / dr.h;
  
          dr = SDL.intersectionOfRects(dstData.clipRect, dr);
  
          sr.w = dr.w * widthScale;
          sr.h = dr.h * heightScale;
  
          if (dstrect) {
            SDL.updateRect(dstrect, dr);
          }
        }
        var blitw, blith;
        if (scale) {
          blitw = dr.w; blith = dr.h;
        } else {
          blitw = sr.w; blith = sr.h;
        }
        if (sr.w === 0 || sr.h === 0 || blitw === 0 || blith === 0) {
          return 0;
        }
        var oldAlpha = dstData.ctx.globalAlpha;
        dstData.ctx.globalAlpha = srcData.alpha/255;
        dstData.ctx.drawImage(srcData.canvas, sr.x, sr.y, sr.w, sr.h, dr.x, dr.y, blitw, blith);
        dstData.ctx.globalAlpha = oldAlpha;
        if (dst != SDL.screen) {
          // XXX As in IMG_Load, for compatibility we write out |pixels|
          warnOnce('WARNING: copying canvas data to memory for compatibility');
          _SDL_LockSurface(dst);
          dstData.locked--; // The surface is not actually locked in this hack
        }
        return 0;
      },
  downFingers:{
  },
  savedKeydown:null,
  receiveEvent(event) {
        function unpressAllPressedKeys() {
          // Un-press all pressed keys: TODO
          for (var code in SDL.keyboardMap) {
            SDL.events.push({
              type: 'keyup',
              keyCode: SDL.keyboardMap[code]
            });
          }
        };
        switch (event.type) {
          case 'touchstart': case 'touchmove': {
            event.preventDefault();
  
            var touches = [];
  
            // Clear out any touchstart events that we've already processed
            if (event.type === 'touchstart') {
              for (var i = 0; i < event.touches.length; i++) {
                var touch = event.touches[i];
                if (SDL.downFingers[touch.identifier] != true) {
                  SDL.downFingers[touch.identifier] = true;
                  touches.push(touch);
                }
              }
            } else {
              touches = event.touches;
            }
  
            var firstTouch = touches[0];
            if (firstTouch) {
              if (event.type == 'touchstart') {
                SDL.DOMButtons[0] = 1;
              }
              var mouseEventType;
              switch (event.type) {
                case 'touchstart': mouseEventType = 'mousedown'; break;
                case 'touchmove': mouseEventType = 'mousemove'; break;
              }
              var mouseEvent = {
                type: mouseEventType,
                button: 0,
                pageX: firstTouch.clientX,
                pageY: firstTouch.clientY
              };
              SDL.events.push(mouseEvent);
            }
  
            for (var i = 0; i < touches.length; i++) {
              var touch = touches[i];
              SDL.events.push({
                type: event.type,
                touch
              });
            };
            break;
          }
          case 'touchend': {
            event.preventDefault();
  
            // Remove the entry in the SDL.downFingers hash
            // because the finger is no longer down.
            for (var i = 0; i < event.changedTouches.length; i++) {
              var touch = event.changedTouches[i];
              if (SDL.downFingers[touch.identifier] === true) {
                delete SDL.downFingers[touch.identifier];
              }
            }
  
            var mouseEvent = {
              type: 'mouseup',
              button: 0,
              pageX: event.changedTouches[0].clientX,
              pageY: event.changedTouches[0].clientY
            };
            SDL.DOMButtons[0] = 0;
            SDL.events.push(mouseEvent);
  
            for (var i = 0; i < event.changedTouches.length; i++) {
              var touch = event.changedTouches[i];
              SDL.events.push({
                type: 'touchend',
                touch
              });
            };
            break;
          }
          case 'DOMMouseScroll': case 'mousewheel': case 'wheel':
            // Flip the wheel direction to translate from browser wheel direction
            // (+:down) to SDL direction (+:up)
            var delta = -Browser.getMouseWheelDelta(event);
            // Quantize to integer so that minimum scroll is at least +/- 1.
            delta = (delta == 0) ? 0 : (delta > 0 ? Math.max(delta, 1) : Math.min(delta, -1));
  
            // Simulate old-style SDL events representing mouse wheel input as buttons
            // Subtract one since JS->C marshalling is defined to add one back.
            var button = delta > 0 ? 3 /*SDL_BUTTON_WHEELUP-1*/ : 4 /*SDL_BUTTON_WHEELDOWN-1*/;
            SDL.events.push({ type: 'mousedown', button, pageX: event.pageX, pageY: event.pageY });
            SDL.events.push({ type: 'mouseup', button, pageX: event.pageX, pageY: event.pageY });
  
            // Pass a delta motion event.
            SDL.events.push({ type: 'wheel', deltaX: 0, deltaY: delta });
            // If we don't prevent this, then 'wheel' event will be sent again by
            // the browser as 'DOMMouseScroll' and we will receive this same event
            // the second time.
            event.preventDefault();
            break;
          case 'mousemove':
            if (SDL.DOMButtons[0] === 1) {
              SDL.events.push({
                type: 'touchmove',
                touch: {
                  identifier: 0,
                  deviceID: -1,
                  pageX: event.pageX,
                  pageY: event.pageY
                }
              });
            }
            if (Browser.pointerLock) {
              // workaround for firefox bug 750111
              if ('mozMovementX' in event) {
                event['movementX'] = event['mozMovementX'];
                event['movementY'] = event['mozMovementY'];
              }
              // workaround for Firefox bug 782777
              if (event['movementX'] == 0 && event['movementY'] == 0) {
                // ignore a mousemove event if it doesn't contain any movement info
                // (without pointer lock, we infer movement from pageX/pageY, so this check is unnecessary)
                event.preventDefault();
                return;
              }
            }
            // fall through
          case 'keydown': case 'keyup': case 'keypress': case 'mousedown': case 'mouseup':
            // If we preventDefault on keydown events, the subsequent keypress events
            // won't fire. However, it's fine (and in some cases necessary) to
            // preventDefault for keys that don't generate a character. Otherwise,
            // preventDefault is the right thing to do in general.
            if (event.type !== 'keydown' || (!SDL.unicode && !SDL.textInput) || (event.keyCode === 8 /* backspace */ || event.keyCode === 9 /* tab */)) {
              event.preventDefault();
            }
  
            if (event.type == 'mousedown') {
              SDL.DOMButtons[event.button] = 1;
              SDL.events.push({
                type: 'touchstart',
                touch: {
                  identifier: 0,
                  deviceID: -1,
                  pageX: event.pageX,
                  pageY: event.pageY
                }
              });
            } else if (event.type == 'mouseup') {
              // ignore extra ups, can happen if we leave the canvas while pressing down, then return,
              // since we add a mouseup in that case
              if (!SDL.DOMButtons[event.button]) {
                return;
              }
  
              SDL.events.push({
                type: 'touchend',
                touch: {
                  identifier: 0,
                  deviceID: -1,
                  pageX: event.pageX,
                  pageY: event.pageY
                }
              });
              SDL.DOMButtons[event.button] = 0;
            }
  
            // We can only request fullscreen as the result of user input.
            // Due to this limitation, we toggle a boolean on keydown which
            // SDL_WM_ToggleFullScreen will check and subsequently set another
            // flag indicating for us to request fullscreen on the following
            // keyup. This isn't perfect, but it enables SDL_WM_ToggleFullScreen
            // to work as the result of a keypress (which is an extremely
            // common use case).
            if (event.type === 'keydown' || event.type === 'mousedown') {
              SDL.canRequestFullscreen = true;
            } else if (event.type === 'keyup' || event.type === 'mouseup') {
              if (SDL.isRequestingFullscreen) {
                Module['requestFullscreen'](/*lockPointer=*/true, /*resizeCanvas=*/true);
                SDL.isRequestingFullscreen = false;
              }
              SDL.canRequestFullscreen = false;
            }
  
            // SDL expects a unicode character to be passed to its keydown events.
            // Unfortunately, the browser APIs only provide a charCode property on
            // keypress events, so we must backfill in keydown events with their
            // subsequent keypress event's charCode.
            if (event.type === 'keypress' && SDL.savedKeydown) {
              // charCode is read-only
              SDL.savedKeydown.keypressCharCode = event.charCode;
              SDL.savedKeydown = null;
            } else if (event.type === 'keydown') {
              SDL.savedKeydown = event;
            }
  
            // Don't push keypress events unless SDL_StartTextInput has been called.
            if (event.type !== 'keypress' || SDL.textInput) {
              SDL.events.push(event);
            }
            break;
          case 'mouseout':
            // Un-press all pressed mouse buttons, because we might miss the release outside of the canvas
            for (var i = 0; i < 3; i++) {
              if (SDL.DOMButtons[i]) {
                SDL.events.push({
                  type: 'mouseup',
                  button: i,
                  pageX: event.pageX,
                  pageY: event.pageY
                });
                SDL.DOMButtons[i] = 0;
              }
            }
            event.preventDefault();
            break;
          case 'focus':
            SDL.events.push(event);
            event.preventDefault();
            break;
          case 'blur':
            SDL.events.push(event);
            unpressAllPressedKeys();
            event.preventDefault();
            break;
          case 'visibilitychange':
            SDL.events.push({
              type: 'visibilitychange',
              visible: !document.hidden
            });
            unpressAllPressedKeys();
            event.preventDefault();
            break;
          case 'unload':
            if (Browser.mainLoop.runner) {
              SDL.events.push(event);
              // Force-run a main event loop, since otherwise this event will never be caught!
              Browser.mainLoop.runner();
            }
            return;
          case 'resize':
            SDL.events.push(event);
            // manually triggered resize event doesn't have a preventDefault member
            if (event.preventDefault) {
              event.preventDefault();
            }
            break;
        }
        if (SDL.events.length >= 10000) {
          err('SDL event queue full, dropping events');
          SDL.events = SDL.events.slice(0, 10000);
        }
        // If we have a handler installed, this will push the events to the app
        // instead of the app polling for them.
        SDL.flushEventsToHandler();
        return;
      },
  lookupKeyCodeForEvent(event) {
        var code = event.keyCode;
        if (code >= 65 && code <= 90) {
          code += 32; // make lowercase for SDL
        } else {
          code = SDL.keyCodes[event.keyCode] || event.keyCode;
          // If this is one of the modifier keys (224 | 1<<10 - 227 | 1<<10), and the event specifies that it is
          // a right key, add 4 to get the right key SDL key code.
          if (event.location === 2 /*KeyboardEvent.DOM_KEY_LOCATION_RIGHT*/ && code >= (224 | 1<<10) && code <= (227 | 1<<10)) {
            code += 4;
          }
        }
        return code;
      },
  handleEvent(event) {
        if (event.handled) return;
        event.handled = true;
  
        switch (event.type) {
          case 'touchstart': case 'touchend': case 'touchmove': {
            Browser.calculateMouseEvent(event);
            break;
          }
          case 'keydown': case 'keyup': {
            var down = event.type === 'keydown';
            var code = SDL.lookupKeyCodeForEvent(event);
            // Assigning a boolean to HEAP8, that's alright but Closure would like to warn about it.
            // TODO(https://github.com/emscripten-core/emscripten/issues/16311):
            // This is kind of ugly hack.  Perhaps we can find a better way?
            /** @suppress{checkTypes} */
            HEAP8[(SDL.keyboardState)+(code)] = down;
            // TODO: lmeta, rmeta, numlock, capslock, KMOD_MODE, KMOD_RESERVED
            SDL.modState = (HEAP8[(SDL.keyboardState)+(1248)] ? 0x0040 : 0) | // KMOD_LCTRL
              (HEAP8[(SDL.keyboardState)+(1249)] ? 0x0001 : 0) | // KMOD_LSHIFT
              (HEAP8[(SDL.keyboardState)+(1250)] ? 0x0100 : 0) | // KMOD_LALT
              (HEAP8[(SDL.keyboardState)+(1252)] ? 0x0080 : 0) | // KMOD_RCTRL
              (HEAP8[(SDL.keyboardState)+(1253)] ? 0x0002 : 0) | // KMOD_RSHIFT
              (HEAP8[(SDL.keyboardState)+(1254)] ? 0x0200 : 0); //  KMOD_RALT
            if (down) {
              SDL.keyboardMap[code] = event.keyCode; // save the DOM input, which we can use to unpress it during blur
            } else {
              delete SDL.keyboardMap[code];
            }
  
            break;
          }
          case 'mousedown': case 'mouseup':
            if (event.type == 'mousedown') {
              // SDL_BUTTON(x) is defined as (1 << ((x)-1)).  SDL buttons are 1-3,
              // and DOM buttons are 0-2, so this means that the below formula is
              // correct.
              SDL.buttonState |= 1 << event.button;
            } else if (event.type == 'mouseup') {
              SDL.buttonState &= ~(1 << event.button);
            }
            // fall through
          case 'mousemove': {
            Browser.calculateMouseEvent(event);
            break;
          }
        }
      },
  flushEventsToHandler() {
        if (!SDL.eventHandler) return;
  
        while (SDL.pollEvent(SDL.eventHandlerTemp)) {
          ((a1, a2) => dynCall_iii(SDL.eventHandler, a1, a2))(SDL.eventHandlerContext, SDL.eventHandlerTemp);
        }
      },
  pollEvent(ptr) {
        if (SDL.initFlags & 0x200 && SDL.joystickEventState) {
          // If SDL_INIT_JOYSTICK was supplied AND the joystick system is configured
          // to automatically query for events, query for joystick events.
          SDL.queryJoysticks();
        }
        if (ptr) {
          while (SDL.events.length > 0) {
            if (SDL.makeCEvent(SDL.events.shift(), ptr) !== false) return 1;
          }
          return 0;
        }
        // XXX: somewhat risky in that we do not check if the event is real or not
        // (makeCEvent returns false) if no pointer supplied
        return SDL.events.length > 0;
      },
  makeCEvent(event, ptr) {
        if (typeof event == 'number') {
          // This is a pointer to a copy of a native C event that was SDL_PushEvent'ed
          _memcpy(ptr, event, 28);
          _free(event); // the copy is no longer needed
          return;
        }
  
        SDL.handleEvent(event);
  
        switch (event.type) {
          case 'keydown': case 'keyup': {
            var down = event.type === 'keydown';
            //dbg('Received key event: ' + event.keyCode);
            var key = SDL.lookupKeyCodeForEvent(event);
            var scan;
            if (key >= 1024) {
              scan = key - 1024;
            } else {
              scan = SDL.scanCodes[key] || key;
            }
  
            HEAP32[((ptr)>>2)] = SDL.DOMEventToSDLEvent[event.type];
            HEAP8[(ptr)+(8)] = down ? 1 : 0;
            HEAP8[(ptr)+(9)] = 0; // TODO
            HEAP32[(((ptr)+(12))>>2)] = scan;
            HEAP32[(((ptr)+(16))>>2)] = key;
            HEAP16[(((ptr)+(20))>>1)] = SDL.modState;
            // some non-character keys (e.g. backspace and tab) won't have keypressCharCode set, fill in with the keyCode.
            HEAP32[(((ptr)+(24))>>2)] = event.keypressCharCode || key;
  
            break;
          }
          case 'keypress': {
            HEAP32[((ptr)>>2)] = SDL.DOMEventToSDLEvent[event.type];
            // Not filling in windowID for now
            var cStr = intArrayFromString(String.fromCharCode(event.charCode));
            for (var i = 0; i < cStr.length; ++i) {
              HEAP8[(ptr)+(8 + i)] = cStr[i];
            }
            break;
          }
          case 'mousedown': case 'mouseup': case 'mousemove': {
            if (event.type != 'mousemove') {
              var down = event.type === 'mousedown';
              HEAP32[((ptr)>>2)] = SDL.DOMEventToSDLEvent[event.type];
              HEAP32[(((ptr)+(4))>>2)] = 0;
              HEAP32[(((ptr)+(8))>>2)] = 0;
              HEAP32[(((ptr)+(12))>>2)] = 0;
              HEAP8[(ptr)+(16)] = event.button+1; // DOM buttons are 0-2, SDL 1-3
              HEAP8[(ptr)+(17)] = down ? 1 : 0;
              HEAP32[(((ptr)+(20))>>2)] = Browser.mouseX;
              HEAP32[(((ptr)+(24))>>2)] = Browser.mouseY;
            } else {
              HEAP32[((ptr)>>2)] = SDL.DOMEventToSDLEvent[event.type];
              HEAP32[(((ptr)+(4))>>2)] = 0;
              HEAP32[(((ptr)+(8))>>2)] = 0;
              HEAP32[(((ptr)+(12))>>2)] = 0;
              HEAP32[(((ptr)+(16))>>2)] = SDL.buttonState;
              HEAP32[(((ptr)+(20))>>2)] = Browser.mouseX;
              HEAP32[(((ptr)+(24))>>2)] = Browser.mouseY;
              HEAP32[(((ptr)+(28))>>2)] = Browser.mouseMovementX;
              HEAP32[(((ptr)+(32))>>2)] = Browser.mouseMovementY;
            }
            break;
          }
          case 'wheel': {
            HEAP32[((ptr)>>2)] = SDL.DOMEventToSDLEvent[event.type];
            HEAP32[(((ptr)+(16))>>2)] = event.deltaX;
            HEAP32[(((ptr)+(20))>>2)] = event.deltaY;
            break;
          }
          case 'touchstart': case 'touchend': case 'touchmove': {
            var touch = event.touch;
            if (!Browser.touches[touch.identifier]) break;
            var w = Module['canvas'].width;
            var h = Module['canvas'].height;
            var x = Browser.touches[touch.identifier].x / w;
            var y = Browser.touches[touch.identifier].y / h;
            var lx = Browser.lastTouches[touch.identifier].x / w;
            var ly = Browser.lastTouches[touch.identifier].y / h;
            var dx = x - lx;
            var dy = y - ly;
            if (touch['deviceID'] === undefined) touch.deviceID = SDL.TOUCH_DEFAULT_ID;
            if (dx === 0 && dy === 0 && event.type === 'touchmove') return false; // don't send these if nothing happened
            HEAP32[((ptr)>>2)] = SDL.DOMEventToSDLEvent[event.type];
            HEAP32[(((ptr)+(4))>>2)] = _SDL_GetTicks();
            (tempI64 = [touch.deviceID>>>0,(tempDouble = touch.deviceID,(+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? (+(Math.floor((tempDouble)/4294967296.0)))>>>0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)], HEAP32[(((ptr)+(8))>>2)] = tempI64[0],HEAP32[(((ptr)+(12))>>2)] = tempI64[1]);
            (tempI64 = [touch.identifier>>>0,(tempDouble = touch.identifier,(+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? (+(Math.floor((tempDouble)/4294967296.0)))>>>0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)], HEAP32[(((ptr)+(16))>>2)] = tempI64[0],HEAP32[(((ptr)+(20))>>2)] = tempI64[1]);
            HEAPF32[(((ptr)+(24))>>2)] = x;
            HEAPF32[(((ptr)+(28))>>2)] = y;
            HEAPF32[(((ptr)+(32))>>2)] = dx;
            HEAPF32[(((ptr)+(36))>>2)] = dy;
            if (touch.force !== undefined) {
              HEAPF32[(((ptr)+(40))>>2)] = touch.force;
            } else { // No pressure data, send a digital 0/1 pressure.
              HEAPF32[(((ptr)+(40))>>2)] = event.type == "touchend" ? 0 : 1;
            }
            break;
          }
          case 'unload': {
            HEAP32[((ptr)>>2)] = SDL.DOMEventToSDLEvent[event.type];
            break;
          }
          case 'resize': {
            HEAP32[((ptr)>>2)] = SDL.DOMEventToSDLEvent[event.type];
            HEAP32[(((ptr)+(4))>>2)] = event.w;
            HEAP32[(((ptr)+(8))>>2)] = event.h;
            break;
          }
          case 'joystick_button_up': case 'joystick_button_down': {
            var state = event.type === 'joystick_button_up' ? 0 : 1;
            HEAP32[((ptr)>>2)] = SDL.DOMEventToSDLEvent[event.type];
            HEAP8[(ptr)+(4)] = event.index;
            HEAP8[(ptr)+(5)] = event.button;
            HEAP8[(ptr)+(6)] = state;
            break;
          }
          case 'joystick_axis_motion': {
            HEAP32[((ptr)>>2)] = SDL.DOMEventToSDLEvent[event.type];
            HEAP8[(ptr)+(4)] = event.index;
            HEAP8[(ptr)+(5)] = event.axis;
            HEAP32[(((ptr)+(8))>>2)] = SDL.joystickAxisValueConversion(event.value);
            break;
          }
          case 'focus': {
            var SDL_WINDOWEVENT_FOCUS_GAINED = 12 /* SDL_WINDOWEVENT_FOCUS_GAINED */;
            HEAP32[((ptr)>>2)] = SDL.DOMEventToSDLEvent[event.type];
            HEAP32[(((ptr)+(4))>>2)] = 0;
            HEAP8[(ptr)+(8)] = SDL_WINDOWEVENT_FOCUS_GAINED;
            break;
          }
          case 'blur': {
            var SDL_WINDOWEVENT_FOCUS_LOST = 13 /* SDL_WINDOWEVENT_FOCUS_LOST */;
            HEAP32[((ptr)>>2)] = SDL.DOMEventToSDLEvent[event.type];
            HEAP32[(((ptr)+(4))>>2)] = 0;
            HEAP8[(ptr)+(8)] = SDL_WINDOWEVENT_FOCUS_LOST;
            break;
          }
          case 'visibilitychange': {
            var SDL_WINDOWEVENT_SHOWN  = 1 /* SDL_WINDOWEVENT_SHOWN */;
            var SDL_WINDOWEVENT_HIDDEN = 2 /* SDL_WINDOWEVENT_HIDDEN */;
            var visibilityEventID = event.visible ? SDL_WINDOWEVENT_SHOWN : SDL_WINDOWEVENT_HIDDEN;
            HEAP32[((ptr)>>2)] = SDL.DOMEventToSDLEvent[event.type];
            HEAP32[(((ptr)+(4))>>2)] = 0;
            HEAP8[(ptr)+(8)] = visibilityEventID;
            break;
          }
          default: throw 'Unhandled SDL event: ' + event.type;
        }
      },
  makeFontString(height, fontName) {
        if (fontName.charAt(0) != "'" && fontName.charAt(0) != '"') {
          // https://developer.mozilla.org/ru/docs/Web/CSS/font-family
          // Font family names containing whitespace should be quoted.
          // BTW, quote all font names is easier than searching spaces
          fontName = '"' + fontName + '"';
        }
        return height + 'px ' + fontName + ', serif';
      },
  estimateTextWidth(fontData, text) {
        var h = fontData.size;
        var fontString = SDL.makeFontString(h, fontData.name);
        var tempCtx = SDL.ttfContext;
        assert(tempCtx, 'TTF_Init must have been called');
        tempCtx.font = fontString;
        var ret = tempCtx.measureText(text).width | 0;
        return ret;
      },
  allocateChannels(num) { // called from Mix_AllocateChannels and init
        if (SDL.numChannels && SDL.numChannels >= num && num != 0) return;
        SDL.numChannels = num;
        SDL.channels = [];
        for (var i = 0; i < num; i++) {
          SDL.channels[i] = {
            audio: null,
            volume: 1.0
          };
        }
      },
  setGetVolume(info, volume) {
        if (!info) return 0;
        var ret = info.volume * 128; // MIX_MAX_VOLUME
        if (volume != -1) {
          info.volume = Math.min(Math.max(volume, 0), 128) / 128;
          if (info.audio) {
            try {
              info.audio.volume = info.volume; // For <audio> element
              if (info.audio.webAudioGainNode) info.audio.webAudioGainNode['gain']['value'] = info.volume; // For WebAudio playback
            } catch(e) {
              err(`setGetVolume failed to set audio volume: ${e}`);
            }
          }
        }
        return ret;
      },
  setPannerPosition(info, x, y, z) {
        if (!info) return;
        if (info.audio) {
          if (info.audio.webAudioPannerNode) {
            info.audio.webAudioPannerNode['setPosition'](x, y, z);
          }
        }
      },
  playWebAudio(audio) {
        if (!audio) return;
        if (audio.webAudioNode) return; // This instance is already playing, don't start again.
        if (!SDL.webAudioAvailable()) return;
        try {
          var webAudio = audio.resource.webAudio;
          audio.paused = false;
          if (!webAudio.decodedBuffer) {
            if (webAudio.onDecodeComplete === undefined) abort("Cannot play back audio object that was not loaded");
            webAudio.onDecodeComplete.push(() => { if (!audio.paused) SDL.playWebAudio(audio); });
            return;
          }
          audio.webAudioNode = SDL.audioContext['createBufferSource']();
          audio.webAudioNode['buffer'] = webAudio.decodedBuffer;
          audio.webAudioNode['loop'] = audio.loop;
          audio.webAudioNode['onended'] = audio['onended']; // For <media> element compatibility, route the onended signal to the instance.
  
          audio.webAudioPannerNode = SDL.audioContext['createPanner']();
          // avoid Chrome bug
          // If posz = 0, the sound will come from only the right.
          // By posz = -0.5 (slightly ahead), the sound will come from right and left correctly.
          audio.webAudioPannerNode["setPosition"](0, 0, -.5);
          audio.webAudioPannerNode['panningModel'] = 'equalpower';
  
          // Add an intermediate gain node to control volume.
          audio.webAudioGainNode = SDL.audioContext['createGain']();
          audio.webAudioGainNode['gain']['value'] = audio.volume;
  
          audio.webAudioNode['connect'](audio.webAudioPannerNode);
          audio.webAudioPannerNode['connect'](audio.webAudioGainNode);
          audio.webAudioGainNode['connect'](SDL.audioContext['destination']);
  
          audio.webAudioNode['start'](0, audio.currentPosition);
          audio.startTime = SDL.audioContext['currentTime'] - audio.currentPosition;
        } catch(e) {
          err(`playWebAudio failed: ${e}`);
        }
      },
  pauseWebAudio(audio) {
        if (!audio) return;
        if (audio.webAudioNode) {
          try {
            // Remember where we left off, so that if/when we resume, we can restart the playback at a proper place.
            audio.currentPosition = (SDL.audioContext['currentTime'] - audio.startTime) % audio.resource.webAudio.decodedBuffer.duration;
            // Important: When we reach here, the audio playback is stopped by the user. But when calling .stop() below, the Web Audio
            // graph will send the onended signal, but we don't want to process that, since pausing should not clear/destroy the audio
            // channel.
            audio.webAudioNode['onended'] = undefined;
            audio.webAudioNode.stop(0); // 0 is a default parameter, but WebKit is confused by it #3861
            audio.webAudioNode = undefined;
          } catch(e) {
            err(`pauseWebAudio failed: ${e}`);
          }
        }
        audio.paused = true;
      },
  openAudioContext() {
        // Initialize Web Audio API if we haven't done so yet. Note: Only initialize Web Audio context ever once on the web page,
        // since initializing multiple times fails on Chrome saying 'audio resources have been exhausted'.
        if (!SDL.audioContext) {
          if (typeof AudioContext != 'undefined') SDL.audioContext = new AudioContext();
          else if (typeof webkitAudioContext != 'undefined') SDL.audioContext = new webkitAudioContext();
        }
      },
  webAudioAvailable:() => !!SDL.audioContext,
  fillWebAudioBufferFromHeap(heapPtr, sizeSamplesPerChannel, dstAudioBuffer) {
        // The input audio data is interleaved across the channels, i.e. [L, R, L, R, L, R, ...] and is either 8-bit, 16-bit or float as
        // supported by the SDL API. The output audio wave data for Web Audio API must be in planar buffers of [-1,1]-normalized Float32 data,
        // so perform a buffer conversion for the data.
        var audio = SDL.audio;
        var numChannels = audio.channels;
        for (var c = 0; c < numChannels; ++c) {
          var channelData = dstAudioBuffer['getChannelData'](c);
          if (channelData.length != sizeSamplesPerChannel) {
            throw 'Web Audio output buffer length mismatch! Destination size: ' + channelData.length + ' samples vs expected ' + sizeSamplesPerChannel + ' samples!';
          }
          if (audio.format == 32784) {
            for (var j = 0; j < sizeSamplesPerChannel; ++j) {
              channelData[j] = (HEAP16[(((heapPtr)+((j*numChannels + c)*2))>>1)]) / 0x8000;
            }
          } else if (audio.format == 8) {
            for (var j = 0; j < sizeSamplesPerChannel; ++j) {
              var v = (HEAP8[(heapPtr)+(j*numChannels + c)]);
              channelData[j] = ((v >= 0) ? v-128 : v+128) /128;
            }
          } else if (audio.format == 33056) {
            for (var j = 0; j < sizeSamplesPerChannel; ++j) {
              channelData[j] = (HEAPF32[(((heapPtr)+((j*numChannels + c)*4))>>2)]);
            }
          } else {
            throw 'Invalid SDL audio format ' + audio.format + '!';
          }
        }
      },
  debugSurface(surfData) {
        dbg('dumping surface ' + [surfData.surf, surfData.source, surfData.width, surfData.height]);
        var image = surfData.ctx.getImageData(0, 0, surfData.width, surfData.height);
        var data = image.data;
        var num = Math.min(surfData.width, surfData.height);
        for (var i = 0; i < num; i++) {
          dbg('   diagonal ' + i + ':' + [data[i*surfData.width*4 + i*4 + 0], data[i*surfData.width*4 + i*4 + 1], data[i*surfData.width*4 + i*4 + 2], data[i*surfData.width*4 + i*4 + 3]]);
        }
      },
  joystickEventState:1,
  lastJoystickState:{
  },
  joystickNamePool:{
  },
  recordJoystickState(joystick, state) {
        // Standardize button state.
        var buttons = new Array(state.buttons.length);
        for (var i = 0; i < state.buttons.length; i++) {
          buttons[i] = SDL.getJoystickButtonState(state.buttons[i]);
        }
  
        SDL.lastJoystickState[joystick] = {
          buttons,
          axes: state.axes.slice(0),
          timestamp: state.timestamp,
          index: state.index,
          id: state.id
        };
      },
  getJoystickButtonState(button) {
        if (typeof button == 'object') {
          // Current gamepad API editor's draft (Firefox Nightly)
          // https://dvcs.w3.org/hg/gamepad/raw-file/default/gamepad.html#idl-def-GamepadButton
          return button['pressed'];
        }
        // Current gamepad API working draft (Firefox / Chrome Stable)
        // http://www.w3.org/TR/2012/WD-gamepad-20120529/#gamepad-interface
        return button > 0;
      },
  queryJoysticks() {
        for (var joystick in SDL.lastJoystickState) {
          var state = SDL.getGamepad(joystick - 1);
          var prevState = SDL.lastJoystickState[joystick];
          // If joystick was removed, state returns null.
          if (typeof state == 'undefined') return;
          if (state === null) return;
          // Check only if the timestamp has differed.
          // NOTE: Timestamp is not available in Firefox.
          // NOTE: Timestamp is currently not properly set for the GearVR controller
          //       on Samsung Internet: it is always zero.
          if (typeof state.timestamp != 'number' || state.timestamp != prevState.timestamp || !state.timestamp) {
            var i;
            for (i = 0; i < state.buttons.length; i++) {
              var buttonState = SDL.getJoystickButtonState(state.buttons[i]);
              // NOTE: The previous state already has a boolean representation of
              //       its button, so no need to standardize its button state here.
              if (buttonState !== prevState.buttons[i]) {
                // Insert button-press event.
                SDL.events.push({
                  type: buttonState ? 'joystick_button_down' : 'joystick_button_up',
                  joystick,
                  index: joystick - 1,
                  button: i
                });
              }
            }
            for (i = 0; i < state.axes.length; i++) {
              if (state.axes[i] !== prevState.axes[i]) {
                // Insert axes-change event.
                SDL.events.push({
                  type: 'joystick_axis_motion',
                  joystick,
                  index: joystick - 1,
                  axis: i,
                  value: state.axes[i]
                });
              }
            }
  
            SDL.recordJoystickState(joystick, state);
          }
        }
      },
  joystickAxisValueConversion(value) {
        // Make sure value is properly clamped
        value = Math.min(1, Math.max(value, -1));
        // Ensures that 0 is 0, 1 is 32767, and -1 is 32768.
        return Math.ceil(((value+1) * 32767.5) - 32768);
      },
  getGamepads() {
        var fcn = navigator.getGamepads || navigator.webkitGamepads || navigator.mozGamepads || navigator.gamepads || navigator.webkitGetGamepads;
        if (fcn !== undefined) {
          // The function must be applied on the navigator object.
          return fcn.apply(navigator);
        }
        return [];
      },
  getGamepad(deviceIndex) {
        var gamepads = SDL.getGamepads();
        if (gamepads.length > deviceIndex && deviceIndex >= 0) {
          return gamepads[deviceIndex];
        }
        return null;
      },
  };

  var _SDL_Linked_Version = () => {
      if (SDL.version === null) {
        SDL.version = _malloc(3);
        HEAP8[SDL.version + 0] = 1;
        HEAP8[SDL.version + 1] = 3;
        HEAP8[SDL.version + 2] = 0;
      }
      return SDL.version;
    };

  
  
  /** @param{number} initFlags */
  var _SDL_Init = (initFlags) => {
      SDL.startTime = Date.now();
      SDL.initFlags = initFlags;
  
      // capture all key events. we just keep down and up, but also capture press to prevent default actions
      if (!Module['doNotCaptureKeyboard']) {
        var keyboardListeningElement = Module['keyboardListeningElement'] || document;
        keyboardListeningElement.addEventListener("keydown", SDL.receiveEvent);
        keyboardListeningElement.addEventListener("keyup", SDL.receiveEvent);
        keyboardListeningElement.addEventListener("keypress", SDL.receiveEvent);
        window.addEventListener("focus", SDL.receiveEvent);
        window.addEventListener("blur", SDL.receiveEvent);
        document.addEventListener("visibilitychange", SDL.receiveEvent);
      }
  
      window.addEventListener("unload", SDL.receiveEvent);
      SDL.keyboardState = _malloc(0x10000); // Our SDL needs 512, but 64K is safe for older SDLs
      zeroMemory(SDL.keyboardState, 0x10000);
      // Initialize this structure carefully for closure
      SDL.DOMEventToSDLEvent['keydown']    = 0x300  /* SDL_KEYDOWN */;
      SDL.DOMEventToSDLEvent['keyup']      = 0x301  /* SDL_KEYUP */;
      SDL.DOMEventToSDLEvent['keypress']   = 0x303  /* SDL_TEXTINPUT */;
      SDL.DOMEventToSDLEvent['mousedown']  = 0x401  /* SDL_MOUSEBUTTONDOWN */;
      SDL.DOMEventToSDLEvent['mouseup']    = 0x402  /* SDL_MOUSEBUTTONUP */;
      SDL.DOMEventToSDLEvent['mousemove']  = 0x400  /* SDL_MOUSEMOTION */;
      SDL.DOMEventToSDLEvent['wheel']      = 0x403  /* SDL_MOUSEWHEEL */;
      SDL.DOMEventToSDLEvent['touchstart'] = 0x700  /* SDL_FINGERDOWN */;
      SDL.DOMEventToSDLEvent['touchend']   = 0x701  /* SDL_FINGERUP */;
      SDL.DOMEventToSDLEvent['touchmove']  = 0x702  /* SDL_FINGERMOTION */;
      SDL.DOMEventToSDLEvent['unload']     = 0x100  /* SDL_QUIT */;
      SDL.DOMEventToSDLEvent['resize']     = 0x7001 /* SDL_VIDEORESIZE/SDL_EVENT_COMPAT2 */;
      SDL.DOMEventToSDLEvent['visibilitychange'] = 0x200 /* SDL_WINDOWEVENT */;
      SDL.DOMEventToSDLEvent['focus']      = 0x200 /* SDL_WINDOWEVENT */;
      SDL.DOMEventToSDLEvent['blur']       = 0x200 /* SDL_WINDOWEVENT */;
  
      // These are not technically DOM events; the HTML gamepad API is poll-based.
      // However, we define them here, as the rest of the SDL code assumes that
      // all SDL events originate as DOM events.
      SDL.DOMEventToSDLEvent['joystick_axis_motion'] = 0x600 /* SDL_JOYAXISMOTION */;
      SDL.DOMEventToSDLEvent['joystick_button_down'] = 0x603 /* SDL_JOYBUTTONDOWN */;
      SDL.DOMEventToSDLEvent['joystick_button_up'] = 0x604 /* SDL_JOYBUTTONUP */;
      return 0; // success
    };

  
  var _SDL_WasInit = (flags) => {
      if (SDL.startTime === null) {
        _SDL_Init(0);
      }
      return 1;
    };

  
  var _SDL_GetVideoInfo = () => {
      var ret = _malloc(20);
      zeroMemory(ret, 3);
      HEAP32[(((ret)+(12))>>2)] = Module["canvas"].width;
      HEAP32[(((ret)+(16))>>2)] = Module["canvas"].height;
      return ret;
    };

  var _SDL_ListModes = (format, flags) => -1;

  var _SDL_VideoModeOK = (width, height, depth, flags) => depth;

  
  /** @suppress {duplicate } */
  var _SDL_VideoDriverName = (buf, max_size) => {
      if (SDL.startTime === null) {
        return 0; //return NULL
      }
      //driverName - emscripten_sdl_driver
      var driverName = [101, 109, 115, 99, 114, 105, 112, 116, 101,
        110, 95, 115, 100, 108, 95, 100, 114, 105, 118, 101, 114];
  
      var index = 0;
      var size  = driverName.length;
  
      if (max_size <= size) {
        size = max_size - 1; //-1 cause null-terminator
      }
  
      while (index < size) {
          var value = driverName[index];
          HEAP8[(buf)+(index)] = value;
          index++;
      }
  
      HEAP8[(buf)+(index)] = 0;
      return buf;
    };
  var _SDL_AudioDriverName = _SDL_VideoDriverName;


  
  var _SDL_SetVideoMode = (width, height, depth, flags) => {
      ['touchstart', 'touchend', 'touchmove',
       'mousedown', 'mouseup', 'mousemove',
       'mousewheel', 'wheel', 'mouseout',
       'DOMMouseScroll',
      ].forEach((e) => Module['canvas'].addEventListener(e, SDL.receiveEvent, true));
  
      var canvas = Module['canvas'];
  
      // (0,0) means 'use fullscreen' in native; in Emscripten, use the current canvas size.
      if (width == 0 && height == 0) {
        width = canvas.width;
        height = canvas.height;
      }
  
      if (!SDL.addedResizeListener) {
        SDL.addedResizeListener = true;
        Browser.resizeListeners.push((w, h) => {
          if (!SDL.settingVideoMode) {
            SDL.receiveEvent({
              type: 'resize',
              w,
              h
            });
          }
        });
      }
  
      SDL.settingVideoMode = true; // SetVideoMode itself should not trigger resize events
      Browser.setCanvasSize(width, height);
      SDL.settingVideoMode = false;
  
      // Free the old surface first if there is one
      if (SDL.screen) {
        SDL.freeSurface(SDL.screen);
        assert(!SDL.screen);
      }
  
      if (SDL.GL) flags = flags | 0x04000000; // SDL_OPENGL - if we are using GL, then later calls to SetVideoMode may not mention GL, but we do need it. Once in GL mode, we never leave it.
  
      SDL.screen = SDL.makeSurface(width, height, flags, true, 'screen');
  
      return SDL.screen;
    };

  var _SDL_GetVideoSurface = () => SDL.screen;

  var _SDL_AudioQuit = () => {
      for (var i = 0; i < SDL.numChannels; ++i) {
        var chan = /** @type {{ audio: (HTMLMediaElement|undefined) }} */ (SDL.channels[i]);
        if (chan.audio) {
          chan.audio.pause();
          chan.audio = undefined;
        }
      }
      var audio = /** @type {HTMLMediaElement} */ (SDL.music.audio);
      audio?.pause();
      SDL.music.audio = undefined;
    };

  var _SDL_VideoQuit = () => out('SDL_VideoQuit called (and ignored)');

  var _SDL_QuitSubSystem = (flags) => out('SDL_QuitSubSystem called (and ignored)');

  
  var _SDL_Quit = () => {
      _SDL_AudioQuit();
      out('SDL_Quit called (and ignored)');
    };


  var _SDL_UnlockSurface = (surf) => {
      assert(!SDL.GL); // in GL mode we do not keep around 2D canvases and contexts
  
      var surfData = SDL.surfaces[surf];
  
      if (!surfData.locked || --surfData.locked > 0) {
        return;
      }
  
      // Copy pixel data to image
      if (surfData.isFlagSet(0x00200000 /* SDL_HWPALETTE */)) {
        SDL.copyIndexedColorData(surfData);
      } else if (!surfData.colors) {
        var data = surfData.image.data;
        var buffer = surfData.buffer;
        assert(buffer % 4 == 0, 'Invalid buffer offset: ' + buffer);
        var src = ((buffer)>>2);
        var dst = 0;
        var isScreen = surf == SDL.screen;
        var num;
        if (typeof CanvasPixelArray != 'undefined' && data instanceof CanvasPixelArray) {
          // IE10/IE11: ImageData objects are backed by the deprecated CanvasPixelArray,
          // not UInt8ClampedArray. These don't have buffers, so we need to revert
          // to copying a byte at a time. We do the undefined check because modern
          // browsers do not define CanvasPixelArray anymore.
          num = data.length;
          while (dst < num) {
            var val = HEAP32[src]; // This is optimized. Instead, we could do HEAP32[(((buffer)+(dst))>>2)];
            data[dst  ] = val & 0xff;
            data[dst+1] = (val >> 8) & 0xff;
            data[dst+2] = (val >> 16) & 0xff;
            data[dst+3] = isScreen ? 0xff : ((val >> 24) & 0xff);
            src++;
            dst += 4;
          }
        } else {
          var data32 = new Uint32Array(data.buffer);
          if (isScreen && SDL.defaults.opaqueFrontBuffer) {
            num = data32.length;
            // logically we need to do
            //      while (dst < num) {
            //          data32[dst++] = HEAP32[src++] | 0xff000000
            //      }
            // the following code is faster though, because
            // .set() is almost free - easily 10x faster due to
            // native memcpy efficiencies, and the remaining loop
            // just stores, not load + store, so it is faster
            data32.set(HEAP32.subarray(src, src + num));
            var data8 = new Uint8Array(data.buffer);
            var i = 3;
            var j = i + 4*num;
            if (num % 8 == 0) {
              // unrolling gives big speedups
              while (i < j) {
                data8[i] = 0xff;
                i = i + 4 | 0;
                data8[i] = 0xff;
                i = i + 4 | 0;
                data8[i] = 0xff;
                i = i + 4 | 0;
                data8[i] = 0xff;
                i = i + 4 | 0;
                data8[i] = 0xff;
                i = i + 4 | 0;
                data8[i] = 0xff;
                i = i + 4 | 0;
                data8[i] = 0xff;
                i = i + 4 | 0;
                data8[i] = 0xff;
                i = i + 4 | 0;
              }
             } else {
              while (i < j) {
                data8[i] = 0xff;
                i = i + 4 | 0;
              }
            }
          } else {
            data32.set(HEAP32.subarray(src, src + data32.length));
          }
        }
      } else {
        var width = Module['canvas'].width;
        var height = Module['canvas'].height;
        var s = surfData.buffer;
        var data = surfData.image.data;
        var colors = surfData.colors; // TODO: optimize using colors32
        for (var y = 0; y < height; y++) {
          var base = y*width*4;
          for (var x = 0; x < width; x++) {
            // See comment above about signs
            var val = HEAPU8[s++] * 4;
            var start = base + x*4;
            data[start]   = colors[val];
            data[start+1] = colors[val+1];
            data[start+2] = colors[val+2];
          }
          s += width*3;
        }
      }
      // Copy to canvas
      surfData.ctx.putImageData(surfData.image, 0, 0);
      // Note that we save the image, so future writes are fast. But, memory is not yet released
    };

  var _SDL_Flip = (surf) => {
      // We actually do this in Unlock, since the screen surface has as its canvas
      // backing the page canvas element
    };

  var _SDL_UpdateRect = (surf, x, y, w, h) => {
      // We actually do the whole screen in Unlock...
    };

  var _SDL_UpdateRects = (surf, numrects, rects) => {
      // We actually do the whole screen in Unlock...
    };

  
  var _SDL_Delay = (delay) => _emscripten_sleep(delay);
  _SDL_Delay.isAsync = true;

  
  
  var _SDL_WM_SetCaption = (title, icon) => {
      if (title) {
        _emscripten_set_window_title(title);
      }
      icon &&= UTF8ToString(icon);
    };

  var _SDL_EnableKeyRepeat = (delay, interval) => {};

  /** @param {number} numKeys */
  var _SDL_GetKeyboardState = (numKeys) => {
      if (numKeys) {
        HEAP32[((numKeys)>>2)] = 65536;
      }
      return SDL.keyboardState;
    };

  
  var _SDL_GetKeyState = () => _SDL_GetKeyboardState(0);

  
  var _SDL_GetKeyName = (key) => {
      SDL.keyName ||= stringToNewUTF8('unknown key');
      return SDL.keyName;
    };

  var _SDL_GetModState = () => SDL.modState;

  var _SDL_GetMouseState = (x, y) => {
      if (x) HEAP32[((x)>>2)] = Browser.mouseX;
      if (y) HEAP32[((y)>>2)] = Browser.mouseY;
      return SDL.buttonState;
    };

  var _SDL_WarpMouse = (x, y) => {
      return; // TODO: implement this in a non-buggy way. Need to keep relative mouse movements correct after calling this
      /*
      var rect = Module["canvas"].getBoundingClientRect();
      SDL.events.push({
        type: 'mousemove',
        pageX: x + (window.scrollX + rect.left),
        pageY: y + (window.scrollY + rect.top)
      });
      */
    };

  var _SDL_ShowCursor = (toggle) => {
      switch (toggle) {
        case 0: // SDL_DISABLE
          if (Browser.isFullscreen) { // only try to lock the pointer when in full screen mode
            Module['canvas'].requestPointerLock();
            return 0;
          }
          // else return SDL_ENABLE to indicate the failure
          return 1;
        case 1: // SDL_ENABLE
          Module['canvas'].exitPointerLock();
          return 1;
        case -1: // SDL_QUERY
          return !Browser.pointerLock;
        default:
          err(`SDL_ShowCursor called with unknown toggle parameter value: ${toggle}`);
          break;
      }
    };

  
  var _SDL_GetError = () => {
      SDL.errorMessage ||= stringToNewUTF8("unknown SDL-emscripten error");
      return SDL.errorMessage;
    };

  var _SDL_SetError = (fmt, varargs) => {};

  var _SDL_CreateRGBSurface = (flags, width, height, depth, rmask, gmask, bmask, amask) => SDL.makeSurface(width, height, flags, false, 'CreateRGBSurface', rmask, gmask, bmask, amask);

  var _SDL_CreateRGBSurfaceFrom = (pixels, width, height, depth, pitch, rmask, gmask, bmask, amask) => {
      var surf = SDL.makeSurface(width, height, 0, false, 'CreateRGBSurfaceFrom', rmask, gmask, bmask, amask);
  
      if (depth !== 32) {
        // TODO: Actually fill pixel data to created surface.
        // TODO: Take into account depth and pitch parameters.
        err('TODO: Partially unimplemented SDL_CreateRGBSurfaceFrom called!');
        return surf;
      }
  
      var data = SDL.surfaces[surf];
      var image = data.ctx.createImageData(width, height);
      var pitchOfDst = width * 4;
  
      for (var row = 0; row < height; ++row) {
        var baseOfSrc = row * pitch;
        var baseOfDst = row * pitchOfDst;
  
        for (var col = 0; col < width * 4; ++col) {
          image.data[baseOfDst + col] = HEAPU8[(pixels)+(baseOfDst + col)];
        }
      }
  
      data.ctx.putImageData(image, 0, 0);
  
      return surf;
    };

  /** @param {number} format @param {number} flags */
  var _SDL_ConvertSurface = (surf, format, flags) => {
      if  (format) {
        SDL.checkPixelFormat(format);
      }
  
      var oldData = SDL.surfaces[surf];
      var ret = SDL.makeSurface(oldData.width, oldData.height, oldData.flags, false, 'copy:' + oldData.source);
      var newData = SDL.surfaces[ret];
  
      newData.ctx.globalCompositeOperation = "copy";
      newData.ctx.drawImage(oldData.canvas, 0, 0);
      newData.ctx.globalCompositeOperation = oldData.ctx.globalCompositeOperation;
      return ret;
    };

  
  var _SDL_DisplayFormatAlpha = (surf) => _SDL_ConvertSurface(surf, 0, 0);

  var _SDL_FreeSurface = (surf) => {
      if (surf) SDL.freeSurface(surf);
    };

  var _SDL_UpperBlit = (src, srcrect, dst, dstrect) =>
      SDL.blitSurface(src, srcrect, dst, dstrect, false);

  var _SDL_UpperBlitScaled = (src, srcrect, dst, dstrect) =>
      SDL.blitSurface(src, srcrect, dst, dstrect, true);

  
  var _SDL_LowerBlit = _SDL_UpperBlit;

  
  var _SDL_LowerBlitScaled = _SDL_UpperBlitScaled;

  var _SDL_GetClipRect = (surf, rect) => {
      assert(rect);
  
      var surfData = SDL.surfaces[surf];
      var r = surfData.clipRect || { x: 0, y: 0, w: surfData.width, h: surfData.height };
      SDL.updateRect(rect, r);
    };

  var _SDL_SetClipRect = (surf, rect) => {
      var surfData = SDL.surfaces[surf];
  
      if (rect) {
        surfData.clipRect = SDL.intersectionOfRects({ x: 0, y: 0, w: surfData.width, h: surfData.height }, SDL.loadRect(rect));
      } else {
        delete surfData.clipRect;
      }
    };

  var _SDL_FillRect = (surf, rect, color) => {
      var surfData = SDL.surfaces[surf];
      assert(!surfData.locked); // but we could unlock and re-lock if we must..
  
      if (surfData.isFlagSet(0x00200000 /* SDL_HWPALETTE */)) {
        //in SDL_HWPALETTE color is index (0..255)
        //so we should translate 1 byte value to
        //32 bit canvas
        color = surfData.colors32[color];
      }
  
      var r = rect ? SDL.loadRect(rect) : { x: 0, y: 0, w: surfData.width, h: surfData.height };
  
      if (surfData.clipRect) {
        r = SDL.intersectionOfRects(surfData.clipRect, r);
  
        if (rect) {
          SDL.updateRect(rect, r);
        }
      }
  
      surfData.ctx.save();
      surfData.ctx.fillStyle = SDL.translateColorToCSSRGBA(color);
      surfData.ctx.fillRect(r.x, r.y, r.w, r.h);
      surfData.ctx.restore();
      return 0;
    };

  var _zoomSurface = (src, x, y, smooth) => {
      var srcData = SDL.surfaces[src];
      var w = srcData.width * x;
      var h = srcData.height * y;
      var ret = SDL.makeSurface(Math.abs(w), Math.abs(h), srcData.flags, false, 'zoomSurface');
      var dstData = SDL.surfaces[ret];
      if (x >= 0 && y >= 0) dstData.ctx.drawImage(srcData.canvas, 0, 0, w, h);
      else {
        dstData.ctx.save();
        dstData.ctx.scale(x < 0 ? -1 : 1, y < 0 ? -1 : 1);
        dstData.ctx.drawImage(srcData.canvas, w < 0 ? w : 0, h < 0 ? h : 0, Math.abs(w), Math.abs(h));
        // XXX I think this should work according to the spec, but currently
        // fails on FF: dstData.ctx.drawImage(srcData.canvas, 0, 0, w, h);
        dstData.ctx.restore();
      }
      return ret;
    };

  
  var _rotozoomSurface = (src, angle, zoom, smooth) => {
      if (angle % 360 === 0) {
        return _zoomSurface(src, zoom, zoom, smooth);
      }
      var srcData = SDL.surfaces[src];
      var w = srcData.width * zoom;
      var h = srcData.height * zoom;
      var diagonal = Math.ceil(Math.sqrt(Math.pow(w, 2) + Math.pow(h, 2)));
      var ret = SDL.makeSurface(diagonal, diagonal, srcData.flags, false, 'rotozoomSurface');
      var dstData = SDL.surfaces[ret];
      dstData.ctx.translate(diagonal / 2, diagonal / 2);
      dstData.ctx.rotate(-angle * Math.PI / 180);
      dstData.ctx.drawImage(srcData.canvas, -w / 2, -h / 2, w, h);
      return ret;
    };

  var _SDL_SetAlpha = (surf, flag, alpha) => {
      var surfData = SDL.surfaces[surf];
      surfData.alpha = alpha;
  
      if (!(flag & 0x00010000)) { // !SDL_SRCALPHA
        surfData.alpha = 255;
      }
    };

  var _SDL_SetColorKey = (surf, flag, key) => {
      // SetColorKey assigns one color to be rendered as transparent. I don't
      // think the canvas API allows for anything like this, and iterating through
      // each pixel to replace that color seems prohibitively expensive.
      warnOnce('SDL_SetColorKey is a no-op for performance reasons');
      return 0;
    };


  var _SDL_PollEvent = (ptr) => SDL.pollEvent(ptr);

  var _SDL_PushEvent = (ptr) => {
      var copy = _malloc(28);
      _memcpy(copy, ptr, 28);
      SDL.events.push(copy);
      return 0;
    };

  var _SDL_PeepEvents = (events, requestedEventCount, action, from, to) => {
      switch (action) {
        case 2: { // SDL_GETEVENT
          // We only handle 1 event right now
          assert(requestedEventCount == 1);
  
          var index = 0;
          var retrievedEventCount = 0;
          // this should look through the entire queue until it has filled up the events
          // array
          while (index < SDL.events.length && retrievedEventCount < requestedEventCount) {
            var event = SDL.events[index];
            var type = SDL.DOMEventToSDLEvent[event.type];
            if (from <= type && type <= to) {
              if (SDL.makeCEvent(event, events) === false) {
                index++;
              } else {
                SDL.events.splice(index, 1);
                retrievedEventCount++;
              }
            } else {
              index++;
            }
          }
          return retrievedEventCount;
        }
        default: throw 'SDL_PeepEvents does not yet support that action: ' + action;
      }
    };

  var _SDL_PumpEvents = () => SDL.events.forEach(SDL.handleEvent);

  var _emscripten_SDL_SetEventHandler = (handler, userdata) => {
      SDL.eventHandler = handler;
      SDL.eventHandlerContext = userdata;
  
      // All SDLEvents take the same amount of memory
      if (!SDL.eventHandlerTemp) SDL.eventHandlerTemp = _malloc(28);
    };

  var _SDL_SetColors = (surf, colors, firstColor, nColors) => {
      var surfData = SDL.surfaces[surf];
  
      // we should create colors array
      // only once cause client code
      // often wants to change portion
      // of palette not all palette.
      if (!surfData.colors) {
        var buffer = new ArrayBuffer(256 * 4); // RGBA, A is unused, but faster this way
        surfData.colors = new Uint8Array(buffer);
        surfData.colors32 = new Uint32Array(buffer);
      }
  
      for (var i = 0; i < nColors; ++i) {
        var index = (firstColor + i) * 4;
        surfData.colors[index] = HEAPU8[(colors)+(i*4)];
        surfData.colors[index + 1] = HEAPU8[(colors)+(i*4 + 1)];
        surfData.colors[index + 2] = HEAPU8[(colors)+(i*4 + 2)];
        surfData.colors[index + 3] = 255; // opaque
      }
  
      return 1;
    };

  
  var _SDL_SetPalette = (surf, flags, colors, firstColor, nColors) =>
      _SDL_SetColors(surf, colors, firstColor, nColors);

  var _SDL_MapRGB = (fmt, r, g, b) => {
      SDL.checkPixelFormat(fmt);
      // We assume the machine is little-endian.
      return r&0xff|(g&0xff)<<8|(b&0xff)<<16|0xff000000;
    };

  var _SDL_MapRGBA = (fmt, r, g, b, a) => {
      SDL.checkPixelFormat(fmt);
      // We assume the machine is little-endian.
      return r&0xff|(g&0xff)<<8|(b&0xff)<<16|(a&0xff)<<24;
    };

  var _SDL_GetRGB = (pixel, fmt, r, g, b) => {
      SDL.checkPixelFormat(fmt);
      // We assume the machine is little-endian.
      if (r) {
        HEAP8[r] = pixel&0xff;
      }
      if (g) {
        HEAP8[g] = (pixel>>8)&0xff;
      }
      if (b) {
        HEAP8[b] = (pixel>>16)&0xff;
      }
    };

  var _SDL_GetRGBA = (pixel, fmt, r, g, b, a) => {
      SDL.checkPixelFormat(fmt);
      // We assume the machine is little-endian.
      if (r) {
        HEAP8[r] = pixel&0xff;
      }
      if (g) {
        HEAP8[g] = (pixel>>8)&0xff;
      }
      if (b) {
        HEAP8[b] = (pixel>>16)&0xff;
      }
      if (a) {
        HEAP8[a] = (pixel>>24)&0xff;
      }
    };

  var _SDL_GetAppState = () => {
      var state = 0;
  
      if (Browser.pointerLock) {
        state |= 0x01;  // SDL_APPMOUSEFOCUS
      }
      if (document.hasFocus()) {
        state |= 0x02;  // SDL_APPINPUTFOCUS
      }
      state |= 0x04;  // SDL_APPACTIVE
  
      return state;
    };

  var _SDL_WM_GrabInput = () => {};

  var _SDL_WM_ToggleFullScreen = (surf) => {
      if (Browser.exitFullscreen()) {
        return 1;
      }
      if (!SDL.canRequestFullscreen) {
        return 0;
      }
      SDL.isRequestingFullscreen = true;
      return 1;
    };

  var _IMG_Init = (flags) => flags;

  
  var _SDL_FreeRW = (rwopsID) => {
      SDL.rwops[rwopsID] = null;
      while (SDL.rwops.length > 0 && SDL.rwops[SDL.rwops.length-1] === null) {
        SDL.rwops.pop();
      }
    };
  
  
  
  
  
  
  var _IMG_Load_RW = (rwopsID, freeSrc) => {
      var sp = stackSave();
      try {
        // stb_image integration support
        var cleanup = () => {
          stackRestore(sp);
          if (rwops && freeSrc) _SDL_FreeRW(rwopsID);
        }
        var addCleanup = (func) => {
          var old = cleanup;
          cleanup = () => {
            old();
            func();
          }
        }
        var callStbImage = (func, params) => {
          var x = stackAlloc(4);
          var y = stackAlloc(4);
          var comp = stackAlloc(4);
          var data = Module['_' + func](...params, x, y, comp, 0);
          if (!data) return null;
          addCleanup(() => Module['_stbi_image_free'](data));
          return {
            rawData: true,
            data,
            width: HEAP32[((x)>>2)],
            height: HEAP32[((y)>>2)],
            size: HEAP32[((x)>>2)] * HEAP32[((y)>>2)] * HEAP32[((comp)>>2)],
            bpp: HEAP32[((comp)>>2)]
          };
        };
  
        var rwops = SDL.rwops[rwopsID];
        if (rwops === undefined) {
          return 0;
        }
  
        var raw;
        var filename = rwops.filename;
        if (filename === undefined) {
          warnOnce('Only file names that have been preloaded are supported for IMG_Load_RW. Consider using STB_IMAGE=1 if you want synchronous image decoding (see settings.js), or package files with --use-preload-plugins');
          return 0;
        }
  
        if (!raw) {
          filename = PATH_FS.resolve(filename);
          raw = preloadedImages[filename];
          if (!raw) {
            if (raw === null) err('Trying to reuse preloaded image, but freePreloadedMediaOnUse is set!');
            warnOnce('Cannot find preloaded image ' + filename);
            warnOnce('Cannot find preloaded image ' + filename + '. Consider using STB_IMAGE=1 if you want synchronous image decoding (see settings.js), or package files with --use-preload-plugins');
            return 0;
          } else if (Module['freePreloadedMediaOnUse']) {
            preloadedImages[filename] = null;
          }
        }
  
        var surf = SDL.makeSurface(raw.width, raw.height, 0, false, 'load:' + filename);
        var surfData = SDL.surfaces[surf];
        surfData.ctx.globalCompositeOperation = "copy";
        if (!raw.rawData) {
          surfData.ctx.drawImage(raw, 0, 0, raw.width, raw.height, 0, 0, raw.width, raw.height);
        } else {
          var imageData = surfData.ctx.getImageData(0, 0, surfData.width, surfData.height);
          if (raw.bpp == 4) {
            // rgba
            imageData.data.set(HEAPU8.subarray((raw.data), raw.data+raw.size));
          } else if (raw.bpp == 3) {
            // rgb
            var pixels = raw.size/3;
            var data = imageData.data;
            var sourcePtr = raw.data;
            var destPtr = 0;
            for (var i = 0; i < pixels; i++) {
              data[destPtr++] = HEAPU8[sourcePtr++];
              data[destPtr++] = HEAPU8[sourcePtr++];
              data[destPtr++] = HEAPU8[sourcePtr++];
              data[destPtr++] = 255;
            }
          } else if (raw.bpp == 2) {
            // grayscale + alpha
            var pixels = raw.size;
            var data = imageData.data;
            var sourcePtr = raw.data;
            var destPtr = 0;
            for (var i = 0; i < pixels; i++) {
              var gray = HEAPU8[sourcePtr++];
              var alpha = HEAPU8[sourcePtr++];
              data[destPtr++] = gray;
              data[destPtr++] = gray;
              data[destPtr++] = gray;
              data[destPtr++] = alpha;
            }
          } else if (raw.bpp == 1) {
            // grayscale
            var pixels = raw.size;
            var data = imageData.data;
            var sourcePtr = raw.data;
            var destPtr = 0;
            for (var i = 0; i < pixels; i++) {
              var value = HEAPU8[sourcePtr++];
              data[destPtr++] = value;
              data[destPtr++] = value;
              data[destPtr++] = value;
              data[destPtr++] = 255;
            }
          } else {
            err(`cannot handle bpp ${raw.bpp}`);
            return 0;
          }
          surfData.ctx.putImageData(imageData, 0, 0);
        }
        surfData.ctx.globalCompositeOperation = "source-over";
        // XXX SDL does not specify that loaded images must have available pixel data, in fact
        //     there are cases where you just want to blit them, so you just need the hardware
        //     accelerated version. However, code everywhere seems to assume that the pixels
        //     are in fact available, so we retrieve it here. This does add overhead though.
        _SDL_LockSurface(surf);
        surfData.locked--; // The surface is not actually locked in this hack
        if (SDL.GL) {
          // After getting the pixel data, we can free the canvas and context if we do not need to do 2D canvas blitting
          surfData.canvas = surfData.ctx = null;
        }
        return surf;
      } finally {
        cleanup();
      }
    };

  
  var _SDL_LoadBMP_RW = _IMG_Load_RW;

  
  
  /** @param {number} mode */
  var _SDL_RWFromFile = (_name, mode) => {
      var id = SDL.rwops.length; // TODO: recycle ids when they are null
      var filename = UTF8ToString(_name);
      SDL.rwops.push({ filename, mimetype: Browser.getMimetype(filename) });
      return id;
    };
  
  var _IMG_Load = (filename) => {
      var rwops = _SDL_RWFromFile(filename, 0);
      var result = _IMG_Load_RW(rwops, 1);
      return result;
    };

  var _IMG_Quit = () => out('IMG_Quit called (and ignored)');

  
  
  var _SDL_OpenAudio = (desired, obtained) => {
      try {
        SDL.audio = {
          freq: HEAPU32[((desired)>>2)],
          format: HEAPU16[(((desired)+(4))>>1)],
          channels: HEAPU8[(desired)+(6)],
          samples: HEAPU16[(((desired)+(8))>>1)], // Samples in the CB buffer per single sound channel.
          callback: HEAPU32[(((desired)+(16))>>2)],
          userdata: HEAPU32[(((desired)+(20))>>2)],
          paused: true,
          timer: null
        };
        // The .silence field tells the constant sample value that corresponds to the safe un-skewed silence value for the wave data.
        if (SDL.audio.format == 8) {
          SDL.audio.silence = 128; // Audio ranges in [0, 255], so silence is half-way in between.
        } else if (SDL.audio.format == 32784) {
          SDL.audio.silence = 0; // Signed data in range [-32768, 32767], silence is 0.
        } else if (SDL.audio.format == 33056) {
          SDL.audio.silence = 0.0; // Float data in range [-1.0, 1.0], silence is 0.0
        } else {
          throw 'Invalid SDL audio format ' + SDL.audio.format + '!';
        }
        // Round the desired audio frequency up to the next 'common' frequency value.
        // Web Audio API spec states 'An implementation must support sample-rates in at least the range 22050 to 96000.'
        if (SDL.audio.freq <= 0) {
          throw 'Unsupported sound frequency ' + SDL.audio.freq + '!';
        } else if (SDL.audio.freq <= 22050) {
          SDL.audio.freq = 22050; // Take it safe and clamp everything lower than 22kHz to that.
        } else if (SDL.audio.freq <= 32000) {
          SDL.audio.freq = 32000;
        } else if (SDL.audio.freq <= 44100) {
          SDL.audio.freq = 44100;
        } else if (SDL.audio.freq <= 48000) {
          SDL.audio.freq = 48000;
        } else if (SDL.audio.freq <= 96000) {
          SDL.audio.freq = 96000;
        } else {
          throw `Unsupported sound frequency ${SDL.audio.freq}!`;
        }
        if (SDL.audio.channels == 0) {
          SDL.audio.channels = 1; // In SDL both 0 and 1 mean mono.
        } else if (SDL.audio.channels < 0 || SDL.audio.channels > 32) {
          throw `Unsupported number of audio channels for SDL audio: ${SDL.audio.channels}!`;
        } else if (SDL.audio.channels != 1 && SDL.audio.channels != 2) { // Unsure what SDL audio spec supports. Web Audio spec supports up to 32 channels.
          out(`Warning: Using untested number of audio channels ${SDL.audio.channels}`);
        }
        if (SDL.audio.samples < 128 || SDL.audio.samples > 524288 /* arbitrary cap */) {
          throw `Unsupported audio callback buffer size ${SDL.audio.samples}!`;
        } else if ((SDL.audio.samples & (SDL.audio.samples-1)) != 0) {
          throw `Audio callback buffer size ${SDL.audio.samples} must be a power-of-two!`;
        }
  
        var totalSamples = SDL.audio.samples*SDL.audio.channels;
        if (SDL.audio.format == 8) {
          SDL.audio.bytesPerSample = 1;
        } else if (SDL.audio.format == 32784) {
          SDL.audio.bytesPerSample = 2;
        } else if (SDL.audio.format == 33056) {
          SDL.audio.bytesPerSample = 4;
        } else {
          throw `Invalid SDL audio format ${SDL.audio.format}!`;
        }
        SDL.audio.bufferSize = totalSamples*SDL.audio.bytesPerSample;
        // Duration of a single queued buffer in seconds.
        SDL.audio.bufferDurationSecs = SDL.audio.bufferSize / SDL.audio.bytesPerSample / SDL.audio.channels / SDL.audio.freq;
        // Audio samples are played with a constant delay of this many seconds to account for browser and jitter.
        SDL.audio.bufferingDelay = 50 / 1000;
        SDL.audio.buffer = _malloc(SDL.audio.bufferSize);
  
        // To account for jittering in frametimes, always have multiple audio
        // buffers queued up for the audio output device.
        // This helps that we won't starve that easily if a frame takes long to complete.
        SDL.audio.numSimultaneouslyQueuedBuffers = Module['SDL_numSimultaneouslyQueuedBuffers'] || 5;
  
        // Pulls and queues new audio data if appropriate. This function gets
        // "over-called" in both requestAnimationFrames and setTimeouts to ensure
        // that we get the finest granularity possible and as many chances from
        // the browser to fill new audio data. This is because setTimeouts alone
        // have very poor granularity for audio streaming purposes, but also the
        // application might not be using emscripten_set_main_loop to drive the
        // main loop, so we cannot rely on that alone.
        SDL.audio.queueNewAudioData = () => {
          if (!SDL.audio) return;
  
          for (var i = 0; i < SDL.audio.numSimultaneouslyQueuedBuffers; ++i) {
            // Only queue new data if we don't have enough audio data already in queue. Otherwise skip this time slot
            // and wait to queue more in the next time the callback is run.
            var secsUntilNextPlayStart = SDL.audio.nextPlayTime - SDL.audioContext['currentTime'];
            if (secsUntilNextPlayStart >= SDL.audio.bufferingDelay + SDL.audio.bufferDurationSecs*SDL.audio.numSimultaneouslyQueuedBuffers) return;
  
            // Ask SDL audio data from the user code.
            ((a1, a2, a3) => { throw 'Internal Error! Attempted to invoke wasm function pointer with signature "viii", but no such functions have gotten exported!' })(SDL.audio.userdata, SDL.audio.buffer, SDL.audio.bufferSize);
            // And queue it to be played after the currently playing audio stream.
            SDL.audio.pushAudio(SDL.audio.buffer, SDL.audio.bufferSize);
          }
        }
  
        var sleepCallback = () => {
          SDL.audio?.queueNewAudioData?.();
        };
        Asyncify.sleepCallbacks.push(sleepCallback);
        SDL.audio.callbackRemover = () => {
          Asyncify.sleepCallbacks = Asyncify.sleepCallbacks.filter((callback) => callback !== sleepCallback);
        }
  
        // Create a callback function that will be routinely called to ask more audio data from the user application.
        SDL.audio.caller = () => {
          if (!SDL.audio) return;
  
          --SDL.audio.numAudioTimersPending;
  
          SDL.audio.queueNewAudioData();
  
          // Queue this callback function to be called again later to pull more audio data.
          var secsUntilNextPlayStart = SDL.audio.nextPlayTime - SDL.audioContext['currentTime'];
  
          // Queue the next audio frame push to be performed half-way when the previously queued buffer has finished playing.
          var preemptBufferFeedSecs = SDL.audio.bufferDurationSecs/2.0;
  
          if (SDL.audio.numAudioTimersPending < SDL.audio.numSimultaneouslyQueuedBuffers) {
            ++SDL.audio.numAudioTimersPending;
            SDL.audio.timer = safeSetTimeout(SDL.audio.caller, Math.max(0.0, 1000.0*(secsUntilNextPlayStart-preemptBufferFeedSecs)));
  
            // If we are risking starving, immediately queue an extra buffer.
            if (SDL.audio.numAudioTimersPending < SDL.audio.numSimultaneouslyQueuedBuffers) {
              ++SDL.audio.numAudioTimersPending;
              safeSetTimeout(SDL.audio.caller, 1.0);
            }
          }
        };
  
        SDL.audio.audioOutput = new Audio();
  
        // Initialize Web Audio API if we haven't done so yet. Note: Only initialize Web Audio context ever once on the web page,
        // since initializing multiple times fails on Chrome saying 'audio resources have been exhausted'.
        SDL.openAudioContext();
        if (!SDL.audioContext) throw 'Web Audio API is not available!';
        autoResumeAudioContext(SDL.audioContext);
        SDL.audio.nextPlayTime = 0; // Time in seconds when the next audio block is due to start.
  
        // The pushAudio function with a new audio buffer whenever there is new
        // audio data to schedule to be played back on the device.
        SDL.audio.pushAudio = (ptr, sizeBytes) => {
          try {
            if (SDL.audio.paused) return;
  
            var sizeSamples = sizeBytes / SDL.audio.bytesPerSample; // How many samples fit in the callback buffer?
            var sizeSamplesPerChannel = sizeSamples / SDL.audio.channels; // How many samples per a single channel fit in the cb buffer?
            if (sizeSamplesPerChannel != SDL.audio.samples) {
              throw 'Received mismatching audio buffer size!';
            }
            // Allocate new sound buffer to be played.
            var source = SDL.audioContext['createBufferSource']();
            var soundBuffer = SDL.audioContext['createBuffer'](SDL.audio.channels,sizeSamplesPerChannel,SDL.audio.freq);
            source['connect'](SDL.audioContext['destination']);
  
            SDL.fillWebAudioBufferFromHeap(ptr, sizeSamplesPerChannel, soundBuffer);
            // Workaround https://bugzilla.mozilla.org/show_bug.cgi?id=883675 by setting the buffer only after filling. The order is important here!
            source['buffer'] = soundBuffer;
  
            // Schedule the generated sample buffer to be played out at the correct time right after the previously scheduled
            // sample buffer has finished.
            var curtime = SDL.audioContext['currentTime'];
            if (curtime > SDL.audio.nextPlayTime && SDL.audio.nextPlayTime != 0) {
              err(`warning: Audio callback had starved sending audio by ${curtime - SDL.audio.nextPlayTime} seconds`);
            }
            // Don't ever start buffer playbacks earlier from current time than a given constant 'SDL.audio.bufferingDelay', since a browser
            // may not be able to mix that audio clip in immediately, and there may be subsequent jitter that might cause the stream to starve.
            var playtime = Math.max(curtime + SDL.audio.bufferingDelay, SDL.audio.nextPlayTime);
            if (typeof source['start'] != 'undefined') {
              source['start'](playtime); // New Web Audio API: sound sources are started with a .start() call.
            } else if (typeof source['noteOn'] != 'undefined') {
              source['noteOn'](playtime); // Support old Web Audio API specification which had the .noteOn() API.
            }
            /*
            // Uncomment to debug SDL buffer feed starves.
            if (SDL.audio.curBufferEnd) {
              var thisBufferStart = Math.round(playtime * SDL.audio.freq);
              if (thisBufferStart != SDL.audio.curBufferEnd) out('SDL starved ' + (thisBufferStart - SDL.audio.curBufferEnd) + ' samples!');
            }
            SDL.audio.curBufferEnd = Math.round(playtime * SDL.audio.freq + sizeSamplesPerChannel);
            */
  
            SDL.audio.nextPlayTime = playtime + SDL.audio.bufferDurationSecs;
          } catch(e) {
            err(`Web Audio API error playing back audio: ${e.toString()}`);
          }
        }
  
        if (obtained) {
          // Report back the initialized audio parameters.
          HEAP32[((obtained)>>2)] = SDL.audio.freq;
          HEAP16[(((obtained)+(4))>>1)] = SDL.audio.format;
          HEAP8[(obtained)+(6)] = SDL.audio.channels;
          HEAP8[(obtained)+(7)] = SDL.audio.silence;
          HEAP16[(((obtained)+(8))>>1)] = SDL.audio.samples;
          HEAPU32[(((obtained)+(16))>>2)] = SDL.audio.callback;
          HEAPU32[(((obtained)+(20))>>2)] = SDL.audio.userdata;
        }
        SDL.allocateChannels(32);
  
      } catch(e) {
        err(`Initializing SDL audio threw an exception: "${e.toString()}"! Continuing without audio`);
        SDL.audio = null;
        SDL.allocateChannels(0);
        if (obtained) {
          HEAP32[((obtained)>>2)] = 0;
          HEAP16[(((obtained)+(4))>>1)] = 0;
          HEAP8[(obtained)+(6)] = 0;
          HEAP8[(obtained)+(7)] = 0;
          HEAP16[(((obtained)+(8))>>1)] = 0;
          HEAPU32[(((obtained)+(16))>>2)] = 0;
          HEAPU32[(((obtained)+(20))>>2)] = 0;
        }
      }
      if (!SDL.audio) {
        return -1;
      }
      return 0;
    };

  
  var _SDL_PauseAudio = (pauseOn) => {
      if (!SDL.audio) {
        return;
      }
      if (pauseOn) {
        if (SDL.audio.timer !== undefined) {
          clearTimeout(SDL.audio.timer);
          SDL.audio.numAudioTimersPending = 0;
          SDL.audio.timer = undefined;
        }
      } else if (!SDL.audio.timer) {
        // Start the audio playback timer callback loop.
        SDL.audio.numAudioTimersPending = 1;
        SDL.audio.timer = safeSetTimeout(SDL.audio.caller, 1);
      }
      SDL.audio.paused = pauseOn;
    };

  
  var _SDL_CloseAudio = () => {
      if (SDL.audio) {
        if (SDL.audio.callbackRemover) {
          SDL.audio.callbackRemover();
          SDL.audio.callbackRemover = null;
        }
        _SDL_PauseAudio(1);
        _free(SDL.audio.buffer);
        SDL.audio = null;
        SDL.allocateChannels(0);
      }
    };

  var _SDL_LockAudio = () => {};

  var _SDL_UnlockAudio = () => {};

  var _SDL_CreateMutex = () => 0;

  var _SDL_mutexP = (mutex) => 0;

  var _SDL_mutexV = (mutex) => 0;

  var _SDL_DestroyMutex = (mutex) => {};

  var _SDL_CreateCond = () => 0;

  var _SDL_CondSignal = (cond) => {};

  var _SDL_CondWait = (cond, mutex) => {};

  var _SDL_DestroyCond = (cond) => {};

  var _SDL_StartTextInput = () => {
      SDL.textInput = true;
    };

  var _SDL_StopTextInput = () => {
      SDL.textInput = false;
    };

  var _Mix_Init = (flags) => {
      if (!flags) return 0;
      return 8; /* MIX_INIT_OGG */
    };

  var _Mix_Quit = () => {};

  
  var _Mix_OpenAudio = (frequency, format, channels, chunksize) => {
      SDL.openAudioContext();
      autoResumeAudioContext(SDL.audioContext);
      SDL.allocateChannels(32);
      // Just record the values for a later call to Mix_QuickLoad_RAW
      SDL.mixerFrequency = frequency;
      SDL.mixerFormat = format;
      SDL.mixerNumChannels = channels;
      SDL.mixerChunkSize = chunksize;
      return 0;
    };

  
  var _Mix_CloseAudio = _SDL_CloseAudio;

  var _Mix_AllocateChannels = (num) => {
      SDL.allocateChannels(num);
      return num;
    };

  var _Mix_ChannelFinished = (func) => {
      SDL.channelFinished = func;
    };

  var _Mix_Volume = (channel, volume) => {
      if (channel == -1) {
        for (var i = 0; i < SDL.numChannels-1; i++) {
          _Mix_Volume(i, volume);
        }
        return _Mix_Volume(SDL.numChannels-1, volume);
      }
      return SDL.setGetVolume(SDL.channels[channel], volume);
    };

  var _Mix_SetPanning = (channel, left, right) => {
      // SDL API uses [0-255], while PannerNode has an (x, y, z) position.
  
      // Normalizing.
      left /= 255;
      right /= 255;
  
      // Set the z coordinate a little forward, otherwise there won't be any
      // smooth transition between left and right.
      SDL.setPannerPosition(SDL.channels[channel], right - left, 0, 0.1);
      return 1;
    };

  
  
  
  /** @param {number} freesrc */
  var _Mix_LoadWAV_RW = (rwopsID, freesrc) => {
      var rwops = SDL.rwops[rwopsID];
  
      if (rwops === undefined)
        return 0;
  
      var filename = '';
      var audio;
      var webAudio;
      var bytes;
  
      if (rwops.filename !== undefined) {
        filename = PATH_FS.resolve(rwops.filename);
        var raw = preloadedAudios[filename];
        if (!raw) {
          if (raw === null) err('Trying to reuse preloaded audio, but freePreloadedMediaOnUse is set!');
          if (!Module.noAudioDecoding) warnOnce('Cannot find preloaded audio ' + filename);
  
          // see if we can read the file-contents from the in-memory FS
          try {
            bytes = FS.readFile(filename);
          } catch (e) {
            err(`Couldn't find file for: ${filename}`);
            return 0;
          }
        }
        if (Module['freePreloadedMediaOnUse']) {
          preloadedAudios[filename] = null;
        }
        audio = raw;
      }
      else if (rwops.bytes !== undefined) {
        // For Web Audio context buffer decoding, we must make a clone of the audio data, but for <media> element,
        // a view to existing data is sufficient.
        if (SDL.webAudioAvailable()) bytes = HEAPU8.buffer.slice(rwops.bytes, rwops.bytes + rwops.count);
        else bytes = HEAPU8.subarray(rwops.bytes, rwops.bytes + rwops.count);
      }
      else {
        return 0;
      }
  
      var arrayBuffer = bytes ? bytes.buffer || bytes : bytes;
  
      // To allow user code to work around browser bugs with audio playback on <audio> elements an Web Audio, enable
      // the user code to hook in a callback to decide on a file basis whether each file should use Web Audio or <audio> for decoding and playback.
      // In particular, see https://bugzilla.mozilla.org/show_bug.cgi?id=654787 and ?id=1012801 for tradeoffs.
      var canPlayWithWebAudio = Module['SDL_canPlayWithWebAudio'] === undefined || Module['SDL_canPlayWithWebAudio'](filename, arrayBuffer);
  
      if (bytes !== undefined && SDL.webAudioAvailable() && canPlayWithWebAudio) {
        audio = undefined;
        webAudio = {};
        // The audio decoding process is asynchronous, which gives trouble if user code plays the audio data back immediately
        // after loading. Therefore prepare an array of callback handlers to run when this audio decoding is complete, which
        // will then start the playback (with some delay).
        webAudio.onDecodeComplete = []; // While this member array exists, decoding hasn't finished yet.
        var onDecodeComplete = (data) => {
          webAudio.decodedBuffer = data;
          // Call all handlers that were waiting for this decode to finish, and clear the handler list.
          webAudio.onDecodeComplete.forEach((e) => e());
          webAudio.onDecodeComplete = undefined; // Don't allow more callback handlers since audio has finished decoding.
        };
        SDL.audioContext['decodeAudioData'](arrayBuffer, onDecodeComplete);
      } else if (audio === undefined && bytes) {
        // Here, we didn't find a preloaded audio but we either were passed a filepath for
        // which we loaded bytes, or we were passed some bytes
        var blob = new Blob([bytes], {type: rwops.mimetype});
        var url = URL.createObjectURL(blob);
        audio = new Audio();
        audio.src = url;
        audio.mozAudioChannelType = 'content'; // bugzilla 910340
      }
  
      var id = SDL.audios.length;
      // Keep the loaded audio in the audio arrays, ready for playback
      SDL.audios.push({
        source: filename,
        audio, // Points to the <audio> element, if loaded
        webAudio // Points to a Web Audio -specific resource object, if loaded
      });
      return id;
    };

  
  
  
  var _Mix_LoadWAV = (filename) => {
      var rwops = _SDL_RWFromFile(filename, 0);
      var result = _Mix_LoadWAV_RW(rwops, 0);
      _SDL_FreeRW(rwops);
      return result;
    };

  var _Mix_QuickLoad_RAW = (mem, len) => {
      var audio;
      var webAudio;
  
      var numSamples = len >> 1; // len is the length in bytes, and the array contains 16-bit PCM values
      var buffer = new Float32Array(numSamples);
      for (var i = 0; i < numSamples; ++i) {
        buffer[i] = (HEAP16[(((mem)+(i*2))>>1)]) / 0x8000; // hardcoded 16-bit audio, signed (TODO: reSign if not ta2?)
      }
  
      if (SDL.webAudioAvailable()) {
        webAudio = {};
        webAudio.decodedBuffer = buffer;
      } else {
        audio = new Audio();
        audio.mozAudioChannelType = 'content'; // bugzilla 910340
        // Record the number of channels and frequency for later usage
        audio.numChannels = SDL.mixerNumChannels;
        audio.frequency = SDL.mixerFrequency;
        // FIXME: doesn't make sense to keep the audio element in the buffer
      }
  
      var id = SDL.audios.length;
      SDL.audios.push({
        source: '',
        audio,
        webAudio,
        buffer
      });
      return id;
    };

  var _Mix_FreeChunk = (id) => {
      SDL.audios[id] = null;
    };

  var _Mix_ReserveChannels = (num) => {
      SDL.channelMinimumNumber = num;
    };

  var _Mix_PlayChannelTimed = (channel, id, loops, ticks) => {
      // TODO: handle fixed amount of N loops. Currently loops either 0 or infinite times.
      assert(ticks == -1);
  
      // Get the audio element associated with the ID
      var info = SDL.audios[id];
      if (!info) return -1;
      if (!info.audio && !info.webAudio) return -1;
  
      // If the user asks us to allocate a channel automatically, get the first
      // free one.
      if (channel == -1) {
        for (var i = SDL.channelMinimumNumber; i < SDL.numChannels; i++) {
          if (!SDL.channels[i].audio) {
            channel = i;
            break;
          }
        }
        if (channel == -1) {
          err(`All ${SDL.numChannels}  channels in use!`);
          return -1;
        }
      }
      var channelInfo = SDL.channels[channel];
      var audio;
      if (info.webAudio) {
        // Create an instance of the WebAudio object.
        audio = {};
        audio.resource = info; // This new object is an instance that refers to this existing resource.
        audio.paused = false;
        audio.currentPosition = 0;
        // Make our instance look similar to the instance of a <media> to make api simple.
        audio.play = function() { SDL.playWebAudio(this); }
        audio.pause = function() { SDL.pauseWebAudio(this); }
      } else {
        // We clone the audio node to utilize the preloaded audio buffer, since
        // the browser has already preloaded the audio file.
        audio = info.audio.cloneNode(true);
        audio.numChannels = info.audio.numChannels;
        audio.frequency = info.audio.frequency;
      }
      audio['onended'] = function() { // TODO: cache these
        if (channelInfo.audio == this) { channelInfo.audio.paused = true; channelInfo.audio = null; }
        if (SDL.channelFinished)  ((a1) => dynCall_vi(SDL.channelFinished, a1))(channel);
      }
      channelInfo.audio = audio;
      // TODO: handle N loops. Behavior matches Mix_PlayMusic
      audio.loop = loops != 0;
      audio.volume = channelInfo.volume;
      audio.play();
      return channel;
    };

  var _Mix_FadingChannel = (channel) => 0;

  var _Mix_HaltChannel = (channel) => {
      function halt(channel) {
        var info = /** @type {{ audio: HTMLMediaElement }} */ (SDL.channels[channel]);
        if (info.audio) {
          info.audio.pause();
          info.audio = null;
        }
        if (SDL.channelFinished) {
          ((a1) => dynCall_vi(SDL.channelFinished, a1))(channel);
        }
      }
      if (channel != -1) {
        halt(channel);
      } else {
        for (var i = 0; i < SDL.channels.length; ++i) halt(i);
      }
      return 0;
    };

  var _Mix_HaltMusic = () => {
      var audio = /** @type {HTMLMediaElement} */ (SDL.music.audio);
      if (audio) {
        audio.src = audio.src; // rewind <media> element
        audio.currentPosition = 0; // rewind Web Audio graph playback.
        audio.pause();
      }
      SDL.music.audio = null;
      if (SDL.hookMusicFinished) {
        (() => dynCall_v(SDL.hookMusicFinished))();
      }
      return 0;
    };
  
  var _Mix_HookMusicFinished = (func) => {
      SDL.hookMusicFinished = func;
      if (SDL.music.audio) { // ensure the callback will be called, if a music is already playing
        SDL.music.audio['onended'] = _Mix_HaltMusic;
      }
    };

  var _Mix_VolumeMusic = (volume) => {
      return SDL.setGetVolume(SDL.music, volume);
    };

  
  var _Mix_LoadMUS_RW = (filename) => _Mix_LoadWAV_RW(filename, 0);

  
  
  
  var _Mix_LoadMUS = (filename) => {
      var rwops = _SDL_RWFromFile(filename, 0);
      var result = _Mix_LoadMUS_RW(rwops);
      _SDL_FreeRW(rwops);
      return result;
    };

  
  var _Mix_FreeMusic = _Mix_FreeChunk;

  
  var _Mix_PlayMusic = (id, loops) => {
      // Pause old music if it exists.
      if (SDL.music.audio) {
        if (!SDL.music.audio.paused) err(`Music is already playing. ${SDL.music.source}`);
        SDL.music.audio.pause();
      }
      var info = SDL.audios[id];
      var audio;
      if (info.webAudio) { // Play via Web Audio API
        // Create an instance of the WebAudio object.
        audio = {};
        audio.resource = info; // This new webAudio object is an instance that refers to this existing resource.
        audio.paused = false;
        audio.currentPosition = 0;
        audio.play = function() { SDL.playWebAudio(this); }
        audio.pause = function() { SDL.pauseWebAudio(this); }
      } else if (info.audio) { // Play via the <audio> element
        audio = info.audio;
      }
      audio['onended'] = function() { if (SDL.music.audio == this) _Mix_HaltMusic(); } // will send callback
      audio.loop = loops != 0 && loops != 1; // TODO: handle N loops for finite N
      audio.volume = SDL.music.volume;
      SDL.music.audio = audio;
      audio.play();
      return 0;
    };

  var _Mix_PauseMusic = () => {
      var audio = /** @type {HTMLMediaElement} */ (SDL.music.audio);
      audio?.pause();
    };

  var _Mix_ResumeMusic = () => {
      var audio = SDL.music.audio;
      audio?.play();
    };


  
  var _Mix_FadeInMusicPos = _Mix_PlayMusic;

  
  var _Mix_FadeOutMusic = _Mix_HaltMusic;

  var _Mix_PlayingMusic = () => {
      return (SDL.music.audio && !SDL.music.audio.paused) ? 1 : 0;
    };

  var _Mix_Playing = (channel) => {
      if (channel === -1) {
        var count = 0;
        for (var i = 0; i < SDL.channels.length; i++) {
          count += _Mix_Playing(i);
        }
        return count;
      }
      var info = SDL.channels[channel];
      if (info?.audio && !info.audio.paused) {
        return 1;
      }
      return 0;
    };

  var _Mix_Pause = (channel) => {
      if (channel === -1) {
        for (var i = 0; i<SDL.channels.length;i++) {
          _Mix_Pause(i);
        }
        return;
      }
      /** @type {{ audio: HTMLMediaElement }} */
      var info = SDL.channels[channel];
      if (info?.audio) {
        info.audio.pause();
      } else {
        //err(`Mix_Pause: no sound found for channel: ${channel}`);
      }
    };

  var _Mix_Paused = (channel) => {
      if (channel === -1) {
        var pausedCount = 0;
        for (var i = 0; i<SDL.channels.length;i++) {
          pausedCount += _Mix_Paused(i);
        }
        return pausedCount;
      }
      var info = SDL.channels[channel];
      if (info?.audio?.paused) {
        return 1;
      }
      return 0;
    };

  var _Mix_PausedMusic = () => SDL.music.audio?.paused ? 1 : 0;

  var _Mix_Resume = (channel) => {
      if (channel === -1) {
        for (var i = 0; i<SDL.channels.length;i++) {
          _Mix_Resume(i);
        }
        return;
      }
      var info = SDL.channels[channel];
      if (info?.audio) info.audio.play();
    };

  var _TTF_Init = () => {
      // OffscreenCanvas 2D is faster than Canvas for text operations, so we use
      // it if it's available.
      try {
        var offscreenCanvas = new OffscreenCanvas(0, 0);
        SDL.ttfContext = offscreenCanvas.getContext('2d');
        // Firefox support for OffscreenCanvas is still experimental, and it seems
        // like CI might be creating a context here but one that is not entirely
        // valid. Check that explicitly and fall back to a plain Canvas if we need
        // to. See https://github.com/emscripten-core/emscripten/issues/16242
        if (typeof SDL.ttfContext.measureText != 'function') {
          throw 'bad context';
        }
      } catch (ex) {
        var canvas = /** @type {HTMLCanvasElement} */(document.createElement('canvas'));
        SDL.ttfContext = canvas.getContext('2d');
      }
      // Check the final context looks valid. See
      // https://github.com/emscripten-core/emscripten/issues/16242
      assert(typeof SDL.ttfContext.measureText == 'function',
             'context ' + SDL.ttfContext + 'must provide valid methods');
      return 0;
    };

  
  var _TTF_OpenFont = (name, size) => {
      name = PATH.normalize(UTF8ToString(name));
      var id = SDL.fonts.length;
      SDL.fonts.push({
        name, // but we don't actually do anything with it..
        size
      });
      return id;
    };

  var _TTF_CloseFont = (font) => {
      SDL.fonts[font] = null;
    };

  
  var _TTF_RenderText_Solid = (font, text, color) => {
      // XXX the font and color are ignored
      text = UTF8ToString(text) || ' '; // if given an empty string, still return a valid surface
      var fontData = SDL.fonts[font];
      var w = SDL.estimateTextWidth(fontData, text);
      var h = fontData.size;
      color = SDL.loadColorToCSSRGB(color); // XXX alpha breaks fonts?
      var fontString = SDL.makeFontString(h, fontData.name);
      var surf = SDL.makeSurface(w, h, 0, false, 'text:' + text); // bogus numbers..
      var surfData = SDL.surfaces[surf];
      surfData.ctx.save();
      surfData.ctx.fillStyle = color;
      surfData.ctx.font = fontString;
      // use bottom alignment, because it works
      // same in all browsers, more info here:
      // https://bugzilla.mozilla.org/show_bug.cgi?id=737852
      surfData.ctx.textBaseline = 'bottom';
      surfData.ctx.fillText(text, 0, h|0);
      surfData.ctx.restore();
      return surf;
    };

  
  var _TTF_RenderText_Blended = _TTF_RenderText_Solid;

  
  var _TTF_RenderText_Shaded = _TTF_RenderText_Solid;

  
  var _TTF_RenderUTF8_Solid = _TTF_RenderText_Solid;

  
  
  /** @suppress {duplicate } */
  var _TTF_SizeText = (font, text, w, h) => {
      var fontData = SDL.fonts[font];
      if (w) {
        HEAP32[((w)>>2)] = SDL.estimateTextWidth(fontData, UTF8ToString(text));
      }
      if (h) {
        HEAP32[((h)>>2)] = fontData.size;
      }
      return 0;
    };
  var _TTF_SizeUTF8 = _TTF_SizeText;


  var _TTF_GlyphMetrics = (font, ch, minx, maxx, miny, maxy, advance) => {
      var fontData = SDL.fonts[font];
      var width = SDL.estimateTextWidth(fontData,  String.fromCharCode(ch));
  
      if (advance) {
        HEAP32[((advance)>>2)] = width;
      }
      if (minx) {
        HEAP32[((minx)>>2)] = 0;
      }
      if (maxx) {
        HEAP32[((maxx)>>2)] = width;
      }
      if (miny) {
        HEAP32[((miny)>>2)] = 0;
      }
      if (maxy) {
        HEAP32[((maxy)>>2)] = fontData.size;
      }
    };

  var _TTF_FontAscent = (font) => {
      var fontData = SDL.fonts[font];
      return (fontData.size*0.98)|0; // XXX
    };

  var _TTF_FontDescent = (font) => {
      var fontData = SDL.fonts[font];
      return (fontData.size*0.02)|0; // XXX
    };

  var _TTF_FontHeight = (font) => {
      var fontData = SDL.fonts[font];
      return fontData.size;
    };

  
  var _TTF_FontLineSkip = _TTF_FontHeight;

  var _TTF_Quit = () => out('TTF_Quit called (and ignored)');

  var SDL_gfx = {
  drawRectangle:(surf, x1, y1, x2, y2, action, cssColor) => {
        x1 = x1 << 16 >> 16;
        y1 = y1 << 16 >> 16;
        x2 = x2 << 16 >> 16;
        y2 = y2 << 16 >> 16;
        var surfData = SDL.surfaces[surf];
        assert(!surfData.locked); // but we could unlock and re-lock if we must..
        // TODO: if ctx does not change, leave as is, and also do not re-set xStyle etc.
        var x = x1 < x2 ? x1 : x2;
        var y = y1 < y2 ? y1 : y2;
        var w = Math.abs(x2 - x1);
        var h = Math.abs(y2 - y1);
        surfData.ctx.save();
        surfData.ctx[action + 'Style'] = cssColor;
        surfData.ctx[action + 'Rect'](x, y, w, h);
        surfData.ctx.restore();
      },
  drawLine:(surf, x1, y1, x2, y2, cssColor) => {
        x1 = x1 << 16 >> 16;
        y1 = y1 << 16 >> 16;
        x2 = x2 << 16 >> 16;
        y2 = y2 << 16 >> 16;
        var surfData = SDL.surfaces[surf];
        assert(!surfData.locked); // but we could unlock and re-lock if we must..
        surfData.ctx.save();
        surfData.ctx.strokeStyle = cssColor;
        surfData.ctx.beginPath();
        surfData.ctx.moveTo(x1, y1);
        surfData.ctx.lineTo(x2, y2);
        surfData.ctx.stroke();
        surfData.ctx.restore();
      },
  drawEllipse:(surf, x, y, rx, ry, action, cssColor) => {
        x = x << 16 >> 16;
        y = y << 16 >> 16;
        rx = rx << 16 >> 16;
        ry = ry << 16 >> 16;
        var surfData = SDL.surfaces[surf];
        assert(!surfData.locked); // but we could unlock and re-lock if we must..
  
        surfData.ctx.save();
        surfData.ctx.beginPath();
        surfData.ctx.translate(x, y);
        surfData.ctx.scale(rx, ry);
        surfData.ctx.arc(0, 0, 1, 0, 2 * Math.PI);
        surfData.ctx.restore();
  
        surfData.ctx.save();
        surfData.ctx[action + 'Style'] = cssColor;
        surfData.ctx[action]();
        surfData.ctx.restore();
      },
  translateColorToCSSRGBA:(rgba) => `rgba(${rgba>>>24},${rgba>>16 & 0xff},${rgba>>8 & 0xff},${rgba&0xff})`,
  };

  
  var _boxColor = (surf, x1, y1, x2, y2, color) =>
      SDL_gfx.drawRectangle(surf, x1, y1, x2, y2, 'fill', SDL_gfx.translateColorToCSSRGBA(color));

  
  var _boxRGBA = (surf, x1, y1, x2, y2, r, g, b, a) =>
      SDL_gfx.drawRectangle(surf, x1, y1, x2, y2, 'fill', SDL.translateRGBAToCSSRGBA(r, g, b, a));

  
  var _rectangleColor = (surf, x1, y1, x2, y2, color) =>
      SDL_gfx.drawRectangle(surf, x1, y1, x2, y2, 'stroke', SDL_gfx.translateColorToCSSRGBA(color));

  
  var _rectangleRGBA = (surf, x1, y1, x2, y2, r, g, b, a) =>
      SDL_gfx.drawRectangle(surf, x1, y1, x2, y2, 'stroke', SDL.translateRGBAToCSSRGBA(r, g, b, a));

  
  var _ellipseColor = (surf, x, y, rx, ry, color) =>
      SDL_gfx.drawEllipse(surf, x, y, rx, ry, 'stroke', SDL_gfx.translateColorToCSSRGBA(color));

  
  var _ellipseRGBA = (surf, x, y, rx, ry, r, g, b, a) =>
      SDL_gfx.drawEllipse(surf, x, y, rx, ry, 'stroke', SDL.translateRGBAToCSSRGBA(r, g, b, a));

  
  var _filledEllipseColor = (surf, x, y, rx, ry, color) =>
      SDL_gfx.drawEllipse(surf, x, y, rx, ry, 'fill', SDL_gfx.translateColorToCSSRGBA(color));

  
  var _filledEllipseRGBA = (surf, x, y, rx, ry, r, g, b, a) =>
      SDL_gfx.drawEllipse(surf, x, y, rx, ry, 'fill', SDL.translateRGBAToCSSRGBA(r, g, b, a));

  
  var _lineColor = (surf, x1, y1, x2, y2, color) =>
      SDL_gfx.drawLine(surf, x1, y1, x2, y2, SDL_gfx.translateColorToCSSRGBA(color));

  
  var _lineRGBA = (surf, x1, y1, x2, y2, r, g, b, a) =>
      SDL_gfx.drawLine(surf, x1, y1, x2, y2, SDL.translateRGBAToCSSRGBA(r, g, b, a));

  
  var _pixelRGBA = (surf, x1, y1, r, g, b, a) => _boxRGBA(surf, x1, y1, x1, y1, r, g, b, a);

  var _SDL_GL_SetAttribute = (attr, value) => {
      if (!(attr in SDL.glAttributes)) {
        abort('Unknown SDL GL attribute (' + attr + '). Please check if your SDL version is supported.');
      }
  
      SDL.glAttributes[attr] = value;
    };

  var _SDL_GL_GetAttribute = (attr, value) => {
      if (!(attr in SDL.glAttributes)) {
        abort('Unknown SDL GL attribute (' + attr + '). Please check if your SDL version is supported.');
      }
  
      if (value) HEAP32[((value)>>2)] = SDL.glAttributes[attr];
  
      return 0;
    };

  var _SDL_GL_SwapBuffers = () => {
      Browser.doSwapBuffers?.(); // in workers, this is used to send out a buffered frame
    };

  var _SDL_GL_ExtensionSupported = (extension) => Module.ctx.getExtension(extension) | 0;

  var _SDL_DestroyWindow = (window) => {};

  var _SDL_DestroyRenderer = (renderer) => {};

  var _SDL_GetWindowFlags = (window) => {
      if (Browser.isFullscreen) {
         return 1;
      }
  
      return 0;
    };

  var _SDL_GL_SwapWindow = (window) => {};

  var _SDL_GL_MakeCurrent = (window, context) => {};

  var _SDL_GL_DeleteContext = (context) => {};

  var _SDL_GL_GetSwapInterval = () => {
      if (Browser.mainLoop.timingMode == 1) return Browser.mainLoop.timingValue;
      else return 0;
    };

  
  var _SDL_GL_SetSwapInterval = (state) => {
      _emscripten_set_main_loop_timing(1, state);
    };

  
  var _SDL_SetWindowTitle = (window, title) => {
      if (title) document.title = UTF8ToString(title);
    };

  var _SDL_GetWindowSize = (window, width, height) => {
      var w = Module['canvas'].width;
      var h = Module['canvas'].height;
      if (width) HEAP32[((width)>>2)] = w;
      if (height) HEAP32[((height)>>2)] = h;
    };

  var _SDL_LogSetOutputFunction = (callback, userdata) => {};

  var _SDL_SetWindowFullscreen = (window, fullscreen) => {
      if (Browser.isFullscreen) {
        Module['canvas'].exitFullscreen();
        return 1;
      }
      return 0;
    };

  var _SDL_ClearError = () => {};

  var _SDL_SetGamma = (r, g, b) => -1;

  var _SDL_SetGammaRamp = (redTable, greenTable, blueTable) => -1;

  var _SDL_NumJoysticks = () => {
      var count = 0;
      var gamepads = SDL.getGamepads();
      // The length is not the number of gamepads; check which ones are defined.
      for (var i = 0; i < gamepads.length; i++) {
        if (gamepads[i] !== undefined) count++;
      }
      return count;
    };

  
  var _SDL_JoystickName = (deviceIndex) => {
      var gamepad = SDL.getGamepad(deviceIndex);
      if (gamepad) {
        var name = gamepad.id;
        if (SDL.joystickNamePool.hasOwnProperty(name)) {
          return SDL.joystickNamePool[name];
        }
        return SDL.joystickNamePool[name] = stringToNewUTF8(name);
      }
      return 0;
    };

  var _SDL_JoystickOpen = (deviceIndex) => {
      var gamepad = SDL.getGamepad(deviceIndex);
      if (gamepad) {
        // Use this as a unique 'pointer' for this joystick.
        var joystick = deviceIndex+1;
        SDL.recordJoystickState(joystick, gamepad);
        return joystick;
      }
      return 0;
    };

  var _SDL_JoystickOpened = (deviceIndex) => SDL.lastJoystickState.hasOwnProperty(deviceIndex+1) ? 1 : 0;

  var _SDL_JoystickIndex = (joystick) => joystick - 1;

  var _SDL_JoystickNumAxes = (joystick) => {
      var gamepad = SDL.getGamepad(joystick - 1);
      if (gamepad) {
        return gamepad.axes.length;
      }
      return 0;
    };

  var _SDL_JoystickNumBalls = (joystick) => 0;

  var _SDL_JoystickNumHats = (joystick) => 0;

  var _SDL_JoystickNumButtons = (joystick) => {
      var gamepad = SDL.getGamepad(joystick - 1);
      if (gamepad) {
        return gamepad.buttons.length;
      }
      return 0;
    };

  var _SDL_JoystickUpdate = () => SDL.queryJoysticks();

  var _SDL_JoystickEventState = (state) => {
      if (state < 0) {
        // SDL_QUERY: Return current state.
        return SDL.joystickEventState;
      }
      return SDL.joystickEventState = state;
    };

  var _SDL_JoystickGetAxis = (joystick, axis) => {
      var gamepad = SDL.getGamepad(joystick - 1);
      if (gamepad && gamepad.axes.length > axis) {
        return SDL.joystickAxisValueConversion(gamepad.axes[axis]);
      }
      return 0;
    };

  var _SDL_JoystickGetHat = (joystick, hat) => 0;

  var _SDL_JoystickGetBall = (joystick, ball, dxptr, dyptr) => -1;

  var _SDL_JoystickGetButton = (joystick, button) => {
      var gamepad = SDL.getGamepad(joystick - 1);
      if (gamepad && gamepad.buttons.length > button) {
        return SDL.getJoystickButtonState(gamepad.buttons[button]) ? 1 : 0;
      }
      return 0;
    };

  var _SDL_JoystickClose = (joystick) => {
      delete SDL.lastJoystickState[joystick];
    };

  var _SDL_InitSubSystem = (flags) => 0;

  var _SDL_RWFromConstMem = (mem, size) => {
      var id = SDL.rwops.length; // TODO: recycle ids when they are null
      SDL.rwops.push({ bytes: mem, count: size });
      return id;
    };

  
  var _SDL_RWFromMem = _SDL_RWFromConstMem;



  var _SDL_GetNumAudioDrivers = () => 1;

  
  var _SDL_GetCurrentAudioDriver = () => stringToNewUTF8('Emscripten Audio');

  var _SDL_GetScancodeFromKey = (key) => SDL.scanCodes[key];

  
  var _SDL_GetAudioDriver = (index) => _SDL_GetCurrentAudioDriver();

  var _SDL_EnableUNICODE = (on) => {
      var ret = SDL.unicode || 0;
      SDL.unicode = on;
      return ret;
    };

  
  var _SDL_AddTimer = (interval, callback, param) =>
      safeSetTimeout(
        () => ((a1, a2) => dynCall_iii(callback, a1, a2))(interval, param),
        interval);

  var _SDL_RemoveTimer = (id) => {
      clearTimeout(id);
      return true;
    };

  var _SDL_CreateThread = (fs, data, pfnBeginThread, pfnEndThread) => {
      throw 'SDL threads cannot be supported in the web platform because they assume shared state. See emscripten_create_worker etc. for a message-passing concurrency model that does let you run code in another thread.'
    };

  var _SDL_WaitThread = (thread, status) => { throw 'SDL_WaitThread' };

  var _SDL_GetThreadID = (thread) => { throw 'SDL_GetThreadID' };

  var _SDL_ThreadID = () => 0;

  var _SDL_AllocRW = () => { throw 'SDL_AllocRW: TODO' };

  var _SDL_CondBroadcast = (cond) => { throw 'SDL_CondBroadcast: TODO' };

  var _SDL_CondWaitTimeout = (cond, mutex, ms) => { throw 'SDL_CondWaitTimeout: TODO' };

  var _SDL_WM_IconifyWindow = () => { throw 'SDL_WM_IconifyWindow TODO' };

  var _Mix_SetPostMix = (func, arg) => warnOnce('Mix_SetPostMix: TODO');

  var _Mix_VolumeChunk = (chunk, volume) => { throw 'Mix_VolumeChunk: TODO' };

  var _Mix_SetPosition = (channel, angle, distance) => { throw 'Mix_SetPosition: TODO' };

  var _Mix_QuerySpec = (frequency, format, channels) => { throw 'Mix_QuerySpec: TODO' };

  var _Mix_FadeInChannelTimed = (channel, chunk, loop, ms, ticks) => { throw 'Mix_FadeInChannelTimed' };

  var _Mix_FadeOutChannel = () => { throw 'Mix_FadeOutChannel' };

  var _Mix_Linked_Version = () => { throw 'Mix_Linked_Version: TODO' };

  var _SDL_SaveBMP_RW = (surface, dst, freedst) => { throw 'SDL_SaveBMP_RW: TODO' };

  var _SDL_WM_SetIcon = (icon, mask) => {};

  var _SDL_HasRDTSC = () => 0;

  var _SDL_HasMMX = () => 0;

  var _SDL_HasMMXExt = () => 0;

  var _SDL_Has3DNow = () => 0;

  var _SDL_Has3DNowExt = () => 0;

  var _SDL_HasSSE = () => 0;

  var _SDL_HasSSE2 = () => 0;

  var _SDL_HasAltiVec = () => 0;

  var ALLOC_NORMAL = 0;

  var ALLOC_STACK = 1;

  
  
  
  var allocate = (slab, allocator) => {
      var ret;
      assert(typeof allocator == 'number', 'allocate no longer takes a type argument')
      assert(typeof slab != 'number', 'allocate no longer takes a number as arg0')
  
      if (allocator == ALLOC_STACK) {
        ret = stackAlloc(slab.length);
      } else {
        ret = _malloc(slab.length);
      }
  
      if (!slab.subarray && !slab.slice) {
        slab = new Uint8Array(slab);
      }
      HEAPU8.set(slab, ret);
      return ret;
    };

  
  /** @deprecated @param {boolean=} dontAddNull */
  var writeStringToMemory = (string, buffer, dontAddNull) => {
      warnOnce('writeStringToMemory is deprecated and should not be called! Use stringToUTF8() instead!');
  
      var /** @type {number} */ lastChar, /** @type {number} */ end;
      if (dontAddNull) {
        // stringToUTF8 always appends null. If we don't want to do that, remember the
        // character that existed at the location where the null will be placed, and restore
        // that after the write (below).
        end = buffer + lengthBytesUTF8(string);
        lastChar = HEAP8[end];
      }
      stringToUTF8(string, buffer, Infinity);
      if (dontAddNull) HEAP8[end] = lastChar; // Restore the value under the null character.
    };

  /** @param {boolean=} dontAddNull */
  var writeAsciiToMemory = (str, buffer, dontAddNull) => {
      for (var i = 0; i < str.length; ++i) {
        assert(str.charCodeAt(i) === (str.charCodeAt(i) & 0xff));
        HEAP8[buffer++] = str.charCodeAt(i);
      }
      // Null-terminate the string
      if (!dontAddNull) HEAP8[buffer] = 0;
    };

  var allocateUTF8 = stringToNewUTF8;

  var allocateUTF8OnStack = stringToUTF8OnStack;

  var setErrNo = (value) => {
      HEAP32[((___errno_location())>>2)] = value;
      return value;
    };

  
  
  
  
  var demangle = (func) => {
      // If demangle has failed before, stop demangling any further function names
      // This avoids an infinite recursion with malloc()->abort()->stackTrace()->demangle()->malloc()->...
      demangle.recursionGuard = (demangle.recursionGuard|0)+1;
      if (demangle.recursionGuard > 1) return func;
      return withStackSave(() => {
        try {
          var s = func;
          if (s.startsWith('__Z'))
            s = s.substr(1);
          var buf = stringToUTF8OnStack(s);
          var status = stackAlloc(4);
          var ret = ___cxa_demangle(buf, 0, 0, status);
          if (HEAP32[((status)>>2)] === 0 && ret) {
            return UTF8ToString(ret);
          }
          // otherwise, libcxxabi failed
        } catch(e) {
        } finally {
          _free(ret);
          if (demangle.recursionGuard < 2) --demangle.recursionGuard;
        }
        // failure when using libcxxabi, don't demangle
        return func;
      });
    };

  function stackTrace() {
      var js = jsStackTrace();
      if (Module['extraStackTrace']) js += '\n' + Module['extraStackTrace']();
      return js;
    }

  var print = out;

  var printErr = err;

  var _emscripten_is_main_browser_thread = () =>
      !ENVIRONMENT_IS_WORKER;

  FS.createPreloadedFile = FS_createPreloadedFile;
  FS.staticInit();;

      var emSetImmediate;
      var emClearImmediate;
      if (typeof setImmediate != "undefined") {
        emSetImmediate = setImmediateWrapped;
        emClearImmediate = clearImmediateWrapped;
      } else if (typeof addEventListener == "function") {
        var __setImmediate_id_counter = 0;
        var __setImmediate_queue = [];
        var __setImmediate_message_id = "_si";
        /** @param {Event} e */
        var __setImmediate_cb = (e) => {
          if (e.data === __setImmediate_message_id) {
            e.stopPropagation();
            __setImmediate_queue.shift()();
            ++__setImmediate_id_counter;
          }
        }
        addEventListener("message", __setImmediate_cb, true);
        emSetImmediate = (func) => {
          postMessage(__setImmediate_message_id, "*");
          return __setImmediate_id_counter + __setImmediate_queue.push(func) - 1;
        }
        emClearImmediate = /**@type{function(number=)}*/((id) => {
          var index = id - __setImmediate_id_counter;
          // must preserve the order and count of elements in the queue, so replace the pending callback with an empty function
          if (index >= 0 && index < __setImmediate_queue.length) __setImmediate_queue[index] = () => {};
        })
      };

      // exports
      Module["requestFullscreen"] = Browser.requestFullscreen;
      Module["requestFullScreen"] = Browser.requestFullScreen;
      Module["requestAnimationFrame"] = Browser.requestAnimationFrame;
      Module["setCanvasSize"] = Browser.setCanvasSize;
      Module["pauseMainLoop"] = Browser.mainLoop.pause;
      Module["resumeMainLoop"] = Browser.mainLoop.resume;
      Module["getUserMedia"] = Browser.getUserMedia;
      Module["createContext"] = Browser.createContext;
      var preloadedImages = {};
      var preloadedAudios = {};;
for (var i = 0; i < 32; ++i) tempFixedLengthArray.push(new Array(i));;
var GLctx;;
var miniTempWebGLFloatBuffersStorage = new Float32Array(288);
  // Create GL_POOL_TEMP_BUFFERS_SIZE+1 temporary buffers, for uploads of size 0 through GL_POOL_TEMP_BUFFERS_SIZE inclusive
  for (/**@suppress{duplicate}*/var i = 0; i <= 288; ++i) {
    miniTempWebGLFloatBuffers[i] = miniTempWebGLFloatBuffersStorage.subarray(0, i);
  };
var miniTempWebGLIntBuffersStorage = new Int32Array(288);
  // Create GL_POOL_TEMP_BUFFERS_SIZE+1 temporary buffers, for uploads of size 0 through GL_POOL_TEMP_BUFFERS_SIZE inclusive
  for (/**@suppress{duplicate}*/var i = 0; i <= 288; ++i) {
    miniTempWebGLIntBuffers[i] = miniTempWebGLIntBuffersStorage.subarray(0, i);
  };
function checkIncomingModuleAPI() {
  ignoredModuleProp('fetchSettings');
}
var wasmImports = {
  /** @export */
  __assert_fail: ___assert_fail,
  /** @export */
  __call_sighandler: ___call_sighandler,
  /** @export */
  _abort_js: __abort_js,
  /** @export */
  _emscripten_memcpy_js: __emscripten_memcpy_js,
  /** @export */
  _emscripten_runtime_keepalive_clear: __emscripten_runtime_keepalive_clear,
  /** @export */
  _setitimer_js: __setitimer_js,
  /** @export */
  emscripten_asm_const_int: _emscripten_asm_const_int,
  /** @export */
  emscripten_asm_const_ptr: _emscripten_asm_const_ptr,
  /** @export */
  emscripten_resize_heap: _emscripten_resize_heap,
  /** @export */
  emscripten_sleep: _emscripten_sleep,
  /** @export */
  environ_get: _environ_get,
  /** @export */
  environ_sizes_get: _environ_sizes_get,
  /** @export */
  exit: _exit,
  /** @export */
  fd_close: _fd_close,
  /** @export */
  fd_seek: _fd_seek,
  /** @export */
  fd_write: _fd_write,
  /** @export */
  proc_exit: _proc_exit
};
var wasmExports = createWasm();
var ___wasm_call_ctors = createExportWrapper('__wasm_call_ctors', 0);
var _memcpy = createExportWrapper('memcpy', 3);
var _main = Module['_main'] = createExportWrapper('__main_argc_argv', 2);
var _free = createExportWrapper('free', 1);
var _malloc = createExportWrapper('malloc', 1);
var ___errno_location = createExportWrapper('__errno_location', 0);
var _fflush = createExportWrapper('fflush', 1);
var _fileno = createExportWrapper('fileno', 1);
var _htonl = createExportWrapper('htonl', 1);
var _htons = createExportWrapper('htons', 1);
var _memcmp = createExportWrapper('memcmp', 3);
var _ntohs = createExportWrapper('ntohs', 1);
var __emscripten_timeout = createExportWrapper('_emscripten_timeout', 2);
var _strerror = createExportWrapper('strerror', 1);
var _emscripten_builtin_memalign = createExportWrapper('emscripten_builtin_memalign', 2);
var _setThrew = createExportWrapper('setThrew', 2);
var __emscripten_tempret_set = createExportWrapper('_emscripten_tempret_set', 1);
var __emscripten_tempret_get = createExportWrapper('_emscripten_tempret_get', 0);
var _emscripten_stack_init = () => (_emscripten_stack_init = wasmExports['emscripten_stack_init'])();
var _emscripten_stack_set_limits = (a0, a1) => (_emscripten_stack_set_limits = wasmExports['emscripten_stack_set_limits'])(a0, a1);
var _emscripten_stack_get_free = () => (_emscripten_stack_get_free = wasmExports['emscripten_stack_get_free'])();
var _emscripten_stack_get_base = () => (_emscripten_stack_get_base = wasmExports['emscripten_stack_get_base'])();
var _emscripten_stack_get_end = () => (_emscripten_stack_get_end = wasmExports['emscripten_stack_get_end'])();
var __emscripten_stack_restore = (a0) => (__emscripten_stack_restore = wasmExports['_emscripten_stack_restore'])(a0);
var __emscripten_stack_alloc = (a0) => (__emscripten_stack_alloc = wasmExports['_emscripten_stack_alloc'])(a0);
var _emscripten_stack_get_current = () => (_emscripten_stack_get_current = wasmExports['emscripten_stack_get_current'])();
var ___cxa_demangle = createExportWrapper('__cxa_demangle', 4);
var ___cxa_increment_exception_refcount = createExportWrapper('__cxa_increment_exception_refcount', 1);
var ___cxa_decrement_exception_refcount = createExportWrapper('__cxa_decrement_exception_refcount', 1);
var ___cxa_can_catch = createExportWrapper('__cxa_can_catch', 3);
var ___cxa_is_pointer_type = createExportWrapper('__cxa_is_pointer_type', 1);
var dynCall_vi = Module['dynCall_vi'] = createExportWrapper('dynCall_vi', 2);
var dynCall_ii = Module['dynCall_ii'] = createExportWrapper('dynCall_ii', 2);
var dynCall_iiii = Module['dynCall_iiii'] = createExportWrapper('dynCall_iiii', 4);
var dynCall_jiji = Module['dynCall_jiji'] = createExportWrapper('dynCall_jiji', 5);
var dynCall_iidiiii = Module['dynCall_iidiiii'] = createExportWrapper('dynCall_iidiiii', 7);
var dynCall_vii = Module['dynCall_vii'] = createExportWrapper('dynCall_vii', 3);
var dynCall_v = Module['dynCall_v'] = createExportWrapper('dynCall_v', 1);
var dynCall_viiiiii = Module['dynCall_viiiiii'] = createExportWrapper('dynCall_viiiiii', 7);
var dynCall_viiiii = Module['dynCall_viiiii'] = createExportWrapper('dynCall_viiiii', 6);
var dynCall_viiii = Module['dynCall_viiii'] = createExportWrapper('dynCall_viiii', 5);
var dynCall_iii = Module['dynCall_iii'] = createExportWrapper('dynCall_iii', 3);
var _asyncify_start_unwind = createExportWrapper('asyncify_start_unwind', 1);
var _asyncify_stop_unwind = createExportWrapper('asyncify_stop_unwind', 0);
var _asyncify_start_rewind = createExportWrapper('asyncify_start_rewind', 1);
var _asyncify_stop_rewind = createExportWrapper('asyncify_stop_rewind', 0);


// include: postamble.js
// === Auto-generated postamble setup entry stuff ===

var unexportedSymbols = [
  'run',
  'addOnPreRun',
  'addOnInit',
  'addOnPreMain',
  'addOnExit',
  'addOnPostRun',
  'addRunDependency',
  'removeRunDependency',
  'out',
  'err',
  'callMain',
  'abort',
  'wasmMemory',
  'wasmExports',
  'writeStackCookie',
  'checkStackCookie',
  'writeI53ToI64',
  'writeI53ToI64Clamped',
  'writeI53ToI64Signaling',
  'writeI53ToU64Clamped',
  'writeI53ToU64Signaling',
  'readI53FromI64',
  'readI53FromU64',
  'convertI32PairToI53',
  'convertI32PairToI53Checked',
  'convertU32PairToI53',
  'stackSave',
  'stackRestore',
  'stackAlloc',
  'getTempRet0',
  'setTempRet0',
  'ptrToString',
  'zeroMemory',
  'exitJS',
  'getHeapMax',
  'abortOnCannotGrowMemory',
  'growMemory',
  'ENV',
  'MONTH_DAYS_REGULAR',
  'MONTH_DAYS_LEAP',
  'MONTH_DAYS_REGULAR_CUMULATIVE',
  'MONTH_DAYS_LEAP_CUMULATIVE',
  'isLeapYear',
  'ydayFromDate',
  'arraySum',
  'addDays',
  'ERRNO_CODES',
  'strError',
  'inetPton4',
  'inetNtop4',
  'inetPton6',
  'inetNtop6',
  'readSockaddr',
  'writeSockaddr',
  'DNS',
  'Protocols',
  'Sockets',
  'initRandomFill',
  'randomFill',
  'timers',
  'warnOnce',
  'emscriptenLog',
  'readEmAsmArgsArray',
  'readEmAsmArgs',
  'runEmAsmFunction',
  'runMainThreadEmAsm',
  'jstoi_q',
  'jstoi_s',
  'getExecutableName',
  'listenOnce',
  'autoResumeAudioContext',
  'dynCallLegacy',
  'getDynCaller',
  'dynCall',
  'handleException',
  'keepRuntimeAlive',
  'runtimeKeepalivePush',
  'runtimeKeepalivePop',
  'callUserCallback',
  'maybeExit',
  'asmjsMangle',
  'asyncLoad',
  'alignMemory',
  'mmapAlloc',
  'HandleAllocator',
  'getNativeTypeSize',
  'wasmTable',
  'noExitRuntime',
  'STACK_SIZE',
  'STACK_ALIGN',
  'POINTER_SIZE',
  'ASSERTIONS',
  'getCFunc',
  'ccall',
  'cwrap',
  'uleb128Encode',
  'sigToWasmTypes',
  'generateFuncType',
  'convertJsFunctionToWasm',
  'freeTableIndexes',
  'functionsInTableMap',
  'getEmptyTableSlot',
  'updateTableMap',
  'getFunctionAddress',
  'addFunction',
  'removeFunction',
  'reallyNegative',
  'unSign',
  'strLen',
  'reSign',
  'formatString',
  'setValue',
  'getValue',
  'PATH',
  'PATH_FS',
  'UTF8Decoder',
  'UTF8ArrayToString',
  'UTF8ToString',
  'stringToUTF8Array',
  'stringToUTF8',
  'lengthBytesUTF8',
  'intArrayFromString',
  'intArrayToString',
  'AsciiToString',
  'stringToAscii',
  'UTF16Decoder',
  'UTF16ToString',
  'stringToUTF16',
  'lengthBytesUTF16',
  'UTF32ToString',
  'stringToUTF32',
  'lengthBytesUTF32',
  'stringToNewUTF8',
  'stringToUTF8OnStack',
  'writeArrayToMemory',
  'JSEvents',
  'registerKeyEventCallback',
  'specialHTMLTargets',
  'maybeCStringToJsString',
  'findEventTarget',
  'findCanvasEventTarget',
  'getBoundingClientRect',
  'fillMouseEventData',
  'registerMouseEventCallback',
  'registerWheelEventCallback',
  'registerUiEventCallback',
  'registerFocusEventCallback',
  'fillDeviceOrientationEventData',
  'registerDeviceOrientationEventCallback',
  'fillDeviceMotionEventData',
  'registerDeviceMotionEventCallback',
  'screenOrientation',
  'fillOrientationChangeEventData',
  'registerOrientationChangeEventCallback',
  'fillFullscreenChangeEventData',
  'registerFullscreenChangeEventCallback',
  'JSEvents_requestFullscreen',
  'JSEvents_resizeCanvasForFullscreen',
  'registerRestoreOldStyle',
  'hideEverythingExceptGivenElement',
  'restoreHiddenElements',
  'setLetterbox',
  'currentFullscreenStrategy',
  'restoreOldWindowedStyle',
  'softFullscreenResizeWebGLRenderTarget',
  'doRequestFullscreen',
  'fillPointerlockChangeEventData',
  'registerPointerlockChangeEventCallback',
  'registerPointerlockErrorEventCallback',
  'requestPointerLock',
  'fillVisibilityChangeEventData',
  'registerVisibilityChangeEventCallback',
  'registerTouchEventCallback',
  'fillGamepadEventData',
  'registerGamepadEventCallback',
  'registerBeforeUnloadEventCallback',
  'fillBatteryEventData',
  'battery',
  'registerBatteryEventCallback',
  'setCanvasElementSize',
  'getCanvasElementSize',
  'jsStackTrace',
  'getCallstack',
  'UNWIND_CACHE',
  'convertPCtoSourceLocation',
  'ExitStatus',
  'getEnvStrings',
  'checkWasiClock',
  'doReadv',
  'doWritev',
  'wasiRightsToMuslOFlags',
  'wasiOFlagsToMuslOFlags',
  'createDyncallWrapper',
  'safeSetTimeout',
  'setImmediateWrapped',
  'clearImmediateWrapped',
  'polyfillSetImmediate',
  'promiseMap',
  'getPromise',
  'makePromise',
  'idsToPromises',
  'makePromiseCallback',
  'uncaughtExceptionCount',
  'exceptionLast',
  'exceptionCaught',
  'ExceptionInfo',
  'findMatchingCatch',
  'Browser',
  'Browser_asyncPrepareDataCounter',
  'setMainLoop',
  'getPreloadedImageData__data',
  'wget',
  'SYSCALLS',
  'getSocketFromFD',
  'getSocketAddress',
  'preloadPlugins',
  'FS_createPreloadedFile',
  'FS_modeStringToFlags',
  'FS_getMode',
  'FS_stdin_getChar_buffer',
  'FS_stdin_getChar',
  'FS_unlink',
  'FS_createPath',
  'FS_createDevice',
  'FS_readFile',
  'FS',
  'FS_createDataFile',
  'FS_mkdirTree',
  'FS_createLazyFile',
  'MEMFS',
  'TTY',
  'PIPEFS',
  'SOCKFS',
  '_setNetworkCallback',
  'tempFixedLengthArray',
  'miniTempWebGLFloatBuffers',
  'miniTempWebGLIntBuffers',
  'heapObjectForWebGLType',
  'toTypedArrayIndex',
  'webgl_enable_ANGLE_instanced_arrays',
  'webgl_enable_OES_vertex_array_object',
  'webgl_enable_WEBGL_draw_buffers',
  'webgl_enable_WEBGL_multi_draw',
  'GL',
  'emscriptenWebGLGet',
  'computeUnpackAlignedImageSize',
  'colorChannelsInGlTextureFormat',
  'emscriptenWebGLGetTexPixelData',
  'emscriptenWebGLGetUniform',
  'webglGetUniformLocation',
  'webglPrepareUniformLocationsBeforeFirstUse',
  'webglGetLeftBracePos',
  'emscriptenWebGLGetVertexAttrib',
  '__glGetActiveAttribOrUniform',
  'writeGLArray',
  'registerWebGlEventCallback',
  'AL',
  'GLUT',
  'EGL',
  'GLEW',
  'IDBStore',
  'runAndAbortIfError',
  'Asyncify',
  'Fibers',
  'SDL',
  'SDL_gfx',
  'ALLOC_NORMAL',
  'ALLOC_STACK',
  'allocate',
  'writeStringToMemory',
  'writeAsciiToMemory',
  'allocateUTF8',
  'allocateUTF8OnStack',
  'setErrNo',
  'demangle',
  'stackTrace',
  'print',
  'printErr',
];
unexportedSymbols.forEach(unexportedRuntimeSymbol);



var calledRun;

dependenciesFulfilled = function runCaller() {
  // If run has never been called, and we should call run (INVOKE_RUN is true, and Module.noInitialRun is not false)
  if (!calledRun) run();
  if (!calledRun) dependenciesFulfilled = runCaller; // try this again later, after new deps are fulfilled
};

function callMain(args = []) {
  assert(runDependencies == 0, 'cannot call main when async dependencies remain! (listen on Module["onRuntimeInitialized"])');
  assert(__ATPRERUN__.length == 0, 'cannot call main when preRun functions remain to be called');

  var entryFunction = _main;

  args.unshift(thisProgram);

  var argc = args.length;
  var argv = stackAlloc((argc + 1) * 4);
  var argv_ptr = argv;
  args.forEach((arg) => {
    HEAPU32[((argv_ptr)>>2)] = stringToUTF8OnStack(arg);
    argv_ptr += 4;
  });
  HEAPU32[((argv_ptr)>>2)] = 0;

  try {

    var ret = entryFunction(argc, argv);

    // if we're not running an evented main loop, it's time to exit
    exitJS(ret, /* implicit = */ true);
    return ret;
  }
  catch (e) {
    return handleException(e);
  }
}

function stackCheckInit() {
  // This is normally called automatically during __wasm_call_ctors but need to
  // get these values before even running any of the ctors so we call it redundantly
  // here.
  _emscripten_stack_init();
  // TODO(sbc): Move writeStackCookie to native to to avoid this.
  writeStackCookie();
}

function run(args = arguments_) {

  if (runDependencies > 0) {
    return;
  }

    stackCheckInit();

  preRun();

  // a preRun added a dependency, run will be called later
  if (runDependencies > 0) {
    return;
  }

  function doRun() {
    // run may have just been called through dependencies being fulfilled just in this very frame,
    // or while the async setStatus time below was happening
    if (calledRun) return;
    calledRun = true;
    Module['calledRun'] = true;

    if (ABORT) return;

    initRuntime();

    preMain();

    Module['onRuntimeInitialized']?.();

    if (shouldRunNow) callMain(args);

    postRun();
  }

  if (Module['setStatus']) {
    Module['setStatus']('Running...');
    setTimeout(function() {
      setTimeout(function() {
        Module['setStatus']('');
      }, 1);
      doRun();
    }, 1);
  } else
  {
    doRun();
  }
  checkStackCookie();
}

function checkUnflushedContent() {
  // Compiler settings do not allow exiting the runtime, so flushing
  // the streams is not possible. but in ASSERTIONS mode we check
  // if there was something to flush, and if so tell the user they
  // should request that the runtime be exitable.
  // Normally we would not even include flush() at all, but in ASSERTIONS
  // builds we do so just for this check, and here we see if there is any
  // content to flush, that is, we check if there would have been
  // something a non-ASSERTIONS build would have not seen.
  // How we flush the streams depends on whether we are in SYSCALLS_REQUIRE_FILESYSTEM=0
  // mode (which has its own special function for this; otherwise, all
  // the code is inside libc)
  var oldOut = out;
  var oldErr = err;
  var has = false;
  out = err = (x) => {
    has = true;
  }
  try { // it doesn't matter if it fails
    _fflush(0);
    // also flush in the JS FS layer
    ['stdout', 'stderr'].forEach(function(name) {
      var info = FS.analyzePath('/dev/' + name);
      if (!info) return;
      var stream = info.object;
      var rdev = stream.rdev;
      var tty = TTY.ttys[rdev];
      if (tty?.output?.length) {
        has = true;
      }
    });
  } catch(e) {}
  out = oldOut;
  err = oldErr;
  if (has) {
    warnOnce('stdio streams had content in them that was not flushed. you should set EXIT_RUNTIME to 1 (see the Emscripten FAQ), or make sure to emit a newline when you printf etc.');
  }
}

if (Module['preInit']) {
  if (typeof Module['preInit'] == 'function') Module['preInit'] = [Module['preInit']];
  while (Module['preInit'].length > 0) {
    Module['preInit'].pop()();
  }
}

// shouldRunNow refers to calling main(), not run().
var shouldRunNow = true;

if (Module['noInitialRun']) shouldRunNow = false;

run();

// end include: postamble.js

