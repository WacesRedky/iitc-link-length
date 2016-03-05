// ==UserScript==
// @id             iitc-plugin-link-length@BilBao
// @name           IITC plugin: Link Length
// @version        0.1.1.20151113.000001
// @namespace      https://github.com/jonatkins/ingress-intel-total-conversion
// @include        https://www.ingress.com/intel*
// @include        http://www.ingress.com/intel*
// @match          https://www.ingress.com/intel*
// @match          http://www.ingress.com/intel*
// @include        https://www.ingress.com/mission/*
// @include        http://www.ingress.com/mission/*
// @match          https://www.ingress.com/mission/*
// @match          http://www.ingress.com/mission/*
// @grant          none
// ==/UserScript==


function wrapper(plugin_info) {
// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function() {};

//PLUGIN AUTHORS: writing a plugin outside of the IITC build environment? if so, delete these lines!!
//(leaving them in place might break the 'About IITC' page or break update checks)
plugin_info.buildName = 'jonatkins';
plugin_info.dateTimeVersion = '20151113.000001';
plugin_info.pluginId = 'comm-link-length';
//END PLUGIN AUTHORS NOTE



// PLUGIN START ////////////////////////////////////////////////////////


// use own namespace for plugin
window.plugin.commLinkLength = function() {};

window.plugin.commLinkLength.formatDistance = function(dist) {
  var result = '';
  if (dist >= 10000) {
    result += '<span style="color: red;">';
    result += Math.round(dist/1000)+' km';
    result += '</span>';
  } else if (dist >= 1000) {
    result += '<span style="color: pink;">';
    result += Math.round(dist/100)/10+' km';
    result += '</span>';
  } else {
    result += Math.round(dist)+' m';
  }

  return result;
}

window.plugin.commLinkLength.setup  = function() {
  window.addHook('publicChatDataAvailable', function(data) {
      $.each(data.raw.result, function(i, result) {
          var plext = result[2].plext;
          var guid = result[0];
          if (plext.markup[1][1].plain==' linked ') {
            var lat1 = plext.markup[2][1].latE6/1e6;
            var lng1 = plext.markup[2][1].lngE6/1e6;
            var lat2 = plext.markup[4][1].latE6/1e6;
            var lng2 = plext.markup[4][1].lngE6/1e6;
            var dist = (new L.latLng(lat1,lng1).distanceTo(new L.latLng(lat2,lng2)));
            var $tr = $(chat._public.data[guid][2]);
            $tr.find('td:last').append(' ('+window.plugin.commLinkLength.formatDistance(dist)+')');
            chat._public.data[guid][2] = $tr.prop('outerHTML');
          }
      });
  });
};

var setup =  window.plugin.commLinkLength.setup;

// PLUGIN END //////////////////////////////////////////////////////////


setup.info = plugin_info; //add the script info data to the function as a property
if(!window.bootPlugins) window.bootPlugins = [];
window.bootPlugins.push(setup);
// if IITC has already booted, immediately run the 'setup' function
if(window.iitcLoaded && typeof setup === 'function') setup();
} // wrapper end
// inject code into site context
var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = { version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description };
script.appendChild(document.createTextNode('('+ wrapper +')('+JSON.stringify(info)+');'));
(document.body || document.head || document.documentElement).appendChild(script);


