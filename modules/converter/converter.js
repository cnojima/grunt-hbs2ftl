var matches = [];




function normalizeNamespace(n) {
  n = n || '';

  if(n) {
    n += '.';
  }

  return n;
}

function hbsEach(s) {
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

  hbsHelpers : function(s) {
    var handle, handleRegex, regex = /{{#(\w+)?[^}]*}}/gim;

    matches = s.match(regex);
    if(matches) {
      // extract helper handle
      handle = matches[0].replace('{{#', '');
      handle = handle.substr(0, handle.indexOf(' '));
// console.log(handle);
      handleRegex = new RegExp('{{/' + handle + '}}', 'gim');

      s = s.replace(/{{#([ a-z0-9_\-\.]+)\s+([^}]+)?}}/gim, '<@helper.$1 $2>');
      s = s.replace(handleRegex, '</@helper.' + handle + '>');
    }

    // handle other syntax
    matches = s.match(/{{{([^}]+)}}}/gim);
    if(matches) {
console.log(matches);
      for(var i=0, n=matches.length; i<n; i++) {
        handle = matches[i].replace(/[{}]/gim, '');
        if(handle.indexOf(' ') > -1) {
          handle = handle.substr(0, handle.indexOf(' '));
        }
console.log(handle);
      }
    }

    return s;
  },

  /**
   * 
   */
  hbsTokens : hbsTokens,

  hbsBlocks : function(s) {
    s = s.replace(/{{{block [\'|\"](\w+)[\'|\"]}}}/gim, '${$1!""}');
    return s;
  }
}