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


Google API key: AIzaSyDwNUfXSzS2DIWfUsYhhbIM22xUtNJ4DtM

 */
(function() {

$.behaviors('.innovatorDatabase_filters', innovatorDatabase_filters);
$.behaviors('.filterToggle', initToggle);
$.behaviors('.innovatorDatabase_menu', initMenu);

  var targetSelector = '.innovator';
  var activeHash = '';

  function initMenu(menu) {
    menu = $(menu);
    // window.console.log('initMenu: Loaded menu');

    // if no hash exists here then activate the first tab
    if(!location.hash) {
      $(('[data-toggle="tab"]:first')).tab('show');
    }
    
    $('.searchLink').on('click', function() {
      $('.innovatorDatabase_categories, .innovatorDatabase_filters').removeClass('active');
      $('.innovatorDatabase_search').addClass('active');
    });
  }

  function initToggle(container) {
    container = $(container);
    container.on('click', function() {
      $('.innovatorDatabase_filters').toggleClass('open');
    });
  }

  function innovatorDatabase_filters(filters) {
    filters = $(filters);
    var list = $('.innovatorDatabase_list').first();

    window.mixer = mixitup(list, {
      multifilter: {
        enable: true,
        minSearchLength: 2
      },
      load: {
        sort: 'random'
      },
      selectors: {
        target: '.innovator',
        control: '[data-mixitup-control], .mixitup-control'
      },
      pagination: {
        limit: 10,
        // maintainActivePage: false,
        // loop: true,
        hidePageListIfSinglePage: true
      },
      callbacks: {
          onMixEnd: setFilters // Call the setFilters() method at the end of each operation
      }
    });

    var hashState = deserializeHash();

    if (hashState && hashState.filters) {
        // If a valid groupsState object is present on page load, filter the mixer
        filterMixerByHashState(hashState.filters);
    }

    input = $('#searchFilter');

    input.on('keyup', function() {
      var val = $(this).val();
      if(val.length >= 2) {
        searchFilter(val, mixer);
      } else {
        searchFilter('', mixer);
      }

    });

  }


  /**
   * Deserializes a hash segment (if present) into in an object.
   *
   * @return {object|null}
   */

   // function deserializeSearch() {
   //     // var hash    = window.location.hash.replace(/^#/g, '');
   //     var search  = window.location.search.replace(/^\?/g, '');
   //     var obj     = null;
   //     var groups  = [];

   //     if (!search) return obj;

   //     obj = {};
   //     groups = search.split('&');

   //     groups.forEach(function(group) {
   //         var pair = group.split('=');
   //         var groupName = pair[0];

   //         obj[groupName] = pair[1].split(',');
   //     });

   //     return obj;
   // }

  /**
   * Serializes a groupsState object into a string.
   *
   * @param   {object}    groupsState
   * @return  {string}
   */

  function serializeFiltersState(filters) {
      var output = '';

      for (var key in filters) {
          var values = filters[key];

          if (!values.length) continue;

          output += key + '=';
          output += values.join(',');
          output += '&';
      };

      output = output.replace(/&$/g, '');

      return output;
  }

  /**
   * Constructs a `groupsState` hash object using the
   * `getFilterGroupSelectors()` API method.
   *
   * @return {object}
   */

  function getFilters() {
      // NB: You will need to rename the object keys to match the names of
      // your project's filter groups – these should match those defined
      // in your HTML.

      var filters = {
        business_model: mixer.getFilterGroupSelectors('business_model').map(getValueFromSelector),
        innovator_category: mixer.getFilterGroupSelectors('innovator_category').map(getValueFromSelector),
        hierarchy: mixer.getFilterGroupSelectors('hierarchy').map(getValueFromSelector)
      };

      return filters;
  }

  /**
   * Updates the URL search whenever the current filter changes.
   *
   * @param   {mixitup.State} state
   * @return  {void}
   */

  function setFilters(state) {
    var selector = state.activeFilter.selector;

    // Construct an object representing the current state of each
    // filter group

    var filters = getFilters();

    // Create a URL search string by serializing the filters object

    var newSearch = '#' + serializeFiltersState(filters);

    if (selector === targetSelector && window.location.search) {
        // Equivalent to filter "all", remove the search

        activeSearch = '';

        history.replaceState(null, document.title, window.location.pathname); // or `history.replaceState()`
    } else if (newSearch !== window.location.search && selector !== targetSelector) {
        // Change the search

        activeSearch = newSearch;

        history.replaceState(null, document.title, window.location.pathname + newSearch); // or `history.replaceState()`
    }
  }

  /**
   * Filters the mixer and updates the multifilter UI using a provided
   * filters object.
   *
   * @param  {object|null}    filters
   * @param  {boolean}        [animate]
   * @return {Promise}
   */

  function filterMixerByHashState(filters, animate) {

      var business_model = (filters && filters.business_model) ? filters.business_model : [];
      var innovator_category = (filters && filters.innovator_category) ? filters.innovator_category : [];
      var hierarchy = (filters && filters.hierarchy) ? filters.hierarchy : [];

      mixer.setFilterGroupSelectors('business_model', business_model.map(getSelectorFromValue));
      mixer.setFilterGroupSelectors('innovator_category', innovator_category.map(getSelectorFromValue));
      mixer.setFilterGroupSelectors('hierarchy', hierarchy.map(getSelectorFromValue));

      // Parse the filter groups (passing `false` will perform no animation)

      return mixer.parseFilterGroups(animate ? true : false);
  }

  /**
   * Converts a selector (e.g. '.green') into a simple value (e.g. 'green').
   *
   * @param   {string} selector
   * @return  {string}
   */

  function getValueFromSelector(selector) {
      return selector.replace(/^./, '');
  }

  /**
   * Converts a simple value (e.g. 'green') into a selector (e.g. '.green').
   *
   * @param   {string} selector
   * @return  {string}
   */

  function getSelectorFromValue(value) {
      return '.' + value;
  }


  // Add an "onhashchange" handler to keep the mixer in sync as the user goes
  // back and forward through their history.

  // TB: This may or may not be the desired behavior for your project. If you don't
  // want MixItUp operations to count as individual history items, simply use
  // `history.replaceState()` instead of `history.pushState()` within the `setFilters()`
  // function above. In which case this handler would no longer be neccessary.


  // window.onhashchange = function(e) {
  //   window.console.log("HASH CHANGE: update activeFilters", e);
  //   // window.console.log("HASH CHANGE: current_url", window.location);
  //   // location.reload();
  //     // var groupsState = deserializeSearch();
  //     // var search      = window.location.search;

  //     // // Compare new hash with active hash

  //     // if (search === activeSearch) return; // no change

  //     // activeSearch = search;

  //     // filterMixerByHashState(groupsState, true);
  // };

  function searchFilter(input, mixer) {
    var state = mixer.getState();

    var filtered = state.targets.filter(function(el, index){
      return $(el).data('title').toLowerCase().indexOf( input.toLowerCase().trim() ) >= 0;
    });

    mixer.filter(filtered);
  }

})();


