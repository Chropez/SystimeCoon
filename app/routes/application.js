import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    $.get('projektxml.asp').then((data) => {
      debugger;
    });
  }
});
