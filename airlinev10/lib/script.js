'use strict';

/**
 * Create Flight Transaction
 * @param {org.acme.airline.flight.CreateFlight} flightData
 * @transaction
 */
function createFlight(flightData) {

    /**
     * 1. Validate the schedule data
     * If the date is a past date then throw an error
     */
    var timeNow = new Date().getTime();
    var schedTime = new Date(flightData.schedule).getTime();
    if(schedTime < timeNow){
        throw new Error("Scheduled time cannot be in the past!!!");
    }

    // Get the Asset Registry

    return getAssetRegistry('org.acme.airline.flight.Flight')
    
        .then(function(flightRegistry){
            // Now add the Flight - global function getFactory() called
            var  factory = getFactory();

            var  NS =  'org.acme.airline.flight';

            // Solution to exercise - Removed hardcoded value & invoked
            // generate the flight ID
            // 2.1 Set the flightNumber, flightId ... 
            var  flightId = generateFlightId(flightData.flightNumber,flightData.schedule);
            var  flight = factory.newResource(NS,'Flight',flightId);
            flight.flightNumber = flightData.flightNumber;
            flight.aliasFlightNumber = [];

            // Flight asset has an instance of the concept
            // 2.2 Use the factory to create an instance of concept
            var route = factory.newConcept(NS,"Route");

            // 2.3 Set the data in the concept 'route'
            route.origin = flightData.origin;
            route.destination = flightData.destination;
            route.schedule = flightData.schedule;

            // 2.4 Set the route attribute on the asset
            flight.route = route;
            

            // 3 Emit the event FlightCreated
            var event = factory.newEvent(NS, 'FlightCreated');
            event.flightId = flightId;
            emit(event);

            // 4. Add to registry
            return flightRegistry.add(flight);
        });
}

function generateFlightId(flightNum, schedule){
    var dt = new Date(schedule)

    // Date & Month needs to be in the format 01 02 
    // so add a '0' if they are single digits
    var month = dt.getMonth()+1;
    if((month+'').length == 1)  month = '0'+month;
    var dayNum = dt.getDate();
    if((dayNum+'').length == 1)  dayNum = '0'+dayNum;

    return flightNum+'-'+month+'-'+dayNum+'-'+(dt.getFullYear()+'').substring(2,4);
}