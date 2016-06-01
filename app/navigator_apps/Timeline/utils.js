export function generateVisEvents(bbCcdaObj) {
  var encounterEvents = bbCcdaObj.data.encounters.filter(function(encounter) {
    encounter.start = encounter.date;
    encounter.group_name = 'Encounters';
    encounter.content = encounter.name;

    if(encounter.date) {
      return encounter;
    };
  });

  var immunizationEvents = bbCcdaObj.data.immunizations.filter(function(immunization) {
    immunization.content = immunization.product.name;
    immunization.start = immunization.date;
    immunization.group_name = 'Immunizations';

    if(immunization.content) {
      return immunization;
    }
  });

  var immunizationDeclinesEvents = bbCcdaObj.data.immunization_declines.filter(function(immunization) {
    immunization.content = immunization.product.name;
    immunization.start = immunization.date;
    immunization.group_name = 'Immunization Declines';

    if(immunization.content) {
      return immunization;
    };
  });

  var medicationEvents = bbCcdaObj.data.medications.filter(function(item) {
    item.content = item.product.name;
    item.start = item.date_range.start;
    // item.end = item.date_range.end; need to deal w/ short ranges of use
    if(item.date_range.end !== item.date_range.start) {
      item.end = item.date_range.end;
    };
    item.group_name = 'Medications';

    if(item.start && item.start != 'Invalid Date') {
      return item;
    };
  });

  var problemEvents = bbCcdaObj.data.problems.map(function(item) {
    item.content = item.name;
    item.start = item.date_range.start;
    item.end = item.date_range.end; // need to revisit and check what total window is otherwise the event is displayed w/ too little width

    item.group_name = 'Problems';
    return item;
  });

  var procedureEvents = bbCcdaObj.data.procedures.filter(function(item) {
    item.content = item.name;
    item.start = item.date;
    item.group_name = 'Procedures';

    if(item.start) {
      return item;
    };
  });

  var allergyEvents = bbCcdaObj.data.allergies.filter(function(item) {
    item.content = item.allergen.name;
    item.start = item.date_range.start;
    item.end = item.date_range.end;
    item.group_name = 'Allergies';

    if(item.start) {
      return item;
    };
  });

  var resultEvents = bbCcdaObj.data.results.filter(function(item) {
    item.content = item.name;
    item.start = item.tests[0].date;
    item.date = item.tests[0].date;
    item.group_name = 'Results';

    if(item.start) {
      return item;
    };
  });

  return encounterEvents
          .concat(medicationEvents)
          .concat(problemEvents)
          .concat(procedureEvents)
          .concat(immunizationEvents)
          .concat(immunizationDeclinesEvents)
          .concat(allergyEvents)
          .concat(resultEvents);
}

export function generateVisGroups(visEvents) {
  let unique = {};
  let distinct = [];

  visEvents.map((event, idx) => {
    if(event.start == null) {
      console.log(event);
    }

    if(event.content == null) {
      console.log(event);
    }


    if( typeof(unique[event.group_name]) == "undefined" && typeof event.group_name !== "undefined"){
      distinct.push({ id: parseInt(idx), content:event.group_name });
    }
    unique[event.group_name] = 0;
  });

  return distinct;
};
