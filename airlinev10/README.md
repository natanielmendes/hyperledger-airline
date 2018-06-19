# org.acme.airline

# Airline v10

https://hyperledger.github.io/composer/reference/acl_language.html

Refer to lecture on Access Control Language


#1 Create the BNA archive
composer archive create  --sourceType dir --sourceName ../

#2.1 Install the archive
composer network install -a ./airlinev10@0.0.1.bna -c PeerAdmin@hlfv1

#2.2 Strart the network
composer network start -n airlinev10 -c PeerAdmin@hlfv1 -V 0.0.1 -A admin -S adminpw

admin>> org.hyperledger.composer.system.NetworkAdmin#admin

#3 DO NOT - Import the card
composer card delete -c admin@airlinev10
composer card import -f admin@airlinev10.card

#4 Add a new participants

- John Doe (johnd) is the Network Administrator
composer participant add -d '{"$class":"org.acme.airline.participant.ACMENetworkAdmin","participantKey":"johnd","contact":{"$class":"org.acme.airline.participant.Contact","fName":"John","lName":"Doe","email":"john.doe@acmeairline.com"}}' -c admin@airlinev10

- Will Smith (wills) works in the Logistics department
composer participant add -d '{"$class":"org.acme.airline.participant.ACMEPersonnel","participantKey":"wills","contact":{"$class":"org.acme.airline.participant.Contact","fName":"Will","lname":"Smith","email":"will.smith@acmeairline.com"}, "department":"Logistics"}' -c admin@airlinev10

#5 Issue the identities
composer identity issue -u johnd -a org.acme.airline.participant.ACMENetworkAdmin#johnd -c admin@airlinev10

composer card delete -c johnd@airlinev10
composer card import -f johnd@airlinev10.card

composer identity issue -u wills -a org.acme.airline.participant.ACMEPersonnel#wills -c admin@airlinev10 

composer card delete -n wills@airlinev10
composer card import -f wills@airlinev10.card

#6 Ping BNA using the johnd & wills cards
    - composer network ping -c johnd@airlinev10
    - composer network ping -c wills@airlinev10

#6 Setup the permissions.acl
    - johnd     Is the Network Administrator for airlinev10
                Should be able to execute network commands

    - wills     Works for the Logistics department
                Should NOT be able to execute any network command

#7 Rebuild the archive
composer archive create  --sourceType dir --sourceName ../

#8 Update the Network
composer network update -a ./airlinev10@0.0.1.bna -c admin@airlinev10


composer-rest-server -c johnd@airlinev10 -n always -w true