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

  return s.replace(re, '<#' + type + ' (' + namespace + '.$1)![] as $2>');
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

function _applyScopingConversion(s, namespace) {
  s = hbsHelpers(s);
  s = _applyNamespace(s, 'macro', namespace);
  s = hbsTokens(s, namespace);
  s = hbsIf(s, namespace);
  s = hbsUnless(s, namespace);
  s = hbsEq(s, namespace);

  return s;
}


/*******************************************************************************
 **** {{#with}} handlers                                                    ****
 *******************************************************************************/
function hbsWith(s) {
  return _nth(s, 'with', _convertOneWithBlock);
}

function _convertOneWithBlock(s) {
  var matches, handle,
    re = /{{#with\ ([\w\.]+)}}/gi;

  while(matches = re.exec(s)) {
    // console.log(matches[0], matches[1]);
    handle = matches[1].replace('.', '_');

    s = s.replace(matches[0], '<#macro with_' + handle + ' ' + handle + ' >');
    s = s.replace(/{{\/with}}/gim, '</#macro><@with_' + handle + ' ' + matches[1] + '/>');
    s = _applyScopingConversion(s, handle);
  }

  return s;
}

function _convertOneWithBlock_v1(s) {
  var handle = s.match(/{{#with\ [\w\.]+}}/im)[0];

  if(handle) {
    handle = handle.substr(8);
    handle = handle.substr(0, handle.length - 2);

    s = s.replace(/{{#with (.*)}}/gim, '<#macro with_$1 $1>');
    s = s.replace(/{{\/with}}/gim, '</#macro><@with_' + handle + ' ' + handle + '/>');
    s = _applyScopingConversion(s, handle);
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
      newEach = [ '<#list (', namespace, matches[1], ')![] as ', scopeNamespace, '>' ].join(''); // prefix innerEach
      eachStartDelta = matches[0].length;
      innerEach = s.substr(eachStartIdx + eachStartDelta, (eachEndIdx - eachStartIdx - eachStartDelta));

      //innerEach = _applyScopingConversion(innerEach, scopeNamespace);

      newEach += innerEach;
      newEach += '</#list>';
    }

    s = [ beforeEach, newEach, afterEach ].join('');
  }

  return s;
}


/**
 * inserts ftl markup for macros
 * @param {String} s HBS template markup
 * @param {String} name Macro identifier
 */
function injectMacroHandle(s, name) {
  // dot-notation breaks FTL parsing
  name = name.replace('.', '_');
  return [
    '<#macro ', name, '>\n',
    s, "\n",
    '</#macro>'
  ].join('')
}




/*******************************************************************************
 **** atomic {{#foo}} handlers                                              ****
 *******************************************************************************/
function _getIfToken(namespace, op) {
  var jsIf = [
    '<#if ',
    '(', namespace, '$1)?? && ', '(', namespace, '$1)?has_content \n',
    '&& \n(',
      // booleans
      '( ', namespace, '$1?is_boolean && ', namespace, '$1 == true ) || \n',
      // integers
      '( ', namespace, '$1?is_number && ', namespace, '$1 != 0 ) || \n',
      // hash
      '( ', namespace, '$1?is_hash) || \n', // ?has_content takes care of this
      // sequences
      '( ', namespace, '$1?is_sequence) || \n', // ?has_content takes care of this
      // strings
      '( ', namespace, '$1?is_string)\n', // ?has_content takes care of this
    ')', // end type + value checks
    '>\n'
  ].join(''),

  invertedIf = [
    '<#if ',
    '(', namespace, '$1)?? && ', '(', namespace, '$1)?has_content \n',
    '&& \n(',
      // booleans
      '( ', namespace, '$1?is_boolean && ', namespace, '$1 != true ) || \n',
      // sequences
      '( ', namespace, '$1?is_sequence ) || \n', // ?has_content takes care of this
      // strings
      '( ', namespace, '$1?is_string )\n', // ?has_content takes care of this
    ')', // end type + value checks
    '>\n'
  ].join(''),

  /**
   * Template for <#if> directives
   */
  comparisons = [
    '<#if ',
    '(', namespace, '$1)?? && (', namespace, '$1)?has_content \n',
    // '&& (\n',
    //   // booleans
    //   '  ( ', namespace, '$1?is_boolean && ', namespace, '$1 ::OPERATOR:: true ) || \n',
    //   // sequences
    //   '  ( ', namespace, '$1?is_sequence && ', namespace, '$1?size ::OPERATOR:: 0 ) || \n',
    //   // strings
    //   '  ( ', namespace, '$1?is_string && ', namespace, '$1 ::OPERATOR:: "" )\n',
    // ')\n ', // end type + value checks
    '&& (', namespace, '$1 ::OPERATOR:: $2 )\n',
    '>\n'
  ].join('');  

  if(op) {
    if(op == 'unless') {
      // {{#unless}}
      return invertedIf;
    } else {
      // {{#[eq|ne|gt|lt|gte|lte]}}
      return comparisons.replace(/::OPERATOR::/gm, op);
    }
  } else {
    // {{#if}}
    return jsIf;
  }
}

/**
 * handlebars {{#if}} only resolves single argument in the JS-truthiness manner
 * @param {String} s HBS template markup
 * @return {String}
 */
function hbsIf(s, namespace) {
  namespace = normalizeNamespace(namespace);

  s = s.replace(/{{#if ([\w\.\?]+[^}])}}/gim, _getIfToken(namespace));
  s = s.replace(/{{else}}/gim, '<#else>');
  s = s.replace(/{{\/if}}/gim, '</#if>');

  return s;
}

/**
 * handlebars {{#unless}} only resolves single argument in an inverted JS-truthiness manner
 * @param {String} s HBS template markup
 * @return {String}
 */
function hbsUnless(s, namespace) {
  namespace = normalizeNamespace(namespace);

  s = s.replace(/{{#unless ([\w\.\?]+[^}])}}/gim, _getIfToken(namespace, 'unless'));
  s = s.replace(/{{\/unless}}/gim, '</#if>');
  return s;
}

function hbsEq(s, namespace) {
  namespace = normalizeNamespace(namespace);

  s = s.replace(/{{#eq ([^} ]+) ([^} ]+)}}/gim, _getIfToken(namespace, '=='));
  s = s.replace(/{{\/eq}}/gim, '</#if>');

  s = s.replace(/{{#ne ([^} ]+) ([^} ]+)}}/gim, _getIfToken(namespace, '!='));
  s = s.replace(/{{\/ne}}/gim, '</#if>');

  s = s.replace(/{{#lte ([^} ]+) ([^} ]+)}}/gim, _getIfToken(namespace, '<='));
  s = s.replace(/{{\/lte}}/gim, '</#if>');

  s = s.replace(/{{#lt ([^} ]+) ([^} ]+)}}/gim, _getIfToken(namespace, '<'));
  s = s.replace(/{{\/lt}}/gim, '</#if>');

  s = s.replace(/{{#gte ([^} ]+) ([^} ]+)}}/gim, _getIfToken(namespace, '&gt;='));
  s = s.replace(/{{\/gte}}/gim, '</#if>');

  s = s.replace(/{{#gt ([^} ]+) ([^} ]+)}}/gim, _getIfToken(namespace, '&gt;'));
  s = s.replace(/{{\/gt}}/gim, '</#if>');

  return s;
}

/**
 * converts HBS comments into FTL comments
 * @param {String} s HBS template markup
 * @return {String}
 */
function hbsComments(s) {
  return s.replace(/{{!(.*)}}/gim, '<#-- $1 -->');
}

/**
 * converts HBS helpers into FTL custom directives 
 * (usually backed by a Java class implementing TemplateModelDirective)
 * @param {String} s HBS template markup
 * @return {String}
 */
function hbsHelpers(s) {
  var matches, handle, handleRegex, regexTriple, re, xx,
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
      handle = matches[i].replace(/[{}]*/gim, '');

      if(handle.indexOf(' ') > -1) {
        xx = handle.split(' ');

        handle = xx[0];

        // if(helperWhitelist.indexOf(handle.trim()) > -1) {
          re = '{{{(' + handle + ')([\\s\\.a-z0-9\\-()]+)}}}';
          regexTriple = new RegExp(re, 'gim');
          s = s.replace(regexTriple, '<@helper.$1$2/>');
// console.log('--'+ handle+ '--');
        // }
      }
    }
  }

  return s;
}

function hbsNoEscape(s, namespace) {
  namespace = normalizeNamespace(namespace);
  s = s.replace(/{{{([a-z0-9_\.]+)}}}/gim, '${' + namespace + '$1!""?html}');
  return s;
}

function hbsTokens(s, namespace) {
  namespace = normalizeNamespace(namespace);

  // donotespace hbs token substitution - confused with hbsHelper syntax - seriously, WTF
  // @hbsNoEscape
  //s = s.replace(/{{{([a-z0-9_\-\.]+)}}}/gim, '${' + namespace + '$1!""}');
  s = hbsNoEscape(s, namespace);

  // standard HBS token substition
  // s = s.replace(/{{([ a-z0-9_\-\.\?]+)}}/gim, '${(' + namespace + '$1?c)!""?string}');
  var token, exToken, matches, tokenRe = /{{([a-z0-9_\-\.\?\s]+)}}/gi;

  while(matches = tokenRe.exec(s)) {
    // console.log(matches[0], matches[1]);
    exToken = matches[1].split('.');

    token = matches[1];
    if(exToken.length > 1) {
      token = exToken.pop();
      // console.log(token.substr(0, 2));
    }

    // hacky workaround bools
    if(token.substr(0, 2) == 'is') {
      s = s.replace(matches[0], '${' + namespace + matches[1] + '?c!""}');
    } else {
      s = s.replace(matches[0], '${' + namespace + matches[1] + '!""}');
    }
  }

  // silly
  s = s.replace('.this!""}', '}');

  // hbs upwards scoping - ftl walks the scope tree up
  s = s.replace(/\.\.\//gim, '');

  // dumb sanity
  if(s.indexOf('this.this')) {
    s = s.replace('this.this', 'this');
  }

  return s;
}

/** 
 * convert hbs' .length to ftl's .size
 */
function hbsSize(s) {
  var regex = /{{([\sa-z0-9\.#{]+)\.length([^}]*)}}/gim;

  s = s.replace(regex, '{{$1?size$2}}');
  return s;
}



/**
 * convert {{#join [a,b,c] }} to 
 */
function hbsJoin(s) {
  var re = /{{#join ([a-z0-9\.]+)}}/gim;

  s = s.replace(re, '${$1?join(",")}');
  s = s.replace('{{/join}}', '');
  return s;
}



module.exports = {
  hbsComments     : hbsComments,
  hbsEach         : hbsEach,
  hbsEq           : hbsEq,
  hbsHelpers      : hbsHelpers,
  hbsIf           : hbsIf,
  hbsJoin         : hbsJoin,
  hbsNoEscape     : hbsNoEscape,
  hbsSize         : hbsSize,
  hbsTokens       : hbsTokens,
  hbsUnless       : hbsUnless,
  hbsWith         : hbsWith,
  injectMacroHandle: injectMacroHandle,



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


  hbsIncludes : function(s) {
    return s.replace(/{{> (.*)}}/gim, '<#include "/$1.ftl" />');
  },

  hbsBody : function(s) {
    return s.replace(/{{{body}}}/gim, '<#nested>');
  },

  hbsDefault : function(s) {
    //{{#default 'US' country}}{{/default}}
    s = s.replace(/{{\/default}}/gim, '');
    s = s.replace(/{{#default [\'\"]+([\w\d]+)[\"\']+ ([\w\d]+)}}/gim, '${$2!"$1"}');
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