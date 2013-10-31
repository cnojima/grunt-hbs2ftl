util = require('util');
// console.log(util.inspect(arguments[k], false, null, true))

var matches = [],
  scopeDepth = [];


/**
 * add helper signatures here to help converter differentiate 
 * between {{{foo }}} (helper) and {{{bar}}} (do not escape)
 */
var helperWhitelist = [
  'tel_anchor', 'staticVersion', 'hbstemplates', 'qtyOption'
];


function normalizeNamespace(n) {
  n = n || '';
  if(n) n += '.';
  return n;
}

function _applyNamespace(s, type, namespace) {
  var ftlTag = '<#' + type + ' ([\\w]+) as ([\\w]+)>',
    re = new RegExp(ftlTag, 'gim');

  return s.replace(re, '<#' + type + ' ' + namespace + '.$1 as $2>');
}








function hbsHelpers(s) {
  var matches, handle, handleRegex, regexTriple, re,
    regex = /{{#(\w+)?[^}]*}}/gim;

  // handle {{#[helper] }}
  matches = s.match(regex);

  if(matches) {
    // extract helper handle
    handle = matches[0].replace('{{#', '');
    handle = handle.substr(0, handle.indexOf(' '));

    if(helperWhitelist.indexOf(handle) > -1) {
      handleRegex = new RegExp('{{/' + handle + '}}', 'gim');
      s = s.replace(/{{#([ a-z0-9_\-\.]+)\s+([^}]+)?}}/gim, '<@helper.$1 $2>');
      s = s.replace(handleRegex, '</@helper.' + handle + '>');
    }
  }

  // handle other syntax
  matches = s.match(/{{{([^}]+)}}}/gim);
  
  if(matches) {
    // console.log(matches);
    for(var i=0, n=matches.length; i<n; i++) {
      handle = matches[i].replace(/[{}]/gim, '');

      if(handle.indexOf(' ') > -1) {
        if(helperWhitelist.indexOf(handle.trim()) > -1) {
          handle = handle.substr(0, handle.indexOf(' '));
          re = '{{{(' + handle + ')([\\s\\.a-z0-9\\-()]+)}}}';
          regexTriple = new RegExp(re, 'gim');
          s = s.replace(regexTriple, '<@helper.$1$2/>');
        }
      }
    }
  }

  return s;
}






/*******************************************************************************
 **** scope changing block converters                                       ****
 *******************************************************************************/
function _nth(s, type, callbackBlock) {
  var matcher = '{{#' + type + ' ([\\w\\.]+[^}])}}',
    re = new RegExp(matcher, "gim"),
    matches = s.match(re),
    lastMatch, raw;

  if(matches) {
    while(matches.length > 0) {
      lastMatch = matches.pop();
      raw = _convertNth(s, type, lastMatch);
      s = s.replace(raw, callbackBlock(raw));
    }
  }

  return s;  
}

function _convertNth(s, type, match) {
  type = '{{/' + type + '}}';
  
  var ret = '',
    start = s.indexOf(match),
    end = s.indexOf(type, start) + type.length;

  if(start > -1 && end > start) {
    ret = s.substr(start, end - start);
  }

  return ret;
}


/*******************************************************************************
 **** {{#with}} handlers                                                    ****
 *******************************************************************************/
function hbsWith(s) {
  return _nth(s, 'with', _convertOneWithBlock);
}

function _convertOneWithBlock(s) {
  var handle = s.match(/{{#with\ [\w\.]+}}/im)[0];

  if(handle) {
    handle = handle.substr(8);
    handle = handle.substr(0, handle.length - 2);

    s = s.replace(/{{#with (.*)}}/gim, '<#macro with_$1 $1>');
    s = s.replace(/{{\/with}}/gim, '</#macro><@with_' + handle + ' ' + handle + '/>');
    s = _applyNamespace(s, 'macro', handle);
    s = hbsTokens(s, handle);
// console.log('--------------\n', s, '--------------');
    s = hbsIf(s, handle);
    s = hbsEq(s, handle);
  }
  
  return s;
}




/*******************************************************************************
 **** {{#each}} handlers                                                    ****
 *******************************************************************************/
function hbsEach(s) {
  return _nth(s, 'each', _convertOneEachBlock);
}

/**
 * returns one {{#each}}{{/each}} block, tags inclusive, including any embedded {{#each}}'s
 */
function _convertNthEach(s, each) {
  return _convertNth(s, 'each', each);
}

function _convertOneEachBlock(s, namespace) {
  var
    matches, eachStartDelta, newEach = '', 
    beforeEach, innerEach, afterEach, scopeNamespace,
    eachStartIdx = s.search(/{{#each (.*)}}/im),
    eachEndIdx = s.lastIndexOf('{{/each}}');

  namespace = namespace || '';
  namespace = normalizeNamespace(namespace);

  if(eachStartIdx > -1) {
    matches = s.match(/{{#each (.*)}}/im);
    beforeEach = s.substr(0, eachStartIdx);
    afterEach = s.substr(eachEndIdx + 9);

    if(matches) {
      scopeNamespace = 'i_' + matches[1].replace('.', '_');
      newEach = [ '<#list ', namespace, matches[1], ' as ', scopeNamespace, '>' ].join(''); // prefix innerEach
      eachStartDelta = matches[0].length;
      innerEach = s.substr(eachStartIdx + eachStartDelta, (eachEndIdx - eachStartIdx - eachStartDelta));

      // search text inbetween {{#each}} for <#list [var] as ...> and apply current scopeNamespace
      innerEach = _applyNamespace(innerEach, 'list', scopeNamespace);

      // handle simple variable assignments
      innerEach = hbsTokens(innerEach, scopeNamespace);

      // handle if clauses with scope
      innerEach = hbsIf(innerEach, scopeNamespace);
      innerEach = hbsEq(innerEach, scopeNamespace);

      newEach += innerEach;
      newEach += '</#list>';
    }

    s = [ beforeEach, newEach, afterEach ].join('');
// console.log('\n\n\n-------------------------------')
// console.log(s);
  }

  return s;
}








/*******************************************************************************
 **** atomic {{#foo}} handlers                                              ****
 *******************************************************************************/

function hbsIf(s, namespace) {
  namespace = normalizeNamespace(namespace);

  s = s.replace(/{{#if ([\w\.]+[^}])}}/gim, '<#if ' + namespace + '$1??>');
  // console.log(s.match(/{{#if ([\w\.]+[^}])}}/gim));

  // s = s.replace(/{{#if ([\w\.]+[^}])}}/gim, '<#if ' + namespace + '($1??)>');// && ' + namespace + '($1??)!false>');
  // s = s.replace(/{{#if ([\w\.]+[^}])}}/gim, '<#if (' + namespace + '$1)?has_content>');
  s = s.replace(/{{else}}/gim, '<#else>');
  s = s.replace(/{{\/if}}/gim, '</#if>');

  return s;
}

function hbsEq(s, namespace) {
  namespace = normalizeNamespace(namespace);
  
  s = s.replace(/{{#eq ([^} ]+) ([^} ]+)}}/gim, '<#if ' + namespace + '$1 == $2>');
  s = s.replace(/{{\/eq}}/gim, '</#if>');

  s = s.replace(/{{#ne ([^} ]+) ([^} ]+)}}/gim, '<#if ' + namespace + '$1 != $2>');
  s = s.replace(/{{\/ne}}/gim, '</#if>');

  s = s.replace(/{{#lt ([^} ]+) ([^} ]+)}}/gim, '<#if ' + namespace + '$1 < $2>');
  s = s.replace(/{{\/lt}}/gim, '</#if>');

  s = s.replace(/{{#gt ([^} ]+) ([^} ]+)}}/gim, '<#if ' + namespace + '$1 &gt; $2>');
  s = s.replace(/{{\/gt}}/gim, '</#if>');

  return s;
}

function hbsTokens(s, namespace) {
  // handle explicit {{this}}
  s = s.replace(/{{this}}/gim, namespace);

  namespace = normalizeNamespace(namespace);
  s = s.replace(/{{([ a-z0-9_\-\.]+)}}/gim, '${' + namespace + '$1!""}');

  // dumb sanity
  if(s.indexOf('this.this')) {
    s = s.replace('this.this', 'this');
  }

  return s;
}




module.exports = {
  hbsEach         : hbsEach,
  hbsEq           : hbsEq,
  hbsHelpers      : hbsHelpers,
  hbsTokens       : hbsTokens,
  hbsWith         : hbsWith,

  injectMacroHandle: function(s, name) {
    return [
      '<#macro ', name, '>\n',
      s,
      "\n",
      '</#macro>'
    ].join('')
  },

  hbsComments : function(s) {
    return s.replace(/{{!(.*)}}/gim, '<#-- $1 -->');
  },

  hbsIf : hbsIf,

  hbsExplicitLayout : function(s) {
    var layout, regex = /{{!< (\w+)}}/gim;

    matches = s.match(regex);
    if(matches) {
      s = s.replace(regex, '\n<@layout.$1>');
      layout = matches[0].replace('{{!< ', '').replace('}}', '');
      s += '</@layout.' + layout + '>';
    }

    return s;
  },

  hbsNoEscape : function(s) {
    s = s.replace(/{{{([a-z0-9_\.])}}}/gim, '${$1?html}');
    return s;
  },

  hbsDefault : function(s) {
    //{{#default 'US' country}}{{/default}}
    s = s.replace(/{{\/default}}/gim, '');
    s = s.replace(/{{#default [\'\"]+([\w\d]+)[\"\']+ ([\w\d]+)}}/gim, '${$2!"$1"}');
    return s;
  },

  hbsIncludes : function(s) {
    return s.replace(/{{> (.*)}}/gim, '<#include "/$1.ftl" />');
  },

  hbsBody : function(s) {
    return s.replace(/{{{body}}}/gim, '<#nested>');
  },


  hbsUnless : function(s) {
    // s = s.replace(/{{#unless ([a-z\.\!]+)}}/gim, '<#if !$1??>');
    s = s.replace(/{{#unless ([\w\.]+[^}])}}/gim, '<#if !$1??>');
    s = s.replace(/{{\/unless}}/gim, '</#if>');
    return s;
  },

  hbsContentFor : function(s) {
    s = s.replace(/{{#contentFor [\'|\"](\w+)[\'|\"]}}/gim, '<#global $1>');
    s = s.replace(/{{\/contentFor}}/gim, '</#global>');
    var globals = /<#global \w+>?[^\/#global].*[\s\S\n\r]*?<\/#global>/gim;

    // move to top
    var matches = s.match(globals);

    if(matches) {
      s = s.replace(globals, '');
      s = matches.join("\n") + s;
      s = s.trim();
    }

    return s;
  },

  hbsBlocks : function(s) {
    s = s.replace(/{{{block [\'|\"](\w+)[\'|\"]}}}/gim, '${$1!""}');
    return s;
  }
}