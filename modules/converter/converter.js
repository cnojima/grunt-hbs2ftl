var matches = [],
  scopeDepth = [];


function normalizeNamespace(n) {
  n = n || '';

  if(n) {
    n += '.';
  }

  return n;
}



var helperWhitelist = [
  'tel_anchor', 'staticVersion', 'hbstemplates'
];
function hbsHelpers(s, namespace) {
  var matches, handle, handleRegex, regexTriple,
    regex = /{{#(\w+)?[^}]*}}/gim;

  namespace = namespace || '';
  namespace = normalizeNamespace(namespace);

  matches = s.match(regex);
  if(matches) {
    // extract helper handle
    handle = matches[0].replace('{{#', '');
    handle = handle.substr(0, handle.indexOf(' '));
// console.log(handle);

    if(helperWhitelist.indexOf(handle) > -1) {
console.log(' -------------------- helper match [ ' + handle + ' ]');
      handleRegex = new RegExp('{{/' + handle + '}}', 'gim');
      s = s.replace(/{{#([ a-z0-9_\-\.]+)\s+([^}]+)?}}/gim, '<@helper.$1 $2>');
      s = s.replace(handleRegex, '</@helper.' + handle + '>');
    }
  }

  // handle other syntax
  matches = s.match(/{{{([^}]+)}}}/gim);
  
  if(matches) {
//console.log(matches);
    var re;

    for(var i=0, n=matches.length; i<n; i++) {
      handle = matches[i].replace(/[{}]/gim, '');
      if(handle.indexOf(' ') > -1) {
        if(helperWhitelist.indexOf(handle) > -1) {
          handle = handle.substr(0, handle.indexOf(' '));
  //console.log(handle, re);
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
 **** {{#each}} handlers                                                    ****
 *******************************************************************************/
function hbsEach(s) {
  var matches = s.match(/{{#each ([\w\.]+[^}])}}/gim),
    sOriginal = s,
    lastMatch, raw;

  if(matches) {
    while(matches.length > 0) {
      lastMatch = matches.pop();
      raw = _convertNthEach(s, lastMatch);
      s = s.replace(raw, _convertOneEachBlock(raw));
    }
  }

  return s;
}

/**
 * returns one {{#each}}{{/each}} block, tags inclusive, including any embedded {{#each}}'s
 */
function _convertNthEach(s, each) {
  var ret = '',
    start = s.indexOf(each),
    end = s.indexOf('{{/each}}', start) + 9;

  if(start > -1 && end > start) {
    ret = s.substr(start, end - start);
    // console.log('----');
    // console.log(ret);
    // console.log('----');
  }

  return ret;
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
      scopeNamespace = 'i_' + matches[1];
      newEach = [ '<#list ', namespace, matches[1], ' as ', scopeNamespace, '>' ].join(''); // prefix innerEach
      eachStartDelta = matches[0].length;
      innerEach = s.substr(eachStartIdx + eachStartDelta, (eachEndIdx - eachStartIdx - eachStartDelta));

      // search text inbetween {{#each}} for <#list [var] as ...> and apply current scopeNamespace
      innerEach = _applyNamespace(innerEach, scopeNamespace);

      // handle simple variable assignments
      innerEach = hbsTokens(innerEach, scopeNamespace);

      // handle if clauses with scope
      innerEach = hbsIf(innerEach, scopeNamespace);

      newEach += innerEach;
      newEach += '</#list>';
    }

    s = [ beforeEach, newEach, afterEach ].join('');
// console.log('\n\n\n-------------------------------')
// console.log(s);
  }

  return s;
}

function _applyNamespace(s, namespace) {
  // handle <#list [var] as ns>
  var re = /<#list ([\w]+) as ([\w]+)>/gim;
  s = s.replace(re, '<#list ' + namespace + '.$1 as $2>');

  return s;
}











function hbsEach_v2(s, namespace) {
  namespace = namespace || '';
  namespace = normalizeNamespace(namespace);

  var raw, rawFtl, strPos, match, 
    matches = s.match(/{{#each ([\w\.]+[^}])}}/gim);

  // console.log(matches);

  if(matches) {
    for(var i=0, n=matches.length; i<n; i++) {
      if(s.indexOf(matches[i])) {
// console.log('FULL S\n' + s);
        raw = _extractEachBlock(s, matches[i]);

        if(raw) {
// console.log('RAW\n' + raw);
          rawFtl = _handleEachRecursive(raw, namespace);
          s = s.replace(raw, rawFtl);

          if(s.indexOf('{{#each' > -1)) {
            s = hbsEach(s, namespace);
// console.log(s); process.exit();
          }
        }
      }
    }
  }

  return s;
}

/**
 * returns one {{#each}}{{/each}} block, tags inclusive, including any embedded {{#each}}'s
 */
function _extractEachBlock(s, each) {
  var start = s.indexOf(each),
    eachPostion = start + 1,
    end = firstCloser = s.indexOf('{{/each}}'),
    depth = 0,
    ret = '';



  if(start > -1 && firstCloser > -1) {
    var tmpPos = start;
console.log('----------------------\nlooking for ' + each + '\n---------------\n'+s);
    // find depth by parsing string until final position of each opener is found BEFORE the first closer
    while(eachPostion > -1 && tmpPos > -1 && tmpPos < firstCloser) {
      tmpPos = s.indexOf('{{#each', tmpPos + 1);
      
      if(tmpPos < firstCloser) {
        depth++;
        eachPostion = tmpPos;
      }
    }

    // find position of last matching closer
    while(depth > -1) {
      depth--;

      end = s.indexOf('{{/each}}', end);
      end += 9;
    }

    ret = s.substr(start, end - start);
    // console.log(ret);u
  }

  return ret;
}



function _extractEachBlock_v1(s, each) {
  var start = s.indexOf(each),
    sChunk = s.substr(start),
    nthEachPos = 1,
    depth = 1,
    firstCloser = sChunk.indexOf('{{/each}}'),
    lastCloser = start,
    ret = '';



  if(start > -1) {
// console.log('searching for ' + each);// console.log('in:', sChunk); console.log(start);
    while(
      start > 0 &&
      firstCloser > -1 && 
      nthEachPos > -1 && 
      nthEachPos < firstCloser &&
      depth < 10
    ) {
      nthEachPos = sChunk.indexOf('{{#each', nthEachPos) + 1;
      depth++;
  //console.log(nthEachPos);console.log('depth: ' + depth);console.log(sChunk);
    }

    // find last matching {{/each}}

    while(depth > -1) {
      lastCloser = s.indexOf('{{/each}}', lastCloser) + 9;
      depth--;
    }

    ret = s.substr(start, lastCloser-start);
  }
  return ret;
}

function _handleEachRecursive(s, namespace) {
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
      scopeNamespace = 'i_' + matches[1];
      newEach = [ '<#list ', namespace, matches[1], ' as ', scopeNamespace, '>' ].join(''); // prefix innerEach
      eachStartDelta = matches[0].length;
      innerEach = s.substr(eachStartIdx + eachStartDelta, (eachEndIdx - eachStartIdx - eachStartDelta));

      innerEach = _handleEachRecursive(innerEach, scopeNamespace);

      // handle simple variable assignments
      innerEach = hbsTokens(innerEach, scopeNamespace);

      // handle if clauses with scope
      innerEach = hbsIf(innerEach, scopeNamespace);

      newEach += innerEach;
      newEach += '</#list>';
    }

    s = [ beforeEach, newEach, afterEach ].join('');
// console.log('\n\n\n-------------------------------')
// console.log(s);
  }

  return s;
}






































function hbsEach_v1(s) {
  s = s.replace(/{{#each (.*)}}/gim, '<#list $1 as this>');
  s = s.replace(/{{\/each}}/gim, '</#list>');

  var inList,
    ret = s.substr(0, s.indexOf('<#list')),
    lists = s.match(/<#list \w+>?[^\/#global].*[\s\S\n\r]*?<\/#list>/gim);

  if(lists) {
    for(var i=0, n=lists.length; i<n; i++) {
      inList = lists[i];
    
      // handle simple variable assignments
      inList = hbsTokens(inList, 'this');

      // handle if clauses with scope
      inList = hbsIf(inList, 'this');

      s = s.replace(lists[i], inList);
    }
  }

  return s;
}

function hbsWith(s) {
  s = s.replace(/{{#with (.*)}}/gim, '<#list $1 as this>');
  s = s.replace(/{{\/with}}/gim, '</#list>');

  var inList,
    ret = s.substr(0, s.indexOf('<#list')),
    lists = s.match(/<#list \w+>?[^\/#global].*[\s\S\n\r]*?<\/#list>/gim);

  if(lists) {
    for(var i=0, n=lists.length; i<n; i++) {
      inList = lists[i];
    
      // handle simple variable assignments
      inList = hbsTokens(inList, 'this');

      // handle if clauses with scope
      inList = hbsIf(inList, 'this');

      s = s.replace(lists[i], inList);
    }
  }

  return s;
}

function hbsTokens(s, namespace) {
  namespace = normalizeNamespace(namespace);

  s = s.replace(/{{([ a-z0-9_\-\.]+)}}/gim, '${' + namespace + '$1!""}');

  // dumb sanity
  if(s.indexOf('this.this')) {
    s = s.replace('this.this', 'this');
  }

  return s;
}

function hbsIf(s, namespace) {
  namespace = normalizeNamespace(namespace);

  // s = s.replace(/{{#if ([\w\.]+[^}])}}/gim, '<#if ' + namespace + '$1?? && ' + namespace + '$1>');
  s = s.replace(/{{#if ([\w\.]+[^}])}}/gim, '<#if ' + namespace + '$1??>');
  s = s.replace(/{{else}}/gim, '<#else>');
  s = s.replace(/{{\/if}}/gim, '</#if>');

  return s;
}



module.exports = {
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

  hbsEq : function(s) {
    s = s.replace(/{{#eq ([^} ]+) ([^} ]+)}}/gim, '<#if $1 == $2>');
    s = s.replace(/{{\/eq}}/gim, '</#if>');

    s = s.replace(/{{#ne ([^} ]+) ([^} ]+)}}/gim, '<#if $1 != $2>');
    s = s.replace(/{{\/ne}}/gim, '</#if>');

    s = s.replace(/{{#lt ([^} ]+) ([^} ]+)}}/gim, '<#if $1 < $2>');
    s = s.replace(/{{\/lt}}/gim, '</#if>');

    s = s.replace(/{{#gt ([^} ]+) ([^} ]+)}}/gim, '<#if $1 > $2>');
    s = s.replace(/{{\/gt}}/gim, '</#if>');

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

  hbsEach : hbsEach,

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

  hbsHelpers : hbsHelpers,

  /**
   * 
   */
  hbsTokens : hbsTokens,
  hbsWith : hbsWith,

  hbsBlocks : function(s) {
    s = s.replace(/{{{block [\'|\"](\w+)[\'|\"]}}}/gim, '${$1!""}');
    return s;
  }
}