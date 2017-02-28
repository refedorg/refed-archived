/* Copyright (C) 2017 Ocupop
 * 
 * http://www.ocupop.com
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see
 * http://www.gnu.org/licenses/agpl-3.0.html.
 */
(function() {

$.behaviors('body', pageState);

// Revert to a previously saved state
window.addEventListener('popstate', function(event) {
  window.console.log("pageState: popstate", window.location);
  var hash = window.location.hash;
  
  if(hash) {
    window.console.log("pageState: popstate", window.location);
    activateTab(window.location.hash);

    return;
  }
});

  function pageState(body) {
    var hash = location.hash;
    window.console.log("pageState: Initialized");
    if (hash) {
      activateTab(hash);
    }

  }

  function updateContent(data) {
    // Set activeTab
    $(data.activeTab).addClass('active').siblings().removeClass('active');

  }

  window.activateTab = function(hash) {
    window.console.log("Activating Tab: ", hash);

    var tabClass = "activeTab_" + hash.replace("#","");
    var data = {
      activeTab: hash
    };

    // Is there a tab button?
    // If so... activate the tab
    // otherwise look for an anchor and scroll to there.

    // Activate Matching Bootstrap Tab
    $('[data-toggle="tab"]').filter('[href$="'+hash+'"]').tab("show");



    // Update URL and push a history state
    $('body').removeClass(function(index, className) {
                return (className.match (/(^|\s)activeTab_\S+/g) || []).join(' ');
              })
             .addClass(tabClass);

    if (typeof hash != 'undefined' && hash != '') {
      if (history && history.pushState) {
        window.history.pushState(data, 'ReFED', window.location.pathname + window.location.search + hash);
      } else {
        scrollV = document.body.scrollTop;
        scrollH = document.body.scrollLeft;
        window.location.hash = hash;
        document.body.scrollTop = scrollV;
        document.body.scrollLeft = scrollH;
      }
    }
  }

})();
