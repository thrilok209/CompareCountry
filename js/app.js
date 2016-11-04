Number.prototype.toReadable = function() {
  return String(this).replace(/(\d)(?=(\d{3})+$)/g, '$1,')
};

(function() {
  CountryComparer = {
    bindCountrySearchForm: function () {
      $('#country-name').keyup(function() {
        var searchTeam = $(this).val().toLowerCase();;
        $('#edit-country-modal .collection-item').each(function(index , ele) {
          ele = $(ele);
          var countryName = ele.text().toLowerCase();
          if(countryName.indexOf(searchTeam)== -1) {
            ele.addClass('hide');
          }else {
            ele.removeClass('hide');
          }

        })

      });
    },
    bindEditCountryTriggerLinks: function () {
      var that =this;
      $('.country .modal-trigger').click(function (ev) {
        ev.preventDefault();
        that.currrentEditingCountryIndex = parseInt(this.dataset.countryIndex);
        $('#edit-country-modal').modal('open');
      });
    },
    bindModalLinks: function () {

      var that = this;
      $('#edit-country-modal .collection-item').click(function(ev) {
        ev.preventDefault();
        var countryCode= this.dataset.countryCode;
        $('#edit-country-modal').modal('close');
        that.renderCountry(countryCode);

      })
    },
    fetchAllCountries: function() {
      var that = this;
      $.ajax({
        url: "https://restcountries.eu/rest/v1/all",
        context: document.body
      }).done(function(data) {

        that.allCountries = data;
        that.populateModalContent();
        that.bindModalLinks();
        that.currrentEditingCountryIndex = 0;
        that.renderCountry('IND');
        that.currrentEditingCountryIndex = 1;
        that.renderCountry('USA')
        that.showMainContent();
      });
    },
    fetchCountryByCode: function (countryCode) {

      var match;
      var allCountries = this.allCountries;
      for(var i = 0; i<allCountries.length;i++){
        var country = allCountries[i];
        if(country.alpha3Code == countryCode){
          match = country;
          break
        }
      }
      return match;
    },
    init: function () {
      this.rendercountries();
      this.fetchAllCountries();
      this.initializeModal();
      this.bindEditCountryTriggerLinks();
      this.bindCountrySearchForm();
    },
    initializeModal: function () {
      $('.modal').modal();
    },
    populateModalContent: function () {


      var links = "";
      this.allCountries.forEach(function(country){

        links += "<a href='#' class='collection-item' data-country-code='" + country.alpha3Code +"'>" + country.alpha3Code + '-' + country.name + "</a>";
      });
      $('#edit-country-modal .collection').html(links);
    },
    renderCountry: function (countryCode) {
      var country=this.fetchCountryByCode(countryCode);
      $('#country-' + this.currrentEditingCountryIndex + ' h2 .code').html(country.alpha3Code);
      $('#country-' + this.currrentEditingCountryIndex + ' p.name').html(country.name);
      $('#country-' + this.currrentEditingCountryIndex + ' .population p').html(country.population.toReadable());
      $('#country-' + this.currrentEditingCountryIndex + ' .Area p').html(country.area.toReadable() + "<span class='units'>Km<sup>2</sup></span>");
      var populationDensity = parseInt(country.population/country.area);
      $('#country-' + this.currrentEditingCountryIndex + ' .population-density p').html(populationDensity + "<span class='units'>people/Km<sup>2</sup></span>");
      $('#country-' + this.currrentEditingCountryIndex + ' .gini p').html(country.gini|| "N/A");
    },
    rendercountries: function () {
      var template = $('#template').html();
        Mustache.parse(template);
        $('#countries').html(Mustache.render(template, {countryIndex: 0}) +Mustache.render(template, {countryIndex: 1}));

    },
    showMainContent: function () {
      $('#loader').addClass('hide');
      $('#content').removeClass('hide')
    }

  };

  $(document).ready(function() {
    CountryComparer.init();
  });

})();
